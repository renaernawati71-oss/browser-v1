const os = require('os');
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

class ResourceManager {
  constructor() {
    this.browserProcesses = new Map();
    this.resourceHistory = [];
    this.maxHistorySize = 100;
  }

  async getSystemStats() {
    try {
      const stats = {
        platform: os.platform(),
        arch: os.arch(),
        cpu: {
          usage: await this.getCPUUsage(),
          cores: os.cpus().length,
          model: os.cpus()[0].model,
        },
        memory: {
          total: os.totalmem(),
          free: os.freemem(),
          used: os.totalmem() - os.freemem(),
          usagePercent: ((os.totalmem() - os.freemem()) / os.totalmem()) * 100,
        },
        system: {
          uptime: os.uptime(),
          loadAverage: os.loadavg(),
        },
      };

      // Add to history
      this.addToHistory(stats);

      return stats;
    } catch (error) {
      console.error('Failed to get system stats:', error);
      return null;
    }
  }

  async getCPUUsage() {
    try {
      const startMeasure = this.cpuAverage();
      
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const endMeasure = this.cpuAverage();
      
      const idleDifference = endMeasure.idle - startMeasure.idle;
      const totalDifference = endMeasure.total - startMeasure.total;
      
      const percentageCPU = 100 - ~~(100 * idleDifference / totalDifference);
      
      return percentageCPU;
    } catch (error) {
      console.error('Failed to get CPU usage:', error);
      return 0;
    }
  }

  cpuAverage() {
    const cpus = os.cpus();
    let totalIdle = 0;
    let totalTick = 0;

    for (const cpu of cpus) {
      for (const type in cpu.times) {
        totalTick += cpu.times[type];
      }
      totalIdle += cpu.times.idle;
    }

    return {
      idle: totalIdle / cpus.length,
      total: totalTick / cpus.length,
    };
  }

  async getBrowserStats() {
    try {
      const browserStats = [];

      for (const [pid, data] of this.browserProcesses) {
        try {
          const stats = await this.getProcessStats(pid);
          browserStats.push({
            pid,
            profileId: data.profileId,
            ...stats,
          });
        } catch (error) {
          console.error(`Failed to get stats for process ${pid}:`, error);
        }
      }

      return {
        browsers: browserStats,
        totalMemory: browserStats.reduce((sum, b) => sum + (b.memory || 0), 0),
        totalCPU: browserStats.reduce((sum, b) => sum + (b.cpu || 0), 0),
        count: browserStats.length,
      };
    } catch (error) {
      console.error('Failed to get browser stats:', error);
      return null;
    }
  }

  async getProcessStats(pid) {
    try {
      if (process.platform === 'linux' || process.platform === 'darwin') {
        const { stdout } = await execPromise(`ps -p ${pid} -o %cpu,rss,etime --no-headers`);
        const parts = stdout.trim().split(/\s+/);
        
        return {
          cpu: parseFloat(parts[0]),
          memory: parseInt(parts[1]) * 1024, // Convert KB to bytes
          runtime: parts[2],
        };
      } else if (process.platform === 'win32') {
        const { stdout } = await execPromise(`tasklist /FI "PID eq ${pid}" /FO CSV`);
        const lines = stdout.trim().split('\n');
        if (lines.length > 1) {
          const parts = lines[1].split(',');
          return {
            memory: parseInt(parts[4].replace(/,/g, '').replace('"', '').replace(' K', '')) * 1024,
            cpu: 0, // tasklist doesn't provide CPU usage
          };
        }
      }
      
      return { cpu: 0, memory: 0 };
    } catch (error) {
      return { cpu: 0, memory: 0 };
    }
  }

  registerBrowserProcess(pid, profileId) {
    this.browserProcesses.set(pid, {
      profileId,
      registeredAt: Date.now(),
    });
  }

  unregisterBrowserProcess(pid) {
    this.browserProcesses.delete(pid);
  }

  addToHistory(stats) {
    this.resourceHistory.push({
      ...stats,
      timestamp: Date.now(),
    });

    if (this.resourceHistory.length > this.maxHistorySize) {
      this.resourceHistory.shift();
    }
  }

  getHistory(minutes = 5) {
    const cutoff = Date.now() - (minutes * 60 * 1000);
    return this.resourceHistory.filter(entry => entry.timestamp >= cutoff);
  }

  async getSystemHealth() {
    try {
      const stats = await this.getSystemStats();
      
      const health = {
        overall: 'healthy',
        issues: [],
        recommendations: [],
      };

      // Check CPU usage
      if (stats.cpu.usage > 90) {
        health.overall = 'critical';
        health.issues.push('High CPU usage');
        health.recommendations.push('Reduce concurrent browsers or upgrade hardware');
      } else if (stats.cpu.usage > 70) {
        health.overall = 'warning';
        health.issues.push('Moderate CPU usage');
        health.recommendations.push('Monitor system performance');
      }

      // Check memory usage
      if (stats.memory.usagePercent > 90) {
        health.overall = 'critical';
        health.issues.push('High memory usage');
        health.recommendations.push('Close unused applications or add more RAM');
      } else if (stats.memory.usagePercent > 75) {
        health.overall = 'warning';
        health.issues.push('Moderate memory usage');
        health.recommendations.push('Monitor memory usage');
      }

      // Check load average (Unix systems)
      if (stats.system.loadAverage) {
        const loadAvg = stats.system.loadAverage[0];
        const cores = stats.cpu.cores;
        
        if (loadAvg > cores * 2) {
          health.overall = 'critical';
          health.issues.push('High load average');
          health.recommendations.push('Reduce system workload');
        } else if (loadAvg > cores) {
          health.overall = 'warning';
          health.issues.push('Moderate load average');
        }
      }

      return health;
    } catch (error) {
      console.error('Failed to get system health:', error);
      return { overall: 'unknown', issues: [], recommendations: [] };
    }
  }

  async checkResourceAvailability() {
    const stats = await this.getSystemStats();
    
    return {
      canLaunchNewBrowser: stats.cpu.usage < 80 && stats.memory.usagePercent < 85,
      cpuAvailable: stats.cpu.usage < 80,
      memoryAvailable: stats.memory.usagePercent < 85,
      recommendedConcurrentBrowsers: this.calculateRecommendedConcurrency(stats),
    };
  }

  calculateRecommendedConcurrency(stats) {
    const cpuFactor = Math.max(1, Math.floor(stats.cpu.cores * (100 - stats.cpu.usage) / 100));
    const memoryFactor = Math.max(1, Math.floor(stats.memory.free / (500 * 1024 * 1024))); // 500MB per browser
    
    return Math.min(cpuFactor, memoryFactor, 50);
  }
}

module.exports = ResourceManager;

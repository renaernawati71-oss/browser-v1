const crypto = require('crypto');
const http = require('http');
const https = require('https');
const { SocksProxyAgent } = require('socks-proxy-agent');

class ProxyManager {
  constructor(database) {
    this.database = database;
  }

  async createProxy(proxyData) {
    const proxyId = crypto.randomUUID();

    const proxy = {
      id: proxyId,
      type: proxyData.type || 'http',
      host: proxyData.host,
      port: proxyData.port,
      username: proxyData.username || null,
      password: proxyData.password || null,
      country: proxyData.country || null,
      city: proxyData.city || null,
      is_active: true,
    };

    try {
      this.database.queries.proxy.insert.run(
        proxy.id,
        proxy.type,
        proxy.host,
        proxy.port,
        proxy.username,
        proxy.password,
        proxy.country,
        proxy.city
      );

      this.logProxyAction(proxyId, 'create', 'Proxy created successfully');

      return { success: true, proxy: await this.getProxyById(proxyId) };
    } catch (error) {
      console.error('Failed to create proxy:', error);
      return { success: false, error: error.message };
    }
  }

  async updateProxy(proxyId, proxyData) {
    try {
      const existingProxy = await this.getProxyById(proxyId);
      if (!existingProxy) {
        return { success: false, error: 'Proxy not found' };
      }

      this.database.queries.proxy.update.run(
        proxyData.type || existingProxy.type,
        proxyData.host || existingProxy.host,
        proxyData.port || existingProxy.port,
        proxyData.username !== undefined ? proxyData.username : existingProxy.username,
        proxyData.password !== undefined ? proxyData.password : existingProxy.password,
        proxyData.country !== undefined ? proxyData.country : existingProxy.country,
        proxyData.city !== undefined ? proxyData.city : existingProxy.city,
        proxyData.is_active !== undefined ? proxyData.is_active : existingProxy.is_active,
        proxyId
      );

      this.logProxyAction(proxyId, 'update', 'Proxy updated successfully');

      return { success: true, proxy: await this.getProxyById(proxyId) };
    } catch (error) {
      console.error('Failed to update proxy:', error);
      return { success: false, error: error.message };
    }
  }

  async deleteProxy(proxyId) {
    try {
      const proxy = await this.getProxyById(proxyId);
      if (!proxy) {
        return { success: false, error: 'Proxy not found' };
      }

      // Check if proxy is in use by any profile
      // TODO: Implement check

      this.database.db.prepare('DELETE FROM proxies WHERE id = ?').run(proxyId);

      this.logProxyAction(proxyId, 'delete', 'Proxy deleted successfully');

      return { success: true };
    } catch (error) {
      console.error('Failed to delete proxy:', error);
      return { success: false, error: error.message };
    }
  }

  async getProxyById(proxyId) {
    try {
      const proxy = this.database.db.prepare('SELECT * FROM proxies WHERE id = ?').get(proxyId);
      return proxy;
    } catch (error) {
      console.error('Failed to get proxy:', error);
      return null;
    }
  }

  async getAllProxies() {
    try {
      const proxies = this.database.queries.proxy.getAll.all();
      return proxies;
    } catch (error) {
      console.error('Failed to get proxies:', error);
      return [];
    }
  }

  async testProxy(proxyData) {
    const startTime = Date.now();
    const testUrl = 'https://httpbin.org/ip';
    const timeout = 10000; // 10 seconds

    try {
      const proxyConfig = this.buildProxyConfig(proxyData);
      const response = await this.makeRequest(testUrl, proxyConfig, timeout);
      const latency = Date.now() - startTime;

      const result = {
        success: true,
        latency: latency,
        ip: response.ip || null,
        origin: response.origin || null,
        timestamp: new Date().toISOString(),
      };

      // Update proxy test results if proxy exists
      if (proxyData.id) {
        await this.updateProxyTestResults(proxyData.id, {
          last_tested: new Date().toISOString(),
          test_result: 'success',
          latency: latency,
        });
      }

      return result;
    } catch (error) {
      const latency = Date.now() - startTime;

      const result = {
        success: false,
        latency: latency,
        error: error.message,
        timestamp: new Date().toISOString(),
      };

      // Update proxy test results if proxy exists
      if (proxyData.id) {
        await this.updateProxyTestResults(proxyData.id, {
          last_tested: new Date().toISOString(),
          test_result: 'failed',
          latency: latency,
        });
      }

      return result;
    }
  }

  buildProxyConfig(proxyData) {
    const auth = proxyData.username && proxyData.password
      ? `${proxyData.username}:${proxyData.password}@`
      : '';

    return {
      host: proxyData.host,
      port: proxyData.port,
      protocol: proxyData.type,
      auth: auth,
    };
  }

  async makeRequest(url, proxyConfig, timeout) {
    return new Promise((resolve, reject) => {
      const options = {
        method: 'GET',
        timeout: timeout,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
      };

      let agent;
      if (proxyConfig.protocol === 'socks5') {
        agent = new SocksProxyAgent(
          `socks5://${proxyConfig.auth}${proxyConfig.host}:${proxyConfig.port}`
        );
      } else {
        options.proxy = {
          host: proxyConfig.host,
          port: proxyConfig.port,
          protocol: proxyConfig.protocol,
          auth: proxyConfig.auth ? proxyConfig.auth.split('@')[0] : undefined,
        };
      }

      if (agent) {
        options.agent = agent;
      }

      const request = https.request(url, options, (response) => {
        let data = '';
        response.on('data', chunk => data += chunk);
        response.on('end', () => {
          try {
            const jsonData = JSON.parse(data);
            resolve(jsonData);
          } catch (error) {
            reject(new Error('Failed to parse response'));
          }
        });
      });

      request.on('error', reject);
      request.on('timeout', () => {
        request.destroy();
        reject(new Error('Request timeout'));
      });

      request.end();
    });
  }

  async updateProxyTestResults(proxyId, testResults) {
    try {
      this.database.db.prepare(`
        UPDATE proxies
        SET last_tested = ?, test_result = ?, latency = ?
        WHERE id = ?
      `).run(
        testResults.last_tested,
        testResults.test_result,
        testResults.latency,
        proxyId
      );
    } catch (error) {
      console.error('Failed to update proxy test results:', error);
    }
  }

  async batchTestProxies(proxyIds) {
    const results = [];
    
    for (const proxyId of proxyIds) {
      const proxy = await this.getProxyById(proxyId);
      if (proxy) {
        const result = await this.testProxy(proxy);
        results.push({
          proxyId,
          ...result,
        });
      }
    }

    return results;
  }

  logProxyAction(proxyId, action, message) {
    const logId = crypto.randomUUID();
    this.database.queries.log.insert.run(
      logId,
      'info',
      'proxy_manager',
      `${action.toUpperCase()}: ${message}`,
      JSON.stringify({ proxyId, action })
    );
  }
}

module.exports = ProxyManager;

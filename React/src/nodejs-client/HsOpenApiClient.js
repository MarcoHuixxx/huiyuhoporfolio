/**
 * 华盛开放平台 API 客户端 - Node.js 版本
 *
 * 功能：
 * 1. 3DES 加密/解密
 * 2. MD5 签名
 * 3. HTTP 请求封装
 *
 * Node.js 版本：v20.20.1
 */

import crypto from 'node:crypto';

// 配置
const CONFIG = {
  baseUrl: 'http://mp-opendaily.hstong.com', // 或者您的测试环境地址
  clientKey: '50000',
  appSecret: 'zf7HxnNBg2o8fnCf611',
  timeout: 30000, // 请求超时时间（毫秒）
};

/**
 * 3DES 加密工具类
 */
class ThreeDesUtil {
  /**
   * 3DES + Base64 加密
   * @param {string} key 密钥
   * @param {string} plainStr 明文
   * @returns {string} Base64 编码的密文
   */
  static encode(key, plainStr) {
    try {
      // 1. 对 key 进行 MD5，获取16进制字符串（32字符）
      const md5Hex = crypto.createHash('md5').update(key).digest('hex');
      
      // 2. 将16进制字符串转换为字节，取前24字节作为密钥
      const desKey = Buffer.from(md5Hex, 'utf8').slice(0, 24);

      // 3. 使用 3DES/ECB/PKCS5Padding 加密
      const cipher = crypto.createCipheriv('des-ede3', desKey, null);
      cipher.setAutoPadding(true);

      let encrypted = cipher.update(plainStr, 'utf8', 'binary');
      encrypted += cipher.final('binary');

      // 4. Base64 编码
      const encryptedBuffer = Buffer.from(encrypted, 'binary');
      return encryptedBuffer.toString('base64');
    } catch (error) {
      throw new Error(`3DES encryption failed: ${error.message}`);
    }
  }

  /**
   * 3DES + Base64 解密
   * @param {string} key 密钥
   * @param {string} destStr Base64 编码的密文
   * @returns {string} 明文
   */
  static decode(key, destStr) {
    try {
      // 1. 对 key 进行 MD5，获取16进制字符串（32字符）
      const md5Hex = crypto.createHash('md5').update(key).digest('hex');
      
      // 2. 将16进制字符串转换为字节，取前24字节作为密钥
      const desKey = Buffer.from(md5Hex, 'utf8').slice(0, 24);

      // 3. Base64 解码
      const encryptedBuffer = Buffer.from(destStr, 'base64');

      // 4. 使用 3DES/ECB/PKCS5Padding 解密
      const decipher = crypto.createDecipheriv('des-ede3', desKey, null);
      decipher.setAutoPadding(true);

      let decrypted = decipher.update(encryptedBuffer, null, 'binary');
      decrypted += decipher.final('binary');

      return Buffer.from(decrypted, 'binary').toString('utf8');
    } catch (error) {
      throw new Error(`3DES decryption failed: ${error.message}`);
    }
  }
}

/**
 * API 客户端类
 */
class HsOpenApiClient {
  constructor(config = CONFIG) {
    this.baseUrl = config.baseUrl;
    this.clientKey = config.clientKey;
    this.appSecret = config.appSecret;
    this.timeout = config.timeout;
  }

  /**
   * 生成签名
   * @param {Object} params 请求参数
   * @returns {string} MD5 签名
   */
  generateSign(params) {
    // 1. 按字母顺序排序参数
    const sortedKeys = Object.keys(params).sort();

    // 2. 拼接字符串：client_key + clientKey + key1 + value1 + ... + client_secret + appSecret
    let signStr = `client_key${this.clientKey}`;

    for (const key of sortedKeys) {
      // 跳过 client_key 和 sign 字段
      if (key === 'client_key' || key === 'sign') {
        continue;
      }
      const value = params[key]?.toString() ?? '';
      signStr += key + value;
    }

    signStr += `client_secret${this.appSecret}`;

    // 3. MD5 加密
    return crypto.createHash('md5').update(signStr).digest('hex');
  }

  /**
   * 构建请求参数（添加签名等公共参数）
   * @param {Object} params 业务参数
   * @returns {Object} 完整的请求参数
   */
  buildParams(params) {
    const signTime = Math.floor(Date.now() / 1000); // 秒级时间戳

    const fullParams = {
      ...params,
      client_key: this.clientKey,
      sign_time: signTime.toString(),
    };

    // 生成签名
    fullParams.sign = this.generateSign(fullParams);

    return fullParams;
  }

  /**
   * 发送 POST 请求
   * @param {string} uri API 路径
   * @param {Object} params 请求参数
   * @returns {Promise<Object>} 响应结果
   */
  async post(uri, params) {
    const fullParams = this.buildParams(params);
    const url = `${this.baseUrl}${uri}`;
    const timeout = this.timeout;

    console.log(`\n========== Request ==========`);
    console.log(`URL: ${url}`);
    console.log(`Params:`, JSON.stringify(fullParams, null, 2));
    console.log(`=============================\n`);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const formData = new URLSearchParams();
      for (const [key, value] of Object.entries(fullParams)) {
        formData.append(key, value.toString());
      }

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': 'Node.js HsOpenApiClient/1.0',
        },
        body: formData,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const responseText = await response.text();
      console.log(`\n========== Response =========`);
      console.log(`Status: ${response.status}`);
      console.log(`Body:`, responseText);
      console.log(`=============================\n`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}, body: ${responseText}`);
      }

      try {
        return JSON.parse(responseText);
      } catch {
        return { raw: responseText };
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        throw new Error(`Request timeout after ${timeout}ms`);
      }
      throw error;
    }
  }

  /**
   * 检查用户手机号码是否已存在
   * @param {string} mobile 手机号码（明文）
   * @returns {Promise<Object>} 响应结果
   */
  async checkMobileExists(mobile) {
    const mobileEncrypted = ThreeDesUtil.encode(this.appSecret, mobile);
    console.log(`Mobile encryption: ${mobile} -> ${mobileEncrypted}`);

    const params = {
      mobile: mobileEncrypted,
    };

    const response = await this.post('/user/mobile/check', params);

    const isSuccess = response.result === 1;
    return {
      success: isSuccess,
      data: response.result ?? response.data,
      error: response.error,
      raw: response,
    };
  }
}

async function main() {
  const client = new HsOpenApiClient({
    baseUrl: 'http://mp-opendaily.hstong.com',
    clientKey: '50000',
    appSecret: 'zf7HxnNBg2o8fnCf611',
  });

  try {
    console.log('\n### 示例1：检查手机号是否存在 ###');
    const result = await client.checkMobileExists('13800138000');
    console.log('Result:', JSON.stringify(result, null, 2));

    console.log('\n### 示例2：批量检查手机号 ###');
    const mobiles = ['13800138000', '13800138001', '13800138002'];
    const results = [];

    for (const mobile of mobiles) {
      try {
        const r = await client.checkMobileExists(mobile);
        results.push({ mobile, exists: r.data === 1 });
        console.log(`${mobile}: ${r.data === 1 ? '已存在' : '不存在'}`);
      } catch (error) {
        results.push({ mobile, error: error.message });
        console.error(`${mobile}: 查询失败 - ${error.message}`);
      }
    }

    console.log('\n批量查询结果:', JSON.stringify(results, null, 2));

  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

const modulePath = new URL(import.meta.url).pathname;
if (process.argv[1] === modulePath) {
  main().catch(console.error);
}

export {
  HsOpenApiClient,
  ThreeDesUtil,
  CONFIG,
};

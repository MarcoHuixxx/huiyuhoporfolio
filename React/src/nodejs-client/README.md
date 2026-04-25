# 华盛开放平台 API Node.js 客户端

基于 Node.js v20.20.1 开发的华盛开放平台 API 客户端，支持 3DES 加密和 MD5 签名。

## 功能特性

✅ **3DES 加密/解密** - 与 Java 端完全兼容的 3DES 实现  
✅ **MD5 签名** - 自动生成请求签名  
✅ **HTTP 请求封装** - 基于 Fetch API（Node.js 18+ 内置）  
✅ **完整日志** - 请求/响应详细日志输出  
✅ **TypeScript 支持** - 提供完整的类型定义  
✅ **零外部依赖** - 仅使用 Node.js 内置模块  

## 快速开始

### 1. 安装

```bash
# 克隆或下载 HsOpenApiClient.js 到您的项目
cp HsOpenApiClient.js your-project/
```

### 2. 基本使用

```javascript
const { HsOpenApiClient, ThreeDesUtil } = require('./HsOpenApiClient.js');

// 创建客户端实例
const client = new HsOpenApiClient({
  baseUrl: 'http://mp-opendaily.hstong.com',
  clientKey: '50000',
  appSecret: 'zf7HxnNBg2o8fnCf611',
});

// 检查手机号是否存在
async function checkMobile() {
  const result = await client.checkMobileExists('13800138000');
  console.log('手机号存在:', result.data === 1);
}
```

### 3. 运行示例

```bash
# 直接运行文件（包含示例代码）
node HsOpenApiClient.js
```

## 配置说明

### 客户端配置

```javascript
const client = new HsOpenApiClient({
  baseUrl: 'http://mp-opendaily.hstong.com',  // API 基础地址
  clientKey: '50000',                          // 客户端标识
  appSecret: 'zf7HxnNBg2o8fnCf611',           // 客户端密钥
  timeout: 30000,                              // 请求超时（毫秒）
});
```

### 环境变量配置（推荐）

创建 `.env` 文件：

```bash
HS_API_BASE_URL=http://mp-opendaily.hstong.com
HS_CLIENT_KEY=50000
HS_APP_SECRET=zf7HxnNBg2o8fnCf611
```

使用：

```javascript
const client = new HsOpenApiClient({
  baseUrl: process.env.HS_API_BASE_URL,
  clientKey: process.env.HS_CLIENT_KEY,
  appSecret: process.env.HS_APP_SECRET,
});
```

## API 方法

### checkMobileExists(mobile)

检查用户手机号码是否已存在。

**参数：**
- `mobile` (string): 手机号码（明文）

**返回值：**
```javascript
{
  success: boolean,  // 请求是否成功
  data: number,      // 1=已存在, 0=不存在
  error: object,     // 错误信息（如果失败）
  raw: object        // 原始响应
}
```

**示例：**

```javascript
const result = await client.checkMobileExists('13800138000');

if (result.success) {
  if (result.data === 1) {
    console.log('手机号已存在');
  } else {
    console.log('手机号不存在');
  }
} else {
  console.error('查询失败:', result.error);
}
```

## 工具类

### ThreeDesUtil

3DES 加密/解密工具类。

```javascript
// 加密
const encrypted = ThreeDesUtil.encode('secret_key', 'plain_text');
console.log(encrypted); // Base64 编码的密文

// 解密
const decrypted = ThreeDesUtil.decode('secret_key', encrypted);
console.log(decrypted); // 明文
```

## 签名算法

签名生成逻辑：

1. 按字母顺序排序参数
2. 拼接字符串：`client_key` + clientKey + key1 + value1 + key2 + value2 + ... + `client_secret` + appSecret
3. MD5 加密拼接后的字符串

**示例：**

```javascript
// 请求参数
{
  mobile: "encrypted_mobile",
  client_key: "50000",
  sign_time: "1714521600"
}

// 签名字符串
"client_key50000mobileencrypted_mobsign_time1714521600client_secretzf7HxnNBg2o8fnCf611"

// MD5 后的签名
"abc123..."
```

## 完整示例

### 示例 1：检查单个手机号

```javascript
const { HsOpenApiClient } = require('./HsOpenApiClient.js');

const client = new HsOpenApiClient({
  baseUrl: 'http://mp-opendaily.hstong.com',
  clientKey: '50000',
  appSecret: 'zf7HxnNBg2o8fnCf611',
});

async function main() {
  try {
    const result = await client.checkMobileExists('13800138000');
    
    if (result.success) {
      console.log(result.data === 1 ? '已存在' : '不存在');
    } else {
      console.error('请求失败:', result.error);
    }
  } catch (error) {
    console.error('发生错误:', error.message);
  }
}

main();
```

### 示例 2：批量检查手机号

```javascript
async function batchCheck() {
  const mobiles = ['13800138000', '13800138001', '13800138002'];
  const results = [];
  
  for (const mobile of mobiles) {
    try {
      const result = await client.checkMobileExists(mobile);
      results.push({
        mobile,
        exists: result.data === 1,
        success: result.success
      });
      
      // 避免请求过快
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (error) {
      results.push({
        mobile,
        error: error.message
      });
    }
  }
  
  console.log('批量查询结果:', results);
}
```

### 示例 3：自定义请求

```javascript
async function customRequest() {
  const params = {
    // 您的业务参数
  };
  
  const response = await client.post('/your/api/path', params);
  console.log('响应:', response);
}
```

## 3DES 加密详解

### 加密流程

1. 对密钥进行 MD5 哈希
2. 取 MD5 结果的前 24 字节作为 3DES 密钥
3. 使用 `DES-EDE3` / ECB / PKCS5Padding 模式加密
4. 对加密结果进行 Base64 编码

### 与 Java 端兼容

本实现完全兼容 Java 端的 `ThreeDesUtil`：

```java
// Java 端
String encrypted = ThreeDesUtil.encode(appSecret, mobile);
```

```javascript
// Node.js 端
const encrypted = ThreeDesUtil.encode(appSecret, mobile);
```

两端生成的密文完全相同。

## 错误处理

```javascript
try {
  const result = await client.checkMobileExists('13800138000');
} catch (error) {
  if (error.message.includes('timeout')) {
    console.error('请求超时');
  } else if (error.message.includes('HTTP error')) {
    console.error('HTTP 错误:', error.message);
  } else {
    console.error('其他错误:', error.message);
  }
}
```

## 日志输出

客户端会自动输出详细的请求和响应日志：

```
========== Request ==========
URL: http://mp-opendaily.hstong.com/user/info/check-mobile-exists
Params: {
  "mobile": "encrypted_value",
  "client_key": "50000",
  "sign_time": "1714521600",
  "sign": "abc123..."
}
=============================

Mobile encryption: 13800138000 -> KddV5UZH/tyEuSFXA/VwEVFHGDG9OFVn

========== Response =========
Status: 200
Body: {"success":true,"data":1,"error":null}
=============================
```

## 调试技巧

### 1. 启用详细日志

```javascript
// 日志默认启用，控制台会显示完整的请求和响应
```

### 2. 验证加密结果

```javascript
// 测试 3DES 加密
const { ThreeDesUtil } = require('./HsOpenApiClient.js');

const appSecret = 'zf7HxnNBg2o8fnCf611';
const mobile = '13800138000';

const encrypted = ThreeDesUtil.encode(appSecret, mobile);
const decrypted = ThreeDesUtil.decode(appSecret, encrypted);

console.log('明文:', mobile);
console.log('密文:', encrypted);
console.log('解密:', decrypted);
console.log('验证成功:', mobile === decrypted);
```

### 3. 测试签名

```javascript
// 测试签名生成
const params = {
  mobile: 'encrypted_value',
  client_key: '50000',
  sign_time: Math.floor(Date.now() / 1000).toString(),
};

const sign = client.generateSign(params);
console.log('签名:', sign);
```

## 系统要求

- **Node.js**: >= 20.20.1（推荐使用最新 LTS 版本）
- **操作系统**: Windows / macOS / Linux
- **零外部依赖**: 仅使用 Node.js 内置模块

## 故障排除

### 问题 1：证书错误

```
Error: certificate has expired
```

**解决方案：**（仅用于开发环境）

```javascript
// 在 fetch 中添加（不推荐生产环境）
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
```

### 问题 2：请求超时

```
Error: Request timeout after 30000ms
```

**解决方案：**

```javascript
const client = new HsOpenApiClient({
  // ...
  timeout: 60000, // 增加超时时间到 60 秒
});
```

### 问题 3：签名错误

```
Error: 签名验证失败
```

**检查清单：**
- [ ] client_key 是否正确
- [ ] appSecret 是否正确
- [ ] 时间戳是否为秒级（非毫秒）
- [ ] 参数排序是否正确（字母顺序）

## 许可证

MIT License

## 联系方式

如有问题，请联系技术支持。

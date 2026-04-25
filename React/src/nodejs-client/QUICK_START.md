# 华盛开放平台 API Node.js 客户端 - 快速使用指南

## 📦 文件说明

```
hs-open-api-client/
├── HsOpenApiClient.js    # 主客户端文件（必需）
├── test.js                # 测试脚本
├── package.json           # 项目配置
├── README.md              # 完整文档
└── QUICK_START.md         # 本文件（快速指南）
```

## 🚀 5 分钟快速上手

### 步骤 1：准备环境

确保已安装 Node.js v20.20.1 或更高版本：

```bash
node --version  # 应该显示 v20.20.1 或更高
```

### 步骤 2：下载文件

将 `HsOpenApiClient.js` 下载到您的项目目录：

```bash
# 方式1：直接复制
cp HsOpenApiClient.js your-project/

# 方式2：通过 curl
curl -O https://your-server/HsOpenApiClient.js
```

### 步骤 3：创建您的第一个脚本

创建 `my-app.js`：

```javascript
const { HsOpenApiClient } = require('./HsOpenApiClient.js');

// 创建客户端
const client = new HsOpenApiClient({
  baseUrl: 'http://mp-opendaily.hstong.com',
  clientKey: '50000',
  appSecret: 'zf7HxnNBg2o8fnCf611',
});

// 检查手机号
async function checkMobile() {
  const result = await client.checkMobileExists('13800138000');
  
  if (result.success) {
    console.log(result.data === 1 ? '手机号已存在' : '手机号不存在');
  } else {
    console.error('查询失败:', result.error);
  }
}

checkMobile();
```

### 步骤 4：运行

```bash
node my-app.js
```

## 📝 核心功能

### 1. 检查手机号是否存在

```javascript
const result = await client.checkMobileExists('13800138000');
console.log(result.data === 1 ? '存在' : '不存在');
```

### 2. 批量检查

```javascript
const mobiles = ['13800138000', '13800138001', '13800138002'];

for (const mobile of mobiles) {
  const result = await client.checkMobileExists(mobile);
  console.log(`${mobile}: ${result.data === 1 ? '存在' : '不存在'}`);
  await new Promise(r => setTimeout(r, 100)); // 限流
}
```

### 3. 自定义 API 请求

```javascript
const params = {
  // 您的参数
};

const response = await client.post('/api/path', params);
```

## 🧪 测试

运行测试脚本：

```bash
node test.js
```

测试内容：
- ✅ 3DES 加密/解密
- ✅ MD5 签名生成
- ✅ API 请求
- ✅ 批量查询

## ⚙️ 配置

### 环境变量配置（推荐）

创建 `.env` 文件：

```bash
HS_API_BASE_URL=http://mp-opendaily.hstong.com
HS_CLIENT_KEY=50000
HS_APP_SECRET=zf7HxnNBg2o8fnCf611
```

使用环境变量：

```javascript
const client = new HsOpenApiClient({
  baseUrl: process.env.HS_API_BASE_URL,
  clientKey: process.env.HS_CLIENT_KEY,
  appSecret: process.env.HS_APP_SECRET,
});
```

### 代码配置

```javascript
const client = new HsOpenApiClient({
  baseUrl: 'http://mp-opendaily.hstong.com',
  clientKey: '50000',
  appSecret: 'zf7HxnNBg2o8fnCf611',
  timeout: 30000,  // 可选：超时时间（毫秒）
});
```

## 🔐 加密说明

### 3DES 加密流程

1. 对 AppSecret 进行 MD5 哈希
2. 取前 24 字节作为 3DES 密钥
3. 使用 `DES-EDE3/ECB/PKCS5Padding` 加密
4. Base64 编码输出

### 手动加密

```javascript
const { ThreeDesUtil } = require('./HsOpenApiClient.js');

const encrypted = ThreeDesUtil.encode('your_secret', 'plain_text');
console.log(encrypted);
```

## 📋 签名算法

签名生成步骤：

1. 按字母顺序排序参数
2. 拼接：`client_key` + clientKey + key1 + value1 + ... + `client_secret` + appSecret
3. MD5 加密

**示例：**

参数：
```
{
  mobile: "encrypted_value",
  client_key: "50000",
  sign_time: "1714521600"
}
```

签名字符串：
```
client_key50000mobileencrypted_valuesign_time1714521600client_secretzf7HxnNBg2o8fnCf611
```

签名结果：
```
abc123... (32位MD5)
```

## 🐛 常见问题

### Q1: Node.js 版本不兼容

**问题：** `Error: Fetch is not defined`

**解决：** 升级到 Node.js 18+ 

```bash
# 使用 nvm 安装最新版本
nvm install 20
nvm use 20
```

### Q2: 签名验证失败

**检查清单：**
- [ ] client_key 和 appSecret 是否正确
- [ ] 时间戳是否为秒级（非毫秒）
- [ ] 参数排序是否正确

### Q3: 加密结果不匹配

**验证：**

```javascript
const { ThreeDesUtil } = require('./HsOpenApiClient.js');

const test = '13800138000';
const key = 'zf7HxnNBg2o8fnCf611';

const encrypted = ThreeDesUtil.encode(key, test);
const decrypted = ThreeDesUtil.decode(key, encrypted);

console.log('原文:', test);
console.log('密文:', encrypted);
console.log('解密:', decrypted);
console.log('匹配:', test === decrypted);
```

### Q4: 请求超时

**解决：** 增加超时时间

```javascript
const client = new HsOpenApiClient({
  // ...
  timeout: 60000,  // 60秒
});
```

## 📊 输出示例

### 成功响应

```json
{
  "success": true,
  "data": 1,
  "error": null
}
```

### 失败响应

```json
{
  "success": false,
  "error": {
    "code": "PARAMETER_ERROR",
    "description": "参数错误"
  }
}
```

### 日志输出

```
========== Request ==========
URL: http://mp-opendaily.hstong.com/user/info/check-mobile-exists
Params: {
  "mobile": "KddV5UZH/tyEuSFXA/VwEVFHGDG9OFVn",
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

## 📚 更多文档

完整文档请查看 [README.md](./README.md)

## 💡 提示

1. **日志输出**：客户端会自动打印详细的请求和响应日志
2. **错误处理**：始终使用 try-catch 包裹异步调用
3. **限流**：批量请求时建议添加延迟（100-200ms）
4. **密钥安全**：不要将密钥硬编码在代码中，使用环境变量

## 🎯 下一步

- 查看 [README.md](./README.md) 了解更多功能
- 运行 `node test.js` 测试所有功能
- 根据您的需求修改配置

---

**Node.js 版本要求：** >= 20.20.1  
**零外部依赖：** 仅使用 Node.js 内置模块  
**完全兼容：** 与 Java 端 3DES 和签名算法完全一致

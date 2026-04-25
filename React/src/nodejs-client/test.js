/**
 * 华盛开放平台 API 测试脚本
 * 
 * 运行：node test.js
 */

import { HsOpenApiClient, ThreeDesUtil, CONFIG } from './HsOpenApiClient.js';

/**
 * 测试 3DES 加密/解密
 */
function test3DES() {
  console.log('\n========== 测试 3DES 加密/解密 ==========');
  
  const plainText = '13800138000';
  const key = CONFIG.appSecret;
  
  console.log('明文:', plainText);
  console.log('密钥:', key);
  
  // 加密
  const encrypted = ThreeDesUtil.encode(key, plainText);
  console.log('密文 (Base64):', encrypted);
  
  // 解密
  const decrypted = ThreeDesUtil.decode(key, encrypted);
  console.log('解密:', decrypted);
  
  // 验证
  if (plainText === decrypted) {
    console.log('✅ 3DES 加密/解密测试通过');
    return true;
  } else {
    console.log('❌ 3DES 加密/解密测试失败');
    return false;
  }
}

/**
 * 测试签名生成
 */
function testSignature() {
  console.log('\n========== 测试签名生成 ==========');
  
  const client = new HsOpenApiClient(CONFIG);
  
  const params = {
    mobile: 'test_encrypted_value',
    client_key: CONFIG.clientKey,
    sign_time: Math.floor(Date.now() / 1000).toString(),
  };
  
  console.log('参数:', JSON.stringify(params, null, 2));
  
  const sign = client.generateSign(params);
  console.log('签名:', sign);
  console.log('签名长度:', sign.length, '(应为32位)');
  
  if (sign.length === 32) {
    console.log('✅ 签名测试通过');
    return true;
  } else {
    console.log('❌ 签名测试失败');
    return false;
  }
}

/**
 * 测试 API 请求
 */
async function testAPI() {
  console.log('\n========== 测试 API 请求 ==========');
  
  const client = new HsOpenApiClient(CONFIG);
  const testMobile = '13800138000';
  
  console.log('测试手机号:', testMobile);
  
  try {
    const result = await client.checkMobileExists(testMobile);
    
    console.log('请求结果:');
    console.log('  success:', result.success);
    console.log('  data:', result.data);
    console.log('  error:', result.error);
    
    if (result.success) {
      const exists = result.data === 1;
      console.log(`  手机号 ${testMobile} ${exists ? '已存在' : '不存在'}`);
      console.log('✅ API 请求测试通过');
      return true;
    } else {
      console.log('❌ API 请求测试失败：', result.error);
      return false;
    }
  } catch (error) {
    console.log('❌ API 请求测试异常：', error.message);
    return false;
  }
}

/**
 * 批量测试
 */
async function testBatch() {
  console.log('\n========== 批量测试 ==========');
  
  const client = new HsOpenApiClient(CONFIG);
  const mobiles = ['19974995858', '13800238001', '13800138002'];
  
  console.log('测试手机号列表:', mobiles.join(', '));
  
  const results = [];
  
  for (const mobile of mobiles) {
    try {
      console.log(`\n检查 ${mobile}...`);
      const result = await client.checkMobileExists(mobile);
      
      const exists = result.success && result.data === 1;
      results.push({ mobile, exists, success: result.success });
      
      console.log(`  结果: ${result.success ? (exists ? '已存在' : '不存在') : '查询失败'}`);
      
      // 避免请求过快
      await new Promise(resolve => setTimeout(resolve, 200));
    } catch (error) {
      console.log(`  错误: ${error.message}`);
      results.push({ mobile, error: error.message });
    }
  }
  
  console.log('\n批量查询结果:');
  console.log(JSON.stringify(results, null, 2));
  
  const successCount = results.filter(r => r.success).length;
  console.log(`\n总计: ${results.length} 个，成功: ${successCount} 个，失败: ${results.length - successCount} 个`);
}

/**
 * 主函数
 */
async function main() {
  console.log('==========================================');
  console.log('华盛开放平台 API 测试');
  console.log('==========================================');
  
  const test3DS = test3DES();
  const testSig = testSignature();
  
  if (!test3DS || !testSig) {
    console.log('\n❌ 基础测试失败，停止 API 测试n');
    return;
  }
  
  await testAPI();
  
  // 询问是否进行批量测试
  console.log('\n是否进行批量测试？(输入 y 继续)');
  // 批量测试
  await testBatch();
  
  console.log('\n==========================================');
  console.log('测试完成');
  console.log('==========================================');
}

// 运行测试
main().catch(error => {
  console.error('测试失败:', error);
  process.exit(1);
});

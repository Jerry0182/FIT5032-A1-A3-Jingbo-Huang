# 🔧 Google 登录修复指南

## 🚨 问题描述
部署到 Vercel 后，Google 登录功能失效，显示 "Google login failed" 错误。

## 🎯 解决方案

### 步骤 1：Firebase 控制台配置

1. **访问 Firebase 控制台**
   - 网址：https://console.firebase.google.com/
   - 选择项目：`men-s-health-b3367`

2. **添加授权域名**
   - 点击 "Authentication" → "Settings"
   - 在 "Authorized domains" 部分
   - 点击 "Add domain"
   - 输入：`fit-5032-a1-a3-jingbo-huang.vercel.app`
   - 点击 "Add"

3. **确认域名列表**
   ```
   ✅ localhost
   ✅ fit-5032-a1-a3-jingbo-huang.vercel.app
   ```

### 步骤 2：Google Cloud Console 配置

1. **访问 Google Cloud Console**
   - 网址：https://console.cloud.google.com/
   - 选择项目：`men-s-health-b3367`

2. **更新 OAuth 设置**
   - 点击 "APIs & Services" → "Credentials"
   - 找到 OAuth 2.0 客户端 ID
   - 点击编辑

3. **添加授权重定向 URI**
   ```
   https://fit-5032-a1-a3-jingbo-huang.vercel.app
   ```

### 步骤 3：验证配置

1. **检查 Firebase 配置**
   - 确保 Firebase 配置正确
   - 检查 API 密钥是否有效

2. **测试登录功能**
   - 访问您的 Vercel 网站
   - 尝试 Google 登录
   - 检查浏览器控制台是否有错误

## 🔍 故障排除

### 常见错误及解决方案

1. **"This domain is not authorized"**
   - 解决：在 Firebase 中添加授权域名

2. **"Invalid redirect URI"**
   - 解决：在 Google Cloud Console 中添加重定向 URI

3. **"Client ID not found"**
   - 解决：检查 Firebase 配置是否正确

### 检查清单

- [ ] Firebase 授权域名已添加
- [ ] Google Cloud Console 重定向 URI 已添加
- [ ] Firebase 配置正确
- [ ] 网站可以正常访问
- [ ] Google 登录按钮可以点击
- [ ] 没有控制台错误

## 📞 如果问题仍然存在

1. **检查浏览器控制台**
   - 按 F12 打开开发者工具
   - 查看 Console 标签页的错误信息

2. **检查网络请求**
   - 在 Network 标签页查看失败的请求
   - 检查请求状态码

3. **联系支持**
   - Firebase 支持：https://firebase.google.com/support
   - Vercel 支持：https://vercel.com/support

## 🎉 修复完成

完成以上步骤后，Google 登录功能应该可以正常工作了！

### 预期结果
- ✅ Google 登录按钮可以正常点击
- ✅ 弹出 Google 登录窗口
- ✅ 登录成功后跳转到主页面
- ✅ 用户信息正确显示

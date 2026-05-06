# GitHub Actions 快速配置指南

## 📋 快速检查清单

在开始使用 CI/CD 前，确保完成以下配置：

- [ ] 1. 配置 GitHub Secrets
- [ ] 2. 配置 Codecov（可选）
- [ ] 3. 配置 Snyk（可选）
- [ ] 4. 测试 CI 工作流
- [ ] 5. 执行首次发布

---

## 🔐 Secrets 配置

### 必需配置（无此无法正常构建）

#### 1. Tauri 应用签名密钥

```bash
# 在本地生成密钥对
cd src/frontend
npm run tauri signer generate

# 输出示例：
# Your keypair was generated successfully!
# Private key: dW50cnVzdGVkOi8va2V5L...
# Public key: dW50cnVzdGVkOi8va2V5L...

# 添加到 GitHub Secrets
# TAURI_PRIVATE_KEY = <Private key>
# TAURI_KEY_PASSWORD = <你设置的密码>
```

#### 2. AI 服务 API Keys

| Secret 名称 | 获取方式 | 用途 |
|------------|----------|------|
| `OPENAI_API_KEY` | https://platform.openai.com/api-keys | 错别字检测、大纲生成 |
| `ANTHROPIC_API_KEY` | https://console.anthropic.com/ | 大纲生成（备选） |
| `STABILITY_API_KEY` | https://platform.stability.ai/ | 封面生成 |
| `VOLCENGINE_API_KEY` | https://console.volcengine.com/ | AI 服务（国内备选） |

### 可选配置（提升安全性）

#### 3. 代码质量和安全扫描

| Secret 名称 | 获取方式 | 用途 |
|------------|----------|------|
| `CODECOV_TOKEN` | https://codecov.io/ | 测试覆盖率报告上传 |
| `SNYK_TOKEN` | https://snyk.io/ | 安全漏洞扫描 |

---

## ⚙️ 配置步骤

### 步骤 1：添加 Secrets

1. 打开 GitHub 仓库页面
2. 点击 **Settings** 标签
3. 左侧菜单选择 **Secrets and variables** → **Actions**
4. 点击 **New repository secret**
5. 输入 Secret 名称和值
6. 点击 **Add secret**

### 步骤 2：验证配置

推送代码到仓库，检查 CI 是否正常运行：

```bash
# 创建测试分支
git checkout -b test/ci-config

# 修改一个文件（触发 CI）
echo "# CI Test" >> README.md

# 提交并推送
git add README.md
git commit -m "test: 验证 CI 配置"
git push origin test/ci-config

# 在 GitHub Actions 页面查看运行状态
```

### 步骤 3：执行首次发布

```bash
# 合并代码到 main 分支
git checkout main
git merge develop

# 创建并推送 tag
git tag v1.0.0
git push origin v1.0.0

# 在 GitHub 创建 Release
# 访问：https://github.com/<username>/novel-writing-software/releases/new
```

---

## 🚀 快速命令参考

### 触发 CI 构建

```bash
# 方式 1: 推送到 main/develop 分支
git push origin main

# 方式 2: 创建 Pull Request
gh pr create --title "新功能" --body "描述"

# 方式 3: 手动触发（在 GitHub Actions 页面）
```

### 触发发布

```bash
# 方式 1: 创建 tag 并发布
git tag v1.0.0
git push origin v1.0.0
# 然后在 GitHub 创建 Release

# 方式 2: 手动触发
# 在 GitHub Actions 页面选择 "Release" 工作流
# 点击 "Run workflow"，输入版本号
```

### 查看构建状态

```bash
# 使用 GitHub CLI
gh run list
gh run view <run-id>

# 或访问 GitHub Actions 页面
```

---

## 🔧 环境变量配置

### 本地开发环境

复制 `.env.example` 并重命名为 `.env`：

```bash
cp .env.example .env
```

编辑 `.env` 文件，填入真实的 API Keys：

```env
# 数据库配置
DATABASE_URL="postgresql://user:password@localhost:5432/novel_writer?schema=public"
REDIS_URL="redis://localhost:6379"

# AI 服务配置
OPENAI_API_KEY="sk-..."
OPENAI_BASE_URL="https://api.openai.com/v1"
ANTHROPIC_API_KEY="sk-ant-..."
STABILITY_API_KEY="sk-..."
VOLCENGINE_API_KEY="..."

# 应用配置
NODE_ENV=development
PORT=3000
```

### CI/CD 环境

GitHub Actions 使用 `env.yml` 中的共享环境变量，敏感信息通过 Secrets 注入。

---

## 📊 构建产物位置

### Release 产物

发布成功后，构建产物可在以下位置下载：

- **Windows**: `novel-writing-software-v1.0.0-windows-x64.msi`
- **macOS**: `novel-writing-software-v1.0.0-macos-universal.dmg`
- **Linux (DEB)**: `novel-writing-software-v1.0.0-linux-amd64.deb`
- **Linux (AppImage)**: `novel-writing-software-v1.0.0-linux-amd64.AppImage`

下载地址：
```
https://github.com/<username>/novel-writing-software/releases/tag/v1.0.0
```

### Docker 镜像

```bash
# 拉取镜像
docker pull ghcr.io/<username>/novel-writing-software:v1.0.0

# 运行容器
docker run -d \
  -p 3000:3000 \
  -e DATABASE_URL="..." \
  -e REDIS_URL="..." \
  -e OPENAI_API_KEY="..." \
  ghcr.io/<username>/novel-writing-software:v1.0.0
```

---

## ❓ 常见问题

### Q1: CI 构建失败，提示 "permission denied"

**A**: 检查 GITHUB_TOKEN 权限，确保工作流有足够的权限：

```yaml
permissions:
  contents: read
  packages: write
```

### Q2: Tauri 构建失败，提示签名错误

**A**: 检查 TAURI_PRIVATE_KEY 和 TAURI_KEY_PASSWORD 是否正确配置：

```bash
# 验证密钥是否正确
echo $TAURI_PRIVATE_KEY | base64 -d
```

### Q3: 测试环境数据库连接失败

**A**: 确保 GitHub Actions 服务容器配置正确：

```yaml
services:
  postgres:
    image: postgres:15
    env:
      POSTGRES_USER: test
      POSTGRES_PASSWORD: test
      POSTGRES_DB: novel_writer_test
```

### Q4: 如何跳过某些 CI 步骤？

**A**: 在 commit message 中添加关键词：

```bash
git commit -m "docs: 更新文档 [skip ci]"
# 或
git commit -m "docs: 更新文档 [ci skip]"
```

### Q5: 如何查看构建日志？

**A**: 使用 GitHub CLI 或访问 Actions 页面：

```bash
# 使用 CLI
gh run view <run-id> --log

# 或访问网页
# https://github.com/<username>/novel-writing-software/actions
```

---

## 📞 获取帮助

- **CI/CD 文档**: `docs/deployment/ci-cd.md`
- **GitHub Actions 日志**: Actions 标签页
- **问题反馈**: 创建 GitHub Issue

---

**配置完成后，你的项目将拥有完整的自动化 CI/CD 流水线！** 🎉

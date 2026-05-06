---
name: deployment
description: |
  网文作者码字软件部署阶段。CI/CD 配置、环境部署、监控配置、发布上线。
  Use when: "部署"、"CI/CD"、"发布"、"上线"、"Docker"、"监控"、"运维"、"自动化部署"
---

# 部署阶段

## 项目背景

**项目名称**：网文作者码字软件  
**部署环境**：
- 桌面端：Windows/macOS/Linux
- 云端：云服务器（阿里云/腾讯云）
- CI/CD：GitHub Actions / GitLab CI

## 当前输入

- 测试通过的代码
- 部署文档
- 监控要求

## 任务说明

1. 配置 CI/CD 流水线
2. 部署云端服务
3. 打包桌面应用
4. 配置监控告警
5. 发布上线

## 调用的 Agent

### 1. DevOps Automator
```
@devops-automator 配置 CI/CD 流水线，实现自动化构建、测试、部署
```

**配置任务**：
- GitHub Actions / GitLab CI 配置
- 自动化测试流程
- 自动化构建流程
- 自动化部署流程

### 2. DevOps Automator
```
@devops-automator 部署云端服务（API、数据库、Redis）
```

**部署任务**：
- 云服务器配置
- Docker 容器部署
- PostgreSQL 数据库部署
- Redis 缓存部署
- HTTPS 证书配置

### 3. DevOps Automator
```
@devops-automator 打包桌面应用（Windows/macOS/Linux）
```

**打包任务**：
- Electron/Tauri 打包配置
- Windows 安装包（.exe）
- macOS 安装包（.dmg）
- Linux 安装包（.AppImage/.deb）

### 4. SRE Site Reliability Engineer
```
@sre-site-reliability-engineer 配置监控、告警、日志系统
```

**配置任务**：
- 应用性能监控（APM）
- 日志收集（ELK/Loki）
- 错误追踪（Sentry）
- 告警规则配置

### 5. Infrastructure Maintainer
```
@infrastructure-maintainer 配置云基础设施、备份策略、安全加固
```

**配置任务**：
- 云资源管理
- 数据库备份策略
- 安全组配置
- CDN 配置

## 部署架构

```
┌─────────────────────────────────────────┐
│              用户端                      │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐   │
│  │ Windows │ │  macOS  │ │  Linux  │   │
│  └────┬────┘ └────┬────┘ └────┬────┘   │
└───────┼──────────┼──────────┼──────────┘
        │          │          │
        └──────────┼──────────┘
                   │
                   ▼
┌─────────────────────────────────────────┐
│            云端服务                      │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐   │
│  │ API 服务│ │PostgreSQL│ │  Redis  │   │
│  └─────────┘ └─────────┘ └─────────┘   │
│  ┌─────────┐ ┌─────────┐              │
│  │AI 服务  │ │ 监控系统 │              │
│  └─────────┘ └─────────┘              │
└─────────────────────────────────────────┘
```

## CI/CD 流程

```
代码提交 → 自动测试 → 自动构建 → 自动部署 → 监控告警
   │          │          │          │          │
   ▼          ▼          ▼          ▼          ▼
  Git      Jest/JUnit  Docker    K8s/云服务  APM/Sentry
```

## 输出物

完成后应产出：

| 输出物 | 文件位置 | 责任 Agent |
|--------|---------|-----------|
| CI/CD 配置 | `.github/workflows/` | devops-automator |
| 部署文档 | `docs/deployment/` | devops-automator |
| 监控配置 | `docs/monitoring/` | sre-site-reliability-engineer |
| 运维手册 | `docs/operations/` | infrastructure-maintainer |

## 验收标准

- [ ] CI/CD 流水线正常运行
- [ ] 云端服务部署成功
- [ ] 桌面应用打包完成（3 个平台）
- [ ] 监控系统正常运行
- [ ] 告警规则配置完成
- [ ] 数据库备份策略配置完成

## 发布检查清单

发布前必须确认：

- [ ] 所有测试通过
- [ ] 性能指标达标
- [ ] 无高危安全漏洞
- [ ] 监控系统正常
- [ ] 备份策略配置
- [ ] 回滚方案准备

## 下一步

部署完成后，项目进入 **运维阶段**：
```
调用 @infrastructure-maintainer 进行日常运维
调用 @incident-response-commander 处理线上问题
```

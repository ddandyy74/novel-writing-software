---
name: testing
description: |
  网文作者码字软件测试阶段。API 测试、性能测试、安全测试、代码审查。
  Use when: "测试"、"API测试"、"性能测试"、"安全测试"、"代码审查"、"Code Review"、"质量保证"
---

# 测试阶段

## 项目背景

**项目名称**：网文作者码字软件  
**测试范围**：前端、后端、AI 功能、安全性、性能

## 当前输入

- 前端源码
- 后端源码
- AI 功能代码
- 性能要求文档

## 任务说明

1. API 接口测试
2. 性能压力测试
3. 安全漏洞扫描
4. 代码质量审查
5. AI 功能准确率测试

## 调用的 Agent

### 1. API Tester
```
@api-tester 测试所有 API 接口的正确性、安全性、性能
```

**测试任务**：
- 用户认证 API 测试
- 云端同步 API 测试
- 多平台发布 API 测试
- 边界条件测试
- 错误处理测试

### 2. Performance Benchmarker
```
@performance-benchmarker 进行性能压力测试，验证性能指标
```

**测试任务**：
- 前端性能测试（启动时间 <3s）
- 后端性能测试（API 响应时间）
- 数据库性能测试（并发写入）
- AI 功能性能测试（检测/生成速度）

### 3. Security Engineer
```
@security-engineer 进行安全测试，发现并修复漏洞
```

**测试任务**：
- SQL 注入测试
- XSS 攻击测试
- API 安全测试
- 数据加密验证
- 权限控制测试

### 4. Code Reviewer
```
@code-reviewer 审查所有代码质量，确保符合最佳实践
```

**审查范围**：
- 前端代码审查
- 后端代码审查
- AI 功能代码审查
- 安全性审查
- 性能优化建议

### 5. Incident Response Commander
```
@incident-response-commander 制定测试问题修复流程和优先级
```

## 测试指标

根据需求文档：

### 功能测试
| 功能 | 测试要点 |
|------|---------|
| 实时自动保存 | 离线/在线切换、数据一致性 |
| 长文本撤销 | 50 步撤销、2000 字限制 |
| 错别字检测 | 准确率 ≥90%、速度 ≤3s/千字 |
| AI 大纲生成 | 生成质量、速度 ≤10s/章 |
| 多平台发布 | 某点、某茄、晋江对接 |

### 性能测试
| 指标 | 要求 |
|------|------|
| 启动时间 | ≤ 3 秒 |
| 保存延迟 | ≤ 100ms |
| 撤销响应 | ≤ 200ms |
| 错别字检测 | ≤ 3 秒/千字 |
| 大纲生成 | ≤ 10 秒/章 |
| 封面生成 | ≤ 30 秒 |

### 安全测试
- 数据传输加密（HTTPS）
- 本地数据加密
- API Token 安全
- SQL 注入防护
- XSS 防护

## 输出物

完成后应产出：

| 输出物 | 文件位置 | 责任 Agent |
|--------|---------|-----------|
| API 测试报告 | `docs/testing/api-testing.md` | api-tester |
| 性能测试报告 | `docs/testing/performance-testing.md` | performance-benchmarker |
| 安全测试报告 | `docs/testing/security-testing.md` | security-engineer |
| 代码审查报告 | `docs/testing/code-review.md` | code-reviewer |
| Bug 列表 | `docs/testing/bug-list.md` | incident-response-commander |

## 验收标准

- [ ] API 测试覆盖率 ≥ 80%
- [ ] 所有性能指标达标
- [ ] 无高危安全漏洞
- [ ] 代码通过质量审查
- [ ] Bug 列表已分类并分配优先级

## 下一步

测试完成后，进入 **部署阶段**：
```
调用 deployment Skill
```

# 监控系统配置文件清单

## 📁 目录结构

```
novel-writing-software/
├── docker/
│   └── monitoring/
│       ├── prometheus/
│       │   ├── prometheus.yml              # Prometheus 配置
│       │   └── alert-rules.yml              # 告警规则
│       ├── grafana/
│       │   └── provisioning/
│       │       ├── datasources/
│       │       │   └── datasources.yml      # 数据源配置
│       │       └── dashboards/
│       │           ├── dashboard.yml        # Dashboard 配置
│       │           ├── api-performance.json # API 性能监控
│       │           ├── database-performance.json # 数据库性能监控
│       │           ├── system-resources.json # 系统资源监控
│       │           └── ai-features.json     # AI 功能监控
│       ├── loki/
│       │   └── loki-config.yml              # Loki 配置
│       ├── promtail/
│       │   └── promtail-config.yml          # Promtail 配置
│       └── alertmanager/
│           └── alertmanager.yml             # Alertmanager 配置
├── src/
│   ├── backend/
│   │   ├── src/
│   │   │   └── utils/
│   │   │       ├── metrics.ts               # Prometheus 指标定义
│   │   │       ├── sentry.ts                # Sentry 错误追踪
│   │   │       └── logger.ts                # 结构化日志
│   │   ├── src/middleware/
│   │   │   └── metrics.ts                   # Metrics 中间件
│   │   ├── Dockerfile                       # 后端 Docker 镜像
│   │   ├── package.json                     # 添加监控依赖
│   │   └── .env.example                     # 环境变量示例
│   └── frontend/
│       ├── src/
│       │   └── utils/
│       │       └── sentry.ts                # 前端 Sentry 集成
│       ├── package.json                     # 添加 Sentry 依赖
│       └── .env.example                     # 前端环境变量
├── scripts/
│   ├── start-monitoring.sh                  # 监控系统启动脚本
│   └── check-environment.sh                 # 环境检查脚本
├── docs/
│   └── monitoring/
│       └── setup.md                         # 监控系统完整文档
├── docker-compose.yml                       # Docker Compose 配置
├── .env.example                             # 环境变量示例
└── MONITORING.md                            # 监控系统使用指南
```

## 📊 监控组件

### 1. 应用性能监控（APM）

**Prometheus + Grafana**

| 组件 | 端口 | 用途 |
|------|------|------|
| Prometheus | 9090 | 指标收集和存储 |
| Grafana | 3001 | 可视化监控面板 |
| Node Exporter | 9100 | 系统指标采集 |
| cAdvisor | 8080 | 容器指标采集 |

**自定义指标**:
- HTTP 请求计数器和持续时间
- 数据库查询性能
- Redis 操作性能
- AI 功能使用统计
- 业务指标（活跃用户、作品数量等）

### 2. 日志收集

**Loki + Promtail**

| 组件 | 端口 | 用途 |
|------|------|------|
| Loki | 3100 | 日志存储和查询 |
| Promtail | - | 日志采集和解析 |

**日志来源**:
- 后端应用日志（Pino 结构化日志）
- 前端应用日志
- Docker 容器日志
- PostgreSQL 日志

### 3. 错误追踪

**Sentry**

| 环境 | 集成方式 |
|------|---------|
| 后端 | @sentry/node |
| 前端 | @sentry/react |

**功能**:
- 实时错误追踪
- 错误聚合和去重
- 错误上下文分析
- 性能监控

### 4. 告警系统

**Alertmanager**

| 端口 | 用途 |
|------|------|
| 9093 | 告警管理和通知 |

**告警类型**:
- API 错误率 > 5%
- 响应时间 P99 > 3s
- 数据库连接失败
- 磁盘使用 > 80%
- 内存使用 > 90%
- AI 功能错误率 > 10%

**通知方式**:
- Email
- Slack（可选）

## 🎯 Dashboard 概览

### 1. API Performance Dashboard

监控指标：
- ✅ 请求速率
- ✅ 错误率
- ✅ 响应时间（P50/P95/P99）
- ✅ HTTP 状态码分布
- ✅ Top 10 慢接口

### 2. Database Performance Dashboard

监控指标：
- ✅ PostgreSQL 连接数
- ✅ 查询性能
- ✅ 事务统计
- ✅ 缓存命中率
- ✅ Redis 内存使用
- ✅ Redis 操作统计

### 3. System Resources Dashboard

监控指标：
- ✅ CPU 使用率
- ✅ 内存使用率
- ✅ 磁盘 I/O
- ✅ 网络流量
- ✅ 系统负载
- ✅ 容器资源使用

### 4. AI Features Dashboard

监控指标：
- ✅ AI 请求速率
- ✅ AI 错误率
- ✅ AI 响应时间
- ✅ Tokens 使用量
- ✅ AI 成本估算
- ✅ 活跃用户统计

## 🚀 快速启动

```bash
# 1. 检查环境
./scripts/check-environment.sh

# 2. 配置环境变量
cp .env.example .env
vim .env

# 3. 启动监控系统
./scripts/start-monitoring.sh

# 4. 访问 Grafana
# http://localhost:3001 (admin/admin)
```

## 📝 后续步骤

### 必须完成的配置：

1. **配置 Sentry DSN**
   - 从 https://sentry.io 获取 DSN
   - 更新 .env 文件中的 `SENTRY_DSN_BACKEND` 和 `SENTRY_DSN_FRONTEND`

2. **配置告警通知**
   - 编辑 `docker/monitoring/alertmanager/alertmanager.yml`
   - 配置 SMTP 或 Slack webhook
   - 重启 Alertmanager: `docker-compose restart alertmanager`

3. **修改默认密码**
   - Grafana: 首次登录后修改
   - PostgreSQL: 更新 .env 中的 `POSTGRES_PASSWORD`
   - JWT: 更新 .env 中的 `JWT_SECRET`

### 可选配置：

1. **数据保留策略**
   - Prometheus: 修改 `retention.time`
   - Loki: 修改 `retention_period`

2. **采集频率**
   - 调整 `scrape_interval` 以优化性能

3. **自定义 Dashboard**
   - 在 Grafana 中创建新的 Dashboard
   - 导出 JSON 并保存到 `docker/monitoring/grafana/provisioning/dashboards/`

## 📚 文档资源

- [监控系统完整文档](./docs/monitoring/setup.md)
- [监控系统使用指南](./MONITORING.md)
- [Prometheus 官方文档](https://prometheus.io/docs/)
- [Grafana 官方文档](https://grafana.com/docs/)
- [Sentry 官方文档](https://docs.sentry.io/)

---

**配置版本**: 1.0.0  
**最后更新**: 2026-05-07

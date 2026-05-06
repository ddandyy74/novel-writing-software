# 监控系统部署指南

## 📋 目录

- [系统架构](#系统架构)
- [快速开始](#快速开始)
- [监控组件](#监控组件)
- [配置说明](#配置说明)
- [告警配置](#告警配置)
- [Dashboard 使用](#dashboard-使用)
- [日志查询](#日志查询)
- [故障排查](#故障排查)

---

## 🏗 系统架构

### 监控架构图

```
┌─────────────────────────────────────────────────────────────────┐
│                        应用层                                    │
│  ┌──────────────┐       ┌──────────────┐                      │
│  │   Backend    │       │   Frontend   │                      │
│  │  (Fastify)   │       │   (React)    │                      │
│  │              │       │              │                      │
│  │ - Prometheus │       │   - Sentry   │                      │
│  │ - Pino Logs  │       │              │                      │
│  │ - Sentry     │       └──────────────┘                      │
│  └──────────────┘                                                │
└─────────────────────────────────────────────────────────────────┘
         │                  │
         ▼                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                      监控系统层                                  │
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │
│  │  Prometheus  │  │     Loki     │  │    Sentry    │        │
│  │   (Metrics)  │  │    (Logs)    │  │   (Errors)   │        │
│  │              │  │              │  │              │        │
│  │  Port: 9090  │  │  Port: 3100  │  │   Cloud      │        │
│  └──────────────┘  └──────────────┘  └──────────────┘        │
│         │                  │                                    │
│         └──────────┬───────┘                                    │
│                    ▼                                            │
│            ┌──────────────┐                                     │
│            │   Grafana    │                                     │
│            │ (Dashboard)  │                                     │
│            │  Port: 3001  │                                     │
│            └──────────────┘                                     │
└─────────────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────────┐
│                      告警系统                                    │
│            ┌──────────────┐                                     │
│            │Alertmanager  │                                     │
│            │  Port: 9093  │                                     │
│            │              │                                     │
│            │  - Email     │                                     │
│            │  - Slack     │                                     │
│            └──────────────┘                                     │
└─────────────────────────────────────────────────────────────────┘
```

### 数据流向

```
应用 → Prometheus (指标) → Grafana (可视化)
应用 → Promtail (日志) → Loki (存储) → Grafana (查询)
应用 → Sentry (错误) → 云端分析
```

---

## 🚀 快速开始

### 前置要求

- Docker & Docker Compose 已安装
- 8GB+ 可用内存
- 10GB+ 可用磁盘空间

### 1. 环境变量配置

创建 `.env` 文件：

\`\`\`bash
cp .env.example .env
\`\`\`

编辑 `.env` 文件，配置必要的环境变量：

\`\`\`env
# 数据库密码
POSTGRES_PASSWORD=your-secure-password

# JWT 密钥
JWT_SECRET=your-jwt-secret-key-here

# Sentry DSN (从 Sentry 控制台获取)
SENTRY_DSN_BACKEND=https://your-key@sentry.io/your-project-id
SENTRY_DSN_FRONTEND=https://your-key@sentry.io/your-project-id

# Grafana 管理员账户
GRAFANA_ADMIN_USER=admin
GRAFANA_ADMIN_PASSWORD=admin
\`\`\`

### 2. 启动监控系统

\`\`\`bash
# 启动所有服务
docker-compose up -d

# 查看服务状态
docker-compose ps

# 查看日志
docker-compose logs -f prometheus
docker-compose logs -f grafana
docker-compose logs -f loki
\`\`\`

### 3. 验证服务

访问以下地址验证服务是否正常：

| 服务 | 地址 | 说明 |
|------|------|------|
| Grafana | http://localhost:3001 | 监控面板 (admin/admin) |
| Prometheus | http://localhost:9090 | 指标查询 |
| Alertmanager | http://localhost:9093 | 告警管理 |
| Loki | http://localhost:3100/ready | 日志系统 |

---

## 📦 监控组件

### 1. Prometheus (指标收集)

**端口**: 9090

**功能**:
- 收集时序数据
- 存储指标
- 触发告警规则

**配置文件**: `docker/monitoring/prometheus/prometheus.yml`

**采集目标**:
- Backend API (端口 3000)
- PostgreSQL (postgres-exporter:9187)
- Redis (redis-exporter:9121)
- Node (node-exporter:9100)
- Containers (cadvisor:8080)

### 2. Grafana (可视化)

**端口**: 3001

**默认账户**: admin / admin

**预配置 Dashboard**:
1. **API Performance** - API 性能监控
   - 请求速率
   - 错误率
   - 响应时间 (P50/P95/P99)
   - HTTP 状态码分布

2. **Database Performance** - 数据库性能监控
   - PostgreSQL 连接数
   - 查询性能
   - 缓存命中率
   - Redis 内存使用

3. **System Resources** - 系统资源监控
   - CPU 使用率
   - 内存使用率
   - 磁盘 I/O
   - 网络流量

4. **AI Features** - AI 功能监控
   - AI 请求速率
   - 错误率
   - 响应时间
   - Tokens 使用量

### 3. Loki (日志收集)

**端口**: 3100

**功能**:
- 集中式日志存储
- 日志查询和分析
- 与 Grafana 集成

**配置文件**: `docker/monitoring/loki/loki-config.yml`

### 4. Promtail (日志采集)

**功能**:
- 采集应用日志
- 解析日志格式
- 发送到 Loki

**配置文件**: `docker/monitoring/promtail/promtail-config.yml`

**日志来源**:
- `/var/log/backend/*.log` - 后端应用日志
- `/var/log/frontend/*.log` - 前端应用日志
- Docker 容器日志
- PostgreSQL 日志

### 5. Sentry (错误追踪)

**访问地址**: https://sentry.io

**功能**:
- 实时错误追踪
- 错误聚合和去重
- 错误上下文分析
- 性能监控

**集成方式**:
- 后端: `@sentry/node`
- 前端: `@sentry/react`

---

## ⚙️ 配置说明

### Prometheus 指标端点

后端集成了 Prometheus metrics 端点：

\`\`\`typescript
// src/backend/src/middleware/metrics.ts

// 访问 http://localhost:3000/metrics 查看指标
\`\`\`

**自定义指标**:

| 指标名称 | 类型 | 说明 |
|---------|------|------|
| `http_request_duration_seconds` | Histogram | HTTP 请求持续时间 |
| `http_request_duration_seconds_count` | Counter | HTTP 请求总数 |
| `db_query_duration_seconds` | Histogram | 数据库查询持续时间 |
| `redis_operation_duration_seconds` | Histogram | Redis 操作持续时间 |
| `ai_request_duration_seconds` | Histogram | AI 功能请求持续时间 |
| `ai_request_total` | Counter | AI 功能请求总数 |
| `ai_request_errors_total` | Counter | AI 功能错误总数 |
| `ai_tokens_used_total` | Counter | Tokens 使用总数 |

### 日志格式

后端使用 Pino 结构化日志：

\`\`\`json
{
  "level": "info",
  "time": "2026-05-07T10:30:45.123Z",
  "msg": "HTTP Request",
  "method": "GET",
  "url": "/api/v1/works",
  "status": 200,
  "duration": 0.045,
  "userId": "user-123",
  "type": "http_request"
}
\`\`\`

**日志级别**:
- `trace` - 追踪日志
- `debug` - 调试日志
- `info` - 信息日志
- `warn` - 警告日志
- `error` - 错误日志

### Sentry 配置

**初始化**:

后端：
\`\`\`typescript
// src/backend/src/utils/sentry.ts
import { initSentry } from './utils/sentry';
initSentry();
\`\`\`

前端：
\`\`\`typescript
// src/frontend/src/utils/sentry.ts
import { initSentry } from './utils/sentry';
initSentry();
\`\`\`

**错误捕获**:

\`\`\`typescript
import { captureError } from './utils/sentry';

try {
  // 业务逻辑
} catch (error) {
  captureError(error as Error, { userId: 'user-123' });
}
\`\`\`

---

## 🚨 告警配置

### 告警规则

配置文件: `docker/monitoring/prometheus/alert-rules.yml`

#### 1. API 告警

| 告警名称 | 条件 | 严重级别 | 持续时间 |
|---------|------|---------|---------|
| HighErrorRate | 错误率 > 5% | Critical | 5 分钟 |
| HighResponseTime | P99 > 3s | Warning | 5 分钟 |
| LowRequestRate | 请求速率 < 1 req/s | Warning | 10 分钟 |

#### 2. 数据库告警

| 告警名称 | 条件 | 严重级别 | 持续时间 |
|---------|------|---------|---------|
| DatabaseConnectionFailed | 连接失败 | Critical | 1 分钟 |
| HighDatabaseConnections | 连接数 > 80% | Warning | 5 分钟 |
| SlowQueries | 查询时间 > 1s | Warning | 5 分钟 |

#### 3. 系统告警

| 告警名称 | 条件 | 严重级别 | 持续时间 |
|---------|------|---------|---------|
| HighDiskUsage | 磁盘使用 > 80% | Warning | 5 分钟 |
| HighMemoryUsage | 内存使用 > 90% | Critical | 5 分钟 |
| HighCPUUsage | CPU 使用 > 80% | Warning | 5 分钟 |

#### 4. AI 功能告警

| 告警名称 | 条件 | 严重级别 | 持续时间 |
|---------|------|---------|---------|
| SlowAIResponse | P95 > 10s | Warning | 5 分钟 |
| HighAIErrorRate | 错误率 > 10% | Critical | 5 分钟 |

### 告警通知配置

配置文件: `docker/monitoring/alertmanager/alertmanager.yml`

#### Email 配置

\`\`\`yaml
global:
  smtp_smarthost: 'smtp.example.com:587'
  smtp_from: 'alertmanager@novel-writer.com'
  smtp_auth_username: 'alertmanager@novel-writer.com'
  smtp_auth_password: 'your-password'
\`\`\`

#### Slack 配置（可选）

\`\`\`yaml
global:
  slack_api_url: 'https://hooks.slack.com/services/YOUR/SLACK/WEBHOOK'

receivers:
  - name: 'slack-notifications'
    slack_configs:
      - channel: '#alerts'
        send_resolved: true
\`\`\`

### 告警路由

\`\`\`yaml
route:
  group_by: ['alertname', 'severity']
  group_wait: 30s        # 等待 30s 收集同组告警
  group_interval: 5m     # 每 5m 发送一次新告警
  repeat_interval: 12h   # 每 12h 重复发送
  receiver: 'team-email'
\`\`\`

---

## 📊 Dashboard 使用

### 访问 Grafana

1. 打开浏览器访问: http://localhost:3001
2. 使用管理员账户登录:
   - Username: admin
   - Password: admin (首次登录后请修改)

### 查看 Dashboard

1. 点击左侧菜单 "Dashboards"
2. 选择对应的 Dashboard:
   - **Novel Writer - API Performance**: API 性能监控
   - **Novel Writer - Database Performance**: 数据库性能监控
   - **Novel Writer - System Resources**: 系统资源监控
   - **Novel Writer - AI Features**: AI 功能监控

### 自定义 Dashboard

1. 点击 "New" → "New Dashboard"
2. 添加 Panel
3. 选择数据源 (Prometheus)
4. 输入 PromQL 查询语句
5. 配置可视化选项

### 示例 PromQL 查询

\`\`\`promql
# 请求速率 (过去 5 分钟)
sum(rate(http_request_duration_seconds_count[5m]))

# 错误率
sum(rate(http_request_duration_seconds_count{status=~"5.."}[5m])) 
/ 
sum(rate(http_request_duration_seconds_count[5m])) * 100

# P95 响应时间
histogram_quantile(0.95, sum(rate(http_request_duration_seconds_bucket[5m])) by (le))

# CPU 使用率
100 - (avg by(instance) (rate(node_cpu_seconds_total{mode="idle"}[5m])) * 100)

# 内存使用率
(1 - node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes) * 100

# 数据库连接数
pg_stat_activity_count
\`\`\`

---

## 📝 日志查询

### 在 Grafana 中查询日志

1. 打开 Grafana
2. 点击 "Explore"
3. 选择数据源 "Loki"
4. 输入 LogQL 查询语句

### LogQL 示例

\`\`\`logql
# 查看后端所有日志
{job="backend"}

# 查看错误日志
{job="backend"} |= "error"

# 查看特定用户的请求日志
{job="backend"} | json | userId="user-123"

# 查看慢请求 (> 1s)
{job="backend"} | json | duration > 1

# 统计 HTTP 状态码分布
sum by (status) (count_over_time({job="backend"} | json [5m]))

# 查看数据库查询日志
{job="backend"} | json | type="db_query"

# 查看 AI 功能日志
{job="backend"} | json | type="ai_operation"
\`\`\`

### 日志字段

后端日志包含以下字段：

- `level`: 日志级别
- `time`: 时间戳
- `msg`: 日志消息
- `method`: HTTP 方法
- `url`: 请求 URL
- `status`: HTTP 状态码
- `duration`: 请求持续时间
- `userId`: 用户 ID
- `type`: 日志类型 (http_request, db_query, ai_operation, etc.)

---

## 🔧 故障排查

### 常见问题

#### 1. Prometheus 无法采集指标

**症状**: Prometheus targets 显示为 "down"

**排查步骤**:
\`\`\`bash
# 检查 Prometheus 日志
docker-compose logs prometheus

# 检查后端 metrics 端点
curl http://localhost:3000/metrics

# 检查网络连接
docker-compose exec prometheus ping backend
\`\`\`

**解决方案**:
- 确保后端服务正常运行
- 检查 Prometheus 配置中的 targets 地址
- 确认网络连接正常

#### 2. Grafana 无法连接数据源

**症状**: Dashboard 显示 "No data"

**排查步骤**:
\`\`\`bash
# 检查 Grafana 日志
docker-compose logs grafana

# 测试 Prometheus 连接
docker-compose exec grafana curl http://prometheus:9090/api/v1/query?query=up

# 测试 Loki 连接
docker-compose exec grafana curl http://loki:3100/ready
\`\`\`

**解决方案**:
- 检查数据源配置
- 确认服务都在同一个 Docker 网络
- 重启 Grafana: `docker-compose restart grafana`

#### 3. 日志未出现在 Loki

**症状**: Loki 中没有日志数据

**排查步骤**:
\`\`\`bash
# 检查 Promtail 日志
docker-compose logs promtail

# 检查日志文件是否存在
ls -la logs/backend/

# 测试 Loki API
curl http://localhost:3100/ready
\`\`\`

**解决方案**:
- 确认应用正在写入日志
- 检查 Promtail 配置中的日志路径
- 确认 Promtail 有权限读取日志文件

#### 4. Sentry 未捕获错误

**症状**: Sentry 控制台没有错误报告

**排查步骤**:
\`\`\`bash
# 检查环境变量
docker-compose exec backend env | grep SENTRY

# 测试 Sentry 连接
curl -v https://sentry.io/api/your-project-id/
\`\`\`

**解决方案**:
- 确认 Sentry DSN 配置正确
- 检查 Sentry 初始化代码
- 确认错误未被 beforeSend 过滤

#### 5. 告警未发送

**症状**: 触发告警但未收到通知

**排查步骤**:
\`\`\`bash
# 检查 Alertmanager 日志
docker-compose logs alertmanager

# 查看 Alertmanager 状态
curl http://localhost:9093/api/v2/status

# 查看活跃告警
curl http://localhost:9093/api/v2/alerts
\`\`\`

**解决方案**:
- 检查 SMTP/Slack 配置
- 确认告警规则正确触发
- 检查告警路由配置

### 性能优化

#### 1. Prometheus 存储

\`\`\`yaml
# 减少数据保留时间
command:
  - '--storage.tsdb.retention.time=7d'  # 从 30d 改为 7d
\`\`\`

#### 2. Loki 存储

\`\`\`yaml
# 减少日志保留时间
table_manager:
  retention_period: 72h  # 从 168h 改为 72h
\`\`\`

#### 3. 采集频率

\`\`\`yaml
# 降低采集频率
global:
  scrape_interval: 30s  # 从 15s 改为 30s
\`\`\`

### 重启服务

\`\`\`bash
# 重启所有监控服务
docker-compose restart prometheus grafana loki promtail alertmanager

# 重启单个服务
docker-compose restart prometheus

# 完全重建
docker-compose down
docker-compose up -d
\`\`\`

---

## 📚 相关文档

- [Prometheus 官方文档](https://prometheus.io/docs/)
- [Grafana 官方文档](https://grafana.com/docs/)
- [Loki 官方文档](https://grafana.com/docs/loki/latest/)
- [Sentry 官方文档](https://docs.sentry.io/)
- [PromQL 查询语法](https://prometheus.io/docs/prometheus/latest/querying/basics/)
- [LogQL 查询语法](https://grafana.com/docs/loki/latest/query/)

---

## 🆘 获取帮助

如有问题，请：

1. 查看服务日志: `docker-compose logs -f [service-name]`
2. 检查配置文件是否正确
3. 查阅官方文档
4. 联系开发团队

---

**文档版本**: 1.0.0  
**最后更新**: 2026-05-07

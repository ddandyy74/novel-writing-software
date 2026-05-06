# 监控系统使用指南

## 🚀 快速启动

### 1. 检查环境

\`\`\`bash
./scripts/check-environment.sh
\`\`\`

### 2. 配置环境变量

\`\`\`bash
# 复制环境变量模板
cp .env.example .env

# 编辑 .env 文件，配置必要的环境变量
vim .env
\`\`\`

**必须配置的环境变量**:
- `POSTGRES_PASSWORD`: PostgreSQL 数据库密码
- `JWT_SECRET`: JWT 密钥
- `SENTRY_DSN_BACKEND`: 后端 Sentry DSN（从 https://sentry.io 获取）
- `SENTRY_DSN_FRONTEND`: 前端 Sentry DSN
- `GRAFANA_ADMIN_PASSWORD`: Grafana 管理员密码

### 3. 启动监控系统

\`\`\`bash
# 启动所有监控服务
./scripts/start-monitoring.sh

# 或手动启动
docker-compose up -d prometheus grafana loki promtail alertmanager \
    postgres-exporter redis-exporter node-exporter cadvisor
\`\`\`

### 4. 启动应用服务

\`\`\`bash
# 启动后端服务（首次需要先构建）
docker-compose up -d backend postgres redis

# 查看日志
docker-compose logs -f backend
\`\`\`

## 📊 访问监控面板

### Grafana

- **地址**: http://localhost:3001
- **用户名**: admin
- **密码**: admin（首次登录后请修改）

### 预配置的 Dashboard

1. **API Performance** - API 性能监控
   - 请求速率、错误率、响应时间
   
2. **Database Performance** - 数据库性能
   - PostgreSQL、Redis 性能指标
   
3. **System Resources** - 系统资源
   - CPU、内存、磁盘、网络
   
4. **AI Features** - AI 功能
   - AI 请求速率、错误率、响应时间

### Prometheus

- **地址**: http://localhost:9090
- **用途**: 查询原始指标数据

### Alertmanager

- **地址**: http://localhost:9093
- **用途**: 查看和管理告警

## 🔧 常用命令

### 查看服务状态

\`\`\`bash
# 查看所有服务状态
docker-compose ps

# 查看特定服务日志
docker-compose logs -f prometheus
docker-compose logs -f grafana
docker-compose logs -f backend
\`\`\`

### 重启服务

\`\`\`bash
# 重启所有监控服务
docker-compose restart prometheus grafana loki alertmanager

# 重启单个服务
docker-compose restart grafana
\`\`\`

### 停止服务

\`\`\`bash
# 停止所有服务
docker-compose down

# 停止并删除数据卷
docker-compose down -v
\`\`\`

## 📝 日志查询

### 在 Grafana 中查询

1. 打开 Grafana
2. 点击 "Explore"
3. 选择 "Loki" 数据源
4. 输入 LogQL 查询

**常用查询**:

\`\`\`logql
# 查看后端所有日志
{job="backend"}

# 查看错误日志
{job="backend"} |= "error"

# 查看特定用户请求
{job="backend"} | json | userId="user-123"

# 查看慢请求 (> 1s)
{job="backend"} | json | duration > 1
\`\`\`

## 🚨 告警配置

### 配置邮件告警

编辑 `docker/monitoring/alertmanager/alertmanager.yml`:

\`\`\`yaml
global:
  smtp_smarthost: 'smtp.example.com:587'
  smtp_from: 'alertmanager@novel-writer.com'
  smtp_auth_username: 'alertmanager@novel-writer.com'
  smtp_auth_password: 'your-password'
\`\`\`

### 配置 Slack 告警

\`\`\`yaml
global:
  slack_api_url: 'https://hooks.slack.com/services/YOUR/SLACK/WEBHOOK'

receivers:
  - name: 'slack-notifications'
    slack_configs:
      - channel: '#alerts'
\`\`\`

### 重启 Alertmanager

\`\`\`bash
docker-compose restart alertmanager
\`\`\`

## 📈 自定义指标

### 添加新的 Prometheus 指标

在 `src/backend/src/utils/metrics.ts` 中添加:

\`\`\`typescript
export const myCustomCounter = new promClient.Counter({
  name: 'my_custom_counter',
  help: 'Description of the counter',
  labelNames: ['label1', 'label2'],
  registers: [register],
});
\`\`\`

在代码中使用:

\`\`\`typescript
import { myCustomCounter } from './utils/metrics';

myCustomCounter.inc({ label1: 'value1', label2: 'value2' });
\`\`\`

### 添加新的告警规则

在 `docker/monitoring/prometheus/alert-rules.yml` 中添加:

\`\`\`yaml
groups:
  - name: my-alerts
    rules:
      - alert: MyCustomAlert
        expr: my_custom_counter > 100
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "My custom alert"
          description: "Counter exceeded threshold"
\`\`\`

重载 Prometheus 配置:

\`\`\`bash
curl -X POST http://localhost:9090/-/reload
\`\`\`

## 🔍 故障排查

### 服务无法启动

\`\`\`bash
# 查看详细日志
docker-compose logs [service-name]

# 检查端口占用
lsof -i :[port-number]

# 检查 Docker 网络
docker network ls
docker network inspect novel-writer-software_monitoring-network
\`\`\`

### Grafana 无法连接数据源

\`\`\`bash
# 检查 Prometheus 是否正常
curl http://localhost:9090/api/v1/query?query=up

# 检查 Loki 是否正常
curl http://localhost:3100/ready

# 重启 Grafana
docker-compose restart grafana
\`\`\`

### 日志未显示

\`\`\`bash
# 检查日志目录权限
ls -la logs/

# 检查 Promtail 日志
docker-compose logs promtail

# 检查应用是否在写日志
tail -f logs/backend/*.log
\`\`\`

## 📚 参考资料

- [完整监控文档](./docs/monitoring/setup.md)
- [Prometheus 查询语法](https://prometheus.io/docs/prometheus/latest/querying/basics/)
- [LogQL 查询语法](https://grafana.com/docs/loki/latest/query/)
- [Grafana Dashboard 最佳实践](https://grafana.com/docs/grafana/latest/dashboards/)

## 🆘 获取帮助

遇到问题？

1. 查看 [故障排查文档](./docs/monitoring/setup.md#故障排查)
2. 检查服务日志
3. 联系开发团队

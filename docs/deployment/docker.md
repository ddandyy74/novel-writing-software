# 网文作者码字软件 - Docker 部署指南

## 📋 目录

- [系统要求](#系统要求)
- [快速开始](#快速开始)
- [环境配置](#环境配置)
- [部署方式](#部署方式)
- [服务管理](#服务管理)
- [数据备份与恢复](#数据备份与恢复)
- [监控与日志](#监控与日志)
- [故障排查](#故障排查)
- [生产环境优化](#生产环境优化)

---

## 系统要求

### 硬件要求

| 资源 | 最低配置 | 推荐配置 |
|------|---------|---------|
| CPU | 2 核 | 4 核+ |
| 内存 | 4 GB | 8 GB+ |
| 存储 | 20 GB | 50 GB+ SSD |

### 软件要求

- **操作系统**: Linux (Ubuntu 20.04+ / CentOS 7+) / macOS / Windows 10+
- **Docker**: 20.10+
- **Docker Compose**: 2.0+
- **Git**: 2.0+

### 安装 Docker

#### Ubuntu/Debian

```bash
# 安装 Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# 安装 Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# 添加当前用户到 docker 组
sudo usermod -aG docker $USER

# 验证安装
docker --version
docker-compose --version
```

#### CentOS/RHEL

```bash
# 安装 Docker
sudo yum install -y yum-utils
sudo yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
sudo yum install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# 启动 Docker
sudo systemctl start docker
sudo systemctl enable docker

# 验证安装
docker --version
```

---

## 快速开始

### 1. 克隆项目

```bash
git clone https://github.com/yourusername/novel-writing-software.git
cd novel-writing-software
```

### 2. 配置环境变量

```bash
# 复制环境变量模板
cp .env.example .env

# 编辑配置文件
nano .env
```

**必须修改的配置项**：

```bash
# 数据库密码（必须修改）
DB_PASSWORD=your_secure_password_here

# JWT 密钥（必须修改）
JWT_SECRET=your_jwt_secret_minimum_32_chars

# AES 加密密钥（必须修改，32 字节）
AES_ENCRYPTION_KEY=your_32_byte_encryption_key_here

# AI 服务 API 密钥（可选）
OPENAI_API_KEY=sk-your-openai-key
ANTHROPIC_API_KEY=your-anthropic-key
```

### 3. 一键部署

```bash
# 执行完整部署流程
./scripts/deploy.sh deploy
```

部署脚本会自动完成：
- ✅ 前置检查
- ✅ 数据库备份
- ✅ 拉取最新代码
- ✅ 构建 Docker 镜像
- ✅ 启动所有服务
- ✅ 健康检查

### 4. 验证部署

```bash
# 检查服务状态
./scripts/deploy.sh status

# 查看服务日志
./scripts/deploy.sh logs
```

访问以下地址验证服务：
- API 文档: http://localhost:3000/api/docs
- 健康检查: http://localhost:3000/health

---

## 环境配置

### 环境变量说明

#### 应用配置

```bash
# 运行环境
NODE_ENV=production

# 服务端口
PORT=3000

# 监听地址
HOST=0.0.0.0

# API 路径前缀
API_PREFIX=/api/v1
```

#### 数据库配置

```bash
# PostgreSQL 连接字符串
DATABASE_URL=postgresql://novel_writer:password@postgres:5432/novel_writer_db?schema=public
```

#### Redis 配置

```bash
# Redis 连接配置
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=your_redis_password
```

#### 安全配置

```bash
# JWT 配置
JWT_SECRET=your_jwt_secret_minimum_32_characters
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d

# 密码加密
BCRYPT_SALT_ROUNDS=10

# 数据加密密钥（32 字节）
AES_ENCRYPTION_KEY=your_32_byte_encryption_key_here
```

#### AI 服务配置

```bash
# OpenAI API
OPENAI_API_KEY=sk-your-openai-api-key
OPENAI_BASE_URL=https://api.openai.com/v1

# Anthropic API
ANTHROPIC_API_KEY=your-anthropic-api-key

# Stable Diffusion API
STABILITY_API_KEY=your-stability-api-key
STABILITY_BASE_URL=https://api.stability.ai

# 火山引擎 API
VOLCENGINE_API_KEY=your-volcengine-api-key
```

### Docker Compose 配置文件

#### 开发环境 (docker-compose.yml)

```yaml
# 默认配置，适合本地开发
```

#### 生产环境

生产环境使用相同的 `docker-compose.yml`，但需要：

1. **配置 HTTPS 证书**：
   ```bash
   # 创建 SSL 证书目录
   mkdir -p docker/ssl
   
   # 复制证书文件
   cp /path/to/your/fullchain.pem docker/ssl/
   cp /path/to/your/privkey.pem docker/ssl/
   ```

2. **启用 Nginx 服务**：
   ```bash
   # 使用 production profile 启动
   docker-compose --profile production up -d
   ```

---

## 部署方式

### 方式一：自动化部署（推荐）

使用部署脚本一键部署：

```bash
# 完整部署流程
./scripts/deploy.sh deploy

# 或分步执行
./scripts/deploy.sh pull      # 拉取代码
./scripts/deploy.sh build     # 构建镜像
./scripts/deploy.sh start     # 启动服务
```

### 方式二：手动部署

#### 1. 构建镜像

```bash
docker-compose build --no-cache
```

#### 2. 启动服务

```bash
# 启动所有服务
docker-compose up -d

# 查看启动日志
docker-compose logs -f
```

#### 3. 初始化数据库

```bash
# 运行数据库迁移
docker-compose exec backend npm run prisma:migrate

# 生成 Prisma Client
docker-compose exec backend npm run prisma:generate
```

#### 4. 健康检查

```bash
# 检查服务健康状态
curl http://localhost:3000/health
```

---

## 服务管理

### 基本命令

```bash
# 启动服务
./scripts/deploy.sh start
# 或
docker-compose up -d

# 停止服务
./scripts/deploy.sh stop
# 或
docker-compose down

# 重启服务
./scripts/deploy.sh restart
# 或
docker-compose restart

# 查看服务状态
./scripts/deploy.sh status
# 或
docker-compose ps

# 查看日志
./scripts/deploy.sh logs [service]
# 或
docker-compose logs -f [service]
```

### 服务说明

| 服务 | 容器名 | 端口 | 用途 |
|------|--------|------|------|
| backend | novel-writer-backend | 3000 | API 服务 |
| postgres | novel-writer-postgres | 5432 | PostgreSQL 数据库 |
| redis | novel-writer-redis | 6379 | Redis 缓存 |
| nginx | novel-writer-nginx | 80, 443 | 反向代理（生产环境） |

### 容器管理

```bash
# 进入后端容器
docker-compose exec backend sh

# 进入数据库容器
docker-compose exec postgres psql -U novel_writer -d novel_writer_db

# 进入 Redis 容器
docker-compose exec redis redis-cli

# 查看容器资源使用
docker stats
```

---

## 数据备份与恢复

### 自动备份

使用备份脚本执行自动备份：

```bash
# 执行备份
./scripts/backup.sh run

# 查看备份列表
./scripts/backup.sh list

# 清理旧备份
./scripts/backup.sh cleanup
```

### 备份策略

- **每日备份**: 保留最近 7 天
- **每周备份**: 保留最近 4 周（周日执行）
- **每月备份**: 保留最近 12 个月（每月 1 日执行）

### 手动备份

```bash
# 备份数据库
docker-compose exec -T postgres pg_dump \
  -U novel_writer \
  -d novel_writer_db \
  --clean \
  --if-exists \
  | gzip > backup_$(date +%Y%m%d_%H%M%S).sql.gz

# 备份上传文件（如果有）
tar -czf uploads_backup_$(date +%Y%m%d).tar.gz uploads/
```

### 恢复数据

```bash
# 从备份文件恢复
./scripts/backup.sh restore backups/daily/db_backup_20240101_120000.sql.gz

# 或手动恢复
gunzip -c backup_20240101.sql.gz | docker-compose exec -T postgres psql \
  -U novel_writer \
  -d novel_writer_db
```

---

## 监控与日志

### 日志查看

```bash
# 查看所有服务日志
docker-compose logs -f

# 查看特定服务日志
docker-compose logs -f backend
docker-compose logs -f postgres
docker-compose logs -f redis

# 查看最近 100 行日志
docker-compose logs --tail=100 backend

# 查看特定时间段日志
docker-compose logs --since 2024-01-01T00:00:00 backend
```

### 日志文件位置

- **后端日志**: `logs/` 目录
- **Nginx 日志**: `/var/log/nginx/` 容器内
- **PostgreSQL 日志**: 容器内 `/var/lib/postgresql/data/log/`

### 性能监控

```bash
# 查看容器资源使用
docker stats

# 查看容器详情
docker-compose exec backend top

# 查看数据库连接
docker-compose exec postgres psql -U novel_writer -d novel_writer_db -c "SELECT count(*) FROM pg_stat_activity;"

# 查看 Redis 内存使用
docker-compose exec redis redis-cli info memory
```

---

## 故障排查

### 常见问题

#### 1. 容器启动失败

**症状**: 容器无法启动或频繁重启

**排查步骤**:
```bash
# 查看容器日志
docker-compose logs backend

# 检查容器状态
docker-compose ps

# 检查资源使用
docker stats

# 检查端口占用
netstat -tulpn | grep -E '3000|5432|6379'
```

**解决方案**:
- 检查环境变量配置
- 检查端口冲突
- 检查资源限制

#### 2. 数据库连接失败

**症状**: 后端无法连接数据库

**排查步骤**:
```bash
# 检查数据库容器状态
docker-compose ps postgres

# 测试数据库连接
docker-compose exec postgres pg_isready -U novel_writer

# 检查数据库日志
docker-compose logs postgres

# 检查网络连接
docker-compose exec backend ping postgres
```

**解决方案**:
- 确认数据库容器正常运行
- 检查 `DATABASE_URL` 配置
- 重启数据库容器

#### 3. Redis 连接失败

**症状**: 缓存功能不可用

**排查步骤**:
```bash
# 检查 Redis 容器
docker-compose ps redis

# 测试 Redis 连接
docker-compose exec redis redis-cli ping

# 检查 Redis 配置
docker-compose exec redis redis-cli CONFIG GET "*"
```

**解决方案**:
- 确认 Redis 容器正常运行
- 检查 Redis 密码配置
- 重启 Redis 容器

#### 4. 内存不足

**症状**: 容器被 OOM Kill

**排查步骤**:
```bash
# 查看内存使用
free -h
docker stats

# 查看系统日志
dmesg | grep -i "out of memory"
```

**解决方案**:
- 增加系统内存
- 调整容器内存限制
- 优化应用内存使用

### 健康检查

```bash
# 检查后端健康状态
curl -f http://localhost:3000/health

# 检查数据库健康状态
docker-compose exec postgres pg_isready

# 检查 Redis 健康状态
docker-compose exec redis redis-cli ping
```

### 重置环境

```bash
# 停止并删除所有容器、网络、卷
docker-compose down -v

# 重新部署
./scripts/deploy.sh deploy
```

---

## 生产环境优化

### 1. 安全加固

#### 配置防火墙

```bash
# Ubuntu UFW
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable

# CentOS Firewalld
sudo firewall-cmd --permanent --add-port=22/tcp
sudo firewall-cmd --permanent --add-port=80/tcp
sudo firewall-cmd --permanent --add-port=443/tcp
sudo firewall-cmd --reload
```

#### 配置 HTTPS

使用 Let's Encrypt 免费证书：

```bash
# 安装 certbot
sudo apt install certbot

# 获取证书
sudo certbot certonly --standalone -d your-domain.com

# 复制证书到项目
sudo cp /etc/letsencrypt/live/your-domain.com/fullchain.pem docker/ssl/
sudo cp /etc/letsencrypt/live/your-domain.com/privkey.pem docker/ssl/

# 设置自动续期
sudo crontab -e
# 添加：0 0 1 * * certbot renew --quiet && cp /etc/letsencrypt/live/your-domain.com/*.pem /path/to/project/docker/ssl/
```

### 2. 性能优化

#### Docker 配置优化

创建或编辑 `/etc/docker/daemon.json`：

```json
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  },
  "storage-driver": "overlay2",
  "live-restore": true,
  "default-ulimits": {
    "nofile": {
      "Name": "nofile",
      "Hard": 65535,
      "Soft": 65535
    }
  }
}
```

重启 Docker：
```bash
sudo systemctl restart docker
```

#### 数据库优化

```bash
# 进入数据库容器
docker-compose exec postgres psql -U novel_writer -d novel_writer_db

# 执行优化命令
VACUUM ANALYZE;
REINDEX DATABASE novel_writer_db;
```

### 3. 自动化运维

#### 设置定时备份

```bash
# 编辑 crontab
crontab -e

# 添加定时任务（每天凌晨 2 点备份）
0 2 * * * cd /path/to/project && ./scripts/backup.sh run >> logs/backup.log 2>&1
```

#### 设置自动更新

```bash
# 创建自动更新脚本
cat > /etc/cron.weekly/novel-writer-update << 'EOF'
#!/bin/bash
cd /path/to/project
./scripts/deploy.sh pull
./scripts/deploy.sh build
./scripts/deploy.sh restart
EOF

chmod +x /etc/cron.weekly/novel-writer-update
```

### 4. 监控告警

#### 安装 Prometheus + Grafana

```bash
# 添加到 docker-compose.yml
prometheus:
  image: prom/prometheus
  volumes:
    - ./monitoring/prometheus.yml:/etc/prometheus/prometheus.yml
  ports:
    - "9090:9090"

grafana:
  image: grafana/grafana
  ports:
    - "3001:3000"
  volumes:
    - grafana-data:/var/lib/grafana
```

#### 配置告警

在 Prometheus 中配置告警规则，发送到 Slack/Email。

---

## 附录

### Docker Compose 完整命令

```bash
# 构建服务
docker-compose build [service]

# 启动服务
docker-compose up -d [service]

# 停止服务
docker-compose down

# 重启服务
docker-compose restart [service]

# 查看日志
docker-compose logs -f [service]

# 查看状态
docker-compose ps

# 进入容器
docker-compose exec [service] sh

# 拉取镜像
docker-compose pull

# 删除停止的容器
docker-compose rm

# 查看配置
docker-compose config
```

### 有用的命令

```bash
# 清理未使用的 Docker 资源
./scripts/deploy.sh cleanup

# 或手动清理
docker system prune -a

# 查看 Docker 磁盘使用
docker system df

# 导出镜像
docker save -o backup.tar novel-writer-backend:latest

# 导入镜像
docker load -i backup.tar
```

### 联系支持

如有问题，请通过以下方式获取帮助：

- 📧 Email: support@novel-writer.com
- 💬 GitHub Issues: https://github.com/yourusername/novel-writing-software/issues
- 📖 文档: https://docs.novel-writer.com

---

**最后更新**: 2024-01-07  
**版本**: 1.0.0

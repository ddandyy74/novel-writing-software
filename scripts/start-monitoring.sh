#!/bin/bash

# 监控系统快速启动脚本

set -e

echo "=========================================="
echo "  网文作者码字软件 - 监控系统启动脚本"
echo "=========================================="
echo ""

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 检查 Docker
if ! command -v docker &> /dev/null; then
    echo -e "${RED}错误: Docker 未安装${NC}"
    echo "请先安装 Docker: https://docs.docker.com/get-docker/"
    exit 1
fi

# 检查 Docker Compose
if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}错误: Docker Compose 未安装${NC}"
    echo "请先安装 Docker Compose: https://docs.docker.com/compose/install/"
    exit 1
fi

echo -e "${GREEN}✓ Docker 已安装${NC}"
echo -e "${GREEN}✓ Docker Compose 已安装${NC}"
echo ""

# 检查 .env 文件
if [ ! -f .env ]; then
    echo -e "${YELLOW}警告: .env 文件不存在${NC}"
    echo "正在从 .env.example 创建 .env 文件..."
    cp .env.example .env
    echo -e "${YELLOW}请编辑 .env 文件，配置必要的环境变量${NC}"
    echo ""
fi

# 创建日志目录
echo "创建日志目录..."
mkdir -p logs/backend logs/frontend logs/postgres
echo -e "${GREEN}✓ 日志目录已创建${NC}"
echo ""

# 停止旧容器
echo "停止旧容器..."
docker-compose down
echo -e "${GREEN}✓ 旧容器已停止${NC}"
echo ""

# 启动监控系统
echo "启动监控系统..."
docker-compose up -d prometheus grafana loki promtail alertmanager \
    postgres-exporter redis-exporter node-exporter cadvisor

echo ""
echo "等待服务启动..."
sleep 10

# 检查服务状态
echo ""
echo "检查服务状态..."
echo ""

services=(
    "prometheus:9090"
    "grafana:3001"
    "alertmanager:9093"
    "loki:3100"
)

for service in "${services[@]}"; do
    name="${service%:*}"
    port="${service#*:}"
    
    if curl -s "http://localhost:${port}/ready" > /dev/null 2>&1 || \
       curl -s "http://localhost:${port}" > /dev/null 2>&1; then
        echo -e "${GREEN}✓ ${name} 运行正常 (http://localhost:${port})${NC}"
    else
        echo -e "${YELLOW}⚠ ${name} 可能未就绪 (http://localhost:${port})${NC}"
    fi
done

echo ""
echo "=========================================="
echo "  监控系统启动完成！"
echo "=========================================="
echo ""
echo "访问地址:"
echo "  - Grafana:       http://localhost:3001 (admin/admin)"
echo "  - Prometheus:    http://localhost:9090"
echo "  - Alertmanager:  http://localhost:9093"
echo "  - Loki:          http://localhost:3100"
echo ""
echo "下一步:"
echo "  1. 访问 Grafana 配置数据源和 Dashboard"
echo "  2. 配置 Alertmanager 的告警通知方式"
echo "  3. 启动应用服务: docker-compose up -d backend postgres redis"
echo ""
echo "查看日志:"
echo "  docker-compose logs -f [service-name]"
echo ""
echo "停止服务:"
echo "  docker-compose down"
echo ""

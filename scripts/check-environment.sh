#!/bin/bash

# 环境检查脚本

echo "=========================================="
echo "  监控系统环境检查"
echo "=========================================="
echo ""

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# 检查命令是否存在
check_command() {
    if command -v $1 &> /dev/null; then
        echo -e "${GREEN}✓ $1 已安装${NC}"
        return 0
    else
        echo -e "${RED}✗ $1 未安装${NC}"
        return 1
    fi
}

# 检查端口是否被占用
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null 2>&1; then
        echo -e "${YELLOW}⚠ 端口 $1 已被占用${NC}"
        return 1
    else
        echo -e "${GREEN}✓ 端口 $1 可用${NC}"
        return 0
    fi
}

# 检查文件是否存在
check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✓ 文件 $1 存在${NC}"
        return 0
    else
        echo -e "${RED}✗ 文件 $1 不存在${NC}"
        return 1
    fi
}

# 检查目录是否存在
check_dir() {
    if [ -d "$1" ]; then
        echo -e "${GREEN}✓ 目录 $1 存在${NC}"
        return 0
    else
        echo -e "${YELLOW}⚠ 目录 $1 不存在，将创建${NC}"
        mkdir -p "$1"
        return 1
    fi
}

echo "1. 检查必要命令..."
echo ""
check_command docker
check_command docker-compose
check_command curl
check_command lsof
echo ""

echo "2. 检查端口占用..."
echo ""
check_port 3000  # Backend
check_port 3001  # Grafana
check_port 9090  # Prometheus
check_port 9093  # Alertmanager
check_port 3100  # Loki
check_port 5432  # PostgreSQL
check_port 6379  # Redis
check_port 9187  # PostgreSQL Exporter
check_port 9121  # Redis Exporter
check_port 9100  # Node Exporter
check_port 8080  # cAdvisor
echo ""

echo "3. 检查配置文件..."
echo ""
check_file .env.example
check_file docker-compose.yml
check_file docker/monitoring/prometheus/prometheus.yml
check_file docker/monitoring/prometheus/alert-rules.yml
check_file docker/monitoring/alertmanager/alertmanager.yml
check_file docker/monitoring/loki/loki-config.yml
check_file docker/monitoring/promtail/promtail-config.yml
check_file docker/monitoring/grafana/provisioning/datasources/datasources.yml
check_file docker/monitoring/grafana/provisioning/dashboards/dashboard.yml
echo ""

echo "4. 检查必要目录..."
echo ""
check_dir logs/backend
check_dir logs/frontend
check_dir logs/postgres
echo ""

echo "5. 检查 Docker 服务..."
echo ""
if docker info >/dev/null 2>&1; then
    echo -e "${GREEN}✓ Docker 服务运行正常${NC}"
else
    echo -e "${RED}✗ Docker 服务未运行${NC}"
fi
echo ""

echo "6. 系统资源检查..."
echo ""
# 检查内存
total_mem=$(free -m | awk '/^Mem:/{print $2}')
if [ "$total_mem" -lt 4096 ]; then
    echo -e "${YELLOW}⚠ 内存不足 4GB，建议至少 8GB${NC}"
else
    echo -e "${GREEN}✓ 内存充足 (${total_mem}MB)${NC}"
fi

# 检查磁盘空间
available_disk=$(df -BG . | awk 'NR==2 {print $4}' | sed 's/G//')
if [ "$available_disk" -lt 10 ]; then
    echo -e "${YELLOW}⚠ 磁盘空间不足 10GB，建议至少 20GB${NC}"
else
    echo -e "${GREEN}✓ 磁盘空间充足 (${available_disk}GB)${NC}"
fi
echo ""

echo "=========================================="
echo "  环境检查完成"
echo "=========================================="

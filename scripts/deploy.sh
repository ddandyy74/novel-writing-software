#!/bin/bash

# ============================================
# 网文作者码字软件 - 部署脚本
# ============================================
# 用途：自动化部署应用到生产环境

set -e  # 遇到错误立即退出
set -o pipefail  # 管道命令错误处理

# ============================================
# 配置变量
# ============================================
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
COMPOSE_FILE="$PROJECT_DIR/docker-compose.yml"
BACKUP_DIR="$PROJECT_DIR/backups"
LOG_DIR="$PROJECT_DIR/logs"

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# ============================================
# 辅助函数
# ============================================
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

check_command() {
    if ! command -v $1 &> /dev/null; then
        log_error "$1 未安装，请先安装"
        exit 1
    fi
}

# ============================================
# 前置检查
# ============================================
preflight_check() {
    log_info "执行前置检查..."
    
    # 检查必要命令
    check_command docker
    check_command docker-compose
    
    # 检查 .env 文件
    if [ ! -f "$PROJECT_DIR/.env" ]; then
        log_warning ".env 文件不存在，从示例文件创建..."
        cp "$PROJECT_DIR/.env.example" "$PROJECT_DIR/.env"
        log_warning "请编辑 .env 文件配置生产环境变量"
        exit 1
    fi
    
    # 创建必要目录
    mkdir -p "$BACKUP_DIR"
    mkdir -p "$LOG_DIR"
    
    log_success "前置检查完成"
}

# ============================================
# 数据库迁移
# ============================================
run_migrations() {
    log_info "执行数据库迁移..."
    
    # 生成 Prisma Client
    docker-compose -f "$COMPOSE_FILE" exec backend npm run prisma:generate
    
    # 运行迁移
    docker-compose -f "$COMPOSE_FILE" exec backend npm run prisma:migrate
    
    log_success "数据库迁移完成"
}

# ============================================
# 备份数据
# ============================================
backup_data() {
    local timestamp=$(date +"%Y%m%d_%H%M%S")
    local backup_file="$BACKUP_DIR/db_backup_$timestamp.sql.gz"
    
    log_info "备份数据库..."
    
    # 创建备份目录
    mkdir -p "$BACKUP_DIR"
    
    # 备份数据库
    docker-compose -f "$COMPOSE_FILE" exec -T postgres pg_dump \
        -U novel_writer \
        -d novel_writer_db \
        --clean \
        --if-exists \
        | gzip > "$backup_file"
    
    # 保留最近 7 天的备份
    find "$BACKUP_DIR" -name "db_backup_*.sql.gz" -mtime +7 -delete
    
    log_success "数据库备份完成: $backup_file"
}

# ============================================
# 拉取最新代码
# ============================================
pull_latest() {
    log_info "拉取最新代码..."
    
    cd "$PROJECT_DIR"
    
    # 暂存本地修改
    git stash
    
    # 拉取最新代码
    git pull origin main
    
    # 恢复本地修改
    git stash pop
    
    log_success "代码更新完成"
}

# ============================================
# 构建镜像
# ============================================
build_images() {
    log_info "构建 Docker 镜像..."
    
    cd "$PROJECT_DIR"
    
    # 构建所有镜像
    docker-compose -f "$COMPOSE_FILE" build --no-cache
    
    # 清理旧镜像
    docker image prune -f
    
    log_success "镜像构建完成"
}

# ============================================
# 启动服务
# ============================================
start_services() {
    log_info "启动服务..."
    
    cd "$PROJECT_DIR"
    
    # 停止旧容器
    docker-compose -f "$COMPOSE_FILE" down
    
    # 启动新容器
    docker-compose -f "$COMPOSE_FILE" up -d
    
    # 等待服务启动
    log_info "等待服务启动..."
    sleep 10
    
    # 健康检查
    health_check
    
    log_success "服务启动完成"
}

# ============================================
# 健康检查
# ============================================
health_check() {
    log_info "执行健康检查..."
    
    local max_retries=30
    local retry_count=0
    
    while [ $retry_count -lt $max_retries ]; do
        if curl -f http://localhost:3000/health > /dev/null 2>&1; then
            log_success "健康检查通过"
            return 0
        fi
        
        retry_count=$((retry_count + 1))
        log_info "等待服务就绪... ($retry_count/$max_retries)"
        sleep 2
    done
    
    log_error "健康检查失败"
    log_error "查看日志: docker-compose logs backend"
    exit 1
}

# ============================================
# 查看服务状态
# ============================================
show_status() {
    log_info "服务状态:"
    docker-compose -f "$COMPOSE_FILE" ps
    
    echo ""
    log_info "服务日志（最近 20 行）:"
    docker-compose -f "$COMPOSE_FILE" logs --tail=20 backend
}

# ============================================
# 停止服务
# ============================================
stop_services() {
    log_info "停止服务..."
    
    cd "$PROJECT_DIR"
    docker-compose -f "$COMPOSE_FILE" down
    
    log_success "服务已停止"
}

# ============================================
# 重启服务
# ============================================
restart_services() {
    log_info "重启服务..."
    
    cd "$PROJECT_DIR"
    docker-compose -f "$COMPOSE_FILE" restart
    
    health_check
    
    log_success "服务重启完成"
}

# ============================================
# 查看日志
# ============================================
view_logs() {
    local service=$1
    
    if [ -z "$service" ]; then
        docker-compose -f "$COMPOSE_FILE" logs -f
    else
        docker-compose -f "$COMPOSE_FILE" logs -f "$service"
    fi
}

# ============================================
# 清理资源
# ============================================
cleanup() {
    log_info "清理未使用的 Docker 资源..."
    
    # 删除停止的容器
    docker container prune -f
    
    # 删除未使用的镜像
    docker image prune -a -f
    
    # 删除未使用的卷
    docker volume prune -f
    
    # 删除未使用的网络
    docker network prune -f
    
    log_success "清理完成"
}

# ============================================
# 主菜单
# ============================================
show_help() {
    cat << EOF
网文作者码字软件 - 部署脚本

用法: $0 [命令]

命令:
    deploy          完整部署（备份 -> 构建 -> 启动）
    pull            拉取最新代码
    build           构建 Docker 镜像
    start           启动服务
    stop            停止服务
    restart         重启服务
    status          查看服务状态
    logs [service]  查看日志（可指定服务）
    migrate         执行数据库迁移
    backup          备份数据库
    cleanup         清理未使用的资源
    help            显示帮助信息

示例:
    $0 deploy       # 完整部署
    $0 logs backend # 查看后端日志
    $0 backup       # 备份数据库
EOF
}

# ============================================
# 主程序
# ============================================
main() {
    local command=${1:-help}
    
    case $command in
        deploy)
            preflight_check
            backup_data
            pull_latest
            build_images
            start_services
            show_status
            ;;
        pull)
            pull_latest
            ;;
        build)
            preflight_check
            build_images
            ;;
        start)
            preflight_check
            start_services
            show_status
            ;;
        stop)
            stop_services
            ;;
        restart)
            restart_services
            ;;
        status)
            show_status
            ;;
        logs)
            view_logs $2
            ;;
        migrate)
            run_migrations
            ;;
        backup)
            backup_data
            ;;
        cleanup)
            cleanup
            ;;
        help|--help|-h)
            show_help
            ;;
        *)
            log_error "未知命令: $command"
            show_help
            exit 1
            ;;
    esac
}

# 执行主程序
main "$@"

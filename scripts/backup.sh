#!/bin/bash

# ============================================
# 网文作者码字软件 - 备份脚本
# ============================================
# 用途：自动备份 PostgreSQL 数据库和重要文件

set -e  # 遇到错误立即退出

# ============================================
# 配置变量
# ============================================
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
BACKUP_DIR="$PROJECT_DIR/backups"
LOG_FILE="$PROJECT_DIR/logs/backup.log"

# 数据库配置
DB_CONTAINER="novel-writer-postgres"
DB_USER="novel_writer"
DB_NAME="novel_writer_db"

# 备份保留策略
DAILY_KEEP=7      # 保留最近 7 天的每日备份
WEEKLY_KEEP=4     # 保留最近 4 周的每周备份
MONTHLY_KEEP=12   # 保留最近 12 个月的每月备份

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# ============================================
# 辅助函数
# ============================================
log() {
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    echo "[$timestamp] $1" | tee -a "$LOG_FILE"
}

log_info() {
    log "${BLUE}[INFO]${NC} $1"
}

log_success() {
    log "${GREEN}[SUCCESS]${NC} $1"
}

log_error() {
    log "${RED}[ERROR]${NC} $1"
}

# ============================================
# 创建备份目录
# ============================================
create_backup_dirs() {
    mkdir -p "$BACKUP_DIR/daily"
    mkdir -p "$BACKUP_DIR/weekly"
    mkdir -p "$BACKUP_DIR/monthly"
    mkdir -p "$(dirname "$LOG_FILE")"
}

# ============================================
# 数据库备份
# ============================================
backup_database() {
    local timestamp=$(date +"%Y%m%d_%H%M%S")
    local backup_type=$1
    local backup_file="$BACKUP_DIR/$backup_type/db_backup_$timestamp.sql.gz"
    
    log_info "开始备份数据库（$backup_type）..."
    
    # 检查容器是否运行
    if ! docker ps | grep -q "$DB_CONTAINER"; then
        log_error "数据库容器未运行: $DB_CONTAINER"
        return 1
    fi
    
    # 执行备份
    docker exec "$DB_CONTAINER" pg_dump \
        -U "$DB_USER" \
        -d "$DB_NAME" \
        --clean \
        --if-exists \
        --no-owner \
        --no-acl \
        | gzip > "$backup_file"
    
    if [ $? -eq 0 ]; then
        local size=$(du -h "$backup_file" | cut -f1)
        log_success "数据库备份完成: $backup_file (大小: $size)"
        
        # 验证备份文件
        if gunzip -t "$backup_file" 2>/dev/null; then
            log_success "备份文件验证通过"
        else
            log_error "备份文件验证失败"
            return 1
        fi
    else
        log_error "数据库备份失败"
        return 1
    fi
}

# ============================================
# 上传备份（可选）
# ============================================
upload_backup() {
    local backup_file=$1
    
    # 检查是否配置了远程备份
    if [ -z "$BACKUP_REMOTE_URL" ]; then
        log_info "未配置远程备份，跳过上传"
        return 0
    fi
    
    log_info "上传备份到远程存储..."
    
    # 使用 curl 上传到对象存储
    curl -X PUT \
        -H "Authorization: Bearer $BACKUP_TOKEN" \
        --data-binary @"$backup_file" \
        "$BACKUP_REMOTE_URL/$(basename $backup_file)"
    
    if [ $? -eq 0 ]; then
        log_success "备份上传成功"
    else
        log_error "备份上传失败"
    fi
}

# ============================================
# 清理旧备份
# ============================================
cleanup_old_backups() {
    log_info "清理旧备份文件..."
    
    # 清理每日备份（保留最近 7 天）
    find "$BACKUP_DIR/daily" -name "db_backup_*.sql.gz" -mtime +$DAILY_KEEP -delete
    local daily_count=$(find "$BACKUP_DIR/daily" -name "db_backup_*.sql.gz" | wc -l)
    log_info "每日备份保留: $daily_count 个"
    
    # 清理每周备份（保留最近 4 周）
    find "$BACKUP_DIR/weekly" -name "db_backup_*.sql.gz" -mtime +$((WEEKLY_KEEP * 7)) -delete
    local weekly_count=$(find "$BACKUP_DIR/weekly" -name "db_backup_*.sql.gz" | wc -l)
    log_info "每周备份保留: $weekly_count 个"
    
    # 清理每月备份（保留最近 12 个月）
    find "$BACKUP_DIR/monthly" -name "db_backup_*.sql.gz" -mtime +$((MONTHLY_KEEP * 30)) -delete
    local monthly_count=$(find "$BACKUP_DIR/monthly" -name "db_backup_*.sql.gz" | wc -l)
    log_info "每月备份保留: $monthly_count 个"
    
    log_success "旧备份清理完成"
}

# ============================================
# 恢复备份
# ============================================
restore_backup() {
    local backup_file=$1
    
    if [ ! -f "$backup_file" ]; then
        log_error "备份文件不存在: $backup_file"
        return 1
    fi
    
    log_info "开始恢复数据库..."
    log_info "备份文件: $backup_file"
    
    # 确认恢复
    read -p "确认要恢复数据库吗？这将覆盖当前数据！(yes/no): " confirm
    if [ "$confirm" != "yes" ]; then
        log_info "取消恢复操作"
        return 0
    fi
    
    # 停止后端服务
    log_info "停止后端服务..."
    docker-compose -f "$PROJECT_DIR/docker-compose.yml" stop backend
    
    # 恢复数据库
    log_info "恢复数据库..."
    gunzip -c "$backup_file" | docker exec -i "$DB_CONTAINER" psql \
        -U "$DB_USER" \
        -d "$DB_NAME"
    
    if [ $? -eq 0 ]; then
        log_success "数据库恢复完成"
        
        # 启动后端服务
        log_info "启动后端服务..."
        docker-compose -f "$PROJECT_DIR/docker-compose.yml" start backend
    else
        log_error "数据库恢复失败"
        return 1
    fi
}

# ============================================
# 列出备份
# ============================================
list_backups() {
    echo "======================================"
    echo "可用备份列表"
    echo "======================================"
    
    echo ""
    echo "每日备份:"
    ls -lht "$BACKUP_DIR/daily" 2>/dev/null || echo "无"
    
    echo ""
    echo "每周备份:"
    ls -lht "$BACKUP_DIR/weekly" 2>/dev/null || echo "无"
    
    echo ""
    echo "每月备份:"
    ls -lht "$BACKUP_DIR/monthly" 2>/dev/null || echo "无"
}

# ============================================
# 主备份流程
# ============================================
run_backup() {
    log_info "========================================"
    log_info "开始执行备份任务"
    log_info "========================================"
    
    create_backup_dirs
    
    # 执行每日备份
    backup_database "daily"
    
    # 判断是否执行每周备份（周日）
    if [ $(date +%u) -eq 7 ]; then
        backup_database "weekly"
    fi
    
    # 判断是否执行每月备份（每月 1 日）
    if [ $(date +%d) -eq 01 ]; then
        backup_database "monthly"
    fi
    
    # 清理旧备份
    cleanup_old_backups
    
    log_info "========================================"
    log_success "备份任务完成"
    log_info "========================================"
}

# ============================================
# 主菜单
# ============================================
show_help() {
    cat << EOF
网文作者码字软件 - 备份脚本

用法: $0 [命令]

命令:
    run             执行备份任务
    restore <file>  从备份文件恢复
    list            列出所有备份
    cleanup         清理旧备份
    help            显示帮助信息

示例:
    $0 run                                              # 执行备份
    $0 restore backups/daily/db_backup_20240101.sql.gz # 恢复备份
    $0 list                                             # 列出备份

备份策略:
    - 每日备份: 保留最近 $DAILY_KEEP 天
    - 每周备份: 保留最近 $WEEKLY_KEEP 周
    - 每月备份: 保留最近 $MONTHLY_KEEP 个月
EOF
}

# ============================================
# 主程序
# ============================================
main() {
    local command=${1:-help}
    
    case $command in
        run)
            run_backup
            ;;
        restore)
            if [ -z "$2" ]; then
                log_error "请指定备份文件"
                show_help
                exit 1
            fi
            restore_backup "$2"
            ;;
        list)
            list_backups
            ;;
        cleanup)
            create_backup_dirs
            cleanup_old_backups
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

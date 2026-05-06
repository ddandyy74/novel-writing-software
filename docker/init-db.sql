-- ============================================
-- 网文作者码字软件 - 数据库初始化脚本
-- ============================================
-- 此脚本在 PostgreSQL 容器首次启动时自动执行

-- 设置客户端编码
SET client_encoding = 'UTF8';

-- ============================================
-- 创建扩展
-- ============================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- 创建初始管理员账户
-- ============================================
-- 密码: admin123 (生产环境请立即修改)
INSERT INTO users (
    id,
    email,
    nickname,
    password_hash,
    role,
    settings,
    created_at,
    updated_at
) VALUES (
    uuid_generate_v4(),
    'admin@novel-writer.com',
    '系统管理员',
    '$2b$10$YourHashedPasswordHere', -- 生产环境需要替换为真实密码哈希
    'admin',
    '{"theme": "light", "language": "zh-CN"}',
    NOW(),
    NOW()
) ON CONFLICT (email) DO NOTHING;

-- ============================================
-- 创建初始系统配置
-- ============================================
CREATE TABLE IF NOT EXISTS system_config (
    key VARCHAR(255) PRIMARY KEY,
    value JSONB NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO system_config (key, value, description) VALUES
('app_version', '"1.0.0"', '应用版本'),
('maintenance_mode', 'false', '维护模式'),
('max_upload_size', '10485760', '最大上传文件大小(字节)')
ON CONFLICT (key) DO NOTHING;

-- ============================================
-- 创建索引优化（补充 Prisma 未创建的索引）
-- ============================================
-- 用户相关索引
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);

-- 作品相关索引
CREATE INDEX IF NOT EXISTS idx_works_user_id_status ON works(user_id, status);
CREATE INDEX IF NOT EXISTS idx_works_genre ON works(genre);

-- 章节相关索引
CREATE INDEX IF NOT EXISTS idx_chapters_work_id_order ON chapters(work_id, "order");

-- 角色相关索引
CREATE INDEX IF NOT EXISTS idx_characters_name ON characters(name);

-- 写作记录索引
CREATE INDEX IF NOT EXISTS idx_writing_records_date ON writing_records(date);

-- 同步日志索引
CREATE INDEX IF NOT EXISTS idx_sync_logs_created_at ON sync_logs(created_at);

-- 安全日志索引
CREATE INDEX IF NOT EXISTS idx_security_logs_event_created_at ON security_logs(event, created_at);

-- ============================================
-- 创建视图
-- ============================================
-- 用户写作统计视图
CREATE OR REPLACE VIEW user_writing_stats AS
SELECT 
    u.id AS user_id,
    u.nickname,
    COUNT(DISTINCT w.id) AS total_works,
    SUM(w.word_count) AS total_words,
    COUNT(DISTINCT c.id) AS total_chapters,
    MAX(w.updated_at) AS last_active_at
FROM users u
LEFT JOIN works w ON w.user_id = u.id AND w.deleted_at IS NULL
LEFT JOIN chapters c ON c.work_id = w.id AND c.deleted_at IS NULL
WHERE u.deleted_at IS NULL
GROUP BY u.id, u.nickname;

-- 作品统计视图
CREATE OR REPLACE VIEW work_statistics AS
SELECT 
    w.id AS work_id,
    w.title,
    w.user_id,
    w.word_count,
    w.chapter_count,
    COUNT(DISTINCT c.id) AS character_count,
    COUNT(DISTINCT o.id) AS outline_count,
    MAX(c.updated_at) AS last_chapter_update
FROM works w
LEFT JOIN chapters c ON c.work_id = w.id AND c.deleted_at IS NULL
LEFT JOIN characters ch ON ch.work_id = w.id AND ch.deleted_at IS NULL
LEFT JOIN outlines o ON o.work_id = w.id
WHERE w.deleted_at IS NULL
GROUP BY w.id, w.title, w.user_id, w.word_count, w.chapter_count;

-- ============================================
-- 创建函数
-- ============================================
-- 自动更新 updated_at 字段
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 为需要的表创建触发器
DO $$
DECLARE
    t text;
BEGIN
    FOR t IN SELECT table_name FROM information_schema.tables 
             WHERE table_schema = 'public' 
             AND table_type = 'BASE TABLE'
             AND table_name IN ('users', 'works', 'chapters', 'characters', 'outlines')
    LOOP
        EXECUTE format('DROP TRIGGER IF EXISTS update_%s_updated_at ON %s', t, t);
        EXECUTE format('CREATE TRIGGER update_%s_updated_at BEFORE UPDATE ON %s FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()', t, t);
    END LOOP;
END;
$$;

-- ============================================
-- 创建数据库用户权限
-- ============================================
-- 授予应用用户必要权限
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO novel_writer;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO novel_writer;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO novel_writer;

-- ============================================
-- 初始化完成
-- ============================================
-- 输出初始化完成信息
DO $$
BEGIN
    RAISE NOTICE '========================================';
    RAISE NOTICE '数据库初始化完成！';
    RAISE NOTICE '时间: %', NOW();
    RAISE NOTICE '========================================';
END
$$;

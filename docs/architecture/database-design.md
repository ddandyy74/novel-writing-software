# 网文作者码字软件数据库设计文档

**版本**: v1.0  
**日期**: 2026-05-06  
**架构师**: 数据库优化

---

## 1. 数据库概述

### 1.1 数据库选型

| 环境 | 数据库 | 理由 |
|------|--------|------|
| **本地** | SQLite (better-sqlite3) | 轻量、无需服务器、支持加密 |
| **云端** | PostgreSQL 15+ | 功能强大、可靠性高、支持 JSON |
| **缓存** | Redis 7+ | 高性能、支持多种数据结构 |

### 1.2 数据库设计原则

| 原则 | 描述 |
|------|------|
| **离线优先** | 本地数据库为主，云端同步为辅 |
| **版本控制** | 数据版本化，支持冲突检测 |
| **索引优化** | 合理设计索引，提升查询性能 |
| **数据安全** | 敏感数据加密存储 |

---

## 2. 本地数据库设计 (SQLite)

### 2.1 核心表结构

#### 用户表 (users)

```sql
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  nickname TEXT NOT NULL,
  avatar TEXT,
  password_hash TEXT NOT NULL,
  settings TEXT DEFAULT '{}',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  version INTEGER DEFAULT 1
);

CREATE INDEX idx_users_email ON users(email);
```

**字段说明**:
- `id`: 用户唯一标识（UUID）
- `settings`: 用户配置（JSON 格式）
- `version`: 数据版本号（用于同步）

---

#### 作品表 (works)

```sql
CREATE TABLE works (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  genre TEXT,
  description TEXT,
  tags TEXT DEFAULT '[]',
  status TEXT DEFAULT 'draft',
  word_count INTEGER DEFAULT 0,
  chapter_count INTEGER DEFAULT 0,
  cover_url TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  version INTEGER DEFAULT 1,
  deleted_at DATETIME,
  
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE INDEX idx_works_user_id ON works(user_id);
CREATE INDEX idx_works_status ON works(status);
CREATE INDEX idx_works_updated_at ON works(updated_at);
```

**字段说明**:
- `status`: 作品状态（draft/published/archived）
- `tags`: 标签列表（JSON 数组）
- `deleted_at`: 软删除时间戳

---

#### 章节表 (chapters)

```sql
CREATE TABLE chapters (
  id TEXT PRIMARY KEY,
  work_id TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  word_count INTEGER DEFAULT 0,
  `order` INTEGER NOT NULL,
  status TEXT DEFAULT 'draft',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  version INTEGER DEFAULT 1,
  deleted_at DATETIME,
  
  FOREIGN KEY (work_id) REFERENCES works(id) ON DELETE CASCADE
);

CREATE INDEX idx_chapters_work_id ON chapters(work_id);
CREATE INDEX idx_chapters_order ON chapters(work_id, `order`);
CREATE INDEX idx_chapters_status ON chapters(status);
```

**字段说明**:
- `order`: 章节顺序（从 1 开始）
- `content`: 章节内容（文本）

---

#### 角色表 (characters)

```sql
CREATE TABLE characters (
  id TEXT PRIMARY KEY,
  work_id TEXT NOT NULL,
  name TEXT NOT NULL,
  age INTEGER,
  gender TEXT,
  appearance TEXT,
  personality TEXT,
  background TEXT,
  abilities TEXT DEFAULT '[]',
  tags TEXT DEFAULT '[]',
  avatar_url TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  version INTEGER DEFAULT 1,
  deleted_at DATETIME,
  
  FOREIGN KEY (work_id) REFERENCES works(id) ON DELETE CASCADE
);

CREATE INDEX idx_characters_work_id ON characters(work_id);
CREATE INDEX idx_characters_name ON characters(work_id, name);
```

**字段说明**:
- `abilities`: 能力列表（JSON 数组）
- `tags`: 标签列表（如主角、配角、反派）

---

#### 角色关系表 (character_relations)

```sql
CREATE TABLE character_relations (
  id TEXT PRIMARY KEY,
  work_id TEXT NOT NULL,
  character_id_1 TEXT NOT NULL,
  character_id_2 TEXT NOT NULL,
  relation_type TEXT NOT NULL,
  description TEXT,
  start_chapter INTEGER,
  end_chapter INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  version INTEGER DEFAULT 1,
  
  FOREIGN KEY (work_id) REFERENCES works(id) ON DELETE CASCADE,
  FOREIGN KEY (character_id_1) REFERENCES characters(id) ON DELETE CASCADE,
  FOREIGN KEY (character_id_2) REFERENCES characters(id) ON DELETE CASCADE
);

CREATE INDEX idx_relations_work_id ON character_relations(work_id);
CREATE INDEX idx_relations_characters ON character_relations(character_id_1, character_id_2);
```

**字段说明**:
- `relation_type`: 关系类型（friend/enemy/lover/family/teacher_student/other）
- `start_chapter`: 关系开始章节
- `end_chapter`: 关系结束章节

---

#### 大纲表 (outlines)

```sql
CREATE TABLE outlines (
  id TEXT PRIMARY KEY,
  work_id TEXT NOT NULL,
  chapter_id TEXT UNIQUE,
  chapter_number INTEGER NOT NULL,
  title TEXT,
  summary TEXT,
  characters TEXT DEFAULT '[]',
  events TEXT DEFAULT '[]',
  foreshadowing TEXT DEFAULT '[]',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  version INTEGER DEFAULT 1,
  
  FOREIGN KEY (work_id) REFERENCES works(id) ON DELETE CASCADE,
  FOREIGN KEY (chapter_id) REFERENCES chapters(id) ON DELETE SET NULL
);

CREATE INDEX idx_outlines_work_id ON outlines(work_id);
CREATE INDEX idx_outlines_chapter_number ON outlines(work_id, chapter_number);
```

**字段说明**:
- `characters`: 涉及角色列表（JSON 数组）
- `events`: 关键事件列表（JSON 数组）
- `foreshadowing`: 伏笔列表（JSON 数组）

---

#### 写作目标表 (writing_goals)

```sql
CREATE TABLE writing_goals (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  work_id TEXT,
  goal_type TEXT NOT NULL,
  target_value INTEGER NOT NULL,
  current_value INTEGER DEFAULT 0,
  period TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status TEXT DEFAULT 'active',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (work_id) REFERENCES works(id) ON DELETE CASCADE
);

CREATE INDEX idx_goals_user_id ON writing_goals(user_id);
CREATE INDEX idx_goals_period ON writing_goals(user_id, period, start_date);
```

**字段说明**:
- `goal_type`: 目标类型（daily_word_count/weekly_chapter/monthly_word）
- `period`: 周期（daily/weekly/monthly）
- `target_value`: 目标值
- `current_value`: 当前进度

---

#### 写作记录表 (writing_records)

```sql
CREATE TABLE writing_records (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  work_id TEXT,
  date DATE NOT NULL,
  word_count INTEGER DEFAULT 0,
  writing_duration INTEGER DEFAULT 0,
  chapters_written INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (work_id) REFERENCES works(id) ON DELETE CASCADE,
  
  UNIQUE(user_id, date)
);

CREATE INDEX idx_records_user_date ON writing_records(user_id, date);
CREATE INDEX idx_records_work_date ON writing_records(work_id, date);
```

**字段说明**:
- `word_count`: 当日写作字数
- `writing_duration`: 写作时长（秒）
- `chapters_written`: 完成的章节数

---

#### 同步队列表 (sync_queue)

```sql
CREATE TABLE sync_queue (
  id TEXT PRIMARY KEY,
  table_name TEXT NOT NULL,
  record_id TEXT NOT NULL,
  action TEXT NOT NULL,
  data TEXT,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  synced INTEGER DEFAULT 0,
  synced_at DATETIME,
  
  CREATE INDEX idx_sync_queue_synced ON sync_queue(synced, timestamp);
);
```

**字段说明**:
- `action`: 操作类型（create/update/delete）
- `data`: 变更数据（JSON）
- `synced`: 是否已同步

---

#### 版本历史表 (version_history)

```sql
CREATE TABLE version_history (
  id TEXT PRIMARY KEY,
  table_name TEXT NOT NULL,
  record_id TEXT NOT NULL,
  version INTEGER NOT NULL,
  data TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  CREATE INDEX idx_version_history ON version_history(table_name, record_id, version);
);
```

**字段说明**:
- 用于存储数据版本历史，支持回滚

---

### 2.2 触发器

#### 自动更新 updated_at

```sql
CREATE TRIGGER update_timestamp
AFTER UPDATE ON works
BEGIN
  UPDATE works SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

CREATE TRIGGER update_chapter_timestamp
AFTER UPDATE ON chapters
BEGIN
  UPDATE chapters SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;
```

#### 自动更新字数统计

```sql
CREATE TRIGGER update_word_count
AFTER INSERT OR UPDATE ON chapters
BEGIN
  UPDATE works 
  SET word_count = (
    SELECT COALESCE(SUM(word_count), 0) 
    FROM chapters 
    WHERE work_id = NEW.work_id AND deleted_at IS NULL
  ),
  chapter_count = (
    SELECT COUNT(*) 
    FROM chapters 
    WHERE work_id = NEW.work_id AND deleted_at IS NULL
  )
  WHERE id = NEW.work_id;
END;
```

---

### 2.3 索引策略

| 表名 | 索引名 | 字段 | 类型 | 用途 |
|------|--------|------|------|------|
| works | idx_works_user_id | user_id | B-Tree | 按用户查询作品 |
| works | idx_works_updated_at | updated_at | B-Tree | 按更新时间排序 |
| chapters | idx_chapters_work_id | work_id | B-Tree | 按作品查询章节 |
| chapters | idx_chapters_order | work_id, order | B-Tree | 章节排序 |
| characters | idx_characters_work_id | work_id | B-Tree | 按作品查询角色 |

---

## 3. 云端数据库设计 (PostgreSQL)

### 3.1 表结构

云端表结构与本地基本一致，但增加以下字段：

```sql
-- 所有表增加字段
ALTER TABLE works ADD COLUMN user_id TEXT NOT NULL;
ALTER TABLE works ADD COLUMN last_sync_at TIMESTAMP;

-- 同步日志表
CREATE TABLE sync_logs (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  client_id TEXT NOT NULL,
  sync_type TEXT NOT NULL,
  changes_count INTEGER DEFAULT 0,
  conflicts_count INTEGER DEFAULT 0,
  duration_ms INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_sync_logs_user ON sync_logs(user_id, created_at);
```

### 3.2 PostgreSQL 特有功能

#### JSONB 字段

```sql
-- 使用 JSONB 存储复杂结构
ALTER TABLE works ALTER COLUMN settings TYPE JSONB USING settings::jsonb;
ALTER TABLE works ALTER COLUMN tags TYPE JSONB USING tags::jsonb;

-- JSONB 查询
SELECT * FROM works WHERE tags @> '["玄幻"]';
```

#### 全文搜索

```sql
-- 章节内容全文搜索
ALTER TABLE chapters ADD COLUMN content_search tsvector;

CREATE INDEX idx_chapters_content_search ON chapters USING GIN(content_search);

CREATE OR REPLACE FUNCTION chapters_content_search_trigger() RETURNS trigger AS $$
BEGIN
  NEW.content_search := to_tsvector('chinese', NEW.content);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER chapters_content_search_update
  BEFORE INSERT OR UPDATE ON chapters
  FOR EACH ROW EXECUTE FUNCTION chapters_content_search_trigger();

-- 全文搜索查询
SELECT * FROM chapters 
WHERE content_search @@ to_tsquery('chinese', '主角 & 修炼') 
ORDER BY ts_rank(content_search, to_tsquery('chinese', '主角 & 修炼')) DESC;
```

---

## 4. 数据同步策略

### 4.1 同步流程

```
本地修改
    │
    ▼
写入本地 SQLite
    │
    ├───► 写入 sync_queue（异步）
    │
    └───► 更新本地 UI
              │
              ▼
          网络检测
              │
              ├───► 在线
              │         │
              │         ▼
              │     推送 sync_queue
              │         │
              │         ▼
              │     拉取云端变更
              │         │
              │         ▼
              │     冲突检测与解决
              │         │
              │         ▼
              │     更新本地数据
              │
              └───► 离线
                        │
                        ▼
                    sync_queue 积累
                        │
                        ▼
                    等待联网后同步
```

### 4.2 冲突检测

**基于版本号的冲突检测**:

```
本地数据: version = 5
云端数据: version = 6

推送时:
- 本地 version (5) < 云端 version (6) → 冲突

解决策略:
1. 自动合并（简单字段）
2. 用户选择（复杂字段）
```

### 4.3 同步 API

#### 推送变更

```json
POST /sync/push
{
  "clientId": "client_123",
  "lastSyncTime": "2024-01-01T00:00:00Z",
  "changes": [
    {
      "table": "chapters",
      "action": "update",
      "id": "chapter_123",
      "data": { "title": "新标题", "content": "..." },
      "version": 5,
      "timestamp": "2024-01-01T01:00:00Z"
    }
  ]
}
```

#### 拉取变更

```json
POST /sync/pull
{
  "clientId": "client_123",
  "lastSyncTime": "2024-01-01T00:00:00Z",
  "tables": ["works", "chapters", "characters"]
}

Response:
{
  "syncTime": "2024-01-01T02:00:00Z",
  "changes": [
    {
      "table": "chapters",
      "action": "update",
      "id": "chapter_456",
      "data": { "title": "云端更新" },
      "version": 6,
      "timestamp": "2024-01-01T01:30:00Z"
    }
  ],
  "conflicts": [
    {
      "table": "chapters",
      "id": "chapter_123",
      "localVersion": 5,
      "remoteVersion": 6,
      "localData": { ... },
      "remoteData": { ... }
    }
  ]
}
```

---

## 5. 数据加密

### 5.1 加密策略

| 数据类型 | 加密方式 | 说明 |
|---------|---------|------|
| 密码 | bcrypt (cost=10) | 单向哈希 |
| 本地数据库 | SQLCipher | 整库加密 |
| 敏感字段 | AES-256-GCM | 字段级加密 |
| 传输 | HTTPS (TLS 1.3) | 全程加密 |

### 5.2 本地加密实现

```javascript
// 使用 SQLCipher 加密 SQLite
const Database = require('better-sqlite3');
const db = new Database('novel-writer.db', { 
  verbose: console.log 
});

// 设置加密密钥
db.pragma('key = "your-encryption-key"');

// 验证加密
try {
  db.exec('SELECT count(*) FROM sqlite_master');
} catch (err) {
  console.error('数据库加密验证失败');
}
```

---

## 6. 数据备份

### 6.1 本地备份

```sql
-- 定期备份（每日）
.backup 'backup/novel-writer-20240101.db'

-- 自动备份策略
- 保留最近 7 天的每日备份
- 保留最近 4 周的每周备份
- 保留最近 12 个月的每月备份
```

### 6.2 云端备份

```
云端备份策略:
- 实时: 写前日志 (WAL)
- 每日: 全量备份到对象存储
- 每周: 跨区域备份
- 每月: 归档备份
```

---

## 7. 性能优化

### 7.1 查询优化

**章节列表查询优化**:

```sql
-- 优化前
SELECT * FROM chapters WHERE work_id = ? ORDER BY `order`;

-- 优化后（使用覆盖索引）
SELECT id, title, word_count, `order`, status, updated_at
FROM chapters 
WHERE work_id = ? AND deleted_at IS NULL
ORDER BY `order`;
```

**全文搜索优化**:

```sql
-- 使用全文索引
SELECT id, title, ts_headline(content, query) as highlight
FROM chapters, to_tsquery('chinese', '主角') query
WHERE content_search @@ query
ORDER BY ts_rank(content_search, query) DESC
LIMIT 10;
```

### 7.2 写入优化

```sql
-- 批量插入
INSERT INTO chapters (id, work_id, title, content, `order`)
VALUES 
  (?, ?, ?, ?, ?),
  (?, ?, ?, ?, ?),
  (?, ?, ?, ?, ?);

-- 使用事务
BEGIN TRANSACTION;
-- 多个写操作
COMMIT;
```

---

## 8. 数据迁移

### 8.1 版本迁移

```javascript
// 数据库版本管理
const migrations = [
  {
    version: 1,
    up: (db) => {
      db.exec(`
        CREATE TABLE users (...);
        CREATE TABLE works (...);
      `);
    }
  },
  {
    version: 2,
    up: (db) => {
      db.exec(`
        ALTER TABLE works ADD COLUMN cover_url TEXT;
      `);
    }
  }
];

function runMigrations(db) {
  const currentVersion = getDatabaseVersion(db);
  for (const migration of migrations) {
    if (migration.version > currentVersion) {
      migration.up(db);
      setDatabaseVersion(db, migration.version);
    }
  }
}
```

---

## 9. 监控与告警

### 9.1 监控指标

| 指标 | 阈值 | 告警级别 |
|------|------|----------|
| 数据库大小 | > 500MB | Warning |
| 查询延迟 | > 1s | Warning |
| 同步失败率 | > 5% | Error |
| 冲突率 | > 10% | Warning |

### 9.2 日志记录

```sql
-- 操作日志表
CREATE TABLE operation_logs (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  action TEXT NOT NULL,
  table_name TEXT,
  record_id TEXT,
  details TEXT,
  ip_address TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_logs_user ON operation_logs(user_id, created_at);
CREATE INDEX idx_logs_action ON operation_logs(action, created_at);
```

---

## 10. 下一步

1. ✅ 数据库设计完成
2. ⏳ 安全架构设计（security-design.md）
3. ⏳ AI 技术方案（ai-solution.md）

---

**文档状态**: 初稿完成  
**下一步**: 安全架构设计

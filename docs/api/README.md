# API 文档

网文作者码字软件后端 API 文档

## 文档列表

| 文档 | 描述 |
|------|------|
| [OpenAPI 规范](./openapi.yaml) | 完整的 API 定义文件 |
| [API 设计文档](../../docs/architecture/api-design.md) | API 设计详细文档 |

## 在线文档

启动后端服务后，访问 http://localhost:3000/docs 查看 Swagger UI 交互式文档。

## API 测试

### Postman 集合

1. 导入 `openapi.yaml` 到 Postman
2. 配置环境变量：
   - `baseUrl`: http://localhost:3000/api/v1
   - `token`: 登录后获取的 access token

### 测试用例

查看 `src/backend/tests/` 目录下的测试文件。

## API 概览

### 认证模块

- 用户注册
- 用户登录
- Token 刷新
- 登出

### 用户模块

- 获取用户信息
- 更新用户设置

### 作品模块

- 作品 CRUD
- 章节管理
- 角色管理
- 大纲管理

### 同步模块

- 推送变更
- 拉取变更
- 冲突检测

### AI 模块（待实现）

- 错别字检测
- 大纲生成
- 正文生成

### 发布模块（待实现）

- 多平台发布
- 发布状态查询

## 响应格式

所有 API 统一返回格式：

```json
{
  "code": 0,
  "message": "success",
  "data": {},
  "timestamp": 1715011200000
}
```

错误响应：

```json
{
  "code": 10001,
  "message": "用户名或密码错误",
  "error": {
    "field": "password",
    "reason": "密码错误"
  },
  "timestamp": 1715011200000
}
```

## 错误码

详见 [API 设计文档](../../docs/architecture/api-design.md) 第 6 章。

---

**更新日期**: 2026-05-07

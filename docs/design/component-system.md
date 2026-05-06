# 网文作者码字软件组件设计系统

**版本**: v1.0  
**日期**: 2026-05-07  
**设计师**: UI Designer  
**基于文档**: ui-spec.md、interaction-design.md

---

## 1. 组件设计原则

### 1.1 核心原则

| 原则 | 描述 | 实现方式 |
|------|------|----------|
| **一致性** | 所有组件使用统一的设计语言 | 设计令牌、组件库、样式指南 |
| **可复用** | 组件可跨场景复用 | Props 驱动、插槽设计、组合模式 |
| **可访问性** | 所有组件支持无障碍访问 | ARIA 标签、键盘导航、焦点管理 |
| **可维护性** | 组件易于理解和修改 | 清晰结构、文档完善、类型定义 |

### 1.2 组件分类

```
组件层级结构:
├── 原子组件 (Atoms)
│   ├── Button
│   ├── Input
│   ├── Icon
│   ├── Badge
│   └── Tooltip
│
├── 分子组件 (Molecules)
│   ├── InputField
│   ├── ButtonGroup
│   ├── Card
│   ├── Dropdown
│   └── Modal
│
├── 有机组件 (Organisms)
│   ├── Toolbar
│   ├── Sidebar
│   ├── Editor
│   ├── StatusBar
│   └── AIPanel
│
└── 模板 (Templates)
    ├── EditorLayout
    ├── SplitViewLayout
    └── FocusModeLayout
```

---

## 2. 原子组件 (Atoms)

### 2.1 Button 按钮

#### 2.1.1 设计规范

```
按钮类型:
┌──────────────────────────────────────────────────┐
│  Primary:   [ 主要按钮 ]  - 主要操作              │
│  Secondary: [ 次要按钮 ]  - 次要操作              │
│  Tertiary:  [ 文字按钮 ]  - 辅助操作              │
│  Danger:    [ 危险按钮 ]  - 危险操作              │
│  Ghost:     [ 幽灵按钮 ]  - 弱化操作              │
└──────────────────────────────────────────────────┘

按钮尺寸:
┌──────────────────────────────────────────────────┐
│  Small:   高度 28px, 字号 14px                    │
│  Medium:  高度 36px, 字号 14px (默认)             │
│  Large:   高度 44px, 字号 16px                    │
└──────────────────────────────────────────────────┘

按钮状态:
┌──────────────────────────────────────────────────┐
│  Default   - 默认状态                             │
│  Hover     - 悬停状态                             │
│  Active    - 激活状态                             │
│  Focus     - 焦点状态                             │
│  Disabled  - 禁用状态                             │
│  Loading   - 加载状态                             │
└──────────────────────────────────────────────────┘
```

#### 2.1.2 组件代码

```tsx
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'danger' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon: Icon,
  iconPosition = 'left',
  children,
  onClick,
  className = '',
}) => {
  const baseStyles = `
    inline-flex items-center justify-center
    font-medium rounded-md
    transition-all duration-150 ease-out
    focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
  `;

  const variantStyles = {
    primary: `
      bg-[var(--color-primary-500)] text-white
      hover:bg-[var(--color-primary-600)] active:bg-[var(--color-primary-700)]
      focus-visible:ring-[var(--color-primary-500)]
    `,
    secondary: `
      bg-[var(--color-neutral-100)] text-[var(--color-text-primary)]
      hover:bg-[var(--color-neutral-200)] active:bg-[var(--color-neutral-300)]
      focus-visible:ring-[var(--color-neutral-500)]
    `,
    tertiary: `
      text-[var(--color-primary-500)]
      hover:bg-[var(--color-primary-50)]
      focus-visible:ring-[var(--color-primary-500)]
    `,
    danger: `
      bg-[var(--color-error)] text-white
      hover:opacity-90 active:opacity-80
      focus-visible:ring-[var(--color-error)]
    `,
    ghost: `
      text-[var(--color-text-secondary)]
      hover:bg-[var(--color-neutral-100)] hover:text-[var(--color-text-primary)]
      focus-visible:ring-[var(--color-neutral-500)]
    `,
  };

  const sizeStyles = {
    small: 'h-7 px-3 text-sm gap-1.5',
    medium: 'h-9 px-4 text-sm gap-2',
    large: 'h-11 px-6 text-base gap-2.5',
  };

  const iconSizes = {
    small: 14,
    medium: 16,
    large: 18,
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      disabled={disabled || loading}
      onClick={onClick}
    >
      {loading && (
        <svg
          className="animate-spin -ml-1 mr-2"
          width={iconSizes[size]}
          height={iconSizes[size]}
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      )}
      {Icon && iconPosition === 'left' && !loading && (
        <Icon size={iconSizes[size]} />
      )}
      {children}
      {Icon && iconPosition === 'right' && !loading && (
        <Icon size={iconSizes[size]} />
      )}
    </button>
  );
};
```

#### 2.1.3 使用示例

```tsx
// 主要按钮
<Button variant="primary">保存</Button>

// 带图标的按钮
<Button variant="primary" icon={Save}>保存</Button>

// 加载状态
<Button variant="primary" loading>保存中...</Button>

// 禁用状态
<Button variant="primary" disabled>保存</Button>

// 危险操作
<Button variant="danger" icon={Trash}>删除章节</Button>
```

---

### 2.2 Input 输入框

#### 2.2.1 设计规范

```
输入框类型:
┌──────────────────────────────────────────────────┐
│  Text      - 文本输入                              │
│  Number    - 数字输入                              │
│  Search    - 搜索输入                              │
│  Password  - 密码输入                              │
│  Textarea  - 多行文本                              │
└──────────────────────────────────────────────────┘

输入框状态:
┌──────────────────────────────────────────────────┐
│  Default   - 默认状态                             │
│  Hover     - 悬停状态                             │
│  Focus     - 焦点状态                             │
│  Error     - 错误状态                             │
│  Disabled  - 禁用状态                             │
└──────────────────────────────────────────────────┘

尺寸规范:
- Small:  高度 28px, 字号 14px
- Medium: 高度 36px, 字号 14px (默认)
- Large:  高度 44px, 字号 16px
```

#### 2.2.2 组件代码

```tsx
import React, { forwardRef } from 'react';
import { LucideIcon } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  size?: 'small' | 'medium' | 'large';
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      hint,
      icon: Icon,
      iconPosition = 'left',
      size = 'medium',
      className = '',
      ...props
    },
    ref
  ) => {
    const baseStyles = `
      w-full rounded-md border
      bg-[var(--color-bg-primary)]
      text-[var(--color-text-primary)]
      placeholder:text-[var(--color-text-tertiary)]
      transition-all duration-150
      focus:outline-none focus:ring-2 focus:ring-offset-0
    `;

    const sizeStyles = {
      small: 'h-7 px-3 text-sm',
      medium: 'h-9 px-3 text-sm',
      large: 'h-11 px-4 text-base',
    };

    const stateStyles = error
      ? `
          border-[var(--color-error)]
          focus:border-[var(--color-error)] focus:ring-[var(--color-error)]
        `
      : `
          border-[var(--color-border-medium)]
          hover:border-[var(--color-border-dark)]
          focus:border-[var(--color-primary-500)] focus:ring-[var(--color-primary-500)]
        `;

    const disabledStyles = props.disabled
      ? 'opacity-50 cursor-not-allowed bg-[var(--color-bg-secondary)]'
      : '';

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label className="text-sm font-medium text-[var(--color-text-primary)]">
            {label}
            {props.required && <span className="text-[var(--color-error)] ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          {Icon && iconPosition === 'left' && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-tertiary)]">
              <Icon size={16} />
            </div>
          )}
          <input
            ref={ref}
            className={`
              ${baseStyles}
              ${sizeStyles[size]}
              ${stateStyles}
              ${disabledStyles}
              ${Icon && iconPosition === 'left' ? 'pl-9' : ''}
              ${Icon && iconPosition === 'right' ? 'pr-9' : ''}
              ${className}
            `}
            {...props}
          />
          {Icon && iconPosition === 'right' && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-tertiary)]">
              <Icon size={16} />
            </div>
          )}
        </div>
        {error && (
          <span className="text-sm text-[var(--color-error)]">{error}</span>
        )}
        {hint && !error && (
          <span className="text-sm text-[var(--color-text-tertiary)]">{hint}</span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
```

---

### 2.3 Badge 徽章

#### 2.3.1 设计规范

```
徽章类型:
┌──────────────────────────────────────────────────┐
│  Default   - 默认徽章                             │
│  Primary   - 主要徽章                             │
│  Success   - 成功徽章                             │
│  Warning   - 警告徽章                             │
│  Error     - 错误徽章                             │
└──────────────────────────────────────────────────┘

尺寸规范:
- Small:  高度 20px, 字号 12px
- Medium: 高度 24px, 字号 14px (默认)
```

#### 2.3.2 组件代码

```tsx
import React from 'react';

interface BadgeProps {
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error';
  size?: 'small' | 'medium';
  children: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  size = 'medium',
  children,
  className = '',
}) => {
  const baseStyles = `
    inline-flex items-center justify-center
    font-medium rounded-full
  `;

  const variantStyles = {
    default: 'bg-[var(--color-neutral-100)] text-[var(--color-text-secondary)]',
    primary: 'bg-[var(--color-primary-100)] text-[var(--color-primary-700)]',
    success: 'bg-[var(--color-success)]/10 text-[var(--color-success)]',
    warning: 'bg-[var(--color-warning)]/10 text-[var(--color-warning)]',
    error: 'bg-[var(--color-error)]/10 text-[var(--color-error)]',
  };

  const sizeStyles = {
    small: 'h-5 px-2 text-xs',
    medium: 'h-6 px-2.5 text-sm',
  };

  return (
    <span className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}>
      {children}
    </span>
  );
};
```

---

### 2.4 Tooltip 工具提示

#### 2.4.1 设计规范

```
工具提示位置:
┌──────────────────────────────────────────────────┐
│  Top       - 顶部                                 │
│  Bottom    - 底部                                 │
│  Left      - 左侧                                 │
│  Right     - 右侧                                 │
└──────────────────────────────────────────────────┘

触发方式:
- Hover: 鼠标悬停触发
- Focus: 焦点触发

显示延迟:
- 显示: 500ms
- 隐藏: 100ms
```

#### 2.4.2 组件代码

```tsx
import React, { useState } from 'react';

interface TooltipProps {
  content: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
  children: React.ReactElement;
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  position = 'top',
  delay = 500,
  children,
}) => {
  const [visible, setVisible] = useState(false);
  let timeout: NodeJS.Timeout;

  const showTooltip = () => {
    timeout = setTimeout(() => setVisible(true), delay);
  };

  const hideTooltip = () => {
    clearTimeout(timeout);
    setVisible(false);
  };

  const positionStyles = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  const arrowStyles = {
    top: 'top-full left-1/2 -translate-x-1/2 border-t-[var(--color-neutral-800)]',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 border-b-[var(--color-neutral-800)]',
    left: 'left-full top-1/2 -translate-y-1/2 border-l-[var(--color-neutral-800)]',
    right: 'right-full top-1/2 -translate-y-1/2 border-r-[var(--color-neutral-800)]',
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
    >
      {children}
      {visible && (
        <div
          className={`
            absolute z-50
            ${positionStyles[position]}
            px-3 py-2
            bg-[var(--color-neutral-800)] text-white
            text-sm rounded-md shadow-lg
            animate-fade-in
          `}
          role="tooltip"
        >
          {content}
          <div
            className={`
              absolute w-0 h-0
              border-4 border-transparent
              ${arrowStyles[position]}
            `}
          />
        </div>
      )}
    </div>
  );
};
```

---

## 3. 分子组件 (Molecules)

### 3.1 Card 卡片

#### 3.1.1 设计规范

```
卡片结构:
┌──────────────────────────────────────────────────┐
│  ┌────────────────────────────────────────────┐  │
│  │  Header (可选)                               │  │
│  └────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────┐  │
│  │                                              │  │
│  │  Content                                     │  │
│  │                                              │  │
│  └────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────┐  │
│  │  Footer (可选)                               │  │
│  └────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────┘

卡片状态:
- Default: 默认状态
- Hover: 悬停状态（提升阴影）
- Active: 激活状态（边框高亮）
```

#### 3.1.2 组件代码

```tsx
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  hoverable?: boolean;
  active?: boolean;
  padding?: 'none' | 'small' | 'medium' | 'large';
  className?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  header,
  footer,
  hoverable = false,
  active = false,
  padding = 'medium',
  className = '',
}) => {
  const baseStyles = `
    bg-[var(--color-bg-elevated)]
    border border-[var(--color-border-light)]
    rounded-lg
    overflow-hidden
    transition-all duration-200
  `;

  const hoverStyles = hoverable
    ? 'hover:shadow-md hover:-translate-y-0.5 cursor-pointer'
    : '';

  const activeStyles = active
    ? 'border-[var(--color-primary-500)] shadow-sm'
    : '';

  const paddingStyles = {
    none: '',
    small: 'p-3',
    medium: 'p-4',
    large: 'p-6',
  };

  return (
    <div className={`${baseStyles} ${hoverStyles} ${activeStyles} ${className}`}>
      {header && (
        <div className="border-b border-[var(--color-border-light)] px-4 py-3">
          {header}
        </div>
      )}
      <div className={paddingStyles[padding]}>{children}</div>
      {footer && (
        <div className="border-t border-[var(--color-border-light)] px-4 py-3 bg-[var(--color-bg-secondary)]">
          {footer}
        </div>
      )}
    </div>
  );
};
```

---

### 3.2 Dropdown 下拉菜单

#### 3.2.1 设计规范

```
下拉菜单结构:
┌──────────────────────────────────────────────────┐
│  [触发按钮 ▼]                                     │
│  ┌────────────────────────────────────────────┐  │
│  │  菜单项 1                                    │  │
│  │  菜单项 2                                    │  │
│  │  ────────────────────                       │  │
│  │  菜单项 3                                    │  │
│  │  菜单项 4                                    │  │
│  └────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────┘

菜单项类型:
- 默认菜单项
- 禁用菜单项
- 分隔线
- 带图标的菜单项
- 危险操作菜单项
```

#### 3.2.2 组件代码

```tsx
import React, { useState, useRef, useEffect } from 'react';
import { LucideIcon } from 'lucide-react';

interface DropdownItem {
  label: string;
  icon?: LucideIcon;
  danger?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

interface DropdownProps {
  trigger: React.ReactNode;
  items: DropdownItem[];
  position?: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right';
}

export const Dropdown: React.FC<DropdownProps> = ({
  trigger,
  items,
  position = 'bottom-left',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const positionStyles = {
    'bottom-left': 'top-full left-0 mt-1',
    'bottom-right': 'top-full right-0 mt-1',
    'top-left': 'bottom-full left-0 mb-1',
    'top-right': 'bottom-full right-0 mb-1',
  };

  return (
    <div ref={dropdownRef} className="relative inline-block">
      <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>
      {isOpen && (
        <div
          className={`
            absolute z-50
            ${positionStyles[position]}
            min-w-[180px]
            bg-[var(--color-bg-elevated)]
            border border-[var(--color-border-light)]
            rounded-md shadow-lg
            py-1
            animate-fade-in
          `}
        >
          {items.map((item, index) => {
            if (item.label === '---') {
              return (
                <div
                  key={index}
                  className="my-1 border-t border-[var(--color-border-light)]"
                />
              );
            }

            const Icon = item.icon;
            return (
              <button
                key={index}
                className={`
                  w-full px-4 py-2 text-left text-sm
                  flex items-center gap-2
                  transition-colors duration-150
                  disabled:opacity-50 disabled:cursor-not-allowed
                  ${
                    item.disabled
                      ? ''
                      : item.danger
                      ? 'text-[var(--color-error)] hover:bg-[var(--color-error)]/10'
                      : 'hover:bg-[var(--color-bg-secondary)]'
                  }
                `}
                disabled={item.disabled}
                onClick={() => {
                  item.onClick?.();
                  setIsOpen(false);
                }}
              >
                {Icon && <Icon size={16} />}
                {item.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
```

---

### 3.3 Modal 模态框

#### 3.3.1 设计规范

```
模态框结构:
┌──────────────────────────────────────────────────┐
│  标题                                    [× 关闭] │
├──────────────────────────────────────────────────┤
│                                                  │
│  内容区域                                         │
│                                                  │
├──────────────────────────────────────────────────┤
│                          [取消]  [确认]           │
└──────────────────────────────────────────────────┘

尺寸规范:
- Small:  宽度 400px
- Medium: 宽度 560px (默认)
- Large:  宽度 720px
- Full:   宽度 90% 最大 1200px
```

#### 3.3.2 组件代码

```tsx
import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: 'small' | 'medium' | 'large' | 'full';
  children: React.ReactNode;
  footer?: React.ReactNode;
  closeOnOverlayClick?: boolean;
  showCloseButton?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  size = 'medium',
  children,
  footer,
  closeOnOverlayClick = true,
  showCloseButton = true,
}) => {
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeStyles = {
    small: 'max-w-md',
    medium: 'max-w-xl',
    large: 'max-w-3xl',
    full: 'max-w-5xl',
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 animate-fade-in"
        onClick={closeOnOverlayClick ? onClose : undefined}
      />

      {/* Modal Content */}
      <div
        className={`
          relative z-10
          w-full ${sizeStyles[size]}
          bg-[var(--color-bg-elevated)]
          rounded-lg shadow-xl
          animate-scale-in
        `}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-border-light)]">
            {title && (
              <h2
                id="modal-title"
                className="text-lg font-semibold text-[var(--color-text-primary)]"
              >
                {title}
              </h2>
            )}
            {showCloseButton && (
              <button
                className="p-1 rounded-md text-[var(--color-text-tertiary)] hover:bg-[var(--color-bg-secondary)] transition-colors"
                onClick={onClose}
                aria-label="关闭"
              >
                <X size={20} />
              </button>
            )}
          </div>
        )}

        {/* Body */}
        <div className="px-6 py-4 max-h-[70vh] overflow-y-auto">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[var(--color-border-light)] bg-[var(--color-bg-secondary)]">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
```

---

## 4. 有机组件 (Organisms)

### 4.1 Toolbar 工具栏

#### 4.1.1 设计规范

```
工具栏结构:
┌────────────────────────────────────────────────────────────┐
│  [⬇ 已保存] 字数: 3,247 | 今日: 1,832/4000    [主题] [⚙]  │
└────────────────────────────────────────────────────────────┘

功能区域:
- 左侧: 保存状态、字数统计
- 中间: 分隔符
- 右侧: 主题切换、设置菜单

高度: 48px
背景: var(--color-bg-primary)
边框: 底部边框
```

#### 4.1.2 组件代码

```tsx
import React from 'react';
import { Save, Sun, Moon, Settings, Menu } from 'lucide-react';
import { Button } from '../atoms/Button';
import { Dropdown } from '../molecules/Dropdown';

interface ToolbarProps {
  saved: boolean;
  totalWords: number;
  chapterWords: number;
  todayWords: number;
  todayGoal: number;
  theme: 'default' | 'eye-care' | 'dark';
  onThemeChange: (theme: 'default' | 'eye-care' | 'dark') => void;
  onSettingsClick: () => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  saved,
  totalWords,
  chapterWords,
  todayWords,
  todayGoal,
  theme,
  onThemeChange,
  onSettingsClick,
}) => {
  const progress = Math.min((todayWords / todayGoal) * 100, 100);

  return (
    <div className="h-12 px-4 flex items-center justify-between bg-[var(--color-bg-primary)] border-b border-[var(--color-border-light)]">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Save
            size={16}
            className={saved ? 'text-[var(--color-success)]' : 'text-[var(--color-text-tertiary)]'}
          />
          <span className="text-sm text-[var(--color-text-secondary)]">
            {saved ? '已保存' : '保存中...'}
          </span>
        </div>

        <div className="h-4 w-px bg-[var(--color-border-light)]" />

        <div className="flex items-center gap-4 text-sm">
          <span>
            总字数: <span className="font-mono text-[var(--color-text-primary)]">{totalWords.toLocaleString()}</span>
          </span>
          <span>
            本章: <span className="font-mono text-[var(--color-text-primary)]">{chapterWords.toLocaleString()}</span>
          </span>
          <span>
            今日: <span className="font-mono text-[var(--color-text-primary)]">{todayWords.toLocaleString()}</span>
            /{todayGoal.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2">
        {/* Progress Bar */}
        <div className="w-32 h-2 bg-[var(--color-bg-tertiary)] rounded-full overflow-hidden">
          <div
            className="h-full bg-[var(--color-primary-500)] transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Theme Switcher */}
        <Dropdown
          trigger={
            <Button variant="ghost" size="small" icon={theme === 'dark' ? Moon : Sun}>
              主题
            </Button>
          }
          items={[
            { label: '默认主题', onClick: () => onThemeChange('default') },
            { label: '护眼模式', onClick: () => onThemeChange('eye-care') },
            { label: '夜间模式', onClick: () => onThemeChange('dark') },
          ]}
        />

        {/* Settings */}
        <Button variant="ghost" size="small" icon={Settings} onClick={onSettingsClick}>
          设置
        </Button>
      </div>
    </div>
  );
};
```

---

### 4.2 Sidebar 侧边栏

#### 4.2.1 设计规范

```
侧边栏结构:
┌─────────────────────────────────┐
│  作品列表                        │
│  ┌─────────────────────────┐   │
│  │ 《剑道独尊》             │   │
│  │ 《都市之王》             │   │
│  └─────────────────────────┘   │
│                                  │
│  章节树                          │
│  ┌─────────────────────────┐   │
│  │ ▼ 第三十七章             │   │
│  │ ▼ 第三十八章 (当前)      │   │
│  │ ▼ 第三十九章             │   │
│  └─────────────────────────┘   │
│                                  │
│  快捷功能                        │
│  [大纲] [角色] [发布]            │
└─────────────────────────────────┘

宽度: 240-320px (可拖拽调整)
最小宽度: 200px
最大宽度: 400px
```

#### 4.2.2 组件代码

```tsx
import React, { useState } from 'react';
import { ChevronDown, ChevronRight, FileText, Folder, Users, List, Send } from 'lucide-react';

interface Chapter {
  id: string;
  title: string;
  wordCount: number;
  children?: Chapter[];
}

interface Work {
  id: string;
  title: string;
  chapters: Chapter[];
}

interface SidebarProps {
  works: Work[];
  currentWorkId: string;
  currentChapterId: string;
  onChapterSelect: (chapterId: string) => void;
  onWorkSelect: (workId: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  works,
  currentWorkId,
  currentChapterId,
  onChapterSelect,
  onWorkSelect,
}) => {
  const [expandedChapters, setExpandedChapters] = useState<Set<string>>(new Set());

  const toggleChapter = (chapterId: string) => {
    const newExpanded = new Set(expandedChapters);
    if (newExpanded.has(chapterId)) {
      newExpanded.delete(chapterId);
    } else {
      newExpanded.add(chapterId);
    }
    setExpandedChapters(newExpanded);
  };

  const renderChapter = (chapter: Chapter, level = 0) => {
    const isExpanded = expandedChapters.has(chapter.id);
    const isCurrent = chapter.id === currentChapterId;
    const hasChildren = chapter.children && chapter.children.length > 0;

    return (
      <div key={chapter.id}>
        <div
          className={`
            flex items-center gap-2 px-3 py-2 cursor-pointer
            ${isCurrent ? 'bg-[var(--color-primary-50)] text-[var(--color-primary-700)]' : 'hover:bg-[var(--color-bg-secondary)]'}
          `}
          style={{ paddingLeft: `${12 + level * 16}px` }}
          onClick={() => {
            if (hasChildren) {
              toggleChapter(chapter.id);
            }
            onChapterSelect(chapter.id);
          }}
        >
          {hasChildren && (
            <span className="w-4 h-4 flex items-center justify-center">
              {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </span>
          )}
          {!hasChildren && <FileText size={14} className="text-[var(--color-text-tertiary)]" />}
          <span className="flex-1 text-sm truncate">{chapter.title}</span>
          <span className="text-xs text-[var(--color-text-tertiary)]">{chapter.wordCount}</span>
        </div>
        {hasChildren && isExpanded && (
          <div>
            {chapter.children!.map((child) => renderChapter(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  const currentWork = works.find((w) => w.id === currentWorkId);

  return (
    <div className="w-64 h-full bg-[var(--color-bg-primary)] border-r border-[var(--color-border-light)] flex flex-col">
      {/* Works List */}
      <div className="p-3 border-b border-[var(--color-border-light)]">
        <select
          value={currentWorkId}
          onChange={(e) => onWorkSelect(e.target.value)}
          className="w-full h-9 px-3 bg-[var(--color-bg-secondary)] border border-[var(--color-border-light)] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)]"
        >
          {works.map((work) => (
            <option key={work.id} value={work.id}>
              {work.title}
            </option>
          ))}
        </select>
      </div>

      {/* Chapter Tree */}
      <div className="flex-1 overflow-y-auto">
        {currentWork && currentWork.chapters.map((chapter) => renderChapter(chapter))}
      </div>

      {/* Quick Actions */}
      <div className="p-3 border-t border-[var(--color-border-light)]">
        <div className="grid grid-cols-3 gap-2">
          <button className="flex flex-col items-center gap-1 p-2 rounded-md hover:bg-[var(--color-bg-secondary)] transition-colors">
            <List size={18} className="text-[var(--color-text-secondary)]" />
            <span className="text-xs text-[var(--color-text-secondary)]">大纲</span>
          </button>
          <button className="flex flex-col items-center gap-1 p-2 rounded-md hover:bg-[var(--color-bg-secondary)] transition-colors">
            <Users size={18} className="text-[var(--color-text-secondary)]" />
            <span className="text-xs text-[var(--color-text-secondary)]">角色</span>
          </button>
          <button className="flex flex-col items-center gap-1 p-2 rounded-md hover:bg-[var(--color-bg-secondary)] transition-colors">
            <Send size={18} className="text-[var(--color-text-secondary)]" />
            <span className="text-xs text-[var(--color-text-secondary)]">发布</span>
          </button>
        </div>
      </div>
    </div>
  );
};
```

---

### 4.3 Editor 编辑器核心

#### 4.3.1 设计规范

```
编辑器结构:
┌──────────────────────────────────────────────────┐
│  第三十八章：决战之巅                             │ ← 标题
│                                                  │
│  李明握紧手中的剑，眼神坚定地看着对面的敌人。      │ ← 正文
│                                                  │
│  他深吸一口气，准备施展绝技...                     │
│                                                  │
│  [光标]                                          │
└──────────────────────────────────────────────────┘

编辑器配置:
- 字体: 宋体 / Source Han Serif SC
- 字号: 18px (可自定义)
- 行高: 2.0 (网文双倍行距)
- 段落间距: 1.5em
- 首行缩进: 2字符
- 最大宽度: 800px (居中)
```

#### 4.3.2 组件代码

```tsx
import React, { useRef, useEffect } from 'react';

interface EditorProps {
  content: string;
  onChange: (content: string) => void;
  onSave: () => void;
  fontSize?: number;
  lineHeight?: number;
  fontFamily?: string;
}

export const Editor: React.FC<EditorProps> = ({
  content,
  onChange,
  onSave,
  fontSize = 18,
  lineHeight = 2.0,
  fontFamily = 'Source Han Serif SC, SimSun, serif',
}) => {
  const editorRef = useRef<HTMLTextAreaElement>(null);

  // 键盘快捷键
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        onSave();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onSave]);

  return (
    <div className="flex-1 h-full bg-[var(--editor-bg)] overflow-y-auto">
      <div className="max-w-3xl mx-auto py-16 px-8">
        <textarea
          ref={editorRef}
          value={content}
          onChange={(e) => onChange(e.target.value)}
          className="w-full min-h-full resize-none focus:outline-none"
          style={{
            fontFamily,
            fontSize: `${fontSize}px`,
            lineHeight,
            color: 'var(--editor-text)',
            backgroundColor: 'transparent',
          }}
          placeholder="开始写作..."
          spellCheck={false}
        />
      </div>
    </div>
  );
};
```

---

### 4.4 StatusBar 状态栏

#### 4.4.1 设计规范

```
状态栏结构:
┌──────────────────────────────────────────────────────────┐
│  [《剑道独尊》] [第三十八章] [行 12, 列 45] [⬤ 在线] [☁]  │
└──────────────────────────────────────────────────────────┘

信息项:
- 作品名称
- 当前章节
- 光标位置 (行、列)
- 网络状态
- 同步状态

高度: 28px
背景: var(--color-bg-secondary)
边框: 顶部边框
```

#### 4.4.2 组件代码

```tsx
import React from 'react';
import { Wifi, WifiOff, Cloud, CloudOff } from 'lucide-react';

interface StatusBarProps {
  workTitle: string;
  chapterTitle: string;
  cursorLine: number;
  cursorColumn: number;
  isOnline: boolean;
  isSyncing: boolean;
  lastSyncTime?: Date;
}

export const StatusBar: React.FC<StatusBarProps> = ({
  workTitle,
  chapterTitle,
  cursorLine,
  cursorColumn,
  isOnline,
  isSyncing,
  lastSyncTime,
}) => {
  const formatTime = (date?: Date) => {
    if (!date) return '';
    return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="h-7 px-3 flex items-center justify-between bg-[var(--color-bg-secondary)] border-t border-[var(--color-border-light)] text-xs text-[var(--color-text-secondary)]">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        <span className="font-medium">{workTitle}</span>
        <span>{chapterTitle}</span>
        <span className="font-mono">
          行 {cursorLine}, 列 {cursorColumn}
        </span>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {/* Network Status */}
        <div className="flex items-center gap-1.5">
          {isOnline ? (
            <>
              <Wifi size={14} className="text-[var(--color-success)]" />
              <span>在线</span>
            </>
          ) : (
            <>
              <WifiOff size={14} className="text-[var(--color-warning)]" />
              <span>离线</span>
            </>
          )}
        </div>

        {/* Sync Status */}
        <div className="flex items-center gap-1.5">
          {isSyncing ? (
            <>
              <Cloud size={14} className="text-[var(--color-primary-500)] animate-pulse" />
              <span>同步中...</span>
            </>
          ) : lastSyncTime ? (
            <>
              <Cloud size={14} className="text-[var(--color-success)]" />
              <span>同步于 {formatTime(lastSyncTime)}</span>
            </>
          ) : (
            <>
              <CloudOff size={14} className="text-[var(--color-text-tertiary)]" />
              <span>未同步</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
```

---

### 4.5 AIPanel AI 助手面板

#### 4.5.1 设计规范

```
AI 面板结构:
┌────────────────────────────────────┐
│  ✨ AI 助手                         │
├────────────────────────────────────┤
│  [思路启发] [错别字] [大纲] [续写]  │
├────────────────────────────────────┤
│                                    │
│  AI 对话历史                        │
│  ┌────────────────────────────┐   │
│  │ 用户: 帮我生成下一段剧情      │   │
│  └────────────────────────────┘   │
│  ┌────────────────────────────┐   │
│  │ AI: 建议如下...               │   │
│  │ 1. ...                        │   │
│  │ 2. ...                        │   │
│  │ [采纳] [重新生成]             │   │
│  └────────────────────────────┘   │
│                                    │
├────────────────────────────────────┤
│  输入框: [询问 AI...]        [发送] │
└────────────────────────────────────┘

宽度: 280-360px (可折叠)
```

#### 4.5.2 组件代码

```tsx
import React, { useState } from 'react';
import { Sparkles, Send, Lightbulb, FileText, FileSearch, PenTool } from 'lucide-react';
import { Button } from '../atoms/Button';

interface AIMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  suggestions?: string[];
}

interface AIPanelProps {
  messages: AIMessage[];
  onSendMessage: (message: string) => void;
  onAdoptSuggestion: (suggestion: string) => void;
  onQuickAction: (action: 'inspiration' | 'spellcheck' | 'outline' | 'continuation') => void;
}

export const AIPanel: React.FC<AIPanelProps> = ({
  messages,
  onSendMessage,
  onAdoptSuggestion,
  onQuickAction,
}) => {
  const [inputValue, setInputValue] = useState('');

  const handleSend = () => {
    if (inputValue.trim()) {
      onSendMessage(inputValue.trim());
      setInputValue('');
    }
  };

  return (
    <div className="w-80 h-full bg-[var(--color-bg-primary)] border-l border-[var(--color-border-light)] flex flex-col">
      {/* Header */}
      <div className="h-12 px-4 flex items-center gap-2 border-b border-[var(--color-border-light)]">
        <Sparkles size={18} className="text-[var(--color-primary-500)]" />
        <span className="font-semibold text-[var(--color-text-primary)]">AI 助手</span>
      </div>

      {/* Quick Actions */}
      <div className="p-3 border-b border-[var(--color-border-light)]">
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="secondary"
            size="small"
            icon={Lightbulb}
            onClick={() => onQuickAction('inspiration')}
          >
            思路启发
          </Button>
          <Button
            variant="secondary"
            size="small"
            icon={FileSearch}
            onClick={() => onQuickAction('spellcheck')}
          >
            错别字
          </Button>
          <Button
            variant="secondary"
            size="small"
            icon={FileText}
            onClick={() => onQuickAction('outline')}
          >
            大纲
          </Button>
          <Button
            variant="secondary"
            size="small"
            icon={PenTool}
            onClick={() => onQuickAction('continuation')}
          >
            续写
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`${
              message.role === 'user' ? 'text-right' : 'text-left'
            }`}
          >
            <div
              className={`
                inline-block max-w-[80%] px-4 py-2 rounded-lg text-sm
                ${
                  message.role === 'user'
                    ? 'bg-[var(--color-primary-500)] text-white'
                    : 'bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)]'
                }
              `}
            >
              <div className="whitespace-pre-wrap">{message.content}</div>
              
              {/* Suggestions */}
              {message.suggestions && message.suggestions.length > 0 && (
                <div className="mt-2 space-y-1">
                  {message.suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      className="block w-full text-left px-2 py-1 bg-[var(--color-bg-primary)] rounded text-xs text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-tertiary)] transition-colors"
                      onClick={() => onAdoptSuggestion(suggestion)}
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="p-3 border-t border-[var(--color-border-light)]">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="询问 AI..."
            className="flex-1 h-9 px-3 bg-[var(--color-bg-secondary)] border border-[var(--color-border-light)] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)]"
          />
          <Button variant="primary" size="medium" icon={Send} onClick={handleSend} />
        </div>
      </div>
    </div>
  );
};
```

---

## 5. 组件清单总览

### 5.1 完整组件列表

| 分类 | 组件名称 | 优先级 | 状态 |
|------|----------|--------|------|
| **原子组件** | Button | P0 | ✓ 已设计 |
| | Input | P0 | ✓ 已设计 |
| | Icon | P0 | ✓ 已设计 |
| | Badge | P1 | ✓ 已设计 |
| | Tooltip | P1 | ✓ 已设计 |
| | Divider | P1 | 待设计 |
| **分子组件** | Card | P0 | ✓ 已设计 |
| | Dropdown | P0 | ✓ 已设计 |
| | Modal | P0 | ✓ 已设计 |
| | InputField | P0 | 待设计 |
| | ButtonGroup | P1 | 待设计 |
| | Tabs | P1 | 待设计 |
| | Toast | P0 | 待设计 |
| **有机组件** | Toolbar | P0 | ✓ 已设计 |
| | Sidebar | P0 | ✓ 已设计 |
| | Editor | P0 | ✓ 已设计 |
| | StatusBar | P0 | ✓ 已设计 |
| | AIPanel | P1 | ✓ 已设计 |
| | ChapterTree | P0 | 待设计 |
| | OutlinePanel | P1 | 待设计 |
| | CharacterPanel | P1 | 待设计 |
| | PublishPanel | P1 | 待设计 |
| | SettingsModal | P1 | 待设计 |
| **模板** | EditorLayout | P0 | 待设计 |
| | SplitViewLayout | P1 | 待设计 |
| | FocusModeLayout | P1 | 待设计 |

### 5.2 组件层级关系

```
EditorLayout (模板)
├── Toolbar (有机组件)
│   ├── Button (原子组件)
│   ├── Dropdown (分子组件)
│   │   └── Button (原子组件)
│   └── Badge (原子组件)
│
├── Sidebar (有机组件)
│   ├── Input (原子组件)
│   ├── ChapterTree (有机组件)
│   │   └── Icon (原子组件)
│   └── ButtonGroup (分子组件)
│       └── Button (原子组件)
│
├── Editor (有机组件)
│   └── Input (原子组件)
│
├── AIPanel (有机组件)
│   ├── Button (原子组件)
│   ├── Input (原子组件)
│   └── Card (分子组件)
│
└── StatusBar (有机组件)
    ├── Badge (原子组件)
    └── Icon (原子组件)
```

---

## 6. 组件状态管理

### 6.1 状态管理策略

使用 **Zustand** 进行全局状态管理，组件内部状态使用 React Hooks。

```typescript
// stores/editorStore.ts
import { create } from 'zustand';

interface EditorState {
  // 作品数据
  currentWorkId: string | null;
  currentChapterId: string | null;
  
  // 编辑器状态
  content: string;
  cursorPosition: { line: number; column: number };
  
  // 保存状态
  saved: boolean;
  lastSaveTime: Date | null;
  
  // Actions
  setCurrentWork: (workId: string) => void;
  setCurrentChapter: (chapterId: string) => void;
  updateContent: (content: string) => void;
  setCursorPosition: (line: number, column: number) => void;
  markAsSaved: () => void;
}

export const useEditorStore = create<EditorState>((set) => ({
  currentWorkId: null,
  currentChapterId: null,
  content: '',
  cursorPosition: { line: 1, column: 1 },
  saved: true,
  lastSaveTime: null,
  
  setCurrentWork: (workId) => set({ currentWorkId: workId }),
  setCurrentChapter: (chapterId) => set({ currentChapterId: chapterId }),
  updateContent: (content) => set({ content, saved: false }),
  setCursorPosition: (line, column) => set({ cursorPosition: { line, column } }),
  markAsSaved: () => set({ saved: true, lastSaveTime: new Date() }),
}));
```

### 6.2 组件间通信

```typescript
// 使用 Zustand 进行跨组件通信
const Toolbar = () => {
  const { saved, lastSaveTime } = useEditorStore();
  // ...
};

const Editor = () => {
  const { content, updateContent, markAsSaved } = useEditorStore();
  
  const handleSave = () => {
    // 保存逻辑
    markAsSaved();
  };
  
  // ...
};
```

---

## 7. 组件测试策略

### 7.1 测试工具

- **单元测试**: Jest + React Testing Library
- **组件测试**: Storybook
- **E2E 测试**: Playwright

### 7.2 测试示例

```typescript
// Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Click me</Button>);
    expect(screen.getByText('Click me')).toBeDisabled();
  });

  it('shows loading spinner when loading prop is true', () => {
    render(<Button loading>Loading</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
```

---

## 8. 组件文档规范

### 8.1 文档结构

每个组件应包含以下文档：

1. **组件描述**: 简要说明组件用途
2. **Props 定义**: 使用 TypeScript 类型定义
3. **使用示例**: 常见使用场景代码
4. **设计规范**: 视觉设计、交互状态
5. **可访问性**: ARIA 标签、键盘导航
6. **测试用例**: 关键测试场景

### 8.2 Storybook 配置

```typescript
// Button.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';
import { Save, Trash } from 'lucide-react';

const meta: Meta<typeof Button> = {
  title: 'Atoms/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'tertiary', 'danger', 'ghost'],
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    variant: 'primary',
    children: '主要按钮',
  },
};

export const WithIcon: Story = {
  args: {
    variant: 'primary',
    icon: Save,
    children: '保存',
  },
};

export const Loading: Story = {
  args: {
    variant: 'primary',
    loading: true,
    children: '保存中...',
  },
};

export const Disabled: Story = {
  args: {
    variant: 'primary',
    disabled: true,
    children: '禁用按钮',
  },
};
```

---

## 9. 可复用性设计

### 9.1 组合模式

使用组合模式提高组件复用性：

```tsx
// 使用组合模式
<Card>
  <Card.Header>
    <h3>章节标题</h3>
  </Card.Header>
  <Card.Content>
    <p>章节内容</p>
  </Card.Content>
  <Card.Footer>
    <Button>保存</Button>
  </Card.Footer>
</Card>
```

### 9.2 渲染属性模式

```tsx
// 使用渲染属性模式
<List
  items={chapters}
  renderItem={(chapter) => (
    <ChapterItem chapter={chapter} />
  )}
/>
```

### 9.3 自定义 Hook 模式

```tsx
// 提取逻辑为自定义 Hook
const useAutoSave = (content: string, delay: number = 300) => {
  const [saved, setSaved] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      // 保存逻辑
      saveContent(content);
      setSaved(true);
    }, delay);
    
    return () => clearTimeout(timer);
  }, [content, delay]);
  
  return { saved };
};

// 使用
const Editor = () => {
  const [content, setContent] = useState('');
  const { saved } = useAutoSave(content);
  
  // ...
};
```

---

## 10. 性能优化

### 10.1 组件懒加载

```tsx
import React, { lazy, Suspense } from 'react';

const AIPanel = lazy(() => import('./AIPanel'));

const EditorLayout = () => (
  <Suspense fallback={<div>加载中...</div>}>
    <AIPanel />
  </Suspense>
);
```

### 10.2 虚拟列表

对于长列表（如章节树），使用虚拟列表优化性能：

```tsx
import { FixedSizeList } from 'react-window';

const ChapterTree = ({ chapters }) => (
  <FixedSizeList
    height={600}
    itemCount={chapters.length}
    itemSize={36}
    width="100%"
  >
    {({ index, style }) => (
      <div style={style}>
        <ChapterItem chapter={chapters[index]} />
      </div>
    )}
  </FixedSizeList>
);
```

### 10.3 Memo 优化

```tsx
import React, { memo } from 'react';

const ChapterItem = memo(({ chapter }) => {
  // ...
});

ChapterItem.displayName = 'ChapterItem';
```

---

**文档状态**: 初稿完成  
**下一步**: 前端开发实现  
**负责人**: @ui-designer, @frontend-developer

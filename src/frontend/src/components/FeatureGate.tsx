import React, { useState } from 'react';
import { useAuthStore } from '@stores/authStore';

interface FeatureGateProps {
  feature: string;
  children: React.ReactNode;
  disabled?: boolean;
  onLoginClick?: () => void;
}

const FeatureGate: React.FC<FeatureGateProps> = ({ feature, children, disabled, onLoginClick }) => {
  const { isAuthenticated } = useAuthStore();
  const [showPrompt, setShowPrompt] = useState(false);

  const isLocked = !isAuthenticated || disabled;

  const handleClick = (e: React.MouseEvent) => {
    if (!isAuthenticated) {
      e.preventDefault();
      e.stopPropagation();
      setShowPrompt(true);
      return;
    }
    if (disabled) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
  };

  return (
    <>
      <div
        className={`relative inline-flex ${isLocked ? 'cursor-not-allowed' : ''}`}
        onClick={handleClick}
      >
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child as React.ReactElement<any>, {
              disabled: isLocked,
              className: `${(child as React.ReactElement<any>).props.className || ''} ${
                isLocked ? 'opacity-50 cursor-not-allowed' : ''
              }`,
            });
          }
          return child;
        })}
        {!isAuthenticated && (
          <span className="absolute -top-1 -right-1 text-xs">🔒</span>
        )}
      </div>

      {showPrompt && !isAuthenticated && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[var(--color-bg-primary)] rounded-lg p-6 w-80 text-center">
            <div className="text-4xl mb-3">🔒</div>
            <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-2">
              请先登录
            </h3>
            <p className="text-sm text-[var(--color-text-secondary)] mb-4">
              登录后即可使用「{feature}」功能
            </p>
            <div className="flex gap-2 justify-center">
              <button
                onClick={() => setShowPrompt(false)}
                className="px-4 py-2 text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)] rounded"
              >
                取消
              </button>
              <button
                onClick={() => {
                  setShowPrompt(false);
                  onLoginClick?.();
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
              >
                去登录
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FeatureGate;

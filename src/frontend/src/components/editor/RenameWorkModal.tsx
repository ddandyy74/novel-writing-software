import React, { useEffect, useState } from 'react';

interface RenameWorkModalProps {
  isOpen: boolean;
  initialTitle: string;
  onClose: () => void;
  onConfirm: (title: string) => void;
}

const RenameWorkModal: React.FC<RenameWorkModalProps> = ({
  isOpen,
  initialTitle,
  onClose,
  onConfirm,
}) => {
  const [title, setTitle] = useState(initialTitle);

  useEffect(() => {
    if (isOpen) {
      setTitle(initialTitle);
    }
  }, [isOpen, initialTitle]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const submit = () => {
    const nextTitle = title.trim();
    if (!nextTitle || nextTitle === initialTitle) {
      onClose();
      return;
    }

    onConfirm(nextTitle);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-96 rounded-lg bg-white p-6 shadow-xl">
        <h3 className="mb-4 text-lg font-semibold text-slate-900">重命名作品</h3>
        <input
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          className="mb-4 w-full rounded border border-slate-200 bg-white px-4 py-2 text-slate-900 outline-none focus:border-blue-500"
          placeholder="作品标题"
          autoFocus
          onFocus={(event) => event.currentTarget.select()}
          onKeyDown={(event) => {
            if (event.key === 'Enter') submit();
          }}
        />
        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose} className="rounded px-4 py-2 text-slate-600 hover:bg-slate-100">
            取消
          </button>
          <button type="button" onClick={submit} className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
            确认
          </button>
        </div>
      </div>
    </div>
  );
};

export default RenameWorkModal;

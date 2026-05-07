import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Search, X, ChevronDown, ChevronUp, Replace, CaseSensitive, Regex } from 'lucide-react';

interface FindReplaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  content: string;
  onReplace: (newContent: string) => void;
  editorView?: any;
}

interface SearchResult {
  index: number;
  length: number;
  text: string;
}

const FindReplaceModal: React.FC<FindReplaceModalProps> = ({
  isOpen,
  onClose,
  content,
  onReplace,
  editorView,
}) => {
  const [findText, setFindText] = useState('');
  const [replaceText, setReplaceText] = useState('');
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [useRegex, setUseRegex] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [showReplace, setShowReplace] = useState(false);
  
  const findInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && findInputRef.current) {
      findInputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (findText) {
      search();
    } else {
      setResults([]);
      setCurrentIndex(-1);
    }
  }, [findText, caseSensitive, useRegex, content]);

  const search = useCallback(() => {
    if (!findText) {
      setResults([]);
      setCurrentIndex(-1);
      return;
    }

    try {
      const searchResults: SearchResult[] = [];
      
      if (useRegex) {
        const flags = caseSensitive ? 'g' : 'gi';
        const regex = new RegExp(findText, flags);
        let match;
        while ((match = regex.exec(content)) !== null) {
          searchResults.push({
            index: match.index,
            length: match[0].length,
            text: match[0],
          });
        }
      } else {
        const searchText = caseSensitive ? findText : findText.toLowerCase();
        const searchContent = caseSensitive ? content : content.toLowerCase();
        let index = 0;
        while ((index = searchContent.indexOf(searchText, index)) !== -1) {
          searchResults.push({
            index,
            length: findText.length,
            text: content.substr(index, findText.length),
          });
          index += findText.length;
        }
      }

      setResults(searchResults);
      setCurrentIndex(searchResults.length > 0 ? 0 : -1);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
      setCurrentIndex(-1);
    }
  }, [findText, caseSensitive, useRegex, content]);

  const jumpTo = (index: number) => {
    if (index < 0 || index >= results.length) return;
    setCurrentIndex(index);
    
    const result = results[index];
    if (editorView) {
      editorView.dispatch({
        selection: {
          anchor: result.index,
          head: result.index + result.length,
        },
        scrollIntoView: true,
      });
      editorView.focus();
    }
  };

  const handlePrev = () => {
    if (results.length === 0) return;
    const newIndex = currentIndex <= 0 ? results.length - 1 : currentIndex - 1;
    jumpTo(newIndex);
  };

  const handleNext = () => {
    if (results.length === 0) return;
    const newIndex = currentIndex >= results.length - 1 ? 0 : currentIndex + 1;
    jumpTo(newIndex);
  };

  const handleReplaceOne = () => {
    if (currentIndex === -1 || results.length === 0) return;

    const result = results[currentIndex];
    const newContent = content.slice(0, result.index) + replaceText + content.slice(result.index + result.length);
    onReplace(newContent);
    
    setTimeout(() => {
      search();
    }, 100);
  };

  const handleReplaceAll = () => {
    if (results.length === 0) return;

    let newContent = content;
    
    if (useRegex) {
      const flags = caseSensitive ? 'g' : 'gi';
      const regex = new RegExp(findText, flags);
      newContent = content.replace(regex, replaceText);
    } else {
      const searchText = caseSensitive ? findText : findText.toLowerCase();
      const searchContent = caseSensitive ? content : content.toLowerCase();
      let offset = 0;
      let index = 0;
      
      while ((index = searchContent.indexOf(searchText, index)) !== -1) {
        const actualIndex = index + offset;
        newContent = newContent.slice(0, actualIndex) + replaceText + newContent.slice(actualIndex + findText.length);
        offset += replaceText.length - findText.length;
        index += findText.length;
      }
    }

    onReplace(newContent);
    setResults([]);
    setCurrentIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'Enter') {
      if (e.shiftKey) {
        handlePrev();
      } else {
        handleNext();
      }
    } else if (e.key === 'F3') {
      e.preventDefault();
      if (e.shiftKey) {
        handlePrev();
      } else {
        handleNext();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed right-4 top-16 z-50 w-96 rounded-lg border border-slate-200 bg-white shadow-xl"
      onKeyDown={handleKeyDown}
    >
      <div className="flex items-center justify-between border-b border-slate-200 px-4 py-2">
        <div className="flex items-center gap-2">
          <Search className="h-4 w-4 text-slate-600" />
          <span className="font-medium text-slate-800">查找替换</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setShowReplace(!showReplace)}
            className={`rounded p-1.5 hover:bg-slate-100 ${showReplace ? 'bg-slate-100' : ''}`}
            title="替换"
          >
            <Replace className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded p-1.5 hover:bg-slate-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="p-4">
        <div className="space-y-3">
          <div>
            <div className="flex items-center gap-2">
              <input
                ref={findInputRef}
                type="text"
                value={findText}
                onChange={(e) => setFindText(e.target.value)}
                placeholder="查找内容..."
                className="flex-1 rounded border border-slate-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setCaseSensitive(!caseSensitive)}
                className={`rounded p-1.5 hover:bg-slate-100 ${caseSensitive ? 'bg-blue-100 text-blue-600' : ''}`}
                title="区分大小写"
              >
                <CaseSensitive className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setUseRegex(!useRegex)}
                className={`rounded p-1.5 hover:bg-slate-100 ${useRegex ? 'bg-blue-100 text-blue-600' : ''}`}
                title="正则表达式"
              >
                <Regex className="h-4 w-4" />
              </button>
            </div>
            
            {results.length > 0 && (
              <div className="mt-1 flex items-center justify-between text-xs text-slate-600">
                <span>
                  {currentIndex + 1} / {results.length} 个结果
                </span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="rounded p-1 hover:bg-slate-100"
                    title="上一个 (Shift+Enter)"
                  >
                    <ChevronUp className="h-3 w-3" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="rounded p-1 hover:bg-slate-100"
                    title="下一个 (Enter)"
                  >
                    <ChevronDown className="h-3 w-3" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {showReplace && (
            <div className="space-y-2">
              <input
                type="text"
                value={replaceText}
                onChange={(e) => setReplaceText(e.target.value)}
                placeholder="替换为..."
                className="w-full rounded border border-slate-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleReplaceOne}
                  disabled={results.length === 0}
                  className="flex-1 rounded bg-slate-100 px-3 py-1.5 text-sm hover:bg-slate-200 disabled:opacity-50"
                >
                  替换
                </button>
                <button
                  type="button"
                  onClick={handleReplaceAll}
                  disabled={results.length === 0}
                  className="flex-1 rounded bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  全部替换
                </button>
              </div>
            </div>
          )}
        </div>

        {findText && results.length === 0 && (
          <div className="mt-2 text-sm text-slate-500">未找到匹配内容</div>
        )}
      </div>
    </div>
  );
};

export default FindReplaceModal;

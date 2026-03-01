import { useEffect, useState } from 'react';
import { HexColorPicker } from 'react-colorful';

const PRESET_COLORS = [
  '#3b82f6', '#22c55e', '#8b5cf6', '#f59e0b', '#ef4444',
  '#06b6d4', '#ec4899', '#84cc16', '#6366f1', '#14b8a6',
];

function getLuminance(hex) {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  return 0.299 * r + 0.587 * g + 0.114 * b;
}

function ListColorModal({ isOpen, currentColor, onSelect, onClose }) {
  const [customColor, setCustomColor] = useState(currentColor || '#3b82f6');
  const [error, setError] = useState('');

  useEffect(() => {
    if (currentColor) {
      setCustomColor(currentColor);
      setError('');
    }
  }, [currentColor]);

  if (!isOpen) return null;

  const handleSelect = (hex) => {
    if (getLuminance(hex) > 0.85) {
      setError('Color too light — text won\'t be visible');
      return;
    }
    setError('');
    onSelect(hex);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-xs rounded-2xl border border-zinc-800 bg-zinc-950 px-5 py-4 shadow-2xl">
        <h3 className="text-sm font-medium text-zinc-100 mb-1">List color</h3>
        <p className="mb-3 text-[11px] text-zinc-500">
          Default: <span className="text-zinc-200">{currentColor || '#3b82f6'}</span>
        </p>
        <div className="grid grid-cols-5 gap-2 mb-4">
          {PRESET_COLORS.map((hex) => (
            <button
              key={hex}
              type="button"
              onClick={() => handleSelect(hex)}
              className="h-8 w-8 rounded-lg border-2 border-zinc-700 hover:border-zinc-500 transition-colors"
              style={{ backgroundColor: hex }}
              title={hex}
            />
          ))}
        </div>
        <div className="mb-4">
          <HexColorPicker color={customColor} onChange={setCustomColor} />
        </div>
        <div className="flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => currentColor && handleSelect(currentColor)}
            className="rounded-lg border border-zinc-700 px-3 py-1.5 text-[11px] text-zinc-200 hover:bg-zinc-900"
          >
            Use default
          </button>
          <button
            type="button"
            onClick={() => handleSelect(customColor)}
            className="rounded-lg border border-zinc-700 px-3 py-1.5 text-xs text-zinc-200 hover:bg-zinc-800"
          >
            Use picker color
          </button>
        </div>
        {error && (
          <p className="mt-2 text-[11px] text-red-400">{error}</p>
        )}
        <button
          type="button"
          onClick={onClose}
          className="mt-4 w-full rounded-lg border border-zinc-800 py-1.5 text-[11px] text-zinc-400 hover:bg-zinc-900"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default ListColorModal;

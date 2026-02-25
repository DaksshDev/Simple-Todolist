import { LuX } from 'react-icons/lu';

function TaskModal({
  isOpen,
  listName,
  text,
  tags,
  tagsInput,
  onChangeText,
  onChangeTags,
  onAddTag,
  onRemoveTag,
  onSubmit,
  onClose,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-3xl border border-zinc-800 bg-zinc-950 px-5 py-5 shadow-2xl shadow-black/70">
        <h2 className="text-sm font-medium text-zinc-100 mb-1">Add task</h2>
        <p className="text-[11px] text-zinc-500 mb-4">
          This will be added to{' '}
          <span className="text-zinc-200">{listName}</span>.
        </p>
        <div className="space-y-3">
          <input
            autoFocus
            type="text"
            value={text}
            onChange={(e) => onChangeText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                onSubmit();
              }
              if (e.key === 'Escape') {
                e.preventDefault();
                onClose();
              }
            }}
            placeholder="Describe the task…"
            className="w-full rounded-xl border border-zinc-800 bg-black/60 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 outline-none focus:border-zinc-500"
          />
          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {tags.map((tag, index) => (
                <span
                  key={`${tag}-${index}`}
                  className="inline-flex items-center gap-1 rounded-full border border-zinc-700 bg-black/60 px-2 py-0.5 text-[11px] text-zinc-100"
                >
                  <span>{tag}</span>
                  <button
                    type="button"
                    onClick={() => onRemoveTag(index)}
                    className="text-zinc-500 hover:text-zinc-200"
                  >
                    <LuX className="h-3 w-3" aria-hidden="true" />
                  </button>
                </span>
              ))}
            </div>
          )}
          <input
            type="text"
            value={tagsInput}
            onChange={(e) => {
              const value = e.target.value;
              if (value.includes(',')) {
                const parts = value.split(',');
                const last = parts.pop() || '';
                parts
                  .map((p) => p.trim())
                  .filter(Boolean)
                  .forEach((tag) => onAddTag(tag));
                onChangeTags(last);
              } else {
                onChangeTags(value);
              }
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                onSubmit();
              }
              if (e.key === 'Escape') {
                e.preventDefault();
                onClose();
              }
            }}
            placeholder="Tags (comma separated)…"
            className="w-full rounded-xl border border-zinc-800 bg-black/60 px-3 py-2 text-[11px] text-zinc-200 placeholder:text-zinc-600 outline-none focus:border-zinc-500"
          />
          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-full text-[11px] text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/80"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onSubmit}
              className="px-4 py-1.5 rounded-full text-[11px] font-medium bg-zinc-100 text-black hover:bg-white disabled:opacity-40"
              disabled={!text.trim()}
            >
              Add task
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TaskModal;


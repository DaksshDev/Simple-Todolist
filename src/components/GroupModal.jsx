function GroupModal({ mode, isOpen, name, onChangeName, onConfirm, onCancel }) {
  if (!isOpen) return null;

  const isDelete = mode === 'delete';
  const title =
    mode === 'create' ? 'Create group' : mode === 'rename' ? 'Rename group' : 'Delete group';

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-3xl border border-zinc-800 bg-zinc-950 px-5 py-5 shadow-2xl shadow-black/70">
        <h2 className="text-sm font-medium text-zinc-100 mb-2">{title}</h2>
        {!isDelete ? (
          <div className="space-y-3">
            <input
              autoFocus
              type="text"
              value={name}
              onChange={(e) => onChangeName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  onConfirm();
                }
                if (e.key === 'Escape') {
                  e.preventDefault();
                  onCancel();
                }
              }}
              placeholder="Group name…"
              className="w-full rounded-xl border border-zinc-800 bg-black/60 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 outline-none focus:border-zinc-500"
            />
            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={onCancel}
                className="px-3 py-1.5 rounded-full text-[11px] text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/80"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={onConfirm}
                className="px-4 py-1.5 rounded-full text-[11px] font-medium bg-zinc-100 text-black hover:bg-white disabled:opacity-40"
                disabled={!name.trim()}
              >
                {mode === 'create' ? 'Create' : 'Save'}
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-[11px] text-zinc-400">
              This will permanently delete the group{' '}
              <span className="text-zinc-100">{name}</span> and all of its lists and tasks.
            </p>
            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={onCancel}
                className="px-3 py-1.5 rounded-full text-[11px] text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/80"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={onConfirm}
                className="px-4 py-1.5 rounded-full text-[11px] font-medium bg-red-500 text-black hover:bg-red-400"
              >
                Delete
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default GroupModal;


import { useState } from 'react';
import {
  LuChevronDown,
  LuChevronUp,
  LuPlus,
  LuX,
  LuPencil,
  LuTrash2,
  LuCheck,
} from 'react-icons/lu';

function GroupSection({
  group,
  isOpen,
  onToggleOpen,
  lists,
  todos,
  getTagColorClass,
  activeListId,
  onListEnter,
  onTaskMouseDown,
  onAddList,
  onDeleteList,
  onDeleteTodo,
  onOpenTaskModal,
  draggedListId,
  onReorderLists,
  isOverDone,
  showDonePulse,
}) {
  const [newListName, setNewListName] = useState('');

  const listsForGroup = lists;
  const customLists = listsForGroup.filter((l) => l.type === 'custom');
  const doneList = listsForGroup.find((l) => l.type === 'done');

  const getTodosForList = (listId) => todos.filter((t) => t.listId === listId);

  const handleListDrop = (targetListId) => {
    if (!draggedListId || draggedListId === targetListId) return;
    onReorderLists(group.id, draggedListId, targetListId);
  };

  const handleAddList = () => {
    if (!newListName.trim()) return;
    onAddList(newListName.trim());
    setNewListName('');
  };

  return (
    <section className="px-1 py-2">
      <button
        type="button"
        onClick={onToggleOpen}
        className="flex w-full items-center justify-between text-left group px-1 py-1"
      >
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-zinc-500" />
          <span className="text-xs font-medium text-zinc-200 tracking-[0.18em] uppercase">
            {group.name}
          </span>
          {isOpen ? (
            <LuChevronDown className="h-3 w-3 text-zinc-500" aria-hidden="true" />
          ) : (
            <LuChevronUp className="h-3 w-3 text-zinc-500" aria-hidden="true" />
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-zinc-500">
            {listsForGroup.length} lists
          </span>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                group.onRename();
              }}
              className="h-6 w-6 rounded-full border border-zinc-800 text-[11px] text-zinc-400 hover:text-zinc-100 hover:border-zinc-500 flex items-center justify-center"
            >
              <LuPencil className="h-3 w-3" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                group.onDelete();
              }}
              className="h-6 w-6 rounded-full border border-zinc-800 text-[11px] text-red-400 hover:text-red-300 hover:border-red-500 flex items-center justify-center"
            >
              <LuTrash2 className="h-3 w-3" aria-hidden="true" />
            </button>
          </div>
        </div>
      </button>

      {isOpen && (
        <div className="mt-3 grid grid-cols-[minmax(0,2.1fr)_minmax(0,1.2fr)] gap-6 items-start">
          <div className="col-span-full mb-2 flex items-center gap-2 px-1">
            <input
              type="text"
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddList();
                }
              }}
              placeholder="New list name…"
              className="flex-1 rounded-xl border border-zinc-800 bg-black/60 px-3 py-2 text-xs text-zinc-100 placeholder:text-zinc-600 outline-none focus:border-zinc-500"
            />
            <button
              type="button"
              onClick={handleAddList}
              className="inline-flex items-center justify-center rounded-xl bg-white text-black text-xs font-medium px-3 py-1.5 hover:bg-zinc-200"
            >
              <LuPlus className="h-3.5 w-3.5" aria-hidden="true" />
              <span className="ml-1">Add</span>
            </button>
          </div>
          {/* Left: custom lists */}
          <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {customLists.map((list) => {
              const items = getTodosForList(list.id);
              const isActive = activeListId === list.id;
              return (
                <div
                  key={list.id}
                  draggable
                  onDragStart={() => group.onListDragStart(list.id)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    handleListDrop(list.id);
                  }}
                  onMouseEnter={() => onListEnter(list.id)}
                  className={`relative rounded-2xl border ${
                    isActive ? 'border-zinc-500/70' : 'border-zinc-900'
                  } bg-zinc-1000/40 p-3.5 min-h-[260px] transition-colors`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-zinc-600" />
                      <h2 className="text-xs font-medium text-zinc-100 tracking-tight">
                        {list.name}
                      </h2>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-zinc-500">{items.length}</span>
                      <button
                        type="button"
                        onClick={() => onOpenTaskModal(list.id)}
                        className="flex h-5 w-5 items-center justify-center rounded-full border border-zinc-700 text-[11px] text-zinc-300 hover:border-zinc-400 hover:text-zinc-50 transition-colors"
                      >
                        <LuPlus className="h-3 w-3" aria-hidden="true" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteList(list.id)}
                        className="flex h-5 w-5 items-center justify-center rounded-full border border-zinc-800 text-[11px] text-zinc-400 hover:text-red-300 hover:border-red-500/80 transition-colors"
                      >
                        <LuTrash2 className="h-3 w-3" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {items.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onMouseDown={(e) => onTaskMouseDown(e, item)}
                        className="w-full text-left bg-zinc-950/80 px-3 py-2.5 rounded-xl cursor-grab hover:bg-zinc-900/80 active:cursor-grabbing transition-all border border-zinc-900 hover:border-zinc-700 group"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs text-zinc-50">{item.text}</span>
                          <span className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onDeleteTodo(item.id);
                              }}
                              className="text-[10px] text-zinc-600 hover:text-zinc-300"
                            >
                              <LuX className="h-3 w-3" aria-hidden="true" />
                            </button>
                          </span>
                        </div>
                        {item.tags && item.tags.length > 0 && (
                          <div className="mt-1 flex flex-wrap gap-1">
                            {item.tags.map((tag) => (
                              <span
                                key={tag}
                                className={`rounded-full border px-2 py-0.5 text-[10px] ${getTagColorClass(
                                  tag
                                )}`}
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </button>
                    ))}
                    {items.length === 0 && (
                      <p className="text-[11px] text-zinc-600 text-center py-8">
                        Drop cards here
                      </p>
                    )}
                  </div>
                </div>
              );
            })}

            {listsForGroup.length === 0 && (
              <div className="col-span-full flex items-center justify-center rounded-2xl border border-dashed border-zinc-800 bg-black/40 py-16">
                <p className="text-[11px] text-zinc-500">
                  No lists available currently. Please create a new list.
                </p>
              </div>
            )}
          </section>

          {/* Right: Done column */}
          <section
            onMouseEnter={() => doneList && onListEnter(doneList.id)}
            className={`relative rounded-2xl border ${
              activeListId === doneList?.id ? 'border-zinc-500/70' : 'border-zinc-900'
            } bg-zinc-1000/40 p-3.5 min-h-[260px] overflow-hidden`}
          >
            <div className="relative flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                <h2 className="text-xs font-medium text-zinc-50 tracking-tight">Done</h2>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-zinc-500">
                  {doneList ? getTodosForList(doneList.id).length : 0}
                </span>
                <button
                  type="button"
                  onClick={() => doneList && onOpenTaskModal(doneList.id)}
                  className="flex h-5 w-5 items-center justify-center rounded-full border border-zinc-700 text-[11px] text-zinc-300 hover:border-zinc-400 hover:text-zinc-50 transition-colors"
                >
                  <LuPlus className="h-3 w-3" aria-hidden="true" />
                </button>
              </div>
            </div>

            <div className="relative space-y-2 pt-1">
              {doneList &&
                getTodosForList(doneList.id).map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onMouseDown={(e) => onTaskMouseDown(e, item)}
                    className="w-full text-left bg-zinc-950/80 px-3 py-2.5 rounded-xl cursor-grab hover:bg-zinc-900/80 active:cursor-grabbing transition-all border border-zinc-900 hover:border-emerald-600/70 group"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-400/95 text-[10px] text-black">
                          <LuCheck className="h-3 w-3" aria-hidden="true" />
                        </span>
                        <span className="text-xs text-zinc-50">{item.text}</span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteTodo(item.id);
                        }}
                        className="text-[10px] text-zinc-600 hover:text-zinc-200 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <LuX className="h-3 w-3" aria-hidden="true" />
                      </button>
                    </div>
                    {item.tags && item.tags.length > 0 && (
                      <div className="mt-1 flex flex-wrap gap-1 pl-6">
                        {item.tags.map((tag) => (
                          <span
                            key={tag}
                            className={`rounded-full border px-2 py-0.5 text-[10px] ${getTagColorClass(
                              tag
                            )}`}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </button>
                ))}
              {(!doneList || getTodosForList(doneList.id).length === 0) && (
                <p className="text-[11px] text-zinc-500 text-center py-10">
                  Drag a card here to mark it done.
                </p>
              )}
            </div>

            {/* Green rounded circle with tick and small animation when hovering/dropping */}
            <div
              className={`pointer-events-none absolute inset-x-0 bottom-4 flex justify-center transition-opacity duration-200 ${
                isOverDone ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <div
                className={`flex items-center gap-2 rounded-full border border-emerald-400/80 bg-emerald-500/20 px-4 py-1.5 text-[11px] text-emerald-100 shadow-[0_0_0_1px_rgba(34,197,94,0.45)] ${
                  showDonePulse ? 'done-pulse' : ''
                }`}
              >
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-400 text-[10px] text-black">
                  <LuCheck className="h-3 w-3" aria-hidden="true" />
                </span>
                <span>Nice! Drop to complete.</span>
              </div>
            </div>
          </section>
        </div>
      )}
    </section>
  );
}

export default GroupSection;


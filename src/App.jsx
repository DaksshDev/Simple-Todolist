import { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import './App.css';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import TaskModal from './components/TaskModal.jsx';
import GroupModal from './components/GroupModal.jsx';
import GroupSection from './components/GroupSection.jsx';
import ListColorModal from './components/ListColorModal.jsx';

const INITIAL_GROUPS = [
  { id: 'default', name: 'Default' },
];

const DEFAULT_LIST_COLOR = null;

const INITIAL_LISTS = [
  { id: 'todo', name: 'Todo', type: 'custom', groupId: 'default' },
  { id: 'ideas', name: 'Ideas', type: 'custom', groupId: 'default' },
  { id: 'done', name: 'Done', type: 'done', groupId: 'default' },
];

const INITIAL_TODOS = [];

const TAG_COLOR_CLASSES = [
  'bg-emerald-500/10 text-emerald-200 border-emerald-500/40',
  'bg-sky-500/10 text-sky-200 border-sky-500/40',
  'bg-violet-500/10 text-violet-200 border-violet-500/40',
  'bg-amber-500/10 text-amber-200 border-amber-500/40',
  'bg-rose-500/10 text-rose-200 border-rose-500/40',
  'bg-lime-500/10 text-lime-200 border-lime-500/40',
];

const getTagColorClass = (tag) => {
  if (!tag) return TAG_COLOR_CLASSES[0];
  let sum = 0;
  for (let i = 0; i < tag.length; i += 1) {
    sum += tag.charCodeAt(i);
  }
  const index = sum % TAG_COLOR_CLASSES.length;
  return TAG_COLOR_CLASSES[index];
};

function App() {
  const [groups, setGroups] = useState(INITIAL_GROUPS);
  const [lists, setLists] = useState(INITIAL_LISTS);
  const [todos, setTodos] = useState(INITIAL_TODOS);

  const [activeGroupId, setActiveGroupId] = useState(
    INITIAL_GROUPS[0]?.id || ''
  );

  const [openGroupIds, setOpenGroupIds] = useState(() =>
    INITIAL_GROUPS.map((g) => g.id)
  );

  const [draggedItem, setDraggedItem] = useState(null);
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });
  const [activeListId, setActiveListId] = useState(null);
  const [isOverDone, setIsOverDone] = useState(false);
  const [showDonePulse, setShowDonePulse] = useState(false);
  const [draggedListId, setDraggedListId] = useState(null);

  const [activeModalListId, setActiveModalListId] = useState(null);
  const [modalText, setModalText] = useState('');
  const [modalTagsInput, setModalTagsInput] = useState('');
  const [modalTags, setModalTags] = useState([]);

  const [groupModal, setGroupModal] = useState(null); // { mode: 'create'|'rename'|'delete', groupId?: string }
  const [groupNameInput, setGroupNameInput] = useState('');
  const [listColorModal, setListColorModal] = useState(null); // { context: 'create'|'edit', groupId?, listId?, currentColor? }
  const [createListColorByGroup, setCreateListColorByGroup] = useState({});

  // Load from localStorage (preserves list colors and all list fields)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const raw = window.localStorage.getItem('firelist-state');
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (parsed.groups && parsed.lists && parsed.todos) {
        setGroups(parsed.groups);
        setLists(parsed.lists);
        setTodos(parsed.todos);
        setOpenGroupIds(parsed.groups.map((g) => g.id));
        setActiveGroupId(parsed.groups[0]?.id || '');
      }
    } catch {
      // ignore malformed storage
    }
  }, []);

  // Persist to localStorage (includes list colors)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const payload = JSON.stringify({ groups, lists, todos });
    window.localStorage.setItem('firelist-state', payload);
  }, [groups, lists, todos]);

  useEffect(() => {
    if (!draggedItem) return;

    const handleMouseMove = (e) => {
      setDragPosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseUp = () => {
      if (draggedItem && activeListId) {
        const targetList = lists.find((l) => l.id === activeListId);
        setTodos((prev) =>
          prev.map((todo) =>
            todo.id === draggedItem.id ? { ...todo, listId: activeListId } : todo
          )
        );
        if (targetList?.type === 'done') {
          triggerConfetti();
          setShowDonePulse(true);
          setTimeout(() => setShowDonePulse(false), 500);
        }
      }

      setDraggedItem(null);
      setActiveListId(null);
      setIsOverDone(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [draggedItem, activeListId, lists]);

  const triggerConfetti = () => {
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#22c55e', '#ecfeff', '#f97316', '#38bdf8', '#a855f7'],
    });
  };

  const addTodo = (targetListId, text, tags) => {
    if (!text.trim()) return;
    setTodos((prev) => [
      ...prev,
      {
        id: Date.now(),
        text: text.trim(),
        listId: targetListId,
        tags: tags || [],
      },
    ]);
  };

  const closeModal = () => {
    setActiveModalListId(null);
    setModalText('');
    setModalTagsInput('');
    setModalTags([]);
  };

  const addList = (groupId, name, color = DEFAULT_LIST_COLOR) => {
    if (!name || !name.trim()) return;
    const id = name.toLowerCase().replace(/\s+/g, '-');
    if (lists.some((l) => l.id === id)) {
      window.alert('A list with that name already exists.');
      return;
    }
    const targetGroupId = groupId || (groups[0] && groups[0].id);
    if (!targetGroupId) {
      window.alert('Create a group first.');
      return;
    }
    setLists((prev) => [
      ...prev,
      {
        id,
        name: name.trim(),
        type: 'custom',
        groupId: targetGroupId,
        ...(color ? { color } : {}),
      },
    ]);
  };

  const updateList = (listId, { name, color }) => {
    setLists((prev) =>
      prev.map((l) => {
        if (l.id !== listId) return l;
        const next = { ...l };
        if (name !== undefined) next.name = name;
        if (color !== undefined) next.color = color;
        return next;
      })
    );
  };

  const deleteTodo = (id) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  const deleteList = (listId) => {
    const list = lists.find((l) => l.id === listId);
    if (!list) return;
    setLists((prev) => prev.filter((l) => l.id !== listId));
    setTodos((prev) => prev.filter((t) => t.listId !== listId));
  };

  const handleCardMouseDown = (e, item) => {
    e.preventDefault();
    setDraggedItem(item);
    setDragPosition({ x: e.clientX, y: e.clientY });
  };

  const handleListEnter = (listId) => {
    if (!draggedItem) return;
    setActiveListId(listId);
    const list = lists.find((l) => l.id === listId);
    setIsOverDone(list?.type === 'done');
  };

  const openModalForList = (listId) => {
    setActiveModalListId(listId);
    setModalText('');
    setModalTagsInput('');
    setModalTags([]);
  };

  const handleModalSubmit = () => {
    if (!activeModalListId) return;
    const extraTags =
      modalTagsInput
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean) || [];
    const tags = [...modalTags, ...extraTags];
    addTodo(activeModalListId, modalText, tags);
    closeModal();
  };

  return (
    <div className="bg-[#050505] min-h-screen w-full flex flex-col items-center py-6 px-6 text-white">
      <div className="w-full max-w-6xl flex flex-col gap-8">
        <Header />

        {/* Groups accordion */}
        <div className="space-y-4">
          {groups.map((group) => {
            const listsForGroup = lists.filter((l) => l.groupId === group.id);

            const isOpen = openGroupIds.includes(group.id);

            return (
              <GroupSection
                key={group.id}
                group={{
                  ...group,
                  onRename: () => {
                    setGroupModal({ mode: 'rename', groupId: group.id });
                    setGroupNameInput(group.name);
                  },
                  onDelete: () => {
                    setGroupModal({ mode: 'delete', groupId: group.id });
                    setGroupNameInput(group.name);
                  },
                  onListDragStart: (listId) => setDraggedListId(listId),
                }}
                isOpen={isOpen}
                onToggleOpen={() => {
                  setOpenGroupIds((prev) =>
                    prev.includes(group.id)
                      ? prev.filter((id) => id !== group.id)
                      : [...prev, group.id]
                  );
                  setActiveGroupId(group.id);
                }}
                lists={listsForGroup}
                todos={todos}
                getTagColorClass={getTagColorClass}
                activeListId={activeListId}
                onListEnter={handleListEnter}
                onTaskMouseDown={handleCardMouseDown}
                onAddList={(name, color) => {
                  addList(group.id, name, color ?? createListColorByGroup[group.id] ?? DEFAULT_LIST_COLOR);
                  setCreateListColorByGroup((prev) => ({ ...prev, [group.id]: undefined }));
                }}
                createListColor={createListColorByGroup[group.id]}
                onOpenListColorModal={(opts) => setListColorModal(opts)}
                onUpdateList={updateList}
                onDeleteList={deleteList}
                onDeleteTodo={deleteTodo}
                onOpenTaskModal={openModalForList}
                draggedListId={draggedListId}
                onReorderLists={(groupId, fromId, toId) => {
                  setLists((prev) => {
                    const inGroup = prev.filter((l) => l.groupId === groupId);
                    const others = prev.filter((l) => l.groupId !== groupId);
                    const fromIndex = inGroup.findIndex((l) => l.id === fromId);
                    const toIndex = inGroup.findIndex((l) => l.id === toId);
                    if (fromIndex === -1 || toIndex === -1) return prev;
                    const reordered = [...inGroup];
                    const [moved] = reordered.splice(fromIndex, 1);
                    reordered.splice(toIndex, 0, moved);
                    return [...others, ...reordered];
                  });
                  setDraggedListId(null);
                }}
                isOverDone={isOverDone}
                showDonePulse={showDonePulse}
              />
            );
          })}

          {/* Create group button */}
          <div className="flex justify-center pt-2">
            <button
              type="button"
              onClick={() => {
                setGroupModal({ mode: 'create' });
                setGroupNameInput('');
              }}
              className="inline-flex items-center gap-2 rounded-full bg-white text-black text-xs font-medium px-4 py-1.5 hover:bg-zinc-200"
            >
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-black text-white text-[10px]">
                +
              </span>
              <span>Create group</span>
            </button>
          </div>
        </div>

        {/* Floating drag card */}
        {draggedItem && (
          <div
            className="pointer-events-none fixed z-50 w-60 -translate-x-1/2 -translate-y-1/2"
            style={{ left: dragPosition.x, top: dragPosition.y }}
          >
            <div className="bg-zinc-950/90 px-3 py-2.5 rounded-2xl border border-zinc-700 shadow-xl shadow-black/60">
              <span className="text-xs text-zinc-50">{draggedItem.text}</span>
            </div>
          </div>
        )}

        <TaskModal
          isOpen={!!activeModalListId}
          listName={lists.find((l) => l.id === activeModalListId)?.name || ''}
          text={modalText}
          tags={modalTags}
          tagsInput={modalTagsInput}
          onChangeText={setModalText}
          onChangeTags={setModalTagsInput}
          onAddTag={(tag) =>
            setModalTags((prev) =>
              prev.includes(tag) ? prev : [...prev, tag]
            )
          }
          onRemoveTag={(index) =>
            setModalTags((prev) => prev.filter((_, i) => i !== index))
          }
          onSubmit={handleModalSubmit}
          onClose={closeModal}
        />

        <ListColorModal
          key={listColorModal?.listId ?? listColorModal?.groupId ?? 'create'}
          isOpen={!!listColorModal}
          currentColor={
            listColorModal?.context === 'edit' && listColorModal?.listId
              ? lists.find((l) => l.id === listColorModal.listId)?.color
              : listColorModal?.context === 'create'
                ? createListColorByGroup[listColorModal?.groupId]
                : undefined
          }
          onSelect={(color) => {
            if (listColorModal?.context === 'create' && listColorModal?.groupId) {
              setCreateListColorByGroup((prev) => ({ ...prev, [listColorModal.groupId]: color }));
            } else if (listColorModal?.context === 'edit' && listColorModal?.listId) {
              updateList(listColorModal.listId, { color });
            }
          }}
          onClose={() => setListColorModal(null)}
        />

        <GroupModal
          mode={groupModal?.mode}
          isOpen={!!groupModal}
          name={groupNameInput}
          onChangeName={setGroupNameInput}
          onConfirm={() => {
            if (!groupModal) return;
            if (groupModal.mode === 'create') {
              const id = groupNameInput.toLowerCase().replace(/\s+/g, '-');
              if (!groupNameInput.trim() || groups.some((g) => g.id === id)) {
                return;
              }
              const next = [...groups, { id, name: groupNameInput.trim() }];
              setGroups(next);
              setOpenGroupIds((prev) => [...prev, id]);
            } else if (groupModal.mode === 'rename' && groupModal.groupId) {
              if (!groupNameInput.trim()) return;
              setGroups((prev) =>
                prev.map((g) =>
                  g.id === groupModal.groupId ? { ...g, name: groupNameInput.trim() } : g
                )
              );
            } else if (groupModal.mode === 'delete' && groupModal.groupId) {
              if (groups.length === 1) {
                return;
              }
              const groupId = groupModal.groupId;
              const remainingGroups = groups.filter((g) => g.id !== groupId);
              const listIdsToRemove = lists
                .filter((l) => l.groupId === groupId)
                .map((l) => l.id);
              setGroups(remainingGroups);
              setLists((prev) => prev.filter((l) => l.groupId !== groupId));
              setTodos((prev) => prev.filter((t) => !listIdsToRemove.includes(t.listId)));
              setOpenGroupIds((prev) => prev.filter((id) => id !== groupId));
            }
            setGroupModal(null);
            setGroupNameInput('');
          }}
          onCancel={() => {
            setGroupModal(null);
            setGroupNameInput('');
          }}
        />

        <Footer />
      </div>
    </div>
  );
}

export default App;


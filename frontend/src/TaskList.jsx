import { useMemo, useState, useEffect, useRef } from 'react';
import {
  CheckCircle2,
  Circle,
  ClipboardCheck,
  ClipboardList,
  Plus,
  Sparkles,
  Trash2,
  X,
  AlertTriangle
} from 'lucide-react';
import InteractiveSurface from './InteractiveSurface';
import Reveal, { RevealGroup } from './Reveal';
import Typewriter from './Typewriter';

function TaskItem({ task, index, delay, onToggle, onDelete, onViewDetails, dragItemRef, dragOverItemRef, onSort }) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [isLong, setIsLong] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const titleRef = useRef(null);

  const handleMouseEnter = () => {
    if (titleRef.current) {
      setIsLong(titleRef.current.scrollWidth > titleRef.current.clientWidth);
    }
  };

  const handleTitleClick = () => {
    if (titleRef.current && titleRef.current.scrollWidth > titleRef.current.clientWidth) {
      onViewDetails(task);
    }
  };

  useEffect(() => {
    let timeout;
    if (confirmDelete) {
      timeout = setTimeout(() => setConfirmDelete(false), 4000);
    }
    return () => clearTimeout(timeout);
  }, [confirmDelete]);

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    if (confirmDelete) {
      setIsExiting(true);
      setTimeout(() => {
        onDelete(task.id);
      }, 400); // 400ms CSS transition
    } else {
      setConfirmDelete(true);
    }
  };

  const handleDragStart = (e) => {
    dragItemRef.current = index;
    e.dataTransfer.effectAllowed = 'move';
    setTimeout(() => {
      setIsDragging(true);
    }, 0);
  };

  const handleDragEnter = (e) => {
    dragOverItemRef.current = index;
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    onSort();
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <InteractiveSurface
      as="li"
      draggable
      onDragStart={handleDragStart}
      onDragEnter={handleDragEnter}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      className={`task-item ${task.completed ? 'completed' : ''} ${isExiting ? 'task-exit' : ''} ${isLong ? 'is-long-capsule' : ''} ${isDragging ? 'is-dragging' : ''}`}
      variant="tile"
      onMouseEnter={handleMouseEnter}
      onClick={handleTitleClick}
      title={isLong ? "Click para ver la tarea completa" : undefined}
    >
      <button
        className="icon-button"
        type="button"
        aria-label={task.completed ? 'Marcar como pendiente' : 'Marcar como completada'}
        onClick={(e) => { e.stopPropagation(); onToggle(task.id); }}
        disabled={isExiting}
      >
        {task.completed ? (
          <CheckCircle2 size={22} aria-hidden="true" />
        ) : (
          <Circle size={22} aria-hidden="true" />
        )}
      </button>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', minWidth: 0 }}>
        <span className="task-index" style={{ color: 'var(--teal-dark)', opacity: 0.6, fontWeight: 800, fontSize: '15px', marginRight: '6px', minWidth: '22px' }}>
          {index + 1}.
        </span>

        <span 
          className="task-title" 
          style={{ flex: 1 }} 
          ref={titleRef}
        >
          {confirmDelete ? (
            <span className="delete-warning" style={{ color: 'var(--danger)', fontWeight: 500 }}>
              <AlertTriangle size={16} aria-hidden="true" style={{ display: 'inline', verticalAlign: 'text-bottom', marginRight: '6px' }} />
              ¿Eliminar tarea?
            </span>
          ) : (
            <Typewriter text={task.title} speed={25} delay={delay} />
          )}
        </span>
      </div>

      <button
        className={`icon-button danger ${confirmDelete ? 'confirm-active' : ''}`}
        type="button"
        aria-label={confirmDelete ? 'Confirmar eliminación' : 'Eliminar tarea'}
        onClick={handleDeleteClick}
        disabled={isExiting}
      >
        {confirmDelete ? (
          <X size={20} aria-hidden="true" />
        ) : (
          <Trash2 size={20} aria-hidden="true" />
        )}
      </button>
    </InteractiveSurface>
  );
}

const initialTasks = [
  { id: 1, title: 'Revisar prioridades del equipo', completed: true },
  { id: 2, title: 'Preparar tablero de avance', completed: false },
  { id: 3, title: 'Enviar resumen semanal', completed: false },
];

function TaskList() {
  const [tasks, setTasks] = useState(initialTasks);
  const [newTask, setNewTask] = useState('');
  const [selectedTask, setSelectedTask] = useState(null);

  const dragItemRef = useRef(null);
  const dragOverItemRef = useRef(null);

  const handleSort = () => {
    if (dragItemRef.current === null || dragOverItemRef.current === null || dragItemRef.current === dragOverItemRef.current) {
      return;
    }
    const _tasks = [...tasks];
    const draggedItemContent = _tasks.splice(dragItemRef.current, 1)[0];
    _tasks.splice(dragOverItemRef.current, 0, draggedItemContent);
    dragItemRef.current = null;
    dragOverItemRef.current = null;
    setTasks(_tasks);
  };

  const stats = useMemo(() => {
    const completed = tasks.filter((task) => task.completed).length;

    return {
      total: tasks.length,
      completed,
      pending: tasks.length - completed,
    };
  }, [tasks]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const title = newTask.trim();

    if (!title) {
      return;
    }

    setTasks((currentTasks) => [
      { id: Date.now(), title, completed: false },
      ...currentTasks,
    ]);
    setNewTask('');
  };

  const toggleTask = (taskId) => {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task,
      ),
    );
  };

  const deleteTask = (taskId) => {
    setTasks((currentTasks) => currentTasks.filter((task) => task.id !== taskId));
  };

  return (
    <section className="page task-page">
      <Reveal className="page-intro compact">
        <span className="eyebrow">
          <ClipboardList size={16} aria-hidden="true" />
          Tareas
        </span>
        <h1>Organiza el trabajo pendiente con claridad.</h1>
        <p>
          Crea, completa y elimina tareas desde una interfaz pensada para seguimiento diario.
        </p>
      </Reveal>

      <div className="task-layout">
        <Reveal as={InteractiveSurface} className="summary-panel" surfaceVariant="panel">
          <div className="summary-icon">
            <Sparkles aria-hidden="true" />
          </div>
          <h2>Resumen del dia</h2>
          <p>{stats.pending === 0 ? 'Todo esta al dia.' : `${stats.pending} tareas siguen abiertas.`}</p>
          <div className="summary-stats">
            <InteractiveSurface as="div" variant="tile">
              <strong>{stats.total}</strong>
              <span>Total</span>
            </InteractiveSurface>
            <InteractiveSurface as="div" variant="tile">
              <strong>{stats.completed}</strong>
              <span>Completadas</span>
            </InteractiveSurface>
            <InteractiveSurface as="div" variant="tile">
              <strong>{stats.pending}</strong>
              <span>Pendientes</span>
            </InteractiveSurface>
          </div>
        </Reveal>

        <Reveal as={InteractiveSurface} className="task-board" delay={90} surfaceVariant="panel">
          <form className="task-form" onSubmit={handleSubmit}>
            <label htmlFor="new-task">Nueva tarea</label>
            <div className="input-row">
              <input
                id="new-task"
                type="text"
                value={newTask}
                onChange={(event) => setNewTask(event.target.value)}
                placeholder="Ej. Confirmar reunion con cliente"
              />
              <button className="btn btn-primary" type="submit">
                <Plus size={18} aria-hidden="true" />
                Agregar
              </button>
            </div>
          </form>

          {tasks.length > 0 ? (
            <RevealGroup as="ul" className="task-list" stagger={70} delay={70}>
              {tasks.map((task, index) => (
                  <TaskItem 
                    key={task.id} 
                    task={task}
                    index={index}
                    delay={70 + index * 70} 
                    onToggle={toggleTask} 
                    onDelete={deleteTask} 
                    onViewDetails={setSelectedTask}
                    dragItemRef={dragItemRef}
                    dragOverItemRef={dragOverItemRef}
                    onSort={handleSort}
                  />
              ))}
            </RevealGroup>
          ) : (
            <Reveal as={InteractiveSurface} className="empty-state" delay={70} surfaceVariant="card">
              <ClipboardCheck size={42} aria-hidden="true" />
              <h2>No hay tareas pendientes</h2>
              <p>Agrega una nueva tarea para empezar a construir tu flujo de trabajo.</p>
            </Reveal>
          )}
        </Reveal>
      </div>

      {selectedTask && (
        <div className="task-modal-overlay" onClick={() => setSelectedTask(null)}>
          <InteractiveSurface as="div" className="task-modal" variant="card" onClick={(e) => e.stopPropagation()}>
            <button className="icon-button close-btn" onClick={(e) => { e.stopPropagation(); setSelectedTask(null); }} aria-label="Cerrar detalles">
              <X size={20} />
            </button>
            <h3>Detalles de la tarea</h3>
            <div className="task-modal-content">
              {selectedTask.title}
            </div>
          </InteractiveSurface>
        </div>
      )}
    </section>
  );
}

export default TaskList;

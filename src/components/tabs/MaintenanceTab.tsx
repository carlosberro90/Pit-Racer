import React, { useState } from 'react';
import { 
  Wrench, 
  Flame, 
  Disc, 
  Link as ChainIcon, 
  Settings, 
  CircleDot, 
  Plus, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  ChevronRight, 
  Calendar,
  Check,
  History,
  DollarSign
} from 'lucide-react';
import { MaintenanceTask, MaintenanceLogEntry } from '../../types';
import { MotorcycleOilBottleIcon } from '../common/MotorcycleOilBottleIcon';
import { MotorcycleSparkPlugIcon } from '../common/MotorcycleSparkPlugIcon';
import { MotorcycleRearSprocketIcon } from '../common/MotorcycleRearSprocketIcon';
import { MotorcycleTireIcon } from '../common/MotorcycleTireIcon';

interface MaintenanceTabProps {
  tasks: MaintenanceTask[];
  logs: MaintenanceLogEntry[];
  currentOdometer: number;
  onOpenCompleteModal: (task: MaintenanceTask) => void;
  onAddTask: (task: MaintenanceTask) => void;
  onUpdateTaskInterval: (taskId: string, newIntervalKm: number) => void;
}

export const MaintenanceTab: React.FC<MaintenanceTabProps> = ({
  tasks,
  logs,
  currentOdometer,
  onOpenCompleteModal,
  onAddTask,
  onUpdateTaskInterval,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'tasks' | 'history'>('tasks');
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [editingIntervalTaskId, setEditingIntervalTaskId] = useState<string | null>(null);
  const [tempInterval, setTempInterval] = useState<string>('2500');

  // New task form state
  const [newTitle, setNewTitle] = useState('');
  const [newIntervalKm, setNewIntervalKm] = useState('3000');
  const [newColor, setNewColor] = useState('#19437D');
  const [newNotes, setNewNotes] = useState('');

  const getTaskIcon = (iconName: string, title?: string) => {
    // If it's oil change by icon or title, render the motorcycle oil bottle container
    if (iconName === 'oil' || (title && title.toLowerCase().includes('aceite'))) {
      return <MotorcycleOilBottleIcon className="w-6 h-6" />;
    }
    // If it's spark plug by icon or title, render the motorcycle spark plug icon
    if (
      iconName === 'spark' ||
      (title && (title.toLowerCase().includes('bujia') || title.toLowerCase().includes('bujía')))
    ) {
      return <MotorcycleSparkPlugIcon className="w-6 h-6" />;
    }
    // If it's kit de arrastre / sprocket / corona / cadena by icon or title, render the motorcycle rear drive sprocket
    if (
      iconName === 'sprocket' ||
      iconName === 'chain' ||
      (title &&
        (title.toLowerCase().includes('arrastre') ||
          title.toLowerCase().includes('corona') ||
          title.toLowerCase().includes('catalina') ||
          title.toLowerCase().includes('cadena')))
    ) {
      return <MotorcycleRearSprocketIcon className="w-6 h-6" />;
    }
    // If it's tire / tire pressure by icon or title, render the motorcycle tire icon
    if (
      iconName === 'tire' ||
      (title &&
        (title.toLowerCase().includes('neumatic') ||
          title.toLowerCase().includes('neumátic') ||
          title.toLowerCase().includes('caucho') ||
          title.toLowerCase().includes('llanta') ||
          title.toLowerCase().includes('presion') ||
          title.toLowerCase().includes('presión')))
    ) {
      return <MotorcycleTireIcon className="w-6 h-6" />;
    }
    switch (iconName) {
      case 'disc':
        return <Disc className="w-5 h-5" />;
      case 'chain':
        return <MotorcycleRearSprocketIcon className="w-6 h-6" />;
      case 'valve':
        return <Settings className="w-5 h-5" />;
      case 'tire':
        return <MotorcycleTireIcon className="w-6 h-6" />;
      default:
        return <Wrench className="w-5 h-5" />;
    }
  };

  const handleSaveNewTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newTask: MaintenanceTask = {
      id: 'task-' + Date.now(),
      bikeId: 'bike-primary',
      title: newTitle.trim(),
      category: 'general',
      intervalKm: parseInt(newIntervalKm, 10) || 2500,
      lastServicedKm: currentOdometer,
      lastServicedDate: new Date().toISOString().split('T')[0],
      colorHex: newColor,
      iconName: newTitle.toLowerCase().includes('buji')
        ? 'spark'
        : newTitle.toLowerCase().includes('aceite')
        ? 'oil'
        : newTitle.toLowerCase().includes('arrastre') || newTitle.toLowerCase().includes('corona') || newTitle.toLowerCase().includes('cadena')
        ? 'sprocket'
        : newTitle.toLowerCase().includes('neumat') || newTitle.toLowerCase().includes('caucho') || newTitle.toLowerCase().includes('presion')
        ? 'tire'
        : 'wrench',
      notes: newNotes.trim() || undefined,
    };

    onAddTask(newTask);
    setIsAddingTask(false);
    setNewTitle('');
  };

  const handleSaveInterval = (taskId: string) => {
    const val = parseInt(tempInterval, 10);
    if (val > 0) {
      onUpdateTaskInterval(taskId, val);
    }
    setEditingIntervalTaskId(null);
  };

  return (
    <div className="space-y-6">
      {/* Sub-navigation tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 p-1 bg-slate-200/60 dark:bg-slate-800/80 rounded-xl max-w-fit">
          <button
            type="button"
            onClick={() => setActiveSubTab('tasks')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
              activeSubTab === 'tasks'
                ? 'bg-white dark:bg-[#182232] text-[#19437D] dark:text-sky-300 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Servicios y Alertas ({tasks.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab('history')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
              activeSubTab === 'history'
                ? 'bg-white dark:bg-[#182232] text-[#19437D] dark:text-sky-300 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Historial de Reparaciones ({logs.length})
          </button>
        </div>

        {activeSubTab === 'tasks' && (
          <button
            type="button"
            onClick={() => setIsAddingTask(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#19437D] hover:bg-[#153766] text-white text-xs font-bold shadow-sm transition-all cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Nuevo Servicio</span>
          </button>
        )}
      </div>

      {/* New Task Inline Form Modal */}
      {isAddingTask && (
        <div className="p-5 sm:p-6 bg-white dark:bg-[#182232] rounded-3xl border border-[#19437D]/30 shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <Wrench className="w-4 h-4 text-[#19437D] dark:text-sky-400" />
              <span>Crear Nuevo Servicio de Mantenimiento</span>
            </h3>
            <button
              type="button"
              onClick={() => setIsAddingTask(false)}
              className="text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              Cancelar
            </button>
          </div>

          <form onSubmit={handleSaveNewTask} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Nombre del Servicio</label>
              <input
                type="text"
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="ej. Filtro de Aire, Batería"
                className="w-full h-11 px-3.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs sm:text-sm focus:ring-2 focus:ring-[#19437D] transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Intervalo en Km</label>
              <input
                type="number"
                min="100"
                step="100"
                required
                value={newIntervalKm}
                onChange={(e) => setNewIntervalKm(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs sm:text-sm font-mono font-bold focus:ring-2 focus:ring-[#19437D] transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Color & Guardar</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={newColor}
                  onChange={(e) => setNewColor(e.target.value)}
                  className="w-11 h-11 rounded-xl border border-slate-300 dark:border-slate-700 cursor-pointer p-0.5 shrink-0"
                />
                <button
                  type="submit"
                  className="flex-1 h-11 rounded-xl bg-[#19437D] hover:bg-[#153766] text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  Guardar
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Main Task List (Matches Flutter Maintenance Tab) */}
      {activeSubTab === 'tasks' ? (
        <div className="space-y-3">
          {tasks.map((task) => {
            const kmTraveled = Math.max(0, currentOdometer - task.lastServicedKm);
            const kmRemaining = task.intervalKm - kmTraveled;
            const percentage = Math.min(100, Math.round((kmTraveled / task.intervalKm) * 100));
            const isDue = kmRemaining <= 0;
            const isNear = kmRemaining > 0 && kmRemaining <= task.intervalKm * 0.2;

            // Generate status string matching Flutter
            let statusText = '';
            if (task.title.toLowerCase().includes('aceite')) {
              statusText = isDue ? '¡Cambio urgente vencido!' : `Próximo a los ${(task.lastServicedKm + task.intervalKm).toLocaleString()} Km (Faltan ${kmRemaining} Km)`;
            } else if (task.title.toLowerCase().includes('bujía')) {
              statusText = isDue ? 'Revisión vencida' : `Al día (Faltan ${kmRemaining} Km)`;
            } else if (task.title.toLowerCase().includes('frenos')) {
              statusText = isDue ? 'Pastillas al límite' : 'Excelente estado';
            } else if (task.title.toLowerCase().includes('arrastre') || task.title.toLowerCase().includes('cadena')) {
              statusText = isDue ? 'Tensión urgente' : 'Revisión periódica';
            } else if (task.title.toLowerCase().includes('válvula')) {
              statusText = isDue ? 'Calibrar balancines' : 'Próximo mantenimiento';
            } else if (task.title.toLowerCase().includes('neumático')) {
              statusText = isDue ? 'Verificar PSI urgente' : 'Revisión semanal al día';
            } else {
              statusText = isDue ? 'Mantenimiento vencido' : `Al día (Faltan ${kmRemaining} Km)`;
            }

            return (
              <div
                key={task.id}
                className="bg-white dark:bg-[#182232] rounded-2xl p-4 md:p-5 shadow-sm border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-4 flex-1">
                  {/* Circle Avatar styled exactly like Flutter with task['color'] */}
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 shadow-xs"
                    style={{
                      backgroundColor: `${task.colorHex}22`,
                      color: task.colorHex,
                    }}
                  >
                    {getTaskIcon(task.iconName, task.title)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-sm md:text-base text-slate-900 dark:text-slate-100">
                        {task.title}
                      </h3>
                      {isDue && (
                        <span className="text-[10px] font-bold uppercase tracking-wider text-red-600 bg-red-100 dark:bg-red-950/60 dark:text-red-400 px-2 py-0.5 rounded-full">
                          Vencido
                        </span>
                      )}
                      {isNear && (
                        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 bg-amber-100 dark:bg-amber-950/60 dark:text-amber-400 px-2 py-0.5 rounded-full">
                          Próximo
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {statusText}
                    </p>

                    {/* Progress Bar */}
                    <div className="mt-3 max-w-md">
                      <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1 font-mono">
                        <span>Recorrido: {kmTraveled} Km</span>
                        <span>Intervalo: {task.intervalKm} Km ({percentage}%)</span>
                      </div>
                      <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${percentage}%`,
                            backgroundColor: isDue ? '#EF4444' : isNear ? '#F59E0B' : task.colorHex,
                          }}
                        />
                      </div>
                    </div>

                    {task.notes && (
                      <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-2 italic">
                        {task.notes}
                      </p>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                  {editingIntervalTaskId === task.id ? (
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        value={tempInterval}
                        onChange={(e) => setTempInterval(e.target.value)}
                        className="w-20 px-2 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-mono"
                        placeholder="Km"
                      />
                      <button
                        onClick={() => handleSaveInterval(task.id)}
                        className="p-1.5 rounded-lg bg-[#19437D] text-white hover:bg-[#153766]"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingIntervalTaskId(task.id);
                        setTempInterval(task.intervalKm.toString());
                      }}
                      className="px-3 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      title="Editar intervalo en Km"
                    >
                      Ajustar Km
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => onOpenCompleteModal(task)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-white text-white dark:text-slate-900 text-xs font-bold shadow-sm transition-all cursor-pointer"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Marcar Realizado</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Historial de Mantenimientos Realizados */
        <div className="space-y-3">
          {logs.length === 0 ? (
            <div className="p-12 text-center text-sm text-slate-400 bg-white dark:bg-[#182232] rounded-3xl border border-slate-200 dark:border-slate-800">
              <History className="w-8 h-8 mx-auto text-slate-300 mb-2" />
              Aún no tienes reparaciones o servicios registrados en el historial.
            </div>
          ) : (
            logs.map((log) => (
              <div
                key={log.id}
                className="bg-white dark:bg-[#182232] rounded-2xl p-4 shadow-sm border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                    {log.taskTitle.toLowerCase().includes('aceite') ? (
                      <MotorcycleOilBottleIcon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    ) : (log.taskTitle.toLowerCase().includes('bujia') || log.taskTitle.toLowerCase().includes('bujía')) ? (
                      <MotorcycleSparkPlugIcon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    ) : (log.taskTitle.toLowerCase().includes('arrastre') || log.taskTitle.toLowerCase().includes('corona') || log.taskTitle.toLowerCase().includes('cadena')) ? (
                      <MotorcycleRearSprocketIcon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    ) : (log.taskTitle.toLowerCase().includes('neumat') || log.taskTitle.toLowerCase().includes('caucho') || log.taskTitle.toLowerCase().includes('presion') || log.taskTitle.toLowerCase().includes('llanta')) ? (
                      <MotorcycleTireIcon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <CheckCircle2 className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                      {log.taskTitle}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                      {log.date} · Odómetro: {log.odometer.toLocaleString()} Km
                    </p>
                    {log.workshopName && (
                      <p className="text-[11px] text-slate-400">
                        Taller: {log.workshopName}
                      </p>
                    )}
                    {log.notes && (
                      <p className="text-[11px] text-slate-500 italic mt-0.5">"{log.notes}"</p>
                    )}
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-sm font-bold font-mono text-emerald-600 dark:text-emerald-400">
                    ${log.costUsd.toFixed(2)} USD
                  </div>
                  <span className="text-[10px] text-slate-400 uppercase font-medium">Realizado</span>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

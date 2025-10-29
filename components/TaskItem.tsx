
import React from 'react';
import { Task } from '../types';
import { TrashIcon } from './icons/TrashIcon';
import { PencilIcon } from './icons/PencilIcon';
import { RepeatIcon } from './icons/RepeatIcon';

interface TaskItemProps {
    task: Task;
    onDeleteTask: (id: string) => void;
    onEditTask?: (task: Task) => void;
}

const formatInterval = (seconds: number): string => {
    if (seconds < 60) return `${seconds} seconds`;
    const minutes = seconds / 60;
    return `${minutes} minute${minutes > 1 ? 's' : ''}`;
};


export const TaskItem: React.FC<TaskItemProps> = ({ task, onDeleteTask, onEditTask }) => {
    const formattedTime = task.time.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
    });

    const isToday = new Date().toDateString() === task.time.toDateString();
    const formattedDate = isToday ? 'Today' : task.time.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

    const isCompleted = !onEditTask;

    return (
        <div className="bg-slate-800/70 p-4 rounded-lg flex items-center justify-between shadow-md border border-slate-700/50 transition-transform duration-200 hover:scale-[1.02] hover:border-slate-600">
            <div>
                <p className={`font-semibold ${isCompleted ? 'text-slate-400 line-through' : 'text-slate-100'}`}>{task.text}</p>
                <p className={`text-sm ${isCompleted ? 'text-slate-500' : 'text-teal-300'}`}>{formattedDate} at {formattedTime}</p>
                 {task.totalRepeats > 1 && (
                    <div className="flex items-center gap-1.5 mt-1.5 text-xs">
                        <RepeatIcon className="w-3.5 h-3.5 text-sky-400" />
                        {isCompleted ? (
                             <p className="text-slate-500">
                                Repeated {task.totalRepeats} times
                            </p>
                        ) : (
                            <p className="text-sky-400">
                                Repeats every {formatInterval(task.repeatInterval)} 
                                <span className="text-sky-500"> ({task.repeatsLeft - 1} more)</span>
                            </p>
                        )}
                    </div>
                )}
            </div>
            <div className="flex items-center gap-2">
                {onEditTask && (
                     <button
                        onClick={() => onEditTask(task)}
                        className="p-2 rounded-full text-slate-500 hover:text-sky-400 hover:bg-slate-700/50 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-slate-800 transition-colors duration-200"
                        aria-label="Edit task"
                    >
                        <PencilIcon className="w-5 h-5" />
                    </button>
                )}
                <button
                    onClick={() => onDeleteTask(task.id)}
                    className="p-2 rounded-full text-slate-500 hover:text-red-400 hover:bg-slate-700/50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-slate-800 transition-colors duration-200"
                    aria-label="Delete task"
                >
                    <TrashIcon className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};


import React from 'react';
import { Task } from '../types.ts';
import { TaskItem } from './TaskItem.tsx';

interface TaskListProps {
    tasks: Task[];
    onDeleteTask: (id: string) => void;
    onEditTask: (task: Task) => void;
}

export const TaskList: React.FC<TaskListProps> = ({ tasks, onDeleteTask, onEditTask }) => {
    if (tasks.length === 0) {
        return (
            <div className="text-center py-10 px-4 bg-slate-800/30 rounded-2xl border border-dashed border-slate-700">
                <p className="text-slate-400">You have no pending reminders.</p>
                <p className="text-slate-500 text-sm">Add one above to get started!</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
             <h2 className="text-xl font-semibold text-slate-300 pb-2 border-b border-slate-700">Upcoming Reminders</h2>
            {tasks.map(task => (
                <TaskItem key={task.id} task={task} onDeleteTask={onDeleteTask} onEditTask={onEditTask} />
            ))}
        </div>
    );
};
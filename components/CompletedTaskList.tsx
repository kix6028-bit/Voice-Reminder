
import React from 'react';
import { Task } from '../types.ts';
import { TaskItem } from './TaskItem.tsx';

interface CompletedTaskListProps {
    tasks: Task[];
    onDeleteTask: (id: string) => void;
}

export const CompletedTaskList: React.FC<CompletedTaskListProps> = ({ tasks, onDeleteTask }) => {
    if (tasks.length === 0) {
        return (
            <div className="text-center py-10 px-4 bg-slate-800/30 rounded-2xl border border-dashed border-slate-700">
                <p className="text-slate-400">No tasks completed yet.</p>
                <p className="text-slate-500 text-sm">Once a reminder is triggered, it will appear here.</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
             <h2 className="text-xl font-semibold text-slate-300 pb-2 border-b border-slate-700">Completed Tasks</h2>
            {tasks.map(task => (
                <TaskItem key={task.id} task={task} onDeleteTask={onDeleteTask} />
            ))}
        </div>
    );
};
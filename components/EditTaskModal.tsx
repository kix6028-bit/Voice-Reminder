
import React, { useState, useEffect } from 'react';
import { Task } from '../types.ts';
import { TimePicker } from './TimePicker.tsx';
import { RepeatOptions } from './RepeatOptions.tsx';

interface EditTaskModalProps {
    task: Task;
    onUpdateTask: (id: string, text: string, time: string, repeatCount: number, repeatInterval: number) => void;
    onClose: () => void;
    error: string | null;
    setError: (error: string | null) => void;
}

export const EditTaskModal: React.FC<EditTaskModalProps> = ({ task, onUpdateTask, onClose, error, setError }) => {
    const [text, setText] = useState(task.text);
    const [time, setTime] = useState('');
    const [repeatCount, setRepeatCount] = useState(task.totalRepeats);
    const [repeatInterval, setRepeatInterval] = useState(task.repeatInterval);


    useEffect(() => {
        const h24 = task.time.getHours().toString().padStart(2, '0');
        const m = task.time.getMinutes().toString().padStart(2, '0');
        setTime(`${h24}:${m}`);
        setRepeatCount(task.totalRepeats);
        setRepeatInterval(task.repeatInterval);
    }, [task]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (text.trim() && time) {
            onUpdateTask(task.id, text.trim(), time, repeatCount, repeatInterval);
        }
    };
    
    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (error) setError(null);
        setText(e.target.value);
    };

    const handleTimeChange = (newTime: string) => {
        if (error) setError(null);
        setTime(newTime);
    };

    return (
        <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in-down"
            onClick={handleBackdropClick}
            aria-modal="true"
            role="dialog"
        >
            <div className="bg-slate-800/80 p-6 rounded-2xl shadow-2xl shadow-black/30 border border-slate-700/50 w-full max-w-md">
                <h2 className="text-2xl font-bold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-sky-400">Edit Reminder</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="edit-task-text" className="block text-sm font-medium text-slate-300 mb-1">
                            Reminder
                        </label>
                        <input
                            id="edit-task-text"
                            type="text"
                            value={text}
                            onChange={handleTextChange}
                            className="w-full bg-slate-900/70 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:ring-2 focus:ring-teal-400 focus:border-teal-400 outline-none transition duration-200"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="edit-task-time" className="block text-sm font-medium text-slate-300 mb-1">
                            Time
                        </label>
                        <TimePicker
                            id="edit-task-time"
                            value={time}
                            onChange={handleTimeChange}
                        />
                        {error && <p className="text-red-400 text-sm mt-2 animate-fade-in-down">{error}</p>}
                    </div>

                    <RepeatOptions 
                        repeatCount={repeatCount}
                        onRepeatCountChange={setRepeatCount}
                        repeatInterval={repeatInterval}
                        onRepeatIntervalChange={setRepeatInterval}
                    />

                    <div className="flex gap-4 pt-4">
                         <button
                            type="button"
                            onClick={onClose}
                            className="w-full bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold py-3 px-4 rounded-lg transition-colors duration-200"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-teal-400 to-sky-500 hover:from-teal-500 hover:to-sky-600 text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 ease-in-out transform hover:-translate-y-0.5"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
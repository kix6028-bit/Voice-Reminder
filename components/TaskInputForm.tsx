
import React, { useState } from 'react';
import { TimePicker } from './TimePicker';
import { RepeatOptions } from './RepeatOptions';

interface TaskInputFormProps {
    onAddTask: (text: string, time: string, repeatCount: number, repeatInterval: number) => boolean;
    error: string | null;
    setError: (error: string | null) => void;
}

export const TaskInputForm: React.FC<TaskInputFormProps> = ({ onAddTask, error, setError }) => {
    const [text, setText] = useState('');
    const [time, setTime] = useState('');
    const [repeatCount, setRepeatCount] = useState(1);
    const [repeatInterval, setRepeatInterval] = useState(5); // Default to 5 seconds

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (text.trim() && time) {
            if (onAddTask(text.trim(), time, repeatCount, repeatInterval)) {
                setText('');
                setTime('');
                setRepeatCount(1);
                setRepeatInterval(5);
            }
        }
    };
    
    const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (error) setError(null);
        setText(e.target.value);
    }

    const handleTimeChange = (newTime: string) => {
        if (error) setError(null);
        setTime(newTime);
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="task-text" className="block text-sm font-medium text-slate-300 mb-1">
                    What to remember?
                </label>
                <input
                    id="task-text"
                    type="text"
                    value={text}
                    onChange={handleTextChange}
                    placeholder="e.g., Have a breakfast"
                    className="w-full bg-slate-900/70 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:ring-2 focus:ring-teal-400 focus:border-teal-400 outline-none transition duration-200"
                    required
                />
            </div>
            <div>
                 <label htmlFor="task-time" className="block text-sm font-medium text-slate-300 mb-1">
                    At what time?
                </label>
                <TimePicker
                    id="task-time"
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

            <button
                type="submit"
                className="w-full bg-gradient-to-r from-teal-400 to-sky-500 hover:from-teal-500 hover:to-sky-600 text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 ease-in-out transform hover:-translate-y-0.5"
            >
                Set Reminder
            </button>
        </form>
    );
};

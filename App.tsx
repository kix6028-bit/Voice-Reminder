
import React, { useState, useEffect, useCallback } from 'react';
import { Task } from './types';
import { TaskInputForm } from './components/TaskInputForm';
import { TaskList } from './components/TaskList';
import { CompletedTaskList } from './components/CompletedTaskList';
import { BottomNav } from './components/BottomNav';
import { generateAndPlaySpeech } from './services/ttsService';
import { EditTaskModal } from './components/EditTaskModal';

type View = 'upcoming' | 'completed';

const safelyParseTasks = (savedData: string | null): Task[] => {
    if (!savedData) return [];
    try {
        return JSON.parse(savedData).map((t: any) => ({
            ...t,
            time: new Date(t.time),
            totalRepeats: t.totalRepeats !== undefined ? t.totalRepeats : 1,
            repeatsLeft: t.repeatsLeft !== undefined ? t.repeatsLeft : 1,
            repeatInterval: t.repeatInterval !== undefined ? t.repeatInterval : 5,
        }));
    } catch (error) {
        console.error("Failed to parse tasks from localStorage", error);
        return [];
    }
};

const App: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>(() => safelyParseTasks(localStorage.getItem('tasks')));
    const [completedTasks, setCompletedTasks] = useState<Task[]>(() => safelyParseTasks(localStorage.getItem('completedTasks')));

    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [activeView, setActiveView] = useState<View>('upcoming');
    const [formError, setFormError] = useState<string | null>(null);
    const [modalError, setModalError] = useState<string | null>(null);

    useEffect(() => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }, [tasks]);

    useEffect(() => {
        localStorage.setItem('completedTasks', JSON.stringify(completedTasks));
    }, [completedTasks]);

    const handleAddTask = (text: string, time: string, repeatCount: number, repeatInterval: number): boolean => {
        const [hours, minutes] = time.split(':').map(Number);
        const now = new Date();
        const reminderTime = new Date();
        
        reminderTime.setHours(hours, minutes, 0, 0);

        if (reminderTime <= now) {
            reminderTime.setDate(reminderTime.getDate() + 1);
        }

        const isDuplicate = tasks.some(task => task.time.getTime() === reminderTime.getTime());
        if (isDuplicate) {
            setFormError("Reminder with the same time already exist");
            return false;
        }

        const newTask: Task = {
            id: crypto.randomUUID(),
            text,
            time: reminderTime,
            totalRepeats: repeatCount,
            repeatsLeft: repeatCount,
            repeatInterval: repeatInterval,
        };

        setTasks(prevTasks => [...prevTasks, newTask].sort((a, b) => a.time.getTime() - b.time.getTime()));
        setFormError(null);
        return true;
    };

    const handleUpdateTask = (id: string, newText: string, newTime: string, repeatCount: number, repeatInterval: number) => {
        const [hours, minutes] = newTime.split(':').map(Number);
        const now = new Date();
        const reminderTime = new Date();
        
        reminderTime.setHours(hours, minutes, 0, 0);

        if (reminderTime <= now) {
            reminderTime.setDate(reminderTime.getDate() + 1);
        }

        const isDuplicate = tasks.some(task => task.id !== id && task.time.getTime() === reminderTime.getTime());
        if (isDuplicate) {
            setModalError("Another reminder for this time already exists. Please choose a different time.");
            return;
        }

        setTasks(prevTasks => 
            prevTasks.map(task => 
                task.id === id ? { ...task, text: newText, time: reminderTime, totalRepeats: repeatCount, repeatsLeft: repeatCount, repeatInterval: repeatInterval } : task
            ).sort((a, b) => a.time.getTime() - b.time.getTime())
        );
        setEditingTask(null);
        setModalError(null);
    };

    const handleEditTask = (task: Task) => {
        setEditingTask(task);
    };

    const handleDeleteTask = (id: string) => {
        setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
    };

     const handleDeleteCompletedTask = (id: string) => {
        setCompletedTasks(prevTasks => prevTasks.filter(task => task.id !== id));
    };
    
    const triggerAndUpdateReminder = useCallback(async (task: Task) => {
        setIsSpeaking(true);
        const timeString = task.time.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
        const message = `It's time to ${task.text}. It's ${timeString}.`;

        try {
            await generateAndPlaySpeech(message);
        } catch (error) {
            console.error("Error generating or playing speech:", error);
            alert(`Reminder: ${message}`); // Fallback
        } finally {
            setTasks(prevTasks => {
                const taskIndex = prevTasks.findIndex(t => t.id === task.id);

                if (taskIndex === -1) {
                    // Task might have been deleted while speaking
                    return prevTasks;
                }

                const updatedTasks = [...prevTasks];
                const currentTask = updatedTasks[taskIndex];
                const newRepeatsLeft = currentTask.repeatsLeft - 1;

                if (newRepeatsLeft > 0) {
                    // Reschedule the task for the next interval
                    const nextTime = new Date(currentTask.time.getTime() + currentTask.repeatInterval * 1000);
                    updatedTasks[taskIndex] = { ...currentTask, time: nextTime, repeatsLeft: newRepeatsLeft };
                    return updatedTasks.sort((a, b) => a.time.getTime() - b.time.getTime());
                } else {
                    // This was the last repeat, move to completed
                    const [completedTask] = updatedTasks.splice(taskIndex, 1);
                    setCompletedTasks(prevCompleted => [{ ...completedTask, repeatsLeft: 0 }, ...prevCompleted]);
                    return updatedTasks;
                }
            });
            setIsSpeaking(false);
        }
    }, []);

    useEffect(() => {
        const checkReminders = () => {
            if (isSpeaking) return;

            const now = new Date();
            // find the first due task (tasks are sorted)
            const dueTask = tasks.find(task => now >= task.time);

            if (dueTask) {
                triggerAndUpdateReminder(dueTask);
            }
        };

        const intervalId = setInterval(checkReminders, 1000);

        return () => clearInterval(intervalId);
    }, [tasks, isSpeaking, triggerAndUpdateReminder]);
    
    const handleCloseModal = () => {
        setEditingTask(null);
        setModalError(null);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 text-white font-sans">
            <div className="container mx-auto max-w-lg p-4 pt-8 sm:p-6 pb-28">
                <header className="text-center mb-8">
                    <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-sky-400">
                        Voice Reminder
                    </h1>
                    <p className="text-slate-400 mt-2">Set a task and hear it aloud when it's due.</p>
                </header>

                <main>
                    {activeView === 'upcoming' ? (
                        <>
                            <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-2xl shadow-2xl shadow-black/30 border border-slate-700/50">
                                <TaskInputForm onAddTask={handleAddTask} error={formError} setError={setFormError} />
                            </div>
                            
                            <div className="mt-10">
                                <TaskList tasks={tasks} onDeleteTask={handleDeleteTask} onEditTask={handleEditTask} />
                            </div>
                        </>
                    ) : (
                        <div className="mt-2">
                             <CompletedTaskList tasks={completedTasks} onDeleteTask={handleDeleteCompletedTask} />
                        </div>
                    )}
                </main>

                 <footer className="text-center text-slate-500 text-sm mt-12 pb-6">
                    <p>Built with React, Tailwind, and Gemini</p>
                </footer>
            </div>
            {editingTask && (
                <EditTaskModal 
                    task={editingTask}
                    onUpdateTask={handleUpdateTask}
                    onClose={handleCloseModal}
                    error={modalError}
                    setError={setModalError}
                />
            )}
            <BottomNav activeView={activeView} onViewChange={setActiveView} />
        </div>
    );
};

export default App;

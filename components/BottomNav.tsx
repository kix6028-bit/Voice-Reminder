
import React from 'react';
import { CalendarIcon } from './icons/CalendarIcon';
import { CheckIcon } from './icons/CheckIcon';

type View = 'upcoming' | 'completed';

interface BottomNavProps {
    activeView: View;
    onViewChange: (view: View) => void;
}

const NavButton: React.FC<{
    isActive: boolean;
    onClick: () => void;
    label: string;
    children: React.ReactNode;
}> = ({ isActive, onClick, label, children }) => {
    return (
        <button
            onClick={onClick}
            className={`flex flex-col items-center justify-center w-full pt-2 pb-1 text-xs sm:text-sm transition-colors duration-300 ${isActive ? 'text-white' : 'text-slate-400 hover:text-white'}`}
            aria-current={isActive ? 'page' : undefined}
        >
            {children}
            <span className="mt-1">{label}</span>
             {isActive && (
                <div className="h-1 w-12 mt-1 rounded-full bg-gradient-to-r from-teal-300 to-sky-400"></div>
            )}
        </button>
    );
};

export const BottomNav: React.FC<BottomNavProps> = ({ activeView, onViewChange }) => {
    return (
        <nav className="fixed bottom-0 left-0 right-0 h-16 bg-slate-900/80 backdrop-blur-lg border-t border-slate-700/50 shadow-t-2xl shadow-black/50">
            <div className="max-w-lg mx-auto h-full flex justify-around">
                <NavButton
                    isActive={activeView === 'upcoming'}
                    onClick={() => onViewChange('upcoming')}
                    label="Upcoming"
                >
                    <CalendarIcon className="w-6 h-6" />
                </NavButton>
                <NavButton
                    isActive={activeView === 'completed'}
                    onClick={() => onViewChange('completed')}
                    label="Completed"
                >
                    <CheckIcon className="w-6 h-6" />
                </NavButton>
            </div>
        </nav>
    );
};

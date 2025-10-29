
import React, { useState, useEffect, useRef } from 'react';

interface TimePickerProps {
    value: string;
    onChange: (value: string) => void;
    id?: string;
}

const hours = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'));
const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));
const periods = ['AM', 'PM'];

const Column: React.FC<{ items: string[], selectedValue: string, onSelect: (value: string) => void, className?: string }> = ({ items, selectedValue, onSelect, className = '' }) => {
    const columnRef = useRef<HTMLDivElement>(null);
    const selectedRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (selectedRef.current && columnRef.current) {
            const column = columnRef.current;
            const selected = selectedRef.current;
            // Center the selected item
            column.scrollTop = selected.offsetTop - column.offsetTop - (column.clientHeight / 2) + (selected.clientHeight / 2);
        }
    }, [selectedValue, items]);

    return (
        <div ref={columnRef} className={`h-48 overflow-y-scroll snap-y snap-mandatory no-scrollbar ${className}`}>
             {/* Spacers for alignment to center the first and last items */}
            <div className="h-[72px] snap-start"></div>
            {items.map(item => (
                <div
                    key={item}
                    ref={selectedValue === item ? selectedRef : null}
                    onClick={() => onSelect(item)}
                    className={`cursor-pointer snap-center flex items-center justify-center h-12 text-lg transition-colors duration-200 ${
                        selectedValue === item ? 'text-teal-300 font-bold' : 'text-slate-400 hover:text-white'
                    }`}
                >
                    {item}
                </div>
            ))}
             <div className="h-[72px] snap-end"></div>
        </div>
    );
}

export const TimePicker: React.FC<TimePickerProps> = ({ value, onChange, id }) => {
    const [isOpen, setIsOpen] = useState(false);
    const pickerRef = useRef<HTMLDivElement>(null);

    const getTimeParts = (time24h: string) => {
        if (!time24h) {
            const now = new Date();
            const h = now.getHours();
            const m = now.getMinutes();
            return {
                hour: (h % 12 || 12).toString().padStart(2, '0'),
                minute: m.toString().padStart(2, '0'),
                period: h >= 12 ? 'PM' : 'AM',
            };
        }
        const [h, m] = time24h.split(':').map(Number);
        return {
            hour: (h % 12 || 12).toString().padStart(2, '0'),
            minute: m.toString().padStart(2, '0'),
            period: h >= 12 ? 'PM' : 'AM',
        };
    };
    
    const [timeParts, setTimeParts] = useState(getTimeParts(value));

    useEffect(() => {
        if (value) {
            setTimeParts(getTimeParts(value));
        }
    }, [value]);
    
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [pickerRef]);
    
    const handleTimeChange = (part: 'hour' | 'minute' | 'period', newValue: string) => {
        const newParts = { ...timeParts, [part]: newValue };
        setTimeParts(newParts);

        let h24 = parseInt(newParts.hour, 10);
        if (newParts.period === 'PM' && h24 !== 12) {
            h24 += 12;
        } else if (newParts.period === 'AM' && h24 === 12) {
            h24 = 0;
        }

        onChange(`${h24.toString().padStart(2, '0')}:${newParts.minute}`);
    };

    const toggleOpen = () => {
        if (!isOpen && !value) {
            // If opening and no value, set to current time
            const nowParts = getTimeParts('');
            setTimeParts(nowParts);
            
            let h24 = parseInt(nowParts.hour, 10);
            if (nowParts.period === 'PM' && h24 !== 12) h24 += 12;
            else if (nowParts.period === 'AM' && h24 === 12) h24 = 0;

            onChange(`${h24.toString().padStart(2, '0')}:${nowParts.minute}`);
        }
        setIsOpen(!isOpen);
    };

    const displayValue = value ? `${timeParts.hour}:${timeParts.minute} ${timeParts.period}` : 'Set time';

    return (
        <div className="relative" ref={pickerRef}>
            <button
                id={id}
                type="button"
                onClick={toggleOpen}
                aria-haspopup="true"
                aria-expanded={isOpen}
                className="w-full bg-slate-900/70 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-teal-400 focus:border-teal-400 outline-none transition duration-200 text-left"
            >
                <span className={!value ? "text-slate-500" : ""}>{displayValue}</span>
            </button>
            {isOpen && (
                <div className="absolute z-10 top-full mt-2 w-full bg-slate-900/95 backdrop-blur-sm border border-slate-700 rounded-lg shadow-2xl p-2 animate-fade-in-down">
                    <div className="flex justify-around items-center relative">
                        <div className="absolute inset-y-0 left-0 right-0 h-12 my-auto bg-slate-700/50 rounded-lg border-y border-slate-600 pointer-events-none"></div>
                        <Column items={hours} selectedValue={timeParts.hour} onSelect={(h) => handleTimeChange('hour', h)} className="w-1/3" />
                        <Column items={minutes} selectedValue={timeParts.minute} onSelect={(m) => handleTimeChange('minute', m)} className="w-1/3" />
                        <Column items={periods} selectedValue={timeParts.period} onSelect={(p) => handleTimeChange('period', p)} className="w-1/3" />
                    </div>
                </div>
            )}
        </div>
    );
};

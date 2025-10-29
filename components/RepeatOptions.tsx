
import React from 'react';

interface RepeatOptionsProps {
    repeatCount: number;
    onRepeatCountChange: (count: number) => void;
    repeatInterval: number;
    onRepeatIntervalChange: (interval: number) => void;
}

const countOptions = [1, 2, 3, 4, 5];

const intervalOptions = [
    { label: '5 seconds', value: 5 },
    { label: '10 seconds', value: 10 },
    { label: '30 seconds', value: 30 },
    { label: '1 minute', value: 60 },
    { label: '5 minutes', value: 300 },
    { label: '10 minutes', value: 600 },
    { label: '15 minutes', value: 900 },
];

const SelectInput: React.FC<{
    id: string;
    label: string;
    value: number;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    disabled?: boolean;
    children: React.ReactNode;
}> = ({ id, label, value, onChange, disabled = false, children }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-slate-300 mb-1">
            {label}
        </label>
        <select
            id={id}
            value={value}
            onChange={onChange}
            disabled={disabled}
            className="w-full bg-slate-900/70 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-teal-400 focus:border-teal-400 outline-none transition duration-200 disabled:bg-slate-800/50 disabled:text-slate-500 disabled:cursor-not-allowed"
        >
            {children}
        </select>
    </div>
);


export const RepeatOptions: React.FC<RepeatOptionsProps> = ({
    repeatCount,
    onRepeatCountChange,
    repeatInterval,
    onRepeatIntervalChange
}) => {
    return (
        <div className="grid grid-cols-2 gap-4">
            <SelectInput
                id="repeat-count"
                label="Repeat"
                value={repeatCount}
                onChange={(e) => onRepeatCountChange(Number(e.target.value))}
            >
                {countOptions.map(count => (
                    <option key={count} value={count}>
                        {count === 1 ? 'No repeat' : `${count} times`}
                    </option>
                ))}
            </SelectInput>
            <SelectInput
                id="repeat-interval"
                label="Every"
                value={repeatInterval}
                onChange={(e) => onRepeatIntervalChange(Number(e.target.value))}
                disabled={repeatCount <= 1}
            >
                {intervalOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
            </SelectInput>
        </div>
    );
};

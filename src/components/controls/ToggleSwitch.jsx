import React from 'react';

export default function ToggleSwitch({ label, value, onChange, disabled = false }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-metallic-light font-medium">{label}</span>
      <button
        onClick={() => !disabled && onChange(!value)}
        disabled={disabled}
        className={`relative w-11 h-6 rounded-full transition-all duration-300 ${
          disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'
        } ${value
          ? 'bg-gradient-to-r from-cyan-600 to-cyan-500 shadow-[0_0_12px_rgba(0,229,255,0.4)]'
          : 'bg-navy-600'
        }`}
      >
        <div
          className={`absolute top-0.5 w-5 h-5 rounded-full transition-all duration-300 ${
            value
              ? 'left-[22px] bg-white shadow-[0_0_6px_rgba(255,255,255,0.5)]'
              : 'left-0.5 bg-metallic-dark'
          }`}
        />
      </button>
    </div>
  );
}

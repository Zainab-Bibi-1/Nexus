import React from 'react';

interface PasswordMeterProps {
  password: string;
}

const PasswordMeter: React.FC<PasswordMeterProps> = ({ password }) => {
  const testStrength = (pwd: string) => {
    if (pwd.length === 0) return { label: '', color: 'bg-gray-200', width: '0%' };
    if (pwd.length < 6) return { label: 'Weak', color: 'bg-red-500', width: '33%' };
    if (pwd.length < 10) return { label: 'Fair', color: 'bg-yellow-500', width: '66%' };
    return { label: 'Strong', color: 'bg-green-500', width: '100%' };
  };

  const strength = testStrength(password);

  return (
    <div className="mt-2">
      <div className="flex justify-between mb-1 text-xs font-medium">
        <span>Password Strength: {strength.label}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-1.5">
        <div 
          className={`h-1.5 rounded-full transition-all duration-300 ${strength.color}`} 
          style={{ width: strength.width }}
        ></div>
      </div>
    </div>
  );
};

export default PasswordMeter;
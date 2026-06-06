import React, { useState, useEffect, useRef } from 'react';
import { ShieldCheck, X } from 'lucide-react';
import { Button } from './Button';

interface OTPModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerify: (code: string) => void;
}

export const OTPModal: React.FC<OTPModalProps> = ({ isOpen, onClose, onVerify }) => {
  const [otp, setOtp] = useState(['', '', '', '']);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  if (!isOpen) return null;

  const handleChange = (value: string, index: number) => {
    if (isNaN(Number(value))) return;
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);
    
    // Auto-focus next input
    if (value !== '' && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Backspace' && otp[index] === '' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = () => {
    const fullCode = otp.join('');
    onVerify(fullCode);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl relative border border-gray-100 scale-in-center">
        <button onClick={onClose} className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 transition-colors">
          <X size={24} />
        </button>

        <div className="text-center">
          <div className="bg-primary-50 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-primary-100">
            <ShieldCheck className="text-primary-600" size={40} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Secure Verification</h2>
          <p className="text-gray-500 mt-2">Enter the 4-digit code sent to your email.</p>
        </div>

        <div className="flex justify-center gap-4 my-10">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className="w-16 h-20 text-center text-3xl font-bold border-2 border-gray-200 rounded-2xl focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none transition-all shadow-sm"
            />
          ))}
        </div>

        <Button 
          fullWidth 
          size="lg"
          onClick={handleSubmit}
          disabled={otp.some(d => d === '')}
        >
          Verify & Continue
        </Button>
        
        <p className="text-center text-sm text-gray-500 mt-8">
          Didn't receive the code? <span className="text-primary-600 font-bold cursor-pointer hover:underline">Resend Code</span>
        </p>
      </div>
    </div>
  );
};
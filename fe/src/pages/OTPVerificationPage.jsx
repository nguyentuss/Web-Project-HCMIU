import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import axios from '../config/axios';

const OTPVerificationPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    // Try to get email from location.state or query string
    const email = location.state?.email || new URLSearchParams(location.search).get('email');

    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [resendLoading, setResendLoading] = useState(false);
    const inputRefs = useRef([]);
    const sentRef = useRef(false);

    // Send OTP on mount (only once)
    useEffect(() => {
        if (email && !sentRef.current) {
            sendOtp();
            sentRef.current = true;
        }
    }, [email]);    const sendOtp = async () => {
        setResendLoading(true);
        setError('');
        try {
            await axios.post('/otp/send', null, { params: { email } });
            toast.success('OTP sent to your email!');
        } catch (err) {
            setError('Failed to send OTP. Please try again.');
        } finally {
            setResendLoading(false);
        }
    };

    const handleChange = (e, idx) => {
        const value = e.target.value.replace(/\D/g, '');
        if (!value) return;
        const newOtp = [...otp];
        newOtp[idx] = value[0];
        setOtp(newOtp);
        if (value[0] && idx < 5) {
            inputRefs.current[idx + 1].focus();
        }
    };

    const handleKeyDown = (e, idx) => {
        if (e.key === 'Backspace') {
            if (otp[idx]) {
                const newOtp = [...otp];
                newOtp[idx] = '';
                setOtp(newOtp);
            } else if (idx > 0) {
                inputRefs.current[idx - 1].focus();
            }
        }
    };

    const handlePaste = (e) => {
        const paste = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
        if (paste.length === 6) {
            setOtp(paste.split(''));
            inputRefs.current[5].focus();
        }
    };    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const code = otp.join('');
            await axios.post('/otp/verify', null, { params: { email, otp: code } });
            toast.success('OTP verified!');
            navigate('/');
        } catch (err) {
            setError('Invalid or expired OTP.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen relative flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
            {/* Dark overlay */}
            <div className="absolute inset-0 bg-black/60 z-10"></div>
                
            {/* Background image */}
            <div 
                className="absolute inset-0 bg-[url('/assets/background.jpg')] bg-cover bg-center"
                style={{
                    backgroundImage: "linear-gradient(to bottom, rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('/assets/background.jpg')"
                }}
            ></div>

            <div className="z-20 bg-white rounded-xl shadow-lg p-8 w-full max-w-md flex flex-col items-center">
                <h2 className="text-2xl font-bold mb-2 text-center">Mobile Phone Verification</h2>
                <p className="text-gray-500 mb-6 text-center">Enter the 6-digit verification code that was sent to your email.</p>
                <form onSubmit={handleSubmit} className="w-full flex flex-col items-center">
                    <div className="flex gap-3 mb-6" onPaste={handlePaste}>
                        {otp.map((digit, idx) => (
                        <input
                            key={idx}
                            ref={el => inputRefs.current[idx] = el}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={digit}
                            onChange={e => handleChange(e, idx)}
                            onKeyDown={e => handleKeyDown(e, idx)}
                            className="w-12 h-14 text-2xl text-center border-2 border-gray-200 rounded-lg focus:border-pm-purple-hover outline-none bg-gray-100"
                            autoFocus={idx === 0}
                        />
                        ))}
                    </div>
                    {error && <div className="text-red-500 mb-3 text-sm">{error}</div>}
                    <button
                        type="submit"
                        className="w-full bg-pm-purple hover:bg-pm-purple-hover text-white font-semibold py-2 rounded-lg transition mb-3 disabled:opacity-60 cursor-pointer"
                        disabled={loading || otp.some(d => !d)}
                    >
                        {loading ? 'Verifying...' : 'Verify Account'}
                    </button>
                </form>
                <div className="text-sm text-gray-500 mt-2">
                    Didn't receive code?{' '}
                    <button
                        onClick={sendOtp}
                        className="text-pm-purple hover:underline disabled:opacity-60 cursor-pointer"
                        disabled={resendLoading}
                    >
                        {resendLoading ? 'Resending...' : 'Resend'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OTPVerificationPage; 
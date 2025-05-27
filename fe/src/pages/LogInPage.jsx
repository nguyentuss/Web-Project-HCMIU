import React, { useState } from 'react'
import { Link } from "react-router-dom";

import { useUserStore } from "../stores/useUserStore";
import { validateField, validateForm, hasErrors } from "../utils/validation";

import { UserIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import OptimizedImage from '../components/OptimizedImage';

const LogInPage = () => {
    const { login, loading } = useUserStore();

    const [formData, setFormData] = useState({
        username: "",
        password: ""
    });

    const [errors, setErrors] = useState({
        username: "",
        password: "",
    });

    const [touched, setTouched] = useState({
        username: false,
        password: false,
    });

    const handleBlur = (field) => {
        setTouched(prev => ({ ...prev, [field]: true }));
        setErrors(prev => ({
            ...prev,
            [field]: validateField(field, formData[field], formData)
        }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: "" }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validate all fields in the form
        const formErrors = validateForm(formData);
        setErrors(formErrors);
        
        // If no errors, proceed with login
        if (!hasErrors(formErrors)) {
            login(formData);
        }
    };

    return (
        <div className="relative min-h-screen">
            {/* Background image with overlay */}
            <div className="fixed inset-0">
                <div className="absolute inset-0 bg-gray-800 animate-pulse" />
                    <OptimizedImage
                        src="/assets/background.jpg"
                        alt="Background"
                        className="w-full h-full object-cover"
                        loading="lazy"
                    />
                <div className="absolute inset-0 bg-black/80" />
            </div>

            <div className="relative z-20 pt-12 mx-auto max-w-sm sm:max-w-lg">
                <div className="bg-pm-gray flex flex-col justify-center px-5 py-10 text-white rounded-lg">
                    <div className="flex flex-col items-center gap-2 sm:mx-auto sm:w-full sm:max-w-sm">
                        <h1 className="text-3xl font-bold tracking-tight">
                            Welcome back!
                        </h1>
                        <p className="text-th-gray">
                            Enter your information to log in.
                        </p>
                    </div>

                    <div className="mt-5 sm:mx-auto sm:w-full sm:max-w-sm">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Username */}
                            <div>
                                <label htmlFor="username" className="block text-sm/6 font-medium">
                                    Username
                                </label>
                                <div className="relative mt-2 flex items-center gap-2">
                                    <UserIcon className="absolute left-2 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        id="username"
                                        name="username"
                                        type="text"
                                        value={formData.username}
                                        required
                                        onChange={handleChange}
                                        onBlur={() => handleBlur("username")}
                                        className={`block w-full rounded-md bg-white pl-8 pr-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-pm-purple sm:text-sm/6
                                            ${touched.username && errors.username 
                                                ? 'border-red-500 ring-red-300 focus:ring-red-500' 
                                                : 'border-gray-300 ring-gray-300 focus:ring-primary-text'
                                            }`
                                        }
                                    />
                                </div>
                                {touched.username && errors.username && (
                                    <p className="mt-1 text-sm text-red-400">{errors.username}</p>
                                )}
                            </div>

                            {/* Password */}
                            <div>
                                <label htmlFor="password" className="block text-sm/6 font-medium">
                                    Password
                                </label>
                                <div className="mt-2 relative">
                                    <LockClosedIcon className="absolute left-2 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        value={formData.password}
                                        required
                                        autoComplete="current-password"
                                        onChange={handleChange}
                                        onBlur={() => handleBlur("password")}
                                        className={`block w-full rounded-md bg-white pl-8 pr-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6
                                            ${touched.password && errors.password 
                                                ? 'border-red-500 ring-red-300 focus:ring-red-500' 
                                                : 'border-gray-300 ring-gray-300 focus:ring-primary-text'
                                            }`
                                        }
                                    />
                                </div>
                                {touched.password && errors.password && (
                                    <p className="mt-1 text-sm text-red-400">{errors.password}</p>
                                )}
                            </div>

                            {/* Log In Button */}
                            <div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`flex w-full justify-center rounded-md bg-pm-purple px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-pm-purple-hover transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 cursor-pointer
                                        ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    {loading ? 'Logging in...' : 'Log in'}
                                </button>
                            </div>
                        </form>

                        <p className="mt-5 text-center text-sm/6 text-th-gray">
                            Don't have an account?{' '}
                            <Link to="/signup" className="font-semibold text-white hover:text-pm-purple-hover transition-colors">
                                Sign up
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LogInPage

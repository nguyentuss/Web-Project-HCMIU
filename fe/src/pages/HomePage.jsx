import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import { ArrowRightIcon } from '@heroicons/react/24/solid';
import OptimizedImage from '../components/OptimizedImage';

const reasons = [
    {
        icon: <ArrowRightIcon className="w-8 h-8 text-rose-500" />,
        name: 'Cancel or switch plans anytime',
        description: 'Flexible subscription options that adapt to your needs'
    },
    {
        icon: <ArrowRightIcon className="w-8 h-8 text-rose-500" />,
        name: 'A safe place just for kids',
        description: 'Family-friendly content with parental controls'
    },
    {
        icon: <ArrowRightIcon className="w-8 h-8 text-rose-500" />,
        name: 'Download your shows to watch offline',
        description: 'Save your favorites easily and always have something to watch'
    }
];

const HomePage = () => {
    const [email, setEmail] = useState('');

    return (
        <div>
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

                {/* Content */}
                <div className="relative z-20 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
                    <div>
                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 leading-[1.1]">
                            Find what you want, watch what you like.
                        </h1>
                        <p className="text-lg sm:text-xl text-gray-300 mb-8">
                            The video streaming service that's <span className="text-purple-500">right for you.</span>
                        </p>
                    </div>

                    <div>
                        <p className="text-md sm:text-lg text-gray-300 mb-6">
                            Ready to watch? Enter your email to create a new account.
                        </p>

                        <div className="flex flex-col md:flex-row items-center justify-center md:items-stretch gap-3">
                            <input
                                type="email"
                                placeholder="Email"
                                required={true}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="hidden md:block max-w-md px-5 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-50 bg-black-50 text-white"
                            />
                            <Link 
                                to={`/signup?email=${encodeURIComponent(email)}`} 
                                className="flex items-center gap-2 bg-purple-700 text-xl text-white px-8 py-3 rounded-full font-semibold hover:bg-purple-600 transition-colors whitespace-nowrap"
                            >
                                Get Started <ArrowRightIcon className="w-5 h-5" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <div className="relative z-20 bg-black py-16">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-white mb-8">Reasons to Join</h2>
                    
                    {/* Reasons to Join */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {reasons.map((reason, index) => (
                            <div key={index} className="bg-gray-900 rounded-lg p-6">
                                <div className="flex items-center justify-center mb-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-purple-700">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                                    </svg>
                                </div>
                                <h3 className="text-lg text-white font-semibold text-center mb-2">{reason.name}</h3>
                                <p className="text-gray-400 text-center">{reason.description}</p>
                            </div>
                        ))}
                    </div>
                </div>                
            </div>
        </div>
    )
}

export default HomePage
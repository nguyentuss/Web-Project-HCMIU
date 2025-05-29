import React, { useState, useEffect } from 'react';
import { motion } from "framer-motion";

import { useVideoStore } from "../stores/useVideoStore";

import CreateVideoForm from "../components/CreateVideoForm";
import VideoList from "../components/VideoList";
import OptimizedImage from '../components/OptimizedImage';

const tabs = [
	{ id: "create", label: "Create Video"},
	{ id: "videos", label: "Videos"},
];

const AdminPage = () => {
    const [activeTab, setActiveTab] = useState("create");
	const { fetchAllVideos } = useVideoStore();

	useEffect(() => {
		fetchAllVideos();
	}, [fetchAllVideos]);

    return (
		<div className='min-h-screen relative overflow-hidden'>
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

			<div className='relative z-10 container mx-auto px-4 py-12'>
				<motion.h1
					className='text-4xl font-bold mb-8 text-white text-center'
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
				>
					Admin Dashboard
				</motion.h1>

				<div className='flex justify-center mb-8'>
					{tabs.map((tab) => (
						<button
							key={tab.id}
							onClick={() => setActiveTab(tab.id)}
							className={`flex items-center px-4 py-2 mx-2 rounded-md transition-colors duration-200 cursor-pointer ${
								activeTab === tab.id
									? "bg-pm-purple-hover text-white"
									: "bg-pm-purple text-white hover:bg-pm-purple-hover"
							}`}
						>
							{tab.label}
						</button>
					))}
				</div>
				{activeTab === "create" && <CreateVideoForm />}
				{activeTab === "videos" && <VideoList />}
			</div>
		</div>
    )
}

export default AdminPage

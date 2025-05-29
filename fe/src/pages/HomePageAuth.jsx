import React, { useEffect } from 'react';

import { useCategoryStore } from '../stores/useCategoryStore';

import VideoCarousel from '../components/VideoCarousel';
import VideoSection from '../components/VideoSection';

const HomePageAuth = () => {
    const { categories, fetchAllCategories } = useCategoryStore();

    useEffect(() => {
        fetchAllCategories();
    }, [fetchAllCategories]);
    
    // Ensure categories is always an array
    const safeCategories = Array.isArray(categories) ? categories : [];
    
    return (
        <div>
            {/* Video Carousel */}
            <VideoCarousel />

            {/* Video Sections*/}
            {safeCategories.map(category => {
                return (
                    <VideoSection key={category.id} cid={category.id} name={category.name} />
                )
            })}
        </div>
    )
}

export default HomePageAuth

import React, { useEffect } from 'react';

import { useCategoryStore } from '../stores/useCategoryStore';

import VideoCarousel from '../components/VideoCarousel';
import VideoSection from '../components/VideoSection';

const HomePageAuth = () => {
    const { categories, fetchAllCategories } = useCategoryStore();

    useEffect(() => {
        fetchAllCategories();
    }, [fetchAllCategories]);
    
    return (
        <div>
            {/* Video Carousel */}
            <VideoCarousel />

            {/* Video Sections*/}
            {categories.map(category => {
                return (
                    <VideoSection key={category.id} cid={category.id} name={category.name} />
                )
            })}
        </div>
    )
}

export default HomePageAuth

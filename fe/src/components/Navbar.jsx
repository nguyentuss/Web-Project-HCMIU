import React, { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import SearchCard from './SearchCard'
import OptimizedImage from './OptimizedImage'
import { useNavigateWithLoading } from '../hooks/useNavigateWithLoading'

import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { LockClosedIcon, BookmarkIcon, Bars3Icon, XMarkIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

import { useVideoStore } from '../stores/useVideoStore';
import { useUserStore } from "../stores/useUserStore";

import toast from "react-hot-toast"

const Navbar = () => {
    const navigate = useNavigate();
    const navigateWithLoading = useNavigateWithLoading();

    const { fetchVideosBySearch } = useVideoStore();

    const [isSearchFocused, setIsSearchFocused] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const searchRef = useRef(null)

    const { user, logout } = useUserStore();

    const recentSearches = ["action movies", "sci-fi", "christopher nolan"]

    // Handle clicks outside the search area
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setIsSearchFocused(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, []);    const handleMovieClick = (movie) => {
        // Handle movie selection
        console.log('Selected movie:', movie)
        setIsSearchFocused(false)
    }

    const handleRecentSearchClick = (search) => {
        // Handle recent search selection
        setSearchQuery(search)
        setIsSearchFocused(false)
    }

    const handleSearch = async (e) => {
        e.preventDefault();
        try {
            await fetchVideosBySearch(searchQuery);
            navigateWithLoading(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
            setIsSearchFocused(false);
        } catch (err) {
            console.error('Error searching videos: ' + err);
            toast.error('Could not search videos. Please try again.');
        }
    }

    return (
        <Disclosure as="nav" className="shadow-sm">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="relative flex h-16 items-center justify-between">
                    <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                        {/* Mobile menu button*/}
                        <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-primary-text hover:text-white focus:ring-2 focus:ring-white focus:outline-hidden focus:ring-inset">
                            <span className="absolute -inset-0.5" />
                            <span className="sr-only">Open main menu</span>
                            <Bars3Icon aria-hidden="true" className="block size-6 group-data-open:hidden" />
                            <XMarkIcon aria-hidden="true" className="hidden size-6 group-data-open:block" />
                        </DisclosureButton>
                    </div>

                    {/* Logo */}
                    <div className="flex flex-1 items-center justify-center sm:justify-start">
                        <div className="flex shrink-0 items-center">
                            <Link to="/">
                                <OptimizedImage
                                    alt="Your Company"
                                    src="../assets/logo.png"
                                    className="h-16 w-auto"
                                />
                            </Link>
                        </div>
                    </div>

                    {/* Search and Login */}
                    <div className="absolute inset-y-0 right-0 flex items-center gap-3 pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                        { user ? (
                            <>
                                <div className="relative" ref={searchRef}>
                                    {/* Search Icon */}
                                    <button
                                        onClick={() => setIsSearchFocused(true)}
                                        className="block p-1 text-gray-400 hover:text-white cursor-pointer"
                                    >
                                        <MagnifyingGlassIcon className="w-6 h-6" />
                                    </button>

                                    {/* Search Overlay and Card */}
                                    <AnimatePresence>
                                        {isSearchFocused && (
                                            <>
                                                {/* Dark Overlay */}
                                                <motion.div
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0 }}
                                                    className="fixed inset-0 bg-black/50 z-40"
                                                    onClick={() => setIsSearchFocused(false)}
                                                />
                                                
                                                {/* Search Card */}
                                                <motion.div
                                                    initial={{ opacity: 0, y: -10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -10 }}
                                                    transition={{ duration: 0.2, ease: "easeOut" }}
                                                    className="fixed top-16 left-0 lg:left-auto w-full lg:w-1/6 z-50"
                                                >
                                                    <div className="bg-pm-gray shadow-lg p-4">
                                                        <form onSubmit={handleSearch} className="mb-4">
                                                            <div className="relative">
                                                                <input
                                                                    type="text"
                                                                    placeholder="Search..."
                                                                    value={searchQuery}
                                                                    onChange={(e) => setSearchQuery(e.target.value)}
                                                                    className="w-full px-4 py-2 rounded-full border border-gray-600 text-white bg-primary-text focus:outline-none focus:border-purple-500"
                                                                    autoFocus
                                                                />
                                                                <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer">
                                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-500">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                                                                    </svg>
                                                                </button>
                                                            </div>
                                                        </form>
                                                        <SearchCard
                                                            recentSearches={recentSearches}
                                                            onMovieClick={handleMovieClick}
                                                            onRecentSearchClick={handleRecentSearchClick}
                                                        />
                                                    </div>
                                                </motion.div>
                                            </>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* Watch List */}
                                <Link
                                    to={`/admin/${user.id}`}
                                    className="relative rounded-full bg-primary-text p-1 text-gray-400 hover:text-white focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-hidden"
                                >
                                    <span className="absolute -inset-1.5" />
                                    <span className="sr-only">View admin dashboard</span>
                                    <LockClosedIcon aria-hidden="true" className="size-6" />
                                </Link>

                                {/* Watch List */}
                                <Link
                                    to={`/watchlist/${user.id}`}
                                    className="relative rounded-full bg-primary-text p-1 text-gray-400 hover:text-white focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-hidden"
                                >
                                    <span className="absolute -inset-1.5" />
                                    <span className="sr-only">View watch list</span>
                                    <BookmarkIcon aria-hidden="true" className="size-6" />
                                </Link>

                                {/* Profile Dropdown */}
                                <Menu as="div" className="relative ml-3">
                                    <div>
                                        <MenuButton className="relative flex rounded-full bg-gray-800 text-sm focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-hidden cursor-pointer">
                                            <span className="absolute -inset-1.5" />
                                            <span className="sr-only">Open user menu</span>
                                            <OptimizedImage
                                                alt=""
                                                src={user.avatar || "../assets/avatar.png"}
                                                className="size-8 rounded-full"
                                            />
                                        </MenuButton>
                                    </div>

                                    <MenuItems
                                        transition
                                        className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 ring-1 shadow-lg ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
                                    >
                                        <MenuItem>
                                            <Link
                                                to="/profile"
                                                className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden"
                                            >
                                                Your Profile
                                            </Link>
                                        </MenuItem>
                                        <MenuItem>
                                            <button
                                                className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden cursor-pointer"
                                                onClick={async () => {
                                                    await logout();
                                                    navigateWithLoading("/");
                                                }}
                                            >
                                                Log Out
                                            </button>
                                        </MenuItem>
                                    </MenuItems>
                                </Menu>
                            </>
                        ) : (
                            <>
                            <Link to="/login">
                                <button className="bg-pm-purple px-5 py-2 rounded-xl text-white flex items-center gap-2 hover:bg-pm-purple-hover transition-colors cursor-pointer">
                                    Log in 
                                </button> 
                            </Link>
                        </>
                        )}
                    </div>
                </div>
            </div>
        </Disclosure>
    )
}

export default Navbar

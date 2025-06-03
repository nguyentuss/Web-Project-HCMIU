import React from 'react'

const Footer = () => {
    return (
        <div className="relative z-20 bg-black text-white">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="py-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {/* Column 1 */}
                        <div>
                            <h3 className="font-semibold mb-4">Experience</h3>
                            <ul className="space-y-2">
                                <li><a href="#" className="text-gray-600 hover:text-gray-900">FAQ</a></li>
                                <li><a href="#" className="text-gray-600 hover:text-gray-900">Become Member</a></li>
                                <li><a href="#" className="text-gray-600 hover:text-gray-900">Privacy</a></li>
                                <li><a href="#" className="text-gray-600 hover:text-gray-900">Terms of Use</a></li>
                            </ul>
                        </div>

                        {/* Column 2 */}
                        <div>
                            <h3 className="font-semibold mb-4">Site</h3>
                            <ul className="space-y-2">
                                <li><a href="#" className="text-gray-600 hover:text-gray-900">Data</a></li>
                                <li><a href="#" className="text-gray-600 hover:text-gray-900">Legal Policies</a></li>
                                <li><a href="#" className="text-gray-600 hover:text-gray-900">Site Partnership</a></li>
                            </ul>
                        </div>

                        {/* Column 3 */}
                        <div>
                            <h3 className="font-semibold mb-4">About</h3>
                            <ul className="space-y-2">
                                <li><a href="#" className="text-gray-600 hover:text-gray-900">Press & Media</a></li>
                                <li><a href="#" className="text-gray-600 hover:text-gray-900">Careers</a></li>
                                <li><a href="#" className="text-gray-600 hover:text-gray-900">Get in Touch</a></li>
                            </ul>
                        </div>

                        {/* Column 4 */}
                        <div>
                            <h3 className="font-semibold mb-4">Movie Corner</h3>
                            <ul className="space-y-2">
                                <li><a href="#" className="text-gray-600 hover:text-gray-900">Movie Reviews</a></li>
                                <li><a href="#" className="text-gray-600 hover:text-gray-900">Recommendations</a></li>
                                <li><a href="#" className="text-gray-600 hover:text-gray-900">Latest Updates</a></li>
                            </ul>
                        </div>
                    </div>

                    <div className="mt-8 flex items-center justify-between">
                        <p className="text-sm text-gray-600">© 2025 Netflex. All rights reserved.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Footer

/* eslint-disable */
import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Twitter, Linkedin, Mail, MapPin, Phone, ChevronRight } from 'lucide-react';
import { paths } from '../../routes/paths';

const Footer = () => {
    const currentYear = new Date().getFullYear();
    
    return (
        <footer className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 pt-16 pb-10 text-white">
            {/* Decorative elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -right-40 -top-40 h-80 w-80 rounded-full bg-teal-500/10 blur-3xl"></div>
                <div className="absolute -left-40 -bottom-20 h-80 w-80 rounded-full bg-blue-500/10 blur-3xl"></div>
            </div>
            
            <div className="container relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
                    {/* Company Info */}
                    <div className="flex flex-col space-y-4">
                        <Link to={paths.home} className="inline-flex items-center">
                            <span className="bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-2xl font-bold tracking-tighter text-transparent">
                                LUMINA SECURE
                            </span>
                        </Link>
                        <p className="mt-2 text-sm leading-relaxed text-gray-300">
                            Leading provider of advanced biometric security 
                            solutions for enterprise and government, specializing 
                            in retinal scan technology.
                        </p>
                        <div className="mt-4 flex items-center space-x-3">
                            <a 
                                href="https://github.com" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-800 text-gray-400 transition-all hover:bg-teal-600 hover:text-white"
                                aria-label="GitHub"
                            >
                                <Github className="h-4 w-4" />
                            </a>
                            <a 
                                href="https://twitter.com" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-800 text-gray-400 transition-all hover:bg-teal-600 hover:text-white"
                                aria-label="Twitter"
                            >
                                <Twitter className="h-4 w-4" />
                            </a>
                            <a 
                                href="https://linkedin.com" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-800 text-gray-400 transition-all hover:bg-teal-600 hover:text-white"
                                aria-label="LinkedIn"
                            >
                                <Linkedin className="h-4 w-4" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="flex flex-col space-y-4">
                        <h3 className="text-lg font-semibold">
                            <span className="inline-flex items-center gap-2">
                                <span className="h-1 w-5 rounded-full bg-teal-500"></span>
                                Quick Links
                            </span>
                        </h3>
                        <ul className="mt-2 space-y-2">
                            {[
                                { name: 'Home', path: paths.home },
                                { name: 'Dashboard', path: paths.dashboard },
                                { name: 'Log In', path: paths.auth.login }
                            ].map((link, index) => (
                                <li key={index} className="group">
                                    <Link 
                                        to={link.path}
                                        className="inline-flex items-center text-sm text-gray-300 transition-colors hover:text-teal-400"
                                    >
                                        <ChevronRight className="mr-1 h-3 w-3 transition-transform group-hover:translate-x-1" />
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="flex flex-col space-y-4">
                        <h3 className="text-lg font-semibold">
                            <span className="inline-flex items-center gap-2">
                                <span className="h-1 w-5 rounded-full bg-teal-500"></span>
                                Contact
                            </span>
                        </h3>
                        <ul className="mt-2 space-y-3">
                            <li className="flex items-start">
                                <Mail className="mr-3 h-5 w-5 flex-shrink-0 text-teal-400" />
                                <span className="text-sm text-gray-300 hover:text-white">
                                    info@lumina-secure.com
                                </span>
                            </li>
                            <li className="flex items-start">
                                <Phone className="mr-3 h-5 w-5 flex-shrink-0 text-teal-400" />
                                <span className="text-sm text-gray-300 hover:text-white">
                                    +1 (555) 123-4567
                                </span>
                            </li>
                            <li className="flex items-start">
                                <MapPin className="mr-3 h-5 w-5 flex-shrink-0 text-teal-400" />
                                <span className="text-sm text-gray-300 hover:text-white">
                                    123 Tech Street<br />
                                    San Francisco, CA 94107
                                </span>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div className="flex flex-col space-y-4">
                        <h3 className="text-lg font-semibold">
                            <span className="inline-flex items-center gap-2">
                                <span className="h-1 w-5 rounded-full bg-teal-500"></span>
                                Stay Updated
                            </span>
                        </h3>
                        <p className="text-sm text-gray-300">
                            Subscribe to our newsletter for the latest updates on biometric security.
                        </p>
                        <div className="mt-2">
                            <div className="flex rounded-md">
                                <input
                                    type="email"
                                    placeholder="Your email"
                                    className="w-full rounded-l-md border-0 bg-gray-800 py-2 px-3 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
                                    aria-label="Email for newsletter"
                                />
                                <button
                                    type="button"
                                    className="inline-flex items-center rounded-r-md bg-gradient-to-r from-teal-500 to-blue-500 px-4 py-2 text-sm font-medium text-white transition-all hover:from-teal-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-teal-500"
                                    aria-label="Subscribe to newsletter"
                                >
                                    Subscribe
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <div className="mt-10 border-t border-gray-700 pt-8">
                    <div className="flex flex-col items-center justify-between space-y-4 text-sm text-gray-400 md:flex-row md:space-y-0">
                        <div>
                            {currentYear} LUMINA SECURE. All rights reserved.
                        </div>
                        <div className="flex space-x-6">
                            <a href="#" className="hover:text-teal-400">
                                Privacy Policy
                            </a>
                            <a href="#" className="hover:text-teal-400">
                                Terms of Service
                            </a>
                            <a href="#" className="hover:text-teal-400">
                                Cookies Policy
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

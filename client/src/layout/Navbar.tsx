import React from 'react';
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Link } from "react-router-dom";

const Navbar: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="bg-[#121212] text-white p-4">
            <div className="flex justify-between items-center max-w-7xl mx-auto">
                <div className="text-xl font-semibold">Logo</div>

                {/* Mobile Menu Button */}
                <div className="md:hidden">
                    <Button variant="ghost" onClick={() => setIsOpen(!isOpen)}>
                        {isOpen ? "✖" : "☰"}
                    </Button>
                </div>

                {/* Desktop Menu */}
                <div className="hidden md:flex space-x-4">
                    <Button variant="link" className="text-white hover:text-gray-300">
                        <Link to="/" className="text-white">Home</Link>
                    </Button>
                    <Button variant="link" className="text-white hover:text-gray-300">About</Button>
                    <Button variant="link" className="text-white hover:text-gray-300">Services</Button>
                    <Button variant="link" className="text-white hover:text-gray-300">Contact</Button>
                </div>

                <Button variant="primary" className="hidden md:block">Sign Up</Button>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden flex flex-col items-center mt-4 space-y-2">
                    <Button variant="link" className="text-white hover:text-gray-300">
                        <Link to="/" className="text-white">Home</Link>
                    </Button>
                    <Button variant="link" className="text-white hover:text-gray-300">About</Button>
                    <Button variant="link" className="text-white hover:text-gray-300">Services</Button>
                    <Button variant="link" className="text-white hover:text-gray-300">Contact</Button>
                    <Button variant="primary" className="text-white">Sign Up</Button>
                </div>
            )}
        </nav>
    );
};

export default Navbar;

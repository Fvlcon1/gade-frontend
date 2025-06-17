'use client'

import { useState, useEffect } from "react";
import { X, RefreshCw, Home, ChevronRight } from "lucide-react";
import Link from "next/link";

type ErrorPosition = {
    x: number;
    y: number;
    rotate: number;
};

export default function NotFound() {
    const [positions, setPositions] = useState<ErrorPosition[]>([]);
    const [mouseTrail, setMouseTrail] = useState<{ x: number, y: number }[]>([]);
    const [isAnimating, setIsAnimating] = useState(true);

    // Generate random positions for floating "404" elements
    useEffect(() => {
        const newPositions = Array.from({ length: 15 }, () => ({
            x: Math.floor(Math.random() * 80),
            y: Math.floor(Math.random() * 80),
            rotate: Math.floor(Math.random() * 40 - 20),
        }));
        setPositions(newPositions);
    }, []);

    // Handle mouse trail effect
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            const { clientX, clientY } = e;
            setMouseTrail(prev => [...prev.slice(-10), { x: clientX, y: clientY }]);
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    const handleRefresh = () => {
        setIsAnimating(true);
        // Simulate page refresh
        setTimeout(() => setIsAnimating(false), 1000);
    };

    return (
        <div className="text-slate-900 min-h-screen bg-white flex flex-col items-center justify-center relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute inset-0 overflow-hidden">
                {positions.map((pos, i) => (
                    <div
                        key={i}
                        className="absolute text-slate-800 text-opacity-10 opacity-5 text-6xl md:text-8xl font-bold"
                        style={{
                            left: `${pos.x}%`,
                            top: `${pos.y}%`,
                            transform: `rotate(${pos.rotate}deg)`,
                            transition: "transform 0.5s ease-out",
                        }}
                    >
                        404
                    </div>
                ))}
            </div>

            {/* Mouse trail effect */}
            {mouseTrail.map((point, i) => (
                <div
                    key={i}
                    className="absolute w-2 h-2 rounded-full bg-indigo-400"
                    style={{
                        left: point.x,
                        top: point.y,
                        opacity: i / mouseTrail.length,
                    }}
                />
            ))}

            {/* Main content */}
            <div className="z-10 text-center px-6 max-w-3xl flex flex-col items-center">
                <div className={`relative transition-all duration-300 ${isAnimating ? "scale-110" : "scale-100"}`}>
                    <div className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600">
                        404
                    </div>
                    <X
                        className="absolute top-2 right-0 text-red-500"
                        size={48}
                        strokeWidth={2.5}
                    />
                </div>

                <h1 className="mt-6 text-2xl md:text-3xl font-semibold text-slate-900">
                    Page Not Found
                </h1>

                <p className="mt-4 text-slate-600">
                    Oops! The page you're looking for seems to have vanished into the digital void.
                    It might have been moved, deleted, or perhaps it never existed in the first place.
                </p>

                <div className="mt-10 flex flex-col md:flex-row gap-4 w-full justify-center">
                    <button
                        onClick={()=>window.location.reload()}
                        className="px-6 py-3 bg-indigo-600 cursor-pointer hover:bg-indigo-700 text-white rounded-lg flex items-center justify-center gap-2 transition-colors"
                    >
                        <RefreshCw className={`w-5 h-5 ${isAnimating ? "animate-spin" : ""}`} />
                        Try Again
                    </button>
                    <Link href="/" className="px-6 py-3 cursor-pointer bg-slate-700 hover:bg-slate-800 text-white rounded-lg flex items-center justify-center gap-2 transition-colors">
                        <Home className="w-5 h-5" />
                        Back Home
                    </Link>
                </div>

                {/* Breadcrumbs */}
                <div className="mt-16 text-sm text-slate-400 flex items-center gap-2">
                    <span className="hover:text-slate-200 cursor-pointer transition-colors">Home</span>
                    <ChevronRight className="w-4 h-4" />
                    <span className="hover:text-slate-200 cursor-pointer transition-colors">Error</span>
                    <ChevronRight className="w-4 h-4" />
                    <span className="text-slate-300">404</span>
                </div>
            </div>

            {/* Footer */}
            <div className="absolute bottom-4 text-xs text-slate-500">
                © {new Date().getFullYear()} Blvck Sapphire • All rights reserved
            </div>
        </div>
    );
}
'use client'

import { useState, useEffect } from "react";
import { X, RefreshCw, Home, ChevronRight } from "lucide-react";

const MouseTrail = () => {
    const [mouseTrail, setMouseTrail] = useState<{ x: number, y: number }[]>([]);
    
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            const { clientX, clientY } = e;
            setMouseTrail(prev => [...prev.slice(-5), { x: clientX, y: clientY }]);
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);
    
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {mouseTrail.map((point, i) => (
                <div
                    key={i}
                    className="absolute w-[5px] h-[5px] rounded-full bg-main-primary"
                    style={{
                        left: point.x,
                        top: point.y,
                        opacity: i / (mouseTrail.length + 40),
                    }}
                />
            ))}
        </div>
    )
}
export default MouseTrail
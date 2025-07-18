import React from "react";

const SatelliteSpinner = () => {
    return (
        <div className="relative w-52 h-52">
            {/* Orbit Path */}
            <div
                className="absolute w-full h-full rounded-full border border-dashed border-border-quantinary"
                style={{
                    animation: "spin 3s linear infinite",
                }}
            >
                {/* Satellite */}
                <div className="absolute top-0 left-1/2 w-16 h-16 -translate-x-1/2 -translate-y-1/2">
                    <img
                        src="/assets/satellite.png"
                        alt="Satellite"
                        className="w-full h-full object-contain rounded-full rotate-[130deg]"
                    />
                </div>
            </div>

            {/* Earth */}
            <div
                className="absolute top-1/2 left-1/2 w-24 h-24 -translate-x-1/2 -translate-y-1/2 rounded-full"
                style={{
                    // animation: "spin 10s linear infinite",
                }}
            >
                <img
                    src="https://upload.wikimedia.org/wikipedia/commons/a/a6/Spinning_globe.gif"
                    alt="Earth"
                    className="w-full h-full rounded-full object-cover"
                />
            </div>
        </div>
    );
};

export default SatelliteSpinner;

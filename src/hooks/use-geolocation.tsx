import theme from "@styles/theme";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { IoIosInformationCircle } from "react-icons/io";

const CACHE_KEY = "cached_location";
const CACHE_DURATION_MS = 15 * 60 * 1000; // 15 minutes

const useGeoLocation = () => {
    const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);

    useEffect(() => {
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
            try {
                const { lat, lng, timestamp } = JSON.parse(cached);
                const age = Date.now() - timestamp;
                if (age < CACHE_DURATION_MS) {
                    setLocation({ lat, lng });
                } else {
                    localStorage.removeItem(CACHE_KEY);
                }
            } catch (err) {
                console.warn("Invalid cached location format");
                localStorage.removeItem(CACHE_KEY);
            }
        }
    }, []);
    

    const getLocation = (forceRefresh = false): Promise<{ lat: number; lng: number }> => {
        if (location && !forceRefresh) 
            return Promise.resolve(location);

        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(toast.error("Geolocation is not supported by your browser."));
                return;
            }

            toast.loading("Please allow access when prompted...", {
                duration: 0,
                id: "location",
            });

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    toast.dismiss("location");
                    const newLocation = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    };

                    toast.success("Location access granted.", {
                        icon: (
                            <IoIosInformationCircle
                                color="#4287f5"
                                size={20}
                                className="mr-[-5px]"
                            />
                        ),
                    });

                    // Cache the new location
                    localStorage.setItem(
                        CACHE_KEY,
                        JSON.stringify({ ...newLocation, timestamp: Date.now() })
                    );

                    setLocation(newLocation);
                    resolve(newLocation);
                },
                (err) => {
                    toast.dismiss("location");
                    switch (err.code) {
                        case err.PERMISSION_DENIED:
                            reject(toast.error("Location access denied. Please allow location access."));
                            break;
                        case err.POSITION_UNAVAILABLE:
                            reject(toast.error("Location unavailable. Ensure GPS or Wi-Fi is enabled."));
                            break;
                        case err.TIMEOUT:
                            reject(toast.error("Location request timed out. Try again."));
                            break;
                        default:
                            reject(toast.error("An unknown error occurred."));
                            break;
                    }
                    console.error(err);
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 0,
                }
            );
        });
    };

    return {
        location,
        getLocation,
    };
};

export default useGeoLocation;
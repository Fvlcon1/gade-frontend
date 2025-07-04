import React, { useState, useCallback, MouseEvent } from 'react';

interface PaginationProps {
    currentPage?: number;
    totalPages?: number;
    visiblePages?: number;
    onPageChange: (page: number) => void;
    className?: string;
}

interface RippleState {
    x: number;
    y: number;
    size: number;
    id: number;
}

const Pagination: React.FC<PaginationProps> = ({
    currentPage = 1,
    totalPages = 2,
    visiblePages = 7,
    onPageChange,
    className = ''
}) => {
    const [page, setPage] = useState(currentPage);
    const [ripples, setRipples] = useState<RippleState[]>([]);

    const generatePageNumbers = useCallback((): (number | string)[] => {
        const pages: (number | string)[] = [];
        const half = Math.floor(visiblePages / 2);

        if (totalPages <= visiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            let start = Math.max(1, page - half);
            let end = Math.min(totalPages, page + half);

            if (page <= half) {
                end = visiblePages;
            } else if (page + half >= totalPages) {
                start = totalPages - visiblePages + 1;
            }

            if (start > 1) {
                pages.push(1);
                if (start > 2) pages.push('...');
            }

            for (let i = start; i <= end; i++) {
                pages.push(i);
            }

            if (end < totalPages) {
                if (end < totalPages - 1) pages.push('...');
                pages.push(totalPages);
            }
        }

        return pages;
    }, [page, totalPages, visiblePages]);

    const createRipple = useCallback((event: MouseEvent<HTMLButtonElement>) => {
        const button = event.currentTarget;
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;

        const newRipple: RippleState = {
            x,
            y,
            size,
            id: Date.now()
        };

        setRipples(prev => [...prev, newRipple]);

        setTimeout(() => {
            setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id));
        }, 600);
    }, []);

    const goToPage = useCallback((targetPage: number) => {
        if (targetPage < 1 || targetPage > totalPages || targetPage === page) return;

        setPage(targetPage);
        onPageChange(targetPage);
    }, [page, totalPages, onPageChange]);

    const handleButtonClick = useCallback((event: MouseEvent<HTMLButtonElement>, action: string | number) => {
        createRipple(event);

        if (typeof action === 'number') {
            goToPage(action);
        } else if (action === 'prev') {
            goToPage(page - 1);
        } else if (action === 'next') {
            goToPage(page + 1);
        }
    }, [createRipple, goToPage, page]);

    const pages = generatePageNumbers();

    const buttonBaseClasses = "min-w-[44px] h-[44px] border-none rounded-xl bg-transparent text-gray-600 font-medium cursor-pointer transition-all duration-300 ease-out flex items-center justify-center relative overflow-hidden text-sm hover:bg-indigo-50 hover:text-indigo-500 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none disabled:hover:bg-transparent disabled:hover:text-gray-600 disabled:hover:shadow-none";

    const activeClasses = "bg-gradient-to-br from-main-primary to-main-primary text-white -translate-y-0.5 shadow-xl shadow-indigo-300";

    const navButtonClasses = "px-4 text-xs uppercase tracking-wider font-semibold";

    const ellipsisClasses = "cursor-default pointer-events-none font-semibold text-gray-400 hover:bg-transparent hover:transform-none hover:shadow-none";

    return (
        <div className={`flex justify-center items-center gap-2 flex-wrap my-5 ${className}`}>
            {/* Previous Button */}
            <button
                className={`${buttonBaseClasses} ${navButtonClasses}`}
                onClick={(e) => handleButtonClick(e, 'prev')}
                disabled={page === 1}
            >
                ← Previous
                {ripples.map(ripple => (
                    <div
                        key={ripple.id}
                        className="absolute rounded-full bg-white bg-opacity-60 transform scale-0 animate-ping pointer-events-none"
                        style={{
                            left: ripple.x,
                            top: ripple.y,
                            width: ripple.size,
                            height: ripple.size,
                            animation: 'ping 0.6s linear forwards'
                        }}
                    />
                ))}
            </button>

            {/* Page Numbers */}
            {pages.map((pageNum, index) => (
                <button
                    key={`${pageNum}-${index}`}
                    className={`${buttonBaseClasses} ${pageNum === '...' ? ellipsisClasses : ''
                        } ${pageNum === page ? activeClasses : ''}`}
                    onClick={(e) => typeof pageNum === 'number' ? handleButtonClick(e, pageNum) : undefined}
                    disabled={pageNum === '...'}
                >
                    {pageNum}
                    {ripples.map(ripple => (
                        <div
                            key={ripple.id}
                            className="absolute rounded-full bg-white bg-opacity-60 transform scale-0 pointer-events-none"
                            style={{
                                left: ripple.x,
                                top: ripple.y,
                                width: ripple.size,
                                height: ripple.size,
                                animation: 'ping 0.6s linear forwards'
                            }}
                        />
                    ))}
                </button>
            ))}

            {/* Next Button */}
            <button
                className={`${buttonBaseClasses} ${navButtonClasses}`}
                onClick={(e) => handleButtonClick(e, 'next')}
                disabled={page === totalPages}
            >
                Next →
                {ripples.map(ripple => (
                    <div
                        key={ripple.id}
                        className="absolute rounded-full bg-white bg-opacity-60 transform scale-0 animate-ping pointer-events-none"
                        style={{
                            left: ripple.x,
                            top: ripple.y,
                            width: ripple.size,
                            height: ripple.size,
                            animation: 'ping 0.6s linear forwards'
                        }}
                    />
                ))}
            </button>

            <style jsx>{`
        @keyframes ping {
          to {
            transform: scale(4);
            opacity: 0;
          }
        }
      `}</style>
        </div>
    );
};

export default Pagination
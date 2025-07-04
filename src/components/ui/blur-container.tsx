const BlurContainer = ({
    children,
    className
}: {
    children: React.ReactNode;
    className?: string;
}) => {
    return (
        <div className={`w-full bg-white/80 backdrop-blur-lg shadow-xl rounded-xl ${className}`}>
            {children}
        </div>
    )
}
export default BlurContainer
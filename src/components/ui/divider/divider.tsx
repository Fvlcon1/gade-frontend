const Divider = ({
    className
} : {
    className? : string
}) => {
    return (
        <div className={`${className} w-full h-[1px] bg-border-primary/60 rounded-full`}>

        </div>
    )
}
export default Divider
import MouseTrail from "@components/ui/mouse-trail/mouse-trail";
import Slidein from "@styles/components/slidein";

const Template = ({children}: {children: React.ReactNode}) => {
    return (
        <>
            <MouseTrail />
            <div className="w-full h-full">
                {children}
            </div>
        </>
    )
}

export default Template
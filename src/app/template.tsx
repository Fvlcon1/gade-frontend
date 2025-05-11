import MouseTrail from "@components/mouse-trail/mouse-trail";
import Slidein from "@styles/components/slidein";

const Template = ({children}: {children: React.ReactNode}) => {
    return (
        <>
            <MouseTrail />
            <Slidein className="w-full">
                {children}
            </Slidein>
        </>
    )
}

export default Template
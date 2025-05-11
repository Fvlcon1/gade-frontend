import Overlay from "@components/overlay/overlay"
import { AnimatePresence } from "framer-motion"
import Image from "next/image"

const ZoomImage = ({
    show,
    setShow,
    imageURL
} : {
    show : boolean,
    setShow : React.Dispatch<React.SetStateAction<boolean>>
    imageURL : string
}) => {
    return (
        <AnimatePresence>
            {
                show &&
                <Overlay
                    onClick={()=>setShow(false)}
                >
                    <div 
                        className="w-fit relative h-[70%] rounded-md bg-bg-primary flex justify-center items-center overflow-hidden"
                        onClick={()=>setShow(false)}
                    >
                        <Image 
                            src={imageURL} 
                            alt="Uploaded Image"
                            width={0}
                            height={0}
                            sizes="large"
                            className={`rounded-lg w-auto h-full`}
                        />
                    </div>
                </Overlay>
            }
        </AnimatePresence>
    )
}
export default ZoomImage
import Button from "@components/ui/button/button"
import Text from "@styles/components/text"
import theme from "@styles/theme"
import { FaCircleCheck } from "react-icons/fa6"

const Success = ({
    onContinue
}) => {
    return (
        <div className="w-full flex-col flex gap-2 items-center justify-center">
            <FaCircleCheck 
                size={30}
                color="#32ba50"
            />
            <Text
                size={theme.text.size.HM}
                bold={theme.text.bold.md2}
                textColor="#32ba50"
            >
                Upload Successful!
            </Text>
            <Text>
                Your profile picture was uploaded successfully!
            </Text>
            <Button 
                text="Continue"
                onClick={()=>onContinue?.()}
            />
        </div>
    )
}
export default Success
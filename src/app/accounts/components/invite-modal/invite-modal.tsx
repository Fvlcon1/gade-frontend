import Container from "@components/ui/container/container"
import { AnimatePresence } from "framer-motion"
import Overlay from "@components/ui/overlay/overlay"
import theme from "@styles/theme"
import Text from "@styles/components/text"
import { RiUserAddLine } from "react-icons/ri"
import Form from "./form"
import Header from "@components/header/header"

const InviteModal = ({
    isVisible,
    close
}: {
    isVisible: boolean
    close: () => void
}) => {
    return (
        <AnimatePresence>
            {isVisible && (
                <Overlay
                    onClick={() => close()}
                    className="!px-6"
                >
                    <Container
                        isVisible={isVisible}
                        close={close}
                        className=""
                    >
                        <div
                            className="w-[400px] flex flex-col"
                        >
                            <div className="bg-main-primary/5 border-solid border-b-[1px] border-bg-tetiary rounded-t-[20px] h-[55px] flex items-center pl-4">
                                <Header 
                                    title="Invite User"
                                    icon={RiUserAddLine}
                                />
                            </div>

                            <div className="px-4 py-4">
                                <Form close={close}/>
                            </div>                            
                        </div>
                    </Container>
                </Overlay>
            )}
        </AnimatePresence>

    )
}
export default InviteModal
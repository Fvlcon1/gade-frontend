import Container from "@components/ui/container/container"
import Overlay from "@components/ui/overlay/overlay"
import Text from "@styles/components/text"
import theme from "@styles/theme"
import { TiWarning } from "react-icons/ti"
import { AnimatePresence } from "framer-motion"
import { PiWarningCircleBold } from "react-icons/pi"
import Button from "@components/ui/button/button"
import OutlineButton from "@components/ui/button/outlineButton"
import useDelete from "./useDelete"
import { IUserInfo } from '../../utils/types';

const effects = [
    "All user data will be permanently deleted",
    "User will lose access to all systems immediately",
    "This action cannot be reversed or undone"
]

const ConfirmationModal = ({
    isVisible,
    close,
    user
}: {
    isVisible: boolean;
    close: () => void;
    user: IUserInfo
}) => {
    const { deleteUserMutation, isDeletePending } = useDelete({ close, id: user.id })
    return (
        <AnimatePresence>
            {
                isVisible && (
                    <Overlay
                        onClick={close}
                        key={1}
                    >
                        <Container
                            isVisible={isVisible}
                            close={close}
                        >
                            <div className="w-full flex flex-col rounded-xl">

                                {/* Head */}
                                <div className="bg-red-50 border-b-[1px] rounded-t-2xl border-border-primary p-2 py-4 flex flex-col gap-1 items-center">
                                    <div className="w-[40px] h-[40px] rounded-full flex items-center justify-center bg-red-400">
                                        <TiWarning color={theme.colors.bg.primary} size={20} />
                                    </div>
                                    <Text
                                        size={theme.text.size.HM}
                                        bold={theme.text.bold.md}
                                    >
                                        Delete user account
                                    </Text>
                                    <Text className="mt-[-5px]">
                                        This action cannot be undone
                                    </Text>
                                </div>

                                {/* Body */}
                                <div className="w-full flex flex-col px-4 py-4">
                                    {/* Profile */}
                                    <div className="w-full rounded-xl bg-bg-primary-light flex flex-col overflow-hidden">
                                        <div className="w-full h-[80px] bg-main-primary ">

                                        </div>
                                        <div className="w-full h-full flex px-4 py-2 flex-col gap-2 border-[1px] border-border-primary rounded-b-xl">
                                            {/* Top Section */}
                                            <div className="w-full flex gap-4 mt-[-65px]">
                                                <div
                                                    className="w-[80px] h-[80px] rounded-full border-[5px] border-bg-primary flex items-center justify-center"
                                                    style={{
                                                        backgroundColor: "#dcdaec"
                                                    }}
                                                >
                                                    <Text
                                                        size={theme.text.size.HL}
                                                        bold={theme.text.bold.md2}
                                                        textColor={theme.colors.main.primary}
                                                    >
                                                        {`${user?.first_name.charAt(0).toUpperCase()}${user?.last_name.charAt(0).toUpperCase()}`}
                                                    </Text>
                                                </div>
                                                <div className="flex flex-col mt-3">
                                                    <Text
                                                        textColor={theme.colors.bg.primary}
                                                        size={theme.text.size.body2}
                                                        bold={theme.text.bold.md}
                                                    >
                                                        {`${user?.first_name} ${user?.last_name}`}
                                                    </Text>
                                                    <Text
                                                        textColor={theme.colors.bg.quantinary}
                                                    >
                                                        {user.role}
                                                    </Text>
                                                </div>
                                            </div>

                                            {/* Bottom Section */}
                                            <div className="flex flex-col">
                                                <Text>
                                                    <Text
                                                        textColor={theme.colors.text.tetiary}
                                                    >
                                                        Email:&nbsp;
                                                    </Text>
                                                    {user.email}
                                                </Text>
                                                <Text>
                                                    <Text
                                                        textColor={theme.colors.text.tetiary}
                                                    >
                                                        Last active:&nbsp;
                                                    </Text>
                                                    {user.last_active}
                                                </Text>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Effects */}
                                    <div className="w-full flex flex-col gap-2 mt-4 p-4 bg-[#fef2f291] border-[1px] border-[#e3656526] rounded-xl">
                                        {
                                            effects.map((effect, index) => (
                                                <div 
                                                    key={index}
                                                    className="w-full flex items-center gap-2"
                                                >
                                                    <PiWarningCircleBold color={"#eb4646"} size={15} />
                                                    <Text>
                                                        {effect}
                                                    </Text>
                                                </div>
                                            ))
                                        }
                                    </div>

                                </div>

                                {/* Footer */}
                                <div className="w-full flex justify-center items-center gap-2 pb-4 px-4">
                                    <OutlineButton
                                        onClick={close}
                                        text="Cancel"
                                        className="flex-1"
                                    />
                                    <Button
                                        onClick={() => deleteUserMutation()}
                                        loading={isDeletePending}
                                        text="Delete"
                                        background="#eb4646"
                                        className="flex-1"
                                    />
                                </div>
                            </div>
                        </Container>
                    </Overlay>
                )
            }
        </AnimatePresence>
    )
}
export default ConfirmationModal
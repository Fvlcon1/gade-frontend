import Container from "@components/ui/container/container"
import { AnimatePresence } from "framer-motion"
import Overlay from "@components/ui/overlay/overlay"
import theme from "@styles/theme"
import Text from "@styles/components/text"
import { RiUserAddLine } from "react-icons/ri"
import Header from "@components/header/header"
import { Radio } from "antd"
import { useEffect, useCallback, useState } from "react"
import OutlineButton from "@components/ui/button/outlineButton"
import Button from "@components/ui/button/button"
import { Status } from "../utils/types"
import useReview from "../hooks/useReview"

const UpdateStatusModal = ({
    isVisible,
    close,
    currentStatus,
    id
}: {
    isVisible: boolean
    close: () => void
    currentStatus: Status
    id: string
}) => {
    const status: Status[] = ["Open", "In Review", "False Positive", "Closed"];
    const [selectedStatus, setSelectedStatus] = useState<Status>(currentStatus);
    const { updateStatusMutation, updateStatusPending, updateStatusSuccess, updateStatusError } = useReview()

    const StatusText = useCallback(({
        status,
    }: {
        status: Status;
    }) => {
        const isSelected = selectedStatus === status;
        return (
            <Text
                bold={isSelected ? theme.text.bold.md : theme.text.bold.sm2}
                textColor={isSelected ? theme.colors.main.primary : theme.colors.text.secondary}
            >
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </Text>
        )
    }, [selectedStatus]);

    useEffect(() => {
        if (updateStatusSuccess) close()
    }, [updateStatusSuccess])

    useEffect(() => {
        setSelectedStatus(currentStatus)
    }, [currentStatus])

    const statusOptions = status.map((status) => ({
        label: <StatusText status={status} />,
        value: status,
    }));

    const handleClose = () => {
        close();
        setSelectedStatus(currentStatus);
    }

    const handleStatusChange = (value: Status) => {
        setSelectedStatus(value);
    };

    const handleUpdateStatus = () => {
        updateStatusMutation({ id, status: selectedStatus })
    }

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
                        className="rounded-2xl"
                    >
                        <div
                            className="w-[300px] flex flex-col"
                        >
                            <div className="bg-main-primary/5 border-solid border-b-[1px] border-bg-tetiary rounded-t-[20px] h-[55px] flex items-center pl-4">
                                <Header
                                    title="Update Status"
                                    icon={RiUserAddLine}
                                />
                            </div>

                            <div className="flex flex-col gap-1 px-4 py-2">
                                <Radio.Group
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: 8,
                                        alignItems: 'start',
                                    }}
                                    block
                                    options={statusOptions}
                                    value={selectedStatus}
                                    onChange={(e) => handleStatusChange(e.target.value as Status)}
                                />
                            </div>

                            <div className="flex items-center gap-2 bg-main-primary/5 border-t-[1px] border-border-primary px-4 py-4 rounded-b-[20px]">
                                <OutlineButton
                                    onClick={handleClose}
                                    text="Cancel"
                                    className="flex-1"
                                />
                                <Button
                                    onClick={handleUpdateStatus}
                                    text="Update"
                                    loading={updateStatusPending}
                                    className="flex-1"
                                />
                            </div>
                        </div>
                    </Container>
                </Overlay>
            )}
        </AnimatePresence>

    )
}
export default UpdateStatusModal
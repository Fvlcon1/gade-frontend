import Container from "@components/ui/container/container"
import { AnimatePresence } from "framer-motion"
import Overlay from "@components/ui/overlay/overlay"
import Text from "@styles/components/text"
import { RiUserAddLine } from "react-icons/ri"
import Header from "@components/header/header"
import { Radio } from "antd"
import { useEffect, useCallback, useState } from "react"
import OutlineButton from "@components/ui/button/outlineButton"
import Button from "@components/ui/button/button"
import { useAlertsContext } from "@/app/alerts/context/alert-context"
import { FilterStatus } from "@/app/alerts/utils/types"
import { useTheme } from "@styles/theme-context"

const UpdateStatusModal = ({
    isVisible,
    close,
    currentStatus,
    id
}: {
    isVisible: boolean
    close: () => void
    currentStatus: FilterStatus
    id: string
}) => {
    const status: FilterStatus[] = ["open", "under review", "closed"];
    const [selectedStatus, setSelectedStatus] = useState<FilterStatus>(currentStatus);
    const {updateAlertMutation, updateAlertLoading, updateAlertSuccess} = useAlertsContext()
    const {theme} = useTheme()

    const StatusText = useCallback(({
        status,
    }: {
        status: FilterStatus;
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

    useEffect(()=>{
        if(updateAlertSuccess){
            close()
        }
    }, [updateAlertSuccess])

    const statusOptions = status.map((status) => ({
        label: <StatusText status={status} />,
        value: status,
    }));

    const handleClose = () => {
        close();
        setSelectedStatus(currentStatus);
    }

    const handleStatusChange = (value: FilterStatus) => {
        setSelectedStatus(value);
    };

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
                            className="w-[300px] flex flex-col border border-border-secondary"
                        >
                            <div className="bg-main-primary/5 border-solid border-b-[1px] border-border-secondary rounded-t-[20px] h-[55px] flex items-center pl-4">
                                <Header
                                    title="Update Status"
                                    icon={RiUserAddLine}
                                />
                            </div>

                            <div className="flex flex-col gap-1 px-4 py-2">
                                <Radio.Group
                                    defaultValue={selectedStatus}
                                    onChange={(e) => handleStatusChange(e.target.value as FilterStatus)}
                                >
                                    <div className="flex flex-col gap-1">
                                        {
                                            statusOptions.map((option) => (
                                                <Radio
                                                    key={option.value}
                                                    value={option.value}
                                                    className="flex items-center"
                                                    style={{ color: theme.colors.main.primary }}
                                                >
                                                    {option.label}
                                                </Radio>
                                            ))
                                        }
                                    </div>
                                </Radio.Group>
                            </div>

                            <div className="flex items-center gap-2 bg-main-primary/5 border-t-[1px] border-border-primary px-4 py-4 rounded-b-[20px]">
                                <OutlineButton
                                    onClick={handleClose}
                                    text="Cancel"
                                    className="flex-1"
                                />
                                <Button
                                    onClick={() => updateAlertMutation({id, status: selectedStatus})}
                                    text="Update"
                                    loading={updateAlertLoading}
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
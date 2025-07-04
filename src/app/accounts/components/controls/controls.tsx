import Input from "@components/ui/input/input";
import { useState } from "react";
import { IoReloadOutline, IoSearch } from "react-icons/io5";
import theme from "@styles/theme";
import Dropdown from "@components/ui/dropdown/dropdown";
import { DropdownItem } from "@/utils/@types";
import { BiChevronDown } from "react-icons/bi";
import { HiOutlineStatusOnline } from "react-icons/hi";
import { FaUserShield } from "react-icons/fa";
import OutlineButton from "@components/ui/button/outlineButton";
import { TfiReload } from "react-icons/tfi";
import { RiUserAddFill } from "react-icons/ri";
import Button from "@components/ui/button/button";
import InviteModal from "../invite-modal/invite-modal";
import { useAccountsContext } from "../../context/context";

const Controls = () => {
    const [searchValue, setSearchValue] = useState('');
    const [statusValue, setStatusValue] = useState('All Status');
    const [selectedStatus, setSelectedStatus] = useState('');
    const [rolesValue, setRolesValue] = useState('All Roles');
    const [selectedRole, setSelectedRole] = useState('');
    const [isInviteVisible, setIsInviteVisible] = useState(false)
    const { refetchAccounts } = useAccountsContext()

    const handleStatusChange = (status: string) => {
        setStatusValue(status)
        setSelectedStatus(status)
    }

    const statusOptions: DropdownItem[] = [
        { key: "2", label: "Active", onClick: () => handleStatusChange('Active'), isSelected: selectedStatus === 'Active' },
        { key: "3", label: "Inactive", onClick: () => handleStatusChange('Inactive'), isSelected: selectedStatus === 'Inactive' },
        { key: "4", label: "Pending", onClick: () => handleStatusChange('Pending'), isSelected: selectedStatus === 'Pending' },
    ]

    const roleOptions: DropdownItem[] = [
        { key: "2", label: "Admin", onClick: () => handleRoleChange('Admin'), isSelected: selectedRole === 'Admin' },
        { key: "3", label: "Standard", onClick: () => handleRoleChange('Standard'), isSelected: selectedRole === 'Standard' },
    ]

    const handleRoleChange = (role: string) => {
        setRolesValue(role)
        setSelectedRole(role)
    }
    return (
        <>
            <InviteModal 
                isVisible={isInviteVisible} 
                close={() => setIsInviteVisible(false)} 
            />

            <div className="w-full flex gap-2 justify-between items-center">
                <div className="flex gap-2 flex-1">
                    <Input
                        placeholder="Search user, eg; Dennis Boakye"
                        value={searchValue}
                        setValue={setSearchValue}
                        PreIcon={<IoSearch color={theme.colors.text.tetiary} />}
                        className="!max-w-[500px]"
                    />

                    <Dropdown
                        menuItems={statusOptions}
                    >
                        <Input
                            placeholder="Status"
                            value={statusValue}
                            setValue={handleStatusChange}
                            PostIcon={<BiChevronDown color={theme.colors.text.tetiary} />}
                            PreIcon={<HiOutlineStatusOnline color={theme.colors.text.secondary} />}
                        />
                    </Dropdown>

                    <Dropdown
                        menuItems={roleOptions}
                    >
                        <Input
                            placeholder="Role"
                            value={rolesValue}
                            setValue={handleRoleChange}
                            PostIcon={<BiChevronDown color={theme.colors.text.tetiary} />}
                            PreIcon={<FaUserShield color={theme.colors.text.secondary} />}
                        />
                    </Dropdown>
                </div>

                <div className="flex gap-2">
                    <OutlineButton
                        text="Refresh"
                        icon={<IoReloadOutline />}
                        onClick={() => refetchAccounts()}
                    />

                    <Button
                        text="Invite User"
                        icon={(
                            <RiUserAddFill />
                        )}
                        onClick={() => setIsInviteVisible(true)}
                    />
                </div>
            </div>
        </>
    )
}
export default Controls
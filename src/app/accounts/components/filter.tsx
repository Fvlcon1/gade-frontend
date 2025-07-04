import Text from "@styles/components/text"
import theme from "@styles/theme"
import { Checkbox, CheckboxOptionType, GetProp } from "antd";
import { HiAdjustmentsHorizontal } from "react-icons/hi2"
import { FilterStatus, FilterRoles } from "../utils/types";
import { useMemo, useState } from "react";

const Divider = () => {
    return (
        <div className="w-full pl-3">
            <div className="w-full h-0.25 bg-border-primary" />
        </div>
    )
}

const Filter = () => {
    const [selectedStatus, setSelectedStatus] = useState<FilterStatus[]>([]);
    const status: FilterStatus[] = ["active", "inactive", "pending"];
    const roles: FilterRoles[] = ["admin", "standard"];

    const StatusText = ({
        status,
    }: {
        status: FilterStatus;
    }) => {
        const isSelected = selectedStatus.includes(status);
        return (
            <Text
                bold={isSelected ? theme.text.bold.md : theme.text.bold.sm2}
                textColor={isSelected ? theme.colors.main.primary : theme.colors.text.secondary}
            >
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </Text>
        )
    }
    const statusOptions: CheckboxOptionType[] = useMemo(() => {
        return status.map((status) => ({
            label: <StatusText status={status} />,
            value: status,
        }));
    }, [status, selectedStatus]);

    const rolesOptions: CheckboxOptionType[] = useMemo(() => {
        return roles.map((role) => ({
            label: <Text
                bold={theme.text.bold.sm2}
                textColor={theme.colors.text.secondary}
            >
                {role.charAt(0).toUpperCase() + role.slice(1)}
            </Text>,
            value: role,
        }));
    }, [roles]);

    const handleStatusChange: GetProp<typeof Checkbox.Group, 'onChange'> = (checkedValues) => {
        setSelectedStatus(checkedValues as FilterStatus[]);
        console.log('checked = ', checkedValues);
    };

    return (
        <div className="w-[220px] h-fit pb-4 flex flex-col gap-2 rounded-2xl border-[1px] border-border-primary">
            {/* header */}
            <div className="w-full h-[50px] flex px-3 items-center rounded-t-2xl bg-bg-primary-lighter border-b-[1px] border-border-primary">
                <div className="flex items-center gap-2">
                    <div className="w-[20px] h-[20px] rounded-sm bg-main-primary/15 flex items-center justify-center">
                        <HiAdjustmentsHorizontal
                            color={theme.colors.main.primary}
                            size={12}
                        />
                    </div>
                    <Text
                        bold={theme.text.bold.md}
                        textColor={theme.colors.main.primary}
                    >
                        Filter
                    </Text>
                </div>
            </div>

            <div className="w-full flex flex-col gap-3">
                <div className="flex flex-col gap-2 px-3">
                    <Text textColor={theme.colors.text.tetiary}>
                        Status
                    </Text>
                    <div className="flex flex-col gap-1">
                        <Checkbox.Group
                            defaultValue={["active", "inactive", "pending"]}
                            onChange={handleStatusChange}
                        >
                            <div className="flex flex-col gap-1">
                                {
                                    statusOptions.map((option) => (
                                        <Checkbox
                                            key={option.value}
                                            value={option.value}
                                            className="flex items-center"
                                            style={{ color: theme.colors.main.primary }}
                                        >
                                            {option.label}
                                        </Checkbox>
                                    ))
                                }
                            </div>
                        </Checkbox.Group>
                    </div>
                </div>

                <Divider />

                <div className="flex flex-col gap-2 px-3">
                    <Text textColor={theme.colors.text.tetiary}>
                        Roles
                    </Text>
                    <div className="flex flex-col gap-1">
                        <Checkbox.Group
                            defaultValue={["admin", "standard"]}
                            onChange={handleStatusChange}
                        >
                            <div className="flex flex-col gap-1">
                                {
                                    rolesOptions.map((option) => (
                                        <Checkbox
                                            key={option.value}
                                            value={option.value}
                                            className="flex items-center"
                                            style={{ color: theme.colors.main.primary }}
                                        >
                                            {option.label}
                                        </Checkbox>
                                    ))
                                }
                            </div>
                        </Checkbox.Group>
                    </div>
                </div>

            </div>
        </div>
    )
}
export default Filter
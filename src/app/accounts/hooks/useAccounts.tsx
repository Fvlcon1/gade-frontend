import { protectedApi } from "@/utils/apis/api"
import { useQuery } from "@tanstack/react-query"
import { IMetricCard } from "../utils/types"
import { FaUser, FaUsers } from "react-icons/fa6"
import { IoCloudOffline } from "react-icons/io5"
import { AiOutlineUsergroupAdd } from "react-icons/ai"
import Text from "@styles/components/text"
import Actions from "../components/actions/actions"
import { useEffect, useState } from "react"
import { parseISO } from "date-fns"
import { getRelativeTime } from "@/utils/getDate"
import theme from "@styles/theme"
import { transformKeysToCamelCase } from "@/utils/utils"

const getStatusClass = (status: string) => {
    switch (status) {
        case "pending":
            return `bg-[#FF950033]`
        case "active":
            return `bg-[#00C85133]`
        case "inactive":
            return `bg-[#FF000033]`
    }
}

const getStatusTextColor = (status: string) => {
    switch (status) {
        case "pending":
            return "#FF9500"
        case "active":
            return "#058e3c"
        case "inactive":
            return "#FF0000"
    }
}

const getRoleColor = (role: string) => {
    switch (role) {
        case "Admin":
            return "bg-[#3498db33]"
        case "User":
            return "bg-[#7a00e633]"
    }
}

const getRoleTextColor = (role: string) => {
    switch (role) {
        case "superadmin":
            return "red"
        case "admin":
            return "#3498db"
    }
}

const StatusChip = ({ status }: { status: string }) => {
    return (
        <div className={`flex px-4 py-1 rounded-full w-fit ${getStatusClass(status)}`}>
            <Text
                whiteSpace="nowrap"
                textColor={getStatusTextColor(status)}
            >
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </Text>
        </div>
    )
}

export const RoleChip = ({ role }: { role: string }) => {
    return (
        <Text
            whiteSpace="nowrap"
            textColor={getRoleTextColor(role)}
        >
            {role.charAt(0).toUpperCase() + role.slice(1)}
        </Text>
    )
}

const LastActiveChip = ({ lastActive }: { lastActive: string }) => {
    const getLastActive = () => {
        if (!lastActive) return "Never logged in"

        const date = parseISO(lastActive);
        const thresholdDate = new Date('2024-01-01');

        // If date is before 2024 or is the default zero value (Dec 31, 0001)
        if (date < thresholdDate || date.getFullYear() === 1) {
            return "Never logged in";
        }

        return getRelativeTime(date);
    }
    return (
        <div className="flex px-4 py-1 rounded-full w-fit bg-bg-secondary">
            <Text
                whiteSpace="nowrap"
            >
                {getLastActive()}
            </Text>
        </div>
    )
}

const useUAM = () => {
    const [metricsData, setMetricsData] = useState<IMetricCard[]>([])
    const [accountsData, setAccountsData] = useState<any[]>([])
    const [pageSize, setPageSize] = useState(10)
    const [pageId, setPageId] = useState(1)

    useEffect(()=>{
        console.log({pageId})
    },[pageId])

    const getAccounts = async () => {
        const response = await protectedApi.GET("/accounts/", {
            page_size: pageSize,
            page_id: pageId
        })
        setMetricsData(transformMetricsData(response))
        setAccountsData(transformAccountsData(response))
        return response
    }

    const { data, isLoading: accountsLoading, error: accountsError, refetch: refetchAccounts, isFetching: accountsIsFetching } = useQuery({
        queryKey: ["uam-accounts", pageId, pageSize],
        queryFn: getAccounts,
        refetchOnWindowFocus: true,
        refetchOnMount: false,
        refetchInterval: false,
        staleTime: 0
    })

    useEffect(() => {
        if (data) {
            setMetricsData(transformMetricsData(data))
            setAccountsData(transformAccountsData(data))
        }
    }, [])

    const transformMetricsData = (data: any) => {
        const metrics: IMetricCard[] = [
            {
                title: "Total Users",
                value: data?.length,
                color: "6060D0",
                icon: FaUsers
            },
            {
                title: "Active Users",
                value: data?.filter(user => user.status === 'ACTIVE').length,
                color: "299B46",
                icon: FaUser
            },
            {
                title: "Inactive Users",
                value: data?.filter(user => user.status === 'INACTIVE').length,
                color: "FF0000",
                icon: IoCloudOffline
            },
            {
                title: "Pending Invites",
                value: data?.filter(user => user.status === 'PENDING').length,
                color: "FF9500",
                icon: AiOutlineUsergroupAdd
            },
        ]
        return metrics
    }

    const transformAccountsData = (data: any) => {
        const accounts = data.map((account: any) => ({
            fullname: account.first_name ? `${account.first_name} ${account.last_name}` : <Text textColor={theme.colors.text.tetiary}>Not set</Text>,
            id: account.id,
            email: account.email,
            department: account.department ?? "-",
            username: account.user_name ?? "-",
            status: (
                <StatusChip status={account.status.toLowerCase()} />
            ),
            role: (
                <RoleChip role={account.role.toLowerCase()} />
            ),
            createdAt: getRelativeTime(account.created_at),
            lastModified: getRelativeTime(account.updated_at),
            lastActive: (
                <LastActiveChip lastActive={(account.last_active)} />
            ),
            actions: (
                <Actions
                    user={account}
                    refetchAccounts={refetchAccounts}
                />
            )
        }));
        return accounts;
    };


    return {
        metricsData,
        accountsData,
        accountsLoading,
        accountsError,
        refetchAccounts,
        accountsIsFetching,
        pageSize,
        setPageSize,
        pageId,
        setPageId
    }
}
export default useUAM
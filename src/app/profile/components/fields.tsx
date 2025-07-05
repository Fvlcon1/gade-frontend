import Input from "@components/ui/input/input"
import Text from "@styles/components/text"
import { useAuthStore } from "@/lib/store/auth-store"
import Divider from "@components/ui/divider/divider"

const Fields = () => {
    const { user } = useAuthStore()
    return (
        <div className="w-full flex flex-col gap-6">
            <div className="flex justify-between items-center flex-1 gap-4">
                <Text className="pl-1">
                    First Name
                </Text>
                <Input
                    placeholder="First Name"
                    className="!w-[60%]"
                    value={user?.first_name}
                    onChange={() => { }}
                />
            </div>

            <Divider />

            <div className="flex justify-between items-center flex-1 gap-4">
                <Text className="pl-1">
                    Last Name
                </Text>
                <Input
                    placeholder="Last Name"
                    className="!w-[60%]"
                    value={user?.last_name}
                    onChange={() => { }}
                />
            </div>

            <Divider />

            <div className="flex justify-between items-center flex-1 gap-4">
                <Text className="pl-1">
                    Email
                </Text>
                <Input
                    placeholder="Email"
                    className="!w-[60%]"
                    value={user?.email}
                    onChange={() => { }}
                />
            </div>

            <Divider />

            <div className="flex justify-between items-center flex-1 gap-4">
                <Text className="pl-1">
                    Username
                </Text>
                <Input
                    placeholder="Username"
                    className="!w-[60%]"
                    value={user?.user_name}
                    onChange={() => { }}
                />
            </div>

            <Divider />

            <div className="flex justify-between items-center flex-1 gap-4">
                <Text className="pl-1">
                    Department
                </Text>
                <Input
                    placeholder="Department"
                    className="!w-[60%]"
                    value={user?.department}
                    onChange={() => { }}
                />
            </div>
        </div>
    )
}
export default Fields
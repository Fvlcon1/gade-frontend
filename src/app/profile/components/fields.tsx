import Input from "@components/ui/input/input"
import Text from "@styles/components/text"
import { useAuthStore } from "@/lib/store/auth-store"
import Divider from "@components/ui/divider/divider"
import { useProfileContext } from "../context/profile-context"
import { MdEdit } from "react-icons/md"
import { useTheme } from "@styles/theme-context"

const Fields = () => {
    const { user } = useAuthStore()
    const { formik } = useProfileContext()
    const { firstname, lastname, username } = formik.values
    const { theme } = useTheme()

    return (
        <div className="w-full flex flex-col gap-6">
            <div className="flex justify-between items-center flex-1 gap-4">
                <Text className="pl-1">
                    First Name
                </Text>
                <Input
                    placeholder="First Name"
                    className="!w-[60%]"
                    value={firstname}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    name="firstname"
                    PostIcon={<MdEdit color={theme.colors.text.tetiary} />}
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
                    value={lastname}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    name="lastname"
                    PostIcon={<MdEdit color={theme.colors.text.tetiary} />}
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
                    disabled
                    inputProps={{
                        readOnly: true
                    }}
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
                    value={username}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    name="username"
                    PostIcon={<MdEdit color={theme.colors.text.tetiary} />}
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
                    disabled
                    inputProps={{
                        readOnly: true
                    }}
                />
            </div>
        </div>
    )
}
export default Fields
import Container from "@components/ui/container/container"
import { ViewStates } from "../../profile-view"
import Header from "@components/header/header"
import { FaUserGear } from "react-icons/fa6"
import Theme from "./components/theme"
import Divider from "@components/ui/divider/divider"
import CoordinateFormat from "./components/coordinate-formmat"
import DefaultMapView from "./components/default-map-view"
import Notification from "./components/notification"
import Units from "./components/units"
import Actions from "./components/actions"

const Preferences = ({
    setViewState
}: {
    setViewState: (viewState: ViewStates) => void
}) => {
    return (
        <Container
            isVisible={true}
            close={() => setViewState(null)}
            className="!z-[1002]"
        >
            <div
                className="w-[400px] flex flex-col"
            >
                <div className="bg-main-primary/5 border-solid border-b-[1px] border-bg-tetiary rounded-t-[20px] h-[55px] flex items-center pl-4">
                    <Header
                        title="User Preferences"
                        icon={FaUserGear}
                    />
                </div>

                <div className="flex flex-col gap-3 py-4 px-4">
                    <Theme />
                    <Divider />
                    <CoordinateFormat />
                    <Divider />
                    <DefaultMapView />
                    <Divider />
                    <Notification />
                    <Divider />
                    <Units />
                    <Divider />
                    <Actions />
                </div>
            </div>
        </Container>
    )
}
export default Preferences
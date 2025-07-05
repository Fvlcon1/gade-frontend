import { LeftPanelContextProvider } from "./context/context";
import LeftPanelContent from "./leftpanel-content";

const LeftPanel = () => {
    return (
        <LeftPanelContextProvider>
            <LeftPanelContent />
        </LeftPanelContextProvider>
    )
}
export default LeftPanel
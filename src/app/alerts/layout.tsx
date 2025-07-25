import { AlertsContextProvider } from "./context/alert-context";

const AlertLayout = ({
    children
}: {
    children: React.ReactNode
}) => {
    return (
        <AlertsContextProvider>
            {children}
        </AlertsContextProvider>
    )
}
export default AlertLayout
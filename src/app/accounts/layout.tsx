import { AccountsContextProvider } from "./context/context"

const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <>
            <AccountsContextProvider>
                {children}
            </AccountsContextProvider>
        </>
    )
}
export default Layout
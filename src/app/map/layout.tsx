import { ReviewContextProvider } from "./components/review-validation/context/review-context"

const MapLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <ReviewContextProvider>
            {children}
        </ReviewContextProvider>
    )
}

export default MapLayout

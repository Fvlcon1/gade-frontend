import { useState } from "react"
import Profile from "./components/profile"
import Preferences from "./components/preferences/preferences"

export type ViewStates = null | "preferences"

const ProfileView = () => {
    const [viewState, setViewState] = useState<ViewStates>(null)

    if(viewState === null)
        return <Profile setViewState={setViewState} />
    
    if(viewState === "preferences")
        return <Preferences setViewState={setViewState} />
}
export default ProfileView
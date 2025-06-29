import { IoLayers, IoStatsChart } from "react-icons/io5"
import Text from "@styles/components/text"
import theme from "@styles/theme"
import Header from "./components/header"
import ChartCarousel from "./components/chart-carousel"
import "./components/antd.css"

const Charts = () => {
    return (
        <div className="flex flex-col border-[1px] border-border-primary rounded-2xl bg-bg-primary-lighter">
            <Header />
            
            {/* Body */}
            <div className="bg-bg-primary border-t-[1px] border-border-primary rounded-2xl">
                <ChartCarousel />
            </div>
        </div>
    )
}
export default Charts
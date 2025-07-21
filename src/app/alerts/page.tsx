'use client';
import LeftPanel from "@components/Layout/LeftPanel/LeftPanel";


export default function Home() {
	return (
		<div className="w-full h-full flex">
			<div className="fixed top-0 left-1.5 z-[1001] h-full py-4">
				<LeftPanel />
			</div>
		</div>
	);
}

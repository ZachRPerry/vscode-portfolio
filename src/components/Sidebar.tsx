import React from "react";
import { Github, Terminal } from "lucide-react";

export default function Sidebar({
	t,
	isExplorerActive = false,
}: {
	t: { sidebarBg: string };
	isExplorerActive?: boolean;
}) {
	return (
		<aside
			className={`w-14 flex flex-col items-center py-3 gap-4 ${t.sidebarBg}`}
		>
			<div
				className={`w-full px-3 py-2 rounded-r-md flex justify-center relative overflow-visible ${
					isExplorerActive ? "bg-[#3b3b3b]" : "hover:bg-[#2a2d2e]"
				}`}
			>
				<svg
					className={`${
						isExplorerActive ? "text-white" : "text-gray-300"
					} w-6 h-6`}
					fill="currentColor"
					strokeWidth={0}
					xmlns="http://www.w3.org/2000/svg"
					aria-hidden="true"
					viewBox="0 0 24 24"
				>
					<path d="M17.5 0h-9L7 1.5V6H2.5L1 7.5v15.07L2.5 24h12.07L16 22.57V18h4.7l1.3-1.43V4.5L17.5 0zm0 2.12l2.38 2.38H17.5V2.12zm-3 20.38h-12v-15H7v9.07L8.5 18h6v4.5zm6-6h-12v-15H16V6h4.5v10.5z" />
				</svg>
				{isExplorerActive ? (
					<span className="absolute right-0 top-1/2 -translate-y-1/2 h-12 w-1 bg-[#007acc] rounded-l-sm z-10 pointer-events-none" />
				) : null}
			</div>
			<div className="w-full flex justify-center">
				<div className="w-full px-3 py-2 flex justify-center hover:bg-[#2a2d2e] rounded-r-md">
					<Github className="w-6 h-6 text-gray-300" />
				</div>
			</div>

			<div className="w-full flex justify-center">
				<div className="w-full px-3 py-2 flex justify-center hover:bg-[#2a2d2e] rounded-r-md">
					<Terminal className="w-6 h-6 text-gray-300" />
				</div>
			</div>
		</aside>
	);
}

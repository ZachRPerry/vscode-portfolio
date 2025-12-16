import React from "react";

export default function TerminalPane({ t }: { t: { terminalBg: string } }) {
	return (
		<div className="h-40 font-mono text-sm flex flex-col bg-[#0b0b0b] text-gray-200">
			<div className="flex items-center justify-between bg-[#0b0b0b] px-3 py-1 text-xs border-b border-[#222]">
				<div className="flex items-center gap-2">
					<div className="px-2 py-0.5 bg-[#1f2937] rounded text-xs font-medium">
						TERMINAL
					</div>
					<div className="px-2 py-0.5 bg-[#1f2937] rounded text-xs">
						1: powershell
					</div>
				</div>
				<div className="text-xs text-gray-400">vscode</div>
			</div>

			<div className="flex-1 overflow-auto bg-[#0b0b0b] px-3 py-2">
				<div className="text-gray-500 text-xs mb-2">Last login: just now</div>

				<div className="space-y-1">
					<div>
						<span className="text-green-400">PS C:\\Users\\zach&gt;</span>
						<span className="ml-2 text-gray-100">npm install</span>
					</div>

					<div className="text-gray-500">
						added 123 packages, and audited 123 packages in 2s
					</div>

					<div>
						<span className="text-green-400">PS C:\\Users\\zach&gt;</span>
						<span className="ml-2 text-gray-100">npm run dev</span>
					</div>

					<div className="text-gray-500">Local: http://localhost:5173</div>

					<div className="flex items-center gap-2">
						<span className="text-green-400">PS C:\\Users\\zach&gt;</span>
						<span className="ml-1 text-gray-100"> </span>
						<span className="w-1 h-4 bg-gray-100 inline-block animate-pulse" />
					</div>
				</div>
			</div>
		</div>
	);
}

import React from "react";

export default function Explorer({
	files,
	openFile,
	activeFile,
	t,
}: {
	files: Record<string, { language: string; value: string }>;
	openFile: (f: string) => void;
	activeFile: string;
	t: { explorerBg: string };
}) {
	return (
		<aside className={`w-56 p-3 text-sm ${t.explorerBg}`}>
			<h3 className="text-xs mb-2">EXPLORER</h3>
			{Object.keys(files).map((f) => (
				<div
					key={f}
					onClick={() => openFile(f)}
					className={`cursor-pointer px-2 py-1 rounded ${
						activeFile === f ? "bg-[#373737]" : "hover:bg-[#2a2d2e]"
					}`}
				>
					{f}
				</div>
			))}
		</aside>
	);
}

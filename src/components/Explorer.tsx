import React from "react";
import type { FileMap } from "../types";

export default function Explorer({
	files,
	openFile,
	activeFile,
	t,
}: {
	files: FileMap;
	openFile: (f: string) => void;
	activeFile: string;
	t: { explorerBg: string; monaco?: string };
}) {
	const isLight = t.monaco === "vs";
	const itemActive = isLight ? "bg-[#e2e2e2]" : "bg-[#373737]";
	const itemHover = isLight ? "hover:bg-[#f0f0f0]" : "hover:bg-[#2a2d2e]";
	return (
		<aside className={`w-56 p-3 text-sm ${t.explorerBg}`}>
			<h3 className="text-xs mb-2">EXPLORER</h3>
			{Object.keys(files)
				.sort()
				.map((f) => (
					<div
						key={f}
						onClick={() => openFile(f)}
						className={`cursor-pointer px-2 py-1 rounded ${
							activeFile === f ? itemActive : itemHover
						}`}
					>
						{f}
					</div>
				))}
		</aside>
	);
}

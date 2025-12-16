import React, { useRef, useEffect } from "react";
import useTerminal from "../hooks/useTerminal";

export default function TerminalPane({
	t,
	theme,
}: {
	t: { terminalBg: string };
	theme?: string;
}) {
	const { lines, input, setInput, handleKeyDown, handleCommand } =
		useTerminal(theme);
	const scrollRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (scrollRef.current) {
			scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
		}
	}, [lines]);

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

			<div
				ref={scrollRef}
				className="flex-1 overflow-auto bg-[#0b0b0b] px-3 py-2 space-y-1"
			>
				{lines.map((line, i) => (
					<div key={i}>
						{line.type === "command" && (
							<div>
								<span className="text-green-400">PS C:\\Users\\zach&gt;</span>
								<span className="ml-2 text-gray-100">{line.content}</span>
							</div>
						)}
						{line.type === "output" && (
							<div
								className={
									line.content.toLowerCase().startsWith("warning")
										? "text-amber-400"
										: line.content.startsWith("✓") ||
										  line.content.toLowerCase().startsWith("success")
										? "text-green-400"
										: "text-gray-500"
								}
							>
								{line.content}
							</div>
						)}
					</div>
				))}
				<div className="flex items-center">
					<span className="text-green-400">PS C:\\Users\\zach&gt;</span>
					<input
						ref={inputRef}
						type="text"
						value={input}
						onChange={(e) => setInput(e.target.value)}
						onKeyDown={handleKeyDown}
						className="ml-2 bg-transparent text-gray-100 outline-none flex-1"
						autoFocus
					/>
				</div>
			</div>
		</div>
	);
}

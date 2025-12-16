import React from "react";

type ThemeKey = "dark" | "light" | "hc";

export default function Header({
	theme,
	setTheme,
	t,
	onOpenPalette,
	onLogoClick,
}: {
	theme: ThemeKey;
	setTheme: (s: ThemeKey) => void;
	t: { menuBg: string };
	onOpenPalette: (anchor: DOMRect) => void;
	onLogoClick: () => void;
}) {
	const isLight = theme === "light";
	const boxBg = isLight
		? "bg-white text-[#1e1e1e]"
		: "bg-[#2a2d2e] text-[#cccccc]";
	const boxBorder = isLight
		? "border border-gray-300"
		: "border border-[#3a3d41]";
	const boxHover = isLight ? "hover:bg-[#f3f4f6]" : "hover:bg-[#333333]";
	return (
		<header className={`h-8 flex items-center px-3 text-xs ${t.menuBg}`}>
			{/* Left: menu + logo */}
			<div className="flex items-center gap-0">
				<button
					onClick={onLogoClick}
					title="Go to home"
					className="cursor-pointer hover:opacity-80 transition-opacity"
				>
					<img
						src="/zLogoVS.png"
						alt="zach VS logo"
						className="w-5 h-5 mr-3 select-none"
					/>
				</button>
				<span className="mr-4">File</span>
				<span className="mr-4">Edit</span>
				<span className="mr-4">Selection</span>
				<span className="mr-4">View</span>
				<span className="mr-4">Go</span>
				<span className="mr-4">Run</span>
				<span>Help</span>
			</div>

			{/* Center: command box */}
			<div className="flex-1 flex justify-center">
				<button
					onClick={(e) =>
						onOpenPalette(
							(e.currentTarget as HTMLButtonElement).getBoundingClientRect()
						)
					}
					className={`w-[520px] flex items-center justify-between gap-6 px-3 h-6 rounded ${boxBg} ${boxBorder} ${boxHover}`}
					title="Open Command Palette (Ctrl+Shift+P)"
				>
					<span className="opacity-80">Search for commands…</span>
					<span className="opacity-60 hidden sm:inline">Ctrl+Shift+P</span>
				</button>
			</div>

			{/* Right: theme toggles */}
			<div className="flex gap-2">
				<button onClick={() => setTheme("dark")} className="px-2">
					Dark
				</button>
				<button onClick={() => setTheme("light")} className="px-2">
					Light
				</button>
				<button onClick={() => setTheme("hc")} className="px-2">
					HC
				</button>
			</div>
		</header>
	);
}

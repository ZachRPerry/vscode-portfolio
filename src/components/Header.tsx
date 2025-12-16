import React from "react";

type ThemeKey = "dark" | "light" | "hc";

export default function Header({
	theme,
	setTheme,
	t,
}: {
	theme: ThemeKey;
	setTheme: (s: ThemeKey) => void;
	t: { menuBg: string };
}) {
	return (
		<header className={`h-8 flex items-center px-3 text-xs ${t.menuBg}`}>
			<span className="mr-4">File</span>
			<span className="mr-4">Edit</span>
			<span className="mr-4">Selection</span>
			<span className="mr-4">View</span>
			<span className="mr-4">Go</span>
			<span className="mr-4">Run</span>
			<span className="mr-4">Terminal</span>
			<span>Help</span>
			<div className="ml-auto flex gap-2">
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

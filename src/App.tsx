import React, { useEffect, useMemo, useState } from "react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Explorer from "./components/Explorer";
import Tabs from "./components/Tabs";
import EditorPane from "./components/EditorPane";
import TerminalPane from "./components/TerminalPane";
import Footer from "./components/Footer";
import { themes, ThemeKey } from "./theme";
import useFiles from "./hooks/useFiles";
import CommandPalette from "./components/CommandPalette";

export default function App() {
	const [theme, setTheme] = useState<ThemeKey>("dark");
	const t = themes[theme];
	const [paletteOpen, setPaletteOpen] = useState(false);
	const [anchorRect, setAnchorRect] = useState<DOMRect | null>(null);

	const {
		files,
		openTabs,
		activeFile,
		openFile,
		closeTab,
		setActiveFile,
		setOpenTabs,
	} = useFiles();

	const file = files[activeFile as keyof typeof files];

	// Global hotkeys for command palette (Ctrl+Shift+P or F1)
	useEffect(() => {
		const onKey = (e: KeyboardEvent) => {
			const key = e.key.toLowerCase();
			if ((e.ctrlKey && e.shiftKey && key === "p") || key === "f1") {
				e.preventDefault();
				setPaletteOpen(true);
			}
		};
		document.addEventListener("keydown", onKey);
		return () => document.removeEventListener("keydown", onKey);
	}, []);

	const commands = useMemo(
		() => [
			{
				id: "open-contact",
				title: "Open contact.json",
				action: () => openFile("contact.json"),
				keywords: ["file", "contact"],
			},
			{
				id: "open-projects",
				title: "Open projects.md",
				action: () => openFile("projects.md"),
				keywords: ["file", "projects"],
			},
			{
				id: "open-experience",
				title: "Open experience.md",
				action: () => openFile("experience.md"),
				keywords: ["file", "experience"],
			},
			{
				id: "theme-dark",
				title: "Theme: Dark",
				action: () => setTheme("dark"),
				keywords: ["theme"],
			},
			{
				id: "theme-light",
				title: "Theme: Light",
				action: () => setTheme("light"),
				keywords: ["theme"],
			},
			{
				id: "theme-hc",
				title: "Theme: High Contrast",
				action: () => setTheme("hc"),
				keywords: ["theme", "accessibility"],
			},
			{
				id: "easter-egg",
				title: "Hire and pay lots of money",
				subtitle: "A friendly suggestion",
				action: () => alert("Hire and pay lots of money ✨"),
				keywords: ["easter egg", "fun"],
			},
		],
		[openFile]
	);

	return (
		<div className={`h-screen font-mono flex flex-col ${t.appBg}`}>
			<Header
				theme={theme}
				setTheme={setTheme}
				t={t}
				onOpenPalette={(rect) => {
					setAnchorRect(rect);
					setPaletteOpen(true);
				}}
				onLogoClick={() => {
					setActiveFile("");
					setOpenTabs([]);
				}}
			/>

			<div className="flex flex-1 overflow-hidden">
				<Sidebar t={t} isExplorerActive={!!activeFile} />

				<Explorer
					files={files}
					openFile={openFile}
					activeFile={activeFile}
					t={t}
				/>

				<main className="flex-1 flex flex-col">
					<Tabs
						openTabs={openTabs}
						activeFile={activeFile}
						setActiveFile={setActiveFile}
						closeTab={closeTab}
						t={t}
					/>

					<EditorPane file={file} monacoTheme={t.monaco} />

					<TerminalPane t={t} />
				</main>
			</div>

			<Footer />

			<CommandPalette
				open={paletteOpen}
				onClose={() => setPaletteOpen(false)}
				commands={commands}
				t={t}
				anchorRect={anchorRect ?? undefined}
			/>
		</div>
	);
}

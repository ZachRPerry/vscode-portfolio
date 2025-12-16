import React, { useEffect, useState } from "react";
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
import useCommands from "./hooks/useCommands";

export default function App() {
	const getInitialTheme = (): ThemeKey => {
		// Check localStorage first
		const saved = localStorage.getItem("theme") as ThemeKey | null;
		if (saved && (saved === "dark" || saved === "light" || saved === "hc")) {
			return saved;
		}
		// Fall back to device theme
		if (
			window.matchMedia &&
			window.matchMedia("(prefers-color-scheme: light)").matches
		) {
			return "light";
		}
		return "dark";
	};

	const [theme, setThemeState] = useState<ThemeKey>(getInitialTheme());
	const t = themes[theme];
	const [paletteOpen, setPaletteOpen] = useState(false);
	const [anchorRect, setAnchorRect] = useState<DOMRect | null>(null);

	// Wrapper to save theme to localStorage
	const setTheme = (newTheme: ThemeKey) => {
		setThemeState(newTheme);
		localStorage.setItem("theme", newTheme);
	};

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

	const commands = useCommands(openFile, setTheme);

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

					<TerminalPane t={t} theme={theme} />
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

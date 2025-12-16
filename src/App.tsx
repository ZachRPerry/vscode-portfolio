import React, { useState } from "react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Explorer from "./components/Explorer";
import Tabs from "./components/Tabs";
import EditorPane from "./components/EditorPane";
import TerminalPane from "./components/TerminalPane";
import Footer from "./components/Footer";
import { themes, ThemeKey } from "./theme";
import useFiles from "./hooks/useFiles";

export default function App() {
	const [theme, setTheme] = useState<ThemeKey>("dark");
	const t = themes[theme];

	const { files, openTabs, activeFile, openFile, closeTab, setActiveFile } =
		useFiles();

	const file = files[activeFile as keyof typeof files];

	return (
		<div className={`h-screen font-mono flex flex-col ${t.appBg}`}>
			<Header theme={theme} setTheme={setTheme} t={t} />

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
		</div>
	);
}

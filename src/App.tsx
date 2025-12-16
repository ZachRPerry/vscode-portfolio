import React, { useCallback, useEffect, useRef, useState } from "react";
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
import Toast from "./components/Toast";
import Confetti from "./components/Confetti";
import useAchievements from "./hooks/useAchievements";
import AchievementNotification from "./components/AchievementNotification";
import AchievementsView from "./components/AchievementsView";
import Landing from "./components/Landing";

export default function App() {
  const getInitialTheme = (): ThemeKey => {
    // Check localStorage first
    const saved = localStorage.getItem("theme") as ThemeKey | null;
    if (saved && (saved === "dark" || saved === "light")) {
      return saved;
    }
    // Fall back to device theme
    if (window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches) {
      return "light";
    }
    return "dark";
  };

  const [theme, setThemeState] = useState<ThemeKey>(getInitialTheme());
  const t = themes[theme];
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [anchorRect, setAnchorRect] = useState<DOMRect | null>(null);
  const [showTerminal, setShowTerminal] = useState(true);
  const [showThemeTip, setShowThemeTip] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [showLanding, setShowLanding] = useState(true);
  const [savedEditorState, setSavedEditorState] = useState<{
    activeFile: string;
    openTabs: string[];
  }>({
    activeFile: "",
    openTabs: [],
  });
  const terminalCommandRef = useRef<((cmd: string, skipEcho?: boolean) => void) | null>(null);

  const achievements = useAchievements();

  // Wrapper to save theme to localStorage
  const setTheme = (newTheme: ThemeKey) => {
    setThemeState(newTheme);
    localStorage.setItem("theme", newTheme);
    achievements.trackThemeSwitch();
    // Hide the tip if it's currently shown
    if (showThemeTip) {
      setShowThemeTip(false);
    }
  };

  const {
    files,
    openTabs,
    activeFile,
    openFile: openFileBase,
    closeTab,
    setActiveFile,
    setOpenTabs,
  } = useFiles();

  // Wrap openFile to track achievements
  const openFile = useCallback(
    (filename: string) => {
      openFileBase(filename);
      achievements.trackFileOpen(filename);
      setShowAchievements(false);
      setShowLanding(false);
    },
    [openFileBase, achievements]
  );

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

  // On every page load, show the tip if starting in light mode
  useEffect(() => {
    if (theme === "light") {
      setShowThemeTip(true);
    }
  }, []);

  const openTerminal = () => setShowTerminal(true);

  // Just show confetti (for terminal typed command)
  const handleShowConfetti = useCallback(() => {
    setShowConfetti(true);
    achievements.trackHire();
  }, [achievements]);

  // Show confetti + add terminal output (for palette command)
  const handleHire = useCallback(() => {
    setShowConfetti(true);
    if (terminalCommandRef.current) {
      terminalCommandRef.current("hire", true); // skipEcho = true for palette
    }
  }, []);

  const commands = useCommands(openFile, setTheme, openTerminal, handleHire);

  return (
    <div className={`h-screen font-mono flex flex-col ${t.appBg}`}>
      <Header
        theme={theme}
        setTheme={setTheme}
        t={t}
        showThemeTip={showThemeTip}
        onOpenPalette={(rect) => {
          setAnchorRect(rect);
          setPaletteOpen(true);
        }}
        onLogoClick={() => {
          setActiveFile("");
          setOpenTabs([]);
          setShowAchievements(false);
          setShowLanding(true);
        }}
      />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          t={t}
          isExplorerActive={showLanding}
          isAchievementsActive={showAchievements}
          onOpenTerminal={() => setShowTerminal(true)}
          onOpenExplorer={() => {
            setShowAchievements(false);
            // Always restore saved editor state (coming from achievements)
            setActiveFile(savedEditorState.activeFile);
            setOpenTabs(savedEditorState.openTabs);
            // Only show landing if no files were saved
            setShowLanding(!savedEditorState.activeFile);
          }}
          onOpenAchievements={() => {
            // Save current editor state before switching away
            setSavedEditorState({ activeFile, openTabs });
            setShowAchievements(true);
            setShowLanding(false);
            setActiveFile("");
            setOpenTabs([]);
          }}
        />

        <Explorer files={files} openFile={openFile} activeFile={activeFile} t={t} />

        <main className="flex-1 flex flex-col">
          <Tabs
            openTabs={openTabs}
            activeFile={activeFile}
            setActiveFile={setActiveFile}
            closeTab={closeTab}
            t={t}
          />

          {showLanding ? (
            <Landing
              onOpenContact={files["contact.json"] ? () => openFile("contact.json") : undefined}
            />
          ) : showAchievements ? (
            <AchievementsView
              unlocked={achievements.progress.unlocked}
              progress={achievements.progress}
            />
          ) : (
            <EditorPane
              file={file}
              monacoTheme={t.monaco}
              onOpenContact={files["contact.json"] ? () => openFile("contact.json") : undefined}
            />
          )}

          {showTerminal && (
            <TerminalPane
              t={t}
              theme={theme}
              onClose={() => setShowTerminal(false)}
              onHire={handleShowConfetti}
              commandRef={terminalCommandRef}
              onOpenFile={openFile}
              onCommand={achievements.trackTerminalCommand}
              onClearAchievements={achievements.clearAllAchievements}
              onUnlockAll={achievements.unlockAllAchievements}
            />
          )}
        </main>
      </div>

      <Footer />

      <Toast
        open={showThemeTip}
        onClose={() => setShowThemeTip(false)}
        title="Tip"
        message="Click the lightbulb to switch to dark mode."
        theme={theme}
      />

      <CommandPalette
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        commands={commands}
        t={t}
        anchorRect={anchorRect ?? undefined}
        onCommandExecute={achievements.trackPaletteCommand}
      />

      <Confetti active={showConfetti} onComplete={() => setShowConfetti(false)} />

      <AchievementNotification
        achievement={achievements.recentUnlock}
        onClose={achievements.clearRecentUnlock}
      />
    </div>
  );
}

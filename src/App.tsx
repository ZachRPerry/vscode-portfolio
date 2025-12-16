import { useCallback, useRef } from "react";
import { themes } from "./theme";
import {
  useAchievements,
  useAppEffects,
  useCommands,
  useFiles,
  useTheme,
  useViewState,
} from "./hooks";
import {
  AchievementNotification,
  AchievementsView,
  CommandPalette,
  Confetti,
  EditorPane,
  Explorer,
  Footer,
  Header,
  Landing,
  Sidebar,
  Tabs,
  TerminalPane,
  Toast,
} from "./components";

export default function App() {
  const { theme, t, setTheme: setThemeBase } = useTheme();
  const view = useViewState();
  const achievements = useAchievements();
  const terminalCommandRef = useRef<((cmd: string, skipEcho?: boolean) => void) | null>(null);

  // Wrap setTheme to include achievement tracking
  const setTheme = useCallback(
    (newTheme: typeof theme) => {
      setThemeBase(newTheme, view.showThemeTip, view.setShowThemeTip, () => {
        achievements.trackThemeSwitch();
      });
    },
    [setThemeBase, view.showThemeTip, view.setShowThemeTip, achievements]
  );

  const {
    files,
    openTabs,
    activeFile,
    openFile: openFileBase,
    closeTab,
    setActiveFile,
    setOpenTabs,
  } = useFiles();
  const file = files[activeFile as keyof typeof files];

  // Wrap openFile to track achievements and hide views
  const openFile = useCallback(
    (filename: string) => {
      openFileBase(filename);
      achievements.trackFileOpen(filename);
      view.setShowAchievements(false);
      view.setShowLanding(false);
    },
    [openFileBase, achievements, view]
  );

  // Register all app-level effects
  useAppEffects(achievements, theme, view.showThemeTip, view.setShowThemeTip, view.setPaletteOpen);

  // Callbacks for confetti
  const handleShowConfetti = useCallback(() => {
    view.setShowConfetti(true);
    achievements.trackHire();
  }, [view, achievements]);

  const handleHire = useCallback(() => {
    view.setShowConfetti(true);
    if (terminalCommandRef.current) {
      terminalCommandRef.current("hire", true);
    }
  }, [view]);

  const commands = useCommands(openFile, setTheme, () => view.setShowTerminal(true), handleHire);

  return (
    <div className={`h-screen font-mono flex flex-col ${t.appBg}`}>
      <Header
        theme={theme}
        setTheme={setTheme}
        t={t}
        showThemeTip={view.showThemeTip}
        onOpenPalette={(rect) => {
          view.setAnchorRect(rect);
          view.setPaletteOpen(true);
        }}
        onLogoClick={() => {
          setActiveFile("");
          setOpenTabs([]);
          view.setShowAchievements(false);
          view.setShowLanding(true);
        }}
      />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          t={t}
          isExplorerActive={!view.showAchievements}
          isAchievementsActive={view.showAchievements}
          onOpenTerminal={() => view.setShowTerminal(true)}
          onOpenExplorer={() => {
            view.setShowAchievements(false);
            setActiveFile(view.savedEditorState.activeFile);
            setOpenTabs(view.savedEditorState.openTabs);
            view.setShowLanding(!view.savedEditorState.activeFile);
          }}
          onOpenAchievements={() => {
            view.setSavedEditorState({ activeFile, openTabs });
            view.setShowAchievements(true);
            view.setShowLanding(false);
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

          {view.showLanding ? (
            <Landing
              onOpenContact={files["contact.json"] ? () => openFile("contact.json") : undefined}
            />
          ) : view.showAchievements ? (
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

          {view.showTerminal && (
            <TerminalPane
              t={t}
              theme={theme}
              onClose={() => view.setShowTerminal(false)}
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
        open={view.showThemeTip}
        onClose={() => view.setShowThemeTip(false)}
        title="Tip"
        message="Click the lightbulb to switch to dark mode."
        theme={theme}
      />

      <CommandPalette
        open={view.paletteOpen}
        onClose={() => view.setPaletteOpen(false)}
        commands={commands}
        t={t}
        anchorRect={view.anchorRect ?? undefined}
        onCommandExecute={achievements.trackPaletteCommand}
      />

      <Confetti active={view.showConfetti} onComplete={() => view.setShowConfetti(false)} />

      <AchievementNotification
        achievement={achievements.recentUnlock}
        onClose={achievements.clearRecentUnlock}
      />
    </div>
  );
}

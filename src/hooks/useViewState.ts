import { useState, useEffect } from "react";

export default function useViewState() {
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [anchorRect, setAnchorRect] = useState<DOMRect | null>(null);
  const [showTerminal, setShowTerminal] = useState(false);
  const [showThemeTip, setShowThemeTip] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [showLanding, setShowLanding] = useState(true);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showExplorer, setShowExplorer] = useState(false);
  const [savedEditorState, setSavedEditorState] = useState<{
    activeFile: string;
    openTabs: string[];
  }>({
    activeFile: "",
    openTabs: [],
  });

  // Show terminal by default on desktop screens
  useEffect(() => {
    const checkScreenSize = () => {
      if (window.innerWidth >= 768) {
        setShowTerminal(true);
      }
    };
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  return {
    paletteOpen,
    setPaletteOpen,
    anchorRect,
    setAnchorRect,
    showTerminal,
    setShowTerminal,
    showThemeTip,
    setShowThemeTip,
    showConfetti,
    setShowConfetti,
    showAchievements,
    setShowAchievements,
    showLanding,
    setShowLanding,
    showMobileMenu,
    setShowMobileMenu,
    showExplorer,
    setShowExplorer,
    savedEditorState,
    setSavedEditorState,
  } as const;
}

import { useState } from "react";

export default function useViewState() {
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
    savedEditorState,
    setSavedEditorState,
  };
}

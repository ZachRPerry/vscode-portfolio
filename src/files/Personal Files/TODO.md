# TODO

## Done
- [x] ~~actually fill out the experience and project files~~ (`resume.md`, `experience.md`, `projects.md` all populated)
- [x] ~~make resume button work~~ (opens `resume.md` rendered + a Download PDF button next to it)
- [x] ~~remove the github repo pull feature~~ (orphaned `useGitHubRepo` + `constants/files.ts` removed; sidebar/mobile-menu GitHub profile links kept)
- [x] ~~render markdown files instead of showing raw source~~ (Preview ↔ Source toggle in the editor for `.md` files, via `react-markdown` + `@tailwindcss/typography`)

## Active
- [ ] Add Clippy somehow. Chatbot?
- [ ] Fix confetti trigger
- [ ] Fix light-mode font color on landing
- [ ] Make nav bar menu do something
- [ ] Redirect to contact.json when user clicks hire-me easter egg
- [ ] Update hire achievement text
- [ ] Add Google Analytics so I can track visitors
- [ ] Make explorer pane scrollable

## Also worth doing
- [ ] Wire a CI workflow so `npm run build:resume` runs on push and commits the regenerated PDF
- [ ] Repo-root `README.md` — GitHub visitors currently see no orientation
- [ ] OG image + social preview tags for linkshares
- [ ] Keyboard shortcut cheat sheet (⌘⇧P, ⌃` for terminal, etc.) shown somewhere — maybe as a ghost hint on the Landing
- [ ] Save/restore open tabs + active file to localStorage so refresh doesn't reset state

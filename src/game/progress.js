//dito nilalagay yung code para i-track yung progress ng player sa game, like kung anong level na ang na-unlock niya

const KEY = "spirit_mansion_progress_v1";

export function getUnlockedLevel() {
  const raw = localStorage.getItem(KEY);
  const n = Number(raw);
  return Number.isFinite(n) && n >= 1 ? n : 1;
}

export function setUnlockedLevel(levelNumber) {
  const current = getUnlockedLevel();
  const next = Math.max(current, levelNumber);
  localStorage.setItem(KEY, String(next));
  return next;
}

export function resetProgress() {
  localStorage.removeItem(KEY);
}

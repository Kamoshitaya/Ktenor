export const THEME_COOKIE = "ktenor-theme";

export type Theme = "dark" | "light";

/** One year — a theme choice should outlive the session. */
export const THEME_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export function persistTheme(theme: Theme) {
  document.cookie = `${THEME_COOKIE}=${theme}; path=/; max-age=${THEME_COOKIE_MAX_AGE}; samesite=lax`;
}

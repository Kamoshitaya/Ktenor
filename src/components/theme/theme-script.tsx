import { THEME_COOKIE } from "@/lib/theme";

/**
 * Runs before paint so the page never flashes the wrong theme, and tags weak
 * devices so the glass can drop its blur before anything renders.
 *
 * Dark is the brand default: a first-time visitor always gets dark, regardless
 * of their OS preference. Only an explicit choice is remembered.
 */
const script = `
(function () {
  try {
    // Dropped before first paint, so scroll reveals can safely start hidden.
    document.documentElement.classList.remove('no-js');

    var m = document.cookie.match(/(?:^|; )${THEME_COOKIE}=([^;]*)/);
    var t = m && m[1] === 'light' ? 'light' : 'dark';
    document.documentElement.dataset.theme = t;
    document.documentElement.style.colorScheme = t;

    var slow =
      (navigator.deviceMemory && navigator.deviceMemory <= 4) ||
      (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) ||
      (navigator.connection && navigator.connection.saveData) ||
      !CSS.supports('backdrop-filter', 'blur(1px)');
    if (slow) document.documentElement.dataset.glass = 'lite';

    // Marked before first paint so a returning visitor never sees the intro
    // flash on its way out.
    if (sessionStorage.getItem('ktenor-intro') === 'done')
      document.documentElement.dataset.intro = 'done';
  } catch (e) {}
})();
`;

export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}

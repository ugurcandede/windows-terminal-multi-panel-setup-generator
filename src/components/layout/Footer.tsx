const REPO_URL = 'https://github.com/ugurcandede/windows-terminal-multi-panel-setup-generator';
const AUTHOR_URL = 'https://github.com/ugurcandede';

const GithubMark = () => (
  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current" aria-hidden="true">
    <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.92.58.11.79-.25.79-.56v-2c-3.2.7-3.87-1.36-3.87-1.36-.53-1.34-1.3-1.7-1.3-1.7-1.06-.72.08-.7.08-.7 1.17.08 1.79 1.2 1.79 1.2 1.04 1.78 2.73 1.27 3.4.97.1-.75.41-1.27.74-1.56-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.2-3.1-.12-.3-.52-1.5.11-3.12 0 0 .98-.31 3.2 1.18a11.07 11.07 0 0 1 5.83 0c2.22-1.49 3.2-1.18 3.2-1.18.63 1.62.23 2.82.12 3.12.74.81 1.2 1.84 1.2 3.1 0 4.42-2.7 5.39-5.27 5.68.42.36.79 1.07.79 2.16v3.2c0 .31.21.68.8.56A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
  </svg>
);

export function Footer() {
  return (
    <footer className="flex items-center justify-between border-t border-zinc-200 px-4 py-2 text-[11px] text-zinc-500 dark:border-zinc-800">
      <div className="flex items-center gap-2">
        <a
          href={AUTHOR_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 hover:text-zinc-900 dark:hover:text-zinc-200"
          aria-label="ugurcandede on GitHub"
        >
          <GithubMark />
          ugurcandede
        </a>
      </div>
      <a
        href={REPO_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="hover:text-zinc-900 dark:hover:text-zinc-200"
      >
        v2 — MIT licensed
      </a>
    </footer>
  );
}

import { FaGithub } from 'react-icons/fa';

function Footer() {
  return (
    <footer className="mt-6 pt-4 border-t border-zinc-900 text-[10px] text-zinc-500 flex flex-col sm:flex-row items-center justify-between gap-3">
      <a
        href="https://github.com/daksshdev/simple-todolist"
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-black/50 px-3 py-1.5 hover:border-zinc-600 hover:text-zinc-200"
      >
        <FaGithub className="h-3.5 w-3.5" aria-hidden="true" />
        <span>View source on GitHub</span>
      </a>
      <div className="text-center sm:text-right">
        <span>
          Made by <span className="text-zinc-300">DaksshDev</span>. Check out{' '}
        </span>
        <a
          href="https://idea-dump.netlify.app/"
          target="_blank"
          rel="noreferrer"
          className="text-zinc-200 underline underline-offset-2 hover:text-white"
        >
          idea.dump
        </a>
      </div>
    </footer>
  );
}

export default Footer;


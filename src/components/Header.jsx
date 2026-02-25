function Header() {
  return (
    <header className="flex flex-col items-center gap-2 pt-2">
      <div className="text-center">
        <h1 className="text-base md:text-lg font-geist font-medium tracking-[0.28em] uppercase text-zinc-200">
          Firelist
        </h1>
        <p className="mt-1 text-[10px] tracking-[0.22em] uppercase text-zinc-600">
          Tiny board for tasks and ideas.
        </p>
      </div>
    </header>
  );
}

export default Header;


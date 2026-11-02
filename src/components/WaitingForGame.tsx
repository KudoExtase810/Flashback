/** Shown in the main window when no game is running. */
const WaitingForGame = () => (
    <section className="frame flex items-center gap-3 animate-pulse bg-card px-4 py-3">
        <span className="size-2 shrink-0 rotate-45  bg-flash motion-reduce:animate-none" />
        <div className="flex flex-col gap-0.5">
            <h2 className="text-[15px] font-semibold">Waiting for a game</h2>
        </div>
    </section>
);

export default WaitingForGame;

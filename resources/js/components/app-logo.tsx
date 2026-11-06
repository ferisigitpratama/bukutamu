
export default function AppLogo() {
    return (
        <>
            <div className="flex aspect-square size-9 items-center justify-center overflow-hidden rounded-md bg-white p-1">
                <img
                    src="/images/logo-itn.png"
                    alt="Logo ITN"
                    className="size-full object-contain"
                />
            </div>

            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="truncate leading-tight font-semibold">
                    Digital Guest Book
                </span>
                <span className="truncate text-xs leading-tight text-sidebar-foreground/70">
                    ITN
                </span>
            </div>
        </>
    );
}

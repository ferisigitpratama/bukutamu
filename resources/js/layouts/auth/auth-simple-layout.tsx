
import { Link } from '@inertiajs/react';
import {
    Network,
    ShieldCheck,
    Wifi,
    Globe,
} from 'lucide-react';

import type { AuthLayoutProps } from '@/types';

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    return (
        <div className="min-h-svh bg-background text-foreground lg:grid lg:grid-cols-2">

            {/* LEFT PANEL */}
            <div className="relative hidden min-h-svh overflow-hidden bg-[#102E50] p-12 text-white lg:flex lg:flex-col lg:justify-between">

                {/* Background Decoration */}
                <div className="absolute -right-32 -top-32 size-[500px] rounded-full border border-white/10" />
                <div className="absolute -right-16 -top-16 size-[350px] rounded-full border border-white/10" />
                <div className="absolute -bottom-40 -left-32 size-[500px] rounded-full bg-blue-500/10 blur-3xl" />

                {/* Brand */}
                <Link
                    href="/"
                    className="relative z-10 flex items-center gap-3"
                >
                    <div className="flex size-12 items-center justify-center overflow-hidden rounded-xl bg-white p-1.5">
                        <img
                            src="/images/logo-itn.png"
                            alt="Logo ITN"
                            className="size-full object-contain"
                        />
                    </div>

                    <div>
                        <h1 className="text-lg font-bold tracking-wide">
                            ITN
                        </h1>
                        <p className="text-xs text-blue-200">
                            Indonesia Trans Network
                        </p>
                    </div>
                </Link>

                {/* Main Content */}
                <div className="relative z-10 max-w-xl">
                    <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-300/20 bg-blue-400/10 px-4 py-2 text-sm text-blue-100">
                        <Network className="size-4" />
                        Digital Guest Book Platform
                    </div>

                    <h2 className="text-4xl font-bold leading-tight tracking-tight xl:text-5xl">
                        Welcome to
                        <span className="mt-2 block text-blue-300">
                            Digital Guest Book ITN
                        </span>
                    </h2>

                    <p className="mt-6 max-w-lg text-base leading-relaxed text-blue-100/80">
                        Sistem pencatatan dan pengelolaan kunjungan
                        tamu PT Indonesia Trans Network secara digital,
                        terintegrasi, dan efisien.
                    </p>

                    {/* Illustration */}
                    <div className="mt-12 rounded-2xl border border-white/10 bg-white/5 p-7 backdrop-blur-sm">
                        <div className="grid grid-cols-3 items-center gap-4">

                            <div className="flex flex-col items-center gap-3">
                                <div className="flex size-16 items-center justify-center rounded-2xl bg-blue-400/15">
                                    <Wifi className="size-8 text-blue-300" />
                                </div>
                                <span className="text-xs text-blue-100">
                                    Connectivity
                                </span>
                            </div>

                            <div className="flex justify-center">
                                <div className="h-px w-full bg-blue-300/40" />
                            </div>

                            <div className="flex flex-col items-center gap-3">
                                <div className="flex size-16 items-center justify-center rounded-2xl bg-blue-400/15">
                                    <ShieldCheck className="size-8 text-blue-300" />
                                </div>
                                <span className="text-xs text-blue-100">
                                    Security
                                </span>
                            </div>
                        </div>

                        <div className="mt-7 border-t border-white/10 pt-5 text-center">
                            <Globe className="mx-auto mb-2 size-5 text-blue-300" />
                            <p className="text-sm font-medium text-white">
                                Connected. Efficient. Reliable.
                            </p>
                            <p className="mt-1 text-xs text-blue-200/70">
                                PT Indonesia Trans Network
                            </p>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="relative z-10 flex items-center justify-between text-xs text-blue-200/70">
                    <span>© {new Date().getFullYear()} PT Indonesia Trans Network</span>
                    <span>Digital Guest Book</span>
                </div>
            </div>

            {/* RIGHT PANEL */}
            <div className="flex min-h-svh flex-col justify-center px-5 py-10 sm:px-10 lg:px-16 xl:px-24">

                {/* Mobile Brand */}
                <div className="mb-10 flex items-center justify-center gap-3 lg:hidden">
                    <div className="flex size-12 items-center justify-center overflow-hidden rounded-xl border border-border bg-card p-1.5">
                        <img
                            src="/images/logo-itn.png"
                            alt="Logo ITN"
                            className="size-full object-contain"
                        />
                    </div>

                    <div>
                        <h1 className="font-bold text-foreground">
                            Digital Guest Book
                        </h1>
                        <p className="text-xs text-muted-foreground">
                            PT Indonesia Trans Network
                        </p>
                    </div>
                </div>

                <div className="mx-auto w-full max-w-md">

                    {/* Login Heading */}
                    <div className="mb-8">
                        <div className="mb-5 hidden size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary lg:flex">
                            <ShieldCheck className="size-7" />
                        </div>

                        <h2 className="text-3xl font-bold tracking-tight">
                            {title}
                        </h2>

                        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                            {description}
                        </p>
                    </div>

                    {/* Login Form */}
                    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
                        {children}
                    </div>

                    {/* Footer */}
                    <div className="mt-8 text-center">
                        <p className="text-xs text-muted-foreground">
                            © {new Date().getFullYear()} PT Indonesia Trans Network.
                            All rights reserved.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

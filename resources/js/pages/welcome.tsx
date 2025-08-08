import { type SharedData } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { ArrowRight, Star, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Welcome to NomiNation">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600"
                    rel="stylesheet"
                />
            </Head>

            <Header />

            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-br from-pink-500/10 via-purple-500/10 to-indigo-500/10">
                <div className="container mx-auto px-4 py-24 grid lg:grid-cols-2 gap-12 items-center">
                    {/* Text */}
                    <div className="text-center lg:text-left">
                        <h1 className="text-4xl lg:text-5xl font-extrabold leading-tight">
              <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent">
                Welcome to NomiNation
              </span>
                            <br />
                            Where Beatmaps Meet Their Destiny
                        </h1>
                        <p className="mt-6 max-w-xl mx-auto lg:mx-0 text-lg text-muted-foreground">
                            Tired of digging through modding threads and messy spreadsheets?
                            <strong> NomiNation</strong> is your hub for organized, team-powered osu! modding queues.
                        </p>
                        <p className="mt-4 max-w-xl mx-auto lg:mx-0 text-lg text-muted-foreground">
                            Whether you’re a <strong>Beatmap Nominator</strong> or an <strong>aspiring mapper</strong>,
                            NomiNation brings structure and style to the modding process.
                        </p>
                        <div className="mt-8 flex justify-center lg:justify-start gap-4">
                            {auth.user === null ? (
                                <Button
                                    asChild
                                    size="lg"
                                    className="bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:opacity-90 transition-all shadow-lg"
                                >
                                    <a href={route('osu_login')}>
                                        Login with osu! account
                                        <ArrowRight className="ml-2 size-4" />
                                    </a>
                                </Button>
                            ) : (
                                <Button
                                    asChild
                                    size="lg"
                                    className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:opacity-90 transition-all shadow-lg"
                                >
                                    <a href={route('dashboard')}>
                                        Jump to dashboard
                                        <ArrowRight className="ml-2 size-4" />
                                    </a>
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* Image */}
                    <div className="relative">
                        <div className="absolute -inset-4 bg-gradient-to-tr from-pink-500/20 to-purple-500/20 blur-3xl rounded-full"></div>
                        <img
                            src="/static/images/banner.png"
                            alt="osu! modding illustration"
                            className="relative"
                        />
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="py-20 bg-muted/30">
                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="grid md:grid-cols-2 gap-10">
                        <FeatureCard
                            icon={<Star className="text-pink-500" size={28} />}
                            title="For Nominators"
                            description="Create and host your own queue with ease. Manage requests, solo or in squads, and streamline your journey to ranking."
                        />
                        <FeatureCard
                            icon={<Users className="text-purple-500" size={28} />}
                            title="For Mappers"
                            description="Browse active queues, pick the ones that fit your map, and submit requests without the chaos."
                        />
                    </div>
                </div>
            </section>

            <Footer />
        </>
    );
}

function Header() {
    return (
        <header className="bg-background/70 backdrop-blur border-b border-border sticky top-0 z-50">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                {/* Logo */}
                <a href="/" className="flex items-center gap-2 font-bold text-lg">
                    <img src="/static/images/logo.jpg" alt="NomiNation logo" className="h-8 w-8" />
                    NomiNation
                </a>
                {/* Donate button */}
                <Button
                    asChild
                    size="sm"
                    className="bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:opacity-90"
                >
                    <a href="https://www.donationalerts.com/r/shmiklak" target="_blank" rel="noopener noreferrer">
                        Donate ❤️
                    </a>
                </Button>
            </div>
        </header>
    );
}

function Footer() {
    return (
        <footer className="bg-muted/30 border-t border-border py-6 mt-20">
            <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
                <p>Built by Shmiklak with love. ❤️</p>
                <div className="flex gap-4">
                    <a
                        href="https://github.com/Shmiklak/NomiNation"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-pink-500 transition-colors flex items-center gap-1"
                    >
                        GitHub
                    </a>
                    <a
                        href="https://discord.gg/rkXpNxpHb2"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-pink-500 transition-colors flex items-center gap-1"
                    >
                        Discord Server
                    </a>
                </div>
            </div>
        </footer>
    );
}

function FeatureCard({
                         icon,
                         title,
                         description,
                     }: {
    icon: React.ReactNode;
    title: string;
    description: string;
}) {
    return (
        <div className="group bg-background border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-all hover:border-pink-500/50">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-pink-500/10 rounded-lg group-hover:scale-110 transition-transform">
                    {icon}
                </div>
                <h3 className="text-lg font-semibold">{title}</h3>
            </div>
            <p className="mt-4 text-muted-foreground">{description}</p>
        </div>
    );
}

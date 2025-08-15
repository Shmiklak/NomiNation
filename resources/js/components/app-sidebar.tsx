import { useState } from "react";
import { usePage } from '@inertiajs/react';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { NavLogin } from '@/components/nav-login';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem
} from '@/components/ui/sidebar';
import { type NavItem, type SharedData } from '@/types';
import { Link } from '@inertiajs/react';
import { Coins, Layers, LayoutGrid, MessagesSquare, UserRound, Sun, X } from 'lucide-react';
import AppLogo from './app-logo';
import AppearanceToggleTab from "@/components/appearance-tabs";

const mainNavItems: NavItem[] = [
    { title: 'Dashboard', url: '/dashboard', icon: LayoutGrid },
    { title: 'My queues', url: '/my-queues', icon: UserRound },
    { title: 'My requests', url: '/my-requests', icon: Layers },
    { title: 'My responses', url: '/my-responses', icon: MessagesSquare }
];

const footerNavItems: NavItem[] = [
    { title: 'Donate', url: 'https://www.donationalerts.com/r/shmiklak', icon: Coins },
    { title: 'Discord', url: 'https://discord.gg/rkXpNxpHb2', icon: MessagesSquare }
];

export function AppSidebar() {
    const { auth } = usePage<SharedData>().props;
    const [showThemeMenu, setShowThemeMenu] = useState(false);

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter className="flex flex-col gap-2">
                <div className="w-full px-1">
                    <button
                        onClick={() => setShowThemeMenu(prev => !prev)}
                        className="flex items-center gap-2 w-full rounded-md p-2 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
                    >
                        {showThemeMenu ? (
                            <X className="h-5 w-5" />
                        ) : (
                            <Sun className="h-5 w-5" />
                        )}
                        <span className="text-sm">Appearance</span>
                    </button>

                    <div
                        className={`overflow-hidden transition-all duration-400 ease-in-out ${
                            showThemeMenu ? "max-h-40 opacity-100 mt-2" : "max-h-0 opacity-0"
                        }`}
                    >
                        <AppearanceToggleTab className="flex flex-col gap-1 w-full" />
                    </div>
                </div>

                <NavFooter items={footerNavItems} className="mt-auto" />
                {auth?.user ? <NavUser /> : <NavLogin />}
            </SidebarFooter>
        </Sidebar>
    );
}

import { usePage } from '@inertiajs/react';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { NavLogin } from '@/components/nav-login'; // твой компонент
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
import { Coins, Layers, LayoutGrid, MessagesSquare, UserRound } from 'lucide-react';
import AppLogo from './app-logo';

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

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                {auth?.user ? <NavUser /> : <NavLogin />}
            </SidebarFooter>
        </Sidebar>
    );
}

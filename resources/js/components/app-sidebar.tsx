import { Link } from '@inertiajs/react';
import {
    LayoutGrid,
    Package,
    Users,
    ShoppingCart,
    Info,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import type { NavItem } from '@/types';

// 1. Cambiamos títulos a UPPERCASE e Italic para el look técnico
const mainNavItems: NavItem[] = [
    {
        title: 'SYSTEM_DASHBOARD',
        href: '/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'SERVICE_LOG',
        href: '/productos',
        icon: Package,
    },
    {
        title: 'CLIENT_BASE',
        href: '/clientes',
        icon: Users,
    },
    {
        title: 'SALES_UNITS',
        href: '/ventas',
        icon: ShoppingCart,
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'VERSION_1.0.0',
        href: '/about',
        icon: Info,
    }
];

export function AppSidebar() {
    const clBlue = "#0000FF";

    return (
        <Sidebar 
            collapsible="icon" 
            variant="inset" 
            className="border-r border-gray-100 bg-white/50 backdrop-blur-xl" // Vidrio esmerilado
        >
            <SidebarHeader className="border-b border-gray-50 pb-4">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch className="hover:opacity-80 transition-opacity">
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent className="mt-4">
                <div className="px-4 py-2">
                    <p className="text-[8px] font-black uppercase tracking-[0.3em] text-gray-400 mb-4 italic">
                        Main_Core_
                    </p>
                    <NavMain items={mainNavItems} />
                </div>
            </SidebarContent>

            <SidebarFooter className="border-t border-gray-50 pt-4">
                <NavFooter items={footerNavItems} className="mt-auto opacity-50 hover:opacity-100 transition-opacity" />
                <div className="mt-2 p-1 rounded-xl border border-dashed border-gray-200">
                    <NavUser />
                </div>
            </SidebarFooter>
        </Sidebar>
    );
}
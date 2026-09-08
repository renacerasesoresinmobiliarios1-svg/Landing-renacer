import { Link } from '@inertiajs/react';
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import type { NavItem } from '@/types';

export function NavMain({ items }: { items: NavItem[] }) {
    const clBlue = "#0000FF";

    return (
        <SidebarGroup>
            {/* Label técnico superior */}
            <SidebarGroupLabel className="text-[8px] font-black uppercase tracking-[0.3em] text-gray-400 italic mb-2">
                MAIN_CORE_SYSTEM
            </SidebarGroupLabel>
            
            <SidebarMenu>
                {items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                            asChild
                            tooltip={item.title}
                            className="group h-10 transition-all duration-200 hover:bg-blue-50/50"
                        >
                            <Link href={item.href} className="flex items-center gap-3">
                                {item.icon && (
                                    <item.icon 
                                        className="h-4 w-4 transition-colors group-hover:text-[#0000FF]" 
                                        style={{ color: 'rgba(0,0,0,0.6)' }}
                                    />
                                )}
                                <span className="text-[10px] font-black uppercase tracking-widest italic transition-colors group-hover:text-[#0000FF] text-gray-700">
                                    {item.title}
                                </span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    );
}
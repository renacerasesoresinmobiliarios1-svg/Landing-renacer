import { Link, usePage } from '@inertiajs/react';
import { BookOpen, Folder, LayoutGrid, Menu, Search } from 'lucide-react';
import AppLogo from '@/components/app-logo';
import AppLogoIcon from '@/components/app-logo-icon';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuList,
    navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { UserMenuContent } from '@/components/user-menu-content';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { useInitials } from '@/hooks/use-initials';
import { cn, toUrl } from '@/lib/utils';
import { dashboard } from '@/routes';
import type { BreadcrumbItem, NavItem } from '@/types';

type Props = {
    breadcrumbs?: BreadcrumbItem[];
};

const clBlue = "#0000FF";

const mainNavItems: NavItem[] = [
    {
        title: 'SYSTEM_DASHBOARD', // Rebranded
        href: dashboard(),
        icon: LayoutGrid,
    },
];

const rightNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: Folder,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];

// Estilo de item activo usando tu azul
const activeItemStyles = `text-[#0000FF] font-black italic`;

export function AppHeader({ breadcrumbs = [] }: Props) {
    const page = usePage();
    const { auth } = page.props;
    const getInitials = useInitials();
    const { isCurrentUrl, whenCurrentUrl } = useCurrentUrl();

    return (
        <>
            <div 
                className="border-b border-gray-100 bg-white/60 backdrop-blur-md relative"
                style={{ 
                    backgroundImage: `
                        linear-gradient(to right, rgba(0, 0, 255, 0.03) 1px, transparent 1px),
                        linear-gradient(to bottom, rgba(0, 0, 255, 0.03) 1px, transparent 1px)
                    `,
                    backgroundSize: '30px 30px'
                }}
            >
                <div className="mx-auto flex h-16 items-center px-4 md:max-w-7xl relative z-10">
                    {/* Mobile Menu */}
                    <div className="lg:hidden">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="mr-2 h-[34px] w-[34px]">
                                    <Menu className="h-5 w-5 text-[#0000FF]" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="bg-white border-r border-gray-100">
                                <SheetTitle className="sr-only">Navigation menu</SheetTitle>
                                <SheetHeader className="flex justify-start text-left border-b border-gray-50 pb-4">
                                    <AppLogoIcon className="h-6 w-6 fill-current text-[#0000FF]" />
                                </SheetHeader>
                                <div className="flex h-full flex-1 flex-col space-y-6 p-6">
                                    <div className="flex flex-col space-y-4">
                                        <p className="text-[8px] font-black uppercase tracking-widest text-gray-400 italic">CORE_NAV</p>
                                        {mainNavItems.map((item) => (
                                            <Link key={item.title} href={item.href} className="flex items-center space-x-3 text-[10px] font-black uppercase italic hover:text-[#0000FF]">
                                                {item.icon && <item.icon className="h-4 w-4" />}
                                                <span>{item.title}</span>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>

                    <Link href={dashboard()} prefetch className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
                        <AppLogo />
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="ml-6 hidden h-full items-center space-x-6 lg:flex">
                        <NavigationMenu className="flex h-full items-stretch">
                            <NavigationMenuList className="flex h-full items-stretch space-x-2">
                                {mainNavItems.map((item, index) => (
                                    <NavigationMenuItem key={index} className="relative flex h-full items-center">
                                        <Link
                                            href={item.href}
                                            className={cn(
                                                navigationMenuTriggerStyle(),
                                                whenCurrentUrl(item.href, activeItemStyles),
                                                'h-9 cursor-pointer px-3 text-[10px] font-bold uppercase tracking-wider bg-transparent hover:bg-blue-50/50 transition-all'
                                            )}
                                        >
                                            {item.icon && <item.icon className="mr-2 h-4 w-4 opacity-50" />}
                                            {item.title}
                                        </Link>
                                        {isCurrentUrl(item.href) && (
                                            <div className="absolute bottom-0 left-0 h-0.5 w-full bg-[#0000FF]"></div>
                                        )}
                                    </NavigationMenuItem>
                                ))}
                            </NavigationMenuList>
                        </NavigationMenu>
                    </div>

                    <div className="ml-auto flex items-center space-x-2">
                        {/* Status Badge - Toque de Laboratorio */}
                        <div className="hidden sm:flex items-center gap-2 px-3 py-1 mr-4 rounded-full border border-blue-50 bg-blue-50/30">
                            <div className="size-1.5 rounded-full animate-pulse bg-[#0000FF]" />
                            <span className="text-[8px] font-black uppercase italic text-[#0000FF]">UNIT_01_CONNECTED</span>
                        </div>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="size-10 rounded-full p-1 border border-gray-100 bg-white shadow-sm">
                                    <Avatar className="size-8 overflow-hidden rounded-full">
                                        <AvatarImage src={auth.user.avatar} alt={auth.user.name} />
                                        <AvatarFallback className="rounded-lg bg-blue-50 text-[#0000FF] font-black">
                                            {getInitials(auth.user.name)}
                                        </AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56 rounded-2xl border-gray-100 shadow-xl" align="end">
                                <UserMenuContent user={auth.user} />
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </div>

            {/* Breadcrumbs Section */}
            {breadcrumbs.length > 1 && (
                <div className="flex w-full border-b border-gray-50 bg-white/40">
                    <div className="mx-auto flex h-10 w-full items-center justify-start px-4 text-[9px] font-bold uppercase tracking-tighter md:max-w-7xl italic text-gray-400">
                        <Breadcrumbs breadcrumbs={breadcrumbs} />
                    </div>
                </div>
            )}
        </>
    );
}
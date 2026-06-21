'use client';
import React from 'react';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { MenuToggleIcon } from '@/components/ui/menu-toggle-icon';
import { createPortal } from 'react-dom';
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import {
    UsersIcon as Users,
    MailIcon as Mail,
    BarChartIcon as BarChart3,
    EyeIcon as Eye,
    FunnelIcon as Funnel,
    LockIcon as Lock,
    EyeOffIcon as EyeOff,
    BookOpenIcon as BookOpen,
} from '@ciphera-net/facet';
import {
    Shield,
    ShieldCheck,
    FileText,
    Leaf,
    Question as HelpCircle,
    PaperPlaneTilt as Send,
    Fingerprint,
    Scan as ScanLine,
    PuzzlePiece as Puzzle,
    Pulse as Activity,
    HardDrives as Server,
    PlugsConnected as Cable,
} from '@phosphor-icons/react/dist/ssr';
import Image from 'next/image';
import { track } from '@/lib/pulse';
import { pulseIcon, authIcon, captchaIcon, relayIcon, cipheraIcon } from '@/lib/images';

type IconType = React.ComponentType<{ className?: string }>;

type LinkItem = {
    title: string;
    href: string;
    icon?: IconType;
    image?: string;
    description?: string;
};

const productBranding: Record<string, { logo: string; name: string; signIn?: string; signUp?: string }> = {
    '/products/pulse': { logo: pulseIcon, name: 'Pulse', signIn: 'https://pulse.ciphera.net/login', signUp: 'https://pulse.ciphera.net/signup' },
    '/products/id': { logo: authIcon, name: 'Ciphera ID' },
    '/products/captcha': { logo: captchaIcon, name: 'Ciphera Captcha' },
    '/products/relay': { logo: relayIcon, name: 'Ciphera Relay' },
};

type FeatureLink = { title: string; href: string; icon: IconType; description: string };

const productFeatures: Record<string, FeatureLink[]> = {
    '/products/pulse': [
        { title: 'Dashboard', href: '#dashboard', icon: BarChart3, description: 'Real-time traffic overview' },
        { title: 'Visitor Insights', href: '#visitors', icon: Eye, description: 'Browser, device & geo data' },
        { title: 'Conversion Funnels', href: '#funnels', icon: Funnel, description: 'Multi-step drop-off analysis' },
        { title: 'Email Reports', href: '#reports', icon: Send, description: 'Scheduled inbox summaries' },
    ],
    '/products/id': [
        { title: 'Double Hashing', href: '#double-hashing', icon: Lock, description: 'PBKDF2 + Argon2id' },
        { title: 'Passkeys & 2FA', href: '#passkeys', icon: Fingerprint, description: 'WebAuthn, TOTP & recovery' },
        { title: 'Unified Login', href: '#oauth', icon: ScanLine, description: 'OAuth 2.0 with PKCE' },
        { title: 'Security Dashboard', href: '#security', icon: ShieldCheck, description: 'Audit log & device trust' },
    ],
    '/products/captcha': [
        { title: 'Proof-of-Work', href: '#proof-of-work', icon: Activity, description: 'Invisible adaptive challenges' },
        { title: 'Puzzle Challenge', href: '#puzzle', icon: Puzzle, description: 'Spatial verification' },
        { title: 'Risk Scoring', href: '#risk-scoring', icon: ShieldCheck, description: '5-signal confidence score' },
        { title: 'Stateless Architecture', href: '#stateless', icon: Server, description: 'HMAC-signed, no database' },
    ],
    '/products/relay': [
        { title: 'Security Alerts', href: '#alerts', icon: Mail, description: 'Critical emails, fast delivery' },
        { title: 'Authentication', href: '#authentication', icon: ShieldCheck, description: 'DKIM, SPF & DMARC' },
        { title: 'No Tracking', href: '#privacy-design', icon: EyeOff, description: 'Zero pixels, zero profiling' },
        { title: 'Integration', href: '#integration', icon: Cable, description: 'Standard SMTP, any language' },
    ],
};

export function Header() {
    const [open, setOpen] = React.useState(false);
    const scrolled = useScroll(10);
    const pathname = usePathname();
    const branding = productBranding[pathname];
    const features = productFeatures[pathname];

    React.useEffect(() => {
        if (open) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [open]);

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border">
            <div className={cn("absolute inset-0 -z-10 transition-opacity duration-300", scrolled ? "opacity-100 bg-background/95" : "opacity-0")} />
            {/* Same column as the page rails (max-w-6xl + sm:border-x) so the
                vertical lines run continuously from header through every section. */}
            {/* py-3 (not my-3 on the nav): a child margin would collapse through
                this borderless-top wrapper and shrink the rail borders to the nav
                row only, leaving gaps above and below. Padding keeps the rails
                spanning the full header height. */}
            <div className="mx-auto w-full max-w-6xl py-3 sm:border-x sm:border-border">
            <nav className="flex h-16 w-full items-center justify-between px-6">
                <div className="flex items-center gap-5">
                    <a href={branding ? pathname : "/"} className="hover:bg-accent p-2 -ml-2 flex items-center gap-2">
                        <Image
                            src={branding?.logo || cipheraIcon}
                            alt={branding?.name || "Ciphera"}
                            width={36}
                            height={36}
                            priority
                            className={cn("object-contain", branding ? "w-8 h-8" : "")}
                            unoptimized
                        />
                        <span className="text-xl font-bold text-foreground tracking-tight">
                            {branding?.name || "Ciphera"}
                        </span>
                    </a>
                    <NavigationMenu className="hidden md:flex">
                        <NavigationMenuList>
                            {features && (
                                <NavigationMenuItem>
                                    <NavigationMenuTrigger className="bg-transparent">Features</NavigationMenuTrigger>
                                    <NavigationMenuContent className="bg-transparent p-1 pr-1.5">
                                        <ul className="grid w-[32rem] grid-cols-2 gap-2 border border-border bg-card p-2">
                                            {features.map((item, i) => (
                                                <li key={i}>
                                                    <ListItem title={item.title} href={item.href} icon={item.icon} description={item.description} />
                                                </li>
                                            ))}
                                        </ul>
                                    </NavigationMenuContent>
                                </NavigationMenuItem>
                            )}
                            <NavigationMenuItem>
                                <NavigationMenuTrigger className="bg-transparent">{features ? 'All Products' : 'Products'}</NavigationMenuTrigger>
                                <NavigationMenuContent className="bg-transparent p-1 pr-1.5">
                                    <ul className="grid w-[32rem] grid-cols-2 gap-2 border border-border bg-card p-2">
                                        {productLinks.map((item, i) => (
                                            <li key={i}>
                                                <ListItem {...item} />
                                            </li>
                                        ))}
                                    </ul>
                                    <div className="p-2">
                                        <p className="text-muted-foreground text-sm">
                                            Interested?{' '}
                                            <a href="/contact" className="text-foreground font-medium hover:underline">
                                                Get in touch
                                            </a>
                                        </p>
                                    </div>
                                </NavigationMenuContent>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <NavigationMenuTrigger className="bg-transparent">Company</NavigationMenuTrigger>
                                <NavigationMenuContent className="bg-transparent p-1 pr-1.5 pb-1.5">
                                    <div className="grid w-[32rem] grid-cols-2 gap-2">
                                        <ul className="space-y-2 border border-border bg-card p-2">
                                            {companyLinks.map((item, i) => (
                                                <li key={i}>
                                                    <ListItem {...item} />
                                                </li>
                                            ))}
                                        </ul>
                                        <ul className="space-y-2 p-3">
                                            {companyLinks2.map((item, i) => (
                                                <li key={i}>
                                                    <NavigationMenuLink
                                                        href={item.href}
                                                        className="flex p-2 hover:bg-accent flex-row items-center gap-x-2 transition-colors"
                                                    >
                                                        {item.icon && <item.icon className="text-foreground size-4" />}
                                                        <span className="text-sm font-medium">{item.title}</span>
                                                    </NavigationMenuLink>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </NavigationMenuContent>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <NavigationMenuTrigger className="bg-transparent">Resources & Support</NavigationMenuTrigger>
                                <NavigationMenuContent className="bg-transparent p-1 pr-1.5 pb-1.5">
                                    <div className="grid w-[32rem] grid-cols-2 gap-2">
                                        <ul className="space-y-2 border border-border bg-card p-2">
                                            {resourcesLinks.map((item, i) => (
                                                <li key={i}>
                                                    <ListItem {...item} />
                                                </li>
                                            ))}
                                        </ul>
                                        <div className="flex flex-col justify-center gap-3 p-4">
                                            <p className="text-sm font-medium text-foreground">Need help?</p>
                                            <p className="text-xs text-muted-foreground leading-relaxed">
                                                Questions about our privacy tools, security concerns, or partnership inquiries — we typically respond within 24-48 hours.
                                            </p>
                                            <a href="mailto:hello@ciphera.net" className="text-sm font-medium text-primary hover:underline">
                                                hello@ciphera.net →
                                            </a>
                                        </div>
                                    </div>
                                </NavigationMenuContent>
                            </NavigationMenuItem>
                        </NavigationMenuList>
                    </NavigationMenu>
                </div>
                <div className="hidden items-center gap-2 md:flex">
                    <Button variant="outline" asChild>
                        <a href={branding?.signIn || "https://id.ciphera.net"} onClick={() => track('header_sign_in')}>Sign In</a>
                    </Button>
                    <Button asChild>
                        <a href={branding?.signUp || "https://id.ciphera.net/signup"} onClick={() => track('header_cta_get_started')}>Get Started</a>
                    </Button>
                </div>
                <div className="flex items-center gap-2 md:hidden">
                    <Button
                        size="icon"
                        variant="outline"
                        onClick={() => setOpen(!open)}
                        aria-expanded={open}
                        aria-controls="mobile-menu"
                        aria-label="Toggle menu"
                    >
                        <MenuToggleIcon open={open} className="size-5" duration={300} />
                    </Button>
                </div>
            </nav>
            </div>
            <MobileMenu open={open} className="flex flex-col justify-between gap-2 overflow-y-auto">
                <NavigationMenu className="max-w-full">
                    <div className="flex w-full flex-col gap-y-2">
                        {features && (
                            <>
                                <span className="text-sm">Features</span>
                                {features.map((link) => (
                                    <ListItem key={link.title} title={link.title} href={link.href} icon={link.icon} description={link.description} />
                                ))}
                            </>
                        )}
                        <span className="text-sm">{features ? 'All Products' : 'Products'}</span>
                        {productLinks.map((link) => (
                            <ListItem key={link.title} {...link} />
                        ))}
                        <span className="text-sm">Company</span>
                        {companyLinks.map((link) => (
                            <ListItem key={link.title} {...link} />
                        ))}
                        {companyLinks2.map((link) => (
                            <ListItem key={link.title} {...link} />
                        ))}
                        <span className="text-sm">Resources & Support</span>
                        {resourcesLinks.map((link) => (
                            <ListItem key={link.title} {...link} />
                        ))}
                    </div>
                </NavigationMenu>
                <div className="flex flex-col gap-2">
                    <Button variant="outline" className="w-full bg-transparent" asChild>
                        <a href={branding?.signIn || "https://id.ciphera.net"} onClick={() => track('header_sign_in_mobile')}>
                            Sign In
                        </a>
                    </Button>
                    <Button className="w-full" asChild>
                        <a href={branding?.signUp || "https://id.ciphera.net/signup"} onClick={() => track('header_cta_get_started_mobile')}>
                            Get Started
                        </a>
                    </Button>
                </div>
            </MobileMenu>
        </header>
    );
}

type MobileMenuProps = React.ComponentProps<'div'> & {
    open: boolean;
};

function MobileMenu({ open, children, className, ...props }: MobileMenuProps) {
    if (!open || typeof window === 'undefined') return null;

    return createPortal(
        <div
            id="mobile-menu"
            className={cn(
                'bg-background',
                'fixed top-16 right-0 bottom-0 left-0 z-40 flex flex-col overflow-hidden border-y md:hidden',
            )}
        >
            <div
                data-slot={open ? 'open' : 'closed'}
                className={cn(
                    'data-[slot=open]:animate-in data-[slot=open]:zoom-in-95 ease-out',
                    'size-full p-4',
                    className,
                )}
                {...props}
            >
                {children}
            </div>
        </div>,
        document.body,
    );
}

function ListItem({
    title,
    description,
    icon: Icon,
    image,
    className,
    href,
    ...props
}: React.ComponentProps<typeof NavigationMenuLink> & LinkItem) {
    return (
        <NavigationMenuLink className={cn('w-full flex flex-row gap-x-2 data-[active=true]:focus:bg-accent data-[active=true]:hover:bg-accent data-[active=true]:text-accent-foreground hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground p-2 transition-colors', className)} {...props} asChild>
            <a href={href}>
                <div className="flex aspect-square size-12 items-center justify-center border border-border bg-card p-2">
                    {image ? (
                        <Image src={image} alt={title} width={32} height={32} className="object-contain max-w-8 max-h-8" unoptimized />
                    ) : Icon ? (
                        <Icon className="text-foreground size-5" />
                    ) : null}
                </div>
                <div className="flex flex-col items-start justify-center">
                    <span className="text-sm font-medium">{title}</span>
                    <span className="text-muted-foreground text-xs">{description}</span>
                </div>
            </a>
        </NavigationMenuLink>
    );
}

const productLinks: LinkItem[] = [
    {
        title: 'Pulse',
        href: '/products/pulse',
        description: 'Privacy-first web analytics',
        image: pulseIcon,
    },
    {
        title: 'Ciphera ID',
        href: '/products/id',
        description: 'Zero-knowledge identity provider',
        image: authIcon,
    },
    {
        title: 'Ciphera Captcha',
        href: '/products/captcha',
        description: 'Privacy-respecting bot protection',
        image: captchaIcon,
    },
    {
        title: 'Ciphera Relay',
        href: '/products/relay',
        description: 'Secure email infrastructure',
        image: relayIcon,
    },
];

const companyLinks: LinkItem[] = [
    {
        title: 'About Us',
        href: '/about',
        description: 'Our mission for a more private internet',
        icon: Users,
    },
    {
        title: 'Sustainability',
        href: '/sustainability',
        description: '100% renewable Swiss hosting — see the real numbers',
        icon: Leaf,
    },
];

const companyLinks2: LinkItem[] = [
    {
        title: 'Terms of Service',
        href: '/terms',
        icon: FileText,
    },
    {
        title: 'Privacy Policy',
        href: '/privacy',
        icon: Shield,
    },
];

const resourcesLinks: LinkItem[] = [
    {
        title: 'Blog',
        href: '/blog',
        description: 'Privacy & security insights',
        icon: Leaf,
    },
    {
        title: 'Learn',
        href: '/learn',
        description: 'Guides & references for Ciphera products',
        icon: BookOpen,
    },
    {
        title: 'Contact',
        href: '/contact',
        description: 'Get in touch with our team',
        icon: Mail,
    },
    {
        title: 'Help Center',
        href: '/contact',
        description: 'Guides and support',
        icon: HelpCircle,
    },
];


function useScroll(threshold: number) {
    const [scrolled, setScrolled] = React.useState(false);

    const onScroll = React.useCallback(() => {
        setScrolled(window.scrollY > threshold);
    }, [threshold]);

    React.useEffect(() => {
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, [onScroll]);

    // also check on first load
    React.useEffect(() => {
        onScroll();
    }, [onScroll]);

    return scrolled;
}

'use client';
import React from 'react';
import type { ComponentProps, ReactNode } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { GithubIcon } from '@ciphera-net/facet';
import Image from 'next/image';
import { cipheraIcon } from '@/lib/images';

interface FooterLink {
    title: string;
    href: string;
    external?: boolean;
    icon?: React.ComponentType<{ className?: string }>;
}

interface FooterSection {
    label: string;
    links: FooterLink[];
}

const footerLinks: FooterSection[] = [
    {
        label: 'Products',
        links: [
            { title: 'Pulse', href: '/products/pulse' },
            { title: 'Ciphera ID', href: '/products/id' },
            { title: 'Ciphera Captcha', href: '/products/captcha' },
            { title: 'Ciphera Relay', href: '/products/relay' },
        ],
    },
    {
        label: 'Company',
        links: [
            { title: 'About', href: '/about' },
            { title: 'Contact', href: '/contact' },
            { title: 'Blog', href: '/blog' },
        ],
    },
    {
        label: 'Legal',
        links: [
            { title: 'Privacy Policy', href: '/privacy' },
            { title: 'Terms of Service', href: '/terms' },
        ],
    },
    {
        label: 'Social',
        links: [
            { title: 'GitHub', href: 'https://github.com/ciphera-net', external: true, icon: GithubIcon },
        ],
    },
];

export function Footer() {
    return (
        <footer className="md:rounded-t-6xl relative w-full max-w-6xl mx-auto flex flex-col items-center justify-center rounded-t-4xl border-t bg-[radial-gradient(35%_128px_at_50%_0%,theme(backgroundColor.white/8%),transparent)] px-6 py-12 lg:py-16">
            <div className="bg-foreground/20 absolute top-0 right-1/2 left-1/2 h-px w-1/3 -translate-x-1/2 -translate-y-1/2 rounded-full blur" />

            <div className="grid w-full gap-8 xl:grid-cols-3 xl:gap-8">
                <AnimatedContainer className="space-y-4">
                    <a href="/" className="flex items-center gap-2">
                        <Image
                            src={cipheraIcon}
                            alt="Ciphera"
                            width={32}
                            height={32}
                            className="object-contain"
                            unoptimized
                        />
                        <span className="text-lg font-bold text-foreground tracking-tight">
                            Ciphera
                        </span>
                    </a>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                        Privacy-first infrastructure and applications built on zero-knowledge principles.
                    </p>
                    <p className="text-muted-foreground mt-8 text-sm md:mt-0">
                        © 2024-{new Date().getFullYear()} Ciphera. All rights reserved.
                    </p>
                </AnimatedContainer>

                <div className="mt-10 grid grid-cols-2 gap-8 md:grid-cols-4 xl:col-span-2 xl:mt-0">
                    {footerLinks.map((section, index) => (
                        <AnimatedContainer key={section.label} delay={0.1 + index * 0.1}>
                            <div className="mb-10 md:mb-0">
                                <h3 className="text-xs">{section.label}</h3>
                                <ul className="text-muted-foreground mt-4 space-y-2 text-sm">
                                    {section.links.map((link) => (
                                        <li key={link.title}>
                                            <a
                                                href={link.href}
                                                {...(link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                                                className="hover:text-foreground inline-flex items-center transition-all duration-300"
                                            >
                                                {link.icon && <link.icon className="me-1 size-4" />}
                                                {link.title}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </AnimatedContainer>
                    ))}
                </div>
            </div>
        </footer>
    );
}

type ViewAnimationProps = {
    delay?: number;
    className?: ComponentProps<typeof motion.div>['className'];
    children: ReactNode;
};

function AnimatedContainer({ className, delay = 0.1, children }: ViewAnimationProps) {
    const shouldReduceMotion = useReducedMotion();

    if (shouldReduceMotion) {
        return children;
    }

    return (
        <motion.div
            initial={{ filter: 'blur(4px)', translateY: -8, opacity: 0 }}
            whileInView={{ filter: 'blur(0px)', translateY: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay, duration: 0.8 }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface GlassCardProps {
    children: ReactNode;
    className?: string;
}

export const GlassCard = ({ children, className }: GlassCardProps) => {
    return (
        <div
            className={cn(
                "relative overflow-hidden rounded-xl border border-white/10 bg-black/20 backdrop-blur-md shadow-xl",
                "before:absolute before:inset-0 before:-z-10 before:bg-gradient-to-br before:from-white/5 before:to-transparent",
                className
            )}
        >
            {children}
        </div>
    );
};

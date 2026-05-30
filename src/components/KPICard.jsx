import React, { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown, Minus, Activity } from 'lucide-react'

/**
 * KPICard Component - Light Mode
 * 
 * Real-time KPI display with pulse animation indicating live data.
 * Features glassmorphism container, animated pulse ring, and trend indicators.
 * 
 * @param {string} title - KPI label text
 * @param {string|number} value - Primary metric value
 * @param {string} unit - Unit suffix (MW, %, MWh, etc.)
 * @param {number} trend - Percentage change (+/- value)
 * @param {'up'|'down'|'stable'} trendDirection - Trend indicator direction
 * @param {string} icon - Lucide icon component
 * @param {boolean} isLive - Shows pulse animation when true
 * @param {string} color - Accent color theme (green, emerald, blue)
 */
export default function KPICard({
    title = 'Metric',
    value = '0',
    unit = '',
    trend = 0,
    trendDirection = 'stable',
    icon: IconComponent = Activity,
    isLive = true,
    color = 'green',
    subtitle = '',
    className = '',
}) {
    // Simulated real-time pulse effect
    const [pulseScale, setPulseScale] = useState(1)

    useEffect(() => {
        if (!isLive) return

        const interval = setInterval(() => {
            setPulseScale(1.1)
            setTimeout(() => setPulseScale(1), 150)
        }, 2000)

        return () => clearInterval(interval)
    }, [isLive])

    const colorVariants = {
        green: {
            border: 'border-sun-green-500/30 hover:border-sun-green-400/50',
            glow: 'shadow-glow-green',
            icon: 'text-sun-green-300',
            iconBg: 'bg-sun-green-500/15 ring-1 ring-sun-green-400/20',
            pulse: 'bg-sun-green-400',
            trend: {
                up: 'text-emerald-400',
                down: 'text-rose-400',
                stable: 'text-surface-600',
            }
        },
        amber: {
            border: 'border-sun-amber-400/30 hover:border-sun-amber-300/50',
            glow: 'shadow-glow-amber',
            icon: 'text-sun-amber-300',
            iconBg: 'bg-sun-amber-500/15 ring-1 ring-sun-amber-400/20',
            pulse: 'bg-sun-amber-400',
            trend: {
                up: 'text-emerald-400',
                down: 'text-rose-400',
                stable: 'text-surface-600',
            }
        },
        emerald: {
            border: 'border-emerald-400/30 hover:border-emerald-300/50',
            glow: 'shadow-glow-healthy',
            icon: 'text-emerald-300',
            iconBg: 'bg-emerald-500/15 ring-1 ring-emerald-400/20',
            pulse: 'bg-emerald-400',
            trend: {
                up: 'text-emerald-400',
                down: 'text-rose-400',
                stable: 'text-surface-600',
            }
        },
        blue: {
            border: 'border-blue-400/30 hover:border-blue-300/50',
            glow: 'shadow-[0_0_20px_rgba(34,211,238,0.2)]',
            icon: 'text-blue-300',
            iconBg: 'bg-blue-500/15 ring-1 ring-blue-400/20',
            pulse: 'bg-blue-400',
            trend: {
                up: 'text-emerald-400',
                down: 'text-rose-400',
                stable: 'text-surface-600',
            }
        }
    }

    const colors = colorVariants[color] || colorVariants.green

    const TrendIcon = {
        up: TrendingUp,
        down: TrendingDown,
        stable: Minus,
    }[trendDirection]

    return (
        <div
            className={`
        glass-card p-6 
        ${colors.border}
        group cursor-pointer
        ${className}
      `}
        >
            {/* Header Row */}
            <div className="flex items-start justify-between mb-4">
                {/* Icon Container with Pulse */}
                <div className="relative">
                    <div
                        className={`
              w-12 h-12 rounded-xl 
              ${colors.iconBg}
              flex items-center justify-center
              transition-transform duration-150
            `}
                        style={{ transform: `scale(${pulseScale})` }}
                    >
                        <IconComponent className={`w-6 h-6 ${colors.icon}`} />
                    </div>

                    {/* Live Pulse Ring */}
                    {isLive && (
                        <div className="absolute -inset-1">
                            <div
                                className={`
                  absolute inset-0 rounded-xl 
                  ${colors.pulse} opacity-15
                  animate-ping
                `}
                                style={{ animationDuration: '2s' }}
                            />
                        </div>
                    )}
                </div>

                {/* Live Indicator */}
                {isLive && (
                    <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-emerald-500/10 border border-emerald-400/30">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-[10px] font-semibold text-emerald-300 uppercase tracking-wider">
                            Live
                        </span>
                    </div>
                )}
            </div>

            {/* Value Display */}
            <div className="mb-2">
                <div className="flex items-baseline gap-1">
                    <span
                        className="text-3xl font-bold text-surface-950 tracking-tight"
                        style={{ fontVariantNumeric: 'tabular-nums' }}
                    >
                        {value}
                    </span>
                    {unit && (
                        <span className="text-lg font-medium text-surface-700">
                            {unit}
                        </span>
                    )}
                </div>
            </div>

            {/* Title */}
            <p className="text-sm text-surface-700 font-medium mb-3">
                {title}
            </p>

            {/* Trend Indicator */}
            {trend !== 0 && (
                <div className={`
          flex items-center gap-1 text-sm font-medium
          ${colors.trend[trendDirection]}
        `}>
                    <TrendIcon className="w-4 h-4" />
                    <span>
                        {trendDirection === 'up' ? '+' : ''}{trend}%
                    </span>
                    <span className="text-surface-500 ml-1">vs last hour</span>
                </div>
            )}

            {/* Subtitle */}
            {subtitle && (
                <p className="text-xs text-surface-500 mt-2">
                    {subtitle}
                </p>
            )}

            {/* Bottom Glow Line */}
            <div
                className={`
          absolute bottom-0 left-6 right-6 h-px
          bg-gradient-to-r from-transparent ${colors.icon.replace('text-', 'via-')}/20 to-transparent
          opacity-0 group-hover:opacity-100 transition-opacity duration-300
        `}
            />
        </div>
    )
}

/**
 * KPICardSkeleton - Loading state for KPI cards (Light Mode)
 */
export function KPICardSkeleton({ className = '' }) {
    return (
        <div className={`glass-card p-6 shimmer ${className}`}>
            <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-surface-200 animate-pulse" />
                <div className="w-12 h-5 rounded-full bg-surface-200 animate-pulse" />
            </div>
            <div className="h-9 w-24 bg-surface-200 rounded animate-pulse mb-2" />
            <div className="h-4 w-20 bg-surface-200 rounded animate-pulse mb-3" />
            <div className="h-4 w-32 bg-surface-200 rounded animate-pulse" />
        </div>
    )
}

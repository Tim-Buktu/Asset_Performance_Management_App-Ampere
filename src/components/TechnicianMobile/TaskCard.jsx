import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Clock,
    AlertTriangle,
    MapPin,
    Wrench,
    ChevronRight,
    User,
    Star,
    Phone,
    Zap
} from 'lucide-react'

/**
 * TaskCard - Mobile-optimized work order card with SLA countdown
 * 
 * Features:
 * - Circular SLA countdown timer with visual urgency
 * - High-contrast "At Risk" state (red pulse when SLA < 30min)
 * - Assigned O&M vendor badge
 * - Touch-friendly for mobile interaction
 */
export default function TaskCard({
    ticket,
    onSelect,
    isSelected = false,
    className = ''
}) {
    const [timeRemaining, setTimeRemaining] = useState({ minutes: 0, seconds: 0, total: 0 })
    const [isAtRisk, setIsAtRisk] = useState(false)
    const [isBreached, setIsBreached] = useState(false)

    // Update countdown timer
    useEffect(() => {
        const updateTimer = () => {
            const now = new Date()
            const deadline = new Date(ticket.slaDeadline)
            const diff = deadline - now

            if (diff <= 0) {
                setIsBreached(true)
                setIsAtRisk(false)
                setTimeRemaining({ minutes: 0, seconds: 0, total: 0 })
                return
            }

            const totalMinutes = Math.floor(diff / 1000 / 60)
            const minutes = Math.floor(diff / 1000 / 60)
            const seconds = Math.floor((diff / 1000) % 60)

            setTimeRemaining({ minutes, seconds, total: totalMinutes })
            setIsAtRisk(totalMinutes < 30)
            setIsBreached(false)
        }

        updateTimer()
        const interval = setInterval(updateTimer, 1000)
        return () => clearInterval(interval)
    }, [ticket.slaDeadline])

    // Calculate progress for circular indicator
    const progressPercent = Math.max(0, Math.min(100, (timeRemaining.total / ticket.slaMinutes) * 100))
    const circumference = 2 * Math.PI * 36
    const strokeDashoffset = circumference - (progressPercent / 100) * circumference

    // Determine status colors
    const getStatusColors = () => {
        if (isBreached) {
            return {
                bg: 'bg-rose-500/10',
                border: 'border-rose-500/50',
                text: 'text-rose-400',
                glow: 'shadow-[0_0_20px_rgba(244,63,94,0.4)]',
                stroke: '#FDA4AF',
                pulse: true
            }
        }
        if (isAtRisk) {
            return {
                bg: 'bg-amber-500/10',
                border: 'border-amber-500/50',
                text: 'text-amber-400',
                glow: 'shadow-[0_0_20px_rgba(245,158,11,0.4)]',
                stroke: '#22D3EE',
                pulse: true
            }
        }
        return {
            bg: 'bg-emerald-500/10',
            border: 'border-emerald-500/30',
            text: 'text-emerald-400',
            glow: '',
            stroke: '#818CF8',
            pulse: false
        }
    }

    const colors = getStatusColors()

    const severityBadge = {
        critical: { bg: 'bg-rose-500/20', text: 'text-rose-400', label: 'CRITICAL' },
        warning: { bg: 'bg-amber-500/20', text: 'text-amber-400', label: 'WARNING' },
        normal: { bg: 'bg-emerald-500/20', text: 'text-emerald-400', label: 'NORMAL' }
    }

    const badge = severityBadge[ticket.severity] || severityBadge.normal

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect?.(ticket)}
            className={`
                relative overflow-hidden rounded-2xl
                bg-surface-200/60 backdrop-blur-xl
                border ${colors.border}
                ${colors.glow}
                transition-all duration-300
                cursor-pointer active:bg-surface-200/80
                ${isSelected ? 'ring-2 ring-sun-amber-500' : ''}
                ${className}
            `}
        >
            {/* Pulse overlay for at-risk state */}
            {colors.pulse && (
                <motion.div
                    className={`absolute inset-0 ${colors.bg} pointer-events-none`}
                    animate={{ opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 1, repeat: Infinity }}
                />
            )}

            <div className="relative p-4">
                {/* Header: Priority & Severity */}
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${badge.bg} ${badge.text}`}>
                            {badge.label}
                        </span>
                        <span className="text-xs text-surface-500 font-mono">
                            {ticket.id}
                        </span>
                    </div>

                    {/* SLA Timer Circle */}
                    <div className="relative w-16 h-16">
                        <svg className="w-16 h-16 -rotate-90" viewBox="0 0 80 80">
                            {/* Background circle */}
                            <circle
                                cx="40"
                                cy="40"
                                r="36"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="4"
                                className="text-carbon-800"
                            />
                            {/* Progress circle */}
                            <motion.circle
                                cx="40"
                                cy="40"
                                r="36"
                                fill="none"
                                stroke={colors.stroke}
                                strokeWidth="4"
                                strokeLinecap="round"
                                strokeDasharray={circumference}
                                strokeDashoffset={strokeDashoffset}
                                animate={{ strokeDashoffset }}
                                transition={{ duration: 0.5 }}
                            />
                        </svg>
                        {/* Timer text */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className={`text-sm font-bold font-mono ${colors.text}`}>
                                {isBreached ? 'SLA' : timeRemaining.minutes}
                            </span>
                            <span className="text-[8px] text-surface-500 uppercase">
                                {isBreached ? 'BREACH' : 'min'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Issue Info */}
                <div className="mb-4">
                    <h3 className="text-base font-semibold text-surface-900 mb-1 flex items-center gap-2">
                        <Zap className={`w-4 h-4 ${colors.text}`} />
                        {ticket.issueType}
                    </h3>
                    <p className="text-sm text-surface-600">{ticket.description}</p>
                </div>

                {/* Asset & Location */}
                <div className="flex items-center gap-4 mb-4 text-xs text-surface-500">
                    <div className="flex items-center gap-1">
                        <Wrench className="w-3 h-3" />
                        <span>{ticket.assetName}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        <span>{ticket.location}</span>
                    </div>
                </div>

                {/* Assigned Vendor */}
                <div className="p-3 rounded-xl bg-surface-200/50 border border-surface-300/50">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-sun-amber-500/20 flex items-center justify-center text-lg">
                                {ticket.vendor.logo}
                            </div>
                            <div>
                                <p className="text-sm font-medium text-surface-900">{ticket.vendor.shortName}</p>
                                <div className="flex items-center gap-2 text-xs text-surface-600">
                                    <div className="flex items-center gap-0.5">
                                        <Star className="w-3 h-3 text-sun-amber-500" />
                                        <span>{ticket.vendor.rating}</span>
                                    </div>
                                    <span>•</span>
                                    <div className="flex items-center gap-0.5">
                                        <Clock className="w-3 h-3" />
                                        <span>{ticket.vendor.responseTime}m</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <ChevronRight className="w-5 h-5 text-surface-400" />
                    </div>
                </div>

                {/* At Risk Alert */}
                {(isAtRisk || isBreached) && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className={`mt-3 p-2 rounded-lg ${colors.bg} flex items-center gap-2`}
                    >
                        <AlertTriangle className={`w-4 h-4 ${colors.text}`} />
                        <span className={`text-xs font-medium ${colors.text}`}>
                            {isBreached ? 'SLA Breached! Escalation required' : 'At Risk - Immediate action needed'}
                        </span>
                    </motion.div>
                )}
            </div>
        </motion.div>
    )
}

/**
 * TaskCardSkeleton - Loading placeholder
 */
export function TaskCardSkeleton({ className = '' }) {
    return (
        <div className={`rounded-2xl bg-surface-100/60 p-4 animate-pulse ${className}`}>
            <div className="flex items-center justify-between mb-3">
                <div className="w-20 h-5 bg-surface-200 rounded-full" />
                <div className="w-16 h-16 bg-surface-200 rounded-full" />
            </div>
            <div className="h-5 w-3/4 bg-surface-200 rounded mb-2" />
            <div className="h-4 w-full bg-surface-200 rounded mb-4" />
            <div className="h-16 bg-surface-200 rounded-xl" />
        </div>
    )
}

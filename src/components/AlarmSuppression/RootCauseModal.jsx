import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    AlertTriangle,
    X,
    ChevronDown,
    ChevronRight,
    Clock,
    CircuitBoard,
    Zap,
    CheckCircle,
    FileText
} from 'lucide-react'

/**
 * RootCauseModal - High-priority modal showing the root cause of suppressed alarms
 * with a collapsible log of all suppressed downstream events
 */

// Generate mock suppressed events
const generateSuppressedEvents = (count = 50) => {
    const eventTypes = [
        'High Temperature Alert',
        'Output Deviation',
        'Communication Loss',
        'Voltage Fluctuation',
        'Power Factor Warning',
        'Efficiency Drop',
        'Grid Sync Issue',
        'Current Imbalance'
    ]

    const events = []
    const baseTime = new Date()

    for (let i = 0; i < count; i++) {
        const eventTime = new Date(baseTime.getTime() - i * 30000) // 30 sec intervals
        events.push({
            id: `event-${i + 1}`,
            type: eventTypes[Math.floor(Math.random() * eventTypes.length)],
            asset: `INV-${String(Math.floor(Math.random() * 4) + 1).padStart(3, '0')}`,
            timestamp: eventTime.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false
            }),
            severity: Math.random() > 0.7 ? 'critical' : 'warning'
        })
    }

    return events
}

// Collapsible section component
function CollapsibleSection({ title, count, children, defaultOpen = false }) {
    const [isOpen, setIsOpen] = useState(defaultOpen)

    return (
        <div className="border border-surface-300/50 rounded-xl overflow-hidden">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-4 bg-surface-200/30 hover:bg-surface-200/50 transition-colors"
            >
                <div className="flex items-center gap-3">
                    {isOpen ? (
                        <ChevronDown className="w-4 h-4 text-surface-600" />
                    ) : (
                        <ChevronRight className="w-4 h-4 text-surface-600" />
                    )}
                    <span className="text-sm font-medium text-surface-900">{title}</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-surface-300/50 text-xs text-surface-700">
                    {count} events
                </span>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                    >
                        <div className="max-h-64 overflow-y-auto">
                            {children}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

// Event row component
function EventRow({ event }) {
    return (
        <div className="flex items-center gap-3 px-4 py-2 border-b border-surface-200/50 last:border-b-0 hover:bg-surface-200/20">
            <div className={`
                w-2 h-2 rounded-full flex-shrink-0
                ${event.severity === 'critical' ? 'bg-rose-500' : 'bg-amber-500'}
            `} />
            <div className="flex-1 min-w-0">
                <p className="text-xs text-surface-700 truncate line-through opacity-60">
                    {event.type}
                </p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-xs text-surface-500">{event.asset}</span>
                <span className="text-xs text-surface-400 font-mono">{event.timestamp}</span>
            </div>
        </div>
    )
}

export default function RootCauseModal({
    isOpen = false,
    onClose = () => { },
    rootCause = null,
    onAcknowledge = () => { },
    onCreateTicket = () => { }
}) {
    const suppressedEvents = generateSuppressedEvents(54)

    // Default root cause if not provided
    const cause = rootCause || {
        assetId: 'transformer-1',
        assetName: 'Transformer T1',
        assetType: 'Transformer',
        failureType: 'Overcurrent Protection Trip',
        severity: 'critical',
        timestamp: new Date().toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        }),
        duration: '2m 34s',
        affectedAssets: 4,
        metrics: {
            current: '156.3A',
            threshold: '120A',
            voltage: '0V',
            temperature: '87°C'
        }
    }

    if (!isOpen) return null

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-surface-300/25/80 backdrop-blur-sm"
                />

                {/* Modal */}
                <motion.div
                    initial={{ scale: 0.95, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 20 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    className="relative w-full max-w-2xl glass-card border-2 border-rose-500/30 overflow-hidden"
                >
                    {/* Critical header bar */}
                    <div className="h-1 w-full bg-gradient-to-r from-rose-600 via-rose-500 to-rose-600" />

                    {/* Header */}
                    <div className="flex items-start justify-between p-6 border-b border-surface-200/50">
                        <div className="flex items-start gap-4">
                            <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/30">
                                <AlertTriangle className="w-6 h-6 text-rose-400" />
                            </div>
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <h2 className="text-lg font-bold text-surface-900">Root Cause Identified</h2>
                                    <span className="px-2 py-0.5 rounded-full bg-rose-500/20 border border-rose-500/30 text-xs font-medium text-rose-400">
                                        CRITICAL
                                    </span>
                                </div>
                                <p className="text-sm text-surface-600">
                                    Alarm suppression active • {suppressedEvents.length} downstream alerts correlated
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-lg bg-surface-200/50 hover:bg-surface-300 transition-colors"
                        >
                            <X className="w-4 h-4 text-surface-600" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
                        {/* Root Cause Summary */}
                        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20">
                            <div className="flex items-center gap-3 mb-4">
                                <CircuitBoard className="w-5 h-5 text-rose-400" />
                                <div>
                                    <p className="text-sm font-semibold text-surface-900">{cause.assetName}</p>
                                    <p className="text-xs text-surface-600">{cause.assetType} • {cause.assetId}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="p-3 rounded-lg bg-surface-100/50">
                                    <p className="text-xs text-surface-500 mb-1">Failure Type</p>
                                    <p className="text-sm font-medium text-rose-400">{cause.failureType}</p>
                                </div>
                                <div className="p-3 rounded-lg bg-surface-100/50">
                                    <p className="text-xs text-surface-500 mb-1">Duration</p>
                                    <p className="text-sm font-medium text-surface-900 flex items-center gap-2">
                                        <Clock className="w-3 h-3 text-surface-600" />
                                        {cause.duration}
                                    </p>
                                </div>
                            </div>

                            {/* Key Metrics */}
                            <div className="mt-4 pt-4 border-t border-rose-500/20">
                                <p className="text-xs text-surface-500 mb-2">Key Metrics at Failure</p>
                                <div className="grid grid-cols-4 gap-2">
                                    {Object.entries(cause.metrics).map(([key, value]) => (
                                        <div key={key} className="text-center">
                                            <p className="text-xs text-surface-500 capitalize">{key}</p>
                                            <p className="text-sm font-mono text-surface-900">{value}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Suppressed Events */}
                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <Zap className="w-4 h-4 text-surface-600" />
                                <p className="text-sm font-medium text-surface-900">Suppressed Downstream Alerts</p>
                            </div>

                            <CollapsibleSection
                                title="Inverter Alerts"
                                count={suppressedEvents.length}
                                defaultOpen={false}
                            >
                                {suppressedEvents.map(event => (
                                    <EventRow key={event.id} event={event} />
                                ))}
                            </CollapsibleSection>
                        </div>

                        {/* Explanation */}
                        <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
                            <p className="text-xs text-cyan-400 font-medium mb-1">
                                Why are these alerts suppressed?
                            </p>
                            <p className="text-xs text-surface-600 leading-relaxed">
                                The upstream transformer failure is the root cause of all downstream inverter alerts.
                                These {suppressedEvents.length} events are symptoms, not separate issues.
                                Resolving the transformer will clear all suppressed alerts automatically.
                            </p>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="flex items-center justify-between p-6 border-t border-surface-200/50 bg-surface-100/30">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 rounded-xl bg-surface-300/40 border border-surface-400/50 text-sm text-surface-800 hover:bg-surface-300/70 transition-colors"
                        >
                            Dismiss
                        </button>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={onAcknowledge}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-300/40 border border-surface-400/50 text-sm text-surface-800 hover:bg-surface-300/70 transition-colors"
                            >
                                <CheckCircle className="w-4 h-4" />
                                Acknowledge
                            </button>
                            <button
                                onClick={onCreateTicket}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-sun-green-500/20 border border-sun-green-400/40 text-sm text-sun-green-300 font-semibold hover:bg-sun-green-500/30 transition-colors"
                            >
                                <FileText className="w-4 h-4" />
                                Create Ticket
                            </button>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    )
}

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    AlertTriangle,
    X,
    TrendingDown,
    Clock,
    MapPin,
    Zap,
    Thermometer,
    Wrench,
    CheckCircle,
    ExternalLink
} from 'lucide-react'
import { useTickets } from '../../context/TicketContext'

/**
 * AnomalyPanel - Detail panel showing detected anomaly information
 * 
 * Connected to TicketContext to create work orders that flow to technician mobile app
 */
export default function AnomalyPanel({
    anomaly = null,
    onClose = () => { },
    className = ''
}) {
    const { createTicket, vendors } = useTickets()
    const [ticketCreated, setTicketCreated] = useState(false)
    const [createdTicket, setCreatedTicket] = useState(null)

    if (!anomaly) return null

    const severityConfig = {
        warning: {
            color: 'amber',
            bgColor: 'bg-amber-500/10',
            borderColor: 'border-amber-500/30',
            textColor: 'text-amber-500',
            icon: AlertTriangle,
            label: 'Warning'
        },
        critical: {
            color: 'rose',
            bgColor: 'bg-rose-500/10',
            borderColor: 'border-rose-500/30',
            textColor: 'text-rose-500',
            icon: AlertTriangle,
            label: 'Critical'
        }
    }

    const config = severityConfig[anomaly.severity] || severityConfig.warning
    const SeverityIcon = config.icon

    // Possible causes based on anomaly type
    const possibleCauses = [
        { label: 'Panel Soiling', probability: 65, icon: Thermometer },
        { label: 'Partial Shading', probability: 20, icon: MapPin },
        { label: 'Cell Degradation', probability: 10, icon: Zap },
        { label: 'Connection Issue', probability: 5, icon: Wrench },
    ]

    const handleCreateTicket = () => {
        const ticket = createTicket({
            assetName: anomaly.assetName || 'Panel C-7',
            panelId: anomaly.panelId,
            location: 'Block A, Row 3',
            issueType: 'Performance Deviation',
            variance: anomaly.variance,
            severity: anomaly.severity,
            probableCause: possibleCauses[0].label,
            probability: possibleCauses[0].probability,
            description: `Detected ${Math.abs(parseFloat(anomaly.variance || -8.3))}% underperformance vs digital twin model.`,
            expected: anomaly.expected,
            actual: anomaly.actual
        })

        setCreatedTicket(ticket)
        setTicketCreated(true)
    }

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className={`glass-card overflow-hidden ${className}`}
            >
                {/* Header */}
                <div className={`flex items-center justify-between p-4 ${config.bgColor} border-b ${config.borderColor}`}>
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${config.bgColor}`}>
                            <SeverityIcon className={`w-5 h-5 ${config.textColor}`} />
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-surface-900">Anomaly Detected</h3>
                            <p className="text-xs text-surface-600">{anomaly.assetName || 'Panel C-7'}</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-lg bg-surface-200/50 hover:bg-surface-300 transition-colors"
                    >
                        <X className="w-4 h-4 text-surface-600" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-4 space-y-4">
                    {/* Key Metrics */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 rounded-xl bg-surface-200/50">
                            <div className="flex items-center gap-2 mb-1">
                                <TrendingDown className="w-4 h-4 text-rose-400" />
                                <span className="text-xs text-surface-600">Variance</span>
                            </div>
                            <p className="text-lg font-bold text-rose-400">
                                {anomaly.variance || '-8.3'}%
                            </p>
                        </div>

                        <div className="p-3 rounded-xl bg-surface-200/50">
                            <div className="flex items-center gap-2 mb-1">
                                <Clock className="w-4 h-4 text-surface-600" />
                                <span className="text-xs text-surface-600">Duration</span>
                            </div>
                            <p className="text-lg font-bold text-surface-900">
                                {anomaly.duration || '2h 15m'}
                            </p>
                        </div>
                    </div>

                    {/* Expected vs Actual */}
                    <div className="p-3 rounded-xl bg-surface-200/30 border border-surface-300/50">
                        <p className="text-xs text-surface-500 mb-2">Performance Comparison</p>
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-0.5 bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.6)]" />
                                <span className="text-xs text-surface-600">Expected</span>
                            </div>
                            <span className="text-sm font-mono text-surface-900">{anomaly.expected || '42.5'} kW</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-0.5 bg-surface-200" />
                                <span className="text-xs text-surface-600">Actual</span>
                            </div>
                            <span className="text-sm font-mono text-surface-900">{anomaly.actual || '39.0'} kW</span>
                        </div>
                    </div>

                    {/* Probable Causes */}
                    <div>
                        <p className="text-xs text-surface-500 mb-2">Probable Causes</p>
                        <div className="space-y-2">
                            {possibleCauses.map((cause, idx) => (
                                <div key={idx} className="flex items-center gap-3">
                                    <cause.icon className="w-4 h-4 text-surface-500" />
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-xs text-surface-700">{cause.label}</span>
                                            <span className="text-xs text-surface-500">{cause.probability}%</span>
                                        </div>
                                        <div className="h-1 bg-surface-200 rounded-full overflow-hidden">
                                            <motion.div
                                                className="h-full bg-sun-green-500/60 rounded-full"
                                                initial={{ width: 0 }}
                                                animate={{ width: `${cause.probability}%` }}
                                                transition={{ delay: idx * 0.1, duration: 0.5 }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Ticket Created Success */}
                    <AnimatePresence mode="wait">
                        {ticketCreated && createdTicket ? (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30"
                            >
                                <div className="flex items-center gap-2 mb-2">
                                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                                    <span className="text-sm font-medium text-emerald-400">Ticket Created</span>
                                </div>
                                <div className="space-y-1 text-xs text-surface-600">
                                    <p><span className="text-surface-500">ID:</span> {createdTicket.id}</p>
                                    <p><span className="text-surface-500">Assigned to:</span> {createdTicket.vendor.name}</p>
                                    <p><span className="text-surface-500">SLA:</span> {createdTicket.slaMinutes} minutes</p>
                                </div>
                                <a
                                    href="#/technician"
                                    className="mt-2 flex items-center gap-1 text-xs text-sun-green-300 hover:underline"
                                >
                                    <ExternalLink className="w-3 h-3" />
                                    Open Mobile App
                                </a>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="actions"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex gap-2 pt-2"
                            >
                                <button
                                    onClick={onClose}
                                    className="flex-1 px-4 py-2 rounded-xl bg-surface-300/40 border border-surface-400/50 text-sm text-surface-800 hover:bg-surface-300/70 transition-colors"
                                >
                                    Dismiss
                                </button>
                                <button
                                    onClick={handleCreateTicket}
                                    className="flex-1 px-4 py-2 rounded-xl bg-sun-green-500/20 border border-sun-green-400/40 text-sm text-sun-green-300 font-semibold hover:bg-sun-green-500/30 transition-colors"
                                >
                                    Create Ticket
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </AnimatePresence>
    )
}

import React, { useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Zap,
    Building2,
    CircuitBoard,
    AlertTriangle,
    XCircle,
    BellOff
} from 'lucide-react'

/**
 * AlarmSuppressionGraph - Compact node graph showing electrical hierarchy
 * with suppression visualization for alarm correlation
 */

// Node status colors matching the design system
const STATUS_CONFIG = {
    normal: {
        bg: 'bg-emerald-500/20',
        border: 'border-emerald-500/50',
        text: 'text-emerald-400',
        iconBg: 'bg-emerald-500/30',
        stroke: '#818CF8'
    },
    warning: {
        bg: 'bg-amber-500/20',
        border: 'border-amber-500/50',
        text: 'text-amber-400',
        iconBg: 'bg-amber-500/30',
        stroke: '#22D3EE'
    },
    failure: {
        bg: 'bg-rose-500/30',
        border: 'border-rose-500',
        text: 'text-rose-400',
        iconBg: 'bg-rose-500/40',
        stroke: '#FDA4AF'
    },
    suppressed: {
        bg: 'bg-surface-200/60',
        border: 'border-surface-400/40',
        text: 'text-surface-500',
        iconBg: 'bg-surface-300/50',
        stroke: '#475569'
    }
}

// Compact Node component
function CompactNode({ node, status = 'normal', delay = 0 }) {
    const config = STATUS_CONFIG[status] || STATUS_CONFIG.normal
    const IconComponent = node.icon

    return (
        <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: status === 'suppressed' ? 0.5 : 1 }}
            transition={{ delay, duration: 0.3 }}
            className={`
                relative flex items-center gap-2 px-3 py-2 rounded-lg
                ${config.bg} border ${config.border}
                ${status === 'failure' ? 'ring-2 ring-rose-500/50 ring-offset-1 ring-offset-carbon-900' : ''}
            `}
            style={{
                boxShadow: status === 'failure' ? '0 0 16px rgba(244, 63, 94, 0.4)' : 'none'
            }}
        >
            {/* Pulse effect for failure */}
            {status === 'failure' && (
                <motion.div
                    className="absolute inset-0 rounded-lg bg-rose-500/20"
                    animate={{ opacity: [0.3, 0.6, 0.3] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                />
            )}

            {/* Icon */}
            <div className={`w-7 h-7 rounded-md flex items-center justify-center ${config.iconBg}`}>
                <IconComponent className={`w-4 h-4 ${config.text}`} />
            </div>

            {/* Label */}
            <div className="relative z-10">
                <p className={`text-xs font-semibold ${status === 'suppressed' ? 'text-surface-500 line-through' : 'text-surface-900'}`}>
                    {node.name}
                </p>
                <p className={`text-[10px] ${config.text}`}>{node.type}</p>
            </div>

            {/* Status indicator */}
            {status === 'failure' && (
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-rose-500 flex items-center justify-center"
                >
                    <XCircle className="w-3 h-3 text-surface-900" />
                </motion.div>
            )}
            {status === 'suppressed' && (
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: delay + 0.1 }}
                    className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-carbon-600 flex items-center justify-center"
                >
                    <BellOff className="w-2.5 h-2.5 text-surface-600" />
                </motion.div>
            )}
        </motion.div>
    )
}

// Vertical connector line
function Connector({ status = 'normal', delay = 0 }) {
    const config = STATUS_CONFIG[status]
    return (
        <motion.div
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ delay, duration: 0.2 }}
            className="w-0.5 h-4 mx-auto origin-top"
            style={{ backgroundColor: config.stroke, opacity: status === 'suppressed' ? 0.3 : 0.6 }}
        />
    )
}

export default function AlarmSuppressionGraph({
    failedNodeId = null,
    onNodeClick = () => { },
    onViewRootCause = () => { },
    className = ''
}) {
    // Compact hierarchy data
    const hierarchy = useMemo(() => ({
        root: { id: 'substation-1', name: 'Substation A', type: 'Root', icon: Building2 },
        transformers: [
            { id: 'transformer-1', name: 'T1', type: 'Transformer', icon: CircuitBoard, inverters: ['INV-001', 'INV-002', 'INV-003', 'INV-004'] },
            { id: 'transformer-2', name: 'T2', type: 'Transformer', icon: CircuitBoard, inverters: ['INV-005', 'INV-006', 'INV-007', 'INV-008'] }
        ]
    }), [])

    // Get status for each level
    const rootStatus = failedNodeId ? 'warning' : 'normal'
    const getTransformerStatus = (id) => id === failedNodeId ? 'failure' : 'normal'
    const getInverterStatus = (parentId) => parentId === failedNodeId ? 'suppressed' : 'normal'

    // Count suppressed alarms
    const suppressedCount = failedNodeId ? hierarchy.transformers.find(t => t.id === failedNodeId)?.inverters.length || 0 : 0

    return (
        <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className={`glass-card overflow-hidden ${className}`}
        >
            {/* Compact Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-surface-200/50">
                <div className="flex items-center gap-2">
                    <div className="w-1 h-5 rounded-full bg-rose-500" />
                    <h3 className="text-sm font-semibold text-surface-900">Alarm Suppression Logic</h3>
                    {failedNodeId && (
                        <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 text-xs font-medium">
                            {suppressedCount} suppressed
                        </span>
                    )}
                </div>
                {failedNodeId && (
                    <button
                        onClick={onViewRootCause}
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-500/20 border border-rose-500/30 text-rose-400 text-xs font-medium hover:bg-rose-500/150/30 transition-colors"
                    >
                        <AlertTriangle className="w-3 h-3" />
                        Root Cause
                    </button>
                )}
            </div>

            {/* Compact Graph */}
            <div className="p-4">
                <div className="flex flex-col items-center gap-0">
                    {/* Root Level */}
                    <CompactNode node={hierarchy.root} status={rootStatus} />
                    <Connector status={rootStatus} delay={0.1} />

                    {/* Transformer Level */}
                    <div className="flex items-start gap-6">
                        {hierarchy.transformers.map((t, ti) => (
                            <div key={t.id} className="flex flex-col items-center">
                                <CompactNode
                                    node={t}
                                    status={getTransformerStatus(t.id)}
                                    delay={0.15 + ti * 0.1}
                                />
                                <Connector
                                    status={getInverterStatus(t.id)}
                                    delay={0.25 + ti * 0.1}
                                />

                                {/* Inverters - compact grid */}
                                <div className="grid grid-cols-2 gap-1">
                                    {t.inverters.map((inv, ii) => {
                                        const invStatus = getInverterStatus(t.id)
                                        return (
                                            <motion.div
                                                key={inv}
                                                initial={{ scale: 0.8, opacity: 0 }}
                                                animate={{
                                                    scale: 1,
                                                    opacity: invStatus === 'suppressed' ? 0.4 : 1
                                                }}
                                                transition={{ delay: 0.3 + ti * 0.1 + ii * 0.05 }}
                                                className={`
                                                    relative px-2 py-1 rounded text-[10px] font-medium text-center
                                                    ${invStatus === 'suppressed'
                                                        ? 'bg-surface-200/60 text-surface-500 line-through border border-surface-300/50'
                                                        : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                                    }
                                                `}
                                            >
                                                <Zap className="w-2.5 h-2.5 inline mr-0.5 -mt-0.5" />
                                                {inv}
                                                {invStatus === 'suppressed' && (
                                                    <BellOff className="w-2 h-2 absolute -top-1 -right-1 text-surface-500" />
                                                )}
                                            </motion.div>
                                        )
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Compact Legend */}
                <div className="flex items-center justify-center gap-4 mt-4 pt-3 border-t border-surface-200/30">
                    <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-emerald-500" />
                        <span className="text-[10px] text-surface-500">Active</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-rose-500" />
                        <span className="text-[10px] text-surface-500">Failure</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-carbon-600" />
                        <span className="text-[10px] text-surface-500">Suppressed</span>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}

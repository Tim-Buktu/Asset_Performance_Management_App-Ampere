import React, { useState } from 'react'
import {
    Sun,
    Zap,
    Battery,
    Network,
    ChevronRight,
    MoreHorizontal,
    Activity,
    Gauge
} from 'lucide-react'

/**
 * GenealogyNode Component
 * 
 * Custom node design for asset relationship mapping (Genealogy Map).
 * Displays solar asset hierarchy with visual connections and status.
 * 
 * @param {'source'|'hub'|'endpoint'} nodeType - Visual style variant
 * @param {string} title - Node title/name
 * @param {string} subtitle - Node type or category
 * @param {Object} metrics - Primary and secondary metrics
 * @param {'healthy'|'warning'|'critical'} status - Node health status
 * @param {boolean} isSelected - Selected state
 * @param {boolean} hasChildren - Shows expand indicator
 * @param {boolean} isExpanded - Expansion state
 */
export default function GenealogyNode({
    nodeType = 'source',
    title = 'Solar Array',
    subtitle = 'Array',
    metrics = { primary: { label: 'Capacity', value: '50', unit: 'MW' } },
    status = 'healthy',
    isSelected = false,
    hasChildren = false,
    isExpanded = false,
    onClick = () => { },
    onExpand = () => { },
    className = '',
}) {
    const [isHovered, setIsHovered] = useState(false)

    const nodeTypeConfig = {
        source: {
            gradient: 'from-sun-amber-600/20 via-sun-amber-500/10 to-transparent',
            borderAccent: 'border-sun-amber-500/40',
            icon: Sun,
            iconColor: 'text-sun-amber-500',
            iconBg: 'bg-sun-amber-500/10',
            headerBg: 'bg-gradient-to-r from-sun-amber-500/10 to-transparent',
        },
        hub: {
            gradient: 'from-carbon-600/20 via-carbon-700/10 to-transparent',
            borderAccent: 'border-carbon-500/40',
            icon: Zap,
            iconColor: 'text-blue-400',
            iconBg: 'bg-blue-500/10',
            headerBg: 'bg-gradient-to-r from-blue-500/10 to-transparent',
        },
        endpoint: {
            gradient: 'from-teal-600/20 via-teal-500/10 to-transparent',
            borderAccent: 'border-teal-500/40',
            icon: Network,
            iconColor: 'text-teal-400',
            iconBg: 'bg-teal-500/10',
            headerBg: 'bg-gradient-to-r from-teal-500/10 to-transparent',
        },
    }

    const statusConfig = {
        healthy: {
            dotColor: 'bg-emerald-500',
            ringColor: 'ring-emerald-500/30',
            dots: [true, true, true, true, true],
        },
        warning: {
            dotColor: 'bg-amber-500',
            ringColor: 'ring-amber-500/30',
            dots: [true, true, true, false, false],
        },
        critical: {
            dotColor: 'bg-rose-500',
            ringColor: 'ring-rose-500/30',
            dots: [true, false, false, false, false],
        },
    }

    const config = nodeTypeConfig[nodeType] || nodeTypeConfig.source
    const statusStyle = statusConfig[status] || statusConfig.healthy
    const NodeIcon = config.icon

    return (
        <div
            className={`
        relative group
        ${className}
      `}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Main Node Container */}
            <div
                className={`
          relative w-72 
          bg-surface-200/60 backdrop-blur-xl
          border rounded-2xl overflow-hidden
          transition-all duration-300 ease-out
          ${isSelected
                        ? `${config.borderAccent} shadow-lg ring-2 ${statusStyle.ringColor}`
                        : 'border-surface-200/50 hover:border-surface-300/60'
                    }
          ${isHovered ? 'shadow-card-hover transform -translate-y-0.5' : 'shadow-card'}
        `}
                onClick={onClick}
            >
                {/* Header Section with Gradient */}
                <div className={`${config.headerBg} px-4 py-3 border-b border-surface-200/50`}>
                    <div className="flex items-center gap-3">
                        {/* Icon */}
                        <div className={`w-10 h-10 rounded-xl ${config.iconBg} flex items-center justify-center`}>
                            <NodeIcon className={`w-5 h-5 ${config.iconColor}`} />
                        </div>

                        {/* Title & Subtitle */}
                        <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-semibold text-surface-900 truncate">
                                {title}
                            </h4>
                            <p className="text-xs text-surface-500">
                                {subtitle}
                            </p>
                        </div>

                        {/* More Options */}
                        <button
                            className="p-1.5 rounded-lg bg-surface-200/50 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => { e.stopPropagation() }}
                        >
                            <MoreHorizontal className="w-4 h-4 text-surface-600" />
                        </button>
                    </div>
                </div>

                {/* Metrics Section */}
                <div className="px-4 py-3 space-y-2">
                    {/* Primary Metric */}
                    {metrics.primary && (
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-surface-500">{metrics.primary.label}</span>
                            <div className="flex items-baseline gap-1">
                                <span className="text-sm font-bold text-surface-900 font-mono">
                                    {metrics.primary.value}
                                </span>
                                <span className="text-xs text-surface-500">{metrics.primary.unit}</span>
                            </div>
                        </div>
                    )}

                    {/* Secondary Metric */}
                    {metrics.secondary && (
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-surface-500">{metrics.secondary.label}</span>
                            <div className="flex items-baseline gap-1">
                                <span className="text-sm font-bold text-surface-900 font-mono">
                                    {metrics.secondary.value}
                                </span>
                                <span className="text-xs text-surface-500">{metrics.secondary.unit}</span>
                            </div>
                        </div>
                    )}

                    {/* Status Dots */}
                    <div className="flex items-center justify-between pt-2 border-t border-surface-200/50">
                        <span className="text-xs text-surface-500">Health</span>
                        <div className="flex items-center gap-1">
                            {statusStyle.dots.map((active, i) => (
                                <span
                                    key={i}
                                    className={`
                    w-2 h-2 rounded-full
                    ${active ? statusStyle.dotColor : 'bg-surface-300'}
                    transition-colors duration-200
                  `}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Expand Button (if has children) */}
                {hasChildren && (
                    <button
                        className={`
              absolute -right-3 top-1/2 -translate-y-1/2
              w-6 h-6 rounded-full
              bg-surface-200 border border-surface-300
              flex items-center justify-center
              shadow-lg
              transition-all duration-200
              hover:bg-surface-300 hover:border-surface-400
              ${isExpanded ? 'rotate-90' : ''}
            `}
                        onClick={(e) => {
                            e.stopPropagation()
                            onExpand()
                        }}
                    >
                        <ChevronRight className="w-3.5 h-3.5 text-surface-600" />
                    </button>
                )}
            </div>

            {/* Left Connection Handle */}
            <div
                className={`
          absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2
          w-3 h-3 rounded-full
          bg-surface-200 border-2 border-surface-400
          opacity-0 group-hover:opacity-100
          transition-opacity duration-200
        `}
            />

            {/* Right Connection Handle */}
            <div
                className={`
          absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2
          w-3 h-3 rounded-full
          bg-surface-200 border-2 border-surface-400
          ${hasChildren ? 'opacity-0' : 'opacity-0 group-hover:opacity-100'}
          transition-opacity duration-200
        `}
            />
        </div>
    )
}

/**
 * GenealogyConnection - Visual connection line between nodes
 */
export function GenealogyConnection({
    isActive = false,
    direction = 'horizontal',
    length = 60,
    className = ''
}) {
    const isHorizontal = direction === 'horizontal'

    return (
        <div
            className={`
        relative flex items-center justify-center
        ${isHorizontal ? `w-[${length}px] h-0.5` : `w-0.5 h-[${length}px]`}
        ${className}
      `}
            style={{
                width: isHorizontal ? length : '2px',
                height: isHorizontal ? '2px' : length,
            }}
        >
            {/* Base Line */}
            <div
                className={`
          absolute inset-0
          bg-gradient-to-r from-carbon-700 via-carbon-600 to-carbon-700
          rounded-full
        `}
            />

            {/* Active Glow */}
            {isActive && (
                <>
                    <div
                        className={`
              absolute inset-0
              bg-gradient-to-r from-transparent via-sun-amber-500/50 to-transparent
              rounded-full
              animate-pulse
            `}
                    />
                    {/* Flowing Particle */}
                    <div
                        className={`
              absolute w-2 h-2 rounded-full
              bg-sun-amber-500 shadow-glow-amber
              animate-[flow_2s_ease-in-out_infinite]
            `}
                        style={{
                            animation: 'flow 2s ease-in-out infinite',
                        }}
                    />
                </>
            )}
        </div>
    )
}

/**
 * GenealogyMap - Container for genealogy visualization
 */
export function GenealogyMap({ children, className = '' }) {
    return (
        <div
            className={`
        relative p-8
        bg-surface-100/40 backdrop-blur-sm
        border border-surface-200/50
        rounded-2xl overflow-hidden
        grid-bg
        ${className}
      `}
        >
            {/* Ambient Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-32 bg-sun-amber-500/5 blur-3xl rounded-full" />

            {/* Content */}
            <div className="relative z-10">
                {children}
            </div>
        </div>
    )
}

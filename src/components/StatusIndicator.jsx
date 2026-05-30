import React from 'react'
import {
    CheckCircle2,
    AlertTriangle,
    XCircle,
    Activity,
    Zap,
    Sun,
    Battery
} from 'lucide-react'

/**
 * StatusIndicator Component
 * 
 * Solar asset health indicator with three states: Healthy, Warning, Critical.
 * Features animated pulse effects with varying speeds based on severity.
 * 
 * @param {'healthy'|'warning'|'critical'} status - Current status state
 * @param {string} label - Status label text
 * @param {string} description - Additional context
 * @param {'dot'|'badge'|'card'} variant - Display variant
 * @param {string} assetName - Name of the solar asset
 * @param {string} assetType - Type of asset (array, inverter, grid, etc.)
 */
export default function StatusIndicator({
    status = 'healthy',
    label = '',
    description = '',
    variant = 'badge',
    assetName = '',
    assetType = 'array',
    className = '',
    showPulse = true,
}) {
    const statusConfig = {
        healthy: {
            color: 'emerald',
            bgColor: 'bg-emerald-500',
            textColor: 'text-emerald-400',
            borderColor: 'border-emerald-500/30',
            glowColor: 'shadow-glow-healthy',
            bgLight: 'bg-emerald-500/10',
            icon: CheckCircle2,
            label: label || 'Healthy',
            pulseSpeed: 'animate-pulse-slow',
            pingSpeed: '3s',
        },
        warning: {
            color: 'amber',
            bgColor: 'bg-amber-500',
            textColor: 'text-amber-400',
            borderColor: 'border-amber-500/30',
            glowColor: 'shadow-glow-warning',
            bgLight: 'bg-amber-500/10',
            icon: AlertTriangle,
            label: label || 'Warning',
            pulseSpeed: 'animate-pulse-medium',
            pingSpeed: '1.5s',
        },
        critical: {
            color: 'rose',
            bgColor: 'bg-rose-500',
            textColor: 'text-rose-400',
            borderColor: 'border-rose-500/30',
            glowColor: 'shadow-glow-critical',
            bgLight: 'bg-rose-500/10',
            icon: XCircle,
            label: label || 'Critical',
            pulseSpeed: 'animate-pulse-fast',
            pingSpeed: '0.5s',
        },
    }

    const assetIcons = {
        array: Sun,
        inverter: Zap,
        battery: Battery,
        grid: Activity,
    }

    const config = statusConfig[status] || statusConfig.healthy
    const StatusIcon = config.icon
    const AssetIcon = assetIcons[assetType] || Sun

    // Dot variant - minimal indicator
    if (variant === 'dot') {
        return (
            <div className={`relative inline-flex ${className}`}>
                <span
                    className={`
            w-3 h-3 rounded-full ${config.bgColor}
            ${showPulse ? config.glowColor : ''}
          `}
                />
                {showPulse && (
                    <span
                        className={`
              absolute inset-0 rounded-full ${config.bgColor} opacity-40
              animate-ping
            `}
                        style={{ animationDuration: config.pingSpeed }}
                    />
                )}
            </div>
        )
    }

    // Badge variant - compact inline display
    if (variant === 'badge') {
        return (
            <div
                className={`
          inline-flex items-center gap-2 
          px-3 py-1.5 rounded-full
          ${config.bgLight} ${config.borderColor} border
          ${className}
        `}
            >
                <div className="relative">
                    <span className={`w-2 h-2 rounded-full ${config.bgColor} block`} />
                    {showPulse && (
                        <span
                            className={`
                absolute inset-0 rounded-full ${config.bgColor} opacity-40
                animate-ping
              `}
                            style={{ animationDuration: config.pingSpeed }}
                        />
                    )}
                </div>
                <span className={`text-sm font-medium ${config.textColor}`}>
                    {config.label}
                </span>
            </div>
        )
    }

    // Card variant - full asset status card
    return (
        <div
            className={`
        glass-card p-4
        ${config.borderColor}
        hover:${config.glowColor}
        transition-shadow duration-300
        ${className}
      `}
        >
            <div className="flex items-start gap-4">
                {/* Status Icon with Pulse */}
                <div className="relative">
                    <div
                        className={`
              w-12 h-12 rounded-xl 
              ${config.bgLight}
              flex items-center justify-center
            `}
                    >
                        <StatusIcon className={`w-6 h-6 ${config.textColor}`} />
                    </div>

                    {/* Pulse Ring */}
                    {showPulse && (
                        <div
                            className={`
                absolute -inset-1 rounded-xl 
                ${config.bgColor} opacity-20
                animate-ping
              `}
                            style={{ animationDuration: config.pingSpeed }}
                        />
                    )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        {assetName && (
                            <>
                                <AssetIcon className="w-4 h-4 text-surface-500" />
                                <span className="text-sm font-semibold text-surface-900 truncate">
                                    {assetName}
                                </span>
                            </>
                        )}
                    </div>

                    <div className="flex items-center gap-2">
                        <span className={`text-sm font-bold ${config.textColor}`}>
                            {config.label}
                        </span>
                        {description && (
                            <span className="text-xs text-surface-500">
                                • {description}
                            </span>
                        )}
                    </div>
                </div>

                {/* Status Dot */}
                <div className="relative flex-shrink-0">
                    <span className={`w-3 h-3 rounded-full ${config.bgColor} block`} />
                    {showPulse && (
                        <span
                            className={`
                absolute inset-0 rounded-full ${config.bgColor} opacity-40
                animate-ping
              `}
                            style={{ animationDuration: config.pingSpeed }}
                        />
                    )}
                </div>
            </div>
        </div>
    )
}

/**
 * StatusIndicatorGroup - Display multiple status indicators in a row
 */
export function StatusIndicatorGroup({
    items = [],
    variant = 'badge',
    className = ''
}) {
    return (
        <div className={`flex flex-wrap gap-2 ${className}`}>
            {items.map((item, index) => (
                <StatusIndicator
                    key={item.id || index}
                    {...item}
                    variant={variant}
                />
            ))}
        </div>
    )
}

/**
 * StatusLegend - Display status legend for reference
 */
export function StatusLegend({ className = '' }) {
    return (
        <div className={`flex items-center gap-6 ${className}`}>
            <div className="flex items-center gap-2">
                <StatusIndicator status="healthy" variant="dot" showPulse={false} />
                <span className="text-xs text-surface-600">Healthy</span>
            </div>
            <div className="flex items-center gap-2">
                <StatusIndicator status="warning" variant="dot" showPulse={false} />
                <span className="text-xs text-surface-600">Warning</span>
            </div>
            <div className="flex items-center gap-2">
                <StatusIndicator status="critical" variant="dot" showPulse={false} />
                <span className="text-xs text-surface-600">Critical</span>
            </div>
        </div>
    )
}

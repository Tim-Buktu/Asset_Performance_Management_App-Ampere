import React, { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    AlertTriangle,
    TrendingDown,
    DollarSign,
    Clock,
    MapPin,
    Sun,
    Battery,
    Car,
    Zap,
    ChevronDown,
    ChevronUp,
    Calendar
} from 'lucide-react'

/**
 * RevenueAtRiskGauge Component
 * 
 * High-fidelity radial gauge showing real-time revenue at risk from downtime.
 * Includes breakdown by site location and asset category.
 * Features timeframe toggle and site-level breakdown chart.
 */

// Timeframe options
const TIMEFRAMES = [
    { key: 'today', label: 'Today', multiplier: 1 },
    { key: '7days', label: '7 Days', multiplier: 7 },
    { key: '30days', label: '30 Days', multiplier: 30 },
]

// Site colors for the breakdown chart
const SITE_COLORS = [
    '#FDA4AF', // Rose
    '#22D3EE', // Amber
    '#818CF8', // Emerald
    '#22D3EE', // Blue
    '#A78BFA', // Purple
    '#F472B6', // Pink
    '#22D3EE', // Cyan
    '#818CF8', // Lime
]

// Gauge configuration
const GAUGE_CONFIG = {
    startAngle: -135,
    endAngle: 135,
    radius: 90,
    strokeWidth: 12,
    thresholds: {
        low: 5000,      // Green zone: $0 - $5K
        medium: 15000,  // Amber zone: $5K - $15K
        high: 30000,    // Red zone: $15K+
    }
}

// Calculate gauge arc path
function describeArc(cx, cy, radius, startAngle, endAngle) {
    const start = polarToCartesian(cx, cy, radius, endAngle)
    const end = polarToCartesian(cx, cy, radius, startAngle)
    const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1

    return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`
}

function polarToCartesian(cx, cy, radius, angleDeg) {
    const angleRad = (angleDeg - 90) * Math.PI / 180
    return {
        x: cx + radius * Math.cos(angleRad),
        y: cy + radius * Math.sin(angleRad)
    }
}

// Asset breakdown data structure
const assetCategories = [
    { key: 'solarPanels', label: 'Solar Panels', icon: Sun, color: '#22D3EE' },
    { key: 'bess', label: 'BESS', icon: Battery, color: '#818CF8' },
    { key: 'evFleet', label: 'EV Fleet', icon: Car, color: '#22D3EE' },
    { key: 'chargers', label: 'Chargers', icon: Zap, color: '#A78BFA' },
]

// Format currency value
function formatCurrency(val) {
    if (val >= 1000000) {
        return (val / 1000000).toFixed(2) + 'M'
    }
    if (val >= 1000) {
        return (val / 1000).toFixed(1) + 'K'
    }
    return val.toFixed(0)
}

// Animated counter component
function AnimatedCounter({ value, prefix = '', suffix = '', duration = 1000 }) {
    const [displayValue, setDisplayValue] = useState(0)

    useEffect(() => {
        const startTime = Date.now()
        const startValue = displayValue

        const animate = () => {
            const elapsed = Date.now() - startTime
            const progress = Math.min(elapsed / duration, 1)
            const eased = 1 - Math.pow(1 - progress, 3) // ease-out cubic

            setDisplayValue(startValue + (value - startValue) * eased)

            if (progress < 1) {
                requestAnimationFrame(animate)
            }
        }

        requestAnimationFrame(animate)
    }, [value, duration])

    return (
        <span>
            {prefix}{formatCurrency(displayValue)}{suffix}
        </span>
    )
}

// Breakdown bar component
function BreakdownBar({ items, total, className = '' }) {
    return (
        <div className={`w-full ${className}`}>
            <div className="flex h-3 rounded-full overflow-hidden bg-surface-200">
                {items.map((item, index) => (
                    <motion.div
                        key={item.key}
                        initial={{ width: 0 }}
                        animate={{ width: `${(item.value / total) * 100}%` }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="h-full"
                        style={{ backgroundColor: item.color }}
                    />
                ))}
            </div>
            <div className="flex justify-between mt-2">
                {items.map(item => (
                    <div key={item.key} className="flex items-center gap-1">
                        <div
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: item.color }}
                        />
                        <span className="text-[10px] text-surface-600">{item.label}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}

// Site Revenue Breakdown Chart - Stacked 100% bar (like asset category)
function SiteRevenueChart({ sites, hourlyRate, timeMultiplier }) {
    // Calculate revenue at risk for each site with downtime
    const siteData = useMemo(() => {
        const sitesWithRisk = sites
            .filter(s => s.downtime > 0)
            .map((site, idx) => ({
                ...site,
                key: site.id,
                label: site.name,
                revenueAtRisk: site.downtime * hourlyRate * parseFloat(site.capacity) * timeMultiplier,
                color: SITE_COLORS[idx % SITE_COLORS.length]
            }))
            .sort((a, b) => b.revenueAtRisk - a.revenueAtRisk)

        const total = sitesWithRisk.reduce((acc, s) => acc + s.revenueAtRisk, 0)
        return { sites: sitesWithRisk, total }
    }, [sites, hourlyRate, timeMultiplier])

    if (siteData.sites.length === 0) {
        return (
            <div className="text-center py-4 text-surface-500 text-sm">
                No sites with revenue at risk
            </div>
        )
    }

    return (
        <div className="w-full">
            {/* Stacked Bar */}
            <div className="flex h-3 rounded-full overflow-hidden bg-surface-200">
                {siteData.sites.map((site, index) => (
                    <motion.div
                        key={site.key}
                        initial={{ width: 0 }}
                        animate={{ width: `${(site.revenueAtRisk / siteData.total) * 100}%` }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="h-full"
                        style={{ backgroundColor: site.color }}
                        title={`${site.name}: $${formatCurrency(site.revenueAtRisk)}`}
                    />
                ))}
            </div>
            {/* Legend */}
            <div className="flex flex-wrap gap-x-3 gap-y-1.5 mt-3">
                {siteData.sites.map(site => (
                    <div key={site.key} className="flex items-center gap-1.5">
                        <div
                            className="w-2 h-2 rounded-full flex-shrink-0"
                            style={{ backgroundColor: site.color }}
                        />
                        <span className="text-[10px] text-surface-600 truncate max-w-[80px]">
                            {site.label}
                        </span>
                        <span className="text-[10px] font-semibold text-surface-800">
                            ${formatCurrency(site.revenueAtRisk)}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    )
}

// Timeframe Toggle Component
function TimeframeToggle({ selected, onChange }) {
    return (
        <div className="flex items-center gap-1 p-1 bg-surface-100 rounded-lg">
            {TIMEFRAMES.map((tf) => (
                <button
                    key={tf.key}
                    onClick={() => onChange(tf)}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ${selected.key === tf.key
                        ? 'bg-surface-200 text-sun-green-300 shadow-sm border border-surface-200'
                        : 'text-surface-500 hover:text-surface-700 hover:bg-surface-200/50'
                        }`}
                >
                    {tf.label}
                </button>
            ))}
        </div>
    )
}

// Site breakdown item
function SiteBreakdownItem({ site, index, hourlyRate = 4200, timeMultiplier = 1 }) {
    const statusColors = {
        healthy: 'bg-emerald-500',
        warning: 'bg-amber-500',
        critical: 'bg-rose-500',
    }
    // Calculate actual revenue at risk: downtime * hourlyRate * capacity * timeMultiplier
    const revenueAtRisk = site.downtime * hourlyRate * parseFloat(site.capacity) * timeMultiplier

    return (
        <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex items-center justify-between py-2 border-b border-surface-200/50 last:border-0"
        >
            <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${statusColors[site.status]}`} />
                <div>
                    <p className="text-sm text-surface-900 font-medium">{site.name}</p>
                    <p className="text-[10px] text-surface-500">{site.location} • {site.capacity}</p>
                </div>
            </div>
            <div className="text-right">
                <p className="text-sm font-bold text-rose-400">
                    ${formatCurrency(revenueAtRisk)}
                </p>
                <p className="text-[10px] text-surface-500">{site.downtime}h down</p>
            </div>
        </motion.div>
    )
}

// Main gauge component
export default function RevenueAtRiskGauge({
    sites = [],
    hourlyRate = 4200, // $ per hour per MW
    className = ''
}) {
    const [showBreakdown, setShowBreakdown] = useState(true)
    const [animatedProgress, setAnimatedProgress] = useState(0)
    const [selectedTimeframe, setSelectedTimeframe] = useState(TIMEFRAMES[0]) // Default: Today

    // Calculate total revenue at risk and total potential revenue from all sites
    const riskData = useMemo(() => {
        const timeMultiplier = selectedTimeframe.multiplier

        // Calculate total capacity of all sites (for total potential revenue)
        const totalCapacity = sites.reduce((acc, site) => acc + parseFloat(site.capacity), 0)

        // Assume 24 hours of potential revenue per day at full capacity
        const dailyHours = 24
        const totalPotentialRevenue = totalCapacity * hourlyRate * dailyHours * timeMultiplier

        const sitesWithDowntime = sites.filter(s => s.downtime > 0)
        const totalRisk = sitesWithDowntime.reduce((acc, site) => {
            return acc + (site.downtime * hourlyRate * parseFloat(site.capacity) * timeMultiplier)
        }, 0)

        const totalDowntime = sitesWithDowntime.reduce((acc, s) => acc + s.downtime, 0) * timeMultiplier

        // Revenue at risk as percentage of total potential revenue
        const riskPercentage = totalPotentialRevenue > 0 ? (totalRisk / totalPotentialRevenue) * 100 : 0

        // Breakdown by asset category (simulated distribution)
        const assetBreakdown = assetCategories.map((cat, idx) => ({
            ...cat,
            value: totalRisk * [0.45, 0.25, 0.18, 0.12][idx], // Distribution weights
        }))

        return {
            total: totalRisk,
            totalPotentialRevenue,
            riskPercentage,
            totalDowntime,
            sites: sitesWithDowntime,
            assetBreakdown,
            severity: riskPercentage < 5 ? 'low' :
                riskPercentage < 15 ? 'medium' : 'high',
        }
    }, [sites, hourlyRate, selectedTimeframe])

    // Animate gauge on mount/update - now uses percentage (0-100, capped at 50% for visual)
    useEffect(() => {
        // Use percentage of total revenue, cap at 50% for gauge visual (never full)
        const targetProgress = Math.min(riskData.riskPercentage / 50, 0.95) // Max 95% visual fill

        const duration = 1500
        const startTime = Date.now()
        const startProgress = animatedProgress

        const animate = () => {
            const elapsed = Date.now() - startTime
            const progress = Math.min(elapsed / duration, 1)
            const eased = 1 - Math.pow(1 - progress, 3)

            setAnimatedProgress(startProgress + (targetProgress - startProgress) * eased)

            if (progress < 1) {
                requestAnimationFrame(animate)
            }
        }

        requestAnimationFrame(animate)
    }, [riskData.riskPercentage])

    // Calculate gauge colors based on severity
    const gaugeColors = {
        low: { primary: '#818CF8', glow: 'rgba(99, 102, 241, 0.4)' },
        medium: { primary: '#22D3EE', glow: 'rgba(34, 211, 238, 0.4)' },
        high: { primary: '#FDA4AF', glow: 'rgba(244, 63, 94, 0.4)' },
    }

    const currentColor = gaugeColors[riskData.severity]
    const currentAngle = GAUGE_CONFIG.startAngle +
        (GAUGE_CONFIG.endAngle - GAUGE_CONFIG.startAngle) * animatedProgress

    const cx = 110
    const cy = 110

    // Dynamic label based on timeframe
    const timeframeLabel = selectedTimeframe.key === 'today'
        ? 'at risk today'
        : selectedTimeframe.key === '7days'
            ? 'at risk (7 days)'
            : 'at risk (30 days)'

    return (
        <div className={`glass-card p-6 ${className}`}>
            {/* Header with Timeframe Toggle */}
            <div className="flex flex-col gap-3 mb-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center">
                            <AlertTriangle className="w-5 h-5 text-rose-400" />
                        </div>
                        <div>
                            <h3 className="text-surface-900 font-semibold">Revenue at Risk</h3>
                            <p className="text-xs text-surface-500">Real-time loss calculation</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-surface-200/50">
                        <Clock className="w-3 h-3 text-surface-600" />
                        <span className="text-[10px] text-surface-600">Live</span>
                    </div>
                </div>
                {/* Timeframe Toggle */}
                <TimeframeToggle
                    selected={selectedTimeframe}
                    onChange={setSelectedTimeframe}
                />
            </div>

            {/* Gauge SVG */}
            <div className="relative flex justify-center mb-4">
                <svg width="220" height="160" viewBox="0 0 220 160">
                    <defs>
                        {/* Gradient for gauge track */}
                        <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#818CF8" />
                            <stop offset="50%" stopColor="#22D3EE" />
                            <stop offset="100%" stopColor="#FDA4AF" />
                        </linearGradient>

                        {/* Glow filter */}
                        <filter id="riskGlow" x="-50%" y="-50%" width="200%" height="200%">
                            <feGaussianBlur stdDeviation="4" result="blur" />
                            <feMerge>
                                <feMergeNode in="blur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>

                    {/* Background track */}
                    <path
                        d={describeArc(cx, cy, GAUGE_CONFIG.radius, GAUGE_CONFIG.startAngle, GAUGE_CONFIG.endAngle)}
                        fill="none"
                        stroke="rgba(255,255,255,0.05)"
                        strokeWidth={GAUGE_CONFIG.strokeWidth + 4}
                        strokeLinecap="round"
                    />

                    {/* Gradient track */}
                    <path
                        d={describeArc(cx, cy, GAUGE_CONFIG.radius, GAUGE_CONFIG.startAngle, GAUGE_CONFIG.endAngle)}
                        fill="none"
                        stroke="url(#gaugeGradient)"
                        strokeWidth={GAUGE_CONFIG.strokeWidth}
                        strokeLinecap="round"
                        opacity="0.3"
                    />

                    {/* Active arc */}
                    <path
                        d={describeArc(cx, cy, GAUGE_CONFIG.radius, GAUGE_CONFIG.startAngle, currentAngle)}
                        fill="none"
                        stroke={currentColor.primary}
                        strokeWidth={GAUGE_CONFIG.strokeWidth}
                        strokeLinecap="round"
                        filter="url(#riskGlow)"
                    />

                    {/* Needle */}
                    <g transform={`rotate(${currentAngle}, ${cx}, ${cy})`}>
                        <line
                            x1={cx}
                            y1={cy}
                            x2={cx}
                            y2={cy - GAUGE_CONFIG.radius + 20}
                            stroke={currentColor.primary}
                            strokeWidth="3"
                            strokeLinecap="round"
                            filter="url(#riskGlow)"
                        />
                    </g>

                    {/* Threshold marks - now represent percentage of total revenue */}
                    {[0, 0.25, 0.5, 0.75, 1].map((pos, i) => {
                        const angle = GAUGE_CONFIG.startAngle + (GAUGE_CONFIG.endAngle - GAUGE_CONFIG.startAngle) * pos
                        const outer = polarToCartesian(cx, cy, GAUGE_CONFIG.radius + 15, angle)
                        const inner = polarToCartesian(cx, cy, GAUGE_CONFIG.radius + 8, angle)
                        return (
                            <g key={i}>
                                <line
                                    x1={inner.x}
                                    y1={inner.y}
                                    x2={outer.x}
                                    y2={outer.y}
                                    stroke="rgba(255,255,255,0.2)"
                                    strokeWidth="2"
                                />
                            </g>
                        )
                    })}

                    {/* Labels - now represent percentage of total revenue */}
                    <text x="25" y="145" fontSize="10" fill="#94A3B8">0%</text>
                    <text x="95" y="30" fontSize="10" fill="#94A3B8">25%</text>
                    <text x="180" y="145" fontSize="10" fill="#94A3B8">50%</text>
                </svg>

                {/* Center value display */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 translate-y-2 text-center">
                    <div className="text-3xl font-bold text-surface-900 tracking-tight">
                        <AnimatedCounter value={riskData.total} prefix="$" />
                    </div>
                    <div className="text-xs text-surface-500 mt-1">{timeframeLabel}</div>
                </div>
            </div>

            {/* Quick Stats - Updated labels */}
            <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="p-3 rounded-xl bg-surface-200/50 text-center">
                    <p className="text-xl font-bold text-amber-400">{riskData.sites.length}</p>
                    <p className="text-[10px] text-surface-500">Sites Affected</p>
                </div>
                <div className="p-3 rounded-xl bg-surface-200/50 text-center">
                    <p className="text-xl font-bold text-rose-400">
                        {riskData.riskPercentage.toFixed(1)}%
                    </p>
                    <p className="text-[10px] text-surface-500">Revenue at Risk</p>
                </div>
                <div className="p-3 rounded-xl bg-surface-200/50 text-center">
                    <p className="text-xl font-bold text-amber-400">
                        {riskData.totalDowntime.toFixed(1)}h
                    </p>
                    <p className="text-[10px] text-surface-500">Total Downtime</p>
                </div>
            </div>

            {/* Site Revenue Breakdown Chart */}
            <div className="mb-4 p-4 rounded-xl bg-surface-300/25 border border-surface-200">
                <div className="flex items-center gap-2 mb-3">
                    <MapPin className="w-4 h-4 text-rose-400" />
                    <p className="text-xs font-semibold text-surface-700 uppercase tracking-wider">
                        Revenue at Risk by Site
                    </p>
                </div>
                <SiteRevenueChart
                    sites={sites}
                    hourlyRate={hourlyRate}
                    timeMultiplier={selectedTimeframe.multiplier}
                />
            </div>

            {/* Breakdown Toggle */}
            <button
                onClick={() => setShowBreakdown(!showBreakdown)}
                className="flex items-center justify-between w-full py-2 px-3 rounded-lg bg-surface-200/30 hover:bg-surface-200/50 transition-colors"
            >
                <span className="text-sm text-surface-700 font-medium">Asset & Site Details</span>
                {showBreakdown ? (
                    <ChevronUp className="w-4 h-4 text-surface-600" />
                ) : (
                    <ChevronDown className="w-4 h-4 text-surface-600" />
                )}
            </button>

            {/* Breakdown Panel */}
            <AnimatePresence>
                {showBreakdown && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="pt-4 space-y-4">
                            {/* By Asset Category */}
                            <div>
                                <p className="text-xs text-surface-500 mb-2 uppercase tracking-wider">By Asset Category</p>
                                <BreakdownBar items={riskData.assetBreakdown} total={riskData.total} />
                            </div>

                            {/* By Site - Scrollable List */}
                            <div>
                                <p className="text-xs text-surface-500 mb-2 uppercase tracking-wider">Site Details</p>
                                <div className="max-h-[120px] overflow-y-auto space-y-1 pr-1 scrollbar-thin scrollbar-thumb-carbon-700 scrollbar-track-transparent">
                                    {riskData.sites.map((site, idx) => (
                                        <SiteBreakdownItem
                                            key={site.id}
                                            site={site}
                                            index={idx}
                                            hourlyRate={hourlyRate}
                                            timeMultiplier={selectedTimeframe.multiplier}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

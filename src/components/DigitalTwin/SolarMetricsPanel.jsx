import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Sun,
    Zap,
    Battery,
    Thermometer,
    Droplets,
    Wind,
    Calendar,
    Clock,
    AlertTriangle,
    CheckCircle2,
    Wrench,
    TrendingUp,
    TrendingDown
} from 'lucide-react'
import {
    SOLAR_METRICS,
    ENVIRONMENTAL_DATA,
    MAINTENANCE_TICKETS
} from '../../data/digitalTwinData'

/**
 * SemiCircularGauge - Speedometer-style gauge with Low/Moderate/High segments
 * Similar to the reference design with graduated color zones and animated needle
 */
function SemiCircularGauge({ value, max = 100, label, unit, color = 'sun-green', thresholds }) {
    const percentage = Math.min((value / max) * 100, 100)

    // Gauge geometry - proper semi-circle arc
    // 0° = right (3 o'clock), 90° = bottom (6 o'clock), 180° = left (9 o'clock), 270° = top (12 o'clock)
    // For a speedometer: start at bottom-left (135°), sweep through top to bottom-right (45°)
    const startAngle = 225  // Bottom-left (7-8 o'clock position)
    const endAngle = 315    // Bottom-right (4-5 o'clock position)
    const sweepAngle = 270  // Total sweep (225° to 315° going through 270° top = 270°)
    const radius = 55
    const centerX = 100
    const centerY = 65

    // Convert angle to radians (SVG uses clockwise from 3 o'clock)
    const toRadians = (deg) => (deg - 90) * (Math.PI / 180)

    // Convert polar to cartesian
    const polarToCartesian = (cx, cy, r, angleDeg) => {
        const angleRad = toRadians(angleDeg)
        return {
            x: cx + r * Math.cos(angleRad),
            y: cy + r * Math.sin(angleRad)
        }
    }

    // Create arc path - proper SVG arc
    const describeArc = (cx, cy, r, start, end) => {
        const startPoint = polarToCartesian(cx, cy, r, start)
        const endPoint = polarToCartesian(cx, cy, r, end)
        const largeArcFlag = (end - start) <= 180 ? 0 : 1
        return `M ${startPoint.x} ${startPoint.y} A ${r} ${r} 0 ${largeArcFlag} 1 ${endPoint.x} ${endPoint.y}`
    }

    // Calculate needle angle based on percentage (0% = startAngle, 100% = endAngle)
    const needleAngleDeg = startAngle + (percentage / 100) * sweepAngle

    // Determine status based on percentage or custom thresholds
    const getStatus = () => {
        if (thresholds) {
            if (value >= thresholds.good) return { label: 'High', color: 'emerald' }
            if (value >= thresholds.warning) return { label: 'Moderate', color: 'amber' }
            return { label: 'Low', color: 'rose' }
        }
        if (percentage >= 70) return { label: 'High', color: 'emerald' }
        if (percentage >= 40) return { label: 'Moderate', color: 'amber' }
        return { label: 'Low', color: 'rose' }
    }

    const status = getStatus()

    // Color configurations
    const needleColors = {
        'emerald': '#818CF8',
        'amber': '#22D3EE',
        'rose': '#FDA4AF',
        'sun-green': '#22D3EE',
        'blue': '#22D3EE'
    }

    const textColorClasses = {
        'emerald': 'text-emerald-400',
        'amber': 'text-amber-400',
        'rose': 'text-rose-400',
        'sun-green': 'text-sun-green-300',
        'blue': 'text-blue-400'
    }

    // Tick marks positions (percentage along the arc)
    const tickMarks = [0, 50, 100]

    // Calculate needle tip position
    const needleTip = polarToCartesian(centerX, centerY, radius - 15, needleAngleDeg)
    const needleBase = polarToCartesian(centerX, centerY, 10, needleAngleDeg)

    return (
        <div className="flex flex-col items-center p-4 rounded-xl bg-surface-200/30 border border-surface-300/30">
            {/* Label at top */}
            <div className="flex items-center justify-between w-full mb-2">
                <span className="text-sm font-semibold text-surface-900">{label}</span>
                {/* Status indicators */}
                <div className="flex items-center gap-3 text-[10px]">
                    <span className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        <span className="text-surface-600">High</span>
                    </span>
                    <span className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                        <span className="text-surface-600">Moderate</span>
                    </span>
                    <span className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                        <span className="text-surface-600">Low</span>
                    </span>
                </div>
            </div>

            {/* SVG Gauge */}
            <div className="relative w-full" style={{ height: 90 }}>
                <svg width="100%" height="90" viewBox="0 0 200 90" preserveAspectRatio="xMidYMid meet">
                    <defs>
                        {/* Gradient for the gauge track - Red to Yellow to Green */}
                        <linearGradient id={`gaugeGradient-${label.replace(/\s/g, '')}`} x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#FDA4AF" />
                            <stop offset="40%" stopColor="#22D3EE" />
                            <stop offset="100%" stopColor="#818CF8" />
                        </linearGradient>
                        {/* Glow filter */}
                        <filter id={`glow-${label.replace(/\s/g, '')}`} x="-50%" y="-50%" width="200%" height="200%">
                            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                            <feMerge>
                                <feMergeNode in="coloredBlur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>

                    {/* Background arc (dark track) */}
                    <path
                        d={describeArc(centerX, centerY, radius, startAngle, startAngle + sweepAngle)}
                        fill="none"
                        stroke="#334155"
                        strokeWidth="12"
                        strokeLinecap="round"
                    />

                    {/* Colored gradient arc */}
                    <path
                        d={describeArc(centerX, centerY, radius, startAngle, startAngle + sweepAngle)}
                        fill="none"
                        stroke={`url(#gaugeGradient-${label.replace(/\s/g, '')})`}
                        strokeWidth="10"
                        strokeLinecap="round"
                    />

                    {/* Tick marks and labels */}
                    {tickMarks.map((tick) => {
                        const tickAngle = startAngle + (tick / 100) * sweepAngle
                        const innerPoint = polarToCartesian(centerX, centerY, radius + 8, tickAngle)
                        const outerPoint = polarToCartesian(centerX, centerY, radius + 14, tickAngle)
                        const labelPoint = polarToCartesian(centerX, centerY, radius + 24, tickAngle)
                        return (
                            <g key={tick}>
                                <line
                                    x1={innerPoint.x}
                                    y1={innerPoint.y}
                                    x2={outerPoint.x}
                                    y2={outerPoint.y}
                                    stroke="#64748B"
                                    strokeWidth="1.5"
                                />
                                <text
                                    x={labelPoint.x}
                                    y={labelPoint.y}
                                    fill="#94A3B8"
                                    fontSize="8"
                                    textAnchor="middle"
                                    dominantBaseline="middle"
                                >
                                    {tick}
                                </text>
                            </g>
                        )
                    })}

                    {/* Animated Needle */}
                    <motion.g
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        {/* Needle line */}
                        <motion.line
                            x1={centerX}
                            y1={centerY}
                            initial={{
                                x2: polarToCartesian(centerX, centerY, radius - 12, startAngle).x,
                                y2: polarToCartesian(centerX, centerY, radius - 12, startAngle).y
                            }}
                            animate={{
                                x2: polarToCartesian(centerX, centerY, radius - 12, needleAngleDeg).x,
                                y2: polarToCartesian(centerX, centerY, radius - 12, needleAngleDeg).y
                            }}
                            transition={{ duration: 1.2, ease: "easeOut", type: "spring", damping: 15 }}
                            stroke={needleColors[status.color]}
                            strokeWidth="3"
                            strokeLinecap="round"
                            filter={`url(#glow-${label.replace(/\s/g, '')})`}
                        />
                        {/* Needle center cap */}
                        <circle
                            cx={centerX}
                            cy={centerY}
                            r="6"
                            fill="#1E293B"
                            stroke={needleColors[status.color]}
                            strokeWidth="2"
                        />
                        <circle
                            cx={centerX}
                            cy={centerY}
                            r="3"
                            fill={needleColors[status.color]}
                        />
                    </motion.g>
                </svg>
            </div>

            {/* Value display below gauge */}
            <div className="flex items-baseline gap-1 mt-1">
                <motion.span
                    className={`text-3xl font-bold ${textColorClasses[status.color]}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.3 }}
                >
                    {typeof value === 'number' ? value.toLocaleString() : value}
                </motion.span>
                <span className="text-sm text-surface-500">{unit}</span>
            </div>

            {/* Current status pill */}
            <motion.div
                className={`mt-2 px-3 py-1 rounded-full text-xs font-medium ${status.color === 'emerald' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                    status.color === 'amber' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                        'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                    }`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 }}
            >
                ● {status.label} Performance
            </motion.div>
        </div>
    )
}

/**
 * TimeframeToggle - Day/Month/Year selector
 */
function TimeframeToggle({ value, onChange }) {
    const options = [
        { key: 'day', label: 'Day' },
        { key: 'month', label: 'Month' },
        { key: 'year', label: 'Year' }
    ]

    return (
        <div className="flex items-center gap-1 p-1 rounded-xl bg-surface-200/50 border border-surface-300/50">
            {options.map((option) => (
                <button
                    key={option.key}
                    onClick={() => onChange(option.key)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${value === option.key
                        ? 'bg-sun-green-500/20 text-sun-green-300 border border-sun-green-500/30'
                        : 'text-surface-600 hover:text-surface-900 hover:bg-surface-300/50'
                        }`}
                >
                    {option.label}
                </button>
            ))}
        </div>
    )
}

/**
 * SparklineChart - Mini chart for history data
 */
function SparklineChart({ data, color = 'sun-green', height = 32 }) {
    const max = Math.max(...data)
    const min = Math.min(...data)
    const range = max - min || 1

    const points = data.map((value, i) => {
        const x = (i / (data.length - 1)) * 100
        const y = 100 - ((value - min) / range) * 80 - 10
        return `${x},${y}`
    }).join(' ')

    const colorMap = {
        'sun-green': '#22D3EE',
        'emerald': '#818CF8',
        'blue': '#22D3EE',
        'rose': '#FDA4AF'
    }
    const strokeColor = colorMap[color] || colorMap['sun-green']

    return (
        <svg width="100%" height={height} viewBox="0 0 100 100" preserveAspectRatio="none">
            <polyline
                fill="none"
                stroke={strokeColor}
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={points}
                style={{ filter: `drop-shadow(0 0 4px ${strokeColor}50)` }}
            />
        </svg>
    )
}

/**
 * EnvironmentalStat - Individual environmental metric display
 */
function EnvironmentalStat({ icon: Icon, label, value, unit, subValue, color = 'blue' }) {
    const colorClasses = {
        'blue': 'text-blue-400 bg-blue-500/10 border-blue-500/30',
        'amber': 'text-amber-400 bg-amber-500/10 border-amber-500/30',
        'rose': 'text-rose-400 bg-rose-500/10 border-rose-500/30',
        'emerald': 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
    }

    return (
        <div className={`p-3 rounded-xl border ${colorClasses[color]} bg-opacity-50`}>
            <div className="flex items-center gap-2 mb-2">
                <Icon className={`w-4 h-4 ${colorClasses[color].split(' ')[0]}`} />
                <span className="text-xs text-surface-600">{label}</span>
            </div>
            <div className="flex items-baseline gap-1">
                <span className="text-xl font-bold text-surface-900">{value}</span>
                <span className="text-xs text-surface-500">{unit}</span>
            </div>
            {subValue && (
                <p className="text-[10px] text-surface-500 mt-1">{subValue}</p>
            )}
        </div>
    )
}

/**
 * TicketStatusDonut - Enhanced donut chart for ticket status with priority breakdown
 */
function TicketStatusDonut({ open, resolved, activeTickets = [] }) {
    const total = open + resolved
    const openPercentage = (open / total) * 100
    const resolvedPercentage = (resolved / total) * 100
    const resolutionRate = ((resolved / total) * 100).toFixed(0)

    const circumference = 2 * Math.PI * 40
    const openDash = (openPercentage / 100) * circumference
    const resolvedDash = (resolvedPercentage / 100) * circumference

    // Calculate priority breakdown from active tickets
    const priorityBreakdown = activeTickets.reduce((acc, ticket) => {
        // Map severity to priority: critical -> critical, warning -> high, info -> medium
        if (ticket.severity === 'critical') acc.critical++
        else if (ticket.severity === 'warning') acc.high++
        else if (ticket.severity === 'info') acc.medium++
        else acc.low++
        return acc
    }, { critical: 0, high: 0, medium: 0, low: 0 })

    const totalPriority = priorityBreakdown.critical + priorityBreakdown.high + priorityBreakdown.medium + priorityBreakdown.low

    return (
        <div className="space-y-4">
            {/* Top Row: Donut + Quick Stats */}
            <div className="flex items-start gap-4">
                {/* Smaller Donut Chart */}
                <div className="relative w-24 h-24 flex-shrink-0">
                    <svg width="96" height="96" viewBox="0 0 96 96" className="-rotate-90">
                        {/* Background circle */}
                        <circle
                            cx="48"
                            cy="48"
                            r="40"
                            fill="none"
                            stroke="#334155"
                            strokeWidth="10"
                        />
                        {/* Resolved segment */}
                        <motion.circle
                            cx="48"
                            cy="48"
                            r="40"
                            fill="none"
                            stroke="#818CF8"
                            strokeWidth="10"
                            strokeDasharray={`${resolvedDash} ${circumference}`}
                            strokeLinecap="round"
                            initial={{ strokeDashoffset: circumference }}
                            animate={{ strokeDashoffset: 0 }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            style={{ filter: 'drop-shadow(0 0 4px rgba(99, 102, 241, 0.4))' }}
                        />
                        {/* Open segment */}
                        <motion.circle
                            cx="48"
                            cy="48"
                            r="40"
                            fill="none"
                            stroke="#22D3EE"
                            strokeWidth="10"
                            strokeDasharray={`${openDash} ${circumference}`}
                            strokeDashoffset={-resolvedDash}
                            strokeLinecap="round"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            style={{ filter: 'drop-shadow(0 0 4px rgba(34, 211, 238, 0.4))' }}
                        />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-2xl font-bold text-surface-900">{total}</span>
                        <span className="text-[10px] text-surface-600">total</span>
                    </div>
                </div>

                {/* Status Legend + Stats */}
                <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-amber-500" />
                            <span className="text-sm text-surface-700">Open</span>
                        </div>
                        <span className="text-lg font-bold text-amber-400">{open}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-emerald-500" />
                            <span className="text-sm text-surface-700">Resolved</span>
                        </div>
                        <span className="text-lg font-bold text-emerald-400">{resolved}</span>
                    </div>
                    <div className="pt-2 border-t border-surface-300/50">
                        <div className="flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-xs font-medium text-emerald-400">{resolutionRate}% resolution rate</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Priority Breakdown Bar */}
            {totalPriority > 0 && (
                <div className="p-3 rounded-lg bg-surface-200/50 border border-surface-300/30">
                    <p className="text-xs text-surface-600 mb-2">Active Tickets by Priority</p>
                    <div className="flex gap-0.5 h-3 rounded-full overflow-hidden bg-surface-300/50">
                        {priorityBreakdown.critical > 0 && (
                            <motion.div
                                className="bg-rose-500 h-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${(priorityBreakdown.critical / totalPriority) * 100}%` }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                                title="Critical"
                            />
                        )}
                        {priorityBreakdown.high > 0 && (
                            <motion.div
                                className="bg-amber-500 h-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${(priorityBreakdown.high / totalPriority) * 100}%` }}
                                transition={{ duration: 0.8, delay: 0.3 }}
                                title="High"
                            />
                        )}
                        {priorityBreakdown.medium > 0 && (
                            <motion.div
                                className="bg-blue-500 h-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${(priorityBreakdown.medium / totalPriority) * 100}%` }}
                                transition={{ duration: 0.8, delay: 0.4 }}
                                title="Medium"
                            />
                        )}
                        {priorityBreakdown.low > 0 && (
                            <motion.div
                                className="bg-carbon-500 h-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${(priorityBreakdown.low / totalPriority) * 100}%` }}
                                transition={{ duration: 0.8, delay: 0.5 }}
                                title="Low"
                            />
                        )}
                    </div>
                    <div className="flex items-center justify-between mt-2">
                        {priorityBreakdown.critical > 0 && (
                            <span className="flex items-center gap-1 text-[10px]">
                                <span className="w-2 h-2 rounded-sm bg-rose-500"></span>
                                <span className="text-surface-600">Critical</span>
                                <span className="text-rose-400 font-medium">({priorityBreakdown.critical})</span>
                            </span>
                        )}
                        {priorityBreakdown.high > 0 && (
                            <span className="flex items-center gap-1 text-[10px]">
                                <span className="w-2 h-2 rounded-sm bg-amber-500"></span>
                                <span className="text-surface-600">High</span>
                                <span className="text-amber-400 font-medium">({priorityBreakdown.high})</span>
                            </span>
                        )}
                        {priorityBreakdown.medium > 0 && (
                            <span className="flex items-center gap-1 text-[10px]">
                                <span className="w-2 h-2 rounded-sm bg-blue-500"></span>
                                <span className="text-surface-600">Medium</span>
                                <span className="text-blue-400 font-medium">({priorityBreakdown.medium})</span>
                            </span>
                        )}
                        {priorityBreakdown.low > 0 && (
                            <span className="flex items-center gap-1 text-[10px]">
                                <span className="w-2 h-2 rounded-sm bg-carbon-500"></span>
                                <span className="text-surface-600">Low</span>
                                <span className="text-surface-600 font-medium">({priorityBreakdown.low})</span>
                            </span>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

/**
 * TicketCard - Individual maintenance ticket display
 */
function TicketCard({ ticket }) {
    const severityColors = {
        critical: 'border-rose-500/50 bg-rose-500/10',
        warning: 'border-amber-500/50 bg-amber-500/10',
        info: 'border-blue-500/50 bg-blue-500/10'
    }
    const severityTextColors = {
        critical: 'text-rose-400',
        warning: 'text-amber-400',
        info: 'text-blue-400'
    }

    return (
        <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className={`p-3 rounded-lg border ${severityColors[ticket.severity]}`}
        >
            <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <AlertTriangle className={`w-3.5 h-3.5 ${severityTextColors[ticket.severity]}`} />
                        <span className="text-sm font-medium text-surface-900 truncate">{ticket.title}</span>
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                        <span className="text-[10px] text-surface-500">{ticket.id}</span>
                        <span className="text-[10px] text-surface-500">Asset: {ticket.asset}</span>
                    </div>
                </div>
                <span className={`text-[10px] font-medium px-2 py-0.5 rounded ${severityColors[ticket.severity]} ${severityTextColors[ticket.severity]}`}>
                    {ticket.severity.toUpperCase()}
                </span>
            </div>
        </motion.div>
    )
}

/**
 * SolarMetricsPanel - Main component for solar performance visualization
 */
export default function SolarMetricsPanel({ className = '' }) {
    const [timeframe, setTimeframe] = useState('day')

    const metrics = useMemo(() => ({
        efficiency: SOLAR_METRICS.efficiency[timeframe],
        powerGeneration: SOLAR_METRICS.powerGeneration[timeframe],
        energyConsumed: SOLAR_METRICS.energyConsumed[timeframe]
    }), [timeframe])

    const getUnitForTimeframe = (base) => {
        if (timeframe === 'year') return base.replace('kWh', 'MWh')
        return base
    }

    return (
        <div className={`space-y-6 ${className}`}>
            {/* Performance Gauges */}
            <div className="glass-card p-6">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-1 h-6 rounded-full bg-sun-green-500" />
                        <h3 className="text-lg font-semibold text-surface-900">Solar Performance</h3>
                    </div>
                    <TimeframeToggle value={timeframe} onChange={setTimeframe} />
                </div>

                <div className="grid grid-cols-3 gap-4">
                    <SemiCircularGauge
                        value={metrics.efficiency}
                        max={100}
                        label="Solar Efficiency"
                        unit="%"
                        color="sun-amber"
                        thresholds={SOLAR_METRICS.efficiency.thresholds}
                    />
                    <SemiCircularGauge
                        value={timeframe === 'year' ? (metrics.powerGeneration / 1000).toFixed(1) : metrics.powerGeneration}
                        max={timeframe === 'day' ? 500 : timeframe === 'month' ? 15000 : 150}
                        label="Power Generation"
                        unit={timeframe === 'year' ? 'MWh' : 'kWh'}
                        color="emerald"
                    />
                    <SemiCircularGauge
                        value={timeframe === 'year' ? (metrics.energyConsumed / 1000).toFixed(1) : metrics.energyConsumed}
                        max={timeframe === 'day' ? 400 : timeframe === 'month' ? 12000 : 120}
                        label="Energy Consumed"
                        unit={timeframe === 'year' ? 'MWh' : 'kWh'}
                        color="blue"
                    />
                </div>
            </div>

            {/* Environmental Statistics */}
            <div className="glass-card p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-1 h-6 rounded-full bg-blue-500" />
                    <h3 className="text-lg font-semibold text-surface-900">Environmental Conditions</h3>
                </div>

                <div className="grid grid-cols-4 gap-5">
                    {/* Irradiance Card */}
                    <div className="p-5 rounded-xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 to-amber-500/5">
                        <div className="flex items-center gap-2 mb-4">
                            <Sun className="w-5 h-5 text-amber-400" />
                            <span className="text-sm font-semibold text-amber-400">Irradiance</span>
                        </div>
                        <div className="flex items-baseline gap-2 mb-3">
                            <span className="text-4xl font-bold text-surface-900">{ENVIRONMENTAL_DATA.irradiance.current}</span>
                            <span className="text-base text-surface-600">W/m²</span>
                        </div>
                        <div className="h-14 mb-4">
                            <SparklineChart data={ENVIRONMENTAL_DATA.irradiance.history} color="sun-amber" height={56} />
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-surface-600">Peak: <span className="text-amber-400 font-medium">{ENVIRONMENTAL_DATA.irradiance.peak}</span></span>
                            <span className="text-surface-600">Avg: <span className="text-amber-400 font-medium">{ENVIRONMENTAL_DATA.irradiance.average}</span></span>
                        </div>
                    </div>

                    {/* Ambient Temperature Card */}
                    <div className="p-5 rounded-xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 to-amber-500/5">
                        <div className="flex items-center gap-2 mb-4">
                            <Thermometer className="w-5 h-5 text-amber-400" />
                            <span className="text-sm font-semibold text-amber-400">Ambient Temp</span>
                        </div>
                        <div className="flex items-baseline gap-2 mb-3">
                            <span className="text-4xl font-bold text-surface-900">{ENVIRONMENTAL_DATA.ambientTemperature.current}</span>
                            <span className="text-base text-surface-600">°C</span>
                        </div>
                        <div className="h-14 mb-4">
                            <SparklineChart data={ENVIRONMENTAL_DATA.ambientTemperature.history} color="sun-amber" height={56} />
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-surface-600">Min: <span className="text-amber-400 font-medium">{ENVIRONMENTAL_DATA.ambientTemperature.min}°</span></span>
                            <span className="text-surface-600">Max: <span className="text-amber-400 font-medium">{ENVIRONMENTAL_DATA.ambientTemperature.max}°</span></span>
                        </div>
                    </div>

                    {/* Module Temperature Card */}
                    <div className="p-5 rounded-xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 to-amber-500/5">
                        <div className="flex items-center gap-2 mb-4">
                            <Thermometer className="w-5 h-5 text-amber-400" />
                            <span className="text-sm font-semibold text-amber-400">Module Temp</span>
                        </div>
                        <div className="flex items-baseline gap-2 mb-3">
                            <span className="text-4xl font-bold text-surface-900">{ENVIRONMENTAL_DATA.moduleTemperature.current}</span>
                            <span className="text-base text-surface-600">°C</span>
                        </div>
                        <div className="h-14 mb-4">
                            <SparklineChart data={ENVIRONMENTAL_DATA.moduleTemperature.history} color="sun-amber" height={56} />
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-surface-600">Delta: <span className="text-amber-400 font-medium">+{ENVIRONMENTAL_DATA.moduleTemperature.delta}°</span></span>
                            <span className="text-surface-600">Peak: <span className="text-amber-400 font-medium">{ENVIRONMENTAL_DATA.moduleTemperature.max}°</span></span>
                        </div>
                    </div>

                    {/* Soiling Level Card */}
                    <div className={`p-5 rounded-xl border bg-gradient-to-br ${ENVIRONMENTAL_DATA.soiling.level > 10
                        ? 'border-rose-500/30 from-rose-500/10 to-rose-500/5'
                        : 'border-amber-500/30 from-amber-500/10 to-amber-500/5'}`}>
                        <div className="flex items-center gap-2 mb-4">
                            <Droplets className={`w-5 h-5 ${ENVIRONMENTAL_DATA.soiling.level > 10 ? 'text-rose-400' : 'text-amber-400'}`} />
                            <span className={`text-sm font-semibold ${ENVIRONMENTAL_DATA.soiling.level > 10 ? 'text-rose-400' : 'text-amber-400'}`}>Soiling Level</span>
                        </div>
                        <div className="flex items-baseline gap-2 mb-3">
                            <span className="text-4xl font-bold text-surface-900">{ENVIRONMENTAL_DATA.soiling.level}</span>
                            <span className="text-base text-surface-600">%</span>
                        </div>
                        <div className="h-14 mb-4">
                            <SparklineChart data={ENVIRONMENTAL_DATA.soiling.history} color={ENVIRONMENTAL_DATA.soiling.level > 10 ? 'rose' : 'sun-green'} height={56} />
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-surface-600">Threshold: <span className={`font-medium ${ENVIRONMENTAL_DATA.soiling.level > 10 ? 'text-rose-400' : 'text-amber-400'}`}>{ENVIRONMENTAL_DATA.soiling.threshold}%</span></span>
                            <span className="text-surface-600">Clean: <span className={`font-medium ${ENVIRONMENTAL_DATA.soiling.level > 10 ? 'text-rose-400' : 'text-amber-400'}`}>{ENVIRONMENTAL_DATA.soiling.daysUntilCleaning}d</span></span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Maintenance Status */}
            <div className="glass-card p-6">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-1 h-6 rounded-full bg-amber-500" />
                    <h3 className="text-lg font-semibold text-surface-900">Maintenance Status</h3>
                </div>

                <div className="grid grid-cols-12 gap-6">
                    {/* Ticket Status Donut - 5 cols */}
                    <div className="col-span-5">
                        <p className="text-sm text-surface-600 mb-4">Ticket Overview</p>
                        <TicketStatusDonut
                            open={MAINTENANCE_TICKETS.summary.open}
                            resolved={MAINTENANCE_TICKETS.summary.resolved}
                            activeTickets={MAINTENANCE_TICKETS.activeTickets}
                        />
                    </div>

                    {/* Active Tickets List - 7 cols */}
                    <div className="col-span-7">
                        <div className="flex items-center justify-between mb-4">
                            <p className="text-sm text-surface-600">Active Tickets ({MAINTENANCE_TICKETS.summary.open})</p>
                            <button className="text-xs text-sun-green-300 hover:text-sun-amber-300 transition-colors">
                                View All →
                            </button>
                        </div>
                        <div className="space-y-2 max-h-[180px] overflow-y-auto pr-2">
                            {MAINTENANCE_TICKETS.activeTickets.slice(0, 4).map((ticket) => (
                                <TicketCard key={ticket.id} ticket={ticket} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

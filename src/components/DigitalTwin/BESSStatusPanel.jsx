import React, { useMemo } from 'react'
import { motion } from 'framer-motion'
import {
    Battery,
    BatteryCharging,
    Zap,
    Thermometer,
    Activity,
    RefreshCw,
    ArrowUp,
    ArrowDown,
    Minus,
    Clock,
    CheckCircle2,
    AlertCircle,
    Gauge,
    Timer,
    TrendingUp
} from 'lucide-react'
import { BESS_DATA, hasBESSAssets } from '../../data/digitalTwinData'

/**
 * BatteryGauge - Vertical battery visualization with fill level
 */
function BatteryGauge({ percentage, mode = 'idle', size = 'large' }) {
    const isLarge = size === 'large'
    const height = isLarge ? 160 : 80
    const width = isLarge ? 80 : 40
    const fillHeight = (percentage / 100) * (height - 20)

    const getModeColor = () => {
        switch (mode) {
            case 'charge': return { fill: '#818CF8', glow: 'rgba(99, 102, 241, 0.5)' }
            case 'discharge': return { fill: '#22D3EE', glow: 'rgba(59, 130, 246, 0.5)' }
            default: return { fill: '#94A3B8', glow: 'rgba(107, 114, 128, 0.3)' }
        }
    }

    const colors = getModeColor()

    return (
        <div className="relative" style={{ width, height: height + 10 }}>
            <svg width={width} height={height + 10} viewBox={`0 0 ${width} ${height + 10}`}>
                {/* Battery cap */}
                <rect
                    x={width * 0.3}
                    y={0}
                    width={width * 0.4}
                    height={8}
                    rx={2}
                    fill="#334155"
                />
                {/* Battery body outline */}
                <rect
                    x={2}
                    y={10}
                    width={width - 4}
                    height={height - 10}
                    rx={6}
                    fill="none"
                    stroke="#334155"
                    strokeWidth={2}
                />
                {/* Battery body background */}
                <rect
                    x={6}
                    y={14}
                    width={width - 12}
                    height={height - 18}
                    rx={4}
                    fill="#1E293B"
                />
                {/* Battery fill */}
                <motion.rect
                    x={6}
                    y={height - fillHeight - 4}
                    width={width - 12}
                    rx={4}
                    fill={colors.fill}
                    initial={{ height: 0 }}
                    animate={{ height: Math.max(fillHeight, 0) }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    style={{ filter: `drop-shadow(0 0 8px ${colors.glow})` }}
                />
                {/* Percentage segments */}
                {[25, 50, 75].map((level) => (
                    <line
                        key={level}
                        x1={8}
                        y1={height - ((level / 100) * (height - 20)) - 4}
                        x2={width - 8}
                        y2={height - ((level / 100) * (height - 20)) - 4}
                        stroke="#334155"
                        strokeWidth={1}
                        strokeDasharray="2 2"
                    />
                ))}
            </svg>
            {/* Percentage label */}
            <div className="absolute inset-0 flex items-center justify-center pt-4">
                <span className={`${isLarge ? 'text-2xl' : 'text-sm'} font-bold text-surface-900`}>
                    {percentage.toFixed(0)}%
                </span>
            </div>
            {/* Mode indicator */}
            {mode !== 'idle' && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute -right-2 top-1/2 -translate-y-1/2"
                >
                    {mode === 'charge' ? (
                        <ArrowDown className="w-5 h-5 text-emerald-400 animate-bounce" />
                    ) : (
                        <ArrowUp className="w-5 h-5 text-blue-400 animate-bounce" />
                    )}
                </motion.div>
            )}
        </div>
    )
}

/**
 * CircularGauge - Circular progress gauge for efficiency metrics
 */
function CircularGauge({ value, max = 100, target, label, unit, color = 'emerald' }) {
    const percentage = (value / max) * 100
    const circumference = 2 * Math.PI * 48
    const strokeDashoffset = circumference - (percentage / 100) * circumference

    const colorClasses = {
        emerald: { stroke: 'stroke-emerald-500', text: 'text-emerald-400', glow: 'drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]' },
        blue: { stroke: 'stroke-blue-500', text: 'text-blue-400', glow: 'drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]' },
        amber: { stroke: 'stroke-amber-500', text: 'text-amber-400', glow: 'drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]' },
    }

    const colors = colorClasses[color] || colorClasses.emerald
    const isAboveTarget = target && value >= target

    return (
        <div className="flex flex-col items-center">
            <div className="relative w-28 h-28">
                <svg width="112" height="112" viewBox="0 0 112 112" className="-rotate-90">
                    <circle
                        cx="56"
                        cy="56"
                        r="48"
                        fill="none"
                        stroke="#334155"
                        strokeWidth="8"
                    />
                    <motion.circle
                        cx="56"
                        cy="56"
                        r="48"
                        fill="none"
                        strokeWidth="8"
                        strokeLinecap="round"
                        className={`${colors.stroke} ${colors.glow}`}
                        initial={{ strokeDashoffset: circumference }}
                        animate={{ strokeDashoffset }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        style={{ strokeDasharray: circumference }}
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className={`text-2xl font-bold ${colors.text}`}>
                        {value.toFixed(1)}
                    </span>
                    <span className="text-xs text-surface-600">{unit}</span>
                </div>
            </div>
            <span className="text-sm font-medium text-surface-700 mt-3">{label}</span>
            {target && (
                <div className={`flex items-center gap-1 mt-1 text-xs ${isAboveTarget ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {isAboveTarget ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                    <span>Target: {target}%</span>
                </div>
            )}
        </div>
    )
}

/**
 * MetricCard - Small info card for BESS metrics
 */
function MetricCard({ icon: Icon, label, value, unit, subValue, color = 'gray' }) {
    const colorClasses = {
        gray: 'text-surface-600 bg-surface-200/50 border-surface-300/50',
        emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
        blue: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
        amber: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
        rose: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
    }

    return (
        <div className={`p-4 rounded-xl border ${colorClasses[color]}`}>
            <div className="flex items-center gap-2 mb-3">
                <Icon className={`w-5 h-5 ${colorClasses[color].split(' ')[0]}`} />
                <span className="text-sm text-surface-600">{label}</span>
            </div>
            <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-surface-900">{value}</span>
                <span className="text-sm text-surface-600">{unit}</span>
            </div>
            {subValue && (
                <p className="text-xs text-surface-500 mt-2">{subValue}</p>
            )}
        </div>
    )
}

/**
 * PowerFlowArrow - Animated arrow showing charge/discharge direction
 */
function PowerFlowArrow({ direction = 'discharge', power }) {
    const isCharging = direction === 'charge'

    return (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-surface-200/30 border border-surface-300/50">
            <div className={`flex items-center gap-2 ${isCharging ? 'flex-row-reverse' : ''}`}>
                <div className="relative">
                    <Zap className={`w-8 h-8 ${isCharging ? 'text-emerald-400' : 'text-blue-400'}`} />
                    <motion.div
                        className={`absolute inset-0 ${isCharging ? 'text-emerald-400' : 'text-blue-400'}`}
                        animate={{ opacity: [1, 0.3, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                    >
                        <Zap className="w-8 h-8" />
                    </motion.div>
                </div>
                <div className="flex flex-col items-center">
                    {isCharging ? (
                        <motion.div
                            animate={{ y: [0, 4, 0] }}
                            transition={{ duration: 0.8, repeat: Infinity }}
                        >
                            <ArrowDown className="w-5 h-5 text-emerald-400" />
                        </motion.div>
                    ) : (
                        <motion.div
                            animate={{ y: [0, -4, 0] }}
                            transition={{ duration: 0.8, repeat: Infinity }}
                        >
                            <ArrowUp className="w-5 h-5 text-blue-400" />
                        </motion.div>
                    )}
                </div>
            </div>
            <div>
                <p className={`text-lg font-bold ${isCharging ? 'text-emerald-400' : 'text-blue-400'}`}>
                    {power} kW
                </p>
                <p className="text-xs text-surface-500 capitalize">{direction}</p>
            </div>
        </div>
    )
}

/**
 * BESSChargeHistoryChart - Area chart showing charge/discharge over time
 */
function BESSChargeHistoryChart({ data }) {
    const maxPower = Math.max(...data.map(d => Math.abs(d.power)))
    const chartHeight = 80
    const chartWidth = 100

    // Create SVG path for power area
    const createAreaPath = (data, isPositive) => {
        const points = data.map((d, i) => {
            const x = (i / (data.length - 1)) * chartWidth
            const power = isPositive ? Math.max(d.power, 0) : Math.min(d.power, 0)
            const y = 50 - (power / maxPower) * 40
            return `${x},${y}`
        }).join(' L ')
        return `M 0,50 L ${points} L ${chartWidth},50 Z`
    }

    const chargePath = createAreaPath(data, true)
    const dischargePath = createAreaPath(data, false)

    return (
        <div className="p-4 rounded-xl bg-surface-200/30 border border-surface-300/50">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                    <span className="text-sm font-medium text-surface-900">24h Power Flow</span>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-[10px] text-surface-500 flex items-center gap-1">
                        <span className="w-2 h-2 rounded bg-emerald-500" /> Charge
                    </span>
                    <span className="text-[10px] text-surface-500 flex items-center gap-1">
                        <span className="w-2 h-2 rounded bg-blue-500" /> Discharge
                    </span>
                </div>
            </div>
            <svg width="100%" height={chartHeight} viewBox={`0 0 ${chartWidth} ${chartHeight}`} preserveAspectRatio="none">
                {/* Zero line */}
                <line x1="0" y1="50" x2={chartWidth} y2="50" stroke="#334155" strokeWidth="1" strokeDasharray="2 2" />
                {/* Charge area (positive) */}
                <motion.path
                    d={chargePath}
                    fill="url(#chargeGradient)"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.8 }}
                    transition={{ duration: 0.5 }}
                />
                {/* Discharge area (negative) */}
                <motion.path
                    d={dischargePath}
                    fill="url(#dischargeGradient)"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.8 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                />
                {/* Gradients */}
                <defs>
                    <linearGradient id="chargeGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#818CF8" stopOpacity="0.6" />
                        <stop offset="100%" stopColor="#818CF8" stopOpacity="0.1" />
                    </linearGradient>
                    <linearGradient id="dischargeGradient" x1="0" y1="1" x2="0" y2="0">
                        <stop offset="0%" stopColor="#22D3EE" stopOpacity="0.6" />
                        <stop offset="100%" stopColor="#22D3EE" stopOpacity="0.1" />
                    </linearGradient>
                </defs>
            </svg>
            <div className="flex justify-between mt-2">
                <span className="text-[10px] text-surface-500">00:00</span>
                <span className="text-[10px] text-surface-500">12:00</span>
                <span className="text-[10px] text-surface-500">Now</span>
            </div>
        </div>
    )
}

/**
 * TimeEstimateCard - Shows estimated time metrics
 */
function TimeEstimateCard({ icon: Icon, label, value, color = 'gray' }) {
    const colorClasses = {
        gray: 'text-surface-600 bg-surface-200/50 border-surface-300/50',
        emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
        blue: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
    }

    return (
        <div className={`p-4 rounded-xl border ${colorClasses[color]} flex items-center gap-4`}>
            <Icon className={`w-6 h-6 ${colorClasses[color].split(' ')[0]}`} />
            <div>
                <p className="text-xl font-bold text-surface-900">{value}</p>
                <p className="text-xs text-surface-600">{label}</p>
            </div>
        </div>
    )
}

/**
 * EmptyBESSState - Visually appealing notice when no BESS available
 */
function EmptyBESSState() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-8 flex flex-col items-center justify-center min-h-[300px]"
        >
            <div className="relative mb-6">
                <div className="w-20 h-20 rounded-2xl bg-surface-200/50 border border-surface-300/50 flex items-center justify-center">
                    <Battery className="w-10 h-10 text-surface-400" />
                </div>
                <motion.div
                    className="absolute -top-2 -right-2"
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                >
                    <div className="w-6 h-6 rounded-full bg-surface-200 border border-surface-300 flex items-center justify-center">
                        <Minus className="w-4 h-4 text-surface-500" />
                    </div>
                </motion.div>
            </div>
            <h4 className="text-lg font-semibold text-surface-900 mb-2">No BESS Available</h4>
            <p className="text-sm text-surface-500 text-center max-w-xs">
                This site does not have Battery Energy Storage System (BESS) units installed.
            </p>
            <div className="mt-6 px-4 py-2 rounded-lg bg-surface-200/30 border border-surface-300/50">
                <p className="text-xs text-surface-600">
                    💡 Consider adding BESS for peak shaving and energy arbitrage
                </p>
            </div>
        </motion.div>
    )
}

/**
 * BESSStatusPanel - Main component for BESS visualization
 */
export default function BESSStatusPanel({ site = null, className = '' }) {
    // Check if site has BESS assets
    const hasBESS = useMemo(() => {
        if (!site) return true // Default to showing mock data if no site
        return hasBESSAssets(site)
    }, [site])

    if (!hasBESS) {
        return <EmptyBESSState />
    }

    const data = BESS_DATA

    return (
        <div className={`space-y-4 ${className}`}>
            {/* Main BESS Status */}
            <div className="glass-card p-5">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-1 h-5 rounded-full bg-emerald-500" />
                    <h3 className="text-base font-semibold text-surface-900">BESS Status</h3>
                    <div className={`ml-auto flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-medium ${data.status === 'active'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-surface-200 text-surface-600 border border-surface-300'
                        }`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${data.status === 'active' ? 'bg-emerald-500 animate-pulse' : 'bg-carbon-500'}`} />
                        <span className="capitalize">{data.status}</span>
                    </div>
                </div>

                <div className="grid grid-cols-12 gap-4">
                    {/* Battery Visualization + Power Status - 5 cols total */}
                    <div className="col-span-5 flex gap-4">
                        {/* Battery Gauge - larger */}
                        <div className="flex flex-col items-center justify-center flex-shrink-0">
                            <BatteryGauge
                                percentage={data.capacityLeft.current}
                                mode={data.dischargeRate.mode}
                                size="large"
                            />
                            <div className="mt-3 text-center">
                                <p className="text-xl font-bold text-surface-900">
                                    {data.capacityLeft.availableMWh}
                                    <span className="text-sm text-surface-600 ml-1">/ {data.capacityLeft.totalMWh} MWh</span>
                                </p>
                                <p className="text-xs text-surface-500 mt-0.5">Available Capacity</p>
                            </div>
                        </div>

                        {/* Power Flow & Stats */}
                        <div className="flex-1 flex flex-col gap-3">
                            {/* Large Power Flow Display */}
                            <div className={`p-4 rounded-xl border ${data.dischargeRate.mode === 'charge'
                                ? 'bg-gradient-to-br from-emerald-500/15 to-emerald-500/5 border-emerald-500/30'
                                : data.dischargeRate.mode === 'discharge'
                                    ? 'bg-gradient-to-br from-blue-500/15 to-blue-500/5 border-blue-500/30'
                                    : 'bg-surface-200/50 border-surface-300/30'
                                }`}>
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        {data.dischargeRate.mode === 'charge' ? (
                                            <motion.div animate={{ y: [0, 3, 0] }} transition={{ duration: 0.8, repeat: Infinity }}>
                                                <ArrowDown className="w-5 h-5 text-emerald-400" />
                                            </motion.div>
                                        ) : data.dischargeRate.mode === 'discharge' ? (
                                            <motion.div animate={{ y: [0, -3, 0] }} transition={{ duration: 0.8, repeat: Infinity }}>
                                                <ArrowUp className="w-5 h-5 text-blue-400" />
                                            </motion.div>
                                        ) : (
                                            <Minus className="w-5 h-5 text-surface-600" />
                                        )}
                                        <span className={`text-sm font-medium capitalize ${data.dischargeRate.mode === 'charge'
                                            ? 'text-emerald-400'
                                            : data.dischargeRate.mode === 'discharge'
                                                ? 'text-blue-400'
                                                : 'text-surface-600'
                                            }`}>
                                            {data.dischargeRate.mode === 'idle' ? 'Standby' : data.dischargeRate.mode}
                                        </span>
                                    </div>
                                    <motion.div
                                        animate={{ opacity: [1, 0.4, 1] }}
                                        transition={{ duration: 1.5, repeat: Infinity }}
                                    >
                                        <Zap className={`w-6 h-6 ${data.dischargeRate.mode === 'charge'
                                            ? 'text-emerald-400'
                                            : data.dischargeRate.mode === 'discharge'
                                                ? 'text-blue-400'
                                                : 'text-surface-500'
                                            }`} />
                                    </motion.div>
                                </div>
                                <div className="flex items-baseline gap-2">
                                    <span className={`text-4xl font-bold ${data.dischargeRate.mode === 'charge'
                                        ? 'text-emerald-400'
                                        : data.dischargeRate.mode === 'discharge'
                                            ? 'text-blue-400'
                                            : 'text-surface-600'
                                        }`}>
                                        {data.dischargeRate.current}
                                    </span>
                                    <span className="text-lg text-surface-600">kW</span>
                                </div>
                                {/* Power progress bar */}
                                <div className="mt-3">
                                    <div className="flex justify-between text-[10px] text-surface-500 mb-1">
                                        <span>0</span>
                                        <span>Max: {data.dischargeRate.maxRate} kW</span>
                                    </div>
                                    <div className="h-2 bg-surface-300/50 rounded-full overflow-hidden">
                                        <motion.div
                                            className={`h-full rounded-full ${data.dischargeRate.mode === 'charge'
                                                ? 'bg-emerald-500'
                                                : data.dischargeRate.mode === 'discharge'
                                                    ? 'bg-blue-500'
                                                    : 'bg-carbon-600'
                                                }`}
                                            initial={{ width: 0 }}
                                            animate={{ width: `${(data.dischargeRate.current / data.dischargeRate.maxRate) * 100}%` }}
                                            transition={{ duration: 1 }}
                                            style={{ filter: data.dischargeRate.mode !== 'idle' ? 'drop-shadow(0 0 4px currentColor)' : 'none' }}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Time Estimates - larger */}
                            <div className="grid grid-cols-2 gap-2">
                                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                                            <Timer className="w-4 h-4 text-emerald-400" />
                                        </div>
                                        <span className="text-[10px] text-surface-600">Time to Full</span>
                                    </div>
                                    <p className="text-xl font-bold text-surface-900">{data.estimatedTimes?.timeToFull || '—'}</p>
                                </div>
                                <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/30">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                                            <Clock className="w-4 h-4 text-blue-400" />
                                        </div>
                                        <span className="text-[10px] text-surface-600">Runtime Left</span>
                                    </div>
                                    <p className="text-xl font-bold text-surface-900">{data.estimatedTimes?.runtimeRemaining || '—'}</p>
                                </div>
                            </div>

                            {/* Efficiency Stats Row */}
                            <div className="grid grid-cols-2 gap-2">
                                <div className="p-3 rounded-xl bg-surface-200/50 border border-surface-300/30">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-1.5">
                                            <ArrowDown className="w-4 h-4 text-emerald-400" />
                                            <span className="text-xs text-surface-600">Charge</span>
                                        </div>
                                        <span className="text-xs text-surface-500">Eff.</span>
                                    </div>
                                    <span className="text-2xl font-bold text-emerald-400">{data.efficiency.chargeEfficiency.toFixed(1)}%</span>
                                </div>
                                <div className="p-3 rounded-xl bg-surface-200/50 border border-surface-300/30">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-1.5">
                                            <ArrowUp className="w-4 h-4 text-blue-400" />
                                            <span className="text-xs text-surface-600">Discharge</span>
                                        </div>
                                        <span className="text-xs text-surface-500">Eff.</span>
                                    </div>
                                    <span className="text-2xl font-bold text-blue-400">{data.efficiency.dischargeEfficiency.toFixed(1)}%</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Efficiency Gauge & Chart - 4 cols */}
                    <div className="col-span-4 flex flex-col gap-3">
                        <div className="flex items-start gap-4">
                            {/* Round-Trip Efficiency - compact */}
                            <div className="flex-shrink-0">
                                <CircularGauge
                                    value={data.efficiency.roundTrip}
                                    max={100}
                                    target={data.efficiency.target}
                                    label="Round-Trip"
                                    unit="%"
                                    color="emerald"
                                />
                            </div>
                            {/* Throughput info */}
                            <div className="flex-1 space-y-2">
                                <div className="p-3 rounded-xl bg-surface-200/50 border border-surface-300/30">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-xs text-surface-600">Daily Throughput</span>
                                        <Gauge className="w-4 h-4 text-surface-600" />
                                    </div>
                                    <p className="text-2xl font-bold text-surface-900">{data.dailyThroughput} <span className="text-sm text-surface-500">MWh</span></p>
                                </div>
                                <div className="p-3 rounded-xl bg-surface-200/50 border border-surface-300/30">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-xs text-surface-600">Cycle Rate</span>
                                        <RefreshCw className="w-4 h-4 text-surface-600" />
                                    </div>
                                    <p className="text-xl font-bold text-surface-900">{data.cycleCount.avgCyclesPerMonth} <span className="text-sm text-surface-500">/month</span></p>
                                </div>
                            </div>
                        </div>
                        {/* 24H Power Flow Chart */}
                        {data.chargeHistory && (
                            <BESSChargeHistoryChart data={data.chargeHistory} />
                        )}
                    </div>

                    {/* Health & Metrics - 3 cols */}
                    <div className="col-span-3 flex flex-col gap-2">
                        <div className="p-3 rounded-lg bg-surface-200/30 border border-surface-300/30 flex-1">
                            <div className="flex items-center justify-between mb-2 ">
                                <div className="flex items-center gap-2">
                                    <Activity className={`w-4 h-4 ${data.stateOfHealth.current > 90 ? 'text-emerald-400' : 'text-amber-400'}`} />
                                    <span className="text-xs text-surface-600">State of Health</span>
                                </div>
                                <span className={`text-lg font-bold ${data.stateOfHealth.current > 90 ? 'text-emerald-400' : 'text-amber-400'}`}>
                                    {data.stateOfHealth.current.toFixed(1)}%
                                </span>
                            </div>
                            <div className="h-1.5 bg-surface-300/50 rounded-full overflow-hidden">
                                <motion.div
                                    className={`h-full rounded-full ${data.stateOfHealth.current > 90 ? 'bg-emerald-500' : 'bg-amber-500'}`}
                                    initial={{ width: 0 }}
                                    animate={{ width: `${data.stateOfHealth.current}%` }}
                                    transition={{ duration: 1 }}
                                />
                            </div>
                            <p className="text-[10px] text-surface-500 mt-1">-{data.stateOfHealth.degradationRate}%/year degradation</p>
                        </div>

                        <div className="p-3 rounded-lg bg-surface-200/30 border border-surface-300/30 flex-1">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <RefreshCw className="w-4 h-4 text-blue-400" />
                                    <span className="text-xs text-surface-600">Cycles</span>
                                </div>
                                <span className="text-lg font-bold text-blue-400">{data.cycleCount.total.toLocaleString()}</span>
                            </div>
                            <div className="h-1.5 bg-surface-300/50 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-blue-500 rounded-full"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${(data.cycleCount.total / data.cycleCount.warrantyLimit) * 100}%` }}
                                    transition={{ duration: 1 }}
                                />
                            </div>
                            <p className="text-[10px] text-surface-500 mt-1">{data.cycleCount.remainingCycles.toLocaleString()} of {data.cycleCount.warrantyLimit.toLocaleString()} remaining</p>
                        </div>

                        <div className="p-3 rounded-lg bg-surface-200/30 border border-surface-300/30 flex-1">
                            <div className="flex items-center justify-between mb-1">
                                <div className="flex items-center gap-2">
                                    <Thermometer className={`w-4 h-4 ${data.temperature.current <= data.temperature.optimalRange.max ? 'text-emerald-400' : 'text-rose-400'}`} />
                                    <span className="text-xs text-surface-600">Temperature</span>
                                </div>
                                <span className={`text-lg font-bold ${data.temperature.current <= data.temperature.optimalRange.max ? 'text-emerald-400' : 'text-rose-400'}`}>
                                    {data.temperature.current.toFixed(1)}°C
                                </span>
                            </div>
                            <div className="flex items-center gap-1 mt-1">
                                <span className="text-[10px] text-surface-500">Optimal: {data.temperature.optimalRange.min}-{data.temperature.optimalRange.max}°C</span>
                                {data.temperature.current <= data.temperature.optimalRange.max && (
                                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

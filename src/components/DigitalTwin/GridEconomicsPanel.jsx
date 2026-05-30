import React, { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import {
    Zap,
    DollarSign,
    Leaf,
    TrendingUp,
    TrendingDown,
    Clock,
    Activity,
    AlertTriangle,
    Sun,
    Gauge,
    ArrowRightLeft
} from 'lucide-react'
import { GRID_ECONOMICS, formatIDR } from '../../data/digitalTwinData'

/**
 * MiniSparkline - Small trend line chart for cards
 */
function MiniSparkline({ data, color = '#22D3EE', height = 40 }) {
    const max = Math.max(...data)
    const min = Math.min(...data)
    const range = max - min || 1

    const points = data.map((value, i) => {
        const x = (i / (data.length - 1)) * 100
        const y = 100 - ((value - min) / range) * 80 - 10
        return `${x},${y}`
    }).join(' ')

    return (
        <svg width="100%" height={height} viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
                <linearGradient id={`sparkGrad-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity="0.3" />
                    <stop offset="100%" stopColor={color} stopOpacity="0.05" />
                </linearGradient>
            </defs>
            <polyline
                fill="none"
                stroke={color}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={points}
                style={{ filter: `drop-shadow(0 0 4px ${color}50)` }}
            />
        </svg>
    )
}

/**
 * PeakDemandGauge - Horizontal gauge showing load vs capacity
 */
function PeakDemandGauge({ current, capacity, threshold }) {
    const percentUsed = (current / capacity) * 100
    const thresholdPercent = (threshold / capacity) * 100

    const getColor = () => {
        if (current >= threshold) return 'bg-rose-500'
        if (current >= threshold * 0.8) return 'bg-amber-500'
        return 'bg-emerald-500'
    }

    const getStatus = () => {
        if (current >= threshold) return { label: 'Peak Shaving Active', color: 'text-rose-400 bg-rose-500/20' }
        if (current >= threshold * 0.8) return { label: 'Approaching Threshold', color: 'text-amber-400 bg-amber-500/20' }
        return { label: 'Normal Operation', color: 'text-emerald-400 bg-emerald-500/20' }
    }

    const status = getStatus()

    return (
        <div className="p-4 rounded-xl bg-surface-200/30 border border-surface-300/50">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <Gauge className="w-4 h-4 text-blue-400" />
                    <span className="text-sm font-medium text-surface-900">Peak Demand</span>
                </div>
                <span className={`px-2 py-1 rounded-full text-[10px] font-medium ${status.color}`}>
                    {status.label}
                </span>
            </div>

            <div className="relative h-6 bg-surface-200 rounded-full overflow-hidden">
                {/* Threshold marker */}
                <div
                    className="absolute top-0 bottom-0 w-0.5 bg-amber-500 z-10"
                    style={{ left: `${thresholdPercent}%` }}
                />
                {/* Current load */}
                <motion.div
                    className={`absolute left-0 top-0 bottom-0 ${getColor()} rounded-full`}
                    initial={{ width: 0 }}
                    animate={{ width: `${percentUsed}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                />
                {/* Labels on bar */}
                <div className="absolute inset-0 flex items-center justify-between px-3">
                    <span className="text-xs font-bold text-surface-900 z-10">{current} kW</span>
                    <span className="text-xs text-surface-600 z-10">{capacity} kW</span>
                </div>
            </div>

            <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-surface-500">Current Load</span>
                <span className="text-xs text-amber-400">Threshold: {threshold} kW</span>
                <span className="text-xs text-surface-500">Capacity</span>
            </div>
        </div>
    )
}

/**
 * ToUTimeline - Time-of-Use rate period visualization
 */
function ToUTimeline({ schedule, currentPeriod }) {
    // Simplified 24-hour timeline
    const hours = Array.from({ length: 24 }, (_, i) => i)

    const getPeriodForHour = (hour) => {
        const hourStr = `${hour.toString().padStart(2, '0')}:00`
        for (const period of schedule) {
            const startHour = parseInt(period.start.split(':')[0])
            const endHour = parseInt(period.end.split(':')[0])

            if (endHour < startHour) {
                // Crosses midnight (e.g., 22:00 - 05:00)
                if (hour >= startHour || hour < endHour) return period
            } else {
                if (hour >= startHour && hour < endHour) return period
            }
        }
        return schedule[0]
    }

    const periodColors = {
        'off-peak': 'bg-emerald-500',
        'standard': 'bg-blue-500',
        'peak': 'bg-rose-500'
    }

    const currentHour = new Date().getHours()

    return (
        <div className="p-4 rounded-xl bg-surface-200/30 border border-surface-300/50">
            <div className="flex items-center gap-2 mb-3">
                <Clock className="w-4 h-4 text-blue-400" />
                <span className="text-sm font-medium text-surface-900">Time-of-Use Schedule</span>
            </div>

            {/* Timeline bar */}
            <div className="relative h-6 rounded-lg overflow-hidden flex">
                {hours.map((hour) => {
                    const period = getPeriodForHour(hour)
                    const isCurrentHour = hour === currentHour
                    return (
                        <div
                            key={hour}
                            className={`flex-1 ${periodColors[period.period]} ${isCurrentHour ? 'ring-2 ring-white ring-inset' : ''}`}
                            title={`${hour}:00 - ${period.period}`}
                        />
                    )
                })}
            </div>

            {/* Timeline labels */}
            <div className="flex justify-between mt-1">
                <span className="text-[10px] text-surface-500">00:00</span>
                <span className="text-[10px] text-surface-500">06:00</span>
                <span className="text-[10px] text-surface-500">12:00</span>
                <span className="text-[10px] text-surface-500">18:00</span>
                <span className="text-[10px] text-surface-500">24:00</span>
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-4 mt-3">
                {schedule.map((period) => (
                    <div key={period.period} className="flex items-center gap-1.5">
                        <div className={`w-2 h-2 rounded-full ${periodColors[period.period]}`} />
                        <span className="text-[10px] text-surface-600 capitalize">
                            {period.period}: {formatIDR(period.rate)}/kWh
                        </span>
                    </div>
                ))}
            </div>
        </div>
    )
}

/**
 * CarbonOffsetCard - Carbon savings with trend chart
 */
function CarbonOffsetCard({ data }) {
    const [timeRange, setTimeRange] = useState('month')

    // Mock trend data for different time ranges
    const trendData = {
        week: [42, 48, 45, 52, 49, 55, 51],
        month: data.history || [40, 42, 45, 48, 46, 50, 52, 55, 53, 58, 60, 62],
        year: [320, 340, 380, 420, 450, 480, 520, 560, 540, 580, 620, 650],
    }

    const currentData = trendData[timeRange]

    return (
        <div className="p-5 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
            <div className="flex items-center gap-2 mb-4">
                <Leaf className="w-5 h-5 text-emerald-400" />
                <span className="text-sm font-semibold text-emerald-400">Carbon Offset</span>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                    <p className="text-3xl font-bold text-surface-900">{data.dailyCO2Saved}</p>
                    <p className="text-sm text-surface-600">kg Today</p>
                </div>
                <div className="text-center">
                    <p className="text-3xl font-bold text-surface-900">{(data.monthlyCO2Saved / 1000).toFixed(1)}t</p>
                    <p className="text-sm text-surface-600">This Month</p>
                </div>
                <div className="text-center">
                    <p className="text-3xl font-bold text-emerald-400">{(data.yearlyCO2Saved / 1000).toFixed(1)}t</p>
                    <p className="text-sm text-surface-600">This Year</p>
                </div>
            </div>

            {/* Trend Chart with Toggle */}
            <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-surface-600">Trend</span>
                    <div className="flex items-center gap-1">
                        {['week', 'month', 'year'].map((range) => (
                            <button
                                key={range}
                                onClick={() => setTimeRange(range)}
                                className={`px-1.5 py-0.5 text-[9px] rounded transition-all ${timeRange === range
                                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                    : 'text-surface-500 hover:text-surface-700'
                                    }`}
                            >
                                {range.charAt(0).toUpperCase() + range.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="h-12">
                    <MiniSparkline data={currentData} color="#818CF8" height={48} />
                </div>
            </div>

            <div className="h-px bg-emerald-500/30 my-3" />

            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <span className="text-2xl">⛽</span>
                    <div>
                        <p className="text-base font-semibold text-surface-900">{data.gasolineSaved ? (data.gasolineSaved / 1000).toFixed(1) + 'K L' : '18.5K L'}</p>
                        <p className="text-xs text-surface-600">Gasoline saved</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-2xl">🌳</span>
                    <div>
                        <p className="text-base font-semibold text-surface-900">{data.treesEquivalent?.toLocaleString() || '2,400'}</p>
                        <p className="text-xs text-surface-600">Trees equivalent</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

/**
 * SavingsCard - Cost savings summary with trend chart
 */
function SavingsCard({ data }) {
    const [timeRange, setTimeRange] = useState('month')

    // Mock trend data for different time ranges (in millions IDR)
    const trendData = {
        week: [2.1, 2.4, 2.2, 2.6, 2.5, 2.8, 2.7],
        month: data.history || [18, 20, 22, 19, 24, 26, 23, 28, 25, 30, 27, 32],
        year: [180, 195, 210, 225, 240, 255, 270, 285, 300, 315, 330, 345],
    }

    const currentData = trendData[timeRange]

    return (
        <div className="p-5 rounded-xl bg-sun-green-500/10 border border-sun-green-500/30">
            <div className="flex items-center gap-2 mb-4">
                <DollarSign className="w-5 h-5 text-sun-green-300" />
                <span className="text-sm font-semibold text-sun-green-300">Energy Savings</span>
                <div className="ml-auto flex items-center gap-1 text-emerald-400">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-sm font-medium">{data.trend}</span>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                    <p className="text-2xl font-bold text-surface-900">{formatIDR(data.daily)}</p>
                    <p className="text-sm text-surface-600">Today</p>
                </div>
                <div className="text-center">
                    <p className="text-2xl font-bold text-surface-900">{formatIDR(data.monthly)}</p>
                    <p className="text-sm text-surface-600">This Month</p>
                </div>
                <div className="text-center">
                    <p className="text-2xl font-bold text-sun-green-300">{formatIDR(data.yearly)}</p>
                    <p className="text-sm text-surface-600">This Year</p>
                </div>
            </div>

            {/* Trend Chart with Toggle */}
            <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-surface-600">Trend</span>
                    <div className="flex items-center gap-1">
                        {['week', 'month', 'year'].map((range) => (
                            <button
                                key={range}
                                onClick={() => setTimeRange(range)}
                                className={`px-1.5 py-0.5 text-[9px] rounded transition-all ${timeRange === range
                                        ? 'bg-sun-green-500/20 text-sun-green-300 border border-sun-green-500/30'
                                        : 'text-surface-500 hover:text-surface-700'
                                    }`}
                            >
                                {range.charAt(0).toUpperCase() + range.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="h-12">
                    <MiniSparkline data={currentData} color="#22D3EE" height={48} />
                </div>
            </div>

            <div className="h-px bg-sun-green-500/30 my-3" />

            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <span className="text-2xl">💰</span>
                    <div>
                        <p className="text-base font-semibold text-surface-900">{((data.yearly / 155250000) * 100).toFixed(0)}%</p>
                        <p className="text-xs text-surface-600">of target</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-2xl">📈</span>
                    <div>
                        <p className="text-base font-semibold text-surface-900">+12.4%</p>
                        <p className="text-xs text-surface-600">vs last year</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

/**
 * GridExportCard - Grid export status
 */
function GridExportCard({ data }) {
    return (
        <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/30">
            <div className="flex items-center gap-2 mb-3">
                <ArrowRightLeft className="w-4 h-4 text-blue-400" />
                <span className="text-sm font-medium text-blue-400">Grid Export</span>
                <span className={`ml-auto px-2 py-0.5 rounded-full text-[10px] font-medium ${data.enabled
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'bg-surface-300 text-surface-600'
                    }`}>
                    {data.enabled ? 'Active' : 'Disabled'}
                </span>
            </div>

            <div className="grid grid-cols-3 gap-3">
                <div className="text-center p-2 rounded-lg bg-surface-200/50">
                    <p className="text-lg font-bold text-surface-900">{data.todayExport.toFixed(1)}</p>
                    <p className="text-[10px] text-surface-500">kWh exported</p>
                </div>
                <div className="text-center p-2 rounded-lg bg-surface-200/50">
                    <p className="text-lg font-bold text-surface-900">{formatIDR(data.exportRate)}</p>
                    <p className="text-[10px] text-surface-500">per kWh</p>
                </div>
                <div className="text-center p-2 rounded-lg bg-surface-200/50">
                    <p className="text-lg font-bold text-emerald-400">{formatIDR(data.earning)}</p>
                    <p className="text-[10px] text-surface-500">earned today</p>
                </div>
            </div>
        </div>
    )
}

/**
 * CurrentCostDisplay - Large current cost per kWh display
 */
function CurrentCostDisplay({ cost, period }) {
    const periodColors = {
        'off-peak': { bg: 'bg-emerald-500/20', text: 'text-emerald-400', border: 'border-emerald-500/30' },
        'standard': { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/30' },
        'peak': { bg: 'bg-rose-500/20', text: 'text-rose-400', border: 'border-rose-500/30' }
    }

    const colors = periodColors[period] || periodColors.standard

    return (
        <div className={`p-4 rounded-xl border ${colors.bg} ${colors.border}`}>
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                    <Zap className={`w-4 h-4 ${colors.text}`} />
                    <span className="text-sm text-surface-600">Current Rate</span>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${colors.bg} ${colors.text} capitalize`}>
                    {period.replace('-', ' ')}
                </span>
            </div>
            <p className={`text-3xl font-bold ${colors.text}`}>
                {formatIDR(cost)}
            </p>
            <p className="text-xs text-surface-500">per kWh</p>
        </div>
    )
}

/**
 * GridEconomicsPanel - Main component for grid economics visualization
 */
export default function GridEconomicsPanel({ className = '' }) {
    const data = GRID_ECONOMICS

    return (
        <div className={`space-y-4 ${className}`}>
            {/* Grid Status */}
            <div className="glass-card p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-1 h-6 rounded-full bg-blue-500" />
                    <h3 className="text-lg font-semibold text-surface-900">Grid & Energy Economics</h3>
                </div>

                <div className="grid grid-cols-12 gap-4">
                    {/* Peak Demand - 8 cols */}
                    <div className="col-span-8">
                        <PeakDemandGauge
                            current={data.peakDemand.current}
                            capacity={data.peakDemand.capacity}
                            threshold={data.peakDemand.threshold}
                        />
                    </div>

                    {/* Current Cost - 4 cols */}
                    <div className="col-span-4">
                        <CurrentCostDisplay
                            cost={data.costPerKWh.current}
                            period={data.costPerKWh.period}
                        />
                    </div>
                </div>
            </div>

            {/* Time-of-Use Schedule */}
            <div className="glass-card p-6">
                <ToUTimeline
                    schedule={data.costPerKWh.touSchedule}
                    currentPeriod={data.costPerKWh.period}
                />
            </div>

            {/* Savings & Carbon Offset */}
            <div className="grid grid-cols-2 gap-4">
                <div className="glass-card p-6">
                    <SavingsCard data={data.savings} />
                </div>
                <div className="glass-card p-6">
                    <CarbonOffsetCard data={data.carbonOffset} />
                </div>
            </div>

            {/* Grid Export */}
            <div className="glass-card p-6">
                <GridExportCard data={data.gridExport} />
            </div>
        </div>
    )
}

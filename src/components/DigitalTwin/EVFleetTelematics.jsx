import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Car,
    Battery,
    BatteryWarning,
    Activity,
    AlertTriangle,
    Zap,
    MapPin,
    Gauge,
    Clock,
    Wrench,
    CheckCircle2,
    XCircle,
    ChevronRight,
    X,
    Ticket
} from 'lucide-react'
import { EV_FLEET, hasEVChargerAssets, getStatusColor } from '../../data/digitalTwinData'

/**
 * FleetSummaryCard - Summary metric card for fleet overview
 */
function FleetSummaryCard({ icon: Icon, label, value, subValue, color = 'gray' }) {
    const colorClasses = {
        gray: 'text-surface-600 bg-surface-200/50 border-surface-300/50',
        emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
        blue: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
        amber: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
        rose: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
    }

    return (
        <div className={`p-4 rounded-xl border ${colorClasses[color]}`}>
            <div className="flex items-center gap-2 mb-2">
                <Icon className={`w-4 h-4 ${colorClasses[color].split(' ')[0]}`} />
                <span className="text-xs text-surface-600">{label}</span>
            </div>
            <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-surface-900">{value}</span>
                {subValue && <span className="text-xs text-surface-500">{subValue}</span>}
            </div>
        </div>
    )
}

/**
 * MiniSparkline - Micro chart for trend visualization
 */
function MiniSparkline({ data, color = '#22D3EE', height = 24, width = 120 }) {
    const max = Math.max(...data)
    const min = Math.min(...data)
    const range = max - min || 1

    const points = data.map((value, index) => {
        const x = (index / (data.length - 1)) * width
        const y = height - ((value - min) / range) * height
        return `${x},${y}`
    }).join(' ')

    return (
        <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" className="overflow-visible">
            <defs>
                <linearGradient id={`gradient-${color.replace('#', '')}`} x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor={color} stopOpacity="0.3" />
                    <stop offset="100%" stopColor={color} stopOpacity="0" />
                </linearGradient>
            </defs>
            {/* Area fill */}
            <polygon
                points={`0,${height} ${points} ${width},${height}`}
                fill={`url(#gradient-${color.replace('#', '')})`}
            />
            {/* Line */}
            <polyline
                points={points}
                fill="none"
                stroke={color}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            {/* End dot */}
            <circle
                cx={width}
                cy={height - ((data[data.length - 1] - min) / range) * height}
                r="2.5"
                fill={color}
            />
        </svg>
    )
}

/**
 * UtilizationHeatmap - Hourly usage heatmap with granular time slots
 */
function UtilizationHeatmap() {
    // More granular hourly data (6 AM to 10 PM, every 2 hours)
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    const hours = ['6', '8', '10', '12', '14', '16', '18', '20', '22']

    const heatmapData = [
        [0.2, 0.5, 0.7, 0.9, 0.9, 0.8, 0.6, 0.4, 0.2], // Mon
        [0.3, 0.6, 0.8, 0.7, 0.9, 0.8, 0.7, 0.3, 0.1], // Tue
        [0.4, 0.5, 0.6, 0.8, 0.7, 0.9, 0.8, 0.5, 0.3], // Wed
        [0.2, 0.7, 0.9, 0.9, 0.8, 0.6, 0.5, 0.3, 0.2], // Thu
        [0.5, 0.6, 0.7, 0.6, 0.5, 0.4, 0.3, 0.2, 0.1], // Fri
        [0.1, 0.2, 0.3, 0.4, 0.3, 0.2, 0.2, 0.1, 0.0], // Sat
        [0.1, 0.1, 0.2, 0.3, 0.2, 0.2, 0.1, 0.1, 0.0], // Sun
    ]

    const getColor = (value) => {
        if (value >= 0.8) return 'bg-blue-500'
        if (value >= 0.6) return 'bg-blue-400/70'
        if (value >= 0.4) return 'bg-blue-400/40'
        if (value >= 0.2) return 'bg-blue-400/20'
        return 'bg-surface-300/50'
    }

    return (
        <div className="space-y-0.5">
            <div className="flex gap-0.5 ml-6">
                {hours.map(h => (
                    <span key={h} className="flex-1 text-[7px] text-surface-500 text-center">{h}</span>
                ))}
            </div>
            {days.map((day, di) => (
                <div key={day} className="flex items-center gap-0.5">
                    <span className="text-[8px] text-surface-500 w-5">{day}</span>
                    {heatmapData[di].map((value, hi) => (
                        <motion.div
                            key={hi}
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: (di * hours.length + hi) * 0.01 }}
                            className={`flex-1 h-2.5 rounded-[2px] ${getColor(value)}`}
                            title={`${day} ${hours[hi]}:00 - ${Math.round(value * 100)}% utilization`}
                        />
                    ))}
                </div>
            ))}
        </div>
    )
}

/**
 * UtilizationDonut - Enhanced donut chart for fleet utilization
 */
function UtilizationDonut({ data }) {
    const total = data.inUse + data.charging + data.idle + data.alert
    const circumference = 2 * Math.PI * 40 // Slightly smaller radius

    // Calculate dash arrays for each segment
    const segments = [
        { value: data.inUse, color: '#22D3EE', label: 'In Use' },
        { value: data.charging, color: '#818CF8', label: 'Charging' },
        { value: data.idle, color: '#94A3B8', label: 'Idle' },
        { value: data.alert, color: '#FDA4AF', label: 'Alert' },
    ]

    let offset = 0

    return (
        <div className="flex items-center gap-4">
            <div className="relative w-24 h-24">
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
                    {segments.map((segment, i) => {
                        const dash = (segment.value / total) * circumference
                        const strokeDashoffset = -offset
                        offset += dash

                        return (
                            <motion.circle
                                key={i}
                                cx="48"
                                cy="48"
                                r="40"
                                fill="none"
                                stroke={segment.color}
                                strokeWidth="10"
                                strokeDasharray={`${dash} ${circumference}`}
                                strokeDashoffset={strokeDashoffset}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: i * 0.1, duration: 0.5 }}
                                style={{ filter: `drop-shadow(0 0 4px ${segment.color}50)` }}
                            />
                        )
                    })}
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-xl font-bold text-surface-900">{total}</span>
                    <span className="text-[9px] text-surface-600">vehicles</span>
                </div>
            </div>
            <div className="space-y-1.5">
                {segments.map((segment) => (
                    <div key={segment.label} className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: segment.color }} />
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-surface-900 w-4">{segment.value}</span>
                            <span className="text-[10px] text-surface-600">{segment.label}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

/**
 * FleetUtilizationPanel - Comprehensive fleet utilization display
 */
function FleetUtilizationPanel({ data }) {
    const [timeRange, setTimeRange] = useState('week')

    // Mock trend data for different time ranges
    const trendData = {
        day: [62, 68, 75, 82, 78, 85, 80, 76, 72, 68, 65, 70],
        week: [68, 72, 65, 78, 82, 75, 80],
        month: [65, 68, 72, 75, 70, 74, 78, 82, 80, 76, 79, 83, 81, 78, 75, 72, 70, 74, 77, 80, 82, 85, 83, 80, 78, 75, 73, 70, 72, 75],
    }

    const currentData = trendData[timeRange]
    const avgUtilization = Math.round(currentData.reduce((a, b) => a + b, 0) / currentData.length)
    const prevAvg = timeRange === 'day' ? 71 : timeRange === 'week' ? 70 : 68
    const trend = avgUtilization - prevAvg

    // Mock top performers
    const topPerformers = [
        { id: 'EV-001', utilization: 92, miles: 124 },
        { id: 'EV-007', utilization: 88, miles: 108 },
        { id: 'EV-003', utilization: 85, miles: 96 },
    ]

    return (
        <div className="space-y-2.5">
            {/* Top Row: Utilization Trend + Top Performers */}
            <div className="grid grid-cols-12 gap-2.5">
                {/* Utilization Trend with Toggle */}
                <div className="col-span-7 p-3 rounded-lg bg-surface-100/50 border border-surface-300/30">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-surface-600">Utilization Trend</span>
                        <div className="flex items-center gap-1">
                            {['day', 'week', 'month'].map((range) => (
                                <button
                                    key={range}
                                    onClick={() => setTimeRange(range)}
                                    className={`px-1.5 py-0.5 text-[9px] rounded transition-all ${timeRange === range
                                            ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                                            : 'text-surface-500 hover:text-surface-700'
                                        }`}
                                >
                                    {range.charAt(0).toUpperCase() + range.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="flex items-end gap-3">
                        <div className="flex-1">
                            <MiniSparkline data={currentData} color="#22D3EE" height={32} />
                        </div>
                        <div className="text-right">
                            <p className="text-lg font-bold text-surface-900 leading-none">{avgUtilization}%</p>
                            <p className={`text-[10px] ${trend >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                                {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
                            </p>
                        </div>
                    </div>
                </div>

                {/* Top Performers */}
                <div className="col-span-5 p-3 rounded-lg bg-surface-100/50 border border-surface-300/30">
                    <span className="text-xs text-surface-600 mb-2 block">Top Performers</span>
                    <div className="space-y-1.5">
                        {topPerformers.map((vehicle, idx) => (
                            <div key={vehicle.id} className="flex items-center justify-between">
                                <div className="flex items-center gap-1.5">
                                    <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold ${idx === 0 ? 'bg-amber-500/20 text-amber-400' :
                                            idx === 1 ? 'bg-carbon-500/20 text-surface-700' :
                                                'bg-orange-800/20 text-orange-400'
                                        }`}>
                                        {idx + 1}
                                    </span>
                                    <span className="text-xs font-mono text-surface-700">{vehicle.id}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-14 h-1.5 rounded-full bg-surface-300 overflow-hidden">
                                        <motion.div
                                            className="h-full bg-blue-500 rounded-full"
                                            initial={{ width: 0 }}
                                            animate={{ width: `${vehicle.utilization}%` }}
                                            transition={{ duration: 0.5, delay: idx * 0.1 }}
                                        />
                                    </div>
                                    <span className="text-xs text-surface-600 w-8">{vehicle.utilization}%</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom Row: Donut Chart + Heatmap side by side */}
            <div className="grid grid-cols-12 gap-2.5">
                {/* Donut Chart */}
                <div className="col-span-5 p-3 rounded-lg bg-surface-100/50 border border-surface-300/30">
                    <span className="text-xs text-surface-600 mb-2 block">Status Breakdown</span>
                    <div className="flex justify-center">
                        <UtilizationDonut data={data} />
                    </div>
                </div>

                {/* Hourly Heatmap */}
                <div className="col-span-7 p-3 rounded-lg bg-surface-100/50 border border-surface-300/30">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-surface-600">Peak Hours</span>
                        <div className="flex items-center gap-1.5">
                            <span className="w-2.5 h-1.5 rounded-sm bg-surface-300/50"></span>
                            <span className="text-[9px] text-surface-500">Low</span>
                            <span className="w-2.5 h-1.5 rounded-sm bg-blue-500"></span>
                            <span className="text-[9px] text-surface-500">High</span>
                        </div>
                    </div>
                    <UtilizationHeatmap />
                </div>
            </div>
        </div>
    )
}

/**
 * SoCBar - Battery SoC visualization bar
 */
function SoCBar({ soc, size = 'normal' }) {
    const getColor = () => {
        if (soc >= 60) return 'bg-emerald-500'
        if (soc >= 30) return 'bg-amber-500'
        return 'bg-rose-500'
    }

    return (
        <div className={`relative ${size === 'small' ? 'h-1.5' : 'h-2'} bg-surface-200 rounded-full overflow-hidden`}>
            <motion.div
                className={`absolute left-0 top-0 bottom-0 ${getColor()} rounded-full`}
                initial={{ width: 0 }}
                animate={{ width: `${soc}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
            />
        </div>
    )
}

/**
 * DTCBadge - Diagnostic Trouble Code badge
 */
function DTCBadge({ code }) {
    return (
        <span className="px-1.5 py-0.5 text-[10px] font-mono bg-rose-500/20 text-rose-400 rounded border border-rose-500/30">
            {code}
        </span>
    )
}

/**
 * VehicleCard - Individual vehicle status card in grid
 */
function VehicleCard({ vehicle, isSelected, onSelect }) {
    const statusColors = {
        'in-use': { bg: 'bg-blue-500/20', border: 'border-blue-500/50', text: 'text-blue-400', icon: '🚗' },
        'charging': { bg: 'bg-emerald-500/20', border: 'border-emerald-500/50', text: 'text-emerald-400', icon: '⚡' },
        'idle': { bg: 'bg-surface-300/50', border: 'border-surface-400/50', text: 'text-surface-600', icon: '🅿️' },
        'alert': { bg: 'bg-rose-500/20', border: 'border-rose-500/50', text: 'text-rose-400', icon: '⚠️' },
    }

    const status = statusColors[vehicle.status] || statusColors.idle

    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(vehicle)}
            className={`relative p-3 rounded-xl cursor-pointer transition-all border-2 ${isSelected
                ? 'border-sun-green-500/70 bg-sun-green-500/10'
                : `${status.border} ${status.bg}`
                }`}
        >
            {/* Status pulse for charging/alert */}
            {(vehicle.status === 'charging' || vehicle.status === 'alert') && (
                <motion.div
                    className={`absolute top-2 right-2 w-2 h-2 rounded-full ${vehicle.status === 'charging' ? 'bg-emerald-500' : 'bg-rose-500'
                        }`}
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                />
            )}

            <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono text-surface-600">{vehicle.id}</span>
                <span className="text-lg">{status.icon}</span>
            </div>

            <div className="mb-2">
                <SoCBar soc={vehicle.soc} size="small" />
                <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-surface-500">{vehicle.soc}%</span>
                    <span className="text-[10px] text-surface-400">SoC</span>
                </div>
            </div>

            <p className={`text-[10px] ${status.text} truncate`}>
                {vehicle.location}
            </p>

            {vehicle.dtcCodes?.length > 0 && (
                <div className="mt-2 flex gap-1 flex-wrap">
                    {vehicle.dtcCodes.slice(0, 2).map(code => (
                        <DTCBadge key={code} code={code} />
                    ))}
                </div>
            )}
        </motion.div>
    )
}

/**
 * VehicleDetailModal - Expanded vehicle details with Generate Ticket
 */
function VehicleDetailModal({ vehicle, onClose }) {
    const [ticketGenerated, setTicketGenerated] = useState(false)

    if (!vehicle) return null

    const statusColors = {
        'in-use': 'text-blue-400 bg-blue-500/20 border-blue-500/30',
        'charging': 'text-emerald-400 bg-emerald-500/20 border-emerald-500/30',
        'idle': 'text-surface-600 bg-surface-300/50 border-surface-400/30',
        'alert': 'text-rose-400 bg-rose-500/20 border-rose-500/30',
    }

    const handleGenerateTicket = () => {
        setTicketGenerated(true)
        setTimeout(() => setTicketGenerated(false), 3000)
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="glass-card p-6"
        >
            <div className="flex items-start justify-between mb-4">
                <div>
                    <h4 className="text-lg font-semibold text-surface-900">{vehicle.id}</h4>
                    <p className="text-sm text-surface-600">{vehicle.model} • {vehicle.licensePlate}</p>
                </div>
                <button
                    onClick={onClose}
                    className="p-1.5 rounded-lg hover:bg-surface-200 transition-colors"
                >
                    <X className="w-4 h-4 text-surface-600" />
                </button>
            </div>

            <div className="grid grid-cols-4 gap-4 mb-4">
                <div className="p-3 rounded-lg bg-surface-200/50">
                    <div className="flex items-center gap-2 mb-1">
                        <Battery className="w-4 h-4 text-emerald-400" />
                        <span className="text-xs text-surface-500">SoC</span>
                    </div>
                    <p className="text-xl font-bold text-surface-900">{vehicle.soc}%</p>
                    <SoCBar soc={vehicle.soc} />
                </div>

                <div className="p-3 rounded-lg bg-surface-200/50">
                    <div className="flex items-center gap-2 mb-1">
                        <Activity className="w-4 h-4 text-blue-400" />
                        <span className="text-xs text-surface-500">SoH</span>
                    </div>
                    <p className="text-xl font-bold text-surface-900">{vehicle.soh}%</p>
                    <div className="h-1.5 bg-surface-300 rounded-full overflow-hidden mt-1">
                        <div
                            className="h-full bg-blue-500 rounded-full"
                            style={{ width: `${vehicle.soh}%` }}
                        />
                    </div>
                </div>

                <div className="p-3 rounded-lg bg-surface-200/50">
                    <div className="flex items-center gap-2 mb-1">
                        <Gauge className="w-4 h-4 text-purple-400" />
                        <span className="text-xs text-surface-500">Odometer</span>
                    </div>
                    <p className="text-xl font-bold text-surface-900">{(vehicle.odometer / 1000).toFixed(1)}K</p>
                    <p className="text-[10px] text-surface-500">km driven</p>
                </div>

                <div className={`p-3 rounded-lg border ${statusColors[vehicle.status]}`}>
                    <div className="flex items-center gap-2 mb-1">
                        <Car className="w-4 h-4" />
                        <span className="text-xs">Status</span>
                    </div>
                    <p className="text-lg font-bold capitalize">{vehicle.status}</p>
                </div>
            </div>

            <div className="flex items-center gap-2 p-3 rounded-lg bg-surface-200/30 border border-surface-300/50">
                <MapPin className="w-4 h-4 text-surface-600" />
                <span className="text-sm text-surface-900">{vehicle.location}</span>
            </div>

            {vehicle.chargingPower && (
                <div className="mt-4 flex items-center gap-3 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
                    <Zap className="w-5 h-5 text-emerald-400" />
                    <div>
                        <p className="text-sm font-medium text-emerald-400">Charging at {vehicle.chargingPower} kW</p>
                        <p className="text-xs text-emerald-400/70">Estimated full charge: ~45 min</p>
                    </div>
                </div>
            )}

            {vehicle.dtcCodes?.length > 0 && (
                <div className="mt-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 text-rose-400" />
                            <span className="text-sm font-medium text-rose-400">Diagnostic Trouble Codes</span>
                        </div>
                        <motion.button
                            onClick={handleGenerateTicket}
                            disabled={ticketGenerated}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${ticketGenerated
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                : 'bg-rose-500/20 text-rose-400 border border-rose-500/30 hover:bg-rose-500/150/30'
                                }`}
                            whileHover={{ scale: ticketGenerated ? 1 : 1.02 }}
                            whileTap={{ scale: ticketGenerated ? 1 : 0.98 }}
                        >
                            {ticketGenerated ? (
                                <>
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                    Ticket Created
                                </>
                            ) : (
                                <>
                                    <Ticket className="w-3.5 h-3.5" />
                                    Generate Ticket
                                </>
                            )}
                        </motion.button>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                        {vehicle.dtcCodes.map(code => (
                            <DTCBadge key={code} code={code} />
                        ))}
                    </div>
                    {vehicle.alertMessage && (
                        <p className="text-xs text-rose-400/70 mt-2">{vehicle.alertMessage}</p>
                    )}
                </div>
            )}
        </motion.div>
    )
}

/**
 * EmptyEVFleetState - Visually appealing notice when no EV fleet
 */
function EmptyEVFleetState() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-8 flex flex-col items-center justify-center min-h-[300px]"
        >
            <div className="relative mb-6">
                <div className="w-20 h-20 rounded-2xl bg-surface-200/50 border border-surface-300/50 flex items-center justify-center">
                    <Car className="w-10 h-10 text-surface-400" />
                </div>
                <motion.div
                    className="absolute -top-2 -right-2"
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                >
                    <div className="w-6 h-6 rounded-full bg-surface-200 border border-surface-300 flex items-center justify-center">
                        <XCircle className="w-4 h-4 text-surface-500" />
                    </div>
                </motion.div>
            </div>
            <h4 className="text-lg font-semibold text-surface-900 mb-2">No EV Fleet Registered</h4>
            <p className="text-sm text-surface-500 text-center max-w-xs">
                This site does not have any electric vehicles in the fleet management system.
            </p>
            <div className="mt-6 px-4 py-2 rounded-lg bg-surface-200/30 border border-surface-300/50">
                <p className="text-xs text-surface-600">
                    🚗 Add EVs to your fleet to track SoC, SoH, and utilization
                </p>
            </div>
        </motion.div>
    )
}

/**
 * EVFleetTelematics - Main component for EV fleet visualization
 */
export default function EVFleetTelematics({ site = null, className = '' }) {
    const [selectedVehicle, setSelectedVehicle] = useState(null)

    // Check if site has EV fleet assets
    const hasEVFleet = useMemo(() => {
        if (!site) return true // Default to showing mock data
        return site?.assets?.evFleet && site.assets.evFleet > 0
    }, [site])

    if (!hasEVFleet) {
        return <EmptyEVFleetState />
    }

    const data = EV_FLEET

    return (
        <div className={`space-y-4 ${className}`}>
            {/* Fleet Overview */}
            <div className="glass-card p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-1 h-6 rounded-full bg-blue-500" />
                    <h3 className="text-lg font-semibold text-surface-900">EV Fleet Telematics</h3>
                    <span className="ml-auto text-sm text-surface-600">
                        {data.summary.totalVehicles} vehicles
                    </span>
                </div>

                <div className="grid grid-cols-12 gap-4">
                    {/* Summary Cards - 6 cols - 4x2 grid with fleet KPIs */}
                    <div className="col-span-6 grid grid-cols-4 gap-3">
                        {/* Row 1: Core Fleet Metrics */}
                        <FleetSummaryCard
                            icon={Battery}
                            label="Avg. State of Charge"
                            value={`${data.summary.averageSoC.toFixed(0)}%`}
                            color="blue"
                        />
                        <FleetSummaryCard
                            icon={Activity}
                            label="Avg. State of Health"
                            value={`${data.summary.averageSoH.toFixed(1)}%`}
                            color="blue"
                        />
                        <FleetSummaryCard
                            icon={AlertTriangle}
                            label="Active Alerts"
                            value={data.summary.alert}
                            subValue={data.summary.alert > 0 ? 'DTCs detected' : 'All clear'}
                            color={data.summary.alert > 0 ? 'rose' : 'blue'}
                        />
                        <FleetSummaryCard
                            icon={Zap}
                            label="Currently Charging"
                            value={data.summary.charging}
                            subValue="vehicles"
                            color="blue"
                        />
                        {/* Row 2: Efficiency Metrics */}
                        <FleetSummaryCard
                            icon={Gauge}
                            label="Avg. Miles/Day"
                            value="47.2"
                            color="gray"
                        />
                        <FleetSummaryCard
                            icon={Zap}
                            label="kWh/Mile"
                            value="0.28"
                            color="gray"
                        />
                        <FleetSummaryCard
                            icon={CheckCircle2}
                            label="Fleet Uptime"
                            value="94.2%"
                            color="emerald"
                        />
                        <FleetSummaryCard
                            icon={Wrench}
                            label="Maintenance Due"
                            value="2"
                            subValue="vehicles"
                            color="amber"
                        />
                    </div>

                    {/* Utilization Chart - 6 cols with comprehensive metrics */}
                    <div className="col-span-6 p-4 rounded-xl bg-surface-200/30 border border-surface-300/50">
                        <p className="text-sm text-surface-600 mb-3">Fleet Utilization</p>
                        <FleetUtilizationPanel data={data.summary} />
                    </div>
                </div>
            </div>

            {/* Vehicle Grid - sorted by status */}
            <div className="glass-card p-6">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-1 h-6 rounded-full bg-blue-500" />
                    <h3 className="text-lg font-semibold text-surface-900">Vehicle Status Grid</h3>
                    <div className="ml-auto flex items-center gap-3">
                        <span className="text-[10px] text-surface-500 flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-rose-500" /> Alert
                        </span>
                        <span className="text-[10px] text-surface-500 flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-500" /> Charging
                        </span>
                        <span className="text-[10px] text-surface-500 flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-blue-500" /> In Use
                        </span>
                        <span className="text-[10px] text-surface-500 flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-carbon-600" /> Idle
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-6 gap-3">
                    {/* Sort vehicles: alerts first, then charging, in-use, idle */}
                    {[...data.vehicles]
                        .sort((a, b) => {
                            const order = { 'alert': 0, 'charging': 1, 'in-use': 2, 'idle': 3 }
                            return (order[a.status] ?? 4) - (order[b.status] ?? 4)
                        })
                        .map((vehicle) => (
                            <VehicleCard
                                key={vehicle.id}
                                vehicle={vehicle}
                                isSelected={selectedVehicle?.id === vehicle.id}
                                onSelect={setSelectedVehicle}
                            />
                        ))}
                </div>
            </div>

            {/* Selected Vehicle Detail */}
            <AnimatePresence>
                {selectedVehicle && (
                    <VehicleDetailModal
                        vehicle={selectedVehicle}
                        onClose={() => setSelectedVehicle(null)}
                    />
                )}
            </AnimatePresence>
        </div>
    )
}

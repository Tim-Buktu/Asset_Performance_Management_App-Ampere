import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Zap,
    Plug,
    Settings,
    CheckCircle2,
    XCircle,
    AlertTriangle,
    Clock,
    Car,
    Activity,
    Cpu,
    RefreshCw,
    X,
    Ticket
} from 'lucide-react'
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer
} from 'recharts'
import { EVSE_DATA, hasEVChargerAssets } from '../../data/digitalTwinData'

/**
 * ConnectorIcon - Visual representation of connector type
 */
function ConnectorIcon({ type, status, size = 'normal' }) {
    const sizeClass = size === 'small' ? 'w-6 h-6' : 'w-8 h-8'
    const statusColors = {
        'available': 'text-emerald-400 bg-emerald-500/20 border-emerald-500/30',
        'occupied': 'text-blue-400 bg-blue-500/20 border-blue-500/30',
        'faulted': 'text-rose-400 bg-rose-500/20 border-rose-500/30',
    }

    const connectorLabels = {
        'Type 2': 'T2',
        'CCS2': 'CCS',
        'CHAdeMO': 'CHD'
    }

    return (
        <div className={`${sizeClass} rounded-lg border flex items-center justify-center ${statusColors[status]}`}>
            <span className={`text-[10px] font-bold`}>{connectorLabels[type] || type}</span>
        </div>
    )
}

/**
 * UptimeBar - Horizontal bar showing uptime percentage
 */
function UptimeBar({ percentage }) {
    const getColor = () => {
        if (percentage >= 95) return 'bg-emerald-500'
        if (percentage >= 85) return 'bg-amber-500'
        return 'bg-rose-500'
    }

    return (
        <div className="relative">
            <div className="h-2 bg-surface-200 rounded-full overflow-hidden">
                <motion.div
                    className={`h-full ${getColor()} rounded-full`}
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                />
            </div>
            <div className="flex justify-between mt-1">
                <span className="text-xs text-surface-500">0%</span>
                <span className={`text-xs font-medium ${percentage >= 95 ? 'text-emerald-400' : percentage >= 85 ? 'text-amber-400' : 'text-rose-400'}`}>
                    {percentage}%
                </span>
                <span className="text-xs text-surface-500">100%</span>
            </div>
        </div>
    )
}

/**
 * ChargingCurveChart - Real-time power delivery visualization
 */
function ChargingCurveChart({ data }) {
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-surface-100 border border-surface-300 rounded-lg p-2 shadow-lg">
                    <p className="text-xs text-surface-600">Time: {label} min</p>
                    <p className="text-sm font-bold text-blue-400">{payload[0].value} kW</p>
                </div>
            )
        }
        return null
    }

    return (
        <div className="h-[120px]">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                    <defs>
                        <linearGradient id="chargingGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#22D3EE" stopOpacity={0.4} />
                            <stop offset="95%" stopColor="#22D3EE" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <XAxis
                        dataKey="time"
                        tick={{ fill: '#94A3B8', fontSize: 10 }}
                        axisLine={{ stroke: '#334155' }}
                        tickLine={false}
                    />
                    <YAxis
                        tick={{ fill: '#94A3B8', fontSize: 10 }}
                        axisLine={{ stroke: '#334155' }}
                        tickLine={false}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                        type="monotone"
                        dataKey="power"
                        stroke="#22D3EE"
                        strokeWidth={2}
                        fill="url(#chargingGradient)"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    )
}

/**
 * StationCard - Individual charger station status
 */
function StationCard({ station, isSelected, onSelect }) {
    const statusConfig = {
        'available': {
            bg: 'bg-emerald-500/10',
            border: 'border-emerald-500/40',
            text: 'text-emerald-400',
            icon: CheckCircle2,
            label: 'Available'
        },
        'charging': {
            bg: 'bg-blue-500/10',
            border: 'border-blue-500/40',
            text: 'text-blue-400',
            icon: Zap,
            label: 'Charging',
            animated: true
        },
        'out-of-order': {
            bg: 'bg-rose-500/10',
            border: 'border-rose-500/40',
            text: 'text-rose-400',
            icon: XCircle,
            label: 'Out of Order'
        },
    }

    const config = statusConfig[station.status] || statusConfig.available
    const StatusIcon = config.icon

    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(station)}
            className={`p-4 rounded-xl cursor-pointer transition-all border-2 ${isSelected
                ? 'border-sun-green-500/70 bg-sun-green-500/10'
                : `${config.border} ${config.bg}`
                }`}
        >
            <div className="flex items-center justify-between mb-3">
                <div>
                    <h4 className="text-sm font-semibold text-surface-900">{station.name}</h4>
                    <p className="text-xs text-surface-500">{station.location}</p>
                </div>
                <div className="relative">
                    <StatusIcon className={`w-5 h-5 ${config.text}`} />
                    {config.animated && (
                        <motion.div
                            className="absolute inset-0"
                            animate={{ opacity: [1, 0.3, 1] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                        >
                            <StatusIcon className={`w-5 h-5 ${config.text}`} />
                        </motion.div>
                    )}
                </div>
            </div>

            {/* Connectors */}
            <div className="flex gap-2 mb-3">
                {station.connectors.map((connector, i) => (
                    <div key={i} className="flex items-center gap-1.5">
                        <ConnectorIcon
                            type={connector.type}
                            status={connector.status}
                            size="small"
                        />
                        <div className="text-[10px]">
                            <p className="text-surface-600">{connector.maxPower}kW</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Power/Status indicator */}
            {station.status === 'charging' ? (
                <div className="flex items-center gap-2 p-2 rounded-lg bg-blue-500/20 border border-blue-500/30">
                    <Zap className="w-4 h-4 text-blue-400" />
                    <span className="text-sm font-bold text-blue-400">{station.currentPower} kW</span>
                </div>
            ) : station.status === 'out-of-order' && station.errorCode ? (
                <div className="flex items-center gap-2 p-2 rounded-lg bg-rose-500/10 border border-rose-500/30">
                    <AlertTriangle className="w-3 h-3 text-rose-400" />
                    <span className="text-[10px] text-rose-400">{station.errorCode}: {station.errorMessage}</span>
                </div>
            ) : (
                <div className="flex items-center gap-2 p-2 rounded-lg bg-surface-200/50">
                    <Activity className="w-4 h-4 text-surface-600" />
                    <span className="text-xs text-surface-600">{station.energyDelivered.toFixed(1)} kWh today</span>
                </div>
            )}
        </motion.div>
    )
}

/**
 * StationDetailModal - Expanded charger details with Generate Ticket
 */
function StationDetailModal({ station, chargingCurve, onClose }) {
    const [ticketGenerated, setTicketGenerated] = useState(false)

    if (!station) return null

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
                    <h4 className="text-lg font-semibold text-surface-900">{station.name}</h4>
                    <p className="text-sm text-surface-600">{station.location}</p>
                </div>
                <button
                    onClick={onClose}
                    className="p-1.5 rounded-lg hover:bg-surface-200 transition-colors"
                >
                    <X className="w-4 h-4 text-surface-600" />
                </button>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-4">
                {/* Connectors detail */}
                <div className="col-span-2 p-4 rounded-xl bg-surface-200/30 border border-surface-300/50">
                    <p className="text-xs text-surface-600 mb-3">Connector Status</p>
                    <div className="space-y-3">
                        {station.connectors.map((connector, i) => (
                            <div key={i} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <ConnectorIcon type={connector.type} status={connector.status} />
                                    <div>
                                        <p className="text-sm font-medium text-surface-900">{connector.type}</p>
                                        <p className="text-xs text-surface-500">Max {connector.maxPower} kW</p>
                                    </div>
                                </div>
                                <div className={`px-2 py-1 rounded-lg text-xs font-medium capitalize ${connector.status === 'available'
                                    ? 'bg-emerald-500/20 text-emerald-400'
                                    : connector.status === 'occupied'
                                        ? 'bg-blue-500/20 text-blue-400'
                                        : 'bg-rose-500/20 text-rose-400'
                                    }`}>
                                    {connector.status}
                                    {connector.vehicleId && ` • ${connector.vehicleId}`}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Metrics */}
                <div className="space-y-3">
                    <div className="p-3 rounded-xl bg-surface-200/30 border border-surface-300/50">
                        <div className="flex items-center gap-2 mb-1">
                            <Zap className="w-4 h-4 text-emerald-400" />
                            <span className="text-xs text-surface-500">Energy Today</span>
                        </div>
                        <p className="text-lg font-bold text-surface-900">{station.energyDelivered.toFixed(1)} kWh</p>
                    </div>
                    <div className="p-3 rounded-xl bg-surface-200/30 border border-surface-300/50">
                        <div className="flex items-center gap-2 mb-1">
                            <Cpu className="w-4 h-4 text-blue-400" />
                            <span className="text-xs text-surface-500">Firmware</span>
                        </div>
                        <p className="text-sm font-medium text-surface-900">{station.firmwareVersion}</p>
                    </div>
                </div>
            </div>

            {/* Charging Curve (if charging) */}
            {station.status === 'charging' && (
                <div className="p-4 rounded-xl bg-surface-200/30 border border-surface-300/50">
                    <div className="flex items-center gap-2 mb-3">
                        <Activity className="w-4 h-4 text-blue-400" />
                        <span className="text-sm font-medium text-surface-900">Charging Curve</span>
                        <span className="ml-auto text-sm font-bold text-blue-400">{station.currentPower} kW</span>
                    </div>
                    <ChargingCurveChart data={chargingCurve} />
                </div>
            )}

            {/* Error Info with Generate Ticket (if out-of-order) */}
            {station.status === 'out-of-order' && station.errorCode && (
                <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 text-rose-400" />
                            <span className="text-sm font-medium text-rose-400">Fault Detected</span>
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
                    <div className="p-3 rounded-lg bg-surface-100/50">
                        <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded text-xs font-mono bg-rose-500/20 text-rose-400 border border-rose-500/30">
                                {station.errorCode}
                            </span>
                            <span className="text-sm text-rose-400">{station.errorMessage}</span>
                        </div>
                    </div>
                </div>
            )}
        </motion.div>
    )
}

/**
 * EmptyEVSEState - Visually appealing notice when no chargers
 */
function EmptyEVSEState() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-8 flex flex-col items-center justify-center min-h-[300px]"
        >
            <div className="relative mb-6">
                <div className="w-20 h-20 rounded-2xl bg-surface-200/50 border border-surface-300/50 flex items-center justify-center">
                    <Plug className="w-10 h-10 text-surface-400" />
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
            <h4 className="text-lg font-semibold text-surface-900 mb-2">No Chargers Installed</h4>
            <p className="text-sm text-surface-500 text-center max-w-xs">
                This site does not have electric vehicle charging stations (EVSE) installed.
            </p>
            <div className="mt-6 px-4 py-2 rounded-lg bg-surface-200/30 border border-surface-300/50">
                <p className="text-xs text-surface-600">
                    ⚡ Install EVSE stations to provide charging services for your EV fleet
                </p>
            </div>
        </motion.div>
    )
}

/**
 * EVSEManagement - Main component for charger management visualization
 */
export default function EVSEManagement({ site = null, className = '' }) {
    const [selectedStation, setSelectedStation] = useState(null)

    // Check if site has charger assets
    const hasChargers = useMemo(() => {
        if (!site) return true // Default to showing mock data
        return site?.assets?.chargers && site.assets.chargers > 0
    }, [site])

    if (!hasChargers) {
        return <EmptyEVSEState />
    }

    const data = EVSE_DATA

    return (
        <div className={`space-y-4 ${className}`}>
            {/* EVSE Overview */}
            <div className="glass-card p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-1 h-6 rounded-full bg-purple-500" />
                    <h3 className="text-lg font-semibold text-surface-900">EVSE Charger Management</h3>
                    <span className="ml-auto text-sm text-surface-600">
                        {data.summary.totalStations} stations
                    </span>
                </div>

                <div className="grid grid-cols-12 gap-4">
                    {/* Summary Stats - 8 cols - harmonized purple theme */}
                    <div className="col-span-8 grid grid-cols-4 gap-3">
                        <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/30">
                            <div className="flex items-center gap-2 mb-2">
                                <CheckCircle2 className="w-4 h-4 text-purple-400" />
                                <span className="text-xs text-surface-600">Available</span>
                            </div>
                            <p className="text-2xl font-bold text-purple-400">{data.summary.available}</p>
                        </div>
                        <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/30">
                            <div className="flex items-center gap-2 mb-2">
                                <Zap className="w-4 h-4 text-purple-400" />
                                <span className="text-xs text-surface-600">Charging</span>
                            </div>
                            <p className="text-2xl font-bold text-purple-400">{data.summary.charging}</p>
                        </div>
                        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30">
                            <div className="flex items-center gap-2 mb-2">
                                <XCircle className="w-4 h-4 text-rose-400" />
                                <span className="text-xs text-surface-600">Out of Order</span>
                            </div>
                            <p className="text-2xl font-bold text-rose-400">{data.summary.outOfOrder}</p>
                        </div>
                        <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/30">
                            <div className="flex items-center gap-2 mb-2">
                                <Zap className="w-4 h-4 text-purple-400" />
                                <span className="text-xs text-surface-600">Energy Today</span>
                            </div>
                            <p className="text-xl font-bold text-purple-400">{data.summary.totalEnergyDelivered.toFixed(0)}</p>
                            <p className="text-xs text-surface-500">kWh</p>
                        </div>
                    </div>

                    {/* Uptime - 4 cols */}
                    <div className="col-span-4 p-4 rounded-xl bg-surface-200/30 border border-surface-300/50">
                        <div className="flex items-center gap-2 mb-3">
                            <Activity className="w-4 h-4 text-purple-400" />
                            <span className="text-sm text-surface-600">Station Uptime</span>
                        </div>
                        <UptimeBar percentage={data.summary.uptime} />
                    </div>
                </div>
            </div>

            {/* Station Grid - sorted by status */}
            <div className="glass-card p-6">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-1 h-6 rounded-full bg-purple-500" />
                    <h3 className="text-lg font-semibold text-surface-900">Charging Stations</h3>
                    <div className="ml-auto flex items-center gap-3">
                        <span className="text-[10px] text-surface-500 flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-rose-500" /> Out of Order
                        </span>
                        <span className="text-[10px] text-surface-500 flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-blue-500" /> Charging
                        </span>
                        <span className="text-[10px] text-surface-500 flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-500" /> Available
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-4 gap-3">
                    {/* Sort stations: out-of-order first, then charging, then available */}
                    {[...data.stations]
                        .sort((a, b) => {
                            const order = { 'out-of-order': 0, 'charging': 1, 'available': 2 }
                            return (order[a.status] ?? 3) - (order[b.status] ?? 3)
                        })
                        .map((station) => (
                            <StationCard
                                key={station.id}
                                station={station}
                                isSelected={selectedStation?.id === station.id}
                                onSelect={setSelectedStation}
                            />
                        ))}
                </div>
            </div>

            {/* Selected Station Detail */}
            <AnimatePresence>
                {selectedStation && (
                    <StationDetailModal
                        station={selectedStation}
                        chargingCurve={data.chargingCurve}
                        onClose={() => setSelectedStation(null)}
                    />
                )}
            </AnimatePresence>
        </div>
    )
}

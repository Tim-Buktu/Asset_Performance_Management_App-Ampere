import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Zap,
    Activity,
    TrendingUp,
    Sun,
    Battery,
    Car,
    Cpu,
    Gauge,
    Clock,
    Users,
    ShieldCheck,
    Wrench
} from 'lucide-react'

/**
 * SalesMetricsPanel Component
 * 
 * Track Record & Reliability metrics with asset class toggles:
 * - PV (Solar)
 * - BESS (Battery)
 * - EV (Electric Vehicles)
 * - EMS (Energy Management System)
 * - FMS (Fleet Management System)
 */

// Asset class definitions with mock stats
const ASSET_CLASSES = {
    pv: {
        id: 'pv',
        label: 'PV',
        fullName: 'Solar PV',
        icon: Sun,
        color: 'amber',
        stats: {
            capacity: { value: 85.2, unit: 'MW', label: 'Installed Capacity' },
            uptime: { value: 99.2, unit: '%', label: 'System Uptime' },
            pr: { value: 82.3, unit: '%', label: 'Performance Ratio' },
            sites: { value: 47, unit: '', label: 'Active Sites' },
        }
    },
    bess: {
        id: 'bess',
        label: 'BESS',
        fullName: 'Battery Storage',
        icon: Battery,
        color: 'emerald',
        stats: {
            capacity: { value: 42.5, unit: 'MWh', label: 'Storage Capacity' },
            uptime: { value: 98.8, unit: '%', label: 'System Uptime' },
            pr: { value: 94.1, unit: '%', label: 'Round-trip Efficiency' },
            sites: { value: 23, unit: '', label: 'Active Sites' },
        }
    },
    ev: {
        id: 'ev',
        label: 'EV',
        fullName: 'Electric Vehicles',
        icon: Car,
        color: 'blue',
        stats: {
            capacity: { value: 312, unit: '', label: 'Fleet Vehicles' },
            uptime: { value: 97.5, unit: '%', label: 'Fleet Availability' },
            pr: { value: 89.2, unit: '%', label: 'Utilization Rate' },
            sites: { value: 18, unit: '', label: 'Fleet Locations' },
        }
    },
    ems: {
        id: 'ems',
        label: 'EMS',
        fullName: 'Energy Management',
        icon: Cpu,
        color: 'purple',
        stats: {
            capacity: { value: 156, unit: 'MW', label: 'Managed Load' },
            uptime: { value: 99.9, unit: '%', label: 'System Uptime' },
            pr: { value: 15.3, unit: '%', label: 'Avg Peak Reduction' },
            sites: { value: 34, unit: '', label: 'Connected Sites' },
        }
    },
    fms: {
        id: 'fms',
        label: 'FMS',
        fullName: 'Fleet Management',
        icon: Gauge,
        color: 'rose',
        stats: {
            capacity: { value: 485, unit: '', label: 'Assets Tracked' },
            uptime: { value: 99.7, unit: '%', label: 'System Uptime' },
            pr: { value: 22.8, unit: '%', label: 'Efficiency Gain' },
            sites: { value: 12, unit: '', label: 'Fleet Operations' },
        }
    },
}

// Animated counter hook
function useAnimatedCounter(targetValue, duration = 800) {
    const [value, setValue] = useState(0)

    useEffect(() => {
        let startTime = null
        const animate = (timestamp) => {
            if (!startTime) startTime = timestamp
            const progress = Math.min((timestamp - startTime) / duration, 1)
            const eased = 1 - Math.pow(1 - progress, 3)
            setValue(targetValue * eased)
            if (progress < 1) {
                requestAnimationFrame(animate)
            }
        }
        requestAnimationFrame(animate)
    }, [targetValue, duration])

    return value
}

// Asset toggle button
function AssetToggle({ asset, isActive, onClick }) {
    const Icon = asset.icon
    const colorClasses = {
        amber: { active: 'bg-amber-500 text-white ring-2 ring-amber-400/40 shadow-lg', inactive: 'text-amber-300 hover:bg-amber-500/15' },
        emerald: { active: 'bg-emerald-500 text-white ring-2 ring-emerald-400/40 shadow-lg', inactive: 'text-emerald-400 hover:bg-emerald-500/15' },
        blue: { active: 'bg-blue-500 text-white ring-2 ring-blue-400/40 shadow-lg', inactive: 'text-blue-300 hover:bg-blue-500/15' },
        purple: { active: 'bg-purple-500 text-white ring-2 ring-purple-400/40 shadow-lg', inactive: 'text-purple-300 hover:bg-purple-500/15' },
        rose: { active: 'bg-rose-500 text-white ring-2 ring-rose-400/40 shadow-lg', inactive: 'text-rose-400 hover:bg-rose-500/15' },
    }
    const colors = colorClasses[asset.color]

    return (
        <button
            onClick={onClick}
            className={`
                flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all
                ${isActive ? colors.active : `bg-surface-300/50 border border-surface-400/50 ${colors.inactive}`}
            `}
        >
            <Icon className="w-4 h-4" />
            <span className="text-[10px] font-semibold">{asset.label}</span>
        </button>
    )
}

// Stat row component
function StatRow({ label, value, unit }) {
    return (
        <div className="flex items-center justify-between py-2">
            <span className="text-sm text-surface-600">{label}</span>
            <span className="text-sm font-semibold text-surface-900">
                {typeof value === 'number' ? value.toFixed(1) : value}{unit}
            </span>
        </div>
    )
}

export default function SalesMetricsPanel({ sites = [], className = '' }) {
    const [activeAsset, setActiveAsset] = useState('pv')
    const currentAsset = ASSET_CLASSES[activeAsset]
    const stats = currentAsset.stats

    const animatedCapacity = useAnimatedCounter(stats.capacity.value, 600)
    const animatedUptime = useAnimatedCounter(stats.uptime.value, 800)
    const animatedPR = useAnimatedCounter(stats.pr.value, 800)

    return (
        <div className={`bg-surface-200 rounded-2xl border border-surface-200 shadow-sm h-full flex flex-col ${className}`}>
            {/* Header */}
            <div className="px-5 py-4 border-b border-surface-100">
                <h3 className="text-sm font-semibold text-surface-900">Track Record by Asset</h3>
                <p className="text-xs text-surface-500">Select asset class to view metrics</p>
            </div>

            {/* Asset Toggles */}
            <div className="px-4 py-3 border-b border-surface-100">
                <div className="flex items-center justify-between gap-1">
                    {Object.values(ASSET_CLASSES).map((asset) => (
                        <AssetToggle
                            key={asset.id}
                            asset={asset}
                            isActive={activeAsset === asset.id}
                            onClick={() => setActiveAsset(asset.id)}
                        />
                    ))}
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 p-5">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeAsset}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-4"
                    >
                        {/* Asset Name */}
                        <div className="flex items-center gap-2">
                            <currentAsset.icon className={`w-4 h-4 text-${currentAsset.color}-500`} />
                            <span className="text-xs font-medium text-surface-500 uppercase tracking-wide">
                                {currentAsset.fullName}
                            </span>
                        </div>

                        {/* Primary Metric */}
                        <div className="text-center py-3 bg-surface-300/25 rounded-xl">
                            <div className="flex items-baseline justify-center gap-1">
                                <span className="text-3xl font-bold text-surface-900 tabular-nums">
                                    {animatedCapacity.toFixed(stats.capacity.unit ? 1 : 0)}
                                </span>
                                {stats.capacity.unit && (
                                    <span className="text-base text-surface-400 font-medium">{stats.capacity.unit}</span>
                                )}
                            </div>
                            <p className="text-xs text-surface-500 mt-1">{stats.capacity.label}</p>
                        </div>

                        {/* Secondary Stats */}
                        <div className="divide-y divide-surface-100">
                            <StatRow label={stats.uptime.label} value={animatedUptime} unit="%" />
                            <StatRow label={stats.pr.label} value={animatedPR} unit="%" />
                            <StatRow label={stats.sites.label} value={stats.sites.value} unit="" />
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Bottom Stats with Explanations */}
            <div className="px-5 py-4 border-t border-surface-100 bg-surface-300/25/50">
                <div className="grid grid-cols-2 gap-4">
                    {/* Avg Response */}
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <Clock className="w-3.5 h-3.5 text-surface-400" />
                            <span className="text-xs font-medium text-surface-500">Avg Response</span>
                        </div>
                        <p className="text-base font-semibold text-surface-900">{"< 4 hrs"}</p>
                        <p className="text-[10px] text-surface-400 leading-tight">
                            Mean time to respond to O&M tickets across all sites
                        </p>
                    </div>

                    {/* Client Retention */}
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <Users className="w-3.5 h-3.5 text-surface-400" />
                            <span className="text-xs font-medium text-surface-500">Client Retention</span>
                        </div>
                        <p className="text-base font-semibold text-surface-900">99.2%</p>
                        <p className="text-[10px] text-surface-400 leading-tight">
                            Contract renewal rate over 5-year average
                        </p>
                    </div>
                </div>

                {/* Additional Stats Row */}
                <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-surface-200">
                    <div className="flex items-center gap-2">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                        <div>
                            <p className="text-xs font-semibold text-surface-900">Zero Safety Incidents</p>
                            <p className="text-[10px] text-surface-400">Last 36 months</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Wrench className="w-3.5 h-3.5 text-blue-500" />
                        <div>
                            <p className="text-xs font-semibold text-surface-900">12,450 Tickets Resolved</p>
                            <p className="text-[10px] text-surface-400">YTD performance</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

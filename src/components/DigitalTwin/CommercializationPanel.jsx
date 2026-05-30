import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Building2,
    MapPin,
    Calendar,
    Briefcase,
    Zap,
    DollarSign,
    TrendingUp,
    TrendingDown,
    Clock,
    Shield,
    Leaf,
    Target,
    AlertTriangle,
    ChevronDown,
    ChevronRight,
    Sun,
    Battery,
    Car,
    Plug,
    BarChart2,
    Award,
    CheckCircle2,
    Calculator,
    ArrowRight,
    FileText,
    Plus,
    Minus,
    Users,
    Gauge,
    Sparkles,
    ExternalLink
} from 'lucide-react'

/**
 * CommercializationPanel - Sales-focused 8-section dashboard for upselling
 * 
 * Sections:
 * 1. Client & Site Identification
 * 2. Current RESCO Performance
 * 3. Cost & Risk Exposure
 * 4. Peer & Portfolio Benchmarking
 * 5. Expansion Opportunities
 * 6. Financial Calculator
 * 7. Operational & Sustainability Impact
 * 8. Recommended Path Forward
 */

// Site-specific data for commercialization (extends base site data)
const COMMERCIALIZATION_DATA = {
    'jkt-1': {
        contractStart: '2022-03-15',
        contractTerm: 25,
        remainingTerm: 23.2,
        operatingProfile: 'Manufacturing - Heavy Equipment',
        energyGenerated: { ytd: 12850, lifetime: 38420 },
        costSavings: { ytd: 1285000, lifetime: 3842000 },
        uptime: 99.2,
        slaCompliance: 98.5,
        emissionsAvoided: { ytd: 5140, lifetime: 15368 },
        gridSpend: 2450000,
        peakDemandCharges: 420000,
        outageRisk: 'Medium',
        carbonExposure: 85000,
        volatilityImpact: 180000,
    },
    'sby-1': {
        contractStart: '2021-08-20',
        contractTerm: 20,
        remainingTerm: 15.6,
        operatingProfile: 'Mining - Ore Processing',
        energyGenerated: { ytd: 8920, lifetime: 32150 },
        costSavings: { ytd: 892000, lifetime: 3215000 },
        uptime: 97.8,
        slaCompliance: 96.2,
        emissionsAvoided: { ytd: 3568, lifetime: 12860 },
        gridSpend: 1850000,
        peakDemandCharges: 380000,
        outageRisk: 'High',
        carbonExposure: 125000,
        volatilityImpact: 220000,
    },
    'bali-1': {
        contractStart: '2023-01-10',
        contractTerm: 20,
        remainingTerm: 18.0,
        operatingProfile: 'Retail - Tourism Complex',
        energyGenerated: { ytd: 6840, lifetime: 8450 },
        costSavings: { ytd: 684000, lifetime: 845000 },
        uptime: 99.5,
        slaCompliance: 99.1,
        emissionsAvoided: { ytd: 2736, lifetime: 3380 },
        gridSpend: 980000,
        peakDemandCharges: 180000,
        outageRisk: 'Low',
        carbonExposure: 45000,
        volatilityImpact: 95000,
    },
    'mdn-1': {
        contractStart: '2020-06-01',
        contractTerm: 25,
        remainingTerm: 19.4,
        operatingProfile: 'Mining - Coal Processing',
        energyGenerated: { ytd: 10250, lifetime: 45820 },
        costSavings: { ytd: 1025000, lifetime: 4582000 },
        uptime: 95.2,
        slaCompliance: 92.8,
        emissionsAvoided: { ytd: 4100, lifetime: 18328 },
        gridSpend: 2680000,
        peakDemandCharges: 520000,
        outageRisk: 'Critical',
        carbonExposure: 165000,
        volatilityImpact: 340000,
    },
    'mksr-1': {
        contractStart: '2022-11-25',
        contractTerm: 20,
        remainingTerm: 16.9,
        operatingProfile: 'Logistics - Port Operations',
        energyGenerated: { ytd: 7680, lifetime: 12450 },
        costSavings: { ytd: 768000, lifetime: 1245000 },
        uptime: 99.1,
        slaCompliance: 98.8,
        emissionsAvoided: { ytd: 3072, lifetime: 4980 },
        gridSpend: 1420000,
        peakDemandCharges: 285000,
        outageRisk: 'Low',
        carbonExposure: 62000,
        volatilityImpact: 135000,
    },
    'bnj-1': {
        contractStart: '2023-05-15',
        contractTerm: 15,
        remainingTerm: 13.4,
        operatingProfile: 'Industrial - Steel Manufacturing',
        energyGenerated: { ytd: 5420, lifetime: 6850 },
        costSavings: { ytd: 542000, lifetime: 685000 },
        uptime: 98.8,
        slaCompliance: 97.5,
        emissionsAvoided: { ytd: 2168, lifetime: 2740 },
        gridSpend: 1150000,
        peakDemandCharges: 210000,
        outageRisk: 'Medium',
        carbonExposure: 78000,
        volatilityImpact: 145000,
    },
    'plm-1': {
        contractStart: '2021-12-01',
        contractTerm: 25,
        remainingTerm: 20.9,
        operatingProfile: 'Energy - Oil & Gas Support',
        energyGenerated: { ytd: 7250, lifetime: 26420 },
        costSavings: { ytd: 725000, lifetime: 2642000 },
        uptime: 97.2,
        slaCompliance: 95.8,
        emissionsAvoided: { ytd: 2900, lifetime: 10568 },
        gridSpend: 1680000,
        peakDemandCharges: 340000,
        outageRisk: 'Medium',
        carbonExposure: 95000,
        volatilityImpact: 185000,
    },
    'jpr-1': {
        contractStart: '2023-09-01',
        contractTerm: 15,
        remainingTerm: 14.6,
        operatingProfile: 'Logistics - Remote Distribution',
        energyGenerated: { ytd: 3850, lifetime: 4120 },
        costSavings: { ytd: 385000, lifetime: 412000 },
        uptime: 98.5,
        slaCompliance: 97.2,
        emissionsAvoided: { ytd: 1540, lifetime: 1648 },
        gridSpend: 780000,
        peakDemandCharges: 145000,
        outageRisk: 'Low',
        carbonExposure: 35000,
        volatilityImpact: 72000,
    },
}

// Client peer data by industry (similar to IndustryPeersPanel)
const CLIENT_DATA_BY_INDUSTRY = {
    mining: {
        clients: [
            { name: 'PT Borneo Prima Mining', capacity: { mw: 25.0, mwh: 12, vehicles: 45, chargers: 20 }, assets: { solarPanels: true, bess: true, evFleet: true, chargers: true }, costSavings: 1850000 },
            { name: 'Kalindo Energy', capacity: { mw: 18.0, mwh: 0, vehicles: 0, chargers: 0 }, assets: { solarPanels: true, bess: false, evFleet: false, chargers: false }, costSavings: 720000 },
            { name: 'Nusantara Resources', capacity: { mw: 15.0, mwh: 8, vehicles: 0, chargers: 0 }, assets: { solarPanels: true, bess: true, evFleet: false, chargers: false }, costSavings: 890000 },
            { name: 'Sumatra Coal Group', capacity: { mw: 12.0, mwh: 6, vehicles: 20, chargers: 0 }, assets: { solarPanels: true, bess: true, evFleet: true, chargers: false }, costSavings: 1120000 },
        ]
    },
    manufacturing: {
        clients: [
            { name: 'Nusantara Automotive Group', capacity: { mw: 35.0, mwh: 18, vehicles: 60, chargers: 35 }, assets: { solarPanels: true, bess: true, evFleet: true, chargers: true }, costSavings: 2450000 },
            { name: 'Makmur Foods Indonesia', capacity: { mw: 22.0, mwh: 10, vehicles: 0, chargers: 0 }, assets: { solarPanels: true, bess: true, evFleet: false, chargers: false }, costSavings: 1280000 },
            { name: 'Harum Consumer Goods', capacity: { mw: 18.0, mwh: 8, vehicles: 25, chargers: 0 }, assets: { solarPanels: true, bess: true, evFleet: true, chargers: false }, costSavings: 1650000 },
            { name: 'Garuda Consumer Group', capacity: { mw: 15.0, mwh: 0, vehicles: 0, chargers: 0 }, assets: { solarPanels: true, bess: false, evFleet: false, chargers: false }, costSavings: 580000 },
        ]
    },
    retail: {
        clients: [
            { name: 'Archipelago Malls Group', capacity: { mw: 28.0, mwh: 14, vehicles: 0, chargers: 45 }, assets: { solarPanels: true, bess: true, evFleet: false, chargers: true }, costSavings: 1980000 },
            { name: 'Surya Property Group', capacity: { mw: 20.0, mwh: 10, vehicles: 0, chargers: 30 }, assets: { solarPanels: true, bess: true, evFleet: false, chargers: true }, costSavings: 1420000 },
            { name: 'Bintang Department Store', capacity: { mw: 14.0, mwh: 0, vehicles: 0, chargers: 20 }, assets: { solarPanels: true, bess: false, evFleet: false, chargers: true }, costSavings: 680000 },
        ]
    },
    logistics: {
        clients: [
            { name: 'Cepat Logistik Express', capacity: { mw: 15.0, mwh: 8, vehicles: 120, chargers: 30 }, assets: { solarPanels: true, bess: true, evFleet: true, chargers: true }, costSavings: 1950000 },
            { name: 'Rajawali Parcel', capacity: { mw: 10.0, mwh: 5, vehicles: 85, chargers: 20 }, assets: { solarPanels: true, bess: true, evFleet: true, chargers: true }, costSavings: 1480000 },
            { name: 'Nusa Cargo Logistics', capacity: { mw: 8.0, mwh: 0, vehicles: 60, chargers: 15 }, assets: { solarPanels: true, bess: false, evFleet: true, chargers: true }, costSavings: 920000 },
        ]
    },
    energy: {
        clients: [
            { name: 'Energi Baru Nusantara', capacity: { mw: 45.0, mwh: 25, vehicles: 40, chargers: 20 }, assets: { solarPanels: true, bess: true, evFleet: true, chargers: true }, costSavings: 3200000 },
            { name: 'Listrik Nusantara', capacity: { mw: 38.0, mwh: 20, vehicles: 0, chargers: 0 }, assets: { solarPanels: true, bess: true, evFleet: false, chargers: false }, costSavings: 2150000 },
            { name: 'Riau Power Holdings', capacity: { mw: 30.0, mwh: 15, vehicles: 0, chargers: 0 }, assets: { solarPanels: true, bess: true, evFleet: false, chargers: false }, costSavings: 1680000 },
        ]
    },
    industrial: {
        clients: [
            { name: 'Bekasi Industrial Estate', capacity: { mw: 42.0, mwh: 22, vehicles: 50, chargers: 25 }, assets: { solarPanels: true, bess: true, evFleet: true, chargers: true }, costSavings: 2850000 },
            { name: 'Gresik Industrial Park', capacity: { mw: 35.0, mwh: 18, vehicles: 0, chargers: 0 }, assets: { solarPanels: true, bess: true, evFleet: false, chargers: false }, costSavings: 1950000 },
            { name: 'Baja Nusantara Steel', capacity: { mw: 28.0, mwh: 14, vehicles: 30, chargers: 0 }, assets: { solarPanels: true, bess: true, evFleet: true, chargers: false }, costSavings: 2120000 },
        ]
    },
}

// Vehicle types with different costs/returns
const VEHICLE_TYPES = {
    dumpTruck: { label: 'Dump Truck', cost: 85000, annualSavings: 18000, icon: '🚛' },
    wheelLoader: { label: 'Wheel Loader', cost: 95000, annualSavings: 22000, icon: '🏗️' },
    lv: { label: 'Light Vehicle (LV)', cost: 45000, annualSavings: 11000, icon: '🚐' },
    wideBody: { label: 'Wide Body', cost: 120000, annualSavings: 28000, icon: '🚚' },
}

// Expansion opportunities catalog
const EXPANSION_OPTIONS = {
    bess: {
        label: 'Battery Energy Storage',
        icon: Battery,
        color: 'emerald',
        valueDrivers: ['Peak Shaving', 'Demand Response', 'Backup Power'],
        dependencies: ['Grid tariff structure', 'Load profile', 'Space availability'],
        investmentRange: '$150K - $250K per MWh',
        paybackRange: '4-6 years',
    },
    ems: {
        label: 'Energy Management System',
        icon: Gauge,
        color: 'purple',
        valueDrivers: ['Load Optimization', 'Predictive Maintenance', 'Real-time Monitoring'],
        dependencies: ['Existing infrastructure', 'IT integration', 'Staff training'],
        investmentRange: '$50K - $120K',
        paybackRange: '2-3 years',
    },
    ev: {
        label: 'EV Fleet + Charging',
        icon: Car,
        color: 'blue',
        valueDrivers: ['Fuel Cost Reduction', 'Carbon Compliance', 'Fleet Modernization'],
        dependencies: ['Vehicle replacement cycle', 'Charging infrastructure', 'Route analysis'],
        investmentRange: '$45K - $65K per vehicle',
        paybackRange: '3-5 years',
    },
    solarExpansion: {
        label: 'Solar Capacity Expansion',
        icon: Sun,
        color: 'amber',
        valueDrivers: ['Increased Generation', 'Cost Savings', 'Carbon Reduction'],
        dependencies: ['Roof/land availability', 'Grid connection capacity', 'Permit requirements'],
        investmentRange: '$800K - $1.2M per MW',
        paybackRange: '5-7 years',
    },
}

// Collapsible section component
function Section({ title, subtitle, icon: Icon, color = 'sun-green', children, salesNarrative, defaultExpanded = true, actionButton }) {
    const [isExpanded, setIsExpanded] = useState(defaultExpanded)

    const colorMap = {
        'sun-green': { bg: 'bg-sun-green-50', border: 'border-sun-green-400/35', text: 'text-sun-green-300', accent: 'bg-sun-green-500' },
        'emerald': { bg: 'bg-emerald-500/12', border: 'border-emerald-400/35', text: 'text-emerald-400', accent: 'bg-emerald-500' },
        'blue': { bg: 'bg-blue-500/12', border: 'border-blue-400/35', text: 'text-blue-300', accent: 'bg-blue-500' },
        'purple': { bg: 'bg-purple-500/12', border: 'border-purple-400/35', text: 'text-purple-600', accent: 'bg-purple-500' },
        'amber': { bg: 'bg-amber-500/12', border: 'border-amber-400/35', text: 'text-amber-300', accent: 'bg-amber-500' },
        'rose': { bg: 'bg-rose-500/12', border: 'border-rose-400/35', text: 'text-rose-400', accent: 'bg-rose-500' },
        'cyan': { bg: 'bg-cyan-50', border: 'border-cyan-200', text: 'text-cyan-600', accent: 'bg-cyan-500' },
    }

    const colors = colorMap[color] || colorMap['sun-green']

    return (
        <div className="bg-surface-200 rounded-xl border border-surface-200 shadow-sm overflow-hidden mb-4">
            <div className="w-full flex items-center justify-between p-4">
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="flex items-center gap-3 flex-1 hover:opacity-80 transition-opacity"
                >
                    <div className={`w-10 h-10 rounded-xl ${colors.bg} ${colors.border} border flex items-center justify-center`}>
                        <Icon className={`w-5 h-5 ${colors.text}`} />
                    </div>
                    <div className="text-left">
                        <h3 className="text-sm font-semibold text-surface-900">{title}</h3>
                        {subtitle && <p className="text-xs text-surface-500">{subtitle}</p>}
                    </div>
                </button>
                <div className="flex items-center gap-3">
                    {actionButton && <div className="mr-2">{actionButton}</div>}
                    <motion.div animate={{ rotate: isExpanded ? 180 : 0 }}>
                        <ChevronDown className="w-5 h-5 text-surface-400" />
                    </motion.div>
                </div>
            </div>

            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="px-4 pb-4">
                            {salesNarrative && (
                                <div className={`mb-4 p-3 rounded-lg ${colors.bg} ${colors.border} border-l-4`}>
                                    <p className="text-sm text-surface-700 italic">"{salesNarrative}"</p>
                                </div>
                            )}
                            {children}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

// Metric card component
function MetricCard({ label, value, subvalue, icon: Icon, trend, color = 'surface' }) {
    const colorMap = {
        surface: 'text-surface-600',
        emerald: 'text-emerald-400',
        blue: 'text-blue-300',
        amber: 'text-amber-300',
        rose: 'text-rose-400',
        purple: 'text-purple-600',
    }

    return (
        <div className="p-4 rounded-xl bg-surface-300/25 border border-surface-200">
            <div className="flex items-center gap-2 mb-2">
                {Icon && <Icon className={`w-4 h-4 ${colorMap[color]}`} />}
                <span className="text-xs text-surface-500 uppercase tracking-wide">{label}</span>
            </div>
            <p className={`text-xl font-bold ${colorMap[color]}`}>{value}</p>
            {subvalue && (
                <div className="flex items-center gap-1 mt-1">
                    {trend === 'up' && <TrendingUp className="w-3 h-3 text-emerald-500" />}
                    {trend === 'down' && <TrendingDown className="w-3 h-3 text-rose-500" />}
                    <span className="text-xs text-surface-500">{subvalue}</span>
                </div>
            )}
        </div>
    )
}

// Number input with +/- buttons for calculator
function NumberInput({ label, value, onChange, max, min = 0, step = 1, icon: Icon, unit, color = 'surface' }) {
    const colorMap = {
        surface: { bg: 'bg-surface-300/25', border: 'border-surface-200', text: 'text-surface-600' },
        emerald: { bg: 'bg-emerald-500/12', border: 'border-emerald-400/35', text: 'text-emerald-400' },
        blue: { bg: 'bg-blue-500/12', border: 'border-blue-400/35', text: 'text-blue-300' },
        amber: { bg: 'bg-amber-500/12', border: 'border-amber-400/35', text: 'text-amber-300' },
        purple: { bg: 'bg-purple-500/12', border: 'border-purple-400/35', text: 'text-purple-600' },
    }

    const colors = value > 0 ? colorMap[color] : colorMap.surface

    return (
        <div className={`p-4 rounded-xl ${colors.bg} ${colors.border} border`}>
            <div className="flex items-center gap-2 mb-3">
                {Icon && <Icon className={`w-4 h-4 ${colors.text}`} />}
                <span className="text-xs font-medium text-surface-700">{label}</span>
            </div>
            <div className="flex items-center justify-between">
                <button
                    onClick={() => onChange(Math.max(min, value - step))}
                    className="w-8 h-8 rounded-lg bg-surface-300/50 border border-surface-400/50 hover:bg-surface-300/50 flex items-center justify-center transition-colors"
                >
                    <Minus className="w-4 h-4 text-surface-600" />
                </button>
                <div className="text-center">
                    <span className={`text-2xl font-bold ${value > 0 ? colors.text : 'text-surface-400'}`}>{value}</span>
                    <span className="text-xs text-surface-500 ml-1">{unit}</span>
                </div>
                <button
                    onClick={() => onChange(Math.min(max, value + step))}
                    className="w-8 h-8 rounded-lg bg-surface-300/50 border border-surface-400/50 hover:bg-surface-300/50 flex items-center justify-center transition-colors"
                >
                    <Plus className="w-4 h-4 text-surface-600" />
                </button>
            </div>
        </div>
    )
}

// Format currency
function formatCurrency(value, compact = false) {
    if (value >= 1000000) {
        return `$${(value / 1000000).toFixed(1)}M`
    } else if (value >= 1000) {
        return compact ? `$${(value / 1000).toFixed(0)}K` : `$${(value / 1000).toFixed(1)}K`
    }
    return `$${value.toFixed(0)}`
}

// Format number with commas
function formatNumber(value) {
    return value.toLocaleString()
}

export default function CommercializationPanel({ site }) {
    // Calculator state
    const [solarExpansion, setSolarExpansion] = useState(0)
    const [bessExpansion, setBessExpansion] = useState(0)
    const [chargerUnits, setChargerUnits] = useState(0)
    // Vehicle types state
    const [dumpTrucks, setDumpTrucks] = useState(0)
    const [wheelLoaders, setWheelLoaders] = useState(0)
    const [lightVehicles, setLightVehicles] = useState(0)
    const [wideBodies, setWideBodies] = useState(0)

    const siteData = site ? COMMERCIALIZATION_DATA[site.id] : null
    const peerClients = site ? CLIENT_DATA_BY_INDUSTRY[site.industry]?.clients || [] : []

    // Calculate financial projections
    const projections = useMemo(() => {
        const costs = {
            solar: solarExpansion * 950000,      // $950K per MW
            bess: bessExpansion * 200000,        // $200K per MWh
            dumpTruck: dumpTrucks * VEHICLE_TYPES.dumpTruck.cost,
            wheelLoader: wheelLoaders * VEHICLE_TYPES.wheelLoader.cost,
            lv: lightVehicles * VEHICLE_TYPES.lv.cost,
            wideBody: wideBodies * VEHICLE_TYPES.wideBody.cost,
            charger: chargerUnits * 65000,       // $65K per charger
        }

        const annualReturns = {
            solar: solarExpansion * 140000,      // $140K annual return per MW
            bess: bessExpansion * 35000,         // $35K annual return per MWh
            dumpTruck: dumpTrucks * VEHICLE_TYPES.dumpTruck.annualSavings,
            wheelLoader: wheelLoaders * VEHICLE_TYPES.wheelLoader.annualSavings,
            lv: lightVehicles * VEHICLE_TYPES.lv.annualSavings,
            wideBody: wideBodies * VEHICLE_TYPES.wideBody.annualSavings,
            charger: chargerUnits * 15000,       // $15K annual revenue per charger
        }

        const totalInvestment = Object.values(costs).reduce((a, b) => a + b, 0)
        const annualReturn = Object.values(annualReturns).reduce((a, b) => a + b, 0)
        const paybackYears = totalInvestment > 0 ? totalInvestment / annualReturn : 0
        const tenYearROI = (annualReturn * 10) - totalInvestment
        const roiPercent = totalInvestment > 0 ? ((annualReturn * 10 / totalInvestment - 1) * 100) : 0

        return {
            costs,
            annualReturns,
            totalInvestment,
            annualReturn,
            paybackYears,
            tenYearROI,
            roiPercent,
            hasInput: totalInvestment > 0
        }
    }, [solarExpansion, bessExpansion, dumpTrucks, wheelLoaders, lightVehicles, wideBodies, chargerUnits])

    // Determine site gaps for expansion opportunities
    const siteGaps = useMemo(() => {
        if (!site) return []
        const gaps = []
        if (!site.assets.bess || site.assets.bess < 3) gaps.push('bess')
        if (!site.assets.evFleet || site.assets.evFleet < 10) gaps.push('ev')
        gaps.push('solarExpansion') // Always show solar expansion
        if (site.assets.solarPanels > 500) gaps.push('ems') // EMS for larger sites
        return gaps.slice(0, 3) // Max 3 recommendations
    }, [site])

    if (!site || !siteData) {
        return (
            <div className="flex items-center justify-center h-64 text-surface-500">
                <p>Select a site to view commercialization details</p>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {/* Section 1: Client & Site Identification */}
            <Section
                title="Client & Site Identification"
                subtitle="Contract context and operational profile"
                icon={Building2}
                color="sun-green"
            >
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="p-4 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200">
                        <div className="flex items-center gap-2 mb-2">
                            <Building2 className="w-4 h-4 text-slate-600" />
                            <span className="text-xs text-slate-500 uppercase">Client Site</span>
                        </div>
                        <p className="text-lg font-bold text-slate-900">{site.name}</p>
                        <p className="text-xs text-slate-500">{site.location}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-400/35">
                        <div className="flex items-center gap-2 mb-2">
                            <Briefcase className="w-4 h-4 text-blue-300" />
                            <span className="text-xs text-blue-500 uppercase">Industry</span>
                        </div>
                        <p className="text-lg font-bold text-blue-900 capitalize">{site.industry}</p>
                        <p className="text-xs text-blue-500">{siteData.operatingProfile}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-400/35">
                        <div className="flex items-center gap-2 mb-2">
                            <Calendar className="w-4 h-4 text-purple-600" />
                            <span className="text-xs text-purple-500 uppercase">Contract Start</span>
                        </div>
                        <p className="text-lg font-bold text-purple-900">{new Date(siteData.contractStart).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</p>
                        <p className="text-xs text-purple-500">{siteData.contractTerm} year term</p>
                    </div>
                    <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-400/35">
                        <div className="flex items-center gap-2 mb-2">
                            <Clock className="w-4 h-4 text-emerald-400" />
                            <span className="text-xs text-emerald-500 uppercase">Remaining Term</span>
                        </div>
                        <p className="text-lg font-bold text-emerald-900">{siteData.remainingTerm} years</p>
                        <p className="text-xs text-emerald-500">{((siteData.remainingTerm / siteData.contractTerm) * 100).toFixed(0)}% remaining</p>
                    </div>
                </div>
            </Section>

            {/* Section 2: Current RESCO Performance */}
            <Section
                title="Current RESCO Performance"
                subtitle="Value delivered at this site"
                icon={Award}
                color="emerald"
            >
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                    <MetricCard
                        label="Energy Generated (YTD)"
                        value={`${formatNumber(siteData.energyGenerated.ytd)} MWh`}
                        subvalue={`${formatNumber(siteData.energyGenerated.lifetime)} MWh lifetime`}
                        icon={Zap}
                        color="amber"
                    />
                    <MetricCard
                        label="Cost Savings (YTD)"
                        value={formatCurrency(siteData.costSavings.ytd)}
                        subvalue={`${formatCurrency(siteData.costSavings.lifetime)} lifetime`}
                        icon={DollarSign}
                        trend="up"
                        color="emerald"
                    />
                    <MetricCard
                        label="System Uptime"
                        value={`${siteData.uptime}%`}
                        subvalue="Last 12 months"
                        icon={Shield}
                        color="blue"
                    />
                    <MetricCard
                        label="SLA Compliance"
                        value={`${siteData.slaCompliance}%`}
                        subvalue="Contractual targets"
                        icon={CheckCircle2}
                        color="purple"
                    />
                    <MetricCard
                        label="Emissions Avoided (YTD)"
                        value={`${formatNumber(siteData.emissionsAvoided.ytd)} tCO₂`}
                        subvalue={`${formatNumber(siteData.emissionsAvoided.lifetime)} tCO₂ lifetime`}
                        icon={Leaf}
                        color="emerald"
                    />
                </div>
            </Section>

            {/* Section 3: Cost & Risk Exposure */}
            <Section
                title="Cost & Risk Exposure Today"
                subtitle="Where money is still being lost"
                icon={AlertTriangle}
                color="rose"
            >
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                    <div className="p-4 rounded-xl bg-surface-300/50 border border-surface-400/50 shadow-sm">
                        <div className="flex items-center gap-2 mb-2">
                            <Zap className="w-4 h-4 text-rose-400" />
                            <span className="text-xs text-rose-500 uppercase">Grid Energy Spend</span>
                        </div>
                        <p className="text-xl font-bold text-rose-300">{formatCurrency(siteData.gridSpend)}</p>
                        <p className="text-xs text-rose-500">Annual remaining grid cost</p>
                    </div>
                    <div className="p-4 rounded-xl bg-surface-300/50 border border-surface-400/50 shadow-sm">
                        <div className="flex items-center gap-2 mb-2">
                            <TrendingUp className="w-4 h-4 text-amber-300" />
                            <span className="text-xs text-amber-500 uppercase">Peak Demand Charges</span>
                        </div>
                        <p className="text-xl font-bold text-amber-300">{formatCurrency(siteData.peakDemandCharges)}</p>
                        <p className="text-xs text-amber-500">Reducible with BESS</p>
                    </div>
                    <div className="p-4 rounded-xl bg-surface-300/50 border border-surface-400/50 shadow-sm">
                        <div className="flex items-center gap-2 mb-2">
                            <Shield className="w-4 h-4 text-orange-600" />
                            <span className="text-xs text-orange-500 uppercase">Outage Risk</span>
                        </div>
                        <p className={`text-xl font-bold ${siteData.outageRisk === 'Critical' ? 'text-rose-300' : siteData.outageRisk === 'High' ? 'text-orange-700' : siteData.outageRisk === 'Medium' ? 'text-amber-300' : 'text-emerald-300'}`}>
                            {siteData.outageRisk}
                        </p>
                        <p className="text-xs text-orange-500">Operational downtime exposure</p>
                    </div>
                    <div className="p-4 rounded-xl bg-surface-300/50 border border-surface-400/50 shadow-sm">
                        <div className="flex items-center gap-2 mb-2">
                            <Leaf className="w-4 h-4 text-purple-600" />
                            <span className="text-xs text-purple-500 uppercase">Carbon Exposure</span>
                        </div>
                        <p className="text-xl font-bold text-purple-300">{formatCurrency(siteData.carbonExposure)}</p>
                        <p className="text-xs text-purple-500">Regulatory risk (projected)</p>
                    </div>
                    <div className="p-4 rounded-xl bg-surface-300/50 border border-surface-400/50 shadow-sm">
                        <div className="flex items-center gap-2 mb-2">
                            <BarChart2 className="w-4 h-4 text-blue-300" />
                            <span className="text-xs text-blue-500 uppercase">Price Volatility</span>
                        </div>
                        <p className="text-xl font-bold text-blue-300">{formatCurrency(siteData.volatilityImpact)}</p>
                        <p className="text-xs text-blue-500">Annual cost variance</p>
                    </div>
                </div>
            </Section>

            {/* Section 4: Peer & Portfolio Benchmarking */}
            {peerClients.length > 0 && (
                <Section
                    title="Peer & Portfolio Benchmarking"
                    subtitle={`Compared to ${site.industry} industry clients`}
                    icon={Users}
                    color="blue"
                >
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-surface-200">
                                    <th className="text-left p-3 text-xs font-semibold text-surface-700 uppercase">Client</th>
                                    <th className="text-center p-3 text-xs font-semibold text-surface-700 uppercase">Solar (MW)</th>
                                    <th className="text-center p-3 text-xs font-semibold text-surface-700 uppercase">BESS (MWh)</th>
                                    <th className="text-center p-3 text-xs font-semibold text-surface-700 uppercase">EV Fleet</th>
                                    <th className="text-center p-3 text-xs font-semibold text-surface-700 uppercase">Chargers</th>
                                    <th className="text-right p-3 text-xs font-semibold text-surface-700 uppercase">Product Stack</th>
                                    <th className="text-right p-3 text-xs font-semibold text-surface-700 uppercase">Cost Saved</th>
                                </tr>
                            </thead>
                            <tbody>
                                {peerClients.map((client, idx) => {
                                    const productCount = Object.values(client.assets).filter(Boolean).length
                                    return (
                                        <tr key={idx} className="border-b border-surface-100 hover:bg-surface-300/25 transition-colors">
                                            <td className="p-3">
                                                <p className="text-sm font-medium text-surface-900">{client.name}</p>
                                                {productCount === 4 && (
                                                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-sun-green-500/15 text-sun-green-300">Full Stack</span>
                                                )}
                                            </td>
                                            <td className="p-3 text-center">
                                                {client.assets.solarPanels ? (
                                                    <span className="text-sm font-medium text-amber-300">{client.capacity.mw} MW</span>
                                                ) : (
                                                    <span className="text-sm text-surface-400">—</span>
                                                )}
                                            </td>
                                            <td className="p-3 text-center">
                                                {client.assets.bess ? (
                                                    <span className="text-sm font-medium text-emerald-300">{client.capacity.mwh} MWh</span>
                                                ) : (
                                                    <span className="text-sm text-surface-400">—</span>
                                                )}
                                            </td>
                                            <td className="p-3 text-center">
                                                {client.assets.evFleet ? (
                                                    <span className="text-sm font-medium text-blue-300">{client.capacity.vehicles} units</span>
                                                ) : (
                                                    <span className="text-sm text-surface-400">—</span>
                                                )}
                                            </td>
                                            <td className="p-3 text-center">
                                                {client.assets.chargers ? (
                                                    <span className="text-sm font-medium text-purple-300">{client.capacity.chargers} stations</span>
                                                ) : (
                                                    <span className="text-sm text-surface-400">—</span>
                                                )}
                                            </td>
                                            <td className="p-3 text-right">
                                                <span className="text-sm font-semibold text-surface-700">{productCount}/4</span>
                                            </td>
                                            <td className="p-3 text-right">
                                                <span className="text-sm font-medium text-emerald-300">${(client.costSavings / 1000).toFixed(0)}K</span>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </Section>
            )}

            {/* Section 5: Expansion Opportunities */}
            <Section
                title="Identified Expansion Opportunities"
                subtitle="Highest-confidence options for this site"
                icon={Target}
                color="purple"
            >
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    {siteGaps.map((gapKey, index) => {
                        const option = EXPANSION_OPTIONS[gapKey]
                        if (!option) return null
                        const Icon = option.icon

                        return (
                            <div key={gapKey} className="p-4 rounded-xl bg-surface-300/50 border border-surface-400/50 shadow-sm">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className={`w-8 h-8 rounded-lg bg-${option.color}-100 flex items-center justify-center`}>
                                        <span className="text-xs font-bold text-surface-600">#{index + 1}</span>
                                    </div>
                                    <div className={`w-10 h-10 rounded-xl bg-${option.color}-50 border border-${option.color}-200 flex items-center justify-center`}>
                                        <Icon className={`w-5 h-5 text-${option.color}-600`} />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-semibold text-surface-900">{option.label}</h4>
                                    </div>
                                </div>
                                <div className="space-y-2 mb-3">
                                    <div>
                                        <p className="text-[10px] text-surface-500 uppercase mb-1">Value Drivers</p>
                                        <div className="flex flex-wrap gap-1">
                                            {option.valueDrivers.map(driver => (
                                                <span key={driver} className={`text-[10px] px-2 py-0.5 rounded-full bg-${option.color}-50 text-${option.color}-700`}>
                                                    {driver}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-surface-100">
                                        <div>
                                            <p className="text-[10px] text-surface-500">Investment Range</p>
                                            <p className="text-xs font-medium text-surface-700">{option.investmentRange}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-surface-500">Payback Period</p>
                                            <p className="text-xs font-medium text-surface-700">{option.paybackRange}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </Section>

            {/* Section 6: Financial Calculator */}
            <Section
                title="Financial Scenarios"
                subtitle="Model expansion investments"
                icon={Calculator}
                color="cyan"
                defaultExpanded={true}
                actionButton={
                    <a
                        href="/mock-proposal-deck.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sun-green-500 text-white text-xs font-medium hover:bg-sun-green-600 transition-colors"
                    >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Generate Proposal</span>
                    </a>
                }
            >
                <div className="space-y-4">
                    {/* Row 1: Solar, BESS & Chargers */}
                    <div className="grid grid-cols-3 gap-4">
                        <NumberInput
                            label="Solar Expansion"
                            value={solarExpansion}
                            onChange={setSolarExpansion}
                            max={20}
                            min={0}
                            step={1}
                            icon={Sun}
                            unit="MW"
                            color="amber"
                        />
                        <NumberInput
                            label="BESS Capacity"
                            value={bessExpansion}
                            onChange={setBessExpansion}
                            max={50}
                            min={0}
                            step={2}
                            icon={Battery}
                            unit="MWh"
                            color="emerald"
                        />
                        <NumberInput
                            label="Charging Stations"
                            value={chargerUnits}
                            onChange={setChargerUnits}
                            max={50}
                            min={0}
                            step={2}
                            icon={Plug}
                            unit="stations"
                            color="purple"
                        />
                    </div>
                    {/* Row 2: Vehicle Types */}
                    <div className="bg-surface-300/25 rounded-xl p-4 border border-surface-200">
                        <h5 className="text-xs font-semibold text-blue-900 uppercase mb-3">EV Fleet by Vehicle Type</h5>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            <NumberInput
                                label={VEHICLE_TYPES.dumpTruck.label}
                                value={dumpTrucks}
                                onChange={setDumpTrucks}
                                max={50}
                                min={0}
                                step={1}
                                unit="units"
                                color="blue"
                            />
                            <NumberInput
                                label={VEHICLE_TYPES.wheelLoader.label}
                                value={wheelLoaders}
                                onChange={setWheelLoaders}
                                max={50}
                                min={0}
                                step={1}
                                unit="units"
                                color="blue"
                            />
                            <NumberInput
                                label={VEHICLE_TYPES.lv.label}
                                value={lightVehicles}
                                onChange={setLightVehicles}
                                max={100}
                                min={0}
                                step={5}
                                unit="units"
                                color="blue"
                            />
                            <NumberInput
                                label={VEHICLE_TYPES.wideBody.label}
                                value={wideBodies}
                                onChange={setWideBodies}
                                max={50}
                                min={0}
                                step={1}
                                unit="units"
                                color="blue"
                            />
                        </div>
                    </div>
                </div>

                {projections.hasInput ? (
                    <div className="space-y-4 mt-6">
                        {/* Investment Breakdown */}
                        <div className="p-4 rounded-xl bg-gradient-to-r from-surface-50 to-surface-100 border border-surface-200">
                            <h4 className="text-xs font-semibold text-surface-600 uppercase mb-3">Investment Breakdown</h4>

                            {/* Row 1: Infrastructure (Solar, BESS, Charging) */}
                            <div className="grid grid-cols-3 gap-3 mb-3">
                                {projections.costs.solar > 0 && (
                                    <div className="text-center p-2 rounded-lg bg-surface-300/50 border border-surface-400/50">
                                        <p className="text-[10px] text-surface-500">Solar</p>
                                        <p className="text-sm font-bold text-surface-900">{formatCurrency(projections.costs.solar)}</p>
                                    </div>
                                )}
                                {projections.costs.bess > 0 && (
                                    <div className="text-center p-2 rounded-lg bg-surface-300/50 border border-surface-400/50">
                                        <p className="text-[10px] text-surface-500">BESS</p>
                                        <p className="text-sm font-bold text-surface-900">{formatCurrency(projections.costs.bess)}</p>
                                    </div>
                                )}
                                {projections.costs.charger > 0 && (
                                    <div className="text-center p-2 rounded-lg bg-surface-300/50 border border-surface-400/50">
                                        <p className="text-[10px] text-surface-500">Charging</p>
                                        <p className="text-sm font-bold text-surface-900">{formatCurrency(projections.costs.charger)}</p>
                                    </div>
                                )}
                            </div>

                            {/* Row 2: Vehicles (DT, WL, LV, WB) */}
                            {(projections.costs.dumpTruck > 0 || projections.costs.wheelLoader > 0 || projections.costs.lv > 0 || projections.costs.wideBody > 0) && (
                                <div className="grid grid-cols-4 gap-3">
                                    {projections.costs.dumpTruck > 0 && (
                                        <div className="text-center p-2 rounded-lg bg-surface-300/50 border border-surface-400/50">
                                            <p className="text-[10px] text-surface-500">Dump Truck</p>
                                            <p className="text-sm font-bold text-surface-900">{formatCurrency(projections.costs.dumpTruck)}</p>
                                        </div>
                                    )}
                                    {projections.costs.wheelLoader > 0 && (
                                        <div className="text-center p-2 rounded-lg bg-surface-300/50 border border-surface-400/50">
                                            <p className="text-[10px] text-surface-500">Wheel Loader</p>
                                            <p className="text-sm font-bold text-surface-900">{formatCurrency(projections.costs.wheelLoader)}</p>
                                        </div>
                                    )}
                                    {projections.costs.lv > 0 && (
                                        <div className="text-center p-2 rounded-lg bg-surface-300/50 border border-surface-400/50">
                                            <p className="text-[10px] text-surface-500">Light Vehicle</p>
                                            <p className="text-sm font-bold text-surface-900">{formatCurrency(projections.costs.lv)}</p>
                                        </div>
                                    )}
                                    {projections.costs.wideBody > 0 && (
                                        <div className="text-center p-2 rounded-lg bg-surface-300/50 border border-surface-400/50">
                                            <p className="text-[10px] text-surface-500">Wide Body</p>
                                            <p className="text-sm font-bold text-surface-900">{formatCurrency(projections.costs.wideBody)}</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Results Summary */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="p-4 rounded-xl bg-surface-300/50 border border-surface-400/50 shadow-sm text-center">
                                <p className="text-xs text-surface-500 uppercase mb-1">Total Investment</p>
                                <p className="text-2xl font-bold text-surface-900">{formatCurrency(projections.totalInvestment)}</p>
                            </div>
                            <div className="p-4 rounded-xl bg-surface-200 border-2 border-sun-green-500 shadow-sm text-center">
                                <p className="text-xs text-sun-green-300 uppercase mb-1">Annual Return</p>
                                <p className="text-2xl font-bold text-sun-green-300">+{formatCurrency(projections.annualReturn)}</p>
                            </div>
                            <div className="p-4 rounded-xl bg-surface-300/50 border border-surface-400/50 shadow-sm text-center">
                                <p className="text-xs text-surface-500 uppercase mb-1">Payback Period</p>
                                <p className="text-2xl font-bold text-surface-900">{projections.paybackYears.toFixed(1)} years</p>
                            </div>
                            <div className="p-4 rounded-xl bg-surface-300/50 border border-surface-400/50 shadow-sm text-center">
                                <p className="text-xs text-surface-500 uppercase mb-1">10-Year ROI</p>
                                <p className="text-2xl font-bold text-surface-900">{projections.roiPercent > 0 ? '+' : ''}{projections.roiPercent.toFixed(0)}%</p>
                            </div>
                        </div>

                        {/* Side-by-side comparison */}
                        <div className="p-4 rounded-xl bg-surface-300/20 border border-surface-300/50">
                            <h4 className="text-sm font-semibold text-surface-900 mb-3">Scenario Comparison</h4>
                            <div className="grid grid-cols-3 gap-4">
                                <div className="text-center p-3 rounded-lg bg-surface-300/40 border border-surface-400/50">
                                    <p className="text-[10px] text-surface-700 uppercase tracking-wider mb-1">Current State</p>
                                    <p className="text-lg font-bold text-surface-900">{formatCurrency(siteData.costSavings.ytd)}</p>
                                    <p className="text-[10px] text-surface-600">Annual savings</p>
                                </div>
                                <div className="text-center p-3 rounded-lg bg-sun-green-500/15 border border-sun-green-400/40">
                                    <p className="text-[10px] text-sun-green-400 uppercase tracking-wider mb-1">With Expansion</p>
                                    <p className="text-lg font-bold text-sun-green-300">{formatCurrency(siteData.costSavings.ytd + projections.annualReturn)}</p>
                                    <p className="text-[10px] text-sun-green-400">Annual savings</p>
                                </div>
                                <div className="text-center p-3 rounded-lg bg-sun-green-500/20 border border-sun-green-400/50" style={{boxShadow: '0 0 16px rgba(99,102,241,0.15)'}}>
                                    <p className="text-[10px] text-sun-green-300 uppercase tracking-wider mb-1">Net Improvement</p>
                                    <p className="text-lg font-bold text-sun-green-200">+{((projections.annualReturn / siteData.costSavings.ytd) * 100).toFixed(0)}%</p>
                                    <p className="text-[10px] text-sun-green-400">Increase in value</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-8 text-surface-500">
                        <Calculator className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">Use the controls above to model expansion scenarios</p>
                    </div>
                )}
            </Section>

            {/* Section 7: Operational & Sustainability Impact */}
            <Section
                title="Operational & Sustainability Impact"
                subtitle="CSO / COO alignment metrics"
                icon={Leaf}
                color="emerald"
            >
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="p-4 rounded-xl bg-surface-300/50 border border-surface-400/50 shadow-sm">
                        <div className="flex items-center gap-2 mb-2">
                            <Shield className="w-4 h-4 text-blue-300" />
                            <span className="text-xs text-blue-300 font-medium">Uptime Improvement</span>
                        </div>
                        <p className="text-2xl font-bold text-blue-300">+{projections.hasInput ? '0.5-1.2' : '0'}%</p>
                        <p className="text-xs text-blue-500">With BESS backup</p>
                    </div>
                    <div className="p-4 rounded-xl bg-surface-300/50 border border-surface-400/50 shadow-sm">
                        <div className="flex items-center gap-2 mb-2">
                            <Zap className="w-4 h-4 text-purple-600" />
                            <span className="text-xs text-purple-600 font-medium">Resilience Score</span>
                        </div>
                        <p className="text-2xl font-bold text-purple-300">{projections.hasInput ? 'High' : 'Medium'}</p>
                        <p className="text-xs text-purple-500">Power continuity</p>
                    </div>
                    <div className="p-4 rounded-xl bg-surface-300/50 border border-surface-400/50 shadow-sm">
                        <div className="flex items-center gap-2 mb-2">
                            <Leaf className="w-4 h-4 text-emerald-400" />
                            <span className="text-xs text-emerald-400 font-medium">Add'l Emissions Avoided</span>
                        </div>
                        <p className="text-2xl font-bold text-emerald-300">
                            +{projections.hasInput ? formatNumber(Math.round((solarExpansion * 400) + ((dumpTrucks + wheelLoaders + lightVehicles + wideBodies) * 8))) : '0'} tCO₂/yr
                        </p>
                        <p className="text-xs text-emerald-500">With expansion</p>
                    </div>
                    <div className="p-4 rounded-xl bg-surface-300/50 border border-surface-400/50 shadow-sm">
                        <div className="flex items-center gap-2 mb-2">
                            <Target className="w-4 h-4 text-amber-300" />
                            <span className="text-xs text-amber-300 font-medium">ESG Target Progress</span>
                        </div>
                        <p className="text-2xl font-bold text-amber-300">
                            +{projections.hasInput ? Math.round((solarExpansion * 2) + (bessExpansion * 0.5) + ((dumpTrucks + wheelLoaders + lightVehicles + wideBodies) * 0.3)) : '0'}%
                        </p>
                        <p className="text-xs text-amber-500">Toward 2030 goals</p>
                    </div>
                </div>
            </Section>


        </div>
    )
}

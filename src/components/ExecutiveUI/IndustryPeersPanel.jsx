import React, { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    TrendingUp,
    ChevronDown,
    Sun,
    Battery,
    Car,
    Zap,
    Lightbulb,
    Sparkles,
    Target,
    Award,
    BarChart2,
    DollarSign,
    ArrowUpRight,
    FileDown,
    Presentation,
    Calculator,
    Plus,
    Minus,
    Gauge
} from 'lucide-react'
import { INDUSTRIES } from './IndustryFilterPanel'

/**
 * IndustryPeersPanel Component
 * 
 * Displays CLIENT-ONLY comparison for upsell opportunities.
 * Every company shown is a Nova Energy client - we benchmark against
 * the client with the most complete product stack to identify upsell potentials.
 */

// Asset type icons, labels, and estimated revenue per product
const ASSET_TYPES = {
    solarPanels: {
        label: 'Solar PV',
        shortLabel: 'PV',
        icon: Sun,
        color: 'amber',
        // Estimated annual revenue per MW capacity
        revenuePerMW: 180000, // $180K/MW/year
        capacityKey: 'mw',
        unit: 'MW',
    },
    bess: {
        label: 'BESS',
        shortLabel: 'BESS',
        icon: Battery,
        color: 'emerald',
        // Estimated annual revenue per MWh
        revenuePerMWh: 95000, // $95K/MWh/year
        capacityKey: 'mwh',
        unit: 'MWh',
    },
    evFleet: {
        label: 'EV Fleet',
        shortLabel: 'EV',
        icon: Car,
        color: 'blue',
        // Estimated annual revenue per vehicle
        revenuePerUnit: 12000, // $12K/vehicle/year
        capacityKey: 'vehicles',
        unit: 'units',
    },
    chargers: {
        label: 'EVSE',
        shortLabel: 'EVSE',
        icon: Zap,
        color: 'purple',
        // Estimated annual revenue per charger
        revenuePerUnit: 8500, // $8.5K/charger/year
        capacityKey: 'chargers',
        unit: 'stations',
    },
}

// Client-only mock data with capacity details for revenue calculation
const CLIENT_DATA_BY_INDUSTRY = {
    mining: {
        label: 'Mining & Resources',
        clients: [
            {
                id: 'mining-1',
                name: 'PT Borneo Prima Mining',
                location: 'East Kalimantan',
                capacity: { mw: 25.0, mwh: 12, vehicles: 45, chargers: 20 },
                assets: { solarPanels: true, bess: true, evFleet: true, chargers: true },
                currentAnnualRevenue: 7850000,
            },
            {
                id: 'mining-2',
                name: 'Kalindo Energy',
                location: 'South Kalimantan',
                capacity: { mw: 18.0, mwh: 0, vehicles: 0, chargers: 0 },
                assets: { solarPanels: true, bess: false, evFleet: false, chargers: false },
                currentAnnualRevenue: 3240000,
            },
            {
                id: 'mining-3',
                name: 'Nusantara Resources',
                location: 'Central Kalimantan',
                capacity: { mw: 15.0, mwh: 8, vehicles: 0, chargers: 0 },
                assets: { solarPanels: true, bess: true, evFleet: false, chargers: false },
                currentAnnualRevenue: 3460000,
            },
            {
                id: 'mining-4',
                name: 'Sumatra Coal Group',
                location: 'South Sumatra',
                capacity: { mw: 12.0, mwh: 6, vehicles: 20, chargers: 0 },
                assets: { solarPanels: true, bess: true, evFleet: true, chargers: false },
                currentAnnualRevenue: 3070000,
            },
            {
                id: 'mining-5',
                name: 'Indo Timur Mining',
                location: 'East Kalimantan',
                capacity: { mw: 8.0, mwh: 0, vehicles: 0, chargers: 0 },
                assets: { solarPanels: true, bess: false, evFleet: false, chargers: false },
                currentAnnualRevenue: 1440000,
            },
        ],
    },
    manufacturing: {
        label: 'Manufacturing',
        clients: [
            {
                id: 'mfg-1',
                name: 'Nusantara Automotive Group',
                location: 'Jakarta',
                capacity: { mw: 35.0, mwh: 18, vehicles: 60, chargers: 35 },
                assets: { solarPanels: true, bess: true, evFleet: true, chargers: true },
                currentAnnualRevenue: 9745000,
            },
            {
                id: 'mfg-2',
                name: 'Makmur Foods Indonesia',
                location: 'Semarang',
                capacity: { mw: 22.0, mwh: 10, vehicles: 0, chargers: 0 },
                assets: { solarPanels: true, bess: true, evFleet: false, chargers: false },
                currentAnnualRevenue: 4910000,
            },
            {
                id: 'mfg-3',
                name: 'Harum Consumer Goods',
                location: 'Cikarang',
                capacity: { mw: 18.0, mwh: 8, vehicles: 25, chargers: 0 },
                assets: { solarPanels: true, bess: true, evFleet: true, chargers: false },
                currentAnnualRevenue: 4300000,
            },
            {
                id: 'mfg-4',
                name: 'Garuda Consumer Group',
                location: 'Surabaya',
                capacity: { mw: 15.0, mwh: 0, vehicles: 0, chargers: 0 },
                assets: { solarPanels: true, bess: false, evFleet: false, chargers: false },
                currentAnnualRevenue: 2700000,
            },
            {
                id: 'mfg-5',
                name: 'Tangerang Food Industries',
                location: 'Tangerang',
                capacity: { mw: 12.0, mwh: 6, vehicles: 0, chargers: 0 },
                assets: { solarPanels: true, bess: true, evFleet: false, chargers: false },
                currentAnnualRevenue: 2730000,
            },
        ],
    },
    retail: {
        label: 'Retail & Commercial',
        clients: [
            {
                id: 'retail-1',
                name: 'Archipelago Malls Group',
                location: 'Multi-site',
                capacity: { mw: 28.0, mwh: 14, vehicles: 0, chargers: 45 },
                assets: { solarPanels: true, bess: true, evFleet: false, chargers: true },
                currentAnnualRevenue: 6715000,
            },
            {
                id: 'retail-2',
                name: 'Surya Property Group',
                location: 'Surabaya',
                capacity: { mw: 20.0, mwh: 10, vehicles: 0, chargers: 30 },
                assets: { solarPanels: true, bess: true, evFleet: false, chargers: true },
                currentAnnualRevenue: 4805000,
            },
            {
                id: 'retail-3',
                name: 'Bintang Department Store',
                location: 'Jakarta',
                capacity: { mw: 14.0, mwh: 0, vehicles: 0, chargers: 20 },
                assets: { solarPanels: true, bess: false, evFleet: false, chargers: true },
                currentAnnualRevenue: 2690000,
            },
            {
                id: 'retail-4',
                name: 'Pratama Retail Group',
                location: 'Tangerang',
                capacity: { mw: 10.0, mwh: 0, vehicles: 35, chargers: 0 },
                assets: { solarPanels: true, bess: false, evFleet: true, chargers: false },
                currentAnnualRevenue: 2220000,
            },
        ],
    },
    logistics: {
        label: 'Logistics & Transport',
        clients: [
            {
                id: 'log-1',
                name: 'Cepat Logistik Express',
                location: 'Jakarta',
                capacity: { mw: 18.0, mwh: 8, vehicles: 80, chargers: 40 },
                assets: { solarPanels: true, bess: true, evFleet: true, chargers: true },
                currentAnnualRevenue: 5340000,
            },
            {
                id: 'log-2',
                name: 'Nusa Cargo Indonesia',
                location: 'Multi-site',
                capacity: { mw: 12.0, mwh: 5, vehicles: 50, chargers: 0 },
                assets: { solarPanels: true, bess: true, evFleet: true, chargers: false },
                currentAnnualRevenue: 3235000,
            },
            {
                id: 'log-3',
                name: 'Antar Pos Nusantara',
                location: 'Bandung',
                capacity: { mw: 10.0, mwh: 0, vehicles: 40, chargers: 0 },
                assets: { solarPanels: true, bess: false, evFleet: true, chargers: false },
                currentAnnualRevenue: 2280000,
            },
            {
                id: 'log-4',
                name: 'Kilat Ekspres Indonesia',
                location: 'Jakarta',
                capacity: { mw: 8.0, mwh: 0, vehicles: 0, chargers: 0 },
                assets: { solarPanels: true, bess: false, evFleet: false, chargers: false },
                currentAnnualRevenue: 1440000,
            },
        ],
    },
    energy: {
        label: 'Energy & Utilities',
        clients: [
            {
                id: 'energy-1',
                name: 'Energi Baru Nusantara',
                location: 'Multi-site',
                capacity: { mw: 45.0, mwh: 25, vehicles: 30, chargers: 25 },
                assets: { solarPanels: true, bess: true, evFleet: true, chargers: true },
                currentAnnualRevenue: 11085000,
            },
            {
                id: 'energy-2',
                name: 'Riau Power Holdings',
                location: 'Riau',
                capacity: { mw: 28.0, mwh: 15, vehicles: 0, chargers: 0 },
                assets: { solarPanels: true, bess: true, evFleet: false, chargers: false },
                currentAnnualRevenue: 6465000,
            },
            {
                id: 'energy-3',
                name: 'Pacific Energi Group',
                location: 'Jakarta',
                capacity: { mw: 20.0, mwh: 0, vehicles: 0, chargers: 0 },
                assets: { solarPanels: true, bess: false, evFleet: false, chargers: false },
                currentAnnualRevenue: 3600000,
            },
        ],
    },
    industrial: {
        label: 'Industrial Parks',
        clients: [
            {
                id: 'ind-1',
                name: 'Bekasi Industrial Estate',
                location: 'Bekasi',
                capacity: { mw: 55.0, mwh: 28, vehicles: 40, chargers: 50 },
                assets: { solarPanels: true, bess: true, evFleet: true, chargers: true },
                currentAnnualRevenue: 14085000,
            },
            {
                id: 'ind-2',
                name: 'Karawang Industrial City',
                location: 'Karawang',
                capacity: { mw: 40.0, mwh: 20, vehicles: 0, chargers: 35 },
                assets: { solarPanels: true, bess: true, evFleet: false, chargers: true },
                currentAnnualRevenue: 9397500,
            },
            {
                id: 'ind-3',
                name: 'Cikarang Business Park',
                location: 'Cikarang',
                capacity: { mw: 35.0, mwh: 18, vehicles: 25, chargers: 0 },
                assets: { solarPanels: true, bess: true, evFleet: true, chargers: false },
                currentAnnualRevenue: 8310000,
            },
            {
                id: 'ind-4',
                name: 'Central Java Industrial Zone',
                location: 'Central Java',
                capacity: { mw: 25.0, mwh: 0, vehicles: 0, chargers: 0 },
                assets: { solarPanels: true, bess: false, evFleet: false, chargers: false },
                currentAnnualRevenue: 4500000,
            },
        ],
    },
}

// Calculate potential revenue for missing products based on benchmark
function calculateUpsellPotential(client, benchmark) {
    if (!benchmark || client.id === benchmark.id) return { products: [], totalRevenue: 0 }

    const products = []
    let totalRevenue = 0

    // For each asset type, if benchmark has it but client doesn't, calculate potential
    Object.entries(ASSET_TYPES).forEach(([key, config]) => {
        if (benchmark.assets[key] && !client.assets[key]) {
            // Estimate capacity based on benchmark ratio to client's solar capacity
            const capacityRatio = client.capacity.mw / benchmark.capacity.mw
            let estimatedRevenue = 0
            let estimatedCapacity = ''

            switch (key) {
                case 'bess':
                    const estimatedMWh = Math.round(benchmark.capacity.mwh * capacityRatio)
                    estimatedRevenue = estimatedMWh * config.revenuePerMWh
                    estimatedCapacity = `${estimatedMWh} MWh`
                    break
                case 'evFleet':
                    const estimatedVehicles = Math.round(benchmark.capacity.vehicles * capacityRatio)
                    estimatedRevenue = estimatedVehicles * config.revenuePerUnit
                    estimatedCapacity = `${estimatedVehicles} vehicles`
                    break
                case 'chargers':
                    const estimatedChargers = Math.round(benchmark.capacity.chargers * capacityRatio)
                    estimatedRevenue = estimatedChargers * config.revenuePerUnit
                    estimatedCapacity = `${estimatedChargers} units`
                    break
                default:
                    break
            }

            if (estimatedRevenue > 0) {
                products.push({
                    key,
                    label: config.label,
                    icon: config.icon,
                    color: config.color,
                    estimatedCapacity,
                    estimatedRevenue,
                })
                totalRevenue += estimatedRevenue
            }
        }
    })

    return { products, totalRevenue }
}

// Inline Financial Simulator for upsell modeling within each client's dropdown
function InlineFinancialSimulator({ client }) {
    const [bessExpansion, setBessExpansion] = useState(0)
    const [evFleetExpansion, setEvFleetExpansion] = useState(0)
    const [chargerExpansion, setChargerExpansion] = useState(0)
    const [solarExpansion, setSolarExpansion] = useState(0)
    const [isExpanded, setIsExpanded] = useState(false)

    // Unit economics for upsell calculations
    const unitEconomics = {
        bess: { investmentPerMWh: 200000, returnPerMWh: 30000 },
        evFleet: { investmentPerUnit: 55000, returnPerUnit: 8000 },
        charger: { investmentPerUnit: 65000, returnPerUnit: 12000 },
        solar: { investmentPerMW: 800000, returnPerMW: 110000 },
    }

    // Calculate upsell projections
    const projections = useMemo(() => {
        const bessInv = bessExpansion * unitEconomics.bess.investmentPerMWh
        const bessRet = bessExpansion * unitEconomics.bess.returnPerMWh

        const evInv = evFleetExpansion * unitEconomics.evFleet.investmentPerUnit
        const evRet = evFleetExpansion * unitEconomics.evFleet.returnPerUnit

        const chargerInv = chargerExpansion * unitEconomics.charger.investmentPerUnit
        const chargerRet = chargerExpansion * unitEconomics.charger.returnPerUnit

        const solarInv = solarExpansion * unitEconomics.solar.investmentPerMW
        const solarRet = solarExpansion * unitEconomics.solar.returnPerMW

        const totalInvestment = bessInv + evInv + chargerInv + solarInv
        const annualReturn = bessRet + evRet + chargerRet + solarRet
        const paybackYears = totalInvestment > 0 ? totalInvestment / annualReturn : 0
        const tenYearROI = (annualReturn * 10) - totalInvestment

        return {
            totalInvestment,
            annualReturn,
            paybackYears,
            tenYearROI,
            hasInput: totalInvestment > 0
        }
    }, [bessExpansion, evFleetExpansion, chargerExpansion, solarExpansion])

    // Number input with +/- buttons
    const NumberInputSmall = ({ label, value, onChange, max, icon: Icon, unit, color }) => (
        <div className={`p-2 rounded-lg border ${value > 0 ? `bg-${color}-50 border-${color}-200` : 'bg-surface-300/25 border-surface-200'}`}>
            <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1">
                    <Icon className={`w-3 h-3 ${value > 0 ? `text-${color}-500` : 'text-surface-400'}`} />
                    <span className="text-[10px] text-surface-600">{label}</span>
                </div>
            </div>
            <div className="flex items-center justify-between">
                <button
                    onClick={(e) => { e.stopPropagation(); onChange(Math.max(0, value - 1)) }}
                    className="w-5 h-5 rounded bg-surface-200 hover:bg-surface-300 flex items-center justify-center"
                >
                    <Minus className="w-2.5 h-2.5 text-surface-600" />
                </button>
                <span className={`text-sm font-bold ${value > 0 ? 'text-surface-900' : 'text-surface-400'}`}>
                    {value} <span className="text-[10px] font-normal text-surface-500">{unit}</span>
                </span>
                <button
                    onClick={(e) => { e.stopPropagation(); onChange(Math.min(max, value + 1)) }}
                    className="w-5 h-5 rounded bg-surface-200 hover:bg-surface-300 flex items-center justify-center"
                >
                    <Plus className="w-2.5 h-2.5 text-surface-600" />
                </button>
            </div>
        </div>
    )

    return (
        <div className="mt-4 pt-4 border-t border-surface-200">
            {/* Header */}
            <button
                onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded) }}
                className="w-full flex items-center justify-between mb-3"
            >
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-sun-green-500/15 flex items-center justify-center">
                        <Calculator className="w-3.5 h-3.5 text-sun-green-300" />
                    </div>
                    <span className="text-xs font-semibold text-surface-700">
                        Financial Upsell Simulator
                    </span>
                </div>
                <motion.div
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    className="w-5 h-5 rounded bg-surface-100 flex items-center justify-center"
                >
                    <ChevronDown className="w-3 h-3 text-surface-500" />
                </motion.div>
            </button>

            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        {/* Expansion Inputs */}
                        <div className="grid grid-cols-4 gap-2 mb-4">
                            <NumberInputSmall
                                label="BESS"
                                value={bessExpansion}
                                onChange={setBessExpansion}
                                max={50}
                                icon={Battery}
                                unit="MWh"
                                color="emerald"
                            />
                            <NumberInputSmall
                                label="EV Fleet"
                                value={evFleetExpansion}
                                onChange={setEvFleetExpansion}
                                max={100}
                                icon={Car}
                                unit="units"
                                color="blue"
                            />
                            <NumberInputSmall
                                label="Chargers"
                                value={chargerExpansion}
                                onChange={setChargerExpansion}
                                max={50}
                                icon={Zap}
                                unit="stations"
                                color="purple"
                            />
                            <NumberInputSmall
                                label="Solar+"
                                value={solarExpansion}
                                onChange={setSolarExpansion}
                                max={20}
                                icon={Sun}
                                unit="MW"
                                color="amber"
                            />
                        </div>

                        {/* Results Summary */}
                        {projections.hasInput && (
                            <div className="grid grid-cols-4 gap-2 p-3 rounded-lg bg-gradient-to-r from-sun-green-50 to-emerald-50 border border-sun-green-400/35">
                                <div className="text-center">
                                    <p className="text-[10px] text-surface-500 uppercase">Investment</p>
                                    <p className="text-sm font-bold text-surface-900">
                                        {projections.totalInvestment >= 1000000
                                            ? `$${(projections.totalInvestment / 1000000).toFixed(1)}M`
                                            : `$${(projections.totalInvestment / 1000).toFixed(0)}K`}
                                    </p>
                                </div>
                                <div className="text-center">
                                    <p className="text-[10px] text-surface-500 uppercase">Annual Return</p>
                                    <p className="text-sm font-bold text-emerald-400">
                                        +${(projections.annualReturn / 1000).toFixed(0)}K/yr
                                    </p>
                                </div>
                                <div className="text-center">
                                    <p className="text-[10px] text-surface-500 uppercase">Payback</p>
                                    <p className="text-sm font-bold text-blue-300">
                                        {projections.paybackYears.toFixed(1)} yrs
                                    </p>
                                </div>
                                <div className="text-center">
                                    <p className="text-[10px] text-surface-500 uppercase">10-Yr ROI</p>
                                    <p className={`text-sm font-bold ${projections.tenYearROI >= 0 ? 'text-sun-green-300' : 'text-rose-400'}`}>
                                        {projections.tenYearROI >= 0 ? '+' : ''}{projections.tenYearROI >= 1000000
                                            ? `$${(projections.tenYearROI / 1000000).toFixed(1)}M`
                                            : `$${(projections.tenYearROI / 1000).toFixed(0)}K`}
                                    </p>
                                </div>
                            </div>
                        )}

                        {!projections.hasInput && (
                            <p className="text-center text-xs text-surface-500 py-2">
                                Use the sliders above to model upsell scenarios for {client.name}
                            </p>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

// Format currency
function formatCurrency(value) {
    if (value >= 1000000) {
        return `$${(value / 1000000).toFixed(1)}M`
    }
    return `$${(value / 1000).toFixed(0)}K`
}

// Asset presence badge
function AssetBadge({ assetKey, hasAsset }) {
    const config = ASSET_TYPES[assetKey]
    const Icon = config.icon

    return (
        <div
            className={`
                flex items-center justify-center w-8 h-8 rounded-lg transition-all
                ${hasAsset
                    ? `bg-${config.color}-50 border border-${config.color}-200`
                    : 'bg-surface-100 border border-dashed border-surface-300'
                }
            `}
            title={hasAsset ? config.label : `Missing: ${config.label}`}
        >
            <Icon className={`w-4 h-4 ${hasAsset ? `text-${config.color}-500` : 'text-surface-300'}`} />
        </div>
    )
}

// Site detail information for sales pitch
const SITE_PERFORMANCE_METRICS = {
    'mining-1': { costSaved: 2850000, productionFulfillment: 98.5, carbonOffset: 12500, uptime: 99.2 },
    'mining-2': { costSaved: 1450000, productionFulfillment: 95.2, carbonOffset: 8200, uptime: 97.8 },
    'mining-3': { costSaved: 1680000, productionFulfillment: 96.8, carbonOffset: 7800, uptime: 98.5 },
    'mining-4': { costSaved: 1520000, productionFulfillment: 97.1, carbonOffset: 6500, uptime: 98.9 },
    'mining-5': { costSaved: 890000, productionFulfillment: 94.5, carbonOffset: 4200, uptime: 96.2 },
    'mfg-1': { costSaved: 3250000, productionFulfillment: 99.1, carbonOffset: 18500, uptime: 99.5 },
    'mfg-2': { costSaved: 1980000, productionFulfillment: 97.3, carbonOffset: 11200, uptime: 98.1 },
    'mfg-3': { costSaved: 1750000, productionFulfillment: 96.5, carbonOffset: 9800, uptime: 97.9 },
    'mfg-4': { costSaved: 1120000, productionFulfillment: 95.8, carbonOffset: 7500, uptime: 97.2 },
    'mfg-5': { costSaved: 1080000, productionFulfillment: 96.2, carbonOffset: 6200, uptime: 97.6 },
    'retail-1': { costSaved: 2680000, productionFulfillment: 98.2, carbonOffset: 14200, uptime: 99.1 },
    'retail-2': { costSaved: 1920000, productionFulfillment: 97.5, carbonOffset: 10500, uptime: 98.4 },
    'retail-3': { costSaved: 1080000, productionFulfillment: 95.9, carbonOffset: 7100, uptime: 97.0 },
    'retail-4': { costSaved: 920000, productionFulfillment: 94.8, carbonOffset: 5200, uptime: 96.5 },
    'log-1': { costSaved: 2150000, productionFulfillment: 98.0, carbonOffset: 9500, uptime: 98.8 },
    'log-2': { costSaved: 1350000, productionFulfillment: 96.4, carbonOffset: 6200, uptime: 97.5 },
    'log-3': { costSaved: 980000, productionFulfillment: 95.2, carbonOffset: 5100, uptime: 96.8 },
    'log-4': { costSaved: 620000, productionFulfillment: 94.0, carbonOffset: 4100, uptime: 95.5 },
    'energy-1': { costSaved: 4250000, productionFulfillment: 99.3, carbonOffset: 23500, uptime: 99.6 },
    'energy-2': { costSaved: 2580000, productionFulfillment: 97.8, carbonOffset: 14500, uptime: 98.5 },
    'energy-3': { costSaved: 1480000, productionFulfillment: 96.0, carbonOffset: 10200, uptime: 97.2 },
    'ind-1': { costSaved: 5450000, productionFulfillment: 99.5, carbonOffset: 28500, uptime: 99.7 },
    'ind-2': { costSaved: 3720000, productionFulfillment: 98.6, carbonOffset: 20500, uptime: 99.2 },
    'ind-3': { costSaved: 3280000, productionFulfillment: 98.1, carbonOffset: 18200, uptime: 98.9 },
    'ind-4': { costSaved: 1820000, productionFulfillment: 96.5, carbonOffset: 12800, uptime: 97.8 },
}

// Client row with upsell details
function ClientRow({ client, benchmark, isExpanded, onToggle }) {
    const upsellData = useMemo(() => calculateUpsellPotential(client, benchmark), [client, benchmark])
    const assetCount = Object.values(client.assets).filter(Boolean).length
    const maxAssets = Object.keys(ASSET_TYPES).length
    const siteMetrics = SITE_PERFORMANCE_METRICS[client.id] || { costSaved: 0, productionFulfillment: 95, carbonOffset: 0, uptime: 96 }

    // Calculate potential revenue increase percentage
    const revenueIncrease = upsellData.totalRevenue > 0
        ? ((upsellData.totalRevenue / client.currentAnnualRevenue) * 100).toFixed(0)
        : 0

    return (
        <div className="border border-surface-200 rounded-xl overflow-hidden bg-surface-200">
            {/* Main row */}
            <div
                className="flex items-center gap-4 p-3 cursor-pointer transition-all hover:bg-surface-300/25"
                onClick={() => onToggle()}
            >
                {/* Client info */}
                <div className="flex-1 min-w-0">
                    <h5 className="text-sm font-semibold text-surface-900 truncate">{client.name}</h5>
                    <div className="flex items-center gap-2 text-[10px] text-surface-500">
                        <span>{client.location}</span>
                        <span>•</span>
                        <span className="font-medium text-surface-700">{client.capacity.mw} MW</span>
                        <span>•</span>
                        <span className="text-emerald-400 font-medium">{formatCurrency(client.currentAnnualRevenue)}/yr</span>
                    </div>
                </div>

                {/* Asset badges */}
                <div className="flex items-center gap-1.5">
                    {Object.keys(ASSET_TYPES).map(key => (
                        <AssetBadge
                            key={key}
                            assetKey={key}
                            hasAsset={client.assets[key]}
                        />
                    ))}
                </div>

                {/* Product score */}
                <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-surface-100">
                    <BarChart2 className="w-3 h-3 text-surface-500" />
                    <span className="text-xs font-bold text-surface-600">
                        {assetCount}/{maxAssets}
                    </span>
                </div>

                {/* Upsell potential & expand button */}
                <div className="flex items-center gap-2">
                    {upsellData.totalRevenue > 0 && (
                        <>
                            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-amber-500/12 border border-amber-400/35">
                                <DollarSign className="w-3.5 h-3.5 text-amber-300" />
                                <span className="text-xs font-bold text-amber-300">
                                    +{formatCurrency(upsellData.totalRevenue)}
                                </span>
                            </div>
                            <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-500/12 border border-emerald-400/30">
                                <ArrowUpRight className="w-3 h-3 text-emerald-400" />
                                <span className="text-[10px] font-bold text-emerald-300">+{revenueIncrease}%</span>
                            </div>
                        </>
                    )}
                    <motion.div
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        className="w-6 h-6 rounded-md bg-surface-100 flex items-center justify-center"
                    >
                        <ChevronDown className="w-3.5 h-3.5 text-surface-500" />
                    </motion.div>
                </div>
            </div>

            {/* Expanded details section */}
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden border-t border-surface-200"
                    >
                        <div className="p-4 bg-gradient-to-r from-blue-50/50 to-purple-50/50">
                            {/* Site Details Section - New */}
                            <div className="mb-4">
                                <div className="flex items-center gap-2 mb-3">
                                    <BarChart2 className="w-4 h-4 text-blue-300" />
                                    <span className="text-xs font-semibold text-surface-700">
                                        Site Performance & Asset Details
                                    </span>
                                </div>

                                {/* Current Assets Grid - showing actual capacity values */}
                                <div className="grid grid-cols-4 gap-2 mb-3">
                                    {Object.entries(ASSET_TYPES).map(([key, config]) => {
                                        const Icon = config.icon
                                        const hasAsset = client.assets[key]
                                        const capacityValue = client.capacity[config.capacityKey] || 0
                                        return (
                                            <div
                                                key={key}
                                                className={`p-2 rounded-lg border ${hasAsset ? `bg-${config.color}-50 border-${config.color}-200` : 'bg-surface-300/25 border-surface-200 opacity-50'}`}
                                            >
                                                <div className="flex items-center gap-2">
                                                    <Icon className={`w-4 h-4 ${hasAsset ? `text-${config.color}-500` : 'text-surface-400'}`} />
                                                    <span className={`text-xs font-medium ${hasAsset ? 'text-surface-700' : 'text-surface-400'}`}>
                                                        {config.label}
                                                    </span>
                                                </div>
                                                <p className={`text-lg font-bold mt-1 ${hasAsset ? 'text-surface-900' : 'text-surface-400'}`}>
                                                    {hasAsset ? `${capacityValue} ${config.unit}` : '—'}
                                                </p>
                                            </div>
                                        )
                                    })}
                                </div>

                                {/* Performance Metrics Grid */}
                                <div className="grid grid-cols-4 gap-2">
                                    <div className="p-3 rounded-lg bg-surface-200 border border-emerald-400/35">
                                        <p className="text-[10px] text-surface-500 uppercase">Annual Cost Saved</p>
                                        <p className="text-lg font-bold text-emerald-400">
                                            {formatCurrency(siteMetrics.costSaved)}
                                        </p>
                                    </div>
                                    <div className="p-3 rounded-lg bg-surface-200 border border-blue-400/35">
                                        <p className="text-[10px] text-surface-500 uppercase">Contract Fulfillment</p>
                                        <p className="text-lg font-bold text-blue-300">
                                            {siteMetrics.productionFulfillment}%
                                        </p>
                                    </div>
                                    <div className="p-3 rounded-lg bg-surface-200 border border-purple-400/35">
                                        <p className="text-[10px] text-surface-500 uppercase">Carbon Offset</p>
                                        <p className="text-lg font-bold text-purple-600">
                                            {(siteMetrics.carbonOffset / 1000).toFixed(1)}k tons
                                        </p>
                                    </div>
                                    <div className="p-3 rounded-lg bg-surface-200 border border-amber-400/35">
                                        <p className="text-[10px] text-surface-500 uppercase">System Uptime</p>
                                        <p className="text-lg font-bold text-amber-300">
                                            {siteMetrics.uptime}%
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Upsell Products Section - if available */}
                            {upsellData.products.length > 0 && (
                                <>
                                    <div className="h-px bg-surface-200 my-4" />
                                    <div className="flex items-center gap-2 mb-3">
                                        <Lightbulb className="w-4 h-4 text-amber-300" />
                                        <span className="text-xs font-semibold text-surface-700">
                                            Recommended Upsell Products
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                                        {upsellData.products.map(product => {
                                            const Icon = product.icon
                                            return (
                                                <div
                                                    key={product.key}
                                                    className="p-3 rounded-lg bg-surface-300/50 border border-surface-400/50 shadow-sm"
                                                >
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <div className={`w-8 h-8 rounded-lg bg-${product.color}-50 flex items-center justify-center`}>
                                                            <Icon className={`w-4 h-4 text-${product.color}-500`} />
                                                        </div>
                                                        <span className="text-xs font-semibold text-surface-700">{product.label}</span>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <p className="text-[10px] text-surface-500">Est. capacity: {product.estimatedCapacity}</p>
                                                        <p className="text-sm font-bold text-emerald-400">
                                                            +{formatCurrency(product.estimatedRevenue)}/yr
                                                        </p>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>

                                    {/* Total summary */}
                                    <div className="mt-3 pt-3 border-t border-amber-400/35 flex items-center justify-between">
                                        <span className="text-xs text-surface-600">Total potential annual revenue increase:</span>
                                        <div className="flex items-center gap-2">
                                            <span className="text-lg font-bold text-emerald-400">
                                                +{formatCurrency(upsellData.totalRevenue)}/yr
                                            </span>
                                            <span className="text-xs text-surface-500">
                                                ({revenueIncrease}% growth)
                                            </span>
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* Pitch Deck Download Button */}
                            <div className="mt-4 pt-3 border-t border-surface-200 flex items-center gap-3">
                                <a
                                    href="/Quarterly Review MockDeck.pptx"
                                    download={`Nova Energy - ${client.name} Sales Pitch Deck.pptx`}
                                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white text-sm font-medium shadow-md hover:shadow-lg transition-all"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <Presentation className="w-4 h-4" />
                                    <span>Generate Sales Pitch Deck</span>
                                    <FileDown className="w-4 h-4" />
                                </a>
                            </div>

                            {/* Inline Financial Upsell Simulator */}
                            <InlineFinancialSimulator client={client} />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

// Industry section
function IndustrySection({ industryKey, data, expandedClients, onToggleClient }) {
    const [isCollapsed, setIsCollapsed] = useState(false)
    const industryConfig = INDUSTRIES[industryKey]
    const Icon = industryConfig?.icon

    // Find benchmark (client with most products)
    const benchmark = useMemo(() => {
        return data.clients.reduce((best, client) => {
            const clientCount = Object.values(client.assets).filter(Boolean).length
            const bestCount = best ? Object.values(best.assets).filter(Boolean).length : 0
            return clientCount > bestCount ? client : best
        }, null)
    }, [data.clients])

    // Calculate total upsell potential for this industry
    const industryUpsellTotal = useMemo(() => {
        return data.clients.reduce((total, client) => {
            const upsell = calculateUpsellPotential(client, benchmark)
            return total + upsell.totalRevenue
        }, 0)
    }, [data.clients, benchmark])

    return (
        <div className="border border-surface-200 rounded-xl overflow-hidden bg-surface-200">
            {/* Header */}
            <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="w-full flex items-center justify-between p-4 hover:bg-surface-300/25 transition-colors"
            >
                <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl ${industryConfig?.activeColor || 'bg-surface-300/250'} flex items-center justify-center`}>
                        {Icon && <Icon className="w-5 h-5 text-white" />}
                    </div>
                    <div className="text-left">
                        <h4 className="text-sm font-semibold text-surface-900">{data.label}</h4>
                        <p className="text-[10px] text-surface-500">
                            {data.clients.length} clients
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {industryUpsellTotal > 0 && (
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/12 border border-emerald-400/30">
                            <TrendingUp className="w-4 h-4 text-emerald-400" />
                            <span className="text-xs font-bold text-emerald-300">
                                +{formatCurrency(industryUpsellTotal)}/yr potential
                            </span>
                        </div>
                    )}

                    <motion.div
                        animate={{ rotate: isCollapsed ? 0 : 180 }}
                        className="w-8 h-8 rounded-lg bg-surface-100 flex items-center justify-center"
                    >
                        <ChevronDown className="w-4 h-4 text-surface-500" />
                    </motion.div>
                </div>
            </button>

            {/* Client list */}
            <AnimatePresence>
                {!isCollapsed && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="px-4 pb-4 space-y-2">
                            {/* Legend */}
                            <div className="flex items-center justify-between py-2 px-3 bg-surface-300/25 rounded-lg mb-2">
                                <div className="flex items-center gap-4 text-[10px] text-surface-500">
                                    <span className="font-medium">Products:</span>
                                    {Object.entries(ASSET_TYPES).map(([key, config]) => (
                                        <div key={key} className="flex items-center gap-1">
                                            <config.icon className={`w-3 h-3 text-${config.color}-500`} />
                                            <span>{config.shortLabel}</span>
                                        </div>
                                    ))}
                                </div>
                                <span className="text-[10px] text-surface-400">
                                    Click client rows to see upsell details
                                </span>
                            </div>

                            {/* Sort clients: benchmark first, then by upsell potential */}
                            {[...data.clients]
                                .sort((a, b) => {
                                    if (a.id === benchmark?.id) return -1
                                    if (b.id === benchmark?.id) return 1
                                    const aUpsell = calculateUpsellPotential(a, benchmark).totalRevenue
                                    const bUpsell = calculateUpsellPotential(b, benchmark).totalRevenue
                                    return bUpsell - aUpsell
                                })
                                .map(client => (
                                    <ClientRow
                                        key={client.id}
                                        client={client}
                                        benchmark={benchmark}
                                        isExpanded={expandedClients.includes(client.id)}
                                        onToggle={() => onToggleClient(client.id)}
                                    />
                                ))
                            }
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

// Main component
export default function IndustryPeersPanel({
    selectedIndustry = null,
    className = ''
}) {
    const [expandedClients, setExpandedClients] = useState([])

    const toggleClient = (clientId) => {
        setExpandedClients(prev =>
            prev.includes(clientId)
                ? prev.filter(id => id !== clientId)
                : [...prev, clientId]
        )
    }

    // Filter industries based on selection
    const displayIndustries = selectedIndustry
        ? { [selectedIndustry]: CLIENT_DATA_BY_INDUSTRY[selectedIndustry] }
        : CLIENT_DATA_BY_INDUSTRY

    // Calculate grand total upsell potential
    const grandTotalUpsell = useMemo(() => {
        let total = 0
        Object.values(CLIENT_DATA_BY_INDUSTRY).forEach(data => {
            const benchmark = data.clients.reduce((best, client) => {
                const clientCount = Object.values(client.assets).filter(Boolean).length
                const bestCount = best ? Object.values(best.assets).filter(Boolean).length : 0
                return clientCount > bestCount ? client : best
            }, null)

            data.clients.forEach(client => {
                total += calculateUpsellPotential(client, benchmark).totalRevenue
            })
        })
        return total
    }, [])

    return (
        <div className={`${className}`}>
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <div className="w-1 h-5 rounded-full bg-purple-500" />
                    <h3 className="text-sm font-semibold text-surface-900">Client Portfolio Upsell Analysis</h3>
                    <Sparkles className="w-4 h-4 text-amber-500" />
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/12 border border-emerald-400/30">
                    <DollarSign className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-bold text-emerald-300">{formatCurrency(grandTotalUpsell)}</span>
                    <span className="text-[10px] text-emerald-400">total upsell potential/yr</span>
                </div>
            </div>

            {/* Info banner */}
            <div className="flex items-center gap-3 p-3 mb-4 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-400/35">
                <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center flex-shrink-0">
                    <Target className="w-5 h-5 text-white" />
                </div>
                <div>
                    <p className="text-xs font-medium text-surface-700">
                        Identify cross-sell opportunities across your client portfolio
                    </p>
                    <p className="text-[10px] text-surface-500">
                        Clients with fewer products are benchmarked against the most-equipped client in their industry
                    </p>
                </div>
            </div>

            {/* Industry sections */}
            <div className="space-y-3">
                {Object.entries(displayIndustries).map(([key, data]) => (
                    <IndustrySection
                        key={key}
                        industryKey={key}
                        data={data}
                        expandedClients={expandedClients}
                        onToggleClient={toggleClient}
                    />
                ))}
            </div>
        </div>
    )
}

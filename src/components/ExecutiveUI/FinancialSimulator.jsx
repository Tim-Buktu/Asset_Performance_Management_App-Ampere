import React, { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    X,
    MapPin,
    Sun,
    Battery,
    Car,
    Zap,
    Settings,
    TrendingUp,
    DollarSign,
    Calendar,
    BarChart3,
    Cpu,
    Gauge,
    ChevronRight,
    Info,
    Truck,
    Plus,
    Minus
} from 'lucide-react'

/**
 * ROI Waterfall Chart Component
 * 
 * Standard waterfall visualization showing cumulative ROI impact of scenarios.
 * - Base bar: Starts from 0 (baseline) and goes up to its value
 * - Incremental bars: Float from previous cumulative level (positive up, negative down)
 * - Total/Subtotal bar: Starts from 0 and shows final cumulative value
 */
function ROIWaterfallChart({ data, className = '' }) {
    const [hoveredBar, setHoveredBar] = useState(null)

    // Chart layout dimensions
    const chartTop = 25       // Top margin for value labels
    const chartBottom = 175   // Bottom of chart area where zero baseline sits
    const labelY = 200        // Labels are below the baseline
    const chartHeight = chartBottom - chartTop // Available height for bars (150px)

    // Calculate cumulative values and positions following standard waterfall logic
    const chartData = useMemo(() => {
        // First pass: compute all cumulative values
        let runningTotal = 0
        const processedData = data.map((item, index) => {
            const isBase = index === 0
            const isTotal = item.isSubtotal === true

            // Track the cumulative running total
            const prevTotal = runningTotal
            runningTotal += item.value

            return {
                ...item,
                isBase,
                isTotal,
                isPositive: item.value >= 0,
                prevTotal,      // Cumulative BEFORE this item
                cumTotal: runningTotal,  // Cumulative AFTER this item
            }
        })

        // Find the full range of cumulative values (always include 0)
        let minVal = 0
        let maxVal = 0
        processedData.forEach(item => {
            // For base/total bars, we go from 0 to value
            // For incremental bars, we go from prevTotal to cumTotal
            if (item.isBase || item.isTotal) {
                minVal = Math.min(minVal, 0, item.value)
                maxVal = Math.max(maxVal, 0, item.value)
            } else {
                minVal = Math.min(minVal, item.prevTotal, item.cumTotal)
                maxVal = Math.max(maxVal, item.prevTotal, item.cumTotal)
            }
        })

        // Calculate scale - map value range to pixel range
        const valueRange = maxVal - minVal
        const scale = valueRange > 0 ? chartHeight / valueRange : 1

        // Helper: convert a value to Y pixel position
        // maxVal maps to chartTop, minVal maps to chartBottom
        const valueToY = (val) => chartTop + (maxVal - val) * scale

        // The zero baseline position in pixels
        const zeroY = valueToY(0)

        // Second pass: calculate pixel positions for each bar
        return processedData.map((item, index) => {
            let barTop, barBottom

            if (item.isBase || item.isTotal) {
                // Base and Total bars: span from 0 to their value
                if (item.value >= 0) {
                    barTop = valueToY(item.value)
                    barBottom = valueToY(0)
                } else {
                    barTop = valueToY(0)
                    barBottom = valueToY(item.value)
                }
            } else {
                // Incremental bars: span from prevTotal to cumTotal
                if (item.value >= 0) {
                    barTop = valueToY(item.cumTotal)
                    barBottom = valueToY(item.prevTotal)
                } else {
                    barTop = valueToY(item.prevTotal)
                    barBottom = valueToY(item.cumTotal)
                }
            }

            const barHeight = Math.max(barBottom - barTop, 2) // Min 2px height

            return {
                ...item,
                y: barTop,
                height: barHeight,
                zeroY,
                scale,
                // For connector lines: the Y position where this bar connects to the next
                connectorY: item.isTotal ? zeroY : valueToY(item.cumTotal),
            }
        })
    }, [data, chartHeight, chartTop])

    const barWidth = 50
    const barGap = 25
    const chartWidth = data.length * (barWidth + barGap) + 60

    // Get the zero baseline Y from first item (all items have same zeroY)
    const zeroBaselineY = chartData.length > 0 ? chartData[0].zeroY : chartBottom

    return (
        <div className={`relative ${className}`}>
            <svg
                width="100%"
                height="230"
                viewBox={`0 0 ${chartWidth} 230`}
                preserveAspectRatio="xMidYMid meet"
            >
                <defs>
                    <linearGradient id="positiveGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#818CF8" />
                        <stop offset="100%" stopColor="#818CF8" />
                    </linearGradient>
                    <linearGradient id="negativeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#FDA4AF" />
                        <stop offset="100%" stopColor="#FDA4AF" />
                    </linearGradient>
                    <linearGradient id="subtotalGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#67E8F9" />
                        <stop offset="100%" stopColor="#22D3EE" />
                    </linearGradient>
                    <linearGradient id="baseGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#818CF8" />
                        <stop offset="100%" stopColor="#818CF8" />
                    </linearGradient>
                    <filter id="barGlow">
                        <feGaussianBlur stdDeviation="2" result="blur" />
                        <feMerge>
                            <feMergeNode in="blur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                {/* Background grid lines */}
                {[30, 70, 110, 150].map((y) => (
                    <line
                        key={y}
                        x1="25"
                        y1={y}
                        x2={chartWidth - 25}
                        y2={y}
                        stroke="rgba(100,100,100,0.08)"
                        strokeDasharray="4 4"
                    />
                ))}

                {/* Zero baseline - emphasized */}
                <line
                    x1="25"
                    y1={zeroBaselineY}
                    x2={chartWidth - 25}
                    y2={zeroBaselineY}
                    stroke="rgba(100,100,100,0.4)"
                    strokeWidth="1.5"
                />

                {/* Bars */}
                {chartData.map((item, index) => {
                    const x = 40 + index * (barWidth + barGap)
                    const isHovered = hoveredBar === index

                    // Determine gradient based on bar type
                    let gradient
                    if (item.isBase) {
                        gradient = 'url(#baseGradient)'
                    } else if (item.isTotal) {
                        gradient = 'url(#subtotalGradient)'
                    } else if (item.isPositive) {
                        gradient = 'url(#positiveGradient)'
                    } else {
                        gradient = 'url(#negativeGradient)'
                    }

                    // Connector line: connects from previous bar's endpoint to current bar's start
                    // Uses the pre-computed connectorY from previous bar
                    let prevConnectorY = null
                    if (index > 0 && !item.isTotal) {
                        const prevItem = chartData[index - 1]
                        prevConnectorY = prevItem.connectorY
                    }

                    // Value label position - above positive bars, below negative bars
                    const valueLabelY = item.isPositive ? item.y - 8 : item.y + item.height + 14

                    return (
                        <g
                            key={item.label}
                            onMouseEnter={() => setHoveredBar(index)}
                            onMouseLeave={() => setHoveredBar(null)}
                            className="cursor-pointer"
                        >
                            {/* Connector line from previous bar */}
                            {prevConnectorY !== null && (
                                <line
                                    x1={x - barGap + 2}
                                    y1={prevConnectorY}
                                    x2={x - 2}
                                    y2={prevConnectorY}
                                    stroke="rgba(120,120,120,0.35)"
                                    strokeWidth="1.5"
                                    strokeDasharray="4 3"
                                />
                            )}

                            {/* Bar */}
                            <motion.rect
                                x={x}
                                y={item.y}
                                width={barWidth}
                                height={item.height}
                                rx="4"
                                fill={gradient}
                                initial={{ height: 0, y: zeroBaselineY }}
                                animate={{
                                    height: item.height,
                                    y: item.y,
                                    filter: isHovered ? 'url(#barGlow)' : 'none',
                                }}
                                transition={{
                                    duration: 0.6,
                                    delay: index * 0.12,
                                    ease: 'easeOut'
                                }}
                            />

                            {/* Value label */}
                            <motion.text
                                x={x + barWidth / 2}
                                y={valueLabelY}
                                textAnchor="middle"
                                fontSize="10"
                                fontWeight="600"
                                fill={
                                    item.isBase ? '#818CF8' :
                                        item.isTotal ? '#22D3EE' :
                                            item.isPositive ? '#818CF8' : '#FDA4AF'
                                }
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: index * 0.12 + 0.4 }}
                            >
                                {item.value >= 0 ? '+' : ''}{(item.value / 1000).toFixed(0)}K
                            </motion.text>

                            {/* Category Label */}
                            <text
                                x={x + barWidth / 2}
                                y={labelY}
                                textAnchor="middle"
                                fontSize="9"
                                fontWeight="500"
                                fill="#94A3B8"
                            >
                                {item.label}
                            </text>
                        </g>
                    )
                })}
            </svg>

            {/* Tooltip */}
            <AnimatePresence>
                {hoveredBar !== null && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute top-0 left-1/2 -translate-x-1/2 px-3 py-2 rounded-lg bg-surface-200 border border-surface-300 shadow-lg z-10"
                    >
                        <p className="text-xs text-surface-900 font-medium">{chartData[hoveredBar].label}</p>
                        <p className={`text-sm font-bold ${chartData[hoveredBar].isPositive ? 'text-emerald-500' : 'text-rose-500'}`}>
                            {chartData[hoveredBar].isPositive ? '+' : '-'}${Math.abs(chartData[hoveredBar].value).toLocaleString()}
                        </p>
                        {chartData[hoveredBar].description && (
                            <p className="text-[10px] text-surface-600 mt-1">{chartData[hoveredBar].description}</p>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

/**
 * Number Input with +/- buttons
 */
function NumberInput({ label, value, onChange, min = 0, max = 100, step = 1, unit = '', icon: Icon }) {
    const handleIncrement = () => onChange(Math.min(value + step, max))
    const handleDecrement = () => onChange(Math.max(value - step, min))

    return (
        <div className="flex items-center justify-between p-3 rounded-xl bg-surface-200/50 border border-surface-300/50">
            <div className="flex items-center gap-2">
                {Icon && <Icon className="w-4 h-4 text-surface-600" />}
                <span className="text-sm text-surface-700">{label}</span>
            </div>
            <div className="flex items-center gap-2">
                <button
                    onClick={handleDecrement}
                    disabled={value <= min}
                    className="w-7 h-7 rounded-lg bg-surface-300 hover:bg-carbon-600 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                >
                    <Minus className="w-3 h-3 text-surface-900" />
                </button>
                <div className="w-16 text-center">
                    <span className="text-surface-900 font-bold">{value}</span>
                    {unit && <span className="text-surface-500 text-xs ml-1">{unit}</span>}
                </div>
                <button
                    onClick={handleIncrement}
                    disabled={value >= max}
                    className="w-7 h-7 rounded-lg bg-surface-300 hover:bg-carbon-600 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                >
                    <Plus className="w-3 h-3 text-surface-900" />
                </button>
            </div>
        </div>
    )
}

/**
 * Slider Input Component
 */
function SliderInput({ label, value, onChange, min = 0, max = 100, step = 1, unit = '', icon: Icon, color = 'sun-green' }) {
    const percentage = ((value - min) / (max - min)) * 100

    return (
        <div className="p-3 rounded-xl bg-surface-200/50 border border-surface-300/50">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    {Icon && <Icon className="w-4 h-4 text-surface-600" />}
                    <span className="text-sm text-surface-700">{label}</span>
                </div>
                <div className="text-right">
                    <span className="text-surface-900 font-bold">{value}</span>
                    <span className="text-surface-500 text-xs ml-1">{unit}</span>
                </div>
            </div>
            <div className="relative h-2 bg-surface-300 rounded-full">
                <div
                    className={`absolute h-full rounded-full bg-gradient-to-r from-${color}-600 to-${color}-400`}
                    style={{ width: `${percentage}%` }}
                />
                <input
                    type="range"
                    min={min}
                    max={max}
                    step={step}
                    value={value}
                    onChange={(e) => onChange(Number(e.target.value))}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div
                    className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-surface-200 shadow-lg border-2 border-${color}-500 pointer-events-none`}
                    style={{ left: `calc(${percentage}% - 8px)` }}
                />
            </div>
        </div>
    )
}

/**
 * Scenario Toggle Component
 */
function ScenarioToggle({ scenario, isActive, onToggle }) {
    return (
        <motion.button
            onClick={onToggle}
            className={`
                flex items-center gap-3 w-full p-3 rounded-xl transition-all
                ${isActive
                    ? 'bg-sun-green-500/10 border border-sun-green-500/50'
                    : 'bg-surface-200/50 border border-surface-300/50 hover:bg-surface-200'}
            `}
            whileTap={{ scale: 0.98 }}
        >
            <div className={`
                w-10 h-10 rounded-lg flex items-center justify-center
                ${isActive ? 'bg-sun-green-500/20' : 'bg-surface-300/50'}
            `}>
                <scenario.icon className={`w-5 h-5 ${isActive ? 'text-sun-green-300' : 'text-surface-600'}`} />
            </div>
            <div className="flex-1 text-left">
                <p className={`text-sm font-medium ${isActive ? 'text-surface-900' : 'text-surface-700'}`}>
                    {scenario.label}
                </p>
                <p className="text-[10px] text-surface-500">{scenario.description}</p>
            </div>
            <div className={`
                w-12 h-6 rounded-full p-1 transition-colors
                ${isActive ? 'bg-sun-green-500' : 'bg-surface-300'}
            `}>
                <motion.div
                    className="w-4 h-4 rounded-full bg-surface-200"
                    animate={{ x: isActive ? 24 : 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
            </div>
        </motion.button>
    )
}

/**
 * Financial Simulator Panel Component
 * 
 * Slide-out panel for site-level financial scenario modeling with granular inputs.
 */
export default function FinancialSimulator({
    isOpen,
    onClose,
    site,
    className = ''
}) {
    // Granular input states
    const [dumpTrucks, setDumpTrucks] = useState(0)
    const [lightVehicles, setLightVehicles] = useState(0)
    const [miningTrucks, setMiningTrucks] = useState(0)
    const [bessCapacity, setBessCapacity] = useState(0)
    const [additionalChargers, setAdditionalChargers] = useState(0)
    const [solarUpgradeMW, setSolarUpgradeMW] = useState(0)

    // System toggles
    const [emsEnabled, setEmsEnabled] = useState(false)
    const [fmsEnabled, setFmsEnabled] = useState(false)

    // Unit economics
    const unitEconomics = {
        dumpTruck: { investment: 85000, annualReturn: 12000, label: 'per truck' },
        lightVehicle: { investment: 45000, annualReturn: 6000, label: 'per vehicle' },
        miningTruck: { investment: 120000, annualReturn: 18000, label: 'per truck' },
        bessPerMWh: { investment: 200000, annualReturn: 30000, label: 'per MWh' },
        charger: { investment: 65000, annualReturn: 15000, label: 'per station' },
        solarPerMW: { investment: 800000, annualReturn: 110000, label: 'per MW' },
        ems: { investment: 180000, annualReturn: 52000 },
        fms: { investment: 95000, annualReturn: 32000 },
    }

    // Calculate totals based on granular inputs
    const calculations = useMemo(() => {
        // Base revenue: Logical calculation from site capacity
        // Using ~$100K/MW/year as industry average for solar in Indonesia
        const siteCapacityMW = site ? parseFloat(site.capacity?.replace(/[^\d.]/g, '') || 0) : 10
        const baseRevenue = siteCapacityMW * 100000 // $100K per MW per year

        // EV Fleet calculations
        const evInvestment =
            (dumpTrucks * unitEconomics.dumpTruck.investment) +
            (lightVehicles * unitEconomics.lightVehicle.investment) +
            (miningTrucks * unitEconomics.miningTruck.investment)
        const evReturn =
            (dumpTrucks * unitEconomics.dumpTruck.annualReturn) +
            (lightVehicles * unitEconomics.lightVehicle.annualReturn) +
            (miningTrucks * unitEconomics.miningTruck.annualReturn)

        // BESS calculations
        const bessInvestment = bessCapacity * unitEconomics.bessPerMWh.investment
        const bessReturn = bessCapacity * unitEconomics.bessPerMWh.annualReturn

        // Charger calculations
        const chargerInvestment = additionalChargers * unitEconomics.charger.investment
        const chargerReturn = additionalChargers * unitEconomics.charger.annualReturn

        // Solar upgrade calculations
        const solarInvestment = solarUpgradeMW * unitEconomics.solarPerMW.investment
        const solarReturn = solarUpgradeMW * unitEconomics.solarPerMW.annualReturn

        // System investments
        const emsInvestment = emsEnabled ? unitEconomics.ems.investment : 0
        const emsReturn = emsEnabled ? unitEconomics.ems.annualReturn : 0
        const fmsInvestment = fmsEnabled ? unitEconomics.fms.investment : 0
        const fmsReturn = fmsEnabled ? unitEconomics.fms.annualReturn : 0

        // Totals
        const totalInvestment = evInvestment + bessInvestment + chargerInvestment + solarInvestment + emsInvestment + fmsInvestment
        const totalAnnualReturn = evReturn + bessReturn + chargerReturn + solarReturn + emsReturn + fmsReturn

        // Calculate weighted average payback
        const investments = [
            { inv: evInvestment, ret: evReturn },
            { inv: bessInvestment, ret: bessReturn },
            { inv: chargerInvestment, ret: chargerReturn },
            { inv: solarInvestment, ret: solarReturn },
            { inv: emsInvestment, ret: emsReturn },
            { inv: fmsInvestment, ret: fmsReturn },
        ].filter(i => i.inv > 0)

        const avgPayback = investments.length > 0
            ? investments.reduce((acc, i) => acc + (i.inv / i.ret), 0) / investments.length
            : 0

        const tenYearROI = (totalAnnualReturn * 10) - totalInvestment

        // Has any input
        const hasInputs = totalInvestment > 0

        // Waterfall chart data - only show categories with values
        const waterfallItems = []

        // Base revenue first (not shown as incremental, used for context)
        waterfallItems.push({
            label: 'Base',
            value: baseRevenue,
            description: `${siteCapacityMW} MW @ $100K/MW/yr`
        })

        if (evReturn > 0) {
            const totalEV = dumpTrucks + lightVehicles + miningTrucks
            waterfallItems.push({
                label: 'EV Fleet',
                value: evReturn,
                description: `${totalEV} vehicles fleet`
            })
        }
        if (bessReturn > 0) {
            waterfallItems.push({
                label: 'BESS',
                value: bessReturn,
                description: `${bessCapacity} MWh storage`
            })
        }
        if (chargerReturn > 0) {
            waterfallItems.push({
                label: 'Chargers',
                value: chargerReturn,
                description: `${additionalChargers} stations`
            })
        }
        if (solarReturn > 0) {
            waterfallItems.push({
                label: 'Solar+',
                value: solarReturn,
                description: `+${solarUpgradeMW} MW upgrade`
            })
        }
        if (emsReturn > 0) {
            waterfallItems.push({
                label: 'EMS',
                value: emsReturn,
                description: 'AI grid optimization'
            })
        }
        if (fmsReturn > 0) {
            waterfallItems.push({
                label: 'FMS',
                value: fmsReturn,
                description: 'Fleet management'
            })
        }

        // Add costs and net only if there are investments
        if (hasInputs) {
            waterfallItems.push({
                label: 'Costs',
                value: -totalInvestment / 10,
                description: 'Annualized CAPEX (10yr)'
            })
            waterfallItems.push({
                label: 'Net ROI',
                value: totalAnnualReturn - (totalInvestment / 10),
                isSubtotal: true,
                description: 'Annual net benefit'
            })
        }

        return {
            baseRevenue,
            siteCapacityMW,
            totalInvestment,
            totalAnnualReturn,
            avgPayback,
            tenYearROI,
            waterfallData: waterfallItems,
            hasInputs,
        }
    }, [dumpTrucks, lightVehicles, miningTrucks, bessCapacity, additionalChargers, solarUpgradeMW, emsEnabled, fmsEnabled, site])

    // System scenarios for toggle buttons
    const systemScenarios = [
        {
            id: 'ems',
            label: 'Energy Management System',
            icon: Cpu,
            description: `AI-powered grid optimization • $${(unitEconomics.ems.investment / 1000).toFixed(0)}K inv`,
            isActive: emsEnabled,
            onToggle: () => setEmsEnabled(!emsEnabled),
        },
        {
            id: 'fms',
            label: 'Fleet Management System',
            icon: Settings,
            description: `Route & charge optimization • $${(unitEconomics.fms.investment / 1000).toFixed(0)}K inv`,
            isActive: fmsEnabled,
            onToggle: () => setFmsEnabled(!fmsEnabled),
        },
    ]

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
                    />

                    {/* Panel */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                        className={`
                            fixed top-0 right-0 h-full w-full max-w-lg
                            bg-surface-100 border-l border-surface-200
                            shadow-2xl z-50 overflow-hidden
                            ${className}
                        `}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-surface-200">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-sun-green-500/10 flex items-center justify-center">
                                    <BarChart3 className="w-5 h-5 text-sun-green-300" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-semibold text-surface-900">Financial Simulator</h2>
                                    <p className="text-xs text-surface-500">F-6: Granular Scenario Modeling</p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 rounded-lg bg-surface-200 hover:bg-surface-300 transition-colors"
                            >
                                <X className="w-5 h-5 text-surface-600" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="h-[calc(100%-72px)] overflow-y-auto p-4 space-y-6">
                            {/* Site Info */}
                            {site && (
                                <div className="glass-card p-4">
                                    <div className="flex items-start gap-3">
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sun-green-100 to-amber-600/20 flex items-center justify-center">
                                            <Sun className="w-6 h-6 text-sun-green-300" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-surface-900 font-semibold">{site.name}</h3>
                                            <div className="flex items-center gap-2 mt-1">
                                                <MapPin className="w-3 h-3 text-surface-500" />
                                                <span className="text-xs text-surface-600">{site.location}</span>
                                            </div>
                                            <div className="flex items-center gap-4 mt-2">
                                                <span className="text-xs text-surface-500">
                                                    Capacity: <span className="text-surface-900 font-medium">{site.capacity}</span>
                                                </span>
                                                <span className="text-xs text-surface-500">
                                                    Base Rev: <span className="text-emerald-400 font-medium">
                                                        ${(calculations.baseRevenue / 1000000).toFixed(1)}M/yr
                                                    </span>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* EV Fleet - Granular Inputs */}
                            <div>
                                <h4 className="text-xs text-surface-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                                    <Car className="w-3 h-3" />
                                    EV Fleet Configuration
                                </h4>
                                <div className="space-y-2">
                                    <NumberInput
                                        label="Dump Trucks"
                                        value={dumpTrucks}
                                        onChange={setDumpTrucks}
                                        max={20}
                                        icon={Truck}
                                        unit={`× $${(unitEconomics.dumpTruck.investment / 1000).toFixed(0)}K`}
                                    />
                                    <NumberInput
                                        label="Light Vehicles"
                                        value={lightVehicles}
                                        onChange={setLightVehicles}
                                        max={30}
                                        icon={Car}
                                        unit={`× $${(unitEconomics.lightVehicle.investment / 1000).toFixed(0)}K`}
                                    />
                                    <NumberInput
                                        label="Mining Trucks"
                                        value={miningTrucks}
                                        onChange={setMiningTrucks}
                                        max={10}
                                        icon={Truck}
                                        unit={`× $${(unitEconomics.miningTruck.investment / 1000).toFixed(0)}K`}
                                    />
                                </div>
                            </div>

                            {/* BESS Capacity Slider */}
                            <div>
                                <h4 className="text-xs text-surface-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                                    <Battery className="w-3 h-3" />
                                    Battery Storage (BESS)
                                </h4>
                                <SliderInput
                                    label="Storage Capacity"
                                    value={bessCapacity}
                                    onChange={setBessCapacity}
                                    min={0}
                                    max={50}
                                    step={5}
                                    unit="MWh"
                                    icon={Battery}
                                    color="emerald"
                                />
                                {bessCapacity > 0 && (
                                    <div className="mt-2 p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                                        <div className="flex justify-between text-xs">
                                            <span className="text-surface-600">Investment</span>
                                            <span className="text-surface-900 font-medium">
                                                ${((bessCapacity * unitEconomics.bessPerMWh.investment) / 1000000).toFixed(2)}M
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-xs mt-1">
                                            <span className="text-surface-600">Annual Return</span>
                                            <span className="text-emerald-400 font-medium">
                                                ${((bessCapacity * unitEconomics.bessPerMWh.annualReturn) / 1000).toFixed(0)}K
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Additional Infrastructure */}
                            <div>
                                <h4 className="text-xs text-surface-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                                    <Zap className="w-3 h-3" />
                                    Infrastructure Expansion
                                </h4>
                                <div className="space-y-2">
                                    <NumberInput
                                        label="Additional Chargers"
                                        value={additionalChargers}
                                        onChange={setAdditionalChargers}
                                        max={25}
                                        icon={Zap}
                                        unit={`× $${(unitEconomics.charger.investment / 1000).toFixed(0)}K`}
                                    />
                                    <SliderInput
                                        label="Solar Upgrade"
                                        value={solarUpgradeMW}
                                        onChange={setSolarUpgradeMW}
                                        min={0}
                                        max={20}
                                        step={1}
                                        unit="MW"
                                        icon={Sun}
                                        color="amber"
                                    />
                                </div>
                            </div>

                            {/* System Toggles */}
                            <div>
                                <h4 className="text-xs text-surface-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                                    <Cpu className="w-3 h-3" />
                                    Management Systems
                                </h4>
                                <div className="space-y-2">
                                    {systemScenarios.map(scenario => (
                                        <ScenarioToggle
                                            key={scenario.id}
                                            scenario={scenario}
                                            isActive={scenario.isActive}
                                            onToggle={scenario.onToggle}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* ROI Waterfall Chart */}
                            {calculations.hasInputs && (
                                <div>
                                    <h4 className="text-xs text-surface-500 uppercase tracking-wider mb-3">
                                        ROI Waterfall Analysis
                                    </h4>
                                    <div className="glass-card p-4">
                                        <ROIWaterfallChart data={calculations.waterfallData} />
                                    </div>
                                </div>
                            )}

                            {/* Summary Cards */}
                            {calculations.hasInputs && (
                                <div>
                                    <h4 className="text-xs text-surface-500 uppercase tracking-wider mb-3">
                                        Investment Summary
                                    </h4>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30">
                                            <p className="text-[10px] text-rose-400 uppercase tracking-wider mb-1">Total Investment</p>
                                            <p className="text-2xl font-bold text-surface-900">
                                                ${(calculations.totalInvestment / 1000000).toFixed(2)}M
                                            </p>
                                        </div>
                                        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                                            <p className="text-[10px] text-emerald-400 uppercase tracking-wider mb-1">Annual Return</p>
                                            <p className="text-2xl font-bold text-surface-900">
                                                ${(calculations.totalAnnualReturn / 1000).toFixed(0)}K
                                            </p>
                                        </div>
                                        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30">
                                            <p className="text-[10px] text-amber-400 uppercase tracking-wider mb-1">Avg. Payback</p>
                                            <p className="text-2xl font-bold text-surface-900">
                                                {calculations.avgPayback.toFixed(1)} <span className="text-sm text-surface-600">years</span>
                                            </p>
                                        </div>
                                        <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/30">
                                            <p className="text-[10px] text-blue-400 uppercase tracking-wider mb-1">10-Year ROI</p>
                                            <p className={`text-2xl font-bold ${calculations.tenYearROI >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                                                ${(calculations.tenYearROI / 1000000).toFixed(2)}M
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Empty State */}
                            {!calculations.hasInputs && (
                                <div className="text-center py-8">
                                    <div className="w-16 h-16 rounded-full bg-surface-200/50 flex items-center justify-center mx-auto mb-4">
                                        <Info className="w-8 h-8 text-surface-500" />
                                    </div>
                                    <p className="text-surface-600 text-sm">Configure assets above to see ROI projections</p>
                                    <p className="text-surface-400 text-xs mt-2">Add EVs, BESS capacity, or enable systems</p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}

export { ROIWaterfallChart }

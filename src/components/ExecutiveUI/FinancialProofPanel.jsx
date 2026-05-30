import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
    DollarSign,
    Leaf,
    TreePine,
    Car,
    Factory,
    TrendingDown,
    Sun,
    Battery,
    Cpu,
    Gauge,
    Zap
} from 'lucide-react'

/**
 * FinancialProofPanel Component
 * 
 * Clean, structured display of Financial Proof Points:
 * - LCOE Comparison
 * - Total Savings
 * - Carbon Impact
 * - Asset Class Savings (simplified)
 */

// Asset class savings data
const ASSET_SAVINGS = [
    { id: 'pv', label: 'Solar PV', icon: Sun, avgSavings: 32, color: 'text-amber-300' },
    { id: 'bess', label: 'BESS', icon: Battery, avgSavings: 28, color: 'text-emerald-400' },
    { id: 'ev', label: 'EV Fleet', icon: Car, avgSavings: 45, color: 'text-blue-300' },
    { id: 'ems', label: 'EMS', icon: Cpu, avgSavings: 18, color: 'text-purple-600' },
    { id: 'fms', label: 'FMS', icon: Gauge, avgSavings: 22, color: 'text-rose-400' },
]

// Animated counter
function useAnimatedCounter(targetValue, duration = 1000) {
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

export default function FinancialProofPanel({ sites = [], className = '' }) {
    // LCOE data
    const lcoeData = { solarCost: 0.078, gridCost: 0.124 }
    const savingsPercent = ((lcoeData.gridCost - lcoeData.solarCost) / lcoeData.gridCost * 100).toFixed(0)

    // Carbon calculations
    const totalCapacity = sites.reduce((acc, s) => acc + parseFloat(s.capacity), 0)
    const annualCO2Offset = Math.round(totalCapacity * 1200)
    const treesEquivalent = Math.round(annualCO2Offset * 40)
    const carsRemoved = Math.round(annualCO2Offset / 4.6)

    // Total savings
    const totalSavings = 4200000
    const animatedSavings = useAnimatedCounter(totalSavings, 1200)

    return (
        <div className={`${className}`}>
            {/* Section Header */}
            <div className="flex items-center gap-3 mb-5">
                <div className="w-1 h-6 rounded-full bg-emerald-500" />
                <h3 className="text-lg font-semibold text-surface-900">Financial Proof Points</h3>
            </div>

            {/* Main Grid - 4 Equal Cards */}
            <div className="grid grid-cols-4 gap-4">

                {/* Card 1: LCOE */}
                <div className="bg-surface-200 rounded-xl border border-surface-200 p-5">
                    <div className="flex items-center gap-2 mb-4">
                        <TrendingDown className="w-4 h-4 text-emerald-500" />
                        <span className="text-xs font-medium text-surface-500 uppercase tracking-wide">LCOE</span>
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-surface-600">Solar</span>
                            <span className="text-sm font-semibold text-surface-900">${lcoeData.solarCost}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-surface-600">Grid</span>
                            <span className="text-sm font-semibold text-surface-900">${lcoeData.gridCost}</span>
                        </div>
                        <div className="pt-2 mt-2 border-t border-surface-100">
                            <div className="text-center py-1.5 bg-emerald-500/12 rounded-lg">
                                <span className="text-sm font-semibold text-emerald-300">{savingsPercent}% lower</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Card 2: Total Savings */}
                <div className="bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl p-5 text-white">
                    <div className="flex items-center gap-2 mb-4">
                        <DollarSign className="w-4 h-4 text-emerald-200" />
                        <span className="text-xs font-medium text-emerald-100 uppercase tracking-wide">Total Savings</span>
                    </div>

                    <p className="text-3xl font-bold tabular-nums">${(animatedSavings / 1000000).toFixed(1)}M</p>
                    <p className="text-sm text-emerald-100 mt-1">Over 24 months</p>

                    <div className="mt-3 pt-3 border-t border-white/20 flex justify-between text-sm">
                        <span className="text-emerald-200">Monthly</span>
                        <span className="font-semibold">$175K</span>
                    </div>
                </div>

                {/* Card 3: Carbon Impact */}
                <div className="bg-surface-200 rounded-xl border border-surface-200 p-5">
                    <div className="flex items-center gap-2 mb-4">
                        <Leaf className="w-4 h-4 text-emerald-500" />
                        <span className="text-xs font-medium text-surface-500 uppercase tracking-wide">Carbon Impact</span>
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-surface-600">CO₂ Offset</span>
                            <span className="text-sm font-semibold text-surface-900">{(annualCO2Offset / 1000).toFixed(1)}K t</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-surface-600">Trees Equiv.</span>
                            <span className="text-sm font-semibold text-surface-900">{(treesEquivalent / 1000).toFixed(0)}K</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-surface-600">Cars Removed</span>
                            <span className="text-sm font-semibold text-surface-900">{carsRemoved.toLocaleString()}</span>
                        </div>
                    </div>
                </div>

                {/* Card 4: Asset Class Savings - Simplified */}
                <div className="bg-surface-200 rounded-xl border border-surface-200 p-5">
                    <div className="flex items-center gap-2 mb-4">
                        <Zap className="w-4 h-4 text-blue-500" />
                        <span className="text-xs font-medium text-surface-500 uppercase tracking-wide">Cost Saved By Asset Class</span>
                    </div>

                    <div className="space-y-2">
                        {ASSET_SAVINGS.map((asset) => {
                            const Icon = asset.icon
                            return (
                                <div key={asset.id} className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Icon className={`w-3.5 h-3.5 ${asset.color}`} />
                                        <span className="text-sm text-surface-600">{asset.label}</span>
                                    </div>
                                    <span className="text-sm font-semibold text-surface-900">{asset.avgSavings}%</span>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>

            {/* Summary Footer */}
            <div className="mt-4 flex items-center justify-between px-2">
                <span className="text-xs text-surface-400">
                    Based on {totalCapacity.toFixed(1)} MW portfolio • Annual projections
                </span>
                <div className="flex items-center gap-2">
                    <span className="text-xs text-surface-500">Portfolio Avg Savings:</span>
                    <span className="text-sm font-bold text-emerald-400">29%</span>
                </div>
            </div>
        </div>
    )
}

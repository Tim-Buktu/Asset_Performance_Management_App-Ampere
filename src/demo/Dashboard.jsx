import React, { useState, useEffect } from 'react'
import {
    Sun,
    Zap,
    Battery,
    DollarSign,
    TrendingUp,
    Activity,
    Radio,
    PanelTop,
    Gauge,
    Clock,
    Settings,
    Bell,
    ChevronDown,
    LayoutGrid
} from 'lucide-react'

import KPICard, { KPICardSkeleton } from '../components/KPICard'
import StatusIndicator, { StatusIndicatorGroup, StatusLegend } from '../components/StatusIndicator'
import GenealogyNode, { GenealogyMap, GenealogyConnection } from '../components/GenealogyNode'

/**
 * Demo Dashboard
 * 
 * Showcase page demonstrating all Nova Energy Design System components
 * in a realistic strategic dashboard context.
 */
export default function Dashboard() {
    const [currentTime, setCurrentTime] = useState(new Date())
    const [selectedNode, setSelectedNode] = useState(null)

    // Update time every second
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000)
        return () => clearInterval(timer)
    }, [])

    // Mock KPI data
    const kpiData = [
        {
            id: 'output',
            title: 'Current Output',
            value: '1.247',
            unit: 'MW',
            trend: 12.4,
            trendDirection: 'up',
            icon: Zap,
            color: 'amber',
        },
        {
            id: 'efficiency',
            title: 'System Efficiency',
            value: '94.7',
            unit: '%',
            trend: 2.1,
            trendDirection: 'up',
            icon: Gauge,
            color: 'emerald',
        },
        {
            id: 'energy',
            title: 'Energy Today',
            value: '847',
            unit: 'MWh',
            trend: 8.2,
            trendDirection: 'up',
            icon: Battery,
            color: 'blue',
        },
        {
            id: 'revenue',
            title: 'Revenue Today',
            value: '$12.4K',
            unit: '',
            trend: 5.7,
            trendDirection: 'up',
            icon: DollarSign,
            color: 'amber',
        },
    ]

    // Mock asset status data
    const assetStatus = [
        { id: 1, status: 'healthy', assetName: 'Array A-12', assetType: 'array', description: 'Optimal' },
        { id: 2, status: 'healthy', assetName: 'Array B-07', assetType: 'array', description: 'Optimal' },
        { id: 3, status: 'warning', assetName: 'Array C-03', assetType: 'array', description: 'Degraded output' },
        { id: 4, status: 'critical', assetName: 'Inverter 3', assetType: 'inverter', description: 'Offline' },
    ]

    // Mock genealogy data
    const genealogyNodes = {
        arrays: [
            { id: 'array-1', title: 'Solar Array A-12', subtitle: 'Primary Source', metrics: { primary: { label: 'Capacity', value: '50', unit: 'MW' }, secondary: { label: 'Efficiency', value: '96.2', unit: '%' } }, status: 'healthy' },
            { id: 'array-2', title: 'Solar Array B-07', subtitle: 'Secondary Source', metrics: { primary: { label: 'Capacity', value: '35', unit: 'MW' }, secondary: { label: 'Efficiency', value: '94.8', unit: '%' } }, status: 'healthy' },
        ],
        inverter: { id: 'inverter-1', title: 'Central Inverter', subtitle: 'Power Conversion', metrics: { primary: { label: 'Load', value: '78', unit: '%' }, secondary: { label: 'Temp', value: '42', unit: '°C' } }, status: 'healthy' },
        grid: { id: 'grid-1', title: 'Grid Connection', subtitle: 'Distribution', metrics: { primary: { label: 'Feed-in', value: '1.2', unit: 'MW' }, secondary: { label: 'Frequency', value: '50.01', unit: 'Hz' } }, status: 'healthy' },
    }

    return (
        <div className="min-h-screen bg-surface-300/25">
            {/* Background Effects */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-sun-green-500/5 rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl" />
            </div>

            {/* Header */}
            <header className="relative z-10 border-b border-surface-200/50 bg-surface-300/25/80 backdrop-blur-xl sticky top-0">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        {/* Logo & Title */}
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sun-amber-500 to-sun-amber-600 flex items-center justify-center shadow-glow-amber">
                                    <Sun className="w-6 h-6 text-surface-900" />
                                </div>
                                <div>
                                    <h1 className="text-lg font-bold text-surface-900 tracking-tight">
                                        NOVA <span className="text-sun-green-300">ENERGY</span>
                                    </h1>
                                    <p className="text-[10px] text-surface-500 uppercase tracking-widest">
                                        Digital Ecosystem
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Live Indicator & Time */}
                        <div className="flex items-center gap-6">
                            {/* Live Status */}
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-200/60 border border-surface-200/50">
                                <div className="relative">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                    <div className="absolute inset-0 w-2 h-2 rounded-full bg-emerald-500 animate-ping opacity-50" />
                                </div>
                                <span className="text-xs font-medium text-surface-700">Live</span>
                            </div>

                            {/* Time */}
                            <div className="flex items-center gap-2 text-surface-600">
                                <Clock className="w-4 h-4" />
                                <span className="text-sm font-mono">
                                    {currentTime.toLocaleTimeString('en-US', {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        second: '2-digit',
                                        hour12: false
                                    })}
                                </span>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2">
                                <button className="p-2 rounded-lg bg-surface-200/60 border border-surface-200/50 hover:bg-surface-200 transition-colors">
                                    <Bell className="w-4 h-4 text-surface-600" />
                                </button>
                                <button className="p-2 rounded-lg bg-surface-200/60 border border-surface-200/50 hover:bg-surface-200 transition-colors">
                                    <Settings className="w-4 h-4 text-surface-600" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="relative z-10 max-w-7xl mx-auto px-6 py-8 space-y-8">

                {/* Page Title */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-surface-900 mb-1">Strategic Dashboard</h2>
                        <p className="text-sm text-surface-500">Real-time monitoring and analytics</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <a
                            href="#/digital-twin"
                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 hover:bg-cyan-500/20 transition-colors"
                        >
                            <Activity className="w-4 h-4 text-cyan-400" />
                            <span className="text-sm text-cyan-400 font-medium">Digital Twin</span>
                        </a>
                        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-200/60 border border-surface-200/50 hover:bg-surface-200 transition-colors">
                            <LayoutGrid className="w-4 h-4 text-surface-600" />
                            <span className="text-sm text-surface-700">Customize</span>
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-sun-green-500/10 border border-sun-green-500/30 hover:bg-sun-green-500/20 transition-colors">
                            <span className="text-sm text-sun-green-300 font-medium">Export Report</span>
                        </button>
                    </div>
                </div>

                {/* ========================================
            SECTION: KPI Cards
            ======================================== */}
                <section>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-1 h-6 rounded-full bg-sun-green-500" />
                        <h3 className="text-lg font-semibold text-surface-900">Key Performance Indicators</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {kpiData.map((kpi) => (
                            <KPICard
                                key={kpi.id}
                                title={kpi.title}
                                value={kpi.value}
                                unit={kpi.unit}
                                trend={kpi.trend}
                                trendDirection={kpi.trendDirection}
                                icon={kpi.icon}
                                color={kpi.color}
                                isLive={true}
                            />
                        ))}
                    </div>
                </section>

                {/* ========================================
            SECTION: Asset Status & Status Indicators
            ======================================== */}
                <section>
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-1 h-6 rounded-full bg-emerald-500" />
                            <h3 className="text-lg font-semibold text-surface-900">Asset Health Status</h3>
                        </div>
                        <StatusLegend />
                    </div>

                    {/* Status Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {assetStatus.map((asset) => (
                            <StatusIndicator
                                key={asset.id}
                                status={asset.status}
                                assetName={asset.assetName}
                                assetType={asset.assetType}
                                description={asset.description}
                                variant="card"
                            />
                        ))}
                    </div>

                    {/* Badge Row */}
                    <div className="mt-4 p-4 glass-card">
                        <p className="text-xs text-surface-500 mb-3 uppercase tracking-wider">Quick Status Overview</p>
                        <StatusIndicatorGroup
                            items={assetStatus}
                            variant="badge"
                        />
                    </div>
                </section>

                {/* ========================================
            SECTION: Genealogy Map
            ======================================== */}
                <section>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-1 h-6 rounded-full bg-blue-500" />
                        <h3 className="text-lg font-semibold text-surface-900">Asset Genealogy Map</h3>
                    </div>

                    <GenealogyMap className="min-h-[400px]">
                        <div className="flex items-center justify-center gap-8">
                            {/* Source Nodes (Arrays) */}
                            <div className="flex flex-col gap-6">
                                {genealogyNodes.arrays.map((array) => (
                                    <GenealogyNode
                                        key={array.id}
                                        nodeType="source"
                                        title={array.title}
                                        subtitle={array.subtitle}
                                        metrics={array.metrics}
                                        status={array.status}
                                        isSelected={selectedNode === array.id}
                                        onClick={() => setSelectedNode(array.id)}
                                        hasChildren={true}
                                        isExpanded={true}
                                    />
                                ))}
                            </div>

                            {/* Connection Lines */}
                            <div className="flex flex-col gap-6 items-center">
                                <div className="node-connector" style={{ width: 80 }} />
                                <div className="node-connector" style={{ width: 80 }} />
                            </div>

                            {/* Hub Node (Inverter) */}
                            <div className="flex items-center">
                                <GenealogyNode
                                    nodeType="hub"
                                    title={genealogyNodes.inverter.title}
                                    subtitle={genealogyNodes.inverter.subtitle}
                                    metrics={genealogyNodes.inverter.metrics}
                                    status={genealogyNodes.inverter.status}
                                    isSelected={selectedNode === 'inverter-1'}
                                    onClick={() => setSelectedNode('inverter-1')}
                                    hasChildren={true}
                                    isExpanded={true}
                                />
                            </div>

                            {/* Connection Line */}
                            <div className="flex items-center">
                                <div className="node-connector" style={{ width: 80 }} />
                            </div>

                            {/* Endpoint Node (Grid) */}
                            <div className="flex items-center">
                                <GenealogyNode
                                    nodeType="endpoint"
                                    title={genealogyNodes.grid.title}
                                    subtitle={genealogyNodes.grid.subtitle}
                                    metrics={genealogyNodes.grid.metrics}
                                    status={genealogyNodes.grid.status}
                                    isSelected={selectedNode === 'grid-1'}
                                    onClick={() => setSelectedNode('grid-1')}
                                    hasChildren={false}
                                />
                            </div>
                        </div>
                    </GenealogyMap>
                </section>

                {/* ========================================
            SECTION: Component Showcase
            ======================================== */}
                <section className="pt-8 border-t border-surface-200/50">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-1 h-6 rounded-full bg-purple-500" />
                        <h3 className="text-lg font-semibold text-surface-900">Design System Showcase</h3>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Status Variants */}
                        <div className="glass-card p-6">
                            <h4 className="text-sm font-semibold text-surface-900 mb-4">Status Indicator Variants</h4>

                            <div className="space-y-4">
                                <div>
                                    <p className="text-xs text-surface-500 mb-2">Dot Variant</p>
                                    <div className="flex items-center gap-4">
                                        <StatusIndicator status="healthy" variant="dot" />
                                        <StatusIndicator status="warning" variant="dot" />
                                        <StatusIndicator status="critical" variant="dot" />
                                    </div>
                                </div>

                                <div>
                                    <p className="text-xs text-surface-500 mb-2">Badge Variant</p>
                                    <div className="flex flex-wrap gap-2">
                                        <StatusIndicator status="healthy" variant="badge" />
                                        <StatusIndicator status="warning" variant="badge" />
                                        <StatusIndicator status="critical" variant="badge" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Node Types */}
                        <div className="glass-card p-6">
                            <h4 className="text-sm font-semibold text-surface-900 mb-4">Node Type Colors</h4>

                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-sun-green-500/20 flex items-center justify-center">
                                        <Sun className="w-4 h-4 text-sun-green-300" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-surface-900">Source Node</p>
                                        <p className="text-xs text-surface-500">Solar arrays, collectors</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                                        <Zap className="w-4 h-4 text-blue-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-surface-900">Hub Node</p>
                                        <p className="text-xs text-surface-500">Inverters, transformers</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-teal-500/20 flex items-center justify-center">
                                        <Activity className="w-4 h-4 text-teal-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-surface-900">Endpoint Node</p>
                                        <p className="text-xs text-surface-500">Grid connections</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Color Palette */}
                        <div className="glass-card p-6">
                            <h4 className="text-sm font-semibold text-surface-900 mb-4">Nova Energy Palette</h4>

                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="flex gap-1">
                                        <div className="w-6 h-6 rounded bg-sun-amber-400" />
                                        <div className="w-6 h-6 rounded bg-sun-green-500" />
                                        <div className="w-6 h-6 rounded bg-sun-amber-600" />
                                    </div>
                                    <span className="text-xs text-surface-600">Solar Amber</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="flex gap-1">
                                        <div className="w-6 h-6 rounded bg-surface-200" />
                                        <div className="w-6 h-6 rounded bg-surface-100" />
                                        <div className="w-6 h-6 rounded bg-surface-300/25" />
                                    </div>
                                    <span className="text-xs text-surface-600">Carbon Dark</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="flex gap-1">
                                        <div className="w-6 h-6 rounded bg-status-healthy" />
                                        <div className="w-6 h-6 rounded bg-status-warning" />
                                        <div className="w-6 h-6 rounded bg-status-critical" />
                                    </div>
                                    <span className="text-xs text-surface-600">Status Colors</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="pt-8 border-t border-surface-200/50 text-center">
                    <p className="text-xs text-surface-400">
                        Nova Energy Design System v1.0 • Built with React + Tailwind CSS
                    </p>
                </footer>
            </main>
        </div>
    )
}

import React, { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
    Sun,
    Clock,
    Bell,
    Settings,
    BarChart3,
    Activity,
    MapPin,
    DollarSign,
    Battery,
    Car,
    Zap,
    TrendingUp,
    Building2,
    Globe2,
    ChevronRight,
    Filter
} from 'lucide-react'

// Import ExecutiveUI components
import IndonesiaMapView, { INDONESIA_SITES } from '../components/ExecutiveUI/IndonesiaMapView'
import RevenueAtRiskGauge from '../components/ExecutiveUI/RevenueAtRiskGauge'
import FinancialSimulator from '../components/ExecutiveUI/FinancialSimulator'
import IndustryFilterPanel from '../components/ExecutiveUI/IndustryFilterPanel'
import IndustryPeersPanel from '../components/ExecutiveUI/IndustryPeersPanel'
import OpportunityMapping from '../components/ExecutiveUI/OpportunityMapping'
import SalesMetricsPanel from '../components/ExecutiveUI/SalesMetricsPanel'
import FinancialProofPanel from '../components/ExecutiveUI/FinancialProofPanel'

/**
 * ExecutiveDashboardDemo - Light Mode
 * 
 * F-4: Strategic Portfolio Health Dashboard
 * Multi-page interactive prototype with Global Map, Revenue-at-Risk Gauge,
 * Financial Simulator, Industry Filtering, Peers Analysis, and Opportunity Mapping.
 */
export default function ExecutiveDashboardDemo() {
    const [currentTime, setCurrentTime] = useState(new Date())
    const [selectedSite, setSelectedSite] = useState(null)
    const [isSimulatorOpen, setIsSimulatorOpen] = useState(false)
    const [selectedIndustries, setSelectedIndustries] = useState([])
    const [activeTab, setActiveTab] = useState('map') // 'map', 'peers', 'opportunities'
    const [dashboardMode, setDashboardMode] = useState('operational') // 'operational' or 'sales'

    // Update time every second
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000)
        return () => clearInterval(timer)
    }, [])

    // Filter sites by selected industries
    const filteredSites = useMemo(() => {
        if (selectedIndustries.length === 0) return INDONESIA_SITES
        return INDONESIA_SITES.filter(site => selectedIndustries.includes(site.industry))
    }, [selectedIndustries])

    // Calculate portfolio KPIs based on filtered sites
    const portfolioKPIs = useMemo(() => ({
        totalSites: filteredSites.length,
        totalCapacity: filteredSites.reduce((acc, s) => acc + parseFloat(s.capacity), 0).toFixed(1),
        totalRevenue: filteredSites.reduce((acc, s) => {
            const rev = parseFloat(s.revenue.replace(/[$K\/day,]/g, ''))
            return acc + (rev * 1000)
        }, 0),
        totalAssets: filteredSites.reduce((acc, s) => {
            return acc + Object.values(s.assets).reduce((a, b) => a + b, 0)
        }, 0),
        healthySites: filteredSites.filter(s => s.status === 'healthy').length,
    }), [filteredSites])

    const handleOpenSimulator = (site) => {
        setSelectedSite(site)
        setIsSimulatorOpen(true)
    }

    return (
        <div className="min-h-screen bg-surface-100">
            {/* Header - Fixed with proper z-index */}
            <header className="fixed top-0 left-0 right-0 z-50 border-b border-surface-200 bg-surface-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-6 py-3">
                    <div className="flex items-center justify-between">
                        {/* Logo & Title */}
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sun-amber-500 to-sun-amber-600 flex items-center justify-center shadow-sm">
                                    <Sun className="w-6 h-6 text-surface-900" />
                                </div>
                                <div className="h-8 w-px bg-surface-200" />
                                <div>
                                    <p className="text-sm font-semibold text-surface-900">
                                        Executive Dashboard
                                    </p>
                                    <p className="text-[10px] text-surface-500 uppercase tracking-widest">
                                        Strategic Portfolio Health
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Nav Links */}
                        <nav className="flex items-center gap-1 bg-surface-100 rounded-lg p-1">
                            <a
                                href="#/"
                                className="px-4 py-2 rounded-md text-sm font-medium bg-surface-200 text-sun-green-300 shadow-sm border border-surface-200"
                            >
                                Overview
                            </a>

                            <a
                                href="#/recs"
                                className="px-4 py-2 rounded-md text-sm font-medium text-surface-600 hover:text-surface-900 hover:bg-white transition-colors"
                            >
                                RECs
                            </a>
                            <a
                                href="#/technician"
                                className="px-4 py-2 rounded-md text-sm font-medium text-surface-600 hover:text-surface-900 hover:bg-white transition-colors"
                            >
                                Technician
                            </a>
                        </nav>

                        {/* Right Section */}
                        <div className="flex items-center gap-4">
                            {/* Live Status */}
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/12 border border-emerald-400/30">
                                <div className="relative">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                    <div className="absolute inset-0 w-2 h-2 rounded-full bg-emerald-500 animate-ping opacity-50" />
                                </div>
                                <span className="text-xs font-medium text-emerald-300">Live</span>
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
                            <div className="flex items-center gap-1">
                                <button className="p-2 rounded-lg hover:bg-surface-300/50 transition-colors">
                                    <Bell className="w-5 h-5 text-surface-500" />
                                </button>
                                <button className="p-2 rounded-lg hover:bg-surface-300/50 transition-colors">
                                    <Settings className="w-5 h-5 text-surface-500" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content - Add top padding for fixed header */}
            <main className="pt-20 max-w-7xl mx-auto px-6 py-8">
                {/* Page Header with Mode Toggle */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-surface-900 mb-1">
                            {dashboardMode === 'operational' ? 'Strategic Portfolio Health' : 'Sales Intelligence Dashboard'}
                        </h2>
                        <p className="text-sm text-surface-500">
                            {dashboardMode === 'operational'
                                ? 'F-4: Executive visibility across Indonesia solar assets'
                                : 'Track record, reliability & financial proof points for sales enablement'}
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        {/* Mode Toggle */}
                        <div className="flex items-center bg-surface-100 rounded-xl p-1 border border-surface-200">
                            <button
                                onClick={() => setDashboardMode('operational')}
                                className={`
                                    flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all
                                    ${dashboardMode === 'operational'
                                        ? 'bg-surface-200 text-surface-900 shadow-sm border border-surface-200'
                                        : 'text-surface-500 hover:text-surface-700'}
                                `}
                            >
                                <Activity className="w-4 h-4" />
                                Operational
                            </button>
                            <button
                                onClick={() => setDashboardMode('sales')}
                                className={`
                                    flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all
                                    ${dashboardMode === 'sales'
                                        ? 'bg-gradient-to-r from-sun-green-500 to-emerald-500 text-white shadow-sm'
                                        : 'text-surface-500 hover:text-surface-700'}
                                `}
                            >
                                <TrendingUp className="w-4 h-4" />
                                Sales
                            </button>
                        </div>


                    </div>
                </div>

                {/* Portfolio KPI Summary - Operational Mode Only */}
                {dashboardMode === 'operational' && (
                    <div className="grid grid-cols-5 gap-4 mb-8">
                        {[
                            {
                                label: 'Total Sites',
                                value: portfolioKPIs.totalSites,
                                icon: Building2,
                                color: 'sun-green',
                                suffix: ''
                            },
                            {
                                label: 'Capacity',
                                value: portfolioKPIs.totalCapacity,
                                icon: Zap,
                                color: 'blue',
                                suffix: ' MW'
                            },
                            {
                                label: 'Daily Revenue',
                                value: `$${(portfolioKPIs.totalRevenue / 1000).toFixed(0)}K`,
                                icon: DollarSign,
                                color: 'emerald',
                                suffix: ''
                            },
                            {
                                label: 'Total Assets',
                                value: portfolioKPIs.totalAssets.toLocaleString(),
                                icon: Activity,
                                color: 'purple',
                                suffix: ''
                            },
                            {
                                label: 'Healthy Sites',
                                value: `${portfolioKPIs.healthySites}/${portfolioKPIs.totalSites}`,
                                icon: TrendingUp,
                                color: 'emerald',
                                suffix: ''
                            },
                        ].map((kpi) => (
                            <motion.div
                                key={kpi.label}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`bg-surface-200 rounded-xl p-4 border border-surface-200 shadow-sm border-t-2 border-t-${kpi.color}-500`}
                            >
                                <div className="flex items-center gap-2 mb-2">
                                    <kpi.icon className={`w-4 h-4 text-${kpi.color}-500`} />
                                    <span className="text-xs text-surface-500 font-medium">{kpi.label}</span>
                                </div>
                                <p className="text-xl font-bold text-surface-900">
                                    {kpi.value}{kpi.suffix}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* Industry Filter Section */}
                <div className="bg-surface-200 rounded-xl border border-surface-200 shadow-sm p-4 mb-6">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-500/12 border border-blue-400/35 flex items-center justify-center">
                            <Filter className="w-4 h-4 text-blue-300" />
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-surface-900">Industry Filter</h3>
                            <p className="text-[10px] text-surface-500">Select industries to filter map view and analysis</p>
                        </div>
                    </div>
                    <IndustryFilterPanel
                        selectedIndustries={selectedIndustries}
                        onIndustryToggle={setSelectedIndustries}
                        compact={true}
                    />
                </div>

                {/* Main Grid: Map + Side Panel */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-6">
                    {/* Indonesia Map - Takes 3 columns */}
                    <div className="lg:col-span-3">
                        <IndonesiaMapView
                            selectedSite={selectedSite}
                            onSiteSelect={setSelectedSite}
                            onOpenSimulator={handleOpenSimulator}
                            filteredSites={filteredSites}
                        />
                    </div>

                    {/* Right Side Panel - Mode Dependent */}
                    <div className="lg:col-span-2">
                        {dashboardMode === 'operational' ? (
                            <RevenueAtRiskGauge
                                sites={filteredSites}
                                hourlyRate={4200}
                            />
                        ) : (
                            <SalesMetricsPanel sites={filteredSites} />
                        )}
                    </div>
                </div>

                {/* Tab Navigation for Peers Analysis & Opportunities - Sales Mode Only */}
                {dashboardMode === 'sales' && (
                    <>
                        <div className="flex items-center gap-2 mb-4">
                            <button
                                onClick={() => setActiveTab('peers')}
                                className={`
                                    px-4 py-2 rounded-lg text-sm font-medium transition-all
                                    ${activeTab === 'peers'
                                        ? 'bg-purple-500 text-white shadow-md'
                                        : 'bg-surface-300/50 border border-surface-400/50 text-surface-600 hover:border-purple-300'
                                    }
                                `}
                            >
                                Industry Peers Analysis
                            </button>
                            <button
                                onClick={() => setActiveTab('opportunities')}
                                className={`
                                    px-4 py-2 rounded-lg text-sm font-medium transition-all
                                    ${activeTab === 'opportunities'
                                        ? 'bg-amber-500 text-white shadow-md'
                                        : 'bg-surface-300/50 border border-surface-400/50 text-surface-600 hover:border-amber-300'
                                    }
                                `}
                            >
                                Opportunity Mapping
                            </button>
                        </div>

                        {/* Content based on active tab */}
                        <div className="bg-surface-200 rounded-xl border border-surface-200 shadow-sm p-5">
                            {activeTab === 'peers' && (
                                <IndustryPeersPanel
                                    sites={filteredSites}
                                    selectedIndustry={selectedIndustries.length === 1 ? selectedIndustries[0] : null}
                                    onSiteSelect={setSelectedSite}
                                />
                            )}
                            {activeTab === 'opportunities' && (
                                <OpportunityMapping
                                    selectedIndustries={selectedIndustries}
                                />
                            )}
                        </div>
                    </>
                )}

                {/* Mode-Specific Bottom Section */}
                {dashboardMode === 'operational' ? (
                    /* Asset Distribution Section - Operational Only */
                    <div className="mt-8">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-1 h-6 rounded-full bg-blue-500" />
                            <h3 className="text-lg font-semibold text-surface-900">Asset Distribution</h3>
                            {selectedIndustries.length > 0 && (
                                <span className="text-xs text-surface-500 bg-surface-100 px-2 py-1 rounded-md">
                                    Filtered: {filteredSites.length} sites
                                </span>
                            )}
                        </div>

                        <div className="grid grid-cols-4 gap-4">
                            {[
                                {
                                    type: 'Solar Panels',
                                    icon: Sun,
                                    count: filteredSites.reduce((acc, s) => acc + s.assets.solarPanels, 0),
                                    color: 'sun-green',
                                    capacity: `${(filteredSites.reduce((acc, s) => acc + s.assets.solarPanels, 0) * 0.01).toFixed(1)} MW`
                                },
                                {
                                    type: 'BESS Units',
                                    icon: Battery,
                                    count: filteredSites.reduce((acc, s) => acc + s.assets.bess, 0),
                                    color: 'emerald',
                                    capacity: `${filteredSites.reduce((acc, s) => acc + s.assets.bess, 0) * 2.5} MWh`
                                },
                                {
                                    type: 'EV Fleet',
                                    icon: Car,
                                    count: filteredSites.reduce((acc, s) => acc + s.assets.evFleet, 0),
                                    color: 'blue',
                                    capacity: `${filteredSites.reduce((acc, s) => acc + s.assets.evFleet, 0)} vehicles`
                                },
                                {
                                    type: 'Chargers',
                                    icon: Zap,
                                    count: filteredSites.reduce((acc, s) => acc + s.assets.chargers, 0),
                                    color: 'purple',
                                    capacity: `${filteredSites.reduce((acc, s) => acc + s.assets.chargers, 0)} stations`
                                },
                            ].map((asset, idx) => (
                                <motion.div
                                    key={asset.type}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="bg-surface-200 rounded-xl p-5 border border-surface-200 shadow-sm"
                                >
                                    <div className={`w-12 h-12 rounded-xl bg-${asset.color}-100 flex items-center justify-center mb-3`}>
                                        <asset.icon className={`w-6 h-6 text-${asset.color}-600`} />
                                    </div>
                                    <p className="text-2xl font-bold text-surface-900 mb-1">
                                        {asset.count.toLocaleString()}
                                    </p>
                                    <p className="text-sm text-surface-600">{asset.type}</p>
                                    <p className="text-xs text-surface-500 mt-2">{asset.capacity}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                ) : (
                    /* Financial Proof Points - Sales Only */
                    <div className="mt-8">
                        <FinancialProofPanel sites={filteredSites} />
                    </div>
                )}

                {/* Footer */}
                <footer className="mt-12 pt-8 border-t border-surface-200 text-center">
                    <p className="text-xs text-surface-500">
                        Nova Energy Executive Dashboard v1.0 • F-4: Strategic Portfolio Health
                    </p>
                </footer>
            </main>

            {/* Financial Simulator Panel */}
            <FinancialSimulator
                isOpen={isSimulatorOpen}
                onClose={() => setIsSimulatorOpen(false)}
                site={selectedSite || INDONESIA_SITES[0]}
            />
        </div>
    )
}

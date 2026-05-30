import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Clock,
    Bell,
    Settings,
    Leaf,
    TrendingUp,
    DollarSign,
    FileCheck,
    AlertCircle,
    CheckCircle2,
    ChevronRight,
    Building2,
    Users,
    FileText,
    Send,
    ArrowRight,
    BarChart3,
    PieChart,
    Filter
} from 'lucide-react'
import { INDONESIA_SITES } from '../components/ExecutiveUI/IndonesiaMapView'

/**
 * RECDashboardDemo - Renewable Energy Certificate Portfolio Dashboard
 * 
 * Provides portfolio-level REC tracking across all Nova Energy sites.
 * Tracks: Generated → Registered → Issued → Sold lifecycle
 */

// Generate REC data for each site based on their solar capacity
const generateRECData = (sites) => {
    return sites.map(site => {
        const capacityMW = parseFloat(site.capacity)
        // Assume ~1,500 MWh per MW per year (solar capacity factor ~17%)
        const annualMWh = Math.round(capacityMW * 1500)
        // Each REC = 1 MWh
        const recsGenerated = annualMWh

        // Generate realistic percentages based on site status
        let registeredPct, issuedPct, soldPct
        if (site.status === 'healthy') {
            registeredPct = 75 + Math.random() * 20 // 75-95%
            issuedPct = 60 + Math.random() * 25 // 60-85%
            soldPct = 40 + Math.random() * 35 // 40-75%
        } else if (site.status === 'warning') {
            registeredPct = 35 + Math.random() * 25 // 35-60%
            issuedPct = 25 + Math.random() * 20 // 25-45%
            soldPct = 15 + Math.random() * 20 // 15-35%
        } else {
            registeredPct = 10 + Math.random() * 15 // 10-25%
            issuedPct = 5 + Math.random() * 10 // 5-15%
            soldPct = 2 + Math.random() * 8 // 2-10%
        }

        const recsRegistered = Math.round(recsGenerated * registeredPct / 100)
        const recsIssued = Math.round(recsRegistered * issuedPct / 100)
        const recsSold = Math.round(recsIssued * soldPct / 100)

        // REC price typically $1-5 per REC in Indonesia
        const avgPrice = 2.5 + Math.random() * 2
        const revenue = recsSold * avgPrice

        return {
            ...site,
            recsGenerated,
            recsRegistered,
            recsIssued,
            recsSold,
            registeredPct: Math.round(registeredPct),
            issuedPct: Math.round((recsIssued / recsGenerated) * 100),
            soldPct: Math.round((recsSold / recsGenerated) * 100),
            avgPrice: avgPrice.toFixed(2),
            recRevenue: revenue,
            sunOwned: Math.random() > 0.3, // 70% SUN-owned
        }
    })
}

// Action items from different teams
const actionItems = [
    { team: 'Asset Management', count: 5, items: ['Submit PPA documentation for Jakarta', 'Update meter readings for Medan', 'Verify generation data for Q4'], color: 'blue' },
    { team: 'Sales & Finance', count: 3, items: ['Process REC sale for Makassar buyer', 'Invoice pending for Bali RECs'], color: 'emerald' },
    { team: 'RECs Team', count: 4, items: ['Complete registration for Surabaya', 'Submit issuance request for Palembang'], color: 'purple' },
    { team: 'Compliance', count: 2, items: ['Audit preparation for Jakarta site', 'Update regulatory filings'], color: 'amber' },
]

export default function RECDashboardDemo() {
    const [currentTime, setCurrentTime] = useState(new Date())
    const [selectedTeam, setSelectedTeam] = useState(null)
    const [sortBy, setSortBy] = useState('revenue') // 'revenue', 'registered', 'generated'

    // Update time every second
    React.useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000)
        return () => clearInterval(timer)
    }, [])

    // Generate REC data from sites
    const recData = useMemo(() => generateRECData(INDONESIA_SITES), [])

    // Sort data based on selection
    const sortedData = useMemo(() => {
        const sorted = [...recData]
        if (sortBy === 'revenue') sorted.sort((a, b) => b.recRevenue - a.recRevenue)
        else if (sortBy === 'registered') sorted.sort((a, b) => b.registeredPct - a.registeredPct)
        else sorted.sort((a, b) => b.recsGenerated - a.recsGenerated)
        return sorted
    }, [recData, sortBy])

    // Calculate portfolio totals
    const portfolioTotals = useMemo(() => ({
        generated: recData.reduce((acc, s) => acc + s.recsGenerated, 0),
        registered: recData.reduce((acc, s) => acc + s.recsRegistered, 0),
        issued: recData.reduce((acc, s) => acc + s.recsIssued, 0),
        sold: recData.reduce((acc, s) => acc + s.recsSold, 0),
        revenue: recData.reduce((acc, s) => acc + s.recRevenue, 0),
        avgPrice: (recData.reduce((acc, s) => acc + parseFloat(s.avgPrice), 0) / recData.length).toFixed(2),
    }), [recData])

    // Status helper - using shorter labels for single-line display
    const getStatus = (pct) => {
        if (pct >= 80) return { label: 'On Track', color: 'emerald', icon: CheckCircle2 }
        if (pct >= 40) return { label: 'Attention', color: 'amber', icon: AlertCircle }
        return { label: 'Critical', color: 'rose', icon: AlertCircle }
    }

    return (
        <div className="min-h-screen bg-surface-100">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 border-b border-surface-200 bg-surface-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-6 py-3">
                    <div className="flex items-center justify-between">
                        {/* Logo & Title */}
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sun-amber-500 to-sun-amber-600 flex items-center justify-center shadow-sm">
                                    <Leaf className="w-6 h-6 text-surface-900" />
                                </div>
                                <div className="h-8 w-px bg-surface-200" />
                                <div>
                                    <p className="text-sm font-semibold text-surface-900">
                                        REC Portfolio Dashboard
                                    </p>
                                    <p className="text-[10px] text-surface-500 uppercase tracking-widest">
                                        Renewable Energy Certificates
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Nav Links */}
                        <nav className="flex items-center gap-1 bg-surface-100 rounded-lg p-1">
                            <a
                                href="#/"
                                className="px-4 py-2 rounded-md text-sm font-medium text-surface-600 hover:text-surface-900 hover:bg-white transition-colors"
                            >
                                Overview
                            </a>

                            <a
                                href="#/recs"
                                className="px-4 py-2 rounded-md text-sm font-medium bg-surface-200 text-sun-green-300 shadow-sm border border-surface-200"
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
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/12 border border-emerald-400/30">
                                <div className="relative">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                    <div className="absolute inset-0 w-2 h-2 rounded-full bg-emerald-500 animate-ping opacity-50" />
                                </div>
                                <span className="text-xs font-medium text-emerald-300">Live</span>
                            </div>
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

            {/* Main Content */}
            <main className="pt-20 max-w-7xl mx-auto px-6 py-8">
                {/* Page Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-surface-900 mb-1">REC Portfolio Status</h2>
                        <p className="text-sm text-surface-500">Portfolio-level RECs tracking across all Nova Energy sites</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-xs text-surface-500">Last updated: {currentTime.toLocaleDateString()}</span>
                        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sun-green-500 hover:bg-sun-green-600 transition-colors shadow-lg shadow-sun-green-500/25">
                            <FileCheck className="w-4 h-4 text-white" />
                            <span className="text-sm text-white font-medium">Export Report</span>
                        </button>
                    </div>
                </div>

                {/* Portfolio KPIs - Clean Cards */}
                <div className="grid grid-cols-6 gap-3 mb-6">
                    {[
                        { label: 'RECs Generated', value: portfolioTotals.generated.toLocaleString(), icon: Leaf, suffix: 'YTD' },
                        { label: 'RECs Registered', value: portfolioTotals.registered.toLocaleString(), icon: FileText, suffix: `${Math.round(portfolioTotals.registered / portfolioTotals.generated * 100)}%` },
                        { label: 'RECs Issued', value: portfolioTotals.issued.toLocaleString(), icon: FileCheck, suffix: `${Math.round(portfolioTotals.issued / portfolioTotals.generated * 100)}%` },
                        { label: 'RECs Sold', value: portfolioTotals.sold.toLocaleString(), icon: TrendingUp, suffix: `${Math.round(portfolioTotals.sold / portfolioTotals.generated * 100)}%` },
                        { label: 'Avg. Price/REC', value: `$${portfolioTotals.avgPrice}`, icon: PieChart, suffix: '' },
                        { label: 'REC Revenue', value: `$${(portfolioTotals.revenue / 1000).toFixed(1)}K`, icon: DollarSign, suffix: 'YTD' },
                    ].map((kpi, idx) => (
                        <div
                            key={kpi.label}
                            className="bg-surface-200 rounded-lg p-4 border border-surface-200"
                        >
                            <div className="flex items-center gap-2 mb-2">
                                <kpi.icon className="w-4 h-4 text-surface-400" />
                                <span className="text-xs text-surface-500">{kpi.label}</span>
                            </div>
                            <p className="text-xl font-semibold text-surface-900">{kpi.value}</p>
                            {kpi.suffix && <span className="text-xs text-surface-400">{kpi.suffix}</span>}
                        </div>
                    ))}
                </div>

                {/* Action Tracker - Moved above site level */}
                <div className="bg-surface-200 rounded-lg border border-surface-200 p-5 mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-surface-900">Action Tracker</h3>
                            <span className="px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 text-xs font-medium">
                                {actionItems.reduce((acc, t) => acc + t.count, 0)} pending
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-4 gap-3 mb-4">
                        {actionItems.map((team, idx) => (
                            <button
                                key={team.team}
                                onClick={() => setSelectedTeam(selectedTeam === team.team ? null : team.team)}
                                className={`p-3 rounded-lg border transition-all text-left ${selectedTeam === team.team
                                    ? 'border-amber-400 bg-amber-500/12'
                                    : 'border-surface-200 hover:border-surface-300'
                                    }`}
                            >
                                <div className="flex items-center justify-between mb-1">
                                    <Users className="w-4 h-4 text-surface-400" />
                                    <span className="text-sm font-bold text-surface-900">{team.count}</span>
                                </div>
                                <p className="text-sm text-surface-600">{team.team}</p>
                            </button>
                        ))}
                    </div>

                    <AnimatePresence>
                        {selectedTeam && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="border-t border-surface-100 pt-3"
                            >
                                <p className="text-xs text-surface-500 mb-2">Pending from {selectedTeam}</p>
                                <div className="space-y-1.5">
                                    {actionItems.find(t => t.team === selectedTeam)?.items.map((item, idx) => (
                                        <div key={idx} className="flex items-center justify-between p-2 rounded bg-surface-300/25">
                                            <span className="text-sm text-surface-700">{item}</span>
                                            <button className="text-xs text-sun-green-300 font-medium hover:underline">Remind</button>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Site Level Tracking */}
                <div className="bg-surface-200 rounded-xl border border-surface-200 shadow-sm p-6 mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-1 h-6 rounded-full bg-blue-500" />
                            <h3 className="text-lg font-semibold text-surface-900">Site-Level REC Tracking</h3>
                        </div>
                        <div className="flex items-center gap-2">
                            <Filter className="w-4 h-4 text-surface-400" />
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="text-sm border border-surface-200 rounded-lg px-3 py-1.5 bg-surface-200 text-surface-700 focus:outline-none focus:ring-2 focus:ring-sun-green-500/30"
                            >
                                <option value="revenue">Sort by Revenue</option>
                                <option value="registered">Sort by Registration %</option>
                                <option value="generated">Sort by Generated</option>
                            </select>
                        </div>
                    </div>

                    {/* Table Header */}
                    <div className="grid grid-cols-12 gap-4 px-4 py-3 bg-surface-300/25 rounded-lg mb-2 text-xs font-semibold text-surface-600 uppercase tracking-wide">
                        <div className="col-span-2">Site</div>
                        <div className="col-span-1 text-center">RECs/Year</div>
                        <div className="col-span-1 text-center">Nova-Owned</div>
                        <div className="col-span-2 text-center">% Registered</div>
                        <div className="col-span-2 text-center">% Issued</div>
                        <div className="col-span-2 text-center">% Sold</div>
                        <div className="col-span-1 text-center">Revenue</div>
                        <div className="col-span-1 text-center">Status</div>
                    </div>

                    {/* Table Rows */}
                    <div className="space-y-2">
                        {sortedData.map((site, idx) => {
                            const status = getStatus(site.registeredPct)
                            const StatusIcon = status.icon

                            return (
                                <motion.div
                                    key={site.id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="grid grid-cols-12 gap-4 px-4 py-4 rounded-xl border border-surface-200 hover:border-surface-300 hover:shadow-sm transition-all items-center"
                                >
                                    {/* Site Name */}
                                    <div className="col-span-2">
                                        <a
                                            href={`#/recs/site/${site.id}`}
                                            className="block hover:bg-sun-green-50 rounded-lg p-1 -m-1 transition-colors"
                                        >
                                            <p className="font-semibold text-sun-green-300 hover:text-sun-green-300 text-sm flex items-center gap-1">
                                                {site.name}
                                                <ChevronRight className="w-3 h-3 opacity-50" />
                                            </p>
                                            <p className="text-xs text-surface-500">{site.location}</p>
                                        </a>
                                    </div>

                                    {/* RECs/Year */}
                                    <div className="col-span-1 text-center">
                                        <span className="font-bold text-surface-900">{(site.recsGenerated / 1000).toFixed(1)}K</span>
                                    </div>

                                    {/* Nova-Owned */}
                                    <div className="col-span-1 text-center">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${site.sunOwned ? 'bg-sun-green-500/15 text-sun-green-300' : 'bg-surface-100 text-surface-600'}`}>
                                            {site.sunOwned ? 'Yes' : 'No'}
                                        </span>
                                    </div>

                                    {/* % Registered */}
                                    <div className="col-span-2">
                                        <div className="flex items-center gap-2">
                                            <div className="flex-1 h-3 bg-surface-100 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full ${site.registeredPct >= 80 ? 'bg-emerald-500' : site.registeredPct >= 40 ? 'bg-amber-500' : 'bg-rose-500'}`}
                                                    style={{ width: `${site.registeredPct}%` }}
                                                />
                                            </div>
                                            <span className="text-sm font-semibold text-surface-700 w-10">{site.registeredPct}%</span>
                                        </div>
                                    </div>

                                    {/* % Issued */}
                                    <div className="col-span-2">
                                        <div className="flex items-center gap-2">
                                            <div className="flex-1 h-3 bg-surface-100 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full rounded-full bg-purple-500"
                                                    style={{ width: `${site.issuedPct}%` }}
                                                />
                                            </div>
                                            <span className="text-sm font-semibold text-surface-700 w-10">{site.issuedPct}%</span>
                                        </div>
                                    </div>

                                    {/* % Sold */}
                                    <div className="col-span-2">
                                        <div className="flex items-center gap-2">
                                            <div className="flex-1 h-3 bg-surface-100 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full rounded-full bg-emerald-500"
                                                    style={{ width: `${site.soldPct}%` }}
                                                />
                                            </div>
                                            <span className="text-sm font-semibold text-surface-700 w-10">{site.soldPct}%</span>
                                        </div>
                                    </div>

                                    {/* Revenue */}
                                    <div className="col-span-1 text-center">
                                        <span className="font-bold text-emerald-400">${(site.recRevenue / 1000).toFixed(1)}K</span>
                                    </div>

                                    {/* Status - single line, compact */}
                                    <div className="col-span-1 flex justify-center">
                                        <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-${status.color}-50 whitespace-nowrap`}>
                                            <StatusIcon className={`w-3 h-3 text-${status.color}-500 flex-shrink-0`} />
                                            <span className={`text-[10px] font-semibold text-${status.color}-600`}>{status.label}</span>
                                        </div>
                                    </div>
                                </motion.div>
                            )
                        })}
                    </div>
                </div>



                {/* Footer */}
                <footer className="mt-12 pt-8 border-t border-surface-200 text-center">
                    <p className="text-xs text-surface-500">
                        Nova Energy REC Dashboard v1.0 • Sustainability & Carbon Intelligence Hub
                    </p>
                </footer>
            </main>
        </div>
    )
}

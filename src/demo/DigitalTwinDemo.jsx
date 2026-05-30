import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Sun,
    Clock,
    Settings,
    Bell,
    Eye,
    EyeOff,
    Layers,
    Activity,
    AlertTriangle,
    ChevronLeft,
    Zap,
    RotateCcw,
    Battery,
    Car,
    Plug,
    Ticket,
    ShoppingBag
} from 'lucide-react'

import SolarFarmViewer from '../components/DigitalTwin/SolarFarmViewer'
import PerformanceChart from '../components/DigitalTwin/PerformanceChart'
import TimelineScrubber from '../components/DigitalTwin/TimelineScrubber'
import AnomalyPanel from '../components/DigitalTwin/AnomalyPanel'
import { AlarmSuppressionGraph, RootCauseModal } from '../components/AlarmSuppression'

// New components for enhanced Digital Twin
import SolarMetricsPanel from '../components/DigitalTwin/SolarMetricsPanel'
import BESSStatusPanel from '../components/DigitalTwin/BESSStatusPanel'
import EVFleetTelematics from '../components/DigitalTwin/EVFleetTelematics'
import EVSEManagement from '../components/DigitalTwin/EVSEManagement'
import GridEconomicsPanel from '../components/DigitalTwin/GridEconomicsPanel'
import CollapsibleSection from '../components/DigitalTwin/CollapsibleSection'
import TicketManagementPanel from '../components/DigitalTwin/TicketManagementPanel'
import PerformanceStatusTable from '../components/DigitalTwin/PerformanceStatusTable'
import CommercializationPanel from '../components/DigitalTwin/CommercializationPanel'

// Import site data from IndonesiaMapView
import { INDONESIA_SITES, statusColors } from '../components/ExecutiveUI/IndonesiaMapView'
import { MapPin, DollarSign, Building2, Gauge } from 'lucide-react'

/**
 * SiteDetailsBanner - Futuristic site information display
 */
function SiteDetailsBanner({ site }) {
    if (!site) return null

    const colors = statusColors[site.status]
    const totalAssets = Object.values(site.assets).reduce((a, b) => a + b, 0)

    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 relative overflow-hidden"
        >
            {/* Background gradient with glassmorphism */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-2xl" />
            <div className="absolute inset-0 bg-gradient-to-r from-sun-green-500/10 via-cyan-500/5 to-purple-500/10 rounded-2xl" />

            {/* Animated grid pattern overlay */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0" style={{
                    backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
                    backgroundSize: '50px 50px'
                }} />
            </div>

            {/* Glowing accent lines */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-sun-green-400/50 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent" />

            <div className="relative px-6 py-5">
                <div className="flex items-center justify-between">
                    {/* Left: Site Identity */}
                    <div className="flex items-center gap-5">
                        {/* Status Orb */}
                        <div className="relative">
                            <div className={`w-14 h-14 rounded-2xl ${colors.bg} backdrop-blur-sm border ${colors.border} flex items-center justify-center`}>
                                <MapPin className={`w-7 h-7 ${colors.text}`} />
                            </div>
                            {/* Pulsing ring for active sites */}
                            <div className={`absolute -inset-1 rounded-2xl ${colors.bg} animate-pulse opacity-30`} style={{ animationDuration: '2s' }} />
                        </div>

                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <h2 className="text-xl font-bold text-white">{site.name}</h2>
                                <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold uppercase tracking-wide ${colors.bg} ${colors.text} border ${colors.border}`}>
                                    {site.status}
                                </span>
                            </div>
                            <div className="flex items-center gap-4 text-sm">
                                <span className="text-slate-400 flex items-center gap-1.5">
                                    <Building2 className="w-3.5 h-3.5" />
                                    {site.location}
                                </span>
                                <span className="text-slate-500">•</span>
                                <span className="text-slate-400 capitalize">{site.industry}</span>
                            </div>
                        </div>
                    </div>

                    {/* Right: Key Metrics */}
                    <div className="flex items-center gap-6">
                        {/* Capacity */}
                        <div className="text-center px-4 py-2 rounded-xl bg-white/5 backdrop-blur border border-white/10">
                            <div className="flex items-center justify-center gap-1.5 mb-1">
                                <Zap className="w-4 h-4 text-cyan-400" />
                                <span className="text-[10px] text-slate-400 uppercase tracking-wider">Capacity</span>
                            </div>
                            <p className="text-lg font-bold text-white">{site.capacity}</p>
                        </div>

                        {/* Revenue */}
                        <div className="text-center px-4 py-2 rounded-xl bg-white/5 backdrop-blur border border-white/10">
                            <div className="flex items-center justify-center gap-1.5 mb-1">
                                <DollarSign className="w-4 h-4 text-emerald-400" />
                                <span className="text-[10px] text-slate-400 uppercase tracking-wider">Revenue</span>
                            </div>
                            <p className="text-lg font-bold text-emerald-400">{site.revenue}</p>
                        </div>

                        {/* Total Assets */}
                        <div className="text-center px-4 py-2 rounded-xl bg-white/5 backdrop-blur border border-white/10">
                            <div className="flex items-center justify-center gap-1.5 mb-1">
                                <Gauge className="w-4 h-4 text-purple-400" />
                                <span className="text-[10px] text-slate-400 uppercase tracking-wider">Assets</span>
                            </div>
                            <p className="text-lg font-bold text-white">{totalAssets.toLocaleString()}</p>
                        </div>

                        {/* Asset Breakdown Mini */}
                        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 backdrop-blur border border-white/10">
                            <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-2">
                                    <Sun className="w-3 h-3 text-amber-400" />
                                    <span className="text-xs text-slate-300">{site.assets.solarPanels}</span>
                                    <Battery className="w-3 h-3 text-emerald-400 ml-2" />
                                    <span className="text-xs text-slate-300">{site.assets.bess}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Car className="w-3 h-3 text-blue-400" />
                                    <span className="text-xs text-slate-300">{site.assets.evFleet}</span>
                                    <Plug className="w-3 h-3 text-purple-400 ml-2" />
                                    <span className="text-xs text-slate-300">{site.assets.chargers}</span>
                                </div>
                            </div>
                        </div>

                        {/* Downtime Alert (if applicable) */}
                        {site.downtime > 0 && (
                            <div className="px-4 py-2 rounded-xl bg-rose-500/20 backdrop-blur border border-rose-500/30">
                                <div className="flex items-center gap-1.5 mb-1">
                                    <AlertTriangle className="w-4 h-4 text-rose-400" />
                                    <span className="text-[10px] text-rose-300 uppercase tracking-wider">Downtime</span>
                                </div>
                                <p className="text-lg font-bold text-rose-400">{site.downtime}h</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    )
}

/**
 * TabButton - Individual tab button component (Light Mode)
 */
function TabButton({ icon: Icon, label, isActive, onClick }) {
    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl transition-all font-medium ${isActive
                ? 'bg-sun-green-50 text-sun-green-300 border border-sun-green-400/35 shadow-lg shadow-sun-green-500/10'
                : 'bg-surface-200 text-surface-600 border border-surface-200 hover:text-surface-900 hover:bg-surface-300/25'
                }`}
        >
            <Icon className={`w-5 h-5 ${isActive ? 'text-sun-green-500' : ''}`} />
            <span>{label}</span>
        </button>
    )
}

/**
 * DigitalTwinDemo - F-1: Performance Digital Twin Interface (Light Mode)
 * 
 * Now with tabbed navigation:
 * - Solar + BESS: Solar farm visualization, performance metrics, and battery storage
 * - EV + Charger: Electric vehicle fleet telematics and charger management
 */
export default function DigitalTwinDemo() {
    const [currentTime, setCurrentTime] = useState(new Date())
    const [activeTab, setActiveTab] = useState('solar-bess') // 'solar-bess' | 'tickets' | 'commercialization'
    const [timelineTime, setTimelineTime] = useState(10.5) // Start at anomaly point
    const [isPlaying, setIsPlaying] = useState(false)
    const [showGhostLayer, setShowGhostLayer] = useState(true)
    const [selectedPanel, setSelectedPanel] = useState(null)
    const [selectedAnomaly, setSelectedAnomaly] = useState(null)

    // F-2: Alarm Suppression state
    const [suppressionActive, setSuppressionActive] = useState(false)
    const [failedNodeId, setFailedNodeId] = useState(null)
    const [showRootCauseModal, setShowRootCauseModal] = useState(false)

    // Get selected site from URL
    const selectedSite = useMemo(() => {
        const hash = window.location.hash
        const params = new URLSearchParams(hash.split('?')[1] || '')
        const siteId = params.get('site')
        if (siteId) {
            return INDONESIA_SITES.find(s => s.id === siteId)
        }
        // Default to first site if no site selected
        return INDONESIA_SITES[0]
    }, [])

    // Update clock every second
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000)
        return () => clearInterval(timer)
    }, [])

    // Playback animation
    useEffect(() => {
        if (!isPlaying) return

        const interval = setInterval(() => {
            setTimelineTime(prev => {
                const next = prev + 0.05
                return next >= 24 ? 0 : next
            })
        }, 100)

        return () => clearInterval(interval)
    }, [isPlaying])

    // Generate panel data based on timeline position
    const panelData = useMemo(() => {
        const panels = []

        for (let row = 0; row < 4; row++) {
            for (let col = 0; col < 5; col++) {
                const panelId = `panel-${row}-${col}`

                // Simulate variance - Panel at row 1, col 2 has anomaly during hours 10-12
                let variance = 0
                const isAnomalyPanel = row === 1 && col === 2
                const isSecondaryAnomaly = row === 2 && col === 3

                if (isAnomalyPanel && timelineTime >= 10 && timelineTime <= 14) {
                    variance = -8 - Math.sin(timelineTime * 0.5) * 4
                } else if (isSecondaryAnomaly && timelineTime >= 11 && timelineTime <= 13) {
                    variance = -6 - Math.sin(timelineTime * 0.3) * 2
                }

                panels.push({
                    id: panelId,
                    position: [col * 2 - 4, 0, row * 1.5 - 2.25],
                    variance,
                    output: 100 + variance,
                    row,
                    col
                })
            }
        }

        return panels
    }, [timelineTime])

    // Anomalies for timeline
    const anomalies = useMemo(() => [
        { time: 10.5, severity: 'warning', panelId: 'panel-1-2' },
        { time: 11.2, severity: 'critical', panelId: 'panel-1-2' },
        { time: 11.8, severity: 'warning', panelId: 'panel-2-3' },
        { time: 14.8, severity: 'warning', panelId: 'panel-1-2' }
    ], [])

    // Check for anomaly at current time
    const currentAnomaly = useMemo(() => {
        const anomalyPanel = panelData.find(p => Math.abs(p.variance) > 5)
        if (anomalyPanel) {
            return {
                panelId: anomalyPanel.id,
                assetName: `Panel ${String.fromCharCode(65 + anomalyPanel.row)}-${anomalyPanel.col + 1}`,
                variance: anomalyPanel.variance.toFixed(1),
                severity: Math.abs(anomalyPanel.variance) > 10 ? 'critical' : 'warning',
                duration: '2h 15m',
                expected: '42.5',
                actual: (42.5 + anomalyPanel.variance * 0.5).toFixed(1)
            }
        }
        return null
    }, [panelData])

    // Auto-select anomaly when detected
    useEffect(() => {
        if (currentAnomaly && !selectedAnomaly) {
            setSelectedAnomaly(currentAnomaly)
        } else if (!currentAnomaly && selectedAnomaly) {
            // Keep showing for a bit after anomaly ends
        }
    }, [currentAnomaly])

    // F-2: Auto-trigger suppression when ANY anomaly is detected (for demo)
    useEffect(() => {
        if (currentAnomaly) {
            // Anomaly detected - trigger suppression to show the graph
            setSuppressionActive(true)
            setFailedNodeId('transformer-1') // Simulated root cause
        } else if (!currentAnomaly && suppressionActive) {
            // No anomaly - clear suppression after a delay
            const timeout = setTimeout(() => {
                setSuppressionActive(false)
                setFailedNodeId(null)
                setShowRootCauseModal(false)
            }, 500)
            return () => clearTimeout(timeout)
        }
    }, [currentAnomaly, suppressionActive])

    const handlePanelSelect = useCallback((panelId) => {
        setSelectedPanel(panelId === selectedPanel ? null : panelId)
    }, [selectedPanel])

    const handlePanelHover = useCallback((panelId, isHovered) => {
        // Could show tooltip or highlight
    }, [])

    return (
        <div className="min-h-screen bg-surface-100">

            {/* Header - Fixed with proper z-index */}
            <header className="fixed top-0 left-0 right-0 z-50 border-b border-surface-200 bg-surface-200 shadow-sm">
                <div className="max-w-[1600px] mx-auto px-6 py-3">
                    <div className="flex items-center justify-between">
                        {/* Logo & Navigation */}
                        <div className="flex items-center gap-4">
                            <a
                                href="#/"
                                className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-surface-300/50 transition-colors"
                            >
                                <ChevronLeft className="w-4 h-4 text-surface-600" />
                                <span className="text-sm text-surface-600">Back</span>
                            </a>

                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sun-amber-500 to-sun-amber-600 flex items-center justify-center shadow-sm">
                                    <Sun className="w-6 h-6 text-surface-900" />
                                </div>
                                <div className="h-8 w-px bg-surface-200" />
                                <div>
                                    <p className="text-sm font-semibold text-surface-900">
                                        Digital Twin Dashboard
                                    </p>
                                    <p className="text-[10px] text-surface-500 uppercase tracking-widest">
                                        Real-time Asset Monitoring
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Status & Controls */}
                        <div className="flex items-center gap-6">
                            {/* Twin Status */}
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-50 border border-cyan-200">
                                <Layers className="w-4 h-4 text-cyan-600" />
                                <span className="text-xs font-medium text-cyan-700">Twin Active</span>
                            </div>

                            {/* Anomaly Count */}
                            {currentAnomaly && activeTab === 'solar-bess' && (
                                <motion.div
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-500/12 border border-rose-400/35"
                                >
                                    <AlertTriangle className="w-4 h-4 text-rose-500" />
                                    <span className="text-xs font-medium text-rose-400">1 Anomaly</span>
                                </motion.div>
                            )}

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
                                <button className="p-2 rounded-lg bg-surface-100 border border-surface-200 hover:bg-surface-200 transition-colors">
                                    <Bell className="w-4 h-4 text-surface-600" />
                                </button>
                                <button className="p-2 rounded-lg bg-surface-100 border border-surface-200 hover:bg-surface-200 transition-colors">
                                    <Settings className="w-4 h-4 text-surface-600" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content - Add padding for fixed header */}
            <main className="pt-20 max-w-[1600px] mx-auto px-6 py-6">

                {/* Site Details Banner - Shows selected site info */}
                <SiteDetailsBanner site={selectedSite} />

                {/* Tab Navigation */}
                <div className="flex items-center gap-4 mb-6">
                    <TabButton
                        icon={Sun}
                        label="Solar + BESS"
                        isActive={activeTab === 'solar-bess'}
                        onClick={() => setActiveTab('solar-bess')}
                    />
                    <TabButton
                        icon={Ticket}
                        label="Tickets"
                        isActive={activeTab === 'tickets'}
                        onClick={() => setActiveTab('tickets')}
                    />
                    <TabButton
                        icon={ShoppingBag}
                        label="Commercialization"
                        isActive={activeTab === 'commercialization'}
                        onClick={() => setActiveTab('commercialization')}
                    />

                    {/* Tab-specific controls */}
                    {activeTab === 'solar-bess' && (
                        <div className="ml-auto flex items-center gap-3">
                            <button
                                onClick={() => setShowGhostLayer(!showGhostLayer)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-colors ${showGhostLayer
                                    ? 'bg-cyan-50 border border-cyan-200 text-cyan-700'
                                    : 'bg-surface-300/50 border border-surface-400/50 text-surface-600'
                                    }`}
                            >
                                {showGhostLayer ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                <span className="text-sm font-medium">Ghost Layer</span>
                            </button>
                        </div>
                    )}
                </div>

                {/* Tab Content */}
                <AnimatePresence mode="wait">
                    {activeTab === 'solar-bess' ? (
                        <motion.div
                            key="solar-bess"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            {/* Solar + BESS Tab Content */}
                            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">

                                {/* Left Column: 3D Viewer + Alarm Suppression */}
                                <div className="xl:col-span-2 space-y-4">
                                    {/* 3D Viewer */}
                                    <div className="bg-surface-200 rounded-xl border border-surface-200 shadow-sm overflow-hidden">
                                        <div className="flex items-center justify-between p-4 border-b border-surface-200">
                                            <div className="flex items-center gap-3">
                                                <div className="w-1 h-6 rounded-full bg-sun-green-500" />
                                                <h3 className="text-lg font-semibold text-surface-900">Solar Farm Asset View</h3>
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-surface-500">
                                                <Activity className="w-4 h-4" />
                                                <span>20 Panels • 2 Inverters</span>
                                            </div>
                                        </div>

                                        <div className="bg-gradient-to-br from-slate-800 to-slate-900 h-[350px]">
                                            <SolarFarmViewer
                                                panelData={panelData}
                                                selectedPanel={selectedPanel}
                                                onPanelSelect={handlePanelSelect}
                                                onPanelHover={handlePanelHover}
                                                className="h-full"
                                            />
                                        </div>
                                    </div>

                                    {/* F-2: Alarm Suppression - Positioned under 3D viewer */}
                                    <AnimatePresence>
                                        {currentAnomaly && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                transition={{ duration: 0.3 }}
                                            >
                                                <AlarmSuppressionGraph
                                                    failedNodeId={failedNodeId}
                                                    onNodeClick={(node) => console.log('Node clicked:', node)}
                                                    onViewRootCause={() => setShowRootCauseModal(true)}
                                                />
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* Right Column: Performance Chart + Anomaly Panel */}
                                <div className="space-y-4">
                                    {/* Performance Chart */}
                                    <div className="glass-card p-4">
                                        <PerformanceChart
                                            currentTime={timelineTime}
                                            showGhostLayer={showGhostLayer}
                                        />
                                    </div>

                                    {/* Anomaly Panel (ticket generation) */}
                                    <AnimatePresence>
                                        {currentAnomaly && (
                                            <AnomalyPanel
                                                anomaly={currentAnomaly}
                                                onClose={() => setSelectedAnomaly(null)}
                                            />
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>

                            {/* Timeline Scrubber */}
                            <div className="glass-card p-6 mb-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-1 h-6 rounded-full bg-cyan-500" />
                                    <h3 className="text-lg font-semibold text-surface-900">Timeline Analysis</h3>
                                    <span className="text-xs text-surface-500 ml-2">
                                        Scrub to detect anomalies • Red markers indicate detected issues
                                    </span>
                                </div>

                                <TimelineScrubber
                                    currentTime={timelineTime}
                                    duration={24}
                                    anomalies={anomalies}
                                    onTimeChange={setTimelineTime}
                                    onPlay={() => setIsPlaying(true)}
                                    onPause={() => setIsPlaying(false)}
                                    isPlaying={isPlaying}
                                />
                            </div>

                            {/* Performance Status Table - Under Timeline Analysis */}
                            <PerformanceStatusTable />

                            {/* ═══════════════════════════════════════════════════════════ */}
                            {/* SOLAR PV SECTION */}
                            {/* ═══════════════════════════════════════════════════════════ */}
                            <CollapsibleSection
                                icon={Sun}
                                title="Solar PV Performance"
                                colorScheme="sun-green"
                                defaultExpanded={true}
                            >
                                <SolarMetricsPanel />
                            </CollapsibleSection>

                            {/* ═══════════════════════════════════════════════════════════ */}
                            {/* BESS SECTION */}
                            {/* ═══════════════════════════════════════════════════════════ */}
                            <CollapsibleSection
                                icon={Battery}
                                title="Battery Energy Storage"
                                colorScheme="emerald"
                                defaultExpanded={true}
                            >
                                <BESSStatusPanel />
                            </CollapsibleSection>
                        </motion.div>
                    ) : activeTab === 'ev-charger' ? (
                        <motion.div
                            key="ev-charger"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            {/* ═══════════════════════════════════════════════════════════ */}
                            {/* EV FLEET SECTION */}
                            {/* ═══════════════════════════════════════════════════════════ */}
                            <CollapsibleSection
                                icon={Car}
                                title="EV Fleet Telematics"
                                colorScheme="blue"
                                defaultExpanded={true}
                            >
                                <EVFleetTelematics />
                            </CollapsibleSection>

                            {/* ═══════════════════════════════════════════════════════════ */}
                            {/* EVSE CHARGER SECTION */}
                            {/* ═══════════════════════════════════════════════════════════ */}
                            <CollapsibleSection
                                icon={Plug}
                                title="EVSE Charger Stations"
                                colorScheme="purple"
                                defaultExpanded={true}
                            >
                                <EVSEManagement />
                            </CollapsibleSection>

                            {/* ═══════════════════════════════════════════════════════════ */}
                            {/* GRID ECONOMICS SECTION */}
                            {/* ═══════════════════════════════════════════════════════════ */}
                            <CollapsibleSection
                                icon={Zap}
                                title="Grid & Energy Economics"
                                colorScheme="cyan"
                                defaultExpanded={true}
                            >
                                <GridEconomicsPanel />
                            </CollapsibleSection>
                        </motion.div>
                    ) : activeTab === 'tickets' ? (
                        <motion.div
                            key="tickets"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            {/* ═══════════════════════════════════════════════════════════ */}
                            {/* TICKET MANAGEMENT SECTION */}
                            {/* ═══════════════════════════════════════════════════════════ */}
                            <CollapsibleSection
                                icon={Ticket}
                                title="Ticket Management"
                                colorScheme="amber"
                                defaultExpanded={true}
                            >
                                <TicketManagementPanel />
                            </CollapsibleSection>
                        </motion.div>
                    ) : activeTab === 'commercialization' ? (
                        <motion.div
                            key="commercialization"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <CommercializationPanel site={selectedSite} />
                        </motion.div>
                    ) : null}
                </AnimatePresence>

                {/* Root Cause Modal */}
                <RootCauseModal
                    isOpen={showRootCauseModal}
                    onClose={() => setShowRootCauseModal(false)}
                    onAcknowledge={() => {
                        setShowRootCauseModal(false)
                    }}
                    onCreateTicket={() => {
                        alert('Ticket created for Transformer T1 failure!')
                        setShowRootCauseModal(false)
                    }}
                />

                {/* Footer */}
                <footer className="pt-8 border-t border-surface-200 mt-8 text-center">
                    <p className="text-xs text-surface-500">
                        Nova Energy Design System v1.0 • Digital Twin Dashboard • Solar + BESS | EV + Charger
                    </p>
                </footer>
            </main>
        </div>
    )
}

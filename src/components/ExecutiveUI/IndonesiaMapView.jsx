import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sun, Battery, Car, Zap, MapPin, AlertTriangle, ChevronRight, Activity, DollarSign, Cpu } from 'lucide-react'

/**
 * IndonesiaMapView Component
 * 
 * Interactive SVG map of Indonesia showing solar sites with pinpoint markers.
 * Features status-based coloring, asset type icons, and click-to-select functionality.
 */

// Mock site data for Indonesia solar installations
// Coordinates are based on viewBox 0 0 100 50 (matching PNG map)
const INDONESIA_SITES = [
    {
        id: 'jkt-1',
        name: 'Jakarta Solar Hub',
        location: 'Jakarta',
        coords: { x: 28, y: 35 },  // Java - Jakarta
        status: 'healthy',
        industry: 'manufacturing',
        assets: { solarPanels: 1200, bess: 4, evFleet: 12, chargers: 8 },
        capacity: '15.2 MW',
        revenue: '$42.3K/day',
        downtime: 0,
    },
    {
        id: 'sby-1',
        name: 'Surabaya East Plant',
        location: 'Surabaya',
        coords: { x: 37, y: 37 },  // Java - Surabaya
        status: 'warning',
        industry: 'mining',
        assets: { solarPanels: 800, bess: 2, evFleet: 8, chargers: 6 },
        capacity: '10.5 MW',
        revenue: '$28.1K/day',
        downtime: 2.4,
    },
    {
        id: 'bali-1',
        name: 'Bali Green Energy',
        location: 'Bali',
        coords: { x: 42, y: 38 },  // Bali
        status: 'healthy',
        industry: 'retail',
        assets: { solarPanels: 600, bess: 3, evFleet: 15, chargers: 12 },
        capacity: '8.2 MW',
        revenue: '$22.8K/day',
        downtime: 0,
    },
    {
        id: 'mdn-1',
        name: 'Medan Industrial',
        location: 'Medan',
        coords: { x: 12, y: 18 },  // Sumatra - Medan
        status: 'critical',
        industry: 'mining',
        assets: { solarPanels: 950, bess: 3, evFleet: 6, chargers: 4 },
        capacity: '12.8 MW',
        revenue: '$35.2K/day',
        downtime: 8.5,
    },
    {
        id: 'mksr-1',
        name: 'Makassar Port Solar',
        location: 'Makassar',
        coords: { x: 55, y: 30 },  // Sulawesi - Makassar
        status: 'healthy',
        industry: 'logistics',
        assets: { solarPanels: 720, bess: 2, evFleet: 10, chargers: 8 },
        capacity: '9.4 MW',
        revenue: '$25.6K/day',
        downtime: 0,
    },
    {
        id: 'bnj-1',
        name: 'Banjarmasin Hub',
        location: 'Banjarmasin',
        coords: { x: 40, y: 26 },  // Kalimantan - Banjarmasin
        status: 'healthy',
        industry: 'industrial',
        assets: { solarPanels: 550, bess: 2, evFleet: 5, chargers: 4 },
        capacity: '7.1 MW',
        revenue: '$19.4K/day',
        downtime: 0,
    },
    {
        id: 'plm-1',
        name: 'Palembang Energy Park',
        location: 'Palembang',
        coords: { x: 20, y: 30 },  // Sumatra - Palembang
        status: 'warning',
        industry: 'energy',
        assets: { solarPanels: 680, bess: 2, evFleet: 7, chargers: 5 },
        capacity: '8.8 MW',
        revenue: '$24.1K/day',
        downtime: 1.2,
    },
    {
        id: 'jpr-1',
        name: 'Jayapura Solar',
        location: 'Jayapura',
        coords: { x: 84, y: 22 },  // Papua - Jayapura
        status: 'healthy',
        industry: 'logistics',
        assets: { solarPanels: 420, bess: 1, evFleet: 3, chargers: 2 },
        capacity: '5.4 MW',
        revenue: '$14.8K/day',
        downtime: 0,
    },
]

const statusColors = {
    healthy: {
        fill: '#818CF8',
        glow: 'rgba(99, 102, 241, 0.5)',
        ring: '#818CF8',
        bg: 'bg-emerald-500/20',
        border: 'border-emerald-500/50',
        text: 'text-emerald-400',
    },
    warning: {
        fill: '#22D3EE',
        glow: 'rgba(34, 211, 238, 0.5)',
        ring: '#67E8F9',
        bg: 'bg-amber-500/20',
        border: 'border-amber-500/50',
        text: 'text-amber-400',
    },
    critical: {
        fill: '#FDA4AF',
        glow: 'rgba(244, 63, 94, 0.5)',
        ring: '#FDA4AF',
        bg: 'bg-rose-500/20',
        border: 'border-rose-500/50',
        text: 'text-rose-400',
    },
}

// Site pinpoint marker component
function SiteMarker({ site, isSelected, onSelect, isHovered, onHover }) {
    const colors = statusColors[site.status]
    const hasDowntime = site.downtime > 0

    return (
        <g
            className="cursor-pointer"
            onClick={() => onSelect(site)}
            onMouseEnter={() => onHover(site.id)}
            onMouseLeave={() => onHover(null)}
        >
            {/* Pulse ring for critical/warning sites */}
            {hasDowntime && (
                <circle
                    cx={site.coords.x}
                    cy={site.coords.y}
                    r="1.5"
                    fill="none"
                    stroke={colors.ring}
                    strokeWidth="0.3"
                    opacity="0.6"
                >
                    <animate
                        attributeName="r"
                        from="1"
                        to="3"
                        dur={site.status === 'critical' ? '1s' : '2s'}
                        repeatCount="indefinite"
                    />
                    <animate
                        attributeName="opacity"
                        from="0.6"
                        to="0"
                        dur={site.status === 'critical' ? '1s' : '2s'}
                        repeatCount="indefinite"
                    />
                </circle>
            )}

            {/* Selection ring */}
            {isSelected && (
                <circle
                    cx={site.coords.x}
                    cy={site.coords.y}
                    r="2.5"
                    fill="none"
                    stroke={colors.fill}
                    strokeWidth="0.3"
                    strokeDasharray="0.8 0.5"
                >
                    <animateTransform
                        attributeName="transform"
                        type="rotate"
                        from={`0 ${site.coords.x} ${site.coords.y}`}
                        to={`360 ${site.coords.x} ${site.coords.y}`}
                        dur="10s"
                        repeatCount="indefinite"
                    />
                </circle>
            )}

            {/* Glow effect */}
            <circle
                cx={site.coords.x}
                cy={site.coords.y}
                r={isHovered || isSelected ? '2' : '1.5'}
                fill={colors.glow}
                style={{ filter: 'blur(0.5px)' }}
            />

            {/* Main marker */}
            <circle
                cx={site.coords.x}
                cy={site.coords.y}
                r={isHovered || isSelected ? '1.5' : '1'}
                fill={colors.fill}
                stroke="#1E293B"
                strokeWidth="0.3"
                style={{
                    transition: 'r 0.2s ease-out',
                    filter: `drop-shadow(0 0 1px ${colors.glow})`,
                }}
            />

            {/* Site label on hover */}
            {(isHovered || isSelected) && (
                <g>
                    <rect
                        x={site.coords.x + 2}
                        y={site.coords.y - 2.5}
                        width={site.location.length * 1.5 + 2}
                        height="4"
                        rx="1"
                        fill="#1E293B"
                        stroke={colors.fill}
                        strokeWidth="0.2"
                    />
                    <text
                        x={site.coords.x + 3}
                        y={site.coords.y}
                        fontSize="2"
                        fill="#CBD5E1"
                        fontWeight="600"
                    >
                        {site.location}
                    </text>
                </g>
            )}
        </g>
    )
}

// Redesigned Site detail panel - Full width, compact, symmetrical
function SiteDetailPanel({ site, onOpenSimulator }) {
    const colors = statusColors[site.status]
    const totalAssets = Object.values(site.assets).reduce((a, b) => a + b, 0)

    const assetTypes = [
        { key: 'solarPanels', label: 'Solar Panels', icon: Sun, color: 'sun-green', iconColor: 'text-amber-400' },
        { key: 'bess', label: 'BESS Units', icon: Battery, color: 'emerald', iconColor: 'text-emerald-400' },
        { key: 'evFleet', label: 'EV Fleet', icon: Car, color: 'blue', iconColor: 'text-blue-400' },
        { key: 'chargers', label: 'Chargers', icon: Zap, color: 'purple', iconColor: 'text-purple-400' },
    ]

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="glass-card p-4 w-full"
        >
            {/* Top Row: Site Info + Status + Quick Actions */}
            <div className="grid grid-cols-12 gap-4 items-center">
                {/* Site Name & Location - 4 cols - Clickable to Digital Twin */}
                <a href={`#/digital-twin?site=${site.id}`} className="col-span-4 flex items-center gap-3 group hover:bg-surface-200/30 rounded-xl p-1 -m-1 transition-colors">
                    <div className={`w-10 h-10 rounded-xl ${colors.bg} ${colors.border} border flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform`}>
                        <MapPin className={`w-5 h-5 ${colors.text}`} />
                    </div>
                    <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                            <h4 className="text-surface-900 font-semibold text-sm truncate group-hover:text-blue-400 transition-colors">{site.name}</h4>
                            <Cpu className="w-3.5 h-3.5 text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-surface-600">{site.location}</span>
                            <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${colors.bg} ${colors.text} capitalize`}>
                                {site.status}
                            </span>
                        </div>
                    </div>
                </a>

                {/* Key Metrics - 8 cols (expanded since simulate button removed) */}
                <div className="col-span-8 grid grid-cols-3 gap-3">
                    <div className="text-center p-2 rounded-lg bg-surface-200/50">
                        <div className="flex items-center justify-center gap-1 mb-1">
                            <Zap className="w-3 h-3 text-blue-400" />
                            <span className="text-[10px] text-surface-500">Capacity</span>
                        </div>
                        <p className="text-sm font-bold text-surface-900">{site.capacity}</p>
                    </div>
                    <div className="text-center p-2 rounded-lg bg-surface-200/50">
                        <div className="flex items-center justify-center gap-1 mb-1">
                            <DollarSign className="w-3 h-3 text-emerald-400" />
                            <span className="text-[10px] text-surface-500">Revenue</span>
                        </div>
                        <p className="text-sm font-bold text-emerald-400">{site.revenue}</p>
                    </div>
                    <div className="text-center p-2 rounded-lg bg-surface-200/50">
                        <div className="flex items-center justify-center gap-1 mb-1">
                            <Activity className="w-3 h-3 text-purple-400" />
                            <span className="text-[10px] text-surface-500">Assets</span>
                        </div>
                        <p className="text-sm font-bold text-surface-900">{totalAssets}</p>
                    </div>
                </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-surface-200 my-3" />

            {/* Bottom Row: Asset Breakdown + Downtime (if applicable) */}
            <div className="grid grid-cols-12 gap-4 items-stretch">
                {/* Asset Breakdown - Equal columns */}
                <div className={`${site.downtime > 0 ? 'col-span-8' : 'col-span-12'} grid grid-cols-4 gap-2`}>
                    {assetTypes.map(({ key, label, icon: Icon, iconColor }) => (
                        <div
                            key={key}
                            className="flex items-center gap-2 p-2 rounded-lg bg-surface-200/30 border border-surface-300/50"
                        >
                            <div className="w-8 h-8 rounded-lg bg-surface-200 flex items-center justify-center flex-shrink-0">
                                <Icon className={`w-4 h-4 ${iconColor}`} />
                            </div>
                            <div className="min-w-0">
                                <p className="text-surface-900 font-bold text-sm">{site.assets[key].toLocaleString()}</p>
                                <p className="text-[10px] text-surface-500 truncate">{label}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Downtime Alert - Only shown if downtime > 0 */}
                {site.downtime > 0 && (
                    <div className="col-span-4 flex items-center gap-3 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30">
                        <div className="w-10 h-10 rounded-xl bg-rose-500/20 flex items-center justify-center flex-shrink-0">
                            <AlertTriangle className="w-5 h-5 text-rose-400" />
                        </div>
                        <div>
                            <p className="text-xs text-rose-400 font-medium">Revenue at Risk</p>
                            <p className="text-lg font-bold text-rose-400">
                                ${((site.downtime * 4200 * parseFloat(site.capacity)) / 1000).toFixed(1)}K
                            </p>
                            <p className="text-[10px] text-rose-400/70">{site.downtime}h downtime</p>
                        </div>
                    </div>
                )}
            </div>
        </motion.div>
    )
}

// Main IndonesiaMapView component
export default function IndonesiaMapView({ onSiteSelect, onOpenSimulator, selectedSite, className = '' }) {
    const [hoveredSite, setHoveredSite] = useState(null)
    const [internalSelectedSite, setInternalSelectedSite] = useState(null)

    const currentSelectedSite = selectedSite || internalSelectedSite

    const handleSiteSelect = (site) => {
        setInternalSelectedSite(site)
        onSiteSelect?.(site)
    }

    // Calculate portfolio summary
    const portfolioSummary = useMemo(() => {
        const totalSites = INDONESIA_SITES.length
        const healthySites = INDONESIA_SITES.filter(s => s.status === 'healthy').length
        const warningSites = INDONESIA_SITES.filter(s => s.status === 'warning').length
        const criticalSites = INDONESIA_SITES.filter(s => s.status === 'critical').length
        const totalDowntime = INDONESIA_SITES.reduce((acc, s) => acc + s.downtime, 0)

        return { totalSites, healthySites, warningSites, criticalSites, totalDowntime }
    }, [])

    return (
        <div className={`relative ${className}`}>
            {/* Portfolio Summary Bar */}
            <div className="flex items-center justify-between mb-4 px-2">
                <div className="flex items-center gap-4">
                    <h3 className="text-lg font-semibold text-surface-900">Indonesia Portfolio</h3>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-emerald-500" />
                            <span className="text-xs text-surface-600">{portfolioSummary.healthySites} Healthy</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-amber-500" />
                            <span className="text-xs text-surface-600">{portfolioSummary.warningSites} Warning</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-rose-500" />
                            <span className="text-xs text-surface-600">{portfolioSummary.criticalSites} Critical</span>
                        </div>
                    </div>
                </div>
                <div className="text-sm">
                    <span className="text-surface-500">Total Sites: </span>
                    <span className="text-surface-900 font-bold">{portfolioSummary.totalSites}</span>
                </div>
            </div>

            {/* Map Container - Using PNG Image */}
            <div className="relative bg-surface-200 rounded-xl border border-surface-200 shadow-sm overflow-hidden">
                {/* Map Image */}
                <div className="relative w-full h-[320px]">
                    <img
                        src="/indonesia-map.png"
                        alt="Indonesia Map"
                        className="absolute inset-0 w-full h-full object-cover"
                    />

                    {/* Site Markers Overlay */}
                    <svg
                        className="absolute inset-0 w-full h-full"
                        viewBox="0 0 100 50"
                        preserveAspectRatio="xMidYMid meet"
                    >
                        <defs>
                            <filter id="glow">
                                <feGaussianBlur stdDeviation="0.5" result="coloredBlur" />
                                <feMerge>
                                    <feMergeNode in="coloredBlur" />
                                    <feMergeNode in="SourceGraphic" />
                                </feMerge>
                            </filter>
                        </defs>

                        {/* Site Markers */}
                        {INDONESIA_SITES.map(site => (
                            <SiteMarker
                                key={site.id}
                                site={site}
                                isSelected={currentSelectedSite?.id === site.id}
                                isHovered={hoveredSite === site.id}
                                onSelect={handleSiteSelect}
                                onHover={setHoveredSite}
                            />
                        ))}
                    </svg>
                </div>

                {/* Location Labels */}
                <div className="absolute bottom-4 left-4 flex flex-wrap gap-2">
                    {['Jakarta', 'Surabaya', 'Bali', 'Medan', 'Makassar'].map(city => (
                        <span
                            key={city}
                            className="px-2 py-1 rounded-md bg-surface-300/50 border border-surface-400/50 text-[10px] text-surface-600 font-medium shadow-sm"
                        >
                            {city}
                        </span>
                    ))}
                </div>
            </div>

            {/* Selected Site Detail Panel - Full width */}
            <AnimatePresence>
                {currentSelectedSite && (
                    <div className="mt-4">
                        <SiteDetailPanel
                            site={currentSelectedSite}
                            onOpenSimulator={onOpenSimulator}
                        />
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}

// Export site data for use in other components
export { INDONESIA_SITES, statusColors }

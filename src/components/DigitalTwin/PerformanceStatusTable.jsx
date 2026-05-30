import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    AlertTriangle,
    CheckCircle,
    AlertCircle,
    Ticket,
    ChevronRight,
    Activity,
    Gauge,
    Timer,
    Thermometer,
    Zap,
    Shield
} from 'lucide-react'
import NewTicketModal from './NewTicketModal'

// ═══════════════════════════════════════════════════════════════════════════════
// METRIC DEFINITIONS
// ═══════════════════════════════════════════════════════════════════════════════

const PERFORMANCE_METRICS = [
    {
        id: 'daily-yield-deviation',
        name: 'Daily Yield Deviation',
        icon: Activity,
        description: 'Difference between actual and predicted energy output based on weather/irradiance',
        diagnostic: 'A deviation >10% on a clear day indicates "soft" faults like heavy soiling or "hard" faults like an offline string.',
        unit: '%',
        thresholds: { green: 5, yellow: 10 }
    },
    {
        id: 'peak-power-reach',
        name: 'Peak Power Reach',
        icon: Gauge,
        description: 'Highest AC power output recorded during solar noon window',
        diagnostic: 'Failure to reach ~80% of rated capacity on a cloudless day suggests hardware clipping, excessive heat, or partial array failure.',
        unit: '% of rated',
        thresholds: { green: 85, yellow: 80 }
    },
    {
        id: 'string-current-balance',
        name: 'String Current Balance',
        icon: Zap,
        description: 'Real-time comparison of Amperage across multiple parallel strings',
        diagnostic: 'All strings should be within 10% of each other; a significant outlier pinpoints a localized fault like a blown fuse, shading, or a failed module.',
        unit: '% variance',
        thresholds: { green: 5, yellow: 10 }
    },
    {
        id: 'wakeup-shutdown-timing',
        name: 'Wake-up & Shut-down Timing',
        icon: Timer,
        description: 'Timestamps when inverter starts/stops producing power relative to sunrise/sunset',
        diagnostic: 'Later-than-normal "wake-ups" often signal high resistance in DC wiring or failing inverter sensors.',
        unit: 'minutes late',
        thresholds: { green: 5, yellow: 15 }
    },
    {
        id: 'inverter-heat-delta',
        name: 'Inverter Heat Delta (Δ)',
        icon: Thermometer,
        description: 'Difference between inverter internal temperature and ambient air temperature',
        diagnostic: 'A sudden increase in this gap indicates clogged air filters or failing internal cooling fans.',
        unit: '°C',
        thresholds: { green: 20, yellow: 35 }
    },
    {
        id: 'isolation-resistance',
        name: 'Isolation Resistance (Riso)',
        icon: Shield,
        description: 'Daily pre-startup self-test measuring electrical resistance between PV circuit and ground',
        diagnostic: 'Declining resistance values are a leading indicator of moisture ingress or cable insulation breakdown before a dangerous ground fault occurs.',
        unit: 'MΩ',
        thresholds: { green: 2, yellow: 1 }
    }
]

// ═══════════════════════════════════════════════════════════════════════════════
// SIMULATED DATA GENERATOR
// ═══════════════════════════════════════════════════════════════════════════════

const generateMetricData = (timeframe) => {
    // Seed-based randomness for consistent demo data per timeframe
    const seed = timeframe === '1D' ? 1 : timeframe === '7D' ? 2 : 3

    const data = {
        '1D': [
            { value: 6.2, status: 'yellow', rootCause: 'Light soiling detected on Block A panels', nextStep: 'Schedule panel cleaning within 48h' },
            { value: 87.3, status: 'green', rootCause: 'Operating within normal parameters', nextStep: 'Continue monitoring' },
            { value: 11.5, status: 'yellow', rootCause: 'String A3 showing 12% lower current', nextStep: 'Inspect String A3 combiner box for loose connections' },
            { value: 8, status: 'yellow', rootCause: 'Inverter INV-A01 wake-up delayed', nextStep: 'Check DC isolator switch and cable connections' },
            { value: 28, status: 'green', rootCause: 'Normal thermal operation', nextStep: 'Continue monitoring' },
            { value: 1.8, status: 'green', rootCause: 'Isolation resistance within acceptable range', nextStep: 'Continue monitoring' }
        ],
        '7D': [
            { value: 4.1, status: 'green', rootCause: 'Minor weather-related variance', nextStep: 'No action required' },
            { value: 72.5, status: 'red', rootCause: 'Peak power consistently below threshold', nextStep: 'Investigate inverter clipping and module degradation' },
            { value: 8.2, status: 'yellow', rootCause: 'Intermittent imbalance on String B2', nextStep: 'Thermal imaging inspection recommended' },
            { value: 3, status: 'green', rootCause: 'Normal wake-up timing', nextStep: 'Continue monitoring' },
            { value: 42, status: 'red', rootCause: 'Elevated inverter temperature delta', nextStep: 'Clean air filters, inspect cooling fans' },
            { value: 0.8, status: 'red', rootCause: 'Declining isolation resistance trend', nextStep: 'Urgent: Inspect cable insulation and junction boxes for moisture' }
        ],
        '30D': [
            { value: 5.8, status: 'yellow', rootCause: 'Seasonal variance + accumulated soiling', nextStep: 'Plan comprehensive cleaning cycle' },
            { value: 81.2, status: 'green', rootCause: 'Slight degradation expected for system age', nextStep: 'Schedule annual performance audit' },
            { value: 6.4, status: 'yellow', rootCause: 'Multiple strings showing variance', nextStep: 'Full string-level diagnostic recommended' },
            { value: 12, status: 'yellow', rootCause: 'Trending later wake-up times', nextStep: 'Preventive maintenance on DC circuit' },
            { value: 31, status: 'green', rootCause: 'Seasonal temperature variation', nextStep: 'Continue monitoring' },
            { value: 1.2, status: 'yellow', rootCause: 'Gradual resistance decline observed', nextStep: 'Include in next scheduled maintenance' }
        ]
    }

    return data[timeframe] || data['1D']
}

// ═══════════════════════════════════════════════════════════════════════════════
// HELPER COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════

function TimeframeToggle({ selected, onChange }) {
    const options = ['1D', '7D', '30D']
    const labels = { '1D': '1 Day', '7D': '7 Days', '30D': '30 Days' }

    return (
        <div className="flex items-center gap-1 p-1 rounded-xl bg-surface-200/60 border border-surface-300/50">
            {options.map((option) => (
                <button
                    key={option}
                    onClick={() => onChange(option)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${selected === option
                        ? 'bg-sun-green-500/20 shadow-sm text-sun-green-300 border border-sun-green-400/30'
                        : 'text-surface-700 hover:text-surface-900 hover:bg-surface-300/40'
                        }`}
                >
                    {labels[option]}
                </button>
            ))}
        </div>
    )
}

function StatusBadge({ status }) {
    const config = {
        green: {
            bg: 'bg-emerald-500/15',
            text: 'text-emerald-300',
            border: 'border-emerald-400/40',
            icon: CheckCircle,
            label: 'Healthy'
        },
        yellow: {
            bg: 'bg-amber-500/15',
            text: 'text-amber-300',
            border: 'border-amber-400/40',
            icon: AlertCircle,
            label: 'Warning'
        },
        red: {
            bg: 'bg-rose-500/15',
            text: 'text-rose-300',
            border: 'border-rose-400/40',
            icon: AlertTriangle,
            label: 'Critical'
        }
    }

    const { bg, text, border, icon: Icon, label } = config[status] || config.green

    return (
        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full ${bg} ${text} border ${border}`}>
            <Icon className="w-3.5 h-3.5" />
            <span className="text-xs font-semibold">{label}</span>
        </div>
    )
}

function MetricValue({ value, unit, metric }) {
    // Determine display format based on metric type
    const isRiso = metric.id === 'isolation-resistance'
    const isPeakPower = metric.id === 'peak-power-reach'

    // For Riso and Peak Power, higher is better. For others, lower is better.
    const displayValue = isRiso || isPeakPower
        ? value.toFixed(1)
        : value.toFixed(1)

    return (
        <div className="flex items-baseline justify-center">
            <span className="text-lg font-bold text-surface-900">{displayValue}</span>
        </div>
    )
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export default function PerformanceStatusTable() {
    const [timeframe, setTimeframe] = useState('1D')
    const [ticketModalOpen, setTicketModalOpen] = useState(false)
    const [selectedMetric, setSelectedMetric] = useState(null)
    const [expandedRow, setExpandedRow] = useState(null)

    // Get data for current timeframe
    const metricData = useMemo(() => generateMetricData(timeframe), [timeframe])

    // Count issues
    const issueCount = useMemo(() => {
        const yellow = metricData.filter(d => d.status === 'yellow').length
        const red = metricData.filter(d => d.status === 'red').length
        return { yellow, red, total: yellow + red }
    }, [metricData])

    // Handle flag maintenance click
    const handleFlagMaintenance = (metric, data) => {
        setSelectedMetric({ metric, data })
        setTicketModalOpen(true)
    }

    // Handle ticket submission
    const handleTicketSubmit = (ticket) => {
        console.log('Ticket created:', ticket)
        setTicketModalOpen(false)
        setSelectedMetric(null)
    }

    return (
        <>
            <div className="glass-card p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-1 h-6 rounded-full bg-purple-500" />
                        <div>
                            <h3 className="text-lg font-semibold text-surface-900">Performance Status</h3>
                            <p className="text-xs text-surface-500">
                                Real-time diagnostic metrics with maintenance flagging
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Issue Summary */}
                        {issueCount.total > 0 && (
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-500/15 border border-amber-400/40">
                                <AlertTriangle className="w-4 h-4 text-amber-300" />
                                <span className="text-sm font-medium text-amber-300">
                                    {issueCount.red > 0 && <span className="text-rose-400">{issueCount.red} Critical</span>}
                                    {issueCount.red > 0 && issueCount.yellow > 0 && ' • '}
                                    {issueCount.yellow > 0 && <span>{issueCount.yellow} Warning</span>}
                                </span>
                            </div>
                        )}

                        {/* Timeframe Toggle */}
                        <TimeframeToggle selected={timeframe} onChange={setTimeframe} />
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-hidden rounded-xl border border-surface-200">
                    {/* Table Header */}
                    <div className="grid grid-cols-12 gap-4 px-4 py-3 bg-surface-300/30 border-b border-surface-300/50">
                        <div className="col-span-3 text-xs font-semibold text-surface-600 uppercase tracking-wider">
                            Metric
                        </div>
                        <div className="col-span-1 text-xs font-semibold text-surface-600 uppercase tracking-wider text-center">
                            Value
                        </div>
                        <div className="col-span-1 text-xs font-semibold text-surface-600 uppercase tracking-wider text-center">
                            Status
                        </div>
                        <div className="col-span-3 text-xs font-semibold text-surface-600 uppercase tracking-wider">
                            Root Cause
                        </div>
                        <div className="col-span-3 text-xs font-semibold text-surface-600 uppercase tracking-wider">
                            Next Step
                        </div>
                        <div className="col-span-1 text-xs font-semibold text-surface-600 uppercase tracking-wider text-center">
                            Action
                        </div>
                    </div>

                    {/* Table Body */}
                    <div className="divide-y divide-surface-100">
                        {PERFORMANCE_METRICS.map((metric, index) => {
                            const data = metricData[index]
                            const isExpanded = expandedRow === metric.id
                            const needsAction = data.status === 'yellow' || data.status === 'red'
                            const Icon = metric.icon

                            return (
                                <motion.div
                                    key={metric.id}
                                    initial={false}
                                    animate={{
                                        backgroundColor: needsAction
                                            ? data.status === 'red'
                                                ? 'rgba(248, 113, 113, 0.06)'
                                                : 'rgba(251, 191, 36, 0.05)'
                                            : 'transparent'
                                    }}
                                    className="group"
                                >
                                    {/* Main Row */}
                                    <div
                                        className="grid grid-cols-12 gap-4 px-4 py-4 items-center cursor-pointer hover:bg-surface-300/20 transition-colors"
                                        onClick={() => setExpandedRow(isExpanded ? null : metric.id)}
                                    >
                                        {/* Metric Name */}
                                        <div className="col-span-3 flex items-center gap-3">
                                            <div className={`p-2 rounded-lg ${data.status === 'red' ? 'bg-rose-500/15' :
                                                data.status === 'yellow' ? 'bg-amber-500/15' :
                                                    'bg-surface-300/40'
                                                }`}>
                                                <Icon className={`w-4 h-4 ${data.status === 'red' ? 'text-rose-400' :
                                                    data.status === 'yellow' ? 'text-amber-300' :
                                                        'text-surface-600'
                                                    }`} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-surface-900">{metric.name}</p>
                                                <p className="text-xs text-surface-500">{metric.unit}</p>
                                            </div>
                                        </div>

                                        {/* Value */}
                                        <div className="col-span-1 text-center">
                                            <MetricValue value={data.value} unit={metric.unit} metric={metric} />
                                        </div>

                                        {/* Status */}
                                        <div className="col-span-1 flex justify-center">
                                            <StatusBadge status={data.status} />
                                        </div>

                                        {/* Root Cause */}
                                        <div className="col-span-3">
                                            <p className="text-sm text-surface-700">{data.rootCause}</p>
                                        </div>

                                        {/* Next Step */}
                                        <div className="col-span-3">
                                            <p className="text-sm text-surface-700">{data.nextStep}</p>
                                        </div>

                                        {/* Action */}
                                        <div className="col-span-1 flex justify-center">
                                            {needsAction ? (
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        handleFlagMaintenance(metric, data)
                                                    }}
                                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${data.status === 'red'
                                                        ? 'bg-rose-500 text-white hover:bg-rose-600 shadow-sm'
                                                        : 'bg-amber-500 text-white hover:bg-amber-600 shadow-sm'
                                                        }`}
                                                >
                                                    <Ticket className="w-3.5 h-3.5" />
                                                    <span>Ticket</span>
                                                </button>
                                            ) : (
                                                <ChevronRight className={`w-4 h-4 text-surface-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                                            )}
                                        </div>
                                    </div>

                                    {/* Expanded Row - Diagnostic Details */}
                                    <AnimatePresence>
                                        {isExpanded && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                className="px-4 pb-4"
                                            >
                                                <div className="ml-11 p-4 rounded-lg bg-surface-300/30 border border-surface-300/50">
                                                    <p className="text-xs font-semibold text-surface-600 uppercase tracking-wider mb-2">
                                                        Diagnostic Information
                                                    </p>
                                                    <p className="text-sm text-surface-700">
                                                        {metric.diagnostic}
                                                    </p>
                                                    <div className="mt-3 pt-3 border-t border-surface-200 flex items-center gap-4">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                                            <span className="text-xs text-surface-600">
                                                                Healthy: {metric.id.includes('isolation') || metric.id.includes('peak') ? '>' : '<'} {metric.thresholds.green} {metric.unit}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-2 h-2 rounded-full bg-amber-500" />
                                                            <span className="text-xs text-surface-600">
                                                                Warning: {metric.thresholds.green}-{metric.thresholds.yellow} {metric.unit}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-2 h-2 rounded-full bg-rose-500" />
                                                            <span className="text-xs text-surface-600">
                                                                Critical: {metric.id.includes('isolation') || metric.id.includes('peak') ? '<' : '>'} {metric.thresholds.yellow} {metric.unit}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            )
                        })}
                    </div>
                </div>

                {/* Footer Stats */}
                <div className="mt-4 flex items-center justify-between text-xs text-surface-500">
                    <span>Last updated: {new Date().toLocaleTimeString()}</span>
                    <span>Showing {PERFORMANCE_METRICS.length} diagnostic metrics</span>
                </div>
            </div>

            {/* Ticket Modal */}
            <NewTicketModal
                isOpen={ticketModalOpen}
                onClose={() => {
                    setTicketModalOpen(false)
                    setSelectedMetric(null)
                }}
                onSubmit={handleTicketSubmit}
            />
        </>
    )
}

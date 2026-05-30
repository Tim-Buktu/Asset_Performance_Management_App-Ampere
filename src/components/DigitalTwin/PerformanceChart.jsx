import React, { useMemo } from 'react'
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    ReferenceLine,
    ReferenceArea
} from 'recharts'

/**
 * PerformanceChart - Dual-line chart comparing theoretical (Digital Twin) vs actual yield
 * 
 * Features:
 * - Glowing theoretical line (Digital Twin prediction)
 * - Solid actual yield line
 * - Variance zone highlighting
 * - Anomaly markers
 */
export default function PerformanceChart({
    data = [],
    currentTime = 0,
    anomalies = [],
    showGhostLayer = true,
    className = ''
}) {
    // Generate sample data if none provided
    const chartData = useMemo(() => {
        if (data.length > 0) return data

        // Generate 24 hours of sample data
        const sampleData = []
        for (let hour = 0; hour < 24; hour++) {
            const sunFactor = Math.sin((hour - 6) * Math.PI / 12)
            const theoretical = Math.max(0, sunFactor * 100 + 20)

            // Add some variance - bigger variance around hour 10-12 for demo
            let variance = (Math.random() - 0.5) * 10
            if (hour >= 10 && hour <= 12) {
                variance = -8 - Math.random() * 5 // Simulated anomaly
            }

            const actual = Math.max(0, theoretical + variance)

            sampleData.push({
                time: `${hour.toString().padStart(2, '0')}:00`,
                hour,
                theoretical: Math.round(theoretical * 10) / 10,
                actual: Math.round(actual * 10) / 10,
                variance: Math.round((actual - theoretical) * 10) / 10,
                hasAnomaly: Math.abs(actual - theoretical) > 5
            })
        }
        return sampleData
    }, [data])

    // Find anomaly regions for highlighting
    const anomalyRegions = useMemo(() => {
        const regions = []
        let inAnomaly = false
        let startIdx = 0

        chartData.forEach((point, idx) => {
            if (point.hasAnomaly && !inAnomaly) {
                inAnomaly = true
                startIdx = idx
            } else if (!point.hasAnomaly && inAnomaly) {
                inAnomaly = false
                regions.push({
                    start: chartData[startIdx].time,
                    end: chartData[idx - 1].time
                })
            }
        })

        if (inAnomaly) {
            regions.push({
                start: chartData[startIdx].time,
                end: chartData[chartData.length - 1].time
            })
        }

        return regions
    }, [chartData])

    // Custom tooltip
    const CustomTooltip = ({ active, payload, label }) => {
        if (!active || !payload || !payload.length) return null

        const theoretical = payload.find(p => p.dataKey === 'theoretical')?.value || 0
        const actual = payload.find(p => p.dataKey === 'actual')?.value || 0
        const variance = actual - theoretical
        const variancePercent = theoretical > 0 ? ((variance / theoretical) * 100).toFixed(1) : 0
        const hasAnomaly = Math.abs(variancePercent) > 5

        return (
            <div className="bg-surface-100/95 backdrop-blur-sm border border-surface-300 rounded-xl p-4 shadow-xl">
                <p className="text-sm font-semibold text-surface-900 mb-2">{label}</p>

                <div className="space-y-2">
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-0.5 bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.6)]" />
                            <span className="text-xs text-surface-600">Theoretical</span>
                        </div>
                        <span className="text-sm font-mono text-surface-900">{theoretical} kW</span>
                    </div>

                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-0.5 bg-surface-200" />
                            <span className="text-xs text-surface-600">Actual</span>
                        </div>
                        <span className="text-sm font-mono text-surface-900">{actual} kW</span>
                    </div>

                    <div className="pt-2 border-t border-surface-300">
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-surface-600">Variance</span>
                            <span className={`text-sm font-mono font-bold ${hasAnomaly
                                    ? variance > 0 ? 'text-emerald-400' : 'text-rose-400'
                                    : 'text-surface-700'
                                }`}>
                                {variance > 0 ? '+' : ''}{variancePercent}%
                            </span>
                        </div>
                    </div>

                    {hasAnomaly && (
                        <div className="flex items-center gap-2 pt-1">
                            <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                            <span className="text-xs text-rose-400 font-medium">Anomaly Detected</span>
                        </div>
                    )}
                </div>
            </div>
        )
    }

    return (
        <div className={`relative w-full ${className}`}>
            {/* Legend */}
            <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-semibold text-surface-900">Theoretical vs Actual Yield</h4>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-0.5 bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.6)] rounded-full" />
                        <span className="text-xs text-surface-600">Digital Twin</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-0.5 bg-surface-200 rounded-full" />
                        <span className="text-xs text-surface-600">Actual</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded bg-rose-500/20 border border-rose-500/50" />
                        <span className="text-xs text-surface-600">Anomaly Zone</span>
                    </div>
                </div>
            </div>

            {/* Chart */}
            <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        data={chartData}
                        margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                    >
                        <defs>
                            {/* Theoretical line gradient (glowing effect) */}
                            <linearGradient id="theoreticalGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#22D3EE" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#22D3EE" stopOpacity={0} />
                            </linearGradient>

                            {/* Actual line gradient */}
                            <linearGradient id="actualGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#1E293B" stopOpacity={0.2} />
                                <stop offset="95%" stopColor="#1E293B" stopOpacity={0} />
                            </linearGradient>

                            {/* Glow filter for theoretical line */}
                            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                                <feMerge>
                                    <feMergeNode in="coloredBlur" />
                                    <feMergeNode in="SourceGraphic" />
                                </feMerge>
                            </filter>
                        </defs>

                        <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#334155"
                            vertical={false}
                        />

                        <XAxis
                            dataKey="time"
                            stroke="#64748B"
                            tick={{ fill: '#94A3B8', fontSize: 10 }}
                            tickLine={{ stroke: '#334155' }}
                            axisLine={{ stroke: '#334155' }}
                        />

                        <YAxis
                            stroke="#64748B"
                            tick={{ fill: '#94A3B8', fontSize: 10 }}
                            tickLine={{ stroke: '#334155' }}
                            axisLine={{ stroke: '#334155' }}
                            tickFormatter={(value) => `${value}`}
                            label={{
                                value: 'kW',
                                angle: -90,
                                position: 'insideLeft',
                                fill: '#94A3B8',
                                fontSize: 10
                            }}
                        />

                        <Tooltip content={<CustomTooltip />} />

                        {/* Anomaly Zone Highlights */}
                        {anomalyRegions.map((region, idx) => (
                            <ReferenceArea
                                key={idx}
                                x1={region.start}
                                x2={region.end}
                                fill="#F87171"
                                fillOpacity={0.1}
                                stroke="#F87171"
                                strokeOpacity={0.3}
                            />
                        ))}

                        {/* Current Time Indicator */}
                        {currentTime > 0 && currentTime < 24 && (
                            <ReferenceLine
                                x={`${currentTime.toString().padStart(2, '0')}:00`}
                                stroke="#22D3EE"
                                strokeWidth={2}
                                strokeDasharray="4 4"
                            />
                        )}

                        {/* Theoretical Area (Ghost Layer) */}
                        {showGhostLayer && (
                            <Area
                                type="monotone"
                                dataKey="theoretical"
                                stroke="#22D3EE"
                                strokeWidth={2}
                                fill="url(#theoreticalGradient)"
                                filter="url(#glow)"
                                dot={false}
                                activeDot={{ r: 4, fill: '#22D3EE', stroke: '#818CF8' }}
                            />
                        )}

                        {/* Actual Area */}
                        <Area
                            type="monotone"
                            dataKey="actual"
                            stroke="#1E293B"
                            strokeWidth={2}
                            fill="url(#actualGradient)"
                            dot={false}
                            activeDot={{ r: 4, fill: '#1E293B', stroke: '#94A3B8' }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}

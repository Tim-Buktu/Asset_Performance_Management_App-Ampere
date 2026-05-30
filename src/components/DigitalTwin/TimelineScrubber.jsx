import React, { useState, useRef, useCallback, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Play, Pause, SkipBack, SkipForward, Clock } from 'lucide-react'

/**
 * TimelineScrubber - Interactive timeline control for Digital Twin visualization
 * 
 * Features:
 * - Draggable scrubber handle
 * - Anomaly markers (red dots)
 * - Playback controls
 * - Time range selector
 */
export default function TimelineScrubber({
    currentTime = 12,
    duration = 24,
    anomalies = [],
    onTimeChange = () => { },
    onPlay = () => { },
    onPause = () => { },
    isPlaying = false,
    className = ''
}) {
    const trackRef = useRef(null)
    const [isDragging, setIsDragging] = useState(false)
    const [localTime, setLocalTime] = useState(currentTime)

    // Sync local time with prop
    useEffect(() => {
        if (!isDragging) {
            setLocalTime(currentTime)
        }
    }, [currentTime, isDragging])

    // Handle drag on timeline
    const handleDrag = useCallback((clientX) => {
        if (!trackRef.current) return

        const rect = trackRef.current.getBoundingClientRect()
        const x = clientX - rect.left
        const percentage = Math.max(0, Math.min(1, x / rect.width))
        const newTime = percentage * duration

        setLocalTime(newTime)
        onTimeChange(newTime)
    }, [duration, onTimeChange])

    const handleMouseDown = (e) => {
        setIsDragging(true)
        handleDrag(e.clientX)
    }

    const handleMouseMove = useCallback((e) => {
        if (isDragging) {
            handleDrag(e.clientX)
        }
    }, [isDragging, handleDrag])

    const handleMouseUp = useCallback(() => {
        setIsDragging(false)
    }, [])

    // Global mouse events for dragging
    useEffect(() => {
        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove)
            window.addEventListener('mouseup', handleMouseUp)
            return () => {
                window.removeEventListener('mousemove', handleMouseMove)
                window.removeEventListener('mouseup', handleMouseUp)
            }
        }
    }, [isDragging, handleMouseMove, handleMouseUp])

    // Format time to HH:MM
    const formatTime = (time) => {
        const hours = Math.floor(time)
        const minutes = Math.floor((time % 1) * 60)
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
    }

    // Progress percentage
    const progress = (localTime / duration) * 100

    // Default anomaly markers if none provided
    const anomalyMarkers = anomalies.length > 0 ? anomalies : [
        { time: 10.5, severity: 'warning' },
        { time: 11.2, severity: 'critical' },
        { time: 14.8, severity: 'warning' }
    ]

    return (
        <div className={`w-full ${className}`}>
            {/* Controls Row */}
            <div className="flex items-center gap-4 mb-4">
                {/* Playback Controls */}
                <div className="flex items-center gap-1">
                    <button
                        onClick={() => onTimeChange(Math.max(0, localTime - 1))}
                        className="p-2 rounded-lg bg-surface-200/50 hover:bg-surface-300 transition-colors"
                    >
                        <SkipBack className="w-4 h-4 text-surface-600" />
                    </button>

                    <button
                        onClick={isPlaying ? onPause : onPlay}
                        className="p-3 rounded-xl bg-sun-green-500/20 border border-sun-green-500/30 hover:bg-sun-green-500/30 transition-colors"
                    >
                        {isPlaying ? (
                            <Pause className="w-5 h-5 text-sun-green-300" />
                        ) : (
                            <Play className="w-5 h-5 text-sun-green-300 ml-0.5" />
                        )}
                    </button>

                    <button
                        onClick={() => onTimeChange(Math.min(duration, localTime + 1))}
                        className="p-2 rounded-lg bg-surface-200/50 hover:bg-surface-300 transition-colors"
                    >
                        <SkipForward className="w-4 h-4 text-surface-600" />
                    </button>
                </div>

                {/* Time Display */}
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-200/60 border border-surface-200/50">
                    <Clock className="w-4 h-4 text-surface-500" />
                    <span className="text-sm font-mono font-medium text-surface-900">
                        {formatTime(localTime)}
                    </span>
                    <span className="text-xs text-surface-500">/ {formatTime(duration)}</span>
                </div>

                {/* Time Range Selector */}
                <div className="flex items-center gap-1 ml-auto">
                    {['1H', '6H', '24H', '7D'].map((range) => (
                        <button
                            key={range}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${range === '24H'
                                    ? 'bg-sun-green-500/20 text-sun-green-300 border border-sun-green-500/30'
                                    : 'bg-surface-200/50 text-surface-600 hover:text-surface-900 hover:bg-surface-300'
                                }`}
                        >
                            {range}
                        </button>
                    ))}
                </div>
            </div>

            {/* Timeline Track */}
            <div className="relative">
                {/* Track Background */}
                <div
                    ref={trackRef}
                    className="relative h-12 bg-surface-200/60 rounded-xl border border-surface-200/50 cursor-pointer overflow-hidden"
                    onMouseDown={handleMouseDown}
                >
                    {/* Progress Fill */}
                    <motion.div
                        className="absolute top-0 left-0 h-full bg-gradient-to-r from-sun-green-100 to-sun-green-100"
                        style={{ width: `${progress}%` }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: isDragging ? 0 : 0.1 }}
                    />

                    {/* Hour Markers */}
                    <div className="absolute inset-0 flex items-end px-2 pb-1">
                        {Array.from({ length: Math.floor(duration) + 1 }).map((_, i) => (
                            <div
                                key={i}
                                className="flex-1 relative"
                                style={{
                                    borderLeft: i > 0 ? '1px solid rgba(63, 63, 70, 0.5)' : 'none'
                                }}
                            >
                                {i % 3 === 0 && (
                                    <span className="absolute bottom-0 left-0 text-[10px] text-surface-400 -translate-x-1/2">
                                        {i.toString().padStart(2, '0')}
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Anomaly Markers */}
                    {anomalyMarkers.map((anomaly, idx) => (
                        <motion.div
                            key={idx}
                            className="absolute top-1/2 -translate-y-1/2"
                            style={{ left: `${(anomaly.time / duration) * 100}%` }}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: idx * 0.1 }}
                        >
                            <div className="relative">
                                {/* Pulse Ring */}
                                <div
                                    className={`absolute -inset-2 rounded-full animate-ping ${anomaly.severity === 'critical' ? 'bg-rose-500/30' : 'bg-amber-500/30'
                                        }`}
                                    style={{ animationDuration: anomaly.severity === 'critical' ? '1s' : '2s' }}
                                />
                                {/* Dot */}
                                <div
                                    className={`w-3 h-3 rounded-full border-2 border-carbon-900 ${anomaly.severity === 'critical' ? 'bg-rose-500' : 'bg-amber-500'
                                        }`}
                                />
                            </div>
                        </motion.div>
                    ))}

                    {/* Scrubber Handle */}
                    <motion.div
                        className="absolute top-0 h-full"
                        style={{ left: `${progress}%` }}
                        animate={{ left: `${progress}%` }}
                        transition={{ duration: isDragging ? 0 : 0.1 }}
                    >
                        {/* Vertical Line */}
                        <div className="absolute top-0 bottom-0 w-0.5 bg-sun-green-500 -translate-x-1/2 shadow-[0_0_8px_rgba(245,158,11,0.5)]" />

                        {/* Handle Knob */}
                        <div
                            className={`absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-sun-green-500 border-2 border-white shadow-lg cursor-grab ${isDragging ? 'cursor-grabbing scale-110' : ''
                                }`}
                            style={{
                                boxShadow: '0 0 20px rgba(34, 211, 238, 0.5)'
                            }}
                        />
                    </motion.div>
                </div>

                {/* Anomaly Labels */}
                <div className="flex items-center gap-4 mt-3 text-xs">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-rose-500" />
                        <span className="text-surface-600">Critical Anomaly</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-amber-500" />
                        <span className="text-surface-600">Warning</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

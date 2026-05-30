import React, { useState, useRef } from 'react'
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from 'framer-motion'
import {
    CheckCircle,
    ChevronRight,
    ArrowRight,
    Sparkles,
    RefreshCw
} from 'lucide-react'

/**
 * SlideToComplete - Gesture-based job completion interface
 * 
 * Features:
 * - Slide gesture with haptic-like visual feedback
 * - Progress tracking as user slides
 * - Completion animation with confetti burst
 * - Dashboard sync confirmation
 */
export default function SlideToComplete({
    ticket,
    onComplete,
    className = ''
}) {
    const [isCompleted, setIsCompleted] = useState(false)
    const [isDashboardSynced, setIsDashboardSynced] = useState(false)
    const [dragProgress, setDragProgress] = useState(0)

    const trackRef = useRef(null)
    const x = useMotionValue(0)

    const trackWidth = 280
    const knobWidth = 64
    const maxDrag = trackWidth - knobWidth - 8

    const progressWidth = useTransform(x, [0, maxDrag], [0, 100])
    const backgroundColor = useTransform(
        x,
        [0, maxDrag * 0.5, maxDrag],
        ['rgba(15, 23, 42, 0.7)', 'rgba(34, 211, 238, 0.2)', 'rgba(99, 102, 241, 0.3)']
    )

    const handleDragEnd = (event, info) => {
        if (info.offset.x > maxDrag * 0.8) {
            // Complete the action
            animate(x, maxDrag, { type: 'spring', stiffness: 400, damping: 30 })
            handleComplete()
        } else {
            // Spring back
            animate(x, 0, { type: 'spring', stiffness: 400, damping: 30 })
            setDragProgress(0)
        }
    }

    const handleDrag = (event, info) => {
        const progress = Math.min(100, Math.max(0, (info.offset.x / maxDrag) * 100))
        setDragProgress(progress)
    }

    const handleComplete = async () => {
        setIsCompleted(true)

        // Simulate dashboard sync
        await new Promise(resolve => setTimeout(resolve, 1200))
        setIsDashboardSynced(true)

        // Notify parent after animation
        setTimeout(() => {
            onComplete?.(ticket)
        }, 800)
    }

    if (isCompleted) {
        return (
            <div className={`${className}`}>
                <AnimatePresence mode="wait">
                    {!isDashboardSynced ? (
                        <motion.div
                            key="syncing"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="text-center py-8"
                        >
                            {/* Syncing animation */}
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                className="w-16 h-16 mx-auto mb-4 rounded-full bg-sun-amber-500/20 flex items-center justify-center"
                            >
                                <RefreshCw className="w-8 h-8 text-sun-amber-500" />
                            </motion.div>
                            <p className="text-sm text-surface-600">Syncing to Dashboard...</p>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="completed"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center py-8"
                        >
                            {/* Confetti burst */}
                            <div className="relative inline-block mb-4">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: 'spring', stiffness: 300, delay: 0.1 }}
                                    className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center"
                                >
                                    <CheckCircle className="w-10 h-10 text-emerald-400" />
                                </motion.div>

                                {/* Sparkle particles */}
                                {[...Array(6)].map((_, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ scale: 0, x: 0, y: 0 }}
                                        animate={{
                                            scale: [0, 1, 0],
                                            x: Math.cos((i / 6) * Math.PI * 2) * 50,
                                            y: Math.sin((i / 6) * Math.PI * 2) * 50
                                        }}
                                        transition={{ duration: 0.6, delay: 0.2 + i * 0.05 }}
                                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                                    >
                                        <Sparkles className="w-4 h-4 text-sun-amber-400" />
                                    </motion.div>
                                ))}
                            </div>

                            <motion.h3
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="text-lg font-semibold text-surface-900 mb-2"
                            >
                                Job Completed!
                            </motion.h3>

                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4 }}
                                className="text-sm text-surface-600 mb-4"
                            >
                                Dashboard has been updated
                            </motion.p>

                            {/* Dashboard update card */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                className="inline-block p-4 rounded-xl bg-surface-200/50 border border-surface-300/50"
                            >
                                <div className="flex items-center gap-3 text-left">
                                    <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                                        <CheckCircle className="w-5 h-5 text-emerald-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-surface-900">{ticket?.id || 'TKT-ABC123'}</p>
                                        <p className="text-xs text-emerald-400">Status: Resolved</p>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        )
    }

    return (
        <div className={`${className}`}>
            {/* Job Summary */}
            <div className="mb-6 p-4 rounded-xl bg-surface-200/30 border border-surface-300/50">
                <h4 className="text-sm font-medium text-surface-900 mb-2">Ready to Complete</h4>
                <p className="text-xs text-surface-600 mb-3">
                    Confirm that all work has been completed for this service ticket.
                </p>
                <div className="flex items-center gap-2 text-xs text-surface-500">
                    <CheckCircle className="w-3 h-3 text-emerald-400" />
                    <span>Photo captured</span>
                    <CheckCircle className="w-3 h-3 text-emerald-400 ml-2" />
                    <span>Location verified</span>
                </div>
            </div>

            {/* Slide Track */}
            <div className="relative">
                <motion.div
                    ref={trackRef}
                    className="relative h-16 rounded-full overflow-hidden"
                    style={{
                        width: trackWidth,
                        backgroundColor,
                        border: '1px solid rgba(63, 63, 70, 0.5)'
                    }}
                >
                    {/* Progress fill */}
                    <motion.div
                        className="absolute inset-y-0 left-0 rounded-full"
                        style={{
                            width: progressWidth.get() + '%',
                            background: 'linear-gradient(90deg, rgba(99, 102, 241, 0.1), rgba(99, 102, 241, 0.3))'
                        }}
                    />

                    {/* Text hint */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <motion.div
                            className="flex items-center gap-2 text-surface-500"
                            animate={{ x: [0, 5, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                        >
                            <span className="text-sm font-medium">Slide to Complete</span>
                            <ArrowRight className="w-4 h-4" />
                        </motion.div>
                    </div>

                    {/* Draggable knob */}
                    <motion.div
                        drag="x"
                        dragConstraints={{ left: 0, right: maxDrag }}
                        dragElastic={0}
                        onDrag={handleDrag}
                        onDragEnd={handleDragEnd}
                        style={{ x }}
                        className="absolute top-1 left-1 w-14 h-14 rounded-full bg-surface-200 shadow-lg flex items-center justify-center cursor-grab active:cursor-grabbing z-10"
                        whileTap={{ scale: 0.95 }}
                    >
                        <motion.div
                            animate={{ x: [0, 3, 0] }}
                            transition={{ duration: 0.8, repeat: Infinity }}
                        >
                            <ChevronRight className="w-6 h-6 text-carbon-700" />
                        </motion.div>
                    </motion.div>
                </motion.div>

                {/* Progress indicator text */}
                <div className="mt-3 text-center">
                    <span className="text-xs text-surface-500">
                        {dragProgress > 80 ? 'Release to complete' : `${Math.round(dragProgress)}% - Keep sliding`}
                    </span>
                </div>
            </div>
        </div>
    )
}

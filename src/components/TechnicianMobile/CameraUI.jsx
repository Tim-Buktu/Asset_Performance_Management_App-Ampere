import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Camera,
    CheckCircle,
    MapPin,
    Clock,
    Crosshair,
    Maximize2,
    X,
    Zap,
    AlertTriangle
} from 'lucide-react'

/**
 * CameraUI - Proof of Service photo capture interface
 * 
 * Features:
 * - Simulated camera viewport with live preview
 * - AR overlay highlighting equipment needing repair
 * - Geofence verification badge
 * - Large touch-friendly capture button
 */
export default function CameraUI({
    ticket,
    onCapture,
    onClose,
    className = ''
}) {
    const [isGeofenceVerified, setIsGeofenceVerified] = useState(false)
    const [isCapturing, setIsCapturing] = useState(false)
    const [capturedPhoto, setCapturedPhoto] = useState(null)
    const [arTargetVisible, setArTargetVisible] = useState(true)

    // Simulate geofence verification
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsGeofenceVerified(true)
        }, 1500)
        return () => clearTimeout(timer)
    }, [])

    // AR bracket animation
    const [bracketOffset, setBracketOffset] = useState(0)
    useEffect(() => {
        const interval = setInterval(() => {
            setBracketOffset(prev => (prev + 1) % 2)
        }, 800)
        return () => clearInterval(interval)
    }, [])

    const handleCapture = async () => {
        if (!isGeofenceVerified) return

        setIsCapturing(true)

        // Simulate capture animation
        await new Promise(resolve => setTimeout(resolve, 300))

        const photoData = {
            timestamp: new Date(),
            location: ticket?.coordinates || { lat: -6.2088, lng: 106.8456 },
            verified: true
        }

        setCapturedPhoto(photoData)
        setIsCapturing(false)
        onCapture?.(photoData)
    }

    return (
        <div className={`relative w-full h-full bg-surface-300/25 ${className}`}>
            {/* Camera Viewport */}
            <div className="absolute inset-0 overflow-hidden">
                {/* Simulated camera feed (gradient background) */}
                <div className="absolute inset-0 bg-gradient-to-b from-carbon-900 via-carbon-800 to-carbon-900">
                    {/* Grid overlay for industrial feel */}
                    <div
                        className="absolute inset-0 opacity-20"
                        style={{
                            backgroundImage: `
                                linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px),
                                linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)
                            `,
                            backgroundSize: '40px 40px'
                        }}
                    />

                    {/* Simulated equipment image placeholder */}
                    <div className="absolute inset-8 flex items-center justify-center">
                        <div className="relative w-48 h-32 bg-surface-300/50 rounded-lg border border-surface-400">
                            {/* Inverter mockup */}
                            <div className="absolute inset-2 bg-surface-200 rounded flex items-center justify-center">
                                <Zap className="w-12 h-12 text-sun-amber-500/50" />
                            </div>
                            <div className="absolute bottom-1 left-1 right-1 h-3 bg-surface-300 rounded-sm flex items-center justify-center">
                                <div className="flex gap-1">
                                    {[...Array(5)].map((_, i) => (
                                        <div key={i} className="w-2 h-1.5 bg-emerald-500/60 rounded-sm" />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* AR Overlay - Targeting Brackets */}
                {arTargetVisible && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <motion.div
                            className="relative w-56 h-40"
                            animate={{ scale: [1, 1.02, 1] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                        >
                            {/* Corner brackets */}
                            {/* Top Left */}
                            <motion.div
                                className="absolute top-0 left-0 w-6 h-6 border-l-2 border-t-2 border-sun-amber-500"
                                animate={{ x: bracketOffset * -2, y: bracketOffset * -2 }}
                            />
                            {/* Top Right */}
                            <motion.div
                                className="absolute top-0 right-0 w-6 h-6 border-r-2 border-t-2 border-sun-amber-500"
                                animate={{ x: bracketOffset * 2, y: bracketOffset * -2 }}
                            />
                            {/* Bottom Left */}
                            <motion.div
                                className="absolute bottom-0 left-0 w-6 h-6 border-l-2 border-b-2 border-sun-amber-500"
                                animate={{ x: bracketOffset * -2, y: bracketOffset * 2 }}
                            />
                            {/* Bottom Right */}
                            <motion.div
                                className="absolute bottom-0 right-0 w-6 h-6 border-r-2 border-b-2 border-sun-amber-500"
                                animate={{ x: bracketOffset * 2, y: bracketOffset * 2 }}
                            />

                            {/* Center crosshair */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Crosshair className="w-8 h-8 text-sun-amber-500/60" />
                            </div>

                            {/* Equipment label */}
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="absolute -bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap"
                            >
                                <div className="px-3 py-1.5 rounded-full bg-sun-amber-500/20 border border-sun-amber-500/40">
                                    <div className="flex items-center gap-2">
                                        <AlertTriangle className="w-3 h-3 text-sun-amber-400" />
                                        <span className="text-xs font-medium text-sun-amber-400">
                                            {ticket?.assetName || 'Inverter INV-03'}
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>
                )}

                {/* Flash effect on capture */}
                <AnimatePresence>
                    {isCapturing && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-surface-200"
                        />
                    )}
                </AnimatePresence>
            </div>

            {/* Top Bar - Status & Close */}
            <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between z-10">
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="p-3 rounded-full bg-surface-200/60 backdrop-blur-sm border border-surface-300/50"
                >
                    <X className="w-5 h-5 text-surface-900" />
                </button>

                {/* Geofence Status */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`px-4 py-2 rounded-full backdrop-blur-sm border flex items-center gap-2 ${isGeofenceVerified
                            ? 'bg-emerald-500/20 border-emerald-500/40'
                            : 'bg-surface-200/80 border-surface-400/50'
                        }`}
                >
                    {isGeofenceVerified ? (
                        <>
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: 'spring', stiffness: 300 }}
                            >
                                <CheckCircle className="w-4 h-4 text-emerald-400" />
                            </motion.div>
                            <span className="text-xs font-medium text-emerald-400">
                                Geofence Verified
                            </span>
                        </>
                    ) : (
                        <>
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                            >
                                <MapPin className="w-4 h-4 text-surface-600" />
                            </motion.div>
                            <span className="text-xs text-surface-600">
                                Verifying location...
                            </span>
                        </>
                    )}
                </motion.div>

                {/* AR toggle */}
                <button
                    onClick={() => setArTargetVisible(!arTargetVisible)}
                    className={`p-3 rounded-full backdrop-blur-sm border ${arTargetVisible
                            ? 'bg-sun-amber-500/20 border-sun-amber-500/40'
                            : 'bg-surface-200/60 border-surface-300/50'
                        }`}
                >
                    <Maximize2 className={`w-5 h-5 ${arTargetVisible ? 'text-sun-amber-400' : 'text-surface-900'}`} />
                </button>
            </div>

            {/* Bottom Bar - Capture & Info */}
            <div className="absolute bottom-0 left-0 right-0 p-6 pb-10">
                {/* Location & Timestamp */}
                <div className="flex items-center justify-center gap-4 mb-6 text-xs text-surface-600">
                    <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        <span>{ticket?.location || 'Block A, Row 3'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{new Date().toLocaleTimeString()}</span>
                    </div>
                </div>

                {/* Capture Button */}
                <div className="flex items-center justify-center">
                    <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={handleCapture}
                        disabled={!isGeofenceVerified || isCapturing}
                        className={`
                            relative w-20 h-20 rounded-full
                            flex items-center justify-center
                            transition-all duration-300
                            ${isGeofenceVerified
                                ? 'bg-surface-200 shadow-[0_0_30px_rgba(255,255,255,0.3)]'
                                : 'bg-surface-300 cursor-not-allowed'
                            }
                        `}
                    >
                        {/* Outer ring */}
                        <div className={`
                            absolute inset-0 rounded-full border-4
                            ${isGeofenceVerified ? 'border-white/30' : 'border-surface-400'}
                        `} />

                        {/* Inner button */}
                        <motion.div
                            className={`
                                w-16 h-16 rounded-full
                                flex items-center justify-center
                                ${isGeofenceVerified ? 'bg-surface-200' : 'bg-carbon-600'}
                            `}
                            animate={isGeofenceVerified ? { scale: [1, 1.05, 1] } : {}}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            <Camera className={`w-8 h-8 ${isGeofenceVerified ? 'text-carbon-900' : 'text-surface-600'}`} />
                        </motion.div>

                        {/* Breathing ring animation */}
                        {isGeofenceVerified && (
                            <motion.div
                                className="absolute inset-0 rounded-full border-2 border-white/50"
                                animate={{ scale: [1, 1.2], opacity: [0.5, 0] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                            />
                        )}
                    </motion.button>
                </div>

                {/* Hint text */}
                <p className="text-center text-xs text-surface-500 mt-4">
                    {isGeofenceVerified
                        ? 'Tap to capture proof of service'
                        : 'Waiting for location verification...'}
                </p>
            </div>
        </div>
    )
}

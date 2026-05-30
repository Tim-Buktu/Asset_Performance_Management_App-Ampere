import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

/**
 * Color mappings for the collapsible sections - Light Mode
 * Using static classes since Tailwind JIT doesn't support dynamic class generation
 */
const colorVariants = {
    'sun-green': {
        border: 'border-sun-green-400/35',
        borderButton: 'border-sun-green-300 hover:border-sun-green-400',
        bg: 'bg-sun-green-50',
        text: 'text-sun-green-300'
    },
    'sun-green': {
        border: 'border-sun-green-400/35',
        borderButton: 'border-sun-green-300 hover:border-sun-green-400',
        bg: 'bg-sun-green-50',
        text: 'text-sun-green-300'
    },
    'emerald': {
        border: 'border-emerald-400/35',
        borderButton: 'border-emerald-300 hover:border-emerald-400',
        bg: 'bg-emerald-500/12',
        text: 'text-emerald-400'
    },
    'blue': {
        border: 'border-blue-400/35',
        borderButton: 'border-blue-300 hover:border-blue-400',
        bg: 'bg-blue-500/12',
        text: 'text-blue-300'
    },
    'purple': {
        border: 'border-purple-400/35',
        borderButton: 'border-purple-300 hover:border-purple-400',
        bg: 'bg-purple-500/12',
        text: 'text-purple-600'
    },
    'cyan': {
        border: 'border-cyan-200',
        borderButton: 'border-cyan-300 hover:border-cyan-400',
        bg: 'bg-cyan-50',
        text: 'text-cyan-600'
    }
}

/**
 * CollapsibleSection - A reusable collapsible section wrapper for Digital Twin (Light Mode)
 * 
 * @param {React.ElementType} icon - Lucide icon component
 * @param {string} title - Section title
 * @param {string} colorScheme - Color scheme key ('sun-green' | 'emerald' | 'blue' | 'purple' | 'cyan')
 * @param {boolean} defaultExpanded - Whether the section starts expanded
 * @param {React.ReactNode} children - Section content
 */
export default function CollapsibleSection({
    icon: Icon,
    title,
    colorScheme = 'sun-green',
    defaultExpanded = true,
    children,
    className = ''
}) {
    const [isExpanded, setIsExpanded] = useState(defaultExpanded)
    const colors = colorVariants[colorScheme] || colorVariants['sun-green']

    return (
        <div className={className}>
            {/* Section Header - Clickable divider */}
            <div className="relative mt-8 mb-6">
                <div className="absolute inset-0 flex items-center">
                    <div className={`w-full border-t ${colors.border}`} />
                </div>
                <div className="relative flex justify-center">
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className={`flex items-center gap-3 px-6 py-2 bg-surface-200 rounded-full border ${colors.borderButton}
                            hover:${colors.bg} transition-all cursor-pointer group shadow-sm`}
                    >
                        <Icon className={`w-5 h-5 ${colors.text}`} />
                        <span className={`text-sm font-semibold ${colors.text} uppercase tracking-wider`}>
                            {title}
                        </span>
                        <motion.div
                            animate={{ rotate: isExpanded ? 180 : 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <ChevronDown className={`w-4 h-4 ${colors.text} group-hover:scale-110 transition-transform`} />
                        </motion.div>
                    </button>
                </div>
            </div>

            {/* Collapsible Content */}
            <AnimatePresence initial={false}>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        style={{ overflow: 'hidden' }}
                    >
                        {children}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

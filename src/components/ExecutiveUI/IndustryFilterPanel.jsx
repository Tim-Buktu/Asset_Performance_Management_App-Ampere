import React from 'react'
import { motion } from 'framer-motion'
import { Factory, Building2, ShoppingBag, Truck, Fuel, Package, Check } from 'lucide-react'

/**
 * IndustryFilterPanel Component
 * 
 * Toggle-based filter panel for categorizing and filtering sites by industry.
 * Used for map filtering and industry peers pattern recognition.
 */

// Industry definitions with icons and colors
export const INDUSTRIES = {
    mining: {
        id: 'mining',
        label: 'Mining',
        icon: Factory,
        color: 'amber',
        bgColor: 'bg-amber-500/15',
        borderColor: 'border-amber-400/50',
        textColor: 'text-amber-300',
        activeColor: 'bg-amber-500',
    },
    manufacturing: {
        id: 'manufacturing',
        label: 'Manufacturing',
        icon: Building2,
        color: 'blue',
        bgColor: 'bg-blue-500/15',
        borderColor: 'border-blue-400/50',
        textColor: 'text-blue-300',
        activeColor: 'bg-blue-500',
    },
    retail: {
        id: 'retail',
        label: 'Retail',
        icon: ShoppingBag,
        color: 'purple',
        bgColor: 'bg-purple-500/15',
        borderColor: 'border-purple-400/50',
        textColor: 'text-purple-300',
        activeColor: 'bg-purple-500',
    },
    logistics: {
        id: 'logistics',
        label: 'Logistics',
        icon: Truck,
        color: 'emerald',
        bgColor: 'bg-emerald-500/15',
        borderColor: 'border-emerald-400/50',
        textColor: 'text-emerald-300',
        activeColor: 'bg-emerald-500',
    },
    energy: {
        id: 'energy',
        label: 'Energy',
        icon: Fuel,
        color: 'rose',
        bgColor: 'bg-rose-500/15',
        borderColor: 'border-rose-400/50',
        textColor: 'text-rose-300',
        activeColor: 'bg-rose-500',
    },
    industrial: {
        id: 'industrial',
        label: 'Industrial',
        icon: Package,
        color: 'slate',
        bgColor: 'bg-slate-500/15',
        borderColor: 'border-slate-400/50',
        textColor: 'text-slate-300',
        activeColor: 'bg-slate-500',
    },
}

// Toggle switch component
function IndustryToggle({ industry, isActive, onToggle }) {
    const config = INDUSTRIES[industry]
    const Icon = config.icon

    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onToggle(industry)}
            className={`
                relative flex items-center gap-2.5 px-3 py-2 rounded-lg border transition-all duration-200
                ${isActive
                    ? `${config.bgColor} ${config.borderColor} shadow-sm`
                    : 'bg-surface-300/30 border-surface-400/40 hover:border-surface-400/70 hover:bg-surface-300/50'
                }
            `}
        >
            {/* Icon */}
            <div className={`
                w-7 h-7 rounded-md flex items-center justify-center
                ${isActive ? config.activeColor : 'bg-surface-300/50'}
            `}>
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-surface-700'}`} />
            </div>

            {/* Label */}
            <span className={`text-xs font-medium ${isActive ? config.textColor : 'text-surface-800'}`}>
                {config.label}
            </span>

            {/* Active indicator */}
            {isActive && (
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className={`ml-auto w-4 h-4 rounded-full ${config.activeColor} flex items-center justify-center`}
                >
                    <Check className="w-2.5 h-2.5 text-white" />
                </motion.div>
            )}
        </motion.button>
    )
}

// Main filter panel component
export default function IndustryFilterPanel({
    selectedIndustries = [],
    onIndustryToggle,
    compact = false,
    className = ''
}) {
    const toggleIndustry = (industry) => {
        if (selectedIndustries.includes(industry)) {
            onIndustryToggle(selectedIndustries.filter(i => i !== industry))
        } else {
            onIndustryToggle([...selectedIndustries, industry])
        }
    }

    const selectAll = () => {
        onIndustryToggle(Object.keys(INDUSTRIES))
    }

    const clearAll = () => {
        onIndustryToggle([])
    }

    const allSelected = selectedIndustries.length === Object.keys(INDUSTRIES).length
    const noneSelected = selectedIndustries.length === 0

    return (
        <div className={`${className}`}>
            {/* Header */}
            {!compact && (
                <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-semibold text-surface-900">Filter by Industry</h4>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={selectAll}
                            disabled={allSelected}
                            className={`text-[10px] font-medium px-2 py-1 rounded transition-colors
                                ${allSelected
                                    ? 'text-surface-400 cursor-not-allowed'
                                    : 'text-sun-green-300 hover:bg-sun-green-50'
                                }`}
                        >
                            Select All
                        </button>
                        <span className="text-surface-300">|</span>
                        <button
                            onClick={clearAll}
                            disabled={noneSelected}
                            className={`text-[10px] font-medium px-2 py-1 rounded transition-colors
                                ${noneSelected
                                    ? 'text-surface-400 cursor-not-allowed'
                                    : 'text-rose-400 hover:bg-rose-500/15'
                                }`}
                        >
                            Clear
                        </button>
                    </div>
                </div>
            )}

            {/* Toggle Grid */}
            <div className={`grid gap-2 ${compact ? 'grid-cols-3' : 'grid-cols-2'}`}>
                {Object.keys(INDUSTRIES).map(industry => (
                    <IndustryToggle
                        key={industry}
                        industry={industry}
                        isActive={selectedIndustries.includes(industry)}
                        onToggle={toggleIndustry}
                    />
                ))}
            </div>

            {/* Selection summary */}
            {!compact && (
                <div className="mt-3 pt-3 border-t border-surface-200">
                    <p className="text-[10px] text-surface-500">
                        {selectedIndustries.length === 0
                            ? 'No industries selected — showing all sites'
                            : `${selectedIndustries.length} of ${Object.keys(INDUSTRIES).length} industries selected`
                        }
                    </p>
                </div>
            )}
        </div>
    )
}

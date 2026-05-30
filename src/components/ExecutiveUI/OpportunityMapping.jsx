import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Newspaper,
    Bell,
    TrendingUp,
    ChevronRight,
    ExternalLink,
    Clock,
    AlertTriangle,
    Zap,
    Factory,
    Building2,
    Truck,
    Sparkles,
    Target,
    ArrowUpRight
} from 'lucide-react'
import { INDUSTRIES } from './IndustryFilterPanel'

/**
 * OpportunityMapping Component
 * 
 * Displays industry-related news alerts and regulatory updates that signal
 * upsell opportunities. Mock news data with relevance to each industry.
 */

// Mock news data with industry relevance and opportunity signals
const MOCK_NEWS = [
    {
        id: 'news-1',
        headline: 'New Mandatory Energy Mix Regulation for Mining Sector',
        summary: 'Government mandates 30% renewable energy usage for all mining operations by 2027. Non-compliance penalties start at $500K.',
        industry: 'mining',
        date: '2026-01-25',
        source: 'Energy Ministry',
        urgency: 'high',
        opportunity: {
            type: 'upsell',
            potential: '$2.5M',
            products: ['Solar PV', 'BESS'],
            affectedSites: 2,
        },
    },
    {
        id: 'news-2',
        headline: 'EV Fleet Incentives Extended for Logistics Companies',
        summary: 'Tax rebates of 25% now available for logistics companies adopting electric vehicle fleets. Program extended through 2028.',
        industry: 'logistics',
        date: '2026-01-24',
        source: 'Transport Authority',
        urgency: 'medium',
        opportunity: {
            type: 'upsell',
            potential: '$1.8M',
            products: ['EV Fleet', 'EVSE Chargers'],
            affectedSites: 3,
        },
    },
    {
        id: 'news-3',
        headline: 'Manufacturing Carbon Tax Implementation Q3 2026',
        summary: 'Carbon emissions tax of $50/ton begins for manufacturing facilities. BESS installations can reduce liability by up to 40%.',
        industry: 'manufacturing',
        date: '2026-01-23',
        source: 'Environmental Agency',
        urgency: 'high',
        opportunity: {
            type: 'upsell',
            potential: '$3.2M',
            products: ['BESS', 'Solar PV'],
            affectedSites: 1,
        },
    },
    {
        id: 'news-4',
        headline: 'Retail Sustainability Certification Requirements',
        summary: 'Major retail chains now require suppliers to have green energy certification. Solar adoption accelerates store modernization.',
        industry: 'retail',
        date: '2026-01-22',
        source: 'Retail Federation',
        urgency: 'medium',
        opportunity: {
            type: 'upsell',
            potential: '$950K',
            products: ['Solar PV'],
            affectedSites: 1,
        },
    },
    {
        id: 'news-5',
        headline: 'Grid Stability Incentives for Industrial BESS',
        summary: 'New grid services program pays industrial facilities $150/MWh for peak shaving. Immediate ROI for BESS installations.',
        industry: 'industrial',
        date: '2026-01-21',
        source: 'National Grid Services',
        urgency: 'medium',
        opportunity: {
            type: 'upsell',
            potential: '$1.4M',
            products: ['BESS'],
            affectedSites: 2,
        },
    },
    {
        id: 'news-6',
        headline: 'Energy Sector Modernization Fund Announced',
        summary: 'Government launches $500M fund for energy sector digital transformation. Priority given to smart grid integrations.',
        industry: 'energy',
        date: '2026-01-20',
        source: 'Ministry of Energy',
        urgency: 'low',
        opportunity: {
            type: 'expansion',
            potential: '$4.1M',
            products: ['Smart Grid', 'BESS'],
            affectedSites: 1,
        },
    },
]

// Urgency indicator
function UrgencyBadge({ level }) {
    const config = {
        high: { color: 'rose', label: 'Urgent', icon: AlertTriangle },
        medium: { color: 'amber', label: 'Important', icon: Bell },
        low: { color: 'blue', label: 'Info', icon: Sparkles },
    }[level] || { color: 'surface', label: 'Info', icon: Bell }

    const Icon = config.icon

    return (
        <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full bg-${config.color}-50 border border-${config.color}-200`}>
            <Icon className={`w-2.5 h-2.5 text-${config.color}-500`} />
            <span className={`text-[9px] font-semibold text-${config.color}-700`}>{config.label}</span>
        </div>
    )
}

// News card component
function NewsCard({ news, isExpanded, onToggle }) {
    const industryConfig = INDUSTRIES[news.industry]
    const IndustryIcon = industryConfig?.icon || Factory

    // Format date
    const formattedDate = new Date(news.date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
    })

    return (
        <motion.div
            layout
            className={`
                relative overflow-hidden rounded-xl border transition-all duration-200
                ${isExpanded
                    ? 'bg-gradient-to-br from-surface-200 to-surface-100 border-surface-300 shadow-md'
                    : 'bg-surface-200 border-surface-200 hover:border-surface-300 hover:shadow-sm'
                }
            `}
        >
            {/* Main content */}
            <div
                className="p-4 cursor-pointer"
                onClick={onToggle}
            >
                {/* Header row */}
                <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-lg ${industryConfig?.bgColor || 'bg-surface-100'} flex items-center justify-center`}>
                            <IndustryIcon className={`w-4 h-4 ${industryConfig?.textColor || 'text-surface-600'}`} />
                        </div>
                        <div>
                            <span className={`text-[10px] font-medium ${industryConfig?.textColor || 'text-surface-600'}`}>
                                {industryConfig?.label || 'Industry'}
                            </span>
                            <div className="flex items-center gap-2 text-[9px] text-surface-400">
                                <Clock className="w-2.5 h-2.5" />
                                <span>{formattedDate}</span>
                                <span>•</span>
                                <span>{news.source}</span>
                            </div>
                        </div>
                    </div>
                    <UrgencyBadge level={news.urgency} />
                </div>

                {/* Headline */}
                <h4 className="text-sm font-semibold text-surface-900 mb-1 leading-tight">
                    {news.headline}
                </h4>

                {/* Summary (truncated when collapsed) */}
                <p className={`text-xs text-surface-600 leading-relaxed ${!isExpanded && 'line-clamp-2'}`}>
                    {news.summary}
                </p>

                {/* Expand indicator */}
                <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-sun-green-500/12 border border-sun-green-400/30">
                            <Target className="w-3 h-3 text-sun-green-300" />
                            <span className="text-[10px] font-semibold text-sun-green-300">
                                {news.opportunity.potential} Potential
                            </span>
                        </div>
                    </div>
                    <motion.div
                        animate={{ rotate: isExpanded ? 90 : 0 }}
                        className="w-5 h-5 rounded-full bg-surface-100 flex items-center justify-center"
                    >
                        <ChevronRight className="w-3 h-3 text-surface-500" />
                    </motion.div>
                </div>
            </div>

            {/* Expanded content */}
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-surface-200 overflow-hidden"
                    >
                        <div className="p-4 bg-surface-300/25">
                            {/* Opportunity details */}
                            <div className="flex items-center gap-2 mb-3">
                                <Zap className="w-4 h-4 text-amber-500" />
                                <span className="text-xs font-semibold text-surface-700">Opportunity Details</span>
                            </div>

                            <div className="grid grid-cols-3 gap-3 mb-4">
                                <div className="p-2 rounded-lg bg-surface-300/50 border border-surface-400/50">
                                    <p className="text-[10px] text-surface-500 mb-0.5">Revenue Potential</p>
                                    <p className="text-sm font-bold text-sun-green-300">{news.opportunity.potential}</p>
                                </div>
                                <div className="p-2 rounded-lg bg-surface-300/50 border border-surface-400/50">
                                    <p className="text-[10px] text-surface-500 mb-0.5">Products</p>
                                    <p className="text-xs font-semibold text-surface-900">
                                        {news.opportunity.products.join(', ')}
                                    </p>
                                </div>
                                <div className="p-2 rounded-lg bg-surface-300/50 border border-surface-400/50">
                                    <p className="text-[10px] text-surface-500 mb-0.5">Affected Sites</p>
                                    <p className="text-sm font-bold text-blue-300">{news.opportunity.affectedSites}</p>
                                </div>
                            </div>

                            {/* Action buttons */}
                            <div className="flex items-center gap-2">
                                <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-sun-green-500 hover:bg-sun-green-400 text-white text-xs font-semibold transition-all shadow-glow-green hover:shadow-glow-green-lg">
                                    <TrendingUp className="w-3.5 h-3.5" />
                                    Create Proposal
                                </button>
                                <button className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-surface-400/60 bg-surface-300/30 hover:bg-surface-300/60 text-surface-800 text-xs font-medium transition-colors">
                                    <ExternalLink className="w-3.5 h-3.5" />
                                    Read More
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    )
}

// Main component
export default function OpportunityMapping({
    selectedIndustries = [],
    className = ''
}) {
    const [expandedNews, setExpandedNews] = useState(null)

    // Filter news by selected industries
    const filteredNews = selectedIndustries.length === 0
        ? MOCK_NEWS
        : MOCK_NEWS.filter(news => selectedIndustries.includes(news.industry))

    // Sort by urgency and date
    const sortedNews = [...filteredNews].sort((a, b) => {
        const urgencyOrder = { high: 0, medium: 1, low: 2 }
        if (urgencyOrder[a.urgency] !== urgencyOrder[b.urgency]) {
            return urgencyOrder[a.urgency] - urgencyOrder[b.urgency]
        }
        return new Date(b.date) - new Date(a.date)
    })

    // Calculate total opportunity
    const totalOpportunity = sortedNews.reduce((acc, news) => {
        const value = parseFloat(news.opportunity.potential.replace(/[$M,]/g, ''))
        return acc + value
    }, 0)

    return (
        <div className={`${className}`}>
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <div className="w-1 h-5 rounded-full bg-amber-500" />
                    <h3 className="text-sm font-semibold text-surface-900">Opportunity Mapping</h3>
                    <div className="relative">
                        <Bell className="w-4 h-4 text-amber-500" />
                        {sortedNews.filter(n => n.urgency === 'high').length > 0 && (
                            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-rose-500 border border-white" />
                        )}
                    </div>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/12 border border-emerald-400/30">
                    <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-xs font-bold text-emerald-300">${totalOpportunity.toFixed(1)}M</span>
                    <span className="text-[10px] text-emerald-400">pipeline</span>
                </div>
            </div>

            {/* News list */}
            <div className="space-y-3">
                {sortedNews.map(news => (
                    <NewsCard
                        key={news.id}
                        news={news}
                        isExpanded={expandedNews === news.id}
                        onToggle={() => setExpandedNews(expandedNews === news.id ? null : news.id)}
                    />
                ))}
            </div>

            {/* Empty state */}
            {sortedNews.length === 0 && (
                <div className="text-center py-8 bg-surface-300/25 rounded-xl border border-surface-200">
                    <div className="w-12 h-12 rounded-xl bg-surface-100 flex items-center justify-center mx-auto mb-3">
                        <Newspaper className="w-6 h-6 text-surface-400" />
                    </div>
                    <p className="text-sm text-surface-600 mb-1">No news for selected industries</p>
                    <p className="text-xs text-surface-500">Try selecting different industries to see opportunities</p>
                </div>
            )}
        </div>
    )
}

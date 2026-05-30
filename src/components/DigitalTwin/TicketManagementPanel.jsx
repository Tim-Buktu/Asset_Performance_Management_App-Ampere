import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import NewTicketModal from './NewTicketModal'
import {
    Ticket,
    Search,
    Filter,
    ChevronDown,
    ChevronUp,
    Clock,
    User,
    Calendar,
    MapPin,
    Wrench,
    AlertTriangle,
    CheckCircle2,
    XCircle,
    Timer,
    Users,
    ClipboardList,
    ArrowUpDown,
    X,
    Plus,
    RefreshCw,
    FileText,
    Phone,
    Mail,
    Building,
    Zap
} from 'lucide-react'

// ═══════════════════════════════════════════════════════════════════════════════
// DUMMY TICKET DATA
// ═══════════════════════════════════════════════════════════════════════════════

const DUMMY_TICKETS = [
    {
        id: 'TKT-2026-001',
        createdAt: new Date('2026-01-20T08:30:00'),
        scheduledDate: new Date('2026-01-20T10:00:00'),
        scheduledEndDate: new Date('2026-01-20T12:00:00'),
        resolvedAt: null,
        status: 'in_progress',
        priority: 'critical',
        assetName: 'Inverter INV-A01',
        assetType: 'Inverter',
        location: 'Site Alpha - Block A',
        issueType: 'Performance Deviation',
        description: 'Inverter output reduced by 15% compared to expected generation. Possible module connectivity issue.',
        assignedVendor: {
            id: 'v1',
            name: 'SolarTech Solutions',
            phone: '+62 21 5555 0001',
            logo: '☀️'
        },
        assignedMechanic: {
            id: 'm1',
            name: 'Budi Santoso',
            phone: '+62 812 3456 7890',
            expertise: 'Inverter Specialist'
        },
        slaDeadline: new Date('2026-01-20T09:30:00'),
        slaMinutes: 60,
        variance: '-15.2%',
        probableCause: 'Module Connectivity',
        notes: 'Customer reported intermittent power drops since yesterday.'
    },
    {
        id: 'TKT-2026-002',
        createdAt: new Date('2026-01-20T07:15:00'),
        scheduledDate: new Date('2026-01-20T09:00:00'),
        scheduledEndDate: new Date('2026-01-20T11:00:00'),
        resolvedAt: new Date('2026-01-20T10:45:00'),
        status: 'completed',
        priority: 'warning',
        assetName: 'Panel Array B-12',
        assetType: 'Solar Panel',
        location: 'Site Alpha - Block B',
        issueType: 'Panel Soiling',
        description: 'Detected dust accumulation causing 8% efficiency drop. Scheduled cleaning required.',
        assignedVendor: {
            id: 'v2',
            name: 'GreenGrid Maintenance',
            phone: '+62 22 5555 0002',
            logo: '🔧'
        },
        assignedMechanic: {
            id: 'm2',
            name: 'Ahmad Wijaya',
            phone: '+62 813 9876 5432',
            expertise: 'Panel Maintenance'
        },
        slaDeadline: new Date('2026-01-20T09:15:00'),
        slaMinutes: 120,
        variance: '-8.3%',
        probableCause: 'Dust Accumulation',
        notes: 'Cleaning completed. Performance restored to 98.5%.',
        resolution: 'Panels cleaned with deionized water. Efficiency restored.'
    },
    {
        id: 'TKT-2026-003',
        createdAt: new Date('2026-01-20T06:00:00'),
        scheduledDate: new Date('2026-01-21T08:00:00'),
        scheduledEndDate: new Date('2026-01-21T12:00:00'),
        resolvedAt: null,
        status: 'pending',
        priority: 'normal',
        assetName: 'BESS Unit 01',
        assetType: 'Battery Storage',
        location: 'Site Alpha - Energy Center',
        issueType: 'Scheduled Maintenance',
        description: 'Quarterly battery health check and calibration. No anomalies detected.',
        assignedVendor: {
            id: 'v3',
            name: 'PowerFix Indonesia',
            phone: '+62 31 5555 0003',
            logo: '⚡'
        },
        assignedMechanic: {
            id: 'm3',
            name: 'Dewi Purnama',
            phone: '+62 815 1122 3344',
            expertise: 'Battery Systems'
        },
        slaDeadline: new Date('2026-01-21T10:00:00'),
        slaMinutes: 240,
        variance: 'N/A',
        probableCause: 'Preventive Maintenance',
        notes: 'Scheduled as part of Q1 2026 maintenance plan.'
    },
    {
        id: 'TKT-2026-004',
        createdAt: new Date('2026-01-19T14:30:00'),
        scheduledDate: new Date('2026-01-19T16:00:00'),
        scheduledEndDate: new Date('2026-01-19T18:00:00'),
        resolvedAt: new Date('2026-01-19T17:30:00'),
        status: 'completed',
        priority: 'critical',
        assetName: 'Transformer T-01',
        assetType: 'Transformer',
        location: 'Site Alpha - Main Grid',
        issueType: 'Overheating Alert',
        description: 'Transformer temperature exceeded threshold by 12°C. Emergency cooling required.',
        assignedVendor: {
            id: 'v1',
            name: 'SolarTech Solutions',
            phone: '+62 21 5555 0001',
            logo: '☀️'
        },
        assignedMechanic: {
            id: 'm4',
            name: 'Eko Prasetyo',
            phone: '+62 816 5566 7788',
            expertise: 'Electrical Systems'
        },
        slaDeadline: new Date('2026-01-19T15:30:00'),
        slaMinutes: 60,
        variance: '+12°C',
        probableCause: 'Cooling System Failure',
        notes: 'Resolved by replacing faulty cooling fan motor.',
        resolution: 'Cooling fan motor replaced. Temperature normalized within 30 minutes.'
    },
    {
        id: 'TKT-2026-005',
        createdAt: new Date('2026-01-20T05:45:00'),
        scheduledDate: new Date('2026-01-20T08:00:00'),
        scheduledEndDate: new Date('2026-01-20T10:00:00'),
        resolvedAt: null,
        status: 'in_progress',
        priority: 'warning',
        assetName: 'EV Charger CS-03',
        assetType: 'EVSE Charger',
        location: 'Site Alpha - Parking Area C',
        issueType: 'Connectivity Issue',
        description: 'Charger showing offline status. Unable to initiate charging sessions.',
        assignedVendor: {
            id: 'v2',
            name: 'GreenGrid Maintenance',
            phone: '+62 22 5555 0002',
            logo: '🔧'
        },
        assignedMechanic: {
            id: 'm5',
            name: 'Rini Susanti',
            phone: '+62 817 9988 7766',
            expertise: 'EVSE Technician'
        },
        slaDeadline: new Date('2026-01-20T07:45:00'),
        slaMinutes: 120,
        variance: 'Offline',
        probableCause: 'Network Module Failure',
        notes: 'Technician on-site. Diagnosing network module.'
    },
    {
        id: 'TKT-2026-006',
        createdAt: new Date('2026-01-18T11:00:00'),
        scheduledDate: new Date('2026-01-18T13:00:00'),
        scheduledEndDate: new Date('2026-01-18T15:00:00'),
        resolvedAt: new Date('2026-01-18T14:20:00'),
        status: 'completed',
        priority: 'normal',
        assetName: 'Weather Station WS-01',
        assetType: 'Monitoring Equipment',
        location: 'Site Alpha - Rooftop',
        issueType: 'Sensor Calibration',
        description: 'Annual calibration of irradiance and temperature sensors.',
        assignedVendor: {
            id: 'v3',
            name: 'PowerFix Indonesia',
            phone: '+62 31 5555 0003',
            logo: '⚡'
        },
        assignedMechanic: {
            id: 'm6',
            name: 'Hendra Gunawan',
            phone: '+62 818 2233 4455',
            expertise: 'Instrumentation'
        },
        slaDeadline: new Date('2026-01-18T15:00:00'),
        slaMinutes: 240,
        variance: 'N/A',
        probableCause: 'Scheduled Calibration',
        notes: 'All sensors calibrated and certified.',
        resolution: 'Sensors calibrated to ±0.5% accuracy. Certificate issued.'
    },
    {
        id: 'TKT-2026-007',
        createdAt: new Date('2026-01-20T09:00:00'),
        scheduledDate: null,
        scheduledEndDate: null,
        resolvedAt: null,
        status: 'pending',
        priority: 'critical',
        assetName: 'String Combiner SC-05',
        assetType: 'Electrical',
        location: 'Site Alpha - Block C',
        issueType: 'Overcurrent Alert',
        description: 'String combiner detected overcurrent condition. Requires immediate inspection.',
        assignedVendor: null,
        assignedMechanic: null,
        slaDeadline: new Date('2026-01-20T10:00:00'),
        slaMinutes: 60,
        variance: '+25A',
        probableCause: 'Possible Short Circuit',
        notes: 'Awaiting vendor assignment. High priority.'
    },
    {
        id: 'TKT-2026-008',
        createdAt: new Date('2026-01-17T09:30:00'),
        scheduledDate: new Date('2026-01-17T11:00:00'),
        scheduledEndDate: new Date('2026-01-17T14:00:00'),
        resolvedAt: new Date('2026-01-17T13:15:00'),
        status: 'completed',
        priority: 'warning',
        assetName: 'EV Fleet - Vehicle V-07',
        assetType: 'Electric Vehicle',
        location: 'Site Alpha - Fleet Garage',
        issueType: 'Battery Health Check',
        description: 'Vehicle battery showing degraded performance. Diagnostic check required.',
        assignedVendor: {
            id: 'v1',
            name: 'SolarTech Solutions',
            phone: '+62 21 5555 0001',
            logo: '☀️'
        },
        assignedMechanic: {
            id: 'm7',
            name: 'Irfan Hakim',
            phone: '+62 819 6677 8899',
            expertise: 'EV Battery Specialist'
        },
        slaDeadline: new Date('2026-01-17T11:30:00'),
        slaMinutes: 120,
        variance: '-12% Capacity',
        probableCause: 'Cell Degradation',
        notes: 'Battery conditioning performed. Capacity improved to 94%.',
        resolution: 'Battery conditioning cycle completed. Cell balance restored.'
    }
]

// ═══════════════════════════════════════════════════════════════════════════════
// HELPER COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════

// Status Badge Component
function StatusBadge({ status }) {
    const config = {
        pending: {
            bg: 'bg-amber-500/15',
            border: 'border-amber-400/40',
            text: 'text-amber-300',
            icon: Clock,
            label: 'Pending'
        },
        in_progress: {
            bg: 'bg-blue-500/15',
            border: 'border-blue-400/40',
            text: 'text-blue-300',
            icon: RefreshCw,
            label: 'In Progress'
        },
        completed: {
            bg: 'bg-emerald-500/15',
            border: 'border-emerald-400/40',
            text: 'text-emerald-300',
            icon: CheckCircle2,
            label: 'Completed'
        },
        sla_breach: {
            bg: 'bg-rose-500/15',
            border: 'border-rose-400/40',
            text: 'text-rose-300',
            icon: XCircle,
            label: 'SLA Breach'
        }
    }

    const cfg = config[status] || config.pending
    const Icon = cfg.icon

    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${cfg.bg} ${cfg.border} ${cfg.text} border`}>
            <Icon className="w-3.5 h-3.5" />
            {cfg.label}
        </span>
    )
}

// Priority Badge Component
function PriorityBadge({ priority }) {
    const config = {
        critical: {
            bg: 'bg-rose-500/15',
            text: 'text-rose-300',
            dot: 'bg-rose-500',
            label: 'Critical'
        },
        warning: {
            bg: 'bg-amber-500/15',
            text: 'text-amber-300',
            dot: 'bg-amber-500',
            label: 'Warning'
        },
        normal: {
            bg: 'bg-slate-100',
            text: 'text-slate-300',
            dot: 'bg-slate-500',
            label: 'Normal'
        }
    }

    const cfg = config[priority] || config.normal

    return (
        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium ${cfg.bg} ${cfg.text}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
            {cfg.label}
        </span>
    )
}

// SLA Timer Component
function SLATimer({ deadline, status }) {
    if (status === 'completed') {
        return <span className="text-sm text-emerald-400 font-medium">Resolved</span>
    }

    const now = new Date()
    const remaining = deadline - now
    const minutes = Math.floor(remaining / 1000 / 60)
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60

    const isBreached = remaining < 0
    const isAtRisk = !isBreached && minutes < 30

    if (isBreached) {
        const breachedMinutes = Math.abs(minutes)
        const breachedHours = Math.floor(breachedMinutes / 60)
        const breachedMins = breachedMinutes % 60
        return (
            <span className="text-sm text-rose-400 font-medium">
                -{breachedHours > 0 ? `${breachedHours}h ` : ''}{breachedMins}m (Breached)
            </span>
        )
    }

    return (
        <span className={`text-sm font-medium ${isAtRisk ? 'text-amber-300' : 'text-surface-700'}`}>
            {hours > 0 ? `${hours}h ` : ''}{mins}m
            {isAtRisk && ' ⚠️'}
        </span>
    )
}

// Stats Card Component
function StatsCard({ icon: Icon, label, value, color = 'gray', subtitle }) {
    const colorClasses = {
        gray: 'bg-surface-100 text-surface-600',
        green: 'bg-emerald-500/12 text-emerald-400',
        amber: 'bg-amber-500/12 text-amber-300',
        rose: 'bg-rose-500/12 text-rose-400',
        blue: 'bg-blue-500/12 text-blue-300'
    }

    return (
        <div className="bg-surface-200 rounded-xl border border-surface-200 p-4 shadow-sm">
            <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-lg ${colorClasses[color]}`}>
                    <Icon className="w-5 h-5" />
                </div>
                <div>
                    <p className="text-2xl font-bold text-surface-900">{value}</p>
                    <p className="text-xs text-surface-500">{label}</p>
                    {subtitle && <p className="text-xs text-surface-400 mt-0.5">{subtitle}</p>}
                </div>
            </div>
        </div>
    )
}

// ═══════════════════════════════════════════════════════════════════════════════
// TICKET DETAIL PANEL
// ═══════════════════════════════════════════════════════════════════════════════

function TicketDetailPanel({ ticket, onClose }) {
    if (!ticket) return null

    const formatDate = (date) => {
        if (!date) return '-'
        return new Date(date).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        })
    }

    const formatTime = (date) => {
        if (!date) return '-'
        return new Date(date).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        })
    }

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="bg-surface-200 rounded-xl border border-surface-200 shadow-lg overflow-hidden"
        >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-surface-200 bg-gradient-to-r from-surface-300 to-surface-200">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-sun-green-500/15">
                        <ClipboardList className="w-5 h-5 text-sun-green-300" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-surface-900">{ticket.id}</h3>
                        <p className="text-xs text-surface-500">Task Planning & Details</p>
                    </div>
                </div>
                <button
                    onClick={onClose}
                    className="p-2 rounded-lg hover:bg-surface-300/50 transition-colors"
                >
                    <X className="w-5 h-5 text-surface-500" />
                </button>
            </div>

            {/* Content */}
            <div className="p-4 space-y-5 max-h-[600px] overflow-y-auto">
                {/* Status & Priority */}
                <div className="flex items-center gap-3">
                    <StatusBadge status={ticket.status} />
                    <PriorityBadge priority={ticket.priority} />
                </div>

                {/* Summary */}
                <div>
                    <label className="text-xs font-medium text-surface-500 uppercase tracking-wide">Summary</label>
                    <p className="mt-1 text-sm text-surface-800 font-medium">{ticket.issueType}</p>
                    <p className="mt-1 text-sm text-surface-600">{ticket.description}</p>
                </div>

                {/* Asset Info */}
                <div className="p-3 rounded-xl bg-surface-300/25 border border-surface-200">
                    <div className="flex items-center gap-2 mb-2">
                        <Zap className="w-4 h-4 text-sun-green-500" />
                        <label className="text-xs font-medium text-surface-500 uppercase tracking-wide">Equipment</label>
                    </div>
                    <p className="text-sm font-semibold text-surface-900">{ticket.assetName}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-surface-600">
                        <span className="flex items-center gap-1">
                            <Building className="w-3.5 h-3.5" />
                            {ticket.assetType}
                        </span>
                        <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5" />
                            {ticket.location}
                        </span>
                    </div>
                </div>

                {/* Schedule */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-xl bg-surface-300/25 border border-surface-200">
                        <div className="flex items-center gap-2 mb-2">
                            <Calendar className="w-4 h-4 text-blue-500" />
                            <label className="text-xs font-medium text-surface-500">Scheduled Start</label>
                        </div>
                        <p className="text-sm font-semibold text-surface-900">{formatDate(ticket.scheduledDate)}</p>
                        <p className="text-xs text-surface-500">{formatTime(ticket.scheduledDate)}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-surface-300/25 border border-surface-200">
                        <div className="flex items-center gap-2 mb-2">
                            <Calendar className="w-4 h-4 text-purple-500" />
                            <label className="text-xs font-medium text-surface-500">Scheduled End</label>
                        </div>
                        <p className="text-sm font-semibold text-surface-900">{formatDate(ticket.scheduledEndDate)}</p>
                        <p className="text-xs text-surface-500">{formatTime(ticket.scheduledEndDate)}</p>
                    </div>
                </div>

                {/* Resolved Date */}
                {ticket.resolvedAt && (
                    <div className="p-3 rounded-xl bg-emerald-500/12 border border-emerald-400/30">
                        <div className="flex items-center gap-2 mb-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                            <label className="text-xs font-medium text-emerald-300">Date Resolved</label>
                        </div>
                        <p className="text-sm font-semibold text-emerald-800">{formatDate(ticket.resolvedAt)} at {formatTime(ticket.resolvedAt)}</p>
                    </div>
                )}

                {/* Personnel */}
                <div className="space-y-3">
                    <label className="text-xs font-medium text-surface-500 uppercase tracking-wide flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        Personnel
                    </label>

                    {/* Assigned Vendor */}
                    {ticket.assignedVendor ? (
                        <div className="p-3 rounded-xl bg-surface-300/25 border border-surface-200">
                            <div className="flex items-center gap-3">
                                <span className="text-2xl">{ticket.assignedVendor.logo}</span>
                                <div className="flex-1">
                                    <p className="text-sm font-semibold text-surface-900">{ticket.assignedVendor.name}</p>
                                    <p className="text-xs text-surface-500">Vendor / O&M Partner</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 mt-2 text-xs text-surface-600">
                                <Phone className="w-3.5 h-3.5" />
                                {ticket.assignedVendor.phone}
                            </div>
                        </div>
                    ) : (
                        <div className="p-3 rounded-xl bg-amber-500/12 border border-amber-400/35 text-center">
                            <p className="text-sm text-amber-300">No vendor assigned yet</p>
                        </div>
                    )}

                    {/* Assigned Mechanic */}
                    {ticket.assignedMechanic ? (
                        <div className="p-3 rounded-xl bg-surface-300/25 border border-surface-200">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-sun-green-500/15 flex items-center justify-center">
                                    <User className="w-5 h-5 text-sun-green-300" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-semibold text-surface-900">{ticket.assignedMechanic.name}</p>
                                    <p className="text-xs text-surface-500">{ticket.assignedMechanic.expertise}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 mt-2 text-xs text-surface-600">
                                <Phone className="w-3.5 h-3.5" />
                                {ticket.assignedMechanic.phone}
                            </div>
                        </div>
                    ) : (
                        <div className="p-3 rounded-xl bg-amber-500/12 border border-amber-400/35 text-center">
                            <p className="text-sm text-amber-300">No mechanic assigned yet</p>
                        </div>
                    )}
                </div>

                {/* Task Description / Notes */}
                <div>
                    <label className="text-xs font-medium text-surface-500 uppercase tracking-wide flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        Task Notes
                    </label>
                    <p className="mt-2 text-sm text-surface-700 p-3 rounded-xl bg-surface-300/25 border border-surface-200">
                        {ticket.notes || 'No notes available.'}
                    </p>
                </div>

                {/* Resolution (if completed) */}
                {ticket.resolution && (
                    <div>
                        <label className="text-xs font-medium text-emerald-400 uppercase tracking-wide flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4" />
                            Resolution
                        </label>
                        <p className="mt-2 text-sm text-surface-700 p-3 rounded-xl bg-emerald-500/12 border border-emerald-400/30">
                            {ticket.resolution}
                        </p>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                    {ticket.status !== 'completed' && (
                        <>
                            <button className="flex-1 px-4 py-2.5 rounded-xl bg-sun-green-500 text-white text-sm font-medium hover:bg-sun-green-600 transition-colors">
                                Update Status
                            </button>
                            <button className="px-4 py-2.5 rounded-xl border border-surface-200 text-surface-700 text-sm font-medium hover:bg-surface-300/25 transition-colors">
                                Assign
                            </button>
                        </>
                    )}
                    {ticket.status === 'completed' && (
                        <button className="flex-1 px-4 py-2.5 rounded-xl bg-surface-100 text-surface-700 text-sm font-medium hover:bg-surface-200 transition-colors">
                            View Full Report
                        </button>
                    )}
                </div>
            </div>
        </motion.div>
    )
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export default function TicketManagementPanel({ className = '' }) {
    const [tickets, setTickets] = useState(DUMMY_TICKETS)
    const [selectedTicket, setSelectedTicket] = useState(null)
    const [searchQuery, setSearchQuery] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')
    const [sortBy, setSortBy] = useState('createdAt')
    const [sortOrder, setSortOrder] = useState('desc')
    const [showNewTicketModal, setShowNewTicketModal] = useState(false)

    // Handle new ticket creation
    const handleCreateTicket = (ticketData) => {
        const newTicket = {
            id: ticketData.id,
            createdAt: ticketData.createdAt,
            scheduledDate: ticketData.scheduledDate ? new Date(ticketData.scheduledDate + 'T' + (ticketData.scheduledTime || '09:00') + ':00') : null,
            scheduledEndDate: ticketData.scheduledDate ? new Date(new Date(ticketData.scheduledDate + 'T' + (ticketData.scheduledTime || '09:00') + ':00').getTime() + (parseFloat(ticketData.estimatedDuration) || 2) * 60 * 60 * 1000) : null,
            resolvedAt: null,
            status: 'pending',
            priority: ticketData.priority,
            assetName: ticketData.title,
            assetType: ticketData.assetCategory,
            location: ticketData.siteId + (ticketData.subLocation ? ' - ' + ticketData.subLocation : ''),
            issueType: ticketData.issueType || ticketData.workOrderType,
            description: ticketData.description,
            assignedVendor: ticketData.vendorId ? { id: ticketData.vendorId, name: 'Assigned Vendor', phone: '', logo: '🔧' } : null,
            assignedMechanic: ticketData.technicianId ? { id: ticketData.technicianId, name: 'Assigned Technician', phone: '', expertise: '' } : null,
            slaDeadline: ticketData.slaDeadline,
            slaMinutes: 240,
            variance: 'N/A',
            probableCause: ticketData.issueType || 'To be determined',
            notes: ticketData.safetyNotes || '',
            isRecurring: ticketData.isRecurring,
            recurringPattern: ticketData.recurringPattern
        }
        setTickets(prev => [newTicket, ...prev])
        setShowNewTicketModal(false)
    }

    // Compute stats
    const stats = useMemo(() => {
        const total = tickets.length
        const critical = tickets.filter(t => t.priority === 'critical' && t.status !== 'completed').length
        const inProgress = tickets.filter(t => t.status === 'in_progress').length
        const pending = tickets.filter(t => t.status === 'pending').length
        const completed = tickets.filter(t => t.status === 'completed').length
        const slaBreach = tickets.filter(t => {
            if (t.status === 'completed') return false
            return new Date() > t.slaDeadline
        }).length

        return { total, critical, inProgress, pending, completed, slaBreach }
    }, [tickets])

    // Filter and sort tickets
    const filteredTickets = useMemo(() => {
        let result = [...tickets]

        // Search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase()
            result = result.filter(t =>
                t.id.toLowerCase().includes(query) ||
                t.assetName.toLowerCase().includes(query) ||
                t.issueType.toLowerCase().includes(query) ||
                t.location.toLowerCase().includes(query)
            )
        }

        // Status filter
        if (statusFilter !== 'all') {
            result = result.filter(t => t.status === statusFilter)
        }

        // Sort
        result.sort((a, b) => {
            let aVal = a[sortBy]
            let bVal = b[sortBy]

            if (sortBy === 'createdAt' || sortBy === 'scheduledDate') {
                aVal = new Date(aVal || 0).getTime()
                bVal = new Date(bVal || 0).getTime()
            }

            if (sortOrder === 'asc') {
                return aVal > bVal ? 1 : -1
            }
            return aVal < bVal ? 1 : -1
        })

        return result
    }, [tickets, searchQuery, statusFilter, sortBy, sortOrder])

    const formatDateTime = (date) => {
        if (!date) return '-'
        return new Date(date).toLocaleString('en-GB', {
            day: '2-digit',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const toggleSort = (field) => {
        if (sortBy === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
        } else {
            setSortBy(field)
            setSortOrder('desc')
        }
    }

    return (
        <div className={`space-y-6 ${className}`}>
            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <StatsCard icon={Ticket} label="Total Tickets" value={stats.total} color="gray" />
                <StatsCard icon={AlertTriangle} label="Critical" value={stats.critical} color="rose" />
                <StatsCard icon={RefreshCw} label="In Progress" value={stats.inProgress} color="blue" />
                <StatsCard icon={Clock} label="Pending" value={stats.pending} color="amber" />
                <StatsCard icon={CheckCircle2} label="Completed" value={stats.completed} color="green" />
                <StatsCard icon={XCircle} label="SLA Breach" value={stats.slaBreach} color="rose" subtitle="Needs attention" />
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Ticket List */}
                <div className="xl:col-span-2 bg-surface-200 rounded-xl border border-surface-200 shadow-sm overflow-hidden">
                    {/* Toolbar */}
                    <div className="p-4 border-b border-surface-200 flex flex-wrap items-center gap-4">
                        {/* Search */}
                        <div className="relative flex-1 min-w-[200px]">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-surface-400" />
                            <input
                                type="text"
                                placeholder="Search tickets..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 rounded-lg border border-surface-200 text-sm focus:outline-none focus:ring-2 focus:ring-sun-green-500/30 focus:border-sun-green-500"
                            />
                        </div>

                        {/* Status Filter */}
                        <div className="flex items-center gap-2">
                            <Filter className="w-4 h-4 text-surface-500" />
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="px-3 py-2 rounded-lg border border-surface-200 text-sm bg-surface-200 focus:outline-none focus:ring-2 focus:ring-sun-green-500/30"
                            >
                                <option value="all">All Status</option>
                                <option value="pending">Pending</option>
                                <option value="in_progress">In Progress</option>
                                <option value="completed">Completed</option>
                            </select>
                        </div>

                        {/* Create Ticket Button */}
                        <button
                            onClick={() => setShowNewTicketModal(true)}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-sun-green-500 text-white text-sm font-medium hover:bg-sun-green-600 transition-colors"
                        >
                            <Plus className="w-4 h-4" />
                            New Ticket
                        </button>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-surface-300/25 border-b border-surface-200">
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-surface-500 uppercase tracking-wide">
                                        <button onClick={() => toggleSort('id')} className="flex items-center gap-1 hover:text-surface-700">
                                            Ticket ID
                                            <ArrowUpDown className="w-3 h-3" />
                                        </button>
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-surface-500 uppercase tracking-wide">
                                        <button onClick={() => toggleSort('createdAt')} className="flex items-center gap-1 hover:text-surface-700">
                                            Created
                                            <ArrowUpDown className="w-3 h-3" />
                                        </button>
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-surface-500 uppercase tracking-wide">
                                        Asset
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-surface-500 uppercase tracking-wide">
                                        Status
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-surface-500 uppercase tracking-wide">
                                        Priority
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-surface-500 uppercase tracking-wide">
                                        Mechanic
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-surface-500 uppercase tracking-wide">
                                        <button onClick={() => toggleSort('scheduledDate')} className="flex items-center gap-1 hover:text-surface-700">
                                            Schedule
                                            <ArrowUpDown className="w-3 h-3" />
                                        </button>
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-surface-500 uppercase tracking-wide">
                                        SLA
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-surface-100">
                                {filteredTickets.map((ticket) => (
                                    <tr
                                        key={ticket.id}
                                        onClick={() => setSelectedTicket(ticket)}
                                        className={`cursor-pointer transition-colors ${selectedTicket?.id === ticket.id
                                            ? 'bg-sun-green-50'
                                            : 'hover:bg-surface-300/25'
                                            }`}
                                    >
                                        <td className="px-4 py-3">
                                            <span className="text-sm font-mono font-medium text-surface-900">{ticket.id}</span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="text-sm text-surface-600">{formatDateTime(ticket.createdAt)}</span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div>
                                                <p className="text-sm font-medium text-surface-900 truncate max-w-[150px]">{ticket.assetName}</p>
                                                <p className="text-xs text-surface-500 truncate max-w-[150px]">{ticket.location}</p>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <StatusBadge status={ticket.status} />
                                        </td>
                                        <td className="px-4 py-3">
                                            <PriorityBadge priority={ticket.priority} />
                                        </td>
                                        <td className="px-4 py-3">
                                            {ticket.assignedMechanic ? (
                                                <div className="flex items-center gap-2">
                                                    <div className="w-6 h-6 rounded-full bg-sun-green-500/15 flex items-center justify-center">
                                                        <User className="w-3 h-3 text-sun-green-300" />
                                                    </div>
                                                    <span className="text-sm text-surface-700 truncate max-w-[100px]">
                                                        {ticket.assignedMechanic.name}
                                                    </span>
                                                </div>
                                            ) : (
                                                <span className="text-sm text-surface-400 italic">Unassigned</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="text-sm text-surface-600">
                                                {ticket.scheduledDate ? formatDateTime(ticket.scheduledDate) : '-'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <SLATimer deadline={ticket.slaDeadline} status={ticket.status} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {filteredTickets.length === 0 && (
                            <div className="text-center py-12 text-surface-500">
                                <Ticket className="w-12 h-12 mx-auto mb-3 text-surface-300" />
                                <p className="text-sm">No tickets found matching your criteria.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Detail Panel */}
                <div className="xl:col-span-1">
                    <AnimatePresence mode="wait">
                        {selectedTicket ? (
                            <TicketDetailPanel
                                key={selectedTicket.id}
                                ticket={selectedTicket}
                                onClose={() => setSelectedTicket(null)}
                            />
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="bg-surface-200 rounded-xl border border-surface-200 shadow-sm p-8 text-center"
                            >
                                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-surface-100 flex items-center justify-center">
                                    <ClipboardList className="w-8 h-8 text-surface-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-surface-700 mb-2">Select a Ticket</h3>
                                <p className="text-sm text-surface-500">
                                    Click on a ticket from the list to view its details, schedule, and assigned personnel.
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* New Ticket Modal */}
            <NewTicketModal
                isOpen={showNewTicketModal}
                onClose={() => setShowNewTicketModal(false)}
                onSubmit={handleCreateTicket}
            />
        </div>
    )
}

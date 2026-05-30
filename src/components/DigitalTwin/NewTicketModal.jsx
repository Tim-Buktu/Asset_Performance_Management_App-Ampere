import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    X,
    Ticket,
    Calendar,
    Clock,
    MapPin,
    User,
    Users,
    Wrench,
    AlertTriangle,
    FileText,
    Paperclip,
    ChevronDown,
    ChevronRight,
    Plus,
    Repeat,
    Zap,
    Battery,
    Car,
    Plug,
    Sun,
    Gauge,
    Shield,
    Timer,
    Package,
    CheckCircle2,
    Info
} from 'lucide-react'

// ═══════════════════════════════════════════════════════════════════════════════
// CONFIGURATION DATA
// ═══════════════════════════════════════════════════════════════════════════════

// Work Order Types
const WORK_ORDER_TYPES = [
    { id: 'corrective', label: 'Corrective', description: 'Fix identified issues or failures', color: 'rose', icon: Wrench },
    { id: 'preventive', label: 'Preventive', description: 'Scheduled routine maintenance', color: 'blue', icon: Shield },
    { id: 'emergency', label: 'Emergency', description: 'Urgent critical repairs', color: 'amber', icon: AlertTriangle },
    { id: 'inspection', label: 'Inspection', description: 'Regular health checks', color: 'emerald', icon: Gauge },
    { id: 'calibration', label: 'Calibration', description: 'Sensor/equipment calibration', color: 'purple', icon: Timer }
]

// Asset Categories
const ASSET_CATEGORIES = [
    {
        id: 'solar',
        label: 'Solar PV',
        icon: Sun,
        color: 'sun-green',
        assets: [
            { id: 'inv-a01', name: 'Inverter INV-A01', type: 'Inverter' },
            { id: 'inv-a02', name: 'Inverter INV-A02', type: 'Inverter' },
            { id: 'inv-b01', name: 'Inverter INV-B01', type: 'Inverter' },
            { id: 'str-a1', name: 'String Array A1', type: 'Panel String' },
            { id: 'str-a2', name: 'String Array A2', type: 'Panel String' },
            { id: 'str-b1', name: 'String Array B1', type: 'Panel String' },
            { id: 'sc-01', name: 'String Combiner SC-01', type: 'Combiner Box' },
            { id: 'sc-02', name: 'String Combiner SC-02', type: 'Combiner Box' },
            { id: 'trk-01', name: 'Solar Tracker TRK-01', type: 'Tracker System' },
            { id: 'ws-01', name: 'Weather Station WS-01', type: 'Monitoring' }
        ]
    },
    {
        id: 'bess',
        label: 'Battery Storage',
        icon: Battery,
        color: 'emerald',
        assets: [
            { id: 'bess-01', name: 'BESS Unit 01', type: 'Battery System' },
            { id: 'bess-02', name: 'BESS Unit 02', type: 'Battery System' },
            { id: 'bms-01', name: 'BMS Controller 01', type: 'Battery Management' },
            { id: 'hvac-bess', name: 'BESS HVAC System', type: 'Cooling' }
        ]
    },
    {
        id: 'ev',
        label: 'EV Fleet',
        icon: Car,
        color: 'blue',
        assets: [
            { id: 'ev-001', name: 'EV-001 (BYD e6)', type: 'Electric Vehicle' },
            { id: 'ev-002', name: 'EV-002 (BYD e6)', type: 'Electric Vehicle' },
            { id: 'ev-003', name: 'EV-003 (Wuling Air)', type: 'Electric Vehicle' },
            { id: 'ev-004', name: 'EV-004 (Hyundai Ioniq 5)', type: 'Electric Vehicle' },
            { id: 'ev-005', name: 'EV-005 (BYD e6)', type: 'Electric Vehicle' }
        ]
    },
    {
        id: 'evse',
        label: 'EVSE Chargers',
        icon: Plug,
        color: 'purple',
        assets: [
            { id: 'evse-001', name: 'Charger Station 1', type: 'EVSE' },
            { id: 'evse-002', name: 'Charger Station 2', type: 'EVSE' },
            { id: 'evse-003', name: 'Charger Station 3', type: 'EVSE' },
            { id: 'evse-004', name: 'Charger Station 4', type: 'EVSE' },
            { id: 'evse-005', name: 'Charger Station 5', type: 'EVSE' }
        ]
    },
    {
        id: 'grid',
        label: 'Grid Infrastructure',
        icon: Zap,
        color: 'cyan',
        assets: [
            { id: 'tf-01', name: 'Transformer T-01', type: 'Transformer' },
            { id: 'tf-02', name: 'Transformer T-02', type: 'Transformer' },
            { id: 'meter-01', name: 'Smart Meter M-01', type: 'Metering' },
            { id: 'pcc-01', name: 'Point of Common Coupling', type: 'Grid Connection' }
        ]
    }
]

// Locations
const LOCATIONS = [
    { id: 'site-alpha', name: 'Site Alpha', subLocations: ['Block A', 'Block B', 'Block C', 'Energy Center', 'Parking Area', 'Fleet Garage'] },
    { id: 'site-beta', name: 'Site Beta', subLocations: ['Building 1', 'Building 2', 'Rooftop', 'Basement'] },
    { id: 'site-gamma', name: 'Site Gamma', subLocations: ['Main Plant', 'Warehouse', 'Admin Building'] }
]

// Priority Levels
const PRIORITY_LEVELS = [
    { id: 'critical', label: 'Critical', description: 'Immediate attention required', color: 'rose', slaMinutes: 60 },
    { id: 'high', label: 'High', description: 'Resolve within 4 hours', color: 'amber', slaMinutes: 240 },
    { id: 'medium', label: 'Medium', description: 'Resolve within 24 hours', color: 'blue', slaMinutes: 1440 },
    { id: 'low', label: 'Low', description: 'Resolve within 1 week', color: 'slate', slaMinutes: 10080 }
]

// O&M Vendors
const VENDORS = [
    { id: 'v1', name: 'SolarTech Solutions', logo: '☀️', specialties: ['Solar', 'Inverters'] },
    { id: 'v2', name: 'GreenGrid Maintenance', logo: '🔧', specialties: ['EVSE', 'Grid'] },
    { id: 'v3', name: 'PowerFix Indonesia', logo: '⚡', specialties: ['BESS', 'Electrical'] },
    { id: 'v4', name: 'EV Fleet Services', logo: '🚗', specialties: ['EV', 'Fleet'] }
]

// Technicians/Mechanics
const TECHNICIANS = [
    { id: 'm1', name: 'Budi Santoso', expertise: 'Inverter Specialist', vendorId: 'v1' },
    { id: 'm2', name: 'Ahmad Wijaya', expertise: 'Panel Maintenance', vendorId: 'v1' },
    { id: 'm3', name: 'Dewi Purnama', expertise: 'Battery Systems', vendorId: 'v3' },
    { id: 'm4', name: 'Eko Prasetyo', expertise: 'Electrical Systems', vendorId: 'v3' },
    { id: 'm5', name: 'Rini Susanti', expertise: 'EVSE Technician', vendorId: 'v2' },
    { id: 'm6', name: 'Hendra Gunawan', expertise: 'Instrumentation', vendorId: 'v2' },
    { id: 'm7', name: 'Irfan Hakim', expertise: 'EV Battery Specialist', vendorId: 'v4' }
]

// Issue Types
const ISSUE_TYPES = [
    'Performance Deviation',
    'Equipment Failure',
    'Connectivity Issue',
    'Overheating',
    'Physical Damage',
    'Calibration Required',
    'Firmware Update',
    'Scheduled Maintenance',
    'Safety Inspection',
    'Cleaning Required',
    'Other'
]

// Recurring Patterns
const RECURRING_PATTERNS = [
    { id: 'none', label: 'No Repeat (One-time)', icon: null },
    { id: 'daily', label: 'Daily', description: 'Every day' },
    { id: 'weekly', label: 'Weekly', description: 'Once per week' },
    { id: 'biweekly', label: 'Bi-weekly', description: 'Every 2 weeks' },
    { id: 'monthly', label: 'Monthly', description: 'Once per month' },
    { id: 'quarterly', label: 'Quarterly', description: 'Every 3 months' },
    { id: 'semiannual', label: 'Semi-Annual', description: 'Every 6 months' },
    { id: 'annual', label: 'Annual', description: 'Once per year' }
]

// Common Tools/Materials
const COMMON_TOOLS = [
    'Multimeter',
    'Thermal Camera',
    'Insulation Tester',
    'Torque Wrench',
    'Safety Harness',
    'Cleaning Equipment',
    'Replacement Fuses',
    'Cable Connectors',
    'Lubricant',
    'PPE Kit',
    'Diagnostic Laptop',
    'Communication Radio'
]

// ═══════════════════════════════════════════════════════════════════════════════
// HELPER COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════

// Section Header Component
function SectionHeader({ icon: Icon, title, description, expanded, onToggle, required }) {
    return (
        <button
            type="button"
            onClick={onToggle}
            className="w-full flex items-center justify-between p-3 rounded-xl bg-surface-300/25 hover:bg-surface-300/50 transition-colors"
        >
            <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-surface-300/50 border border-surface-400/50 shadow-sm">
                    <Icon className="w-4 h-4 text-sun-green-300" />
                </div>
                <div className="text-left">
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-surface-900">{title}</span>
                        {required && <span className="text-xs text-rose-500">*Required</span>}
                    </div>
                    {description && <p className="text-xs text-surface-500">{description}</p>}
                </div>
            </div>
            {expanded ? (
                <ChevronDown className="w-5 h-5 text-surface-400" />
            ) : (
                <ChevronRight className="w-5 h-5 text-surface-400" />
            )}
        </button>
    )
}

// Form Field Component
function FormField({ label, required, children, hint }) {
    return (
        <div className="space-y-1.5">
            <label className="flex items-center gap-1 text-sm font-medium text-surface-700">
                {label}
                {required && <span className="text-rose-500">*</span>}
            </label>
            {children}
            {hint && <p className="text-xs text-surface-500">{hint}</p>}
        </div>
    )
}

// Selection Card Component
function SelectionCard({ selected, onClick, icon: Icon, label, description, color = 'gray' }) {
    const colorClasses = {
        gray: 'border-surface-200 hover:border-surface-300',
        rose: selected ? 'border-rose-500 bg-rose-500/12' : 'border-surface-200 hover:border-rose-300',
        blue: selected ? 'border-blue-500 bg-blue-500/12' : 'border-surface-200 hover:border-blue-300',
        amber: selected ? 'border-amber-500 bg-amber-500/12' : 'border-surface-200 hover:border-amber-300',
        emerald: selected ? 'border-emerald-500 bg-emerald-500/12' : 'border-surface-200 hover:border-emerald-300',
        purple: selected ? 'border-purple-500 bg-purple-500/12' : 'border-surface-200 hover:border-purple-300',
        cyan: selected ? 'border-cyan-500 bg-cyan-50' : 'border-surface-200 hover:border-cyan-300',
        'sun-green': selected ? 'border-sun-green-500 bg-sun-green-50' : 'border-surface-200 hover:border-sun-green-300',
        slate: selected ? 'border-slate-500 bg-slate-500/12' : 'border-surface-200 hover:border-slate-300'
    }

    return (
        <button
            type="button"
            onClick={onClick}
            className={`relative p-3 rounded-xl border-2 transition-all text-left ${colorClasses[color] || colorClasses.gray}`}
        >
            {selected && (
                <div className="absolute top-2 right-2">
                    <CheckCircle2 className={`w-4 h-4 text-${color}-500`} />
                </div>
            )}
            <div className="flex items-start gap-3">
                {Icon && (
                    <div className={`p-2 rounded-lg ${selected ? `bg-${color}-100` : 'bg-surface-100'}`}>
                        <Icon className={`w-4 h-4 ${selected ? `text-${color}-600` : 'text-surface-500'}`} />
                    </div>
                )}
                <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${selected ? 'text-surface-900' : 'text-surface-700'}`}>{label}</p>
                    {description && <p className="text-xs text-surface-500 mt-0.5">{description}</p>}
                </div>
            </div>
        </button>
    )
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN MODAL COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export default function NewTicketModal({ isOpen, onClose, onSubmit }) {
    // Form State
    const [formData, setFormData] = useState({
        // Basic Info
        workOrderType: '',
        title: '',
        description: '',
        issueType: '',

        // Asset & Location
        assetCategory: '',
        assetId: '',
        siteId: '',
        subLocation: '',

        // Priority
        priority: 'medium',

        // Assignment
        vendorId: '',
        technicianId: '',

        // Schedule
        scheduledDate: '',
        scheduledTime: '',
        estimatedDuration: '2',

        // Recurring
        isRecurring: false,
        recurringPattern: 'none',
        recurringEndDate: '',

        // Additional Details
        estimatedHours: '2',
        requiredTools: [],
        safetyNotes: '',
        attachments: [],

        // Requester
        requesterName: 'System Admin',
        requesterEmail: 'admin@novaenergy.id'
    })

    // Expanded Sections State
    const [expandedSections, setExpandedSections] = useState({
        workOrderType: true,
        assetLocation: true,
        priority: true,
        assignment: false,
        schedule: true,
        recurring: false,
        additional: false
    })

    // Toggle section
    const toggleSection = (section) => {
        setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }))
    }

    // Update form field
    const updateField = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    // Get available assets based on category
    const availableAssets = useMemo(() => {
        const category = ASSET_CATEGORIES.find(c => c.id === formData.assetCategory)
        return category?.assets || []
    }, [formData.assetCategory])

    // Get available sub-locations
    const availableSubLocations = useMemo(() => {
        const site = LOCATIONS.find(l => l.id === formData.siteId)
        return site?.subLocations || []
    }, [formData.siteId])

    // Get available technicians based on vendor
    const availableTechnicians = useMemo(() => {
        if (!formData.vendorId) return TECHNICIANS
        return TECHNICIANS.filter(t => t.vendorId === formData.vendorId)
    }, [formData.vendorId])

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault()

        // Generate ticket ID
        const ticketId = `TKT-${Date.now().toString(36).toUpperCase()}`

        // Build ticket object
        const ticket = {
            id: ticketId,
            ...formData,
            createdAt: new Date(),
            status: 'pending',
            slaDeadline: new Date(Date.now() + (PRIORITY_LEVELS.find(p => p.id === formData.priority)?.slaMinutes || 240) * 60 * 1000)
        }

        if (onSubmit) {
            onSubmit(ticket)
        }

        onClose()
    }

    // Validation
    const isValid = useMemo(() => {
        return (
            formData.workOrderType &&
            formData.title &&
            formData.assetCategory &&
            formData.assetId &&
            formData.siteId &&
            formData.priority
        )
    }, [formData])

    if (!isOpen) return null

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-surface-200 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-surface-200 bg-gradient-to-r from-surface-300 to-surface-200">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 rounded-xl bg-sun-green-500/15">
                                <Ticket className="w-6 h-6 text-sun-green-300" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-surface-900">Create New Ticket</h2>
                                <p className="text-sm text-surface-500">Generate a work order for maintenance tasks</p>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={onClose}
                            className="p-2 rounded-lg hover:bg-surface-300/50 transition-colors"
                        >
                            <X className="w-5 h-5 text-surface-500" />
                        </button>
                    </div>

                    {/* Form Content */}
                    <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">

                        {/* ─────────────────────────────────────────────────────────────── */}
                        {/* WORK ORDER TYPE SECTION */}
                        {/* ─────────────────────────────────────────────────────────────── */}
                        <div className="space-y-3">
                            <SectionHeader
                                icon={Wrench}
                                title="Work Order Type"
                                description="Select the type of maintenance work"
                                expanded={expandedSections.workOrderType}
                                onToggle={() => toggleSection('workOrderType')}
                                required
                            />
                            {expandedSections.workOrderType && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 pl-4"
                                >
                                    {WORK_ORDER_TYPES.map((type) => (
                                        <SelectionCard
                                            key={type.id}
                                            selected={formData.workOrderType === type.id}
                                            onClick={() => updateField('workOrderType', type.id)}
                                            icon={type.icon}
                                            label={type.label}
                                            description={type.description}
                                            color={type.color}
                                        />
                                    ))}
                                </motion.div>
                            )}
                        </div>

                        {/* ─────────────────────────────────────────────────────────────── */}
                        {/* ASSET & LOCATION SECTION */}
                        {/* ─────────────────────────────────────────────────────────────── */}
                        <div className="space-y-3">
                            <SectionHeader
                                icon={MapPin}
                                title="Asset & Location"
                                description="Select the asset and its location"
                                expanded={expandedSections.assetLocation}
                                onToggle={() => toggleSection('assetLocation')}
                                required
                            />
                            {expandedSections.assetLocation && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className="space-y-4 pl-4"
                                >
                                    {/* Asset Category */}
                                    <FormField label="Asset Category" required>
                                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
                                            {ASSET_CATEGORIES.map((cat) => (
                                                <SelectionCard
                                                    key={cat.id}
                                                    selected={formData.assetCategory === cat.id}
                                                    onClick={() => {
                                                        updateField('assetCategory', cat.id)
                                                        updateField('assetId', '')
                                                    }}
                                                    icon={cat.icon}
                                                    label={cat.label}
                                                    color={cat.color}
                                                />
                                            ))}
                                        </div>
                                    </FormField>

                                    {/* Asset Selection */}
                                    {formData.assetCategory && (
                                        <FormField label="Select Asset" required>
                                            <select
                                                value={formData.assetId}
                                                onChange={(e) => updateField('assetId', e.target.value)}
                                                className="w-full px-4 py-2.5 rounded-xl border border-surface-200 bg-surface-200 text-surface-900 text-sm focus:outline-none focus:ring-2 focus:ring-sun-green-500/30 focus:border-sun-green-500"
                                            >
                                                <option value="">Choose an asset...</option>
                                                {availableAssets.map((asset) => (
                                                    <option key={asset.id} value={asset.id}>
                                                        {asset.name} ({asset.type})
                                                    </option>
                                                ))}
                                            </select>
                                        </FormField>
                                    )}

                                    {/* Title */}
                                    <FormField label="Ticket Title" required hint="Brief summary of the issue or task">
                                        <input
                                            type="text"
                                            value={formData.title}
                                            onChange={(e) => updateField('title', e.target.value)}
                                            placeholder="e.g., Inverter performance check, Panel cleaning..."
                                            className="w-full px-4 py-2.5 rounded-xl border border-surface-200 bg-surface-200 text-surface-900 text-sm focus:outline-none focus:ring-2 focus:ring-sun-green-500/30 focus:border-sun-green-500 placeholder:text-surface-400"
                                        />
                                    </FormField>

                                    {/* Issue Type & Description */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <FormField label="Issue Type">
                                            <select
                                                value={formData.issueType}
                                                onChange={(e) => updateField('issueType', e.target.value)}
                                                className="w-full px-4 py-2.5 rounded-xl border border-surface-200 bg-surface-200 text-surface-900 text-sm focus:outline-none focus:ring-2 focus:ring-sun-green-500/30 focus:border-sun-green-500"
                                            >
                                                <option value="">Select issue type...</option>
                                                {ISSUE_TYPES.map((type) => (
                                                    <option key={type} value={type}>{type}</option>
                                                ))}
                                            </select>
                                        </FormField>

                                        <FormField label="Site">
                                            <select
                                                value={formData.siteId}
                                                onChange={(e) => {
                                                    updateField('siteId', e.target.value)
                                                    updateField('subLocation', '')
                                                }}
                                                className="w-full px-4 py-2.5 rounded-xl border border-surface-200 bg-surface-200 text-surface-900 text-sm focus:outline-none focus:ring-2 focus:ring-sun-green-500/30 focus:border-sun-green-500"
                                            >
                                                <option value="">Select site...</option>
                                                {LOCATIONS.map((loc) => (
                                                    <option key={loc.id} value={loc.id}>{loc.name}</option>
                                                ))}
                                            </select>
                                        </FormField>
                                    </div>

                                    {/* Sub-location */}
                                    {formData.siteId && (
                                        <FormField label="Sub-location">
                                            <select
                                                value={formData.subLocation}
                                                onChange={(e) => updateField('subLocation', e.target.value)}
                                                className="w-full px-4 py-2.5 rounded-xl border border-surface-200 bg-surface-200 text-surface-900 text-sm focus:outline-none focus:ring-2 focus:ring-sun-green-500/30 focus:border-sun-green-500"
                                            >
                                                <option value="">Select sub-location...</option>
                                                {availableSubLocations.map((sub) => (
                                                    <option key={sub} value={sub}>{sub}</option>
                                                ))}
                                            </select>
                                        </FormField>
                                    )}

                                    {/* Description */}
                                    <FormField label="Description" hint="Provide detailed information about the issue or task">
                                        <textarea
                                            value={formData.description}
                                            onChange={(e) => updateField('description', e.target.value)}
                                            rows={3}
                                            placeholder="Describe the problem, symptoms, or maintenance requirements..."
                                            className="w-full px-4 py-2.5 rounded-xl border border-surface-200 bg-surface-200 text-surface-900 text-sm focus:outline-none focus:ring-2 focus:ring-sun-green-500/30 focus:border-sun-green-500 resize-none placeholder:text-surface-400"
                                        />
                                    </FormField>
                                </motion.div>
                            )}
                        </div>

                        {/* ─────────────────────────────────────────────────────────────── */}
                        {/* PRIORITY SECTION */}
                        {/* ─────────────────────────────────────────────────────────────── */}
                        <div className="space-y-3">
                            <SectionHeader
                                icon={AlertTriangle}
                                title="Priority Level"
                                description="Set the urgency and SLA for this ticket"
                                expanded={expandedSections.priority}
                                onToggle={() => toggleSection('priority')}
                                required
                            />
                            {expandedSections.priority && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className="grid grid-cols-2 md:grid-cols-4 gap-3 pl-4"
                                >
                                    {PRIORITY_LEVELS.map((level) => (
                                        <SelectionCard
                                            key={level.id}
                                            selected={formData.priority === level.id}
                                            onClick={() => updateField('priority', level.id)}
                                            label={level.label}
                                            description={level.description}
                                            color={level.color}
                                        />
                                    ))}
                                </motion.div>
                            )}
                        </div>

                        {/* ─────────────────────────────────────────────────────────────── */}
                        {/* SCHEDULE SECTION */}
                        {/* ─────────────────────────────────────────────────────────────── */}
                        <div className="space-y-3">
                            <SectionHeader
                                icon={Calendar}
                                title="Schedule"
                                description="Set the planned date and time for this work"
                                expanded={expandedSections.schedule}
                                onToggle={() => toggleSection('schedule')}
                            />
                            {expandedSections.schedule && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className="space-y-4 pl-4"
                                >
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <FormField label="Scheduled Date">
                                            <input
                                                type="date"
                                                value={formData.scheduledDate}
                                                onChange={(e) => updateField('scheduledDate', e.target.value)}
                                                className="w-full px-4 py-2.5 rounded-xl border border-surface-200 bg-surface-200 text-surface-900 text-sm focus:outline-none focus:ring-2 focus:ring-sun-green-500/30 focus:border-sun-green-500"
                                            />
                                        </FormField>
                                        <FormField label="Start Time">
                                            <input
                                                type="time"
                                                value={formData.scheduledTime}
                                                onChange={(e) => updateField('scheduledTime', e.target.value)}
                                                className="w-full px-4 py-2.5 rounded-xl border border-surface-200 bg-surface-200 text-surface-900 text-sm focus:outline-none focus:ring-2 focus:ring-sun-green-500/30 focus:border-sun-green-500"
                                            />
                                        </FormField>
                                        <FormField label="Estimated Duration" hint="Hours">
                                            <input
                                                type="number"
                                                min="0.5"
                                                step="0.5"
                                                value={formData.estimatedDuration}
                                                onChange={(e) => updateField('estimatedDuration', e.target.value)}
                                                className="w-full px-4 py-2.5 rounded-xl border border-surface-200 bg-surface-200 text-surface-900 text-sm focus:outline-none focus:ring-2 focus:ring-sun-green-500/30 focus:border-sun-green-500"
                                            />
                                        </FormField>
                                    </div>
                                </motion.div>
                            )}
                        </div>

                        {/* ─────────────────────────────────────────────────────────────── */}
                        {/* RECURRING SCHEDULE SECTION */}
                        {/* ─────────────────────────────────────────────────────────────── */}
                        <div className="space-y-3">
                            <SectionHeader
                                icon={Repeat}
                                title="Recurring Schedule"
                                description="Set up automatic repeat for routine maintenance"
                                expanded={expandedSections.recurring}
                                onToggle={() => toggleSection('recurring')}
                            />
                            {expandedSections.recurring && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className="space-y-4 pl-4"
                                >
                                    {/* Recurring Toggle */}
                                    <div className="flex items-center gap-3 p-3 rounded-xl bg-blue-500/12 border border-blue-400/35">
                                        <input
                                            type="checkbox"
                                            id="isRecurring"
                                            checked={formData.isRecurring}
                                            onChange={(e) => updateField('isRecurring', e.target.checked)}
                                            className="w-5 h-5 rounded border-surface-300 text-sun-green-500 focus:ring-sun-green-500"
                                        />
                                        <label htmlFor="isRecurring" className="flex-1">
                                            <span className="text-sm font-medium text-surface-900">Enable Recurring Schedule</span>
                                            <p className="text-xs text-surface-500">Automatically generate tickets on a regular schedule</p>
                                        </label>
                                    </div>

                                    {formData.isRecurring && (
                                        <>
                                            {/* Recurring Pattern */}
                                            <FormField label="Repeat Pattern" required>
                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                                    {RECURRING_PATTERNS.filter(p => p.id !== 'none').map((pattern) => (
                                                        <button
                                                            key={pattern.id}
                                                            type="button"
                                                            onClick={() => updateField('recurringPattern', pattern.id)}
                                                            className={`p-3 rounded-xl border-2 text-left transition-all ${formData.recurringPattern === pattern.id
                                                                ? 'border-sun-green-500 bg-sun-green-50'
                                                                : 'border-surface-200 hover:border-surface-300'
                                                                }`}
                                                        >
                                                            <p className={`text-sm font-medium ${formData.recurringPattern === pattern.id ? 'text-sun-green-300' : 'text-surface-700'
                                                                }`}>
                                                                {pattern.label}
                                                            </p>
                                                            {pattern.description && (
                                                                <p className="text-xs text-surface-500">{pattern.description}</p>
                                                            )}
                                                        </button>
                                                    ))}
                                                </div>
                                            </FormField>

                                            {/* End Date */}
                                            <FormField label="Repeat Until" hint="Leave empty for indefinite recurrence">
                                                <input
                                                    type="date"
                                                    value={formData.recurringEndDate}
                                                    onChange={(e) => updateField('recurringEndDate', e.target.value)}
                                                    className="w-full md:w-1/3 px-4 py-2.5 rounded-xl border border-surface-200 bg-surface-200 text-surface-900 text-sm focus:outline-none focus:ring-2 focus:ring-sun-green-500/30 focus:border-sun-green-500"
                                                />
                                            </FormField>

                                            {/* Info Banner */}
                                            <div className="flex items-start gap-3 p-3 rounded-xl bg-amber-500/12 border border-amber-400/35">
                                                <Info className="w-5 h-5 text-amber-300 flex-shrink-0 mt-0.5" />
                                                <div className="text-sm text-amber-200">
                                                    <p className="font-medium">Recurring Ticket Info</p>
                                                    <p className="text-xs mt-1">
                                                        New tickets will be automatically generated based on your schedule.
                                                        Each occurrence will inherit the same assignment and priority settings.
                                                    </p>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </motion.div>
                            )}
                        </div>

                        {/* ─────────────────────────────────────────────────────────────── */}
                        {/* ASSIGNMENT SECTION */}
                        {/* ─────────────────────────────────────────────────────────────── */}
                        <div className="space-y-3">
                            <SectionHeader
                                icon={Users}
                                title="Assignment"
                                description="Assign vendor and technician"
                                expanded={expandedSections.assignment}
                                onToggle={() => toggleSection('assignment')}
                            />
                            {expandedSections.assignment && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className="space-y-4 pl-4"
                                >
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <FormField label="Assign Vendor">
                                            <select
                                                value={formData.vendorId}
                                                onChange={(e) => {
                                                    updateField('vendorId', e.target.value)
                                                    updateField('technicianId', '')
                                                }}
                                                className="w-full px-4 py-2.5 rounded-xl border border-surface-200 bg-surface-200 text-surface-900 text-sm focus:outline-none focus:ring-2 focus:ring-sun-green-500/30 focus:border-sun-green-500"
                                            >
                                                <option value="">Auto-assign based on specialty</option>
                                                {VENDORS.map((vendor) => (
                                                    <option key={vendor.id} value={vendor.id}>
                                                        {vendor.logo} {vendor.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </FormField>

                                        <FormField label="Assign Technician/Mechanic">
                                            <select
                                                value={formData.technicianId}
                                                onChange={(e) => updateField('technicianId', e.target.value)}
                                                className="w-full px-4 py-2.5 rounded-xl border border-surface-200 bg-surface-200 text-surface-900 text-sm focus:outline-none focus:ring-2 focus:ring-sun-green-500/30 focus:border-sun-green-500"
                                            >
                                                <option value="">Select technician...</option>
                                                {availableTechnicians.map((tech) => (
                                                    <option key={tech.id} value={tech.id}>
                                                        {tech.name} - {tech.expertise}
                                                    </option>
                                                ))}
                                            </select>
                                        </FormField>
                                    </div>
                                </motion.div>
                            )}
                        </div>

                        {/* ─────────────────────────────────────────────────────────────── */}
                        {/* ADDITIONAL DETAILS SECTION */}
                        {/* ─────────────────────────────────────────────────────────────── */}
                        <div className="space-y-3">
                            <SectionHeader
                                icon={Package}
                                title="Additional Details"
                                description="Tools, materials, and safety requirements"
                                expanded={expandedSections.additional}
                                onToggle={() => toggleSection('additional')}
                            />
                            {expandedSections.additional && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className="space-y-4 pl-4"
                                >
                                    {/* Estimated Labor Hours */}
                                    <FormField label="Estimated Labor Hours">
                                        <input
                                            type="number"
                                            min="0.5"
                                            step="0.5"
                                            value={formData.estimatedHours}
                                            onChange={(e) => updateField('estimatedHours', e.target.value)}
                                            className="w-full md:w-1/4 px-4 py-2.5 rounded-xl border border-surface-200 bg-surface-200 text-surface-900 text-sm focus:outline-none focus:ring-2 focus:ring-sun-green-500/30 focus:border-sun-green-500"
                                        />
                                    </FormField>

                                    {/* Required Tools */}
                                    <FormField label="Required Tools & Materials" hint="Select all that apply">
                                        <div className="flex flex-wrap gap-2">
                                            {COMMON_TOOLS.map((tool) => (
                                                <button
                                                    key={tool}
                                                    type="button"
                                                    onClick={() => {
                                                        const current = formData.requiredTools
                                                        if (current.includes(tool)) {
                                                            updateField('requiredTools', current.filter(t => t !== tool))
                                                        } else {
                                                            updateField('requiredTools', [...current, tool])
                                                        }
                                                    }}
                                                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${formData.requiredTools.includes(tool)
                                                        ? 'bg-sun-green-500/15 text-sun-green-300 border border-sun-green-300'
                                                        : 'bg-surface-100 text-surface-600 border border-surface-200 hover:border-surface-300'
                                                        }`}
                                                >
                                                    {formData.requiredTools.includes(tool) && '✓ '}{tool}
                                                </button>
                                            ))}
                                        </div>
                                    </FormField>

                                    {/* Safety Notes */}
                                    <FormField label="Safety Notes & Precautions">
                                        <textarea
                                            value={formData.safetyNotes}
                                            onChange={(e) => updateField('safetyNotes', e.target.value)}
                                            rows={2}
                                            placeholder="PPE requirements, lockout/tagout procedures, hazard warnings..."
                                            className="w-full px-4 py-2.5 rounded-xl border border-surface-200 bg-surface-200 text-surface-900 text-sm focus:outline-none focus:ring-2 focus:ring-sun-green-500/30 focus:border-sun-green-500 resize-none placeholder:text-surface-400"
                                        />
                                    </FormField>

                                    {/* Attachments Placeholder */}
                                    <FormField label="Attachments">
                                        <div className="flex items-center justify-center p-6 rounded-xl border-2 border-dashed border-surface-300 bg-surface-300/25 hover:bg-surface-300/50 transition-colors cursor-pointer">
                                            <div className="text-center">
                                                <Paperclip className="w-8 h-8 text-surface-400 mx-auto mb-2" />
                                                <p className="text-sm text-surface-600">Drop files here or click to upload</p>
                                                <p className="text-xs text-surface-400 mt-1">SOPs, manuals, photos (max 10MB each)</p>
                                            </div>
                                        </div>
                                    </FormField>
                                </motion.div>
                            )}
                        </div>
                    </form>

                    {/* Footer */}
                    <div className="flex items-center justify-between px-6 py-4 border-t border-surface-200 bg-surface-300/25">
                        <div className="text-sm text-surface-500">
                            <span className="text-rose-500">*</span> Required fields
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-5 py-2.5 rounded-xl border border-surface-200 text-surface-700 text-sm font-medium hover:bg-surface-300/50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                onClick={handleSubmit}
                                disabled={!isValid}
                                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${isValid
                                    ? 'bg-sun-green-500 text-white hover:bg-sun-green-600 shadow-lg shadow-sun-green-500/25'
                                    : 'bg-surface-200 text-surface-400 cursor-not-allowed'
                                    }`}
                            >
                                <Plus className="w-4 h-4" />
                                Create Ticket
                            </button>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    )
}

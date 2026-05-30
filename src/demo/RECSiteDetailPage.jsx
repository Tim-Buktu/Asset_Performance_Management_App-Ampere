import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Clock,
    ChevronLeft,
    ChevronRight,
    CheckCircle2,
    Circle,
    FileText,
    Upload,
    Building2,
    Zap,
    MapPin,
    Send,
    Eye,
    Download,
    Leaf,
    X,
    Mail
} from 'lucide-react'
import { INDONESIA_SITES } from '../components/ExecutiveUI/IndonesiaMapView'

/**
 * RECSiteDetailPage - Site-Level REC Registration & Issuance Process
 * 
 * Deep-dive page for REC managers to track document requirements
 * and process stages for individual sites.
 */

// Process stages with detailed steps
const processStages = {
    preRegistration: {
        name: 'Pre-Registration',
        subtitle: 'Post Asset Installation',
        color: 'blue',
        steps: [
            { id: 'qc', name: 'Quality Control Check', owner: 'Asset Management', type: 'task' },
            { id: 'ppa', name: 'Upload Signed PPA', owner: 'Asset Management', type: 'document' },
            { id: 'sld', name: 'Upload Stamped SLD', owner: 'Asset Management', type: 'document' },
            { id: 'slo', name: 'Upload SLO Certificate', owner: 'Asset Management', type: 'document' },
            { id: 'commissioning', name: 'Upload Commissioning Report', owner: 'Asset Management', type: 'document' },
            { id: 'meter', name: 'Meter Photo (Clear Serial Number)', owner: 'Asset Management', type: 'document' },
            { id: 'site_photos', name: 'Site Photos (3x incl. Drone View)', owner: 'Asset Management', type: 'document' },
            { id: 'asset_details', name: 'Update Asset Details', owner: 'Asset Management', type: 'task' },
        ]
    },
    registration: {
        name: 'Registration SOP',
        stages: [
            {
                name: 'Stage 1: Document Prep',
                color: 'purple',
                steps: [
                    { id: 'confirm_draft', name: 'Confirm Registration Request Draft in I-REC', owner: 'RECs Team', type: 'task' },
                    { id: 'consolidate', name: 'Consolidate & QC All Documents', owner: 'RECs Team', type: 'task' },
                    { id: 'escalate', name: 'Escalate to Other Teams (if needed)', owner: 'RECs Team', type: 'task' },
                    { id: 'mark_ready', name: 'Mark Asset Ready to Submit', owner: 'RECs Team', type: 'task' },
                    { id: 'reupload', name: 'Reupload Clean Files', owner: 'RECs Team', type: 'document' },
                ]
            },
            {
                name: 'Stage 2: Submission',
                color: 'sun-green',
                steps: [
                    { id: 'submit_reg', name: 'Submit Facility Registration to I-REC', owner: 'RECs Team', type: 'task' },
                    { id: 'mark_registered', name: 'Mark Asset as Registered', owner: 'RECs Team', type: 'task' },
                ]
            }
        ]
    },
    issuance: {
        name: 'Issuance SOP',
        stages: [
            {
                name: 'Stage 1: Document Prep',
                color: 'amber',
                steps: [
                    { id: 'issue_list', name: 'Issue Asset Request List', owner: 'RECs Team', type: 'task' },
                    { id: 'annual_issuance', name: 'Publish Annual Issuance Schedule', owner: 'RECs Team', type: 'task' },
                    { id: 'am_export', name: 'Export Daily Energy Generation (MWh)', owner: 'Asset Management', type: 'data' },
                    { id: 'validate_cod', name: 'Validate COD / Operating Days', owner: 'Asset Management', type: 'task' },
                    { id: 'finance_invoice', name: 'Compile Invoice for Client', owner: 'Finance', type: 'task' },
                    { id: 'validate_ids', name: 'Validate Core Identifiers', owner: 'Finance', type: 'task' },
                    { id: 'mark_ready_issue', name: 'Mark Ready for Submission', owner: 'RECs Team', type: 'task' },
                ]
            },
            {
                name: 'Stage 2: Submission',
                color: 'emerald',
                steps: [
                    { id: 'submit_gen', name: 'Submit Generation Data to I-REC', owner: 'RECs Team', type: 'task' },
                    { id: 'mark_issued', name: 'Mark Asset Issued on Tracker', owner: 'RECs Team', type: 'task' },
                    { id: 'record_volume', name: 'Record Volume & Serial Ranges', owner: 'RECs Team', type: 'data' },
                    { id: 'notify_teams', name: 'Notify Finance/Sales (Sell/Hold/Retire)', owner: 'RECs Team', type: 'task' },
                ]
            }
        ]
    }
}

// Document requirements
const documentRequirements = [
    { id: 'ppa', name: 'Signed PPA', category: 'Pre-Registration', owner: 'Asset Management', required: true },
    { id: 'sld', name: 'Stamped SLD', category: 'Pre-Registration', owner: 'Asset Management', required: true },
    { id: 'slo', name: 'SLO Certificate', category: 'Pre-Registration', owner: 'Asset Management', required: true },
    { id: 'commissioning', name: 'Commissioning Report', category: 'Pre-Registration', owner: 'Asset Management', required: true },
    { id: 'meter_photo', name: 'Meter Photo', category: 'Pre-Registration', owner: 'Asset Management', required: true },
    { id: 'site_photos', name: 'Site Photos (3x)', category: 'Pre-Registration', owner: 'Asset Management', required: true },
    { id: 'irec_draft', name: 'I-REC Registration Draft', category: 'Registration', owner: 'RECs Team', required: true },
    { id: 'energy_data', name: 'Energy Generation Data', category: 'Issuance', owner: 'Asset Management', required: true },
    { id: 'invoice', name: 'Client Invoice', category: 'Issuance', owner: 'Finance', required: false },
]

// Generate site-specific process status
const generateSiteProcess = (site) => {
    const statusMap = {}
    const allSteps = [
        ...processStages.preRegistration.steps,
        ...processStages.registration.stages.flatMap(s => s.steps),
        ...processStages.issuance.stages.flatMap(s => s.steps),
    ]

    allSteps.forEach((step, idx) => {
        let status
        if (site.status === 'healthy') {
            status = idx < allSteps.length * 0.7 ? 'complete' : (idx < allSteps.length * 0.85 ? 'in-progress' : 'pending')
        } else if (site.status === 'warning') {
            status = idx < allSteps.length * 0.4 ? 'complete' : (idx < allSteps.length * 0.5 ? 'in-progress' : 'pending')
        } else {
            status = idx < allSteps.length * 0.2 ? 'complete' : (idx < allSteps.length * 0.25 ? 'in-progress' : 'pending')
        }
        statusMap[step.id] = {
            status,
            completedAt: status === 'complete' ? new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString() : null,
            elapsedDays: status === 'in-progress' ? Math.floor(Math.random() * 7) + 1 : null,
        }
    })

    return statusMap
}

// Status icon component
function StatusIcon({ status, size = 'md' }) {
    const sizeClass = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'

    if (status === 'complete') {
        return <CheckCircle2 className={`${sizeClass} text-emerald-500`} />
    }
    if (status === 'in-progress') {
        return (
            <div className={`${sizeClass} rounded-full border-2 border-amber-500 border-t-transparent animate-spin`} />
        )
    }
    return <Circle className={`${sizeClass} text-surface-300`} />
}

// Process step component
function ProcessStep({ step, status, isLast }) {
    return (
        <div className="flex gap-3">
            <div className="flex flex-col items-center">
                <StatusIcon status={status.status} />
                {!isLast && (
                    <div className={`w-0.5 flex-1 mt-1.5 ${status.status === 'complete' ? 'bg-emerald-300' : 'bg-surface-200'}`} />
                )}
            </div>

            <div className={`flex-1 pb-4 ${isLast ? 'pb-0' : ''}`}>
                <div className="flex items-center justify-between">
                    <div>
                        <p className={`text-sm ${status.status === 'complete' ? 'text-surface-800' :
                            status.status === 'in-progress' ? 'text-amber-300 font-medium' : 'text-surface-400'
                            }`}>
                            {step.name}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs text-surface-400">{step.owner}</span>
                            {step.type === 'document' && (
                                <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-500/12 text-blue-300 font-medium">DOC</span>
                            )}
                            {step.type === 'data' && (
                                <span className="text-[9px] px-1.5 py-0.5 rounded bg-purple-500/12 text-purple-600 font-medium">DATA</span>
                            )}
                        </div>
                    </div>

                    <div className="text-right">
                        {status.status === 'complete' && status.completedAt && (
                            <span className="text-[10px] text-surface-400">
                                {new Date(status.completedAt).toLocaleDateString()}
                            </span>
                        )}
                        {status.status === 'in-progress' && status.elapsedDays && (
                            <span className="text-[10px] text-amber-300 font-medium">
                                {status.elapsedDays}d
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

// Upload Success Modal Component - Simple success popup
function UploadModal({ isOpen, onClose, docName }) {
    React.useEffect(() => {
        if (isOpen) {
            // Auto-close after 2 seconds
            const timer = setTimeout(() => {
                onClose()
            }, 2000)
            return () => clearTimeout(timer)
        }
    }, [isOpen, onClose])

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center" onClick={onClose}>
            <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-surface-200 rounded-2xl p-6 w-full max-w-sm shadow-2xl"
                onClick={e => e.stopPropagation()}
            >
                <div className="text-center">
                    <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-surface-900 mb-2">Upload Succeeded</h3>
                    <p className="text-sm text-surface-500">{docName} has been uploaded successfully.</p>
                </div>
            </motion.div>
        </div>
    )
}

// Email Request Modal Component
function EmailRequestModal({ isOpen, onClose, docName, ownerTeam }) {
    const [subject, setSubject] = useState(`Document Request: ${docName}`)
    const [body, setBody] = useState(`Hi ${ownerTeam} Team,\n\nThis is a reminder to upload the following document for REC registration:\n\n• ${docName}\n\nPlease upload at your earliest convenience.\n\nThank you,\nRECs Team`)
    const [sending, setSending] = useState(false)
    const [sent, setSent] = useState(false)

    React.useEffect(() => {
        if (isOpen) {
            setSubject(`Document Request: ${docName}`)
            setBody(`Hi ${ownerTeam} Team,\n\nThis is a reminder to upload the following document for REC registration:\n\n• ${docName}\n\nPlease upload at your earliest convenience.\n\nThank you,\nRECs Team`)
            setSent(false)
        }
    }, [isOpen, docName, ownerTeam])

    const handleSend = () => {
        setSending(true)
        setTimeout(() => {
            setSending(false)
            setSent(true)
            setTimeout(() => {
                onClose()
            }, 1500)
        }, 1000)
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
            <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-surface-200 rounded-2xl w-full max-w-lg shadow-2xl"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-surface-100">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/12 flex items-center justify-center">
                            <Mail className="w-5 h-5 text-blue-300" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-surface-900">Send Request Email</h3>
                            <p className="text-xs text-surface-500">Notify {ownerTeam} team</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-lg hover:bg-surface-300/50 transition-colors">
                        <X className="w-5 h-5 text-surface-400" />
                    </button>
                </div>

                {sent ? (
                    <div className="p-8 text-center">
                        <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-surface-900 mb-2">Email Sent!</h3>
                        <p className="text-surface-500">Notification sent to {ownerTeam} team.</p>
                    </div>
                ) : (
                    <>
                        {/* Form */}
                        <div className="p-5 space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-surface-600 mb-1.5">Subject</label>
                                <input
                                    type="text"
                                    value={subject}
                                    onChange={e => setSubject(e.target.value)}
                                    className="w-full px-3 py-2.5 rounded-lg border border-surface-200 text-sm focus:outline-none focus:ring-2 focus:ring-sun-green-500/30 focus:border-sun-green-500"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-surface-600 mb-1.5">Message</label>
                                <textarea
                                    value={body}
                                    onChange={e => setBody(e.target.value)}
                                    rows={6}
                                    className="w-full px-3 py-2.5 rounded-lg border border-surface-200 text-sm focus:outline-none focus:ring-2 focus:ring-sun-green-500/30 focus:border-sun-green-500 resize-none"
                                />
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-end gap-3 px-5 py-4 bg-surface-300/25 rounded-b-2xl">
                            <button
                                onClick={onClose}
                                className="px-4 py-2 rounded-lg text-sm font-medium text-surface-600 hover:bg-surface-300/50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSend}
                                disabled={sending}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-sun-green-500 hover:bg-sun-green-600 transition-colors disabled:opacity-50"
                            >
                                {sending ? (
                                    <Loader2 className="w-4 h-4 text-white animate-spin" />
                                ) : (
                                    <Send className="w-4 h-4 text-white" />
                                )}
                                <span className="text-sm font-medium text-white">{sending ? 'Sending...' : 'Send Email'}</span>
                            </button>
                        </div>
                    </>
                )}
            </motion.div>
        </div>
    )
}

export default function RECSiteDetailPage() {
    const [currentTime, setCurrentTime] = useState(new Date())
    const [selectedSiteId, setSelectedSiteId] = useState(INDONESIA_SITES[0].id)
    const [activePhase, setActivePhase] = useState('preRegistration')
    const [docFilter, setDocFilter] = useState('all')
    const [uploadModal, setUploadModal] = useState({ isOpen: false, docName: '' })
    const [emailModal, setEmailModal] = useState({ isOpen: false, docName: '', owner: '' })

    React.useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000)
        return () => clearInterval(timer)
    }, [])

    const selectedSite = useMemo(() =>
        INDONESIA_SITES.find(s => s.id === selectedSiteId) || INDONESIA_SITES[0],
        [selectedSiteId]
    )

    const processStatus = useMemo(() => generateSiteProcess(selectedSite), [selectedSite])

    const siteMetrics = useMemo(() => {
        const capacityMW = parseFloat(selectedSite.capacity)
        const annualMWh = Math.round(capacityMW * 1500)
        return {
            capacity: selectedSite.capacity,
            annualGeneration: annualMWh,
            recsGenerated: annualMWh,
            sunOwned: Math.random() > 0.3,
        }
    }, [selectedSite])

    const filteredDocs = useMemo(() => {
        if (docFilter === 'all') return documentRequirements
        return documentRequirements.filter(d => d.category.toLowerCase().includes(docFilter))
    }, [docFilter])

    const overallProgress = useMemo(() => {
        const total = Object.keys(processStatus).length
        const complete = Object.values(processStatus).filter(s => s.status === 'complete').length
        return { total, complete, pct: Math.round((complete / total) * 100) }
    }, [processStatus])

    const siteIndex = INDONESIA_SITES.findIndex(s => s.id === selectedSiteId)
    const goToNextSite = () => setSelectedSiteId(INDONESIA_SITES[(siteIndex + 1) % INDONESIA_SITES.length].id)
    const goToPrevSite = () => setSelectedSiteId(INDONESIA_SITES[(siteIndex - 1 + INDONESIA_SITES.length) % INDONESIA_SITES.length].id)

    return (
        <div className="min-h-screen bg-surface-300/25">
            {/* Modals */}
            <AnimatePresence>
                {uploadModal.isOpen && (
                    <UploadModal
                        isOpen={uploadModal.isOpen}
                        onClose={() => setUploadModal({ isOpen: false, docName: '' })}
                        docName={uploadModal.docName}
                    />
                )}
                {emailModal.isOpen && (
                    <EmailRequestModal
                        isOpen={emailModal.isOpen}
                        onClose={() => setEmailModal({ isOpen: false, docName: '', owner: '' })}
                        docName={emailModal.docName}
                        ownerTeam={emailModal.owner}
                    />
                )}
            </AnimatePresence>

            {/* Simplified Header */}
            <header className="sticky top-0 z-40 bg-surface-200 border-b border-surface-200">
                <div className="max-w-7xl mx-auto px-6 py-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <a href="#/recs" className="flex items-center gap-1 text-surface-500 hover:text-surface-700 transition-colors">
                                <ChevronLeft className="w-4 h-4" />
                                <span className="text-sm">Back</span>
                            </a>
                            <span className="text-surface-300">|</span>
                            <span className="text-sm font-medium text-surface-900">Site REC Process</span>
                        </div>

                        <div className="flex items-center gap-2">
                            <button onClick={goToPrevSite} className="p-1.5 rounded-lg hover:bg-surface-300/50 transition-colors">
                                <ChevronLeft className="w-4 h-4 text-surface-500" />
                            </button>
                            <select
                                value={selectedSiteId}
                                onChange={(e) => setSelectedSiteId(e.target.value)}
                                className="px-3 py-1.5 bg-surface-300/25 rounded-lg border border-surface-200 text-sm text-surface-900 min-w-[180px]"
                            >
                                {INDONESIA_SITES.map(site => (
                                    <option key={site.id} value={site.id}>{site.name}</option>
                                ))}
                            </select>
                            <button onClick={goToNextSite} className="p-1.5 rounded-lg hover:bg-surface-300/50 transition-colors">
                                <ChevronRight className="w-4 h-4 text-surface-500" />
                            </button>
                        </div>

                        <div className="flex items-center gap-2 text-surface-500">
                            <Clock className="w-4 h-4" />
                            <span className="text-sm font-mono">
                                {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}
                            </span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-6 py-6">
                {/* Site Info - Cleaner Design */}
                <div className="bg-surface-200 rounded-xl border border-surface-200 p-5 mb-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-sun-green-50 flex items-center justify-center">
                                <Building2 className="w-6 h-6 text-sun-green-300" />
                            </div>
                            <div>
                                <h1 className="text-xl font-semibold text-surface-900">{selectedSite.name}</h1>
                                <div className="flex items-center gap-3 text-sm text-surface-500 mt-0.5">
                                    <span className="flex items-center gap-1">
                                        <MapPin className="w-3.5 h-3.5" />
                                        {selectedSite.location}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Zap className="w-3.5 h-3.5" />
                                        {siteMetrics.capacity}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Leaf className="w-3.5 h-3.5" />
                                        {siteMetrics.recsGenerated.toLocaleString()} RECs/yr
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-6">
                            <div className="text-right">
                                <p className="text-2xl font-bold text-sun-green-300">{overallProgress.pct}%</p>
                                <p className="text-xs text-surface-500">Progress</p>
                            </div>
                            <div className="text-right">
                                <p className="text-lg font-semibold text-surface-900">{overallProgress.complete}/{overallProgress.total}</p>
                                <p className="text-xs text-surface-500">Steps</p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${siteMetrics.sunOwned ? 'bg-sun-green-50 text-sun-green-300' : 'bg-surface-100 text-surface-600'}`}>
                                {siteMetrics.sunOwned ? 'Nova-Owned' : 'Third Party'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Two Column Layout */}
                <div className="grid grid-cols-12 gap-6">
                    {/* Left: Process Timeline */}
                    <div className="col-span-5">
                        <div className="bg-surface-200 rounded-xl border border-surface-200 overflow-hidden">
                            <div className="flex border-b border-surface-100">
                                {[
                                    { id: 'preRegistration', label: 'Pre-Reg' },
                                    { id: 'registration', label: 'Registration' },
                                    { id: 'issuance', label: 'Issuance' },
                                ].map(phase => (
                                    <button
                                        key={phase.id}
                                        onClick={() => setActivePhase(phase.id)}
                                        className={`flex-1 px-3 py-2.5 text-sm font-medium transition-colors ${activePhase === phase.id
                                            ? 'text-sun-green-300 bg-sun-green-50 border-b-2 border-sun-green-500'
                                            : 'text-surface-500 hover:text-surface-700'
                                            }`}
                                    >
                                        {phase.label}
                                    </button>
                                ))}
                            </div>

                            <div className="p-5">
                                <AnimatePresence mode="wait">
                                    {activePhase === 'preRegistration' && (
                                        <motion.div
                                            key="preReg"
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 10 }}
                                        >
                                            <p className="text-xs text-surface-400 mb-4 uppercase tracking-wide">{processStages.preRegistration.subtitle}</p>
                                            {processStages.preRegistration.steps.map((step, idx) => (
                                                <ProcessStep
                                                    key={step.id}
                                                    step={step}
                                                    status={processStatus[step.id]}
                                                    isLast={idx === processStages.preRegistration.steps.length - 1}
                                                />
                                            ))}
                                        </motion.div>
                                    )}

                                    {activePhase === 'registration' && (
                                        <motion.div
                                            key="reg"
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 10 }}
                                        >
                                            {processStages.registration.stages.map((stage, stageIdx) => (
                                                <div key={stage.name} className={stageIdx > 0 ? 'mt-5' : ''}>
                                                    <p className="text-xs text-surface-400 mb-3 uppercase tracking-wide">{stage.name}</p>
                                                    {stage.steps.map((step, idx) => (
                                                        <ProcessStep
                                                            key={step.id}
                                                            step={step}
                                                            status={processStatus[step.id]}
                                                            isLast={idx === stage.steps.length - 1}
                                                        />
                                                    ))}
                                                </div>
                                            ))}
                                        </motion.div>
                                    )}

                                    {activePhase === 'issuance' && (
                                        <motion.div
                                            key="issue"
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 10 }}
                                        >
                                            {processStages.issuance.stages.map((stage, stageIdx) => (
                                                <div key={stage.name} className={stageIdx > 0 ? 'mt-5' : ''}>
                                                    <p className="text-xs text-surface-400 mb-3 uppercase tracking-wide">{stage.name}</p>
                                                    {stage.steps.map((step, idx) => (
                                                        <ProcessStep
                                                            key={step.id}
                                                            step={step}
                                                            status={processStatus[step.id]}
                                                            isLast={idx === stage.steps.length - 1}
                                                        />
                                                    ))}
                                                </div>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>

                    {/* Right: Document Checklist */}
                    <div className="col-span-7">
                        <div className="bg-surface-200 rounded-xl border border-surface-200 overflow-hidden">
                            <div className="px-5 py-4 border-b border-surface-100 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <FileText className="w-5 h-5 text-surface-400" />
                                    <h3 className="font-semibold text-surface-900">Document Checklist</h3>
                                </div>

                                <div className="flex items-center gap-1.5">
                                    {['all', 'pre', 'registration', 'issuance'].map(filter => (
                                        <button
                                            key={filter}
                                            onClick={() => setDocFilter(filter)}
                                            className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${docFilter === filter
                                                ? 'bg-surface-900 text-white'
                                                : 'text-surface-500 hover:bg-surface-300/50'
                                                }`}
                                        >
                                            {filter === 'all' ? 'All' : filter === 'pre' ? 'Pre-Reg' : filter.charAt(0).toUpperCase() + filter.slice(1)}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="divide-y divide-surface-50">
                                {filteredDocs.map((doc, idx) => {
                                    const docStatus = selectedSite.status === 'healthy'
                                        ? (idx < filteredDocs.length * 0.7 ? 'uploaded' : 'pending')
                                        : selectedSite.status === 'warning'
                                            ? (idx < filteredDocs.length * 0.4 ? 'uploaded' : 'pending')
                                            : (idx < filteredDocs.length * 0.2 ? 'uploaded' : 'pending')

                                    return (
                                        <div
                                            key={doc.id}
                                            className="flex items-center justify-between px-5 py-3 hover:bg-surface-300/25 transition-colors"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${docStatus === 'uploaded' ? 'bg-emerald-500/12' : 'bg-surface-100'
                                                    }`}>
                                                    <FileText className={`w-4 h-4 ${docStatus === 'uploaded' ? 'text-emerald-500' : 'text-surface-400'
                                                        }`} />
                                                </div>
                                                <div>
                                                    <p className="text-sm text-surface-900">{doc.name}</p>
                                                    <div className="flex items-center gap-2 mt-0.5">
                                                        <span className="text-xs text-surface-400">{doc.owner}</span>
                                                        {doc.required && (
                                                            <span className={`text-[10px] font-medium ${docStatus === 'uploaded' ? 'text-emerald-500' : 'text-rose-500'
                                                                }`}>
                                                                Required
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                {docStatus === 'uploaded' ? (
                                                    <>
                                                        <span className="flex items-center gap-1 text-xs text-emerald-400 font-medium">
                                                            <CheckCircle2 className="w-3.5 h-3.5" />
                                                            Uploaded
                                                        </span>
                                                        <button className="p-1.5 rounded hover:bg-surface-300/50 transition-colors">
                                                            <Eye className="w-4 h-4 text-surface-400" />
                                                        </button>
                                                        <button className="p-1.5 rounded hover:bg-surface-300/50 transition-colors">
                                                            <Download className="w-4 h-4 text-surface-400" />
                                                        </button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <button
                                                            onClick={() => setUploadModal({ isOpen: true, docName: doc.name })}
                                                            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-sun-green-500 hover:bg-sun-green-600 transition-colors"
                                                        >
                                                            <Upload className="w-3.5 h-3.5 text-white" />
                                                            <span className="text-xs text-white font-medium">Upload</span>
                                                        </button>
                                                        <button
                                                            onClick={() => setEmailModal({ isOpen: true, docName: doc.name, owner: doc.owner })}
                                                            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-surface-200 hover:bg-surface-300/25 transition-colors"
                                                        >
                                                            <Send className="w-3.5 h-3.5 text-surface-500" />
                                                            <span className="text-xs text-surface-600 font-medium">Request</span>
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                        {/* Summary Stats */}
                        <div className="grid grid-cols-3 gap-4 mt-4">
                            {[
                                { label: 'Uploaded', value: Math.round(filteredDocs.length * (selectedSite.status === 'healthy' ? 0.7 : 0.3)), total: filteredDocs.length },
                                { label: 'Pending AM', value: selectedSite.status === 'healthy' ? 2 : selectedSite.status === 'warning' ? 3 : 5 },
                                { label: 'Pending Finance', value: selectedSite.status === 'healthy' ? 0 : 1 },
                            ].map(stat => (
                                <div key={stat.label} className="bg-surface-200 rounded-lg border border-surface-200 p-3 text-center">
                                    <p className="text-xl font-semibold text-surface-900">
                                        {stat.value}{stat.total ? `/${stat.total}` : ''}
                                    </p>
                                    <p className="text-xs text-surface-500">{stat.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

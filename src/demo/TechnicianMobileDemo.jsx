import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Sun,
    ChevronLeft,
    Bell,
    User,
    Camera,
    CheckCircle,
    List,
    Clock,
    AlertTriangle,
    Star,
    Phone,
    Mail,
    MapPin,
    Award,
    Calendar,
    Settings,
    LogOut,
    ChevronRight,
    Zap,
    Wrench,
    X
} from 'lucide-react'

import { useTickets } from '../context/TicketContext'
import { TaskCard, CameraUI, SlideToComplete } from '../components/TechnicianMobile'

/**
 * TechnicianMobileDemo - F-5: Mobile Technician App Mockup
 * 
 * Features a simulated phone viewport with:
 * - Task list with SLA timers
 * - Camera UI for proof of service
 * - Slide-to-complete job flow
 * - History, Profile, and Notifications pages
 */
export default function TechnicianMobileDemo() {
    const { tickets, completedTickets, createTicket, completeTicket, getTicketStats } = useTickets()
    const [currentView, setCurrentView] = useState('list') // list, camera, complete, history, profile, notifications
    const [selectedTicket, setSelectedTicket] = useState(null)
    const [capturedPhoto, setCapturedPhoto] = useState(null)
    const [activeTab, setActiveTab] = useState('tasks') // tasks, history, profile

    // Dummy notifications data
    const [notifications, setNotifications] = useState([
        {
            id: 'n1',
            type: 'urgent',
            title: 'SLA At Risk',
            message: 'Ticket TKT-URGENT has 15 minutes remaining',
            time: '2 min ago',
            read: false
        },
        {
            id: 'n2',
            type: 'assignment',
            title: 'New Task Assigned',
            message: 'Inverter INV-03 needs maintenance',
            time: '15 min ago',
            read: false
        },
        {
            id: 'n3',
            type: 'system',
            title: 'Route Updated',
            message: 'Your route has been optimized for efficiency',
            time: '1 hour ago',
            read: true
        },
        {
            id: 'n4',
            type: 'completed',
            title: 'Job Verified',
            message: 'Panel C-7 maintenance has been verified by supervisor',
            time: '3 hours ago',
            read: true
        }
    ])

    // Dummy technician profile
    const technicianProfile = {
        name: 'Ahmad Fauzi',
        id: 'TECH-001',
        role: 'Senior Field Technician',
        email: 'ahmad.fauzi@novaenergy.id',
        phone: '+62 812 3456 7890',
        region: 'Jakarta Selatan',
        joinDate: 'March 2022',
        rating: 4.9,
        completedJobs: 247,
        onTimeRate: 98,
        certifications: ['Solar PV Level 2', 'Inverter Specialist', 'Safety Certified']
    }

    // Dummy history data
    const historyData = [
        {
            id: 'h1',
            ticketId: 'TKT-ABC123',
            assetName: 'Panel Array B-12',
            issueType: 'Panel Cleaning',
            completedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
            duration: '45 min',
            rating: 5
        },
        {
            id: 'h2',
            ticketId: 'TKT-DEF456',
            assetName: 'Inverter INV-07',
            issueType: 'Firmware Update',
            completedAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
            duration: '30 min',
            rating: 5
        },
        {
            id: 'h3',
            ticketId: 'TKT-GHI789',
            assetName: 'Transformer T1',
            issueType: 'Connection Repair',
            completedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
            duration: '1h 15min',
            rating: 4
        },
        {
            id: 'h4',
            ticketId: 'TKT-JKL012',
            assetName: 'Panel C-3',
            issueType: 'Hotspot Repair',
            completedAt: new Date(Date.now() - 48 * 60 * 60 * 1000),
            duration: '55 min',
            rating: 5
        }
    ]

    // Generate demo ticket if none exists
    useEffect(() => {
        if (tickets.length === 0) {
            createTicket({
                assetName: 'Inverter INV-03',
                panelId: 'inverter-03',
                location: 'Block A, Row 3',
                issueType: 'Performance Deviation',
                variance: '-12.5%',
                severity: 'critical',
                probableCause: 'Overheating',
                probability: 78,
                description: 'Critical variance detected. Immediate inspection required.'
            })

            setTimeout(() => {
                createTicket({
                    assetName: 'Panel C-7',
                    panelId: 'panel-1-2',
                    location: 'Block B, Row 5',
                    issueType: 'Soiling Detected',
                    variance: '-8.3%',
                    severity: 'warning',
                    probableCause: 'Panel Soiling',
                    probability: 65,
                    description: 'Moderate underperformance vs digital twin model.'
                })
            }, 500)
        }
    }, [tickets.length, createTicket])

    const handleTaskSelect = (ticket) => {
        setSelectedTicket(ticket)
        setCurrentView('camera')
    }

    const handlePhotoCapture = (photoData) => {
        setCapturedPhoto(photoData)
        setCurrentView('complete')
    }

    const handleJobComplete = (ticket) => {
        completeTicket(ticket.id, {
            proofPhoto: capturedPhoto,
            completedBy: 'Tech-001'
        })
        setTimeout(() => {
            setCurrentView('list')
            setActiveTab('tasks')
            setSelectedTicket(null)
            setCapturedPhoto(null)
        }, 2000)
    }

    const handleNavClick = (tab) => {
        setActiveTab(tab)
        setCurrentView(tab === 'tasks' ? 'list' : tab)
    }

    const markNotificationRead = (id) => {
        setNotifications(prev => prev.map(n =>
            n.id === id ? { ...n, read: true } : n
        ))
    }

    const unreadCount = notifications.filter(n => !n.read).length
    const stats = getTicketStats()

    // Notification icon based on type
    const getNotificationIcon = (type) => {
        switch (type) {
            case 'urgent': return <AlertTriangle className="w-5 h-5 text-rose-400" />
            case 'assignment': return <Zap className="w-5 h-5 text-sun-green-300" />
            case 'completed': return <CheckCircle className="w-5 h-5 text-emerald-400" />
            default: return <Bell className="w-5 h-5 text-cyan-400" />
        }
    }

    // Bottom navigation component
    const BottomNav = () => (
        <div className="px-4 pb-8 pt-2 border-t border-surface-200/50 bg-surface-100/50 backdrop-blur-xl">
            <div className="flex items-center justify-around">
                <button
                    onClick={() => handleNavClick('tasks')}
                    className={`flex flex-col items-center gap-1 ${activeTab === 'tasks' ? 'text-sun-green-300' : 'text-surface-500'}`}
                >
                    <List className="w-5 h-5" />
                    <span className="text-[10px]">Tasks</span>
                </button>
                <button
                    onClick={() => handleNavClick('history')}
                    className={`flex flex-col items-center gap-1 ${activeTab === 'history' ? 'text-sun-green-300' : 'text-surface-500'}`}
                >
                    <Clock className="w-5 h-5" />
                    <span className="text-[10px]">History</span>
                </button>
                <button
                    onClick={() => handleNavClick('profile')}
                    className={`flex flex-col items-center gap-1 ${activeTab === 'profile' ? 'text-sun-green-300' : 'text-surface-500'}`}
                >
                    <User className="w-5 h-5" />
                    <span className="text-[10px]">Profile</span>
                </button>
            </div>
        </div>
    )

    return (
        <div className="min-h-screen bg-surface-300/25 flex items-center justify-center p-6">
            {/* Background effects */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-sun-green-500/5 rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl" />
            </div>

            {/* Phone Frame */}
            <div className="relative">
                {/* Page Title */}
                <div className="mb-6 text-center">
                    <h1 className="text-xl font-bold text-surface-900 mb-1">
                        F-5: Technician Mobile App
                    </h1>
                    <p className="text-sm text-surface-500">
                        Mobile-first field service experience
                    </p>
                </div>

                {/* Device Frame */}
                <div className="relative w-[375px] h-[812px] bg-surface-300/25 rounded-[50px] overflow-hidden border-4 border-surface-200 shadow-2xl">
                    {/* Notch */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-36 h-7 bg-surface-300/25 rounded-b-2xl z-50" />

                    {/* Status bar */}
                    <div className="relative z-40 pt-3 px-6 flex items-center justify-between text-xs text-surface-900">
                        <span className="font-medium">9:41</span>
                        <div className="flex items-center gap-1">
                            <div className="w-4 h-2 border border-white rounded-sm">
                                <div className="w-3/4 h-full bg-surface-200 rounded-sm" />
                            </div>
                        </div>
                    </div>

                    {/* Screen content */}
                    <div className="relative h-[calc(100%-60px)] overflow-hidden">
                        <AnimatePresence mode="wait">
                            {/* Task List View */}
                            {currentView === 'list' && (
                                <motion.div
                                    key="list"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="h-full flex flex-col"
                                >
                                    {/* Header */}
                                    <div className="px-4 pt-4 pb-3">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sun-amber-500 to-sun-amber-600 flex items-center justify-center">
                                                    <Sun className="w-5 h-5 text-surface-900" />
                                                </div>
                                                <div>
                                                    <h2 className="text-lg font-bold text-surface-900">My Tasks</h2>
                                                    <p className="text-xs text-surface-600">
                                                        {stats.total} active • {stats.atRisk} at risk
                                                    </p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => setCurrentView('notifications')}
                                                className="relative p-2 rounded-full bg-surface-200/50"
                                            >
                                                <Bell className="w-5 h-5 text-surface-600" />
                                                {unreadCount > 0 && (
                                                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-[10px] text-surface-900 flex items-center justify-center">
                                                        {unreadCount}
                                                    </span>
                                                )}
                                            </button>
                                        </div>

                                        {/* Quick stats */}
                                        <div className="grid grid-cols-3 gap-2">
                                            <div className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-center">
                                                <p className="text-lg font-bold text-rose-400">{stats.critical}</p>
                                                <p className="text-[10px] text-surface-600">Critical</p>
                                            </div>
                                            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-center">
                                                <p className="text-lg font-bold text-amber-400">{stats.warning}</p>
                                                <p className="text-[10px] text-surface-600">Warning</p>
                                            </div>
                                            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center">
                                                <p className="text-lg font-bold text-emerald-400">{stats.completed}</p>
                                                <p className="text-[10px] text-surface-600">Done</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Task List */}
                                    <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-3">
                                        {tickets.length === 0 ? (
                                            <div className="flex flex-col items-center justify-center h-full text-center py-12">
                                                <CheckCircle className="w-12 h-12 text-emerald-500/30 mb-3" />
                                                <p className="text-sm text-surface-600">All tasks completed!</p>
                                                <p className="text-xs text-surface-500 mt-1">
                                                    New tickets will appear here
                                                </p>
                                            </div>
                                        ) : (
                                            tickets.map(ticket => (
                                                <TaskCard
                                                    key={ticket.id}
                                                    ticket={ticket}
                                                    onSelect={handleTaskSelect}
                                                />
                                            ))
                                        )}
                                    </div>

                                    <BottomNav />
                                </motion.div>
                            )}

                            {/* History View */}
                            {currentView === 'history' && (
                                <motion.div
                                    key="history"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="h-full flex flex-col"
                                >
                                    {/* Header */}
                                    <div className="px-4 pt-4 pb-3">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center">
                                                    <Clock className="w-5 h-5 text-surface-900" />
                                                </div>
                                                <div>
                                                    <h2 className="text-lg font-bold text-surface-900">Job History</h2>
                                                    <p className="text-xs text-surface-600">
                                                        {historyData.length + completedTickets.length} completed jobs
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Stats summary */}
                                        <div className="flex items-center gap-4 p-3 rounded-xl bg-surface-200/30 border border-surface-300/50">
                                            <div className="text-center flex-1">
                                                <p className="text-lg font-bold text-surface-900">{technicianProfile.completedJobs}</p>
                                                <p className="text-[10px] text-surface-600">Total Jobs</p>
                                            </div>
                                            <div className="w-px h-8 bg-surface-300" />
                                            <div className="text-center flex-1">
                                                <p className="text-lg font-bold text-emerald-400">{technicianProfile.onTimeRate}%</p>
                                                <p className="text-[10px] text-surface-600">On-Time</p>
                                            </div>
                                            <div className="w-px h-8 bg-surface-300" />
                                            <div className="text-center flex-1">
                                                <div className="flex items-center justify-center gap-1">
                                                    <Star className="w-4 h-4 text-sun-green-300" />
                                                    <span className="text-lg font-bold text-surface-900">{technicianProfile.rating}</span>
                                                </div>
                                                <p className="text-[10px] text-surface-600">Rating</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* History List */}
                                    <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-3">
                                        {[...completedTickets, ...historyData].map((job, idx) => (
                                            <motion.div
                                                key={job.id || idx}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: idx * 0.05 }}
                                                className="p-3 rounded-xl bg-surface-200/30 border border-surface-300/50"
                                            >
                                                <div className="flex items-start justify-between mb-2">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                                                            <CheckCircle className="w-4 h-4 text-emerald-400" />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-medium text-surface-900">{job.assetName}</p>
                                                            <p className="text-xs text-surface-600">{job.issueType}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        {[...Array(job.rating || 5)].map((_, i) => (
                                                            <Star key={i} className="w-3 h-3 text-sun-green-300 fill-sun-amber-400" />
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="flex items-center justify-between text-xs text-surface-500">
                                                    <span>{job.ticketId || job.id}</span>
                                                    <span>{job.duration || '—'}</span>
                                                    <span>
                                                        {job.completedAt?.toLocaleDateString() || new Date().toLocaleDateString()}
                                                    </span>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>

                                    <BottomNav />
                                </motion.div>
                            )}

                            {/* Profile View */}
                            {currentView === 'profile' && (
                                <motion.div
                                    key="profile"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="h-full flex flex-col"
                                >
                                    {/* Header */}
                                    <div className="px-4 pt-4 pb-3">
                                        <div className="flex items-center justify-between mb-4">
                                            <h2 className="text-lg font-bold text-surface-900">My Profile</h2>
                                            <button className="p-2 rounded-lg bg-surface-200/50">
                                                <Settings className="w-5 h-5 text-surface-600" />
                                            </button>
                                        </div>

                                        {/* Profile Card */}
                                        <div className="p-4 rounded-2xl bg-gradient-to-br from-sun-green-100 to-sun-amber-600/10 border border-sun-green-500/30">
                                            <div className="flex items-center gap-4 mb-4">
                                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-sun-amber-500 to-sun-amber-600 flex items-center justify-center text-2xl font-bold text-surface-900">
                                                    AF
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-bold text-surface-900">{technicianProfile.name}</h3>
                                                    <p className="text-xs text-surface-600">{technicianProfile.role}</p>
                                                    <div className="flex items-center gap-1 mt-1">
                                                        <Star className="w-3 h-3 text-sun-green-300 fill-sun-amber-400" />
                                                        <span className="text-xs text-sun-green-300">{technicianProfile.rating} rating</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Quick stats */}
                                            <div className="grid grid-cols-2 gap-2">
                                                <div className="p-2 rounded-lg bg-surface-100/50 text-center">
                                                    <p className="text-lg font-bold text-surface-900">{technicianProfile.completedJobs}</p>
                                                    <p className="text-[10px] text-surface-600">Jobs Done</p>
                                                </div>
                                                <div className="p-2 rounded-lg bg-surface-100/50 text-center">
                                                    <p className="text-lg font-bold text-emerald-400">{technicianProfile.onTimeRate}%</p>
                                                    <p className="text-[10px] text-surface-600">On-Time Rate</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Profile Details */}
                                    <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-3">
                                        {/* Contact Info */}
                                        <div className="p-3 rounded-xl bg-surface-200/30 border border-surface-300/50 space-y-3">
                                            <p className="text-xs text-surface-500 uppercase tracking-wider">Contact</p>
                                            <div className="flex items-center gap-3">
                                                <Mail className="w-4 h-4 text-surface-500" />
                                                <span className="text-sm text-surface-900">{technicianProfile.email}</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <Phone className="w-4 h-4 text-surface-500" />
                                                <span className="text-sm text-surface-900">{technicianProfile.phone}</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <MapPin className="w-4 h-4 text-surface-500" />
                                                <span className="text-sm text-surface-900">{technicianProfile.region}</span>
                                            </div>
                                        </div>

                                        {/* Certifications */}
                                        <div className="p-3 rounded-xl bg-surface-200/30 border border-surface-300/50">
                                            <p className="text-xs text-surface-500 uppercase tracking-wider mb-3">Certifications</p>
                                            <div className="space-y-2">
                                                {technicianProfile.certifications.map((cert, idx) => (
                                                    <div key={idx} className="flex items-center gap-2">
                                                        <Award className="w-4 h-4 text-sun-green-300" />
                                                        <span className="text-sm text-surface-900">{cert}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Menu Items */}
                                        <div className="p-3 rounded-xl bg-surface-200/30 border border-surface-300/50 space-y-1">
                                            <button className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-surface-300/30 transition-colors">
                                                <div className="flex items-center gap-3">
                                                    <Calendar className="w-4 h-4 text-surface-500" />
                                                    <span className="text-sm text-surface-900">Schedule</span>
                                                </div>
                                                <ChevronRight className="w-4 h-4 text-surface-400" />
                                            </button>
                                            <button className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-surface-300/30 transition-colors">
                                                <div className="flex items-center gap-3">
                                                    <Settings className="w-4 h-4 text-surface-500" />
                                                    <span className="text-sm text-surface-900">Settings</span>
                                                </div>
                                                <ChevronRight className="w-4 h-4 text-surface-400" />
                                            </button>
                                            <button className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-surface-300/30 transition-colors text-rose-400">
                                                <div className="flex items-center gap-3">
                                                    <LogOut className="w-4 h-4" />
                                                    <span className="text-sm">Sign Out</span>
                                                </div>
                                            </button>
                                        </div>

                                        {/* Tech ID */}
                                        <div className="text-center text-xs text-surface-400 pt-2">
                                            ID: {technicianProfile.id} • Joined {technicianProfile.joinDate}
                                        </div>
                                    </div>

                                    <BottomNav />
                                </motion.div>
                            )}

                            {/* Notifications View */}
                            {currentView === 'notifications' && (
                                <motion.div
                                    key="notifications"
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="h-full flex flex-col"
                                >
                                    {/* Header */}
                                    <div className="px-4 pt-4 pb-3">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                <button
                                                    onClick={() => setCurrentView('list')}
                                                    className="p-2 rounded-lg bg-surface-200/50"
                                                >
                                                    <ChevronLeft className="w-5 h-5 text-surface-600" />
                                                </button>
                                                <h2 className="text-lg font-bold text-surface-900">Notifications</h2>
                                            </div>
                                            {unreadCount > 0 && (
                                                <button
                                                    onClick={() => setNotifications(prev => prev.map(n => ({ ...n, read: true })))}
                                                    className="text-xs text-sun-green-300"
                                                >
                                                    Mark all read
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    {/* Notification List */}
                                    <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-2">
                                        {notifications.map((notification, idx) => (
                                            <motion.div
                                                key={notification.id}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: idx * 0.05 }}
                                                onClick={() => markNotificationRead(notification.id)}
                                                className={`p-3 rounded-xl border transition-colors cursor-pointer ${notification.read
                                                        ? 'bg-surface-200/20 border-surface-300/30'
                                                        : 'bg-surface-200/50 border-surface-300/50'
                                                    }`}
                                            >
                                                <div className="flex items-start gap-3">
                                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${notification.type === 'urgent' ? 'bg-rose-500/20' :
                                                            notification.type === 'assignment' ? 'bg-sun-green-500/20' :
                                                                notification.type === 'completed' ? 'bg-emerald-500/20' :
                                                                    'bg-cyan-500/20'
                                                        }`}>
                                                        {getNotificationIcon(notification.type)}
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex items-start justify-between">
                                                            <p className={`text-sm font-medium ${notification.read ? 'text-surface-600' : 'text-surface-900'}`}>
                                                                {notification.title}
                                                            </p>
                                                            {!notification.read && (
                                                                <div className="w-2 h-2 rounded-full bg-sun-green-500" />
                                                            )}
                                                        </div>
                                                        <p className="text-xs text-surface-500 mt-0.5">{notification.message}</p>
                                                        <p className="text-[10px] text-surface-400 mt-1">{notification.time}</p>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>

                                    {/* Safe area */}
                                    <div className="h-8" />
                                </motion.div>
                            )}

                            {/* Camera View */}
                            {currentView === 'camera' && selectedTicket && (
                                <motion.div
                                    key="camera"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="h-full"
                                >
                                    <CameraUI
                                        ticket={selectedTicket}
                                        onCapture={handlePhotoCapture}
                                        onClose={() => setCurrentView('list')}
                                    />
                                </motion.div>
                            )}

                            {/* Completion View */}
                            {currentView === 'complete' && selectedTicket && (
                                <motion.div
                                    key="complete"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    className="h-full flex flex-col"
                                >
                                    {/* Header */}
                                    <div className="px-4 pt-4 pb-3">
                                        <div className="flex items-center gap-3 mb-4">
                                            <button
                                                onClick={() => setCurrentView('camera')}
                                                className="p-2 rounded-lg bg-surface-200/50"
                                            >
                                                <ChevronLeft className="w-5 h-5 text-surface-600" />
                                            </button>
                                            <h2 className="text-lg font-bold text-surface-900">Complete Job</h2>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 px-4 flex flex-col">
                                        {/* Photo preview */}
                                        <div className="mb-6">
                                            <p className="text-xs text-surface-500 mb-2">Proof of Service</p>
                                            <div className="aspect-video rounded-xl bg-surface-200/50 border border-surface-300/50 flex items-center justify-center">
                                                <div className="text-center">
                                                    <Camera className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                                                    <p className="text-xs text-surface-600">Photo captured</p>
                                                    <p className="text-[10px] text-surface-500">
                                                        {new Date().toLocaleString()}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Job summary */}
                                        <div className="mb-6 p-3 rounded-xl bg-surface-200/30 border border-surface-300/50">
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className="w-10 h-10 rounded-lg bg-sun-green-500/20 flex items-center justify-center">
                                                    {selectedTicket.vendor.logo}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-surface-900">{selectedTicket.assetName}</p>
                                                    <p className="text-xs text-surface-600">{selectedTicket.location}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Slide to complete */}
                                        <div className="flex-1 flex items-center justify-center">
                                            <SlideToComplete
                                                ticket={selectedTicket}
                                                onComplete={handleJobComplete}
                                            />
                                        </div>
                                    </div>

                                    {/* Safe area */}
                                    <div className="h-8" />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Home indicator */}
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/30 rounded-full" />
                </div>

                {/* Instructions */}
                <div className="mt-6 p-4 rounded-xl bg-surface-100/50 border border-surface-200/50 max-w-[375px]">
                    <h4 className="text-sm font-semibold text-surface-900 mb-2">🎮 Demo Features</h4>
                    <ul className="text-xs text-surface-600 space-y-1 list-disc list-inside">
                        <li><span className="text-sun-green-300">Tasks</span> - Active work orders with SLA timers</li>
                        <li><span className="text-sun-green-300">History</span> - Completed jobs with ratings</li>
                        <li><span className="text-sun-green-300">Profile</span> - Technician info & certifications</li>
                        <li><span className="text-sun-green-300">Notifications</span> - Tap bell icon for alerts</li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

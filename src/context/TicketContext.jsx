import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'

/**
 * TicketContext - Shared state between Digital Twin and Technician Mobile App
 * 
 * Manages work order tickets created from anomaly detection, including:
 * - Ticket creation with auto-vendor assignment
 * - SLA timer management
 * - Status updates synced to dashboard
 */

// Dummy O&M Vendor Data (replace with master data later)
const O_AND_M_VENDORS = [
    {
        id: 'v1',
        name: 'SolarTech Solutions',
        shortName: 'SolarTech',
        rating: 4.8,
        responseTime: 45, // minutes
        specialties: ['inverter', 'panel'],
        region: 'Jakarta',
        phone: '+62 21 5555 0001',
        logo: '☀️'
    },
    {
        id: 'v2',
        name: 'GreenGrid Maintenance',
        shortName: 'GreenGrid',
        rating: 4.6,
        responseTime: 60,
        specialties: ['transformer', 'cable'],
        region: 'Bandung',
        phone: '+62 22 5555 0002',
        logo: '🔧'
    },
    {
        id: 'v3',
        name: 'PowerFix Indonesia',
        shortName: 'PowerFix',
        rating: 4.9,
        responseTime: 30,
        specialties: ['inverter', 'monitoring'],
        region: 'Surabaya',
        phone: '+62 31 5555 0003',
        logo: '⚡'
    },
]

// SLA configurations based on severity
const SLA_CONFIG = {
    critical: 60,   // 60 minutes
    warning: 120,   // 2 hours
    normal: 240     // 4 hours
}

const TicketContext = createContext(null)

export function useTickets() {
    const context = useContext(TicketContext)
    if (!context) {
        throw new Error('useTickets must be used within a TicketProvider')
    }
    return context
}

export function TicketProvider({ children }) {
    const [tickets, setTickets] = useState([])
    const [completedTickets, setCompletedTickets] = useState([])

    // Auto-assign vendor based on issue type and availability
    const assignVendor = useCallback((issueType, severity) => {
        // Find best matching vendor based on specialty and rating
        const matchingVendors = O_AND_M_VENDORS.filter(v =>
            v.specialties.some(s => issueType.toLowerCase().includes(s))
        )

        // If no specialty match, use highest rated available
        const candidateVendors = matchingVendors.length > 0 ? matchingVendors : O_AND_M_VENDORS

        // Sort by response time for critical, rating for others
        const sorted = [...candidateVendors].sort((a, b) => {
            if (severity === 'critical') {
                return a.responseTime - b.responseTime
            }
            return b.rating - a.rating
        })

        return sorted[0]
    }, [])

    // Create a new ticket from anomaly data
    const createTicket = useCallback((anomalyData) => {
        const severity = anomalyData.severity || 'warning'
        const issueType = anomalyData.issueType || anomalyData.assetName || 'inverter'

        const vendor = assignVendor(issueType, severity)
        const slaMinutes = SLA_CONFIG[severity] || SLA_CONFIG.warning

        const newTicket = {
            id: `TKT-${Date.now().toString(36).toUpperCase()}`,
            createdAt: new Date(),
            slaDeadline: new Date(Date.now() + slaMinutes * 60 * 1000),
            slaMinutes,
            status: 'pending', // pending, in_progress, completed
            severity,
            priority: severity === 'critical' ? 1 : severity === 'warning' ? 2 : 3,

            // Anomaly details
            assetName: anomalyData.assetName || 'Panel C-7',
            assetId: anomalyData.panelId || 'panel-1-2',
            location: anomalyData.location || 'Block A, Row 3',
            issueType: anomalyData.issueType || 'Performance Deviation',
            variance: anomalyData.variance || '-8.3%',
            description: anomalyData.description || `Detected ${Math.abs(parseFloat(anomalyData.variance || -8.3))}% underperformance vs digital twin model`,

            // Assigned vendor
            vendor,
            vendorId: vendor.id,

            // Probable cause from anomaly analysis
            probableCause: anomalyData.probableCause || 'Panel Soiling',
            probability: anomalyData.probability || 65,

            // Geolocation for verification
            coordinates: anomalyData.coordinates || { lat: -6.2088, lng: 106.8456 },
            geofenceRadius: 50, // meters

            // Completion data (filled when completed)
            completedAt: null,
            completedBy: null,
            proofPhoto: null,
            notes: ''
        }

        setTickets(prev => [newTicket, ...prev])
        return newTicket
    }, [assignVendor])

    // Update ticket status
    const updateTicketStatus = useCallback((ticketId, status, additionalData = {}) => {
        setTickets(prev => prev.map(ticket => {
            if (ticket.id === ticketId) {
                const updated = {
                    ...ticket,
                    status,
                    ...additionalData
                }

                if (status === 'completed') {
                    updated.completedAt = new Date()
                }

                return updated
            }
            return ticket
        }))
    }, [])

    // Complete a ticket
    const completeTicket = useCallback((ticketId, completionData = {}) => {
        setTickets(prev => {
            const ticket = prev.find(t => t.id === ticketId)
            if (ticket) {
                const completedTicket = {
                    ...ticket,
                    status: 'completed',
                    completedAt: new Date(),
                    ...completionData
                }
                setCompletedTickets(prevCompleted => [completedTicket, ...prevCompleted])
            }
            return prev.filter(t => t.id !== ticketId)
        })
    }, [])

    // Get active ticket count by severity
    const getTicketStats = useCallback(() => {
        const critical = tickets.filter(t => t.severity === 'critical').length
        const warning = tickets.filter(t => t.severity === 'warning').length
        const atRisk = tickets.filter(t => {
            const remaining = (t.slaDeadline - new Date()) / 1000 / 60
            return remaining < 30 && remaining > 0
        }).length

        return { total: tickets.length, critical, warning, atRisk, completed: completedTickets.length }
    }, [tickets, completedTickets])

    // Check if SLA is at risk (< 30 minutes remaining)
    const isSlaAtRisk = useCallback((ticket) => {
        const remaining = (ticket.slaDeadline - new Date()) / 1000 / 60
        return remaining < 30 && remaining > 0
    }, [])

    // Check if SLA is breached
    const isSlaBrached = useCallback((ticket) => {
        return new Date() > ticket.slaDeadline
    }, [])

    const value = {
        tickets,
        completedTickets,
        vendors: O_AND_M_VENDORS,
        createTicket,
        updateTicketStatus,
        completeTicket,
        getTicketStats,
        isSlaAtRisk,
        isSlaBrached,
    }

    return (
        <TicketContext.Provider value={value}>
            {children}
        </TicketContext.Provider>
    )
}

export default TicketContext

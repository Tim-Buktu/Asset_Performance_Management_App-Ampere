/**
 * Digital Twin Mock Data Layer
 * 
 * Provides realistic mock data for the Digital Twin visualization including:
 * - Solar metrics with multi-timeframe averages
 * - Environmental statistics (irradiance, temperatures, soiling)
 * - BESS (Battery Energy Storage System) status
 * - EV Fleet telematics
 * - EVSE (Charger) management data
 * - Grid economics and carbon offset
 */

// ============================================
// SOLAR METRICS DATA
// ============================================

export const SOLAR_METRICS = {
    efficiency: {
        day: 87.4,
        month: 84.2,
        year: 82.8,
        unit: '%',
        thresholds: { good: 80, warning: 70, critical: 60 }
    },
    powerGeneration: {
        day: 342.5,
        month: 9876.2,
        year: 118514.8,
        unit: 'kWh',
        trend: '+5.2%'
    },
    energyConsumed: {
        day: 285.3,
        month: 8234.7,
        year: 98816.4,
        unit: 'kWh',
        trend: '-2.1%'
    }
}

export const ENVIRONMENTAL_DATA = {
    irradiance: {
        current: 842,
        peak: 1050,
        average: 720,
        unit: 'W/m²',
        history: [680, 720, 780, 840, 890, 920, 880, 842] // Last 8 hours
    },
    ambientTemperature: {
        current: 32.4,
        min: 24.2,
        max: 38.6,
        unit: '°C',
        history: [26.2, 28.4, 30.1, 32.8, 34.2, 36.1, 34.8, 32.4] // Last 8 hours
    },
    moduleTemperature: {
        current: 48.2,
        min: 28.5,
        max: 62.3,
        delta: 15.8, // Delta from ambient
        unit: '°C',
        history: [32.5, 38.2, 44.6, 52.1, 58.4, 62.3, 56.2, 48.2] // Last 8 hours
    },
    soiling: {
        level: 8.5, // Percentage soiling loss
        daysUntilCleaning: 12,
        lastCleaned: '2025-12-20',
        threshold: 15, // Alert when exceeds this %
        unit: '%',
        history: [2.1, 3.4, 4.8, 5.6, 6.2, 7.1, 7.8, 8.5] // Last 8 days trend
    }
}

export const MAINTENANCE_TICKETS = {
    summary: {
        open: 4,
        resolved: 23,
        totalThisMonth: 27
    },
    activeTickets: [
        {
            id: 'TKT-001',
            title: 'Inverter 3 Overheating',
            severity: 'critical',
            asset: 'INV-003',
            createdAt: '2026-01-02T08:30:00',
            assignee: 'Ahmad R.'
        },
        {
            id: 'TKT-002',
            title: 'Panel String B7 Underperforming',
            severity: 'warning',
            asset: 'STR-B7',
            createdAt: '2026-01-01T14:22:00',
            assignee: 'Budi S.'
        },
        {
            id: 'TKT-003',
            title: 'Tracker Motor Calibration',
            severity: 'info',
            asset: 'TRK-04',
            createdAt: '2026-01-02T11:45:00',
            assignee: 'Cindy W.'
        },
        {
            id: 'TKT-004',
            title: 'Weather Station Communication',
            severity: 'warning',
            asset: 'WS-01',
            createdAt: '2026-01-02T15:10:00',
            assignee: 'Unassigned'
        }
    ]
}

// ============================================
// BESS (Battery Energy Storage System) DATA
// ============================================

export const BESS_DATA = {
    capacityLeft: {
        current: 78.5, // Percentage
        totalMWh: 4.5,
        availableMWh: 3.53,
        unit: '%'
    },
    dischargeRate: {
        current: 125, // kW
        maxRate: 500,
        mode: 'discharge', // 'charge' | 'discharge' | 'idle'
        unit: 'kW'
    },
    efficiency: {
        roundTrip: 91.2, // Percentage
        chargeEfficiency: 95.4,
        dischargeEfficiency: 95.6,
        target: 90,
        unit: '%'
    },
    stateOfHealth: {
        current: 94.8,
        initialCapacity: 5.0,
        currentCapacity: 4.74,
        degradationRate: 1.2, // % per year
        unit: '%'
    },
    cycleCount: {
        total: 1847,
        warrantyLimit: 6000,
        remainingCycles: 4153,
        avgCyclesPerMonth: 45
    },
    temperature: {
        current: 28.4,
        min: 22.0,
        max: 35.0,
        optimalRange: { min: 20, max: 30 },
        unit: '°C'
    },
    lastCharge: '2026-01-02T06:30:00',
    dailyThroughput: 8.2, // MWh
    status: 'active', // 'active' | 'standby' | 'maintenance' | 'offline'
    // Charge history for last 24 hours (hourly data)
    chargeHistory: [
        { hour: '00:00', power: 0, soc: 45 },
        { hour: '02:00', power: 180, soc: 52 },
        { hour: '04:00', power: 280, soc: 62 },
        { hour: '06:00', power: 350, soc: 75 },
        { hour: '08:00', power: 0, soc: 78 },
        { hour: '10:00', power: -125, soc: 72 },
        { hour: '12:00', power: -180, soc: 64 },
        { hour: '14:00', power: -200, soc: 55 },
        { hour: '16:00', power: -280, soc: 42 },
        { hour: '18:00', power: 150, soc: 48 },
        { hour: '20:00', power: 250, soc: 62 },
        { hour: '22:00', power: 180, soc: 72 },
        { hour: 'Now', power: 125, soc: 78.5 }
    ],
    estimatedTimes: {
        timeToFull: '2.8 hrs',
        runtimeRemaining: '6.4 hrs',
        chargingPower: 125 // kW when charging
    }
}

// ============================================
// EV FLEET TELEMATICS DATA
// ============================================

export const EV_FLEET = {
    summary: {
        totalVehicles: 12,
        inUse: 5,
        charging: 3,
        idle: 3,
        alert: 1,
        averageSoC: 68.4,
        averageSoH: 92.1
    },
    vehicles: [
        {
            id: 'EV-001',
            model: 'BYD e6',
            licensePlate: 'B 1234 SUN',
            soc: 85,
            soh: 96.2,
            status: 'in-use',
            location: 'Route A - Delivery',
            odometer: 42350,
            dtcCodes: [],
            lastService: '2025-11-15'
        },
        {
            id: 'EV-002',
            model: 'BYD e6',
            licensePlate: 'B 2345 SUN',
            soc: 42,
            soh: 94.8,
            status: 'charging',
            location: 'Charger Station 3',
            odometer: 38720,
            dtcCodes: [],
            chargingPower: 50 // kW
        },
        {
            id: 'EV-003',
            model: 'Wuling Air',
            licensePlate: 'B 3456 SUN',
            soc: 92,
            soh: 98.1,
            status: 'idle',
            location: 'Depot A',
            odometer: 12450,
            dtcCodes: []
        },
        {
            id: 'EV-004',
            model: 'Hyundai Ioniq 5',
            licensePlate: 'B 4567 SUN',
            soc: 28,
            soh: 89.4,
            status: 'alert',
            location: 'Depot B',
            odometer: 65420,
            dtcCodes: ['P0A80', 'U0100'], // Battery and communication errors
            alertMessage: 'Battery cell imbalance detected'
        },
        {
            id: 'EV-005',
            model: 'BYD e6',
            licensePlate: 'B 5678 SUN',
            soc: 76,
            soh: 93.5,
            status: 'in-use',
            location: 'Route B - Customer',
            odometer: 51280,
            dtcCodes: []
        },
        {
            id: 'EV-006',
            model: 'Wuling Air',
            licensePlate: 'B 6789 SUN',
            soc: 55,
            soh: 97.2,
            status: 'charging',
            location: 'Charger Station 1',
            odometer: 18930,
            dtcCodes: [],
            chargingPower: 22
        },
        {
            id: 'EV-007',
            model: 'Hyundai Ioniq 5',
            licensePlate: 'B 7890 SUN',
            soc: 88,
            soh: 95.8,
            status: 'in-use',
            location: 'Route C - Service',
            odometer: 29840,
            dtcCodes: []
        },
        {
            id: 'EV-008',
            model: 'BYD e6',
            licensePlate: 'B 8901 SUN',
            soc: 63,
            soh: 91.2,
            status: 'idle',
            location: 'Depot A',
            odometer: 72150,
            dtcCodes: []
        },
        {
            id: 'EV-009',
            model: 'Wuling Air',
            licensePlate: 'B 9012 SUN',
            soc: 71,
            soh: 96.8,
            status: 'in-use',
            location: 'Route A - Pickup',
            odometer: 15620,
            dtcCodes: []
        },
        {
            id: 'EV-010',
            model: 'Hyundai Ioniq 5',
            licensePlate: 'B 0123 SUN',
            soc: 34,
            soh: 92.4,
            status: 'charging',
            location: 'Charger Station 5',
            odometer: 45890,
            dtcCodes: [],
            chargingPower: 150
        },
        {
            id: 'EV-011',
            model: 'BYD e6',
            licensePlate: 'B 1235 SUN',
            soc: 79,
            soh: 88.6,
            status: 'idle',
            location: 'Depot B',
            odometer: 89240,
            dtcCodes: []
        },
        {
            id: 'EV-012',
            model: 'Wuling Air',
            licensePlate: 'B 2346 SUN',
            soc: 82,
            soh: 99.1,
            status: 'in-use',
            location: 'Route B - Delivery',
            odometer: 8450,
            dtcCodes: []
        }
    ]
}

// ============================================
// EVSE (CHARGER) MANAGEMENT DATA
// ============================================

export const EVSE_DATA = {
    summary: {
        totalStations: 8,
        available: 4,
        charging: 3,
        outOfOrder: 1,
        uptime: 94.2, // Percentage
        totalEnergyDelivered: 1842.5 // kWh today
    },
    stations: [
        {
            id: 'EVSE-001',
            name: 'Station 1',
            location: 'Parking Zone A',
            status: 'charging',
            connectors: [
                { type: 'Type 2', maxPower: 22, status: 'occupied', vehicleId: 'EV-006' },
                { type: 'CCS2', maxPower: 150, status: 'available' }
            ],
            currentPower: 22,
            energyDelivered: 245.6,
            firmwareVersion: 'OCPP 1.6J',
            lastMaintenance: '2025-12-15'
        },
        {
            id: 'EVSE-002',
            name: 'Station 2',
            location: 'Parking Zone A',
            status: 'available',
            connectors: [
                { type: 'Type 2', maxPower: 22, status: 'available' },
                { type: 'CCS2', maxPower: 150, status: 'available' }
            ],
            currentPower: 0,
            energyDelivered: 312.4,
            firmwareVersion: 'OCPP 1.6J',
            lastMaintenance: '2025-12-15'
        },
        {
            id: 'EVSE-003',
            name: 'Station 3',
            location: 'Parking Zone B',
            status: 'charging',
            connectors: [
                { type: 'Type 2', maxPower: 22, status: 'available' },
                { type: 'CCS2', maxPower: 50, status: 'occupied', vehicleId: 'EV-002' }
            ],
            currentPower: 48,
            energyDelivered: 428.9,
            firmwareVersion: 'OCPP 2.0.1',
            lastMaintenance: '2025-12-20'
        },
        {
            id: 'EVSE-004',
            name: 'Station 4',
            location: 'Parking Zone B',
            status: 'out-of-order',
            connectors: [
                { type: 'Type 2', maxPower: 22, status: 'faulted' },
                { type: 'CHAdeMO', maxPower: 50, status: 'faulted' }
            ],
            currentPower: 0,
            energyDelivered: 0,
            firmwareVersion: 'OCPP 1.6J',
            errorCode: 'E-102',
            errorMessage: 'Ground fault detected'
        },
        {
            id: 'EVSE-005',
            name: 'Station 5',
            location: 'Parking Zone C',
            status: 'charging',
            connectors: [
                { type: 'CCS2', maxPower: 150, status: 'occupied', vehicleId: 'EV-010' },
                { type: 'CCS2', maxPower: 150, status: 'available' }
            ],
            currentPower: 142,
            energyDelivered: 523.8,
            firmwareVersion: 'OCPP 2.0.1',
            lastMaintenance: '2025-12-22'
        },
        {
            id: 'EVSE-006',
            name: 'Station 6',
            location: 'Parking Zone C',
            status: 'available',
            connectors: [
                { type: 'Type 2', maxPower: 11, status: 'available' },
                { type: 'Type 2', maxPower: 11, status: 'available' }
            ],
            currentPower: 0,
            energyDelivered: 156.2,
            firmwareVersion: 'OCPP 1.6J',
            lastMaintenance: '2025-12-18'
        },
        {
            id: 'EVSE-007',
            name: 'Station 7',
            location: 'Depot A',
            status: 'available',
            connectors: [
                { type: 'Type 2', maxPower: 22, status: 'available' },
                { type: 'CHAdeMO', maxPower: 50, status: 'available' }
            ],
            currentPower: 0,
            energyDelivered: 89.4,
            firmwareVersion: 'OCPP 1.6J',
            lastMaintenance: '2025-12-10'
        },
        {
            id: 'EVSE-008',
            name: 'Station 8',
            location: 'Depot B',
            status: 'available',
            connectors: [
                { type: 'Type 2', maxPower: 22, status: 'available' },
                { type: 'CCS2', maxPower: 100, status: 'available' }
            ],
            currentPower: 0,
            energyDelivered: 86.2,
            firmwareVersion: 'OCPP 2.0.1',
            lastMaintenance: '2025-12-25'
        }
    ],
    // Sample charging curve data for active session
    chargingCurve: [
        { time: 0, power: 0 },
        { time: 5, power: 52 },
        { time: 10, power: 145 },
        { time: 15, power: 148 },
        { time: 20, power: 142 },
        { time: 25, power: 135 },
        { time: 30, power: 120 },
        { time: 35, power: 95 },
        { time: 40, power: 72 },
        { time: 45, power: 48 }
    ]
}

// ============================================
// GRID ECONOMICS DATA
// ============================================

export const GRID_ECONOMICS = {
    peakDemand: {
        current: 245, // kW
        capacity: 350, // Transformer capacity
        threshold: 280, // Load balancing trigger
        status: 'normal', // 'normal' | 'load-balancing' | 'peak-shaving'
        unit: 'kW'
    },
    costPerKWh: {
        current: 1420, // IDR per kWh
        period: 'off-peak', // 'peak' | 'standard' | 'off-peak'
        currency: 'IDR',
        touSchedule: [
            { period: 'off-peak', start: '22:00', end: '05:00', rate: 980 },
            { period: 'standard', start: '05:00', end: '17:00', rate: 1420 },
            { period: 'peak', start: '17:00', end: '22:00', rate: 2150 }
        ]
    },
    carbonOffset: {
        dailyCO2Saved: 142.5, // kg
        monthlyCO2Saved: 4275, // kg
        yearlyCO2Saved: 52000, // kg
        treesEquivalent: 2400,
        gasolineSaved: 18500, // liters
        // Weekly trend data (last 7 days)
        history: [128.5, 135.2, 140.8, 138.5, 145.2, 148.0, 142.5]
    },
    savings: {
        daily: 425000, // IDR
        monthly: 12750000, // IDR  
        yearly: 155250000, // IDR
        trend: '+8.2%',
        currency: 'IDR',
        // Weekly trend data (last 7 days)
        history: [380000, 395000, 410000, 390000, 420000, 435000, 425000]
    },
    gridExport: {
        enabled: true,
        todayExport: 125.4, // kWh
        exportRate: 1050, // IDR per kWh
        earning: 131670 // IDR today
    }
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Check if a site has BESS assets
 */
export const hasBESSAssets = (site) => {
    return site?.assets?.bess && site.assets.bess > 0
}

/**
 * Check if a site has EV/Charger assets
 */
export const hasEVChargerAssets = (site) => {
    return (site?.assets?.evFleet && site.assets.evFleet > 0) ||
        (site?.assets?.chargers && site.assets.chargers > 0)
}

/**
 * Get status color class based on status type
 */
export const getStatusColor = (status) => {
    const colors = {
        'healthy': 'emerald',
        'active': 'emerald',
        'available': 'emerald',
        'charging': 'blue',
        'in-use': 'blue',
        'idle': 'gray',
        'warning': 'amber',
        'alert': 'rose',
        'critical': 'rose',
        'out-of-order': 'rose',
        'faulted': 'rose'
    }
    return colors[status] || 'gray'
}

/**
 * Format large numbers with K/M suffix
 */
export const formatNumber = (num) => {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M'
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K'
    }
    return num.toFixed(1)
}

/**
 * Format IDR currency
 */
export const formatIDR = (amount) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount)
}

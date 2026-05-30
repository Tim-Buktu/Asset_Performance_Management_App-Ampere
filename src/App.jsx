import React, { useState, useEffect, Suspense, lazy } from 'react'
import { TicketProvider } from './context/TicketContext'
import Dashboard from './demo/Dashboard'

// Lazy load heavy demos to isolate loading issues
const DigitalTwinDemo = lazy(() => import('./demo/DigitalTwinDemo'))
const TechnicianMobileDemo = lazy(() => import('./demo/TechnicianMobileDemo'))
const ExecutiveDashboardDemo = lazy(() => import('./demo/ExecutiveDashboardDemo'))
const RECDashboardDemo = lazy(() => import('./demo/RECDashboardDemo'))
const RECSiteDetailPage = lazy(() => import('./demo/RECSiteDetailPage'))

// Loading fallback component - Light Mode
function LoadingFallback({ message = 'Loading...' }) {
    return (
        <div className="min-h-screen bg-surface-100 flex items-center justify-center">
            <div className="text-center">
                <div className="w-12 h-12 border-4 border-sun-green-400/35 border-t-sun-green-500 rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-surface-600 text-sm">{message}</p>
            </div>
        </div>
    )
}

function AppRoutes() {
    // Simple route-based navigation using hash
    const [route, setRoute] = useState(window.location.hash || '#/')

    useEffect(() => {
        const handleHashChange = () => {
            setRoute(window.location.hash || '#/')
        }
        window.addEventListener('hashchange', handleHashChange)
        return () => window.removeEventListener('hashchange', handleHashChange)
    }, [])

    // Route mapping
    if (route.startsWith('#/digital-twin') || route === '#/twin') {
        return (
            <Suspense fallback={<LoadingFallback message="Loading Digital Twin..." />}>
                <DigitalTwinDemo />
            </Suspense>
        )
    }

    if (route === '#/technician' || route === '#/mobile') {
        return (
            <Suspense fallback={<LoadingFallback message="Loading Mobile App..." />}>
                <TechnicianMobileDemo />
            </Suspense>
        )
    }

    if (route === '#/dashboard' || route === '#/overview') {
        return <Dashboard />
    }

    if (route === '#/recs') {
        return (
            <Suspense fallback={<LoadingFallback message="Loading REC Dashboard..." />}>
                <RECDashboardDemo />
            </Suspense>
        )
    }

    if (route.startsWith('#/recs/site')) {
        return (
            <Suspense fallback={<LoadingFallback message="Loading Site Details..." />}>
                <RECSiteDetailPage />
            </Suspense>
        )
    }

    // Default: Executive Dashboard as main page
    return (
        <Suspense fallback={<LoadingFallback message="Loading Executive Dashboard..." />}>
            <ExecutiveDashboardDemo />
        </Suspense>
    )
}

function App() {
    return (
        <TicketProvider>
            <AppRoutes />
        </TicketProvider>
    )
}

export default App

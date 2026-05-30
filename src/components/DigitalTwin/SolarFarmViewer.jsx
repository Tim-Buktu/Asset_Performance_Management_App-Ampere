import React, { useRef, useMemo, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, Environment } from '@react-three/drei'
import * as THREE from 'three'

/**
 * SolarPanel - Individual panel mesh with thermal bloom capability
 */
function SolarPanel({
    position,
    variance = 0,
    isSelected = false,
    onHover,
    onClick,
    panelId
}) {
    const meshRef = useRef()
    const glowRef = useRef()
    const [hovered, setHovered] = useState(false)

    // Determine panel state based on variance
    const hasAnomaly = Math.abs(variance) > 5
    const isCritical = Math.abs(variance) > 10

    // Animation for thermal bloom
    useFrame((state) => {
        if (glowRef.current && hasAnomaly) {
            const pulse = Math.sin(state.clock.elapsedTime * (isCritical ? 4 : 2)) * 0.3 + 0.7
            glowRef.current.material.opacity = pulse * (isCritical ? 0.8 : 0.5)
            glowRef.current.scale.setScalar(1 + pulse * 0.2)
        }
    })

    // Panel color based on performance
    const panelColor = useMemo(() => {
        if (isCritical) return '#F87171'
        if (hasAnomaly) return '#22D3EE'
        return '#1E293B' // Normal blue-gray
    }, [hasAnomaly, isCritical])

    const glowColor = isCritical ? '#F87171' : '#22D3EE'

    return (
        <group position={position}>
            {/* Main Panel */}
            <mesh
                ref={meshRef}
                onPointerOver={(e) => {
                    e.stopPropagation()
                    setHovered(true)
                    onHover?.(panelId, true)
                }}
                onPointerOut={(e) => {
                    e.stopPropagation()
                    setHovered(false)
                    onHover?.(panelId, false)
                }}
                onClick={(e) => {
                    e.stopPropagation()
                    onClick?.(panelId)
                }}
                castShadow
                receiveShadow
            >
                <boxGeometry args={[1.6, 0.08, 1]} />
                <meshStandardMaterial
                    color={panelColor}
                    metalness={0.8}
                    roughness={0.2}
                    emissive={hasAnomaly ? glowColor : '#0B1120'}
                    emissiveIntensity={hasAnomaly ? 0.3 : 0}
                />
            </mesh>

            {/* Panel Frame */}
            <mesh position={[0, -0.02, 0]}>
                <boxGeometry args={[1.7, 0.04, 1.1]} />
                <meshStandardMaterial color="#CBD5E1" metalness={0.9} roughness={0.3} />
            </mesh>

            {/* Thermal Bloom Glow Effect */}
            {hasAnomaly && (
                <mesh ref={glowRef} position={[0, 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                    <circleGeometry args={[1.2, 32]} />
                    <meshBasicMaterial
                        color={glowColor}
                        transparent
                        opacity={0.5}
                        side={THREE.DoubleSide}
                        blending={THREE.AdditiveBlending}
                    />
                </mesh>
            )}

            {/* Selection Ring */}
            {(isSelected || hovered) && (
                <mesh position={[0, 0.15, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                    <ringGeometry args={[0.9, 1.0, 32]} />
                    <meshBasicMaterial
                        color="#22D3EE"
                        transparent
                        opacity={0.8}
                        side={THREE.DoubleSide}
                    />
                </mesh>
            )}
        </group>
    )
}

/**
 * Inverter - Power conversion unit with status indicator
 */
function Inverter({ position, status = 'healthy', label }) {
    const statusColors = {
        healthy: '#818CF8',
        warning: '#22D3EE',
        critical: '#F87171'
    }

    return (
        <group position={position}>
            {/* Main Body */}
            <mesh castShadow>
                <boxGeometry args={[0.8, 1.2, 0.6]} />
                <meshStandardMaterial color="#E2E8F0" metalness={0.7} roughness={0.4} />
            </mesh>

            {/* Status Light */}
            <mesh position={[0, 0.7, 0.31]}>
                <sphereGeometry args={[0.08, 16, 16]} />
                <meshStandardMaterial
                    color={statusColors[status]}
                    emissive={statusColors[status]}
                    emissiveIntensity={0.8}
                />
            </mesh>

            {/* Connection Points */}
            <mesh position={[0.5, 0, 0]}>
                <cylinderGeometry args={[0.05, 0.05, 0.3, 8]} />
                <meshStandardMaterial color="#22D3EE" metalness={0.8} />
            </mesh>
        </group>
    )
}

/**
 * ConnectionLine - Glowing cable between panels and inverters
 */
function ConnectionLine({ start, end, isActive = true }) {
    const points = useMemo(() => [
        new THREE.Vector3(...start),
        new THREE.Vector3(...end)
    ], [start, end])

    const lineGeometry = useMemo(() => {
        const geometry = new THREE.BufferGeometry().setFromPoints(points)
        return geometry
    }, [points])

    return (
        <line geometry={lineGeometry}>
            <lineBasicMaterial
                color={isActive ? '#22D3EE' : '#CBD5E1'}
                linewidth={2}
                transparent
                opacity={isActive ? 0.8 : 0.4}
            />
        </line>
    )
}

/**
 * Ground Plane with grid pattern
 */
function Ground() {
    return (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
            <planeGeometry args={[50, 50, 50, 50]} />
            <meshStandardMaterial
                color="#0B1120"
                metalness={0.1}
                roughness={0.9}
                wireframe={false}
            />
        </mesh>
    )
}

/**
 * GridHelper - Visual grid overlay
 */
function GridOverlay() {
    return (
        <gridHelper
            args={[50, 50, '#E2E8F0', '#F1F5F9']}
            position={[0, -0.49, 0]}
        />
    )
}

/**
 * SolarFarmViewer - Main 3D visualization component
 */
export default function SolarFarmViewer({
    panelData = [],
    selectedPanel = null,
    onPanelSelect = () => { },
    onPanelHover = () => { },
    className = ''
}) {
    // Generate default panel layout if no data provided
    const panels = useMemo(() => {
        if (panelData.length > 0) return panelData

        // Default 5x4 grid of panels
        const defaultPanels = []
        for (let row = 0; row < 4; row++) {
            for (let col = 0; col < 5; col++) {
                defaultPanels.push({
                    id: `panel-${row}-${col}`,
                    position: [col * 2 - 4, 0, row * 1.5 - 2.25],
                    variance: 0,
                    output: 100
                })
            }
        }
        return defaultPanels
    }, [panelData])

    return (
        <div className={`relative w-full h-full min-h-[400px] bg-surface-300/25 rounded-2xl overflow-hidden ${className}`}>
            {/* 3D Canvas */}
            <Canvas shadows dpr={[1, 2]}>
                <PerspectiveCamera makeDefault position={[12, 8, 12]} fov={50} />
                <OrbitControls
                    enablePan={true}
                    enableZoom={true}
                    enableRotate={true}
                    minDistance={5}
                    maxDistance={30}
                    maxPolarAngle={Math.PI / 2.2}
                />

                {/* Lighting */}
                <ambientLight intensity={0.3} />
                <directionalLight
                    position={[10, 15, 10]}
                    intensity={1}
                    castShadow
                    shadow-mapSize={[2048, 2048]}
                />
                <pointLight position={[-10, 10, -10]} intensity={0.5} color="#22D3EE" />

                {/* Environment */}
                <fog attach="fog" args={['#0B1120', 20, 50]} />

                {/* Ground and Grid */}
                <Ground />
                <GridOverlay />

                {/* Solar Panels */}
                {panels.map((panel) => (
                    <SolarPanel
                        key={panel.id}
                        panelId={panel.id}
                        position={panel.position}
                        variance={panel.variance}
                        isSelected={selectedPanel === panel.id}
                        onHover={onPanelHover}
                        onClick={onPanelSelect}
                    />
                ))}

                {/* Inverters */}
                <Inverter position={[-2, 0.1, 4]} status="healthy" label="INV-1" />
                <Inverter position={[2, 0.1, 4]} status="healthy" label="INV-2" />

                {/* Connection Lines */}
                <ConnectionLine start={[-4, 0, 1]} end={[-2, 0.6, 4]} />
                <ConnectionLine start={[0, 0, 1]} end={[-2, 0.6, 4]} />
                <ConnectionLine start={[2, 0, 1]} end={[2, 0.6, 4]} />
                <ConnectionLine start={[4, 0, 1]} end={[2, 0.6, 4]} />
            </Canvas>

            {/* Overlay UI Elements */}
            <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-200/60 backdrop-blur-sm border border-surface-200/50">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-medium text-surface-700">3D View</span>
            </div>

            {/* Controls Hint */}
            <div className="absolute bottom-4 left-4 text-xs text-surface-500">
                Drag to rotate • Scroll to zoom • Shift+drag to pan
            </div>
        </div>
    )
}

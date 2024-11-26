"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Environment, Text, useTexture } from "@react-three/drei";
import { Suspense, useState, useEffect, useMemo, useRef, useCallback } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// Constants for theater configuration
const SCREEN_WIDTH = 16;
const SCREEN_HEIGHT = 9;
const SCREEN_DISTANCE = -15;
const AUDIENCE_ROWS = 6;
const SEATS_PER_ROW = 12;

// Animated audience member with subtle breathing movement
function AudienceMember({ position }: { position: [number, number, number] }) {
    const breathingRef = useRef<THREE.Group>(null);

    useFrame((state) => {
        if (breathingRef.current) {
            breathingRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.02;
        }
    });

    return (
        <group ref={breathingRef} position={position}>
            {/* Body */}
            <mesh castShadow>
                <capsuleGeometry args={[0.2, 0.8, 4, 8]} />
                <meshStandardMaterial color="#444444" />
            </mesh>
            {/* Head */}
            <mesh position={[0, 0.6, 0]} castShadow>
                <sphereGeometry args={[0.2, 16, 16]} />
                <meshStandardMaterial color="#444444" />
            </mesh>
        </group>
    );
}

// Row of audience members
function AudienceRow({ rowPosition, count }: { rowPosition: number; count: number }) {
    const members = useMemo(() => {
        return Array.from({ length: count }).map((_, i) => {
            const spacing = 1;
            const offset = (count - 1) * spacing * -0.5;
            const randomHeight = Math.random() * 0.1;

            return {
                position: [offset + i * spacing, rowPosition * 0.1 + randomHeight, 0] as [number, number, number],
                key: i,
            };
        });
    }, [count, rowPosition]);

    return (
        <group position={[0, 0, rowPosition]}>
            {members.map((member) => (
                <AudienceMember key={member.key} position={member.position} />
            ))}
        </group>
    );
}

// Movie screen component with countdown
function MovieScreen({
    onCountdownEnd,
    onPlayingChange,
}: {
    onCountdownEnd: () => void;
    onPlayingChange: (isPlaying: boolean) => void;
}) {
    const [countdown, setCountdown] = useState(5);
    const [isPlaying, setIsPlaying] = useState(false);
    const screenRef = useRef<THREE.Mesh>(null);

    useEffect(() => {
        if (countdown > 0) {
            const timer = setInterval(() => setCountdown((c) => c - 1), 1000);
            return () => clearInterval(timer);
        } else {
            setIsPlaying(true);
            onCountdownEnd();
            onPlayingChange(true);
        }
    }, [countdown, onCountdownEnd, onPlayingChange]);

    // Screen animation
    useFrame((state) => {
        if (screenRef.current) {
            const material = screenRef.current.material as THREE.MeshStandardMaterial;
            material.emissiveIntensity = 0.5 + Math.sin(state.clock.elapsedTime * 2) * 0.2;
        }
    });

    return (
        <group position={[0, SCREEN_HEIGHT / 2, SCREEN_DISTANCE]}>
            <mesh ref={screenRef}>
                <planeGeometry args={[SCREEN_WIDTH, SCREEN_HEIGHT]} />
                <meshStandardMaterial
                    color={isPlaying ? "#ffffff" : "#333333"}
                    emissive="#ffffff"
                    emissiveIntensity={0.5}
                />
            </mesh>
            {countdown > 0 && (
                <Text position={[0, 0, 0.1]} fontSize={2} color="#ffffff" anchorX="center" anchorY="middle">
                    {countdown}
                </Text>
            )}
            {isPlaying && (
                <Text position={[0, 0, 0.1]} fontSize={1} color="#ffffff" anchorX="center" anchorY="middle">
                    Now Playing
                </Text>
            )}
        </group>
    );
}

function Theater() {
    const [isLightsOn, setIsLightsOn] = useState(true);
    const [isPlaying, setIsPlaying] = useState(false);
    const [selectedSeat, setSelectedSeat] = useState<number | null>(null);
    const [hoveredSeat, setHoveredSeat] = useState<number | null>(null);

    // Refs for animations
    const sconceLightsRef = useRef<THREE.PointLight[]>([]);
    const spotlightRef = useRef<THREE.SpotLight>(null);
    const screenLightRef = useRef<THREE.RectAreaLight>(null);

    // Theater state management
    const handleCountdownEnd = useCallback(() => {
        setIsLightsOn(false);
    }, []);

    const handlePlayingChange = useCallback((playing: boolean) => {
        setIsPlaying(playing);
    }, []);

    // Ambient lighting animation
    useFrame((state, delta) => {
        // Animate sconce lights
        sconceLightsRef.current.forEach((light, i) => {
            if (light) {
                light.intensity = 0.5 + Math.sin(state.clock.elapsedTime * 2 + i) * 0.1;
            }
        });

        // Screen glow effect
        if (screenLightRef.current) {
            screenLightRef.current.intensity = isPlaying ? 1 + Math.sin(state.clock.elapsedTime * 2) * 0.2 : 0.5;
        }

        // Spotlight movement
        if (spotlightRef.current && isLightsOn) {
            spotlightRef.current.position.x = Math.sin(state.clock.elapsedTime * 0.5) * 5;
        }
    });

    // Seat interaction handlers
    const handleSeatClick = (seatIndex: number) => {
        setSelectedSeat(seatIndex === selectedSeat ? null : seatIndex);
    };

    const handleSeatHover = (seatIndex: number | null) => {
        setHoveredSeat(seatIndex);
    };

    return (
        <group>
            {/* Theater Environment */}
            <fog attach="fog" args={["#000000", 10, 50]} />
            <ambientLight intensity={isLightsOn ? 0.5 : 0.2} />

            {/* Main Spotlight */}
            <spotLight
                ref={spotlightRef}
                position={[0, 15, 0]}
                angle={0.6}
                penumbra={1}
                intensity={isLightsOn ? 1.5 : 0.3}
                castShadow
                shadow-mapSize-width={2048}
                shadow-mapSize-height={2048}
            />

            {/* Additional Fill Lights */}
            <pointLight position={[10, 10, 10]} intensity={0.3} />
            <pointLight position={[-10, 10, 10]} intensity={0.3} />

            {/* Wall Sconces */}
            {Array.from({ length: 6 }).map((_, i) => (
                <pointLight
                    key={`sconce-${i}`}
                    ref={(el) => (sconceLightsRef.current[i] = el!)}
                    position={[i < 3 ? -8 : 8, 5, -5 + (i % 3) * 5]}
                    intensity={0.8}
                    distance={5}
                    color="#ffaa44"
                />
            ))}

            {/* Screen Light */}
            <rectAreaLight
                ref={screenLightRef}
                position={[0, SCREEN_HEIGHT / 2, SCREEN_DISTANCE + 0.1]}
                width={SCREEN_WIDTH}
                height={SCREEN_HEIGHT}
                intensity={1.5}
                color="#ffffff"
            />

            {/* Movie Screen */}
            <MovieScreen onCountdownEnd={handleCountdownEnd} onPlayingChange={handlePlayingChange} />

            {/* Theater Walls */}
            <mesh position={[0, 5, -20]} receiveShadow>
                <boxGeometry args={[40, 20, 0.5]} />
                <meshStandardMaterial color="#222222" metalness={0.2} roughness={0.8} />
            </mesh>

            {/* Side Walls */}
            {[-1, 1].map((side) => (
                <mesh key={`wall-${side}`} position={[side * 20, 5, -10]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
                    <boxGeometry args={[20, 20, 0.5]} />
                    <meshStandardMaterial color="#222222" metalness={0.2} roughness={0.8} />
                </mesh>
            ))}

            {/* Floor */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -10]} receiveShadow>
                <planeGeometry args={[40, 20]} />
                <meshStandardMaterial color="#331111" metalness={0.1} roughness={0.9} />
            </mesh>

            {/* Audience */}
            {Array.from({ length: AUDIENCE_ROWS }).map((_, rowIndex) =>
                Array.from({ length: SEATS_PER_ROW }).map((_, seatIndex) => {
                    const seatId = rowIndex * SEATS_PER_ROW + seatIndex;
                    const isSelected = selectedSeat === seatId;
                    const isHovered = hoveredSeat === seatId;

                    return (
                        <group
                            key={`seat-${rowIndex}-${seatIndex}`}
                            position={[
                                (seatIndex - SEATS_PER_ROW / 2 + 0.5) * 1.5,
                                1 + rowIndex * 0.8,
                                -3 + rowIndex * 2.5,
                            ]}
                            onClick={() => handleSeatClick(seatId)}
                            onPointerOver={() => handleSeatHover(seatId)}
                            onPointerOut={() => handleSeatHover(null)}
                        >
                            <mesh castShadow>
                                <capsuleGeometry args={[0.25, 1, 4, 8]} />
                                <meshStandardMaterial
                                    color={isSelected ? "#ff4444" : isHovered ? "#aaaaaa" : "#666666"}
                                    emissive={isSelected ? "#ff0000" : isHovered ? "#444444" : "#000000"}
                                    emissiveIntensity={0.5}
                                    metalness={0.1}
                                    roughness={0.8}
                                />
                            </mesh>
                        </group>
                    );
                }),
            )}
        </group>
    );
}

export default function MovieTheater() {
    return (
        <Canvas shadows style={{ width: "100%", height: "100%" }}>
            <Suspense fallback={null}>
                <PerspectiveCamera makeDefault position={[0, 8, 20]} fov={60} near={0.1} far={1000} />
                <OrbitControls
                    enableZoom={true}
                    maxPolarAngle={Math.PI / 2}
                    minPolarAngle={Math.PI / 6}
                    maxAzimuthAngle={Math.PI / 3}
                    minAzimuthAngle={-Math.PI / 3}
                    maxDistance={25}
                    minDistance={10}
                />
                <Theater />
                <Environment preset="night" />
            </Suspense>
        </Canvas>
    );
}

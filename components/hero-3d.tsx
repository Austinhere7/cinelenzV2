"use client"

import { Canvas, extend, useFrame, useThree } from "@react-three/fiber"
import { useAspect, useTexture } from "@react-three/drei"
import { useMemo, useRef, useState, useEffect } from "react"
import * as THREE from "three"
import type { Mesh } from "three"

const TEXTUREMAP = { src: "https://i.postimg.cc/XYwvXN8D/img-4.png" }
const DEPTHMAP = { src: "https://i.postimg.cc/2SHKQh2q/raw-4.webp" }

extend(THREE as any)

const PostProcessing = ({
  strength = 1,
  threshold = 1,
  fullScreenEffect = true,
}: {
  strength?: number
  threshold?: number
  fullScreenEffect?: boolean
}) => {
  const { gl, scene, camera } = useThree()
  const progressRef = useRef(0)

  useFrame(({ clock }) => {
    // Animate the scan line from top to bottom
    progressRef.current = Math.sin(clock.getElapsedTime() * 0.5) * 0.5 + 0.5
    gl.render(scene, camera)
  }, 1)

  return null
}

const Scene = () => {
  const [rawMap, depthMap] = useTexture([TEXTUREMAP.src, DEPTHMAP.src])

  const meshRef = useRef<Mesh>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Show image after textures load
    if (rawMap && depthMap) {
      setVisible(true)
    }
  }, [rawMap, depthMap])

  const { material, uniforms } = useMemo(() => {
    const vertexShader = `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `

    const fragmentShader = `
      uniform sampler2D uTexture;
      uniform sampler2D uDepthMap;
      uniform vec2 uPointer;
      uniform float uProgress;
      uniform float uTime;
      varying vec2 vUv;

      void main() {
        float depth = texture2D(uDepthMap, vUv).r;
        vec2 offset = depth * uPointer * 0.01;
        vec3 color = texture2D(uTexture, vUv + offset).rgb;
        
        // Add scanning effect
        float scanLine = abs(vUv.y - uProgress);
        float scan = smoothstep(0.0, 0.05, scanLine);
        vec3 redOverlay = vec3(1.0, 0.0, 0.0) * (1.0 - scan) * 0.4;
        
        // Add grid pattern
        vec2 grid = mod(vUv * 120.0, 2.0) - 1.0;
        float gridDist = length(grid);
        float dot = smoothstep(0.5, 0.49, gridDist);
        
        // Flow effect
        float flow = 1.0 - smoothstep(0.0, 0.02, abs(depth - uProgress));
        vec3 mask = vec3(dot * flow * 10.0, 0.0, 0.0);
        
        color = color + mask + redOverlay;
        
        gl_FragColor = vec4(color, 1.0);
      }
    `

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTexture: { value: rawMap },
        uDepthMap: { value: depthMap },
        uPointer: { value: new THREE.Vector2(0) },
        uProgress: { value: 0 },
        uTime: { value: 0 },
      },
      transparent: true,
    })

    return {
      material,
      uniforms: material.uniforms,
    }
  }, [rawMap, depthMap])

  const [w, h] = useAspect(300, 300)

  useFrame(({ clock, pointer }) => {
    if (uniforms) {
      uniforms.uProgress.value = Math.sin(clock.getElapsedTime() * 0.5) * 0.5 + 0.5
      uniforms.uPointer.value = pointer
      uniforms.uTime.value = clock.getElapsedTime()
    }

    // Smooth fade in
    if (meshRef.current && material) {
      material.opacity = THREE.MathUtils.lerp(material.opacity, visible ? 1 : 0, 0.07)
    }
  })

  const scaleFactor = 0.42
  return (
    <mesh ref={meshRef} scale={[w * scaleFactor, h * scaleFactor, 1]} material={material}>
      <planeGeometry />
    </mesh>
  )
}

const RedAmbient = () => {
  const { camera, size } = useThree()
  const meshRef = useRef<Mesh>(null)
  const materialRef = useRef<THREE.ShaderMaterial | null>(null)

  // Compute plane scale to perfectly cover the viewport at a given Z
  const z = -0.3
  const distance = camera.position.z - z
  const height = 2 * Math.tan((camera.fov * Math.PI) / 360) * distance
  const width = height * (size.width / size.height)

  // Get theme primary color from CSS tokens (hsl(var(--primary)))
  const primaryRgb = useMemo(() => {
    if (typeof window === "undefined") return new THREE.Color(1, 0, 0)
    const root = getComputedStyle(document.documentElement)
    const hslRaw = root.getPropertyValue("--primary").trim() // e.g., "0 72% 51%"
    const [hStr, sStr, lStr] = hslRaw.split(" ")
    const h = Number.parseFloat(hStr || "0")
    const s = Number.parseFloat((sStr || "0%").replace("%", "")) / 100
    const l = Number.parseFloat((lStr || "50%").replace("%", "")) / 100

    // HSL to RGB (0..1)
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1
      if (t > 1) t -= 1
      if (t < 1 / 6) return p + (q - p) * 6 * t
      if (t < 1 / 2) return q
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
      return p
    }
    let r = l,
      g = l,
      b = l
    if (s !== 0) {
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s
      const p = 2 * l - q
      const hh = (h % 360) / 360
      r = hue2rgb(p, q, hh + 1 / 3)
      g = hue2rgb(p, q, hh)
      b = hue2rgb(p, q, hh - 1 / 3)
    }
    return new THREE.Color(r, g, b)
  }, [])

  const material = useMemo(() => {
    const vertexShader = `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `
    const fragmentShader = `
      varying vec2 vUv;
      uniform float uTime;
      uniform vec3 uPrimary;

      // soft radial glow
      float glow(vec2 p, vec2 center, float radius, float softness) {
        float d = length(p - center);
        return smoothstep(radius, radius - softness, d);
      }

      void main() {
        // center and animate two glows
        vec2 p = vUv - 0.5;

        vec2 c1 = vec2(0.22 * sin(uTime * 0.15), 0.18 * cos(uTime * 0.12));
        vec2 c2 = vec2(-0.18 * cos(uTime * 0.1), -0.24 * sin(uTime * 0.17));

        float g1 = glow(p, c1, 0.55, 0.45);
        float g2 = glow(p, c2, 0.65, 0.50);

        // subtle scan shimmer
        float scan = 0.12 * smoothstep(0.0, 0.02, abs(fract(uTime * 0.05) - (vUv.y)));

        // combine glows; keep subtle
        float intensity = g1 * 0.35 + g2 * 0.25 + scan;
        vec3 col = uPrimary * intensity;

        gl_FragColor = vec4(col, clamp(intensity, 0.0, 0.5));
      }
    `
    const m = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uPrimary: { value: new THREE.Color(primaryRgb.r, primaryRgb.g, primaryRgb.b) },
      },
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
    materialRef.current = m
    return m
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [primaryRgb])

  useFrame(({ clock }) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = clock.getElapsedTime()
    }
  })

  return (
    <mesh ref={meshRef} position={[0, 0, z]} scale={[width, height, 1]} material={material}>
      <planeGeometry args={[1, 1, 1, 1]} />
    </mesh>
  )
}

export const Html = () => {
  const titleWords = "CineLenz".split(" ")
  const subtitle = "See cinema through the social lens in real time: threads, sentiment, and trends."
  const [visibleWords, setVisibleWords] = useState(0)
  const [subtitleVisible, setSubtitleVisible] = useState(false)
  const [delays, setDelays] = useState<number[]>([])
  const [subtitleDelay, setSubtitleDelay] = useState(0)

  useEffect(() => {
    // Only on client: generate random delays for glitch
    setDelays(titleWords.map(() => Math.random() * 0.07))
    setSubtitleDelay(Math.random() * 0.1)
  }, [titleWords.length])

  useEffect(() => {
    if (visibleWords < titleWords.length) {
      const timeout = setTimeout(() => setVisibleWords(visibleWords + 1), 600)
      return () => clearTimeout(timeout)
    } else {
      const timeout = setTimeout(() => setSubtitleVisible(true), 800)
      return () => clearTimeout(timeout)
    }
  }, [visibleWords, titleWords.length])

  return (
    <div className="h-svh bg-background relative w-full overflow-hidden">
      <div className="absolute inset-0 pointer-events-none z-50">
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-background via-background/80 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background via-background/80 to-transparent"></div>
        <div className="absolute top-0 bottom-0 left-0 w-32 bg-gradient-to-r from-background via-background/80 to-transparent"></div>
        <div className="absolute top-0 bottom-0 right-0 w-32 bg-gradient-to-l from-background via-background/80 to-transparent"></div>
      </div>

      <div className="absolute inset-0 bg-background/20 z-10 pointer-events-none"></div>

      <div className="h-svh items-center w-full absolute z-60 pointer-events-none px-10 flex justify-center flex-col">
        <div className="text-4xl md:text-5xl xl:text-6xl 2xl:text-7xl font-extrabold font-sans tracking-tight">
          <div className="flex space-x-2 lg:space-x-6 overflow-hidden text-foreground drop-shadow-2xl">
            {titleWords.map((word, index) => (
              <div
                key={index}
                className={index < visibleWords ? "fade-in" : ""}
                style={{
                  animationDelay: `${index * 0.13 + (delays[index] || 0)}s`,
                  opacity: index < visibleWords ? undefined : 0,
                  textShadow: "0 0 20px rgba(255, 255, 255, 0.5), 0 0 40px rgba(255, 0, 0, 0.3)",
                }}
              >
                {word}
              </div>
            ))}
          </div>
        </div>
        <div className="text-lg md:text-xl mt-2 overflow-hidden text-foreground font-bold">
          <div
            className={`${subtitleVisible ? "fade-in-subtitle" : ""} max-w-4xl mx-auto text-center px-4`}
            style={{
              animationDelay: `${titleWords.length * 0.13 + 0.2 + subtitleDelay}s`,
              opacity: subtitleVisible ? undefined : 0,
              textShadow: "0 0 15px rgba(255, 255, 255, 0.3)",
            }}
          >
            {subtitle}
          </div>
          {/* Add Get Started button below the subtitle */}
          <div className="mt-14 md:mt-16 flex justify-center pointer-events-auto">
            <a href="/get-started" aria-label="Get started with CineLenz">
              <button className="px-3 py-1.5 text-xs md:text-sm rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground font-geist transition-all duration-200 shadow-md hover:shadow-primary/30 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60">
                Get Started
              </button>
            </a>
          </div>
        </div>
      </div>

      <Canvas
        className="absolute inset-0 w-full h-full bg-background"
        camera={{
          position: [0, 0, 1],
          fov: 75,
          near: 0.1,
          far: 1000,
        }}
        gl={{
          antialias: true,
          alpha: false,
          preserveDrawingBuffer: true,
        }}
        dpr={[1, 2]}
      >
        <PostProcessing fullScreenEffect={true} />
        <RedAmbient />
        <Scene />
      </Canvas>
    </div>
  )
}

export default Html

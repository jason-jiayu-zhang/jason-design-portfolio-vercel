import React, { useEffect, useRef, useState } from 'react'
import {
  snapAngle,
  angleToProjectIndex,
  projectIndexToAngle,
  applyFriction,
  clampVelocity,
  getMouseAngle,
  springToward,
  angularDelta,
  safeMod,
  SNAP_COUNT
} from '../utils/wheelMath'
import type { WheelState } from '../types/portfolio'
import { PROJECTS } from '../data/portfolio'
import GeometricWheel, { type WheelHandle } from './GeometricWheel'

interface WheelSelectorProps {
  onProjectChange: (index: number) => void
  activeIndex: number
}

const FRICTION = 0.88
const SPRING_STIFFNESS = 0.12
const SNAP_THRESHOLD = 0.4 // deg/frame

export default function WheelSelector({ onProjectChange, activeIndex }: WheelSelectorProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const rafRef = useRef<number>(0)
  const wheelHandleRef = useRef<WheelHandle>(null)

  const wheelRef = useRef<WheelState>({
    angle: projectIndexToAngle(0),
    targetAngle: projectIndexToAngle(0),
    activeIndex: 0,
    velocity: 0,
    isDragging: false,
  })

  // Only used to trigger re-render when active project changes (not every rAF frame)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_renderIndex, setRenderIndex] = useState(0)
  const wheelAccumulator = useRef(0)
  const hasScrolledThisGesture = useRef(false)
  const scrollTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  // ── ANIMATION LOOP ────────────────────────────────────────────────────────

  useEffect(() => {
    let lastTime = performance.now()

    const tick = (now: number) => {
      const dt = Math.min(now - lastTime, 32)
      lastTime = now

      const w = wheelRef.current

      if (!w.isDragging) {
        w.velocity = applyFriction(w.velocity, FRICTION)

        if (Math.abs(w.velocity) < SNAP_THRESHOLD) {
          w.angle = springToward(w.angle, w.targetAngle, SPRING_STIFFNESS)

          const newIndex = angleToProjectIndex(w.targetAngle)
          if (newIndex !== w.activeIndex) {
            w.activeIndex = newIndex
            onProjectChange(newIndex)
            // Only trigger a React re-render when the active item changes
            setRenderIndex(newIndex)
          }
        } else {
          w.angle += w.velocity * (dt / 16)
          w.targetAngle = snapAngle(w.angle)
        }
      }

      // Mutate the DOM directly — zero React overhead per frame
      wheelHandleRef.current?.setRotation(w.angle)

      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [onProjectChange])

  // ── DRAG HANDLERS ────────────────────────────────────────────────────────

  const dragStartAngle = useRef(0)
  const dragLastAngle = useRef(0)
  const dragLastTime = useRef(0)

  const onPointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId)
    const rect = svgRef.current!.getBoundingClientRect()
    const cx = rect.width / 2
    const cy = rect.height / 2
    const mouseAngle = getMouseAngle(e, rect, cx, cy)

    dragStartAngle.current = mouseAngle - wheelRef.current.angle
    dragLastAngle.current = mouseAngle
    dragLastTime.current = performance.now()
    wheelRef.current.isDragging = true
    wheelRef.current.velocity = 0
  }

  const onPointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!wheelRef.current.isDragging) return
    const rect = svgRef.current!.getBoundingClientRect()
    const cx = rect.width / 2
    const cy = rect.height / 2
    const mouseAngle = getMouseAngle(e, rect, cx, cy)

    // directly map the wheel angle without modulo
    const newAngle = mouseAngle - dragStartAngle.current
    const now = performance.now()
    const dt = now - dragLastTime.current

    if (dt > 0) {
      const delta = angularDelta(wheelRef.current.angle, newAngle)
      wheelRef.current.velocity = clampVelocity(delta / (dt / 16), 14)
    }

    wheelRef.current.angle = newAngle
    dragLastAngle.current = mouseAngle
    dragLastTime.current = now
  }

  const onPointerUp = () => {
    if (wheelRef.current.isDragging) {
      wheelRef.current.isDragging = false
      wheelRef.current.targetAngle = snapAngle(wheelRef.current.angle)
    }
  }

  // ── SCROLL WHEEL HANDLER ─────────────────────────────────────────────────

  useEffect(() => {
    const el = svgRef.current
    if (!el) return

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()
      
      // Reset the "stop scrolling" timer on every wheel event
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current)
      scrollTimeout.current = setTimeout(() => {
        hasScrolledThisGesture.current = false
        wheelAccumulator.current = 0
      }, 75)

      if (wheelRef.current.isDragging) return
      
      // Provide a max cooldown to prevent long trackpad momentum from permanently locking the wheel
      const now = Date.now()
      // We assume lastScrollTime is stored in a ref (we'll add it above)
      if (hasScrolledThisGesture.current) {
        if (now - (wheelRef.current as any).lastScrollTime < 800) {
          return
        } else {
          // It's been 800ms since the last scroll triggered, allow another one despite momentum
          hasScrolledThisGesture.current = false
          wheelAccumulator.current = 0
        }
      }
      
      wheelAccumulator.current += e.deltaY

      if (Math.abs(wheelAccumulator.current) > 30) {
        const direction = Math.sign(wheelAccumulator.current)
        wheelAccumulator.current = 0
        hasScrolledThisGesture.current = true
        ;(wheelRef.current as any).lastScrollTime = now
        
        const currentIndex = wheelRef.current.activeIndex
        // scroll down (positive delta) -> next index, scroll up -> prev index
        const nextIndex = safeMod(currentIndex + direction, SNAP_COUNT)
        
        onProjectChange(nextIndex)
      }
    }

    el.addEventListener('wheel', handleWheel, { passive: false })
    return () => {
      el.removeEventListener('wheel', handleWheel)
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current)
    }
  }, [onProjectChange])

  // ── PROGRAMMATIC SNAP (from external activeIndex change) ─────────────────

  useEffect(() => {
    if (wheelRef.current.isDragging) return
    const target = projectIndexToAngle(activeIndex, wheelRef.current.targetAngle)
    wheelRef.current.targetAngle = target
    wheelRef.current.activeIndex = activeIndex
    wheelRef.current.velocity = 0
  }, [activeIndex])

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 600 600"
      className="w-full h-full wheel-cursor no-select"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
      style={{ touchAction: 'none' }}
    >
      <GeometricWheel
        ref={wheelHandleRef}
        rotationAngle={wheelRef.current.angle}
        activeIndex={activeIndex}
        projects={PROJECTS}
      />
    </svg>
  )
}

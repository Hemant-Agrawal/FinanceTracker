"use client"

import { useEffect, type RefObject } from "react"

export function useTouchGestures(
  ref: RefObject<HTMLElement | null>,
  onZoom: (scale: number) => void,
  onRotate: (angle: number) => void,
) {
  useEffect(() => {
    const element = ref.current
    if (!element) return

    let initialDistance = 0
    let initialAngle = 0
    let initialTouchCount = 0

    const getDistance = (touches: TouchList) => {
      return Math.hypot(touches[0].clientX - touches[1].clientX, touches[0].clientY - touches[1].clientY)
    }

    const getAngle = (touches: TouchList) => {
      return (
        (Math.atan2(touches[1].clientY - touches[0].clientY, touches[1].clientX - touches[0].clientX) * 180) / Math.PI
      )
    }

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        initialDistance = getDistance(e.touches)
        initialAngle = getAngle(e.touches)
        initialTouchCount = 2
      }
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2 && initialTouchCount === 2) {
        // Handle pinch to zoom
        const currentDistance = getDistance(e.touches)
        const scale = currentDistance / initialDistance
        if (Math.abs(scale - 1) > 0.01) {
          onZoom(scale)
          initialDistance = currentDistance
        }

        // Handle rotation
        const currentAngle = getAngle(e.touches)
        const angleDiff = currentAngle - initialAngle
        if (Math.abs(angleDiff) > 1) {
          onRotate(angleDiff)
          initialAngle = currentAngle
        }
      }
    }

    const handleTouchEnd = () => {
      initialTouchCount = 0
    }

    element.addEventListener("touchstart", handleTouchStart)
    element.addEventListener("touchmove", handleTouchMove)
    element.addEventListener("touchend", handleTouchEnd)

    return () => {
      element.removeEventListener("touchstart", handleTouchStart)
      element.removeEventListener("touchmove", handleTouchMove)
      element.removeEventListener("touchend", handleTouchEnd)
    }
  }, [ref, onZoom, onRotate])
}


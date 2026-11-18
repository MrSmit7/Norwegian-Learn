import { useState, useRef } from "react"

export function useStoppable() {
  const [isStopped, setIsStopped] = useState(false)
  const stopRef = useRef(null)

  const stop = () => {
    setIsStopped(true)
    stopRef.current?.()
  }

  const resume = () => {
    setIsStopped(false)
    stopRef.current?.()
  }

  return { isStopped, stop, resume }
}

export function useTabOrder() {
  const tabIndexRef = useRef<HTMLElement | null>(null)

  const nextElement = (element: HTMLElement) => {
    tabIndexRef.current = element
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      if (tabIndexRef.current) tabIndexRef.current.focus()
    }
  }

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault()
        if (tabIndexRef.current) tabIndexRef.current.focus()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  return { tabIndexRef, nextElement, handleKeyDown }
}
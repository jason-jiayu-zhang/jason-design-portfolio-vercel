import React, { createContext, useContext, useEffect, useState } from 'react'

export type IntroPhase = 'initial' | 'phase01' | 'phase02' | 'phase03'

interface IntroContextType {
  phase: IntroPhase
  hasLoaded: boolean
}

const IntroContext = createContext<IntroContextType>({
  phase: 'phase03', // Default to phase 3 for safety if not wrapped
  hasLoaded: true,
})

export function useIntro() {
  return useContext(IntroContext)
}

export function IntroProvider({ children }: { children: React.ReactNode }) {
  const [hasLoaded, setHasLoaded] = useState(() => {
    return sessionStorage.getItem('introPlayed') === 'true'
  })
  const [phase, setPhase] = useState<IntroPhase>(() => {
    return sessionStorage.getItem('introPlayed') === 'true' ? 'phase03' : 'initial'
  })

  useEffect(() => {
    if (sessionStorage.getItem('introPlayed') === 'true') {
      return
    }

    setHasLoaded(false)
    
    // Initial buffer: 500ms (allows browser to paint dark screen first)
    const timer0 = setTimeout(() => {
      setPhase('phase01')
    }, 500)
    
    // Phase 02: 2100ms after phase01 (2600ms total - overlaps end of wheel draw by 300ms)
    const timer1 = setTimeout(() => {
      setPhase('phase02')
    }, 2600)

    // Phase 03: 1400ms after phase02 (4000ms total)
    const timer2 = setTimeout(() => {
      setPhase('phase03')
      sessionStorage.setItem('introPlayed', 'true')
    }, 4000)

    return () => {
      clearTimeout(timer0)
      clearTimeout(timer1)
      clearTimeout(timer2)
    }
  }, [])

  return (
    <IntroContext.Provider value={{ phase, hasLoaded }}>
      {children}
    </IntroContext.Provider>
  )
}

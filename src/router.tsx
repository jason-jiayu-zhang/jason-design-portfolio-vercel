// ─────────────────────────────────────────────────────────────────────────────
// CLIENT-SIDE ROUTER
// ─────────────────────────────────────────────────────────────────────────────

import React from 'react'
import { createBrowserRouter, RouterProvider, Outlet, ScrollRestoration } from 'react-router-dom'
import App from './App'
import Header from './components/Header'
import Footer from './components/Footer'
import ProjectCaseStudyPage from './pages/ProjectCaseStudyPage'
import ExperimentLogPage from './pages/ExperimentLogPage'
import { ScanlineProvider, useScanline } from './components/ScanlineContext'

// ── Shell wrapper for sub-pages (Header + Footer only) ───────────────────────
function PageShell({ children }: { children: React.ReactNode }) {
  const { scanlineActive } = useScanline()
  return (
    <div className={`min-h-screen flex flex-col bg-primary${scanlineActive ? ' scanline-overlay' : ''}`}>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}

function RootLayout() {
  return (
    <>
      <ScrollRestoration />
      <Outlet />
    </>
  )
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <App />,
      },
      {
        path: 'work/:slug',
        element: (
          <PageShell>
            <ProjectCaseStudyPage />
          </PageShell>
        ),
      },
      {
        path: 'studio/:id',
        element: (
          <PageShell>
            <ExperimentLogPage />
          </PageShell>
        ),
      },
    ],
  },
])


export function RouterRoot() {
  return (
    <ScanlineProvider>
      <RouterProvider router={router} />
    </ScanlineProvider>
  )
}

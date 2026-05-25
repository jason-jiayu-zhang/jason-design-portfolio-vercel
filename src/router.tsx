// ─────────────────────────────────────────────────────────────────────────────
// CLIENT-SIDE ROUTER
// ─────────────────────────────────────────────────────────────────────────────

import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import App from './App'
import Header from './components/Header'
import Footer from './components/Footer'
import ProjectCaseStudyPage from './pages/ProjectCaseStudyPage'
import ExperimentLogPage from './pages/ExperimentLogPage'

// ── Shell wrapper for sub-pages (Header + Footer only) ───────────────────────
function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-primary scanline-overlay">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/work/:slug',
    element: (
      <PageShell>
        <ProjectCaseStudyPage />
      </PageShell>
    ),
  },
  {
    path: '/studio/:id',
    element: (
      <PageShell>
        <ExperimentLogPage />
      </PageShell>
    ),
  },
])

export function RouterRoot() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

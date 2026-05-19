import { BrowserRouter } from 'react-router-dom'
import { AppRoutes } from './router'
import { LanguageProvider } from './context/LanguageContext'
import { Component, ReactNode } from 'react'

class ErrorBoundary extends Component<{ children: ReactNode }, { error: string | null }> {
  state = { error: null }
  static getDerivedStateFromError(e: Error) { return { error: e.message } }
  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: 40, fontFamily: 'sans-serif', color: '#111' }}>
          <h2 style={{ color: '#8B2FC9' }}>Erreur de chargement</h2>
          <pre style={{ background: '#f3f4f6', padding: 16, borderRadius: 8, marginTop: 12, fontSize: 13 }}>
            {this.state.error}
          </pre>
        </div>
      )
    }
    return this.props.children
  }
}

export default function App() {
  return (
    <ErrorBoundary>
      <LanguageProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </LanguageProvider>
    </ErrorBoundary>
  )
}

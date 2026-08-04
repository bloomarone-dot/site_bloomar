import { Component, type ErrorInfo, type ReactNode } from "react";

type Props = { children: ReactNode };
type State = { hasError: boolean };

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("[Bloomar CMS]", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6 dark:bg-bloomar-navy">
          <div className="card max-w-md p-8 text-center">
            <h1 className="text-xl font-bold text-bloomar-navy dark:text-white">Une erreur est survenue</h1>
            <p className="mt-2 text-sm text-slate-500">Rechargez la page ou contactez l&apos;administrateur.</p>
            <button className="btn-primary mt-6" onClick={() => window.location.reload()}>
              Recharger
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

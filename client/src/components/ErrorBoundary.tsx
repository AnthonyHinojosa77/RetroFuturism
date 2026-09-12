import { Component, type ReactNode, type ErrorInfo } from "react";
import { Link } from "wouter";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  error: Error | null;
}

/** Catches render errors anywhere below it and shows a themed fallback instead of a blank page. */
export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error("Render error caught by ErrorBoundary:", error, info.componentStack);
  }

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;

    return (
      <div className="min-h-screen bg-[hsl(25,30%,12%)] paper-texture flex items-center justify-center px-4">
        <div className="discovery-panel relative mx-auto w-full" style={{ maxWidth: 480 }}>
          <div className="discovery-panel-header">
            <span>Transmission Error</span>
          </div>
          <div className="discovery-panel-body text-center">
            <div className="starburst-badge mx-auto mb-3" style={{ width: 56, height: 56, fontSize: "0.6rem" }}>
              LOST!
            </div>
            <p className="pulp-title text-lg text-[hsl(0,72%,42%)] tracking-wider mb-2">
              Houston, we have a problem.
            </p>
            <p className="text-sm text-[hsl(25,40%,20%)] leading-relaxed mb-1">
              The retro universe glitched while rendering this page.
            </p>
            <p className="text-xs text-[hsl(25,15%,50%)] italic mb-4 break-all">
              {error.message}
            </p>
            <div className="flex gap-2 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="retro-btn text-sm"
                data-testid="button-reload-page"
              >
                ★ Try Again
              </button>
              <Link href="/">
                <a className="retro-btn teal text-sm inline-block" data-testid="link-back-home">
                  ← Back to Hub
                </a>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

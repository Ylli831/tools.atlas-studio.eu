"use client";

import { Component, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallbackMessage?: string;
  resetLabel?: string;
}

interface State {
  hasError: boolean;
}

export default class ToolErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.error("Tool error:", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="bg-card border border-border rounded-xl p-8 text-center">
          <div className="w-12 h-12 rounded-full bg-danger/10 flex items-center justify-center mx-auto mb-4">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--danger)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <p className="text-foreground font-medium mb-2">
            {this.props.fallbackMessage || "Something went wrong"}
          </p>
          <p className="text-sm text-muted-foreground mb-4">
            Try reloading or uploading a different file.
          </p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="bg-teal text-white font-medium px-5 py-2 rounded-lg hover:bg-teal-hover transition-colors text-sm"
          >
            {this.props.resetLabel || "Try again"}
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

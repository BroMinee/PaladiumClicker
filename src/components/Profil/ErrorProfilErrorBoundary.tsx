"use client";
import React from "react";

interface ErrorBoundaryProps {
  fallback: React.ReactNode;
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

/**
 * Wrap components that may throw runtime/rendering errors (e.g., WebGL, charts, experimental code)
 * to prevent the entire UI from crashing.
 */
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  /**
   * Initializes the ErrorBoundary component state.
   *
   * @param props - Component props including the fallback UI and children.
   */
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  /**
   * Explicit
   * @param _
   */
  static getDerivedStateFromError(_: Error): ErrorBoundaryState {
    return { hasError: true };
  }

  /**
   * Explicit
   * @param error
   * @param errorInfo
   */
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error in WebGL component:", error, errorInfo);
  }

  /**
   * Explicit
   */
  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }

    return this.props.children;
  }
}

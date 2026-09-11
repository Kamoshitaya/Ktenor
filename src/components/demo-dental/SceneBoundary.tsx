"use client";

import { Component, type ReactNode } from "react";

/**
 * Keeps a failed 3D scene inside its own box.
 *
 * Without this the whole demo goes down with the model. The scene is mounted
 * through Suspense, so a rejected load — the GLB is 2.5 MB, and a dropped
 * connection is all it takes — is re-thrown at the nearest error boundary,
 * and the nearest one was the route's. Visitors got the site-wide "something
 * went wrong" page for a decoration that failed to arrive. The teeth are also
 * listed as buttons next to the canvas, so with the scene boxed off the
 * section still works exactly as it does for anyone on a keyboard.
 */
export class SceneBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

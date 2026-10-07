import { Component } from "react";

export default class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    console.error("CLOCKWYRD UI ERROR:", error);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <main className="flex min-h-[100dvh] items-center justify-center bg-[#07101d] px-5 text-[#edf5ff]">
        <div className="w-full max-w-xl border border-red-400/20 bg-[#0a1727] p-8">
          <p className="cw-label text-red-300">CLOCKWYRD / RECOVERY</p>
          <h1 className="mt-4 text-3xl font-bold">Something broke.</h1>
          <p className="mt-3 text-sm leading-6 text-[#8ea2ba]">The page hit an unexpected error. Reloading is safe; your local drafts are preserved.</p>
          <button onClick={() => window.location.reload()} className="cw-button mt-7">Reload page</button>
        </div>
      </main>
    );
  }
}

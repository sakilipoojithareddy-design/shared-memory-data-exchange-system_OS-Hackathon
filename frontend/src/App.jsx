import React, { useState } from "react";

const API = "http://localhost:5000";

export default function App() {
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function runDemo() {
    setLoading(true);
    setError("");
    setOutput("");

    try {
      const response = await fetch(`${API}/api/run-demo`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "The demo could not run.");
      }

      setOutput(data.output);
    } catch (err) {
      setError(
        "Could not connect to the backend. Check that the backend server is running on port 5000."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="page">
      <header className="hero">
        <div className="tag">OPERATING SYSTEMS · HACKATHON 2026</div>
        <h1>Shared Memory</h1>
        <h2>Based Data Exchange System</h2>
        <p>
          Explore how multiple processes exchange information through shared
          memory while maintaining data consistency.
        </p>
        <div className="hero-buttons">
          <button onClick={runDemo} disabled={loading}>
            {loading ? "Running demo..." : "▶ Run Shared Memory Demo"}
          </button>
          <span className="status">
            <span className="dot" /> Backend API · Port 5000
          </span>
        </div>
      </header>

      <section className="stats">
        <article className="stat-card">
          <span>01</span>
          <h3>Shared Memory</h3>
          <p>Processes access a common memory region.</p>
        </article>
        <article className="stat-card">
          <span>02</span>
          <h3>Synchronization</h3>
          <p>A semaphore coordinates safe access.</p>
        </article>
        <article className="stat-card">
          <span>03</span>
          <h3>Data Exchange</h3>
          <p>A child process sends a message to its parent.</p>
        </article>
      </section>

      <section className="panel">
        <div className="panel-heading">
          <div>
            <div className="eyebrow">LIVE EXECUTION</div>
            <h2>Process Output</h2>
          </div>
          <span className={output ? "badge success" : "badge"}>
            {loading ? "Running" : output ? "Completed" : "Ready"}
          </span>
        </div>

        <p className="panel-description">
          Click the button above to execute the C program and display its
          actual output here.
        </p>

        {error && <div className="error">{error}</div>}

        <pre className="terminal">
          {output ||
            (loading
              ? "Executing the shared-memory program..."
              : "Waiting for execution...\n\nYour process output will appear here.")}
        </pre>

        {output && (
          <div className="result">
            <span>✓</span> Demo executed successfully
          </div>
        )}
      </section>

      <section className="info-grid">
        <article className="info-card">
          <h3>How it works</h3>
          <ol>
            <li>Create a shared memory region.</li>
            <li>Create a child process using fork().</li>
            <li>Synchronize access using a semaphore.</li>
            <li>Exchange a message through shared memory.</li>
          </ol>
        </article>
        <article className="info-card">
          <h3>Technologies Used</h3>
          <div className="chips">
            <span>C</span>
            <span>POSIX Shared Memory</span>
            <span>Semaphores</span>
            <span>React</span>
            <span>Node.js</span>
            <span>Express</span>
          </div>
        </article>
      </section>

      <footer>
        Shared Memory Based Data Exchange System · Operating Systems Hackathon
        2026
      </footer>
    </main>
  );
}

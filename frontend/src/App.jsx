import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    requesterId: "",
    requesterName: "",
    title: "",
    description: "",
    category: "",
    priority: "MEDIUM",
  });

  // Fetch tickets from the backend
  const fetchTickets = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/tickets");

      if (!response.ok) {
        throw new Error("Failed to fetch tickets");
      }

      const data = await response.json();
      setTickets(data.tickets);
      setError("");
    } catch (err) {
      setError("Unable to connect to the backend. Please check the server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  // Handle form input changes
  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  // Submit a new ticket
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch("/api/tickets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create ticket");
      }

      setForm({
        requesterId: "",
        requesterName: "",
        title: "",
        description: "",
        category: "",
        priority: "MEDIUM",
      });

      await fetchTickets();
      alert("Ticket submitted successfully!");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="app">
      <header className="header">
        <div>
          <h1>IT Support Center</h1>
          <p>Manage your IT support requests in one place.</p>
        </div>
        <span className="system-status">Support Portal</span>
      </header>

      <main className="container">
        <section className="summary">
          <div className="summary-card">
            <h3>Total Tickets</h3>
            <p>{tickets.length}</p>
          </div>
          <div className="summary-card">
            <h3>Open Tickets</h3>
            <p>{tickets.filter((ticket) => ticket.status === "OPEN").length}</p>
          </div>
          <div className="summary-card">
            <h3>Resolved Tickets</h3>
            <p>
              {tickets.filter((ticket) => ticket.status === "RESOLVED").length}
            </p>
          </div>
        </section>

        <section className="panel">
          <h2>Submit a Support Ticket</h2>

          <form onSubmit={handleSubmit} className="ticket-form">
            <div className="form-row">
              <div className="form-group">
                <label>Your ID</label>
                <input
                  name="requesterId"
                  value={form.requesterId}
                  onChange={handleChange}
                  placeholder="e.g. STU001"
                  required
                />
              </div>

              <div className="form-group">
                <label>Your Name</label>
                <input
                  name="requesterName"
                  value={form.requesterName}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Ticket Title</label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Briefly describe your issue"
                required
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Explain the issue in detail..."
                rows="4"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Category</label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select a category</option>
                  <option value="Hardware">Hardware</option>
                  <option value="Software">Software</option>
                  <option value="Network">Network</option>
                  <option value="Account">Account</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label>Priority</label>
                <select
                  name="priority"
                  value={form.priority}
                  onChange={handleChange}
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="CRITICAL">Critical</option>
                </select>
              </div>
            </div>

            <button type="submit" className="submit-button">
              Submit Ticket
            </button>
          </form>
        </section>

        <section className="panel">
          <div className="section-heading">
            <h2>Recent Support Tickets</h2>
            <button onClick={fetchTickets} className="refresh-button">
              Refresh
            </button>
          </div>

          {loading && <p>Loading tickets...</p>}
          {error && <p className="error">{error}</p>}

          {!loading && !error && tickets.length === 0 && (
            <p>No tickets have been submitted yet.</p>
          )}

          {!loading && !error && tickets.length > 0 && (
            <div className="ticket-list">
              {tickets.map((ticket) => (
                <article className="ticket-card" key={ticket.id}>
                  <div>
                    <h3>{ticket.title}</h3>
                    <p>{ticket.description}</p>
                    <small>
                      {ticket.requesterName} · {ticket.category} ·{" "}
                      {new Date(ticket.createdAt).toLocaleString()}
                    </small>
                  </div>

                  <div className="ticket-labels">
                    <span
                      className={`priority ${ticket.priority.toLowerCase()}`}
                    >
                      {ticket.priority}
                    </span>
                    <span className="status">{ticket.status}</span>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;

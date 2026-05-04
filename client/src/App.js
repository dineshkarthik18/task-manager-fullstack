import { useState, useEffect } from "react";

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // ---------------- AUTH ----------------

  const signup = async () => {
    setLoading(true);
    const res = await fetch("http://localhost:5000/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    setMessage(data.msg || "Signup done");
    setLoading(false);
  };

  const login = async () => {
    setLoading(true);
    const res = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();

    if (data.token) {
      localStorage.setItem("token", data.token);
      setToken(data.token);
      setMessage("Login successful");
    } else {
      setMessage("Login failed");
    }

    setLoading(false);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setTasks([]);
    setMessage("Logged out");
  };

  // ---------------- TASKS ----------------

  const getTasks = async () => {
    const res = await fetch("http://localhost:5000/api/tasks", {
      headers: { Authorization: token },
    });

    const data = await res.json();
    if (Array.isArray(data)) setTasks(data);
    else setTasks([]);
  };

  const addTask = async () => {
    if (!task.trim()) {
      setMessage("Enter task first");
      return;
    }

    setLoading(true);

    await fetch("http://localhost:5000/api/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({ title: task }),
    });

    setTask("");
    setMessage("Task added");
    setLoading(false);
    getTasks();
  };

  const deleteTask = async (id) => {
    await fetch(`http://localhost:5000/api/tasks/${id}`, {
      method: "DELETE",
      headers: { Authorization: token },
    });

    setMessage("Task deleted");
    getTasks();
  };

  useEffect(() => {
    if (token) getTasks();
  }, [token]);

  // ---------------- UI ----------------

  return (
    <div style={{ background: "#f5f5f5", minHeight: "100vh", paddingTop: "50px" }}>
      <div
        style={{
          width: "360px",
          margin: "auto",
          background: "white",
          padding: "20px",
          borderRadius: "10px",
          boxShadow: "0px 0px 10px rgba(0,0,0,0.1)",
          textAlign: "center",
        }}
      >
        <h2 style={{ marginBottom: "10px" }}>🚀 Task Manager</h2>

        {message && (
          <p style={{ color: "green", marginBottom: "10px" }}>{message}</p>
        )}

        {!token ? (
          <>
            <input
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
            />

            <input
              placeholder="Password"
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
            />

            <button
              onClick={signup}
              disabled={loading}
              style={{ width: "48%", padding: "8px", marginRight: "4%" }}
            >
              {loading ? "Please wait..." : "Signup"}
            </button>

            <button
              onClick={login}
              disabled={loading}
              style={{ width: "48%", padding: "8px" }}
            >
              {loading ? "Please wait..." : "Login"}
            </button>
          </>
        ) : (
          <>
            <div style={{ display: "flex", marginBottom: "10px" }}>
              <input
                value={task}
                onChange={(e) => setTask(e.target.value)}
                placeholder="Enter task"
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                }}
              />
              <button onClick={addTask} disabled={loading} style={{ marginLeft: "5px" }}>
                {loading ? "..." : "Add"}
              </button>
            </div>

            <button
              onClick={logout}
              style={{
                marginBottom: "10px",
                background: "red",
                color: "white",
                border: "none",
                padding: "6px",
                cursor: "pointer",
                borderRadius: "5px",
              }}
            >
              Logout
            </button>

            <ul style={{ listStyle: "none", padding: 0 }}>
              {tasks.length === 0 ? (
                <p style={{ color: "gray" }}>
                  No tasks yet. Add your first task 🚀
                </p>
              ) : (
                tasks.map((t) => (
                  <li
                    key={t._id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      border: "1px solid #ddd",
                      padding: "8px",
                      marginTop: "5px",
                      borderRadius: "5px",
                    }}
                  >
                    {t.title}
                    <button
                      onClick={() => deleteTask(t._id)}
                      style={{
                        color: "red",
                        border: "none",
                        cursor: "pointer",
                        background: "transparent",
                      }}
                    >
                      ✖
                    </button>
                  </li>
                ))
              )}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
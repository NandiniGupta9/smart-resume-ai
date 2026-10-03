import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchAnalyses } from "../services/api";

export default function History() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAnalyses()
      .then(setItems)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="card">
      <h2>Analysis History</h2>
      {error && <p className="error">{error}</p>}
      {!error && items.length === 0 && <p className="muted">No analyses yet.</p>}
      {items.length > 0 && (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Resume Name</th>
                <th>ATS Score</th>
                <th>Date</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {items.map((a) => (
                <tr key={a._id}>
                  <td>{a.resumeName}</td>
                  <td>{a.atsScore}/100</td>
                  <td>{new Date(a.createdAt).toLocaleDateString()}</td>
                  <td><Link to={`/result/${a._id}`}>View</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

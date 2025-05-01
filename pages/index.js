import { useState } from 'react';

export default function Home() {
  const [studentId, setStudentId] = useState('');
  const [result, setResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCheckResult = async () => {
    setLoading(true);
    setResult([]);
    setError('');

    const res = await fetch(`/api/fetchResult?studentId=${studentId}`);
    const data = await res.json();

    if (data.result) {
      setResult(data.result);
    } else {
      setError(data.error || 'No result found');
    }

    setLoading(false);
  };

  // Get CGPA if available
  const cgpa = result.length > 0 ? result[0].cgpa : null;
  const semesterInfo = result.length > 0 ? `${result[0].semesterName} ${result[0].semesterYear}` : null;

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>🎓 DIU Result Checker</h1>
      <p style={{textAlign: 'center', marginTop: '-1rem', color: '#666'}}>Developer: Shaikat Zaman Shipon</p>

      <div style={styles.inputGroup}>
        <input
          type="text"
          placeholder="Enter Student ID"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
          style={styles.input}
        />
        <button onClick={handleCheckResult} style={styles.button}>
          {loading ? 'Loading...' : 'Check Result'}
        </button>
      </div>

      {error && <p style={styles.error}>{error}</p>}

      {result.length > 0 && (
        <div style={styles.resultBox}>
          <p><strong>📘 Student ID:</strong> {result[0].studentId}</p>
          <p><strong>📅 Semester:</strong> {semesterInfo}</p>
          <p><strong>🎯 CGPA:</strong> {cgpa ?? 'Pending'}</p>
          <p><strong>📌 Status:</strong> {result.some(r => r.gradeLetter.includes("pending")) ? 'Evaluation Pending' : 'Completed'}</p>

          <h2 style={styles.subHeading}>📚 Course Details</h2>
          <table style={styles.table}>
            <thead>
              <tr>
                <th>Course Code</th>
                <th>Title</th>
                <th>Credit</th>
                <th>Grade</th>
                <th>Grade Point</th>
              </tr>
            </thead>
            <tbody>
              {result.map((course, index) => (
                <tr key={index}>
                  <td>{course.customCourseId}</td>
                  <td>{course.courseTitle}</td>
                  <td>{course.totalCredit}</td>
                  <td>{course.gradeLetter}</td>
                  <td>{course.pointEquivalent ?? 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// Basic styles
const styles = {
  container: {
    fontFamily: 'Segoe UI, sans-serif',
    padding: '2rem',
    backgroundColor: '#f4f6f9',
    minHeight: '100vh',
  },
  heading: {
    textAlign: 'center',
    fontSize: '2rem',
    marginBottom: '1.5rem',
  },
  inputGroup: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '2rem',
  },
  input: {
    padding: '0.5rem',
    fontSize: '1rem',
    width: '300px',
    border: '1px solid #ccc',
    borderRadius: '4px 0 0 4px',
  },
  button: {
    padding: '0.5rem 1rem',
    fontSize: '1rem',
    backgroundColor: '#0070f3',
    color: 'white',
    border: 'none',
    borderRadius: '0 4px 4px 0',
    cursor: 'pointer',
  },
  error: {
    color: 'red',
    textAlign: 'center',
  },
  resultBox: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '10px',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
    maxWidth: '900px',
    margin: '0 auto',
  },
  subHeading: {
    marginTop: '2rem',
    marginBottom: '1rem',
    fontSize: '1.2rem',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '0.95rem',
  },
  th: {
    backgroundColor: '#0070f3',
    color: 'white',
    padding: '10px',
  },
  td: {
    border: '1px solid #ddd',
    padding: '8px',
  },
};
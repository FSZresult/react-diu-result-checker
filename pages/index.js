import { useState } from 'react';

export default function Home() {
  const [studentId, setStudentId] = useState('');
  const [result, setResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCheckResult = async () => {
    if (!studentId.trim()) {
      setError("⚠️ Please enter a valid Student ID.");
      return;
    }

    setLoading(true);
    setResult([]);
    setError('');

    try {
      const res = await fetch(`/api/fetchResult?studentId=${studentId}`);
      const data = await res.json();

      if (res.ok && data.result) {
        setResult(data.result);
      } else {
        setError(data.error || '⚠️ No result found.');
      }
    } catch (err) {
      setError('❌ Something went wrong. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const cgpa = result.length > 0 ? result[0].cgpa : null;
  const semesterInfo = result.length > 0 ? `${result[0].semesterName} ${result[0].semesterYear}` : null;

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.heading}>🎓 DIU Smart Result Checker</h1>
        <p style={styles.dev}>🚀 Developed by Shaikat Zaman Shipon</p>

        <div style={styles.inputGroup}>
          <input
            type="text"
            placeholder="Enter Student ID"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            style={styles.input}
          />
          <button onClick={handleCheckResult} style={styles.button} disabled={loading}>
            {loading ? 'Checking...' : 'Check Result'}
          </button>
        </div>

        {error && <p style={styles.error}>{error}</p>}

        {result.length > 0 && (
          <div style={styles.resultBox}>
          <h2 style={{ ...styles.resultHeading, color: '#006400' }}>📋 Result Summary</h2> 
            <div style={styles.resultInfo}>
              <p><strong>🆔 <span style={{ color: '#0070f3' }}>Student ID:</span></strong> <span style={styles.resultValue}>{result[0].studentId}</span></p>
              <p><strong>📅 <span style={{ color: '#0070f3' }}>Semester:</span></strong> <span style={styles.resultValue}>{semesterInfo}</span></p>
              <p><strong>🎯 <span style={{ color: '#0070f3' }}>SGPA:</span></strong> <span style={{ color: '#D35400', fontWeight: 'bold' }}>{cgpa ?? 'Pending'}</span></p>
              <p><strong>📌 <span style={{ color: '#0070f3' }}>Status:</span></strong>
                <span style={{ color: result.some(r => r.gradeLetter.toLowerCase().includes("pending")) ? '#d9534f' : '#27AE60', fontWeight: 'bold' }}>
                  {result.some(r => r.gradeLetter.toLowerCase().includes("pending")) ? 'Evaluation Pending' : 'Completed'}
                </span>
              </p>
            </div>

            <table style={styles.table}>
              <thead>
                <tr style={styles.tableHeaderRow}>
                  <th style={styles.tableHeader}>📚 Code</th>
                  <th style={styles.tableHeader}>Course Title</th>
                  <th style={styles.tableHeader}>Credit</th>
                  <th style={styles.tableHeader}>Grade</th>
                  <th style={styles.tableHeader}>Point</th>
                </tr>
              </thead>
              <tbody>
                {result.map((course, index) => (
                  <tr key={index} style={index % 2 === 0 ? styles.evenRow : styles.oddRow}>
                    <td style={{ color: '#006400' }}>{course.customCourseId}</td> {/* Dark Green */}
                    <td style={{ color: '#006400' }}>{course.courseTitle}</td> {/* Dark Green */}
                    <td style={{ color: '#006400' }}>{course.totalCredit}</td> {/* Dark Green */}
                    <td style={{ fontWeight: 'bold', color: '#006400' }}>{course.gradeLetter}</td> {/* Dark Green */}
                    <td style={{ color: '#006400' }}>{course.pointEquivalent ?? 'N/A'}</td> {/* Dark Green */}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// 🔧 Enhanced Styles with Sky Blue Background
const styles = {
  container: {
    fontFamily: 'Poppins, sans-serif',
    background: '#87CEEB', // Sky Blue
    minHeight: '100vh',
    padding: '3rem 1rem',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: '16px',
    boxShadow: '0 20px 30px rgba(64, 14, 226, 0)',
    padding: '2.5rem',
    width: '100%',
    maxWidth: '950px',
  },
  heading: {
    fontSize: '2.5rem',
    textAlign: 'center',
    marginBottom: '0.2rem',
    color: '#222',
  },
  dev: {
    textAlign: 'center',
    marginBottom: '2rem',
    color: '#666',
    fontSize: '0.95rem',
  },
  inputGroup: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '2rem',
  },
  input: {
    padding: '0.75rem',
    fontSize: '1rem',
    width: '300px',
    borderRadius: '8px 0 0 8px',
    border: '1px solid #ccc',
    outline: 'none',
  },
  button: {
    padding: '0.75rem 1.5rem',
    fontSize: '1rem',
    backgroundColor: '#0070f3',
    color: '#fff',
    border: 'none',
    borderRadius: '0 8px 8px 0',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  error: {
    color: '#d9534f',
    textAlign: 'center',
    marginBottom: '1rem',
  },
  resultBox: {
    marginTop: '2rem',
    background: '#ffffff',
    padding: '1.5rem',
    borderRadius: '12px',
    border: '1px solid #eee',
  },
  resultHeading: {
    fontSize: '1.4rem',
    marginBottom: '1rem',
    borderBottom: '2px solid #0070f3',
    paddingBottom: '0.5rem',
  },
  resultInfo: {
    marginBottom: '1.5rem',
    lineHeight: '1.8',

  },
  resultValue: {
    color: '#222222',
    fontWeight: '5000',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '0.95rem',
    textAlign: 'left',
  },
  tableHeaderRow: {
    backgroundColor: '#0070f3',
    color: '#fff',
  },
  tableHeader: {
    padding: '12px',
    fontWeight: '600',
  },
  evenRow: {
    backgroundColor: '#f9f9f9',
    padding: '10px 12px',
  },
  oddRow: {
    backgroundColor: '#ffffff',
    padding: '10px 12px',
  },

};
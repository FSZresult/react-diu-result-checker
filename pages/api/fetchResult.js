import axios from 'axios';

export default async function handler(req, res) {
  const { studentId } = req.query;

  if (!studentId) {
    return res.status(400).json({ error: 'Student ID is required' });
  }

  const url = `http://software.diu.edu.bd:8189/result?grecaptcha=&semesterId=251&studentId=${studentId}`;

  try {
    const response = await axios.get(url);
    const data = response.data;

    // Check if data is an array and contains valid course info
    if (Array.isArray(data) && data.length > 0 && data[0].studentId) {
      return res.status(200).json({ result: data });
    }

    // If API returns an empty array
    if (Array.isArray(data) && data.length === 0) {
      return res.status(404).json({ error: 'No results found for this Student ID.' });
    }

    // If API returns something unexpected (e.g., object or HTML)
    return res.status(400).json({ error: 'Unexpected response from server.', raw: data });

  } catch (error) {
    return res.status(500).json({
      error: 'Failed to fetch result.',
      detail: error.message,
    });
  }
}

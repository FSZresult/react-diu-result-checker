import axios from 'axios';

export default async function handler(req, res) {
  const { studentId } = req.query;

  if (!studentId) {
    return res.status(400).json({ error: 'Student ID is required' });
  }

  const url = `http://software.diu.edu.bd:8189/result?grecaptcha=&semesterId=251&studentId=${studentId}`;

  try {
    const response = await axios.get(url);

    if (Array.isArray(response.data)) {
      res.status(200).json({ result: response.data });
    } else {
      res.status(404).json({ error: 'Invalid response format' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch result', detail: error.message });
  }
}

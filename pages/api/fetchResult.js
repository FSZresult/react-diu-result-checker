import axios from 'axios';

export default async function handler(req, res) {
  const { studentId } = req.query;

  // If no studentId is provided, redirect to the alternative link
  if (!studentId) {
    return res.redirect(302, 'https://studentportal.diu.edu.bd/academic-result');
  }

  const url = `http://software.diu.edu.bd:8189/result?grecaptcha=&semesterId=251&studentId=${studentId}`;

  try {
    const response = await axios.get(url);
    const data = response.data;

    // Check if data is an array and contains valid course info
    if (Array.isArray(data) && data.length > 0 && data[0].studentId) {
      return res.status(200).json({ 
        result: data,
        alternativeLink: 'https://studentportal.diu.edu.bd/academic-result'
      });
    }

    // If API returns an empty array
    if (Array.isArray(data) && data.length === 0) {
      return res.status(404).json({ 
        error: 'No results found for this Student ID.',
        alternativeLink: 'https://studentportal.diu.edu.bd/academic-result'
      });
    }

    // If API returns something unexpected (e.g., object or HTML)
    return res.status(400).json({ 
      error: 'Unexpected response from server.',
      raw: data,
      alternativeLink: 'https://studentportal.diu.edu.bd/academic-result'
    });

  } catch (error) {
    return res.status(500).json({
      error: 'Failed to fetch result.',
      detail: error.message,
      alternativeLink: 'https://studentportal.diu.edu.bd/academic-result'
    });
  }
}

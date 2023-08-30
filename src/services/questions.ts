const API_URL = import.meta.env.PROD ? 'https://javascript-quiz-8axo.onrender.com' : 'http://localhost:5173'


export const fetchAllQuestions = async () => {
  const res = await fetch(`${API_URL}/data.json`);
  const json = await res.json();
  return json;
};

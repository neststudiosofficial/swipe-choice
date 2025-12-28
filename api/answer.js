import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { questionId, choice, sessionId } = req.body;

  if (questionId === undefined || !choice) {
    return res.status(400).json({ error: 'Missing questionId or choice' });
  }

  const { error } = await supabase.from('survey_answers').insert({
    question_id: Number(questionId),
    choice: String(choice),
    session_id: sessionId ? String(sessionId) : null,
    user_agent: req.headers['user-agent'] || null,
  });

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.status(200).json({ success: true });
}

import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { OpenAI } from 'openai'

dotenv.config()

const app = express()

// ✅ Correct universal CORS setup
app.use(cors({
  origin: 'https://refactored-engine-v6ppjpgp9gw43qx5-5173.app.github.dev',
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))

app.use(express.json())

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

app.post('/api/generate-bio', async (req, res) => {
  const { name, role, skills } = req.body

  try {
    const response = await openai.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: `Write a short and friendly founder bio for a person named ${name}, who is a ${role}, skilled in ${skills}`,
        },
      ],
      model: 'gpt-3.5-turbo',
    })

    const bio = response.choices[0]?.message?.content
    res.json({ bio })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'OpenAI API error' })
  }
})

app.post('/api/match-cofounders', async (req, res) => {
  const { currentUser, otherUsers } = req.body;

  try {
    const prompt = `
You are a cofounder-matching assistant. 

Given this founder's profile:
Name: ${currentUser.name}
Role: ${currentUser.role}
Skills: ${currentUser.skills}
Bio: ${currentUser.bio}

Rank the following users by how well they'd match as cofounders. Consider complementary skills, roles, and synergy based on their bios. Return a ranked list with names and a short reason for each.

${otherUsers.map((u, i) => `${i + 1}. ${u.name} (${u.role}) - Skills: ${u.skills} | Bio: ${u.bio}`).join('\n')}
    `;

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
    });

    const matches = response.choices[0]?.message?.content;
    res.json({ matches });
  } catch (err) {
    console.error('Error in /api/match-cofounders:', err);
    res.status(500).json({ error: 'Matching failed' })
  }
})

app.listen(3000, () => {
  console.log('✅ Backend running on http://localhost:3000')
})

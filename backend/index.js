// backend/index.js
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { OpenAI } from 'openai'

dotenv.config()

const app = express()
app.use(cors())
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

app.listen(3000, () => {
  console.log('Backend running on http://localhost:3000')
})

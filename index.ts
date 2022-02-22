import express from 'express'
import cors from 'cors'
import Database from 'better-sqlite3'

const app = express()
app.use(cors())
app.use(express.json())

const db = new Database('./interviews_data.db', {
  verbose: console.log
})

const getAllInterviewers = db.prepare(`
SELECT * FROM interviewers;
`)

const getAllApplicants = db.prepare(`
SELECT * FROM applicants;
`)

const getApplicantsForInterviewer = db.prepare(`
SELECT DISTINCT applicants.* FROM applicants
JOIN interviews ON applicants.id = interviews.applicantId
WHERE interviews.interviewerId = ?;
`)

const getInterviewersForApplicant = db.prepare(`
SELECT DISTINCT interviewers.* FROM interviewers
JOIN interviews ON interviewers.id = interviews.interviewerId
WHERE interviews.ApplicantId = ?;
`)

const createInterviewer = db.prepare(`
INSERT INTO Interviewers (name, email) VALUES (?, ?);
`)
const createApplicant = db.prepare(`
INSERT INTO applicants (name, email) VALUES (?, ?);
`)
const createInterview = db.prepare(`
INSERT INTO interviews (interviewerId, applicantId, score, date) VALUES (?, ? , ?, ?);
`)

const getInterviewById = db.prepare(`
SELECT * FROM interviews WHERE id = ?;
`)

const getInterviewerById = db.prepare(`
SELECT * FROM interviewers WHERE id = ?;
`)

const getApplicantById = db.prepare(`
SELECT * FROM applicants WHERE id = ?;
`)

app.get('/interviewers', (req, res) => {
  const interviewers = getAllInterviewers.all()

  for (const interviewer of interviewers) {
    const applicants = getApplicantsForInterviewer.all(interviewer.id)
    interviewer.applicants = applicants
  }
  res.send(interviewers)
})

app.post('/interviewers', (req, res) => {
  const {name, email} = req.body
  const errors = []

  if (typeof name !== "string") errors.push(`name not a string`)
  if (typeof email !== "string") errors.push(`email not a string`)

  if (errors.length === 0) {
    const info = createInterviewer.run(name, email)
    const interviewer = getInterviewerById.get(info.lastInsertRowid)
    res.status(201).send(interviewer)
  } else res.status(400).send({ errors: errors })
})

app.get('/applicants', (req, res) => {
  const applicants = getAllApplicants.all()

  for (const applicant of applicants) {
    const interviewers = getInterviewersForApplicant.all(applicant.id)
    applicant.interviewers = interviewers
  }
  res.send(applicants)
})

app.post('/applicants', (req, res) => {
  const {name, email} = req.body
  const errors = []

  if (typeof name !== "string") errors.push(`name not a string`)
  if (typeof email !== "string") errors.push(`email not a string`)

  if (errors.length === 0) {
    const info = createApplicant.run(name, email)
    const applicant = getApplicantById.get(info.lastInsertRowid)
    res.status(201).send(applicant)
  } else res.status(400).send({ errors: errors })
})

app.post('/interviews', (req, res) => {
  const {interviewerId, applicantId, score, date} = req.body
  const errors = []

  if (typeof interviewerId !== "number") errors.push(`interviewerId not a number`)
  if (typeof applicantId !== "number") errors.push(`applicantId not a number`)
  if (typeof score !== "number") errors.push(`score not a number`)
  if (typeof date !== "string") errors.push(`email not a string`)

  if (errors.length === 0) {
    const interviewer = getInterviewerById.get(interviewerId)
    const applicant = getApplicantById.get(applicantId)
    const errors = []

    if (!interviewer) errors.push(`interviewer not found`)
    if (!applicant) errors.push(`applicant not found`)

    if (errors.length === 0) {
      const info = createInterview.run(interviewerId, applicantId, score, date)
      const interview = getInterviewById.get(info.lastInsertRowid)
      res.status(201).send(interview)
    } else res.status(404).send({ errors: errors })
    
  } else res.status(400).send({ errors: errors })
})

app.listen(4000, () => {
  console.log(`Server up: http://localhost:4000`)
})
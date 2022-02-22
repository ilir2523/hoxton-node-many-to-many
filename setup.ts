import Database from 'better-sqlite3'

const db = new Database('./interviews_data.db', {
  verbose: console.log
})

const interviewers = [
  {
    name: 'Endi',
    email: 'Endi@email.com'
  },
  {
    name: 'Geri',
    email: 'Geri@email.com'
  },
  {
    name: 'Ed',
    email: 'Ed@email.com'
  },
  {
    name: 'Ilir',
    email: 'Ilir@email.com'
  }
]

const applicants = [
  {
    name: 'Rinor',
    email: 'Rinor@email.com'
  },
  {
    name: 'Elidon',
    email: 'Elidon@email.com'
  },
  {
    name: 'Visard',
    email: 'Visard@email.com'
  },
  {
    name: 'Desintila',
    email: 'Desintila@email.com'
  },
  {
    name: 'Artiola',
    email: 'Artiola@email.com'
  }
]

// interviews
const interviews = [
  {
    interviewerId: 1,
    applicantId: 1,
    score: 20.3,
    date: '2/22/2022'
  },
  {
    interviewerId: 1,
    applicantId: 2,
    score: 30.3,
    date: '2/22/2022'
  },
  {
    interviewerId: 1,
    applicantId: 3,
    score: 40.3,
    date: '2/22/2022'
  },
  {
    interviewerId: 1,
    applicantId: 4,
    score: 100.3,
    date: '2/22/2022'
  },
  {
    interviewerId: 1,
    applicantId: 5,
    score: 101.3,
    date: '2/22/2022'
  },
  {
    interviewerId: 2,
    applicantId: 1,
    score: 40.3,
    date: '2/22/2022'
  },
  {
    interviewerId: 1,
    applicantId: 3,
    score: 70.3,
    date: '2/22/2022'
  },
  {
    interviewerId: 1,
    applicantId: 5,
    score: 100.3,
    date: '2/22/2022'
  },
  {
    interviewerId: 4,
    applicantId: 1,
    score: 50.3,
    date: '2/22/2022'
  },
  {
    interviewerId: 4,
    applicantId: 2,
    score: 80.7,
    date: '2/22/2022'
  }
]

db.exec(`
DROP TABLE IF EXISTS interviews;
DROP TABLE IF EXISTS interviewers;
DROP TABLE IF EXISTS applicants;

CREATE TABLE IF NOT EXISTS interviewers (
  id INTEGER,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS applicants (
  id INTEGER,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS interviews (
  id INTEGER,
  interviewerId INTEGER NOT NULL,
  applicantId INTEGER NOT NULL,
  score REAL NOT NULL,
  date TEXT NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (interviewerId) REFERENCES interviewers(id),
  FOREIGN KEY (applicantId) REFERENCES applicants(id)
);
`)

const createInterviewer = db.prepare(`
INSERT INTO interviewers (name, email) VALUES (?,?);
`)

const createApplicant = db.prepare(`
INSERT INTO applicants (name, email) VALUES (?,?);
`)

const createInterview = db.prepare(`
INSERT INTO interviews (interviewerId, applicantId, score, date)
VALUES (?, ?, ?, ?);
`)

for (const interviewer of interviewers) {
  createInterviewer.run(interviewer.name, interviewer.email)
}

for (const applicant of applicants) {
  createApplicant.run(applicant.name, applicant.email)
}

for (const interview of interviews) {
  createInterview.run(interview.interviewerId, interview.applicantId, interview.score, interview.date)
}

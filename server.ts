import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import {
  users,
  teachers,
  courses,
  students,
  attendanceRecords,
  gradeRecords,
  assignments,
  submissions,
  timetableSlots,
  recalculateStudentStats
} from './server/db.js';
import { AIStudentDiagnostic, Student, GradeRecord, AttendanceRecord, Assignment, Submission } from './src/types.js';

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini AI Client (server-side only)
let aiClient: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  aiClient = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Current active session state for dev/demo simulation
let currentSessionUser = users[0]; // Default: Admin

// -------------------------------------------------------------
// 1. Authentication & RBAC Routes
// -------------------------------------------------------------
app.get('/api/auth/me', (req, res) => {
  res.json({
    user: currentSessionUser,
    availablePersonas: users
  });
});

app.post('/api/auth/login', (req, res) => {
  const { email, role } = req.body;
  let matched = users.find(u => u.email.toLowerCase() === (email || '').toLowerCase());
  
  if (!matched && role) {
    matched = users.find(u => u.role === role);
  }
  
  if (!matched) {
    matched = users[0];
  }

  currentSessionUser = matched;
  res.json({
    message: 'Authenticated successfully',
    token: `jwt-mock-token-${matched.id}-${Date.now()}`,
    user: currentSessionUser
  });
});

app.post('/api/auth/switch-role', (req, res) => {
  const { userId, role } = req.body;
  if (userId) {
    const found = users.find(u => u.id === userId);
    if (found) currentSessionUser = found;
  } else if (role) {
    const found = users.find(u => u.role === role);
    if (found) currentSessionUser = found;
  }
  res.json({
    message: `Switched active role to ${currentSessionUser.role}`,
    user: currentSessionUser
  });
});

// -------------------------------------------------------------
// 2. Dashboard Aggregates
// -------------------------------------------------------------
app.get('/api/stats/dashboard', (req, res) => {
  const totalStudents = students.length;
  const totalCourses = courses.length;
  const totalTeachers = teachers.length;
  const highRiskStudents = students.filter(s => s.riskLevel === 'HIGH').length;
  const lowAttendanceCount = students.filter(s => s.attendanceRate < 75).length;
  const avgGpa = Number((students.reduce((acc, s) => acc + s.gpa, 0) / (totalStudents || 1)).toFixed(2));
  const avgAttendance = Number((students.reduce((acc, s) => acc + s.attendanceRate, 0) / (totalStudents || 1)).toFixed(1));

  res.json({
    totalStudents,
    totalCourses,
    totalTeachers,
    highRiskStudents,
    lowAttendanceCount,
    avgGpa,
    avgAttendance,
    recentAlerts: students
      .filter(s => s.riskLevel === 'HIGH' || s.attendanceRate < 75)
      .map(s => ({
        studentId: s.studentId,
        name: s.name,
        department: s.department,
        attendanceRate: s.attendanceRate,
        gpa: s.gpa,
        reason: s.attendanceRate < 75 ? `Low attendance (${s.attendanceRate}%) under 75% cutoff` : `Academic probation (GPA ${s.gpa})`
      }))
  });
});

// -------------------------------------------------------------
// 3. Students CRUD & Academic Lifecycle
// -------------------------------------------------------------
app.get('/api/students', (req, res) => {
  const { search, department, semester, riskLevel, status } = req.query;
  let filtered = [...students];

  if (search) {
    const q = String(search).toLowerCase();
    filtered = filtered.filter(s =>
      s.name.toLowerCase().includes(q) ||
      s.studentId.toLowerCase().includes(q) ||
      s.email.toLowerCase().includes(q)
    );
  }

  if (department && department !== 'ALL') {
    filtered = filtered.filter(s => s.department === department);
  }

  if (semester && semester !== 'ALL') {
    filtered = filtered.filter(s => s.semester === Number(semester));
  }

  if (riskLevel && riskLevel !== 'ALL') {
    filtered = filtered.filter(s => s.riskLevel === riskLevel);
  }

  if (status && status !== 'ALL') {
    filtered = filtered.filter(s => s.status === status);
  }

  res.json({ students: filtered, total: filtered.length });
});

app.get('/api/students/:id', (req, res) => {
  const id = req.params.id;
  const student = students.find(s => s.id === id || s.studentId === id);
  if (!student) {
    return res.status(404).json({ error: 'Student not found' });
  }

  const studentGrades = gradeRecords.filter(g => g.studentId === student.studentId);
  const studentAttendance = attendanceRecords.filter(a => a.studentId === student.studentId);
  const studentCourses = courses.filter(c => student.enrolledCourseIds.includes(c.id));
  const studentSubmissions = submissions.filter(sub => sub.studentId === student.studentId);

  res.json({
    student,
    grades: studentGrades,
    attendance: studentAttendance,
    courses: studentCourses,
    submissions: studentSubmissions
  });
});

app.post('/api/students', (req, res) => {
  const { name, email, department, semester, phone } = req.body;
  if (!name || !email || !department) {
    return res.status(400).json({ error: 'Name, email, and department are required' });
  }

  const newIndex = students.length + 1;
  const matricId = `STU-2026-${String(newIndex).padStart(3, '0')}`;
  
  const newStudent: Student = {
    id: `stu-${Date.now()}`,
    studentId: matricId,
    name,
    email,
    phone: phone || '+1 (555) 000-0000',
    department,
    semester: Number(semester) || 1,
    enrollmentDate: new Date().toISOString().split('T')[0],
    gpa: 0.0,
    totalCredits: 0,
    status: 'ACTIVE',
    avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80`,
    enrolledCourseIds: courses.slice(0, 3).map(c => c.id),
    attendanceRate: 100.0,
    riskLevel: 'LOW'
  };

  students.unshift(newStudent);
  res.status(201).json({ message: 'Student enrolled successfully', student: newStudent });
});

app.put('/api/students/:id', (req, res) => {
  const id = req.params.id;
  const index = students.findIndex(s => s.id === id || s.studentId === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Student not found' });
  }

  students[index] = {
    ...students[index],
    ...req.body
  };

  recalculateStudentStats(students[index].studentId);

  res.json({ message: 'Student updated', student: students[index] });
});

app.delete('/api/students/:id', (req, res) => {
  const id = req.params.id;
  const index = students.findIndex(s => s.id === id || s.studentId === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Student not found' });
  }

  const removed = students.splice(index, 1);
  res.json({ message: 'Student record archived', student: removed[0] });
});

// -------------------------------------------------------------
// 4. Courses Management & Enrollment
// -------------------------------------------------------------
app.get('/api/courses', (req, res) => {
  res.json({ courses });
});

app.post('/api/courses', (req, res) => {
  const { code, title, department, credits, semester, teacherId, capacity, schedule, syllabus } = req.body;
  if (!code || !title || !department) {
    return res.status(400).json({ error: 'Code, title, and department are required' });
  }

  const assignedTeacher = teachers.find(t => t.id === teacherId) || teachers[0];

  const newCourse = {
    id: `crs-${Date.now()}`,
    code: code.toUpperCase(),
    title,
    department,
    credits: Number(credits) || 3,
    semester: Number(semester) || 1,
    teacherId: assignedTeacher.id,
    teacherName: assignedTeacher.name,
    schedule: schedule || [{ day: 'Monday', time: '10:00 - 11:30', room: 'Lecture Hall 1' }],
    capacity: Number(capacity) || 60,
    enrolledCount: 0,
    syllabus: syllabus || ''
  };

  courses.push(newCourse);
  res.status(201).json({ message: 'Course created', course: newCourse });
});

app.post('/api/courses/:id/enroll', (req, res) => {
  const courseId = req.params.id;
  const { studentId, action } = req.body; // action: 'ENROLL' | 'DROP'

  const course = courses.find(c => c.id === courseId);
  const student = students.find(s => s.id === studentId || s.studentId === studentId);

  if (!course || !student) {
    return res.status(404).json({ error: 'Course or student not found' });
  }

  if (action === 'DROP') {
    student.enrolledCourseIds = student.enrolledCourseIds.filter(id => id !== courseId);
    course.enrolledCount = Math.max(0, course.enrolledCount - 1);
  } else {
    if (!student.enrolledCourseIds.includes(courseId)) {
      student.enrolledCourseIds.push(courseId);
      course.enrolledCount += 1;
    }
  }

  res.json({ message: `Student course mapping updated`, student, course });
});

// -------------------------------------------------------------
// 5. Attendance Tracker & Flags (< 75% cutoff)
// -------------------------------------------------------------
app.get('/api/attendance', (req, res) => {
  const { courseId, studentId, date } = req.query;
  let filtered = [...attendanceRecords];

  if (courseId) {
    filtered = filtered.filter(a => a.courseId === courseId || a.courseCode === courseId);
  }
  if (studentId) {
    filtered = filtered.filter(a => a.studentId === studentId);
  }
  if (date) {
    filtered = filtered.filter(a => a.date === date);
  }

  res.json({ attendance: filtered });
});

app.post('/api/attendance/check-in', (req, res) => {
  const { courseId, studentId, status, date, sessionTopic } = req.body;
  if (!courseId || !studentId || !status) {
    return res.status(400).json({ error: 'courseId, studentId, and status are required' });
  }

  const course = courses.find(c => c.id === courseId || c.code === courseId);
  const student = students.find(s => s.studentId === studentId || s.id === studentId);

  if (!course || !student) {
    return res.status(404).json({ error: 'Course or Student record not found' });
  }

  const checkDate = date || new Date().toISOString().split('T')[0];

  // Upsert check-in
  const existingIdx = attendanceRecords.findIndex(
    a => a.courseId === course.id && a.studentId === student.studentId && a.date === checkDate
  );

  const record: AttendanceRecord = {
    id: existingIdx >= 0 ? attendanceRecords[existingIdx].id : `att-${Date.now()}`,
    courseId: course.id,
    courseCode: course.code,
    studentId: student.studentId,
    studentName: student.name,
    date: checkDate,
    status,
    sessionTopic: sessionTopic || 'Class Session',
    markedBy: currentSessionUser.id
  };

  if (existingIdx >= 0) {
    attendanceRecords[existingIdx] = record;
  } else {
    attendanceRecords.unshift(record);
  }

  recalculateStudentStats(student.studentId);

  res.json({
    message: 'Attendance recorded',
    record,
    updatedStudentRate: student.attendanceRate,
    isBelowThreshold: student.attendanceRate < 75
  });
});

app.post('/api/attendance/bulk', (req, res) => {
  const { courseId, date, sessionTopic, checkIns } = req.body;
  // checkIns: Array<{ studentId: string, status: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED' }>
  if (!courseId || !Array.isArray(checkIns)) {
    return res.status(400).json({ error: 'courseId and checkIns array required' });
  }

  const course = courses.find(c => c.id === courseId || c.code === courseId);
  const checkDate = date || new Date().toISOString().split('T')[0];

  for (const item of checkIns) {
    const student = students.find(s => s.studentId === item.studentId || s.id === item.studentId);
    if (!student) continue;

    const existingIdx = attendanceRecords.findIndex(
      a => (a.courseId === courseId || (course && a.courseId === course.id)) && a.studentId === student.studentId && a.date === checkDate
    );

    const record: AttendanceRecord = {
      id: existingIdx >= 0 ? attendanceRecords[existingIdx].id : `att-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      courseId: course ? course.id : courseId,
      courseCode: course ? course.code : 'COURSE',
      studentId: student.studentId,
      studentName: student.name,
      date: checkDate,
      status: item.status || 'PRESENT',
      sessionTopic: sessionTopic || 'Class Lecture',
      markedBy: currentSessionUser.id
    };

    if (existingIdx >= 0) {
      attendanceRecords[existingIdx] = record;
    } else {
      attendanceRecords.unshift(record);
    }

    recalculateStudentStats(student.studentId);
  }

  res.json({
    message: `Batch attendance processed for ${checkIns.length} students`,
    date: checkDate,
    records: attendanceRecords
  });
});

// -------------------------------------------------------------
// 6. Grades & GPA Engine
// -------------------------------------------------------------
app.get('/api/grades', (req, res) => {
  const { studentId, courseId } = req.query;
  let filtered = [...gradeRecords];

  if (studentId) {
    filtered = filtered.filter(g => g.studentId === studentId);
  }
  if (courseId) {
    filtered = filtered.filter(g => g.courseId === courseId || g.courseCode === courseId);
  }

  res.json({ grades: filtered });
});

app.post('/api/grades', (req, res) => {
  const { studentId, courseId, assignmentsScore, midtermScore, finalExamScore, teacherFeedback } = req.body;
  
  const student = students.find(s => s.studentId === studentId || s.id === studentId);
  const course = courses.find(c => c.id === courseId || c.code === courseId);

  if (!student || !course) {
    return res.status(404).json({ error: 'Student or Course not found' });
  }

  const aScore = Math.min(100, Math.max(0, Number(assignmentsScore) || 0));
  const mScore = Math.min(100, Math.max(0, Number(midtermScore) || 0));
  const fScore = Math.min(100, Math.max(0, Number(finalExamScore) || 0));

  const totalScore = Number(((aScore * 0.3) + (mScore * 0.3) + (fScore * 0.4)).toFixed(2));
  
  let letterGrade: GradeRecord['letterGrade'] = 'F';
  let gradePoint = 0.0;

  if (totalScore >= 90) { letterGrade = 'A+'; gradePoint = 4.0; }
  else if (totalScore >= 85) { letterGrade = 'A'; gradePoint = 4.0; }
  else if (totalScore >= 80) { letterGrade = 'A-'; gradePoint = 3.7; }
  else if (totalScore >= 75) { letterGrade = 'B+'; gradePoint = 3.3; }
  else if (totalScore >= 70) { letterGrade = 'B'; gradePoint = 3.0; }
  else if (totalScore >= 65) { letterGrade = 'B-'; gradePoint = 2.7; }
  else if (totalScore >= 60) { letterGrade = 'C+'; gradePoint = 2.3; }
  else if (totalScore >= 55) { letterGrade = 'C'; gradePoint = 2.0; }
  else if (totalScore >= 50) { letterGrade = 'D'; gradePoint = 1.0; }
  else { letterGrade = 'F'; gradePoint = 0.0; }

  const existingIdx = gradeRecords.findIndex(g => g.studentId === student.studentId && g.courseId === course.id);

  const record: GradeRecord = {
    id: existingIdx >= 0 ? gradeRecords[existingIdx].id : `grd-${Date.now()}`,
    studentId: student.studentId,
    studentName: student.name,
    courseId: course.id,
    courseCode: course.code,
    courseTitle: course.title,
    credits: course.credits,
    semester: student.semester,
    academicYear: '2025-2026',
    assignmentsScore: aScore,
    midtermScore: mScore,
    finalExamScore: fScore,
    totalScore,
    letterGrade,
    gradePoint,
    teacherFeedback: teacherFeedback || '',
    updatedAt: new Date().toISOString().split('T')[0]
  };

  if (existingIdx >= 0) {
    gradeRecords[existingIdx] = record;
  } else {
    gradeRecords.push(record);
  }

  recalculateStudentStats(student.studentId);

  res.json({
    message: 'Grade recorded and GPA recalculated',
    record,
    grade: record,
    newCumulativeGpa: student.gpa
  });
});

// -------------------------------------------------------------
// 7. Assignments & Submissions
// -------------------------------------------------------------
app.get('/api/assignments/submissions', (req, res) => {
  const { assignmentId, studentId } = req.query;
  let filtered = [...submissions];
  if (assignmentId) {
    filtered = filtered.filter(s => s.assignmentId === assignmentId);
  }
  if (studentId) {
    filtered = filtered.filter(s => s.studentId === studentId);
  }
  res.json({ submissions: filtered });
});

app.get('/api/assignments', (req, res) => {
  const { courseId } = req.query;
  let filtered = [...assignments];
  if (courseId) {
    filtered = filtered.filter(a => a.courseId === courseId || a.courseCode === courseId);
  }
  res.json({ assignments: filtered, submissions });
});

app.post('/api/assignments', (req, res) => {
  const { courseId, title, description, dueDate, totalMarks, resourcesUrl } = req.body;
  const course = courses.find(c => c.id === courseId || c.code === courseId);
  if (!course || !title || !dueDate) {
    return res.status(400).json({ error: 'courseId, title, and dueDate are required' });
  }

  const newAssignment: Assignment = {
    id: `asg-${Date.now()}`,
    courseId: course.id,
    courseCode: course.code,
    courseTitle: course.title,
    title,
    description: description || '',
    dueDate,
    totalMarks: Number(totalMarks) || 100,
    resourcesUrl: resourcesUrl || '',
    teacherId: course.teacherId,
    status: 'PUBLISHED'
  };

  assignments.unshift(newAssignment);
  res.status(201).json({ message: 'Assignment published', assignment: newAssignment });
});

app.post('/api/assignments/:id/submit', (req, res) => {
  const assignmentId = req.params.id;
  const { studentId, textSubmission, fileUrl, repositoryUrl } = req.body;

  const assignment = assignments.find(a => a.id === assignmentId);
  const student = students.find(s => s.studentId === studentId || s.id === studentId);

  if (!assignment || !student) {
    return res.status(404).json({ error: 'Assignment or student not found' });
  }

  const existingSubIdx = submissions.findIndex(s => s.assignmentId === assignmentId && s.studentId === student.studentId);
  
  const isLate = new Date() > new Date(assignment.dueDate);

  const sub: Submission = {
    id: existingSubIdx >= 0 ? submissions[existingSubIdx].id : `sub-${Date.now()}`,
    assignmentId,
    studentId: student.studentId,
    studentName: student.name,
    submittedAt: new Date().toISOString(),
    textSubmission: textSubmission || '',
    fileUrl: fileUrl || repositoryUrl || '',
    status: isLate ? 'LATE' : 'SUBMITTED'
  };

  if (existingSubIdx >= 0) {
    submissions[existingSubIdx] = { ...submissions[existingSubIdx], ...sub };
  } else {
    submissions.push(sub);
  }

  res.json({ message: 'Assignment submitted successfully', submission: sub });
});

app.post('/api/assignments/:id/grade', (req, res) => {
  const assignmentId = req.params.id;
  const { studentId, score, feedback } = req.body;

  const sub = submissions.find(s => s.assignmentId === assignmentId && s.studentId === studentId);
  if (!sub) {
    return res.status(404).json({ error: 'Submission not found' });
  }

  sub.score = Number(score);
  sub.feedback = feedback || '';
  sub.status = 'GRADED';

  res.json({ message: 'Submission graded', submission: sub });
});

// -------------------------------------------------------------
// 8. Timetable
// -------------------------------------------------------------
app.get('/api/timetable', (req, res) => {
  res.json({ timetable: timetableSlots });
});

// -------------------------------------------------------------
// 9. Hackathon X-Factor: Gemini AI Performance Analytics
// -------------------------------------------------------------
app.post('/api/ai/performance-analysis', async (req, res) => {
  try {
    const { studentId } = req.body;
    const student = students.find(s => s.studentId === studentId || s.id === studentId);

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    const studentGrades = gradeRecords.filter(g => g.studentId === student.studentId);
    const studentAttendance = attendanceRecords.filter(a => a.studentId === student.studentId);
    const studentSubs = submissions.filter(s => s.studentId === student.studentId);

    const gradeSummary = studentGrades.map(g => `${g.courseCode} (${g.courseTitle}): Total ${g.totalScore}%, Grade ${g.letterGrade}, GPA ${g.gradePoint}`).join('; ');
    const attendanceSummary = `Overall Attendance: ${student.attendanceRate}%. Total Sessions logged: ${studentAttendance.length}. Absent count: ${studentAttendance.filter(a => a.status === 'ABSENT').length}. Late count: ${studentAttendance.filter(a => a.status === 'LATE').length}.`;
    const submissionSummary = `Submissions: ${studentSubs.length} completed.`;

    // Attempt Gemini call if API key is present
    if (process.env.GEMINI_API_KEY && aiClient) {
      try {
        const prompt = `You are a Senior Academic Analytics Specialist and AI Academic Advisor at an elite university.
Analyze the following student academic telemetry and generate a structured diagnostic assessment:

Student Name: ${student.name}
Matriculation ID: ${student.studentId}
Department: ${student.department}, Semester: ${student.semester}
Current Cumulative GPA: ${student.gpa} (out of 4.0)
Status: ${student.status}
Attendance Record: ${attendanceSummary}
Grades Record: ${gradeSummary || 'No formal grades recorded yet'}
Submissions: ${submissionSummary}

Respond ONLY with valid JSON conforming to the following structure:
{
  "studentId": "${student.studentId}",
  "studentName": "${student.name}",
  "academicRiskScore": <number between 0-100, where 0 is pristine and 100 is critical dropout/probation danger>,
  "riskCategory": "<High Risk | Moderate Risk | On Track | High Achiever>",
  "executiveSummary": "<2-3 sentence executive synopsis of their academic momentum and vulnerability factors>",
  "attendanceDiagnosis": {
    "overallPercentage": ${student.attendanceRate},
    "status": "<Critically Low | Borderline | Satisfactory>",
    "criticalCourses": ["<course code if attendance <75%>"],
    "analysis": "<Specific commentary on attendance habit patterns and compliance>"
  },
  "gradeTrajectory": {
    "estimatedGPA": ${student.gpa},
    "trend": "<Improving | Declining | Stagnant>",
    "weakestSubjects": ["<Subject name or code>"],
    "strongestSubjects": ["<Subject name or code>"]
  },
  "keyRiskFactors": [
    "<Concise bullet point 1>",
    "<Concise bullet point 2>",
    "<Concise bullet point 3>"
  ],
  "recommendedInterventions": [
    {
      "priority": "URGENT",
      "action": "<Specific actionable remediation task>",
      "targetDate": "Within 7 Days",
      "responsibleParty": "Student"
    },
    {
      "priority": "RECOMMENDED",
      "action": "<Faculty or advisor support step>",
      "targetDate": "Within 14 Days",
      "responsibleParty": "Course Instructor"
    }
  ],
  "personalizedStudyPlan": [
    { "week": 1, "focus": "<Theme>", "actionItems": ["<Item 1>", "<Item 2>"] },
    { "week": 2, "focus": "<Theme>", "actionItems": ["<Item 1>", "<Item 2>"] },
    { "week": 3, "focus": "<Theme>", "actionItems": ["<Item 1>", "<Item 2>"] },
    { "week": 4, "focus": "<Theme>", "actionItems": ["<Item 1>", "<Item 2>"] }
  ],
  "generatedAt": "${new Date().toISOString()}"
}`;

        const response = await aiClient.models.generateContent({
          model: 'gemini-3.7-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json'
          }
        });

        const text = response.text || '{}';
        const parsed: AIStudentDiagnostic = JSON.parse(text);
        return res.json({ diagnostic: parsed, source: 'gemini-3.7-flash' });
      } catch (geminiErr: any) {
        console.warn('Gemini live call error, using deterministic AI reasoning engine fallback:', geminiErr?.message);
      }
    }

    // High-fidelity fallback heuristic AI diagnostic
    const isHighRisk = student.attendanceRate < 75 || student.gpa < 2.5;
    const isModerate = !isHighRisk && (student.attendanceRate < 85 || student.gpa < 3.2);

    const calculatedRiskScore = isHighRisk 
      ? Math.min(95, Math.max(70, Math.round(100 - (student.gpa * 15) - (student.attendanceRate * 0.4))))
      : isModerate 
        ? Math.round(45 + (3.5 - student.gpa) * 15)
        : Math.max(5, Math.round(25 - (student.gpa * 5)));

    const fallbackDiagnostic: AIStudentDiagnostic = {
      studentId: student.studentId,
      studentName: student.name,
      academicRiskScore: calculatedRiskScore,
      riskCategory: isHighRisk ? 'High Risk' : isModerate ? 'Moderate Risk' : student.gpa >= 3.8 ? 'High Achiever' : 'On Track',
      executiveSummary: isHighRisk
        ? `${student.name} is currently exhibiting critical academic warning flags with an attendance level of ${student.attendanceRate}% and a GPA of ${student.gpa}. Immediate faculty counseling and structured remediation are recommended.`
        : `${student.name} is demonstrating ${student.gpa >= 3.5 ? 'exceptional' : 'steady'} academic trajectory with an attendance rate of ${student.attendanceRate}% and consistent coursework submissions across ${student.department}.`,
      attendanceDiagnosis: {
        overallPercentage: student.attendanceRate,
        status: student.attendanceRate < 75 ? 'Critically Low' : student.attendanceRate < 85 ? 'Borderline' : 'Satisfactory',
        criticalCourses: student.attendanceRate < 75 ? ['CS-301', 'MATH-201'] : [],
        analysis: student.attendanceRate < 75
          ? `Attendance has dipped below the institutional 75% threshold, exposing the student to debarment risk prior to final examinations.`
          : `Consistent classroom engagement maintaining compliance above institutional norms.`
      },
      gradeTrajectory: {
        estimatedGPA: student.gpa,
        trend: isHighRisk ? 'Declining' : student.gpa > 3.5 ? 'Improving' : 'Stagnant',
        weakestSubjects: studentGrades.filter(g => g.totalScore < 70).map(g => g.courseCode).concat(studentGrades.length === 0 ? ['MATH-201'] : []),
        strongestSubjects: studentGrades.filter(g => g.totalScore >= 85).map(g => g.courseCode).concat(studentGrades.length === 0 ? ['CS-301'] : [])
      },
      keyRiskFactors: isHighRisk ? [
        `Attendance deficit (${student.attendanceRate}%) below the 75% semester requirement.`,
        `Low performance in foundational theoretical components (GPA: ${student.gpa}).`,
        `Pending coursework submissions requiring overdue resolution.`
      ] : [
        `Maintaining strong academic baseline across major requirements.`,
        `Upcoming midterm deadlines in high-credit core subjects.`,
        `Recommendation to pursue honors research or advanced elective mapping.`
      ],
      recommendedInterventions: [
        {
          priority: isHighRisk ? 'URGENT' : 'RECOMMENDED',
          action: isHighRisk ? 'Schedule mandatory 1-on-1 counseling with Academic Advisor.' : 'Enroll in peer mentoring for advanced algorithmic optimization.',
          targetDate: 'Within 7 Days',
          responsibleParty: isHighRisk ? 'Advisor' : 'Student'
        },
        {
          priority: 'RECOMMENDED',
          action: 'Complete formative practice assignments to reinforce midterm readiness.',
          targetDate: 'Within 14 Days',
          responsibleParty: 'Course Instructor'
        }
      ],
      personalizedStudyPlan: [
        { week: 1, focus: 'Foundational Diagnostics & Gap Closure', actionItems: ['Review lecture recordings for missed topics', 'Submit overdue assignment drafts'] },
        { week: 2, focus: 'Active Problem Solving & Office Hours', actionItems: ['Attend TA tutorial hours for vector calculus and graphs', 'Solve 5 timed practice problem sets'] },
        { week: 3, focus: 'Mock Midterm Simulation', actionItems: ['Complete self-timed 90-minute practice exam', 'Peer code review for database indexing project'] },
        { week: 4, focus: 'Final Mastery & Retention Verification', actionItems: ['Consolidate cheat-sheets for key theorem proofs', '100% attendance audit check with faculty'] }
      ],
      generatedAt: new Date().toISOString()
    };

    res.json({ diagnostic: fallbackDiagnostic, source: 'ai-heuristic-engine' });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to generate AI diagnostic', details: err?.message });
  }
});

// -------------------------------------------------------------
// 10. AI Study Coach (Interactive Assistant)
// -------------------------------------------------------------
const handleAiCoachRequest = async (req: express.Request, res: express.Response) => {
  try {
    const { message, question, studentId, courseCode } = req.body;
    const userPrompt = question || message || 'How can I improve my study habits?';
    const student = students.find(s => s.studentId === studentId);

    if (process.env.GEMINI_API_KEY && aiClient) {
      try {
        const response = await aiClient.models.generateContent({
          model: 'gemini-3.7-flash',
          contents: `You are EduPulse AI Study Coach, an expert, encouraging university academic mentor.
Context:
Student: ${student ? `${student.name}, Major: ${student.department}, GPA: ${student.gpa}, Attendance: ${student.attendanceRate}%` : 'College Student'}
Course context: ${courseCode || 'General Academics'}
Student's question or topic: "${userPrompt}"

Provide a crisp, actionable, and encouraging breakdown with key conceptual highlights, memory tips, and a quick 3-step action plan. Keep tone collegiate, empathetic, and sharp.`,
        });

        const reply = response.text || 'Keep studying hard and staying engaged in lectures!';
        return res.json({ reply, advice: reply });
      } catch (err) {
        console.warn('Gemini chat error, fallback to mentor logic');
      }
    }

    // Heuristic mentor response
    const fallbackReply = `Here is your customized EduPulse study roadmap for **${courseCode || 'your coursework'}**:

1. **Break down the core concept**: Focus on understanding the primary intuition behind "${userPrompt}" before memorizing formulas or syntax.
2. **Active Recall & Practice**: Set a 25-minute Pomodoro block to solve 2 practice problems without looking at notes.
3. **Office Hours Preparation**: Write down 2 specific blocker questions to ask your instructor during the next lab session.

*Tip: Your current attendance rate is ${student ? student.attendanceRate : 90}%. Staying consistent in class is your biggest GPA multiplier!*`;

    res.json({ reply: fallbackReply, advice: fallbackReply });
  } catch (err: any) {
    res.status(500).json({ error: 'AI mentor error' });
  }
};

app.post('/api/ai/study-coach', handleAiCoachRequest);
app.post('/api/ai/coach-advice', handleAiCoachRequest);

// Catch-all for unhandled API routes to avoid returning HTML
app.all('/api/*', (req, res) => {
  res.status(404).json({ error: `API route ${req.method} ${req.path} not found` });
});

// -------------------------------------------------------------
// 11. Vite Dev Server & Static Serving Middleware
// -------------------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`EduPulse Student Management Server running on port ${PORT}`);
  });
}

startServer();

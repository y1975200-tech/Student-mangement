export const ERD_ENTITIES = [
  {
    name: "Users",
    description: "Core authentication and role management entity",
    fields: [
      { name: "id", type: "UUID / ObjectId", isPrimary: true, desc: "Unique identifier" },
      { name: "email", type: "VARCHAR(255)", isUnique: true, desc: "Institutional email" },
      { name: "passwordHash", type: "VARCHAR(255)", desc: "Bcrypt salted hash" },
      { name: "role", type: "ENUM('ADMIN', 'TEACHER', 'STUDENT')", desc: "Access level" },
      { name: "name", type: "VARCHAR(120)", desc: "Full display name" },
      { name: "department", type: "VARCHAR(80)", desc: "Academic branch/department" },
      { name: "profileRef", type: "UUID / ObjectId", desc: "FK reference to Student or Teacher profile" },
      { name: "createdAt", type: "TIMESTAMP", desc: "Account creation timestamp" }
    ],
    relations: [
      "1:1 with Students (if role=STUDENT)",
      "1:1 with Teachers (if role=TEACHER)"
    ]
  },
  {
    name: "Students",
    description: "Student academic lifecycle and enrollment repository",
    fields: [
      { name: "id", type: "UUID / ObjectId", isPrimary: true, desc: "Unique student identifier" },
      { name: "studentId", type: "VARCHAR(30)", isUnique: true, desc: "Roll number / Matriculation ID (e.g. STU-2026-001)" },
      { name: "userId", type: "UUID / ObjectId", desc: "FK -> Users.id" },
      { name: "department", type: "VARCHAR(80)", desc: "e.g. Computer Science, Mechanical Eng." },
      { name: "semester", type: "INT", desc: "Current academic semester (1-8)" },
      { name: "enrollmentDate", type: "DATE", desc: "Date of institutional admission" },
      { name: "gpa", type: "DECIMAL(3,2)", desc: "Cumulative Grade Point Average (0.00-4.00)" },
      { name: "totalCredits", type: "INT", desc: "Total earned credits" },
      { name: "status", type: "ENUM('ACTIVE', 'ON_PROBATION', 'SUSPENDED', 'GRADUATED')", desc: "Lifecycle state" },
      { name: "riskLevel", type: "ENUM('LOW', 'MEDIUM', 'HIGH')", desc: "Calculated academic risk level" }
    ],
    relations: [
      "1:N with CourseEnrollments (Many-to-Many with Courses)",
      "1:N with AttendanceRecords",
      "1:N with GradeRecords",
      "1:N with AssignmentSubmissions"
    ]
  },
  {
    name: "Courses",
    description: "Curriculum courses, credits, faculty mapping, and scheduling",
    fields: [
      { name: "id", type: "UUID / ObjectId", isPrimary: true, desc: "Course unique ID" },
      { name: "code", type: "VARCHAR(20)", isUnique: true, desc: "Course code (e.g. CS-301, MATH-201)" },
      { name: "title", type: "VARCHAR(150)", desc: "Full course name" },
      { name: "department", type: "VARCHAR(80)", desc: "Department offering the course" },
      { name: "credits", type: "INT", desc: "Credit weight (1-6)" },
      { name: "semester", type: "INT", desc: "Target semester" },
      { name: "teacherId", type: "UUID / ObjectId", desc: "FK -> Teachers.id" },
      { name: "capacity", type: "INT", desc: "Maximum student seat limit" },
      { name: "scheduleJson", type: "JSONB / Object", desc: "Day, time slot, and lecture room" }
    ],
    relations: [
      "N:1 with Teachers",
      "1:N with CourseEnrollments",
      "1:N with AttendanceRecords",
      "1:N with GradeRecords",
      "1:N with Assignments"
    ]
  },
  {
    name: "AttendanceRecords",
    description: "Session-level student attendance check-ins and audit log",
    fields: [
      { name: "id", type: "UUID / ObjectId", isPrimary: true, desc: "Attendance log ID" },
      { name: "courseId", type: "UUID / ObjectId", desc: "FK -> Courses.id" },
      { name: "studentId", type: "UUID / ObjectId", desc: "FK -> Students.id" },
      { name: "date", type: "DATE", desc: "Session date (YYYY-MM-DD)" },
      { name: "status", type: "ENUM('PRESENT', 'ABSENT', 'LATE', 'EXCUSED')", desc: "Attendance status" },
      { name: "sessionTopic", type: "VARCHAR(200)", desc: "Lecture topic / laboratory module" },
      { name: "markedBy", type: "UUID / ObjectId", desc: "FK -> Users.id (Faculty who logged it)" }
    ],
    relations: [
      "N:1 with Students",
      "N:1 with Courses"
    ]
  },
  {
    name: "GradeRecords",
    description: "Semester grade breakdown, weighted scores, and calculated GPA",
    fields: [
      { name: "id", type: "UUID / ObjectId", isPrimary: true, desc: "Grade record ID" },
      { name: "studentId", type: "UUID / ObjectId", desc: "FK -> Students.id" },
      { name: "courseId", type: "UUID / ObjectId", desc: "FK -> Courses.id" },
      { name: "semester", type: "INT", desc: "Semester number" },
      { name: "academicYear", type: "VARCHAR(15)", desc: "e.g. 2025-2026" },
      { name: "assignmentsScore", type: "DECIMAL(5,2)", desc: "Continuous assessment (0-100)" },
      { name: "midtermScore", type: "DECIMAL(5,2)", desc: "Midterm examination (0-100)" },
      { name: "finalExamScore", type: "DECIMAL(5,2)", desc: "Final examination (0-100)" },
      { name: "totalScore", type: "DECIMAL(5,2)", desc: "Weighted composite score (0-100)" },
      { name: "letterGrade", type: "VARCHAR(3)", desc: "A+, A, B+, B, C, D, F" },
      { name: "gradePoint", type: "DECIMAL(3,2)", desc: "4.0 Grade Point Scale conversion" },
      { name: "teacherFeedback", type: "TEXT", desc: "Remarks from instructor" }
    ],
    relations: [
      "N:1 with Students",
      "N:1 with Courses"
    ]
  },
  {
    name: "Assignments & Submissions",
    description: "Coursework tasks, deadline timers, and student submission tracking",
    fields: [
      { name: "id", type: "UUID / ObjectId", isPrimary: true, desc: "Assignment ID" },
      { name: "courseId", type: "UUID / ObjectId", desc: "FK -> Courses.id" },
      { name: "title", type: "VARCHAR(150)", desc: "Task title" },
      { name: "description", type: "TEXT", desc: "Requirements & rubrics" },
      { name: "dueDate", type: "TIMESTAMP", desc: "Cutoff deadline" },
      { name: "totalMarks", type: "INT", desc: "Max achievable score" },
      { name: "status", type: "ENUM('PUBLISHED', 'DRAFT', 'CLOSED')", desc: "Lifecycle state" }
    ],
    relations: [
      "N:1 with Courses",
      "1:N with Submissions (Student -> Assignment)"
    ]
  }
];

export const REST_API_SPECS = [
  {
    category: "Authentication & RBAC",
    endpoints: [
      { method: "POST", route: "/api/auth/login", purpose: "Authenticate user & issue signed JWT with role claim", role: "Public" },
      { method: "POST", route: "/api/auth/register", purpose: "Register new user account (Admin only for staff)", role: "Admin" },
      { method: "GET", route: "/api/auth/me", purpose: "Get authenticated user profile & active role permissions", role: "Authenticated" },
      { method: "POST", route: "/api/auth/switch-role", purpose: "Dev/Demo instant role switcher between personas", role: "Authenticated" },
    ]
  },
  {
    category: "Student Profiles & Academic Lifecycle",
    endpoints: [
      { method: "GET", route: "/api/students", purpose: "List students with search, filters (department, semester, risk level)", role: "Admin / Teacher" },
      { method: "POST", route: "/api/students", purpose: "Enroll a new student profile and generate matriculation ID", role: "Admin" },
      { method: "GET", route: "/api/students/:id", purpose: "Retrieve full academic dossier (courses, GPA, attendance, alerts)", role: "Admin / Teacher / Self" },
      { method: "PUT", route: "/api/students/:id", purpose: "Update profile, semester status, or probation state", role: "Admin" },
      { method: "DELETE", route: "/api/students/:id", purpose: "Deactivate or archive student record", role: "Admin" },
      { method: "GET", route: "/api/students/:id/report-card", purpose: "Generate comprehensive academic transcript data", role: "Admin / Teacher / Self" }
    ]
  },
  {
    category: "Courses & Enrollment",
    endpoints: [
      { method: "GET", route: "/api/courses", purpose: "Fetch active course catalogue with enrollment counts", role: "Authenticated" },
      { method: "POST", route: "/api/courses", purpose: "Create new course, assign faculty instructor, and set schedule", role: "Admin" },
      { method: "PUT", route: "/api/courses/:id", purpose: "Update course metadata, syllabus, or instructor", role: "Admin" },
      { method: "POST", route: "/api/courses/:id/enroll", purpose: "Batch enroll or drop students into course roster", role: "Admin / Teacher" }
    ]
  },
  {
    category: "Attendance Tracker",
    endpoints: [
      { method: "GET", route: "/api/attendance", purpose: "Query attendance logs by course, student, or date range", role: "Authenticated" },
      { method: "POST", route: "/api/attendance/check-in", purpose: "Mark individual student check-in (Present/Absent/Late)", role: "Teacher / Admin" },
      { method: "POST", route: "/api/attendance/bulk", purpose: "Bulk submit entire classroom attendance sheet for a lecture date", role: "Teacher / Admin" },
      { method: "GET", route: "/api/attendance/stats", purpose: "Compute attendance % and flag students below the 75% threshold", role: "Authenticated" }
    ]
  },
  {
    category: "Grades & GPA Engine",
    endpoints: [
      { method: "GET", route: "/api/grades", purpose: "Fetch gradebook records filtered by course or student", role: "Authenticated" },
      { method: "POST", route: "/api/grades", purpose: "Record continuous assessments, midterm & final exam scores", role: "Teacher / Admin" },
      { method: "PUT", route: "/api/grades/:id", purpose: "Adjust grade components and trigger cumulative GPA recalculation", role: "Teacher / Admin" },
      { method: "GET", route: "/api/grades/analytics", purpose: "Compute course grade distribution (bell curve, averages)", role: "Admin / Teacher" }
    ]
  },
  {
    category: "Assignments & Portal",
    endpoints: [
      { method: "GET", route: "/api/assignments", purpose: "List active assignments with deadline timestamps", role: "Authenticated" },
      { method: "POST", route: "/api/assignments", purpose: "Publish new homework, project, or exam assignment", role: "Teacher / Admin" },
      { method: "POST", route: "/api/assignments/:id/submit", purpose: "Submit student solution (file link or text payload)", role: "Student" },
      { method: "POST", route: "/api/assignments/:id/grade", purpose: "Score submission and attach instructor feedback", role: "Teacher" }
    ]
  },
  {
    category: "Hackathon X-Factor: AI Diagnostic Engine",
    endpoints: [
      { method: "POST", route: "/api/ai/performance-analysis", purpose: "Gemini 3.7 Flash analysis: predictive risk, at-risk diagnosis, and 4-week recovery roadmap", role: "Authenticated" },
      { method: "POST", route: "/api/ai/study-coach", purpose: "Generate personalized daily study scheduling & exam prep advice", role: "Student / Teacher" }
    ]
  }
];

export const HACKATHON_ROADMAP = [
  {
    phase: "Phase 1: Setup & RBAC Foundation",
    duration: "Hours 0 – 6",
    color: "from-blue-600 to-indigo-700",
    badge: "Sprint 1",
    tasks: [
      { title: "Database & Models Setup", desc: "Initialize PostgreSQL tables or MongoDB Mongoose schemas with indexed student IDs and foreign keys.", done: true },
      { title: "JWT Auth & Middleware", desc: "Implement bcrypt password hashing, JWT token generation, and `authorize(['ADMIN', 'TEACHER', 'STUDENT'])` role guard middleware.", done: true },
      { title: "Seed Realistic Campus Dataset", desc: "Generate 20+ realistic student profiles, faculty members, courses across 4 semesters, and historical records.", done: true },
      { title: "App Shell & Role Navigation", desc: "Create responsive Tailwind shell with instant role switcher to demonstrate RBAC workflows effortlessly during judging.", done: true }
    ]
  },
  {
    phase: "Phase 2: Core Academic Lifecycle CRUD",
    duration: "Hours 6 – 14",
    color: "from-emerald-600 to-teal-700",
    badge: "Sprint 2",
    tasks: [
      { title: "Student Management Module", desc: "Build searchable, filterable student roster with quick edit, semester tracking, and academic status indicators.", done: true },
      { title: "Course Mapping & Roster Binding", desc: "Create course catalog with teacher assignments, credit weighting, room schedules, and student capacity.", done: true },
      { title: "Attendance Quick-Marking Sheet", desc: "Develop interactive multi-student attendance toggle grid with bulk 'Mark All Present' and live attendance % counter.", done: true },
      { title: "Low-Attendance Automated Flagging", desc: "Trigger warning badges and system alerts whenever a student's course attendance drops below the 75% threshold.", done: true }
    ]
  },
  {
    phase: "Phase 3: Grades, GPA Engine & Assignments",
    duration: "Hours 14 – 20",
    color: "from-amber-600 to-orange-700",
    badge: "Sprint 3",
    tasks: [
      { title: "Weighted Gradebook & GPA Calculator", desc: "Implement automatic composite calculation: 30% Assignment + 30% Midterm + 40% Final -> Letter Grade & 4.0 GPA.", done: true },
      { title: "Assignment & Deadline Tracker", desc: "Build coursework portal with live countdown timers (Hours:Mins remaining), submission status, and score cards.", done: true },
      { title: "Interactive Student Portal", desc: "Design dedicated student dashboard summarizing personal GPA, credit milestones, active course schedule, and tasks.", done: true },
      { title: "Faculty Grade Entry Grid", desc: "Create streamlined inline score entry for teachers to rapidly update marks across course sections.", done: true }
    ]
  },
  {
    phase: "Phase 4: AI X-Factor & Hackathon Pitch Polish",
    duration: "Hours 20 – 24",
    color: "from-purple-600 to-pink-700",
    badge: "Sprint 4",
    tasks: [
      { title: "Gemini 3.7 Flash Performance Diagnostic", desc: "Integrate Gemini AI to analyze multimodal student telemetry (attendance rate, exam trajectory, submission timeliness) to forecast risk level (0-100) and generate personalized 4-week recovery roadmaps.", done: true },
      { title: "Automated Report Card Generation", desc: "Build one-click printable academic transcript generator with institutional header and grade verification stamps.", done: true },
      { title: "Interactive Timetable Visualizer", desc: "Render weekly calendar grid with color-coded course blocks and room locations.", done: true },
      { title: "Pitch-Ready Demo Mode", desc: "Incorporate quick demo presets, role switching, and copyable architecture documentation for hackathon judges.", done: true }
    ]
  }
];

export const STARTER_CODE_MONGOOSE = `// ==========================================
// models/index.js - Mongoose Schema Definition
// ==========================================
const mongoose = require('mongoose');
const { Schema } = mongoose;

// 1. User Schema (RBAC & Auth)
const UserSchema = new Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, select: false },
  role: { 
    type: String, 
    enum: ['ADMIN', 'TEACHER', 'STUDENT'], 
    default: 'STUDENT',
    required: true 
  },
  department: { type: String, required: true },
  avatarUrl: { type: String },
  studentProfile: { type: Schema.Types.ObjectId, ref: 'Student' },
  teacherProfile: { type: Schema.Types.ObjectId, ref: 'Teacher' }
}, { timestamps: true });

// 2. Student Schema (Academic Lifecycle)
const StudentSchema = new Schema({
  studentId: { type: String, required: true, unique: true, index: true }, // e.g. STU-2026-001
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, default: '' },
  department: { type: String, required: true },
  semester: { type: Number, required: true, min: 1, max: 8 },
  enrollmentDate: { type: Date, default: Date.now },
  gpa: { type: Number, default: 0.0, min: 0.0, max: 4.0 },
  totalCredits: { type: Number, default: 0 },
  status: { 
    type: String, 
    enum: ['ACTIVE', 'ON_PROBATION', 'SUSPENDED', 'GRADUATED'], 
    default: 'ACTIVE' 
  },
  enrolledCourses: [{ type: Schema.Types.ObjectId, ref: 'Course' }],
  attendanceRate: { type: Number, default: 100 }, // cached %
  riskLevel: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH'], default: 'LOW' }
}, { timestamps: true });

// 3. Course Schema
const CourseSchema = new Schema({
  code: { type: String, required: true, unique: true, uppercase: true }, // e.g. CS-301
  title: { type: String, required: true },
  department: { type: String, required: true },
  credits: { type: Number, required: true, default: 3 },
  semester: { type: Number, required: true },
  teacher: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  capacity: { type: Number, default: 60 },
  schedule: [{
    day: { type: String, enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] },
    time: { type: String },
    room: { type: String }
  }],
  syllabus: { type: String, default: '' }
}, { timestamps: true });

// 4. Attendance Record Schema
const AttendanceSchema = new Schema({
  course: { type: Schema.Types.ObjectId, ref: 'Course', required: true, index: true },
  student: { type: Schema.Types.ObjectId, ref: 'Student', required: true, index: true },
  date: { type: Date, required: true },
  status: { 
    type: String, 
    enum: ['PRESENT', 'ABSENT', 'LATE', 'EXCUSED'], 
    default: 'PRESENT',
    required: true 
  },
  sessionTopic: { type: String, default: '' },
  markedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

// Compound index to prevent duplicate check-ins for the same student on the same course date
AttendanceSchema.index({ course: 1, student: 1, date: 1 }, { unique: true });

// 5. Grade Record Schema (Weighted Continuous Assessment)
const GradeSchema = new Schema({
  student: { type: Schema.Types.ObjectId, ref: 'Student', required: true, index: true },
  course: { type: Schema.Types.ObjectId, ref: 'Course', required: true, index: true },
  semester: { type: Number, required: true },
  academicYear: { type: String, required: true }, // e.g. "2025-2026"
  assignmentsScore: { type: Number, default: 0, min: 0, max: 100 }, // 30% weight
  midtermScore: { type: Number, default: 0, min: 0, max: 100 },     // 30% weight
  finalExamScore: { type: Number, default: 0, min: 0, max: 100 },   // 40% weight
  totalScore: { type: Number, default: 0 },
  letterGrade: { type: String, default: 'F' },
  gradePoint: { type: Number, default: 0.0 }, // 4.0 scale
  teacherFeedback: { type: String, default: '' }
}, { timestamps: true });

// Pre-save hook: auto-compute weighted total score, letter grade & grade point
GradeSchema.pre('save', function(next) {
  this.totalScore = Number(((this.assignmentsScore * 0.3) + (this.midtermScore * 0.3) + (this.finalExamScore * 0.4)).toFixed(2));
  
  if (this.totalScore >= 90) { this.letterGrade = 'A+'; this.gradePoint = 4.0; }
  else if (this.totalScore >= 85) { this.letterGrade = 'A'; this.gradePoint = 4.0; }
  else if (this.totalScore >= 80) { this.letterGrade = 'A-'; this.gradePoint = 3.7; }
  else if (this.totalScore >= 75) { this.letterGrade = 'B+'; this.gradePoint = 3.3; }
  else if (this.totalScore >= 70) { this.letterGrade = 'B'; this.gradePoint = 3.0; }
  else if (this.totalScore >= 65) { this.letterGrade = 'B-'; this.gradePoint = 2.7; }
  else if (this.totalScore >= 60) { this.letterGrade = 'C+'; this.gradePoint = 2.3; }
  else if (this.totalScore >= 55) { this.letterGrade = 'C'; this.gradePoint = 2.0; }
  else if (this.totalScore >= 50) { this.letterGrade = 'D'; this.gradePoint = 1.0; }
  else { this.letterGrade = 'F'; this.gradePoint = 0.0; }
  
  next();
});

module.exports = {
  User: mongoose.model('User', UserSchema),
  Student: mongoose.model('Student', StudentSchema),
  Course: mongoose.model('Course', CourseSchema),
  Attendance: mongoose.model('Attendance', AttendanceSchema),
  Grade: mongoose.model('Grade', GradeSchema)
};`;

export const STARTER_CODE_SQL = `-- ==========================================
-- PostgreSQL Relational DDL Definition
-- ==========================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Users Table (RBAC & Auth)
CREATE TYPE user_role AS ENUM ('ADMIN', 'TEACHER', 'STUDENT');
CREATE TYPE student_status AS ENUM ('ACTIVE', 'ON_PROBATION', 'SUSPENDED', 'GRADUATED');
CREATE TYPE attendance_status AS ENUM ('PRESENT', 'ABSENT', 'LATE', 'EXCUSED');
CREATE TYPE risk_level_type AS ENUM ('LOW', 'MEDIUM', 'HIGH');

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role user_role NOT NULL DEFAULT 'STUDENT',
    name VARCHAR(120) NOT NULL,
    department VARCHAR(80) NOT NULL,
    avatar_url VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Students Table
CREATE TABLE students (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id VARCHAR(30) NOT NULL UNIQUE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    phone VARCHAR(25),
    semester INT NOT NULL CHECK (semester BETWEEN 1 AND 8),
    enrollment_date DATE NOT NULL DEFAULT CURRENT_DATE,
    gpa NUMERIC(3, 2) DEFAULT 0.00 CHECK (gpa BETWEEN 0.00 AND 4.00),
    total_credits INT DEFAULT 0,
    status student_status DEFAULT 'ACTIVE',
    risk_level risk_level_type DEFAULT 'LOW',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Courses Table
CREATE TABLE courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(20) NOT NULL UNIQUE,
    title VARCHAR(150) NOT NULL,
    department VARCHAR(80) NOT NULL,
    credits INT NOT NULL DEFAULT 3 CHECK (credits > 0),
    semester INT NOT NULL CHECK (semester BETWEEN 1 AND 8),
    teacher_id UUID NOT NULL REFERENCES users(id),
    capacity INT NOT NULL DEFAULT 60,
    schedule_json JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Course Enrollment Junction Table
CREATE TABLE course_enrollments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (student_id, course_id)
);

-- 5. Attendance Records Table
CREATE TABLE attendance_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    status attendance_status NOT NULL DEFAULT 'PRESENT',
    session_topic VARCHAR(200),
    marked_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (course_id, student_id, date)
);

-- 6. Grade Records Table
CREATE TABLE grade_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    semester INT NOT NULL,
    academic_year VARCHAR(15) NOT NULL,
    assignments_score NUMERIC(5, 2) DEFAULT 0.00 CHECK (assignments_score BETWEEN 0 AND 100),
    midterm_score NUMERIC(5, 2) DEFAULT 0.00 CHECK (midterm_score BETWEEN 0 AND 100),
    final_exam_score NUMERIC(5, 2) DEFAULT 0.00 CHECK (final_exam_score BETWEEN 0 AND 100),
    total_score NUMERIC(5, 2) GENERATED ALWAYS AS (
        (assignments_score * 0.30) + (midterm_score * 0.30) + (final_exam_score * 0.40)
    ) STORED,
    letter_grade VARCHAR(3),
    grade_point NUMERIC(3, 2),
    teacher_feedback TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (student_id, course_id, semester, academic_year)
);

-- Indexes for lightning fast queries & analytics
CREATE INDEX idx_students_dept_sem ON students(semester, status);
CREATE INDEX idx_attendance_query ON attendance_records(course_id, date);
CREATE INDEX idx_grades_student ON grade_records(student_id);`;

export const STARTER_CODE_JWT_ROUTER = `// ==============================================================
// routes/auth.js - JWT Authentication & RBAC Middleware Router
// ==============================================================
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { User, Student } = require('../models');

const JWT_SECRET = process.env.JWT_SECRET || 'hackathon_jwt_super_secret_key_2026';
const JWT_EXPIRES_IN = '24h';

// -------------------------------------------------------------
// 1. RBAC Authorization Guard Middleware
// -------------------------------------------------------------
const authorize = (allowedRoles = []) => {
  return (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Access Denied: Missing or malformed Bearer token.' });
      }

      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded; // { id, email, role, studentId, teacherId }

      // Check if user's role is authorized for this route
      if (allowedRoles.length > 0 && !allowedRoles.includes(decoded.role)) {
        return res.status(403).json({ 
          error: \`Forbidden: Requires one of [\${allowedRoles.join(', ')}] role. Current role: \${decoded.role}\` 
        });
      }

      next();
    } catch (err) {
      return res.status(401).json({ error: 'Invalid or expired token', details: err.message });
    }
  };
};

// -------------------------------------------------------------
// 2. User Login Endpoint (Generates JWT with Role Claim)
// -------------------------------------------------------------
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    // Generate JWT payload with explicit RBAC role
    const payload = {
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
      department: user.department,
      studentProfile: user.studentProfile || null,
      teacherProfile: user.teacherProfile || null
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error during login', details: err.message });
  }
});

// -------------------------------------------------------------
// 3. Current User Verification Endpoint
// -------------------------------------------------------------
router.get('/me', authorize(), async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve profile' });
  }
});

module.exports = {
  authRouter: router,
  authorize
};`;

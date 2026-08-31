export type UserRole = 'ADMIN' | 'TEACHER' | 'STUDENT';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  department?: string;
  studentId?: string; // Links to Student record if role is STUDENT
  teacherId?: string; // Links to Teacher record if role is TEACHER
}

export interface Student {
  id: string;
  studentId: string; // e.g. STU-2026-001
  name: string;
  email: string;
  phone: string;
  department: string;
  semester: number;
  enrollmentDate: string;
  gpa: number; // Current calculated cumulative GPA (0.00 - 4.00)
  totalCredits: number;
  status: 'ACTIVE' | 'ON_PROBATION' | 'SUSPENDED' | 'GRADUATED';
  avatar: string;
  enrolledCourseIds: string[];
  attendanceRate: number; // Percentage 0-100%
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface Teacher {
  id: string;
  name: string;
  email: string;
  department: string;
  title: string;
  coursesTaught: string[]; // course IDs
  avatar: string;
}

export interface Course {
  id: string;
  code: string; // e.g. CS-301
  title: string;
  department: string;
  credits: number;
  semester: number;
  teacherId: string;
  teacherName: string;
  schedule: {
    day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
    time: string;
    room: string;
  }[];
  capacity: number;
  enrolledCount: number;
  syllabus: string;
}

export interface AttendanceRecord {
  id: string;
  courseId: string;
  courseCode: string;
  studentId: string;
  studentName: string;
  date: string; // YYYY-MM-DD
  status: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED';
  sessionTopic?: string;
  markedBy: string; // teacherId
}

export interface GradeRecord {
  id: string;
  studentId: string;
  studentName: string;
  courseId: string;
  courseCode: string;
  courseTitle: string;
  credits: number;
  semester: number;
  academicYear: string;
  assignmentsScore: number; // 0-100 (weight e.g. 30%)
  midtermScore: number;     // 0-100 (weight e.g. 30%)
  finalExamScore: number;   // 0-100 (weight e.g. 40%)
  totalScore: number;       // calculated 0-100
  letterGrade: 'A+' | 'A' | 'A-' | 'B+' | 'B' | 'B-' | 'C+' | 'C' | 'D' | 'F';
  gradePoint: number;       // 4.0 scale
  teacherFeedback?: string;
  updatedAt: string;
}

export interface Assignment {
  id: string;
  courseId: string;
  courseCode: string;
  courseTitle: string;
  title: string;
  description: string;
  dueDate: string; // ISO date string
  totalMarks: number;
  resourcesUrl?: string;
  teacherId: string;
  status: 'PUBLISHED' | 'DRAFT' | 'CLOSED';
}

export interface Submission {
  id: string;
  assignmentId: string;
  studentId: string;
  studentName: string;
  submittedAt: string;
  fileUrl?: string;
  textSubmission?: string;
  score?: number;
  feedback?: string;
  status: 'SUBMITTED' | 'GRADED' | 'LATE' | 'MISSING';
}

export interface TimetableSlot {
  id: string;
  courseCode: string;
  courseTitle: string;
  teacherName: string;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';
  startTime: string; // e.g. "09:00"
  endTime: string;   // e.g. "10:30"
  room: string;
  color: string;
}

export interface AIStudentDiagnostic {
  studentId: string;
  studentName: string;
  academicRiskScore: number; // 0 (safe) - 100 (critical)
  riskCategory: 'High Risk' | 'Moderate Risk' | 'On Track' | 'High Achiever';
  executiveSummary: string;
  attendanceDiagnosis: {
    overallPercentage: number;
    status: 'Critically Low' | 'Borderline' | 'Satisfactory';
    criticalCourses: string[];
    analysis: string;
  };
  gradeTrajectory: {
    estimatedGPA: number;
    trend: 'Improving' | 'Declining' | 'Stagnant';
    weakestSubjects: string[];
    strongestSubjects: string[];
  };
  keyRiskFactors: string[];
  recommendedInterventions: {
    priority: 'URGENT' | 'RECOMMENDED' | 'OPTIONAL';
    action: string;
    targetDate: string;
    responsibleParty: 'Student' | 'Advisor' | 'Course Instructor';
  }[];
  personalizedStudyPlan: {
    week: number;
    focus: string;
    actionItems: string[];
  }[];
  generatedAt: string;
}

import { Student, Teacher, Course, AttendanceRecord, GradeRecord, Assignment, Submission, TimetableSlot, User } from '../src/types';

// Mock in-memory database store with rich realistic EdTech data
export let users: User[] = [
  {
    id: 'usr-admin-1',
    name: 'Dr. Evelyn Reed',
    email: 'admin@edupulse.edu',
    role: 'ADMIN',
    department: 'Campus Administration',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'usr-teacher-1',
    name: 'Prof. Marcus Vance',
    email: 'marcus.vance@edupulse.edu',
    role: 'TEACHER',
    department: 'Computer Science',
    teacherId: 'tch-1',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'usr-teacher-2',
    name: 'Dr. Sarah Lin',
    email: 'sarah.lin@edupulse.edu',
    role: 'TEACHER',
    department: 'Mathematics & Data',
    teacherId: 'tch-2',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'usr-student-1',
    name: 'Alex Chen',
    email: 'alex.chen@student.edupulse.edu',
    role: 'STUDENT',
    department: 'Computer Science',
    studentId: 'STU-2026-001',
    avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'usr-student-2',
    name: 'Maya Patel',
    email: 'maya.patel@student.edupulse.edu',
    role: 'STUDENT',
    department: 'Software Engineering',
    studentId: 'STU-2026-002',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'usr-student-3',
    name: 'Jordan Hayes',
    email: 'jordan.hayes@student.edupulse.edu',
    role: 'STUDENT',
    department: 'Computer Science',
    studentId: 'STU-2026-003',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
  }
];

export let teachers: Teacher[] = [
  {
    id: 'tch-1',
    name: 'Prof. Marcus Vance',
    email: 'marcus.vance@edupulse.edu',
    department: 'Computer Science',
    title: 'Associate Professor',
    coursesTaught: ['crs-cs301', 'crs-cs405'],
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'tch-2',
    name: 'Dr. Sarah Lin',
    email: 'sarah.lin@edupulse.edu',
    department: 'Mathematics & Data',
    title: 'Head of Applied Mathematics',
    coursesTaught: ['crs-math201', 'crs-ds302'],
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'tch-3',
    name: 'Dr. Robert Rivera',
    email: 'robert.rivera@edupulse.edu',
    department: 'Software Engineering',
    title: 'Senior Lecturer',
    coursesTaught: ['crs-se204'],
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'
  }
];

export let courses: Course[] = [
  {
    id: 'crs-cs301',
    code: 'CS-301',
    title: 'Advanced Algorithms & Data Structures',
    department: 'Computer Science',
    credits: 4,
    semester: 5,
    teacherId: 'tch-1',
    teacherName: 'Prof. Marcus Vance',
    schedule: [
      { day: 'Monday', time: '09:00 - 10:30', room: 'Turing Hall A' },
      { day: 'Wednesday', time: '09:00 - 10:30', room: 'Turing Hall A' }
    ],
    capacity: 60,
    enrolledCount: 48,
    syllabus: 'Graph algorithms, dynamic programming, NP-completeness, network flow, and parallel data structures.'
  },
  {
    id: 'crs-math201',
    code: 'MATH-201',
    title: 'Linear Algebra & Vector Calculus',
    department: 'Mathematics & Data',
    credits: 3,
    semester: 3,
    teacherId: 'tch-2',
    teacherName: 'Dr. Sarah Lin',
    schedule: [
      { day: 'Tuesday', time: '11:00 - 12:30', room: 'Euler Lab 202' },
      { day: 'Thursday', time: '11:00 - 12:30', room: 'Euler Lab 202' }
    ],
    capacity: 75,
    enrolledCount: 68,
    syllabus: 'Matrix decompositions, eigenvalues/eigenvectors, multivariable calculus, and optimization.'
  },
  {
    id: 'crs-se204',
    code: 'SE-204',
    title: 'Database Systems & Cloud Architecture',
    department: 'Software Engineering',
    credits: 4,
    semester: 4,
    teacherId: 'tch-3',
    teacherName: 'Dr. Robert Rivera',
    schedule: [
      { day: 'Tuesday', time: '14:00 - 15:30', room: 'Hopper Tech Lab' },
      { day: 'Friday', time: '10:00 - 12:00', room: 'Hopper Tech Lab' }
    ],
    capacity: 50,
    enrolledCount: 42,
    syllabus: 'Relational algebra, query optimization, ACID transactions, NoSQL architectures, distributed systems.'
  },
  {
    id: 'crs-ds302',
    code: 'DS-302',
    title: 'Machine Learning & Neural Networks',
    department: 'Mathematics & Data',
    credits: 4,
    semester: 6,
    teacherId: 'tch-2',
    teacherName: 'Dr. Sarah Lin',
    schedule: [
      { day: 'Wednesday', time: '13:30 - 15:00', room: 'Ada Lovelace 104' },
      { day: 'Friday', time: '13:30 - 15:00', room: 'Ada Lovelace 104' }
    ],
    capacity: 55,
    enrolledCount: 51,
    syllabus: 'Supervised/unsupervised learning, deep neural nets, gradient descent, transformers, ethics in AI.'
  }
];

export let students: Student[] = [
  {
    id: 'stu-1',
    studentId: 'STU-2026-001',
    name: 'Alex Chen',
    email: 'alex.chen@student.edupulse.edu',
    phone: '+1 (555) 234-5678',
    department: 'Computer Science',
    semester: 5,
    enrollmentDate: '2024-09-01',
    gpa: 3.85,
    totalCredits: 68,
    status: 'ACTIVE',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    enrolledCourseIds: ['crs-cs301', 'crs-math201', 'crs-se204', 'crs-ds302'],
    attendanceRate: 94.5,
    riskLevel: 'LOW'
  },
  {
    id: 'stu-2',
    studentId: 'STU-2026-002',
    name: 'Maya Patel',
    email: 'maya.patel@student.edupulse.edu',
    phone: '+1 (555) 345-6789',
    department: 'Software Engineering',
    semester: 4,
    enrollmentDate: '2024-09-01',
    gpa: 3.92,
    totalCredits: 52,
    status: 'ACTIVE',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    enrolledCourseIds: ['crs-cs301', 'crs-se204', 'crs-math201'],
    attendanceRate: 98.0,
    riskLevel: 'LOW'
  },
  {
    id: 'stu-3',
    studentId: 'STU-2026-003',
    name: 'Jordan Hayes',
    email: 'jordan.hayes@student.edupulse.edu',
    phone: '+1 (555) 456-7890',
    department: 'Computer Science',
    semester: 5,
    enrollmentDate: '2024-09-01',
    gpa: 2.15,
    totalCredits: 46,
    status: 'ON_PROBATION',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    enrolledCourseIds: ['crs-cs301', 'crs-math201', 'crs-se204'],
    attendanceRate: 64.2, // CRITICAL: < 75% flag!
    riskLevel: 'HIGH'
  },
  {
    id: 'stu-4',
    studentId: 'STU-2026-004',
    name: 'Sofia Rodriguez',
    email: 'sofia.rodriguez@student.edupulse.edu',
    phone: '+1 (555) 567-8901',
    department: 'Mathematics & Data',
    semester: 3,
    enrollmentDate: '2025-01-15',
    gpa: 3.42,
    totalCredits: 36,
    status: 'ACTIVE',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    enrolledCourseIds: ['crs-math201', 'crs-se204'],
    attendanceRate: 88.0,
    riskLevel: 'LOW'
  },
  {
    id: 'stu-5',
    studentId: 'STU-2026-005',
    name: 'Devon Miller',
    email: 'devon.miller@student.edupulse.edu',
    phone: '+1 (555) 678-9012',
    department: 'Computer Science',
    semester: 5,
    enrollmentDate: '2024-09-01',
    gpa: 2.68,
    totalCredits: 58,
    status: 'ACTIVE',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    enrolledCourseIds: ['crs-cs301', 'crs-ds302'],
    attendanceRate: 71.5, // Flagged < 75%
    riskLevel: 'MEDIUM'
  },
  {
    id: 'stu-6',
    studentId: 'STU-2026-006',
    name: 'Priya Sharma',
    email: 'priya.sharma@student.edupulse.edu',
    phone: '+1 (555) 789-0123',
    department: 'Software Engineering',
    semester: 4,
    enrollmentDate: '2024-09-01',
    gpa: 3.75,
    totalCredits: 54,
    status: 'ACTIVE',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    enrolledCourseIds: ['crs-se204', 'crs-math201', 'crs-ds302'],
    attendanceRate: 92.0,
    riskLevel: 'LOW'
  }
];

export let attendanceRecords: AttendanceRecord[] = [
  // Today's CS301 check-ins
  { id: 'att-1', courseId: 'crs-cs301', courseCode: 'CS-301', studentId: 'STU-2026-001', studentName: 'Alex Chen', date: '2026-08-31', status: 'PRESENT', sessionTopic: 'Dynamic Programming & Memoization', markedBy: 'tch-1' },
  { id: 'att-2', courseId: 'crs-cs301', courseCode: 'CS-301', studentId: 'STU-2026-002', studentName: 'Maya Patel', date: '2026-08-31', status: 'PRESENT', sessionTopic: 'Dynamic Programming & Memoization', markedBy: 'tch-1' },
  { id: 'att-3', courseId: 'crs-cs301', courseCode: 'CS-301', studentId: 'STU-2026-003', studentName: 'Jordan Hayes', date: '2026-08-31', status: 'ABSENT', sessionTopic: 'Dynamic Programming & Memoization', markedBy: 'tch-1' },
  { id: 'att-4', courseId: 'crs-cs301', courseCode: 'CS-301', studentId: 'STU-2026-005', studentName: 'Devon Miller', date: '2026-08-31', status: 'LATE', sessionTopic: 'Dynamic Programming & Memoization', markedBy: 'tch-1' },

  // Previous week CS301
  { id: 'att-5', courseId: 'crs-cs301', courseCode: 'CS-301', studentId: 'STU-2026-001', studentName: 'Alex Chen', date: '2026-08-26', status: 'PRESENT', sessionTopic: 'Shortest Path & Dijkstra', markedBy: 'tch-1' },
  { id: 'att-6', courseId: 'crs-cs301', courseCode: 'CS-301', studentId: 'STU-2026-002', studentName: 'Maya Patel', date: '2026-08-26', status: 'PRESENT', sessionTopic: 'Shortest Path & Dijkstra', markedBy: 'tch-1' },
  { id: 'att-7', courseId: 'crs-cs301', courseCode: 'CS-301', studentId: 'STU-2026-003', studentName: 'Jordan Hayes', date: '2026-08-26', status: 'ABSENT', sessionTopic: 'Shortest Path & Dijkstra', markedBy: 'tch-1' },

  // MATH201 Records
  { id: 'att-8', courseId: 'crs-math201', courseCode: 'MATH-201', studentId: 'STU-2026-001', studentName: 'Alex Chen', date: '2026-08-27', status: 'PRESENT', sessionTopic: 'Eigenvalue Decomposition', markedBy: 'tch-2' },
  { id: 'att-9', courseId: 'crs-math201', courseCode: 'MATH-201', studentId: 'STU-2026-003', studentName: 'Jordan Hayes', date: '2026-08-27', status: 'ABSENT', sessionTopic: 'Eigenvalue Decomposition', markedBy: 'tch-2' },
  { id: 'att-10', courseId: 'crs-math201', courseCode: 'MATH-201', studentId: 'STU-2026-004', studentName: 'Sofia Rodriguez', date: '2026-08-27', status: 'PRESENT', sessionTopic: 'Eigenvalue Decomposition', markedBy: 'tch-2' },

  // SE204 Records
  { id: 'att-11', courseId: 'crs-se204', courseCode: 'SE-204', studentId: 'STU-2026-001', studentName: 'Alex Chen', date: '2026-08-28', status: 'PRESENT', sessionTopic: 'Distributed Transactions', markedBy: 'tch-3' },
  { id: 'att-12', courseId: 'crs-se204', courseCode: 'SE-204', studentId: 'STU-2026-002', studentName: 'Maya Patel', date: '2026-08-28', status: 'PRESENT', sessionTopic: 'Distributed Transactions', markedBy: 'tch-3' },
  { id: 'att-13', courseId: 'crs-se204', courseCode: 'SE-204', studentId: 'STU-2026-003', studentName: 'Jordan Hayes', date: '2026-08-28', status: 'LATE', sessionTopic: 'Distributed Transactions', markedBy: 'tch-3' }
];

export let gradeRecords: GradeRecord[] = [
  // Alex Chen (Top performer)
  {
    id: 'grd-1',
    studentId: 'STU-2026-001',
    studentName: 'Alex Chen',
    courseId: 'crs-cs301',
    courseCode: 'CS-301',
    courseTitle: 'Advanced Algorithms',
    credits: 4,
    semester: 5,
    academicYear: '2025-2026',
    assignmentsScore: 95,
    midtermScore: 92,
    finalExamScore: 94,
    totalScore: 93.7,
    letterGrade: 'A+',
    gradePoint: 4.0,
    teacherFeedback: 'Outstanding analytical capability and efficient algorithmic implementation.',
    updatedAt: '2026-08-28'
  },
  {
    id: 'grd-2',
    studentId: 'STU-2026-001',
    studentName: 'Alex Chen',
    courseId: 'crs-math201',
    courseCode: 'MATH-201',
    courseTitle: 'Linear Algebra',
    credits: 3,
    semester: 5,
    academicYear: '2025-2026',
    assignmentsScore: 88,
    midtermScore: 85,
    finalExamScore: 89,
    totalScore: 87.5,
    letterGrade: 'A',
    gradePoint: 4.0,
    teacherFeedback: 'Strong mastery of vector spaces and matrix transformations.',
    updatedAt: '2026-08-28'
  },
  {
    id: 'grd-3',
    studentId: 'STU-2026-001',
    studentName: 'Alex Chen',
    courseId: 'crs-se204',
    courseCode: 'SE-204',
    courseTitle: 'Database Systems',
    credits: 4,
    semester: 5,
    academicYear: '2025-2026',
    assignmentsScore: 91,
    midtermScore: 89,
    finalExamScore: 93,
    totalScore: 91.2,
    letterGrade: 'A+',
    gradePoint: 4.0,
    teacherFeedback: 'Exemplary database normalization project and fast query tuning.',
    updatedAt: '2026-08-28'
  },

  // Jordan Hayes (Struggling student / High risk)
  {
    id: 'grd-4',
    studentId: 'STU-2026-003',
    studentName: 'Jordan Hayes',
    courseId: 'crs-cs301',
    courseCode: 'CS-301',
    courseTitle: 'Advanced Algorithms',
    credits: 4,
    semester: 5,
    academicYear: '2025-2026',
    assignmentsScore: 52,
    midtermScore: 48,
    finalExamScore: 54,
    totalScore: 51.6,
    letterGrade: 'D',
    gradePoint: 1.0,
    teacherFeedback: 'Struggling with recurrence relations and time complexity proofs. Requires tutoring.',
    updatedAt: '2026-08-28'
  },
  {
    id: 'grd-5',
    studentId: 'STU-2026-003',
    studentName: 'Jordan Hayes',
    courseId: 'crs-math201',
    courseCode: 'MATH-201',
    courseTitle: 'Linear Algebra',
    credits: 3,
    semester: 5,
    academicYear: '2025-2026',
    assignmentsScore: 45,
    midtermScore: 50,
    finalExamScore: 48,
    totalScore: 47.7,
    letterGrade: 'F',
    gradePoint: 0.0,
    teacherFeedback: 'Missed essential homework submissions and lab assignments.',
    updatedAt: '2026-08-28'
  },
  {
    id: 'grd-6',
    studentId: 'STU-2026-003',
    studentName: 'Jordan Hayes',
    courseId: 'crs-se204',
    courseCode: 'SE-204',
    courseTitle: 'Database Systems',
    credits: 4,
    semester: 5,
    academicYear: '2025-2026',
    assignmentsScore: 68,
    midtermScore: 64,
    finalExamScore: 66,
    totalScore: 66.0,
    letterGrade: 'B-',
    gradePoint: 2.7,
    teacherFeedback: 'Demonstrates practical coding ability, but theory fundamentals need reinforcement.',
    updatedAt: '2026-08-28'
  },

  // Maya Patel
  {
    id: 'grd-7',
    studentId: 'STU-2026-002',
    studentName: 'Maya Patel',
    courseId: 'crs-cs301',
    courseCode: 'CS-301',
    courseTitle: 'Advanced Algorithms',
    credits: 4,
    semester: 4,
    academicYear: '2025-2026',
    assignmentsScore: 98,
    midtermScore: 95,
    finalExamScore: 97,
    totalScore: 96.7,
    letterGrade: 'A+',
    gradePoint: 4.0,
    teacherFeedback: 'Perfect score on graph search optimization problem set.',
    updatedAt: '2026-08-28'
  }
];

export let assignments: Assignment[] = [
  {
    id: 'asg-1',
    courseId: 'crs-cs301',
    courseCode: 'CS-301',
    courseTitle: 'Advanced Algorithms',
    title: 'Problem Set 4: Dynamic Programming & Knapsack Variants',
    description: 'Implement bottom-up DP solutions for unbounded knapsack and sequence alignment with O(N*W) space optimization.',
    dueDate: '2026-09-04T23:59:00Z',
    totalMarks: 100,
    resourcesUrl: 'https://docs.edupulse.edu/cs301/ps4.pdf',
    teacherId: 'tch-1',
    status: 'PUBLISHED'
  },
  {
    id: 'asg-2',
    courseId: 'crs-se204',
    courseCode: 'SE-204',
    courseTitle: 'Database Systems',
    title: 'Milestone 2: B-Tree Index Engine & Buffer Pool Manager',
    description: 'Build a concurrent buffer pool manager and implement node splitting algorithms for 2-3-4 B+ Trees in TypeScript/Go.',
    dueDate: '2026-09-08T18:00:00Z',
    totalMarks: 100,
    resourcesUrl: 'https://docs.edupulse.edu/se204/m2-spec.pdf',
    teacherId: 'tch-3',
    status: 'PUBLISHED'
  },
  {
    id: 'asg-3',
    courseId: 'crs-math201',
    courseCode: 'MATH-201',
    courseTitle: 'Linear Algebra',
    title: 'Lab 3: SVD Compression & Principal Component Analysis',
    description: 'Decompose high-dimensional face image matrices using Singular Value Decomposition and plot variance retention curves.',
    dueDate: '2026-09-02T12:00:00Z',
    totalMarks: 50,
    resourcesUrl: 'https://docs.edupulse.edu/math201/lab3.ipynb',
    teacherId: 'tch-2',
    status: 'PUBLISHED'
  }
];

export let submissions: Submission[] = [
  {
    id: 'sub-1',
    assignmentId: 'asg-3',
    studentId: 'STU-2026-001',
    studentName: 'Alex Chen',
    submittedAt: '2026-08-30T19:40:00Z',
    textSubmission: 'Completed all 5 SVD experiments with 95% image variance retention achieved at k=45.',
    fileUrl: 'https://github.com/alexchen/svd-lab3',
    score: 48,
    feedback: 'Excellent visualization and thorough analysis of singular values.',
    status: 'GRADED'
  },
  {
    id: 'sub-2',
    assignmentId: 'asg-1',
    studentId: 'STU-2026-001',
    studentName: 'Alex Chen',
    submittedAt: '2026-08-31T01:15:00Z',
    textSubmission: 'Implemented iterative 1D space optimization with memory footprint down to 12MB.',
    fileUrl: 'https://github.com/alexchen/dp-knapsack',
    status: 'SUBMITTED'
  },
  {
    id: 'sub-3',
    assignmentId: 'asg-3',
    studentId: 'STU-2026-003',
    studentName: 'Jordan Hayes',
    submittedAt: '2026-08-30T23:55:00Z',
    textSubmission: 'Uploaded partial notebook with SVD implementation.',
    fileUrl: 'https://github.com/jordanh/lab3-partial',
    score: 28,
    feedback: 'Part 2 PCA derivation was incomplete. Please review laboratory notes.',
    status: 'GRADED'
  }
];

export const timetableSlots: TimetableSlot[] = [
  { id: 'tt-1', courseCode: 'CS-301', courseTitle: 'Advanced Algorithms', teacherName: 'Prof. Marcus Vance', day: 'Monday', startTime: '09:00', endTime: '10:30', room: 'Turing Hall A', color: 'blue' },
  { id: 'tt-2', courseCode: 'SE-204', courseTitle: 'Database Systems', teacherName: 'Dr. Robert Rivera', day: 'Monday', startTime: '13:00', endTime: '14:30', room: 'Hopper Tech Lab', color: 'indigo' },
  { id: 'tt-3', courseCode: 'MATH-201', courseTitle: 'Linear Algebra', teacherName: 'Dr. Sarah Lin', day: 'Tuesday', startTime: '11:00', endTime: '12:30', room: 'Euler Lab 202', color: 'emerald' },
  { id: 'tt-4', courseCode: 'CS-301', courseTitle: 'Advanced Algorithms', teacherName: 'Prof. Marcus Vance', day: 'Wednesday', startTime: '09:00', endTime: '10:30', room: 'Turing Hall A', color: 'blue' },
  { id: 'tt-5', courseCode: 'DS-302', courseTitle: 'Machine Learning', teacherName: 'Dr. Sarah Lin', day: 'Wednesday', startTime: '13:30', endTime: '15:00', room: 'Ada Lovelace 104', color: 'purple' },
  { id: 'tt-6', courseCode: 'MATH-201', courseTitle: 'Linear Algebra', teacherName: 'Dr. Sarah Lin', day: 'Thursday', startTime: '11:00', endTime: '12:30', room: 'Euler Lab 202', color: 'emerald' },
  { id: 'tt-7', courseCode: 'SE-204', courseTitle: 'Database Systems Lab', teacherName: 'Dr. Robert Rivera', day: 'Friday', startTime: '10:00', endTime: '12:00', room: 'Hopper Tech Lab', color: 'indigo' },
  { id: 'tt-8', courseCode: 'DS-302', courseTitle: 'Machine Learning Lab', teacherName: 'Dr. Sarah Lin', day: 'Friday', startTime: '13:30', endTime: '15:00', room: 'Ada Lovelace 104', color: 'purple' }
];

// Helper calculations
export function recalculateStudentStats(studentMatricId: string) {
  const student = students.find(s => s.studentId === studentMatricId);
  if (!student) return;

  // Recalculate GPA from grade records
  const studentGrades = gradeRecords.filter(g => g.studentId === studentMatricId);
  if (studentGrades.length > 0) {
    const totalGradePoints = studentGrades.reduce((acc, g) => acc + (g.gradePoint * g.credits), 0);
    const totalCredits = studentGrades.reduce((acc, g) => acc + g.credits, 0);
    student.gpa = Number((totalGradePoints / totalCredits).toFixed(2));
    student.totalCredits = totalCredits;
  }

  // Recalculate Attendance Rate
  const studentAttendance = attendanceRecords.filter(a => a.studentId === studentMatricId);
  if (studentAttendance.length > 0) {
    const presentCount = studentAttendance.filter(a => a.status === 'PRESENT' || a.status === 'EXCUSED').length;
    student.attendanceRate = Number(((presentCount / studentAttendance.length) * 100).toFixed(1));
  }

  // Update Risk Level (<75% attendance or <2.5 GPA is HIGH risk)
  if (student.attendanceRate < 75 || student.gpa < 2.5) {
    student.riskLevel = 'HIGH';
    if (student.gpa < 2.2) student.status = 'ON_PROBATION';
  } else if (student.attendanceRate < 85 || student.gpa < 3.0) {
    student.riskLevel = 'MEDIUM';
    if (student.status === 'ON_PROBATION') student.status = 'ACTIVE';
  } else {
    student.riskLevel = 'LOW';
    if (student.status === 'ON_PROBATION') student.status = 'ACTIVE';
  }
}

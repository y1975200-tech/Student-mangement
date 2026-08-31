import React, { useState, useEffect } from 'react';
import { 
  User, 
  UserRole, 
  Student, 
  Teacher, 
  Course, 
  GradeRecord, 
  Assignment, 
  Submission, 
  AttendanceRecord 
} from './types';
import { Navbar } from './components/Navbar';
import { AdminDashboard } from './components/AdminDashboard';
import { TeacherDashboard } from './components/TeacherDashboard';
import { StudentPortal } from './components/StudentPortal';
import { AiPerformanceAnalytics } from './components/AiPerformanceAnalytics';
import { HackathonGuideHub } from './components/HackathonGuideHub';
import { StudentDetailModal } from './components/StudentDetailModal';
import { TimetableGrid } from './components/TimetableGrid';
import { Sparkles, Loader2, AlertCircle } from 'lucide-react';

export default function App() {
  // Current user & RBAC
  const [currentUser, setCurrentUser] = useState<User>({
    id: 'u-admin-1',
    name: 'Dr. Katherine Vance',
    email: 'k.vance@campus.edupulse.edu',
    role: 'ADMIN',
    department: 'Academic Affairs',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80'
  });

  // Active navigation tab
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // Core Data Stores
  const [students, setStudents] = useState<Student[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [grades, setGrades] = useState<GradeRecord[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);

  // Modals & Targeted states
  const [selectedStudentForDetail, setSelectedStudentForDetail] = useState<Student | null>(null);
  const [aiTargetStudentId, setAiTargetStudentId] = useState<string>('');

  // Loading & Error states
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all initial application data
  const refreshAllData = async () => {
    try {
      setLoading(true);
      const [dashRes, stdRes, crsRes, attRes, grdRes, asgRes, subRes] = await Promise.all([
        fetch('/api/stats/dashboard').then(r => r.ok ? r.json() : {}).catch(() => ({} as any)) as Promise<any>,
        fetch('/api/students').then(r => r.ok ? r.json() : {}).catch(() => ({} as any)) as Promise<any>,
        fetch('/api/courses').then(r => r.ok ? r.json() : {}).catch(() => ({} as any)) as Promise<any>,
        fetch('/api/attendance').then(r => r.ok ? r.json() : {}).catch(() => ({} as any)) as Promise<any>,
        fetch('/api/grades').then(r => r.ok ? r.json() : {}).catch(() => ({} as any)) as Promise<any>,
        fetch('/api/assignments').then(r => r.ok ? r.json() : {}).catch(() => ({} as any)) as Promise<any>,
        fetch('/api/assignments/submissions').then(r => r.ok ? r.json() : {}).catch(() => ({} as any)) as Promise<any>
      ]);

      if (stdRes?.students) setStudents(stdRes.students);
      if (crsRes?.courses) setCourses(crsRes.courses);
      if (attRes?.attendance) setAttendance(attRes.attendance);
      if (grdRes?.grades) setGrades(grdRes.grades);
      if (asgRes?.assignments) setAssignments(asgRes.assignments);
      if (subRes?.submissions) {
        setSubmissions(subRes.submissions);
      } else if (asgRes?.submissions) {
        setSubmissions(asgRes.submissions);
      }

      // Mock teacher catalog
      setTeachers([
        {
          id: 't-101',
          name: 'Prof. Marcus Brody',
          email: 'm.brody@faculty.edupulse.edu',
          department: 'Computer Science',
          coursesTaught: ['c-101', 'c-103'],
          office: 'Engineering Hall 402'
        },
        {
          id: 't-102',
          name: 'Dr. Elena Rostova',
          email: 'e.rostova@faculty.edupulse.edu',
          department: 'Computer Science',
          coursesTaught: ['c-102', 'c-104'],
          office: 'Turing Complex 210'
        }
      ]);

      setError(null);
    } catch (err: any) {
      console.error('Data sync failed:', err);
      setError('Unable to reach local API server. Running with cache or retry.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshAllData();
  }, []);

  // Handle switching RBAC role
  const handleSwitchRole = async (newRole: UserRole) => {
    try {
      const res = await fetch('/api/auth/switch-role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole })
      });
      const data = await res.json();
      if (data.user) {
        setCurrentUser(data.user);
        // Default to dashboard when switching roles
        setActiveTab('dashboard');
      }
    } catch (err) {
      console.error('Role switch failed:', err);
    }
  };

  // Add new student
  const handleAddStudent = async (newStudentData: any) => {
    try {
      const res = await fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newStudentData)
      });
      const data = await res.json();
      if (data.student) {
        setStudents(prev => [data.student, ...prev]);
      }
    } catch (err) {
      console.error('Failed to enroll student:', err);
    }
  };

  // Add new course
  const handleAddCourse = async (newCourseData: any) => {
    try {
      const res = await fetch('/api/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCourseData)
      });
      const data = await res.json();
      if (data.course) {
        setCourses(prev => [data.course, ...prev]);
      }
    } catch (err) {
      console.error('Failed to create course:', err);
    }
  };

  // Single attendance check-in
  const handleCheckInAttendance = async (payload: any) => {
    try {
      const res = await fetch('/api/attendance/check-in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.record) {
        setAttendance(prev => [data.record, ...prev]);
        refreshAllData();
      }
    } catch (err) {
      console.error('Failed attendance check-in:', err);
    }
  };

  // Bulk attendance batch
  const handleBulkAttendance = async (payload: any) => {
    try {
      const res = await fetch('/api/attendance/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.records) {
        setAttendance(prev => [...data.records, ...prev]);
        refreshAllData();
      }
    } catch (err) {
      console.error('Failed bulk attendance:', err);
    }
  };

  // Save / Update Grade
  const handleSaveGrade = async (gradeData: any) => {
    try {
      const res = await fetch('/api/grades', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(gradeData)
      });
      const data = await res.json();
      if (data.grade) {
        setGrades(prev => {
          const filtered = prev.filter(g => !(g.studentId === data.grade.studentId && g.courseId === data.grade.courseId));
          return [data.grade, ...filtered];
        });
        refreshAllData();
      }
    } catch (err) {
      console.error('Failed saving grade:', err);
    }
  };

  // Create Assignment
  const handleCreateAssignment = async (asgData: any) => {
    try {
      const res = await fetch('/api/assignments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(asgData)
      });
      const data = await res.json();
      if (data.assignment) {
        setAssignments(prev => [data.assignment, ...prev]);
      }
    } catch (err) {
      console.error('Failed to create assignment:', err);
    }
  };

  // Submit Assignment solution as Student
  const handleSubmitAssignment = async (assignmentId: string, text: string, url: string) => {
    try {
      const currentStudentObj = students.find(s => s.studentId === currentUser.matriculationNumber) || students[0];
      const res = await fetch(`/api/assignments/${assignmentId}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: currentStudentObj.studentId,
          textSubmission: text,
          repositoryUrl: url
        })
      });
      const data = await res.json();
      if (data.submission) {
        setSubmissions(prev => [data.submission, ...prev.filter(s => s.id !== data.submission.id)]);
      }
    } catch (err) {
      console.error('Failed submitting assignment:', err);
    }
  };

  // Grade student submission as Teacher
  const handleGradeSubmission = async (payload: { assignmentId: string; studentId: string; score: number; feedback: string }) => {
    try {
      const res = await fetch(`/api/assignments/${payload.assignmentId}/grade`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.submission) {
        setSubmissions(prev => [data.submission, ...prev.filter(s => s.id !== data.submission.id)]);
      }
    } catch (err) {
      console.error('Failed grading submission:', err);
    }
  };

  // Ask AI Study Coach
  const handleAskAiCoach = async (question: string, courseCode?: string) => {
    try {
      const currentStudentObj = students.find(s => s.studentId === currentUser.matriculationNumber) || students[0];
      const res = await fetch('/api/ai/coach-advice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: currentStudentObj.studentId,
          question,
          courseCode
        })
      });
      const data = await res.json();
      return data.advice || 'Keep reviewing core textbook materials and practicing problems.';
    } catch (err) {
      return 'AI Coach is temporarily offline. Please review your lecture notes and practice exercises.';
    }
  };

  // Open AI Diagnostic tab for a specific student
  const handleOpenAiDiagnostic = (studentId: string) => {
    setAiTargetStudentId(studentId);
    setActiveTab('analytics');
  };

  // Find current mapped Student and Teacher
  const mappedStudent = students.find(s => s.studentId === currentUser.matriculationNumber) || students[0];
  const mappedTeacher = teachers[0];

  const lowAttendanceCount = students.filter(s => s.attendanceRate < 75).length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-teal-500 selection:text-slate-950 relative overflow-x-hidden">
      
      {/* Frosted Glass Background Ambient Gradients & Glowing Blur Spheres */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-gradient-to-tr from-indigo-950/40 via-slate-950 to-teal-950/30" />
      <div className="fixed top-[-100px] left-[-100px] w-96 h-96 bg-indigo-600/15 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="fixed bottom-[-100px] right-[-100px] w-[32rem] h-[32rem] bg-teal-500/15 rounded-full blur-[150px] pointer-events-none z-0" />
      <div className="fixed top-1/3 right-1/4 w-80 h-80 bg-purple-600/10 rounded-full blur-[160px] pointer-events-none z-0" />

      {/* Top Navigation Bar */}
      <Navbar
        currentUser={currentUser}
        onSwitchRole={handleSwitchRole}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        lowAttendanceCount={lowAttendanceCount}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        
        {loading && students.length === 0 ? (
          <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-12">
            <Loader2 className="h-8 w-8 text-teal-400 animate-spin" />
            <p className="text-sm font-semibold text-slate-300">Synchronizing Campus Telemetry & Diagnostics...</p>
          </div>
        ) : (
          <>
            {/* VIEW 1: ROLE-SPECIFIC DASHBOARD */}
            {activeTab === 'dashboard' && (
              <>
                {currentUser.role === 'ADMIN' && (
                  <AdminDashboard
                    students={students}
                    courses={courses}
                    teachers={teachers}
                    onSelectStudent={(id) => {
                      const std = students.find(s => s.studentId === id);
                      if (std) setSelectedStudentForDetail(std);
                    }}
                    onOpenAiDiagnostic={handleOpenAiDiagnostic}
                    onAddStudent={handleAddStudent}
                    onAddCourse={handleAddCourse}
                  />
                )}

                {currentUser.role === 'TEACHER' && (
                  <TeacherDashboard
                    currentTeacher={mappedTeacher}
                    courses={courses}
                    students={students}
                    grades={grades}
                    assignments={assignments}
                    submissions={submissions}
                    onCheckInAttendance={handleCheckInAttendance}
                    onBulkAttendance={handleBulkAttendance}
                    onSaveGrade={handleSaveGrade}
                    onCreateAssignment={handleCreateAssignment}
                    onGradeSubmission={handleGradeSubmission}
                    onOpenAiDiagnostic={handleOpenAiDiagnostic}
                  />
                )}

                {currentUser.role === 'STUDENT' && mappedStudent && (
                  <StudentPortal
                    currentStudent={mappedStudent}
                    courses={courses}
                    grades={grades}
                    assignments={assignments}
                    submissions={submissions}
                    attendance={attendance}
                    onSubmitAssignment={handleSubmitAssignment}
                    onAskAiCoach={handleAskAiCoach}
                    onOpenAiDiagnostic={handleOpenAiDiagnostic}
                  />
                )}
              </>
            )}

            {/* VIEW 2: AI PERFORMANCE ANALYTICS (HACKATHON X-FACTOR) */}
            {activeTab === 'analytics' && (
              <AiPerformanceAnalytics
                students={students}
                initialStudentId={aiTargetStudentId || students[0]?.studentId}
              />
            )}

            {/* VIEW 3: SCHEDULE / TIMETABLE */}
            {activeTab === 'timetable' && (
              <TimetableGrid courses={courses} />
            )}

            {/* VIEW 4: HACKATHON GUIDE & STARTER CODE HUB */}
            {activeTab === 'guide' && (
              <HackathonGuideHub />
            )}
          </>
        )}

      </main>

      {/* Student Dossier Modal */}
      {selectedStudentForDetail && (
        <StudentDetailModal
          student={selectedStudentForDetail}
          courses={courses}
          grades={grades}
          attendance={attendance}
          onClose={() => setSelectedStudentForDetail(null)}
          onOpenAiDiagnostic={handleOpenAiDiagnostic}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-white/10 bg-white/[0.02] backdrop-blur-xl py-6 text-slate-400 text-xs relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-teal-400 rounded-md flex items-center justify-center font-bold text-slate-950 text-[10px]">E</div>
            <span className="font-bold text-slate-200">EduPulse<span className="text-teal-400">.</span></span>
            <span className="text-slate-500">• Frosted Glass Student Management System</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span className="px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-teal-300">RBAC Enabled</span>
            <span className="px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-purple-300">Gemini 3.7 Flash</span>
          </div>
        </div>
      </footer>

    </div>
  );
}

import React, { useState } from 'react';
import { Course, Student, GradeRecord, Assignment, Submission, Teacher } from '../types';
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ShieldAlert, 
  Calendar, 
  BookOpen, 
  Award, 
  FileText, 
  Plus, 
  Save, 
  Sparkles, 
  AlertTriangle,
  Upload,
  UserCheck
} from 'lucide-react';

interface TeacherDashboardProps {
  currentTeacher: Teacher;
  courses: Course[];
  students: Student[];
  grades: GradeRecord[];
  assignments: Assignment[];
  submissions: Submission[];
  onCheckInAttendance: (payload: any) => Promise<void>;
  onBulkAttendance: (payload: any) => Promise<void>;
  onSaveGrade: (gradeData: any) => Promise<void>;
  onCreateAssignment: (asgData: any) => Promise<void>;
  onGradeSubmission: (payload: any) => Promise<void>;
  onOpenAiDiagnostic: (studentId: string) => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({
  currentTeacher,
  courses,
  students,
  grades,
  assignments,
  submissions,
  onCheckInAttendance,
  onBulkAttendance,
  onSaveGrade,
  onCreateAssignment,
  onGradeSubmission,
  onOpenAiDiagnostic
}) => {
  // Filter courses taught by this teacher (or fallback to all if none mapped)
  const teacherCourses = courses.filter(c => c.teacherId === currentTeacher.id || currentTeacher.coursesTaught.includes(c.id));
  const activeCourse = teacherCourses[0] || courses[0];

  const [selectedCourseId, setSelectedCourseId] = useState(activeCourse?.id || '');
  const [activeTab, setActiveTab] = useState<'attendance' | 'grades' | 'assignments'>('attendance');

  // Attendance Sheet state
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
  const [sessionTopic, setSessionTopic] = useState('Dynamic Programming & Memoization');
  
  // Enrolled students for selected course
  const currentCourse = courses.find(c => c.id === selectedCourseId) || courses[0];
  const enrolledStudents = students.filter(s => s.enrolledCourseIds.includes(currentCourse?.id || ''));

  // Local attendance grid map: studentId -> status
  const [localAttendance, setLocalAttendance] = useState<{ [studentId: string]: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED' }>({});
  const [attendanceSuccessMessage, setAttendanceSuccessMessage] = useState<string | null>(null);

  // Grade edit state: studentId -> { assignment, midterm, final, feedback }
  const [localGrades, setLocalGrades] = useState<{ [studentId: string]: { assignmentsScore: number; midtermScore: number; finalExamScore: number; feedback: string } }>({});
  const [gradeSuccessMessage, setGradeSuccessMessage] = useState<string | null>(null);

  // Assignment creation modal
  const [showAsgModal, setShowAsgModal] = useState(false);
  const [newAsg, setNewAsg] = useState({
    title: '',
    description: '',
    dueDate: new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 16),
    totalMarks: 100,
    resourcesUrl: ''
  });

  // Handle local attendance status toggle
  const setStudentStatus = (studentId: string, status: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED') => {
    setLocalAttendance(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  // Mark all present
  const handleMarkAllPresent = () => {
    const updated: { [id: string]: 'PRESENT' } = {};
    enrolledStudents.forEach(s => {
      updated[s.studentId] = 'PRESENT';
    });
    setLocalAttendance(updated);
  };

  // Submit bulk attendance
  const handleSubmitAttendance = async () => {
    const checkIns = enrolledStudents.map(s => ({
      studentId: s.studentId,
      status: localAttendance[s.studentId] || 'PRESENT'
    }));

    await onBulkAttendance({
      courseId: currentCourse.id,
      date: attendanceDate,
      sessionTopic,
      checkIns
    });

    setAttendanceSuccessMessage(`Attendance saved for ${checkIns.length} students in ${currentCourse.code}!`);
    setTimeout(() => setAttendanceSuccessMessage(null), 4000);
  };

  // Handle grade change
  const handleGradeFieldChange = (studentId: string, field: 'assignmentsScore' | 'midtermScore' | 'finalExamScore' | 'feedback', value: any) => {
    const existing = localGrades[studentId] || {
      assignmentsScore: 85,
      midtermScore: 80,
      finalExamScore: 85,
      feedback: ''
    };

    setLocalGrades({
      ...localGrades,
      [studentId]: {
        ...existing,
        [field]: value
      }
    });
  };

  // Submit single student grade
  const handleSaveStudentGrade = async (student: Student) => {
    const data = localGrades[student.studentId] || {
      assignmentsScore: 85,
      midtermScore: 80,
      finalExamScore: 85,
      feedback: ''
    };

    await onSaveGrade({
      studentId: student.studentId,
      courseId: currentCourse.id,
      assignmentsScore: data.assignmentsScore,
      midtermScore: data.midtermScore,
      finalExamScore: data.finalExamScore,
      teacherFeedback: data.feedback
    });

    setGradeSuccessMessage(`Grade saved and GPA updated for ${student.name}!`);
    setTimeout(() => setGradeSuccessMessage(null), 4000);
  };

  const handleCreateAssignmentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAsg.title || !newAsg.dueDate) return;

    await onCreateAssignment({
      courseId: currentCourse.id,
      ...newAsg
    });

    setShowAsgModal(false);
    setNewAsg({
      title: '',
      description: '',
      dueDate: new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 16),
      totalMarks: 100,
      resourcesUrl: ''
    });
  };

  const courseAssignments = assignments.filter(a => a.courseId === currentCourse?.id || a.courseCode === currentCourse?.code);

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-white/[0.04] backdrop-blur-xl border border-white/10 p-6 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-500/10 text-teal-300 border border-teal-500/25 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
              Faculty Instruction Workspace
            </span>
            <span className="text-xs text-slate-400">{currentTeacher.name} • {currentTeacher.department}</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-1.5">Classroom Attendance & Continuous Assessment</h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Conduct interactive check-ins, record weighted exam components with real-time GPA calculations, and review submissions.
          </p>
        </div>

        {/* Course Selector Dropdown */}
        <div className="bg-slate-950/50 backdrop-blur-md p-3 rounded-2xl border border-white/10 flex items-center gap-3">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Course:</span>
          <select
            value={selectedCourseId}
            onChange={(e) => setSelectedCourseId(e.target.value)}
            className="bg-white/[0.06] border border-white/15 text-xs font-semibold text-teal-300 rounded-xl px-3 py-1.5 focus:outline-none focus:border-teal-400"
          >
            {courses.map(c => (
              <option key={c.id} value={c.id} className="bg-slate-900 text-white">{c.code}: {c.title}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center justify-between border-b border-white/10 pb-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('attendance')}
            className={`px-4 py-2 rounded-2xl text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'attendance'
                ? 'bg-white/15 text-teal-300 border border-white/15 shadow-sm backdrop-blur-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <UserCheck className="h-4 w-4 text-teal-400" />
            <span>Attendance Sheet ({enrolledStudents.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('grades')}
            className={`px-4 py-2 rounded-2xl text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'grades'
                ? 'bg-white/15 text-teal-300 border border-white/15 shadow-sm backdrop-blur-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Award className="h-4 w-4 text-indigo-400" />
            <span>Gradebook & GPA Engine</span>
          </button>
          <button
            onClick={() => setActiveTab('assignments')}
            className={`px-4 py-2 rounded-2xl text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'assignments'
                ? 'bg-white/15 text-teal-300 border border-white/15 shadow-sm backdrop-blur-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="h-4 w-4 text-purple-400" />
            <span>Coursework & Submissions ({courseAssignments.length})</span>
          </button>
        </div>

        {activeTab === 'assignments' && (
          <button
            onClick={() => setShowAsgModal(true)}
            className="px-3.5 py-1.5 rounded-2xl bg-teal-400 hover:bg-teal-300 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-[0_0_15px_rgba(45,212,191,0.3)] cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Publish Assignment</span>
          </button>
        )}
      </div>

      {/* Success Notification Banners */}
      {attendanceSuccessMessage && (
        <div className="p-3 bg-teal-500/10 border border-teal-500/30 rounded-2xl text-teal-300 text-xs font-semibold flex items-center gap-2 backdrop-blur-md">
          <CheckCircle2 className="h-4 w-4" />
          <span>{attendanceSuccessMessage}</span>
        </div>
      )}

      {gradeSuccessMessage && (
        <div className="p-3 bg-teal-500/10 border border-teal-500/30 rounded-2xl text-teal-300 text-xs font-semibold flex items-center gap-2 backdrop-blur-md">
          <CheckCircle2 className="h-4 w-4" />
          <span>{gradeSuccessMessage}</span>
        </div>
      )}

      {activeTab === 'attendance' && (
        /* ================= ATTENDANCE CHECK-IN SHEET ================= */
        <div className="bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl space-y-6">
          
          {/* Lecture Info Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/[0.02] p-4 rounded-2xl border border-white/10">
            <div className="flex flex-wrap items-center gap-4">
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Session Date</label>
                <input
                  type="date"
                  value={attendanceDate}
                  onChange={(e) => setAttendanceDate(e.target.value)}
                  className="bg-slate-950/60 border border-white/10 text-xs text-white rounded-xl px-3 py-1.5 focus:outline-none focus:border-teal-400"
                />
              </div>

              <div className="flex-1 min-w-[240px]">
                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Lecture Topic</label>
                <input
                  type="text"
                  value={sessionTopic}
                  onChange={(e) => setSessionTopic(e.target.value)}
                  placeholder="e.g. Graph Traversal Algorithms..."
                  className="w-full bg-slate-950/60 border border-white/10 text-xs text-white rounded-xl px-3 py-1.5 focus:outline-none focus:border-teal-400"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleMarkAllPresent}
                className="px-3.5 py-2 rounded-2xl bg-white/10 hover:bg-white/15 text-teal-300 text-xs font-semibold border border-white/10 flex items-center gap-1.5 transition-all cursor-pointer backdrop-blur-md"
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>Mark All Present</span>
              </button>
              <button
                onClick={handleSubmitAttendance}
                className="px-4 py-2 rounded-2xl bg-teal-400 hover:bg-teal-300 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-[0_0_15px_rgba(45,212,191,0.3)] transition-all cursor-pointer"
              >
                <Save className="h-4 w-4" />
                <span>Save Attendance Batch</span>
              </button>
            </div>
          </div>

          {/* Attendance Roster Grid */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400 font-semibold px-2">
              <span>Student Details</span>
              <span>Semester Attendance Status & Quick Check-in</span>
            </div>

            {enrolledStudents.map(s => {
              const currentStatus = localAttendance[s.studentId] || 'PRESENT';
              const isBelowCutoff = s.attendanceRate < 75;

              return (
                <div
                  key={s.id}
                  className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 backdrop-blur-md ${
                    isBelowCutoff 
                      ? 'bg-rose-500/[0.08] border-rose-500/30' 
                      : 'bg-white/[0.02] border-white/10 hover:bg-white/[0.05]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img src={s.avatar} alt={s.name} className="h-10 w-10 rounded-2xl object-cover ring-1 ring-white/20" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">{s.name}</span>
                        <span className="font-mono text-xs text-slate-400">({s.studentId})</span>
                        {isBelowCutoff && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 flex items-center gap-1">
                            <AlertTriangle className="h-3 w-3" />
                            CRITICAL &lt; 75%
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5">
                        <span>{s.department}</span>
                        <span>•</span>
                        <span className={`font-semibold ${isBelowCutoff ? 'text-rose-400 font-bold' : 'text-teal-400'}`}>
                          Overall Attendance: {s.attendanceRate}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Interactive Status Buttons */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setStudentStatus(s.studentId, 'PRESENT')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                        currentStatus === 'PRESENT'
                          ? 'bg-teal-400 text-slate-950 font-bold shadow-[0_0_12px_rgba(45,212,191,0.4)]'
                          : 'bg-white/5 text-slate-400 hover:text-teal-300 border border-white/10'
                      }`}
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>Present</span>
                    </button>

                    <button
                      onClick={() => setStudentStatus(s.studentId, 'ABSENT')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                        currentStatus === 'ABSENT'
                          ? 'bg-rose-500 text-white shadow-sm ring-1 ring-rose-400/40'
                          : 'bg-white/5 text-slate-400 hover:text-rose-300 border border-white/10'
                      }`}
                    >
                      <XCircle className="h-3.5 w-3.5" />
                      <span>Absent</span>
                    </button>

                    <button
                      onClick={() => setStudentStatus(s.studentId, 'LATE')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                        currentStatus === 'LATE'
                          ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                          : 'bg-white/5 text-slate-400 hover:text-amber-300 border border-white/10'
                      }`}
                    >
                      <Clock className="h-3.5 w-3.5" />
                      <span>Late</span>
                    </button>

                    <button
                      onClick={() => onOpenAiDiagnostic(s.studentId)}
                      className="p-1.5 rounded-xl bg-purple-500/15 text-purple-300 hover:bg-purple-500/25 border border-purple-500/30 transition-all ml-1 cursor-pointer"
                      title="Run AI Academic Diagnostic"
                    >
                      <Sparkles className="h-4 w-4" />
                    </button>
                  </div>

                </div>
              );
            })}
          </div>

        </div>
      )}

      {activeTab === 'grades' && (
        /* ================= GRADEBOOK & CONTINUOUS ASSESSMENT ================= */
        <div className="bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl space-y-6">
          <div className="flex items-center justify-between bg-white/[0.02] p-4 rounded-2xl border border-white/10">
            <div>
              <h2 className="text-sm font-bold text-white">Continuous Assessment Weighting Distribution</h2>
              <p className="text-xs text-slate-400">
                Formula: (30% Assignments) + (30% Midterm Exam) + (40% Final Exam) = Total Score → Letter Grade & 4.0 GPA
              </p>
            </div>
            <div className="text-xs font-mono text-teal-300 font-semibold bg-teal-500/10 px-3 py-1.5 rounded-xl border border-teal-500/30">
              Live Auto-Recalculate Active
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-white/[0.02] text-xs uppercase tracking-wider text-slate-400 border-b border-white/10 font-semibold">
                <tr>
                  <th className="px-4 py-3">Student Profile</th>
                  <th className="px-3 py-3 w-28">Assignment (30%)</th>
                  <th className="px-3 py-3 w-28">Midterm (30%)</th>
                  <th className="px-3 py-3 w-28">Final Exam (40%)</th>
                  <th className="px-3 py-3">Total Score</th>
                  <th className="px-3 py-3">Letter Grade</th>
                  <th className="px-4 py-3">Faculty Feedback</th>
                  <th className="px-3 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-medium">
                {enrolledStudents.map(s => {
                  const existingGrade = grades.find(g => g.studentId === s.studentId && (g.courseId === currentCourse.id || g.courseCode === currentCourse.code));
                  const editData = localGrades[s.studentId] || {
                    assignmentsScore: existingGrade ? existingGrade.assignmentsScore : 80,
                    midtermScore: existingGrade ? existingGrade.midtermScore : 75,
                    finalExamScore: existingGrade ? existingGrade.finalExamScore : 85,
                    feedback: existingGrade ? existingGrade.teacherFeedback || '' : ''
                  };

                  const computedTotal = Number(((editData.assignmentsScore * 0.3) + (editData.midtermScore * 0.3) + (editData.finalExamScore * 0.4)).toFixed(1));
                  
                  let computedLetter = 'F';
                  if (computedTotal >= 90) computedLetter = 'A+';
                  else if (computedTotal >= 85) computedLetter = 'A';
                  else if (computedTotal >= 80) computedLetter = 'A-';
                  else if (computedTotal >= 75) computedLetter = 'B+';
                  else if (computedTotal >= 70) computedLetter = 'B';
                  else if (computedTotal >= 65) computedLetter = 'B-';
                  else if (computedTotal >= 60) computedLetter = 'C+';
                  else if (computedTotal >= 55) computedLetter = 'C';
                  else if (computedTotal >= 50) computedLetter = 'D';

                  return (
                    <tr key={s.id} className="hover:bg-white/[0.04] transition-colors">
                      
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <img src={s.avatar} alt={s.name} className="h-7 w-7 rounded-xl object-cover ring-1 ring-white/20" />
                          <div>
                            <span className="text-xs font-bold text-white block">{s.name}</span>
                            <span className="font-mono text-[10px] text-slate-400">{s.studentId}</span>
                          </div>
                        </div>
                      </td>

                      {/* Assignment Input */}
                      <td className="px-3 py-3">
                        <input
                          type="number"
                          min={0}
                          max={100}
                          value={editData.assignmentsScore}
                          onChange={(e) => handleGradeFieldChange(s.studentId, 'assignmentsScore', Number(e.target.value))}
                          className="w-20 bg-slate-950/60 border border-white/10 rounded-xl px-2.5 py-1 text-xs text-slate-200 font-mono focus:outline-none focus:border-teal-400"
                        />
                      </td>

                      {/* Midterm Input */}
                      <td className="px-3 py-3">
                        <input
                          type="number"
                          min={0}
                          max={100}
                          value={editData.midtermScore}
                          onChange={(e) => handleGradeFieldChange(s.studentId, 'midtermScore', Number(e.target.value))}
                          className="w-20 bg-slate-950/60 border border-white/10 rounded-xl px-2.5 py-1 text-xs text-slate-200 font-mono focus:outline-none focus:border-teal-400"
                        />
                      </td>

                      {/* Final Exam Input */}
                      <td className="px-3 py-3">
                        <input
                          type="number"
                          min={0}
                          max={100}
                          value={editData.finalExamScore}
                          onChange={(e) => handleGradeFieldChange(s.studentId, 'finalExamScore', Number(e.target.value))}
                          className="w-20 bg-slate-950/60 border border-white/10 rounded-xl px-2.5 py-1 text-xs text-slate-200 font-mono focus:outline-none focus:border-teal-400"
                        />
                      </td>

                      {/* Computed Total */}
                      <td className="px-3 py-3 font-mono font-bold text-xs text-white">
                        {computedTotal}%
                      </td>

                      {/* Letter Grade */}
                      <td className="px-3 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold font-mono ${
                          computedTotal >= 80 ? 'bg-teal-500/15 text-teal-300 border border-teal-500/30' : computedTotal >= 65 ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        }`}>
                          {computedLetter}
                        </span>
                      </td>

                      {/* Feedback Input */}
                      <td className="px-4 py-3">
                        <input
                          type="text"
                          placeholder="Optional remarks..."
                          value={editData.feedback}
                          onChange={(e) => handleGradeFieldChange(s.studentId, 'feedback', e.target.value)}
                          className="w-full bg-slate-950/60 border border-white/10 rounded-xl px-2.5 py-1 text-xs text-slate-300 focus:outline-none focus:border-teal-400"
                        />
                      </td>

                      {/* Save Button */}
                      <td className="px-3 py-3 text-right">
                        <button
                          onClick={() => handleSaveStudentGrade(s)}
                          className="px-3 py-1 rounded-xl bg-teal-500/15 hover:bg-teal-400 hover:text-slate-950 text-teal-300 border border-teal-500/30 text-xs font-semibold transition-all cursor-pointer"
                        >
                          Save
                        </button>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {activeTab === 'assignments' && (
        /* ================= ASSIGNMENT PORTAL & SUBMISSIONS ================= */
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {courseAssignments.map(asg => {
              const asgSubs = submissions.filter(s => s.assignmentId === asg.id);

              return (
                <div key={asg.id} className="bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-3xl p-5 shadow-xl space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="px-2 py-0.5 rounded-xl text-[11px] font-mono font-semibold bg-teal-500/10 text-teal-300 border border-teal-500/30">
                        {asg.courseCode}
                      </span>
                      <h3 className="text-base font-bold text-white mt-1.5">{asg.title}</h3>
                    </div>
                    <span className="text-xs font-bold text-slate-400">{asg.totalMarks} Marks</span>
                  </div>

                  <p className="text-xs text-slate-400">{asg.description}</p>

                  <div className="bg-white/[0.03] p-3 rounded-2xl border border-white/10 flex items-center justify-between text-xs">
                    <span className="text-slate-400">Due Date:</span>
                    <span className="font-mono text-teal-300 font-semibold">
                      {new Date(asg.dueDate).toLocaleDateString()} at {new Date(asg.dueDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  {/* Submissions list for this assignment */}
                  <div className="space-y-2 pt-2 border-t border-white/10">
                    <span className="text-xs font-bold text-slate-300 block">Student Submissions ({asgSubs.length}):</span>
                    
                    {asgSubs.length === 0 ? (
                      <p className="text-xs text-slate-500 italic">No submissions logged yet.</p>
                    ) : (
                      asgSubs.map(sub => (
                        <div key={sub.id} className="bg-white/[0.02] p-3 rounded-2xl border border-white/10 flex items-center justify-between text-xs">
                          <div>
                            <span className="font-bold text-white">{sub.studentName}</span>
                            <span className="font-mono text-slate-400 text-[10px] ml-1.5">({sub.studentId})</span>
                            <p className="text-[11px] text-slate-400 truncate max-w-xs">{sub.textSubmission}</p>
                          </div>

                          <div className="flex items-center gap-2">
                            {sub.score !== undefined ? (
                              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-teal-500/15 text-teal-300 border border-teal-500/30">
                                {sub.score}/{asg.totalMarks}
                              </span>
                            ) : (
                              <button
                                onClick={() => onGradeSubmission({ assignmentId: asg.id, studentId: sub.studentId, score: 92, feedback: 'Well structured implementation.' })}
                                className="px-2.5 py-1 rounded-xl bg-teal-500/15 hover:bg-teal-400 hover:text-slate-950 text-teal-300 border border-teal-500/30 text-xs font-semibold cursor-pointer transition-all"
                              >
                                Quick Grade
                              </button>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Publish Assignment Modal */}
      {showAsgModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900/90 backdrop-blur-2xl border border-white/15 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <FileText className="h-5 w-5 text-teal-400" />
                <span>Publish Course Assignment</span>
              </h2>
              <button onClick={() => setShowAsgModal(false)} className="text-slate-400 hover:text-white cursor-pointer">✕</button>
            </div>

            <form onSubmit={handleCreateAssignmentSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Assignment Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Lab 4: B-Tree Index Engine"
                  value={newAsg.title}
                  onChange={(e) => setNewAsg({ ...newAsg, title: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-2xl bg-slate-950/60 border border-white/10 text-xs text-slate-200 focus:outline-none focus:border-teal-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Instructions & Problem Statement</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Describe requirements, deliverables, and test case expectations..."
                  value={newAsg.description}
                  onChange={(e) => setNewAsg({ ...newAsg, description: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-2xl bg-slate-950/60 border border-white/10 text-xs text-slate-200 focus:outline-none focus:border-teal-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Due Cutoff</label>
                  <input
                    type="datetime-local"
                    required
                    value={newAsg.dueDate}
                    onChange={(e) => setNewAsg({ ...newAsg, dueDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-2xl bg-slate-950/60 border border-white/10 text-xs text-slate-200 focus:outline-none focus:border-teal-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Max Marks</label>
                  <input
                    type="number"
                    min={10}
                    max={200}
                    value={newAsg.totalMarks}
                    onChange={(e) => setNewAsg({ ...newAsg, totalMarks: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-2xl bg-slate-950/60 border border-white/10 text-xs text-slate-200 focus:outline-none focus:border-teal-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Resource / Specification URL (Optional)</label>
                <input
                  type="url"
                  placeholder="https://docs.edupulse.edu/lab4-spec.pdf"
                  value={newAsg.resourcesUrl}
                  onChange={(e) => setNewAsg({ ...newAsg, resourcesUrl: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-2xl bg-slate-950/60 border border-white/10 text-xs text-slate-200 focus:outline-none focus:border-teal-400"
                />
              </div>

              <div className="pt-3 border-t border-white/10 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAsgModal(false)}
                  className="px-4 py-2 rounded-2xl bg-white/10 hover:bg-white/15 text-slate-300 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-2xl bg-teal-400 hover:bg-teal-300 text-slate-950 text-xs font-bold cursor-pointer shadow-[0_0_15px_rgba(45,212,191,0.3)]"
                >
                  Publish Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

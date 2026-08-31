import React, { useState } from 'react';
import { Student, Course, Teacher } from '../types';
import { 
  Users, 
  BookOpen, 
  AlertTriangle, 
  GraduationCap, 
  Plus, 
  Search, 
  Filter, 
  Sparkles, 
  ChevronRight, 
  TrendingUp, 
  UserCheck,
  Building,
  CheckCircle2,
  Calendar
} from 'lucide-react';

interface AdminDashboardProps {
  students: Student[];
  courses: Course[];
  teachers: Teacher[];
  onSelectStudent: (studentId: string) => void;
  onOpenAiDiagnostic: (studentId: string) => void;
  onAddStudent: (newStudentData: any) => Promise<void>;
  onAddCourse: (newCourseData: any) => Promise<void>;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  students,
  courses,
  teachers,
  onSelectStudent,
  onOpenAiDiagnostic,
  onAddStudent,
  onAddCourse
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('ALL');
  const [selectedRisk, setSelectedRisk] = useState('ALL');
  const [activeSection, setActiveSection] = useState<'students' | 'courses'>('students');

  // Modals
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [showCourseModal, setShowCourseModal] = useState(false);

  // Form states
  const [newStudent, setNewStudent] = useState({
    name: '',
    email: '',
    department: 'Computer Science',
    semester: 1,
    phone: ''
  });

  const [newCourse, setNewCourse] = useState({
    code: '',
    title: '',
    department: 'Computer Science',
    credits: 3,
    semester: 1,
    teacherId: teachers[0]?.id || '',
    capacity: 60,
    syllabus: ''
  });

  // Filtered students
  const filteredStudents = students.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = selectedDept === 'ALL' || s.department === selectedDept;
    const matchesRisk = selectedRisk === 'ALL' || s.riskLevel === selectedRisk;
    return matchesSearch && matchesDept && matchesRisk;
  });

  const lowAttendanceStudents = students.filter(s => s.attendanceRate < 75);
  const highRiskStudents = students.filter(s => s.riskLevel === 'HIGH');
  const avgGpa = (students.reduce((acc, s) => acc + s.gpa, 0) / (students.length || 1)).toFixed(2);
  const avgAttendance = (students.reduce((acc, s) => acc + s.attendanceRate, 0) / (students.length || 1)).toFixed(1);

  const handleEnrollSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudent.name || !newStudent.email) return;
    await onAddStudent(newStudent);
    setShowEnrollModal(false);
    setNewStudent({ name: '', email: '', department: 'Computer Science', semester: 1, phone: '' });
  };

  const handleCourseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourse.code || !newCourse.title) return;
    await onAddCourse(newCourse);
    setShowCourseModal(false);
    setNewCourse({
      code: '',
      title: '',
      department: 'Computer Science',
      credits: 3,
      semester: 1,
      teacherId: teachers[0]?.id || '',
      capacity: 60,
      syllabus: ''
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/[0.04] backdrop-blur-xl border border-white/10 p-6 rounded-3xl shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-500/10 text-teal-300 border border-teal-500/25 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
              Administrative Operations
            </span>
            <span className="text-xs text-slate-400">Academic Year 2025-2026</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-1.5">Campus Operations & Student Lifecycle</h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Monitor real-time enrollment telemetry, attendance compliance, GPA trajectories, and AI risk diagnostics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowEnrollModal(true)}
            className="px-4 py-2.5 rounded-2xl bg-teal-400 hover:bg-teal-300 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-[0_0_20px_rgba(45,212,191,0.3)] transition-all cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Enroll Student</span>
          </button>
          <button
            onClick={() => setShowCourseModal(true)}
            className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs border border-white/10 backdrop-blur-md flex items-center gap-2 transition-all cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Add Course</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Students */}
        <div className="bg-white/[0.04] backdrop-blur-xl border border-white/10 p-5 rounded-3xl shadow-lg hover:bg-white/[0.07] hover:border-white/20 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Enrolled</span>
            <div className="p-2.5 rounded-2xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
              <Users className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white">{students.length}</span>
            <span className="text-xs font-medium text-teal-400 flex items-center gap-0.5">
              <TrendingUp className="h-3 w-3" /> +12% YoY
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Across 3 academic departments</p>
        </div>

        {/* Avg Campus GPA */}
        <div className="bg-white/[0.04] backdrop-blur-xl border border-white/10 p-5 rounded-3xl shadow-lg hover:bg-white/[0.07] hover:border-white/20 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Campus Avg GPA</span>
            <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <GraduationCap className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white">{avgGpa}</span>
            <span className="text-xs text-slate-400">/ 4.00 Scale</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Weighted continuous evaluation</p>
        </div>

        {/* Campus Attendance Rate */}
        <div className="bg-white/[0.04] backdrop-blur-xl border border-white/10 p-5 rounded-3xl shadow-lg hover:bg-white/[0.07] hover:border-white/20 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Attendance Rate</span>
            <div className="p-2.5 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <UserCheck className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white">{avgAttendance}%</span>
            <span className="text-xs text-slate-400">Policy: 75% cutoff</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Live check-in telemetry</p>
        </div>

        {/* At-Risk / Low Attendance Alerts */}
        <div className={`p-5 rounded-3xl shadow-lg border backdrop-blur-xl transition-all ${
          lowAttendanceStudents.length > 0 
            ? 'bg-rose-500/[0.08] border-rose-500/30' 
            : 'bg-white/[0.04] border-white/10'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-rose-300 uppercase tracking-wider">At-Risk Early Flags</span>
            <div className="p-2.5 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
              <AlertTriangle className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-rose-200">{lowAttendanceStudents.length + highRiskStudents.length}</span>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
              Attention Required
            </span>
          </div>
          <p className="text-xs text-rose-300/80 mt-1">
            {lowAttendanceStudents.length} students under 75% cutoff
          </p>
        </div>

      </div>

      {/* Low-Attendance & At-Risk Emergency Callout */}
      {lowAttendanceStudents.length > 0 && (
        <div className="bg-rose-500/[0.06] backdrop-blur-xl border border-rose-500/30 p-4 rounded-3xl flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center shrink-0">
              <AlertTriangle className="h-5 w-5 text-rose-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-rose-200 flex items-center gap-2">
                <span>Automated Attendance Cutoff Flags ({lowAttendanceStudents.length} Students At Risk of Debarment)</span>
              </h3>
              <p className="text-xs text-slate-300">
                Campus policy requires ≥75% lecture check-ins. Students flagged below this threshold cannot sit for end-semester examinations.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {lowAttendanceStudents.slice(0, 2).map(s => (
              <button
                key={s.id}
                onClick={() => onOpenAiDiagnostic(s.studentId)}
                className="px-3 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 text-xs font-semibold border border-rose-500/40 flex items-center gap-1.5 transition-all cursor-pointer backdrop-blur-md"
              >
                <Sparkles className="h-3.5 w-3.5 text-purple-300" />
                <span>AI Diagnostic: {s.name.split(' ')[0]} ({s.attendanceRate}%)</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Tabs Switcher: Students Directory vs Course Catalog */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-2">
        <button
          onClick={() => setActiveSection('students')}
          className={`px-4 py-2 rounded-2xl text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer ${
            activeSection === 'students'
              ? 'bg-white/15 text-teal-300 border border-white/15 shadow-sm backdrop-blur-md'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Users className="h-4 w-4 text-teal-400" />
          <span>Student Directory & Tracking ({students.length})</span>
        </button>
        <button
          onClick={() => setActiveSection('courses')}
          className={`px-4 py-2 rounded-2xl text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer ${
            activeSection === 'courses'
              ? 'bg-white/15 text-teal-300 border border-white/15 shadow-sm backdrop-blur-md'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <BookOpen className="h-4 w-4 text-indigo-400" />
          <span>Curriculum Courses & Faculty ({courses.length})</span>
        </button>
      </div>

      {activeSection === 'students' ? (
        /* ================= STUDENTS DIRECTORY VIEW ================= */
        <div className="bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
          
          {/* Filter Bar */}
          <div className="p-4 bg-white/[0.02] border-b border-white/10 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search student by name, matriculation ID, or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-2xl bg-slate-950/50 border border-white/10 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400/40 backdrop-blur-md"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <Filter className="h-3.5 w-3.5" />
                <span>Department:</span>
              </div>
              <select
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="bg-slate-950/50 border border-white/10 text-xs text-slate-200 rounded-xl px-3 py-1.5 focus:outline-none focus:border-teal-400 backdrop-blur-md"
              >
                <option value="ALL">All Departments</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Software Engineering">Software Engineering</option>
                <option value="Mathematics & Data">Mathematics & Data</option>
              </select>

              <div className="flex items-center gap-1.5 text-xs text-slate-400 ml-2">
                <span>Risk:</span>
              </div>
              <select
                value={selectedRisk}
                onChange={(e) => setSelectedRisk(e.target.value)}
                className="bg-slate-950/50 border border-white/10 text-xs text-slate-200 rounded-xl px-3 py-1.5 focus:outline-none focus:border-teal-400 backdrop-blur-md"
              >
                <option value="ALL">All Risk Levels</option>
                <option value="LOW">Low Risk</option>
                <option value="MEDIUM">Medium Risk</option>
                <option value="HIGH">High Risk (Urgent)</option>
              </select>
            </div>

          </div>

          {/* Students Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-white/[0.02] text-xs uppercase tracking-wider text-slate-400 border-b border-white/10 font-semibold">
                <tr>
                  <th className="px-5 py-3.5">Student Profile</th>
                  <th className="px-4 py-3.5">Matriculation ID</th>
                  <th className="px-4 py-3.5">Department & Sem</th>
                  <th className="px-4 py-3.5">Cumulative GPA</th>
                  <th className="px-4 py-3.5">Attendance Rate</th>
                  <th className="px-4 py-3.5">Risk Level</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-300 font-medium">
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-10 text-slate-400 text-xs">
                      No student records match your query filters.
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((s) => (
                    <tr key={s.id} className="hover:bg-white/[0.04] transition-colors group">
                      
                      {/* Name & Avatar */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <img
                            src={s.avatar}
                            alt={s.name}
                            className="h-9 w-9 rounded-2xl object-cover ring-1 ring-white/20"
                          />
                          <div>
                            <span className="font-semibold text-white group-hover:text-teal-300 transition-colors text-xs">
                              {s.name}
                            </span>
                            <p className="text-[11px] text-slate-400">{s.email}</p>
                          </div>
                        </div>
                      </td>

                      {/* Matriculation ID */}
                      <td className="px-4 py-3.5 font-mono text-xs text-slate-300">
                        {s.studentId}
                      </td>

                      {/* Department & Semester */}
                      <td className="px-4 py-3.5">
                        <div className="text-xs font-medium text-slate-200">{s.department}</div>
                        <span className="text-[11px] text-slate-400">Semester {s.semester}</span>
                      </td>

                      {/* Cumulative GPA */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1.5">
                          <span className={`font-bold font-mono text-sm ${
                            s.gpa >= 3.5 ? 'text-teal-400' : s.gpa >= 2.5 ? 'text-indigo-300' : 'text-rose-400'
                          }`}>
                            {s.gpa.toFixed(2)}
                          </span>
                          <span className="text-[11px] text-slate-400">/ 4.0</span>
                        </div>
                      </td>

                      {/* Attendance Rate */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-white/10 h-2 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                s.attendanceRate >= 85 ? 'bg-teal-400 shadow-[0_0_8px_rgba(45,212,191,0.5)]' : s.attendanceRate >= 75 ? 'bg-amber-400' : 'bg-rose-500'
                              }`}
                              style={{ width: `${s.attendanceRate}%` }}
                            />
                          </div>
                          <span className={`text-xs font-bold ${
                            s.attendanceRate < 75 ? 'text-rose-400' : s.attendanceRate < 85 ? 'text-amber-300' : 'text-teal-400'
                          }`}>
                            {s.attendanceRate}%
                          </span>
                          {s.attendanceRate < 75 && (
                            <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">
                              FLAGGED
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Risk Level */}
                      <td className="px-4 py-3.5">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          s.riskLevel === 'HIGH'
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                            : s.riskLevel === 'MEDIUM'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                              : 'bg-teal-500/15 text-teal-300 border border-teal-500/30'
                        }`}>
                          {s.riskLevel === 'HIGH' && <AlertTriangle className="h-3 w-3" />}
                          {s.riskLevel === 'LOW' && <CheckCircle2 className="h-3 w-3" />}
                          {s.riskLevel}
                        </span>
                      </td>

                      {/* Action Buttons */}
                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => onOpenAiDiagnostic(s.studentId)}
                            className="px-2.5 py-1.5 rounded-xl bg-purple-500/15 hover:bg-purple-500/25 text-purple-300 border border-purple-500/30 text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer backdrop-blur-md"
                            title="Generate Gemini AI Diagnostic & Study Roadmap"
                          >
                            <Sparkles className="h-3.5 w-3.5 text-purple-400" />
                            <span>AI Report</span>
                          </button>
                          
                          <button
                            onClick={() => onSelectStudent(s.studentId)}
                            className="px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 hover:text-white border border-white/10 text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer backdrop-blur-md"
                          >
                            <span>Dossier</span>
                            <ChevronRight className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>

                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

        </div>
      ) : (
        /* ================= COURSES CATALOG VIEW ================= */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {courses.map((c) => (
            <div
              key={c.id}
              className="bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-3xl p-5 shadow-xl flex flex-col justify-between hover:bg-white/[0.07] hover:border-white/20 transition-all"
            >
              <div>
                <div className="flex items-start justify-between">
                  <span className="px-2.5 py-1 rounded-xl text-xs font-mono font-bold bg-teal-500/10 text-teal-300 border border-teal-500/30">
                    {c.code}
                  </span>
                  <span className="text-xs font-semibold text-slate-400">{c.credits} Credits • Sem {c.semester}</span>
                </div>

                <h3 className="text-base font-bold text-white mt-2 leading-snug">{c.title}</h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">{c.syllabus}</p>

                <div className="mt-4 pt-3 border-t border-white/10 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="text-slate-400">Instructor:</span>
                    <span className="font-semibold text-white">{c.teacherName}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="text-slate-400">Department:</span>
                    <span>{c.department}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="text-slate-400">Capacity:</span>
                    <span className="font-mono">{c.enrolledCount} / {c.capacity} Students</span>
                  </div>
                </div>

                <div className="mt-3 bg-white/[0.03] p-3 rounded-2xl border border-white/10">
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1 mb-1.5">
                    <Calendar className="h-3 w-3 text-teal-400" />
                    <span>Weekly Lecture Times:</span>
                  </div>
                  {c.schedule.map((slot, i) => (
                    <div key={i} className="text-xs text-slate-300 flex justify-between py-0.5">
                      <span>{slot.day} ({slot.time})</span>
                      <span className="text-teal-300 font-mono">{slot.room}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                <span className="text-xs text-teal-400 font-medium flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Active Section
                </span>
                <span className="text-xs text-slate-400">Spring 2026</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Enroll Student Modal */}
      {showEnrollModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900/90 backdrop-blur-2xl border border-white/15 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-teal-400" />
                <span>Enroll New Student</span>
              </h2>
              <button onClick={() => setShowEnrollModal(false)} className="text-slate-400 hover:text-white cursor-pointer">✕</button>
            </div>

            <form onSubmit={handleEnrollSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Full Legal Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rachel Adams"
                  value={newStudent.name}
                  onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-2xl bg-slate-950/60 border border-white/10 text-xs text-slate-200 focus:outline-none focus:border-teal-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Institutional Email</label>
                <input
                  type="email"
                  required
                  placeholder="rachel.adams@student.edupulse.edu"
                  value={newStudent.email}
                  onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-2xl bg-slate-950/60 border border-white/10 text-xs text-slate-200 focus:outline-none focus:border-teal-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Department</label>
                  <select
                    value={newStudent.department}
                    onChange={(e) => setNewStudent({ ...newStudent, department: e.target.value })}
                    className="w-full px-3 py-2 rounded-2xl bg-slate-950/60 border border-white/10 text-xs text-slate-200 focus:outline-none focus:border-teal-400"
                  >
                    <option value="Computer Science">Computer Science</option>
                    <option value="Software Engineering">Software Engineering</option>
                    <option value="Mathematics & Data">Mathematics & Data</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Semester</label>
                  <select
                    value={newStudent.semester}
                    onChange={(e) => setNewStudent({ ...newStudent, semester: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-2xl bg-slate-950/60 border border-white/10 text-xs text-slate-200 focus:outline-none focus:border-teal-400"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                      <option key={sem} value={sem}>Semester {sem}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Contact Phone</label>
                <input
                  type="text"
                  placeholder="+1 (555) 000-0000"
                  value={newStudent.phone}
                  onChange={(e) => setNewStudent({ ...newStudent, phone: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-2xl bg-slate-950/60 border border-white/10 text-xs text-slate-200 focus:outline-none focus:border-teal-400"
                />
              </div>

              <div className="pt-3 border-t border-white/10 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowEnrollModal(false)}
                  className="px-4 py-2 rounded-2xl bg-white/10 hover:bg-white/15 text-slate-300 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-2xl bg-teal-400 hover:bg-teal-300 text-slate-950 text-xs font-bold cursor-pointer shadow-[0_0_15px_rgba(45,212,191,0.3)]"
                >
                  Confirm Enrollment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Course Modal */}
      {showCourseModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900/90 backdrop-blur-2xl border border-white/15 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-teal-400" />
                <span>Create Curriculum Course</span>
              </h2>
              <button onClick={() => setShowCourseModal(false)} className="text-slate-400 hover:text-white cursor-pointer">✕</button>
            </div>

            <form onSubmit={handleCourseSubmit} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Course Code</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. CS-405"
                    value={newCourse.code}
                    onChange={(e) => setNewCourse({ ...newCourse, code: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-2xl bg-slate-950/60 border border-white/10 text-xs text-slate-200 uppercase focus:outline-none focus:border-teal-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Credits</label>
                  <input
                    type="number"
                    min={1}
                    max={6}
                    value={newCourse.credits}
                    onChange={(e) => setNewCourse({ ...newCourse, credits: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 rounded-2xl bg-slate-950/60 border border-white/10 text-xs text-slate-200 focus:outline-none focus:border-teal-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Course Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Distributed Cloud Computing"
                  value={newCourse.title}
                  onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-2xl bg-slate-950/60 border border-white/10 text-xs text-slate-200 focus:outline-none focus:border-teal-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Department</label>
                  <select
                    value={newCourse.department}
                    onChange={(e) => setNewCourse({ ...newCourse, department: e.target.value })}
                    className="w-full px-3 py-2 rounded-2xl bg-slate-950/60 border border-white/10 text-xs text-slate-200 focus:outline-none focus:border-teal-400"
                  >
                    <option value="Computer Science">Computer Science</option>
                    <option value="Software Engineering">Software Engineering</option>
                    <option value="Mathematics & Data">Mathematics & Data</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Faculty Instructor</label>
                  <select
                    value={newCourse.teacherId}
                    onChange={(e) => setNewCourse({ ...newCourse, teacherId: e.target.value })}
                    className="w-full px-3 py-2 rounded-2xl bg-slate-950/60 border border-white/10 text-xs text-slate-200 focus:outline-none focus:border-teal-400"
                  >
                    {teachers.map(t => (
                      <option key={t.id} value={t.id}>{t.name} ({t.department})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Syllabus Overview</label>
                <textarea
                  rows={2}
                  placeholder="Summary of course modules, prerequisites, and learning objectives..."
                  value={newCourse.syllabus}
                  onChange={(e) => setNewCourse({ ...newCourse, syllabus: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-2xl bg-slate-950/60 border border-white/10 text-xs text-slate-200 focus:outline-none focus:border-teal-400"
                />
              </div>

              <div className="pt-3 border-t border-white/10 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCourseModal(false)}
                  className="px-4 py-2 rounded-2xl bg-white/10 hover:bg-white/15 text-slate-300 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-2xl bg-teal-400 hover:bg-teal-300 text-slate-950 text-xs font-bold cursor-pointer shadow-[0_0_15px_rgba(45,212,191,0.3)]"
                >
                  Create Course
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

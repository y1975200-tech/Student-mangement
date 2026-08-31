import React from 'react';
import { Student, Course, GradeRecord, AttendanceRecord } from '../types';
import { 
  GraduationCap, 
  Award, 
  Calendar, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  X, 
  Mail, 
  Phone, 
  BookOpen 
} from 'lucide-react';

interface StudentDetailModalProps {
  student: Student;
  courses: Course[];
  grades: GradeRecord[];
  attendance: AttendanceRecord[];
  onClose: () => void;
  onOpenAiDiagnostic: (studentId: string) => void;
}

export const StudentDetailModal: React.FC<StudentDetailModalProps> = ({
  student,
  courses,
  grades,
  attendance,
  onClose,
  onOpenAiDiagnostic
}) => {
  const studentCourses = courses.filter(c => student.enrolledCourseIds.includes(c.id));
  const studentGrades = grades.filter(g => g.studentId === student.studentId);
  const studentAttendance = attendance.filter(a => a.studentId === student.studentId);

  const isLowAttendance = student.attendanceRate < 75;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900/90 backdrop-blur-2xl border border-white/15 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 space-y-6">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-4">
            <img
              src={student.avatar}
              alt={student.name}
              className="h-14 w-14 rounded-2xl object-cover ring-2 ring-white/20 shadow-md"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs px-2.5 py-0.5 rounded-full font-bold bg-teal-500/15 text-teal-300 border border-teal-500/30">
                  {student.studentId}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-slate-300 font-semibold border border-white/10">
                  Semester {student.semester}
                </span>
              </div>
              <h2 className="text-xl font-bold text-white mt-1.5">{student.name}</h2>
              <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5">
                <span className="flex items-center gap-1"><Mail className="h-3 w-3" /> {student.email}</span>
                <span>•</span>
                <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> {student.phone || 'N/A'}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onOpenAiDiagnostic(student.studentId);
              }}
              className="px-3.5 py-2 rounded-2xl bg-teal-400 hover:bg-teal-300 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-[0_0_15px_rgba(45,212,191,0.3)] cursor-pointer"
            >
              <Sparkles className="h-4 w-4" />
              <span>Run AI Diagnostic</span>
            </button>
            <button onClick={onClose} className="p-2 text-slate-400 hover:text-white cursor-pointer">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Academic Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-white/[0.03] p-3.5 rounded-2xl border border-white/10 text-center backdrop-blur-md">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Cumulative GPA</span>
            <span className="text-2xl font-bold font-mono text-teal-300">{student.gpa.toFixed(2)}</span>
            <span className="text-[10px] text-slate-500 block">/ 4.0 Scale</span>
          </div>

          <div className={`p-3.5 rounded-2xl border text-center backdrop-blur-md ${
            isLowAttendance ? 'bg-rose-500/[0.08] border-rose-500/30' : 'bg-white/[0.03] border-white/10'
          }`}>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Attendance</span>
            <span className={`text-2xl font-bold font-mono ${isLowAttendance ? 'text-rose-400' : 'text-teal-300'}`}>
              {student.attendanceRate}%
            </span>
            <span className="text-[10px] text-slate-500 block">{isLowAttendance ? 'Debarment Risk' : 'Compliant'}</span>
          </div>

          <div className="bg-white/[0.03] p-3.5 rounded-2xl border border-white/10 text-center backdrop-blur-md">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Total Credits</span>
            <span className="text-2xl font-bold font-mono text-white">{student.totalCredits}</span>
            <span className="text-[10px] text-slate-500 block">Earned to Date</span>
          </div>

          <div className="bg-white/[0.03] p-3.5 rounded-2xl border border-white/10 text-center backdrop-blur-md">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Standing</span>
            <span className={`text-sm font-bold block mt-1.5 ${
              student.status === 'ON_PROBATION' ? 'text-rose-400' : 'text-teal-300'
            }`}>
              {student.status}
            </span>
          </div>
        </div>

        {/* Course Grades Record */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Award className="h-4 w-4 text-teal-400" />
            <span>Course Grade Records ({studentGrades.length})</span>
          </h3>

          <div className="bg-white/[0.02] rounded-2xl border border-white/10 overflow-hidden">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-white/[0.03] text-slate-400 border-b border-white/10">
                <tr>
                  <th className="py-2.5 px-3">Course</th>
                  <th className="py-2.5 px-3">Assignments</th>
                  <th className="py-2.5 px-3">Midterm</th>
                  <th className="py-2.5 px-3">Final Exam</th>
                  <th className="py-2.5 px-3">Total</th>
                  <th className="py-2.5 px-3">Grade</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-300">
                {studentGrades.map(g => (
                  <tr key={g.id} className="hover:bg-white/[0.02]">
                    <td className="py-2.5 px-3 font-sans font-bold text-white">{g.courseCode}</td>
                    <td className="py-2.5 px-3">{g.assignmentsScore}%</td>
                    <td className="py-2.5 px-3">{g.midtermScore}%</td>
                    <td className="py-2.5 px-3">{g.finalExamScore}%</td>
                    <td className="py-2.5 px-3 font-bold text-white">{g.totalScore}%</td>
                    <td className="py-2.5 px-3 font-bold text-teal-300">{g.letterGrade}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Attendance Session Logs */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Calendar className="h-4 w-4 text-teal-400" />
            <span>Classroom Check-in Logs ({studentAttendance.length})</span>
          </h3>

          <div className="max-h-48 overflow-y-auto space-y-2">
            {studentAttendance.map(att => (
              <div key={att.id} className="bg-white/[0.02] p-2.5 rounded-2xl border border-white/10 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-white font-mono">{att.courseCode}</span>
                  <span className="text-slate-400 ml-2">{att.sessionTopic}</span>
                  <span className="text-[10px] text-slate-500 block">{att.date}</span>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  att.status === 'PRESENT' ? 'bg-teal-500/15 text-teal-300 border border-teal-500/30' :
                  att.status === 'ABSENT' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                }`}>
                  {att.status}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { Student, Course, GradeRecord, Assignment, Submission, AttendanceRecord } from '../types';
import { 
  GraduationCap, 
  Award, 
  Calendar, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  FileText, 
  Sparkles, 
  Send, 
  Printer, 
  ExternalLink,
  BookOpen,
  ArrowUpRight
} from 'lucide-react';

interface StudentPortalProps {
  currentStudent: Student;
  courses: Course[];
  grades: GradeRecord[];
  assignments: Assignment[];
  submissions: Submission[];
  attendance: AttendanceRecord[];
  onSubmitAssignment: (asgId: string, text: string, url: string) => Promise<void>;
  onAskAiCoach: (question: string, courseCode?: string) => Promise<string>;
  onOpenAiDiagnostic: (studentId: string) => void;
}

export const StudentPortal: React.FC<StudentPortalProps> = ({
  currentStudent,
  courses,
  grades,
  assignments,
  submissions,
  attendance,
  onSubmitAssignment,
  onAskAiCoach,
  onOpenAiDiagnostic
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'assignments' | 'transcript' | 'coach'>('overview');

  // Assignment submission modal
  const [selectedAsgForSubmit, setSelectedAsgForSubmit] = useState<Assignment | null>(null);
  const [submissionText, setSubmissionText] = useState('');
  const [submissionUrl, setSubmissionUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // AI Chat Coach state
  const [coachMessages, setCoachMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string; time: string }>>([
    {
      sender: 'ai',
      text: `Hello ${currentStudent.name.split(' ')[0]}! I'm your AI Academic Study Coach. How can I assist you today with ${currentStudent.department} coursework, exam prep, or study planning?`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [coachInput, setCoachInput] = useState('');
  const [coachLoading, setCoachLoading] = useState(false);

  // My enrolled courses
  const myCourses = courses.filter(c => currentStudent.enrolledCourseIds.includes(c.id));
  const myGrades = grades.filter(g => g.studentId === currentStudent.studentId);
  const myAttendance = attendance.filter(a => a.studentId === currentStudent.studentId);
  const myAssignments = assignments.filter(a => myCourses.some(c => c.id === a.courseId || c.code === a.courseCode));

  const isLowAttendance = currentStudent.attendanceRate < 75;

  // Real-time countdown helper
  const getCountdownString = (dueDateStr: string) => {
    const diff = new Date(dueDateStr).getTime() - Date.now();
    if (diff <= 0) return 'Deadline Passed';
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const mins = Math.floor((diff / 1000 / 60) % 60);
    if (days > 0) return `${days}d ${hours}h left`;
    return `${hours}h ${mins}m left`;
  };

  const handleOpenSubmitModal = (asg: Assignment) => {
    setSelectedAsgForSubmit(asg);
    setSubmissionText('');
    setSubmissionUrl('');
    setSubmitSuccess(false);
  };

  const handleSubmitAssignmentForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAsgForSubmit) return;
    setIsSubmitting(true);
    await onSubmitAssignment(selectedAsgForSubmit.id, submissionText, submissionUrl);
    setIsSubmitting(false);
    setSubmitSuccess(true);
    setTimeout(() => {
      setSelectedAsgForSubmit(null);
      setSubmitSuccess(false);
    }, 1500);
  };

  const handleSendCoachMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!coachInput.trim() || coachLoading) return;

    const userMsg = coachInput;
    setCoachInput('');
    setCoachMessages(prev => [
      ...prev,
      { sender: 'user', text: userMsg, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
    ]);

    setCoachLoading(true);
    const aiReply = await onAskAiCoach(userMsg, myCourses[0]?.code);
    setCoachLoading(false);

    setCoachMessages(prev => [
      ...prev,
      { sender: 'ai', text: aiReply, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
    ]);
  };

  return (
    <div className="space-y-6">
      
      {/* Student Profile Hero Card */}
      <div className="bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        
        <div className="flex items-center gap-4">
          <img
            src={currentStudent.avatar}
            alt={currentStudent.name}
            className="h-16 w-16 rounded-2xl object-cover ring-2 ring-white/20 shadow-lg"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs px-2.5 py-0.5 rounded-full font-bold bg-teal-500/15 text-teal-300 border border-teal-500/30">
                {currentStudent.studentId}
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-white/10 text-slate-300 border border-white/10">
                Semester {currentStudent.semester}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight mt-1.5">{currentStudent.name}</h1>
            <p className="text-xs text-slate-400">
              Department of {currentStudent.department} • Enrolled {currentStudent.enrollmentDate}
            </p>
          </div>
        </div>

        {/* Quick Academic Snapshot Stats */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          
          <div className="flex-1 md:flex-initial bg-white/[0.03] px-4 py-3 rounded-2xl border border-white/10 text-center backdrop-blur-md">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Cumulative GPA</span>
            <span className={`text-2xl font-bold font-mono ${
              currentStudent.gpa >= 3.5 ? 'text-teal-300' : currentStudent.gpa >= 2.5 ? 'text-indigo-300' : 'text-rose-400'
            }`}>
              {currentStudent.gpa.toFixed(2)}
            </span>
            <span className="text-[10px] text-slate-500 block">/ 4.0 Scale</span>
          </div>

          <div className={`flex-1 md:flex-initial px-4 py-3 rounded-2xl border text-center backdrop-blur-md ${
            isLowAttendance ? 'bg-rose-500/[0.08] border-rose-500/30' : 'bg-white/[0.03] border-white/10'
          }`}>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Attendance</span>
            <span className={`text-2xl font-bold font-mono ${
              isLowAttendance ? 'text-rose-400' : currentStudent.attendanceRate >= 85 ? 'text-teal-300' : 'text-amber-300'
            }`}>
              {currentStudent.attendanceRate}%
            </span>
            <span className="text-[10px] text-slate-500 block">Policy: &gt;=75%</span>
          </div>

          <button
            onClick={() => onOpenAiDiagnostic(currentStudent.studentId)}
            className="px-3.5 py-3 rounded-2xl bg-teal-400 hover:bg-teal-300 text-slate-950 text-xs font-bold flex flex-col items-center justify-center gap-1 shadow-[0_0_15px_rgba(45,212,191,0.3)] transition-all cursor-pointer"
          >
            <Sparkles className="h-4 w-4" />
            <span>AI Risk Audit</span>
          </button>

        </div>

      </div>

      {/* Low Attendance Emergency Warning */}
      {isLowAttendance && (
        <div className="bg-rose-500/[0.08] backdrop-blur-xl border border-rose-500/30 p-5 rounded-3xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center shrink-0">
              <AlertTriangle className="h-5 w-5 text-rose-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-rose-200">
                Institutional Low Attendance Flag ({currentStudent.attendanceRate}% &lt; 75% Requirement)
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                You are currently below the required 75% classroom attendance threshold. Attend the next 4 consecutive lectures to return to safe standing and clear your examination debarment flag.
              </p>
            </div>
          </div>

          <button
            onClick={() => setActiveSubTab('coach')}
            className="px-4 py-2 rounded-2xl bg-rose-500 hover:bg-rose-400 text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shrink-0 shadow-md"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Get AI Recovery Plan</span>
          </button>
        </div>
      )}

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-2">
        <button
          onClick={() => setActiveSubTab('overview')}
          className={`px-4 py-2 rounded-2xl text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'overview' ? 'bg-white/15 text-teal-300 border border-white/15 shadow-sm backdrop-blur-md' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <BookOpen className="h-4 w-4 text-teal-400" />
          <span>My Enrolled Courses & Attendance</span>
        </button>

        <button
          onClick={() => setActiveSubTab('assignments')}
          className={`px-4 py-2 rounded-2xl text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'assignments' ? 'bg-white/15 text-teal-300 border border-white/15 shadow-sm backdrop-blur-md' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileText className="h-4 w-4 text-purple-400" />
          <span>Coursework & Deadlines ({myAssignments.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('transcript')}
          className={`px-4 py-2 rounded-2xl text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'transcript' ? 'bg-white/15 text-teal-300 border border-white/15 shadow-sm backdrop-blur-md' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Award className="h-4 w-4 text-indigo-400" />
          <span>Academic Transcript & Report Card</span>
        </button>

        <button
          onClick={() => setActiveSubTab('coach')}
          className={`px-4 py-2 rounded-2xl text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'coach' ? 'bg-white/15 text-teal-300 border border-white/15 shadow-sm backdrop-blur-md' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sparkles className="h-4 w-4 text-teal-300" />
          <span>AI Study Mentor</span>
        </button>
      </div>

      {/* SUB-TAB 1: OVERVIEW & ATTENDANCE */}
      {activeSubTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left 2 Cols: Enrolled Courses */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-teal-400" />
              <span>Current Semester Course Load ({myCourses.length} Courses • {myCourses.reduce((a,c) => a + c.credits, 0)} Credits)</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {myCourses.map(c => {
                const courseGrade = myGrades.find(g => g.courseId === c.id || g.courseCode === c.code);
                const courseAttLogs = myAttendance.filter(a => a.courseId === c.id || a.courseCode === c.code);
                const presentCount = courseAttLogs.filter(a => a.status === 'PRESENT' || a.status === 'EXCUSED').length;
                const courseAttRate = courseAttLogs.length > 0 ? Number(((presentCount / courseAttLogs.length) * 100).toFixed(0)) : 100;

                return (
                  <div key={c.id} className="bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-3xl p-5 shadow-xl space-y-3">
                    <div className="flex items-start justify-between">
                      <span className="px-2.5 py-0.5 rounded-xl text-xs font-mono font-bold bg-teal-500/10 text-teal-300 border border-teal-500/30">
                        {c.code}
                      </span>
                      <span className="text-xs font-semibold text-slate-400">{c.credits} Credits</span>
                    </div>

                    <h3 className="text-sm font-bold text-white">{c.title}</h3>
                    <p className="text-xs text-slate-400">Instructor: {c.teacherName}</p>

                    <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-slate-500 block">Course Grade:</span>
                        <span className="font-bold text-white font-mono">
                          {courseGrade ? `${courseGrade.letterGrade} (${courseGrade.totalScore}%)` : 'In Progress'}
                        </span>
                      </div>

                      <div className="text-right">
                        <span className="text-slate-500 block">Attendance:</span>
                        <span className={`font-bold font-mono ${courseAttRate < 75 ? 'text-rose-400' : 'text-teal-300'}`}>
                          {courseAttRate}%
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Col: Attendance Breakdown */}
          <div className="bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-3xl p-5 shadow-xl space-y-4">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Calendar className="h-4 w-4 text-teal-400" />
              <span>Recent Check-in Logs</span>
            </h2>

            <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
              {myAttendance.length === 0 ? (
                <p className="text-xs text-slate-500 italic">No attendance records logged yet.</p>
              ) : (
                myAttendance.map(att => (
                  <div key={att.id} className="bg-white/[0.02] p-3 rounded-2xl border border-white/10 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-white">{att.courseCode}</span>
                      <p className="text-[11px] text-slate-400 truncate max-w-[160px]">{att.sessionTopic}</p>
                      <span className="text-[10px] text-slate-500">{att.date}</span>
                    </div>

                    <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                      att.status === 'PRESENT'
                        ? 'bg-teal-500/15 text-teal-300 border border-teal-500/30'
                        : att.status === 'ABSENT'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}>
                      {att.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      )}

      {/* SUB-TAB 2: COURSEWORK & ASSIGNMENTS */}
      {activeSubTab === 'assignments' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {myAssignments.map(asg => {
            const mySub = submissions.find(s => s.assignmentId === asg.id && s.studentId === currentStudent.studentId);
            const countdown = getCountdownString(asg.dueDate);
            const isOverdue = countdown === 'Deadline Passed' && !mySub;

            return (
              <div key={asg.id} className="bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-3xl p-5 shadow-xl space-y-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between">
                    <span className="px-2 py-0.5 rounded-xl text-xs font-mono font-semibold bg-teal-500/10 text-teal-300 border border-teal-500/30">
                      {asg.courseCode}
                    </span>
                    <span className={`text-xs font-mono font-semibold px-2 py-0.5 rounded-full ${
                      mySub ? 'bg-teal-500/15 text-teal-300 border border-teal-500/30' : isOverdue ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}>
                      <Clock className="h-3 w-3 inline mr-1" />
                      {mySub ? 'Submitted' : countdown}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white mt-2">{asg.title}</h3>
                  <p className="text-xs text-slate-400 mt-1">{asg.description}</p>
                </div>

                <div className="space-y-3 pt-3 border-t border-white/10">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Due: {new Date(asg.dueDate).toLocaleDateString()}</span>
                    <span>Max Marks: {asg.totalMarks}</span>
                  </div>

                  {mySub ? (
                    <div className="bg-white/[0.02] p-3 rounded-2xl border border-white/10 space-y-1.5 text-xs">
                      <div className="flex items-center justify-between text-teal-300 font-semibold">
                        <span className="flex items-center gap-1">
                          <CheckCircle2 className="h-3.5 w-3.5 text-teal-400" /> Solution Submitted
                        </span>
                        {mySub.score !== undefined && (
                          <span className="font-bold text-white bg-teal-500/20 px-2 py-0.5 rounded-full border border-teal-500/30">
                            Score: {mySub.score} / {asg.totalMarks}
                          </span>
                        )}
                      </div>
                      {mySub.feedback && (
                        <p className="text-[11px] text-slate-300 italic">Professor Feedback: "{mySub.feedback}"</p>
                      )}
                    </div>
                  ) : (
                    <button
                      onClick={() => handleOpenSubmitModal(asg)}
                      className="w-full py-2.5 rounded-2xl bg-teal-400 hover:bg-teal-300 text-slate-950 text-xs font-bold transition-all shadow-[0_0_15px_rgba(45,212,191,0.3)] cursor-pointer"
                    >
                      Submit Solution
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* SUB-TAB 3: OFFICIAL TRANSCRIPT / REPORT CARD */}
      {activeSubTab === 'transcript' && (
        <div className="bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl max-w-4xl mx-auto space-y-6">
          
          {/* Institutional Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-6">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-2xl bg-teal-400/20 border border-teal-400/30 flex items-center justify-center shadow-lg">
                <GraduationCap className="h-7 w-7 text-teal-300" />
              </div>
              <div>
                <h1 className="text-xl font-black tracking-tight text-white uppercase">EduPulse Institute of Technology</h1>
                <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold">Office of Academic Records & Registrar</p>
              </div>
            </div>

            <button
              onClick={() => window.print()}
              className="px-3.5 py-2 rounded-2xl bg-white/10 hover:bg-white/15 text-slate-200 text-xs font-semibold flex items-center gap-1.5 border border-white/10 cursor-pointer backdrop-blur-md"
            >
              <Printer className="h-4 w-4" />
              <span>Print Official Transcript</span>
            </button>
          </div>

          {/* Student Transcript Details */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-white/[0.02] p-4 rounded-2xl border border-white/10 text-xs">
            <div>
              <span className="text-slate-500 uppercase tracking-wider font-semibold block">Student Name</span>
              <span className="font-bold text-white">{currentStudent.name}</span>
            </div>
            <div>
              <span className="text-slate-500 uppercase tracking-wider font-semibold block">Matriculation ID</span>
              <span className="font-mono font-bold text-teal-300">{currentStudent.studentId}</span>
            </div>
            <div>
              <span className="text-slate-500 uppercase tracking-wider font-semibold block">Department</span>
              <span className="font-semibold text-slate-300">{currentStudent.department}</span>
            </div>
            <div>
              <span className="text-slate-500 uppercase tracking-wider font-semibold block">Academic Standing</span>
              <span className="font-semibold text-teal-300">{currentStudent.status}</span>
            </div>
          </div>

          {/* Courses & Verified Grades Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-white/[0.02] text-slate-400 font-semibold border-b border-white/10">
                <tr>
                  <th className="py-3 px-3">Course Code</th>
                  <th className="py-3 px-3">Course Title</th>
                  <th className="py-3 px-3">Credits</th>
                  <th className="py-3 px-3">Assignments (30%)</th>
                  <th className="py-3 px-3">Midterm (30%)</th>
                  <th className="py-3 px-3">Final (40%)</th>
                  <th className="py-3 px-3">Total Score</th>
                  <th className="py-3 px-3">Letter Grade</th>
                  <th className="py-3 px-3 text-right">Grade Point</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-300 font-mono">
                {myGrades.map(g => (
                  <tr key={g.id} className="hover:bg-white/[0.03]">
                    <td className="py-3 px-3 font-bold text-white">{g.courseCode}</td>
                    <td className="py-3 px-3 font-sans font-medium text-slate-200">{g.courseTitle}</td>
                    <td className="py-3 px-3">{g.credits}</td>
                    <td className="py-3 px-3">{g.assignmentsScore}%</td>
                    <td className="py-3 px-3">{g.midtermScore}%</td>
                    <td className="py-3 px-3">{g.finalExamScore}%</td>
                    <td className="py-3 px-3 font-bold text-white">{g.totalScore}%</td>
                    <td className="py-3 px-3 font-bold text-teal-300">{g.letterGrade}</td>
                    <td className="py-3 px-3 text-right font-bold text-white">{g.gradePoint.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* GPA Summary Box */}
          <div className="bg-white/[0.03] p-4 rounded-2xl border border-white/10 flex items-center justify-between backdrop-blur-md">
            <div>
              <span className="text-xs text-slate-400 font-semibold block">Total Earned Credits: {currentStudent.totalCredits}</span>
              <span className="text-[11px] text-slate-500">Grading System: 4.00 Grade Point Scale</span>
            </div>
            <div className="text-right">
              <span className="text-xs text-teal-300 font-semibold uppercase tracking-wider block">Cumulative GPA</span>
              <span className="text-3xl font-black font-mono text-teal-300">{currentStudent.gpa.toFixed(2)}</span>
            </div>
          </div>

        </div>
      )}

      {/* SUB-TAB 4: AI STUDY MENTOR */}
      {activeSubTab === 'coach' && (
        <div className="bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl space-y-4 max-w-3xl mx-auto">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-2xl bg-teal-500/15 text-teal-300 border border-teal-500/30">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white">EduPulse AI Academic Study Coach</h2>
                <p className="text-xs text-slate-400">Powered by Gemini for personalized tutoring & study scheduling</p>
              </div>
            </div>
          </div>

          {/* Chat Messages Log */}
          <div className="space-y-3 min-h-[300px] max-h-[450px] overflow-y-auto p-3 bg-white/[0.02] rounded-2xl border border-white/10">
            {coachMessages.map((msg, idx) => (
              <div key={idx} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`max-w-lg p-3.5 rounded-2xl text-xs leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-teal-400 text-slate-950 font-medium rounded-br-none shadow-[0_0_12px_rgba(45,212,191,0.3)]'
                    : 'bg-white/[0.06] border border-white/10 text-slate-200 rounded-bl-none shadow-sm'
                }`}>
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                  <span className={`text-[10px] mt-1 block text-right ${msg.sender === 'user' ? 'text-slate-800' : 'opacity-60'}`}>{msg.time}</span>
                </div>
              </div>
            ))}

            {coachLoading && (
              <div className="flex items-center gap-2 text-xs text-teal-300 p-2">
                <Sparkles className="h-4 w-4 animate-spin text-teal-400" />
                <span>AI Coach is synthesizing study guidance...</span>
              </div>
            )}
          </div>

          {/* Chat Input */}
          <form onSubmit={handleSendCoachMessage} className="flex gap-2">
            <input
              type="text"
              placeholder="Ask about exam revision, study scheduling, algorithm proofs, or recovery tips..."
              value={coachInput}
              onChange={(e) => setCoachInput(e.target.value)}
              className="flex-1 bg-slate-950/60 border border-white/10 rounded-2xl px-4 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-teal-400"
            />
            <button
              type="submit"
              disabled={coachLoading || !coachInput.trim()}
              className="px-4 py-2.5 rounded-2xl bg-teal-400 hover:bg-teal-300 disabled:opacity-50 text-slate-950 text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-[0_0_15px_rgba(45,212,191,0.3)]"
            >
              <Send className="h-4 w-4" />
              <span>Send</span>
            </button>
          </form>
        </div>
      )}

      {/* Submit Assignment Modal */}
      {selectedAsgForSubmit && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900/90 backdrop-blur-2xl border border-white/15 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <span className="text-[11px] font-mono font-bold text-teal-300">{selectedAsgForSubmit.courseCode}</span>
                <h2 className="text-base font-bold text-white mt-0.5">{selectedAsgForSubmit.title}</h2>
              </div>
              <button onClick={() => setSelectedAsgForSubmit(null)} className="text-slate-400 hover:text-white cursor-pointer">✕</button>
            </div>

            {submitSuccess ? (
              <div className="p-6 text-center space-y-2">
                <CheckCircle2 className="h-10 w-10 text-teal-300 mx-auto" />
                <h3 className="text-base font-bold text-white">Solution Submitted!</h3>
                <p className="text-xs text-slate-400">Your instructor has received your submission.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmitAssignmentForm} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Repository / Deliverable URL</label>
                  <input
                    type="url"
                    required
                    placeholder="https://github.com/myrepo/assignment-submission"
                    value={submissionUrl}
                    onChange={(e) => setSubmissionUrl(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-2xl bg-slate-950/60 border border-white/10 text-xs text-slate-200 focus:outline-none focus:border-teal-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Executive Summary / Solution Notes</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Briefly describe your approach, algorithms implemented, and test results..."
                    value={submissionText}
                    onChange={(e) => setSubmissionText(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-2xl bg-slate-950/60 border border-white/10 text-xs text-slate-200 focus:outline-none focus:border-teal-400"
                  />
                </div>

                <div className="pt-3 border-t border-white/10 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedAsgForSubmit(null)}
                    className="px-4 py-2 rounded-2xl bg-white/10 hover:bg-white/15 text-slate-300 text-xs font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 rounded-2xl bg-teal-400 hover:bg-teal-300 disabled:opacity-50 text-slate-950 text-xs font-bold cursor-pointer shadow-[0_0_15px_rgba(45,212,191,0.3)]"
                  >
                    {isSubmitting ? 'Uploading...' : 'Confirm Submission'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

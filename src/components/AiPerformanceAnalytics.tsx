import React, { useState, useEffect } from 'react';
import { Student, AIStudentDiagnostic } from '../types';
import { 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  Clock, 
  UserCheck, 
  ShieldAlert, 
  Zap, 
  RefreshCw,
  Award,
  ArrowRight
} from 'lucide-react';

interface AiPerformanceAnalyticsProps {
  students: Student[];
  initialStudentId?: string;
}

export const AiPerformanceAnalytics: React.FC<AiPerformanceAnalyticsProps> = ({
  students,
  initialStudentId
}) => {
  const [selectedStudentId, setSelectedStudentId] = useState(initialStudentId || students[0]?.studentId || '');
  const [diagnostic, setDiagnostic] = useState<AIStudentDiagnostic | null>(null);
  const [loading, setLoading] = useState(false);
  const [sourceEngine, setSourceEngine] = useState<string>('');

  const currentStudent = students.find(s => s.studentId === selectedStudentId) || students[0];

  const fetchDiagnostic = async (studentId: string) => {
    setLoading(true);
    try {
      const res = await fetch('/api/ai/performance-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId })
      });
      const data = await res.json();
      if (data.diagnostic) {
        setDiagnostic(data.diagnostic);
        setSourceEngine(data.source || 'gemini-3.7-flash');
      }
    } catch (err) {
      console.error('Failed to load AI diagnostic:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedStudentId) {
      fetchDiagnostic(selectedStudentId);
    }
  }, [selectedStudentId]);

  return (
    <div className="space-y-6">
      
      {/* Top Banner & AI Engine Header */}
      <div className="bg-white/[0.04] backdrop-blur-xl border border-white/10 p-6 rounded-3xl shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-xl text-xs font-bold bg-teal-500/15 text-teal-300 border border-teal-500/30 flex items-center gap-1.5 shadow-sm">
              <Sparkles className="h-3.5 w-3.5 text-teal-400" />
              <span>Hackathon X-Factor Feature</span>
            </span>
            <span className="text-xs font-mono text-slate-300 bg-white/10 px-2.5 py-0.5 rounded-xl border border-white/10">
              Gemini AI
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-2">AI Performance Diagnostic & Early Warning Engine</h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Multimodal telemetry analysis synthesizes continuous attendance check-ins, weighted exam trends, and assignment timeliness into a predictive risk score and personalized 4-week recovery roadmap.
          </p>
        </div>

        {/* Student Selector Dropdown */}
        <div className="bg-white/[0.03] backdrop-blur-md p-3 rounded-2xl border border-white/10 flex items-center gap-3">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Inspect Student:</span>
          <select
            value={selectedStudentId}
            onChange={(e) => setSelectedStudentId(e.target.value)}
            className="bg-slate-950/70 border border-white/15 text-xs font-semibold text-teal-300 rounded-xl px-3 py-2 focus:outline-none focus:border-teal-400"
          >
            {students.map(s => (
              <option key={s.id} value={s.studentId}>
                {s.name} ({s.studentId}) - {s.riskLevel} Risk ({s.attendanceRate}%)
              </option>
            ))}
          </select>

          <button
            onClick={() => fetchDiagnostic(selectedStudentId)}
            disabled={loading}
            className="p-2 rounded-xl bg-teal-400 hover:bg-teal-300 text-slate-950 transition-all cursor-pointer shadow-[0_0_12px_rgba(45,212,191,0.3)] disabled:opacity-50"
            title="Re-run Diagnostic"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-3xl p-16 text-center space-y-3 shadow-2xl">
          <div className="h-12 w-12 rounded-2xl bg-teal-500/20 border border-teal-500/30 flex items-center justify-center mx-auto text-teal-300 shadow-lg">
            <Sparkles className="h-6 w-6 animate-spin" />
          </div>
          <h3 className="text-lg font-bold text-white">Synthesizing Multimodal Academic Telemetry...</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Gemini is analyzing attendance logs, exam variance curves, and coursework velocity for {currentStudent.name}.
          </p>
        </div>
      ) : diagnostic ? (
        <div className="space-y-6">
          
          {/* Executive Risk Score Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Col: Risk Score Gauge Card */}
            <div className={`p-6 rounded-3xl border backdrop-blur-xl shadow-2xl flex flex-col justify-between ${
              diagnostic.academicRiskScore >= 60
                ? 'bg-rose-500/[0.08] border-rose-500/30'
                : diagnostic.academicRiskScore >= 35
                  ? 'bg-amber-500/[0.08] border-amber-500/30'
                  : 'bg-teal-500/[0.08] border-teal-500/30'
            }`}>
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Academic Risk Index</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    diagnostic.riskCategory === 'High Risk'
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                      : diagnostic.riskCategory === 'Moderate Risk'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : 'bg-teal-500/20 text-teal-300 border border-teal-500/40'
                  }`}>
                    {diagnostic.riskCategory}
                  </span>
                </div>

                <div className="mt-4 flex items-baseline gap-3">
                  <span className="text-5xl font-black font-mono tracking-tight text-white">
                    {diagnostic.academicRiskScore}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">/ 100 Risk Score</span>
                </div>

                {/* Progress bar gauge */}
                <div className="mt-4 w-full bg-slate-950/60 h-3 rounded-full overflow-hidden border border-white/10">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ${
                      diagnostic.academicRiskScore >= 60 ? 'bg-rose-500' : diagnostic.academicRiskScore >= 35 ? 'bg-amber-500' : 'bg-teal-400'
                    }`}
                    style={{ width: `${diagnostic.academicRiskScore}%` }}
                  />
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-white/10 text-xs text-slate-400">
                <span className="font-semibold text-slate-300 block">Diagnostic Verdict:</span>
                <p className="mt-1 leading-relaxed">{diagnostic.executiveSummary}</p>
              </div>
            </div>

            {/* Middle Col: Attendance & Debarment Risk */}
            <div className="bg-white/[0.04] backdrop-blur-xl border border-white/10 p-6 rounded-3xl shadow-2xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Attendance Telemetry</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    diagnostic.attendanceDiagnosis.overallPercentage < 75
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                      : 'bg-teal-500/20 text-teal-300 border border-teal-500/40'
                  }`}>
                    {diagnostic.attendanceDiagnosis.status}
                  </span>
                </div>

                <div className="mt-3 flex items-baseline gap-2">
                  <span className={`text-4xl font-bold font-mono ${
                    diagnostic.attendanceDiagnosis.overallPercentage < 75 ? 'text-rose-400' : 'text-teal-300'
                  }`}>
                    {diagnostic.attendanceDiagnosis.overallPercentage}%
                  </span>
                  <span className="text-xs text-slate-400">Semester Check-ins</span>
                </div>

                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  {diagnostic.attendanceDiagnosis.analysis}
                </p>
              </div>

              {diagnostic.attendanceDiagnosis.criticalCourses.length > 0 && (
                <div className="mt-4 p-3 bg-rose-500/[0.08] rounded-2xl border border-rose-500/30">
                  <span className="text-[11px] font-bold text-rose-300 block">Flagged Debarment Courses:</span>
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {diagnostic.attendanceDiagnosis.criticalCourses.map((c, i) => (
                      <span key={i} className="px-2 py-0.5 bg-rose-500/20 text-rose-200 text-xs font-mono font-bold rounded-lg border border-rose-500/30">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Col: Grade Trajectory */}
            <div className="bg-white/[0.04] backdrop-blur-xl border border-white/10 p-6 rounded-3xl shadow-2xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Academic Trajectory</span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                    {diagnostic.gradeTrajectory.trend}
                  </span>
                </div>

                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-4xl font-bold font-mono text-white">
                    {diagnostic.gradeTrajectory.estimatedGPA.toFixed(2)}
                  </span>
                  <span className="text-xs text-slate-400">Cumulative GPA</span>
                </div>

                <div className="mt-3 space-y-2 text-xs">
                  <div>
                    <span className="text-slate-500 font-semibold block">Strongest Competencies:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {diagnostic.gradeTrajectory.strongestSubjects.map((s, i) => (
                        <span key={i} className="px-2 py-0.5 bg-teal-500/10 text-teal-300 rounded-lg font-semibold text-[11px] border border-teal-500/20">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-slate-500 font-semibold block">Vulnerability Areas:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {diagnostic.gradeTrajectory.weakestSubjects.map((w, i) => (
                        <span key={i} className="px-2 py-0.5 bg-rose-500/10 text-rose-300 rounded-lg font-semibold text-[11px] border border-rose-500/20">
                          {w}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <span className="text-[10px] text-slate-500 mt-2 block">Engine: {sourceEngine}</span>
            </div>

          </div>

          {/* Key Risk Factors & Actionable Interventions Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Left: Identified Vulnerability Factors */}
            <div className="bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl space-y-4">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-400" />
                <span>Identified Risk Telemetry Points</span>
              </h2>

              <div className="space-y-2.5">
                {diagnostic.keyRiskFactors.map((factor, idx) => (
                  <div key={idx} className="bg-white/[0.02] p-3.5 rounded-2xl border border-white/10 flex items-start gap-3">
                    <span className="h-5 w-5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 border border-amber-500/30">
                      {idx + 1}
                    </span>
                    <p className="text-xs text-slate-300 leading-relaxed">{factor}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Recommended Institutional Interventions */}
            <div className="bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl space-y-4">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Zap className="h-4 w-4 text-teal-400" />
                <span>Prioritized Remediation Directives</span>
              </h2>

              <div className="space-y-3">
                {diagnostic.recommendedInterventions.map((inv, idx) => (
                  <div key={idx} className="bg-white/[0.02] p-4 rounded-2xl border border-white/10 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        inv.priority === 'URGENT'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                          : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                      }`}>
                        {inv.priority} PRIORITY
                      </span>
                      <span className="text-[11px] font-semibold text-slate-400">Target: {inv.targetDate}</span>
                    </div>

                    <p className="text-xs font-bold text-white">{inv.action}</p>
                    
                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                      <span>Lead Action Party:</span>
                      <span className="font-semibold text-teal-300">{inv.responsibleParty}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* 4-Week Structured Study & Recovery Roadmap */}
          <div className="bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-white flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-teal-400" />
                  <span>Personalized 4-Week Growth & Recovery Roadmap</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  AI-synthesized weekly focus milestones designed to reverse attendance deficits and reinforce high-credit exams.
                </p>
              </div>
              <span className="text-xs font-bold font-mono px-3 py-1 rounded-xl bg-teal-500/10 text-teal-300 border border-teal-500/30">
                Action Plan Active
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {diagnostic.personalizedStudyPlan.map((step) => (
                <div key={step.week} className="bg-white/[0.02] p-4 rounded-2xl border border-white/10 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30">
                        Week {step.week}
                      </span>
                    </div>
                    <h3 className="text-xs font-bold text-white mt-2 leading-snug">{step.focus}</h3>

                    <ul className="mt-3 space-y-1.5">
                      {step.actionItems.map((item, i) => (
                        <li key={i} className="text-[11px] text-slate-400 flex items-start gap-1.5">
                          <CheckCircle2 className="h-3 w-3 text-teal-400 shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-2 border-t border-white/10 text-[10px] text-slate-500 flex items-center justify-between">
                    <span>Milestone {step.week}/4</span>
                    <ArrowRight className="h-3 w-3 text-teal-400" />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      ) : null}

    </div>
  );
};

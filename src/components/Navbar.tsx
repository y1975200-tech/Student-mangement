import React from 'react';
import { User, UserRole } from '../types';
import { ShieldCheck, UserCheck, BookOpen, Sparkles, Code2, Calendar } from 'lucide-react';

interface NavbarProps {
  currentUser: User;
  onSwitchRole: (role: UserRole) => void;
  activeTab: string;
  onSelectTab: (tab: string) => void;
  lowAttendanceCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  onSwitchRole,
  activeTab,
  onSelectTab,
  lowAttendanceCount
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/[0.03] backdrop-blur-xl border-b border-white/10 text-slate-100 shadow-[0_4px_30px_rgba(0,0,0,0.2)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo & Title */}
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => onSelectTab('dashboard')}>
            <div className="w-9 h-9 bg-teal-400 rounded-xl flex items-center justify-center font-bold text-slate-950 shadow-[0_0_15px_rgba(45,212,191,0.4)] ring-1 ring-white/30 transition-transform group-hover:scale-105">
              E
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight text-white">
                  EduPulse<span className="text-teal-400">.</span>
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-teal-500/10 text-teal-300 border border-teal-500/30">
                  Campus Core
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">Administration & AI Telemetry</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1.5">
            <button
              onClick={() => onSelectTab('dashboard')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'bg-white/15 text-teal-300 border border-white/15 shadow-sm backdrop-blur-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              {currentUser.role === 'ADMIN' && 'Operations'}
              {currentUser.role === 'TEACHER' && 'Faculty Hub'}
              {currentUser.role === 'STUDENT' && 'Student Portal'}
            </button>

            <button
              onClick={() => onSelectTab('analytics')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'analytics'
                  ? 'bg-teal-500/20 text-teal-200 border border-teal-500/40 shadow-[0_0_15px_rgba(45,212,191,0.2)] backdrop-blur-md'
                  : 'text-slate-400 hover:text-teal-300 hover:bg-white/5'
              }`}
            >
              <Sparkles className="h-3.5 w-3.5 text-teal-400" />
              <span>AI Performance</span>
              {lowAttendanceCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  {lowAttendanceCount}
                </span>
              )}
            </button>

            <button
              onClick={() => onSelectTab('timetable')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'timetable'
                  ? 'bg-white/15 text-teal-300 border border-white/15 shadow-sm backdrop-blur-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <Calendar className="h-3.5 w-3.5 text-slate-400" />
              <span>Schedule</span>
            </button>

            <button
              onClick={() => onSelectTab('guide')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'guide'
                  ? 'bg-white/15 text-teal-300 border border-white/15 shadow-sm backdrop-blur-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <Code2 className="h-3.5 w-3.5 text-teal-400" />
              <span>Architecture Hub</span>
            </button>
          </nav>

          {/* Right Section: Persona / Role Switcher */}
          <div className="flex items-center gap-3">
            
            {/* Quick RBAC Switcher */}
            <div className="bg-white/5 backdrop-blur-xl p-1 rounded-2xl border border-white/10 flex items-center gap-1">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-2 hidden sm:inline">
                Role:
              </span>
              <button
                onClick={() => onSwitchRole('ADMIN')}
                className={`px-2.5 py-1 rounded-xl text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer ${
                  currentUser.role === 'ADMIN'
                    ? 'bg-teal-500 text-slate-950 font-bold shadow-[0_0_12px_rgba(45,212,191,0.35)]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
                title="Switch to Admin Persona"
              >
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>Admin</span>
              </button>
              <button
                onClick={() => onSwitchRole('TEACHER')}
                className={`px-2.5 py-1 rounded-xl text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer ${
                  currentUser.role === 'TEACHER'
                    ? 'bg-teal-500 text-slate-950 font-bold shadow-[0_0_12px_rgba(45,212,191,0.35)]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
                title="Switch to Teacher Persona"
              >
                <UserCheck className="h-3.5 w-3.5" />
                <span>Faculty</span>
              </button>
              <button
                onClick={() => onSwitchRole('STUDENT')}
                className={`px-2.5 py-1 rounded-xl text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer ${
                  currentUser.role === 'STUDENT'
                    ? 'bg-teal-500 text-slate-950 font-bold shadow-[0_0_12px_rgba(45,212,191,0.35)]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
                title="Switch to Student Persona"
              >
                <BookOpen className="h-3.5 w-3.5" />
                <span>Student</span>
              </button>
            </div>

            {/* Profile Avatar & Badge */}
            <div className="flex items-center gap-2.5 pl-2 border-l border-white/10">
              <img
                src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                alt={currentUser.name}
                className="h-8 w-8 rounded-xl ring-1 ring-white/20 object-cover"
              />
              <div className="hidden lg:block text-left">
                <p className="text-xs font-semibold text-slate-200 leading-tight">{currentUser.name}</p>
                <span className="text-[10px] text-teal-400 uppercase tracking-wider font-mono font-semibold">{currentUser.role}</span>
              </div>
            </div>

          </div>

        </div>
      </div>
    </header>
  );
};

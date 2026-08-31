import React, { useState } from 'react';
import { 
  ERD_ENTITIES, 
  REST_API_SPECS, 
  HACKATHON_ROADMAP, 
  STARTER_CODE_MONGOOSE,
  STARTER_CODE_SQL,
  STARTER_CODE_JWT_ROUTER
} from '../data/hackathonGuideData';
import { 
  Terminal, 
  Database, 
  Layers, 
  CheckSquare, 
  Copy, 
  Check, 
  Code2, 
  Network,
  Cpu
} from 'lucide-react';

export const HackathonGuideHub: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'architecture' | 'api' | 'roadmap' | 'starterCode'>('architecture');
  const [selectedSnippetKey, setSelectedSnippetKey] = useState<'mongoose' | 'postgres' | 'express'>('mongoose');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Interactive roadmap state
  const [checkedTasks, setCheckedTasks] = useState<{ [key: string]: boolean }>({
    'p0-0': true,
    'p0-1': true,
    'p0-2': true,
    'p0-3': true,
    'p1-0': true,
    'p1-1': true,
    'p1-2': true,
    'p1-3': true,
    'p2-0': true,
    'p2-1': true,
    'p2-2': true,
    'p2-3': true,
    'p3-0': true,
    'p3-1': true,
    'p3-2': true,
    'p3-3': true
  });

  const toggleTask = (taskId: string) => {
    setCheckedTasks(prev => ({
      ...prev,
      [taskId]: !prev[taskId]
    }));
  };

  const handleCopyCode = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const snippets = {
    mongoose: {
      title: 'MongoDB Mongoose Schema Definition',
      language: 'JavaScript / Node.js',
      code: STARTER_CODE_MONGOOSE
    },
    postgres: {
      title: 'PostgreSQL Relational SQL DDL Definition',
      language: 'SQL (PostgreSQL 14+)',
      code: STARTER_CODE_SQL
    },
    express: {
      title: 'Express JWT & RBAC Middleware Router',
      language: 'JavaScript / Express',
      code: STARTER_CODE_JWT_ROUTER
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white/[0.04] backdrop-blur-xl p-6 rounded-3xl border border-white/10 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-xl text-xs font-bold bg-teal-500/15 text-teal-300 border border-teal-500/30 flex items-center gap-1.5 shadow-sm">
              <Cpu className="h-3.5 w-3.5 text-teal-400" />
              <span>Tech Lead Architecture Hub</span>
            </span>
            <span className="text-xs font-mono text-slate-300 bg-white/10 px-2.5 py-0.5 rounded-xl border border-white/10">
              Stack: Node.js / Express • React • Gemini AI
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-2">System Architecture & Production Starter Kit</h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Complete technical blueprint containing entity relationships, REST API route contracts, sprint roadmap, and drop-in backend starter templates.
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-white/[0.03] backdrop-blur-md p-1.5 rounded-2xl border border-white/10 overflow-x-auto">
          <button
            onClick={() => setActiveSection('architecture')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
              activeSection === 'architecture' ? 'bg-white/20 text-teal-300 border border-white/15 shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            ERD Diagram
          </button>
          <button
            onClick={() => setActiveSection('api')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
              activeSection === 'api' ? 'bg-white/20 text-teal-300 border border-white/15 shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            API Endpoints
          </button>
          <button
            onClick={() => setActiveSection('roadmap')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
              activeSection === 'roadmap' ? 'bg-white/20 text-teal-300 border border-white/15 shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Sprint Roadmap
          </button>
          <button
            onClick={() => setActiveSection('starterCode')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
              activeSection === 'starterCode' ? 'bg-white/20 text-teal-300 border border-white/15 shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Starter Code
          </button>
        </div>
      </div>

      {/* SECTION 1: INTERACTIVE ERD DIAGRAM */}
      {activeSection === 'architecture' && (
        <div className="space-y-6">
          <div className="bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-white flex items-center gap-2">
                  <Database className="h-4 w-4 text-teal-400" />
                  <span>Domain Entity Relationship Model (ERD)</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Normalized schema relations covering Students, Faculty, Courses, Attendance logs, Weighted Grades, and Submissions.
                </p>
              </div>
              <span className="text-xs font-mono px-2.5 py-1 rounded-xl bg-white/10 text-slate-300 border border-white/10">
                {ERD_ENTITIES.length} Domain Entities
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
              {ERD_ENTITIES.map(entity => (
                <div key={entity.name} className="bg-white/[0.02] border border-white/10 rounded-2xl overflow-hidden shadow-lg flex flex-col justify-between">
                  <div className="bg-white/[0.03] px-4 py-2.5 border-b border-white/10 flex items-center justify-between">
                    <span className="font-bold text-xs text-teal-300 font-mono flex items-center gap-1.5">
                      <Layers className="h-3.5 w-3.5 text-teal-400" />
                      {entity.name}
                    </span>
                    <span className="text-[10px] text-slate-500 font-semibold">{entity.fields.length} attributes</span>
                  </div>

                  <div className="p-3 space-y-1.5 text-xs font-mono">
                    {entity.fields.map((f: any, i: number) => (
                      <div key={i} className="flex items-center justify-between text-slate-300 py-0.5 hover:bg-white/[0.02] px-1 rounded-lg">
                        <span className="font-semibold text-slate-200">
                          {f.name}
                          {f.isPrimary && <span className="text-amber-400 text-[10px] ml-1 font-bold">[PK]</span>}
                          {f.isUnique && <span className="text-indigo-400 text-[10px] ml-1 font-bold">[UNIQUE]</span>}
                        </span>
                        <span className="text-[11px] text-slate-500">{f.type}</span>
                      </div>
                    ))}
                  </div>

                  <div className="px-3 py-2 bg-white/[0.01] border-t border-white/10 text-[10px] text-slate-400">
                    <span className="font-semibold text-slate-300">Relations: </span>
                    {entity.relations.join(', ')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: REST API ENDPOINTS SPECIFICATION */}
      {activeSection === 'api' && (
        <div className="space-y-6">
          {REST_API_SPECS.map((cat, cIdx) => (
            <div key={cIdx} className="bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl space-y-4">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Network className="h-4 w-4 text-teal-400" />
                <span>{cat.category}</span>
              </h2>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-white/[0.03] text-slate-400 font-semibold border-b border-white/10 uppercase tracking-wider">
                    <tr>
                      <th className="py-2.5 px-3">Method</th>
                      <th className="py-2.5 px-3">Endpoint Route</th>
                      <th className="py-2.5 px-3">RBAC Access</th>
                      <th className="py-2.5 px-3">Purpose</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-slate-300 font-mono">
                    {cat.endpoints.map((api, idx) => (
                      <tr key={idx} className="hover:bg-white/[0.02]">
                        <td className="py-2.5 px-3">
                          <span className={`px-2 py-0.5 rounded-md text-[11px] font-bold ${
                            api.method === 'GET' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                            api.method === 'POST' ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30' :
                            api.method === 'PUT' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          }`}>
                            {api.method}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 font-bold text-white">{api.route}</td>
                        <td className="py-2.5 px-3">
                          <span className="px-2 py-0.5 rounded-full bg-white/10 text-teal-300 text-[10px] font-bold border border-white/10">
                            {api.role}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 font-sans text-xs text-slate-300">{api.purpose}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* SECTION 3: HACKATHON IMPLEMENTATION ROADMAP */}
      {activeSection === 'roadmap' && (
        <div className="bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <CheckSquare className="h-4 w-4 text-teal-400" />
                <span>4-Phase Hackathon Execution Roadmap</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Structured sprint milestones designed to take your prototype from zero to winning demo in 24-48 hours.
              </p>
            </div>
            <span className="text-xs font-semibold text-teal-300 bg-teal-500/10 px-3 py-1 rounded-xl border border-teal-500/30">
              {Object.values(checkedTasks).filter(Boolean).length} / 16 Tasks Completed
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {HACKATHON_ROADMAP.map((phase, pIdx) => (
              <div key={phase.phase} className="bg-white/[0.02] p-5 rounded-2xl border border-white/10 space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                  <div>
                    <span className="text-[10px] font-bold font-mono text-teal-300 uppercase tracking-wider">
                      {phase.badge} • {phase.duration}
                    </span>
                    <h3 className="text-sm font-bold text-white mt-0.5">{phase.phase}</h3>
                  </div>
                </div>

                <div className="space-y-2.5">
                  {phase.tasks.map((task, tIdx) => {
                    const taskId = `p${pIdx}-${tIdx}`;
                    const isChecked = !!checkedTasks[taskId];

                    return (
                      <div
                        key={taskId}
                        onClick={() => toggleTask(taskId)}
                        className={`p-3 rounded-xl border text-xs cursor-pointer transition-all flex items-start gap-2.5 ${
                          isChecked
                            ? 'bg-white/[0.04] border-teal-500/40 text-slate-200'
                            : 'bg-white/[0.01] border-white/10 text-slate-400 hover:border-white/20'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}}
                          className="mt-0.5 rounded text-teal-400 focus:ring-teal-400"
                        />
                        <div>
                          <span className={`font-bold block ${isChecked ? 'line-through text-slate-400' : 'text-white'}`}>
                            {task.title}
                          </span>
                          <span className={`text-[11px] leading-snug mt-0.5 block ${isChecked ? 'line-through text-slate-500' : 'text-slate-400'}`}>
                            {task.desc}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 4: PRODUCTION STARTER CODE SNIPPETS */}
      {activeSection === 'starterCode' && (
        <div className="bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Code2 className="h-4 w-4 text-teal-400" />
                <span>Production Starter Templates (Copy-Ready)</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Drop these battle-tested schema and middleware definitions directly into your backend repository.
              </p>
            </div>

            {/* Snippet selector tabs */}
            <div className="flex items-center gap-2 bg-white/[0.03] backdrop-blur-md p-1.5 rounded-2xl border border-white/10">
              <button
                onClick={() => setSelectedSnippetKey('mongoose')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  selectedSnippetKey === 'mongoose' ? 'bg-white/20 text-teal-300 border border-white/15' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                MongoDB Mongoose
              </button>
              <button
                onClick={() => setSelectedSnippetKey('postgres')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  selectedSnippetKey === 'postgres' ? 'bg-white/20 text-teal-300 border border-white/15' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                PostgreSQL SQL DDL
              </button>
              <button
                onClick={() => setSelectedSnippetKey('express')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  selectedSnippetKey === 'express' ? 'bg-white/20 text-teal-300 border border-white/15' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Express JWT & RBAC
              </button>
            </div>
          </div>

          {/* Active Code Block */}
          {(() => {
            const snippet = snippets[selectedSnippetKey];
            return (
              <div className="bg-slate-950/80 rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
                <div className="bg-white/[0.03] px-4 py-2.5 border-b border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Terminal className="h-4 w-4 text-teal-400" />
                    <span className="font-bold text-xs text-slate-200">{snippet.title}</span>
                    <span className="text-[10px] text-slate-500 font-mono">({snippet.language})</span>
                  </div>

                  <button
                    onClick={() => handleCopyCode(snippet.code, selectedSnippetKey)}
                    className="px-3 py-1 rounded-xl bg-white/10 hover:bg-white/15 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer border border-white/10"
                  >
                    {copiedKey === selectedSnippetKey ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-teal-300" />
                        <span className="text-teal-300">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        <span>Copy Code</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="p-4 overflow-x-auto max-h-[500px]">
                  <pre className="text-xs font-mono text-slate-300 leading-relaxed">
                    <code>{snippet.code}</code>
                  </pre>
                </div>
              </div>
            );
          })()}
        </div>
      )}

    </div>
  );
};

import React, { useState } from 'react';
import { Course } from '../types';
import { Calendar, Clock, MapPin, User, BookOpen } from 'lucide-react';

interface TimetableGridProps {
  courses: Course[];
}

export const TimetableGrid: React.FC<TimetableGridProps> = ({ courses }) => {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const [selectedDay, setSelectedDay] = useState('Monday');

  // Flatten schedule items
  const scheduleSlots = courses.flatMap(c => 
    c.schedule.map(s => ({
      ...s,
      courseCode: c.code,
      courseTitle: c.title,
      department: c.department,
      teacher: c.teacherName,
      credits: c.credits
    }))
  );

  const daySlots = scheduleSlots.filter(s => s.day === selectedDay);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white/[0.04] backdrop-blur-xl p-6 rounded-3xl border border-white/10 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-xl text-xs font-semibold bg-teal-500/15 text-teal-300 border border-teal-500/30">
              Campus Academic Schedule
            </span>
            <span className="text-xs text-slate-400">Spring Semester 2026</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-2">Smart Lecture Timetable & Room Mapping</h1>
          <p className="text-xs text-slate-400 mt-1">
            Synchronized timetable with clash-detection and lecture hall assignments across departments.
          </p>
        </div>

        {/* Day Selector Tabs */}
        <div className="flex items-center gap-1.5 bg-white/[0.03] backdrop-blur-md p-1.5 rounded-2xl border border-white/10 overflow-x-auto">
          {days.map(day => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                selectedDay === day ? 'bg-white/20 text-teal-300 border border-white/15 shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {day}
            </button>
          ))}
        </div>
      </div>

      {/* Slots for Selected Day */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold text-white flex items-center gap-2">
          <Calendar className="h-4 w-4 text-teal-400" />
          <span>Scheduled Lectures for {selectedDay} ({daySlots.length} Classes)</span>
        </h2>

        {daySlots.length === 0 ? (
          <div className="bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-3xl p-12 text-center text-slate-500 text-xs shadow-xl">
            No lectures scheduled for {selectedDay}.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {daySlots.map((slot, idx) => (
              <div key={idx} className="bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-3xl p-5 shadow-xl space-y-4 hover:border-white/20 transition-all">
                <div className="flex items-start justify-between">
                  <span className="px-2.5 py-0.5 rounded-xl text-xs font-mono font-bold bg-teal-500/15 text-teal-300 border border-teal-500/30">
                    {slot.courseCode}
                  </span>
                  <span className="text-xs font-semibold text-slate-400">{slot.credits} Credits</span>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-white leading-snug">{slot.courseTitle}</h3>
                  <p className="text-xs text-slate-400 mt-1">{slot.department}</p>
                </div>

                <div className="pt-3 border-t border-white/10 space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-teal-300 font-mono font-semibold">
                    <Clock className="h-4 w-4 text-teal-400" />
                    <span>{slot.time}</span>
                  </div>

                  <div className="flex items-center gap-2 text-slate-300">
                    <MapPin className="h-4 w-4 text-slate-500" />
                    <span>Lecture Hall: {slot.room}</span>
                  </div>

                  <div className="flex items-center gap-2 text-slate-300">
                    <User className="h-4 w-4 text-slate-500" />
                    <span>Faculty: {slot.teacher}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

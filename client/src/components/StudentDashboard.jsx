import React from 'react';
import { Loader2, Users, UserCheck, BookOpen, Calendar, Book } from 'lucide-react';

export default function StudentDashboard({
  students,
  getAttendanceSummary,
  getAverageGrade
}) {
  if (students.length === 0) {
    return (
      <div className="glass-card rounded-2xl p-16 text-center text-slate-500">
        <Loader2 className="animate-spin text-indigo-500 mx-auto mb-4" size={36} />
        <p>Retrieving your student credentials...</p>
      </div>
    );
  }

  return students.map((student) => {
    const attSummary = getAttendanceSummary(student.attendance);
    const avgGpa = getAverageGrade(student.grades);
    return (
      <div key={student._id} className="space-y-8 animate-in fade-in duration-300">
        
        {/* Stats Header */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card rounded-2xl p-6 relative overflow-hidden group shadow-sm">
            <p className="text-xs font-semibold text-indigo-600 tracking-wider uppercase">Profile Name</p>
            <h3 className="text-2xl font-bold mt-2 text-slate-900">{student.firstName} {student.lastName}</h3>
            <p className="text-xs text-slate-500 mt-1">{student.email}</p>
          </div>

          <div className="glass-card rounded-2xl p-6 relative overflow-hidden group shadow-sm">
            <p className="text-xs font-semibold text-purple-600 tracking-wider uppercase">Attendance</p>
            <h3 className="text-3xl font-bold mt-2 text-slate-900">{attSummary.percent}%</h3>
            <p className="text-xs text-slate-500 mt-1">{attSummary.total} Total classes marked</p>
          </div>

          <div className="glass-card rounded-2xl p-6 relative overflow-hidden group shadow-sm">
            <p className="text-xs font-semibold text-emerald-600 tracking-wider uppercase">Average Mark</p>
            <h3 className="text-3xl font-bold mt-2 text-slate-900">{avgGpa}</h3>
            <p className="text-xs text-slate-500 mt-1">{student.grades?.length || 0} Graded subjects</p>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Attendance log */}
          <div className="glass-card rounded-2xl p-6 shadow-sm">
            <h4 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Calendar className="text-indigo-500" size={20} />
              <span>Attendance History</span>
            </h4>
            <div className="overflow-y-auto max-h-96 pr-2">
              {student.attendance && student.attendance.length > 0 ? (
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-100 text-left text-xs text-slate-400 font-semibold uppercase">
                      <th className="pb-3">Date</th>
                      <th className="pb-3 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {student.attendance.map(att => (
                      <tr key={att._id} className="text-sm">
                        <td className="py-2.5 text-slate-700 font-medium">
                          {new Date(att.date).toLocaleDateString()}
                        </td>
                        <td className="py-2.5 text-right font-semibold">
                          <span className={`px-2 py-0.5 rounded-full text-xs ${
                            att.status === 'Present' ? 'bg-emerald-100 text-emerald-700' :
                            att.status === 'Absent' ? 'bg-rose-100 text-rose-700' :
                            'bg-amber-100 text-amber-700'
                          }`}>
                            {att.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-sm text-slate-500 text-center py-10">No attendance reports recorded yet.</p>
              )}
            </div>
          </div>

          {/* Grades log */}
          <div className="glass-card rounded-2xl p-6 shadow-sm">
            <h4 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Book className="text-purple-500" size={20} />
              <span>Academic Records</span>
            </h4>
            <div className="overflow-y-auto max-h-96 pr-2">
              {student.grades && student.grades.length > 0 ? (
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-100 text-left text-xs text-slate-400 font-semibold uppercase">
                      <th className="pb-3">Subject</th>
                      <th className="pb-3 text-center">Score</th>
                      <th className="pb-3 text-right">Grade</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {student.grades.map(g => (
                      <tr key={g._id} className="text-sm">
                        <td className="py-2.5 text-slate-700 font-semibold">{g.subject}</td>
                        <td className="py-2.5 text-center text-slate-600 font-medium">{g.score} / {g.maxScore}</td>
                        <td className="py-2.5 text-right font-bold text-indigo-600">{g.grade}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-sm text-slate-500 text-center py-10">No academic grades released yet.</p>
              )}
            </div>
          </div>
        </div>

      </div>
    );
  });
}

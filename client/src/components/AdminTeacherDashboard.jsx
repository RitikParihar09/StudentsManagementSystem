import React from 'react';
import { 
  Users, 
  Search, 
  Edit3, 
  Trash2, 
  Loader2, 
  X, 
  PlusCircle, 
  Shield, 
  Calendar, 
  Book, 
  UserCheck 
} from 'lucide-react';

export default function AdminTeacherDashboard({
  loading,
  searchQuery,
  setSearchQuery,
  selectedStudent,
  setSelectedStudent,
  openEditStudentModal,
  handleDeleteStudent,
  openAddAttendanceModal,
  openAddGradeModal,
  getAttendanceSummary,
  getAverageGrade,
  userRole,
  totalStudents,
  uniqueDomains,
  filteredStudents
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-200">
      
      {/* Left columns: List & search */}
      <div className="lg:col-span-2 space-y-6">
        
        {/* Analytics Header */}
        <section className="grid grid-cols-2 gap-4">
          <div className="glass-card rounded-2xl p-5 shadow-sm">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Registers</p>
            <h3 className="text-2xl font-bold mt-1 text-slate-800">{totalStudents}</h3>
          </div>
          <div className="glass-card rounded-2xl p-5 shadow-sm">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Unique Domains</p>
            <h3 className="text-2xl font-bold mt-1 text-slate-800">{uniqueDomains}</h3>
          </div>
        </section>

        {/* Filter */}
        <div className="relative w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Filter student profiles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors shadow-sm"
          />
        </div>

        {/* List */}
        <div className="glass-card rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/75">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan="2" className="py-12 text-center text-slate-400">
                      <Loader2 className="animate-spin text-indigo-500 mx-auto mb-2" size={28} />
                      <span>Fetching data...</span>
                    </td>
                  </tr>
                ) : filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan="2" className="py-12 text-center text-slate-500">
                      <span>No students enrolled match the criteria.</span>
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map(student => (
                    <tr 
                      key={student._id}
                      onClick={() => setSelectedStudent(student)}
                      className={`cursor-pointer transition-colors ${
                        selectedStudent?._id === student._id ? 'bg-indigo-500/5 hover:bg-indigo-500/10' : 'hover:bg-slate-50/80'
                      }`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-lg bg-indigo-500/10 text-indigo-600 flex items-center justify-center font-bold text-sm">
                            {student.firstName[0]}{student.lastName[0]}
                          </div>
                          <div>
                            <div className="font-semibold text-slate-800">{student.firstName} {student.lastName}</div>
                            <div className="text-xs text-slate-400">{student.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-center gap-2">
                          {userRole === 'admin' && (
                            <>
                              <button
                                onClick={(e) => openEditStudentModal(student, e)}
                                className="p-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 rounded-lg border border-amber-500/10 transition-colors"
                                title="Edit details"
                              >
                                <Edit3 size={14} />
                              </button>
                              <button
                                onClick={() => handleDeleteStudent(student._id)}
                                className="p-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 rounded-lg border border-rose-500/10 transition-colors"
                                title="Delete student"
                              >
                                <Trash2 size={14} />
                              </button>
                            </>
                          )}
                          <span className="text-xs text-slate-400 px-2 py-1 rounded bg-slate-100 font-medium">Click card to view details</span>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Right column: Selected student detail, attendance, grades */}
      <div className="lg:col-span-1">
        {selectedStudent ? (
          <div className="glass-card rounded-2xl p-6 space-y-6 shadow-sm animate-in slide-in-from-right-5 duration-300">
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <h4 className="text-xl font-bold text-slate-900">{selectedStudent.firstName} {selectedStudent.lastName}</h4>
                <p className="text-xs text-slate-400 mt-0.5">{selectedStudent.email}</p>
              </div>
              <button 
                onClick={() => setSelectedStudent(null)}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                <p className="text-xs text-slate-500 font-semibold uppercase">Attendance</p>
                <h5 className="text-lg font-bold text-slate-800 mt-1">
                  {getAttendanceSummary(selectedStudent.attendance).percent}%
                </h5>
              </div>
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                <p className="text-xs text-slate-500 font-semibold uppercase">GPA Average</p>
                <h5 className="text-lg font-bold text-slate-800 mt-1">
                  {getAverageGrade(selectedStudent.grades)}
                </h5>
              </div>
            </div>

            {/* Actions to record */}
            <div className="flex gap-2">
              <button
                onClick={openAddAttendanceModal}
                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-indigo-550 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 font-semibold rounded-xl text-xs transition-colors border border-indigo-100"
              >
                <PlusCircle size={14} />
                <span>Mark Attendance</span>
              </button>
              <button
                onClick={openAddGradeModal}
                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-purple-50 hover:bg-purple-100 text-purple-600 font-semibold rounded-xl text-xs transition-colors border border-purple-100"
              >
                <PlusCircle size={14} />
                <span>Post Grade</span>
              </button>
            </div>

            {/* Attendance Log */}
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-1">
                <h5 className="text-xs font-bold text-slate-600 uppercase tracking-wider">Attendance Log</h5>
                <span className="text-[10px] text-slate-400">{selectedStudent.attendance?.length || 0} classes</span>
              </div>
              <div className="max-h-40 overflow-y-auto space-y-1.5 pr-1 text-sm">
                {selectedStudent.attendance && selectedStudent.attendance.length > 0 ? (
                  selectedStudent.attendance.map(att => (
                    <div key={att._id} className="flex justify-between items-center py-1">
                      <span className="text-slate-600">{new Date(att.date).toLocaleDateString()}</span>
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        att.status === 'Present' ? 'bg-emerald-100 text-emerald-700' :
                        att.status === 'Absent' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                      }`}>{att.status}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 text-center py-4">No attendance history.</p>
                )}
              </div>
            </div>

            {/* Grades log */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between border-b border-slate-100 pb-1">
                <h5 className="text-xs font-bold text-slate-600 uppercase tracking-wider">Academic Grades</h5>
                <span className="text-[10px] text-slate-400">{selectedStudent.grades?.length || 0} exams</span>
              </div>
              <div className="max-h-40 overflow-y-auto space-y-1.5 pr-1 text-sm">
                {selectedStudent.grades && selectedStudent.grades.length > 0 ? (
                  selectedStudent.grades.map(g => (
                    <div key={g._id} className="flex justify-between items-center py-1">
                      <span className="font-semibold text-slate-700">{g.subject}</span>
                      <span className="text-slate-600">{g.score}/{g.maxScore} ({g.grade})</span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 text-center py-4">No grades recorded.</p>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="glass-card rounded-2xl p-10 text-center text-slate-400 border-dashed border-2 border-slate-200">
            <Shield size={32} className="mx-auto mb-2 text-slate-300" />
            <h4 className="font-bold text-slate-700 text-sm">Registry Detail Panel</h4>
            <p className="text-xs text-slate-500 mt-1">Select a student row from the registry table to view and modify their academic scores and attendance status.</p>
          </div>
        )}
      </div>

    </div>
  );
}

import React from 'react';
import { X } from 'lucide-react';

export function StudentModal({
  isOpen,
  onClose,
  editingStudent,
  firstName,
  setFirstName,
  lastName,
  setLastName,
  email,
  setEmail,
  onSubmit
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 overflow-y-auto">
      <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative glass rounded-2xl w-full max-w-md p-6 shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200">
        <button onClick={onClose} className="absolute right-4 top-4 text-slate-400 hover:text-slate-600">
          <X size={18} />
        </button>
        <h2 className="text-xl font-bold text-slate-900 mb-1">{editingStudent ? 'Edit Profile' : 'Enroll Student'}</h2>
        <p className="text-xs text-slate-500 mb-6">Provide database registration details below</p>
        
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase">First Name</label>
            <input
              type="text" required placeholder="e.g. John" value={firstName} onChange={e => setFirstName(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase">Last Name</label>
            <input
              type="text" required placeholder="e.g. Doe" value={lastName} onChange={e => setLastName(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase">Email Address</label>
            <input
              type="email" required placeholder="e.g. john.doe@university.edu" value={email} onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 mt-6">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-sm font-semibold">Cancel</button>
            <button type="submit" className="px-5 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl text-sm font-semibold shadow">Confirm</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function AttendanceModal({
  isOpen,
  onClose,
  selectedStudent,
  attDate,
  setAttDate,
  attStatus,
  setAttStatus,
  onSubmit
}) {
  if (!isOpen || !selectedStudent) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 overflow-y-auto">
      <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative glass rounded-2xl w-full max-w-md p-6 shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200">
        <button onClick={onClose} className="absolute right-4 top-4 text-slate-400 hover:text-slate-600">
          <X size={18} />
        </button>
        <h2 className="text-xl font-bold text-slate-900 mb-1">Add Attendance Record</h2>
        <p className="text-xs text-slate-500 mb-6">Logging attendance status for {selectedStudent.firstName}</p>
        
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase">Date</label>
            <input
              type="date" required value={attDate} onChange={e => setAttDate(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase">Status</label>
            <select
              value={attStatus} onChange={e => setAttStatus(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-indigo-500"
            >
              <option value="Present">Present</option>
              <option value="Absent">Absent</option>
              <option value="Late">Late</option>
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 mt-6">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-sm font-semibold">Cancel</button>
            <button type="submit" className="px-5 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl text-sm font-semibold shadow">Save Record</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function GradeModal({
  isOpen,
  onClose,
  selectedStudent,
  gradeSubject,
  setGradeSubject,
  gradeScore,
  setGradeScore,
  gradeMaxScore,
  setGradeMaxScore,
  gradeLetter,
  setGradeLetter,
  onSubmit
}) {
  if (!isOpen || !selectedStudent) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 overflow-y-auto">
      <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative glass rounded-2xl w-full max-w-md p-6 shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200">
        <button onClick={onClose} className="absolute right-4 top-4 text-slate-400 hover:text-slate-600">
          <X size={18} />
        </button>
        <h2 className="text-xl font-bold text-slate-900 mb-1">Post Subject Grade</h2>
        <p className="text-xs text-slate-500 mb-6">Logging score values for {selectedStudent.firstName}</p>
        
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase">Subject Name</label>
            <input
              type="text" required placeholder="e.g. Mathematics" value={gradeSubject} onChange={e => setGradeSubject(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase">Score Obtained</label>
                  <input
                    type="number" required min="0" placeholder="90" value={gradeScore} onChange={e => setGradeScore(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-indigo-500"
                  />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase">Max Score</label>
                  <input
                    type="number" required min="1" placeholder="100" value={gradeMaxScore} onChange={e => setGradeMaxScore(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-indigo-500"
                  />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase">Grade Letter</label>
            <select
              value={gradeLetter} onChange={e => setGradeLetter(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-indigo-500"
            >
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
              <option value="D">D</option>
              <option value="F">F</option>
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 mt-6">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-sm font-semibold">Cancel</button>
            <button type="submit" className="px-5 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl text-sm font-semibold shadow">Confirm Grade</button>
          </div>
        </form>
      </div>
    </div>
  );
}

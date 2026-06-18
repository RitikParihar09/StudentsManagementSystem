import React, { useState, useEffect } from 'react';
import { 
  LogOut,
  UserPlus
} from 'lucide-react';

// Subcomponents imports
import Toast from './components/Toast';
import Auth from './components/Auth';
import StudentDashboard from './components/StudentDashboard';
import AdminTeacherDashboard from './components/AdminTeacherDashboard';
import { StudentModal, AttendanceModal, GradeModal } from './components/Modals';

function App() {
  // Auth state
  const [user, setUser] = useState(null);
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register'
  const [authName, setAuthName] = useState('');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authRole, setAuthRole] = useState('student');

  // App core state
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals state
  const [studentModalOpen, setStudentModalOpen] = useState(false);
  const [attendanceModalOpen, setAttendanceModalOpen] = useState(false);
  const [gradeModalOpen, setGradeModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [editingStudent, setEditingStudent] = useState(null);

  // Student Form fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');

  // Attendance Form fields
  const [attDate, setAttDate] = useState(new Date().toISOString().split('T')[0]);
  const [attStatus, setAttStatus] = useState('Present');

  // Grade Form fields
  const [gradeSubject, setGradeSubject] = useState('');
  const [gradeScore, setGradeScore] = useState('');
  const [gradeMaxScore, setGradeMaxScore] = useState(100);
  const [gradeLetter, setGradeLetter] = useState('A');

  // Notifications
  const [toast, setToast] = useState(null);
  const [authLoading, setAuthLoading] = useState(false);

  const triggerToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Restore auth session from local storage on load
  // Validate the token looks like a real JWT (3 dot-separated base64 parts)
  const isValidJwt = (token) => {
    if (!token || typeof token !== 'string') return false;
    const parts = token.split('.');
    return parts.length === 3;
  };

  useEffect(() => {
    const savedUser = localStorage.getItem('sms_auth_user');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        if (parsed && isValidJwt(parsed.token)) {
          setUser(parsed);
        } else {
          // Clear stale/mock session data
          localStorage.removeItem('sms_auth_user');
          localStorage.removeItem('local_students');
          localStorage.removeItem('local_users');
        }
      } catch {
        localStorage.removeItem('sms_auth_user');
      }
    }
  }, []);

  // Fetch student records
  const fetchStudents = async (currentUser = user) => {
    if (!currentUser) return;
    setLoading(true);
    try {
      const response = await fetch('/api/students', {
        headers: {
          'Authorization': `Bearer ${currentUser.token}`
        }
      });
      
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || 'Failed to retrieve students from server');
      }
      
      const data = await response.json();
      setStudents(data);
    } catch (error) {
      console.error('API Error fetching students:', error);
      triggerToast(error.message || 'Failed to load students. Is the server running?', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchStudents(user);
    }
  }, [user]);

  // Auth Handler
  const handleAuth = async (e) => {
    e.preventDefault();
    if (!authEmail.trim() || !authPassword.trim()) {
      triggerToast('Please fill in all auth details', 'error');
      return;
    }

    if (authMode === 'register' && !authName.trim()) {
      triggerToast('Name is required for registration', 'error');
      return;
    }

    const payload = {
      name: authName,
      email: authEmail,
      password: authPassword,
      role: authRole
    };

    setAuthLoading(true);
    try {
      const url = authMode === 'login' ? '/api/auth/login' : '/api/auth/register';
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await response.json();

      if (!response.ok) {
        // Surface real server errors (wrong password, user exists, etc.)
        triggerToast(data.message || 'Authentication failed', 'error');
        return;
      }

      setUser(data);
      localStorage.setItem('sms_auth_user', JSON.stringify(data));
      triggerToast(authMode === 'login' ? `Welcome back, ${data.name}!` : `Account created! Welcome, ${data.name}!`);
    } catch (error) {
      // Only reach here on network errors (server down/unreachable)
      console.error('Network error during auth:', error);
      triggerToast('Cannot connect to server. Please make sure the backend is running on port 5099.', 'error');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setStudents([]);
    localStorage.removeItem('sms_auth_user');
    triggerToast('Logged out successfully');
  };


  // Enroll or Update Student
  const handleStudentSubmit = async (e) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim() || !email.trim()) {
      triggerToast('All fields are required', 'error');
      return;
    }

    const payload = { firstName, lastName, email };

    try {
      const url = editingStudent ? `/api/students/${editingStudent._id}` : '/api/students';
      const method = editingStudent ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify(payload)
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Operation failed');
      }

      triggerToast(editingStudent ? 'Profile updated successfully!' : 'Student enrolled successfully!');
      closeStudentModal();
      fetchStudents();
    } catch (error) {
      console.error('Student submit error:', error);
      triggerToast(error.message || 'Operation failed. Is the server running?', 'error');
    }
  };

  // Add Attendance
  const handleAttendanceSubmit = async (e) => {
    e.preventDefault();
    if (!selectedStudent) return;

    const payload = { date: attDate, status: attStatus };

    try {
      const response = await fetch(`/api/students/${selectedStudent._id}/attendance`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify(payload)
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to record attendance');
      }

      triggerToast('Attendance marked successfully!');
      setAttendanceModalOpen(false);
      fetchStudents();
      setSelectedStudent(data);
    } catch (error) {
      console.error('Attendance submit error:', error);
      triggerToast(error.message || 'Failed to record attendance. Is the server running?', 'error');
    }
  };

  // Add Grade
  const handleGradeSubmit = async (e) => {
    e.preventDefault();
    if (!selectedStudent || !gradeSubject.trim() || !gradeScore) return;

    const payload = { 
      subject: gradeSubject, 
      score: Number(gradeScore), 
      maxScore: Number(gradeMaxScore), 
      grade: gradeLetter 
    };

    try {
      const response = await fetch(`/api/students/${selectedStudent._id}/grades`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify(payload)
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to record grade');
      }

      triggerToast('Grade recorded successfully!');
      setGradeModalOpen(false);
      fetchStudents();
      setSelectedStudent(data);
    } catch (error) {
      console.error('Grade submit error:', error);
      triggerToast(error.message || 'Failed to record grade. Is the server running?', 'error');
    }
  };

  // Delete Student
  const handleDeleteStudent = async (id) => {
    if (!window.confirm('Are you sure you want to delete this student record?')) return;

    try {
      const response = await fetch(`/api/students/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Delete operation failed');
      }

      triggerToast('Record deleted successfully');
      if (selectedStudent?._id === id) setSelectedStudent(null);
      fetchStudents();
    } catch (error) {
      console.error('Delete error:', error);
      triggerToast(error.message || 'Failed to delete. Is the server running?', 'error');
    }
  };

  // Modal helpers
  const openAddStudentModal = () => {
    setEditingStudent(null);
    setFirstName('');
    setLastName('');
    setEmail('');
    setStudentModalOpen(true);
  };

  const openEditStudentModal = (student, e) => {
    e.stopPropagation();
    setEditingStudent(student);
    setFirstName(student.firstName);
    setLastName(student.lastName);
    setEmail(student.email);
    setStudentModalOpen(true);
  };

  const closeStudentModal = () => {
    setStudentModalOpen(false);
    setEditingStudent(null);
  };

  const openAddAttendanceModal = () => {
    setAttDate(new Date().toISOString().split('T')[0]);
    setAttStatus('Present');
    setAttendanceModalOpen(true);
  };

  const openAddGradeModal = () => {
    setGradeSubject('');
    setGradeScore('');
    setGradeMaxScore(100);
    setGradeLetter('A');
    setGradeModalOpen(true);
  };

  // Calculations
  const filteredStudents = students.filter(s => {
    const term = searchQuery.toLowerCase();
    return (
      s.firstName.toLowerCase().includes(term) ||
      s.lastName.toLowerCase().includes(term) ||
      s.email.toLowerCase().includes(term)
    );
  });

  const getAttendanceSummary = (attendanceList = []) => {
    if (!attendanceList || attendanceList.length === 0) return { total: 0, percent: 100 };
    const presentCount = attendanceList.filter(a => a.status === 'Present' || a.status === 'Late').length;
    return {
      total: attendanceList.length,
      percent: Math.round((presentCount / attendanceList.length) * 100)
    };
  };

  const getAverageGrade = (gradesList = []) => {
    if (!gradesList || gradesList.length === 0) return 'N/A';
    const sum = gradesList.reduce((acc, curr) => acc + (curr.score / curr.maxScore), 0);
    const avgPercent = Math.round((sum / gradesList.length) * 100);
    return `${avgPercent}%`;
  };

  const totalStudents = students.length;
  const uniqueDomains = new Set(students.map(s => s.email.split('@')[1])).size || 0;

  // Auth Screen Render
  if (!user) {
    return (
      <>
        <Toast toast={toast} />
        <Auth
          authMode={authMode}
          setAuthMode={setAuthMode}
          authName={authName}
          setAuthName={setAuthName}
          authEmail={authEmail}
          setAuthEmail={setAuthEmail}
          authPassword={authPassword}
          setAuthPassword={setAuthPassword}
          authRole={authRole}
          setAuthRole={setAuthRole}
          handleAuth={handleAuth}
          authLoading={authLoading}
        />
      </>
    );
  }

  // Loaded Dashboard Render
  return (
    <div className="min-h-screen pb-16 px-4 sm:px-6 lg:px-8">
      {/* Toast Alert */}
      <Toast toast={toast} />

      {/* Header Panel */}
      <header className="max-w-6xl mx-auto pt-10 pb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200 pb-6">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-indigo-950 to-indigo-900 font-sans tracking-tight">
                Academix
              </h1>
              <p className="text-xs text-slate-500 font-medium tracking-widest uppercase mt-0.5">
                Student Management System
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            
            {user.role === 'admin' && (
              <button
                onClick={openAddStudentModal}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-xl font-semibold transition-all shadow-sm transform hover:-translate-y-0.5"
              >
                <UserPlus size={18} />
                <span>Enroll Student</span>
              </button>
            )}

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold rounded-xl text-sm transition-colors border border-slate-200/50"
            >
              <LogOut size={16} />
              <span>Log out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto mt-6">
        {/* Welcome Section */}
        <div className="mb-6 bg-slate-100/60 border border-slate-200/50 rounded-2xl px-6 py-3.5 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-700">Logged in as: <span className="font-bold text-indigo-600">{user.name}</span></p>
            <p className="text-xs text-slate-500">Role: {user.role.toUpperCase()}</p>
          </div>
        </div>

        {user.role === 'student' ? (
          <StudentDashboard
            students={students}
            getAttendanceSummary={getAttendanceSummary}
            getAverageGrade={getAverageGrade}
          />
        ) : (
          <AdminTeacherDashboard
            loading={loading}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedStudent={selectedStudent}
            setSelectedStudent={setSelectedStudent}
            openEditStudentModal={openEditStudentModal}
            handleDeleteStudent={handleDeleteStudent}
            openAddAttendanceModal={openAddAttendanceModal}
            openAddGradeModal={openAddGradeModal}
            getAttendanceSummary={getAttendanceSummary}
            getAverageGrade={getAverageGrade}
            userRole={user.role}
            totalStudents={totalStudents}
            uniqueDomains={uniqueDomains}
            filteredStudents={filteredStudents}
          />
        )}
      </main>

      {/* MODAL Overlay Containers */}
      <StudentModal
        isOpen={studentModalOpen}
        onClose={closeStudentModal}
        editingStudent={editingStudent}
        firstName={firstName}
        setFirstName={setFirstName}
        lastName={lastName}
        setLastName={setLastName}
        email={email}
        setEmail={setEmail}
        onSubmit={handleStudentSubmit}
      />

      <AttendanceModal
        isOpen={attendanceModalOpen}
        onClose={() => setAttendanceModalOpen(false)}
        selectedStudent={selectedStudent}
        attDate={attDate}
        setAttDate={setAttDate}
        attStatus={attStatus}
        setAttStatus={setAttStatus}
        onSubmit={handleAttendanceSubmit}
      />

      <GradeModal
        isOpen={gradeModalOpen}
        onClose={() => setGradeModalOpen(false)}
        selectedStudent={selectedStudent}
        gradeSubject={gradeSubject}
        setGradeSubject={setGradeSubject}
        gradeScore={gradeScore}
        setGradeScore={setGradeScore}
        gradeMaxScore={gradeMaxScore}
        setGradeMaxScore={setGradeMaxScore}
        gradeLetter={gradeLetter}
        setGradeLetter={setGradeLetter}
        onSubmit={handleGradeSubmit}
      />
    </div>
  );
}

export default App;

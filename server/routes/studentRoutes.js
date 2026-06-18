import express from 'express';
import Student from '../models/Student.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Helper to determine if student is accessing their own profile
const isSelfOrAuthorized = (req, studentUserId) => {
  if (req.user.role === 'admin' || req.user.role === 'teacher') return true;
  return req.user._id.toString() === studentUserId?.toString();
};

// GET students list (All for Admin/Teacher, or just self for student)
router.get('/', protect, async (req, res) => {
  try {
    if (req.user.role === 'student') {
      const student = await Student.findOne({ userId: req.user._id });
      if (!student) {
        // Fallback search by email
        const fallback = await Student.findOne({ email: req.user.email });
        return res.json(fallback ? [fallback] : []);
      }
      return res.json([student]);
    }

    // Admin or Teacher can see all
    const students = await Student.find().sort({ createdAt: -1 });
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET specific student
router.get('/:id', protect, async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    if (!isSelfOrAuthorized(req, student.userId)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(student);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST enroll new student
router.post('/', protect, authorize('admin', 'teacher'), async (req, res) => {
  const { firstName, lastName, email } = req.body;
  
  try {
    const existingStudent = await Student.findOne({ email });
    if (existingStudent) {
      return res.status(400).json({ message: 'A student with this email already exists' });
    }

    const student = new Student({
      firstName,
      lastName,
      email,
      attendance: [],
      grades: []
    });

    const newStudent = await student.save();
    res.status(201).json(newStudent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT update student details
router.put('/:id', protect, authorize('admin', 'teacher'), async (req, res) => {
  const { firstName, lastName, email } = req.body;

  try {
    if (email) {
      const existingStudent = await Student.findOne({ email, _id: { $ne: req.params.id } });
      if (existingStudent) {
        return res.status(400).json({ message: 'A student with this email already exists' });
      }
    }

    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    if (firstName) student.firstName = firstName;
    if (lastName) student.lastName = lastName;
    if (email) student.email = email;

    const updatedStudent = await student.save();
    res.json(updatedStudent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE student
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    await Student.deleteOne({ _id: req.params.id });
    res.json({ message: 'Student deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ================= ATTENDANCE SUB-RESOURCES =================

// @desc    Add attendance record to a student
// @route   POST /api/students/:id/attendance
// @access  Private (Admin, Teacher)
router.post('/:id/attendance', protect, authorize('admin', 'teacher'), async (req, res) => {
  const { date, status } = req.body;

  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    student.attendance.push({ date: date || new Date(), status });
    await student.save();

    res.status(201).json(student);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ================= ACADEMIC GRADES SUB-RESOURCES =================

// @desc    Add grade record to a student
// @route   POST /api/students/:id/grades
// @access  Private (Admin, Teacher)
router.post('/:id/grades', protect, authorize('admin', 'teacher'), async (req, res) => {
  const { subject, score, maxScore, grade } = req.body;

  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    student.grades.push({ subject, score, maxScore: maxScore || 100, grade });
    await student.save();

    res.status(201).json(student);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;

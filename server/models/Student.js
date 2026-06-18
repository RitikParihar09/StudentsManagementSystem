import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['Present', 'Absent', 'Late'],
    required: true
  }
});

const gradeSchema = new mongoose.Schema({
  subject: {
    type: String,
    required: [true, 'Subject is required'],
    trim: true
  },
  score: {
    type: Number,
    required: [true, 'Score is required'],
    min: 0
  },
  maxScore: {
    type: Number,
    required: [true, 'Maximum score is required'],
    default: 100
  },
  grade: {
    type: String,
    required: [true, 'Grade letter is required'],
    trim: true
  }
});

const studentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please fill a valid email address'
    ]
  },
  attendance: [attendanceSchema],
  grades: [gradeSchema]
}, {
  timestamps: true
});

const Student = mongoose.model('Student', studentSchema);

export default Student;

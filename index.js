const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Student = require('./models/Student');
const Doctor = require('./models/Doctor');

dotenv.config();

const app = express();
const port = 3000;

app.use(express.json());

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('✅ Connected to MongoDB Atlas'))
  .catch(err => console.error('❌ Connection error:', err));


// 1. Add a New Student (Hardcoded)
app.post('/students/hardcoded', async (req, res) => {
  const newStudent = new Student({
    name: 'Ali',
    age: 20,
    level: 'Level 2',
    address: 'Cairo'
  });
  await newStudent.save();
  res.send('Hardcoded student added to MongoDB');
});

// 2. Add a New Student (From Request Body)
app.post('/students', async (req, res) => {
  const { name, age, level, address } = req.body;
  const student = new Student({ name, age, level, address });
  await student.save();
  res.send('Student added from body');
});

// 3. Add a New Doctor (From Query Parameters)
app.post('/doctors', async (req, res) => {
  const { name, age, phone } = req.query;
  const doctor = new Doctor({ name, age, phone });
  await doctor.save();
  res.send('Doctor added via query params');
});

// 4. Fetch All Students
app.get('/students', async (req, res) => {
  const students = await Student.find();
  res.json(students);
});

// 5. Delete a Student by Name
app.delete('/students/:name', async (req, res) => {
  const result = await Student.deleteOne({ name: req.params.name });
  res.send(result.deletedCount ? `Deleted student ${req.params.name}` : 'Student not found');
});

// 6. Update a Doctor’s Name
app.put('/doctors/update-name', async (req, res) => {
  const { oldName, newName } = req.query;
  const doctor = await Doctor.findOne({ name: oldName });

  if (doctor) {
    doctor.name = newName;
    await doctor.save();
    res.send(`Doctor name updated from ${oldName} to ${newName}`);
  } else {
    res.status(404).send('Doctor not found');
  }
});

// 7. Fetch Both Lists
app.get('/all', async (req, res) => {
  const students = await Student.find();
  const doctors = await Doctor.find();
  res.json({ students, doctors });
});

// check if the backend is running
app.get('/', (req, res) => {
    res.send('Backend is running!');
  });
  

app.listen(port, () => {
  console.log(`🚀 Server is running at http://localhost:${port}`);
});

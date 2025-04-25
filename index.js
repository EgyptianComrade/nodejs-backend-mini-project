const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Student = require('./models/Student');
const Doctor = require('./models/Doctor');

dotenv.config();

const app = express();
const port = 3000;

app.use(express.json());


mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('✅ Connected to MongoDB Atlas'))
  .catch(err => console.error('❌ Connection error:', err));



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


app.post('/students', async (req, res) => {
  const { name, age, level, address } = req.body;
  const student = new Student({ name, age, level, address });
  await student.save();
  res.send('Student added from body');
});


app.post('/doctors', async (req, res) => {
  const { name, age, phone } = req.query;
  const doctor = new Doctor({ name, age, phone });
  await doctor.save();
  res.send('Doctor added via query params');
});


app.get('/students', async (req, res) => {
  const students = await Student.find();
  res.json(students);
});


app.get('/doctors', async (req, res) => {
  const doctors = await Doctor.find();
  res.json(doctors);
});


app.delete('/students/:name', async (req, res) => {
  const result = await Student.deleteOne({ name: req.params.name });
  res.send(result.deletedCount ? `Deleted student ${req.params.name}` : 'Student not found');
});


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


app.get('/all', async (req, res) => {
  const students = await Student.find();
  const doctors = await Doctor.find();
  res.json({ students, doctors });
});

app.listen(port, () => {
  console.log(`🚀 Server is running at http://localhost:${port}`);
});

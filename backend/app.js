const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const faceRecognition = require('./faceRecognition');

const app = express();

// Setup database connection
mongoose.connect('mongodb://localhost/photo-gallery', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});
const upload = multer({ storage: storage });

// Routes
app.post('/upload', upload.single('photo'), async (req, res) => {
  const photo = new Photo({
    path: req.file.path,
    // Call face recognition function to identify faces and assign groups
    faces: await faceRecognition(req.file.path),
  });
  await photo.save();
  res.send('Photo uploaded and processed.');
});

app.delete('/delete/:id', async (req, res) => {
  await Photo.findByIdAndDelete(req.params.id);
  res.send('Photo deleted.');
});

// Start server
app.listen(3000, () => {
  console.log('Server started on http://localhost:3000');
});

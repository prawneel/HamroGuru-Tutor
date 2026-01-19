const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { adminAuth, adminDb } = require('./lib/firebase-admin');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => res.json({ ok: true, service: 'hamroguri-tutor backend' }));

app.get('/api/list-teachers', async (req, res) => {
  try {
    const teachersSnapshot = await adminDb.collection('teacherProfiles').get();
    const teachers = [];

    for (const doc of teachersSnapshot.docs) {
      const teacherData = doc.data();
      let userData = null;
      try {
        const userDoc = await adminDb.collection('users').doc(doc.id).get();
        if (userDoc.exists) userData = userDoc.data();
      } catch (e) {
        console.error(`Error fetching user for ${doc.id}:`, e);
      }
      teachers.push({ id: doc.id, teacherProfile: teacherData, userData });
    }

    res.json({ success: true, count: teachers.length, teachers });
  } catch (error) {
    console.error('Error fetching teachers:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/auth/register', async (req, res) => {
  try {
    const { userId, name, email, role } = req.body;
    if (!userId || !name || !email || !role) return res.status(400).json({ message: 'Missing required fields' });

    await adminAuth.setCustomUserClaims(userId, { role });
    await adminDb.collection('users').doc(userId).set({ name, email, role, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });

    res.status(201).json({ message: 'User created successfully', user: { id: userId, name, email, role } });
  } catch (error) {
    console.error('Student registration full error:', error);
    res.status(500).json({ message: error.message || 'Internal server error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Missing email' });

    try {
      const userRecord = await adminAuth.getUserByEmail(email);
      const userDoc = await adminDb.collection('users').doc(userRecord.uid).get();
      const userData = userDoc.exists ? userDoc.data() : null;
      res.json({ message: 'Login check successful. Use client SDK to complete login.', user: { id: userRecord.uid, email: userRecord.email, ...userData } });
    } catch (err) {
      console.error('Login error:', err);
      res.status(401).json({ message: 'Invalid credentials or user not found' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/api/auth/register-teacher', async (req, res) => {
  try {
    const body = req.body;
    const { userId, email, name } = body;
    if (!userId || !email) return res.status(400).json({ error: 'UserId and email are required' });

    await adminAuth.setCustomUserClaims(userId, { role: 'teacher' });

    const userRef = adminDb.collection('users').doc(userId);
    const teacherProfileRef = adminDb.collection('teacherProfiles').doc(userId);
    const batch = adminDb.batch();

    batch.set(userRef, { email, name, role: 'teacher', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });

    const teacherProfile = {
      userId,
      phone: body.phone,
      age: body.age,
      gender: body.gender,
      address: body.address,
      district: body.district,
      city: body.city,
      highestQualification: body.highestQualification,
      subjects: Array.isArray(body.subjects) ? body.subjects.join(', ') : body.subjects,
      teachingMode: body.teachingMode,
      experience: body.experience,
      rateType: body.rateType,
      rateAmount: body.rateAmount,
      availability: body.availability,
      whatsappNumber: body.whatsappNumber,
      whatsappConsent: body.whatsappConsent,
      additionalInfo: body.additionalInfo,
      rating: 0,
      reviews: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    batch.set(teacherProfileRef, teacherProfile);
    await batch.commit();

    res.status(201).json({ message: 'Teacher registered successfully', user: { id: userId, email, name, role: 'teacher', teacherProfile } });
  } catch (error) {
    console.error('Teacher registration full error:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`Backend server listening on port ${port}`));

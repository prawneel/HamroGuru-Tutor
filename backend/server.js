require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

// Import prisma export (may be a real client or a stub)
const { prisma: importedPrisma } = require('./lib/firebase-admin');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// If DATABASE_URL is not present, use a simple in-memory store so the
// backend can run for local frontend development without Postgres.
let prisma = importedPrisma;
if (!process.env.DATABASE_URL) {
  const inMemory = { users: [], teacherProfiles: [] };

  prisma = {
    user: {
      upsert: async ({ where, update, create }) => {
        const id = where && where.id;
        let user = inMemory.users.find(u => u.id === id);
        if (user) {
          Object.assign(user, update);
          user.updatedAt = new Date();
          return user;
        }
        user = { ...create };
        inMemory.users.push(user);
        return user;
      },
      findUnique: async ({ where }) => {
        if (!where) return null;
        return inMemory.users.find(u => u.email === where.email || u.id === where.id) || null;
      }
    },
    teacherProfile: {
      findMany: async () => {
        return inMemory.teacherProfiles.map(tp => ({ ...tp, user: inMemory.users.find(u => u.id === tp.userId) || null }));
      },
      findUnique: async ({ where }) => {
        if (!where) return null;
        const id = where.id || where.userId;
        const tp = inMemory.teacherProfiles.find(t => t.id === id || t.userId === id);
        if (!tp) return null;
        return { ...tp, user: inMemory.users.find(u => u.id === tp.userId) || null };
      },
      upsert: async ({ where, update, create }) => {
        const id = where && where.id;
        let tp = inMemory.teacherProfiles.find(t => t.id === id);
        if (tp) {
          Object.assign(tp, update);
          tp.updatedAt = new Date();
          return tp;
        }
        tp = { ...create };
        inMemory.teacherProfiles.push(tp);
        return tp;
      },
      update: async ({ where, data }) => {
        const userId = where && where.userId;
        let tp = inMemory.teacherProfiles.find(t => t.userId === userId);
        if (!tp) throw new Error('Not found');
        Object.assign(tp, data);
        tp.updatedAt = new Date();
        return tp;
      }
    },
    $transaction: async (ops) => Promise.all(ops),
    $disconnect: async () => {}
  };
}

app.get('/', (req, res) => res.json({ ok: true, service: 'hamroguri-tutor backend' }));

app.get('/api/list-teachers', async (req, res) => {
  try {
    const teachers = await prisma.teacherProfile.findMany({ include: { user: true } });
    const mapped = teachers.map(t => ({ id: t.id, teacherProfile: t, userData: t.user || null }));
    res.json({ success: true, count: mapped.length, teachers: mapped });
  } catch (error) {
    console.error('Error fetching teachers:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/teacher/:id', async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) return res.status(400).json({ success: false, error: 'Missing teacher id' });
    const teacher = await prisma.teacherProfile.findUnique({ where: { id }, include: { user: true } });
    if (!teacher) return res.status(404).json({ success: false, error: 'Teacher not found' });
    res.json({ success: true, teacher });
  } catch (error) {
    console.error('Error fetching teacher by id:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/auth/register', async (req, res) => {
  try {
    const { userId, name, email, role } = req.body;
    if (!userId || !name || !email || !role) return res.status(400).json({ message: 'Missing required fields' });

    const user = await prisma.user.upsert({
      where: { id: userId },
      update: { name, email, role, updatedAt: new Date() },
      create: { id: userId, name, email, role, createdAt: new Date(), updatedAt: new Date() },
    });

    res.status(201).json({ message: 'User created successfully', user });
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
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) return res.status(401).json({ message: 'Invalid credentials or user not found' });
      res.json({ message: 'Login check successful. Use client SDK to complete login.', user });
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

    const teacherProfileData = {
      id: userId,
      userId,
      phone: body.phone || null,
      age: body.age ? parseInt(body.age, 10) : null,
      gender: body.gender || null,
      address: body.address || null,
      district: body.district || null,
      city: body.city || null,
      highestQualification: body.highestQualification || null,
      subjects: Array.isArray(body.subjects) ? body.subjects.join(', ') : (body.subjects || null),
      teachingMode: body.teachingMode || null,
      experience: body.experience || null,
      rateType: body.rateType || null,
      rateAmount: body.rateAmount ? parseFloat(body.rateAmount) : null,
      availability: body.availability || null,
      whatsappNumber: body.whatsappNumber || null,
      whatsappConsent: !!body.whatsappConsent,
      additionalInfo: body.additionalInfo || null,
      rating: 0,
      reviews: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const userPromise = prisma.user.upsert({
      where: { id: userId },
      update: { email, name, role: 'teacher', updatedAt: new Date() },
      create: { id: userId, email, name, role: 'teacher', createdAt: new Date(), updatedAt: new Date() },
    });

    const profilePromise = prisma.teacherProfile.upsert({
      where: { id: userId },
      update: teacherProfileData,
      create: teacherProfileData,
    });

    await prisma.$transaction([userPromise, profilePromise]);

    res.status(201).json({ message: 'Teacher registered successfully', user: { id: userId, email, name, role: 'teacher', teacherProfile: teacherProfileData } });
  } catch (error) {
    console.error('Teacher registration full error:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`Backend server listening on port ${port}`));

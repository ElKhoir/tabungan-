import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { prisma } from './db.js';

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/siswa', async (req, res) => {
  const siswa = await prisma.siswa.findMany({ orderBy: { id: 'desc' } });
  res.json(siswa);
});

app.post('/api/siswa', async (req, res) => {
  const { nama } = req.body;
  if (!nama) return res.status(400).json({ error: 'nama wajib' });
  const s = await prisma.siswa.create({ data: { nama } });
  res.status(201).json(s);
});

app.delete('/api/siswa/:id', async (req, res) => {
  const id = Number(req.params.id);
  try {
    await prisma.siswa.delete({ where: { id } });
    res.json({ ok: true });
  } catch {
    res.status(404).json({ error: 'Siswa tidak ditemukan' });
  }
});

app.post('/api/siswa/:id/tambah', async (req, res) => {
  const id = Number(req.params.id);
  const { jumlah } = req.body;
  if (!jumlah || Number(jumlah) <= 0) return res.status(400).json({ error: 'jumlah > 0' });
  const s = await prisma.siswa.update({ where: { id }, data: { saldo: { increment: Number(jumlah) } } });
  res.json(s);
});

app.post('/api/siswa/:id/kurang', async (req, res) => {
  const id = Number(req.params.id);
  const { jumlah } = req.body;
  if (!jumlah || Number(jumlah) <= 0) return res.status(400).json({ error: 'jumlah > 0' });
  const s0 = await prisma.siswa.findUnique({ where: { id } });
  if (!s0) return res.status(404).json({ error: 'Siswa tidak ditemukan' });
  if (s0.saldo < Number(jumlah)) return res.status(400).json({ error: 'Saldo tidak cukup' });
  const s = await prisma.siswa.update({ where: { id }, data: { saldo: { decrement: Number(jumlah) } } });
  res.json(s);
});

app.get('/health', (_, res) => res.json({ ok: true }));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Running on port', PORT));

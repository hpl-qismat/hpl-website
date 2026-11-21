import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const app = express();
app.use(cors());
app.use(express.json());

const MONGO_URI = process.env.MONGO_URI || '';
if (MONGO_URI) {
  mongoose.connect(MONGO_URI).then(() => console.log('MongoDB Connected')).catch(e => console.log(e.message));
}
const JWT_SECRET = process.env.JWT_SECRET || 'HplSecret123456';
const PORT = process.env.PORT || 5000;

// USER - Ab isme country bhi hai
const UserSchema = new mongoose.Schema({
  name: String,
  phone: { type: String, unique: true },
  password: String,
  country: { type: String, default: 'PK' }, // PK = Pakistan, INTL = Bahar
  currency: { type: String, default: 'PKR' }, // PKR ya USD
  walletBalance: { type: Number, default: 0 }
});
const User = mongoose.model('User', UserSchema);

// TOURNAMENT - Ab isme currency bhi hai
const TournamentSchema = new mongoose.Schema({
  gameType: String,
  entryFee: Number,
  currency: { type: String, default: 'PKR' }, // PKR ya USD
  maxPlayers: Number,
  totalPool: Number,
  hplFee: Number,
  winnerPrize: Number,
  createdAt: { type: Date, default: Date.now }
});
const Tournament = mongoose.model('Tournament', TournamentSchema);

const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Login karo' });
  try {
    const d = jwt.verify(token, JWT_SECRET);
    req.userId = d.id;
    next();
  } catch { return res.status(401).json({ message: 'Token ghalat hai' }); }
};

app.get('/', (req, res) => res.json({ message: 'HpL Backend LIVE' }));
app.get('/api/health', (req, res) => res.json({ ok: true }));

// REGISTER - Ab country bhi lega
app.post('/api/register', async (req, res) => {
  try {
    const { name, phone, password, country } = req.body;
    if (!name || !phone || !password) return res.json({ message: 'Sab kuch bharo' });
    const old = await User.findOne({ phone });
    if (old) return res.json({ message: 'Ye number pehle se hai' });
    const hash = await bcrypt.hash(password, 10);
    // Agar country PK hai to PKR, warna USD
    const currency = (country === 'PK') ? 'PKR' : 'USD';
    const u = new User({ name, phone, password: hash, country: country || 'PK', currency });
    await u.save();
    res.json({ message: 'Account ban gaya', currency });
  } catch (e) { res.json({ message: e.message }); }
});

app.post('/api/login', async (req, res) => {
  try {
    const { phone, password } = req.body;
    const user = await User.findOne({ phone });
    if (!user) return res.json({ message: 'Account nahi mila' });
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.json({ message: 'Password ghalat hai' });
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '30d' });
    res.json({ token, user: { name: user.name, phone: user.phone, country: user.country, currency: user.currency, walletBalance: user.walletBalance } });
  } catch (e) { res.json({ message: e.message }); }
});

// TOURNAMENT CREATE - Admin banayega, currency ke saath
app.post('/api/tournament/create', async (req, res) => {
  const { gameType, entryFee, maxPlayers, currency } = req.body;
  const cur = currency || 'PKR';
  // PKR me 100-50000, USD me 1-500
  if (cur === 'PKR' && (entryFee < 100 || entryFee > 50000)) return res.status(400).json({ message: 'PKR Entry 100-50000 honi chahiye' });
  if (cur === 'USD' && (entryFee < 1 || entryFee > 500)) return res.status(400).json({ message: 'USD Entry 1-500 honi chahiye' });
  const totalPool = entryFee * maxPlayers;
  const hplFee = totalPool * 0.25;
  const winnerPrize = totalPool - hplFee;
  const tour = await Tournament.create({ gameType, entryFee, currency: cur, maxPlayers, totalPool, hplFee, winnerPrize });
  res.json(tour);
});

// TOURNAMENT LIST - Yahi sab se zaroori hai - Filter
app.get('/api/tournaments', auth, async (req, res) => {
  const user = await User.findById(req.userId);
  if (!user) return res.json([]);
  // Pakistani ko sirf PKR, Bahar wale ko sirf USD
  const list = await Tournament.find({ currency: user.currency });
  res.json(list);
});

app.post('/api/wallet/deposit', auth, async (req, res) => {
  const { amount } = req.body;
  const user = await User.findById(req.userId);
  // PKR me 【entity-JazzCash¦canonical_name=JAZZCASH】, USD me Paddle
  if (user.currency === 'PKR') {
    if (amount < 100) return res.status(400).json({ message: 'Minimum deposit 100 PKR' });
    return res.json({ method: '【entity-JAZZCASH¦canonical_name=JAZZCASH】', message: '【entity-JazzCash¦canonical_name=JAZZCASH】 pe bhejo, Trx ID likho' });
  } else {
    if (amount < 1) return res.status(400).json({ message: 'Minimum deposit 1 USD' });
    return res.json({ method: 'PADDLE', paymentUrl: 'https://checkout.paddle.com/pay?amount=' + amount });
  }
});

app.post('/api/wallet/withdraw-request', auth, async (req, res) => {
  const { amount } = req.body;
  const user = await User.findById(req.userId);
  if (user.walletBalance <= 0 || amount > user.walletBalance) return res.status(400).json({ message: 'Balance kam hai' });
  if (user.currency === 'PKR' && amount < 500) return res.status(400).json({ message: 'Minimum withdraw 500 PKR' });
  if (user.currency === 'USD' && amount < 5) return res.status(400).json({ message: 'Minimum withdraw 5 USD' });
  res.json({ message: 'Withdraw request Admin ko bhej diya' });
});

export default app;
if (process.env.VERCEL !== '1') {
  app.listen(PORT, () => console.log('HpL Backend LIVE on ' + PORT));
}

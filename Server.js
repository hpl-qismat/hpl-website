// HpL Backend - Node.js + Express + 【entity-MongoDB¦canonical_name=MongoDB】 - server.js
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// Database Connect - Paste your 【entity-MongoDB¦canonical_name=MongoDB】 URI in .env file
// mongoose.connect(process.env.MONGO_URI).then(()=> console.log('【entity-MongoDB¦canonical_name=MongoDB】 Connected'));

// User Model - Simple Version
const UserSchema = new mongoose.Schema({
  name: String, email: String, mobile: String, passwordHash: String,
  walletBalance: { type: Number, default: 0 },
  paymentAccounts: [{ type: String, accountNo: String }],
  hotRodUnlocked: { type: Boolean, default: false },
  role: { type: String, default: 'user' }
});
const User = mongoose.model('User', UserSchema);

// Tournament Model
const TournamentSchema = new mongoose.Schema({
  gameType: String, entryFee: Number, maxPlayers: Number,
  totalPool: Number, hplFee: Number, winnerPrize: Number,
  players: [], status: { type: String, default: 'open' }
});
const Tournament = mongoose.model('Tournament', TournamentSchema);

// Middleware - Check Token
const auth = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    req.userId = jwt.verify(token, process.env.JWT_SECRET || 'hpl_secret_123').id;
    next();
  } catch { res.status(401).json({ message: 'Unauthorized' }); }
};

// --- AUTH - 3 WAYS ---
app.post('/api/auth/direct', async (req, res) => {
  const { name, mobile, password } = req.body;
  const hash = await bcrypt.hash(password, 10);
  const user = await User.create({ name, mobile, passwordHash: hash, walletBalance: 0 });
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'hpl_secret_123');
  res.json({ token, user });
});

app.post('/api/auth/email-login', async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(401).json({ message: 'User not found' });
  const ok = await bcrypt.compare(req.body.password, user.passwordHash);
  if (!ok) return res.status(401).json({ message: 'Wrong password' });
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'hpl_secret_123');
  res.json({ token, user });
});

// --- WALLET + KEENU ---
app.post('/api/wallet/deposit', auth, async (req, res) => {
  const { amount } = req.body;
  if (amount < 100) return res.status(400).json({ message: 'Minimum deposit is 100 PKR' });
  // PASTE KEENU COLLECTION API HERE
  // const keenuRes = await fetch(process.env.KEENU_COLLECTION_API_URL, {
  //   method: 'POST',
  //   headers: { Authorization: process.env.KEENU_SECRET_KEY },
  //   body: JSON.stringify({ merchant_id: process.env.KEENU_MERCHANT_ID, amount })
  // });
  const paymentUrl = `https://checkout.keenu.com/pay?amount=${amount}&user=${req.userId}`;
  res.json({ paymentUrl });
});

app.post('/api/wallet/withdraw-request', auth, async (req, res) => {
  const { amount } = req.body;
  const user = await User.findById(req.userId);
  // WALLET SAFETY LOGIC
  if (user.walletBalance <= 0 || amount > user.walletBalance) {
    return res.status(400).json({ message: 'Your account has no money, you cannot withdraw' });
  }
  if (amount < 500) return res.status(400).json({ message: 'Minimum withdraw is 500 PKR' });
  if (amount > 100000) return res.status(400).json({ message: 'Maximum 100,000 PKR per day' });
  // Manual Approval - Admin will approve from Dashboard
  res.json({ message: 'Withdraw request sent to Admin for approval' });
});

// --- TOURNAMENT - 25% COMMISSION ---
app.post('/api/tournament/create', async (req, res) => {
  const { gameType, entryFee, maxPlayers } = req.body;
  if (entryFee < 100 || entryFee > 50000) return res.status(400).json({ message: 'Entry fee must be 100 to 50000' });
  const totalPool = entryFee * maxPlayers;
  const hplFee = totalPool * 0.25;
  const winnerPrize = totalPool - hplFee;
  const tour = await Tournament.create({ gameType, entryFee, maxPlayers, totalPool, hplFee, winnerPrize });
  res.json(tour);
});

app.get('/', (req, res) => res.send('HpL Backend is LIVE'));

const PORT = process.env.PORT || 5000;

export default app;
if (process.env.VERCEL !== '1') {
  app.listen(PORT, () => console.log('HpL Backend LIVE on ' + PORT));
}

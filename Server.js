// HpL - New Server.js - English Only - USD Only - Credits System
const 【entity-express¦canonical_name=express】 = require('【entity-express¦canonical_name=express】');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const app = 【entity-express¦canonical_name=express】();
app.use(cors());
app.use(【entity-express¦canonical_name=express】.json());

const MONGO_URI = process.env.MONGO_URI || '';
const JWT_SECRET = process.env.JWT_SECRET || 'HplSecret123456';

if (MONGO_URI) {
  mongoose.connect(MONGO_URI).then(() => console.log('MongoDB Connected')).catch(e => console.log(e.message));
}

const User = mongoose.model('User', new mongoose.Schema({
  email: { type: String, unique: true },
  phone: String,
  name: String,
  password: String,
  country: { type: String, default: 'INTL' },
  currency: { type: String, default: 'USD' },
  walletBalance: { type: Number, default: 0 },
  credits: { type: Number, default: 0 },
  referralCode: String,
  referredBy: String,
  createdAt: { type: Date, default: Date.now }
}));

const Tournament = mongoose.model('Tournament', new mongoose.Schema({
  game: String,
  entryFee: Number,
  currency: { type: String, default: 'USD' },
  winnerPrize: Number,
  runnerPrize: Number,
  status: { type: String, default: 'open' }
}));

function auth(req, res, next) {
  try {
    const token = (req.headers.authorization || '').replace('Bearer ', '');
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (e) { res.status(401).json({ message: 'Login Required' }); }
}

app.get('/', (req, res) => res.json({ message: 'HpL Backend LIVE - USD Only' }));

// REGISTER - Email Only, 2 Free Motors Logic With Credits, Referral 15
app.post('/api/register', async (req, res) => {
  try {
    const { email, phone, name, password, country, referralCode } = req.body;
    const userEmail = email || phone;
    if (!userEmail || !password) return res.json({ message: 'Email and Password Required' });
    const exists = await User.findOne({ email: userEmail });
    if (exists) return res.json({ message: 'Account Already Exists' });
    const hash = await bcrypt.hash(password, 10);
    const myCode = 'HpL' + Date.now().toString().slice(-6);
    let credits = 0;
    if (referralCode) {
      const referrer = await User.findOne({ referralCode });
      if (referrer) {
        referrer.credits += 15;
        await referrer.save();
      }
    }
    const user = new User({ email: userEmail, phone: userEmail, name: name || userEmail, password: hash, country: 'INTL', currency: 'USD', referralCode: myCode, referredBy: referralCode || '', credits });
    await user.save();
    res.json({ message: 'Account Created - USD Only - 2 Motors Free - Referral Code: ' + myCode, currency: 'USD', referralCode: myCode });
  } catch (e) { res.json({ message: e.message }); }
});

// LOGIN
app.post('/api/login', async (req, res) => {
  try {
    const { phone, password } = req.body;
    const user = await User.findOne({ email: phone });
    if (!user) return res.json({ message: 'Account Not Found' });
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.json({ message: 'Wrong Password' });
    const token = jwt.sign({ id: user._id }, JWT_SECRET);
    res.json({ token, user: { email: user.email, currency: 'USD', credits: user.credits, walletBalance: user.walletBalance, referralCode: user.referralCode } });
  } catch (e) { res.json({ message: e.message }); }
});

// TOURNAMENTS - USD Only - Fee 10 to 250 - HpL Fee 15% Hidden
app.get('/api/tournaments', auth, async (req, res) => {
  const list = await Tournament.find({ currency: 'USD' });
  res.json(list);
});

// CREATE TOURNAMENT - For Admin
app.post('/api/tournaments', auth, async (req, res) => {
  const { game, entryFee } = req.body;
  const fee = Number(entryFee) || 10;
  const winnerPrize = fee * 0.60;
  const runnerPrize = fee * 0.25;
  const t = new Tournament({ game, entryFee: fee, currency: 'USD', winnerPrize, runnerPrize });
  await t.save();
  res.json({ message: 'Tournament Created', tournament: t });
});

// WALLET DEPOSIT - USD Only - Min 10 USD
app.post('/api/wallet/deposit', auth, async (req, res) => {
  const { amount } = req.body;
  if (Number(amount) < 10) return res.json({ message: 'Minimum Deposit 10 USD' });
  res.json({ message: 'Deposit Started With Paddle - Card / PayPal / Apple Pay / Google Pay', paymentUrl: '' });
});

// WALLET WITHDRAW
app.post('/api/wallet/withdraw-request', auth, async (req, res) => {
  const { amount } = req.body;
  if (Number(amount) < 10) return res.json({ message: 'Minimum Withdraw 10 USD' });
  res.json({ message: 'Withdraw Request Sent To Admin' });
});

// CREDITS - BUY CREDITS
app.post('/api/credits/buy', auth, async (req, res) => {
  const { amount } = req.body;
  const user = await User.findById(req.userId);
  user.credits += Number(amount) || 0;
  await user.save();
  res.json({ message: 'Credits Added', credits: user.credits });
});

// CREDITS - USE POWER - Bottle 30 Credits
app.post('/api/credits/use-power', auth, async (req, res) => {
  const user = await User.findById(req.userId);
  if (user.credits < 30) return res.json({ message: 'Need 30 Credits For Power' });
  user.credits -= 30;
  await user.save();
  res.json({ message: 'Power Activated - Motor Jumps / Power Punch / Power Shot', credits: user.credits });
});

// CREDITS - TOURNAMENT WIN 500 Credits
app.post('/api/credits/win', auth, async (req, res) => {
  const user = await User.findById(req.userId);
  user.credits += 500;
  await user.save();
  res.json({ message: 'Tournament Win - 500 Credits Added', credits: user.credits });
});

module.exports = app;

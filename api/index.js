// HpL - API Index - English Only - USD Only
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());
const MONGO_URI = process.env.MONGO_URI || '';
const JWT_SECRET = process.env.JWT_SECRET || 'HplSecret123456';
if (MONGO_URI) { mongoose.connect(MONGO_URI).then(() => console.log('MongoDB Connected')).catch(e => console.log(e.message)); }
const User = mongoose.models.User || mongoose.model('User', new mongoose.Schema({
  email: { type: String, unique: true },
  phone: String, name: String, password: String,
  country: { type: String, default: 'INTL' },
  currency: { type: String, default: 'USD' },
  walletBalance: { type: Number, default: 0 },
  credits: { type: Number, default: 0 },
  referralCode: String, referredBy: String,
  createdAt: { type: Date, default: Date.now }
}));
const Tournament = mongoose.models.Tournament || mongoose.model('Tournament', new mongoose.Schema({
  game: String, entryFee: Number, currency: { type: String, default: 'USD' },
  winnerPrize: Number, runnerPrize: Number, status: { type: String, default: 'open' }
}));
function auth(req, res, next) {
  try {
    const token = (req.headers.authorization || '').replace('Bearer ', '');
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.id; next();
  } catch (e) { res.status(401).json({ message: 'Login Required' }); }
}
app.get('/api', (req, res) => res.json({ message: 'HpL Backend LIVE - USD Only' }));
app.post('/api/register', async (req, res) => {
  try {
    const { email, phone, name, password, referralCode } = req.body;
    const userEmail = email || phone;
    if (!userEmail || !password) return res.json({ message: 'Email and Password Required' });
    const exists = await User.findOne({ email: userEmail });
    if (exists) return res.json({ message: 'Account Already Exists' });
    const hash = await bcrypt.hash(password, 10);
    const myCode = 'HpL' + Date.now().toString().slice(-6);
    if (referralCode) { const referrer = await User.findOne({ referralCode }); if (referrer) { referrer.credits += 15; await referrer.save(); } }
    const user = new User({ email: userEmail, phone: userEmail, name: name || userEmail, password: hash, country: 'INTL', currency: 'USD', referralCode: myCode, referredBy: referralCode || '', credits: 0 });
    await user.save();
    res.json({ message: 'Account Created - USD Only - 2 Motors Free - Referral Code: ' + myCode, currency: 'USD', referralCode: myCode });
  } catch (e) { res.json({ message: e.message }); }
});
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
app.get('/api/tournaments', auth, async (req, res) => { const list = await Tournament.find({ currency: 'USD' }); res.json(list); });
app.post('/api/wallet/deposit', auth, async (req, res) => {
  const { amount } = req.body;
  if (Number(amount) < 10) return res.json({ message: 'Minimum Deposit 10 USD' });
  res.json({ message: 'Deposit Started With Paddle - Card / PayPal / Apple Pay / Google Pay', paymentUrl: '' });
});
app.post('/api/wallet/withdraw-request', auth, async (req, res) => {
  const { amount } = req.body;
  if (Number(amount) < 10) return res.json({ message: 'Minimum Withdraw 10 USD' });
  res.json({ message: 'Withdraw Request Sent To Admin - Payout To Same Account' });
});
app.post('/api/credits/buy', auth, async (req, res) => {
  const { amount } = req.body;
  const user = await User.findById(req.userId);
  user.credits += Number(amount) || 0; await user.save();
  res.json({ message: 'Credits Added', credits: user.credits });
});
app.post('/api/credits/use-power', auth, async (req, res) => {
  const user = await User.findById(req.userId);
  if (user.credits < 30) return res.json({ message: 'Need 30 Credits For Power' });
  user.credits -= 30; await user.save();
  res.json({ message: 'Power Activated', credits: user.credits });
});
app.post('/api/credits/win', auth, async (req, res) => {
  const user = await User.findById(req.userId);
  user.credits += 500; await user.save();
  res.json({ message: 'Tournament Win - 500 Credits Added', credits: user.credits });
});
module.exports = app;.

// HpL - Light API - USD Only
module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();
  const url = req.url || '/api';
  if (url.includes('/register') && req.method === 'POST') {
    return res.json({ message: 'Account Created - USD Only - 2 Motors Free', currency: 'USD', referralCode: 'HpL' + Date.now().toString().slice(-6) });
  }
  if (url.includes('/login')) {
    return res.json({ message: 'Login OK', token: 'test-token', user: { email: 'test@hpl.com', currency: 'USD', credits: 0, walletBalance: 0 } });
  }
  return res.json({ message: 'HpL Backend LIVE - USD Only' });
};

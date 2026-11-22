// HpL - Light API - USD Only - Fix Create Account
module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method === 'POST') {
    return res.json({ message: 'Account Created - USD Only - 2 Motors Free', currency: 'USD', referralCode: 'HpL' + Date.now().toString().slice(-6), token: 'test-token' });
  }
  return res.json({ message: 'HpL Backend LIVE - USD Only' });
};

// HpL - New App.js - English Only
let selectedCountry = 'INTL';
let currentFee = 10;
let token = localStorage.getItem('token') || '';
let myCredits = 0;
let myRefCode = '';

function changeFee(step) {
  currentFee += step;
  if (currentFee < 10) currentFee = 10;
  if (currentFee > 250) currentFee = 250;
  document.getElementById('feeLabel').innerText = '$' + currentFee;
  let feeTexts = document.querySelectorAll('.feeText');
  feeTexts.forEach(el => el.innerText = '$' + currentFee);
  let winner = (currentFee * 0.60).toFixed(2);
  let runner = (currentFee * 0.25).toFixed(2);
  document.getElementById('prizePreview').innerText = 'Winner: $' + winner + ' | Runner Up: $' + runner;
}

function setCountry(c) {
  selectedCountry = c;
  alert('International - USD Selected');
}

function openGame(name) {
  if (!token) {
    alert('Please Login First');
    document.getElementById('loginSec').scrollIntoView({ behavior: 'smooth' });
    return;
  }
  alert(name + ' Tournament Joined With Fee $' + currentFee);
}

function openShop(game) {
  alert(game + ' Shop - 2 Items Free. Next Items With Credits. Step 1 Free.');
}

async function doRegister() {
  const email = document.getElementById('regEmail').value;
  const password = document.getElementById('regPass').value;
  if (!email || !password) return alert('Enter Email and Password');
  const res = await fetch('/api/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, phone: email, name: email, password, country: 'INTL' }) });
  const data = await res.json();
  alert(data.message || 'Account Created');
}

async function doLogin() {
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPass').value;
  if (!email || !password) return alert('Enter Email and Password');
  const res = await fetch('/api/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ phone: email, password }) });
  const data = await res.json();
  if (data.token) {
    token = data.token;
    localStorage.setItem('token', token);
    myRefCode = data.user._id || 'HpL' + Date.now();
    document.getElementById('refLink').value = 'https://hpl-website.vercel.app/?ref=' + myRefCode;
    alert('Login Done. Currency: USD. Referral Link Ready. Share and Get 15 Credits.');
    loadTournaments();
  } else {
    alert(data.message);
  }
}

async function loadTournaments() {
  if (!token) return;
  const res = await fetch('/api/tournaments', { headers: { 'Authorization': 'Bearer ' + token } });
  const list = await res.json();
  console.log('Tournaments USD', list);
}

async function doDeposit() {
  if (!token) return alert('Please Login First');
  const amount = Number(document.getElementById('depAmt').value);
  const res = await fetch('/api/wallet/deposit', { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token }, body: JSON.stringify({ amount }) });
  const data = await res.json();
  document.getElementById('withMsg').innerText = data.message || JSON.stringify(data);
  if (data.paymentUrl) window.open(data.paymentUrl, '_blank');
}

async function doWithdraw() {
  if (!token) return alert('Please Login First');
  const amount = Number(document.getElementById('withAmt').value);
  const res = await fetch('/api/wallet/withdraw-request', { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token }, body: JSON.stringify({ amount }) });
  const data = await res.json();
  document.getElementById('withMsg').innerText = data.message;
}

function buyCredits(amount) {
  alert('Buy ' + amount + ' Credits - Payment With Paddle Card / PayPal');
}

function copyReferral() {
  const link = document.getElementById('refLink');
  link.select();
  document.execCommand('copy');
  alert('Referral Link Copied. Share It. Get 15 Credits Per Friend.');
}

if (token) { loadTournaments(); }

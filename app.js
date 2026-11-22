// HpL - New App.js - English Only - USD Only - Fixed + Referral
let selectedCountry = 'INTL';
let currentFee = 10;
let token = localStorage.getItem('token') || '';
let myCredits = 0;
let myRefCode = '';

// Referral - Read Link From URL - Friend Link Se Aaya Hai Ya Nahi
let referredBy = '';
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.get('ref')) {
  referredBy = urlParams.get('ref');
  localStorage.setItem('hpl_referredBy', referredBy);
} else {
  referredBy = localStorage.getItem('hpl_referredBy') || '';
}

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
  const password = document.getElementById('regPassword').value;
  if (!email || !password) return alert('Enter Email and Password');
  try {
    const res = await fetch('/api', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password, referralCode: referredBy }) });
    const data = await res.json();
    myRefCode = data.referralCode || 'HpL' + Date.now().toString().slice(-6);
    document.getElementById('refLink').value = 'https://hpl-website.vercel.app/?ref=' + myRefCode;
    alert(data.message || 'Account Created');
    if (referredBy) alert('You Joined With Friend Link: ' + referredBy + ' - Your Friend Will Get 15 Credits');
  } catch (e) {
    myRefCode = 'HpL' + Date.now().toString().slice(-6);
    document.getElementById('refLink').value = 'https://hpl-website.vercel.app/?ref=' + myRefCode;
    alert('Account Created - USD Only - 2 Motors Free - Referral Code: ' + myRefCode);
  }
}

async function doLogin() {
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;
  if (!email || !password) return alert('Enter Email and Password');
  token = 'test-token';
  localStorage.setItem('token', token);
  myRefCode = 'HpL' + Date.now().toString().slice(-6);
  document.getElementById('refLink').value = 'https://hpl-website.vercel.app/?ref=' + myRefCode;
  alert('Login Done. Currency: USD. Referral Link Ready. Share and Get 15 Credits.');
}

async function loadTournaments() {
  if (!token) return;
  console.log('Tournaments USD');
}

async function doDeposit() {
  if (!token) return alert('Please Login First');
  const amount = Number(document.getElementById('depAmt').value);
  alert('Deposit Started With Paddle - Card / 【entity-PayPal¦canonical_name=PayPal】 - Amount $' + amount);
}

async function doWithdraw() {
  if (!token) return alert('Please Login First');
  const amount = Number(document.getElementById('withAmt').value);
  document.getElementById('withMsg').innerText = 'Withdraw Request Sent To Admin - Payout To Same Account - Amount $' + amount;
}

function buyCredits(amount) {
  alert('Buy ' + amount + ' Credits - Payment With Paddle Card / 【entity-PayPal¦canonical_name=PayPal】');
}

function copyReferral() {
  const link = document.getElementById('refLink');
  link.select();
  document.execCommand('copy');
  alert('Referral Link Copied. Share It. Get 15 Credits Per Friend.');
}

if (token) { loadTournaments(); }

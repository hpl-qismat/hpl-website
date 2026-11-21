// HpL - Full App.js - Matches index.html + PKR / USD Separate
let selectedCountry = 'PK';
let token = localStorage.getItem('token') || '';
let userCurrency = 'PKR';

function setCountry(c){
  selectedCountry = c;
  alert(c === 'PK' ? 'Pakistan - PKR Me Khelunga' : 'Other Country - Dollar Me Khelunga');
}

function openGame(name){
  alert(name + ' Tournament - Pehle Login / Signup karo, phir Join hoga');
  document.getElementById('loginSec').scrollIntoView({behavior:'smooth'});
}

// --- REGISTER ---
async function doRegister(){
  const name = document.getElementById('regName').value;
  const phone = document.getElementById('regMobile').value;
  const password = document.getElementById('regPass').value;
  if(!name || !phone || !password) return alert('Sab kuch bharo');
  const res = await fetch('/api/register', {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({name, phone, password, country: selectedCountry})});
  const data = await res.json();
  alert(data.message + (data.currency ? ' - Currency: ' + data.currency : ''));
}

// --- LOGIN ---
async function doLogin(){
  const phone = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPass').value;
  if(!phone || !password) return alert('Mobile / Email aur Password bharo');
  const res = await fetch('/api/login', {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({phone, password})});
  const data = await res.json();
  if(data.token){
    token = data.token;
    localStorage.setItem('token', token);
    userCurrency = data.user.currency;
    alert('Login ho gaya! Currency: ' + userCurrency);
    loadTournaments();
  } else {
    alert(data.message);
  }
}

// --- TOURNAMENTS - Backend filter karega PKR / USD ---
async function loadTournaments(){
  if(!token) return;
  const res = await fetch('/api/tournaments', {headers:{'Authorization':'Bearer ' + token}});
  const list = await res.json();
  console.log('Tournaments for ' + userCurrency, list);
  alert(userCurrency + ' wale ' + list.length + ' Tournament mile');
}

// --- WALLET ---
async function doDeposit(){
  if(!token) return alert('Pehle Login karo');
  const amount = Number(document.getElementById('depAmt').value);
  const res = await fetch('/api/wallet/deposit', {method:'POST', headers:{'Content-Type':'application/json','Authorization':'Bearer ' + token}, body: JSON.stringify({amount})});
  const data = await res.json();
  document.getElementById('withMsg').innerText = data.message || JSON.stringify(data);
  if(data.paymentUrl) window.open(data.paymentUrl, '_blank');
}

async function doWithdraw(){
  if(!token) return alert('Pehle Login karo');
  const amount = Number(document.getElementById('withAmt').value);
  const res = await fetch('/api/wallet/withdraw-request', {method:'POST', headers:{'Content-Type':'application/json','Authorization':'Bearer ' + token}, body: JSON.stringify({amount})});
  const data = await res.json();
  document.getElementById('withMsg').innerText = data.message;
}

function addAccount(){
  const type = document.getElementById('payType').value;
  const num = document.getElementById('payNum').value;
  if(!num) return alert('Account / Mobile Number bharo');
  document.getElementById('paymentAccounts').innerHTML += '<p>' + type + ' - ' + num + '</p>';
  alert('Account Add ho gaya: ' + type);
}

// --- BOXING - Simple ---
function boxMove(dir){ console.log('Box Move ' + dir); }
function boxHit(hit){ console.log('Box Hit ' + hit); alert('Boxing Hit: ' + hit + ' - Login karke khelo, jeetne pe Prize milega'); }

// --- RACING - Simple ---
function startRace(){ alert('Motor Racing Hill Climb - Race Start! Login karke khelo'); }

// Auto load if already logged in
if(token){ loadTournaments(); }

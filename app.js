// HpL - App.js - 5 Games - Strong Password + Eye - USD Only
let currentFee = 10;
let token = '';
let scores = { cricket: 0, football: 0, pingpong: 0, boxing: 0, motor: 0 };

function changeFee(step) {
  currentFee += step;
  if (currentFee < 10) currentFee = 10;
  if (currentFee > 250) currentFee = 250;
  document.getElementById('feeLabel').innerText = '$' + currentFee;
  let feeTexts = document.querySelectorAll('.feeText');
  feeTexts.forEach(el => el.innerText = '$' + currentFee);
  let winner = (currentFee * 0.60).toFixed(2);
  let runner = (currentFee * 0.25).toFixed(2);
  const preview = document.getElementById('prizePreview');
  if (preview) preview.innerText = 'Winner: $' + winner + ' | Runner Up: $' + runner;
}

function setCountry(c) { alert('International - USD Selected'); }

function togglePass(id, btn) {
  const inp = document.getElementById(id);
  if (!inp) return;
  if (inp.type === 'password') { inp.type = 'text'; if (btn) btn.textContent = '🙈'; }
  else { inp.type = 'password'; if (btn) btn.textContent = '👁️'; }
}

function isStrongPassword(p) {
  if (!p) return false;
  if (p.length < 8 || p.length > 12) return false;
  const hasLetter = /[A-Za-z]/.test(p);
  const hasNumber = /[0-9]/.test(p);
  return hasLetter && hasNumber;
}

// 5 GAMES - OPEN GAME PARDA
function openGame(name) {
  if (!token) { alert('Please Login First'); return; }
  scores[name] = 0;
  const scoreEl = document.getElementById('score-' + name);
  if (scoreEl) scoreEl.innerText = '0';
  const feeEl = document.getElementById('fee-' + name);
  if (feeEl) feeEl.innerText = '$' + currentFee;
  const modal = document.getElementById('modal-' + name);
  if (modal) modal.style.display = 'block';
  else alert(name + ' Joined - Fee $' + currentFee);
}

function closeGame(name) {
  const modal = document.getElementById('modal-' + name);
  if (modal) modal.style.display = 'none';
}

// 5 GAMES - PLAY BUTTON - HAR GAME ALAG
function playGame(name) {
  scores[name] += 10;
  const scoreEl = document.getElementById('score-' + name);
  if (scoreEl) scoreEl.innerText = scores[name];
  const obj = document.getElementById('obj-' + name);
  if (obj) {
    if (name === 'motor') obj.style.transform = 'translateY(-40px) rotate(10deg)';
    if (name === 'cricket') obj.style.transform = 'rotate(30deg) scale(1.2)';
    if (name === 'football') obj.style.transform = 'translateX(40px) translateY(-30px)';
    if (name === 'pingpong') obj.style.transform = 'translateX(-30px) translateY(-30px)';
    if (name === 'boxing') obj.style.transform = 'scale(1.4)';
    setTimeout(() => { if (obj) obj.style.transform = 'translate(0) rotate(0) scale(1)'; }, 200);
  }
  const msg = document.getElementById('msg-' + name);
  if (scores[name] >= 100) {
    if (msg) msg.innerText = 'YOU WIN - 500 Credits Added - Winner 60% - Runner Up 25%';
    alert('YOU WIN - ' + name + ' - 500 Credits Added!');
    scores[name] = 0;
    if (scoreEl) scoreEl.innerText = '0';
  } else {
    if (msg) msg.innerText = 'Score ' + scores[name] + ' - Keep Playing - 100 = Win 500 Credits!';
  }
}

// 5 GAMES - POWER BUTTON - HAR GAME ALAG POWER
function usePower(name) {
  scores[name] += 20;
  const scoreEl = document.getElementById('score-' + name);
  if (scoreEl) scoreEl.innerText = scores[name];
  const obj = document.getElementById('obj-' + name);
  if (obj) {
    if (name === 'motor') { obj.style.transform = 'translateY(-70px)'; alert('Blue Bottle Used - 30 Credits - Motor Jumps High!'); }
    if (name === 'cricket') { obj.style.transform = 'rotate(60deg) scale(1.5)'; alert('Energy Drink Used - 30 Credits - Power Hit!'); }
    if (name === 'football') { obj.style.transform = 'translateX(70px) translateY(-50px) scale(1.3)'; alert('Power Shot Used - 30 Credits - Goal!'); }
    if (name === 'pingpong') { obj.style.transform = 'translateX(-60px) translateY(-50px) rotate(30deg)'; alert('Super Spin Used - 30 Credits - Fast Spin!'); }
    if (name === 'boxing') { obj.style.transform = 'scale(1.8)'; alert('Power Punch Used - 30 Credits - Knockout Punch!'); }
    setTimeout(() => { if (obj) obj.style.transform = 'translate(0) rotate(0) scale(1)'; }, 400);
  }
  const msg = document.getElementById('msg-' + name);
  if (msg) msg.innerText = 'Power Used - Score ' + scores[name] + ' - Keep Playing!';
}

function openShop(game) { alert(game + ' Shop - 2 Free - Next With Credits - Step 1 Free'); }

function doRegister() {
  alert('Button Clicked!');
  const email = document.getElementById('regEmail').value;
  const password = document.getElementById('regPassword').value;
  if (!email || !password) { alert('Email and Password Required'); return; }
  if (!isStrongPassword(password)) { alert('Password Must Be 8 to 12 Characters - Include 1 Letter and 1 Number - Keep ID Safe'); return; }
  const myCode = 'HpL' + Date.now().toString().slice(-6);
  const myLink = 'https://hpl-website.vercel.app/?ref=' + myCode;
  document.getElementById('refLink').value = myLink;
  token = 'test-token';
  alert('Account Created - USD Only - 2 Motors Free - Referral Code: ' + myCode);
}

function doLogin() {
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;
  if (!email || !password) { alert('Email and Password Required'); return; }
  if (!isStrongPassword(password)) { alert('Password Must Be 8 to 12 Characters - Include 1 Letter and 1 Number'); return; }
  token = 'test-token';
  alert('Login OK - USD Only - Welcome ' + email);
}

function doDeposit() { alert('Deposit With Paddle - Card / 【entity-PayPal¦canonical_name=PayPal】 - Minimum $10'); }
function doWithdraw() { alert('Withdraw Request Sent To Admin'); }
function buyCredits(a) { alert('Buy ' + a + ' Credits'); }
function copyReferral() {
  const link = document.getElementById('refLink').value;
  if (!link) { alert('First Create Account'); return; }
  alert('Referral Link Copied: ' + link);
}

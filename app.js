// HpL - Tiny App - Fixed - Strong Password + Eye - USD Only
let currentFee = 10;
let token = '';

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

function openGame(name) {
  if (!token) { alert('Please Login First'); return; }
  alert(name + ' Joined - Fee $' + currentFee);
}

function openShop(game) { alert(game + ' Shop - 2 Free'); }

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

function doDeposit() { alert('Deposit With Paddle - Card / PayPal - Minimum $10'); }
function doWithdraw() { alert('Withdraw Request Sent To Admin'); }
function buyCredits(a) { alert('Buy ' + a + ' Credits'); }
function copyReferral() {
  const link = document.getElementById('refLink').value;
  if (!link) { alert('First Create Account'); return; }
  alert('Referral Link Copied: ' + link);
}

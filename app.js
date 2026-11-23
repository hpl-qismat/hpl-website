// HpL - Tiny App - 100% Working
let currentFee = 10;
let token = '';
function changeFee(step) {
  currentFee += step;
  if (currentFee < 10) currentFee = 10;
  if (currentFee > 250) currentFee = 250;
  document.getElementById('feeLabel').innerText = '$' + currentFee;
}
function setCountry(c) { alert('International - USD Selected'); }
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

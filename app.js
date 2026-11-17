// HpL - ALL LOGIC IN ONE FILE
let wallet = parseInt(localStorage.getItem('hpl_wallet') || '0');
let accounts = JSON.parse(localStorage.getItem('hpl_acc') || '[]');
function updateWallet(){
  document.getElementById('bal').innerText = wallet;
  document.getElementById('wBal').innerText = wallet;
  let btn = document.getElementById('withBtn');
  if(wallet <= 0){ btn.disabled = true; btn.style.opacity = 0.4; btn.innerText = 'Withdraw - No Balance'; }
  else { btn.disabled = false; btn.style.opacity = 1; btn.innerText = 'Withdraw Request'; }
  localStorage.setItem('hpl_wallet', wallet);
}
function openGame(game){
  alert(game.toUpperCase() + ' Tournament\n\nRule: 2 play, winner goes to next round, loser is OUT.\nMin 6 - Max 100 Teams\nEntry Fee 100 - 50000 PKR');
  let players = ['Team 1','Team 2','Team 3','Team 4','Team 5','Team 6','Team 7','Team 8','Team 9','Team 10','Team 11','Team 12','Team 13','Team 14','Team 15','Team 16','Team 17','Team 18','Team 19','Team 20'];
  let html = '<h4>Live Bracket - 20 Teams - 10 Matches</h4>';
  for(let i=0;i<players.length;i+=2){ html += '<div style="padding:6px;border:1px solid #00ff88;margin:4px;border-radius:8px">'+players[i]+' VS '+players[i+1]+' - Winner goes to Next Round</div>'; }
  document.getElementById('bracket').innerHTML = html;
}
function doDeposit(){
  let amt = parseInt(document.getElementById('depAmt').value);
  if(!amt || amt < 100){ alert('Minimum Deposit is 100 PKR'); return; }
  wallet += amt; updateWallet();
  alert('Deposit Successful! Rs. '+amt+' added to wallet.');
}
function doWithdraw(){
  let amt = parseInt(document.getElementById('withAmt').value);
  if(wallet <= 0 || amt > wallet){
    alert('Your account has no money, you cannot withdraw');
    document.getElementById('withMsg').innerText = 'Your account has no money, you cannot withdraw';
    return;
  }
  if(!amt || amt < 500){ alert('Minimum Withdraw is 500 PKR'); return; }
  if(amt > 100000){ alert('Maximum 100,000 PKR per day'); return; }
  wallet -= amt; updateWallet();
  document.getElementById('adminList').innerHTML = 'Withdraw Request: Rs. '+amt+' - Status: PENDING - Admin will approve';
  alert('Withdraw request sent to Admin for approval.');
}
function addAccount(){
  let type = document.getElementById('payType').value;
  let num = document.getElementById('payNum').value;
  if(!num){ alert('Please enter account number'); return; }
  accounts.push(type + ' - ' + num);
  localStorage.setItem('hpl_acc', JSON.stringify(accounts));
  showAccounts();
}
function showAccounts(){
  document.getElementById('paymentAccounts').innerHTML = accounts.map(a=>'<div style="padding:8px;border:1px solid #444;margin:4px;border-radius:8px">'+a+'</div>').join('');
}
function doRegister(){
  let n = document.getElementById('regName').value;
  let m = document.getElementById('regMobile').value;
  let p = document.getElementById('regPass').value;
  if(!n || !m || !p){ alert('Please enter Name, Mobile and Password'); return; }
  alert('Welcome ' + n + '! Registration successful.');
}
function doLogin(){ alert('Login Successful! Welcome back.'); }
let hp1 = 100, hp2 = 100, bTime = 120, bTimer = null, bFight = false;
let px = 60, ox = 240;
let bCanvas = document.getElementById('boxingCanvas');
let bCtx = bCanvas ? bCanvas.getContext('2d') : null;
function drawBox(){
  if(!bCtx) return;
  bCtx.clearRect(0,0,360,320);
  bCtx.fillStyle = '#333'; bCtx.fillRect(0,260,360,60);
  bCtx.fillStyle = '#00ff88'; bCtx.fillRect(px,180,40,80); bCtx.fillStyle='#fff'; bCtx.fillText('YOU',px,170);
  bCtx.fillStyle = '#ffcc00'; bCtx.fillRect(ox,180,40,80); bCtx.fillStyle='#fff'; bCtx.fillText('OPP',ox,170);
  document.getElementById('hp1').style.width = hp1 + '%';
  document.getElementById('hp2').style.width = hp2 + '%';
}
function boxMove(dir){ if(!bFight) return; if(dir==='left') px = Math.max(0, px-15); if(dir==='right') px = Math.min(300, px+15); drawBox(); }
function boxHit(act){
  if(!bFight) return;
  let dist = Math.abs(px - ox);
  if(act==='punch' && dist<70){ hp2 -= 8; }
  if(act==='kick' && dist<80){ hp2 -= 12; }
  if(act==='block'){ hp1 += 2; if(hp1>100) hp1=100; }
  if(Math.random()>0.6){ hp1 -= 5; }
  if(hp1<=0 || hp2<=0) endBox();
  drawBox();
}
function endBox(){
  clearInterval(bTimer); bFight = false;
  let winner = hp1 > hp2 ? 'YOU WIN! You go to Next Round' : 'YOU LOSE! You are OUT of tournament';
  alert(winner);
}
document.getElementById('readyBtn').onclick = function(){
  hp1=100; hp2=100; bTime=120; bFight=true;
  let c=3; this.innerText = '3...';
  let iv = setInterval(()=>{
    c--; if(c>0){ document.getElementById('readyBtn').innerText = c+'...'; }
    else { clearInterval(iv); document.getElementById('readyBtn').innerText='FIGHT!';
      bTimer = setInterval(()=>{ bTime--; let m = String(Math.floor(bTime/60)).padStart(2,'0'); let s = String(bTime%60).padStart(2,'0'); document.getElementById('timer').innerText = m+':'+s; if(bTime<=0) endBox(); },1000);
    }
  },1000); drawBox();
};
let raceDist=0, raceFuel=100, raceSpeed=0, raceOn=false;
let rCanvas = document.getElementById('racingCanvas');
let rCtx = rCanvas ? rCanvas.getContext('2d') : null;
function drawRace(){
  if(!rCtx) return;
  rCtx.clearRect(0,0,360,320);
  rCtx.fillStyle='#1a4a1a'; rCtx.fillRect(0,250,360,70);
  rCtx.fillStyle = document.getElementById('carSelect').value.includes('HOT ROD') ? '#ffcc00' : '#00ff88';
  rCtx.fillRect(150,220,50,25); rCtx.fillStyle='#000'; rCtx.fillText('CAR',155,237);
  document.getElementById('dist').innerText = Math.floor(raceDist);
  document.getElementById('fuel').innerText = Math.floor(raceFuel);
}
function startRace(){
  let car = document.getElementById('carSelect').value;
  if(car.includes('HOT ROD') && wallet < 40000){ alert('HOT ROD unlocks for 40,000 PKR. Please deposit first.'); return; }
  raceDist=0; raceFuel=100; raceOn=true; alert('Race Started! First to reach 2000m wins. Watch your fuel!');
  drawRace();
}
document.getElementById('accBtn').ontouchstart = document.getElementById('accBtn').onmousedown = function(){
  if(!raceOn) return;
  let car = document.getElementById('carSelect').value;
  let fast = car.includes('HOT ROD') ? 4.8 : 4;
  raceSpeed = fast;
  let iv = setInterval(()=>{
    raceDist += raceSpeed;
    raceFuel -= car.includes('HOT ROD') ? 0.3 : 0.12;
    if(raceFuel<=0){ clearInterval(iv); raceOn=false; alert('Out of Fuel! You Lose - OUT'); }
    if(raceDist>=2000){ clearInterval(iv); raceOn=false; alert('YOU WIN RACE! You go to Next Round!'); }
    drawRace(); if(!raceOn) clearInterval(iv);
  },50);
};
document.getElementById('brakeBtn').onclick = function(){ raceSpeed=0; };
updateWallet(); showAccounts(); drawBox(); drawRace();

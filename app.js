// Signup me Country select karo
// HTML me ye 2 button lagao:
// <button onclick="setCountry('PK')">🇵🇰 Pakistan - PKR Me Khelunga</button>
// <button onclick="setCountry('INTL')">🌍 Other Country - Dollar Me Khelunga</button>

let selectedCountry = 'PK';
function setCountry(c) {
  selectedCountry = c;
  // Jo select hoga, uska rang badal jayega
}

// Register karte waqt country bhi bhejo
async function register() {
  const name = document.getElementById('name').value;
  const phone = document.getElementById('phone').value;
  const password = document.getElementById('password').value;
  const res = await fetch('/api/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, phone, password, country: selectedCountry })
  });
  const data = await res.json();
  alert(data.message);
}

// Tournament list me sirf apni currency wale dikhenge
// Backend khud filter karke bhejega, frontend ko kuch nahi karna
async function loadTournaments() {
  const token = localStorage.getItem('token');
  const res = await fetch('/api/tournaments', {
    headers: { 'Authorization': 'Bearer ' + token }
  });
  const list = await res.json();
  // list me sirf PKR wale ya sirf USD wale honge, doosre nahi honge
  console.log(list);
}

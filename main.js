const SUPABASE_URL = 'https://ojrvfktkqxrvejqbqezh.supabase.co';
const SUPABASE_KEY = 'sb_publishable_oHZcWDIjDvIFeaiQcmUTgQ_iYJUkWvo'; // clé publique, sans danger : les visiteurs ne peuvent qu'envoyer
const form = document.getElementById('form'), status = document.getElementById('status');

document.querySelectorAll('[data-produit]').forEach(b => b.addEventListener('click', () => {
  form.produit.value = b.dataset.produit; form.type.value = 'Commande';
  document.getElementById('contact').scrollIntoView({behavior: matchMedia('(prefers-reduced-motion:reduce)').matches ? 'auto' : 'smooth'});
  form.nom.focus({preventScroll: true});
}));

const show = (cls, txt) => { status.className = cls; status.textContent = txt; };

form.addEventListener('submit', async e => {
  e.preventDefault();
  const f = Object.fromEntries(new FormData(form));
  if (f.website) return show('ok', 'Message envoyé. Nous vous rappelons vite.'); // piège anti-robots
  const nom = f.nom.trim(), tel = f.tel.trim(), message = f.message.trim();
  if (!nom || !tel || !message) return show('err', 'Remplissez le nom, le téléphone et le message.');
  if (!/^\+?[0-9 ]{8,18}$/.test(tel)) return show('err', 'Numéro de téléphone invalide.');
  show('', 'Envoi en cours…');
  try {
    const r = await fetch(SUPABASE_URL + '/rest/v1/demandes', {
      method: 'POST',
      headers: {'Content-Type': 'application/json', apikey: SUPABASE_KEY, Prefer: 'return=minimal'},
      body: JSON.stringify({nom, tel, message, type: f.type,
        email: f.email.trim() || null, produit: f.produit.trim() || null})
    });
    if (!r.ok) throw new Error();
    form.reset(); show('ok', 'Message envoyé. Nous vous rappelons vite.');
  } catch { show('err', 'Envoi impossible. Appelez-nous au 01 51 25 23 72.'); }
});

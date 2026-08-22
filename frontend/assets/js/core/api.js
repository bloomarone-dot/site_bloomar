/**
 * BL∞MAR ONE — Client API
 * Les formulaires ouvrent WhatsApp directement (sans dépendre du backend).
 * L'API backend est tentée en arrière-plan quand elle est disponible.
 */

const API_BASE =
  document.querySelector('meta[name="api-base"]')?.content?.trim() ||
  window.location.origin;

const BLOOMAR_WHATSAPP = '237652209175';

function buildWhatsAppAuditMessage({ nom, entreprise, telephone, besoin }) {
  const isEn = typeof getLang === 'function' && getLang() === 'en';
  if (isEn) {
    return (
      `Hello BL∞MAR ONE,\n\nI would like a free audit.\n\n` +
      `Name: ${nom}\nCompany: ${entreprise}\nPhone: ${telephone}\nNeed: ${besoin}`
    );
  }
  return (
    `Bonjour BL∞MAR ONE,\n\nJe souhaite un audit gratuit.\n\n` +
    `Nom : ${nom}\nEntreprise : ${entreprise}\nTéléphone : ${telephone}\nBesoin : ${besoin}`
  );
}

function buildWhatsAppCaptureMessage({ nom, structure, phone1, phone2, email, contexte }) {
  const isEn = typeof getLang === 'function' && getLang() === 'en';
  const ctx = contexte || 'demande';
  if (isEn) {
    return (
      `Hello BL∞MAR ONE,\n\nNew request (${ctx}).\n\n` +
      `Name: ${nom}\nCompany: ${structure}\nPhone 1: ${phone1}\nPhone 2: ${phone2 || '—'}\nEmail: ${email}`
    );
  }
  return (
    `Bonjour BL∞MAR ONE,\n\nNouvelle demande (${ctx}).\n\n` +
    `Nom : ${nom}\nStructure : ${structure}\nTéléphone 1 : ${phone1}\nTéléphone 2 : ${phone2 || '—'}\nEmail : ${email}`
  );
}

function buildWhatsAppDeveloperMessage({ nom, email, phone1, phone2 }) {
  return (
    `Bonjour BL∞MAR ONE,\n\nDemande d'accès Espace Développeurs (API Sandbox).\n\n` +
    `Nom : ${nom}\nEmail : ${email}\nTéléphone 1 : ${phone1}\nTéléphone 2 : ${phone2 || '—'}`
  );
}

function openWhatsAppWithMessage(text) {
  const url = `https://wa.me/${BLOOMAR_WHATSAPP}?text=${encodeURIComponent(text)}`;
  window.open(url, '_blank', 'noopener,noreferrer');
}

async function parseApiResponse(res) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const detail = Array.isArray(data.detail)
      ? data.detail.map((d) => d.msg).join(', ')
      : (data.detail || data.message);
    throw new Error(detail || `Erreur serveur (${res.status})`);
  }
  return data;
}

function trackAnalyticsEvent(name, params) {
  if (window.BloomarAnalytics && typeof window.BloomarAnalytics.trackEvent === 'function') {
    window.BloomarAnalytics.trackEvent(name, params);
  }
}

async function postJsonQuietly(url, body) {
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (res.ok) return await res.json().catch(() => ({}));
  } catch (err) {
    console.warn('[API] Background sync skipped:', err.message || err);
  }
  return null;
}

async function handleLeadSubmit(e) {
  e.preventDefault();

  const nom = document.getElementById('lead-name').value.trim();
  const entreprise = document.getElementById('lead-company').value.trim();
  const telephone = document.getElementById('lead-phone').value.trim();
  const besoinEl = document.getElementById('lead-sector');
  const besoin = besoinEl.options[besoinEl.selectedIndex]?.text?.trim() || besoinEl.value;

  const waMessage = buildWhatsAppAuditMessage({ nom, entreprise, telephone, besoin });

  const ev = window.BloomarAnalytics && window.BloomarAnalytics.EVENTS;
  trackAnalyticsEvent((ev && ev.FORM_SUBMIT) || 'form_submit', {
    event_category: 'form',
    form_name: 'contact_lead',
    form_destination: 'whatsapp',
  });
  trackAnalyticsEvent((ev && ev.QUOTE_REQUEST) || 'quote_request', {
    event_category: 'lead',
    source: 'contact_form',
    need: besoin,
  });

  showToast(
    typeof t === 'function' ? t('contact.whatsappNext') : 'Demande prête. Envoyez le message WhatsApp pour finaliser.'
  );

  document.getElementById('lead-name').value = '';
  document.getElementById('lead-company').value = '';
  document.getElementById('lead-phone').value = '';

  setTimeout(() => openWhatsAppWithMessage(waMessage), 600);

  postJsonQuietly(`${API_BASE}/api/lead`, { nom, entreprise, telephone, besoin });
}

async function handleUniversalCaptureSubmit(e) {
  e.preventDefault();

  const nom = document.getElementById('cap-name').value.trim();
  const structure = document.getElementById('cap-structure').value.trim();
  const phone1 = document.getElementById('cap-phone1')?.value.trim() || '';
  const phone2 = document.getElementById('cap-phone2')?.value.trim() || '';
  const email = document.getElementById('cap-email')?.value.trim() || '';

  const waMessage = buildWhatsAppCaptureMessage({
    nom,
    structure,
    phone1,
    phone2,
    email,
    contexte: currentDownloadContext,
  });

  closeUniversalCaptureModal();

  const ev = window.BloomarAnalytics && window.BloomarAnalytics.EVENTS;
  trackAnalyticsEvent((ev && ev.FORM_SUBMIT) || 'form_submit', {
    event_category: 'form',
    form_name: 'universal_capture',
    form_context: currentDownloadContext,
  });

  showToast(
    typeof t === 'function' ? t('contact.whatsappNext') : 'Demande prête. Envoyez le message WhatsApp pour finaliser.'
  );

  setTimeout(() => openWhatsAppWithMessage(waMessage), 600);

  postJsonQuietly(`${API_BASE}/api/capture`, {
    nom,
    structure,
    telephone: phone1,
    telephone2: phone2,
    email,
    contexte: currentDownloadContext,
  });
}

async function handleDevLeadSubmit(e) {
  e.preventDefault();

  const nom = document.getElementById('dev-name').value.trim();
  const email = document.getElementById('dev-email').value.trim();
  const phone1 = document.getElementById('dev-phone1')?.value.trim() || '';
  const phone2 = document.getElementById('dev-phone2')?.value.trim() || '';

  const waMessage = buildWhatsAppDeveloperMessage({ nom, email, phone1, phone2 });

  closeDeveloperModal();

  const ev = window.BloomarAnalytics && window.BloomarAnalytics.EVENTS;
  trackAnalyticsEvent((ev && ev.FORM_SUBMIT) || 'form_submit', {
    event_category: 'form',
    form_name: 'developer_sandbox',
  });

  showToast('Demande développeur prête. Envoyez le message WhatsApp pour finaliser.');
  setTimeout(() => openWhatsAppWithMessage(waMessage), 600);

  postJsonQuietly(`${API_BASE}/api/developpeur`, { nom, email, telephone: phone1, telephone2: phone2 });
}

window.handleLeadSubmit = handleLeadSubmit;
window.handleUniversalCaptureSubmit = handleUniversalCaptureSubmit;
window.handleDevLeadSubmit = handleDevLeadSubmit;
window.openWhatsAppWithMessage = openWhatsAppWithMessage;

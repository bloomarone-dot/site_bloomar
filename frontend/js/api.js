/**
 * BL∞MAR ONE — Client API
 * Connecte les formulaires au backend Python (FastAPI).
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

async function handleLeadSubmit(e) {
  e.preventDefault();

  const nom = document.getElementById('lead-name').value.trim();
  const entreprise = document.getElementById('lead-company').value.trim();
  const telephone = document.getElementById('lead-phone').value.trim();
  const besoin = document.getElementById('lead-sector').value;

  try {
    const res = await fetch(`${API_BASE}/api/lead`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nom, entreprise, telephone, besoin }),
    });

    const data = await parseApiResponse(res);

    if (data.success) {
      showToast(
        typeof t === 'function' ? t('contact.whatsappNext') : 'Demande enregistrée. Envoyez le message WhatsApp pour finaliser.'
      );
      document.getElementById('lead-name').value = '';
      document.getElementById('lead-company').value = '';
      document.getElementById('lead-phone').value = '';
      setTimeout(() => {
        openWhatsAppWithMessage(buildWhatsAppAuditMessage({ nom, entreprise, telephone, besoin }));
      }, 800);
    } else {
      showToast('Erreur : ' + data.message);
    }
  } catch (err) {
    showToast(typeof t === 'function' ? t('toast.serverError') : 'Impossible de contacter le serveur. Réessayez.');
    console.error('[API] handleLeadSubmit :', err);
  }
}

async function handleUniversalCaptureSubmit(e) {
  e.preventDefault();

  const nom = document.getElementById('cap-name').value.trim();
  const structure = document.getElementById('cap-structure').value.trim();
  const telephone = document.getElementById('cap-phone')
    ? document.getElementById('cap-phone').value.trim()
    : '';

  try {
    const res = await fetch(`${API_BASE}/api/capture`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nom,
        structure,
        telephone,
        contexte: currentDownloadContext,
      }),
    });

    const data = await parseApiResponse(res);

    closeUniversalCaptureModal();
    showToast(data.message);

    if (data.redirect) {
      setTimeout(() => window.open(data.redirect, '_blank'), 2000);
    } else if (data.success) {
      showToast(`${typeof t === 'function' ? t('toast.download') : 'Téléchargement initialisé pour :'} ${structure}.`);
    }
  } catch (err) {
    showToast(typeof t === 'function' ? t('toast.serverError') : 'Impossible de contacter le serveur. Réessayez.');
    console.error('[API] handleUniversalCaptureSubmit :', err);
  }
}

async function handleDevLeadSubmit(e) {
  e.preventDefault();

  const nom = document.getElementById('dev-name').value.trim();
  const email = document.getElementById('dev-email').value.trim();

  try {
    const res = await fetch(`${API_BASE}/api/developpeur`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nom, email }),
    });

    const data = await parseApiResponse(res);
    closeDeveloperModal();
    showToast(data.message);
  } catch (err) {
    showToast(typeof t === 'function' ? t('toast.serverError') : 'Impossible de contacter le serveur. Réessayez.');
    console.error('[API] handleDevLeadSubmit :', err);
  }
}

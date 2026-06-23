/**
 * Innov8Hub — Cookie Consent
 * Self-contained banner + preferences modal. Injects its own markup/styles
 * so only a single <script> tag is needed per page.
 *
 * Storage: localStorage['innov8hub_cookie_consent']
 *   { essential: true, analytics: bool, marketing: bool, timestamp: ISOString, version: 1 }
 *
 * Public API:
 *   window.cookieConsent.get()              -> stored consent object or null
 *   window.cookieConsent.hasConsent(cat)     -> boolean ('essential'|'analytics'|'marketing')
 *   window.cookieConsent.openSettings()      -> opens the preferences modal
 */
(function () {
  var STORAGE_KEY = 'innov8hub_cookie_consent';
  var VERSION = 1;

  function getConsent() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      var parsed = JSON.parse(raw);
      return parsed && parsed.version === VERSION ? parsed : null;
    } catch (e) { return null; }
  }

  function saveConsent(analytics, marketing) {
    var consent = {
      essential: true,
      analytics: !!analytics,
      marketing: !!marketing,
      timestamp: new Date().toISOString(),
      version: VERSION,
    };
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(consent)); } catch (e) {}
    return consent;
  }

  function hasConsent(category) {
    if (category === 'essential') return true;
    var c = getConsent();
    return !!(c && c[category]);
  }

  // ── Styles ──────────────────────────────────────────────────────────────
  var css = ''
    + '#cc-banner{position:fixed;left:0;right:0;bottom:0;z-index:99998;background:#fff;'
    + 'border-top:1px solid var(--border,rgba(0,100,160,.12));box-shadow:var(--shadow-lg,0 16px 40px rgba(10,26,46,.13));'
    + 'padding:1.25rem 1.5rem;display:flex;flex-wrap:wrap;align-items:center;gap:1rem;font-family:var(--font-main,Inter,sans-serif);}'
    + '#cc-banner p{margin:0;flex:1 1 320px;font-size:0.9rem;color:var(--text-main,#0F2240);line-height:1.5;}'
    + '#cc-banner a{color:var(--teal,#00A8BB);font-weight:600;text-decoration:underline;}'
    + '#cc-banner-actions{display:flex;gap:0.6rem;flex-wrap:wrap;flex-shrink:0;}'
    + '.cc-btn{border-radius:8px;padding:0.6rem 1.1rem;font-size:0.85rem;font-weight:600;cursor:pointer;white-space:nowrap;border:1px solid transparent;font-family:inherit;}'
    + '.cc-btn-primary{background:var(--primary,#0A1A2E);color:#fff;}'
    + '.cc-btn-outline{background:#fff;color:var(--text-main,#0F2240);border-color:var(--border,rgba(0,100,160,.25));}'
    + '.cc-btn-text{background:none;color:var(--teal,#00A8BB);text-decoration:underline;padding:0.6rem 0.4rem;}'
    + '#cc-modal-overlay{position:fixed;inset:0;background:rgba(10,26,46,.55);z-index:99999;display:flex;align-items:center;justify-content:center;padding:1rem;}'
    + '#cc-modal{background:#fff;border-radius:var(--radius,12px);max-width:480px;width:100%;max-height:90vh;overflow-y:auto;padding:2rem;font-family:var(--font-main,Inter,sans-serif);box-shadow:var(--shadow-lg,0 16px 40px rgba(10,26,46,.13));}'
    + '#cc-modal h2{font-size:1.3rem;margin:0 0 0.5rem;color:var(--text-main,#0F2240);}'
    + '#cc-modal>p{font-size:0.875rem;color:var(--text-light,#4A6880);margin:0 0 1.25rem;line-height:1.55;}'
    + '.cc-row{display:flex;align-items:flex-start;justify-content:space-between;gap:1rem;padding:0.9rem 0;border-bottom:1px solid var(--border,rgba(0,100,160,.12));}'
    + '.cc-row:last-of-type{border-bottom:none;}'
    + '.cc-row-text strong{display:block;font-size:0.9rem;color:var(--text-main,#0F2240);margin-bottom:0.2rem;}'
    + '.cc-row-text span{font-size:0.8rem;color:var(--text-light,#4A6880);line-height:1.4;}'
    + '.cc-switch{position:relative;width:44px;height:24px;flex-shrink:0;}'
    + '.cc-switch input{opacity:0;width:0;height:0;}'
    + '.cc-slider{position:absolute;inset:0;background:var(--border,#d6e4ee);border-radius:24px;cursor:pointer;transition:background .2s;}'
    + '.cc-slider::before{content:"";position:absolute;width:18px;height:18px;left:3px;top:3px;background:#fff;border-radius:50%;transition:transform .2s;box-shadow:0 1px 3px rgba(0,0,0,.25);}'
    + '.cc-switch input:checked+.cc-slider{background:var(--teal,#00A8BB);}'
    + '.cc-switch input:checked+.cc-slider::before{transform:translateX(20px);}'
    + '.cc-switch input:disabled+.cc-slider{opacity:0.6;cursor:not-allowed;}'
    + '#cc-modal-actions{display:flex;gap:0.6rem;margin-top:1.5rem;flex-wrap:wrap;}'
    + '#cc-modal-actions .cc-btn{flex:1 1 auto;text-align:center;}'
    + '#cc-modal-close{position:absolute;top:1rem;right:1.25rem;background:none;border:none;font-size:1.4rem;color:var(--text-light,#4A6880);cursor:pointer;line-height:1;}'
    + '@media (max-width:640px){#cc-banner{flex-direction:column;align-items:stretch;text-align:left;}#cc-banner-actions{width:100%;}.cc-btn{flex:1 1 0;}}';

  var styleTag = document.createElement('style');
  styleTag.textContent = css;
  document.head.appendChild(styleTag);

  // ── Banner markup ───────────────────────────────────────────────────────
  var bannerHtml = ''
    + '<div id="cc-banner" role="region" aria-label="Cookie consent">'
    + '  <p>We use essential cookies to keep this site running. With your OK, we\'d also like to use analytics and marketing cookies to understand how the site is used. '
    + '  <a href="privacy.html#cookies">Read our Privacy Policy</a>.</p>'
    + '  <div id="cc-banner-actions">'
    + '    <button type="button" class="cc-btn cc-btn-text" id="cc-manage">Manage Preferences</button>'
    + '    <button type="button" class="cc-btn cc-btn-outline" id="cc-essential-only">Essential Only</button>'
    + '    <button type="button" class="cc-btn cc-btn-primary" id="cc-accept-all">Accept All</button>'
    + '  </div>'
    + '</div>';

  var modalHtml = ''
    + '<div id="cc-modal-overlay" style="display:none;">'
    + '  <div id="cc-modal" role="dialog" aria-modal="true" aria-labelledby="cc-modal-title">'
    + '    <button type="button" id="cc-modal-close" aria-label="Close">&times;</button>'
    + '    <h2 id="cc-modal-title">Cookie preferences</h2>'
    + '    <p>Choose which cookies we can use. You can change this at any time from the "Cookie Settings" link in the footer.</p>'
    + '    <div class="cc-row">'
    + '      <div class="cc-row-text"><strong>Essential</strong><span>Required for the site to work. Always on.</span></div>'
    + '      <label class="cc-switch"><input type="checkbox" checked disabled><span class="cc-slider"></span></label>'
    + '    </div>'
    + '    <div class="cc-row">'
    + '      <div class="cc-row-text"><strong>Analytics</strong><span>Helps us understand how visitors use the site.</span></div>'
    + '      <label class="cc-switch"><input type="checkbox" id="cc-toggle-analytics"><span class="cc-slider"></span></label>'
    + '    </div>'
    + '    <div class="cc-row">'
    + '      <div class="cc-row-text"><strong>Marketing</strong><span>Used for marketing and retargeting purposes.</span></div>'
    + '      <label class="cc-switch"><input type="checkbox" id="cc-toggle-marketing"><span class="cc-slider"></span></label>'
    + '    </div>'
    + '    <div id="cc-modal-actions">'
    + '      <button type="button" class="cc-btn cc-btn-outline" id="cc-save-prefs">Save Preferences</button>'
    + '      <button type="button" class="cc-btn cc-btn-primary" id="cc-modal-accept-all">Accept All</button>'
    + '    </div>'
    + '  </div>'
    + '</div>';

  var openModalRef = null;

  function mount() {
    var wrap = document.createElement('div');
    wrap.innerHTML = bannerHtml + modalHtml;
    document.body.appendChild(wrap);

    var banner       = document.getElementById('cc-banner');
    var overlay       = document.getElementById('cc-modal-overlay');
    var toggleAnalytics = document.getElementById('cc-toggle-analytics');
    var toggleMarketing = document.getElementById('cc-toggle-marketing');

    function showBanner() { if (banner) banner.style.display = 'flex'; }
    function hideBanner() { if (banner) banner.style.display = 'none'; }

    function openModal() {
      var c = getConsent();
      toggleAnalytics.checked = !!(c && c.analytics);
      toggleMarketing.checked = !!(c && c.marketing);
      overlay.style.display = 'flex';
    }
    function closeModal() { overlay.style.display = 'none'; }

    openModalRef = openModal;

    document.getElementById('cc-accept-all').addEventListener('click', function () {
      saveConsent(true, true);
      hideBanner();
    });
    document.getElementById('cc-essential-only').addEventListener('click', function () {
      saveConsent(false, false);
      hideBanner();
    });
    document.getElementById('cc-manage').addEventListener('click', openModal);
    document.getElementById('cc-modal-close').addEventListener('click', closeModal);
    document.getElementById('cc-save-prefs').addEventListener('click', function () {
      saveConsent(toggleAnalytics.checked, toggleMarketing.checked);
      closeModal();
      hideBanner();
    });
    document.getElementById('cc-modal-accept-all').addEventListener('click', function () {
      saveConsent(true, true);
      closeModal();
      hideBanner();
    });
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) closeModal();
    });

    // Show banner only if no decision has been recorded yet
    if (!getConsent()) showBanner();

    // Wire up any "Cookie Settings" links already on the page (e.g. footer)
    document.querySelectorAll('[data-cookie-settings]').forEach(function (el) {
      el.addEventListener('click', function (e) {
        e.preventDefault();
        openModal();
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }

  window.cookieConsent = {
    get: getConsent,
    hasConsent: hasConsent,
    openSettings: function () { if (openModalRef) openModalRef(); },
  };
})();

(function() {
  var footerHTML =
    '<footer class="footer">' +
    '  <div class="footer-content">' +
    '    <div style="margin-bottom: var(--space-lg);">' +
    '      <div style="margin-bottom: var(--space-md);">' +
    '        <h4 style="font-size: 0.875rem; font-weight: 600; margin-bottom: var(--space-xs); color: var(--text); text-align: center; text-transform: uppercase; letter-spacing: 0.05em;">Transparency</h4>' +
    '        <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-wrap: wrap; justify-content: center; gap: var(--space-sm) var(--space-lg);">' +
    '          <li><a href="https://truesight.me/physical-asset-movements" target="_blank" rel="noreferrer noopener" style="color: var(--muted); text-decoration: none; font-size: 0.9375rem;">Shipment History</a></li>' +
    '          <li><a href="https://truesight.me/physical-transactions" target="_blank" rel="noreferrer noopener" style="color: var(--muted); text-decoration: none; font-size: 0.9375rem;">Financial Records</a></li>' +
    '          <li><a href="https://agroverse.shop/consignments" target="_blank" rel="noreferrer noopener" style="color: var(--muted); text-decoration: none; font-size: 0.9375rem;">Consignment Tracking</a></li>' +
    '          <li><a href="https://truesight.me/physical-assets/serialized" target="_blank" rel="noreferrer noopener" style="color: var(--muted); text-decoration: none; font-size: 0.9375rem;">Product Verification</a></li>' +
    '          <li><a href="https://truesight.me/digital-assets" target="_blank" rel="noreferrer noopener" style="color: var(--muted); text-decoration: none; font-size: 0.9375rem;">Token Holdings</a></li>' +
    '        </ul>' +
    '      </div>' +
    '      <div style="margin-bottom: var(--space-md);">' +
    '        <h4 style="font-size: 0.875rem; font-weight: 600; margin-bottom: var(--space-xs); color: var(--text); text-align: center; text-transform: uppercase; letter-spacing: 0.05em;">Governance &amp; Records</h4>' +
    '        <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-wrap: wrap; justify-content: center; gap: var(--space-sm) var(--space-lg);">' +
    '          <li><a href="https://truesight.me/rubric" target="_blank" rel="noreferrer noopener" style="color: var(--muted); text-decoration: none; font-size: 0.9375rem;">Scoring Rubric</a></li>' +
    '          <li><a href="https://truesight.me/submissions/raw-telegram-chatlogs" target="_blank" rel="noreferrer noopener" style="color: var(--muted); text-decoration: none; font-size: 0.9375rem;">Engagement Logs</a></li>' +
    '        </ul>' +
    '      </div>' +
    '      <div style="margin-bottom: var(--space-md);">' +
    '        <h4 style="font-size: 0.875rem; font-weight: 600; margin-bottom: var(--space-xs); color: var(--text); text-align: center; text-transform: uppercase; letter-spacing: 0.05em;">Data &amp; Records</h4>' +
    '        <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-wrap: wrap; justify-content: center; gap: var(--space-sm) var(--space-lg);">' +
    '          <li><a href="https://truesight.me/offchain-assets" target="_blank" rel="noreferrer noopener" style="color: var(--muted); text-decoration: none; font-size: 0.9375rem;">Physical Assets</a></li>' +
    '          <li><a href="https://truesight.me/offchain-asset-location" target="_blank" rel="noreferrer noopener" style="color: var(--muted); text-decoration: none; font-size: 0.9375rem;">Asset Location</a></li>' +
    '          <li><a href="https://truesight.me/digital-signatures" target="_blank" rel="noreferrer noopener" style="color: var(--muted); text-decoration: none; font-size: 0.9375rem;">Digital Signatures</a></li>' +
    '          <li><a href="https://truesight.me/notarizations" target="_blank" rel="noreferrer noopener" style="color: var(--muted); text-decoration: none; font-size: 0.9375rem;">Notarizations</a></li>' +
    '          <li><a href="https://truesight.me/currencies" target="_blank" rel="noreferrer noopener" style="color: var(--muted); text-decoration: none; font-size: 0.9375rem;">Currencies</a></li>' +
    '          <li><a href="https://truesight.me/physical-assets/serialized/sold" target="_blank" rel="noreferrer noopener" style="color: var(--muted); text-decoration: none; font-size: 0.9375rem;">Sold Products</a></li>' +
    '          <li><a href="https://truesight.me/ttl/irs" target="_blank" rel="noreferrer noopener" style="color: var(--muted); text-decoration: none; font-size: 0.9375rem;">Taxation Filings</a></li>' +
    '        </ul>' +
    '      </div>' +
    '      <div>' +
    '        <h4 style="font-size: 0.875rem; font-weight: 600; margin-bottom: var(--space-xs); color: var(--text); text-align: center; text-transform: uppercase; letter-spacing: 0.05em;">Partnerships</h4>' +
    '        <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-wrap: wrap; justify-content: center; gap: var(--space-sm) var(--space-lg);">' +
    '          <li><a href="https://docs.google.com/document/d/1FA_NpmwbnnCuV0m46UlfjbVdQvdF92594xcwUDu3JvI/edit" target="_blank" rel="noreferrer noopener" style="color: var(--muted); text-decoration: none; font-size: 0.9375rem;">Community Warehouse Manager Service Level Agreement</a> <a href="https://raw.githubusercontent.com/TrueSightDAO/ecosystem_change_logs/main/agreements/warehouse-manager-sla.md" target="_blank" rel="noreferrer noopener" title="Plain Markdown mirror for LLMs" style="font-size: 0.75em; opacity: 0.7;">(md)</a></li>' +
    '          <li><a href="https://docs.google.com/document/d/1n3wKmVa-kOjmbVJlfVvskep6rNbOfGGPF1QUTNrUi08/edit" target="_blank" rel="noreferrer noopener" style="color: var(--muted); text-decoration: none; font-size: 0.9375rem;">Agroverse Community Distributors Agreement</a> <a href="https://raw.githubusercontent.com/TrueSightDAO/ecosystem_change_logs/main/agreements/community-distributors-agreement.md" target="_blank" rel="noreferrer noopener" title="Plain Markdown mirror for LLMs" style="font-size: 0.75em; opacity: 0.7;">(md)</a></li>' +
    '        </ul>' +
    '      </div>' +
    '    </div>' +
    '    <h2>JOIN OUR MOVEMENT</h2>' +
    '    <p>Co-Create with us</p>' +
    '    <div class="footer-social">' +
    '      <a href="https://t.me/TrueSightDAO" target="_blank" rel="noreferrer noopener" aria-label="Telegram">' +
    '        <img' +
    '          src="/assets/telegram-icon.jpg"' +
    '          alt="Telegram"' +
    '          width="48"' +
    '          height="48"' +
    '          loading="lazy"' +
    '        />' +
    '      </a>' +
    '      <a href="https://github.com/TrueSightDAO" target="_blank" rel="noreferrer noopener" aria-label="GitHub">' +
    '        <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor">' +
    '          <title>GitHub</title>' +
    '          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>' +
    '        </svg>' +
    '      </a>' +
    '    </div>' +
    '    <p style="margin-top: var(--space-lg); font-size: 0.875rem; color: var(--muted);">' +
    '      TrueSight DAO \u00b7 Transparent impact data available at <a href="/index.html" style="color: var(--accent-2);">truesight.me</a>' +
    '      \u00b7 <a href="/security-dashboard/" style="color: var(--accent-2);">Security Dashboard</a>' +
    '    </p>' +
    '  </div>' +
    '</footer>';

  var placeholder = document.getElementById('site-footer');
  if (placeholder) {
    placeholder.outerHTML = footerHTML;
  } else {
    var temp = document.createElement('div');
    temp.innerHTML = footerHTML;
    document.body.appendChild(temp.firstChild);
  }
})();

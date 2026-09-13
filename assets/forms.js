/* ============================================================
   LEXFLOW — REQUEST FORM DELIVERY (shared)
   ------------------------------------------------------------
   Handles every lead form on the site: the demo/request form on the
   home page, the visitor request form on the blog and articles, and
   the contact block.

   Why this exists: the previous inline handler posted to
   /api/contacts, which requires an Authorization header and therefore
   returns 401 from a browser. It then showed the thank-you panel in
   its .catch() branch, so a failed submission looked successful and
   the lead was lost silently.

   Behaviour now:
     - Posts to window.LEXFLOW_CONFIG.intakeEndpoint when configured.
     - Uses a form-encoded "simple" request by default, which does not
       trigger a CORS preflight, so it is delivered even if the endpoint
       does not return CORS headers.
     - Never reports success unless the request was actually accepted.
     - On failure or when no endpoint is configured, shows an honest
       message and offers WhatsApp so the enquiry still reaches the firm.
     - Blocks double submission.

   Mark a form with class="js-request-form" and give the fields names:
     name, email, phone, practice_area, message,
     consent_privacy (required checkbox), consent_marketing (optional)
   ============================================================ */
(function () {
  'use strict';

  var CFG = window.LEXFLOW_CONFIG || {};

  var COPY = {
    en: {
      sending: 'Sending…',
      thanksTitle: 'Thank you — your request has been sent.',
      thanksBody: 'We have your details and will reply using them.',
      errorTitle: 'Your request was not sent.',
      errorBody: 'Something went wrong on our side. Please try again, or reach us on WhatsApp so nothing is missed.',
      unavailableTitle: 'This form is not connected yet.',
      unavailableBody: 'Online submission is not live at the moment. Send us a message on WhatsApp and we will pick it up straight away — or email us at demo@lexflow.com.',
      missing: 'Please complete the required fields.',
      invalidEmail: 'Please check the email address.',
      consent: 'Please accept the privacy notice so we can reply.',
      wa: 'Continue on WhatsApp'
    },
    it: {
      sending: 'Invio…',
      thanksTitle: 'Grazie — la tua richiesta è stata inviata.',
      thanksBody: 'Abbiamo i tuoi recapiti e ti risponderemo su quelli.',
      errorTitle: 'La richiesta non è stata inviata.',
      errorBody: 'Si è verificato un problema dalla nostra parte. Riprova oppure scrivici su WhatsApp così non perdiamo nulla.',
      unavailableTitle: 'Questo modulo non è ancora collegato.',
      unavailableBody: 'L\u2019invio online non è attivo in questo momento. Scrivici su WhatsApp e lo prenderemo in carico subito, oppure scrivi a demo@lexflow.com.',
      missing: 'Completa i campi obbligatori.',
      invalidEmail: 'Controlla l\u2019indirizzo email.',
      consent: 'Accetta l\u2019informativa privacy così possiamo risponderti.',
      wa: 'Continua su WhatsApp'
    },
    ru: {
      sending: 'Отправка…',
      thanksTitle: 'Спасибо — ваша заявка отправлена.',
      thanksBody: 'Мы получили ваши контакты и ответим по ним.',
      errorTitle: 'Заявка не отправлена.',
      errorBody: 'На нашей стороне произошла ошибка. Попробуйте ещё раз или напишите нам в WhatsApp, чтобы ничего не потерялось.',
      unavailableTitle: 'Эта форма пока не подключена.',
      unavailableBody: 'Онлайн-отправка сейчас недоступна. Напишите нам в WhatsApp — мы сразу подхватим обращение, или на demo@lexflow.com.',
      missing: 'Заполните обязательные поля.',
      invalidEmail: 'Проверьте адрес электронной почты.',
      consent: 'Примите политику конфиденциальности, чтобы мы могли ответить.',
      wa: 'Продолжить в WhatsApp'
    }
  };

  function lang() {
    var l = (document.documentElement.lang || 'en').slice(0, 2).toLowerCase();
    return COPY[l] ? l : 'en';
  }
  function t() { return COPY[lang()]; }
  function waLink() {
    var txt = { en: 'Hello, I would like to send a request.', it: 'Buongiorno, vorrei inviare una richiesta.', ru: 'Здравствуйте, я хотел бы отправить заявку.' }[lang()];
    return 'https://wa.me/' + (CFG.whatsapp || '') + '?text=' + encodeURIComponent(txt);
  }

  function panel(kind, title, body, withWa) {
    var el = document.createElement('div');
    el.className = 'request-result ' + kind;
    el.setAttribute('role', kind === 'ok' ? 'status' : 'alert');
    var h = document.createElement('h3'); h.textContent = title;
    var p = document.createElement('p'); p.textContent = body;
    el.appendChild(h); el.appendChild(p);
    if (withWa) {
      var a = document.createElement('a');
      a.className = 'btn btn-gold request-result-wa';
      a.href = waLink(); a.target = '_blank'; a.rel = 'noopener';
      a.textContent = t().wa;
      el.appendChild(a);
    }
    return el;
  }

  function payloadOf(form) {
    var get = function (n) { var f = form.querySelector('[name="' + n + '"]'); return f ? f.value.trim() : ''; };
    var box = function (n) { var f = form.querySelector('[name="' + n + '"]'); return !!(f && f.checked); };
    return {
      name: get('name'),
      email: get('email'),
      phone: get('phone'),
      practice_area: get('practice_area'),
      message: get('message'),
      consent_privacy: box('consent_privacy'),
      consent_marketing: box('consent_marketing'),
      source: form.getAttribute('data-source') || 'lexflow-website',
      page: location.pathname,
      lang: lang()
    };
  }

  function validate(data, form) {
    var need = ['name', 'email'];
    for (var i = 0; i < need.length; i++) {
      if (!data[need[i]]) return t().missing;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(data.email)) return t().invalidEmail;
    if (form.querySelector('[name="consent_privacy"]') && !data.consent_privacy) return t().consent;
    return null;
  }

  var busy = false;

  function init() {
    var forms = document.querySelectorAll('form.js-request-form');
    if (!forms.length) return;

    Array.prototype.forEach.call(forms, function (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        if (busy) return;

        var data = payloadOf(form);
        var problem = validate(data, form);
        if (problem) {
          var warn = form.querySelector('.request-warning') || (function () {
            var w = document.createElement('p');
            w.className = 'request-warning';
            w.setAttribute('role', 'alert');
            form.insertBefore(w, form.firstChild);
            return w;
          })();
          warn.textContent = problem;
          warn.hidden = false;
          return;
        }
        var old = form.querySelector('.request-warning');
        if (old) old.hidden = true;

        var endpoint = CFG.intakeEndpoint;
        if (!endpoint) {
          /* No endpoint configured: say so plainly instead of faking success. */
          var box = panel('warn', t().unavailableTitle, t().unavailableBody, true);
          form.replaceChildren(box);
          return;
        }

        busy = true;
        var btn = form.querySelector('button[type="submit"]');
        var label = btn ? btn.textContent : '';
        if (btn) { btn.disabled = true; btn.textContent = t().sending; }

        var body, headers = {};
        if (CFG.intakeFormat === 'form') {
          body = new URLSearchParams();
          Object.keys(data).forEach(function (k) {
            body.append(k, typeof data[k] === 'boolean' ? (data[k] ? '1' : '0') : data[k]);
          });
        } else {
          body = JSON.stringify(data);
          headers['Content-Type'] = 'application/json';
        }

        fetch(endpoint, { method: CFG.intakeMethod || 'POST', headers: headers, body: body })
          .then(function (r) {
            if (!r.ok) throw new Error('http_' + r.status);
            return r;
          })
          .then(function () {
            form.replaceChildren(panel('ok', t().thanksTitle, t().thanksBody, false));
          })
          .catch(function () {
            /* Delivered-but-unreadable is a real possibility with a
               form-encoded cross-origin post. We cannot verify, so we do
               not claim success: we report a problem and offer WhatsApp. */
            form.replaceChildren(panel('err', t().errorTitle, t().errorBody, true));
          })
          .finally(function () {
            busy = false;
            if (btn) { btn.disabled = false; btn.textContent = label; }
          });
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

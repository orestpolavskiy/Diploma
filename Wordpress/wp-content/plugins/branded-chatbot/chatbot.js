(function () {
  'use strict';

  // chat widget for the BRANDED store
  // talks to the WP REST proxy — OpenAI key stays server-side

  var ENDPOINT = 'http://diploma.local/wp-json/branded-chatbot/v1/chat';

  var history = [];

  var GREETING = "Hi! I'm the BRANDED assistant. I can help with shipping, " +
                 "returns, payment, and sizing questions. How can I help?";

  var QUICK = [
    'Shipping options',
    'Return policy',
    'Payment methods',
    'Size advice'
  ];

  /* styles */
  var css = [
    '.bchat{position:fixed;right:24px;bottom:24px;z-index:99998;',
      'font-family:inherit;}',

    '.bchat__launcher{width:56px !important;height:56px !important;border-radius:50% !important;',
      'border:0 !important;background:#1a1a1a !important;color:#fff !important;cursor:pointer;',
      'display:flex !important;align-items:center;justify-content:center;',
      'box-shadow:0 4px 16px rgba(0,0,0,.2) !important;padding:0 !important;',
      'min-height:0 !important;transition:transform .15s ease;}',
    '.bchat__launcher:hover{transform:scale(1.05);background:#1a1a1a !important;}',
    '.bchat__launcher svg{width:24px;height:24px;stroke:#fff;',
      'stroke-width:1.8;fill:none;}',
    '.bchat__launcher:focus-visible{outline:2px solid #8b7355;outline-offset:3px;}',

    '.bchat__panel{position:absolute;right:0;bottom:72px;width:360px;',
      'max-width:calc(100vw - 48px);height:520px;max-height:calc(100vh - 120px);',
      'background:#fff;border:1px solid #e5e5e5;border-radius:10px;',
      'box-shadow:0 12px 40px rgba(0,0,0,.18);display:none;flex-direction:column;',
      'overflow:hidden;}',
    '.bchat--open .bchat__panel{display:flex;}',
    '.bchat--open .bchat__launcher{transform:scale(0);opacity:0;}',

    '.bchat__header{background:#1a1a1a;color:#fff;padding:16px 18px;',
      'display:flex;align-items:center;justify-content:space-between;flex-shrink:0;}',
    '.bchat__title{font-size:.95rem;font-weight:600;letter-spacing:.02em;}',
    '.bchat__subtitle{font-size:.72rem;color:#bbb;margin-top:2px;}',
    '.bchat__close{background:0 !important;border:0 !important;color:#fff !important;',
      'cursor:pointer;font-size:1.2rem !important;width:32px !important;height:32px !important;',
      'min-height:0 !important;padding:0 !important;border-radius:50% !important;',
      'box-shadow:none !important;letter-spacing:normal !important;display:flex;',
      'align-items:center;justify-content:center;transition:background .15s ease;}',
    '.bchat__close:hover{background:rgba(255,255,255,.15) !important;color:#fff !important;}',

    '.bchat__body{flex:1;overflow-y:auto;padding:18px;display:flex;',
      'flex-direction:column;gap:12px;background:#fafafa;}',
    '.bchat__msg{max-width:80%;padding:10px 13px;border-radius:12px;',
      'font-size:.88rem;line-height:1.45;white-space:pre-wrap;word-wrap:break-word;}',
    '.bchat__msg--bot{align-self:flex-start;background:#fff;color:#1a1a1a;',
      'border:1px solid #ececec;border-bottom-left-radius:3px;}',
    '.bchat__link{color:#8b7355;text-decoration:underline;word-break:break-all;}',
    '.bchat__link:hover{color:#6f5b40;}',
    '.bchat__msg--user{align-self:flex-end;background:#1a1a1a;color:#fff;',
      'border-bottom-right-radius:3px;}',
    '.bchat__typing{align-self:flex-start;display:flex;gap:4px;padding:12px 14px;',
      'background:#fff;border:1px solid #ececec;border-radius:12px;',
      'border-bottom-left-radius:3px;}',
    '.bchat__dot{width:6px;height:6px;border-radius:50%;background:#bbb;',
      'animation:bchatDot 1.2s infinite ease-in-out;}',
    '.bchat__dot:nth-child(2){animation-delay:.15s;}',
    '.bchat__dot:nth-child(3){animation-delay:.3s;}',
    '@keyframes bchatDot{0%,60%,100%{opacity:.3;}30%{opacity:1;}}',
    '@media(prefers-reduced-motion:reduce){.bchat__dot{animation:none;}}',

    '.bchat__quick{display:flex;flex-wrap:wrap;gap:7px;padding:0 18px 12px;',
      'background:#fafafa;}',
    '.bchat__chip{font-size:.78rem !important;color:#1a1a1a !important;background:#fff !important;',
      'border:1px solid #ddd !important;border-radius:999px !important;padding:7px 13px !important;',
      'cursor:pointer;min-height:0 !important;box-shadow:none !important;',
      'letter-spacing:normal !important;text-transform:none !important;',
      'font-weight:400 !important;font-family:inherit !important;',
      'transition:background .15s ease,border-color .15s ease;}',
    '.bchat__chip:hover{background:#f0ece3 !important;border-color:#c9bca3 !important;color:#1a1a1a !important;}',
    '.bchat__chip:focus-visible{outline:2px solid #8b7355;outline-offset:2px;}',

    '.bchat__form{display:flex;gap:8px;padding:12px;border-top:1px solid #e5e5e5;',
      'background:#fff;flex-shrink:0;}',
    '.bchat__input{flex:1;border:1px solid #ddd !important;border-radius:8px !important;',
      'padding:10px 12px !important;font-family:inherit !important;font-size:.88rem !important;',
      'outline:none;resize:none;max-height:90px;background:#fff !important;color:#1a1a1a !important;',
      'min-height:0 !important;box-shadow:none !important;}',
    '.bchat__input:focus{border-color:#1a1a1a !important;}',
    '.bchat__send{flex-shrink:0;width:42px !important;border:0 !important;border-radius:8px !important;',
      'background:#1a1a1a !important;color:#fff !important;cursor:pointer;min-height:0 !important;',
      'padding:0 !important;box-shadow:none !important;display:flex !important;',
      'align-items:center;justify-content:center;}',
    '.bchat__send svg{width:18px;height:18px;stroke:#fff;',
      'stroke-width:1.8;fill:none;}',
    '.bchat__send:disabled{opacity:.4;cursor:not-allowed;}',
    '.bchat__error{font-size:.78rem;color:#b3261e;align-self:flex-start;}'
  ].join('');

  var styleEl = document.createElement('style');
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  /* DOM */
  var root = document.createElement('div');
  root.className = 'bchat';
  root.innerHTML =
    '<div class="bchat__panel" role="dialog" aria-label="Customer support chat">' +
      '<div class="bchat__header">' +
        '<div>' +
          '<div class="bchat__title">BRANDED Assistant</div>' +
          '<div class="bchat__subtitle">Typically replies instantly</div>' +
        '</div>' +
        '<button class="bchat__close" type="button" aria-label="Close chat">✕</button>' +
      '</div>' +
      '<div class="bchat__body" id="bchat-body"></div>' +
      '<div class="bchat__quick" id="bchat-quick"></div>' +
      '<form class="bchat__form" id="bchat-form">' +
        '<textarea class="bchat__input" id="bchat-input" rows="1" ' +
          'placeholder="Type your message…" aria-label="Type your message"></textarea>' +
        '<button class="bchat__send" type="submit" aria-label="Send message">' +
          '<svg viewBox="0 0 24 24"><path d="M22 2 11 13" stroke-linecap="round" ' +
          'stroke-linejoin="round"/><path d="M22 2 15 22l-4-9-9-4 20-7Z" ' +
          'stroke-linecap="round" stroke-linejoin="round"/></svg>' +
        '</button>' +
      '</form>' +
    '</div>' +
    '<button class="bchat__launcher" type="button" aria-label="Open customer support chat">' +
      '<svg viewBox="0 0 24 24"><path d="M21 11.5a8.38 8.38 0 0 1-8.5 8.5 ' +
      '8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 ' +
      '8.5 8.5 0 0 1 17 0Z" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
    '</button>';
  document.body.appendChild(root);

  var launcher = root.querySelector('.bchat__launcher');
  var closeBtn = root.querySelector('.bchat__close');
  var body     = root.querySelector('#bchat-body');
  var quick    = root.querySelector('#bchat-quick');
  var form     = root.querySelector('#bchat-form');
  var input    = root.querySelector('#bchat-input');
  var sendBtn  = root.querySelector('.bchat__send');

  var greeted = false;

  function scrollDown() { body.scrollTop = body.scrollHeight; }

  function escapeHtml(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;')
                    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  // turn bare URLs into clickable links
  function linkify(text) {
    var safe = escapeHtml(text);
    return safe.replace(/(https?:\/\/[^\s<]+[^\s<.,;:!?)\]])/g, function (url) {
      return '<a href="' + url + '" target="_blank" rel="noopener" ' +
             'class="bchat__link">' + url + '</a>';
    });
  }

  function addMessage(text, who) {
    var el = document.createElement('div');
    el.className = 'bchat__msg bchat__msg--' + who;
    if (who === 'bot') {
      el.innerHTML = linkify(text);
    } else {
      el.textContent = text;
    }
    body.appendChild(el);
    scrollDown();
    return el;
  }

  function showTyping() {
    var t = document.createElement('div');
    t.className = 'bchat__typing';
    t.id = 'bchat-typing';
    t.innerHTML = '<span class="bchat__dot"></span><span class="bchat__dot"></span>' +
                  '<span class="bchat__dot"></span>';
    body.appendChild(t);
    scrollDown();
  }
  function hideTyping() {
    var t = document.getElementById('bchat-typing');
    if (t) t.remove();
  }

  function renderQuick() {
    quick.innerHTML = '';
    QUICK.forEach(function (q) {
      var c = document.createElement('button');
      c.type = 'button';
      c.className = 'bchat__chip';
      c.textContent = q;
      c.addEventListener('click', function () {
        quick.innerHTML = '';
        send(q);
      });
      quick.appendChild(c);
    });
  }

  function greet() {
    if (greeted) return;
    greeted = true;
    addMessage(GREETING, 'bot');
    renderQuick();
  }

  function send(text) {
    text = (text || '').trim();
    if (!text) return;

    addMessage(text, 'user');
    history.push({ role: 'user', content: text });
    input.value = '';
    input.style.height = 'auto';
    sendBtn.disabled = true;
    quick.innerHTML = '';
    showTyping();

    fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: text, history: history.slice(0, -1) })
    })
    .then(function (r) { return r.json(); })
    .then(function (data) {
      hideTyping();
      sendBtn.disabled = false;
      if (data && data.reply) {
        addMessage(data.reply, 'bot');
        history.push({ role: 'assistant', content: data.reply });
      } else {
        showError();
      }
    })
    .catch(function () {
      hideTyping();
      sendBtn.disabled = false;
      showError();
    });
  }

  function showError() {
    var e = document.createElement('div');
    e.className = 'bchat__error';
    e.textContent = "Sorry, I couldn't respond just now. Please try again.";
    body.appendChild(e);
    scrollDown();
  }

  function openChat() {
    root.classList.add('bchat--open');
    greet();
    setTimeout(function () { input.focus(); }, 100);
  }
  function closeChat() {
    root.classList.remove('bchat--open');
  }

  launcher.addEventListener('click', openChat);
  closeBtn.addEventListener('click', closeChat);

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    send(input.value);
  });

  // Enter sends, Shift+Enter adds newline
  input.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send(input.value);
    }
  });

  // auto-grow textarea as user types
  input.addEventListener('input', function () {
    input.style.height = 'auto';
    input.style.height = Math.min(input.scrollHeight, 90) + 'px';
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && root.classList.contains('bchat--open')) closeChat();
  });
})();

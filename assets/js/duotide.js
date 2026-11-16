/* Duotide (duotide.com.br) - comportamento da pagina. Sem dependencia.
   Conteudo nunca depende de JS para aparecer: a classe js-ok so entra
   depois que o script roda, e so entao o .rv fica escondido. */
(function () {
  'use strict';
  var raiz = document.documentElement;
  var menos = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var q = function (s, c) { return (c || document).querySelector(s); };
  var qa = function (s, c) { return [].slice.call((c || document).querySelectorAll(s)); };

  /* ----- 1. Ponto UNICO do link de cadastro ---------------------------
     O link de parceiro ainda vai chegar. Quando chegar, muda-se SO a
     linha PARCEIRO abaixo (ex.: '?ref=abc') e todo botao de criar conta
     da pagina passa a levar o parametro, inclusive o do rodape.        */
  var CADASTRO = 'https://trade.duotide.com/en/register';
  var ENTRAR   = 'https://trade.duotide.com/en/login';
  var DEMO     = 'https://trade.duotide.com/en/register';
  var PARCEIRO = '';   /* <= o unico lugar a mexer quando o link chegar */

  function destino(base) {
    if (!PARCEIRO) return base;
    var i = base.indexOf('#'), hash = i === -1 ? '' : base.slice(i), url = i === -1 ? base : base.slice(0, i);
    return url + (url.indexOf('?') === -1 ? '?' : '&') + PARCEIRO.replace(/^[?&]/, '') + hash;
  }
  qa('[data-ir]').forEach(function (a) {
    var alvo = a.getAttribute('data-ir');
    a.href = destino(alvo === 'entrar' ? ENTRAR : alvo === 'demo' ? DEMO : CADASTRO);
    /* link pago para a corretora: "sponsored" e o que o Google pede, e o JS
       nao pode rebaixar para so "noopener" o que o HTML ja marcou. */
    a.rel = 'sponsored noopener';
    a.target = '_blank';
  });

  /* ----- 2. Topo: capsula depois de rolar ------------------------------ */
  var topo = q('.topo'), pedindo = false;
  function aoRolar() {
    if (pedindo) return;
    pedindo = true;
    requestAnimationFrame(function () {
      pedindo = false;
      if (topo) topo.classList.toggle('rolou', scrollY > 8);
      indiceAtual();
    });
  }
  addEventListener('scroll', aoRolar, { passive: true });

  /* ----- 3. Gaveta do celular ------------------------------------------ */
  var gaveta = q('#gaveta'), btMenu = q('#menuBtn'), btFecha = q('#gavetaFecha');
  function abrir() {
    if (!gaveta) return;
    gaveta.hidden = false;
    requestAnimationFrame(function () { gaveta.classList.add('aberta'); });
    btMenu.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    if (btFecha) btFecha.focus();
  }
  function fechar(jaVai) {
    if (!gaveta || gaveta.hidden) return;
    gaveta.classList.remove('aberta');
    btMenu.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    if (jaVai === true || menos) gaveta.hidden = true;
    else setTimeout(function () { gaveta.hidden = true; }, 230);
  }
  if (btMenu) btMenu.addEventListener('click', abrir);
  if (btFecha) btFecha.addEventListener('click', function () { fechar(); btMenu.focus(); });
  qa('#gaveta a').forEach(function (a) { a.addEventListener('click', function () { fechar(true); }); });
  addEventListener('keydown', function (e) {
    if (!gaveta || gaveta.hidden) return;
    if (e.key === 'Escape') { fechar(); btMenu.focus(); }
    if (e.key === 'Tab') {             /* o foco nao escapa da gaveta aberta */
      var f = qa('a,button', gaveta), p = f[0], u = f[f.length - 1];
      if (e.shiftKey && document.activeElement === p) { e.preventDefault(); u.focus(); }
      else if (!e.shiftKey && document.activeElement === u) { e.preventDefault(); p.focus(); }
    }
  });

  /* ----- 4. FAQ: abrir um fecha o outro + "ver mais" contado ----------- */
  var faq = q('#faq-lista');
  if (faq) {
    var todas = qa('details', faq);
    /* reserva para navegador sem suporte a <details name> */
    todas.forEach(function (d) {
      d.addEventListener('toggle', function () {
        if (!d.open) return;
        todas.forEach(function (o) { if (o !== d && o.open) o.open = false; });
      });
    });
    var bt = q('#faqMais');
    if (bt) {
      var recontar = function () {
        /* 5 a vista numa coluna, 6 quando sao duas — o numero e CONTA */
        var cols = getComputedStyle(faq).gridTemplateColumns.split(' ').length;
        var vista = cols > 1 ? 6 : 5;
        var aberto = bt.getAttribute('aria-expanded') === 'true';
        todas.forEach(function (d, i) { d.hidden = !aberto && i >= vista; });
        var escondidas = todas.filter(function (d) { return d.hidden; }).length;
        bt.hidden = escondidas === 0 && !aberto;
        q('span', bt).textContent = aberto ? 'Ver menos perguntas' : 'Ver mais perguntas (+' + escondidas + ')';
      };
      /* "ver mais" cresce e "ver menos" recolhe deslizando (altura animada com a
         curva da casa); ao recolher, a seção volta para o título, que fica abaixo
         do cabeçalho fixo. "Menos movimento": sem animação, só o estado final. */
      var voltarAoTitulo = function () {
        var t = q('#t-faq'), topo = q('#topo');
        if (!t) return;
        var alvo = t.getBoundingClientRect().top + window.pageYOffset - ((topo ? topo.offsetHeight : 64) + 24);
        window.scrollTo({ top: Math.max(0, alvo), behavior: menos ? 'auto' : 'smooth' });
      };
      bt.addEventListener('click', function () {
        var abrir = bt.getAttribute('aria-expanded') !== 'true';
        var antes = faq.offsetHeight, estavam = todas.map(function (d) { return d.hidden; });
        bt.setAttribute('aria-expanded', abrir ? 'true' : 'false');
        recontar();
        var depois = faq.offsetHeight;
        if (menos || !faq.animate || antes === depois) { if (!abrir) voltarAoTitulo(); return; }
        if (!abrir) todas.forEach(function (d, i) { d.hidden = estavam[i]; });   /* fica à vista até acabar de recolher */
        faq.style.overflow = 'clip';
        var an = faq.animate([{ height: antes + 'px' }, { height: depois + 'px' }],
          { duration: 320, easing: 'cubic-bezier(.22,1,.36,1)' });
        var fim = function () { faq.style.overflow = ''; if (!abrir) { recontar(); voltarAoTitulo(); } };
        an.onfinish = fim; an.oncancel = fim;
      });
      addEventListener('resize', recontar);
      recontar();
    }
  }

  /* ----- 5. Revelar ao entrar na tela, com escalonamento --------------- */
  function revelar() {
    var alvos = qa('.rv:not(.vis), .rv-f:not(.vis)');
    qa('.rv-f').forEach(function (g) {
      [].slice.call(g.children).forEach(function (f, i) { f.style.setProperty('--i', i); });
    });
    if (menos || !('IntersectionObserver' in window)) {
      alvos.forEach(function (e) { e.classList.add('vis'); });
      return;
    }
    var ob = new IntersectionObserver(function (ents) {
      ents.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add('vis');
        ob.unobserve(en.target);
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    alvos.forEach(function (e) { ob.observe(e); });
  }

  /* ----- 6. Contador animado nos numeros que provam algo --------------- */
  function contadores() {
    var nums = qa('[data-conta]');
    if (!nums.length) return;
    if (menos || !('IntersectionObserver' in window)) {
      nums.forEach(function (n) { n.textContent = n.dataset.contaFim || n.textContent; });
      return;
    }
    var ob = new IntersectionObserver(function (ents) {
      ents.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target; ob.unobserve(el);
        var fim = parseFloat(el.dataset.conta);
        var pre = el.dataset.contaPre || '', pos = el.dataset.contaPos || '';
        var t0 = performance.now(), dur = 900;
        (function passo(t) {
          var p = Math.min(1, (t - t0) / dur);
          var e = 1 - Math.pow(1 - p, 3);
          el.textContent = pre + Math.round(fim * e).toLocaleString('pt-BR') + pos;
          if (p < 1) requestAnimationFrame(passo);
        })(t0);
      });
    }, { rootMargin: '0px 0px -12% 0px' });
    nums.forEach(function (n) { ob.observe(n); });
  }

  /* ----- 7. Indice lateral: quem troca o topico e a ROLAGEM ------------ */
  var indice = q('#indice');
  function indiceAtual() {
    if (!indice) return;
    var tits = qa('.artigo h2[id]');
    if (!tits.length) return;
    var meio = innerHeight / 2, atual = tits[0].id;
    tits.forEach(function (h) { if (h.getBoundingClientRect().top < meio) atual = h.id; });
    qa('a', indice).forEach(function (a) {
      a.classList.toggle('atual', a.getAttribute('href') === '#' + atual);
    });
  }

  /* ----- 8. Ano do rodape e conta, nao texto --------------------------- */
  qa('[data-ano]').forEach(function (e) { e.textContent = new Date().getFullYear(); });

  raiz.classList.add('js-ok');
  revelar();
  contadores();
  indiceAtual();
  aoRolar();
})();

(function () {
  'use strict';

  /* ----------------------------------------------------------------------
     Menu (botão hambúrguer, em todas as larguras)
     ---------------------------------------------------------------------- */
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.site-nav');
  if (toggle && nav) {
    var setOpen = function (open) {
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Fechar menu de navegação' : 'Abrir menu de navegação');
      nav.setAttribute('data-open', String(open));
    };
    toggle.addEventListener('click', function (event) {
      event.stopPropagation();
      setOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });
    nav.addEventListener('click', function (event) {
      if (event.target.tagName === 'A') setOpen(false);
    });
    document.addEventListener('click', function (event) {
      if (toggle.getAttribute('aria-expanded') === 'true' && !nav.contains(event.target)) setOpen(false);
    });
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        setOpen(false);
        toggle.focus();
      }
    });
  }

  /* ----------------------------------------------------------------------
     Botão "voltar ao topo"
     ---------------------------------------------------------------------- */
  var toTop = document.querySelector('.to-top');
  if (toTop) {
    var ticking = false;
    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(function () {
        toTop.classList.toggle('is-visible', window.scrollY > 700);
        ticking = false;
      });
    }, { passive: true });
    toTop.addEventListener('click', function () {
      var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
    });
  }

  /* ----------------------------------------------------------------------
     Cotações ao vivo (TradingView), carregadas só quando a seção aparece.
     Sem JavaScript ou sem rede, fica o gráfico estático de cada cartão.
     ---------------------------------------------------------------------- */
  var cotacoes = document.querySelectorAll('.cotacao[data-simbolo]');
  if (cotacoes.length) {
    var carregar = function (cartao) {
      var alvo = document.createElement('div');
      alvo.className = 'tradingview-widget-container__widget';
      var script = document.createElement('script');
      script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-mini-symbol-overview.js';
      script.async = true;
      script.textContent = JSON.stringify({
        symbol: cartao.getAttribute('data-simbolo'),
        width: '100%', height: '100%', locale: 'br', dateRange: '12M',
        colorTheme: 'dark', isTransparent: false, autosize: true, largeChartUrl: ''
      });
      var caixa = document.createElement('div');
      caixa.className = 'tradingview-widget-container';
      caixa.style.cssText = 'position:absolute;inset:0';
      caixa.appendChild(alvo);
      caixa.appendChild(script);
      cartao.appendChild(caixa);
    };
    if ('IntersectionObserver' in window) {
      var obs = new IntersectionObserver(function (entradas) {
        entradas.forEach(function (e) {
          if (e.isIntersecting) { carregar(e.target); obs.unobserve(e.target); }
        });
      }, { rootMargin: '200px' });
      cotacoes.forEach(function (c) { obs.observe(c); });
    } else {
      cotacoes.forEach(carregar);
    }
  }
})();

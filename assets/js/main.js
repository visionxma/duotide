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
      toggle.setAttribute('aria-label', toggle.getAttribute(open ? 'data-fechar' : 'data-abrir') ||
        (open ? 'Fechar menu de navegação' : 'Abrir menu de navegação'));
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
  var localeTV = document.documentElement.getAttribute('data-tv') || 'br';
  if (cotacoes.length) {
    var carregar = function (cartao) {
      var alvo = document.createElement('div');
      alvo.className = 'tradingview-widget-container__widget';
      var script = document.createElement('script');
      script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-mini-symbol-overview.js';
      script.async = true;
      script.textContent = JSON.stringify({
        symbol: cartao.getAttribute('data-simbolo'),
        width: '100%', height: '100%', locale: localeTV, dateRange: '12M',
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

  /* ----------------------------------------------------------------------
     Pop-up de boas-vindas (no estilo do safirion.com.br)
     Abre uma vez por sessão: em 2 s ou aos 35% de rolagem, o que vier primeiro.
     O conteúdo vem do <template id="pp-modelo"> da página, já no idioma dela.
     Console: duotidePopup.abrir() / .limpar() / .estado()
     ---------------------------------------------------------------------- */
  var modelo = document.getElementById('pp-modelo');
  if (modelo && 'content' in modelo) {
    var CHAVE = 'duotide_boasvindas_v1';
    var guardado = function () { try { return !!sessionStorage.getItem(CHAVE); } catch (e) { return false; } };
    var guardar = function () { try { sessionStorage.setItem(CHAVE, '1'); } catch (e) {} };
    var cx = null, anterior = null, aberto = false, espera = null;

    var tecla = function (e) {
      if (!aberto) return;
      if (e.key === 'Escape') { fechar(); return; }
      if (e.key !== 'Tab') return;
      var f = cx.querySelectorAll('button, a[href]');
      var pri = f[0], ult = f[f.length - 1];
      if (e.shiftKey && document.activeElement === pri) { e.preventDefault(); ult.focus(); }
      else if (!e.shiftKey && document.activeElement === ult) { e.preventDefault(); pri.focus(); }
    };
    var fechar = function () {
      if (!aberto) return;
      aberto = false;
      guardar();
      document.removeEventListener('keydown', tecla);
      cx.removeAttribute('data-visivel');
      document.body.classList.remove('pp-travado');
      var el = cx;
      setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, 320);
      if (anterior && anterior.focus) anterior.focus();
    };
    var abrir = function () {
      if (aberto) return;
      aberto = true;
      anterior = document.activeElement;
      cx = modelo.content.firstElementChild.cloneNode(true);
      document.body.appendChild(cx);
      cx.setAttribute('data-aberto', '');
      document.body.classList.add('pp-travado');
      requestAnimationFrame(function () { cx.setAttribute('data-visivel', ''); });
      (cx.querySelector('.pp__cx[tabindex]') || cx.querySelector('.pp__x')).focus();
      cx.querySelector('.pp__x').addEventListener('click', fechar);
      cx.querySelector('.pp__btn').addEventListener('click', function () { guardar(); setTimeout(fechar, 0); });
      cx.addEventListener('click', function (e) { if (e.target === cx) fechar(); });
      document.addEventListener('keydown', tecla);
    };
    var aoRolar = function () {
      var h = document.documentElement;
      if (h.scrollTop / ((h.scrollHeight - h.clientHeight) || 1) >= 0.35) disparar();
    };
    var disparar = function () {
      clearTimeout(espera);
      window.removeEventListener('scroll', aoRolar);
      abrir();
    };
    window.duotidePopup = {
      abrir: abrir,
      limpar: function () { try { sessionStorage.removeItem(CHAVE); } catch (e) {} return 'liberado'; },
      estado: function () { return guardado() ? 'já apareceu nesta sessão' : 'liberado'; }
    };
    if (!guardado()) {
      espera = setTimeout(disparar, 2000);
      window.addEventListener('scroll', aoRolar, { passive: true });
    }
  }

  /* ----------------------------------------------------------------------
     Animação ao rolar: blocos aparecem suavemente quando entram na tela
     ---------------------------------------------------------------------- */
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var alvos = document.querySelectorAll('main h2, main .foto, main .card, main .recurso, main .faq__item, main .cotacoes, main .check-list li, main .steps li, main .callout, main .lojas');
    var obsRevela = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('visivel'); obsRevela.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    alvos.forEach(function (el) {
      if (el.getBoundingClientRect().top > window.innerHeight) { el.classList.add('revela'); obsRevela.observe(el); }
    });
  }

  /* ----------------------------------------------------------------------
     Faixa de cotações ao vivo (TradingView) logo abaixo do topo da home
     ---------------------------------------------------------------------- */
  var heroHome = document.querySelector('main > .hero');
  if (heroHome) {
    var fita = document.createElement('div');
    fita.className = 'fita-cotacoes';
    fita.setAttribute('aria-hidden', 'true');
    heroHome.insertAdjacentElement('afterend', fita);
    var carregarFita = function () {
      var caixa = document.createElement('div');
      caixa.className = 'tradingview-widget-container';
      caixa.innerHTML = '<div class="tradingview-widget-container__widget"></div>';
      var sc = document.createElement('script');
      sc.src = 'https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js';
      sc.async = true;
      sc.textContent = JSON.stringify({
        symbols: [
          { proName: 'BITSTAMP:BTCUSD', title: 'BTC/USD' }, { proName: 'BITSTAMP:ETHUSD', title: 'ETH/USD' },
          { proName: 'FX:EURUSD', title: 'EUR/USD' }, { proName: 'FX:GBPUSD', title: 'GBP/USD' },
          { proName: 'FX:USDJPY', title: 'USD/JPY' }, { proName: 'OANDA:XAUUSD', title: 'XAU/USD' },
          { proName: 'OANDA:SPX500USD', title: 'S&P 500' }, { proName: 'OANDA:NAS100USD', title: 'Nasdaq 100' },
          { proName: 'TVC:USOIL', title: 'WTI' }
        ],
        showSymbolLogo: true, isTransparent: true, displayMode: 'adaptive', colorTheme: 'dark',
        locale: document.documentElement.getAttribute('data-tv') || 'br'
      });
      caixa.appendChild(sc);
      fita.appendChild(caixa);
    };
    if ('requestIdleCallback' in window) requestIdleCallback(carregarFita, { timeout: 2500 });
    else setTimeout(carregarFita, 1200);
  }
})();

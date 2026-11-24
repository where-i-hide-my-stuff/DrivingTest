// Shared quiz engine. Reads window.CATEGORIES (filled by the files in /data).
(function () {
  var BRAND = 'HijaziSchool270'; // small name badge on each card (set '' to hide)
  var CHECK = ' <svg width="14" height="14" viewBox="0 0 14 14"><circle cx="7" cy="7" r="7" fill="#3b9cff"/><path d="M4 7.2l2 2 4-4" stroke="#fff" stroke-width="1.6" fill="none"/></svg>';
  var PART_SIZE = 30; // questions per tab: 1-30, 31-60, ...
  var CATEGORIES = window.CATEGORIES || [];

  var T = {
    ar: { app: 'اختبار النظرية', pick: 'اختر قسماً', q: 'سؤال', score: 'الإجابات الصحيحة', retry: 'إعادة المحاولة', home: 'الرئيسية', questions: 'سؤال', lang: 'English' },
    en: { app: 'Theory test', pick: 'Choose a category', q: 'Question', score: 'Correct answers', retry: 'Try again', home: 'Home', questions: 'questions', lang: 'العربية' }
  };

  var root = document.getElementById('dq-app');
  var lang = 'ar';
  var S = { view: 'home' };

  function t(k) { return T[lang][k]; }

  function shuffle(a) {
    var b = a.slice(), i, j, x;
    for (i = b.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      x = b[i]; b[i] = b[j]; b[j] = x;
    }
    return b;
  }

  function partsOf(c) {
    var out = [], n = c.questions.length, s;
    for (s = 0; s < n; s += PART_SIZE) {
      out.push({ label: (s + 1) + ' - ' + Math.min(s + PART_SIZE, n), qs: c.questions.slice(s, s + PART_SIZE) });
    }
    return out;
  }

  // Open one tab: all its questions on one scrolling page (options are shuffled).
  function startPart(i) {
    S.view = 'cat'; S.pi = i; S.score = 0;
    S.qs = partsOf(S.cat)[i].qs.map(function (q) {
      return { q: q.q, image: q.image, pick: null, o: shuffle(q.options.map(function (x, k) { return { x: x, ok: k === q.answer }; })) };
    });
  }

  function top(title, back) {
    var left = back ? '<button data-act="home">' + t('home') + '</button>' : '<span></span>';
    return '<div class="dq-top">' + left + '<b>' + title + '</b><button data-act="lang">' + t('lang') + '</button></div>';
  }

  function qHTML(i) {
    var q = S.qs[i], done = q.pick !== null;
    var h = '<div class="dq-qc" id="dq-q' + i + '" dir="rtl">';
    if (q.image) h += '<img class="dq-img" src="' + q.image + '" alt="">';
    h += '<div class="dq-q"><b>' + t('q') + ' ' + (i + 1) + ':</b> ' + q.q + '</div>';
    q.o.forEach(function (o, k) {
      var cls = 'dq-opt', ic = '';
      if (done) {
        if (o.ok) { cls += ' dq-ok'; ic = '✓'; }
        else if (k === q.pick) { cls += ' dq-bad'; ic = '✕'; }
      }
      h += '<button class="' + cls + '" data-act="pick:' + i + ':' + k + '"><span>' + o.x + '</span><i>' + ic + '</i></button>';
    });
    return h + '</div>';
  }

  function draw() {
    root.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
    var h = '', c = S.cat, i;
    if (S.view === 'home') {
      h = top(t('app'), false) + '<p>' + t('pick') + '</p><div class="dq-grid">' + CATEGORIES.map(function (x, i) {
        var n = x.questions.length;
        return '<button class="dq-card" data-act="cat:' + i + '"><span class="dq-ph">' + (x.image ? '<img src="' + x.image + '" alt="">' : '') + '<span class="dq-badge">' + n + ' ' + t('questions') + '</span>' + (BRAND ? '<span class="dq-by">' + BRAND + CHECK + '</span>' : '') + '</span><b>' + x.title[lang] + '</b><span class="dq-rng">1 - ' + n + '</span></button>';
      }).join('') + '</div>';
    } else {
      h = top(c.title[lang], true) + '<div class="dq-tabs">' + partsOf(c).map(function (p, k) {
        return '<button class="dq-tab' + (k === S.pi ? ' dq-on' : '') + '" data-act="part:' + k + '">' + p.label + '</button>';
      }).join('') + '</div><div class="dq-sc">' + t('score') + ': <b id="dq-sc">' + S.score + ' / ' + S.qs.length + '</b></div>';
      for (i = 0; i < S.qs.length; i++) h += qHTML(i);
      h += '<div class="dq-end"><button class="dq-pri" data-act="retry">' + t('retry') + '</button><button data-act="home">' + t('home') + '</button></div>';
    }
    root.innerHTML = h;
  }

  root.addEventListener('click', function (e) {
    var b = e.target.closest('[data-act]');
    if (!b) return;
    var a = b.getAttribute('data-act').split(':'), k = a[0];
    if (k === 'pick') { // update only this question so the page does not jump
      var i = +a[1], q = S.qs[i];
      if (q.pick !== null) return;
      q.pick = +a[2];
      if (q.o[q.pick].ok) S.score++;
      document.getElementById('dq-q' + i).outerHTML = qHTML(i);
      document.getElementById('dq-sc').textContent = S.score + ' / ' + S.qs.length;
      return;
    }
    if (k === 'lang') lang = lang === 'ar' ? 'en' : 'ar';
    else if (k === 'home') S = { view: 'home' };
    else if (k === 'cat') { S = { cat: CATEGORIES[+a[1]] }; startPart(0); window.scrollTo(0, 0); }
    else if (k === 'part') { startPart(+a[1]); window.scrollTo(0, 0); }
    else if (k === 'retry') { startPart(S.pi); window.scrollTo(0, 0); }
    draw();
  });

  draw();
})();

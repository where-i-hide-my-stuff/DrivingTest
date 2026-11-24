// Shared quiz engine. Reads window.CATEGORIES (filled by the files in /data).
(function () {
  var BRAND = 'HijaziSchool270'; // small name badge on each card (set '' to hide)
  var CHECK = ' <svg width="14" height="14" viewBox="0 0 14 14"><circle cx="7" cy="7" r="7" fill="#3b9cff"/><path d="M4 7.2l2 2 4-4" stroke="#fff" stroke-width="1.6" fill="none"/></svg>';
  var PART_SIZE = 30; // questions per part: 1-30, 31-60, ...
  var CATEGORIES = window.CATEGORIES || [];

  var T = {
    ar: { app: 'اختبار النظرية', pick: 'اختر قسماً', pickPart: 'اختر الجزء', q: 'سؤال', of: 'من', score: 'النتيجة', next: 'التالي', finish: 'عرض النتيجة', right: 'إجابة صحيحة', wrong: 'إجابة خاطئة. الصحيحة: ', need: 'اختر إجابة أولاً', yourScore: 'نتيجتك', retry: 'إعادة المحاولة', home: 'الرئيسية', back: 'رجوع', questions: 'سؤال', lang: 'English' },
    en: { app: 'Theory test', pick: 'Choose a category', pickPart: 'Choose a part', q: 'Question', of: 'of', score: 'Score', next: 'Next', finish: 'Show result', right: 'Correct', wrong: 'Wrong. Correct answer: ', need: 'Pick an answer first', yourScore: 'Your score', retry: 'Try again', home: 'Home', back: 'Back', questions: 'questions', lang: 'العربية' }
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

  function startPart(p) {
    S.curPart = p;
    S.qs = shuffle(p.qs).map(function (q) {
      return { q: q.q, image: q.image, o: shuffle(q.options.map(function (x, k) { return { x: x, ok: k === q.answer }; })) };
    });
    S.i = 0; S.score = 0; S.pick = null; S.err = false; S.view = 'quiz';
  }

  function top(title, backAct) {
    var left = backAct ? '<button data-act="' + backAct + '">' + t(backAct === 'home' ? 'home' : 'back') + '</button>' : '<span></span>';
    return '<div class="dq-top">' + left + '<b>' + title + '</b><button data-act="lang">' + t('lang') + '</button></div>';
  }

  function draw() {
    root.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
    var h = '', c = S.cat;
    if (S.view === 'home') {
      h = top(t('app'), null) + '<p>' + t('pick') + '</p><div class="dq-grid">' + CATEGORIES.map(function (x, i) {
        var n = x.questions.length;
        return '<button class="dq-card" data-act="cat:' + i + '"><span class="dq-ph">' + (x.image ? '<img src="' + x.image + '" alt="">' : '') + '<span class="dq-badge">' + n + ' ' + t('questions') + '</span><span class="dq-by">' + BRAND + CHECK + '</span></span><b>' + x.title[lang] + '</b><span class="dq-rng">1 - ' + n + '</span></button>';
      }).join('') + '</div>';
    } else if (S.view === 'parts') {
      h = top(c.title[lang], 'home') + '<p>' + t('pickPart') + '</p><div class="dq-grid">' + partsOf(c).map(function (p, i) {
        return '<button data-act="part:' + i + '">' + p.label + '</button>';
      }).join('') + '</div>';
    } else if (S.view === 'quiz') {
      var q = S.qs[S.i], n = S.qs.length, ans = S.pick !== null;
      var corr = q.o.filter(function (o) { return o.ok; })[0].x;
      var pct = Math.round((S.i + (ans ? 1 : 0)) / n * 100);
      h = top(c.title[lang] + ' ' + S.curPart.label, 'parts') +
        '<div class="dq-meta"><span>' + t('q') + ' ' + (S.i + 1) + ' ' + t('of') + ' ' + n + '</span><span>' + t('score') + ': ' + S.score + '</span></div>' +
        '<div class="dq-bar"><div style="width:' + pct + '%"></div></div>';
      if (q.image) h += '<img class="dq-img" src="' + q.image + '" alt="">';
      h += '<div dir="rtl" class="dq-q">' + q.q + '</div><div dir="rtl">';
      q.o.forEach(function (o, k) {
        var cls = 'dq-opt';
        if (ans) { if (o.ok) cls += ' dq-ok'; else if (k === S.pick) cls += ' dq-bad'; }
        h += '<button class="' + cls + '" data-act="pick:' + k + '">' + o.x + '</button>';
      });
      h += '</div>';
      if (ans) {
        var good = q.o[S.pick].ok;
        h += '<div class="dq-msg" style="color:' + (good ? '#1c6b34' : '#9b2c2c') + '">' + (good ? t('right') : t('wrong') + '<span dir="rtl">' + corr + '</span>') + '</div>';
      }
      if (S.err) h += '<div class="dq-msg" style="color:#9b2c2c;font-size:13px">' + t('need') + '</div>';
      h += '<button class="dq-pri" data-act="next">' + (S.i === n - 1 ? t('finish') : t('next')) + '</button>';
    } else {
      var total = S.qs.length;
      h = top(c.title[lang] + ' ' + S.curPart.label, 'parts') + '<div class="dq-score"><span>' + t('yourScore') + '</span><b>' + S.score + ' / ' + total + '</b><span>' + Math.round(S.score / total * 100) + '%</span></div>' +
        '<div style="display:flex;gap:10px;justify-content:center"><button class="dq-pri" data-act="retry">' + t('retry') + '</button><button data-act="home">' + t('home') + '</button></div>';
    }
    root.innerHTML = h;
  }

  root.addEventListener('click', function (e) {
    var b = e.target.closest('[data-act]');
    if (!b) return;
    var a = b.getAttribute('data-act').split(':'), k = a[0], v = a[1];
    if (k === 'lang') lang = lang === 'ar' ? 'en' : 'ar';
    else if (k === 'home') S = { view: 'home' };
    else if (k === 'parts') S.view = 'parts';
    else if (k === 'cat') S = { view: 'parts', cat: CATEGORIES[+v] };
    else if (k === 'part') startPart(partsOf(S.cat)[+v]);
    else if (k === 'retry') startPart(S.curPart);
    else if (k === 'pick') {
      if (S.pick === null) { S.pick = +v; S.err = false; if (S.qs[S.i].o[S.pick].ok) S.score++; }
    } else if (k === 'next') {
      if (S.pick === null) S.err = true;
      else { S.i++; S.pick = null; S.err = false; S.view = S.i >= S.qs.length ? 'result' : 'quiz'; }
    }
    draw();
  });

  draw();
})();

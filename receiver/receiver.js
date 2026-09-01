// Custom Cast receiver for Yogaholic's run screen. No media playback — this just mirrors the
// timer state the phone sender already computes (see src/cast/payload.ts), over a custom
// namespace, so it must stay in sync with that file's CastRunMessage shape.
(function () {
  var NAMESPACE = 'urn:x-cast:com.szymonwsteam.yogaholic.run';

  // Maps the imageSlug the phone sends (src/cast/imageSlugs.ts) to a static file hosted next to
  // this page (copied from the app's assets/exercises/*.png). Slugs missing here (pool entries
  // with no bundled image, or user-picked photos that only exist on the phone) fall back to the
  // text placeholder below.
  var IMAGE_SLUGS = {
    tadasana: 'assets/tadasana.png',
    dog: 'assets/dog.png',
    'warrior-1': 'assets/warrior-1.png',
    'warrior-1-left': 'assets/warrior-1-left.png',
    balasana: 'assets/balasana.png',
    'supta-matsyendrasana': 'assets/supta-matsyendrasana.png',
    'supta-matsyendrasana-left': 'assets/supta-matsyendrasana-left.png',
    malasana: 'assets/malasana.png',
    'siad-skrzyzny': 'assets/siad-skrzyzny.png',
    'cat-cow': 'assets/cat-cow.png',
  };

  var els = {
    overallProgress: document.getElementById('overallProgress'),
    ringFill: document.getElementById('ringFill'),
    exerciseImage: document.getElementById('exerciseImage'),
    exercisePlaceholder: document.getElementById('exercisePlaceholder'),
    exerciseName: document.getElementById('exerciseName'),
    exerciseOriginal: document.getElementById('exerciseOriginal'),
    phaseCaption: document.getElementById('phaseCaption'),
    timeBig: document.getElementById('timeBig'),
    stepLabel: document.getElementById('stepLabel'),
  };

  var ringRadius = Number(els.ringFill.getAttribute('r'));
  var ringCircumference = 2 * Math.PI * ringRadius;
  els.ringFill.style.strokeDasharray = ringCircumference + ' ' + ringCircumference;

  function setRingProgress(progress) {
    var clamped = Math.min(1, Math.max(0, progress || 0));
    els.ringFill.style.strokeDashoffset = String(ringCircumference * (1 - clamped));
  }

  function renderComplete() {
    els.overallProgress.style.width = '100%';
    setRingProgress(1);
    els.exerciseImage.hidden = true;
    els.exercisePlaceholder.hidden = true;
    els.exerciseName.textContent = 'Świetna robota!';
    els.exerciseOriginal.hidden = true;
    els.phaseCaption.textContent = 'Trening zakończony';
    els.timeBig.textContent = '';
    els.stepLabel.textContent = '';
  }

  function render(message) {
    if (!message) return;
    if (message.type === 'run-complete') {
      renderComplete();
      return;
    }
    if (message.type !== 'run-state') return;

    els.overallProgress.style.width = Math.round(Math.min(1, Math.max(0, message.overallProgress)) * 100) + '%';
    setRingProgress(message.isPrep ? 0 : message.exerciseProgress);

    els.exerciseName.textContent = message.exerciseName || '';

    if (message.exerciseOriginal) {
      els.exerciseOriginal.textContent = '(' + message.exerciseOriginal + ')';
      els.exerciseOriginal.hidden = false;
    } else {
      els.exerciseOriginal.hidden = true;
    }

    els.phaseCaption.textContent = message.isPrep ? 'Przygotuj się' : 'Pozostały czas';
    els.timeBig.textContent = message.remainingLabel || '';
    els.stepLabel.textContent = 'Ćwiczenie ' + (message.runIndex + 1) + ' z ' + message.exerciseCount;

    var imageUrl = message.imageSlug && IMAGE_SLUGS[message.imageSlug];
    if (imageUrl) {
      els.exerciseImage.src = imageUrl;
      els.exerciseImage.hidden = false;
      els.exercisePlaceholder.hidden = true;
    } else {
      els.exerciseImage.hidden = true;
      els.exercisePlaceholder.hidden = false;
      els.exercisePlaceholder.textContent = 'ilustracja: ' + (message.exerciseName || '').toLowerCase();
    }
  }

  var context = cast.framework.CastReceiverContext.getInstance();

  context.addCustomMessageListener(NAMESPACE, function (event) {
    var data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
    render(data);
  });

  context.start();
})();

/* Motion layer: scroll reveals, image fades and the header state. See the Motion section in CLAUDE.md.
   Runs only when <html> has .js-motion, which is skipped under prefers-reduced-motion. */
(function () {
  var root = document.documentElement;
  if (!root.classList.contains('js-motion')) return;

  var STAGGER = 90;
  var MAX_STAGGERED = 6;

  var REVEAL_SELECTORS = [
    'main .section-heading',
    'main .page-intro > *',
    'main .split-text__inner > *',
    'main .image-text__inner > *',
    'main .narrow-text__inner > *',
    'main .testimonial__inner',
    'main .cta-band__inner > *',
    'main .year-lists__heading',
    'main .year-lists__group',
    'main .feature-press__heading',
    'main .enquiry__inner > *',
    'main .product-enquiry__inner > *',
    'main .product-grid > li',
    'main .feature-homes__grid > li',
    'main .feature-events__grid > li',
    'main .feature-press__list > li',
    'main .image-row__grid > li',
    'main .columns__grid > li',
    'main .pagination'
  ].join(',');

  var GRID_PARENTS = '.product-grid, .feature-homes__grid, .feature-events__grid, .feature-press__list, .image-row__grid, .columns__grid';

  var FADE_IMAGES = '.mount img, .cover-image img, .hero__image, .product__frame img, .image-text__media img';

  /* Scroll reveals: only for elements below the first screen, so nothing visible on load is hidden. */
  function setUpReveals() {
    if (!('IntersectionObserver' in window)) return;
    var viewportBottom = window.innerHeight;
    var targets = Array.prototype.slice.call(document.querySelectorAll(REVEAL_SELECTORS));
    var pending = targets.filter(function (el) {
      return el.getBoundingClientRect().top > viewportBottom;
    });
    if (!pending.length) return;

    var observer = new IntersectionObserver(function (entries) {
      var batch = entries.filter(function (entry) {
        return entry.isIntersecting;
      });
      var counts = new Map();
      batch.forEach(function (entry) {
        var el = entry.target;
        var parent = el.parentElement && el.parentElement.matches(GRID_PARENTS) ? el.parentElement : null;
        var index = 0;
        if (parent) {
          index = counts.get(parent) || 0;
          counts.set(parent, index + 1);
        }
        el.style.setProperty('--reveal-delay', Math.min(index, MAX_STAGGERED - 1) * STAGGER + 'ms');
        el.classList.add('is-revealed');
        observer.unobserve(el);
      });
    }, { threshold: 0, rootMargin: '0px 0px -6% 0px' });

    pending.forEach(function (el) {
      el.classList.add('reveal');
      observer.observe(el);
    });
  }

  /* Images fade in once loaded. Already-loaded images are shown at once. */
  function markLoaded(img) {
    img.classList.add('is-loaded');
  }

  function setUpImageFades(scope) {
    var images = (scope || document).querySelectorAll(FADE_IMAGES);
    Array.prototype.forEach.call(images, function (img) {
      if (img.classList.contains('fade-image')) return;
      if (img.complete && img.naturalWidth) return;
      img.classList.add('fade-image');
      img.addEventListener('load', function () { markLoaded(img); }, { once: true });
      img.addEventListener('error', function () { markLoaded(img); }, { once: true });
    });
  }

  /* Header: transparent over the hero, solid once past it (or once the page scrolls when there is no hero). */
  function setUpHeader() {
    var header = document.querySelector('.shopify-section-group-header-group');
    if (!header) return;
    var headerHeight = header.getBoundingClientRect().height;
    root.style.setProperty('--header-height', Math.round(headerHeight) + 'px');

    var firstSection = document.querySelector('main > .shopify-section');
    var hero = firstSection && firstSection.querySelector('.hero');

    if (hero && 'IntersectionObserver' in window) {
      var heroObserver = new IntersectionObserver(function (entries) {
        root.classList.toggle('header-solid', !entries[0].isIntersecting);
      }, { rootMargin: '-' + Math.round(headerHeight) + 'px 0px 0px 0px', threshold: 0 });
      heroObserver.observe(hero);
      return;
    }

    var update = function () {
      root.classList.toggle('header-solid', window.scrollY > 4);
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
  }

  setUpHeader();
  setUpImageFades();
  setUpReveals();

  window.Motion = { fadeImages: setUpImageFades };
})();

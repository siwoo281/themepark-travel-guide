// Lightweight hero image helper module
// Exposes window.Hero with small utilities used by app and HTML
(function(){
  function supportsFormat(type) {
    try {
      var img = new Image();
      return new Promise(function(resolve){
        img.onload = function(){ resolve(img.width > 0); };
        img.onerror = function(){ resolve(false); };
        // Tiny data URI by mime-type (empty payload still triggers codec check in most browsers)
        if (type === 'image/avif') {
          img.src = 'data:image/avif;base64,AAAAFGZ0eXBhdmlmAAAAAG1pZjFhdmlmAAABAA==';
        } else if (type === 'image/webp') {
          img.src = 'data:image/webp;base64,UklGRiIAAABXRUJQVlA4IBIAAAAvAQCdASoIAAgAAkA4JaQAA3AA/v8=';
        } else {
          resolve(false);
        }
      });
    } catch (e) {
      return Promise.resolve(false);
    }
  }

  async function pickBestLocalHero(options){
    var base = (options && options.basename) || 'hero-castle';
    var dir = (options && options.dir) || 'images/optimized';
    var fallbackDir = (options && options.fallbackDir) || 'images';

    var avifOk = await supportsFormat('image/avif');
    if (avifOk) {
      return dir + '/' + base + '.avif';
    }
    var webpOk = await supportsFormat('image/webp');
    if (webpOk) {
      return dir + '/' + base + '.webp';
    }
    // fallback jpg (optimized if exists)
    return dir + '/' + base + '.jpg';
  }

  // Apply best local hero to DOM <picture> if present
  async function applyBestLocalToPicture(){
    var picture = document.querySelector('.hero .hero-bg-img picture');
    if (!picture) return;
    var img = picture.querySelector('img');
    if (!img) return;

    var basename = (window.CONFIG && window.CONFIG.HERO && window.CONFIG.HERO.localBasename) || 'hero-castle';
    var dir = (window.CONFIG && window.CONFIG.HERO && window.CONFIG.HERO.localDir) || 'images/optimized';

    // Update <source> srcset dynamically to desired basename
    var sources = picture.querySelectorAll('source');
    sources.forEach(function(s){
      var type = s.getAttribute('type') || '';
      if (type.includes('avif')) s.srcset = dir + '/' + basename + '.avif';
      if (type.includes('webp')) s.srcset = dir + '/' + basename + '.webp';
    });
    // Set fallback img if not already a local path
    if (!/\.(jpg|jpeg|png|webp|avif)$/i.test(img.src) || /unsplash|wikimedia|source\./i.test(img.src)) {
      try {
        var best = await pickBestLocalHero({ basename: basename, dir: dir });
        img.src = best;
      } catch(_) { /* noop */ }
    }
  }

  window.Hero = {
    supportsFormat: supportsFormat,
    pickBestLocalHero: pickBestLocalHero,
    applyBestLocalToPicture: applyBestLocalToPicture
  };

  document.addEventListener('DOMContentLoaded', function(){
    // Only run if user allows local-first hero
    var useLocalFirst = !!(window.CONFIG && window.CONFIG.HERO && window.CONFIG.HERO.useLocalHeroFirst);
    if (useLocalFirst) {
      applyBestLocalToPicture();
    }
  });
})();

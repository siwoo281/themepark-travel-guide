// Mobile navigation toggle (accessible)
(function(){
  document.addEventListener('DOMContentLoaded', function(){
    var toggle = document.getElementById('menuToggle');
    var nav = document.getElementById('primaryNav');
    if(!toggle || !nav) return;

    var closeOnLink = function(){
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded','false');
    };

    toggle.addEventListener('click', function(){
      var isOpen = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Close when a nav link is clicked
    var links = nav.querySelectorAll('a');
    links.forEach(function(a){ a.addEventListener('click', closeOnLink); });

    // Close on Esc
    document.addEventListener('keydown', function(e){
      if(e.key === 'Escape') closeOnLink();
    });
  });
})();

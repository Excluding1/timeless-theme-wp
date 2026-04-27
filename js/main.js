/**
 * Timeless Resurfacing — Main JavaScript
 * Mobile menu, FAQ accordion, scroll reveal, smooth scrolling
 */

document.addEventListener('DOMContentLoaded', function () {

    /* ── Before/After Slider ── */
    (function(){
        var slider = document.getElementById('hero-slider');
        if(!slider) return;
        var clip   = document.getElementById('ba-clip');
        var line   = document.getElementById('ba-line');
        var handle = document.getElementById('ba-handle');
        var bImg   = document.getElementById('ba-before-img');
        var active = false;

        function syncWidth(){
            var w = slider.offsetWidth + 'px';
            bImg.style.width = w;
            bImg.style.minWidth = w;
            bImg.style.maxWidth = w;
        }
        syncWidth();
        slider.classList.add('ba-ready');
        window.addEventListener('resize', syncWidth);

        function move(x){
            var r = slider.getBoundingClientRect();
            var pct = ((x - r.left) / r.width) * 100;
            pct = Math.max(3, Math.min(97, pct));
            clip.style.width   = pct + '%';
            line.style.left    = pct + '%';
            handle.style.left  = pct + '%';
        }

        function startDrag(x,e){ active=true; move(x); if(e) e.preventDefault(); }
        handle.addEventListener('mousedown', function(e){ startDrag(e.clientX,e); });
        line.addEventListener('mousedown', function(e){ startDrag(e.clientX,e); });
        document.addEventListener('mousemove', function(e){ if(active) move(e.clientX); });
        document.addEventListener('mouseup', function(){ active=false; });
        handle.addEventListener('touchstart', function(e){ startDrag(e.touches[0].clientX,e); }, {passive:false});
        line.addEventListener('touchstart', function(e){ startDrag(e.touches[0].clientX,e); }, {passive:false});
        document.addEventListener('touchmove', function(e){ if(active){ e.preventDefault(); move(e.touches[0].clientX); } }, {passive:false});
        document.addEventListener('touchend', function(){ active=false; });
    })();

    /* ── Mobile Hero Before/After Slider (shared across pages) ── */
    (function(){
        var slider = document.getElementById('hero-slider-mobile');
        if(!slider) return;
        var clip   = document.getElementById('mob-clip');
        var line   = document.getElementById('mob-line');
        var handle = document.getElementById('mob-handle');
        var bImg   = document.getElementById('mob-before-img');
        var active = false;

        function syncWidth(){
            var w = slider.offsetWidth + 'px';
            if(bImg){ bImg.style.width = w; bImg.style.minWidth = w; bImg.style.maxWidth = w; }
        }
        syncWidth();
        slider.classList.add('ba-ready');
        window.addEventListener('resize', syncWidth);

        function move(x){
            var r = slider.getBoundingClientRect();
            var pct = ((x - r.left) / r.width) * 100;
            pct = Math.max(3, Math.min(97, pct));
            clip.style.width   = pct + '%';
            line.style.left    = pct + '%';
            handle.style.left  = pct + '%';
        }
        function startDrag(x,e){ active=true; move(x); if(e) e.preventDefault(); }
        handle.addEventListener('mousedown', function(e){ startDrag(e.clientX,e); });
        line.addEventListener('mousedown', function(e){ startDrag(e.clientX,e); });
        document.addEventListener('mousemove', function(e){ if(active) move(e.clientX); });
        document.addEventListener('mouseup', function(){ active=false; });
        handle.addEventListener('touchstart', function(e){ startDrag(e.touches[0].clientX,e); }, {passive:false});
        line.addEventListener('touchstart', function(e){ startDrag(e.touches[0].clientX,e); }, {passive:false});
        document.addEventListener('touchmove', function(e){ if(active){ e.preventDefault(); move(e.touches[0].clientX); } }, {passive:false});
        document.addEventListener('touchend', function(){ active=false; });
    })();

    /* ── Section 2B sliders — mark ready after images load ── */
    document.querySelectorAll('.ba-slider').forEach(function(s){ s.classList.add('ba-ready'); });

    /* ── Mobile Menu ── */
    const menuBtn = document.getElementById('menu-btn');
    const menuClose = document.getElementById('menu-close');
    const mobileNav = document.getElementById('mobile-nav');

    if (menuBtn && mobileNav) {
        menuBtn.addEventListener('click', function () {
            mobileNav.classList.add('open');
            document.body.style.overflow = 'hidden';
        });
    }

    window.closeMobile = function () {
        if (mobileNav) {
            mobileNav.classList.remove('open');
            document.body.style.overflow = '';
        }
    };

    if (menuClose && mobileNav) {
        menuClose.addEventListener('click', closeMobile);
    }

    /* ── Mega Menu (Desktop) ── */
    var megaMenu = document.getElementById('mega-menu');
    var servicesBtn = document.getElementById('services-btn');
    var megaTimeout;

    window.showMega = function () {
        if (window.innerWidth < 1024) return; // Safety net: never open on mobile
        clearTimeout(megaTimeout);
        if (megaMenu) megaMenu.classList.add('open');
    };

    window.hideMega = function () {
        megaTimeout = setTimeout(function () {
            if (megaMenu) megaMenu.classList.remove('open');
        }, 200);
    };

    window.toggleMega = function () {
        if (window.innerWidth < 1024) return; // Safety net: never toggle on mobile
        if (megaMenu) megaMenu.classList.toggle('open');
    };

    // Close mega menu when clicking outside
    document.addEventListener("click", function(e) {
        if (megaMenu && megaMenu.classList.contains("open")) {
            if (!megaMenu.contains(e.target) && e.target !== servicesBtn && !servicesBtn.contains(e.target)) {
                megaMenu.classList.remove("open");
            }
        }
    });

    if (servicesBtn) {
        servicesBtn.addEventListener('mouseleave', function () {
            megaTimeout = setTimeout(function () {
                if (megaMenu && !megaMenu.matches(':hover')) {
                    megaMenu.classList.remove('open');
                }
            }, 200);
        });
    }

    /* ── Mobile Nav Accordions ── */
    window.toggleMobileAccordion = function (btn) {
        var content = btn.nextElementSibling;
        var chevron = btn.querySelector('.mobile-chevron');
        content.classList.toggle('open');
        if (chevron) {
            chevron.style.transform = content.classList.contains('open') ? 'rotate(0deg)' : 'rotate(-90deg)';
        }
    };

    /* ── FAQ Accordion ── */
    window.toggleFaq = function (btn) {
        var item = btn.parentElement;
        var isOpen = item.classList.contains('open');
        document.querySelectorAll('.faq-item').forEach(function (el) {
            el.classList.remove('open');
        });
        if (!isOpen) item.classList.add('open');
    };

    /* ── Scroll Reveal ── */
    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.reveal').forEach(function (el) {
        observer.observe(el);
    });

    /* ── GCLID Capture for Google Ads tracking ── */
    (function () {
        var params = new URLSearchParams(window.location.search);
        var gclid = params.get('gclid');
        if (gclid) {
            try { sessionStorage.setItem('timeless_gclid', gclid); } catch (e) {}
        }
    })();

    /* ── Quote Form AJAX Submission ── */
    document.querySelectorAll('.timeless-quote-form').forEach(function (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();

            var btn = form.querySelector('button[type="submit"]');
            var originalText = btn.textContent;
            btn.textContent = 'Sending...';
            btn.disabled = true;

            var formData = new FormData(form);
            formData.append('action', 'timeless_quote');
            formData.append('timeless_quote_nonce', timelessAjax.nonce);
            formData.append('source_page', document.title);

            // Append GCLID if available (Google Ads click tracking)
            var gclid = null;
            try { gclid = sessionStorage.getItem('timeless_gclid'); } catch (e) {}
            if (!gclid) {
                var params = new URLSearchParams(window.location.search);
                gclid = params.get('gclid');
            }
            if (gclid) formData.append('gclid', gclid);

            // Collect checkbox values as array
            var services = [];
            form.querySelectorAll('input[type="checkbox"]:checked').forEach(function (cb) {
                services.push(cb.parentElement.textContent.trim());
            });
            formData.append('services', services.join(', '));

            fetch(timelessAjax.url, {
                method: 'POST',
                body: formData,
                credentials: 'same-origin'
            })
            .then(function (res) { return res.json(); })
            .then(function (data) {
                if (data.success) {
                    // Replace form with success message using safe DOM methods
                    while (form.firstChild) form.removeChild(form.firstChild);
                    var successDiv = document.createElement('div');
                    successDiv.className = 'text-center py-8';
                    var icon = document.createElement('span');
                    icon.className = 'material-symbols-outlined text-4xl text-green-600 block mb-3';
                    icon.setAttribute('aria-hidden', 'true');
                    // Use the U+F0BE codepoint directly, NOT the literal name 'check_circle'.
                    // Our self-hosted Material Symbols subset has GSUB ligatures stripped
                    // (the PHP buffer filter swaps icon names → codepoints server-side).
                    // JS-injected DOM nodes are added AFTER PHP flushes the buffer, so the
                    // filter never sees them — we have to write the codepoint here directly.
                    // If you ever change this icon, update inc/material-symbols-codepoints.php
                    // and re-run scripts/audit-icons.sh + scripts/subset-material-symbols.py.
                    icon.textContent = ''; // check_circle
                    var heading = document.createElement('p');
                    heading.className = 'text-lg font-bold text-primary mb-2';
                    heading.textContent = 'Quote Request Sent!';
                    var msg = document.createElement('p');
                    msg.className = 'text-sm text-secondary';
                    msg.textContent = data.data.message;
                    successDiv.appendChild(icon);
                    successDiv.appendChild(heading);
                    successDiv.appendChild(msg);
                    form.appendChild(successDiv);
                } else {
                    btn.textContent = originalText;
                    btn.disabled = false;
                    alert(data.data.message || 'Something went wrong. Please call us directly.');
                }
            })
            .catch(function () {
                btn.textContent = originalText;
                btn.disabled = false;
                alert('Network error. Please check your connection or call us directly.');
            });
        });
    });

    /* ── Smooth Scroll for #anchor links ── */
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
        a.addEventListener('click', function (e) {
            var targetSelector = this.getAttribute('href');
            if (targetSelector && targetSelector !== '#') {
                var target = document.querySelector(targetSelector);
                if (target) {
                    e.preventDefault();
                    window.scrollTo({
                        top: target.getBoundingClientRect().top + window.pageYOffset - 80,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    /* ── Reviews carousel + Read-more modal ── */
    (function(){
        // Build star string for modal (Unicode BLACK STAR, count = rating)
        function starStr(n) {
            return '★'.repeat(Math.max(0, Math.min(5, n|0)));
        }

        // -- Carousel: arrow click + scroll snap, with WRAP-AROUND looping.
        //    With small review counts (e.g. 3 reviews + 3-up desktop layout = no overflow),
        //    a non-looping carousel would show permanently-disabled arrows. Looping keeps
        //    the UI responsive: clicking "next" at the end jumps back to start, and vice versa.
        document.querySelectorAll('.timeless-reviews-carousel').forEach(function (carousel) {
            var track = carousel.querySelector('.timeless-reviews-track');
            var prev  = carousel.querySelector('.timeless-reviews-prev');
            var next  = carousel.querySelector('.timeless-reviews-next');
            var card  = track && track.querySelector('.timeless-review-card');
            if (!track || !prev || !next || !card) return;

            // Always-enabled (loop semantics)
            prev.disabled = false;
            next.disabled = false;

            function scrollAmount() {
                var gap = parseFloat(getComputedStyle(track).gap) || 16;
                return card.offsetWidth + gap;
            }

            // Detect "no overflow" state (track.scrollWidth = track.clientWidth) — content fits.
            // In that case, looping = brief scroll animation back to 0; visually subtle but
            // confirms the click was registered.
            function atEnd() {
                return track.scrollLeft >= track.scrollWidth - track.clientWidth - 4;
            }
            function atStart() {
                return track.scrollLeft <= 4;
            }

            prev.addEventListener('click', function () {
                if (atStart()) {
                    // Wrap to end
                    track.scrollTo({ left: track.scrollWidth, behavior: 'smooth' });
                } else {
                    track.scrollBy({ left: -scrollAmount(), behavior: 'smooth' });
                }
            });
            next.addEventListener('click', function () {
                if (atEnd()) {
                    // Wrap to start
                    track.scrollTo({ left: 0, behavior: 'smooth' });
                } else {
                    track.scrollBy({ left:  scrollAmount(), behavior: 'smooth' });
                }
            });

            // Hide arrows when nothing to navigate (0 or 1 card)
            function maybeHideArrows() {
                var totalCards = track.querySelectorAll('.timeless-review-card').length;
                var bothHide = totalCards <= 1;
                prev.style.display = bothHide ? 'none' : '';
                next.style.display = bothHide ? 'none' : '';
            }
            maybeHideArrows();
            window.addEventListener('resize', maybeHideArrows);
        });

        // -- Read more button: only show when text is actually clamped, click → open modal
        document.querySelectorAll('.timeless-review-card').forEach(function (card) {
            var textEl = card.querySelector('.timeless-review-text');
            var btn    = card.querySelector('.timeless-read-more');
            if (!textEl || !btn) return;

            function checkTruncation() {
                if (textEl.scrollHeight - textEl.clientHeight > 2) {
                    btn.classList.remove('hidden');
                } else {
                    btn.classList.add('hidden');
                }
            }
            checkTruncation();
            window.addEventListener('resize', checkTruncation);

            btn.addEventListener('click', function () {
                openReviewModal(card);
            });
        });

        // Build avatar DOM safely (no innerHTML — prevents XSS from any user-controlled data)
        function buildAvatar(photoUrl, author) {
            if (photoUrl) {
                var img = document.createElement('img');
                img.src = photoUrl;
                img.alt = '';
                img.loading = 'lazy';
                img.decoding = 'async';
                img.referrerPolicy = 'no-referrer';
                img.width = 48;
                img.height = 48;
                img.className = 'w-12 h-12 rounded-full object-cover bg-primary/10';
                return img;
            }
            var div = document.createElement('div');
            div.className = 'w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold';
            div.setAttribute('aria-hidden', 'true');
            div.textContent = (author || 'G').charAt(0);
            return div;
        }

        // -- Modal: populate from card data attributes, then show with overlay
        function openReviewModal(card) {
            // Find the section's modal (usually next sibling of carousel within same parent block)
            var section = card.closest('section') || document.body;
            var modal   = section.querySelector('.timeless-review-modal') || document.querySelector('.timeless-review-modal');
            if (!modal) return;

            var author = card.getAttribute('data-author') || '';
            var time   = card.getAttribute('data-time') || '';
            var rating = parseInt(card.getAttribute('data-rating') || '5', 10);
            var photo  = card.getAttribute('data-photo') || '';
            var text   = card.getAttribute('data-text') || '';

            // textContent is safe — never interpreted as HTML
            modal.querySelector('.modal-author').textContent = author;
            modal.querySelector('.modal-time').textContent   = time;
            modal.querySelector('.modal-text').textContent   = text;
            modal.querySelector('.modal-stars').textContent  = starStr(rating);
            modal.querySelector('.modal-stars-sr').textContent = rating + ' out of 5 stars';

            // Avatar — replace existing children, then append safely-constructed element
            var avatarSlot = modal.querySelector('.modal-avatar');
            while (avatarSlot.firstChild) avatarSlot.removeChild(avatarSlot.firstChild);
            avatarSlot.appendChild(buildAvatar(photo, author));

            // Show modal (CSS handles fade-in)
            modal.classList.remove('hidden');
            modal.classList.add('flex');
            modal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
            var closeBtn = modal.querySelector('[data-close-modal]');
            if (closeBtn) closeBtn.focus();
        }

        function closeReviewModal(modal) {
            modal.classList.add('hidden');
            modal.classList.remove('flex');
            modal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        }

        // -- Close handlers (overlay click, X button, ESC key)
        document.querySelectorAll('.timeless-review-modal').forEach(function (modal) {
            modal.addEventListener('click', function (e) {
                var target = e.target;
                while (target && target !== modal) {
                    if (target.hasAttribute && target.hasAttribute('data-close-modal')) {
                        closeReviewModal(modal);
                        return;
                    }
                    target = target.parentElement;
                }
            });
        });
        document.addEventListener('keydown', function (e) {
            if (e.key !== 'Escape') return;
            document.querySelectorAll('.timeless-review-modal:not(.hidden)').forEach(closeReviewModal);
        });
    })();

});

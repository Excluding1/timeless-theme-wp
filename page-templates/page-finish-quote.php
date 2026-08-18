<?php /* Template Name: Finish Your Quote */ ?>
<?php
/**
 * CONTINUE WHERE YOU LEFT OFF — the landing page for resume links (v1.5.2, 2026-08-19)
 *
 * Why this page exists: the abandoned-quote SMS and the QR handoff both say
 * "pick up where you left off". Pointing those at /contact/ dropped the customer
 * 1,600px above the form, behind phone cards, business hours and a nav — so the
 * one thing they came to do was off screen.
 *
 * This page is the form and nothing else. No nav, no footer links, no menu: a
 * recovery link is a single-purpose page, and every extra link on it is a way out.
 * Trust cues stay (logo, ABN line, phone) because a stranger tapping an SMS link
 * needs to see who this is.
 *
 * LAYOUT IS COPIED VERBATIM from front-page.php's quote section (the centred eyebrow +
 * heading block, then the max-w-xl white rounded-2xl shadow-2xl card). It is NOT
 * re-invented here. Two reasons, both learned the hard way on the suburb pages:
 *   1. the theme's Tailwind is COMPILED AND PURGED, so a class that appears nowhere
 *      else in the theme silently does nothing;
 *   2. hand-rolled CSS drifts from the real pages — this page rendered square and
 *      left-aligned while every other embed was a centred rounded card.
 * If the front-page section changes, change it here too.
 *
 * noindex: this URL only ever arrives by SMS or QR and always carries someone's
 * draft — it must never be crawled or ranked.
 */
?><!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
<meta charset="<?php bloginfo( 'charset' ); ?>" />
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
<meta name="robots" content="noindex, nofollow" />
<title>Continue where you left off — Timeless Resurfacing</title>
<?php wp_head(); ?>
<style>
  .fq-bar{display:flex;align-items:center;gap:14px;max-width:1024px;margin:0 auto;padding:16px 24px 10px;flex-wrap:wrap}
  .fq-bar img{height:38px;width:auto;display:block}
  .fq-call{margin-left:auto;display:inline-flex;align-items:center;gap:7px;
           background:#041534;color:#fff;text-decoration:none;font-weight:700;font-size:14px;
           padding:11px 16px;min-height:44px;border-radius:10px;box-sizing:border-box}
  .fq-trust{display:flex;gap:16px;flex-wrap:wrap;justify-content:center;
            color:#595e6d;font-size:12.5px;margin:0;padding:0 24px 40px;text-align:center}
  @media (max-width:520px){ .fq-bar img{height:32px} }
</style>
</head>
<body <?php body_class( 'finish-quote' ); ?>>

<div class="fq-bar">
  <a href="<?php echo esc_url( home_url( '/' ) ); ?>" aria-label="Timeless Resurfacing home">
    <img src="<?php echo esc_url( get_template_directory_uri() . '/images/brand/tr-lockup-nav.png' ); ?>"
         alt="Timeless Resurfacing" width="217" height="44" />
  </a>
  <a class="fq-call" href="tel:<?php echo esc_attr( timeless_phone_link() ); ?>">
    Call <?php echo esc_html( timeless_phone() ); ?>
  </a>
</div>

<!-- QUOTE FORM — markup lifted verbatim from front-page.php:443-455 -->
<section class="py-16 sm:py-24 bg-surface-container-low" id="quote">
 <div class="max-w-4xl mx-auto px-6 sm:px-8 text-center mb-8">
  <span class="inline-block py-1 px-3 bg-primary text-white text-xs font-bold tracking-widest uppercase rounded-sm mb-4">Almost Done</span>
  <h1 class="text-3xl sm:text-4xl font-extrabold text-primary tracking-tight mb-4">Continue Where You Left Off</h1>
  <p class="text-secondary text-base sm:text-lg leading-relaxed" style="text-wrap:pretty;">Your answers are already filled in below. Add a few photos of the bathroom and we&rsquo;ll have your price back to you within 24 hours.<br />No&nbsp;pressure. No&nbsp;hidden&nbsp;fees. Just&nbsp;your&nbsp;bathroom, renewed.</p>
 </div>
 <div class="max-w-xl mx-auto px-6 sm:px-8">
  <div class="bg-white rounded-2xl overflow-hidden shadow-2xl">
   <div class="p-2 sm:p-4"><?php echo do_shortcode( '[timeless_quote_form]' ); ?></div>
  </div>
 </div>
</section>

<p class="fq-trust">
  <span>Sydney owned</span><span>&middot;</span>
  <span>$10M public liability</span><span>&middot;</span>
  <span>ABN <?php echo esc_html( timeless_abn() ); ?></span>
</p>

<?php wp_footer(); ?>
</body>
</html>

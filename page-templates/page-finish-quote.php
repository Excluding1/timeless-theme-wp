<?php /* Template Name: Finish Your Quote */ ?>
<?php
/**
 * FINISH YOUR QUOTE — the landing page for resume links (added v1.5.2, 2026-08-13)
 *
 * Why this page exists: the abandoned-quote SMS and the QR handoff both say
 * "pick up where you left off". Pointing those at /contact/ dropped the customer
 * 1,600px above the form, behind phone cards, business hours and a nav — so the
 * one thing they came to do was off screen.
 *
 * This page is the form and nothing else. No nav, no footer links, no menu: a
 * recovery link is a single-purpose page, and every extra link on it is a way out.
 * Trust cues stay (logo, licence-free ABN line, phone) because a stranger tapping
 * an SMS link needs to see who this is.
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
<title>Finish your quote — Timeless Resurfacing</title>
<?php wp_head(); ?>
<style>
  .fq-wrap{max-width:760px;margin:0 auto;padding:0 16px 56px}
  .fq-bar{display:flex;align-items:center;gap:14px;padding:16px 0 10px;flex-wrap:wrap}
  .fq-bar img{height:38px;width:auto;display:block}
  .fq-call{margin-left:auto;display:inline-flex;align-items:center;gap:7px;
           background:#041534;color:#fff;text-decoration:none;font-weight:700;font-size:14px;
           padding:11px 16px;min-height:44px;border-radius:10px;box-sizing:border-box}
  .fq-lede{background:#f7f9fb;border:1px solid #e4e4e7;border-radius:12px;padding:14px 16px;margin:6px 0 18px}
  .fq-lede h1{font-size:20px;margin:0 0 4px;color:#041534;letter-spacing:-.01em}
  .fq-lede p{margin:0;color:#595e6d;font-size:14px;line-height:1.5}
  .fq-trust{display:flex;gap:16px;flex-wrap:wrap;justify-content:center;
            color:#595e6d;font-size:12.5px;margin:22px 0 0;text-align:center}
  @media (max-width:520px){ .fq-bar img{height:32px} .fq-lede h1{font-size:18px} }
</style>
</head>
<body <?php body_class( 'finish-quote' ); ?>>

<div class="fq-wrap">

  <div class="fq-bar">
    <a href="<?php echo esc_url( home_url( '/' ) ); ?>" aria-label="Timeless Resurfacing home">
      <img src="<?php echo esc_url( get_template_directory_uri() . '/images/brand/tr-lockup-nav.png' ); ?>"
           alt="Timeless Resurfacing" width="217" height="44" />
    </a>
    <a class="fq-call" href="tel:<?php echo esc_attr( timeless_phone_link() ); ?>">
      Call <?php echo esc_html( timeless_phone() ); ?>
    </a>
  </div>

  <div class="fq-lede">
    <h1>Finish your quote</h1>
    <p>Your answers are already filled in below. Add a few photos of the bathroom and
       we&rsquo;ll have your price back to you within 24 hours.</p>
  </div>

  <?php echo do_shortcode( '[timeless_quote_form]' ); ?>

  <p class="fq-trust">
    <span>Sydney owned</span><span>&middot;</span>
    <span>$10M public liability</span><span>&middot;</span>
    <span>ABN <?php echo esc_html( timeless_abn() ); ?></span>
  </p>

</div>

<?php wp_footer(); ?>
</body>
</html>

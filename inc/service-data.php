<?php
/**
 * Service registry for programmatic suburb landing pages.
 *
 * Each entry maps a parent service-page slug to:
 *   - Display name (used in H1: "{Service} in {Suburb}")
 *   - Short name (lowercase, used in body copy)
 *   - Hero image (relative to /images/services/)
 *   - Lifespan + warranty figures (display strings)
 *   - 1-day service flag (drives "Same-day" badge)
 *
 * MVP: only bath-resurfacing is wired up. Add more entries to expand.
 */

defined( 'ABSPATH' ) || exit;

return array(

    'bath-resurfacing' => array(
        'name'           => 'Bath Resurfacing',
        'short_name'     => 'bath resurfacing',
        'verb'           => 'resurface',
        'noun'           => 'bath',
        'hero_image'     => 'bath-resurfacing/hero.jpg',
        'lifespan'       => 'up to 10 years',
        'warranty'       => 'Up to 3-year workmanship warranty',
        'turnaround'     => '1 day',
        'savings_pct'    => '80',
        'finish_short'   => 'high-gloss white',
        'description'    => 'Restore chipped, stained or yellowed bathtubs to factory-new condition with a professional-grade two-part acrylic system. No demolition, no plumber, finished in a single day.',
        'why_resurface'  => array(
            'Chips, cracks, and rust spots filled and smoothed',
            'Yellow staining and hard-water buildup permanently sealed under fresh coating',
            'High-gloss white finish that matches every modern bathroom',
            'Up to 80% cheaper than replacing the bath',
        ),
    ),

);

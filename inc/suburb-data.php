<?php
/**
 * Sydney suburb data for programmatic landing pages.
 *
 * Each entry drives:
 *   - URL slug (array key)
 *   - Hero copy (name, description)
 *   - Local context paragraph (housing_era, neighborhoods)
 *   - Schema.org GeoCoordinates (lat/lng)
 *   - Service-area schema (postcode, region)
 *
 * Adding a new suburb:
 *   1. Add a new entry below
 *   2. Re-activate the theme (Appearance → Themes → Activate)
 *      This triggers timeless_create_suburb_pages() which auto-creates
 *      pages for each (service × suburb) combo
 *   3. Pages live at /services/{service-slug}/{suburb-slug}/
 *
 * Quality > quantity: each suburb gets unique local context. Don't add
 * suburbs we have nothing real to say about — Google's thin-content filter
 * downranks programmatic landing pages that are 95% identical.
 */

defined( 'ABSPATH' ) || exit;

return array(

    // ─── Greater Western Sydney ─── //
    'parramatta' => array(
        'name'          => 'Parramatta',
        'postcode'      => '2150',
        'region'        => 'Western Sydney',
        'distance_km'   => 24,
        'description'   => 'Sydney\'s second CBD with a heavy concentration of 1970s-90s brick walk-up apartments and investor properties.',
        'housing_era'   => '70s-90s brick walk-ups and post-war townhouses',
        'neighborhoods' => array( 'North Parramatta', 'Harris Park', 'Westmead', 'Rosehill' ),
        'lat'           => -33.8136,
        'lng'           => 151.0034,
    ),
    'penrith' => array(
        'name'          => 'Penrith',
        'postcode'      => '2750',
        'region'        => 'Western Sydney',
        'distance_km'   => 55,
        'description'   => 'Outer western Sydney with established family homes and a strong rental market across older brick housing stock.',
        'housing_era'   => '70s-2000s family homes and townhouse complexes',
        'neighborhoods' => array( 'South Penrith', 'Cambridge Park', 'Kingswood', 'Werrington' ),
        'lat'           => -33.7510,
        'lng'           => 150.6943,
    ),
    'castle-hill' => array(
        'name'          => 'Castle Hill',
        'postcode'      => '2154',
        'region'        => 'The Hills District',
        'distance_km'   => 30,
        'description'   => 'The Hills District hub with large family homes from the 90s and 2000s now showing wear in their original bathrooms.',
        'housing_era'   => '90s-2000s detached family homes and townhouses',
        'neighborhoods' => array( 'Cherrybrook', 'West Pennant Hills', 'Glenhaven', 'Norwest' ),
        'lat'           => -33.7327,
        'lng'           => 151.0002,
    ),

    // ─── Northern Suburbs ─── //
    'chatswood' => array(
        'name'          => 'Chatswood',
        'postcode'      => '2067',
        'region'        => 'Lower North Shore',
        'distance_km'   => 10,
        'description'   => 'Upper north shore commercial centre surrounded by large 70s-80s brick walk-ups and increasingly dense newer apartments.',
        'housing_era'   => '70s-80s brick walk-up apartments',
        'neighborhoods' => array( 'Artarmon', 'Willoughby', 'Roseville', 'Lane Cove' ),
        'lat'           => -33.7969,
        'lng'           => 151.1830,
    ),
    'mosman' => array(
        'name'          => 'Mosman',
        'postcode'      => '2088',
        'region'        => 'Lower North Shore',
        'distance_km'   => 8,
        'description'   => 'Affluent harbourside suburb with heritage homes and original art deco apartments where keeping period features intact matters.',
        'housing_era'   => 'Federation, Art Deco, and 70s walk-up apartments',
        'neighborhoods' => array( 'Beauty Point', 'Spit Junction', 'Cremorne', 'Neutral Bay' ),
        'lat'           => -33.8281,
        'lng'           => 151.2398,
    ),
    'hornsby' => array(
        'name'          => 'Hornsby',
        'postcode'      => '2077',
        'region'        => 'Upper North Shore',
        'distance_km'   => 25,
        'description'   => 'Upper north shore family hub with a large stock of 70s-80s brick homes and walk-up apartments due for bathroom updates.',
        'housing_era'   => '70s-80s detached homes and brick walk-ups',
        'neighborhoods' => array( 'Asquith', 'Waitara', 'Wahroonga', 'Thornleigh' ),
        'lat'           => -33.7038,
        'lng'           => 151.0989,
    ),

    // ─── Eastern Suburbs ─── //
    'bondi' => array(
        'name'          => 'Bondi',
        'postcode'      => '2026',
        'region'        => 'Eastern Suburbs',
        'distance_km'   => 7,
        'description'   => 'Beachside eastern suburb with art deco apartments where salt air accelerates bathroom wear, and renovations are restricted by strata heritage rules.',
        'housing_era'   => 'Art Deco apartments and post-war brick units',
        'neighborhoods' => array( 'Bondi Beach', 'North Bondi', 'Bondi Junction', 'Tamarama' ),
        'lat'           => -33.8915,
        'lng'           => 151.2767,
    ),
    'surry-hills' => array(
        'name'          => 'Surry Hills',
        'postcode'      => '2010',
        'region'        => 'Inner Sydney',
        'distance_km'   => 3,
        'description'   => 'Inner-city terrace neighbourhood where many original Victorian-era bathrooms have been left untouched in otherwise renovated homes.',
        'housing_era'   => 'Victorian terraces and converted warehouse apartments',
        'neighborhoods' => array( 'Darlinghurst', 'Redfern', 'Waterloo', 'Paddington' ),
        'lat'           => -33.8842,
        'lng'           => 151.2117,
    ),

    // ─── Northern Beaches ─── //
    'manly' => array(
        'name'          => 'Manly',
        'postcode'      => '2095',
        'region'        => 'Northern Beaches',
        'distance_km'   => 12,
        'description'   => 'Northern Beaches lifestyle suburb where coastal exposure and older apartment stock make resurfacing a frequent owner request.',
        'housing_era'   => '60s-90s walk-up apartments and beachside cottages',
        'neighborhoods' => array( 'Manly Beach', 'Fairlight', 'Balgowlah', 'Seaforth' ),
        'lat'           => -33.7969,
        'lng'           => 151.2849,
    ),

    // ─── Inner West ─── //
    'strathfield' => array(
        'name'          => 'Strathfield',
        'postcode'      => '2135',
        'region'        => 'Inner West',
        'distance_km'   => 12,
        'description'   => 'Inner-west hub with a mix of large heritage homes and 70s-80s brick apartment buildings serving a multicultural community.',
        'housing_era'   => 'Federation homes and 70s-80s walk-up apartments',
        'neighborhoods' => array( 'Burwood', 'Homebush', 'Concord', 'Croydon' ),
        'lat'           => -33.8743,
        'lng'           => 151.0911,
    ),
);

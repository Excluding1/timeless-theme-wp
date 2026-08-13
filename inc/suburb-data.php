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

    // ─── ADDED v1.5.2 (2026-08-13) ───────────────────────────────────────────
    // Chosen from REAL enquiry addresses in the CRM (26 located enquiries across
    // 21 suburbs) plus the major hubs whose housing stock actually suits this work:
    // older bathrooms, high rental turnover, and owners who want an alternative to a
    // full renovation. Deliberately NOT the full Sydney suburb list — thin, near
    // identical location pages are what Google treats as doorway pages, and sites
    // have been penalised for as few as 30-40 of them. Every entry below has a real
    // housing-stock reason to exist.

    // ─── Inner West ─── //
    'marrickville' => array(
        'name'          => 'Marrickville',
        'postcode'      => '2204',
        'region'        => 'Inner West',
        'distance_km'   => 7,
        'description'   => 'Dense inner-west rental market where interwar cottages and post-war brick flats turn over often and agents need bathrooms refreshed between tenancies.',
        'housing_era'   => 'Interwar cottages and post-war red-brick flats',
        'neighborhoods' => array( 'Dulwich Hill', 'Sydenham', 'Petersham', 'Tempe' ),
        'lat'           => -33.9111,
        'lng'           => 151.1547,
    ),
    'newtown' => array(
        'name'          => 'Newtown',
        'postcode'      => '2042',
        'region'        => 'Inner West',
        'distance_km'   => 5,
        'description'   => 'Victorian terrace belt where bathrooms are small, original and often heritage-constrained, so refinishing beats the disruption of a full strip-out.',
        'housing_era'   => 'Victorian and Federation terraces with compact bathrooms',
        'neighborhoods' => array( 'Enmore', 'Erskineville', 'Camperdown', 'Stanmore' ),
        'lat'           => -33.8983,
        'lng'           => 151.1793,
    ),
    'drummoyne' => array(
        'name'          => 'Drummoyne',
        'postcode'      => '2047',
        'region'        => 'Inner West',
        'distance_km'   => 8,
        'description'   => 'Waterfront inner-west pocket of interwar brick homes and older unit blocks where bathrooms date from the 70s and 80s.',
        'housing_era'   => 'Interwar brick homes and 70s-80s unit blocks',
        'neighborhoods' => array( 'Russell Lea', 'Five Dock', 'Rodd Point', 'Abbotsford' ),
        'lat'           => -33.8523,
        'lng'           => 151.1543,
    ),

    // ─── Inner Sydney ─── //
    'pyrmont' => array(
        'name'          => 'Pyrmont',
        'postcode'      => '2009',
        'region'        => 'Inner Sydney',
        'distance_km'   => 2,
        'description'   => 'Converted warehouse apartments and 90s developments where bathrooms are original to the conversion and strata rules make demolition impractical.',
        'housing_era'   => 'Warehouse conversions and 90s apartment blocks',
        'neighborhoods' => array( 'Ultimo', 'Glebe', 'Darling Island', 'Jones Bay' ),
        'lat'           => -33.8700,
        'lng'           => 151.1950,
    ),

    // ─── Northern Sydney ─── //
    'ryde' => array(
        'name'          => 'Ryde',
        'postcode'      => '2112',
        'region'        => 'Northern Sydney',
        'distance_km'   => 13,
        'description'   => 'Large northern suburb with a heavy concentration of 60s-80s red-brick walk-ups held by investors, where a resurfaced bathroom lets a unit re-let quickly.',
        'housing_era'   => '60s-80s red-brick walk-ups and post-war homes',
        'neighborhoods' => array( 'West Ryde', 'Meadowbank', 'Denistone', 'Top Ryde' ),
        'lat'           => -33.8133,
        'lng'           => 151.1053,
    ),
    'epping' => array(
        'name'          => 'Epping',
        'postcode'      => '2121',
        'region'        => 'Northern Sydney',
        'distance_km'   => 18,
        'description'   => 'Established northern suburb where post-war family homes sit alongside newer towers, and original bathrooms are common in the older stock.',
        'housing_era'   => 'Post-war brick homes and 80s townhouses',
        'neighborhoods' => array( 'Beecroft', 'Carlingford', 'Eastwood', 'North Epping' ),
        'lat'           => -33.7726,
        'lng'           => 151.0817,
    ),
    'rhodes' => array(
        'name'          => 'Rhodes',
        'postcode'      => '2138',
        'region'        => 'Northern Sydney',
        'distance_km'   => 16,
        'description'   => 'High-density waterfront apartments with a fast rental turnover, where owners refresh bathrooms between tenants rather than renovate a strata bathroom.',
        'housing_era'   => '2000s high-rise apartments',
        'neighborhoods' => array( 'Liberty Grove', 'Concord West', 'Wentworth Point', 'Homebush Bay' ),
        'lat'           => -33.8300,
        'lng'           => 151.0870,
    ),

    // ─── Eastern Suburbs ─── //
    'randwick' => array(
        'name'          => 'Randwick',
        'postcode'      => '2031',
        'region'        => 'Eastern Suburbs',
        'distance_km'   => 7,
        'description'   => 'Eastern-suburbs rental belt of art deco and 60s-70s unit blocks near the hospitals and university, with constant tenant turnover.',
        'housing_era'   => 'Art deco and 60s-70s apartment blocks',
        'neighborhoods' => array( 'Coogee', 'Kensington', 'Queens Park', 'Clovelly' ),
        'lat'           => -33.9145,
        'lng'           => 151.2417,
    ),

    // ─── Southern Sydney ─── //
    'hurstville' => array(
        'name'          => 'Hurstville',
        'postcode'      => '2220',
        'region'        => 'Southern Sydney',
        'distance_km'   => 16,
        'description'   => 'Southern hub with a large stock of 70s-90s walk-up apartments and investor-held units where full renovation rarely stacks up.',
        'housing_era'   => '70s-90s walk-up apartments and post-war homes',
        'neighborhoods' => array( 'Kogarah', 'Beverly Hills', 'Penshurst', 'Carlton' ),
        'lat'           => -33.9675,
        'lng'           => 151.1027,
    ),
    'sutherland' => array(
        'name'          => 'Sutherland',
        'postcode'      => '2232',
        'region'        => 'Sutherland Shire',
        'distance_km'   => 26,
        'description'   => 'Shire hub of post-war brick homes and older unit blocks where owners tend to hold long and update in stages rather than all at once.',
        'housing_era'   => 'Post-war brick homes and 70s-80s units',
        'neighborhoods' => array( 'Bonnet Bay', 'Jannali', 'Kirrawee', 'Como' ),
        'lat'           => -34.0316,
        'lng'           => 151.0576,
    ),

    // ─── South West Sydney ─── //
    'liverpool' => array(
        'name'          => 'Liverpool',
        'postcode'      => '2170',
        'region'        => 'South West Sydney',
        'distance_km'   => 32,
        'description'   => 'Major south-west centre with extensive post-war housing and investor units, where budget-conscious owners want a bathroom fixed rather than replaced.',
        'housing_era'   => 'Post-war brick homes and 70s-80s units',
        'neighborhoods' => array( 'Lurnea', 'Casula', 'Moorebank', 'Warwick Farm' ),
        'lat'           => -33.9203,
        'lng'           => 150.9236,
    ),
    'bankstown' => array(
        'name'          => 'Bankstown',
        'postcode'      => '2200',
        'region'        => 'South West Sydney',
        'distance_km'   => 22,
        'description'   => 'Long-established south-west suburb where post-war homes and older walk-ups still carry their original coloured tiles and baths.',
        'housing_era'   => 'Post-war homes with original 60s-70s bathrooms',
        'neighborhoods' => array( 'Punchbowl', 'Yagoona', 'Condell Park', 'Greenacre' ),
        'lat'           => -33.9171,
        'lng'           => 151.0345,
    ),
    'cabramatta' => array(
        'name'          => 'Cabramatta',
        'postcode'      => '2166',
        'region'        => 'South West Sydney',
        'distance_km'   => 30,
        'description'   => 'South-west centre with a large stock of post-war homes and townhouses, often owner-occupied long term with bathrooms well past their original finish.',
        'housing_era'   => 'Post-war homes and 80s townhouses',
        'neighborhoods' => array( 'Canley Vale', 'Canley Heights', 'Lansvale', 'Fairfield' ),
        'lat'           => -33.8948,
        'lng'           => 150.9356,
    ),

    // ─── Western Sydney ─── //
    'blacktown' => array(
        'name'          => 'Blacktown',
        'postcode'      => '2148',
        'region'        => 'Western Sydney',
        'distance_km'   => 35,
        'description'   => 'Large western centre of post-war and 80s project homes where a resurfaced bathroom is a fraction of a full renovation.',
        'housing_era'   => 'Post-war and 80s project homes',
        'neighborhoods' => array( 'Seven Hills', 'Prospect', 'Kings Langley', 'Doonside' ),
        'lat'           => -33.7688,
        'lng'           => 150.9063,
    ),
);

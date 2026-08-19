<?php
/**
 * Suburb page pipeline — run from wp-admin or WP-CLI.
 *
 * Creates /areas/{slug}/ pages from inc/suburb-data.php in small batches, assigns the
 * area template, and reports what is still outstanding. Batched deliberately: creating
 * more than ~8 pages in one request kills wp-now locally, and is slow on shared hosting.
 *
 * Usage:  /?tr_build_suburbs=1          create the next batch
 *         /?tr_build_suburbs=1&n=20     bigger batch (careful)
 *         /?tr_build_suburbs=status     report only, create nothing
 */
add_action( 'init', function () {
    if ( ! isset( $_GET['tr_build_suburbs'] ) || ! current_user_can( 'manage_options' ) ) { return; }

    $subs  = include get_template_directory() . '/inc/suburb-data.php';
    $areas = get_page_by_path( 'areas' );
    header( 'Content-Type: application/json' );
    if ( ! $areas ) { echo wp_json_encode( array( 'error' => 'no /areas/ page' ) ); exit; }

    $built = array(); $todo = array();
    foreach ( array_keys( $subs ) as $slug ) {
        ( get_page_by_path( 'areas/' . $slug ) ) ? $built[] = $slug : $todo[] = $slug;
    }

    if ( $_GET['tr_build_suburbs'] === 'status' ) {
        echo wp_json_encode( array( 'total' => count( $subs ), 'built' => count( $built ),
                                    'remaining' => count( $todo ), 'next' => array_slice( $todo, 0, 10 ) ) );
        exit;
    }

    $n = min( 20, max( 1, (int) ( $_GET['n'] ?? 8 ) ) );
    $made = array();
    foreach ( array_slice( $todo, 0, $n ) as $slug ) {
        $title = 'Bathroom Resurfacing in ' . $subs[ $slug ]['name'];
        $old   = get_page_by_path( 'services/bath-resurfacing/' . $slug );
        $id    = $old ? $old->ID : wp_insert_post( array(
            'post_title' => $title, 'post_name' => $slug,
            'post_status' => 'publish', 'post_type' => 'page',
        ) );
        if ( is_wp_error( $id ) || ! $id ) { continue; }
        wp_update_post( array( 'ID' => $id, 'post_parent' => $areas->ID,
                               'post_name' => $slug, 'post_title' => $title ) );
        update_post_meta( $id, '_wp_page_template', 'page-templates/page-area-suburb.php' );
        $made[] = $slug;
    }
    flush_rewrite_rules();
    echo wp_json_encode( array( 'created' => $made, 'remaining' => count( $todo ) - count( $made ) ) );
    exit;
} );

<?php
/**
 * Plugin Name: BRANDED Search
 * Description: Public REST endpoint that exposes WooCommerce products for the unified site search
 * Version: 1.0
 * Author: Orest Polavskyi
 */

if ( ! defined( 'ABSPATH' ) ) exit;

/* CORS — allow the corporate site (Live Server) to call this endpoint */
add_action( 'init', function () {
    $uri     = isset( $_SERVER['REQUEST_URI'] ) ? $_SERVER['REQUEST_URI'] : '';
    $origin  = isset( $_SERVER['HTTP_ORIGIN'] ) ? $_SERVER['HTTP_ORIGIN'] : '';
    $allowed = [ 'http://127.0.0.1:5500', 'http://localhost:5500' ];

    if ( strpos( $uri, '/wp-json/branded-search/v1/products' ) === false ) {
        return;
    }
    if ( ! in_array( $origin, $allowed, true ) ) {
        return;
    }

    header( 'Access-Control-Allow-Origin: ' . $origin );
    header( 'Access-Control-Allow-Methods: GET, OPTIONS' );
    header( 'Access-Control-Allow-Headers: Content-Type' );

    if ( isset( $_SERVER['REQUEST_METHOD'] ) && $_SERVER['REQUEST_METHOD'] === 'OPTIONS' ) {
        status_header( 200 );
        exit;
    }
} );

/* register the REST route */
add_action( 'rest_api_init', function () {
    register_rest_route( 'branded-search/v1', '/products', [
        'methods'             => 'GET',
        'permission_callback' => '__return_true',
        'callback'            => 'branded_search_products',
    ] );
} );

function branded_search_products() {
    if ( ! function_exists( 'wc_get_products' ) ) {
        return new WP_REST_Response( [], 200 );
    }

    $products = wc_get_products( [
        'status' => 'publish',
        'limit'  => -1,
    ] );

    $out = [];
    foreach ( $products as $product ) {
        // prefer short description, fall back to start of full description
        $short = wp_strip_all_tags( $product->get_short_description() );
        if ( $short === '' ) {
            $full  = wp_strip_all_tags( $product->get_description() );
            $short = mb_strlen( $full ) > 160
                        ? mb_substr( $full, 0, 157 ) . '…'
                        : $full;
        }

        $out[] = [
            'title' => $product->get_name(),
            'desc'  => $short,
            'href'  => get_permalink( $product->get_id() ),
            'type'  => 'product',
        ];
    }

    return new WP_REST_Response( $out, 200 );
}

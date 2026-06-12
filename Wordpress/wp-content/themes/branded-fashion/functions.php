<?php
/**
 * BRANDED Fashion — child theme functions
 * Author: Orest Polavskyi
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

/* enqueue styles and scripts */
function branded_enqueue_styles() {

    wp_enqueue_style(
        'branded-inter',
        'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap',
        array(),
        null
    );

    wp_enqueue_style(
        'storefront-style',
        get_template_directory_uri() . '/style.css',
        array(),
        wp_get_theme( 'storefront' )->get( 'Version' )
    );

    // tokens.css must load before branded.css
    wp_enqueue_style(
        'branded-tokens',
        get_stylesheet_directory_uri() . '/assets/css/tokens.css',
        array( 'storefront-style' ),
        wp_get_theme()->get( 'Version' )
    );

    wp_enqueue_style(
        'branded-style',
        get_stylesheet_directory_uri() . '/assets/css/branded.css',
        array( 'branded-tokens' ),
        wp_get_theme()->get( 'Version' )
    );

    if ( function_exists( 'is_product' ) && is_product() ) {
        wp_enqueue_script(
            'branded-pdp',
            get_stylesheet_directory_uri() . '/assets/js/branded-pdp.js',
            array(),
            wp_get_theme()->get( 'Version' ),
            true
        );
    }

    wp_enqueue_script(
        'branded-search',
        get_stylesheet_directory_uri() . '/assets/js/site-search.js',
        array(),
        wp_get_theme()->get( 'Version' ),
        true
    );
}
add_action( 'wp_enqueue_scripts', 'branded_enqueue_styles', 20 );


/* remove Storefront defaults we don't want */

// remove "Built with Storefront & WooCommerce." from footer
add_action( 'init', function () {
    remove_action( 'storefront_footer', 'storefront_credit', 20 );
} );

// homepage sections are not used
add_action( 'init', function () {
    remove_action( 'homepage', 'storefront_homepage_content', 10 );
    remove_action( 'homepage', 'storefront_product_categories', 20 );
    remove_action( 'homepage', 'storefront_recent_products', 30 );
    remove_action( 'homepage', 'storefront_featured_products', 40 );
    remove_action( 'homepage', 'storefront_popular_products', 50 );
    remove_action( 'homepage', 'storefront_on_sale_products', 60 );
    remove_action( 'homepage', 'storefront_best_selling_products', 70 );
} );


/* theme support */
add_action( 'after_setup_theme', function () {
    add_theme_support( 'woocommerce' );
    add_theme_support( 'wc-product-gallery-zoom' );
    add_theme_support( 'wc-product-gallery-lightbox' );
    add_theme_support( 'wc-product-gallery-slider' );

    register_nav_menus( array(
        'primary' => __( 'Primary Menu', 'branded-fashion' ),
    ) );
} );


/* cart count badge — updates via WC AJAX fragments without full page reload */
add_filter( 'woocommerce_add_to_cart_fragments', function ( $fragments ) {
    ob_start();
    $count = WC()->cart ? WC()->cart->get_cart_contents_count() : 0;
    ?>
    <span class="branded-header__cart-count" aria-label="<?php echo esc_attr( $count . ' items in cart' ); ?>">
        <?php echo esc_html( $count ); ?>
    </span>
    <?php
    $fragments['span.branded-header__cart-count'] = ob_get_clean();
    return $fragments;
} );


/* WooCommerce tweaks */

// show discount percentage on sale badge instead of generic "Sale!"
add_filter( 'woocommerce_sale_flash', function ( $html, $post, $product ) {
    if ( ! $product->is_on_sale() ) {
        return $html;
    }
    $percentages = array();
    if ( $product->is_type( 'variable' ) ) {
        foreach ( $product->get_children() as $variation_id ) {
            $variation = wc_get_product( $variation_id );
            if ( ! $variation ) continue;
            $regular = (float) $variation->get_regular_price();
            $sale    = (float) $variation->get_sale_price();
            if ( $regular > 0 && $sale > 0 ) {
                $percentages[] = round( ( ( $regular - $sale ) / $regular ) * 100 );
            }
        }
    } else {
        $regular = (float) $product->get_regular_price();
        $sale    = (float) $product->get_sale_price();
        if ( $regular > 0 && $sale > 0 ) {
            $percentages[] = round( ( ( $regular - $sale ) / $regular ) * 100 );
        }
    }
    if ( empty( $percentages ) ) {
        return $html;
    }
    $max = max( $percentages );
    return '<span class="onsale">-' . esc_html( $max ) . '%</span>';
}, 10, 3 );

// Move price below product title on PDP (already default, kept for clarity)
// Remove default Storefront sticky add-to-cart on mobile if it ever causes issues
// add_action( 'init', function () {
//     remove_action( 'storefront_before_footer', 'storefront_sticky_single_add_to_cart' );
// } );

// Change "Add to cart" labels to UPPERCASE-friendly text (CSS handles transform anyway)
// add_filter( 'woocommerce_product_add_to_cart_text', function ( $text ) {
//     return __( 'Add to cart', 'branded-fashion' );
// } );

/* image quality — WP defaults to 82% which looked blurry on hi-DPI screens */
add_filter( 'jpeg_quality', function() { return 100; } );
add_filter( 'wp_editor_set_quality', function() { return 100; } );

// larger image in the shop catalog grid
add_filter( 'woocommerce_get_image_size_thumbnail', function( $size ) {
    return array(
        'width'  => 600,
        'height' => 800,
        'crop'   => 1,
    );
} );

add_filter( 'woocommerce_get_image_size_single', function( $size ) {
    return array(
        'width'  => 800,
        'height' => 1066,
        'crop'   => 1,
    );
} );


/* delivery & returns block on PDP, placed after add-to-cart (priority 35) */
add_action( 'woocommerce_single_product_summary', function () {
    ?>
    <div class="branded-delivery-returns">
        <h4 class="branded-delivery-returns__heading">Delivery &amp; Returns</h4>
        <ul class="branded-delivery-returns__list">
            <li>Standard delivery: 3–5 business days (free on orders over 150 EUR)</li>
            <li>Express delivery: 1–2 business days</li>
            <li>30-day returns from the date of delivery</li>
            <li>Ships within the EU only</li>
        </ul>
    </div>
    <?php
}, 35 );


/* category filter dropdown — sits between result count and ordering select */
add_action( 'woocommerce_before_shop_loop', function () {
    $terms = get_terms( array(
        'taxonomy'   => 'product_cat',
        'hide_empty' => true,
    ) );

    if ( is_wp_error( $terms ) || empty( $terms ) ) {
        return;
    }

    $shop_url    = get_permalink( wc_get_page_id( 'shop' ) );
    $current_obj = is_product_category() ? get_queried_object() : null;
    ?>
    <div class="branded-category-filter">
        <select
            class="branded-category-filter__select"
            onchange="window.location=this.value;"
            aria-label="<?php esc_attr_e( 'Filter by category', 'branded-fashion' ); ?>"
        >
            <option value="<?php echo esc_url( $shop_url ); ?>"<?php selected( ! $current_obj ); ?>>
                <?php esc_html_e( 'All categories', 'branded-fashion' ); ?>
            </option>
            <?php foreach ( $terms as $term ) :
                if ( 'uncategorized' === $term->slug ) {
                    continue;
                }
                $url = get_term_link( $term );
                if ( is_wp_error( $url ) ) {
                    continue;
                }
            ?>
            <option
                value="<?php echo esc_url( $url ); ?>"
                <?php selected( $current_obj && $current_obj->term_id === $term->term_id ); ?>
            ><?php echo esc_html( $term->name ); ?></option>
            <?php endforeach; ?>
        </select>
    </div>
    <?php
}, 25 );

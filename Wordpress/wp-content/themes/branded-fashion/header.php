<?php
/**
 * Custom header — replaces Storefront's default.
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}
?><!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
<meta charset="<?php bloginfo( 'charset' ); ?>">
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="profile" href="https://gmpg.org/xfn/11">

<?php wp_head(); ?>
</head>

<body <?php body_class(); ?>>

<?php
// needed for plugin compatibility (e.g. cookie consent)
if ( function_exists( 'wp_body_open' ) ) {
    wp_body_open();
}
?>

<a class="skip-link screen-reader-text" href="#site-content"><?php esc_html_e( 'Skip to content', 'branded-fashion' ); ?></a>

<div id="page" class="hfeed site">

    <!-- BRANDED CUSTOM HEADER -->
    <header class="branded-header" role="banner">
        <div class="branded-header__inner">

            <a href="http://127.0.0.1:5500/Website/index.html"
               class="branded-header__logo"
               aria-label="<?php echo esc_attr( get_bloginfo( 'name' ) ); ?> — home">
                <span class="branded-header__logo-mark" aria-hidden="true"></span>
                <span>FASHION</span>
            </a>

            <?php
            // use the menu from WP admin if set, otherwise show fallback links
            if ( has_nav_menu( 'primary' ) ) {
                wp_nav_menu( array(
                    'theme_location' => 'primary',
                    'container'      => false,
                    'menu_class'     => 'branded-nav',
                    'depth'          => 1,
                    'fallback_cb'    => false,
                ) );
            } else { ?>
                <ul class="branded-nav">
                    <li><a href="<?php echo esc_url( home_url( '/shop/' ) ); ?>">Shop</a></li>
                    <li><a href="<?php echo esc_url( home_url( '/about/' ) ); ?>">About</a></li>
                    <li><a href="<?php echo esc_url( home_url( '/guides/' ) ); ?>">Guides</a></li>
                    <li><a href="<?php echo esc_url( home_url( '/contact/' ) ); ?>">Contact</a></li>
                </ul>
            <?php } ?>

            <div class="branded-header__actions">

                <!-- Search -->
                <button type="button"
                        class="branded-header__icon"
                        aria-label="Search"
                        onclick="document.getElementById('branded-search-overlay').classList.toggle('is-open');">
                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="11" cy="11" r="7"/>
                        <path d="m20 20-3.5-3.5" stroke-linecap="round"/>
                    </svg>
                </button>

                <!-- Account -->
                <a href="<?php echo esc_url( wc_get_account_endpoint_url( 'dashboard' ) ); ?>"
                   class="branded-header__icon"
                   aria-label="Account">
                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="8" r="4"/>
                        <path d="M4 21c0-4 4-7 8-7s8 3 8 7" stroke-linecap="round"/>
                    </svg>
                </a>

                <!-- Cart -->
                <a href="<?php echo esc_url( wc_get_cart_url() ); ?>"
                   class="branded-header__icon"
                   aria-label="Cart">
                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5 7h14l-1.5 12a2 2 0 0 1-2 1.8h-7a2 2 0 0 1-2-1.8L5 7Z" stroke-linejoin="round"/>
                        <path d="M9 7V5a3 3 0 1 1 6 0v2" stroke-linecap="round"/>
                    </svg>
                    <span class="branded-header__cart-count"
                          aria-label="<?php echo esc_attr( ( WC()->cart ? WC()->cart->get_cart_contents_count() : 0 ) . ' items in cart' ); ?>">
                        <?php echo esc_html( WC()->cart ? WC()->cart->get_cart_contents_count() : 0 ); ?>
                    </span>
                </a>

                <!-- Mobile menu toggle -->
                <button type="button"
                        class="branded-header__menu-toggle"
                        aria-label="Open menu"
                        aria-expanded="false"
                        aria-controls="branded-mobile-nav"
                        onclick="
                            var n = document.getElementById('branded-mobile-nav');
                            var open = n.classList.toggle('is-open');
                            this.setAttribute('aria-expanded', open ? 'true' : 'false');
                            this.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
                        ">
                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="1.5">
                        <path d="M4 6h16M4 12h16M4 18h16" stroke-linecap="round"/>
                    </svg>
                </button>
            </div>
        </div>

        <!-- Promo bar -->
        <div class="branded-promo" role="note">
            <?php esc_html_e( 'Free shipping on orders over €150 — Free returns within 30 days', 'branded-fashion' ); ?>
        </div>

        <!-- Mobile nav (toggled) -->
        <?php
        if ( has_nav_menu( 'primary' ) ) {
            wp_nav_menu( array(
                'theme_location' => 'primary',
                'container'      => false,
                'menu_id'        => 'branded-mobile-nav',
                'menu_class'     => 'branded-nav-mobile',
                'depth'          => 1,
                'fallback_cb'    => false,
            ) );
        } else { ?>
            <ul id="branded-mobile-nav" class="branded-nav-mobile">
                <li><a href="<?php echo esc_url( home_url( '/shop/' ) ); ?>">Shop</a></li>
                <li><a href="<?php echo esc_url( home_url( '/about/' ) ); ?>">About</a></li>
                <li><a href="<?php echo esc_url( home_url( '/guides/' ) ); ?>">Guides</a></li>
                <li><a href="<?php echo esc_url( home_url( '/contact/' ) ); ?>">Contact</a></li>
            </ul>
        <?php } ?>
    </header>

    <div id="content" class="site-content" tabindex="-1">
        <div class="col-full">

            <?php
            do_action( 'storefront_content_top' );

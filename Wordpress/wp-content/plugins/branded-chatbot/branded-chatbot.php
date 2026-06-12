<?php
/**
 * Plugin Name: BRANDED Chatbot
 * Description: AI customer-support chatbot proxy for the BRANDED store
 * Version: 1.0
 * Author: Orest Polavskyi
 */

if ( ! defined( 'ABSPATH' ) ) exit;

define( 'BRANDED_CHATBOT_MODEL', 'gpt-4o-mini' );

/* system prompt — static part (product list is appended dynamically) */
define( 'BRANDED_CHATBOT_PROMPT_BASE', <<<'PROMPT_BASE'
You are the customer-support assistant for BRANDED, a premium fashion clothing store. Be friendly, concise, and helpful. Keep replies to 2-4 short sentences unless the customer asks for more detail.

== HOW TO HELP ==
You can answer questions about products, shipping, returns, payment, sizing, and garment care. When a product or guide is relevant, recommend it and include its link so the customer can go straight there. Always include the full link in plain text (e.g. http://diploma.local/product/...). Recommend at most 2-3 items per reply so it stays readable.

== IMPORTANT RULES ==
- Do NOT state specific prices. Prices and stock change, so for price and availability always direct the customer to the product page link.
- Do NOT invent products, categories, or guides that are not in the lists below.
- If you do not know something, say so and suggest contacting support or browsing the shop: http://diploma.local/shop/
- If a question is unrelated to BRANDED or shopping, politely steer back to how you can help with the store.

== SHIPPING (EU only) ==
- Standard Delivery: 10 EUR, arrives in 3-5 business days.
- Express Delivery: 25 EUR, arrives in 1-2 business days.
- Free Shipping: automatically available on orders over 150 EUR.
- BRANDED ships within the European Union only.

== RETURNS & EXCHANGES ==
- 30-day return window from the date of delivery.
- Exchanges are available — a customer can exchange an item for a different size; suggest they contact support to arrange it.
- Refunds are issued to the original payment method after the returned item is inspected.

== PAYMENT ==
- Card payments (Visa, Mastercard and others) processed securely via Stripe.

== SIZING ==
- Tops, knitwear, outerwear, dresses use sizes XS, S, M, L, XL.
- Trousers and jeans use numeric waist sizes 28, 30, 32, 34, 36.
- For fit help, point customers to the Finding Your Fit guide (link in the guides list).

== CONTACT ==
- Support email: branded.fashion.diploma@gmail.com
- Customers can also use the contact form: http://127.0.0.1:5500/Website/pages/contact.html

== ORDER TRACKING ==
When a customer asks about their order (e.g. "where is my order", "track my order", "what is my order status"), you must collect TWO pieces of information before saying anything about a specific order:
  1. Their order number (e.g. #1234)
  2. The email address they used when placing the order
Ask for whichever of the two is missing. Never reveal any order status or details without both.

Once the customer has provided both, the system will look up the order and pass you the result. If the result is provided, describe the status in friendly, natural language — do NOT repeat the raw status word. Use the meanings below as a guide; phrase things in your own words:
  - pending    → the order was placed but payment has not been confirmed yet; once it clears the order will be prepared.
  - processing → the order is paid and is actively being picked and packed at the warehouse.
  - on-hold    → the order is on hold, usually awaiting payment confirmation; the team will be in touch if anything is needed.
  - completed  → the order has been shipped; the customer should check their email for a courier message with tracking details.
  - cancelled  → the order has been cancelled; suggest contacting support if this is unexpected.
  - refunded   → the order has been refunded.

If the system tells you no order was found matching that number and email, politely say you could not find a matching order and ask the customer to double-check both the order number and the email address used at checkout.

== PRODUCT CATALOGUE ==
PROMPT_BASE
);

/* guides and closing instruction — appended after the dynamic product list */
define( 'BRANDED_CHATBOT_PROMPT_TAIL', <<<'PROMPT_TAIL'

== Guides & informational pages (on the corporate site):
  - Style Guides overview [http://127.0.0.1:5500/Website/pages/guides.html]
  - Transitional Dressing — layering between seasons [http://127.0.0.1:5500/Website/pages/guides/transitional-dressing.html]
  - How to Care for Natural Fibres — washing/storing wool, cashmere, linen, cotton [http://127.0.0.1:5500/Website/pages/guides/care-natural-fibres.html]
  - Building a Tonal Wardrobe — working with a narrow colour palette [http://127.0.0.1:5500/Website/pages/guides/tonal-wardrobe.html]
  - Finding Your Fit — size guide and how each cut fits [http://127.0.0.1:5500/Website/pages/guides/finding-fit.html]
  - What We Are Wearing This Season — seasonal style notes [http://127.0.0.1:5500/Website/pages/guides/this-season.html]
  - Buying Less, Choosing Better — reducing wardrobe waste [http://127.0.0.1:5500/Website/pages/guides/buying-less.html]
  - The Capsule Wardrobe — ten essential pieces [http://127.0.0.1:5500/Website/pages/guides/capsule-wardrobe.html]
  - About BRANDED [http://127.0.0.1:5500/Website/pages/about.html]
  - Shipping & Returns [http://127.0.0.1:5500/Website/pages/shipping-returns.html]
  - Privacy & Cookies [http://127.0.0.1:5500/Website/pages/privacy-cookies.html]
  - Contact [http://127.0.0.1:5500/Website/pages/contact.html]

When recommending, match the customer's need to the right product or guide and give the link. For example, if someone asks about caring for a wool coat, point them to the "How to Care for Natural Fibres" guide. If someone wants a warm coat, recommend items from the Outerwear category with their links.
PROMPT_TAIL
);

add_action( 'rest_api_init', function () {
    register_rest_route( 'branded-chatbot/v1', '/chat', [
        'methods'             => 'POST',
        'permission_callback' => '__return_true',
        'callback'            => 'branded_chatbot_handle',
    ] );
} );

/* CORS — same approach as branded-search */
add_action( 'init', function () {
    $uri     = isset( $_SERVER['REQUEST_URI'] ) ? $_SERVER['REQUEST_URI'] : '';
    $origin  = isset( $_SERVER['HTTP_ORIGIN'] ) ? $_SERVER['HTTP_ORIGIN'] : '';
    $allowed = [ 'http://127.0.0.1:5500', 'http://localhost:5500' ];

    if ( strpos( $uri, '/wp-json/branded-chatbot/v1/chat' ) === false ) {
        return;
    }
    if ( ! in_array( $origin, $allowed, true ) ) {
        return;
    }

    header( 'Access-Control-Allow-Origin: ' . $origin );
    header( 'Access-Control-Allow-Methods: POST, OPTIONS' );
    header( 'Access-Control-Allow-Headers: Content-Type' );

    if ( isset( $_SERVER['REQUEST_METHOD'] ) && $_SERVER['REQUEST_METHOD'] === 'OPTIONS' ) {
        status_header( 200 );
        exit;
    }
} );

add_action( 'wp_enqueue_scripts', function () {
    wp_enqueue_script(
        'branded-chatbot-widget',
        plugin_dir_url( __FILE__ ) . 'chatbot.js',
        [],
        '1.0',
        true
    );
} );

/* build the product catalogue section of the system prompt from WooCommerce */
function branded_chatbot_build_catalogue() {
    if ( ! function_exists( 'wc_get_products' ) ) {
        return '(Product catalogue unavailable — WooCommerce not active.)';
    }

    $products = wc_get_products( [ 'status' => 'publish', 'limit' => -1 ] );
    if ( empty( $products ) ) {
        return '(No published products found.)';
    }

    // group each product under its first non-Uncategorized category
    $groups = [];
    foreach ( $products as $product ) {
        $terms = get_the_terms( $product->get_id(), 'product_cat' );
        $cat   = 'Other';
        if ( $terms && ! is_wp_error( $terms ) ) {
            foreach ( $terms as $term ) {
                if ( strtolower( $term->name ) !== 'uncategorized' ) {
                    $cat = $term->name;
                    break;
                }
            }
        }
        $groups[ $cat ][] = $product;
    }

    // order groups by WooCommerce category menu_order
    $ordered_terms = get_terms( [
        'taxonomy'   => 'product_cat',
        'hide_empty' => true,
        'orderby'    => 'menu_order',
        'order'      => 'ASC',
    ] );
    $cat_order = [];
    if ( ! is_wp_error( $ordered_terms ) ) {
        foreach ( $ordered_terms as $t ) {
            if ( strtolower( $t->name ) !== 'uncategorized' ) {
                $cat_order[] = $t->name;
            }
        }
    }
    $final_order = array_merge(
        $cat_order,
        array_diff( array_keys( $groups ), $cat_order )
    );

    $lines = [];
    foreach ( $final_order as $cat_name ) {
        if ( ! isset( $groups[ $cat_name ] ) ) {
            continue;
        }
        $lines[] = $cat_name . ':';
        foreach ( $groups[ $cat_name ] as $product ) {
            $name  = $product->get_name();
            $short = wp_strip_all_tags( $product->get_short_description() );
            if ( $short === '' ) {
                $full  = wp_strip_all_tags( $product->get_description() );
                $short = mb_strlen( $full ) > 120
                            ? mb_substr( $full, 0, 117 ) . '…'
                            : $full;
            }
            $line    = '  - ' . $name;
            $line   .= $short !== '' ? ' — ' . $short : '';
            $line   .= ' [' . get_permalink( $product->get_id() ) . ']';
            $lines[] = $line;
        }
    }

    return implode( "\n", $lines );
}

/* chat endpoint callback */
function branded_chatbot_handle( WP_REST_Request $request ) {
    $body    = $request->get_json_params();
    $message = isset( $body['message'] ) ? trim( $body['message'] ) : '';
    $history = isset( $body['history'] ) && is_array( $body['history'] ) ? $body['history'] : [];

    if ( $message === '' ) {
        return new WP_REST_Response( [ 'error' => 'message is required.' ], 400 );
    }

    if ( ! defined( 'OPENAI_API_KEY' ) ) {
        return new WP_REST_Response( [ 'error' => 'Chatbot is not configured.' ], 500 );
    }

    $system_prompt = BRANDED_CHATBOT_PROMPT_BASE . "\n" . branded_chatbot_build_catalogue() . "\n\n" . BRANDED_CHATBOT_PROMPT_TAIL;
    $messages = [ [ 'role' => 'system', 'content' => $system_prompt ] ];

    foreach ( $history as $turn ) {
        if ( isset( $turn['role'], $turn['content'] ) &&
             in_array( $turn['role'], [ 'user', 'assistant' ], true ) &&
             is_string( $turn['content'] ) ) {
            $messages[] = [ 'role' => $turn['role'], 'content' => $turn['content'] ];
        }
    }

    // scan conversation for order number + email, then inject order status if found
    $full_text = $message;
    foreach ( $history as $turn ) {
        if ( isset( $turn['content'] ) && is_string( $turn['content'] ) ) {
            $full_text .= ' ' . $turn['content'];
        }
    }

    $order_num = null;
    if ( preg_match( '/#(\d{1,8})/', $full_text, $m ) ) {
        $order_num = (int) $m[1];
    } elseif ( preg_match( '/\border\b[^0-9]{0,30}?(\d{1,8})/i', $full_text, $m ) ) {
        $order_num = (int) $m[1];
    }

    $email = null;
    if ( preg_match( '/[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/', $full_text, $m ) ) {
        $email = $m[0];
    }

    if ( $order_num && $email && function_exists( 'wc_get_order' ) ) {
        $order = wc_get_order( $order_num );
        if ( $order && strtolower( $order->get_billing_email() ) === strtolower( $email ) ) {
            $items = [];
            foreach ( $order->get_items() as $item ) {
                $items[] = $item->get_name();
            }
            $order_ctx = 'ORDER LOOKUP RESULT (server-verified — use this to answer the customer): '
                . 'Order #' . $order_num . ' — '
                . 'Status: ' . $order->get_status() . ' | '
                . 'Date: ' . ( $order->get_date_created() ? $order->get_date_created()->date( 'Y-m-d' ) : 'unknown' ) . ' | '
                . 'Items: ' . implode( ', ', $items ) . '.';
        } else {
            $order_ctx = 'ORDER LOOKUP RESULT: No order found matching #' . $order_num
                       . ' with email ' . $email . '. Tell the customer politely.';
        }
        $messages[] = [ 'role' => 'system', 'content' => $order_ctx ];
    }

    $messages[] = [ 'role' => 'user', 'content' => $message ];

    $response = wp_remote_post( 'https://api.openai.com/v1/chat/completions', [
        'timeout' => 30,
        'headers' => [
            'Authorization' => 'Bearer ' . OPENAI_API_KEY,
            'Content-Type'  => 'application/json',
        ],
        'body' => wp_json_encode( [
            'model'       => BRANDED_CHATBOT_MODEL,
            'messages'    => $messages,
            'max_tokens'  => 400,
            'temperature' => 0.5,
        ] ),
    ] );

    if ( is_wp_error( $response ) ) {
        return new WP_REST_Response( [ 'error' => 'Could not reach the AI service.' ], 502 );
    }

    if ( wp_remote_retrieve_response_code( $response ) !== 200 ) {
        return new WP_REST_Response( [ 'error' => 'AI service returned an error.' ], 502 );
    }

    $data  = json_decode( wp_remote_retrieve_body( $response ), true );
    $reply = $data['choices'][0]['message']['content'] ?? '';

    if ( $reply === '' ) {
        return new WP_REST_Response( [ 'error' => 'Empty response from AI service.' ], 502 );
    }

    return new WP_REST_Response( [ 'reply' => $reply ], 200 );
}

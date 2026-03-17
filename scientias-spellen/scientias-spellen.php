<?php
/**
 * Plugin Name:  Scientias Spellen
 * Plugin URI:   https://scientias.nl
 * Description:  Interactieve wetenschapsspellen — maak edities per artikel via de beheerpagina.
 * Version:      2.0.2
 * Author:       Scientias.nl
 * Text Domain:  scientias-spellen
 * Requires PHP: 7.4
 */

if ( ! defined( 'ABSPATH' ) ) exit;

define( 'SCSP_VERSION', '2.0.2' );
define( 'SCSP_DIR',     plugin_dir_path( __FILE__ ) );
define( 'SCSP_URL',     plugin_dir_url( __FILE__ ) );

define( 'SCSP_MAX_IMPORT_BYTES', 5 * 1024 * 1024 );
define( 'SCSP_MAX_QUESTIONS', 100 );
define( 'SCSP_MAX_TEXT_LENGTH', 500 );
define( 'SCSP_MAX_EXPLANATION_LENGTH', 2000 );

register_activation_hook( __FILE__, 'scsp_activate_plugin' );
register_deactivation_hook( __FILE__, 'scsp_deactivate_plugin' );
add_action( 'init', 'scsp_maybe_upgrade' );

function scsp_get_capabilities() {
    return [
        'edit_post'              => 'edit_scsp_editie',
        'read_post'              => 'read_scsp_editie',
        'delete_post'            => 'delete_scsp_editie',
        'edit_posts'             => 'edit_scsp_edities',
        'edit_others_posts'      => 'edit_others_scsp_edities',
        'publish_posts'          => 'publish_scsp_edities',
        'read_private_posts'     => 'read_private_scsp_edities',
        'delete_posts'           => 'delete_scsp_edities',
        'delete_private_posts'   => 'delete_private_scsp_edities',
        'delete_published_posts' => 'delete_published_scsp_edities',
        'delete_others_posts'    => 'delete_others_scsp_edities',
        'edit_private_posts'     => 'edit_private_scsp_edities',
        'edit_published_posts'   => 'edit_published_scsp_edities',
        'create_posts'           => 'edit_scsp_edities',
    ];
}

function scsp_add_role_caps() {
    $caps = array_unique( array_values( scsp_get_capabilities() ) );
    foreach ( [ 'administrator', 'editor' ] as $role_name ) {
        $role = get_role( $role_name );
        if ( ! $role ) {
            continue;
        }

        foreach ( $caps as $cap ) {
            $role->add_cap( $cap );
        }
    }
}

function scsp_remove_role_caps() {
    $caps = array_unique( array_values( scsp_get_capabilities() ) );
    foreach ( [ 'administrator', 'editor' ] as $role_name ) {
        $role = get_role( $role_name );
        if ( ! $role ) {
            continue;
        }

        foreach ( $caps as $cap ) {
            $role->remove_cap( $cap );
        }
    }
}

function scsp_activate_plugin() {
    scsp_register_cpt();
    scsp_add_role_caps();
    update_option( 'scsp_version', SCSP_VERSION );
    flush_rewrite_rules();
}

function scsp_deactivate_plugin() {
    scsp_remove_role_caps();
    flush_rewrite_rules();
}

function scsp_maybe_upgrade() {
    if ( get_option( 'scsp_version' ) === SCSP_VERSION ) {
        return;
    }

    scsp_add_role_caps();
    update_option( 'scsp_version', SCSP_VERSION );
}

function scsp_limit_text( $value, $max_length = SCSP_MAX_TEXT_LENGTH ) {
    $value = is_scalar( $value ) ? (string) $value : '';
    $value = sanitize_text_field( $value );
    if ( function_exists( 'mb_substr' ) ) {
        return mb_substr( $value, 0, $max_length );
    }

    return substr( $value, 0, $max_length );
}

function scsp_limit_textarea( $value, $max_length = SCSP_MAX_EXPLANATION_LENGTH ) {
    $value = is_scalar( $value ) ? (string) $value : '';
    $value = sanitize_textarea_field( $value );
    if ( function_exists( 'mb_substr' ) ) {
        return mb_substr( $value, 0, $max_length );
    }

    return substr( $value, 0, $max_length );
}

function scsp_sanitize_icon( $value ) {
    $icon = scsp_limit_text( $value, 20 );
    return $icon !== '' ? $icon : '🔬';
}

function scsp_validate_and_sanitize_questions( $raw, $type ) {
    if ( ! is_string( $raw ) ) {
        return new WP_Error( 'invalid_payload', 'Ongeldige payload ontvangen.' );
    }

    if ( strlen( $raw ) > SCSP_MAX_IMPORT_BYTES ) {
        return new WP_Error( 'payload_too_large', 'De ingevoerde JSON is groter dan 5 MB.' );
    }

    $decoded = json_decode( $raw, true );
    if ( ! is_array( $decoded ) ) {
        return new WP_Error( 'invalid_json', 'De ingevoerde JSON bevat geen geldige array.' );
    }

    if ( count( $decoded ) > SCSP_MAX_QUESTIONS ) {
        return new WP_Error( 'too_many_questions', sprintf( 'Maximaal %d items toegestaan per editie.', SCSP_MAX_QUESTIONS ) );
    }

    $clean = [];

    foreach ( $decoded as $item ) {
        if ( ! is_array( $item ) ) {
            continue;
        }

        if ( $type === 'quiz' ) {
            $options = array_values( array_slice( (array) ( $item['options'] ?? [] ), 0, 4 ) );
            $options = array_map( static function( $option ) {
                return scsp_limit_text( $option );
            }, $options );

            while ( count( $options ) < 4 ) {
                $options[] = '';
            }

            $clean[] = [
                'category'    => scsp_limit_text( $item['category'] ?? '' ),
                'question'    => scsp_limit_textarea( $item['question'] ?? '', 1000 ),
                'options'     => $options,
                'correct'     => max( 0, min( 3, intval( $item['correct'] ?? 0 ) ) ),
                'explanation' => scsp_limit_textarea( $item['explanation'] ?? '' ),
            ];
        } else {
            $clean[] = [
                'icon'        => scsp_sanitize_icon( $item['icon'] ?? '🔬' ),
                'statement'   => scsp_limit_textarea( $item['statement'] ?? '', 1000 ),
                'answer'      => wp_validate_boolean( $item['answer'] ?? true ),
                'explanation' => scsp_limit_textarea( $item['explanation'] ?? '' ),
            ];
        }
    }

    return $clean;
}

function scsp_set_admin_notice( $post_id, $message, $type = 'error' ) {
    if ( $post_id <= 0 || $message === '' ) {
        return;
    }

    set_transient( 'scsp_notice_' . absint( $post_id ) . '_' . get_current_user_id(), [
        'message' => sanitize_text_field( $message ),
        'type'    => $type === 'success' ? 'success' : 'error',
    ], MINUTE_IN_SECONDS );
}

add_action( 'admin_notices', 'scsp_render_admin_notice' );
function scsp_render_admin_notice() {
    $screen = function_exists( 'get_current_screen' ) ? get_current_screen() : null;
    if ( ! $screen || $screen->post_type !== 'scsp_editie' ) {
        return;
    }

    $post_id = isset( $_GET['post'] ) ? absint( $_GET['post'] ) : 0;
    if ( $post_id <= 0 ) {
        return;
    }

    $key = 'scsp_notice_' . $post_id . '_' . get_current_user_id();
    $notice = get_transient( $key );
    if ( ! is_array( $notice ) || empty( $notice['message'] ) ) {
        return;
    }

    delete_transient( $key );
    $class = ! empty( $notice['type'] ) && $notice['type'] === 'success' ? 'notice-success' : 'notice-error';
    echo '<div class="notice ' . esc_attr( $class ) . ' is-dismissible"><p>' . esc_html( $notice['message'] ) . '</p></div>';
}

// =============================================================================
// 1. CUSTOM POST TYPE  —  Spel Edities
// =============================================================================

add_action( 'init', 'scsp_register_cpt' );
function scsp_register_cpt() {
    register_post_type( 'scsp_editie', [
        'labels' => [
            'name'               => 'Spel Edities',
            'singular_name'      => 'Spel Editie',
            'menu_name'          => 'Spellen',
            'add_new'            => 'Nieuwe editie',
            'add_new_item'       => 'Nieuwe spel-editie maken',
            'edit_item'          => 'Editie bewerken',
            'view_item'          => 'Editie bekijken',
            'all_items'          => 'Alle edities',
            'search_items'       => 'Edities zoeken',
            'not_found'          => 'Geen edities gevonden.',
            'not_found_in_trash' => 'Geen edities in de prullenbak.',
        ],
        'public'          => false,
        'show_ui'         => true,
        'show_in_menu'    => true,
        'menu_icon'       => 'dashicons-games',
        'menu_position'   => 25,
        'supports'        => [ 'title' ],
        'has_archive'     => false,
        'map_meta_cap'    => true,
        'capability_type' => [ 'scsp_editie', 'scsp_edities' ],
        'capabilities'    => scsp_get_capabilities(),
    ] );
}

// =============================================================================
// 2. ADMIN COLUMNS  —  toon speltype + shortcode direct in de lijst
// =============================================================================

add_filter( 'manage_scsp_editie_posts_columns',       'scsp_admin_columns' );
add_action( 'manage_scsp_editie_posts_custom_column', 'scsp_admin_column_content', 10, 2 );

function scsp_admin_columns( $cols ) {
    $new = [];
    foreach ( $cols as $k => $v ) {
        $new[ $k ] = $v;
        if ( $k === 'title' ) {
            $new['scsp_type']      = 'Speltype';
            $new['scsp_vragen']    = 'Vragen';
            $new['scsp_shortcode'] = 'Shortcode';
        }
    }
    return $new;
}

function scsp_admin_column_content( $column, $post_id ) {
    $type      = get_post_meta( $post_id, '_scsp_game_type', true ) ?: 'quiz';
    $questions = json_decode( get_post_meta( $post_id, '_scsp_questions', true ) ?: '[]', true );
    $slug      = get_post_field( 'post_name', $post_id );
    $labels    = [ 'quiz' => '🧪 Wetenschapsquiz', 'feit' => '🔬 Feit of Fabel' ];

    switch ( $column ) {
        case 'scsp_type':
            echo esc_html( $labels[ $type ] ?? $type );
            break;
        case 'scsp_vragen':
            $count = is_array( $questions ) ? count( $questions ) : 0;
            echo esc_html( $count . ( $count === 1 ? ' vraag' : ' vragen' ) );
            break;
        case 'scsp_shortcode':
            if ( $slug ) {
                $sc = '[scientias_spellen editie="' . esc_attr( $slug ) . '"]';
                echo '<code style="font-size:11px;user-select:all">' . esc_html( $sc ) . '</code>';
            } else {
                echo '<em style="color:#aaa">Eerst opslaan</em>';
            }
            break;
    }
}

// =============================================================================
// 3. META BOXES
// =============================================================================

add_action( 'add_meta_boxes', 'scsp_register_meta_boxes' );
function scsp_register_meta_boxes() {
    add_meta_box(
        'scsp_instellingen',
        '⚙️ Instellingen &amp; Shortcode',
        'scsp_render_settings_box',
        'scsp_editie',
        'side',
        'high'
    );
    add_meta_box(
        'scsp_questions_box',
        '📝 Vragen / Uitspraken',
        'scsp_render_questions_box',
        'scsp_editie',
        'normal',
        'high'
    );
}

// ---- Settings meta box -------------------------------------------------------
function scsp_render_settings_box( $post ) {
    wp_nonce_field( 'scsp_save_' . $post->ID, 'scsp_nonce' );

    $type = get_post_meta( $post->ID, '_scsp_game_type', true ) ?: 'quiz';
    $slug = get_post_field( 'post_name', $post->ID );
    $sc   = $slug ? '[scientias_spellen editie="' . esc_attr( $slug ) . '"]' : '';
    ?>
    <table class="form-table" style="margin:0">
        <tr>
            <th style="padding:8px 0 4px"><label for="scsp_game_type">Speltype</label></th>
            <td style="padding:8px 0 4px">
                <select name="scsp_game_type" id="scsp_game_type" style="width:100%">
                    <option value="quiz" <?php selected( $type, 'quiz' ); ?>>🧪 Wetenschapsquiz</option>
                    <option value="feit" <?php selected( $type, 'feit' ); ?>>🔬 Feit of Fabel</option>
                </select>
                <p class="description" id="scsp-type-hint" style="margin-top:4px"></p>
            </td>
        </tr>
        <?php if ( $sc ) : ?>
        <tr>
            <th style="padding:8px 0 4px">Shortcode</th>
            <td style="padding:8px 0 4px">
                <code id="scsp-sc-code" style="display:block;padding:6px 8px;background:#f0f0f1;border-radius:4px;font-size:11px;word-break:break-all"><?php echo esc_html( $sc ); ?></code>
                <button type="button" id="scsp-copy-btn"
                    onclick="navigator.clipboard.writeText(document.getElementById('scsp-sc-code').textContent).then(()=>{this.textContent='✓ Gekopieerd!';setTimeout(()=>this.textContent='📋 Kopieer shortcode',2000)})"
                    style="margin-top:6px;font-size:12px">
                    📋 Kopieer shortcode
                </button>
                <p class="description" style="margin-top:4px">Plak deze code in elk artikel.</p>
            </td>
        </tr>
        <?php else : ?>
        <tr>
            <td colspan="2">
                <p class="description">Sla de editie eerst op om de shortcode te zien.</p>
            </td>
        </tr>
        <?php endif; ?>
    </table>
    <?php
}

// ---- Questions meta box ------------------------------------------------------
function scsp_render_questions_box( $post ) {
    $type      = get_post_meta( $post->ID, '_scsp_game_type', true ) ?: 'quiz';
    $questions = get_post_meta( $post->ID, '_scsp_questions', true ) ?: '[]';
    ?>
    <div id="scsp-builder-wrap">
        <div id="scsp-builder"></div>

        <div class="scsp-toolbar">
            <button type="button" id="scsp-add-btn" class="button button-primary">
                + Vraag toevoegen
            </button>

            <button type="button" id="scsp-import-btn" class="button"
                    title="Importeer vragen vanuit een JSON-bestand">
                📂 JSON importeren
            </button>
            <input type="file" id="scsp-json-import" accept=".json" style="display:none">

            <button type="button" id="scsp-export-btn" class="button"
                    title="Download de huidige vragen als JSON-bestand">
                ⬇ Exporteren
            </button>

            <button type="button" id="scsp-sample-btn" class="button scsp-sample-toggle">
                📄 Voorbeeldformaat
            </button>
        </div>

        <p class="description" id="scsp-count-hint" style="margin-top:6px"></p>
        <div id="scsp-import-feedback" style="margin-top:6px"></div>

        <div id="scsp-sample-panel" style="display:none;margin-top:12px">
            <div class="scsp-sample-inner">
                <div class="scsp-sample-tabs">
                    <button type="button" class="scsp-stab active" data-tab="quiz">🧪 Quiz</button>
                    <button type="button" class="scsp-stab" data-tab="feit">🔬 Feit of Fabel</button>
                </div>
                <pre id="scsp-sample-code" class="scsp-sample-code"></pre>
                <p class="description" style="margin-top:6px">
                    Sla dit formaat op als <code>.json</code>-bestand en importeer het via de knop hierboven.
                    Alle velden zijn verplicht behalve <code>category</code> (quiz) en <code>icon</code> (feit).
                </p>
            </div>
        </div>
    </div>

    <input type="hidden" id="scsp_questions_json" name="scsp_questions_json"
           value="<?php echo esc_attr( $questions ); ?>">
    <input type="hidden" id="scsp_game_type_mirror" value="<?php echo esc_attr( $type ); ?>">
    <?php
}

// =============================================================================
// 4. SAVE POST
// =============================================================================

add_action( 'save_post_scsp_editie', 'scsp_save_post', 10, 2 );
function scsp_save_post( $post_id, $post ) {
    if ( ! isset( $_POST['scsp_nonce'] ) ) return;
    if ( ! wp_verify_nonce( $_POST['scsp_nonce'], 'scsp_save_' . $post_id ) ) return;
    if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) return;
    if ( wp_is_post_revision( $post_id ) ) return;
    if ( ! current_user_can( 'edit_post', $post_id ) ) return;

    // Game type
    $allowed_types = [ 'quiz', 'feit' ];
    $type = sanitize_key( $_POST['scsp_game_type'] ?? 'quiz' );
    if ( ! in_array( $type, $allowed_types, true ) ) $type = 'quiz';
    update_post_meta( $post_id, '_scsp_game_type', $type );

    // Questions JSON — validate before saving
    $raw = wp_unslash( $_POST['scsp_questions_json'] ?? '[]' );
    $clean = scsp_validate_and_sanitize_questions( $raw, $type );

    if ( is_wp_error( $clean ) ) {
        scsp_set_admin_notice( $post_id, $clean->get_error_message() );
        return;
    }

    update_post_meta( $post_id, '_scsp_questions', wp_json_encode( $clean, JSON_UNESCAPED_UNICODE | JSON_HEX_TAG ) );
}

// =============================================================================
// 5. ADMIN ASSETS
// =============================================================================

add_action( 'admin_enqueue_scripts', 'scsp_admin_assets' );
function scsp_admin_assets( $hook ) {
    global $post;
    if ( ! in_array( $hook, [ 'post.php', 'post-new.php' ], true ) ) return;
    if ( ! $post || $post->post_type !== 'scsp_editie' ) return;

    wp_enqueue_style(  'scsp-admin', SCSP_URL . 'admin/admin.css', [], SCSP_VERSION );
    wp_enqueue_script( 'scsp-admin', SCSP_URL . 'admin/admin.js',  [], SCSP_VERSION, true );
}

// =============================================================================
// 6. FRONTEND ASSETS
// =============================================================================

add_action( 'wp_enqueue_scripts', 'scsp_register_frontend_assets' );
function scsp_register_frontend_assets() {
    wp_register_style(
        'scientias-spellen-style',
        SCSP_URL . 'assets/style.css',
        [],
        SCSP_VERSION
    );
    wp_register_script(
        'scientias-spellen-script',
        SCSP_URL . 'assets/games.js',
        [],
        SCSP_VERSION,
        true
    );
    wp_register_style(
        'scientias-spellen-fonts',
        SCSP_URL . 'assets/fonts/fonts.css',
        [],
        SCSP_VERSION
    );
}

// =============================================================================
// 7. SHORTCODE  [scientias_spellen]  /  [scientias_spellen editie="slug"]
// =============================================================================

add_shortcode( 'scientias_spellen', 'scsp_shortcode' );
function scsp_shortcode( $atts ) {
    $atts = shortcode_atts( [
        'editie' => '',
        'hoogte' => '',
    ], $atts, 'scientias_spellen' );

    wp_enqueue_style(  'scientias-spellen-fonts' );
    wp_enqueue_style(  'scientias-spellen-style' );
    wp_enqueue_script( 'scientias-spellen-script' );

    // ---- Resolve edition data ------------------------------------------------
    $edition_data = null;
    $active_games = [ 'quiz', 'feit', 'elementen' ]; // default: show all

    if ( ! empty( $atts['editie'] ) ) {
        $ep = get_page_by_path( sanitize_title( $atts['editie'] ), OBJECT, 'scsp_editie' );
        if ( $ep && $ep->post_status === 'publish' ) {
            $game_type = get_post_meta( $ep->ID, '_scsp_game_type', true ) ?: 'quiz';
            $questions = json_decode( get_post_meta( $ep->ID, '_scsp_questions', true ) ?: '[]', true );

            $edition_data = [
                'type'      => $game_type,
                'title'     => $ep->post_title,
                'subtitle'  => 'Speciaal samengesteld bij dit artikel',
                'questions' => is_array( $questions ) ? $questions : [],
            ];
            $active_games = [ $game_type ]; // only show this game
        }
    }

    // ---- Inline script to pass edition data to JS ---------------------------
    if ( $edition_data !== null ) {
        wp_add_inline_script(
            'scientias-spellen-script',
            'window.scspEditionData = ' . wp_json_encode( $edition_data, JSON_UNESCAPED_UNICODE | JSON_HEX_TAG ) . ';',
            'before'
        );
    }

    // ---- Wrapper style -------------------------------------------------------
    $wrapper_style = 'position:relative;';
    if ( ! empty( $atts['hoogte'] ) ) {
        $height = min( absint( $atts['hoogte'] ), 2000 );
        if ( $height > 0 ) {
            $wrapper_style .= 'min-height:' . $height . 'px;';
        }
    }

    // ---- Build hidden-game CSS -----------------------------------------------
    $hidden_games_css = '';
    $all_games = [ 'quiz', 'feit', 'elementen' ];
    $hidden = array_diff( $all_games, $active_games );
    foreach ( $hidden as $g ) {
        $hidden_games_css .= '.game-card[data-game="' . esc_attr( $g ) . '"]{display:none!important;}';
    }

    ob_start();
    ?>
    <div id="scsp-wrapper" style="<?php echo esc_attr( $wrapper_style ); ?>">
    <?php if ( $hidden_games_css ) : ?>
    <style><?php echo $hidden_games_css; // safe: built from whitelist ?></style>
    <?php endif; ?>

    <div class="stars" id="stars"></div>
    <div id="app">

      <!-- HOME -->
      <div id="screen-home" class="screen active">
        <header class="home-header">
          <div class="logo-badge">⚛</div>
          <h1 id="scsp-main-title">Wetenschaps<span>spellen</span></h1>
          <p id="scsp-main-subtitle">Test en vergroot jouw wetenschapskennis</p>
          <div class="high-scores-link" onclick="showHighScores()">🏆 Highscores</div>
        </header>
        <div class="game-grid">
          <div class="game-card" data-game="quiz" onclick="startGame('quiz')">
            <div class="card-glow cyan"></div>
            <div class="card-icon">🧪</div>
            <h2>Wetenschapsquiz</h2>
            <p>10 vragen over biologie, scheikunde, sterrenkunde en meer</p>
            <div class="card-meta">
              <span class="tag">⏱ ~5 min</span>
              <span class="tag">❓ 10 vragen</span>
            </div>
            <div class="highscore-badge" id="hs-quiz"></div>
            <button class="btn-play cyan">Spelen →</button>
          </div>
          <div class="game-card" data-game="feit" onclick="startGame('feit')">
            <div class="card-glow purple"></div>
            <div class="card-icon">🔬</div>
            <h2>Feit of Fabel</h2>
            <p>Weet jij welke wetenschappelijke beweringen waar zijn?</p>
            <div class="card-meta">
              <span class="tag">⏱ ~3 min</span>
              <span class="tag">✓✗ 15 uitspraken</span>
            </div>
            <div class="highscore-badge" id="hs-feit"></div>
            <button class="btn-play purple">Spelen →</button>
          </div>
          <div class="game-card" data-game="elementen" onclick="startGame('elementen')">
            <div class="card-glow green"></div>
            <div class="card-icon">⚗️</div>
            <h2>Elementen Match</h2>
            <p>Ken jij de symbolen van de chemische elementen?</p>
            <div class="card-meta">
              <span class="tag">⏱ ~4 min</span>
              <span class="tag">🧬 15 elementen</span>
            </div>
            <div class="highscore-badge" id="hs-elementen"></div>
            <button class="btn-play green">Spelen →</button>
          </div>
        </div>
        <footer class="home-footer">
          <span>Een initiatief van</span>
          <strong>Scientias.nl</strong>
        </footer>
      </div>

      <!-- QUIZ -->
      <div id="screen-quiz" class="screen">
        <div class="game-topbar">
          <button class="btn-back" onclick="goHome()">← Terug</button>
          <div class="progress-wrap">
            <div class="progress-bar"><div class="progress-fill cyan" id="quiz-bar"></div></div>
            <span class="progress-text" id="quiz-progress">1 / 10</span>
          </div>
          <div class="score-chip cyan">⚡ <span id="quiz-score">0</span></div>
        </div>
        <div id="quiz-content" class="game-body"></div>
      </div>

      <!-- FEIT OF FABEL -->
      <div id="screen-feit" class="screen">
        <div class="game-topbar">
          <button class="btn-back" onclick="goHome()">← Terug</button>
          <div class="progress-wrap">
            <div class="progress-bar"><div class="progress-fill purple" id="feit-bar"></div></div>
            <span class="progress-text" id="feit-progress">1 / 15</span>
          </div>
          <div class="score-chip purple">⚡ <span id="feit-score">0</span></div>
        </div>
        <div id="feit-content" class="game-body"></div>
      </div>

      <!-- ELEMENTEN MATCH -->
      <div id="screen-elementen" class="screen">
        <div class="game-topbar">
          <button class="btn-back" onclick="goHome()">← Terug</button>
          <div class="progress-wrap">
            <div class="progress-bar"><div class="progress-fill green" id="elementen-bar"></div></div>
            <span class="progress-text" id="elementen-progress">1 / 15</span>
          </div>
          <div class="score-chip green">⚡ <span id="elementen-score">0</span></div>
        </div>
        <div id="elementen-content" class="game-body"></div>
      </div>

      <!-- RESULTATEN -->
      <div id="screen-results" class="screen">
        <div class="results-body" id="results-content"></div>
      </div>

      <!-- HIGHSCORES -->
      <div id="screen-highscores" class="screen">
        <div class="game-body centered">
          <button class="btn-back" onclick="goHome()" style="align-self:flex-start;margin-bottom:1rem">← Terug</button>
          <h2 style="font-family:'Space Grotesk',sans-serif;font-size:1.8rem;margin-bottom:2rem">🏆 Highscores</h2>
          <div id="hs-table"></div>
        </div>
      </div>

    </div><!-- #app -->
    </div><!-- #scsp-wrapper -->
    <?php
    return ob_get_clean();
}

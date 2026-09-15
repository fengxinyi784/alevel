// supabase-config.js
(function () {
    window.SUPABASE_URL = 'https://ugtdibfbpanltfvkpxro.supabase.co';
    window.SUPABASE_ANON_KEY = 'sb_publishable_8eDda8zkFy9RvDbFQDQf6A_4zn9vsJe';

    if (!window.supabase || !window.supabase.createClient) {
        console.error('[supabase-config] Supabase SDK 未加载，请先引入 CDN 脚本');
        return;
    }

    if (!window.supabaseClient) {
        window.supabaseClient = window.supabase.createClient(
            window.SUPABASE_URL,
            window.SUPABASE_ANON_KEY
        );
    }
})();
// ========== 全站统一顶部导航栏脚本 ==========
(function () {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => mobileMenu.classList.add('hidden'));
        });
    }

    const currentFile = (() => {
        const p = window.location.pathname;
        const file = p.substring(p.lastIndexOf('/') + 1) || 'index.html';
        return file.toLowerCase();
    })();

    document.querySelectorAll('.nav-link').forEach(link => {
        const href = (link.getAttribute('href') || '').toLowerCase();
        link.classList.toggle('active', href === currentFile);
    });

    document.querySelectorAll('#mobile-menu a').forEach(link => {
        const href = (link.getAttribute('href') || '').toLowerCase();
        link.classList.toggle('nav-active', href === currentFile);
    });
})();

// ========== 个人主页下拉菜单 ==========
(function setupProfileDropdown() {
    // ⭐ 复用全局客户端（由 supabase-config.js 创建），不再自己创建

    const profileLink = document.querySelector('.nav-link[href="profile.html"]');
    if (!profileLink) return;
    if (profileLink.closest('.nav-profile-wrapper')) return;

    if (!document.getElementById('nav-profile-styles')) {
        const style = document.createElement('style');
        style.id = 'nav-profile-styles';
        style.textContent = `
            .nav-profile-wrapper { position: relative; display: inline-block; }
            .nav-profile-dropdown {
                position: absolute; top: calc(100% + 10px); right: 0;
                min-width: 148px;
                background: #FFFFFF;
                border: 2px solid #E5E5E5;
                border-radius: 14px;
                box-shadow: 0 12px 28px rgba(0, 0, 0, 0.08);
                padding: 6px;
                opacity: 0; visibility: hidden;
                transform: translateY(-6px);
                transition: opacity 0.2s ease, transform 0.2s ease, visibility 0.2s;
                z-index: 100;
            }
            .nav-profile-wrapper:hover .nav-profile-dropdown,
            .nav-profile-wrapper:focus-within .nav-profile-dropdown {
                opacity: 1; visibility: visible; transform: translateY(0);
            }
            .nav-profile-dropdown::before {
                content: ''; position: absolute; top: -7px; right: 20px;
                width: 12px; height: 12px; background: #FFFFFF;
                border-left: 2px solid #E5E5E5; border-top: 2px solid #E5E5E5;
                transform: rotate(45deg); border-radius: 2px 0 0 0;
            }
            .nav-profile-dropdown::after {
                content: ''; position: absolute; top: -12px; left: 0; right: 0; height: 12px;
            }
            .nav-dropdown-item {
                display: block; width: 100%;
                padding: 9px 14px; border-radius: 10px;
                font-size: 0.86rem; font-weight: 700;
                color: #3C3C3C; text-decoration: none;
                background: transparent; border: none; text-align: left;
                cursor: pointer;
                transition: background 0.15s ease, color 0.15s ease;
                font-family: inherit; letter-spacing: 0.01em; white-space: nowrap;
            }
            /* ⭐ 悬停时变成主题绿色（原来是橙色） */
            .nav-dropdown-item:hover { background: #F0F9E8; color: #58CC02; }
            .nav-dropdown-item.logout:hover { background: #FFF0F0; color: #E03B3B; }
        `;
        document.head.appendChild(style);
    }

    const wrapper = document.createElement('div');
    wrapper.className = 'nav-profile-wrapper';
    profileLink.parentNode.insertBefore(wrapper, profileLink);
    wrapper.appendChild(profileLink);

    const dropdown = document.createElement('div');
    dropdown.className = 'nav-profile-dropdown';
    dropdown.id = 'profile-dropdown';
    wrapper.appendChild(dropdown);

    function initDropdown(supabaseClient) {
        async function updateDropdown() {
            try {
                const { data: { user } } = await supabaseClient.auth.getUser();
                if (user) {
                    dropdown.innerHTML = `
                        <a href="profile.html" class="nav-dropdown-item">个人主页</a>
                        <button type="button" id="logout-menu-btn" class="nav-dropdown-item logout">登出</button>
                    `;
                    document.getElementById('logout-menu-btn')?.addEventListener('click', async (e) => {
                        e.preventDefault();
                        await supabaseClient.auth.signOut();
                        window.location.href = 'index.html';
                    });
                } else {
                    dropdown.innerHTML = `<a href="login.html" class="nav-dropdown-item">登录</a>`;
                }
            } catch (err) {
                console.warn('更新下拉菜单失败:', err);
            }
        }
        updateDropdown();
        supabaseClient.auth.onAuthStateChange(() => setTimeout(updateDropdown, 0));
    }

    // ⭐ 直接复用全局客户端
    if (window.supabaseClient) {
        initDropdown(window.supabaseClient);
    } else {
        // 兜底：如果 supabase-config.js 未加载或加载较慢，等待一会再尝试
        const waitClient = setInterval(() => {
            if (window.supabaseClient) {
                clearInterval(waitClient);
                initDropdown(window.supabaseClient);
            }
        }, 50);
        // 最多等待 5 秒
        setTimeout(() => clearInterval(waitClient), 5000);
    }
})();

// ========== Duolingo 风格弹窗（橘猫形象 · 鼠标响应版） ==========
(function setupDuoDialogs() {

    const CAT_AVATAR_SVG = `
        <svg class="duo-cat-avatar" viewBox="0 0 100 96" xmlns="http://www.w3.org/2000/svg">
            <g class="duo-cat-ear-left">
                <path d="M 22 38 Q 16 22 22 14 Q 30 10 36 22 Q 40 28 44 34 Z"
                      fill="#F4A261" stroke="#D07B3F" stroke-width="2" stroke-linejoin="round"/>
                <path d="M 25 34 Q 21 24 25 19 Q 30 16 33 24 Q 35 28 37 32 Z"
                      fill="#FFB6A3" opacity="0.75"/>
            </g>
            <g class="duo-cat-ear-right">
                <path d="M 78 38 Q 84 22 78 14 Q 70 10 64 22 Q 60 28 56 34 Z"
                      fill="#F4A261" stroke="#D07B3F" stroke-width="2" stroke-linejoin="round"/>
                <path d="M 75 34 Q 79 24 75 19 Q 70 16 67 24 Q 65 28 63 32 Z"
                      fill="#FFB6A3" opacity="0.75"/>
            </g>
            <ellipse cx="50" cy="54" rx="36" ry="34" fill="#F4A261" stroke="#D07B3F" stroke-width="2"/>
            <path d="M 42 26 Q 46 18 50 24 Q 54 16 58 26"
                  fill="none" stroke="#D07B3F" stroke-width="2.2" stroke-linecap="round"/>
            <g stroke="#D07B3F" stroke-width="2" stroke-linecap="round" opacity="0.75">
                <path d="M 44 32 L 44 38"/>
                <path d="M 50 30 L 50 36"/>
                <path d="M 56 32 L 56 38"/>
            </g>
            <ellipse cx="24" cy="66" rx="7" ry="3.5" fill="#FF8FA8" opacity="0.55"/>
            <ellipse cx="76" cy="66" rx="7" ry="3.5" fill="#FF8FA8" opacity="0.55"/>
            <g class="duo-cat-eye-left">
                <ellipse cx="38" cy="52" rx="8" ry="10" fill="#FFFFFF" stroke="#D07B3F" stroke-width="1.4"/>
                <g class="duo-cat-pupil-left">
                    <circle cx="38" cy="54" r="5" fill="#2A1F1A"/>
                    <circle cx="40" cy="51" r="1.8" fill="#FFFFFF"/>
                </g>
            </g>
            <g class="duo-cat-eye-right">
                <ellipse cx="62" cy="52" rx="8" ry="10" fill="#FFFFFF" stroke="#D07B3F" stroke-width="1.4"/>
                <g class="duo-cat-pupil-right">
                    <circle cx="62" cy="54" r="5" fill="#2A1F1A"/>
                    <circle cx="64" cy="51" r="1.8" fill="#FFFFFF"/>
                </g>
            </g>
            <path d="M 50 64 L 46 68 L 54 68 Z"
                  fill="#FF8FA8" stroke="#D07B3F" stroke-width="0.8" stroke-linejoin="round"/>
            <path d="M 50 68 Q 50 74 44 75"
                  fill="none" stroke="#7A4B2A" stroke-width="1.8" stroke-linecap="round"/>
            <path d="M 50 68 Q 50 74 56 75"
                  fill="none" stroke="#7A4B2A" stroke-width="1.8" stroke-linecap="round"/>
        </svg>
    `;

    const BADGE_ICONS = {
        info:    `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="11" width="14" height="10" rx="2.5"/><path d="M8 11V7.5a4 4 0 0 1 8 0V11"/></svg>`,
        warn:    `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3 2.5 20h19L12 3z"/><path d="M12 10v4"/></svg>`,
        error:   `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M8 8l8 8M16 8l-8 8"/></svg>`,
        success: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 13l4 4L19 7"/></svg>`
    };

    if (!document.getElementById('duo-confirm-styles')) {
        const style = document.createElement('style');
        style.id = 'duo-confirm-styles';
        style.textContent = `
            .duo-confirm-overlay {
                position: fixed; inset: 0; z-index: 10001;
                background: rgba(60, 60, 60, 0.45);
                backdrop-filter: blur(6px);
                -webkit-backdrop-filter: blur(6px);
                display: flex; align-items: center; justify-content: center;
                padding: 24px 16px;
                opacity: 0; pointer-events: none;
                transition: opacity 0.28s ease;
            }
            .duo-confirm-overlay.open { opacity: 1; pointer-events: auto; }

            .duo-confirm-card {
                background: #FFFFFF;
                border: 2px solid #E5E5E5;
                border-bottom: 5px solid #E5E5E5;
                border-radius: 24px;
                padding: 20px 28px 24px;
                max-width: 400px; width: 100%;
                text-align: center;
                box-shadow: 0 24px 60px rgba(0, 0, 0, 0.15);
                transform: translateY(24px) scale(0.92);
                transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
                position: relative;
            }
            .duo-confirm-overlay.open .duo-confirm-card {
                transform: translateY(0) scale(1);
            }

            .duo-confirm-icon {
                width: 116px;
                height: 116px;
                margin: -12px auto 8px;
                position: relative;
                animation: duoIconPop 0.75s cubic-bezier(0.34, 1.56, 0.64, 1);
            }
            @keyframes duoIconPop {
                0%   { transform: scale(0.3) rotate(-12deg); opacity: 0; }
                60%  { transform: scale(1.08) rotate(4deg); opacity: 1; }
                100% { transform: scale(1) rotate(0); opacity: 1; }
            }

            .duo-confirm-icon::before {
                content: '';
                position: absolute;
                inset: 4px;
                border-radius: 50%;
                background: radial-gradient(circle,
                    rgba(244, 162, 97, 0.22) 0%,
                    rgba(244, 162, 97, 0.08) 45%,
                    transparent 75%);
                z-index: 0;
            }

            .duo-cat-avatar {
                position: relative;
                width: 100%;
                height: 100%;
                display: block;
                z-index: 1;
                filter: drop-shadow(0 6px 10px rgba(208, 123, 63, 0.25));
            }

            .duo-cat-eye-left,
            .duo-cat-eye-right {
                transform-box: fill-box;
                transform-origin: center;
                animation: duoCatBlink 5s ease-in-out infinite;
            }
            .duo-cat-eye-right { animation-delay: 0.08s; }
            @keyframes duoCatBlink {
                0%, 90%, 100% { transform: scaleY(1); }
                93.5%, 96%    { transform: scaleY(0.08); }
            }

            .duo-cat-pupil-left,
            .duo-cat-pupil-right {
                transform-box: fill-box;
                transform-origin: center;
                transition: transform 0.2s cubic-bezier(0.22, 1, 0.36, 1);
            }

            .duo-cat-ear-left {
                transform-box: fill-box;
                transform-origin: 100% 100%;
                transition: transform 0.28s cubic-bezier(0.22, 1, 0.36, 1);
            }
            .duo-cat-ear-right {
                transform-box: fill-box;
                transform-origin: 0% 100%;
                transition: transform 0.28s cubic-bezier(0.22, 1, 0.36, 1);
            }

            .duo-confirm-badge {
                position: absolute;
                right: -2px;
                bottom: 4px;
                width: 36px;
                height: 36px;
                border-radius: 50%;
                border: 3px solid #FFFFFF;
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 2;
                box-shadow: 0 3px 0 rgba(0, 0, 0, 0.12);
            }
            .duo-confirm-badge svg { width: 16px; height: 16px; color: #FFFFFF; }
            .duo-confirm-badge.info    { background: #58CC02; box-shadow: 0 3px 0 #58A700; }
            .duo-confirm-badge.warn    { background: #FF9600; box-shadow: 0 3px 0 #E08600; }
            .duo-confirm-badge.error   { background: #FF4B4B; box-shadow: 0 3px 0 #C73636; }
            .duo-confirm-badge.success { background: #58CC02; box-shadow: 0 3px 0 #58A700; }

            .duo-confirm-title {
                font-size: 1.3rem; font-weight: 900;
                color: #3C3C3C; letter-spacing: -0.01em;
                margin-bottom: 8px; line-height: 1.3;
            }
            .duo-confirm-desc {
                font-size: 0.92rem; font-weight: 600;
                color: #777777; line-height: 1.6;
                margin-bottom: 24px;
            }

            .duo-confirm-actions {
                display: flex; gap: 10px; justify-content: center;
            }
            .duo-confirm-btn {
                flex: 1;
                padding: 13px 20px;
                border-radius: 12px;
                font-size: 0.88rem; font-weight: 800;
                letter-spacing: 0.05em; text-transform: uppercase;
                cursor: pointer; border: none;
                transition: transform 0.08s ease, box-shadow 0.08s ease, filter 0.15s ease, color 0.15s ease;
                font-family: inherit;
                max-width: 160px;
            }
            .duo-confirm-btn:only-child { max-width: 220px; }

            .duo-confirm-btn.confirm {
                background: #58CC02; color: #FFFFFF;
                box-shadow: 0 4px 0 #58A700;
            }
            .duo-confirm-btn.confirm:hover { filter: brightness(1.06); }
            .duo-confirm-btn.confirm:active {
                transform: translateY(4px);
                box-shadow: 0 0 0 #58A700;
            }
            .duo-confirm-btn.confirm.danger {
                background: #FF4B4B;
                box-shadow: 0 4px 0 #C73636;
            }
            .duo-confirm-btn.confirm.danger:active {
                box-shadow: 0 0 0 #C73636;
            }
            .duo-confirm-btn.cancel {
                background: #FFFFFF; color: #777777;
                border: 2px solid #E5E5E5;
                box-shadow: 0 4px 0 #E5E5E5;
            }
            .duo-confirm-btn.cancel:hover { color: #3C3C3C; }
            .duo-confirm-btn.cancel:active {
                transform: translateY(4px);
                box-shadow: 0 0 0 #E5E5E5;
            }

            @media (max-width: 480px) {
                .duo-confirm-card { padding: 16px 20px 20px; border-radius: 20px; }
                .duo-confirm-icon { width: 92px; height: 92px; margin-top: -8px; }
                .duo-confirm-badge { width: 30px; height: 30px; border-width: 2.5px; }
                .duo-confirm-badge svg { width: 13px; height: 13px; }
                .duo-confirm-title { font-size: 1.12rem; }
                .duo-confirm-desc { font-size: 0.85rem; margin-bottom: 20px; }
                .duo-confirm-btn { padding: 12px 14px; font-size: 0.8rem; }
            }

            @media (prefers-reduced-motion: reduce) {
                .duo-confirm-overlay,
                .duo-confirm-card,
                .duo-confirm-icon,
                .duo-cat-eye-left,
                .duo-cat-eye-right,
                .duo-cat-pupil-left,
                .duo-cat-pupil-right,
                .duo-cat-ear-left,
                .duo-cat-ear-right {
                    transition: none !important;
                    animation: none !important;
                }
            }
        `;
        document.head.appendChild(style);
    }

    let overlayEl = null;
    let resolveFn = null;
    let keyHandler = null;
    let catMouseHandler = null;

    function createOverlay() {
        if (overlayEl) return overlayEl;
        overlayEl = document.createElement('div');
        overlayEl.className = 'duo-confirm-overlay';
        overlayEl.innerHTML = `
            <div class="duo-confirm-card" role="dialog" aria-modal="true">
                <div class="duo-confirm-icon">
                    ${CAT_AVATAR_SVG}
                    <div class="duo-confirm-badge info">${BADGE_ICONS.info}</div>
                </div>
                <h3 class="duo-confirm-title"></h3>
                <p class="duo-confirm-desc"></p>
                <div class="duo-confirm-actions">
                    <button type="button" class="duo-confirm-btn cancel"></button>
                    <button type="button" class="duo-confirm-btn confirm"></button>
                </div>
            </div>
        `;
        document.body.appendChild(overlayEl);

        overlayEl.addEventListener('click', (e) => {
            if (e.target === overlayEl) close(false);
        });
        overlayEl.querySelector('.duo-confirm-btn.confirm').addEventListener('click', () => close(true));
        overlayEl.querySelector('.duo-confirm-btn.cancel').addEventListener('click', () => close(false));
        return overlayEl;
    }

    function startCatTracking() {
        if (!window.matchMedia('(hover: hover)').matches) return;
        if (catMouseHandler) return;

        const catSvg = overlayEl.querySelector('.duo-cat-avatar');
        if (!catSvg) return;

        const pupilL = overlayEl.querySelector('.duo-cat-pupil-left');
        const pupilR = overlayEl.querySelector('.duo-cat-pupil-right');
        const earL   = overlayEl.querySelector('.duo-cat-ear-left');
        const earR   = overlayEl.querySelector('.duo-cat-ear-right');

        catMouseHandler = (e) => {
            const rect = catSvg.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;

            let mx = (e.clientX - cx) / (rect.width * 1.3);
            let my = (e.clientY - cy) / (rect.height * 1.3);
            mx = Math.max(-1, Math.min(1, mx));
            my = Math.max(-1, Math.min(1, my));

            if (pupilL) pupilL.style.transform = `translate(${mx * 2}px, ${my * 2}px)`;
            if (pupilR) pupilR.style.transform = `translate(${mx * 2}px, ${my * 2}px)`;
            if (earL) earL.style.transform = `rotate(${mx * 6}deg)`;
            if (earR) earR.style.transform = `rotate(${mx * 6}deg)`;
        };

        document.addEventListener('mousemove', catMouseHandler);
    }

    function stopCatTracking() {
        if (catMouseHandler) {
            document.removeEventListener('mousemove', catMouseHandler);
            catMouseHandler = null;
        }
        if (overlayEl) {
            overlayEl.querySelectorAll('.duo-cat-pupil-left, .duo-cat-pupil-right, .duo-cat-ear-left, .duo-cat-ear-right')
                .forEach(el => { el.style.transform = ''; });
        }
    }

    function close(result) {
        if (!overlayEl || !overlayEl.classList.contains('open')) return;
        overlayEl.classList.remove('open');
        document.body.style.overflow = '';
        stopCatTracking();
        if (keyHandler) {
            document.removeEventListener('keydown', keyHandler);
            keyHandler = null;
        }
        const fn = resolveFn;
        resolveFn = null;
        if (fn) fn(result);
    }

    function open(opts) {
        const o = Object.assign({
            title: '确认操作',
            desc: '',
            confirmText: '确认',
            cancelText: '取消',
            type: 'info',
            danger: false
        }, opts || {});

        createOverlay();

        const badgeEl = overlayEl.querySelector('.duo-confirm-badge');
        badgeEl.className = 'duo-confirm-badge ' + o.type;
        badgeEl.innerHTML = BADGE_ICONS[o.type] || BADGE_ICONS.info;

        overlayEl.querySelector('.duo-confirm-title').textContent = o.title;
        overlayEl.querySelector('.duo-confirm-desc').textContent = o.desc;

        const confirmBtn = overlayEl.querySelector('.duo-confirm-btn.confirm');
        const cancelBtn = overlayEl.querySelector('.duo-confirm-btn.cancel');
        confirmBtn.textContent = o.confirmText;
        confirmBtn.classList.toggle('danger', !!o.danger);

        if (o.cancelText === null) {
            cancelBtn.style.display = 'none';
        } else {
            cancelBtn.style.display = '';
            cancelBtn.textContent = o.cancelText;
        }

        const iconEl = overlayEl.querySelector('.duo-confirm-icon');
        iconEl.style.animation = 'none';
        void iconEl.offsetWidth;
        iconEl.style.animation = '';

        overlayEl.classList.add('open');
        document.body.style.overflow = 'hidden';

        startCatTracking();

        keyHandler = (e) => {
            if (e.key === 'Escape') close(false);
            if (e.key === 'Enter') close(true);
        };
        document.addEventListener('keydown', keyHandler);

        setTimeout(() => confirmBtn.focus(), 150);

        return new Promise((resolve) => { resolveFn = resolve; });
    }

    window.duoConfirm = open;

    window.duoAlert = function (message, opts) {
        return open(Object.assign({
            title: '提示',
            desc: message,
            confirmText: '好的',
            cancelText: null,
            type: 'info'
        }, opts || {}));
    };

    window.duoRequireLogin = function (type) {
        const descMap = {
            subject:    '登录后就能收藏这门科目，方便随时回顾～',
            university: '登录后就能收藏这所院校，方便随时查看～',
            timeline:   '登录后就能标记升学进度，不会丢失～',
            like:       '登录后就能点赞，让更多人看到～',
            favorite:   '登录后就能收藏帖子，方便随时翻看～',
            comment:    '登录后就能参与评论，和大家一起讨论～',
            follow:     '登录后就能关注 TA，看到 TA 的最新动态～',
            post:       '登录后就能发帖，分享你的经验～',
            general:    '登录后就能使用这个功能～'
        };
        return open({
            title: '需要登录哦～',
            desc: descMap[type] || descMap.general,
            confirmText: '去登录',
            cancelText: '再想想',
            type: 'info'
        });
    };
})();
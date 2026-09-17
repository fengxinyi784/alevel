// ========== AI 对话小助手（猫咪形象 · 可拖拽 · 单击开聊天 · 双击换皮肤 · 接入智谱GLM） ==========
(function () {

    /* ============================================================
       强制浅色模式：防止手机系统深色模式强制反色
       ============================================================ */
    try {
        document.documentElement.style.colorScheme = 'light';
        document.body.style.colorScheme = 'light';
        document.documentElement.classList.remove('dark', 'dark-mode', 'theme-dark');
        document.body.classList.remove('dark', 'dark-mode', 'theme-dark');
    } catch (_) { /* 忽略 */ }

    /* ============================================================
       猫咪 SVG（使用 CSS 变量，支持四种配色）
       ============================================================ */
    const CAT_SVG = `
    <svg class="cat-svg" viewBox="0 0 120 150" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <clipPath id="catHeadClip">
                <ellipse cx="60" cy="90" rx="32" ry="31"/>
            </clipPath>
        </defs>

        <!-- 尾巴 -->
        <g class="cat-tail-respond">
            <g class="cat-tail">
                <path d="M 78 132 Q 102 138 108 118 Q 111 108 104 104"
                      fill="none" style="stroke: var(--fur-stroke);" stroke-width="7" stroke-linecap="round"/>
                <path d="M 78 132 Q 102 138 108 118 Q 111 108 104 104"
                      fill="none" style="stroke: var(--fur);" stroke-width="4.5" stroke-linecap="round"/>
                <!-- 狸花尾巴环纹 -->
                <g class="cat-tabby-marks" style="stroke: var(--stripe);" stroke-width="1.8" stroke-linecap="round" fill="none">
                    <path d="M 89 129.5 Q 90 133 89 136.5"/>
                    <path d="M 96.5 128 Q 98 131.5 98.5 135"/>
                    <path d="M 102 122 Q 104 124.5 105.5 127"/>
                </g>
            </g>
        </g>

        <!-- 身体 -->
        <ellipse cx="60" cy="130" rx="30" ry="18"
                 style="fill: var(--fur); stroke: var(--fur-stroke);" stroke-width="1.5"/>

        <!-- 左耳 -->
        <g class="cat-ear-respond-left">
            <g class="cat-ear-left">
                <path d="M 38 72 Q 30 58 36 50 Q 42 44 48 52 Q 52 58 56 64 Z"
                      style="fill: var(--fur); stroke: var(--fur-stroke);" stroke-width="1.5" stroke-linejoin="round"/>
                <path d="M 38 72 Q 30 58 36 50 Q 42 44 48 52 Q 52 58 56 64 Z"
                      style="fill: var(--patch-ear-l);" opacity="0.85"/>
                <path d="M 40 70 Q 34 58 38 53 Q 42 49 46 55 Q 48 58 50 62 Z"
                      style="fill: var(--ear-inner);" opacity="0.7"/>
            </g>
        </g>

        <!-- 右耳 -->
        <g class="cat-ear-respond-right">
            <g class="cat-ear-right">
                <path d="M 82 72 Q 90 58 84 50 Q 78 44 72 52 Q 68 58 64 64 Z"
                      style="fill: var(--fur); stroke: var(--fur-stroke);" stroke-width="1.5" stroke-linejoin="round"/>
                <path d="M 82 72 Q 90 58 84 50 Q 78 44 72 52 Q 68 58 64 64 Z"
                      style="fill: var(--patch-ear-r);" opacity="0.85"/>
                <path d="M 80 70 Q 86 58 82 53 Q 78 49 74 55 Q 72 58 70 62 Z"
                      style="fill: var(--ear-inner);" opacity="0.7"/>
            </g>
        </g>

        <!-- 头部 -->
        <ellipse cx="60" cy="90" rx="33" ry="32"
                 style="fill: var(--fur); stroke: var(--fur-stroke);" stroke-width="1.5"/>

        <!-- 三花斑块 -->
        <g class="cat-patches" clip-path="url(#catHeadClip)">
            <path d="M 68 60 Q 76 58 82 64 Q 88 70 86 78 Q 84 84 78 84 Q 72 83 68 78 Q 64 72 66 66 Z"
                  style="fill: var(--patch-1);"/>
            <path d="M 36 58 Q 30 62 28 72 Q 26 82 30 88 Q 34 94 40 92 Q 46 90 46 84 Q 46 78 42 72 Q 38 66 36 58 Z"
                  style="fill: var(--patch-2);"/>
        </g>

        <!-- 狸花眼尾纹 -->
        <g class="cat-tabby-marks" style="stroke: var(--stripe);" stroke-width="1.6" stroke-linecap="round" fill="none">
            <path d="M 38 86 L 32 88"/>
            <path d="M 38 90 L 32 92"/>
            <path d="M 82 86 L 88 88"/>
            <path d="M 82 90 L 88 92"/>
        </g>

        <!-- 额头虎斑纹 -->
        <g class="cat-stripes">
            <path d="M 52 62 Q 56 54 60 60 Q 64 52 68 62"
                  fill="none" style="stroke: var(--stripe);" stroke-width="2.2" stroke-linecap="round"/>
        </g>
        <g class="cat-stripes" style="stroke: var(--stripe);" stroke-width="2" stroke-linecap="round" opacity="0.75">
            <path d="M 54 68 L 54 76"/>
            <path d="M 60 66 L 60 74"/>
            <path d="M 66 68 L 66 76"/>
        </g>

        <!-- 狸花加强 M 纹 -->
        <g class="cat-tabby-marks" style="stroke: var(--stripe);" stroke-width="1.8" stroke-linecap="round" fill="none">
            <path d="M 48 57 L 52 68"/>
            <path d="M 72 57 L 68 68"/>
        </g>

        <!-- 腮红 -->
        <ellipse cx="34" cy="100" rx="7" ry="3.5" style="fill: var(--blush);" opacity="0.55"/>
        <ellipse cx="86" cy="100" rx="7" ry="3.5" style="fill: var(--blush);" opacity="0.55"/>

        <!-- 左眼 -->
        <g class="cat-eye-wrap" data-eye="left">
            <g class="cat-eye cat-eye-left">
                <ellipse cx="46" cy="90" rx="8" ry="10" fill="#FFFFFF" style="stroke: var(--fur-stroke);" stroke-width="1.2"/>
                <circle class="cat-pupil" cx="46" cy="92" r="5" style="fill: var(--pupil);"/>
                <circle cx="48" cy="89" r="1.8" fill="#FFFFFF"/>
            </g>
        </g>

        <!-- 右眼 -->
        <g class="cat-eye-wrap" data-eye="right">
            <g class="cat-eye cat-eye-right">
                <ellipse cx="74" cy="90" rx="8" ry="10" fill="#FFFFFF" style="fill: none; stroke: var(--fur-stroke);" stroke-width="1.2"/>
                <circle class="cat-pupil" cx="74" cy="92" r="5" style="fill: var(--pupil);"/>
                <circle cx="76" cy="89" r="1.8" fill="#FFFFFF"/>
            </g>
        </g>

        <!-- 鼻子 -->
        <path d="M 60 102 L 56 106 L 64 106 Z"
              style="fill: var(--nose); stroke: var(--fur-stroke);" stroke-width="0.8" stroke-linejoin="round"/>

        <!-- 微笑嘴巴 -->
        <g class="cat-smile-mouth">
            <path d="M 60 106 Q 60 111 55 112" fill="none" style="stroke: var(--mouth);" stroke-width="1.6" stroke-linecap="round"/>
            <path d="M 60 106 Q 60 111 65 112" fill="none" style="stroke: var(--mouth);" stroke-width="1.6" stroke-linecap="round"/>
        </g>

        <!-- 哈欠嘴巴 -->
        <g class="cat-yawn-mouth">
            <ellipse cx="60" cy="113" rx="7" ry="9" fill="#5A1F1F"/>
            <ellipse cx="60" cy="107" rx="6" ry="2.5" fill="#3A1010" opacity="0.7"/>
            <ellipse cx="60" cy="117" rx="4.5" ry="4" style="fill: var(--nose);"/>
            <path d="M 53 106 Q 60 108 67 106" fill="none" style="stroke: var(--mouth);" stroke-width="1.5" stroke-linecap="round"/>
        </g>

        <!-- 胡须 -->
        <g class="cat-whisker-respond-left">
            <g style="stroke: var(--whisker);" stroke-width="1.1" stroke-linecap="round" opacity="0.65">
                <path d="M 28 98 L 12 94"/>
                <path d="M 28 102 L 12 102"/>
                <path d="M 28 106 L 12 110"/>
            </g>
        </g>
        <g class="cat-whisker-respond-right">
            <g style="stroke: var(--whisker);" stroke-width="1.1" stroke-linecap="round" opacity="0.65">
                <path d="M 92 98 L 108 94"/>
                <path d="M 92 102 L 108 102"/>
                <path d="M 92 106 L 108 110"/>
            </g>
        </g>

        <!-- 眼睛命中区 -->
        <circle class="cat-eye-hitarea" data-eye="left"  cx="46" cy="90" r="16"/>
        <circle class="cat-eye-hitarea" data-eye="right" cx="74" cy="90" r="16"/>
    </svg>
    `;

    /* ============================================================
       创建助手容器
       ============================================================ */
    const assistantContainer = document.createElement('div');
    assistantContainer.className = 'ai-assistant';
    assistantContainer.innerHTML = `
        <div class="ai-assistant-btn" id="aiAssistantBtn">
            ${CAT_SVG}
        </div>
               <div class="ai-chat-window" id="aiChatWindow">
            <div class="ai-chat-header">
                <span>猫咪升学助手</span>
                <div class="ai-chat-header-actions">
                    <button id="aiChatClearBtn" aria-label="清空对话" title="清空对话">🗑</button>
                    <button id="aiChatCloseBtn" aria-label="关闭">&times;</button>
                </div>
            </div>
            <div class="ai-chat-body">
                <div class="ai-chat-messages" id="aiChatMessages">
                    <div class="ai-message-bubble bot">喵～我是猫咪升学助手，可以咨询 A-Level 选课、院校、申请等问题。单击我开/关聊天，双击我换皮肤哦！</div>
                </div>
                <div class="ai-chat-input-area">
                    <input type="text" id="aiChatInput" placeholder="输入你的问题..." />
                    <button id="aiChatSendBtn">发送</button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(assistantContainer);

    /* ============================================================
       元素引用
       ============================================================ */
    const dragBtn = document.getElementById('aiAssistantBtn');
    const chatWindow = document.getElementById('aiChatWindow');
    const closeBtn = document.getElementById('aiChatCloseBtn');
    const messagesContainer = document.getElementById('aiChatMessages');
    const input = document.getElementById('aiChatInput');
    const sendBtn = document.getElementById('aiChatSendBtn');
    const catSvg = dragBtn.querySelector('.cat-svg');

    /* ============================================================
       初始位置 + 位置记忆
       ============================================================ */
    const POSITION_KEY = 'ai-cat-position';

    function setInitialPosition() {
        const btnRect = dragBtn.getBoundingClientRect();
        const btnW = btnRect.width || 120;
        const btnH = btnRect.height || 130;
        const margin = 24;
        assistantContainer.style.left = (window.innerWidth - btnW - margin) + 'px';
        assistantContainer.style.top = (window.innerHeight - btnH - margin) + 'px';
        assistantContainer.style.bottom = 'auto';
        assistantContainer.style.right = 'auto';
    }

    function savePosition() {
        try {
            localStorage.setItem(POSITION_KEY, JSON.stringify({
                left: assistantContainer.style.left,
                top: assistantContainer.style.top
            }));
        } catch (e) { /* ignore */ }
    }

    function restorePosition() {
        try {
            const raw = localStorage.getItem(POSITION_KEY);
            if (!raw) return false;
            const { left, top } = JSON.parse(raw);
            const rect = dragBtn.getBoundingClientRect();
            const maxLeft = window.innerWidth - rect.width;
            const maxTop = window.innerHeight - rect.height;
            const leftNum = parseFloat(left);
            const topNum = parseFloat(top);
            if (isNaN(leftNum) || isNaN(topNum)) return false;
            assistantContainer.style.left = Math.max(0, Math.min(leftNum, maxLeft)) + 'px';
            assistantContainer.style.top = Math.max(0, Math.min(topNum, maxTop)) + 'px';
            assistantContainer.style.bottom = 'auto';
            assistantContainer.style.right = 'auto';
            return true;
        } catch (e) { return false; }
    }

    if (!restorePosition()) setInitialPosition();

    window.addEventListener('resize', () => {
        const rect = dragBtn.getBoundingClientRect();
        const maxLeft = window.innerWidth - rect.width;
        const maxTop = window.innerHeight - rect.height;
        const curLeft = parseFloat(assistantContainer.style.left) || 0;
        const curTop = parseFloat(assistantContainer.style.top) || 0;
        if (curLeft > maxLeft) assistantContainer.style.left = Math.max(0, maxLeft) + 'px';
        if (curTop > maxTop) assistantContainer.style.top = Math.max(0, maxTop) + 'px';
        // ⭐ 窗口尺寸变化后，重新定位聊天框
        positionChatWindow();
    });

    /* ============================================================
       拖拽
       ============================================================ */
    let isDragging = false;
    let startX, startY, initialLeft, initialTop;
    let movedDistance = 0;
    let suppressClick = false;

    const DRAG_THRESHOLD = 6;

    function onDragStart(e) {
        isDragging = true;
        movedDistance = 0;
        suppressClick = false;

        const clientX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
        const clientY = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY;

        startX = clientX;
        startY = clientY;

        const rect = assistantContainer.getBoundingClientRect();
        initialLeft = rect.left;
        initialTop = rect.top;

        assistantContainer.style.transition = 'none';
        document.body.style.userSelect = 'none';

        dragBtn.classList.add('dragging');

        if (e.type === 'mousedown') {
            e.preventDefault();
        }
    }

    function onDragMove(e) {
        if (!isDragging) return;

        const clientX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
        const clientY = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY;

        const deltaX = clientX - startX;
        const deltaY = clientY - startY;
        movedDistance = Math.max(movedDistance, Math.abs(deltaX) + Math.abs(deltaY));

        if (movedDistance > DRAG_THRESHOLD) {
            e.preventDefault();
        }

        let newLeft = initialLeft + deltaX;
        let newTop = initialTop + deltaY;

        const rect = assistantContainer.getBoundingClientRect();
        const maxLeft = window.innerWidth - rect.width;
        const maxTop = window.innerHeight - rect.height;
        newLeft = Math.max(0, Math.min(newLeft, maxLeft));
        newTop = Math.max(0, Math.min(newTop, maxTop));

        assistantContainer.style.left = newLeft + 'px';
        assistantContainer.style.top = newTop + 'px';
        assistantContainer.style.bottom = 'auto';
        assistantContainer.style.right = 'auto';
    }

    function onDragEnd() {
        if (!isDragging) return;
        isDragging = false;
        assistantContainer.style.transition = '';
        document.body.style.userSelect = '';
        dragBtn.classList.remove('dragging');

        if (movedDistance < DRAG_THRESHOLD) {
            suppressClick = false;
        } else {
            suppressClick = true;
            savePosition();
            // ⭐ 拖完以后，如果聊天框开着，重新调整方向
            positionChatWindow();
        }
    }

    dragBtn.addEventListener('mousedown', onDragStart);
    document.addEventListener('mousemove', onDragMove);
    document.addEventListener('mouseup', onDragEnd);
    dragBtn.addEventListener('touchstart', onDragStart, { passive: true });
    document.addEventListener('touchmove', onDragMove, { passive: false });
    document.addEventListener('touchend', onDragEnd);
    document.addEventListener('touchcancel', onDragEnd);

    /* ============================================================
       蹭蹭动作
       ============================================================ */
    let nuzzling = false;

    function triggerNuzzle() {
        if (nuzzling) return;
        nuzzling = true;
        dragBtn.classList.add('nuzzling');
        setTimeout(() => {
            dragBtn.classList.remove('nuzzling');
            nuzzling = false;
        }, 1300);
    }

    /* ============================================================
       点击逻辑：单击开/关聊天 · 双击换皮肤
       ============================================================ */
    const PALETTES = ['palette-orange', 'palette-tri', 'palette-white', 'palette-tabby'];
    let paletteIdx = 0;
    dragBtn.classList.add(PALETTES[paletteIdx]);

    function cyclePalette() {
        dragBtn.classList.remove(PALETTES[paletteIdx]);
        paletteIdx = (paletteIdx + 1) % PALETTES.length;
        dragBtn.classList.add(PALETTES[paletteIdx]);
    }

    /* ⭐ 动态计算聊天框位置：永远保证在屏幕内 */
    function positionChatWindow() {
        if (!chatWindow.classList.contains('open')) return;

        const rect = assistantContainer.getBoundingClientRect();
        const chatW = chatWindow.offsetWidth || 340;
        const chatH = chatWindow.offsetHeight || 400;
        const margin = 16;   // 距离屏幕边缘的最小间距
        const gap = 12;      // 聊天框和猫咪之间的间距

        // ---------- 水平位置 ----------
        let left = rect.left;
        // 右边界保护
        if (left + chatW > window.innerWidth - margin) {
            left = window.innerWidth - chatW - margin;
        }
        // 左边界保护
        if (left < margin) left = margin;

        // ---------- 垂直位置 ----------
        // 理想位置：聊天框底部在猫咪顶部上方 gap 处
        let top = rect.top - chatH - gap;

        // 顶部保护：不能超出屏幕上方
        if (top < margin) top = margin;

        // 底部保护：不能超出屏幕下方
        if (top + chatH > window.innerHeight - margin) {
            top = window.innerHeight - chatH - margin;
        }

        chatWindow.style.left = left + 'px';
        chatWindow.style.top = top + 'px';
        chatWindow.style.bottom = 'auto';
        chatWindow.style.right = 'auto';
    }

    function openOrCloseChat() {
        chatWindow.classList.toggle('open');
        if (chatWindow.classList.contains('open')) {
            // ⭐ 打开后立刻定位一次
            positionChatWindow();
            setTimeout(() => input.focus(), 100);
        }
    }

    let clickTimer = null;

    dragBtn.addEventListener('click', function (e) {
        e.stopPropagation();

        if (suppressClick) {
            suppressClick = false;
            return;
        }

        if (clickTimer) {
            clearTimeout(clickTimer);
            clickTimer = null;
            triggerNuzzle();
            cyclePalette();
        } else {
            clickTimer = setTimeout(function () {
                clickTimer = null;
                triggerNuzzle();
                openOrCloseChat();
            }, 260);
        }
    });

    closeBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        chatWindow.classList.remove('open');
    });

    const clearBtn = document.getElementById('aiChatClearBtn');
    clearBtn?.addEventListener('click', async function (e) {
        e.stopPropagation();

        // ⭐ 使用站点统一的猫咪风格确认框
        let confirmed = false;
        if (typeof window.duoConfirm === 'function') {
            try {
                confirmed = await window.duoConfirm({
                    title: '清空对话记录',
                    desc: '确定要清空所有对话记录吗？此操作不可撤销。',
                    confirmText: '清空',
                    cancelText: '取消',
                    danger: true,
                    type: 'warn'
                });
            } catch (_) {
                confirmed = false;
            }
        } else {
            // 兜底：没有 duoConfirm 时使用原生 confirm
            confirmed = confirm('确定清空所有对话记录吗？');
        }

        if (!confirmed) return;

        chatHistory.length = 0;
        saveChatHistory(chatHistory);
        messagesContainer.innerHTML = `<div class="ai-message-bubble bot">喵～对话已清空，有什么可以帮你的吗？</div>`;
    });

    document.addEventListener('click', function (e) {
        if (!assistantContainer.contains(e.target)) {
            chatWindow.classList.remove('open');
        }
    });

    /* ============================================================
       打哈欠（随机 8~14s）
       ============================================================ */
    let yawnTimer = null;

    function triggerYawn() {
        if (dragBtn.classList.contains('yawning') || nuzzling) {
            scheduleYawn(3000);
            return;
        }
        dragBtn.classList.add('yawning');
        setTimeout(() => {
            dragBtn.classList.remove('yawning');
            scheduleYawn();
        }, 1700);
    }

    function scheduleYawn(customDelay) {
        const delay = customDelay || (8000 + Math.random() * 6000);
        yawnTimer = setTimeout(triggerYawn, delay);
    }

    yawnTimer = setTimeout(triggerYawn, 5000);

    dragBtn.addEventListener('mouseenter', () => {
        if (yawnTimer && !dragBtn.classList.contains('yawning')) {
            clearTimeout(yawnTimer);
            yawnTimer = null;
        }
    });
    dragBtn.addEventListener('mouseleave', () => {
        if (!yawnTimer && !dragBtn.classList.contains('yawning')) {
            scheduleYawn();
        }
    });

    /* ============================================================
       悬停闭眼（仅桌面端）
       ============================================================ */
    if (window.matchMedia('(hover: hover)').matches) {
        dragBtn.querySelectorAll('.cat-eye-hitarea').forEach(hit => {
            const side = hit.getAttribute('data-eye');
            const eyeWrap = dragBtn.querySelector(`.cat-eye-wrap[data-eye="${side}"]`);
            if (!eyeWrap) return;
            hit.addEventListener('mouseenter', () => {
                if (!isDragging) eyeWrap.classList.add('wink-closed');
            });
            hit.addEventListener('mouseleave', () => {
                eyeWrap.classList.remove('wink-closed');
            });
        });
    }

    /* ============================================================
       视线跟随 + 耳朵 / 胡须 / 尾巴响应（仅桌面端）
       ============================================================ */
    const pupils = dragBtn.querySelectorAll('.cat-pupil');
    const earL = dragBtn.querySelector('.cat-ear-respond-left');
    const earR = dragBtn.querySelector('.cat-ear-respond-right');
    const tail = dragBtn.querySelector('.cat-tail-respond');
    const whiskL = dragBtn.querySelector('.cat-whisker-respond-left');
    const whiskR = dragBtn.querySelector('.cat-whisker-respond-right');

    function onCatMouseMove(e) {
        if (isDragging) return;
        const rect = catSvg.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;

        let mx = (e.clientX - cx) / (rect.width * 0.8);
        let my = (e.clientY - cy) / (rect.height * 0.8);
        mx = Math.max(-1, Math.min(1, mx));
        my = Math.max(-1, Math.min(1, my));

        pupils.forEach(p => {
            p.style.transform = `translate(${mx * 2.2}px, ${my * 2.2}px)`;
        });
        if (earL) earL.style.transform = `rotate(${mx * 8}deg)`;
        if (earR) earR.style.transform = `rotate(${mx * 8}deg)`;
        if (tail) tail.style.transform = `rotate(${mx * 12}deg)`;
        if (whiskL) whiskL.style.transform = `rotate(${mx * 5}deg)`;
        if (whiskR) whiskR.style.transform = `rotate(${-mx * 5}deg)`;
    }

    function resetCatResponses() {
        pupils.forEach(p => p.style.transform = '');
        if (earL) earL.style.transform = '';
        if (earR) earR.style.transform = '';
        if (tail) tail.style.transform = '';
        if (whiskL) whiskL.style.transform = '';
        if (whiskR) whiskR.style.transform = '';
    }

    const isDesktopDevice =
        window.matchMedia('(hover: hover)').matches &&
        window.matchMedia('(pointer: fine)').matches;

    if (isDesktopDevice) {
        document.addEventListener('mousemove', onCatMouseMove);
        document.addEventListener('mouseleave', resetCatResponses);
    } else {
        resetCatResponses();
    }

    /* ============================================================
       ⭐ 接入 Supabase Edge Function（调用智谱 GLM）
       ============================================================ */
    const EDGE_FUNCTION_NAME = 'bright-function';

    /* ============================================================
       ⭐ 对话历史（持久化到 sessionStorage，跨页面保留）
       ============================================================ */
    const CHAT_HISTORY_KEY = 'ai-cat-chat-history';

    function loadChatHistory() {
        try {
            const raw = sessionStorage.getItem(CHAT_HISTORY_KEY);
            if (!raw) return [];
            const arr = JSON.parse(raw);
            return Array.isArray(arr) ? arr : [];
        } catch (_) {
            return [];
        }
    }

    function saveChatHistory(history) {
        try {
            sessionStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(history));
        } catch (_) { /* 忽略 */ }
    }

    const chatHistory = loadChatHistory();

    async function getAIReply(userMessage, history) {
        const client = window.supabaseClient;
        if (!client || !client.functions) {
            console.warn('[AI] Supabase 客户端未初始化，降级到本地知识库');
            return null;
        }

        try {
            const { data, error } = await client.functions.invoke(EDGE_FUNCTION_NAME, {
                body: {
                    message: userMessage,
                    history: history
                }
            });

        if (error) {
            console.warn('[AI] Edge Function 调用失败:', error);
            return null;
        }

        // ⭐ 打印实际使用的模型
        if (data?.model) {
            console.log(`[AI] 本次使用模型：${data.model}`);
        }

        // ⭐ 把模型名一起返回（可选）
        return data?.reply || null;

        } catch (err) {
            console.warn('[AI] 请求出错，降级到本地知识库:', err);
            return null;
        }
    }

    /* ============================================================
       简单问答库（AI 失败时的降级方案）
       ============================================================ */
    const knowledgeBase = [
        {
            keywords: ['热门科目', '科目', '选课', '课程'],
            reply: '喵～我们推荐 A-Level 数学、物理、经济作为核心科目，它们覆盖大多数英国名校热门专业。可以查看我们的 <a href="subjects.html">热门科目</a> 页面。'
        },
        {
            keywords: ['费用', '学费', '多少钱'],
            reply: '学费因大学和专业而异，通常每年在 20,000-40,000 英镑之间。具体信息请咨询目标院校。'
        },
        {
            keywords: ['院校', '大学', '学校', '排名'],
            reply: '牛津、剑桥、帝国理工、LSE、UCL 等都是热门选择。您可以浏览我们的 <a href="universities.html">热门院校</a> 页面了解详情。'
        },
        {
            keywords: ['时间', '截止', '申请', 'UCAS', '几月'],
            reply: 'UCAS 申请通常在 1 月 15 日截止，牛剑及医学类是 10 月 15 日。A-Level 大考在 5-6 月，8 月出分。查看完整时间轴请点击 <a href="timeline.html">升学时间轴</a>。'
        },
        {
            keywords: ['策略', '怎么选', '建议', '组合'],
            reply: '选课要专业匹配优先、能力与兴趣平衡、留有余地不贪多。您可以参考我们的 <a href="strategy.html">交流社区</a> 页面。'
        },
        {
            keywords: ['联系', '地址', '电话', '邮箱', '咨询'],
            reply: '您可以通过页脚的联系方式找到我们，或者访问个人主页了解更多。'
        },
        {
            keywords: ['你好', 'hi', 'hello', '在吗'],
            reply: '喵～很高兴为您服务。请问您想了解 A-Level 的什么问题？'
        }
    ];

    const defaultReply = '喵～我还在学习中，暂时无法回答这个问题。您可以尝试询问"热门科目"、"院校推荐"、"申请时间"等。';

    function getBotReply(userInput) {
        const text = userInput.toLowerCase();
        for (let item of knowledgeBase) {
            if (item.keywords.some(keyword => text.includes(keyword))) {
                return item.reply;
            }
        }
        return defaultReply;
    }

    function normalizeLinks(text) {
        if (!text) return '';
        return String(text).replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match, label, url) => {
            // 只允许相对路径 / 站内 html / http(s)
            if (/^(https?:\/\/|\.\/|\.\.\/|\/|[a-zA-Z0-9_\-]+\.html)/i.test(url)) {
                return `<a href="${url}">${label}</a>`;
            }
            return match; // 未知格式原样返回
        });
    }

    function addMessage(content, sender, opts = {}) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `ai-message-bubble ${sender}`;

        // ⭐ bot 消息：先把 Markdown 链接转换成 HTML，再渲染
        const finalContent = (sender === 'bot') ? normalizeLinks(content) : content;
        messageDiv.innerHTML = finalContent;

        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        /* ⭐ 存储策略：
           · bot 消息：保留 <a> 标签，其它标签清掉
           · user 消息：全部当纯文本，安全 */
        let storedContent;
        if (sender === 'bot') {
            storedContent = String(finalContent)
                .replace(/<(?!\/?a\b)[^>]*>/gi, '')
                .replace(/\son\w+\s*=\s*["'][^"']*["']/gi, '')
                .replace(/href\s*=\s*["']javascript:[^"']*["']/gi, 'href="#"');
        } else {
            storedContent = String(finalContent).replace(/<[^>]+>/g, '');
        }

        if (sender === 'user') {
            chatHistory.push({ role: 'user', content: storedContent });
        } else if (sender === 'bot') {
            chatHistory.push({ role: 'assistant', content: storedContent });
        }

        if (chatHistory.length > 10) {
            chatHistory.splice(0, chatHistory.length - 10);
        }

        if (!opts.skipPersist) {
            saveChatHistory(chatHistory);
        }
    }

    function restoreChatUI() {
        if (chatHistory.length === 0) return;

        messagesContainer.innerHTML = '';

        chatHistory.forEach(item => {
            const messageDiv = document.createElement('div');
            messageDiv.className = `ai-message-bubble ${item.role === 'user' ? 'user' : 'bot'}`;

            if (item.role === 'user') {
                messageDiv.textContent = item.content;
            } else {
                messageDiv.innerHTML = normalizeLinks(item.content);
            }

            messagesContainer.appendChild(messageDiv);
        });

        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    let isWaiting = false;

    async function handleUserMessage() {
        if (isWaiting) return;

        const userText = input.value.trim();
        if (!userText) return;

        isWaiting = true;

        addMessage(userText, 'user');
        input.value = '';

        // 显示"正在思考"临时气泡
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'ai-message-bubble bot';
        loadingDiv.textContent = '喵～正在思考...';
        messagesContainer.appendChild(loadingDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        let reply = await getAIReply(userText, chatHistory.slice(0, -1));

        if (reply === null) {
            reply = getBotReply(userText);
        }

        loadingDiv.remove();

        addMessage(reply, 'bot');
        isWaiting = false;
    }

    if (window.ResizeObserver) {
        const ro = new ResizeObserver(() => {
            positionChatWindow();
        });
        ro.observe(chatWindow);
    }

    sendBtn.addEventListener('click', handleUserMessage);
    input.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            handleUserMessage();
        }
    });

    /* ⭐ 页面加载时，从 sessionStorage 恢复之前的对话气泡 */
    restoreChatUI();

})();
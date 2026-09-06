// ========== AI 对话小助手（可拖拽） ==========
(function() {
    // 创建助手容器
    const assistantContainer = document.createElement('div');
    assistantContainer.className = 'ai-assistant';
    assistantContainer.innerHTML = `
        <div class="ai-assistant-btn" id="aiAssistantBtn">
             <img src="images/ai-avatar.png" alt="AI助手" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;">
        </div>
        <div class="ai-chat-window" id="aiChatWindow">
            <div class="ai-chat-header">
                <span>AI 升学助手</span>
                <button id="aiChatCloseBtn">&times;</button>
            </div>
            <div class="ai-chat-body">
                <div class="ai-chat-messages" id="aiChatMessages">
                    <div class="ai-message-bubble bot">你好！我是 AI 升学助手，可以咨询 A-Level 选课、院校、申请等问题。试试问我“热门科目有哪些”吧。</div>
                </div>
                <div class="ai-chat-input-area">
                    <input type="text" id="aiChatInput" placeholder="输入你的问题..." />
                    <button id="aiChatSendBtn">发送</button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(assistantContainer);

    // ========== 设置初始位置（右下角） ==========
    function setInitialPosition() {
        const btn = assistantContainer.querySelector('.ai-assistant-btn');
        const btnRect = btn.getBoundingClientRect();
        const btnSize = btnRect.width || 140; // 默认按钮宽度
        const margin = 30; // 距边缘间距
        assistantContainer.style.left = (window.innerWidth - btnSize - margin) + 'px';
        assistantContainer.style.top = (window.innerHeight - btnSize - margin) + 'px';
        assistantContainer.style.bottom = 'auto';
        assistantContainer.style.right = 'auto';
    }
    setInitialPosition();
    window.addEventListener('resize', setInitialPosition);

    // ========== 拖拽功能 ==========
    const dragBtn = document.getElementById('aiAssistantBtn');
    let isDragging = false;
    let startX, startY, initialLeft, initialTop;
    let movedDistance = 0;
    let suppressClick = false;

    function onDragStart(e) {
        e.preventDefault();
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

        // 禁用过渡，避免拖动卡顿
        assistantContainer.style.transition = 'none';
        document.body.style.userSelect = 'none';
    }

    function onDragMove(e) {
        if (!isDragging) return;
        e.preventDefault();

        const clientX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
        const clientY = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY;

        const deltaX = clientX - startX;
        const deltaY = clientY - startY;
        movedDistance = Math.max(movedDistance, Math.abs(deltaX) + Math.abs(deltaY));

        let newLeft = initialLeft + deltaX;
        let newTop = initialTop + deltaY;

        // 边界限制，防止拖出视口
        const containerRect = assistantContainer.getBoundingClientRect();
        const maxLeft = window.innerWidth - containerRect.width;
        const maxTop = window.innerHeight - containerRect.height;
        newLeft = Math.max(0, Math.min(newLeft, maxLeft));
        newTop = Math.max(0, Math.min(newTop, maxTop));

        assistantContainer.style.left = newLeft + 'px';
        assistantContainer.style.top = newTop + 'px';
        assistantContainer.style.bottom = 'auto';
        assistantContainer.style.right = 'auto';
    }

    function onDragEnd(e) {
        if (!isDragging) return;
        isDragging = false;
        assistantContainer.style.transition = '';
        document.body.style.userSelect = '';

        // 如果移动距离很小，视为点击，允许后续 click 触发
        if (movedDistance < 5) {
            suppressClick = false;
        } else {
            suppressClick = true; // 阻止接下来的 click 事件
        }
    }

    // 鼠标事件
    dragBtn.addEventListener('mousedown', onDragStart);
    document.addEventListener('mousemove', onDragMove);
    document.addEventListener('mouseup', onDragEnd);

    // 触摸事件
    dragBtn.addEventListener('touchstart', onDragStart, { passive: false });
    document.addEventListener('touchmove', onDragMove, { passive: false });
    document.addEventListener('touchend', onDragEnd);

    // ========== 交互逻辑（点击打开/关闭窗口） ==========
    const chatWindow = document.getElementById('aiChatWindow');
    const closeBtn = document.getElementById('aiChatCloseBtn');
    const messagesContainer = document.getElementById('aiChatMessages');
    const input = document.getElementById('aiChatInput');
    const sendBtn = document.getElementById('aiChatSendBtn');

    dragBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        if (suppressClick) {
            suppressClick = false; // 清除标志，以便下次点击正常
            return;
        }
        chatWindow.classList.toggle('open');
        if (chatWindow.classList.contains('open')) {
            input.focus();
        }
    });

    closeBtn.addEventListener('click', function() {
        chatWindow.classList.remove('open');
    });

    document.addEventListener('click', function(e) {
        if (!assistantContainer.contains(e.target)) {
            chatWindow.classList.remove('open');
        }
    });

    // ========== 核心：简单问答库 ==========
    const knowledgeBase = [
        {
            keywords: ['热门科目', '科目', '选课', '课程'],
            reply: '我们推荐 A-Level 数学、物理、经济作为核心科目，它们覆盖大多数英国名校热门专业。可以查看我们的 <a href="subjects.html">热门科目</a> 页面。'
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
            reply: '选课要专业匹配优先、能力与兴趣平衡、留有余地不贪多。您可以参考我们的 <a href="strategy.html">选课策略</a> 页面。'
        },
        {
            keywords: ['联系', '地址', '电话', '邮箱', '咨询'],
            reply: '您可以通过页脚的联系方式找到我们，或者访问 <a href="about.html">关于我们</a> 页面。'
        },
        {
            keywords: ['你好', 'hi', 'hello', '在吗'],
            reply: '你好！很高兴为您服务。请问您想了解 A-Level 的什么问题？'
        }
    ];

    const defaultReply = '抱歉，我还在学习中，暂时无法回答这个问题。您可以尝试询问“热门科目”、“院校推荐”、“申请时间”等。';

    function getBotReply(userInput) {
        const text = userInput.toLowerCase();
        for (let item of knowledgeBase) {
            if (item.keywords.some(keyword => text.includes(keyword))) {
                return item.reply;
            }
        }
        return defaultReply;
    }

    function addMessage(content, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `ai-message-bubble ${sender}`;
        messageDiv.innerHTML = content;
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    function handleUserMessage() {
        const userText = input.value.trim();
        if (!userText) return;
        addMessage(userText, 'user');
        input.value = '';
        setTimeout(() => {
            const botReply = getBotReply(userText);
            addMessage(botReply, 'bot');
        }, 400);
    }

    sendBtn.addEventListener('click', handleUserMessage);
    input.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            handleUserMessage();
        }
    });
})();
/**
 * 📝 TodoMVC JavaScript 文件
 * 
 * 跟着教程，在这里编写 JavaScript 代码
 * 
 * 提示：
 * - 使用 console.log() 调试
 * - 按 F12 打开浏览器开发者工具查看输出
 */


// 等待 DOM 加载完成后再执行代码
document.addEventListener('DOMContentLoaded', function() {
    initTodoList();
    initNavigation();
    initCountdown();
    // 启动定时器，每分钟刷新一次
    startCountdownTimer();
    initTimeline();
});

//视图切换逻辑
function initNavigation() {
    // 获取所有导航按钮
    const navItems = document.querySelectorAll('.nav-item');
    // 获取所有视图页面
    const views = document.querySelectorAll('.view');
    
    // 为每个导航按钮添加点击事件
    navItems.forEach(function(navItem) {
        navItem.addEventListener('click', function() {
            // 获取要显示的视图名称（从 data-view 属性读取）
            const targetView = this.getAttribute('data-view');
            
            // 移除所有导航按钮的 active 类
            navItems.forEach(function(item) {
                item.classList.remove('active');
            });
            
            // 为当前点击的按钮添加 active 类
            this.classList.add('active');
            
            // 隐藏所有视图
            views.forEach(function(view) {
                view.classList.remove('active');
            });
            
            // 显示目标视图
            const targetViewElement = document.getElementById(targetView + '-view');
            if (targetViewElement) {
                targetViewElement.classList.add('active');
            }
        });
    });
}

// ========================================
// Todo List 功能
// ========================================

// 用于存储所有 Todo 项的数组
let todos = [];
let currentFilter = 'all';
let currentTagFilter = 'all';

// 标签配置
const TAG_CONFIG = {
    work: { label: '工作', class: 'work' },
    life: { label: '生活', class: 'life' },
    study: { label: '学习', class: 'study' }
};
/**
 * 初始化 Todo List 功能
 */
function initTodoList() {
    // 获取 DOM 元素
    const todoInput = document.getElementById('todo-input');
    const addTodoBtn = document.getElementById('add-todo-btn');
    const todoTagSelect = document.getElementById('todo-tag-select');

    // 点击添加按钮时添加新 Todo
    addTodoBtn.addEventListener('click', function() {
        addTodo();
    });

    // 按回车键时添加新 Todo
    todoInput.addEventListener('keypress', function(event) {
        // event.key === 'Enter' 表示按下了回车键
        if (event.key === 'Enter') {
            addTodo();
        }
    });

    const filterBtns = document.querySelectorAll('.filter-btn');

    // 状态筛选按钮点击事件
    filterBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
            // 更新按钮状态
            filterBtns.forEach(function(b) {
                b.classList.remove('active');
            });
            this.classList.add('active');

            // 更新筛选状态并重新渲染
            currentFilter = this.getAttribute('data-filter');
            saveFilterState();
            renderTodos();
        });
    });

    // 标签筛选按钮点击事件
    const tagFilterBtns = document.querySelectorAll('.tag-filter-btn');
    tagFilterBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
            // 更新按钮状态
            tagFilterBtns.forEach(function(b) {
                b.classList.remove('active');
            });
            this.classList.add('active');

            // 更新标签筛选状态并重新渲染
            currentTagFilter = this.getAttribute('data-tag-filter');
            saveFilterState();
            renderTodos();
        });
    });
    
    const todoList = document.getElementById('todo-list');

    // 使用事件委托处理列表中的点击事件
    todoList.addEventListener('click', function(event) {
        // event.target 是实际被点击的元素
        const target = event.target;

        // 获取被点击元素所属的 Todo 项
        const todoItem = target.closest('.todo-item');
        if (!todoItem) return; // 如果没找到，说明点击的不是 Todo 项内部

        // 获取 Todo 项的 ID（从 data-id 属性读取）
        const todoId = parseInt(todoItem.getAttribute('data-id'));

        // 判断点击的是复选框
        if (target.classList.contains('todo-checkbox')) {
            toggleTodo(todoId);
        } else if (target.classList.contains('todo-delete')) {
            // 删除按钮
            deleteTodo(todoId);
        } else if (target.classList.contains('todo-tag')) {
            // 点击标签进行编辑
            event.stopPropagation();
            startTagEdit(todoId, target);
        }
    });

    // 处理标签编辑下拉框的 change 事件
    todoList.addEventListener('change', function(event) {
        if (event.target.classList.contains('tag-edit-select')) {
            const todoItem = event.target.closest('.todo-item');
            if (todoItem) {
                const todoId = parseInt(todoItem.getAttribute('data-id'));
                const newTag = event.target.value;
                updateTodoTag(todoId, newTag);
            }
        }
    });

    loadTodosFromStorage();
    loadFilterState();

    // 初始渲染
    renderTodos();
}


/**
 * 添加新的 Todo 项
 */
//思路：把input内容取过来，同时清空表单，放到本地，
//get：获取输入框元素，判空，对象的属性，

function addTodo() {
    const todoInput = document.getElementById('todo-input');
    const todoTagSelect = document.getElementById('todo-tag-select');
    const text = todoInput.value.trim();
    const tag = todoTagSelect.value;

    if (text === '') {
        return;
    }

    const newTodo = {
        id: Date.now(),
        text: text,
        completed: false,
        tag: tag || null
    };

    // 添加到数组
    todos.push(newTodo);
    saveTodosToStorage();

    // 清空输入框和标签选择
    todoInput.value = '';
    todoTagSelect.value = '';

    // 重新渲染列表
    renderTodos();

    // 在控制台输出，方便调试
    console.log('添加了新 Todo:', newTodo);
    console.log('当前所有 Todo:', todos);
}

/**
 * 渲染 Todo 列表
 */
function renderTodos() {
    // 获取列表容器和空状态提示
    const todoList = document.getElementById('todo-list');
    const todoEmpty = document.getElementById('todo-empty');
    const todoCountNum = document.getElementById('todo-count-num');

    // 根据状态筛选条件过滤 Todo 项
    let filteredTodos;
    if (currentFilter === 'active') {
        filteredTodos = todos.filter(function(item) {
            return !item.completed; // 未完成的
        });
    } else if (currentFilter === 'completed') {
        filteredTodos = todos.filter(function(item) {
            return item.completed; // 已完成的
        });
    } else {
        filteredTodos = todos; // 全部
    }

    // 根据标签筛选条件进一步过滤
    if (currentTagFilter !== 'all') {
        filteredTodos = filteredTodos.filter(function(item) {
            return item.tag === currentTagFilter;
        });
    }

    // 更新计数（显示筛选后的数量）
    todoCountNum.textContent = filteredTodos.length;

    // 如果没有 Todo 项，显示空状态
    if (todos.length === 0) {
        todoList.innerHTML = '';
        todoEmpty.classList.add('show');
        return;
    }

    // 隐藏空状态
    todoEmpty.classList.remove('show');

    // 生成 HTML 字符串
    let html = '';
    filteredTodos.forEach(function(todo) {
        // 根据完成状态添加不同的类名
        const completedClass = todo.completed ? 'completed' : '';

        // 生成标签 HTML
        let tagHtml = '';
        if (todo.tag && TAG_CONFIG[todo.tag]) {
            const tagConfig = TAG_CONFIG[todo.tag];
            tagHtml = `<span class="todo-tag ${tagConfig.class}" data-tag="${todo.tag}">
                <span class="tag-dot"></span>${tagConfig.label}
            </span>`;
        } else {
            // 无标签时显示添加标签按钮
            tagHtml = `<span class="todo-tag" data-tag="">+ 标签</span>`;
        }

        html += `
            <li class="todo-item ${completedClass}" data-id="${todo.id}">
                <div class="todo-checkbox"></div>
                <span class="todo-text">${todo.text}</span>
                ${tagHtml}
                <button class="todo-delete">删除</button>
            </li>
        `;
    });

    // 更新 DOM
    todoList.innerHTML = html;
}


//删除功能，伪代码：
//获取节点，他们的父级盒子应该是todo-list
//事件委托，点击li里面的button，这里用到了四个新的函数


// 标记//
function deleteTodo(id) {
    // 使用 filter 方法创建一个新数组，排除要删除的项
    todos = todos.filter(function(item) {
        return item.id !== id;
    });
    saveTodosToStorage();
    // 重新渲染
    renderTodos();
    
    console.log('删除了 ID 为', id, '的 Todo');
}

/**
 * 切换 Todo 项的完成状态
 * @param {number} id - Todo 项的 ID
 */
function toggleTodo(id) {
    // 在数组中找到对应的 Todo 项
    const todo = todos.find(function(item) {
        return item.id === id;
    });
    
    if (todo) {
        // 切换完成状态（true 变 false，false 变 true）
        todo.completed = !todo.completed;
        saveTodosToStorage();
        // 重新渲染
        renderTodos();
        
        console.log('切换了 Todo 状态:', todo);
    }
}

function saveTodosToStorage() {
    // 把数组转换成 JSON 字符串后存储
    localStorage.setItem('todos', JSON.stringify(todos));
}

/**
 * 从 localStorage 加载 Todo 数据
 */
function loadTodosFromStorage() {
    const stored = localStorage.getItem('todos');
    if (stored) {
        try {
            todos = JSON.parse(stored);
        } catch (e) {
            // 如果解析失败，使用空数组
            todos = [];
        }
    }
}

/**
 * 保存筛选状态到 localStorage
 */
function saveFilterState() {
    const filterState = {
        currentFilter: currentFilter,
        currentTagFilter: currentTagFilter
    };
    localStorage.setItem('todoFilterState', JSON.stringify(filterState));
}

/**
 * 从 localStorage 加载筛选状态
 */
function loadFilterState() {
    const stored = localStorage.getItem('todoFilterState');
    if (stored) {
        try {
            const filterState = JSON.parse(stored);
            currentFilter = filterState.currentFilter || 'all';
            currentTagFilter = filterState.currentTagFilter || 'all';

            // 更新 UI 上的筛选按钮状态
            updateFilterButtonsUI();
        } catch (e) {
            // 如果解析失败，使用默认值
            currentFilter = 'all';
            currentTagFilter = 'all';
        }
    }
}

/**
 * 更新筛选按钮的 UI 状态
 */
function updateFilterButtonsUI() {
    // 更新状态筛选按钮
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(function(btn) {
        btn.classList.remove('active');
        if (btn.getAttribute('data-filter') === currentFilter) {
            btn.classList.add('active');
        }
    });

    // 更新标签筛选按钮
    const tagFilterBtns = document.querySelectorAll('.tag-filter-btn');
    tagFilterBtns.forEach(function(btn) {
        btn.classList.remove('active');
        if (btn.getAttribute('data-tag-filter') === currentTagFilter) {
            btn.classList.add('active');
        }
    });
}

/**
 * 开始编辑标签
 */
function startTagEdit(todoId, tagElement) {
    const todo = todos.find(function(item) {
        return item.id === todoId;
    });

    if (!todo) return;

    // 创建下拉选择框
    const select = document.createElement('select');
    select.className = 'tag-edit-select';

    // 添加选项
    const options = [
        { value: '', label: '无标签' },
        { value: 'work', label: '工作' },
        { value: 'life', label: '生活' },
        { value: 'study', label: '学习' }
    ];

    options.forEach(function(opt) {
        const option = document.createElement('option');
        option.value = opt.value;
        option.textContent = opt.label;
        if (opt.value === (todo.tag || '')) {
            option.selected = true;
        }
        select.appendChild(option);
    });

    // 替换标签元素为下拉框
    tagElement.replaceWith(select);
    select.focus();
}

/**
 * 更新 Todo 的标签
 */
function updateTodoTag(todoId, newTag) {
    const todo = todos.find(function(item) {
        return item.id === todoId;
    });

    if (todo) {
        todo.tag = newTag || null;
        saveTodosToStorage();
        renderTodos();
        console.log('更新了 Todo 标签:', todo);
    }
}

// ========================================
// 倒数日功能
// ========================================

// 用于存储所有倒数日的数组
let countdowns = [];

/**
 * 初始化倒数日功能
 */
function initCountdown() {
    // 从 localStorage 加载已保存的数据
    loadCountdownsFromStorage();
    
    // 获取 DOM 元素
    const countdownName = document.getElementById('countdown-name');
    const countdownDate = document.getElementById('countdown-date');
    const addCountdownBtn = document.getElementById('add-countdown-btn');
    const countdownList = document.getElementById('countdown-list');
    
    // 点击添加按钮时添加新倒数日
    addCountdownBtn.addEventListener('click', function() {
        addCountdown();
    });
    
    // 按回车键时添加新倒数日
    countdownName.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            addCountdown();
        }
    });

    // 获取倒数日列表容器
    // const countdownList = document.getElementById('countdown-list');

    // 使用事件委托处理倒数日列表中的点击事件
    countdownList.addEventListener('click', function(event) {
        const target = event.target;
        const card = target.closest('.countdown-card');
        if (!card) return;
        
        const countdownId = parseInt(card.getAttribute('data-id'));
        
        // 点击删除按钮
        if (target.classList.contains('btn-danger')) {
            deleteCountdown(countdownId);
        }
        // 标记，为什么写在这里？
    });
    
    // 处理日期修改（change 事件）
    countdownList.addEventListener('change', function(event) {
        const target = event.target;
        if (target.classList.contains('countdown-edit-date')) {
            const card = target.closest('.countdown-card');
            if (card) {
                const countdownId = parseInt(card.getAttribute('data-id'));
                updateCountdownDate(countdownId, target.value);
            }
        }
    });
    
    // 初始渲染
    renderCountdowns();
}

// 添加倒数日函数

function addCountdown() {
    const nameInput = document.getElementById('countdown-name');
    const dateInput = document.getElementById('countdown-date');
    
    const name = nameInput.value.trim();
    const date = dateInput.value;
    
    // 验证输入
    if (name === '' || date === '') {
        alert('请输入事件名称和日期！');
        return;
    }
    
    // 验证日期是否有效
    const targetDate = new Date(date);
    if (isNaN(targetDate.getTime())) {
        alert('请输入有效的日期！');
        return;
    }
    
    // 创建新的倒数日对象
    const newCountdown = {
        id: Date.now(),
        name: name,
        date: date  // 存储格式：'2024-12-31'
    };
    
    // 添加到数组
    countdowns.push(newCountdown);
    
    // 保存到 localStorage
    saveCountdownsToStorage();
    
    // 清空输入框
    nameInput.value = '';
    dateInput.value = '';
    
    // 重新渲染列表
    renderCountdowns();
    
    console.log('添加了新倒数日:', newCountdown);
}

/**
 * 删除倒数日
 * @param {number} id - 倒数日的 ID
 */
function deleteCountdown(id) {
    countdowns = countdowns.filter(function(item) {
        return item.id !== id;
    });
    console.log('删除了 ID 为', id, '的倒数日');
    
    saveCountdownsToStorage();
    renderCountdowns();
}

/**
 * 计算距离目标日期还有多少天
 * @param {string} dateString - 目标日期字符串 (YYYY-MM-DD 格式)
 * @returns {number} 剩余天数（负数表示已过期）
 */
function calculateDaysRemaining(dateString) {
    // 获取今天的日期（设置时分秒为0，只比较日期部分）
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // 解析目标日期
    const targetDate = new Date(dateString);
    targetDate.setHours(0, 0, 0, 0);
    
    // 计算时间差（毫秒）
    const timeDiff = targetDate.getTime() - today.getTime();
    
    // 转换为天数
    // 1天 = 24小时 × 60分钟 × 60秒 × 1000毫秒 = 86400000毫秒
    const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    
    return daysDiff;
}

/**
 * 启动倒计时刷新定时器
 */
function startCountdownTimer() {
    // 每分钟刷新一次（60000 毫秒）
    setInterval(function() {
        renderCountdowns();
    }, 60000);
}






/**
 * 渲染倒数日列表
 */
function renderCountdowns() {
    const countdownList = document.getElementById('countdown-list');
    const countdownEmpty = document.getElementById('countdown-empty');
    
    // 如果没有倒数日，显示空状态
    if (countdowns.length === 0) {
        countdownList.innerHTML = '';
        countdownEmpty.classList.add('show');
        return;
    }
    
    // 隐藏空状态
    countdownEmpty.classList.remove('show');


    // 标记
    // 按日期排序（最近的在前面）
    const sortedCountdowns = [...countdowns].sort(function(a, b) {
        return new Date(a.date) - new Date(b.date);
    });

    // 生成简单的 HTML
    let html = '';
    sortedCountdowns.forEach(function(countdown) {
        const daysRemaining = calculateDaysRemaining(countdown.date);
     
        const formattedDate = formatDate(countdown.date);
        
        let statusClass = '';
        let daysText = '';
        let daysLabel = '';
        
        if (daysRemaining === 0) {
            statusClass = 'today';
            daysText = '🎉';
            daysLabel = '就是今天！';
        } else if (daysRemaining > 0) {
            daysText = daysRemaining;
            daysLabel = '天后';
        } else {
            statusClass = 'past';
            daysText = Math.abs(daysRemaining);
            daysLabel = '天前';
        }
        
        html += `
            <div class="countdown-card ${statusClass}" data-id="${countdown.id}">
                <div class="countdown-info">
                    <div class="countdown-name">${escapeHtml(countdown.name)}</div>
                    <div class="countdown-date-display">
                        目标日期：${formattedDate}
                        <input type="date" class="countdown-edit-date" value="${countdown.date}" 
                            style="margin-left: 12px; padding: 4px 8px; border: 1px solid #ddd; border-radius: 4px; font-size: 12px;">
                    </div>
                </div>
                <div class="countdown-days">
                    <div class="countdown-number">${daysText}</div>
                    <div class="countdown-label">${daysLabel}</div>
                </div>
                <div class="countdown-actions">
                    <button class="btn btn-small btn-danger">删除</button>
                </div>
            </div>
        `;
    });
  
    
    // 更新 DOM
    countdownList.innerHTML = html;
}

/**
 * 启动倒计时刷新定时器
 */
function startCountdownTimer() {
    // 每分钟刷新一次（60000 毫秒）
    countdownTimer = setInterval(function() {
        renderCountdowns();
    }, 60000);
}



function loadCountdownsFromStorage() {
    const stored = localStorage.getItem('countdowns');
    if (stored) {
        try {
            countdowns = JSON.parse(stored);
        } catch (e) {
            countdowns = [];
        }
    }
}


function saveCountdownsToStorage() {
    localStorage.setItem('countdowns', JSON.stringify(countdowns));
}














// ========================================
// 工具函数
// ========================================

/**
 * HTML 转义，防止 XSS 攻击
 * @param {string} text - 要转义的文本
 * @returns {string} 转义后的安全文本
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
/**
 * 格式化日期为中文格式
 * @param {string} dateString - 日期字符串 (YYYY-MM-DD)
 * @returns {string} 格式化后的日期
 */
function formatDate(dateString) {
    const date = new Date(dateString);
    console.log('')
    const year = date.getFullYear();
    const month = date.getMonth() + 1;  // getMonth() 返回 0-11
    const day = date.getDate();
    return year + '年' + month + '月' + day + '日';
}



// ========================================
// 路线图/进度表功能
// ========================================

// 用于存储所有里程碑的数组
let milestones = [];

/**
 * 初始化路线图功能
 */
function initTimeline() {
    // 从 localStorage 加载已保存的数据
    loadMilestonesFromStorage();
    
    // 获取 DOM 元素
    const milestoneName = document.getElementById('milestone-name');
    const milestoneDate = document.getElementById('milestone-date');
    const addMilestoneBtn = document.getElementById('add-milestone-btn');
    
    // 点击添加按钮时添加新里程碑
    addMilestoneBtn.addEventListener('click', function() {
        addMilestone();
    });
    
    // 按回车键时添加新里程碑
    milestoneName.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            addMilestone();
        }
    });
    
    // 初始渲染
    renderTimeline();
    renderMilestones();
}


/**
 * 添加新的里程碑
 */
function addMilestone() {
    const nameInput = document.getElementById('milestone-name');
    const dateInput = document.getElementById('milestone-date');
    
    const name = nameInput.value.trim();
    const date = dateInput.value;
    
    // 验证输入
    if (name === '' || date === '') {
        alert('请输入目标名称和截止日期！');
        return;
    }
    
    // 验证日期是否有效
    const targetDate = new Date(date);
    if (isNaN(targetDate.getTime())) {
        alert('请输入有效的日期！');
        return;
    }
    
    // 创建新的里程碑对象
    const newMilestone = {
        id: Date.now(),
        name: name,
        date: date,
        status: 'pending',      // 'pending' | 'completed' | 'cancelled'
        completedDate: null     // 完成时记录完成日期
    };
    
    // 添加到数组
    milestones.push(newMilestone);
    
    // 保存到 localStorage
    saveMilestonesToStorage();
    
    // 清空输入框
    nameInput.value = '';
    dateInput.value = '';
    
    // 重新渲染
    renderTimeline();
    renderMilestones();
}

/**
 * 渲染时间轴
 */
function renderTimeline() {
    const timelineContainer = document.getElementById('timeline-container');
    const timelineTrack = document.getElementById('timeline-track');
    const todayMarker = document.getElementById('today-marker');
    
    // 只显示进行中的里程碑（已完成和已取消的不在时间轴显示）
    const activeMilestones = milestones.filter(function(m) {
        return m.status === 'pending';
    });
    
    // 如果没有活跃的里程碑，清除节点并隐藏时间轴
    if (activeMilestones.length === 0) {
        // 先清除所有里程碑节点，避免节点残留
        const existingNodes = timelineTrack.querySelectorAll('.milestone-node');
        existingNodes.forEach(function(node) {
            node.remove();
        });
        timelineContainer.classList.remove('show');
        return;
    }
    
    // 显示时间轴
    timelineContainer.classList.add('show');
    
    // 计算时间范围
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // 找出所有日期的最小值和最大值
    // minDate 就是今天（时间轴从今天开始）
    let minDate = new Date(today);
    let maxDate = new Date(today);
    maxDate.setDate(maxDate.getDate() + 30);  // 默认至少显示30天
    
    activeMilestones.forEach(function(m) {
        const mDate = new Date(m.date);
        // 只考虑未来的里程碑来扩展时间轴
        if (mDate > maxDate) maxDate = new Date(mDate);
    });
    
    // 在右端加一些余量（左端不需要，因为从今天开始）
    maxDate.setDate(maxDate.getDate() + 14);
    
    // 今天标记已经用起点表示，不需要单独计算位置
    
    // 清除已有的里程碑节点（保留今天标记）
    const existingNodes = timelineTrack.querySelectorAll('.milestone-node');
    existingNodes.forEach(function(node) {
        node.remove();
    });
    
    // 添加里程碑节点
    activeMilestones.forEach(function(milestone, index) {
        const mDate = new Date(milestone.date);
        const position = ((mDate - minDate) / (maxDate - minDate)) * 100;
        
        // 创建节点元素
        const node = document.createElement('div');
        node.className = 'milestone-node';
        
        // 奇数和偶数交替显示在上方/下方，避免标签重叠
        if (index % 2 === 0) {
            node.classList.add('milestone-below'); // 偶数在下方（默认）
        } else {
            node.classList.add('milestone-above'); // 奇数在上方
        }
        
        // 添加状态类
        if (milestone.status === 'completed') {
            node.classList.add('completed');
        }
        
        // 设置位置
        node.style.left = position + '%';
        
        // 设置内容
        node.innerHTML = `
            <div class="milestone-dot"></div>
            <div class="milestone-node-label">${escapeHtml(milestone.name)}</div>
        `;
        
        // 添加到时间轴
        timelineTrack.appendChild(node);
    });
}


const milestoneList = document.getElementById('milestone-list');

// 使用事件委托处理里程碑列表中的事件
milestoneList.addEventListener('click', function(event) {
    const target = event.target;
    const card = target.closest('.milestone-card');
    if (!card) return;
    
    const milestoneId = parseInt(card.getAttribute('data-id'));
    
    // 点击删除按钮
    if (target.classList.contains('btn-danger')) {
        deleteMilestone(milestoneId);
    }
});

// 处理状态变更和日期修改
milestoneList.addEventListener('change', function(event) {
    const target = event.target;
    const card = target.closest('.milestone-card');
    if (!card) return;
    
    const milestoneId = parseInt(card.getAttribute('data-id'));
    
    // 状态选择器变更
    if (target.classList.contains('status-select')) {
        updateMilestoneStatus(milestoneId, target.value);
    }
    // 日期输入框变更
    else if (target.classList.contains('milestone-edit-date')) {
        updateMilestoneDate(milestoneId, target.value);
    }
});

/**
 * 更新里程碑状态
 * @param {number} id - 里程碑的 ID
 * @param {string} newStatus - 新状态：'pending' | 'completed' | 'cancelled'
 */
function updateMilestoneStatus(id, newStatus) {
    const milestone = milestones.find(function(item) {
        return item.id === id;
    });
    
    if (milestone) {
        milestone.status = newStatus;
        
        // 如果标记为已完成，记录完成日期
        if (newStatus === 'completed') {
            milestone.completedDate = new Date().toISOString().split('T')[0];
        } else {
            milestone.completedDate = null;
        }
        
        saveMilestonesToStorage();
        
        // 重新渲染时间轴和卡片
        renderTimeline();
        renderMilestones();
    }
}

/**
 * 删除里程碑
 * @param {number} id - 里程碑的 ID
 */
function deleteMilestone(id) {
    milestones = milestones.filter(function(item) {
        return item.id !== id;
    });
    
    saveMilestonesToStorage();
    renderTimeline();
    renderMilestones();
}

/**
 * 更新里程碑日期
 * @param {number} id - 里程碑的 ID
 * @param {string} newDate - 新日期
 */
function updateMilestoneDate(id, newDate) {
    const milestone = milestones.find(function(item) {
        return item.id === id;
    });
    
    if (milestone && newDate) {
        milestone.date = newDate;
        saveMilestonesToStorage();
        
        // 重新渲染（这会重新计算时间轴范围和位置）
        renderTimeline();
        renderMilestones();
    }
}

/**
 * 渲染里程碑卡片列表
 */
function renderMilestones() {
    const milestoneList = document.getElementById('milestone-list');
    const timelineEmpty = document.getElementById('timeline-empty');
    
    // 如果没有里程碑，显示空状态
    if (milestones.length === 0) {
        milestoneList.innerHTML = '';
        timelineEmpty.classList.add('show');
        return;
    }
    
    // 隐藏空状态
    timelineEmpty.classList.remove('show');
    
    // 按状态和日期双重排序（进行中在上，已完成在下）
    const sortedMilestones = [...milestones].sort(function(a, b) {
        // 第一优先级：未完成的排前面
        if (a.status === 'pending' && b.status !== 'pending') return -1;
        if (a.status !== 'pending' && b.status === 'pending') return 1;
        
        // 第二优先级：同状态按日期排
        return new Date(a.date) - new Date(b.date);
    });
    
    // 生成 HTML
    let html = '';
    sortedMilestones.forEach(function(milestone, index) {
        // 在第一个非进行中的卡片前插入分隔线
        if (index > 0 && 
            sortedMilestones[index - 1].status === 'pending' && 
            milestone.status !== 'pending') {
            const completedCount = milestones.filter(m => m.status === 'completed').length;
            html += `
                <div style="
                    margin: 24px 0;
                    padding: 12px;
                    background: #f0fff4;
                    border: 1px solid #c6f6d5;
                    border-radius: 8px;
                    text-align: center;
                    color: #38a169;
                    font-size: 13px;
                    font-weight: 500;
                ">
                    ✅ 已完成的里程碑 (${completedCount})
                </div>
            `;
        }
        const daysRemaining = calculateDaysRemaining(milestone.date);
        const formattedDate = formatDate(milestone.date);
        
        // 状态类
        let statusClass = '';
        let daysText = '';
        
        if (milestone.status === 'completed') {
            statusClass = 'completed';
            daysText = '✅ 已完成';
            if (milestone.completedDate) {
                daysText += '（' + formatDate(milestone.completedDate) + '）';
            }
        } else if (milestone.status === 'cancelled') {
            statusClass = 'cancelled';
            daysText = '已取消';
        } else {
            // 进行中状态
            if (daysRemaining === 0) {
                daysText = '🎯 今天截止';
            } else if (daysRemaining > 0) {
                daysText = '还剩 ' + daysRemaining + ' 天';
            } else {
                daysText = '已超期 ' + Math.abs(daysRemaining) + ' 天';
            }
        }
        
        html += `
            <div class="milestone-card ${statusClass}" data-id="${milestone.id}">
                <div class="milestone-status-indicator"></div>
                <div class="milestone-info">
                    <div class="milestone-name">${escapeHtml(milestone.name)}</div>
                    <div class="milestone-date-display">
                        截止日期：${formattedDate}
                        <input type="date" class="milestone-edit-date" value="${milestone.date}" 
                               style="margin-left: 12px; padding: 4px 8px; border: 1px solid #ddd; border-radius: 4px; font-size: 12px;">
                    </div>
                </div>
                <div class="milestone-days-left">${daysText}</div>
                <div class="milestone-actions">
                    <select class="status-select">
                        <option value="pending" ${milestone.status === 'pending' ? 'selected' : ''}>进行中</option>
                        <option value="completed" ${milestone.status === 'completed' ? 'selected' : ''}>已完成</option>
                        <option value="cancelled" ${milestone.status === 'cancelled' ? 'selected' : ''}>已取消</option>
                    </select>
                    <button class="btn btn-small btn-danger">删除</button>
                </div>
            </div>
        `;
    });
    
    // 更新 DOM
    milestoneList.innerHTML = html;
}


/**
 * 从 localStorage 加载里程碑数据
 */
function loadMilestonesFromStorage() {
    const stored = localStorage.getItem('milestones');
    if (stored) {
        try {
            milestones = JSON.parse(stored);
        } catch (e) {
            milestones = [];
        }
    }
}

/**
 * 保存里程碑数据到 localStorage
 */
function saveMilestonesToStorage() {
    localStorage.setItem('milestones', JSON.stringify(milestones));
}
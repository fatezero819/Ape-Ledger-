// Ape Ledger 主要JavaScript逻辑
// 数据存储和状态管理

// 生成唯一ID
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// 数据存储键名
const STORAGE_KEYS = {
    PROJECTS: 'ape_ledger_projects',
    WALLETS: 'ape_ledger_wallets',
    SETTINGS: 'ape_ledger_settings'
};

// 项目相关函数
function getProjects() {
    try {
        const data = localStorage.getItem(STORAGE_KEYS.PROJECTS);
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error('Error loading projects:', error);
        return [];
    }
}

function saveProjects(projects) {
    try {
        localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
    } catch (error) {
        console.error('Error saving projects:', error);
    }
}

// 钱包相关函数
function getWallets() {
    try {
        const data = localStorage.getItem(STORAGE_KEYS.WALLETS);
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error('Error loading wallets:', error);
        return [];
    }
}

function saveWallets(wallets) {
    try {
        localStorage.setItem(STORAGE_KEYS.WALLETS, JSON.stringify(wallets));
    } catch (error) {
        console.error('Error saving wallets:', error);
    }
}

// 设置相关函数
function getSettings() {
    try {
        const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
        return data ? JSON.parse(data) : {
            theme: 'light',
            currency: 'USDT',
            language: 'zh-CN'
        };
    } catch (error) {
        console.error('Error loading settings:', error);
        return {
            theme: 'light',
            currency: 'USDT',
            language: 'zh-CN'
        };
    }
}

function saveSettings(settings) {
    try {
        localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (error) {
        console.error('Error saving settings:', error);
    }
}

// 数据统计函数
function calculateProjectStats(projects = null) {
    const projectList = projects || getProjects();
    
    const stats = {
        totalProjects: projectList.length,
        totalCost: 0,
        totalIncome: 0,
        totalProfit: 0,
        typeDistribution: {},
        statusDistribution: {}
    };
    
    projectList.forEach(project => {
        stats.totalCost += project.cost || 0;
        stats.totalIncome += project.income || 0;
        
        // 类型分布
        if (!stats.typeDistribution[project.type]) {
            stats.typeDistribution[project.type] = { count: 0, cost: 0, income: 0 };
        }
        stats.typeDistribution[project.type].count++;
        stats.typeDistribution[project.type].cost += project.cost || 0;
        stats.typeDistribution[project.type].income += project.income || 0;
        
        // 状态分布
        if (!stats.statusDistribution[project.status]) {
            stats.statusDistribution[project.status] = 0;
        }
        stats.statusDistribution[project.status]++;
    });
    
    stats.totalProfit = stats.totalIncome - stats.totalCost;
    
    return stats;
}

// 格式化数字
function formatNumber(num, decimals = 2) {
    return parseFloat(num).toFixed(decimals);
}

function formatCurrency(num, currency = 'USDT') {
    return `${formatNumber(num)} ${currency}`;
}

// 格式化地址
function formatAddress(address, length = 4) {
    if (!address || address.length < 10) return address;
    return `${address.substring(0, length)}...${address.substring(address.length - length)}`;
}

// 获取项目类型颜色
function getProjectTypeColor(type) {
    const colors = {
        '测试网': '#8E44AD',
        '主网': '#3498DB',
        '节点': '#27AE60',
        'DeFi': '#F39C12',
        'NFT': '#E91E63',
        '其他': '#6C757D'
    };
    return colors[type] || '#6C757D';
}

// 获取状态颜色
function getStatusColor(status) {
    const colors = {
        '进行中': '#E67E22',
        '已完成': '#16A085',
        '放弃': '#E74C3C'
    };
    return colors[status] || '#6C757D';
}

// 导航函数
function navigateToProject(projectId = null) {
    if (projectId) {
        window.location.href = `project.html?id=${projectId}`;
    } else {
        window.location.href = 'project.html';
    }
}

function navigateToWallet() {
    window.location.href = 'wallet.html';
}

// 页面加载时的初始化
document.addEventListener('DOMContentLoaded', function() {
    // 根据当前页面执行不同的初始化
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    switch (currentPage) {
        case 'index.html':
        case '':
            initDashboard();
            break;
        case 'project.html':
            // 项目管理页面的初始化在project.html中处理
            break;
        case 'wallet.html':
            // 钱包管理页面的初始化在wallet.html中处理
            break;
    }
});

// 初始化仪表板
function initDashboard() {
    loadDashboardData();
    setupFilters();
    initChart();
}

// 加载仪表板数据
function loadDashboardData() {
    const stats = calculateProjectStats();
    
    // 更新统计数据
    animateCounter('totalProjects', stats.totalProjects, 0);
    animateCounter('totalCost', stats.totalCost, 2);
    animateCounter('totalIncome', stats.totalIncome, 2);
    animateCounter('totalProfit', stats.totalProfit, 2);
    
    // 更新盈亏颜色
    const profitElement = document.getElementById('totalProfit');
    if (stats.totalProfit > 0) {
        profitElement.classList.add('profit-positive');
        profitElement.classList.remove('profit-negative');
    } else if (stats.totalProfit < 0) {
        profitElement.classList.add('profit-negative');
        profitElement.classList.remove('profit-positive');
    }
    
    // 加载项目列表
    loadProjectList();
}

// 数字动画
function animateCounter(elementId, targetValue, decimals = 0) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    const startValue = 0;
    const duration = 1000;
    const startTime = performance.now();
    
    function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // 使用缓动函数
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const currentValue = startValue + (targetValue - startValue) * easeOutQuart;
        
        if (decimals > 0) {
            element.textContent = formatCurrency(currentValue);
        } else {
            element.textContent = Math.floor(currentValue);
        }
        
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        } else {
            if (decimals > 0) {
                element.textContent = formatCurrency(targetValue);
            } else {
                element.textContent = targetValue;
            }
        }
    }
    
    requestAnimationFrame(updateCounter);
}

// 加载项目列表
function loadProjectList(projects = null) {
    const projectList = projects || getProjects();
    const container = document.getElementById('projectList');
    const emptyState = document.getElementById('emptyState');
    const projectCount = document.getElementById('projectCount');
    
    if (!container) return;
    
    if (projectList.length === 0) {
        container.innerHTML = '';
        if (emptyState) emptyState.classList.remove('hidden');
        if (projectCount) projectCount.textContent = '共 0 个项目';
        return;
    }
    
    if (emptyState) emptyState.classList.add('hidden');
    if (projectCount) projectCount.textContent = `共 ${projectList.length} 个项目`;
    
    container.innerHTML = '';
    
    projectList.forEach((project, index) => {
        const card = createProjectCard(project);
        container.appendChild(card);
        
        // 添加进入动画
        anime({
            targets: card,
            translateY: [50, 0],
            opacity: [0, 1],
            duration: 600,
            delay: index * 100,
            easing: 'easeOutQuart'
        });
    });
}

// 创建项目卡片
function createProjectCard(project) {
    const card = document.createElement('div');
    card.className = 'bg-white rounded-xl shadow-sm p-6 card-hover cursor-pointer';
    card.onclick = () => navigateToProject(project.id);
    
    const typeColor = getProjectTypeColor(project.type);
    const statusColor = getStatusColor(project.status);
    const profitClass = project.profit >= 0 ? 'profit-positive' : 'profit-negative';
    
    // 获取钱包信息
    const wallets = getWallets();
    const wallet = wallets.find(w => w.id === project.walletId);
    const walletDisplay = wallet ? `${wallet.alias} - ${formatAddress(wallet.address)}` : '未选择钱包';
    
    card.innerHTML = `
        <div class="flex justify-between items-start mb-4">
            <div class="flex-1">
                <h3 class="text-lg font-semibold text-gray-900 mb-2">${project.name}</h3>
                <div class="flex items-center space-x-2 mb-3">
                    <span class="type-badge type-${project.type.toLowerCase()}">${project.type}</span>
                    <span class="status-${project.status.toLowerCase()} text-sm font-medium">${project.status}</span>
                </div>
                <div class="text-sm text-gray-600 mb-2">
                    <span class="font-medium">钱包:</span> ${walletDisplay}
                </div>
            </div>
        </div>
        
        <div class="grid grid-cols-3 gap-4 text-sm">
            <div>
                <div class="text-gray-500">成本</div>
                <div class="font-semibold">${formatCurrency(project.cost)}</div>
            </div>
            <div>
                <div class="text-gray-500">收入</div>
                <div class="font-semibold">${formatCurrency(project.income)}</div>
            </div>
            <div>
                <div class="text-gray-500">盈亏</div>
                <div class="font-semibold ${profitClass}">${formatCurrency(project.profit)}</div>
            </div>
        </div>
        
        ${project.notes ? `
            <div class="mt-4 pt-4 border-t border-gray-100">
                <div class="text-xs text-gray-500">备注</div>
                <div class="text-sm text-gray-700 mt-1">${project.notes}</div>
            </div>
        ` : ''}
    `;
    
    return card;
}

// 设置筛选器
function setupFilters() {
    const typeFilter = document.getElementById('typeFilter');
    const statusFilter = document.getElementById('statusFilter');
    
    if (typeFilter) {
        typeFilter.addEventListener('change', applyFilters);
    }
    
    if (statusFilter) {
        statusFilter.addEventListener('change', applyFilters);
    }
}

// 应用筛选器
function applyFilters() {
    const typeFilter = document.getElementById('typeFilter');
    const statusFilter = document.getElementById('statusFilter');
    
    const selectedType = typeFilter ? typeFilter.value : '';
    const selectedStatus = statusFilter ? statusFilter.value : '';
    
    let projects = getProjects();
    
    if (selectedType) {
        projects = projects.filter(p => p.type === selectedType);
    }
    
    if (selectedStatus) {
        projects = projects.filter(p => p.status === selectedStatus);
    }
    
    loadProjectList(projects);
    updateChart(projects);
}

// 清除筛选器
function clearFilters() {
    const typeFilter = document.getElementById('typeFilter');
    const statusFilter = document.getElementById('statusFilter');
    
    if (typeFilter) typeFilter.value = '';
    if (statusFilter) statusFilter.value = '';
    
    loadProjectList();
    updateChart();
}

// 初始化图表
function initChart() {
    const chartContainer = document.getElementById('chartContainer');
    if (!chartContainer || typeof echarts === 'undefined') return;
    
    const chart = echarts.init(chartContainer);
    updateChart();
    
    // 响应式调整
    window.addEventListener('resize', () => {
        chart.resize();
    });
}

// 更新图表
function updateChart(projects = null) {
    const chartContainer = document.getElementById('chartContainer');
    if (!chartContainer || typeof echarts === 'undefined') return;
    
    const chart = echarts.getInstanceByDom(chartContainer);
    if (!chart) return;
    
    const projectList = projects || getProjects();
    const stats = calculateProjectStats(projectList);
    
    // 准备数据
    const data = Object.entries(stats.typeDistribution).map(([type, data]) => ({
        name: type,
        value: data.cost,
        itemStyle: {
            color: getProjectTypeColor(type)
        }
    }));
    
    const option = {
        tooltip: {
            trigger: 'item',
            formatter: function(params) {
                const typeData = stats.typeDistribution[params.name];
                return `
                    <div style="padding: 8px;">
                        <strong>${params.name}</strong><br/>
                        成本: ${formatCurrency(typeData.cost)}<br/>
                        收入: ${formatCurrency(typeData.income)}<br/>
                        项目数: ${typeData.count}<br/>
                        占比: ${params.percent}%
                    </div>
                `;
            }
        },
        legend: {
            orient: 'vertical',
            left: 'left',
            top: 'middle',
            textStyle: {
                fontSize: 12
            }
        },
        series: [
            {
                name: '项目成本分布',
                type: 'pie',
                radius: ['40%', '70%'],
                center: ['65%', '50%'],
                avoidLabelOverlap: false,
                label: {
                    show: false,
                    position: 'center'
                },
                emphasis: {
                    label: {
                        show: true,
                        fontSize: '14',
                        fontWeight: 'bold'
                    },
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                },
                labelLine: {
                    show: false
                },
                data: data,
                animationType: 'scale',
                animationEasing: 'elasticOut',
                animationDelay: function (idx) {
                    return Math.random() * 200;
                }
            }
        ]
    };
    
    chart.setOption(option, true);
}

// 导出数据
function exportData() {
    const data = {
        projects: getProjects(),
        wallets: getWallets(),
        settings: getSettings(),
        exportTime: new Date().toISOString(),
        version: '1.0.0'
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ape-ledger-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// 导入数据
function importData(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            
            if (data.projects) {
                saveProjects(data.projects);
            }
            if (data.wallets) {
                saveWallets(data.wallets);
            }
            if (data.settings) {
                saveSettings(data.settings);
            }
            
            alert('数据导入成功！');
            window.location.reload();
        } catch (error) {
            alert('数据导入失败，请检查文件格式！');
        }
    };
    reader.readAsText(file);
}

// 添加示例数据（用于演示）
function addSampleData() {
    const sampleWallets = [
        {
            id: generateId(),
            alias: '主钱包',
            address: '0x742d35Cc6634C0532925a3b8D4C0C8C3C2C2C2C2',
            network: 'Ethereum',
            createdAt: Date.now() - 86400000 * 7
        },
        {
            id: generateId(),
            alias: 'Arbitrum专用',
            address: '0x8ba1f109551bD432803012645Hac136c22C501e',
            network: 'Arbitrum',
            createdAt: Date.now() - 86400000 * 5
        }
    ];
    
    const sampleProjects = [
        {
            id: generateId(),
            name: 'Starknet测试网交互',
            type: '测试网',
            status: '已完成',
            walletId: sampleWallets[0].id,
            cost: 15.5,
            income: 1200,
            profit: 1184.5,
            notes: '完成了多个DApp交互，获得了STRK空投',
            createdAt: Date.now() - 86400000 * 7,
            updatedAt: Date.now() - 86400000 * 2
        },
        {
            id: generateId(),
            name: 'zkSync Era交互',
            type: '测试网',
            status: '进行中',
            walletId: sampleWallets[1].id,
            cost: 8.2,
            income: 0,
            profit: -8.2,
            notes: '正在进行交互测试',
            createdAt: Date.now() - 86400000 * 5,
            updatedAt: Date.now() - 86400000 * 1
        },
        {
            id: generateId(),
            name: 'Araxxus NFT铸造',
            type: 'NFT',
            status: '已完成',
            walletId: sampleWallets[0].id,
            cost: 0.1,
            income: 0,
            profit: -0.1,
            notes: '铸造了限量NFT，暂时未出售',
            createdAt: Date.now() - 86400000 * 3,
            updatedAt: Date.now() - 86400000 * 3
        }
    ];
    
    saveWallets(sampleWallets);
    saveProjects(sampleProjects);
}

// 检查是否是首次使用
function checkFirstTimeUse() {
    const projects = getProjects();
    const wallets = getWallets();
    
    if (projects.length === 0 && wallets.length === 0) {
        // 首次使用，添加示例数据
        addSampleData();
    }
}

// 应用启动时检查
if (typeof window !== 'undefined') {
    window.addEventListener('load', function() {
        checkFirstTimeUse();
    });
}

// 工具函数 - 显示成功消息
function showSuccessMessage(message, duration = 3000) {
    const toast = document.createElement('div');
    toast.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transform translate-x-full transition-transform duration-300';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    // 显示动画
    setTimeout(() => {
        toast.classList.remove('translate-x-full');
    }, 100);
    
    // 隐藏动画
    setTimeout(() => {
        toast.classList.add('translate-x-full');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, duration);
}

// 工具函数 - 显示错误消息
function showErrorMessage(message, duration = 3000) {
    const toast = document.createElement('div');
    toast.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transform translate-x-full transition-transform duration-300';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    // 显示动画
    setTimeout(() => {
        toast.classList.remove('translate-x-full');
    }, 100);
    
    // 隐藏动画
    setTimeout(() => {
        toast.classList.add('translate-x-full');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, duration);
}
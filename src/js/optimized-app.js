/**
 * ChemSafe Pro - 优化版应用逻辑
 * 专业化工安全工具平台主应用文件
 * 版本: 2.1.0
 */

// 导入所有服务模块
import { ChemicalDataService } from '../services/chemical-data-service.js';
import { LocalDataService } from '../services/local-data-service.js';
import { GHSClassificationSystem } from '../services/ghs-classification.js';
import { ChemicalRiskAssessment } from '../services/risk-assessment.js';
import { StorageCompatibilityChecker } from '../services/storage-compatibility.js';
import { ChemicalCalculatorUtils } from '../utils/calculator-utils-simple.js';
import { MajorHazardAssessment } from '../services/major-hazard-assessment.js';

/**
 * 主应用类
 */
class ChemSafeProApp {
    constructor() {
        this.services = this.initializeServices();
        this.state = this.initializeState();
        this.ui = this.initializeUI();

        this.init();
    }

    /**
     * 初始化所有服务
     */
    initializeServices() {
        return {
            chemicalData: new ChemicalDataService(),
            localData: new LocalDataService(),
            ghsSystem: new GHSClassificationSystem(),
            riskAssessment: new ChemicalRiskAssessment(),
            storageChecker: new StorageCompatibilityChecker(),
            calculator: new ChemicalCalculatorUtils(),
            majorHazard: new MajorHazardAssessment()
        };
    }

    /**
     * 初始化应用状态
     */
    initializeState() {
        return {
            currentModule: 'search',
            currentAssessmentType: 'single',
            searchHistory: JSON.parse(localStorage.getItem('chemsafe-search-history') || '[]'),
            favorites: JSON.parse(localStorage.getItem('chemsafe-favorites') || '[]'),
            settings: JSON.parse(localStorage.getItem('chemsafe-settings') || '{"theme": "light", "language": "zh-CN"}'),
            searchResults: null,
            isLoading: false
        };
    }

    /**
     * 初始化UI元素引用
     */
    initializeUI() {
        return {
            // 主要元素
            loadingIndicator: document.getElementById('loadingIndicator'),
            app: document.getElementById('app'),
            mobileMenu: document.getElementById('mobileMenu'),

            // 搜索相关
            searchInput: document.getElementById('searchInput'),
            searchBtn: document.getElementById('searchBtn'),
            searchResults: document.getElementById('searchResults'),
            advancedPanel: document.getElementById('advancedSearchPanel'),

            // 模块相关
            modules: {
                search: document.getElementById('searchModule'),
                hazard: document.getElementById('hazardModule'),
                tools: document.getElementById('toolsModule'),
                analysis: document.getElementById('analysisModule')
            },

            // 功能卡片
            functionCards: document.querySelectorAll('.function-card'),

            // 重大危险源相关
            assessmentPanels: {
                single: document.getElementById('singleAssessmentPanel'),
                multiple: document.getElementById('multipleAssessmentPanel'),
                standards: document.getElementById('standardsAssessmentPanel')
            },

            // 统计显示
            stats: {
                searchCount: document.getElementById('searchCount'),
                localDbCount: document.getElementById('localDbCount')
            }
        };
    }

    /**
     * 初始化应用
     */
    async init() {
        try {
            this.showLoading();

            // 绑定事件
            this.bindEvents();

            // 初始化UI
            this.initializeInterface();

            // 加载统计数据
            await this.loadStats();

            // 应用主题
            this.applyTheme();

            this.hideLoading();

        } catch (error) {
            console.error('应用初始化失败:', error);
            this.showError('应用初始化失败，请刷新页面重试');
        }
    }

    /**
     * 绑定所有事件
     */
    bindEvents() {
        // 搜索相关事件
        this.bindSearchEvents();

        // 导航相关事件
        this.bindNavigationEvents();

        // 重大危险源评估事件
        this.bindHazardAssessmentEvents();

        // 移动端事件
        this.bindMobileEvents();

        // 全局事件
        this.bindGlobalEvents();
    }

    /**
     * 绑定搜索相关事件
     */
    bindSearchEvents() {
        // 搜索按钮
        this.ui.searchBtn.addEventListener('click', () => this.performSearch());

        // 搜索框回车
        this.ui.searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.performSearch();
            }
        });

        // 搜索框输入事件
        this.ui.searchInput.addEventListener('input', (e) => {
            const clearBtn = document.querySelector('.clear-btn');
            if (e.target.value) {
                clearBtn.style.display = 'block';
            } else {
                clearBtn.style.display = 'none';
            }
        });

        // 搜索类型切换
        document.querySelectorAll('.type-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.type-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.state.currentSearchType = e.target.dataset.type;
            });
        });
    }

    /**
     * 绑定导航相关事件
     */
    bindNavigationEvents() {
        // 功能卡片点击
        this.ui.functionCards.forEach(card => {
            card.addEventListener('click', () => {
                const module = card.dataset.module;
                if (module) {
                    this.switchModule(module);
                }
            });
        });
    }

    /**
     * 绑定重大危险源评估事件
     */
    bindHazardAssessmentEvents() {
        // 评估类型切换按钮
        document.querySelectorAll('.assessment-type-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const type = e.target.closest('button').onclick.toString().match(/'(\w+)'/)?.[1];
                if (type) {
                    this.switchAssessmentType(type);
                }
            });
        });
    }

    /**
     * 绑定移动端事件
     */
    bindMobileEvents() {
        // 汉堡菜单
        document.querySelector('.hamburger-menu').addEventListener('click', () => {
            this.toggleMobileMenu();
        });

        // 移动端菜单项
        document.querySelectorAll('.mobile-menu-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const module = e.target.closest('.mobile-menu-item').onclick.toString().match(/'(\w+)'/)?.[1];
                if (module) {
                    this.switchModule(module);
                    this.toggleMobileMenu();
                }
            });
        });
    }

    /**
     * 绑定全局事件
     */
    bindGlobalEvents() {
        // 窗口大小变化
        window.addEventListener('resize', () => {
            this.handleResize();
        });

        // 键盘事件
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'k') {
                e.preventDefault();
                this.ui.searchInput.focus();
            }
        });

        // 工具面板关闭
        document.addEventListener('click', (e) => {
            const toolPanel = document.getElementById('toolPanel');
            if (e.target === toolPanel) {
                this.closeToolPanel();
            }
        });
    }

    /**
     * 初始化界面
     */
    initializeInterface() {
        // 设置默认模块
        this.switchModule(this.state.currentModule);

        // 设置搜索类型
        const defaultTypeBtn = document.querySelector('.type-btn[data-type="name"]');
        if (defaultTypeBtn) {
            defaultTypeBtn.classList.add('active');
            this.state.currentSearchType = 'name';
        }

        // 初始化高级搜索状态
        this.initAdvancedSearch();

        // 显示欢迎信息
        this.showWelcomeMessage();
    }

    /**
     * 加载统计数据
     */
    async loadStats() {
        try {
            // 本地数据库数量
            const localCount = this.services.localData.getTotalCount();
            this.updateStat('localDbCount', localCount);

            // 今日搜索次数
            const today = new Date().toDateString();
            const todaySearches = this.state.searchHistory.filter(
                item => new Date(item.timestamp).toDateString() === today
            ).length;
            this.updateStat('searchCount', `今日查询: ${todaySearches}`);

        } catch (error) {
            console.warn('统计数据加载失败:', error);
        }
    }

    /**
     * 应用主题
     */
    applyTheme() {
        document.documentElement.setAttribute('data-theme', this.state.settings.theme);
    }

    /**
     * 显示加载状态
     */
    showLoading() {
        if (this.ui.loadingIndicator) {
            this.ui.loadingIndicator.style.display = 'flex';
        }
        if (this.ui.app) {
            this.ui.app.style.display = 'none';
        }
    }

    /**
     * 隐藏加载状态
     */
    hideLoading() {
        if (this.ui.loadingIndicator) {
            this.ui.loadingIndicator.style.display = 'none';
        }
        if (this.ui.app) {
            this.ui.app.style.display = 'block';
        }
    }

    /**
     * 切换模块
     */
    switchModule(moduleName) {
        // 更新状态
        this.state.currentModule = moduleName;

        // 更新功能卡片状态
        this.ui.functionCards.forEach(card => {
            card.classList.remove('active');
            if (card.dataset.module === moduleName) {
                card.classList.add('active');
            }
        });

        // 显示对应模块
        Object.values(this.ui.modules).forEach(module => {
            if (module) module.classList.remove('active');
        });

        const targetModule = this.ui.modules[moduleName];
        if (targetModule) {
            targetModule.classList.add('active');
        }

        // 模块特定初始化
        this.initializeModule(moduleName);
    }

    /**
     * 初始化特定模块
     */
    initializeModule(moduleName) {
        switch (moduleName) {
            case 'search':
                this.ui.searchInput.focus();
                break;
            case 'hazard':
                this.initializeHazardModule();
                break;
            case 'tools':
                this.initializeToolsModule();
                break;
        }
    }

    /**
     * 初始化重大危险源模块
     */
    initializeHazardModule() {
        this.switchAssessmentType(this.state.currentAssessmentType);
    }

    /**
     * 切换评估类型
     */
    switchAssessmentType(type) {
        this.state.currentAssessmentType = type;

        // 更新按钮状态
        document.querySelectorAll('.assessment-type-btn').forEach(btn => {
            btn.classList.remove('active');
        });

        // 显示对应面板
        Object.values(this.ui.assessmentPanels).forEach(panel => {
            if (panel) panel.classList.remove('active');
        });

        const targetPanel = this.ui.assessmentPanels[type] ||
                           document.getElementById(`${type}AssessmentPanel`);
        if (targetPanel) {
            targetPanel.classList.add('active');
        }

        // 更新对应按钮状态
        const activeBtn = [...document.querySelectorAll('.assessment-type-btn')]
            .find(btn => btn.onclick.toString().includes(`'${type}'`));
        if (activeBtn) {
            activeBtn.classList.add('active');
        }
    }

    /**
     * 执行搜索
     */
    async performSearch() {
        const query = this.ui.searchInput.value.trim();
        if (!query) {
            this.showError('请输入搜索关键词');
            return;
        }

        try {
            this.setLoading(true);
            this.clearResults();

            // 记录搜索历史
            this.recordSearch(query, this.state.currentSearchType);

            let results = [];

            // 根据搜索类型执行不同搜索
            switch (this.state.currentSearchType) {
                case 'name':
                    results = await this.searchByName(query);
                    break;
                case 'cas':
                    results = await this.searchByCAS(query);
                    break;
                case 'formula':
                    results = await this.searchByFormula(query);
                    break;
                case 'fuzzy':
                    results = await this.fuzzySearch(query);
                    break;
            }

            this.displaySearchResults(results);
            this.updateSearchCount();

        } catch (error) {
            console.error('搜索失败:', error);
            this.showError('搜索失败，请重试');
        } finally {
            this.setLoading(false);
        }
    }

    /**
     * 按名称搜索
     */
    async searchByName(name) {
        const localResults = this.services.localData.searchByName(name);
        const localArray = localResults ? [localResults] : [];

        try {
            const apiResults = await this.services.chemicalData.searchByName(name);
            const apiArray = apiResults ? [this.formatApiResult(apiResults)] : [];
            return this.mergeSearchResults(localArray, apiArray);
        } catch (error) {
            console.warn('API搜索失败:', error);
            return localArray;
        }
    }

    /**
     * 按CAS号搜索
     */
    async searchByCAS(cas) {
        const localResults = this.services.localData.searchByCAS(cas);
        const localArray = localResults ? [localResults] : [];

        try {
            const apiResults = await this.services.chemicalData.searchByCAS(cas);
            const apiArray = apiResults ? [this.formatApiResult(apiResults)] : [];
            return this.mergeSearchResults(localArray, apiArray);
        } catch (error) {
            console.warn('API搜索失败:', error);
            return localArray;
        }
    }

    /**
     * 按分子式搜索
     */
    async searchByFormula(formula) {
        const localResults = this.services.localData.searchByFormula(formula);
        const localArray = localResults ? [localResults] : [];

        try {
            const apiResults = await this.services.chemicalData.searchByFormula(formula);
            const apiArray = apiResults ? [this.formatApiResult(apiResults)] : [];
            return this.mergeSearchResults(localArray, apiArray);
        } catch (error) {
            console.warn('API搜索失败:', error);
            return localArray;
        }
    }

    /**
     * 格式化API结果
     */
    formatApiResult(apiData) {
        const basicInfo = apiData.basicInfo || {};
        const properties = apiData.properties || {};

        return {
            name: basicInfo.IUPACName || 'Unknown',
            cas: basicInfo.CAS || '',
            formula: basicInfo.MolecularFormula || '',
            molecularWeight: basicInfo.MolecularWeight,
            source: 'API',
            hazards: apiData.ghs || []
        };
    }

    /**
     * 模糊搜索
     */
    async fuzzySearch(query) {
        // 尝试多种搜索方式
        const results = [];

        // 尝试名称搜索
        try {
            const nameResults = await this.searchByName(query);
            results.push(...nameResults);
        } catch (e) {}

        // 如果像CAS号，尝试CAS搜索
        if (/^\d{2,7}-\d{2}-\d$/.test(query)) {
            try {
                const casResults = await this.searchByCAS(query);
                results.push(...casResults);
            } catch (e) {}
        }

        return this.removeDuplicates(results);
    }

    /**
     * 合并搜索结果
     */
    mergeSearchResults(local, api) {
        const combined = [...(local || []), ...(api || [])];
        return this.removeDuplicates(combined);
    }

    /**
     * 去除重复结果
     */
    removeDuplicates(results) {
        const seen = new Set();
        return results.filter(item => {
            const key = item.cas || item.name;
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
        });
    }

    /**
     * 显示搜索结果
     */
    displaySearchResults(results) {
        if (!results || results.length === 0) {
            this.showNoResults();
            return;
        }

        const resultsHTML = results.map(result => this.generateResultCard(result)).join('');
        this.ui.searchResults.innerHTML = `
            <div class="results-header">
                <h3>搜索结果 (${results.length})</h3>
            </div>
            <div class="results-grid">
                ${resultsHTML}
            </div>
        `;

        this.state.searchResults = results;
    }

    /**
     * 生成结果卡片HTML
     */
    generateResultCard(chemical) {
        const hazardIcons = this.generateHazardIcons(chemical);
        const actions = this.generateActionButtons(chemical);

        return `
            <div class="result-card" data-cas="${chemical.cas}">
                <div class="result-header">
                    <h4 class="chemical-name">${chemical.name}</h4>
                    <div class="chemical-cas">CAS: ${chemical.cas}</div>
                </div>

                <div class="result-content">
                    <div class="basic-info">
                        ${chemical.formula ? `<div class="info-item">
                            <span class="label">分子式:</span>
                            <span class="value">${chemical.formula}</span>
                        </div>` : ''}

                        ${chemical.molecularWeight ? `<div class="info-item">
                            <span class="label">分子量:</span>
                            <span class="value">${chemical.molecularWeight} g/mol</span>
                        </div>` : ''}

                        ${chemical.boilingPoint ? `<div class="info-item">
                            <span class="label">沸点:</span>
                            <span class="value">${chemical.boilingPoint}°C</span>
                        </div>` : ''}

                        ${chemical.meltingPoint ? `<div class="info-item">
                            <span class="label">熔点:</span>
                            <span class="value">${chemical.meltingPoint}°C</span>
                        </div>` : ''}
                    </div>

                    ${hazardIcons ? `<div class="hazard-indicators">
                        ${hazardIcons}
                    </div>` : ''}
                </div>

                <div class="result-actions">
                    ${actions}
                </div>
            </div>
        `;
    }

    /**
     * 生成危险性图标
     */
    generateHazardIcons(chemical) {
        if (!chemical.hazards || chemical.hazards.length === 0) return '';

        return chemical.hazards.map(hazard => `
            <span class="hazard-icon ${hazard.type}" title="${hazard.description}">
                <i class="${hazard.icon}"></i>
            </span>
        `).join('');
    }

    /**
     * 生成操作按钮
     */
    generateActionButtons(chemical) {
        return `
            <button class="action-btn primary" onclick="app.viewDetails('${chemical.cas}')">
                <i class="fas fa-eye"></i>
                详细信息
            </button>
            <button class="action-btn secondary" onclick="app.addToFavorites('${chemical.cas}')">
                <i class="fas fa-star"></i>
                收藏
            </button>
            <button class="action-btn secondary" onclick="app.assessRisk('${chemical.cas}')">
                <i class="fas fa-shield-alt"></i>
                风险评估
            </button>
        `;
    }

    /**
     * 显示无结果
     */
    showNoResults() {
        this.ui.searchResults.innerHTML = `
            <div class="no-results">
                <div class="no-results-icon">
                    <i class="fas fa-search"></i>
                </div>
                <h3>未找到相关结果</h3>
                <p>请尝试其他搜索词或检查拼写</p>
                <div class="search-suggestions">
                    <h4>搜索建议：</h4>
                    <ul>
                        <li>使用化学品的常用名称</li>
                        <li>尝试使用完整的CAS号</li>
                        <li>检查分子式格式是否正确</li>
                        <li>使用智能搜索模式</li>
                    </ul>
                </div>
            </div>
        `;
    }

    /**
     * 显示欢迎信息
     */
    showWelcomeMessage() {
        // 欢迎信息已在HTML中定义
    }

    /**
     * 记录搜索历史
     */
    recordSearch(query, type) {
        const searchRecord = {
            query,
            type,
            timestamp: new Date().toISOString()
        };

        this.state.searchHistory.unshift(searchRecord);
        this.state.searchHistory = this.state.searchHistory.slice(0, 100); // 保留最近100条

        localStorage.setItem('chemsafe-search-history', JSON.stringify(this.state.searchHistory));
    }

    /**
     * 更新搜索次数
     */
    updateSearchCount() {
        const today = new Date().toDateString();
        const todayCount = this.state.searchHistory.filter(
            item => new Date(item.timestamp).toDateString() === today
        ).length;

        this.updateStat('searchCount', `今日查询: ${todayCount}`);
    }

    /**
     * 更新统计信息
     */
    updateStat(statName, value) {
        const element = this.ui.stats[statName];
        if (element) {
            element.textContent = value;
        }
    }

    /**
     * 设置加载状态
     */
    setLoading(loading) {
        this.state.isLoading = loading;

        if (loading) {
            this.ui.searchBtn.classList.add('loading');
            this.ui.searchBtn.disabled = true;
        } else {
            this.ui.searchBtn.classList.remove('loading');
            this.ui.searchBtn.disabled = false;
        }
    }

    /**
     * 清除搜索结果
     */
    clearResults() {
        this.ui.searchResults.innerHTML = '';
        this.state.searchResults = null;
    }

    /**
     * 显示错误信息
     */
    showError(message) {
        // 简单的错误提示实现
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-toast';
        errorDiv.innerHTML = `
            <i class="fas fa-exclamation-circle"></i>
            <span>${message}</span>
        `;

        document.body.appendChild(errorDiv);

        setTimeout(() => {
            errorDiv.remove();
        }, 3000);
    }

    /**
     * 切换移动端菜单
     */
    toggleMobileMenu() {
        const menu = this.ui.mobileMenu;
        const hamburger = document.querySelector('.hamburger-menu');

        if (menu.classList.contains('active')) {
            menu.classList.remove('active');
            hamburger.classList.remove('active');
        } else {
            menu.classList.add('active');
            hamburger.classList.add('active');
        }
    }

    /**
     * 处理窗口大小变化
     */
    handleResize() {
        // 在大屏幕时自动关闭移动菜单
        if (window.innerWidth > 768) {
            this.ui.mobileMenu.classList.remove('active');
            document.querySelector('.hamburger-menu').classList.remove('active');
        }
    }

    /**
     * 初始化高级搜索
     */
    initAdvancedSearch() {
        // 高级搜索相关逻辑
    }

    /**
     * 切换主题
     */
    toggleTheme() {
        const currentTheme = this.state.settings.theme;
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';

        this.state.settings.theme = newTheme;
        localStorage.setItem('chemsafe-settings', JSON.stringify(this.state.settings));

        this.applyTheme();
    }

    /**
     * 查看详细信息
     */
    async viewDetails(cas) {
        // 获取详细信息并显示
        console.log('查看详细信息:', cas);
    }

    /**
     * 添加到收藏夹
     */
    addToFavorites(cas) {
        if (!this.state.favorites.includes(cas)) {
            this.state.favorites.push(cas);
            localStorage.setItem('chemsafe-favorites', JSON.stringify(this.state.favorites));
            this.showMessage('已添加到收藏夹');
        } else {
            this.showMessage('已在收藏夹中');
        }
    }

    /**
     * 风险评估
     */
    assessRisk(cas) {
        // 切换到风险评估模块
        this.switchModule('hazard');

        // 填充CAS号
        setTimeout(() => {
            const casInput = document.getElementById('singleCAS');
            if (casInput) {
                casInput.value = cas;
            }
        }, 100);
    }

    /**
     * 显示消息提示
     */
    showMessage(message, type = 'info') {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message-toast ${type}`;
        messageDiv.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check' : 'info'}-circle"></i>
            <span>${message}</span>
        `;

        document.body.appendChild(messageDiv);

        setTimeout(() => {
            messageDiv.remove();
        }, 2000);
    }

    /**
     * 初始化工具模块
     */
    initializeToolsModule() {
        // 工具模块初始化逻辑
    }

    /**
     * 打开工具面板
     */
    openToolPanel(toolType) {
        const panel = document.getElementById('toolPanel');
        const title = document.getElementById('toolPanelTitle');
        const content = document.getElementById('toolPanelContent');

        const toolConfigs = {
            'calculator': {
                title: '🧮 化工计算工具',
                content: this.generateCalculatorHTML()
            },
            'storage-check': {
                title: '📦 储存兼容性检查',
                content: this.generateStorageCheckHTML()
            },
            'sds-generator': {
                title: '📋 SDS生成工具',
                content: this.generateSDSGeneratorHTML()
            }
        };

        const config = toolConfigs[toolType];
        if (config) {
            title.textContent = config.title;
            content.innerHTML = config.content;
            panel.classList.add('active');
        }
    }

    /**
     * 关闭工具面板
     */
    closeToolPanel() {
        const panel = document.getElementById('toolPanel');
        panel.classList.remove('active');
    }

    /**
     * 生成计算器HTML
     */
    generateCalculatorHTML() {
        return `
            <div class="calculator-tool">
                <div class="tool-tabs">
                    <button class="tool-tab active" onclick="switchCalcTab('unit')">单位换算</button>
                    <button class="tool-tab" onclick="switchCalcTab('concentration')">浓度计算</button>
                    <button class="tool-tab" onclick="switchCalcTab('gas')">气体计算</button>
                </div>

                <div class="calc-content">
                    <div id="unitCalc" class="calc-panel active">
                        <h4>单位换算</h4>
                        <div class="calc-form">
                            <div class="form-group">
                                <label>换算类型</label>
                                <select id="conversionType">
                                    <option value="mass">质量</option>
                                    <option value="volume">体积</option>
                                    <option value="temperature">温度</option>
                                    <option value="pressure">压力</option>
                                </select>
                            </div>
                            <div class="conversion-inputs">
                                <input type="number" id="fromValue" placeholder="输入数值">
                                <select id="fromUnit"></select>
                                <span>=</span>
                                <input type="number" id="toValue" readonly>
                                <select id="toUnit"></select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * 生成储存兼容性检查HTML
     */
    generateStorageCheckHTML() {
        return `
            <div class="storage-tool">
                <h4>储存兼容性检查</h4>
                <div class="tool-form">
                    <div class="form-group">
                        <label>化学品列表（每行一个CAS号或名称）</label>
                        <textarea id="chemicalList" rows="6" placeholder="7664-41-7&#10;7782-50-5&#10;71-43-2"></textarea>
                    </div>
                    <button class="primary-btn" onclick="checkCompatibility()">
                        <i class="fas fa-check"></i>
                        检查兼容性
                    </button>
                </div>
                <div id="compatibilityResult"></div>
            </div>
        `;
    }

    /**
     * 生成SDS生成器HTML
     */
    generateSDSGeneratorHTML() {
        return `
            <div class="sds-tool">
                <h4>SDS生成工具</h4>
                <p>根据化学品信息生成安全数据表框架</p>
                <div class="tool-form">
                    <div class="form-group">
                        <label>化学品CAS号</label>
                        <input type="text" id="sdsCAS" placeholder="例: 7664-41-7">
                    </div>
                    <button class="primary-btn" onclick="generateSDS()">
                        <i class="fas fa-file-alt"></i>
                        生成SDS框架
                    </button>
                </div>
                <div id="sdsResult"></div>
            </div>
        `;
    }
}

// 全局函数定义（保持向后兼容）
window.switchModule = function(module) {
    if (window.app) {
        window.app.switchModule(module);
    }
};

window.toggleAdvancedSearch = function() {
    const panel = document.getElementById('advancedSearchPanel');
    const icon = document.querySelector('.toggle-icon');

    if (panel.classList.contains('expanded')) {
        panel.classList.remove('expanded');
        icon.classList.remove('rotated');
    } else {
        panel.classList.add('expanded');
        icon.classList.add('rotated');
    }
};

window.clearSearch = function() {
    const input = document.getElementById('searchInput');
    const clearBtn = document.querySelector('.clear-btn');
    input.value = '';
    clearBtn.style.display = 'none';
    input.focus();
};

window.quickSearch = function(query) {
    const input = document.getElementById('searchInput');
    input.value = query;
    if (window.app) {
        window.app.performSearch();
    }
};

window.toggleTheme = function() {
    if (window.app) {
        window.app.toggleTheme();
    }
};

window.showAbout = function() {
    alert('ChemSafe Pro v2.1.0\\n专业化工安全工具平台\\n\\n基于GB18218-2018标准\\n支持重大危险源评估、化学品查询等功能');
};

window.toggleMobileMenu = function() {
    if (window.app) {
        window.app.toggleMobileMenu();
    }
};

window.openToolPanel = function(toolType) {
    if (window.app) {
        window.app.openToolPanel(toolType);
    }
};

window.closeToolPanel = function() {
    if (window.app) {
        window.app.closeToolPanel();
    }
};

// 重大危险源评估相关全局函数
window.switchAssessmentType = function(type) {
    if (window.app) {
        window.app.switchAssessmentType(type);
    }
};

window.assessSingleHazard = function() {
    const cas = document.getElementById('singleCAS').value.trim();
    const quantity = parseFloat(document.getElementById('singleQuantity').value);
    const unit = document.getElementById('singleUnit').value;

    if (!cas || !quantity) {
        alert('请填写完整的CAS号和存储量');
        return;
    }

    try {
        const assessment = window.app.services.majorHazard.identifySingleSubstance(cas, quantity, unit);
        displaySingleHazardResult(assessment);
    } catch (error) {
        document.getElementById('singleHazardResult').innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-triangle"></i>
                <h4>评估失败</h4>
                <p>${error.message}</p>
            </div>
        `;
    }
};

window.addChemicalRow = function() {
    const container = document.getElementById('multipleChemicalInputs');
    const newRow = document.createElement('div');
    newRow.className = 'chemical-input-row';
    newRow.innerHTML = `
        <input type="text" placeholder="CAS号" class="multiple-cas">
        <input type="number" placeholder="数量" class="multiple-quantity" min="0" step="0.001">
        <select class="multiple-unit">
            <option value="t">t</option>
            <option value="kg">kg</option>
            <option value="g">g</option>
            <option value="L">L</option>
        </select>
        <button onclick="removeChemicalRow(this)" class="remove-btn">
            <i class="fas fa-trash"></i>
        </button>
    `;
    container.appendChild(newRow);
};

window.removeChemicalRow = function(btn) {
    const rows = document.querySelectorAll('.chemical-input-row');
    if (rows.length > 1) {
        btn.parentElement.remove();
    }
};

window.clearMultipleInputs = function() {
    const container = document.getElementById('multipleChemicalInputs');
    container.innerHTML = `
        <div class="chemical-input-row">
            <input type="text" placeholder="CAS号" class="multiple-cas">
            <input type="number" placeholder="数量" class="multiple-quantity" min="0" step="0.001">
            <select class="multiple-unit">
                <option value="t">t</option>
                <option value="kg">kg</option>
                <option value="g">g</option>
                <option value="L">L</option>
            </select>
            <button onclick="removeChemicalRow(this)" class="remove-btn">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `;
    document.getElementById('multipleHazardResult').innerHTML = '';
};

window.assessMultipleHazards = function() {
    const rows = document.querySelectorAll('.chemical-input-row');
    const substances = [];

    rows.forEach(row => {
        const cas = row.querySelector('.multiple-cas').value.trim();
        const quantity = parseFloat(row.querySelector('.multiple-quantity').value);
        const unit = row.querySelector('.multiple-unit').value;

        if (cas && quantity) {
            substances.push({ cas, quantity, unit });
        }
    });

    if (substances.length === 0) {
        alert('请至少添加一个完整的化学品信息');
        return;
    }

    try {
        const assessment = window.app.services.majorHazard.identifyMultipleSubstances(substances);
        displayMultipleHazardResult(assessment);
    } catch (error) {
        document.getElementById('multipleHazardResult').innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-triangle"></i>
                <h4>评估失败</h4>
                <p>${error.message}</p>
            </div>
        `;
    }
};

// 显示结果的辅助函数
function displaySingleHazardResult(result) {
    const level = result.level;
    const levelClass = level.name.includes('一级') ? 'level-1' :
                     level.name.includes('二级') ? 'level-2' :
                     level.name.includes('三级') ? 'level-3' : 'level-4';

    const resultHTML = `
        <div class="assessment-result ${levelClass}">
            <div class="result-header">
                <h4><i class="fas fa-flask"></i> ${result.substance.name} 评估结果</h4>
                <div class="risk-level-badge">${level.name}</div>
            </div>

            <div class="result-summary-grid">
                <div class="summary-item">
                    <div class="item-label">物质类别</div>
                    <div class="item-value">${result.substance.category}</div>
                </div>
                <div class="summary-item">
                    <div class="item-label">实际存储量</div>
                    <div class="item-value">${result.actualQuantity} 吨</div>
                </div>
                <div class="summary-item">
                    <div class="item-label">临界量</div>
                    <div class="item-value">${result.criticalQuantity} 吨</div>
                </div>
                <div class="summary-item">
                    <div class="item-label">风险商 (R)</div>
                    <div class="item-value">${result.riskQuotient.toFixed(4)}</div>
                </div>
            </div>

            <div class="management-section">
                <h5><i class="fas fa-clipboard-list"></i> 管理要求</h5>
                <ul class="requirements-list">
                    ${result.assessment.requirements.map(req => `<li>${req}</li>`).join('')}
                </ul>
            </div>

            <div class="recommendations-section">
                <h5><i class="fas fa-lightbulb"></i> 建议措施</h5>
                <ul class="recommendations-list">
                    ${result.assessment.recommendations.map(rec => `<li>${rec}</li>`).join('')}
                </ul>
            </div>
        </div>
    `;

    document.getElementById('singleHazardResult').innerHTML = resultHTML;
}

function displayMultipleHazardResult(result) {
    // 类似的多介质结果显示逻辑
    const level = result.level;
    const levelClass = level.name.includes('一级') ? 'level-1' :
                     level.name.includes('二级') ? 'level-2' :
                     level.name.includes('三级') ? 'level-3' : 'level-4';

    const resultHTML = `
        <div class="assessment-result ${levelClass}">
            <div class="result-header">
                <h4><i class="fas fa-layer-group"></i> 多介质重大危险源评估结果</h4>
                <div class="risk-level-badge">${level.name}</div>
            </div>

            <div class="total-risk">
                <div class="risk-indicator">
                    <div class="risk-value">${result.totalRiskQuotient.toFixed(4)}</div>
                    <div class="risk-label">总风险商 (ΣR)</div>
                </div>
            </div>

            <!-- 其他结果显示内容 -->
        </div>
    `;

    document.getElementById('multipleHazardResult').innerHTML = resultHTML;
}

// 应用初始化
document.addEventListener('DOMContentLoaded', () => {
    window.app = new ChemSafeProApp();
});
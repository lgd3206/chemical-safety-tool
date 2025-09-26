/**
 * 化工安全工具平台 - 模块化主界面
 * 参考ilovepdf的卡片式布局设计
 */

import { MajorHazardAssessmentModule } from './modules/major-hazard-assessment.js';
import { OELMonitoringModule } from './modules/oel-monitoring.js';

class ChemSafeMainInterface {
    constructor() {
        this.currentModule = null;
        this.modules = {};
        this.initializeModules();
    }

    /**
     * 初始化所有功能模块
     */
    initializeModules() {
        this.modules = {
            majorHazard: new MajorHazardAssessmentModule(),
            oelMonitoring: new OELMonitoringModule()
        };
    }

    /**
     * 创建主界面
     */
    createMainInterface() {
        const mainContainer = document.createElement('div');
        mainContainer.className = 'chemsafe-main-container';
        mainContainer.innerHTML = `
            <!-- 顶部导航栏 -->
            <header class="main-header">
                <div class="header-content">
                    <div class="logo-section">
                        <i class="fas fa-flask"></i>
                        <h1>ChemSafe Pro</h1>
                        <span class="version">v3.0</span>
                    </div>
                    <nav class="main-nav">
                        <button class="nav-btn active" data-view="home">
                            <i class="fas fa-home"></i> 首页
                        </button>
                        <button class="nav-btn" data-view="tools">
                            <i class="fas fa-tools"></i> 工具箱
                        </button>
                        <button class="nav-btn" data-view="standards">
                            <i class="fas fa-book"></i> 标准库
                        </button>
                        <button class="nav-btn" data-view="help">
                            <i class="fas fa-question-circle"></i> 帮助
                        </button>
                    </nav>
                    <div class="header-actions">
                        <button class="theme-toggle" onclick="toggleTheme()">
                            <i class="fas fa-moon"></i>
                        </button>
                        <button class="settings-btn" onclick="openSettings()">
                            <i class="fas fa-cog"></i>
                        </button>
                    </div>
                </div>
            </header>

            <!-- 主内容区域 -->
            <main class="main-content">
                <!-- 首页视图 -->
                <div class="view-container active" id="home-view">
                    ${this.createHomeView()}
                </div>

                <!-- 工具箱视图 -->
                <div class="view-container" id="tools-view">
                    ${this.createToolsView()}
                </div>

                <!-- 标准库视图 -->
                <div class="view-container" id="standards-view">
                    ${this.createStandardsView()}
                </div>

                <!-- 帮助视图 -->
                <div class="view-container" id="help-view">
                    ${this.createHelpView()}
                </div>

                <!-- 模块容器 -->
                <div class="module-container" id="module-container" style="display: none;">
                    <!-- 动态加载的模块内容 -->
                </div>
            </main>

            <!-- 底部状态栏 -->
            <footer class="main-footer">
                <div class="footer-content">
                    <div class="footer-info">
                        <span>ChemSafe Pro - 专业化工安全工具平台</span>
                        <span class="separator">|</span>
                        <span>基于国家标准GB18218-2018、GBZ 2.1-2019</span>
                    </div>
                    <div class="footer-status">
                        <span id="status-indicator">就绪</span>
                    </div>
                </div>
            </footer>
        `;

        return mainContainer;
    }

    /**
     * 创建首页视图
     */
    createHomeView() {
        return `
            <div class="home-container">
                <!-- 欢迎区域 -->
                <section class="welcome-section">
                    <div class="welcome-content">
                        <h2>欢迎使用 ChemSafe Pro</h2>
                        <p class="subtitle">专业的化工安全数据查询与评估平台</p>
                        <div class="feature-highlights">
                            <div class="highlight-item">
                                <i class="fas fa-shield-alt"></i>
                                <span>权威标准</span>
                            </div>
                            <div class="highlight-item">
                                <i class="fas fa-calculator"></i>
                                <span>智能计算</span>
                            </div>
                            <div class="highlight-item">
                                <i class="fas fa-file-alt"></i>
                                <span>报告生成</span>
                            </div>
                            <div class="highlight-item">
                                <i class="fas fa-mobile-alt"></i>
                                <span>移动友好</span>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- 功能卡片区域 -->
                <section class="features-section">
                    <h3>核心功能模块</h3>
                    <div class="feature-cards">
                        <!-- 重大危险源评估 -->
                        <div class="feature-card major-hazard" onclick="loadModule('majorHazard')">
                            <div class="card-icon">
                                <i class="fas fa-exclamation-triangle"></i>
                            </div>
                            <div class="card-content">
                                <h4>重大危险源评估</h4>
                                <p>基于GB18218-2018标准，智能辨识和分级评估重大危险源</p>
                                <div class="card-features">
                                    <span class="feature-tag">辨识计算</span>
                                    <span class="feature-tag">分级评估</span>
                                    <span class="feature-tag">报告生成</span>
                                </div>
                            </div>
                            <div class="card-action">
                                <span>立即使用</span>
                                <i class="fas fa-arrow-right"></i>
                            </div>
                        </div>

                        <!-- 职业接触限值查询 -->
                        <div class="feature-card oel-monitoring" onclick="loadModule('oelMonitoring')">
                            <div class="card-icon">
                                <i class="fas fa-lungs"></i>
                            </div>
                            <div class="card-content">
                                <h4>职业接触限值查询</h4>
                                <p>基于GBZ 2.1-2019标准，查询化学品职业接触限值和暴露评估</p>
                                <div class="card-features">
                                    <span class="feature-tag">限值查询</span>
                                    <span class="feature-tag">单位换算</span>
                                    <span class="feature-tag">暴露评估</span>
                                </div>
                            </div>
                            <div class="card-action">
                                <span>立即使用</span>
                                <i class="fas fa-arrow-right"></i>
                            </div>
                        </div>

                        <!-- MSDS数据库 -->
                        <div class="feature-card msds-database" onclick="loadModule('msdsDatabase')">
                            <div class="card-icon">
                                <i class="fas fa-file-alt"></i>
                            </div>
                            <div class="card-content">
                                <h4>MSDS数据库</h4>
                                <p>化学品安全数据表查询，支持中英文名称和CAS号搜索</p>
                                <div class="card-features">
                                    <span class="feature-tag">智能搜索</span>
                                    <span class="feature-tag">GHS分类</span>
                                    <span class="feature-tag">安全信息</span>
                                </div>
                            </div>
                            <div class="card-action">
                                <span>立即使用</span>
                                <i class="fas fa-arrow-right"></i>
                            </div>
                        </div>

                        <!-- 气体换算工具 -->
                        <div class="feature-card gas-calculator" onclick="loadModule('gasCalculator')">
                            <div class="card-icon">
                                <i class="fas fa-exchange-alt"></i>
                            </div>
                            <div class="card-content">
                                <h4>气体换算工具</h4>
                                <p>可燃有毒气体浓度单位转换，支持温度压力修正</p>
                                <div class="card-features">
                                    <span class="feature-tag">单位转换</span>
                                    <span class="feature-tag">条件修正</span>
                                    <span class="feature-tag">混合计算</span>
                                </div>
                            </div>
                            <div class="card-action">
                                <span>立即使用</span>
                                <i class="fas fa-arrow-right"></i>
                            </div>
                        </div>

                        <!-- 防火间距计算 -->
                        <div class="feature-card fire-distance" onclick="loadModule('fireDistance')">
                            <div class="card-icon">
                                <i class="fas fa-ruler"></i>
                            </div>
                            <div class="card-content">
                                <h4>防火间距计算</h4>
                                <p>建筑防火间距自动计算，符合GB 50016标准要求</p>
                                <div class="card-features">
                                    <span class="feature-tag">间距计算</span>
                                    <span class="feature-tag">规范查询</span>
                                    <span class="feature-tag">图形展示</span>
                                </div>
                            </div>
                            <div class="card-action">
                                <span>立即使用</span>
                                <i class="fas fa-arrow-right"></i>
                            </div>
                        </div>

                        <!-- 风险评估工具 -->
                        <div class="feature-card risk-assessment" onclick="loadModule('riskAssessment')">
                            <div class="card-icon">
                                <i class="fas fa-chart-pie"></i>
                            </div>
                            <div class="card-content">
                                <h4>风险评估工具</h4>
                                <p>多维度安全风险分析，生成专业评估报告</p>
                                <div class="card-features">
                                    <span class="feature-tag">风险矩阵</span>
                                    <span class="feature-tag">定量评估</span>
                                    <span class="feature-tag">控制措施</span>
                                </div>
                            </div>
                            <div class="card-action">
                                <span>立即使用</span>
                                <i class="fas fa-arrow-right"></i>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- 快速操作区域 -->
                <section class="quick-actions">
                    <h3>快速操作</h3>
                    <div class="quick-action-buttons">
                        <button class="quick-btn" onclick="quickMSDSSearch()">
                            <i class="fas fa-search"></i>
                            <span>快速MSDS查询</span>
                        </button>
                        <button class="quick-btn" onclick="quickOELLookup()">
                            <i class="fas fa-list"></i>
                            <span>限值快查</span>
                        </button>
                        <button class="quick-btn" onclick="quickUnitConversion()">
                            <i class="fas fa-calculator"></i>
                            <span>单位换算</span>
                        </button>
                        <button class="quick-btn" onclick="quickHazardCheck()">
                            <i class="fas fa-exclamation"></i>
                            <span>危险源快检</span>
                        </button>
                    </div>
                </section>
            </div>
        `;
    }

    /**
     * 创建工具箱视图
     */
    createToolsView() {
        return `
            <div class="tools-container">
                <h2>专业工具箱</h2>
                <div class="tool-categories">
                    <div class="tool-category">
                        <h3>计算工具</h3>
                        <div class="tool-grid">
                            <div class="tool-item" onclick="openTool('unit-converter')">
                                <i class="fas fa-exchange-alt"></i>
                                <span>单位换算器</span>
                            </div>
                            <div class="tool-item" onclick="openTool('gas-calculator')">
                                <i class="fas fa-cloud"></i>
                                <span>气体计算器</span>
                            </div>
                            <div class="tool-item" onclick="openTool('fire-distance')">
                                <i class="fas fa-ruler"></i>
                                <span>防火间距</span>
                            </div>
                        </div>
                    </div>

                    <div class="tool-category">
                        <h3>评估工具</h3>
                        <div class="tool-grid">
                            <div class="tool-item" onclick="openTool('hazard-assessment')">
                                <i class="fas fa-exclamation-triangle"></i>
                                <span>危险源评估</span>
                            </div>
                            <div class="tool-item" onclick="openTool('risk-matrix')">
                                <i class="fas fa-chart-pie"></i>
                                <span>风险矩阵</span>
                            </div>
                            <div class="tool-item" onclick="openTool('exposure-assessment')">
                                <i class="fas fa-lungs"></i>
                                <span>暴露评估</span>
                            </div>
                        </div>
                    </div>

                    <div class="tool-category">
                        <h3>查询工具</h3>
                        <div class="tool-grid">
                            <div class="tool-item" onclick="openTool('msds-search')">
                                <i class="fas fa-file-alt"></i>
                                <span>MSDS查询</span>
                            </div>
                            <div class="tool-item" onclick="openTool('oel-lookup')">
                                <i class="fas fa-list"></i>
                                <span>限值查询</span>
                            </div>
                            <div class="tool-item" onclick="openTool('regulation-search')">
                                <i class="fas fa-book"></i>
                                <span>法规查询</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * 创建标准库视图
     */
    createStandardsView() {
        return `
            <div class="standards-container">
                <h2>标准规范库</h2>
                <div class="standards-sections">
                    <div class="standard-category">
                        <h3>国家标准 (GB)</h3>
                        <div class="standard-list">
                            <div class="standard-item">
                                <div class="standard-info">
                                    <h4>GB18218-2018</h4>
                                    <p>危险化学品重大危险源辨识</p>
                                </div>
                                <div class="standard-actions">
                                    <button class="btn-view" onclick="viewStandard('GB18218-2018')">查看</button>
                                    <button class="btn-use" onclick="useStandard('GB18218-2018')">使用</button>
                                </div>
                            </div>
                            <div class="standard-item">
                                <div class="standard-info">
                                    <h4>GBZ 2.1-2019</h4>
                                    <p>工作场所有害因素职业接触限值</p>
                                </div>
                                <div class="standard-actions">
                                    <button class="btn-view" onclick="viewStandard('GBZ2.1-2019')">查看</button>
                                    <button class="btn-use" onclick="useStandard('GBZ2.1-2019')">使用</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="standard-category">
                        <h3>行业标准 (AQ/HG)</h3>
                        <div class="standard-list">
                            <div class="standard-item">
                                <div class="standard-info">
                                    <h4>AQ3035-2010</h4>
                                    <p>危险化学品重大危险源安全监控通用技术规范</p>
                                </div>
                                <div class="standard-actions">
                                    <button class="btn-view" onclick="viewStandard('AQ3035-2010')">查看</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * 创建帮助视图
     */
    createHelpView() {
        return `
            <div class="help-container">
                <h2>使用帮助</h2>
                <div class="help-sections">
                    <div class="help-section">
                        <h3>快速入门</h3>
                        <div class="help-content">
                            <ol>
                                <li>选择需要使用的功能模块</li>
                                <li>按照向导提示输入相关数据</li>
                                <li>系统自动计算并生成结果</li>
                                <li>导出报告或保存数据</li>
                            </ol>
                        </div>
                    </div>

                    <div class="help-section">
                        <h3>功能说明</h3>
                        <div class="help-content">
                            <h4>重大危险源评估</h4>
                            <p>根据GB18218-2018标准，自动计算S值和R值，判断是否构成重大危险源及其级别。</p>

                            <h4>职业接触限值查询</h4>
                            <p>基于GBZ 2.1-2019标准，提供化学品职业接触限值查询和暴露风险评估。</p>
                        </div>
                    </div>

                    <div class="help-section">
                        <h3>常见问题</h3>
                        <div class="help-content">
                            <div class="faq-item">
                                <h4>Q: 如何导入企业化学品清单？</h4>
                                <p>A: 在重大危险源评估模块中，可以通过Excel模板批量导入化学品数据。</p>
                            </div>
                            <div class="faq-item">
                                <h4>Q: 计算结果的准确性如何保证？</h4>
                                <p>A: 所有计算均基于国家标准，数据来源权威，算法经过专业验证。</p>
                            </div>
                        </div>
                    </div>

                    <div class="help-section">
                        <h3>联系支持</h3>
                        <div class="help-content">
                            <p>如有问题或建议，请联系技术支持：</p>
                            <p>邮箱: support@chemsafe.pro</p>
                            <p>技术文档: <a href="#" onclick="openTechDocs()">查看在线文档</a></p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * 加载指定模块
     */
    loadModule(moduleId) {
        // 隐藏主视图
        document.querySelectorAll('.view-container').forEach(view => {
            view.style.display = 'none';
        });

        // 显示模块容器
        const moduleContainer = document.getElementById('module-container');
        moduleContainer.style.display = 'block';

        // 加载模块内容
        switch (moduleId) {
            case 'majorHazard':
                this.loadMajorHazardModule(moduleContainer);
                break;
            case 'oelMonitoring':
                this.loadOELMonitoringModule(moduleContainer);
                break;
            default:
                this.showComingSoon(moduleContainer, moduleId);
        }

        this.currentModule = moduleId;
        this.updateStatus(`已加载 ${this.getModuleName(moduleId)} 模块`);
    }

    /**
     * 加载重大危险源评估模块
     */
    loadMajorHazardModule(container) {
        const moduleInterface = this.modules.majorHazard.initializeAssessmentWizard();
        container.innerHTML = '';
        container.appendChild(moduleInterface);

        // 添加返回按钮
        this.addBackButton(container);
    }

    /**
     * 加载职业接触限值监测模块
     */
    loadOELMonitoringModule(container) {
        const moduleInterface = this.modules.oelMonitoring.initializeOELQueryInterface();
        container.innerHTML = '';
        container.appendChild(moduleInterface);

        // 初始化数据表格
        setTimeout(() => {
            this.modules.oelMonitoring.initializeOELDatabase();
        }, 100);

        // 添加返回按钮
        this.addBackButton(container);
    }

    /**
     * 显示即将推出页面
     */
    showComingSoon(container, moduleId) {
        container.innerHTML = `
            <div class="coming-soon-container">
                <div class="coming-soon-content">
                    <i class="fas fa-tools"></i>
                    <h2>${this.getModuleName(moduleId)}</h2>
                    <p>该功能正在开发中，敬请期待...</p>
                    <div class="development-progress">
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: 60%"></div>
                        </div>
                        <span>开发进度: 60%</span>
                    </div>
                    <button class="btn-back" onclick="mainInterface.backToHome()">
                        <i class="fas fa-arrow-left"></i> 返回首页
                    </button>
                </div>
            </div>
        `;
    }

    /**
     * 添加返回按钮
     */
    addBackButton(container) {
        const backButton = document.createElement('button');
        backButton.className = 'module-back-btn';
        backButton.innerHTML = '<i class="fas fa-arrow-left"></i> 返回首页';
        backButton.onclick = () => this.backToHome();

        container.insertBefore(backButton, container.firstChild);
    }

    /**
     * 返回首页
     */
    backToHome() {
        document.getElementById('module-container').style.display = 'none';
        document.getElementById('home-view').style.display = 'block';

        // 更新导航状态
        document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelector('[data-view="home"]').classList.add('active');

        this.currentModule = null;
        this.updateStatus('就绪');
    }

    /**
     * 切换视图
     */
    switchView(viewId) {
        // 隐藏所有视图
        document.querySelectorAll('.view-container').forEach(view => {
            view.classList.remove('active');
        });
        document.getElementById('module-container').style.display = 'none';

        // 显示目标视图
        document.getElementById(`${viewId}-view`).classList.add('active');

        // 更新导航状态
        document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelector(`[data-view="${viewId}"]`).classList.add('active');

        this.currentModule = null;
        this.updateStatus('就绪');
    }

    /**
     * 获取模块名称
     */
    getModuleName(moduleId) {
        const names = {
            majorHazard: '重大危险源评估',
            oelMonitoring: '职业接触限值查询',
            msdsDatabase: 'MSDS数据库',
            gasCalculator: '气体换算工具',
            fireDistance: '防火间距计算',
            riskAssessment: '风险评估工具'
        };
        return names[moduleId] || '未知模块';
    }

    /**
     * 更新状态
     */
    updateStatus(message) {
        const statusElement = document.getElementById('status-indicator');
        if (statusElement) {
            statusElement.textContent = message;
        }
    }

    /**
     * 初始化事件监听器
     */
    initializeEventListeners() {
        // 导航按钮事件
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const viewId = e.target.closest('.nav-btn').dataset.view;
                this.switchView(viewId);
            });
        });

        // 主题切换事件
        document.addEventListener('click', (e) => {
            if (e.target.closest('.theme-toggle')) {
                this.toggleTheme();
            }
        });
    }

    /**
     * 切换主题
     */
    toggleTheme() {
        document.body.classList.toggle('dark-theme');
        const isDark = document.body.classList.contains('dark-theme');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');

        const themeIcon = document.querySelector('.theme-toggle i');
        themeIcon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
    }

    /**
     * 初始化应用
     */
    initialize() {
        const mainInterface = this.createMainInterface();
        document.body.appendChild(mainInterface);

        this.initializeEventListeners();

        // 恢复主题设置
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-theme');
            document.querySelector('.theme-toggle i').className = 'fas fa-sun';
        }

        this.updateStatus('ChemSafe Pro 已启动');

        console.log('ChemSafe Pro 主界面初始化完成');
    }
}

// 全局变量和函数
window.mainInterface = new ChemSafeMainInterface();

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    window.mainInterface.initialize();
});

// 全局函数供HTML调用
window.loadModule = (moduleId) => window.mainInterface.loadModule(moduleId);
window.toggleTheme = () => window.mainInterface.toggleTheme();
window.openSettings = () => console.log('设置页面待实现');

// 快速操作函数
window.quickMSDSSearch = () => window.mainInterface.loadModule('msdsDatabase');
window.quickOELLookup = () => window.mainInterface.loadModule('oelMonitoring');
window.quickUnitConversion = () => window.mainInterface.loadModule('gasCalculator');
window.quickHazardCheck = () => window.mainInterface.loadModule('majorHazard');
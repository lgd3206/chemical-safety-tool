/**
 * MSDS数据库查询模块
 * 提供化学品安全数据表查询和管理功能
 */

import { localChemicals } from '../data/chemicals.js';
import { ChemicalDataService } from '../services/chemical-data-service.js';

export class MSDSDatabaseModule {
    constructor() {
        this.chemicalDataService = new ChemicalDataService();
        this.searchHistory = [];
        this.favoriteChemicals = [];
        this.loadFavorites();
    }

    /**
     * 初始化MSDS数据库查询界面
     */
    initializeMSDSInterface() {
        const container = document.createElement('div');
        container.className = 'msds-database-container';
        container.innerHTML = `
            <div class="msds-header">
                <h2><i class="fas fa-file-alt"></i> MSDS化学品数据库查询</h2>
                <p class="subtitle">化学品安全数据表查询与管理平台</p>
            </div>

            <div class="msds-search-section">
                <div class="search-tabs">
                    <button class="search-tab active" data-tab="quick">
                        <i class="fas fa-search"></i> 快速查询
                    </button>
                    <button class="search-tab" data-tab="advanced">
                        <i class="fas fa-filter"></i> 高级搜索
                    </button>
                    <button class="search-tab" data-tab="batch">
                        <i class="fas fa-list"></i> 批量查询
                    </button>
                </div>

                <!-- 快速查询标签页 -->
                <div class="search-tab-content active" id="quick-search">
                    <div class="quick-search-form">
                        <div class="search-input-group">
                            <input type="text" id="quickSearchInput" placeholder="输入化学品名称、英文名、CAS号或分子式">
                            <div class="search-type-selector">
                                <select id="searchType">
                                    <option value="auto">智能识别</option>
                                    <option value="name">中文名称</option>
                                    <option value="english">英文名称</option>
                                    <option value="cas">CAS号</option>
                                    <option value="formula">分子式</option>
                                </select>
                            </div>
                            <button class="btn-search" onclick="performQuickSearch()">
                                <i class="fas fa-search"></i> 搜索
                            </button>
                        </div>

                        <div class="search-suggestions" id="searchSuggestions"></div>

                        <div class="quick-links">
                            <h4>常见化学品快速查询</h4>
                            <div class="chemical-quick-links">
                                <button class="quick-link-btn" onclick="quickSearch('苯')">苯</button>
                                <button class="quick-link-btn" onclick="quickSearch('甲醛')">甲醛</button>
                                <button class="quick-link-btn" onclick="quickSearch('氨')">氨</button>
                                <button class="quick-link-btn" onclick="quickSearch('盐酸')">盐酸</button>
                                <button class="quick-link-btn" onclick="quickSearch('硫酸')">硫酸</button>
                                <button class="quick-link-btn" onclick="quickSearch('甲苯')">甲苯</button>
                                <button class="quick-link-btn" onclick="quickSearch('乙醇')">乙醇</button>
                                <button class="quick-link-btn" onclick="quickSearch('氯')">氯</button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 高级搜索标签页 -->
                <div class="search-tab-content" id="advanced-search">
                    <div class="advanced-search-form">
                        <div class="form-grid">
                            <div class="form-group">
                                <label>化学品名称</label>
                                <input type="text" id="advChemicalName" placeholder="中文或英文名称">
                            </div>
                            <div class="form-group">
                                <label>CAS号</label>
                                <input type="text" id="advCasNumber" placeholder="例：71-43-2">
                            </div>
                            <div class="form-group">
                                <label>分子式</label>
                                <input type="text" id="advMolecularFormula" placeholder="例：C6H6">
                            </div>
                            <div class="form-group">
                                <label>危险类别</label>
                                <select id="advHazardCategory">
                                    <option value="">所有类别</option>
                                    <option value="易燃">易燃物质</option>
                                    <option value="有毒">有毒物质</option>
                                    <option value="腐蚀性">腐蚀性物质</option>
                                    <option value="爆炸性">爆炸性物质</option>
                                    <option value="致癌">致癌物质</option>
                                    <option value="环境危害">环境危害物质</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label>物理状态</label>
                                <select id="advPhysicalState">
                                    <option value="">所有状态</option>
                                    <option value="气体">气体</option>
                                    <option value="液体">液体</option>
                                    <option value="固体">固体</option>
                                    <option value="粉末">粉末</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label>分子量范围</label>
                                <div class="range-inputs">
                                    <input type="number" id="minMolWeight" placeholder="最小值">
                                    <span>-</span>
                                    <input type="number" id="maxMolWeight" placeholder="最大值">
                                </div>
                            </div>
                        </div>
                        <div class="search-actions">
                            <button class="btn-advanced-search" onclick="performAdvancedSearch()">
                                <i class="fas fa-search"></i> 高级搜索
                            </button>
                            <button class="btn-clear-form" onclick="clearAdvancedForm()">
                                <i class="fas fa-eraser"></i> 清空表单
                            </button>
                        </div>
                    </div>
                </div>

                <!-- 批量查询标签页 -->
                <div class="search-tab-content" id="batch-search">
                    <div class="batch-search-form">
                        <div class="batch-input-section">
                            <h4>批量查询输入</h4>
                            <textarea id="batchSearchInput" placeholder="请输入多个化学品名称、CAS号或分子式，每行一个&#10;例如：&#10;苯&#10;71-43-2&#10;甲醛&#10;NH3"></textarea>
                            <div class="batch-options">
                                <label>
                                    <input type="checkbox" id="exportBatchResults" checked>
                                    搜索完成后自动导出结果
                                </label>
                                <label>
                                    <input type="checkbox" id="includeMissingItems">
                                    包含未找到的项目
                                </label>
                            </div>
                            <button class="btn-batch-search" onclick="performBatchSearch()">
                                <i class="fas fa-list"></i> 开始批量查询
                            </button>
                        </div>
                        <div class="batch-progress" id="batchProgress" style="display: none;">
                            <div class="progress-bar">
                                <div class="progress-fill" id="batchProgressFill"></div>
                            </div>
                            <div class="progress-text" id="batchProgressText"></div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 搜索结果区域 -->
            <div class="msds-results-section">
                <div class="results-header">
                    <h3>搜索结果</h3>
                    <div class="results-actions">
                        <button class="btn-export-results" onclick="exportSearchResults()" style="display:none;">
                            <i class="fas fa-download"></i> 导出结果
                        </button>
                        <button class="btn-clear-results" onclick="clearSearchResults()">
                            <i class="fas fa-trash"></i> 清空结果
                        </button>
                    </div>
                </div>
                <div class="search-results" id="searchResults">
                    <div class="no-results-placeholder">
                        <i class="fas fa-search"></i>
                        <p>请输入搜索条件查询化学品信息</p>
                    </div>
                </div>
            </div>

            <!-- 侧边栏 -->
            <div class="msds-sidebar">
                <!-- 搜索历史 -->
                <div class="sidebar-section">
                    <h4><i class="fas fa-history"></i> 搜索历史</h4>
                    <div class="search-history" id="searchHistory">
                        <!-- 动态加载搜索历史 -->
                    </div>
                </div>

                <!-- 收藏夹 -->
                <div class="sidebar-section">
                    <h4><i class="fas fa-star"></i> 收藏夹</h4>
                    <div class="favorites" id="favoritesList">
                        <!-- 动态加载收藏夹 -->
                    </div>
                </div>

                <!-- 数据库统计 -->
                <div class="sidebar-section">
                    <h4><i class="fas fa-chart-bar"></i> 数据库统计</h4>
                    <div class="database-stats">
                        <div class="stat-item">
                            <span class="stat-label">本地数据库:</span>
                            <span class="stat-value">${localChemicals.length}种</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">今日查询:</span>
                            <span class="stat-value" id="todaySearchCount">0</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">收藏数量:</span>
                            <span class="stat-value" id="favoritesCount">0</span>
                        </div>
                    </div>
                </div>
            </div>
        `;

        return container;
    }

    /**
     * 执行快速搜索
     */
    async performQuickSearch(keyword) {
        const searchInput = document.getElementById('quickSearchInput');
        const query = keyword || searchInput?.value?.trim();

        if (!query) {
            this.showSearchError('请输入搜索关键词');
            return;
        }

        this.showSearchLoading();

        try {
            // 添加到搜索历史
            this.addToSearchHistory(query);

            // 先搜索本地数据库
            const localResults = this.searchLocalDatabase(query);

            // 如果本地有结果，优先显示
            if (localResults.length > 0) {
                this.displaySearchResults(localResults, 'local');
            } else {
                // 搜索在线数据库
                const onlineResults = await this.searchOnlineDatabase(query);
                this.displaySearchResults(onlineResults, 'online');
            }

        } catch (error) {
            this.showSearchError(`搜索失败: ${error.message}`);
        }
    }

    /**
     * 搜索本地数据库
     */
    searchLocalDatabase(query) {
        const results = [];
        const queryLower = query.toLowerCase();

        for (const chemical of localChemicals) {
            let score = 0;
            let matchType = '';

            // 匹配中文名称
            if (chemical.name && chemical.name.includes(query)) {
                score += 100;
                matchType = '中文名称';
            }

            // 匹配英文名称
            if (chemical.englishName && chemical.englishName.toLowerCase().includes(queryLower)) {
                score += 90;
                matchType = '英文名称';
            }

            // 匹配CAS号
            if (chemical.cas && chemical.cas.includes(query)) {
                score += 95;
                matchType = 'CAS号';
            }

            // 匹配分子式
            if (chemical.formula && chemical.formula.toLowerCase().includes(queryLower)) {
                score += 85;
                matchType = '分子式';
            }

            if (score > 0) {
                results.push({
                    ...chemical,
                    source: 'local',
                    matchScore: score,
                    matchType: matchType
                });
            }
        }

        // 按匹配度排序
        return results.sort((a, b) => b.matchScore - a.matchScore);
    }

    /**
     * 搜索在线数据库
     */
    async searchOnlineDatabase(query) {
        try {
            // 判断查询类型
            const searchType = this.detectSearchType(query);
            let result;

            switch (searchType) {
                case 'cas':
                    result = await this.chemicalDataService.searchByCAS(query);
                    break;
                case 'formula':
                    result = await this.chemicalDataService.searchByFormula(query);
                    break;
                default:
                    result = await this.chemicalDataService.searchByName(query);
                    break;
            }

            // 转换数据格式
            return this.convertOnlineResult(result);

        } catch (error) {
            console.error('在线搜索失败:', error);
            return [];
        }
    }

    /**
     * 检测搜索类型
     */
    detectSearchType(query) {
        // CAS号格式：数字-数字-数字
        if (/^\d+-\d+-\d+$/.test(query)) {
            return 'cas';
        }

        // 分子式格式：字母数字组合
        if (/^[A-Za-z0-9]+$/.test(query) && /[A-Z]/.test(query)) {
            return 'formula';
        }

        return 'name';
    }

    /**
     * 转换在线结果格式
     */
    convertOnlineResult(onlineData) {
        if (!onlineData || !onlineData.basicInfo) {
            return [];
        }

        const basicInfo = onlineData.basicInfo;

        return [{
            name: basicInfo.IUPACName || '未知',
            englishName: basicInfo.IUPACName || '未知',
            cas: '查询中...',
            formula: basicInfo.MolecularFormula || '未知',
            molecularWeight: basicInfo.MolecularWeight || '未知',
            source: 'online',
            cid: onlineData.cid,
            structureImageUrl: this.chemicalDataService.getStructureImageUrl(onlineData.cid),
            pubchemUrl: this.chemicalDataService.getPubChemUrl(onlineData.cid),
            hazards: onlineData.ghs || [],
            properties: onlineData.properties || {}
        }];
    }

    /**
     * 显示搜索结果
     */
    displaySearchResults(results, source) {
        const resultsContainer = document.getElementById('searchResults');
        const exportBtn = document.querySelector('.btn-export-results');

        if (!resultsContainer) return;

        if (results.length === 0) {
            resultsContainer.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-search"></i>
                    <h4>未找到相关化学品</h4>
                    <p>建议：</p>
                    <ul>
                        <li>检查关键词拼写</li>
                        <li>尝试使用英文名称或CAS号</li>
                        <li>使用部分关键词搜索</li>
                    </ul>
                </div>
            `;
            exportBtn.style.display = 'none';
            return;
        }

        const resultsHtml = results.map((chemical, index) => `
            <div class="chemical-result-card" data-index="${index}">
                <div class="result-header">
                    <div class="chemical-names">
                        <h4>${chemical.name}</h4>
                        ${chemical.englishName ? `<p class="english-name">${chemical.englishName}</p>` : ''}
                        ${chemical.matchType ? `<span class="match-type">匹配: ${chemical.matchType}</span>` : ''}
                    </div>
                    <div class="result-actions">
                        <button class="btn-favorite" onclick="toggleFavorite('${index}')" title="收藏">
                            <i class="fas fa-star"></i>
                        </button>
                        <button class="btn-share" onclick="shareChemical('${index}')" title="分享">
                            <i class="fas fa-share"></i>
                        </button>
                        <button class="btn-detail" onclick="showChemicalDetail('${index}')" title="详细信息">
                            <i class="fas fa-info-circle"></i>
                        </button>
                    </div>
                </div>

                <div class="result-basic-info">
                    <div class="info-grid">
                        <div class="info-item">
                            <span class="label">CAS号:</span>
                            <span class="value">${chemical.cas || '未知'}</span>
                        </div>
                        <div class="info-item">
                            <span class="label">分子式:</span>
                            <span class="value">${chemical.formula || '未知'}</span>
                        </div>
                        <div class="info-item">
                            <span class="label">分子量:</span>
                            <span class="value">${chemical.molecularWeight || '未知'}</span>
                        </div>
                        <div class="info-item">
                            <span class="label">数据源:</span>
                            <span class="value ${source}">${source === 'local' ? '本地数据库' : 'PubChem'}</span>
                        </div>
                    </div>
                </div>

                ${chemical.appearance ? `
                <div class="result-appearance">
                    <h5>外观性状</h5>
                    <p>${chemical.appearance}</p>
                </div>
                ` : ''}

                ${chemical.hazards && chemical.hazards.length > 0 ? `
                <div class="result-hazards">
                    <h5>危险信息</h5>
                    <div class="hazard-list">
                        ${chemical.hazards.map(hazard => `
                            <span class="hazard-tag ${hazard.type}">${hazard.text}</span>
                        `).join('')}
                    </div>
                </div>
                ` : ''}

                ${chemical.storage ? `
                <div class="result-storage">
                    <h5>储存要求</h5>
                    <p>${chemical.storage}</p>
                </div>
                ` : ''}

                ${chemical.firstAid ? `
                <div class="result-first-aid">
                    <h5>急救措施</h5>
                    <p>${chemical.firstAid}</p>
                </div>
                ` : ''}

                ${source === 'online' && chemical.structureImageUrl ? `
                <div class="result-structure">
                    <h5>分子结构</h5>
                    <img src="${chemical.structureImageUrl}" alt="分子结构图" class="structure-image">
                </div>
                ` : ''}

                <div class="result-footer">
                    <div class="result-links">
                        ${chemical.pubchemUrl ? `
                            <a href="${chemical.pubchemUrl}" target="_blank" class="external-link">
                                <i class="fas fa-external-link-alt"></i> PubChem
                            </a>
                        ` : ''}
                        ${chemical.cas ? `
                            <a href="${this.chemicalDataService.getNISTUrl(chemical.formula)}" target="_blank" class="external-link">
                                <i class="fas fa-external-link-alt"></i> NIST
                            </a>
                        ` : ''}
                        ${chemical.cas ? `
                            <a href="${this.chemicalDataService.getECHAUrl(chemical.cas)}" target="_blank" class="external-link">
                                <i class="fas fa-external-link-alt"></i> ECHA
                            </a>
                        ` : ''}
                    </div>
                    <div class="result-tools">
                        <button class="btn-use-in-assessment" onclick="useInAssessment('${index}')">
                            用于风险评估
                        </button>
                        <button class="btn-add-to-monitoring" onclick="addToMonitoring('${index}')">
                            添加到监测
                        </button>
                    </div>
                </div>
            </div>
        `).join('');

        resultsContainer.innerHTML = `
            <div class="results-summary">
                <span>找到 ${results.length} 个相关结果</span>
            </div>
            <div class="results-list">
                ${resultsHtml}
            </div>
        `;

        exportBtn.style.display = 'inline-flex';

        // 保存当前搜索结果
        this.currentSearchResults = results;

        // 更新统计信息
        this.updateTodaySearchCount();
    }

    /**
     * 显示搜索加载状态
     */
    showSearchLoading() {
        const resultsContainer = document.getElementById('searchResults');
        if (resultsContainer) {
            resultsContainer.innerHTML = `
                <div class="search-loading">
                    <div class="loading-spinner"></div>
                    <p>正在搜索化学品信息...</p>
                </div>
            `;
        }
    }

    /**
     * 显示搜索错误
     */
    showSearchError(message) {
        const resultsContainer = document.getElementById('searchResults');
        if (resultsContainer) {
            resultsContainer.innerHTML = `
                <div class="search-error">
                    <i class="fas fa-exclamation-triangle"></i>
                    <h4>搜索失败</h4>
                    <p>${message}</p>
                </div>
            `;
        }
    }

    /**
     * 添加到搜索历史
     */
    addToSearchHistory(query) {
        const timestamp = new Date().toISOString();
        const historyItem = { query, timestamp };

        // 移除重复项
        this.searchHistory = this.searchHistory.filter(item => item.query !== query);

        // 添加到开头
        this.searchHistory.unshift(historyItem);

        // 限制历史记录数量
        if (this.searchHistory.length > 20) {
            this.searchHistory = this.searchHistory.slice(0, 20);
        }

        // 保存到本地存储
        this.saveSearchHistory();

        // 更新显示
        this.updateSearchHistoryDisplay();
    }

    /**
     * 保存搜索历史
     */
    saveSearchHistory() {
        try {
            localStorage.setItem('chemsafe_search_history', JSON.stringify(this.searchHistory));
        } catch (error) {
            console.error('保存搜索历史失败:', error);
        }
    }

    /**
     * 加载搜索历史
     */
    loadSearchHistory() {
        try {
            const saved = localStorage.getItem('chemsafe_search_history');
            if (saved) {
                this.searchHistory = JSON.parse(saved);
            }
        } catch (error) {
            console.error('加载搜索历史失败:', error);
            this.searchHistory = [];
        }
    }

    /**
     * 更新搜索历史显示
     */
    updateSearchHistoryDisplay() {
        const historyContainer = document.getElementById('searchHistory');
        if (!historyContainer) return;

        if (this.searchHistory.length === 0) {
            historyContainer.innerHTML = '<p class="empty-state">暂无搜索历史</p>';
            return;
        }

        const historyHtml = this.searchHistory.slice(0, 10).map(item => `
            <div class="history-item">
                <button class="history-query" onclick="quickSearch('${item.query}')">
                    <i class="fas fa-search"></i>
                    ${item.query}
                </button>
                <span class="history-time">${this.formatTime(item.timestamp)}</span>
                <button class="btn-remove-history" onclick="removeFromHistory('${item.query}')">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `).join('');

        historyContainer.innerHTML = historyHtml;
    }

    /**
     * 格式化时间
     */
    formatTime(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now - date;

        if (diff < 60000) { // 1分钟内
            return '刚刚';
        } else if (diff < 3600000) { // 1小时内
            return `${Math.floor(diff / 60000)}分钟前`;
        } else if (diff < 86400000) { // 1天内
            return `${Math.floor(diff / 3600000)}小时前`;
        } else {
            return date.toLocaleDateString();
        }
    }

    /**
     * 加载收藏夹
     */
    loadFavorites() {
        try {
            const saved = localStorage.getItem('chemsafe_favorites');
            if (saved) {
                this.favoriteChemicals = JSON.parse(saved);
            }
        } catch (error) {
            console.error('加载收藏夹失败:', error);
            this.favoriteChemicals = [];
        }
    }

    /**
     * 保存收藏夹
     */
    saveFavorites() {
        try {
            localStorage.setItem('chemsafe_favorites', JSON.stringify(this.favoriteChemicals));
        } catch (error) {
            console.error('保存收藏夹失败:', error);
        }
    }

    /**
     * 更新今日搜索次数
     */
    updateTodaySearchCount() {
        const today = new Date().toDateString();
        let todayCount = parseInt(localStorage.getItem(`chemsafe_search_count_${today}`)) || 0;
        todayCount++;
        localStorage.setItem(`chemsafe_search_count_${today}`, todayCount.toString());

        const countElement = document.getElementById('todaySearchCount');
        if (countElement) {
            countElement.textContent = todayCount;
        }
    }

    /**
     * 导出搜索结果
     */
    exportSearchResults() {
        if (!this.currentSearchResults || this.currentSearchResults.length === 0) {
            alert('没有可导出的搜索结果');
            return;
        }

        const data = {
            exportTime: new Date().toISOString(),
            totalResults: this.currentSearchResults.length,
            results: this.currentSearchResults.map(chemical => ({
                name: chemical.name,
                englishName: chemical.englishName,
                cas: chemical.cas,
                formula: chemical.formula,
                molecularWeight: chemical.molecularWeight,
                hazards: chemical.hazards,
                storage: chemical.storage,
                firstAid: chemical.firstAid,
                source: chemical.source
            }))
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `化学品搜索结果_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    /**
     * 切换标签页
     */
    switchSearchTab(tabId) {
        // 移除所有活动状态
        document.querySelectorAll('.search-tab').forEach(tab => tab.classList.remove('active'));
        document.querySelectorAll('.search-tab-content').forEach(content => content.classList.remove('active'));

        // 激活选中的标签页
        document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');
        document.getElementById(`${tabId}-search`).classList.add('active');
    }
}

// 全局函数，供HTML调用
window.msdsModule = new MSDSDatabaseModule();

// 供HTML调用的全局函数
window.performQuickSearch = () => window.msdsModule.performQuickSearch();
window.quickSearch = (keyword) => window.msdsModule.performQuickSearch(keyword);
window.clearSearchResults = () => {
    document.getElementById('searchResults').innerHTML = `
        <div class="no-results-placeholder">
            <i class="fas fa-search"></i>
            <p>请输入搜索条件查询化学品信息</p>
        </div>
    `;
    document.querySelector('.btn-export-results').style.display = 'none';
};
window.exportSearchResults = () => window.msdsModule.exportSearchResults();

// 标签页切换
document.addEventListener('click', (e) => {
    if (e.target.matches('.search-tab') || e.target.closest('.search-tab')) {
        const tab = e.target.matches('.search-tab') ? e.target : e.target.closest('.search-tab');
        const tabId = tab.dataset.tab;
        if (tabId) {
            window.msdsModule.switchSearchTab(tabId);
        }
    }
});
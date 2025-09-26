// 主要搜索组件
import { ChemicalDataService } from '../services/chemical-data-service.js';
import { LocalDataService } from '../services/local-data-service.js';
import { GHSClassificationSystem } from '../services/ghs-classification.js';
import { ChemicalRiskAssessment } from '../services/risk-assessment.js';
import { StorageCompatibilityChecker } from '../services/storage-compatibility.js';
import { ChemicalCalculatorUtils } from '../utils/calculator-utils.js';
import { MajorHazardAssessment } from '../services/major-hazard-assessment.js';

export class ChemicalSearchComponent {
    constructor() {
        this.chemicalDataService = new ChemicalDataService();
        this.localDataService = new LocalDataService();
        this.ghsSystem = new GHSClassificationSystem();
        this.riskAssessment = new ChemicalRiskAssessment();
        this.storageChecker = new StorageCompatibilityChecker();
        this.calculator = new ChemicalCalculatorUtils();
        this.majorHazardAssessment = new MajorHazardAssessment();

        this.currentSearchType = 'name';
        this.searchHistory = [];
        this.favorites = JSON.parse(localStorage.getItem('chemical-favorites') || '[]');

        this.initializeComponents();
        this.bindEvents();
    }

    initializeComponents() {
        this.elements = {
            searchInput: document.getElementById('searchInput'),
            searchBtn: document.getElementById('searchBtn'),
            resultContainer: document.getElementById('resultContainer'),
            searchTypeButtons: document.querySelectorAll('.search-type-btn'),
            advancedToggle: document.querySelector('.advanced-toggle'),
            advancedSearch: document.querySelector('.advanced-search')
        };
    }

    bindEvents() {
        // 搜索按钮事件
        this.elements.searchBtn.addEventListener('click', () => this.performSearch());

        // 回车键搜索
        this.elements.searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.performSearch();
            }
        });

        // 搜索类型切换
        this.elements.searchTypeButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchSearchType(e.target.dataset.type);
            });
        });

        // 高级搜索切换
        if (this.elements.advancedToggle) {
            this.elements.advancedToggle.addEventListener('click', () => {
                this.toggleAdvancedSearch();
            });
        }

        // 搜索建议
        this.elements.searchInput.addEventListener('input', (e) => {
            this.debounce(() => this.showSearchSuggestions(e.target.value), 300);
        });
    }

    // 执行搜索
    async performSearch() {
        const query = this.elements.searchInput.value.trim();

        if (!query) {
            this.showError('请输入搜索内容');
            return;
        }

        this.showLoading();

        try {
            // 首先在本地数据库搜索
            const localResult = this.searchLocal(query);

            if (localResult) {
                this.displayResult({
                    source: 'local',
                    data: localResult
                });
                this.addToHistory(query, localResult);
                return;
            }

            // 如果本地没有找到，搜索在线数据库
            const onlineResult = await this.searchOnline(query);

            if (onlineResult) {
                this.displayResult(onlineResult);
                this.addToHistory(query, onlineResult);
            } else {
                this.showNoResult();
            }

        } catch (error) {
            console.error('搜索错误:', error);
            this.showError(error.message || '搜索过程中发生错误');
        }
    }

    // 本地搜索
    searchLocal(query) {
        switch (this.currentSearchType) {
            case 'name':
                return this.localDataService.searchByName(query);
            case 'cas':
                return this.localDataService.searchByCAS(query);
            case 'formula':
                return this.localDataService.searchByFormula(query);
            case 'fuzzy':
                const results = this.localDataService.fuzzySearch(query);
                return results.length > 0 ? results[0] : null;
            default:
                return this.localDataService.searchByName(query);
        }
    }

    // 在线搜索
    async searchOnline(query) {
        switch (this.currentSearchType) {
            case 'name':
                return await this.chemicalDataService.searchByName(query);
            case 'cas':
                return await this.chemicalDataService.searchByCAS(query);
            case 'formula':
                return await this.chemicalDataService.searchByFormula(query);
            default:
                return await this.chemicalDataService.searchByName(query);
        }
    }

    // 切换搜索类型
    switchSearchType(type) {
        this.currentSearchType = type;

        // 更新按钮状态
        this.elements.searchTypeButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.type === type);
        });

        // 更新输入框占位符
        const placeholders = {
            'name': '请输入化学品名称（中文或英文）',
            'cas': '请输入CAS号（格式：XXXXXX-XX-X）',
            'formula': '请输入分子式（如：C6H6）',
            'fuzzy': '支持名称、CAS号、分子式模糊搜索'
        };

        this.elements.searchInput.placeholder = placeholders[type];
    }

    // 切换高级搜索
    toggleAdvancedSearch() {
        const advancedSearch = this.elements.advancedSearch;
        advancedSearch.classList.toggle('show');

        const toggleText = advancedSearch.classList.contains('show') ? '收起高级搜索' : '展开高级搜索';
        this.elements.advancedToggle.textContent = toggleText;
    }

    // 显示搜索结果
    displayResult(data) {
        const container = this.elements.resultContainer;

        if (data.source === 'local') {
            container.innerHTML = this.generateLocalResultHTML(data.data);
        } else {
            container.innerHTML = this.generateOnlineResultHTML(data);
        }

        // 添加交互功能
        this.addResultInteractions(data);
    }

    // 生成本地结果HTML
    generateLocalResultHTML(chemical) {
        const ghsInfo = this.ghsSystem.getGHSLabel(chemical);
        const storageClass = this.storageChecker.classifyChemical(chemical);

        return `
            <div class="result-card">
                <div class="result-header">
                    <div class="chemical-name">${chemical.name} (${chemical.englishName})</div>
                    <div class="chemical-formula">${chemical.formula}</div>
                    <div class="data-source">📊 数据来源：本地数据库</div>
                    <div class="action-buttons">
                        <button class="btn-secondary" onclick="chemicalSearch.addToFavorites('${chemical.cas}')">
                            ⭐ 收藏
                        </button>
                        <button class="btn-secondary" onclick="chemicalSearch.performRiskAssessment('${chemical.cas}')">
                            🔍 风险评估
                        </button>
                        <button class="btn-secondary" onclick="chemicalSearch.checkStorageCompatibility('${chemical.cas}')">
                            📦 储存检查
                        </button>
                    </div>
                </div>

                <div class="result-body">
                    <div class="info-grid">
                        <div class="info-section">
                            <div class="info-title">📊 基本信息</div>
                            <div class="info-content">
                                <div class="property-row">
                                    <span class="property-label">中文名</span>
                                    <span class="property-value">${chemical.name}</span>
                                </div>
                                <div class="property-row">
                                    <span class="property-label">英文名</span>
                                    <span class="property-value">${chemical.englishName}</span>
                                </div>
                                <div class="property-row">
                                    <span class="property-label">CAS号</span>
                                    <span class="property-value">${chemical.cas}</span>
                                </div>
                                <div class="property-row">
                                    <span class="property-label">分子式</span>
                                    <span class="property-value">${chemical.formula}</span>
                                </div>
                                <div class="property-row">
                                    <span class="property-label">分子量</span>
                                    <span class="property-value">${chemical.molecularWeight} g/mol</span>
                                </div>
                            </div>
                        </div>

                        <div class="info-section">
                            <div class="info-title">🌡️ 物理性质</div>
                            <div class="info-content">
                                <div class="property-row">
                                    <span class="property-label">外观</span>
                                    <span class="property-value">${chemical.appearance}</span>
                                </div>
                                <div class="property-row">
                                    <span class="property-label">气味</span>
                                    <span class="property-value">${chemical.odor}</span>
                                </div>
                                <div class="property-row">
                                    <span class="property-label">熔点</span>
                                    <span class="property-value">${chemical.meltingPoint}°C</span>
                                </div>
                                <div class="property-row">
                                    <span class="property-label">沸点</span>
                                    <span class="property-value">${chemical.boilingPoint}°C</span>
                                </div>
                                <div class="property-row">
                                    <span class="property-label">密度</span>
                                    <span class="property-value">${chemical.density} g/cm³</span>
                                </div>
                                <div class="property-row">
                                    <span class="property-label">溶解性</span>
                                    <span class="property-value">${chemical.solubility}</span>
                                </div>
                            </div>
                        </div>

                        <div class="info-section">
                            <div class="info-title">⚠️ GHS危险性信息</div>
                            <div class="info-content">
                                <div class="ghs-pictograms">
                                    ${ghsInfo.pictograms.map(p => `<span class="ghs-pictogram" title="${p.description}">${p.symbol}</span>`).join('')}
                                </div>
                                <div class="signal-word">信号词：${ghsInfo.signalWord}</div>
                                <div class="hazard-statements">
                                    ${chemical.hazards.map(hazard => `
                                        <div class="hazard-item ${hazard.type === 'serious' ? 'hazard-serious' : ''}">
                                            ${hazard.text}
                                        </div>
                                    `).join('')}
                                </div>
                                <div class="precautionary-statements">
                                    <strong>预防措施：</strong>
                                    <ul>
                                        ${ghsInfo.precautionaryStatements.map(s => `<li>${s}</li>`).join('')}
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div class="info-section">
                            <div class="info-title">📦 储存与应急</div>
                            <div class="info-content">
                                <div class="property-row">
                                    <span class="property-label">储存分类</span>
                                    <span class="property-value">${storageClass ? storageClass.name : '未分类'}</span>
                                </div>
                                <div class="property-row">
                                    <span class="property-label">储存条件</span>
                                    <span class="property-value">${chemical.storage}</span>
                                </div>
                                <div class="property-row">
                                    <span class="property-label">应急处理</span>
                                    <span class="property-value">${chemical.firstAid}</span>
                                </div>
                                <div class="property-row">
                                    <span class="property-label">主要用途</span>
                                    <span class="property-value">${chemical.applications}</span>
                                </div>
                            </div>
                        </div>

                        <div class="info-section">
                            <div class="info-title">🔗 相关工具</div>
                            <div class="info-content">
                                <button class="tool-btn" onclick="chemicalSearch.openCalculator('${chemical.formula}')">
                                    🧮 计算工具
                                </button>
                                <button class="tool-btn" onclick="chemicalSearch.generateSDS('${chemical.cas}')">
                                    📋 生成SDS
                                </button>
                                <button class="tool-btn" onclick="chemicalSearch.exportData('${chemical.cas}')">
                                    💾 导出数据
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // 生成在线结果HTML
    generateOnlineResultHTML(data) {
        const { cid, basicInfo, properties, ghs, source } = data;
        const sourceNames = {
            'pubchem': 'PubChem',
            'pubchem_alt': 'PubChem (备用)',
            'cas': 'CAS查询',
            'formula': '分子式查询'
        };

        return `
            <div class="result-card">
                <div class="result-header">
                    <div class="chemical-name">${basicInfo.IUPACName || '未知化合物'}</div>
                    <div class="chemical-formula">${basicInfo.MolecularFormula || 'N/A'}</div>
                    <div class="data-source">📊 数据来源：${sourceNames[source] || source}</div>
                    <div class="action-buttons">
                        <button class="btn-secondary" onclick="chemicalSearch.addToFavorites('${cid}')">
                            ⭐ 收藏
                        </button>
                        <button class="btn-secondary" onclick="chemicalSearch.saveToLocal('${cid}')">
                            💾 保存到本地
                        </button>
                    </div>
                </div>

                <div class="result-body">
                    <div class="info-grid">
                        <div class="info-section">
                            <div class="info-title">📊 基本信息</div>
                            <div class="info-content">
                                <div class="property-row">
                                    <span class="property-label">PubChem CID</span>
                                    <span class="property-value">${cid}</span>
                                </div>
                                <div class="property-row">
                                    <span class="property-label">分子量</span>
                                    <span class="property-value">${basicInfo.MolecularWeight ? parseFloat(basicInfo.MolecularWeight).toFixed(2) + ' g/mol' : 'N/A'}</span>
                                </div>
                                <div class="property-row">
                                    <span class="property-label">分子式</span>
                                    <span class="property-value">${basicInfo.MolecularFormula || 'N/A'}</span>
                                </div>
                                <div class="property-row">
                                    <span class="property-label">SMILES</span>
                                    <span class="property-value" style="font-family: monospace; font-size: 12px;">${basicInfo.CanonicalSMILES || 'N/A'}</span>
                                </div>
                            </div>
                        </div>

                        <div class="info-section">
                            <div class="info-title">🔬 分子特性</div>
                            <div class="info-content">
                                <div class="property-row">
                                    <span class="property-label">重原子数</span>
                                    <span class="property-value">${properties.HeavyAtomCount || 'N/A'}</span>
                                </div>
                                <div class="property-row">
                                    <span class="property-label">氢键供体</span>
                                    <span class="property-value">${properties.HBondDonorCount || 'N/A'}</span>
                                </div>
                                <div class="property-row">
                                    <span class="property-label">氢键受体</span>
                                    <span class="property-value">${properties.HBondAcceptorCount || 'N/A'}</span>
                                </div>
                                <div class="property-row">
                                    <span class="property-label">可旋转键</span>
                                    <span class="property-value">${properties.RotatableBondCount || 'N/A'}</span>
                                </div>
                                <div class="property-row">
                                    <span class="property-label">极性表面积</span>
                                    <span class="property-value">${properties.TPSA ? properties.TPSA + ' Ų' : 'N/A'}</span>
                                </div>
                            </div>
                        </div>

                        <div class="info-section">
                            <div class="info-title">⚠️ 安全信息</div>
                            <div class="info-content">
                                ${ghs.map(hazard => `
                                    <div class="hazard-item ${hazard.type === 'serious' ? 'hazard-serious' : ''}">
                                        ${hazard.text}
                                    </div>
                                `).join('')}
                                <p style="margin-top: 15px; font-size: 12px; color: #666;">
                                    ⚠️ 以上仅为基础安全提示，使用前请务必查阅完整的安全数据表(SDS)
                                </p>
                            </div>
                        </div>

                        <div class="info-section">
                            <div class="info-title">🔗 相关链接</div>
                            <div class="info-content">
                                <p><a href="${this.chemicalDataService.getPubChemUrl(cid)}" target="_blank">📖 PubChem详细页面</a></p>
                                <p><a href="${this.chemicalDataService.getNISTUrl(basicInfo.MolecularFormula)}" target="_blank">📊 NIST化学数据库</a></p>
                                <p><a href="${this.chemicalDataService.getECHAUrl(basicInfo.MolecularFormula)}" target="_blank">🇪🇺 ECHA数据库</a></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // 添加结果交互功能
    addResultInteractions(data) {
        // 全局暴露方法供按钮调用
        window.chemicalSearch = this;
    }

    // 显示加载状态
    showLoading() {
        this.elements.resultContainer.innerHTML = `
            <div class="loading">
                <div class="spinner"></div>
                <p>正在搜索化学品信息...</p>
            </div>
        `;
    }

    // 显示错误信息
    showError(message) {
        this.elements.resultContainer.innerHTML = `
            <div class="error-card">
                <h4>❌ 搜索失败</h4>
                <p>${message}</p>
                <div style="margin-top: 15px; padding: 10px; background: #fff3cd; border-radius: 5px;">
                    <p style="margin: 0; font-size: 14px; color: #856404;">
                        💡 建议：检查网络连接或尝试使用其他搜索方式
                    </p>
                </div>
            </div>
        `;
    }

    // 显示无结果
    showNoResult() {
        this.elements.resultContainer.innerHTML = `
            <div class="result-card" style="text-align: center; padding: 40px;">
                <h3>😔 未找到相关化学品</h3>
                <div style="margin: 20px 0; color: #666;">
                    <p>已在多个数据源中搜索，但未找到匹配的结果</p>
                </div>
                <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: left;">
                    <h4 style="margin-bottom: 15px; color: #333;">💡 建议尝试：</h4>
                    <ul style="list-style: none; padding: 0; margin: 0;">
                        <li style="margin-bottom: 8px;">• 使用英文名称或IUPAC名称</li>
                        <li style="margin-bottom: 8px;">• 检查拼写是否正确</li>
                        <li style="margin-bottom: 8px;">• 使用CAS号查询（格式：XXXXXX-XX-X）</li>
                        <li style="margin-bottom: 8px;">• 尝试化学式查询（如：C6H6）</li>
                        <li style="margin-bottom: 8px;">• 使用常用别名或俗名</li>
                        <li style="margin-bottom: 8px;">• 尝试去掉特殊字符和空格</li>
                    </ul>
                </div>
            </div>
        `;
    }

    // 工具方法
    debounce(func, wait) {
        clearTimeout(this.debounceTimer);
        this.debounceTimer = setTimeout(func, wait);
    }

    addToHistory(query, result) {
        const historyItem = {
            query,
            result: result.name || result.englishName || result.basicInfo?.IUPACName,
            timestamp: new Date().getTime()
        };

        this.searchHistory.unshift(historyItem);

        // 限制历史记录数量
        if (this.searchHistory.length > 50) {
            this.searchHistory = this.searchHistory.slice(0, 50);
        }

        localStorage.setItem('chemical-search-history', JSON.stringify(this.searchHistory));
    }

    // 扩展功能方法
    addToFavorites(identifier) {
        // 实现收藏功能
        console.log('添加到收藏:', identifier);
    }

    performRiskAssessment(identifier) {
        // 实现风险评估功能
        console.log('执行风险评估:', identifier);
    }

    checkStorageCompatibility(identifier) {
        // 实现储存兼容性检查
        console.log('检查储存兼容性:', identifier);
    }

    openCalculator(formula) {
        // 实现计算器功能
        console.log('打开计算器:', formula);
    }

    generateSDS(cas) {
        // 实现SDS生成功能
        console.log('生成SDS:', cas);
    }

    exportData(identifier) {
        // 实现数据导出功能
        console.log('导出数据:', identifier);
    }

    saveToLocal(cid) {
        // 实现保存到本地数据库
        console.log('保存到本地:', cid);
    }
}
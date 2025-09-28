/**
 * 防火间距计算模块
 * 基于GB 50016-2014《建筑设计防火规范》
 */

export class FireDistanceModule {
    constructor() {
        this.buildingTypes = {
            // 厂房
            factory: {
                name: '厂房',
                subcategories: {
                    'A': { name: 'A类厂房', description: '使用或生产甲类火灾危险性物质的厂房' },
                    'B': { name: 'B类厂房', description: '使用或生产乙类火灾危险性物质的厂房' },
                    'C': { name: 'C类厂房', description: '使用或生产丙类火灾危险性物质的厂房' },
                    'D': { name: 'D类厂房', description: '使用或生产丁类火灾危险性物质的厂房' },
                    'E': { name: 'E类厂房', description: '使用或生产戊类火灾危险性物质的厂房' }
                }
            },
            // 仓库
            warehouse: {
                name: '仓库',
                subcategories: {
                    'A': { name: 'A类仓库', description: '储存甲类火灾危险性物质的仓库' },
                    'B': { name: 'B类仓库', description: '储存乙类火灾危险性物质的仓库' },
                    'C': { name: 'C类仓库', description: '储存丙类火灾危险性物质的仓库' },
                    'D': { name: 'D类仓库', description: '储存丁类火灾危险性物质的仓库' },
                    'E': { name: 'E类仓库', description: '储存戊类火灾危险性物质的仓库' }
                }
            },
            // 民用建筑
            civilian: {
                name: '民用建筑',
                subcategories: {
                    'residential': { name: '住宅建筑', description: '住宅、公寓等居住建筑' },
                    'public': { name: '公共建筑', description: '办公、商业、文化娱乐等公共建筑' },
                    'high_rise': { name: '高层建筑', description: '建筑高度大于27m的住宅建筑和大于24m的非单层公共建筑' }
                }
            },
            // 储罐
            tank: {
                name: '储罐',
                subcategories: {
                    'A': { name: 'A类液体储罐', description: '储存甲类液体的储罐' },
                    'B': { name: 'B类液体储罐', description: '储存乙类液体的储罐' },
                    'C': { name: 'C类液体储罐', description: '储存丙类液体的储罐' },
                    'LPG': { name: 'LPG储罐', description: '液化石油气储罐' },
                    'LNG': { name: 'LNG储罐', description: '液化天然气储罐' }
                }
            }
        };

        // 防火间距表 (单位: 米)
        this.fireDistanceTable = {
            // 厂房与厂房之间的防火间距
            'factory-factory': {
                'A-A': { min: 12, note: '甲类厂房与甲类厂房' },
                'A-B': { min: 12, note: '甲类厂房与乙类厂房' },
                'A-C': { min: 12, note: '甲类厂房与丙类厂房' },
                'A-D': { min: 10, note: '甲类厂房与丁类厂房' },
                'A-E': { min: 10, note: '甲类厂房与戊类厂房' },
                'B-B': { min: 10, note: '乙类厂房与乙类厂房' },
                'B-C': { min: 10, note: '乙类厂房与丙类厂房' },
                'B-D': { min: 10, note: '乙类厂房与丁类厂房' },
                'B-E': { min: 10, note: '乙类厂房与戊类厂房' },
                'C-C': { min: 10, note: '丙类厂房与丙类厂房' },
                'C-D': { min: 10, note: '丙类厂房与丁类厂房' },
                'C-E': { min: 10, note: '丙类厂房与戊类厂房' },
                'D-D': { min: 6, note: '丁类厂房与丁类厂房' },
                'D-E': { min: 6, note: '丁类厂房与戊类厂房' },
                'E-E': { min: 6, note: '戊类厂房与戊类厂房' }
            },
            // 厂房与仓库之间的防火间距
            'factory-warehouse': {
                'A-A': { min: 12, note: '甲类厂房与甲类仓库' },
                'A-B': { min: 12, note: '甲类厂房与乙类仓库' },
                'A-C': { min: 12, note: '甲类厂房与丙类仓库' },
                'B-B': { min: 10, note: '乙类厂房与乙类仓库' },
                'B-C': { min: 10, note: '乙类厂房与丙类仓库' },
                'C-C': { min: 10, note: '丙类厂房与丙类仓库' }
            },
            // 厂房与民用建筑之间的防火间距
            'factory-civilian': {
                'A-any': { min: 25, note: '甲类厂房与民用建筑' },
                'B-any': { min: 20, note: '乙类厂房与民用建筑' },
                'C-any': { min: 20, note: '丙类厂房与民用建筑' },
                'D-any': { min: 15, note: '丁类厂房与民用建筑' },
                'E-any': { min: 15, note: '戊类厂房与民用建筑' }
            },
            // 储罐与建筑物之间的防火间距
            'tank-building': {
                'A-factory': { min: 15, note: 'A类液体储罐与厂房' },
                'A-warehouse': { min: 12, note: 'A类液体储罐与仓库' },
                'A-civilian': { min: 20, note: 'A类液体储罐与民用建筑' },
                'B-factory': { min: 12, note: 'B类液体储罐与厂房' },
                'B-warehouse': { min: 10, note: 'B类液体储罐与仓库' },
                'B-civilian': { min: 15, note: 'B类液体储罐与民用建筑' },
                'LPG-any': { min: 20, note: 'LPG储罐与建筑物' },
                'LNG-any': { min: 25, note: 'LNG储罐与建筑物' }
            }
        };

        this.hazardousChemicalFactors = {
            // 危险化学品修正系数
            'explosive': { factor: 1.5, name: '爆炸性物质' },
            'toxic': { factor: 1.2, name: '剧毒物质' },
            'corrosive': { factor: 1.1, name: '腐蚀性物质' },
            'pressure': { factor: 1.3, name: '压力容器' }
        };
    }

    /**
     * 初始化防火间距计算界面
     */
    initializeFireDistanceInterface() {
        const container = document.createElement('div');
        container.className = 'fire-distance-container';
        container.innerHTML = `
            <div class="fire-distance-header">
                <h2><i class="fas fa-ruler"></i> 防火间距计算</h2>
                <p class="subtitle">基于GB 50016-2014《建筑设计防火规范》</p>
            </div>

            <div class="fire-calc-tabs">
                <div class="fire-tab-buttons">
                    <button class="fire-tab active" data-tab="standard">
                        <i class="fas fa-calculator"></i> 标准计算
                    </button>
                    <button class="fire-tab" data-tab="batch">
                        <i class="fas fa-list"></i> 批量计算
                    </button>
                    <button class="fire-tab" data-tab="layout">
                        <i class="fas fa-map"></i> 平面布置
                    </button>
                    <button class="fire-tab" data-tab="reference">
                        <i class="fas fa-book"></i> 规范查询
                    </button>
                </div>

                <!-- 标准计算标签页 -->
                <div class="fire-tab-content active" id="standard-tab">
                    <div class="standard-calculation">
                        <div class="building-selection">
                            <div class="building-group">
                                <h4>建筑物A</h4>
                                <div class="building-config">
                                    <div class="input-row">
                                        <label>建筑类型</label>
                                        <select id="buildingTypeA" onchange="updateSubcategoriesA()">
                                            <option value="">请选择建筑类型</option>
                                            <option value="factory">厂房</option>
                                            <option value="warehouse">仓库</option>
                                            <option value="civilian">民用建筑</option>
                                            <option value="tank">储罐</option>
                                        </select>
                                    </div>
                                    <div class="input-row">
                                        <label>具体类别</label>
                                        <select id="subcategoryA">
                                            <option value="">请先选择建筑类型</option>
                                        </select>
                                    </div>
                                    <div class="input-row">
                                        <label>建筑名称</label>
                                        <input type="text" id="buildingNameA" placeholder="输入建筑名称">
                                    </div>
                                    <div class="input-row">
                                        <label>特殊因素</label>
                                        <div class="special-factors">
                                            <label class="factor-option">
                                                <input type="checkbox" id="explosiveA" value="explosive">
                                                <span>爆炸性物质</span>
                                            </label>
                                            <label class="factor-option">
                                                <input type="checkbox" id="toxicA" value="toxic">
                                                <span>剧毒物质</span>
                                            </label>
                                            <label class="factor-option">
                                                <input type="checkbox" id="corrosiveA" value="corrosive">
                                                <span>腐蚀性物质</span>
                                            </label>
                                            <label class="factor-option">
                                                <input type="checkbox" id="pressureA" value="pressure">
                                                <span>压力容器</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="distance-arrow">
                                <i class="fas fa-arrows-alt-h"></i>
                                <span>防火间距</span>
                            </div>

                            <div class="building-group">
                                <h4>建筑物B</h4>
                                <div class="building-config">
                                    <div class="input-row">
                                        <label>建筑类型</label>
                                        <select id="buildingTypeB" onchange="updateSubcategoriesB()">
                                            <option value="">请选择建筑类型</option>
                                            <option value="factory">厂房</option>
                                            <option value="warehouse">仓库</option>
                                            <option value="civilian">民用建筑</option>
                                            <option value="tank">储罐</option>
                                        </select>
                                    </div>
                                    <div class="input-row">
                                        <label>具体类别</label>
                                        <select id="subcategoryB">
                                            <option value="">请先选择建筑类型</option>
                                        </select>
                                    </div>
                                    <div class="input-row">
                                        <label>建筑名称</label>
                                        <input type="text" id="buildingNameB" placeholder="输入建筑名称">
                                    </div>
                                    <div class="input-row">
                                        <label>特殊因素</label>
                                        <div class="special-factors">
                                            <label class="factor-option">
                                                <input type="checkbox" id="explosiveB" value="explosive">
                                                <span>爆炸性物质</span>
                                            </label>
                                            <label class="factor-option">
                                                <input type="checkbox" id="toxicB" value="toxic">
                                                <span>剧毒物质</span>
                                            </label>
                                            <label class="factor-option">
                                                <input type="checkbox" id="corrosiveB" value="corrosive">
                                                <span>腐蚀性物质</span>
                                            </label>
                                            <label class="factor-option">
                                                <input type="checkbox" id="pressureB" value="pressure">
                                                <span>压力容器</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="calculation-actions">
                            <button class="btn-calculate-distance" onclick="calculateFireDistance()">
                                <i class="fas fa-calculator"></i> 计算防火间距
                            </button>
                            <button class="btn-clear-inputs" onclick="clearDistanceInputs()">
                                <i class="fas fa-eraser"></i> 清空输入
                            </button>
                        </div>

                        <div class="distance-results" id="distanceResults">
                            <!-- 计算结果显示区域 -->
                        </div>
                    </div>
                </div>

                <!-- 批量计算标签页 -->
                <div class="fire-tab-content" id="batch-tab">
                    <div class="batch-calculation">
                        <h3>批量防火间距计算</h3>

                        <div class="batch-input-section">
                            <h4>建筑清单</h4>
                            <div class="building-list" id="buildingList">
                                <!-- 动态添加的建筑列表 -->
                            </div>
                            <button class="btn-add-building" onclick="addBuildingToBatch()">
                                <i class="fas fa-plus"></i> 添加建筑
                            </button>
                        </div>

                        <div class="batch-calculation-section">
                            <div class="batch-actions">
                                <button class="btn-calculate-batch" onclick="calculateBatchDistances()">
                                    <i class="fas fa-calculator"></i> 批量计算
                                </button>
                                <button class="btn-export-batch" onclick="exportBatchResults()">
                                    <i class="fas fa-download"></i> 导出结果
                                </button>
                            </div>

                            <div class="batch-results" id="batchResults">
                                <!-- 批量计算结果 -->
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 平面布置标签页 -->
                <div class="fire-tab-content" id="layout-tab">
                    <div class="layout-design">
                        <h3>平面布置设计</h3>

                        <div class="layout-tools">
                            <div class="tool-palette">
                                <h4>工具箱</h4>
                                <div class="layout-tools-grid">
                                    <button class="tool-btn" data-tool="factory" onclick="selectTool('factory')">
                                        <i class="fas fa-industry"></i> 厂房
                                    </button>
                                    <button class="tool-btn" data-tool="warehouse" onclick="selectTool('warehouse')">
                                        <i class="fas fa-warehouse"></i> 仓库
                                    </button>
                                    <button class="tool-btn" data-tool="tank" onclick="selectTool('tank')">
                                        <i class="fas fa-circle"></i> 储罐
                                    </button>
                                    <button class="tool-btn" data-tool="measure" onclick="selectTool('measure')">
                                        <i class="fas fa-ruler"></i> 测距
                                    </button>
                                </div>
                            </div>

                            <div class="layout-canvas-container">
                                <canvas id="layoutCanvas" width="800" height="600"></canvas>
                                <div class="canvas-controls">
                                    <button class="btn-clear-canvas" onclick="clearCanvas()">
                                        <i class="fas fa-trash"></i> 清空画布
                                    </button>
                                    <button class="btn-save-layout" onclick="saveLayout()">
                                        <i class="fas fa-save"></i> 保存布局
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div class="layout-properties" id="layoutProperties">
                            <!-- 选中对象的属性设置 -->
                        </div>
                    </div>
                </div>

                <!-- 规范查询标签页 -->
                <div class="fire-tab-content" id="reference-tab">
                    <div class="reference-query">
                        <h3>防火间距规范查询</h3>

                        <div class="reference-search">
                            <div class="search-filters">
                                <div class="filter-group">
                                    <label>建筑类型组合</label>
                                    <select id="referenceFilter">
                                        <option value="">全部类型</option>
                                        <option value="factory-factory">厂房-厂房</option>
                                        <option value="factory-warehouse">厂房-仓库</option>
                                        <option value="factory-civilian">厂房-民用建筑</option>
                                        <option value="tank-building">储罐-建筑物</option>
                                    </select>
                                </div>
                                <button class="btn-search-reference" onclick="searchReference()">
                                    <i class="fas fa-search"></i> 查询
                                </button>
                            </div>
                        </div>

                        <div class="reference-table-container">
                            <table class="reference-table" id="referenceTable">
                                <thead>
                                    <tr>
                                        <th>建筑类型A</th>
                                        <th>建筑类型B</th>
                                        <th>最小防火间距(m)</th>
                                        <th>规范条文</th>
                                        <th>备注说明</th>
                                    </tr>
                                </thead>
                                <tbody id="referenceTableBody">
                                    <!-- 动态填充查询结果 -->
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 计算历史 -->
            <div class="fire-distance-history">
                <h3><i class="fas fa-history"></i> 计算历史</h3>
                <div class="history-controls">
                    <button class="btn-clear-history" onclick="clearFireDistanceHistory()">
                        <i class="fas fa-trash"></i> 清空历史
                    </button>
                    <button class="btn-export-history" onclick="exportFireDistanceHistory()">
                        <i class="fas fa-download"></i> 导出历史
                    </button>
                </div>
                <div class="fire-history-list" id="fireHistoryList">
                    <!-- 计算历史记录 -->
                </div>
            </div>
        `;

        return container;
    }

    /**
     * 计算防火间距
     */
    calculateDistance(buildingA, buildingB) {
        const typeA = buildingA.type;
        const typeB = buildingB.type;
        const subcategoryA = buildingA.subcategory;
        const subcategoryB = buildingB.subcategory;

        // 确定查询键
        let queryKey = '';
        let distanceKey = '';

        if (typeA === 'factory' && typeB === 'factory') {
            queryKey = 'factory-factory';
            distanceKey = `${subcategoryA}-${subcategoryB}`;
        } else if ((typeA === 'factory' && typeB === 'warehouse') || (typeA === 'warehouse' && typeB === 'factory')) {
            queryKey = 'factory-warehouse';
            distanceKey = `${subcategoryA}-${subcategoryB}`;
        } else if ((typeA === 'factory' || typeA === 'warehouse') && typeB === 'civilian') {
            queryKey = 'factory-civilian';
            distanceKey = `${subcategoryA}-any`;
        } else if (typeA === 'civilian' && (typeB === 'factory' || typeB === 'warehouse')) {
            queryKey = 'factory-civilian';
            distanceKey = `${subcategoryB}-any`;
        } else if (typeA === 'tank' || typeB === 'tank') {
            queryKey = 'tank-building';
            const tankType = typeA === 'tank' ? subcategoryA : subcategoryB;
            const buildingType = typeA === 'tank' ? typeB : typeA;
            distanceKey = `${tankType}-${buildingType}`;
        }

        // 查找基本防火间距
        const distanceTable = this.fireDistanceTable[queryKey];
        let baseDistance = 0;
        let note = '';

        if (distanceTable && distanceTable[distanceKey]) {
            baseDistance = distanceTable[distanceKey].min;
            note = distanceTable[distanceKey].note;
        } else {
            // 如果没有找到精确匹配，尝试反向查找
            const reverseKey = distanceKey.split('-').reverse().join('-');
            if (distanceTable && distanceTable[reverseKey]) {
                baseDistance = distanceTable[reverseKey].min;
                note = distanceTable[reverseKey].note;
            } else {
                return {
                    error: true,
                    message: '未找到对应的防火间距标准，请检查建筑类型组合',
                    baseDistance: 0,
                    finalDistance: 0
                };
            }
        }

        // 计算修正系数
        let correctionFactor = 1.0;
        const factors = [];

        // 检查建筑A的特殊因素
        if (buildingA.factors) {
            buildingA.factors.forEach(factor => {
                if (this.hazardousChemicalFactors[factor]) {
                    const factorData = this.hazardousChemicalFactors[factor];
                    correctionFactor = Math.max(correctionFactor, factorData.factor);
                    factors.push(factorData.name);
                }
            });
        }

        // 检查建筑B的特殊因素
        if (buildingB.factors) {
            buildingB.factors.forEach(factor => {
                if (this.hazardousChemicalFactors[factor]) {
                    const factorData = this.hazardousChemicalFactors[factor];
                    correctionFactor = Math.max(correctionFactor, factorData.factor);
                    factors.push(factorData.name);
                }
            });
        }

        // 计算最终防火间距
        const finalDistance = Math.ceil(baseDistance * correctionFactor);

        return {
            error: false,
            baseDistance: baseDistance,
            correctionFactor: correctionFactor,
            finalDistance: finalDistance,
            note: note,
            appliedFactors: factors,
            regulation: this.getRegulationReference(queryKey, distanceKey),
            recommendation: this.generateRecommendation(finalDistance, factors)
        };
    }

    /**
     * 获取规范条文参考
     */
    getRegulationReference(queryKey, distanceKey) {
        const references = {
            'factory-factory': 'GB 50016-2014 第3.4.1条',
            'factory-warehouse': 'GB 50016-2014 第3.5.1条',
            'factory-civilian': 'GB 50016-2014 第3.4.2条',
            'tank-building': 'GB 50016-2014 第4.2.1条'
        };

        return references[queryKey] || 'GB 50016-2014 建筑设计防火规范';
    }

    /**
     * 生成建议
     */
    generateRecommendation(distance, factors) {
        let recommendation = `建议防火间距不小于${distance}米。`;

        if (factors.length > 0) {
            recommendation += `由于存在${factors.join('、')}等特殊危险因素，已按相关系数进行了调整。`;
        }

        if (distance >= 20) {
            recommendation += '由于间距较大，建议在满足规范要求的前提下，考虑通过设置防火墙、增加消防设施等措施优化布局。';
        }

        return recommendation;
    }

    /**
     * 显示计算结果
     */
    displayCalculationResult(result, buildingA, buildingB) {
        const resultsContainer = document.getElementById('distanceResults');
        if (!resultsContainer) return;

        if (result.error) {
            resultsContainer.innerHTML = `
                <div class="distance-error">
                    <i class="fas fa-exclamation-triangle"></i>
                    <h4>计算失败</h4>
                    <p>${result.message}</p>
                </div>
            `;
            return;
        }

        resultsContainer.innerHTML = `
            <div class="distance-result-content">
                <div class="result-header">
                    <h4>防火间距计算结果</h4>
                    <div class="result-time">${new Date().toLocaleString()}</div>
                </div>

                <div class="building-pair">
                    <div class="building-summary">
                        <h5>${buildingA.name || '建筑A'}</h5>
                        <p>${this.getBuildingTypeDescription(buildingA.type, buildingA.subcategory)}</p>
                    </div>
                    <div class="distance-value">
                        <span class="distance-number">${result.finalDistance}</span>
                        <span class="distance-unit">米</span>
                    </div>
                    <div class="building-summary">
                        <h5>${buildingB.name || '建筑B'}</h5>
                        <p>${this.getBuildingTypeDescription(buildingB.type, buildingB.subcategory)}</p>
                    </div>
                </div>

                <div class="calculation-details">
                    <div class="detail-row">
                        <span class="detail-label">基本防火间距:</span>
                        <span class="detail-value">${result.baseDistance} 米</span>
                    </div>
                    ${result.correctionFactor > 1 ? `
                    <div class="detail-row">
                        <span class="detail-label">修正系数:</span>
                        <span class="detail-value">${result.correctionFactor}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">影响因素:</span>
                        <span class="detail-value">${result.appliedFactors.join('、')}</span>
                    </div>
                    ` : ''}
                    <div class="detail-row">
                        <span class="detail-label">规范依据:</span>
                        <span class="detail-value">${result.regulation}</span>
                    </div>
                </div>

                <div class="result-recommendation">
                    <h5>设计建议</h5>
                    <p>${result.recommendation}</p>
                </div>

                <div class="result-actions">
                    <button class="btn-save-result" onclick="saveFireDistanceResult()">
                        <i class="fas fa-save"></i> 保存结果
                    </button>
                    <button class="btn-generate-report" onclick="generateFireDistanceReport()">
                        <i class="fas fa-file-alt"></i> 生成报告
                    </button>
                    <button class="btn-new-calculation" onclick="newFireDistanceCalculation()">
                        <i class="fas fa-plus"></i> 新建计算
                    </button>
                </div>
            </div>
        `;

        // 保存到历史记录
        this.saveToHistory({
            buildingA: buildingA,
            buildingB: buildingB,
            result: result,
            timestamp: new Date().toISOString()
        });
    }

    /**
     * 获取建筑类型描述
     */
    getBuildingTypeDescription(type, subcategory) {
        if (this.buildingTypes[type] && this.buildingTypes[type].subcategories[subcategory]) {
            return this.buildingTypes[type].subcategories[subcategory].name;
        }
        return '未知建筑类型';
    }

    /**
     * 保存到历史记录
     */
    saveToHistory(record) {
        const history = JSON.parse(localStorage.getItem('fire_distance_history') || '[]');
        history.unshift(record);

        // 限制历史记录数量
        if (history.length > 30) {
            history.splice(30);
        }

        localStorage.setItem('fire_distance_history', JSON.stringify(history));
        this.updateHistoryDisplay();
    }

    /**
     * 更新历史记录显示
     */
    updateHistoryDisplay() {
        const historyContainer = document.getElementById('fireHistoryList');
        if (!historyContainer) return;

        const history = JSON.parse(localStorage.getItem('fire_distance_history') || '[]');

        if (history.length === 0) {
            historyContainer.innerHTML = '<p class="empty-history">暂无计算历史记录</p>';
            return;
        }

        const historyHtml = history.slice(0, 10).map(record => `
            <div class="fire-history-item">
                <div class="history-summary">
                    <div class="buildings-pair">
                        <span>${record.buildingA.name || '建筑A'}</span>
                        <i class="fas fa-arrows-alt-h"></i>
                        <span>${record.buildingB.name || '建筑B'}</span>
                    </div>
                    <div class="history-distance">
                        ${record.result.finalDistance} 米
                    </div>
                </div>
                <div class="history-meta">
                    <span class="history-time">${new Date(record.timestamp).toLocaleString()}</span>
                    <div class="history-actions">
                        <button class="btn-reuse-calc" onclick="reuseCalculation('${record.timestamp}')">
                            <i class="fas fa-redo"></i> 重用
                        </button>
                    </div>
                </div>
            </div>
        `).join('');

        historyContainer.innerHTML = historyHtml;
    }

    /**
     * 切换标签页
     */
    switchTab(tabId) {
        // 移除所有活动状态
        document.querySelectorAll('.fire-tab').forEach(tab => tab.classList.remove('active'));
        document.querySelectorAll('.fire-tab-content').forEach(content => content.classList.remove('active'));

        // 激活选中的标签页
        document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');
        document.getElementById(`${tabId}-tab`).classList.add('active');
    }
}

// 全局函数，供HTML调用
window.fireDistanceModule = new FireDistanceModule();

// 供HTML调用的全局函数
window.updateSubcategoriesA = () => {
    const typeSelect = document.getElementById('buildingTypeA');
    const subcategorySelect = document.getElementById('subcategoryA');

    subcategorySelect.innerHTML = '<option value="">请选择具体类别</option>';

    if (typeSelect.value && window.fireDistanceModule.buildingTypes[typeSelect.value]) {
        const subcategories = window.fireDistanceModule.buildingTypes[typeSelect.value].subcategories;
        Object.keys(subcategories).forEach(key => {
            const option = document.createElement('option');
            option.value = key;
            option.textContent = subcategories[key].name;
            subcategorySelect.appendChild(option);
        });
    }
};

window.updateSubcategoriesB = () => {
    const typeSelect = document.getElementById('buildingTypeB');
    const subcategorySelect = document.getElementById('subcategoryB');

    subcategorySelect.innerHTML = '<option value="">请选择具体类别</option>';

    if (typeSelect.value && window.fireDistanceModule.buildingTypes[typeSelect.value]) {
        const subcategories = window.fireDistanceModule.buildingTypes[typeSelect.value].subcategories;
        Object.keys(subcategories).forEach(key => {
            const option = document.createElement('option');
            option.value = key;
            option.textContent = subcategories[key].name;
            subcategorySelect.appendChild(option);
        });
    }
};

window.calculateFireDistance = () => {
    // 获取建筑A信息
    const buildingA = {
        type: document.getElementById('buildingTypeA').value,
        subcategory: document.getElementById('subcategoryA').value,
        name: document.getElementById('buildingNameA').value,
        factors: []
    };

    // 获取建筑A的特殊因素
    ['explosive', 'toxic', 'corrosive', 'pressure'].forEach(factor => {
        if (document.getElementById(factor + 'A') && document.getElementById(factor + 'A').checked) {
            buildingA.factors.push(factor);
        }
    });

    // 获取建筑B信息
    const buildingB = {
        type: document.getElementById('buildingTypeB').value,
        subcategory: document.getElementById('subcategoryB').value,
        name: document.getElementById('buildingNameB').value,
        factors: []
    };

    // 获取建筑B的特殊因素
    ['explosive', 'toxic', 'corrosive', 'pressure'].forEach(factor => {
        if (document.getElementById(factor + 'B') && document.getElementById(factor + 'B').checked) {
            buildingB.factors.push(factor);
        }
    });

    // 验证输入
    if (!buildingA.type || !buildingA.subcategory || !buildingB.type || !buildingB.subcategory) {
        alert('请完整填写两个建筑物的类型信息');
        return;
    }

    // 计算防火间距
    const result = window.fireDistanceModule.calculateDistance(buildingA, buildingB);

    // 显示结果
    window.fireDistanceModule.displayCalculationResult(result, buildingA, buildingB);
};

window.clearDistanceInputs = () => {
    document.getElementById('buildingTypeA').value = '';
    document.getElementById('subcategoryA').innerHTML = '<option value="">请先选择建筑类型</option>';
    document.getElementById('buildingNameA').value = '';
    document.getElementById('buildingTypeB').value = '';
    document.getElementById('subcategoryB').innerHTML = '<option value="">请先选择建筑类型</option>';
    document.getElementById('buildingNameB').value = '';

    // 清空复选框
    ['explosive', 'toxic', 'corrosive', 'pressure'].forEach(factor => {
        const checkboxA = document.getElementById(factor + 'A');
        const checkboxB = document.getElementById(factor + 'B');
        if (checkboxA) checkboxA.checked = false;
        if (checkboxB) checkboxB.checked = false;
    });

    // 清空结果
    document.getElementById('distanceResults').innerHTML = '';
};

// 标签页切换事件
document.addEventListener('click', (e) => {
    if (e.target.matches('.fire-tab') || e.target.closest('.fire-tab')) {
        const tab = e.target.matches('.fire-tab') ? e.target : e.target.closest('.fire-tab');
        const tabId = tab.dataset.tab;
        if (tabId) {
            window.fireDistanceModule.switchTab(tabId);
        }
    }
});
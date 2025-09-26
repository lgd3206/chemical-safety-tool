/**
 * 职业接触限值查询和气体监测模块
 * 基于GBZ 2.1-2019标准及最新修改单
 */

import {
    GBZ21_2019_OEL_DATA,
    COMMON_GAS_OEL_DATABASE,
    GasConversionUtils,
    OELAssessmentTool
} from '../data/gbz21-oel-data.js';

export class OELMonitoringModule {
    constructor() {
        this.monitoringData = {
            workplaces: [],
            measurements: [],
            assessments: []
        };
    }

    /**
     * 初始化职业接触限值查询界面
     */
    initializeOELQueryInterface() {
        const container = document.createElement('div');
        container.className = 'oel-query-container';
        container.innerHTML = `
            <div class="oel-header">
                <h2><i class="fas fa-lungs"></i> 职业接触限值查询与评估</h2>
                <p class="subtitle">基于GBZ 2.1-2019《工作场所有害因素职业接触限值》标准</p>
            </div>

            <div class="oel-tabs">
                <div class="tab-buttons">
                    <button class="tab-btn active" data-tab="query">
                        <i class="fas fa-search"></i> 限值查询
                    </button>
                    <button class="tab-btn" data-tab="conversion">
                        <i class="fas fa-exchange-alt"></i> 单位换算
                    </button>
                    <button class="tab-btn" data-tab="assessment">
                        <i class="fas fa-chart-line"></i> 暴露评估
                    </button>
                    <button class="tab-btn" data-tab="monitoring">
                        <i class="fas fa-eye"></i> 监测方案
                    </button>
                </div>

                <!-- 限值查询标签页 -->
                <div class="tab-content active" id="query-tab">
                    <div class="query-section">
                        <h3>职业接触限值查询</h3>
                        <div class="query-form">
                            <div class="search-group">
                                <div class="search-input-group">
                                    <input type="text" id="chemicalSearchInput" placeholder="输入化学品名称、英文名或CAS号">
                                    <button class="btn-search" onclick="searchOELData()">
                                        <i class="fas fa-search"></i> 查询
                                    </button>
                                </div>
                                <div class="search-filters">
                                    <select id="categoryFilter">
                                        <option value="">所有类别</option>
                                        <option value="有毒气体">有毒气体</option>
                                        <option value="刺激性气体">刺激性气体</option>
                                        <option value="窒息性气体">窒息性气体</option>
                                        <option value="可燃气体">可燃气体</option>
                                    </select>
                                    <button class="btn-clear" onclick="clearSearchResults()">清空结果</button>
                                </div>
                            </div>
                        </div>

                        <div class="search-results-section">
                            <div id="searchResultsList" class="results-list">
                                <!-- 搜索结果将在这里显示 -->
                            </div>
                        </div>

                        <div class="oel-database-section">
                            <h4>常见有毒有害气体限值参考表</h4>
                            <div class="database-table-container">
                                <table class="oel-database-table">
                                    <thead>
                                        <tr>
                                            <th>化学品名称</th>
                                            <th>英文名称</th>
                                            <th>CAS号</th>
                                            <th>分子式</th>
                                            <th>MAC (mg/m³)</th>
                                            <th>PC-TWA (mg/m³)</th>
                                            <th>PC-STEL (mg/m³)</th>
                                            <th>主要危害</th>
                                            <th>检测方法</th>
                                        </tr>
                                    </thead>
                                    <tbody id="oelDatabaseTableBody">
                                        <!-- 数据表格内容 -->
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 单位换算标签页 -->
                <div class="tab-content" id="conversion-tab">
                    <div class="conversion-section">
                        <h3>气体浓度单位换算</h3>
                        <div class="conversion-forms">
                            <div class="conversion-form">
                                <h4>ppm ↔ mg/m³ 换算</h4>
                                <div class="form-grid">
                                    <div class="form-group">
                                        <label>化学品名称或分子量</label>
                                        <input type="text" id="convChemicalName" placeholder="输入化学品名称">
                                        <input type="number" id="molecularWeight" placeholder="或直接输入分子量" step="0.01">
                                    </div>
                                    <div class="form-group">
                                        <label>环境条件</label>
                                        <div class="condition-inputs">
                                            <input type="number" id="temperature" placeholder="温度(℃)" value="20">
                                            <input type="number" id="pressure" placeholder="压力(kPa)" value="101.3">
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <label>浓度值转换</label>
                                        <div class="conversion-inputs">
                                            <input type="number" id="ppmValue" placeholder="ppm值" step="0.01">
                                            <span class="conversion-arrow">⇄</span>
                                            <input type="number" id="mgm3Value" placeholder="mg/m³值" step="0.01">
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <button class="btn-convert" onclick="performUnitConversion()">
                                            <i class="fas fa-calculator"></i> 转换
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div class="conversion-result" id="conversionResult">
                                <!-- 转换结果显示 -->
                            </div>
                        </div>

                        <div class="conversion-tools">
                            <h4>其他换算工具</h4>
                            <div class="tool-cards">
                                <div class="tool-card">
                                    <h5>温度压力修正</h5>
                                    <p>根据实际环境条件修正气体浓度值</p>
                                    <button class="btn-tool" onclick="openTempPressureCorrection()">
                                        <i class="fas fa-thermometer-half"></i> 打开工具
                                    </button>
                                </div>
                                <div class="tool-card">
                                    <h5>混合气体计算</h5>
                                    <p>计算多种气体混合的总浓度</p>
                                    <button class="btn-tool" onclick="openMixedGasCalculator()">
                                        <i class="fas fa-flask"></i> 打开工具
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 暴露评估标签页 -->
                <div class="tab-content" id="assessment-tab">
                    <div class="assessment-section">
                        <h3>职业暴露风险评估</h3>
                        <div class="assessment-form">
                            <div class="form-grid">
                                <div class="form-group">
                                    <label>化学品名称 *</label>
                                    <input type="text" id="assessChemicalName" placeholder="输入要评估的化学品名称">
                                    <div class="suggestions" id="chemicalSuggestions"></div>
                                </div>
                                <div class="form-group">
                                    <label>检测浓度 *</label>
                                    <input type="number" id="exposureConcentration" placeholder="输入检测到的浓度值" step="0.01">
                                </div>
                                <div class="form-group">
                                    <label>浓度单位</label>
                                    <select id="concentrationUnit">
                                        <option value="mg/m³">mg/m³</option>
                                        <option value="ppm">ppm</option>
                                        <option value="μg/m³">μg/m³</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label>暴露类型</label>
                                    <select id="exposureType">
                                        <option value="TWA">时间加权平均浓度(TWA)</option>
                                        <option value="STEL">短时间接触容许浓度(STEL)</option>
                                        <option value="MAC">最高容许浓度(MAC)</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label>工作场所</label>
                                    <input type="text" id="workplace" placeholder="工作场所描述">
                                </div>
                                <div class="form-group">
                                    <label>检测时间</label>
                                    <input type="datetime-local" id="measurementTime">
                                </div>
                                <div class="form-group full-width">
                                    <button class="btn-assess" onclick="performExposureAssessment()">
                                        <i class="fas fa-chart-line"></i> 开始评估
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div class="assessment-results" id="assessmentResults">
                            <!-- 评估结果显示区域 -->
                        </div>
                    </div>
                </div>

                <!-- 监测方案标签页 -->
                <div class="tab-content" id="monitoring-tab">
                    <div class="monitoring-section">
                        <h3>气体监测方案设计</h3>
                        <div class="monitoring-wizard">
                            <div class="workplace-setup">
                                <h4>工作场所设置</h4>
                                <div class="form-grid">
                                    <div class="form-group">
                                        <label>工作场所名称</label>
                                        <input type="text" id="workplaceName" placeholder="输入工作场所名称">
                                    </div>
                                    <div class="form-group">
                                        <label>工作场所类型</label>
                                        <select id="workplaceType">
                                            <option value="">请选择</option>
                                            <option value="production">生产车间</option>
                                            <option value="storage">储存区域</option>
                                            <option value="laboratory">实验室</option>
                                            <option value="loading">装卸区</option>
                                            <option value="maintenance">维修区域</option>
                                        </select>
                                    </div>
                                    <div class="form-group">
                                        <label>面积(m²)</label>
                                        <input type="number" id="workplaceArea" placeholder="输入工作场所面积">
                                    </div>
                                    <div class="form-group">
                                        <label>作业人员数量</label>
                                        <input type="number" id="workerCount" placeholder="输入作业人员数量">
                                    </div>
                                </div>
                            </div>

                            <div class="chemical-selection">
                                <h4>需要监测的化学品</h4>
                                <div class="chemical-input">
                                    <input type="text" id="monitoringChemicalInput" placeholder="输入化学品名称">
                                    <button class="btn-add-chemical" onclick="addMonitoringChemical()">
                                        <i class="fas fa-plus"></i> 添加
                                    </button>
                                </div>
                                <div class="selected-chemicals" id="selectedChemicalsList">
                                    <!-- 已选择的化学品列表 -->
                                </div>
                            </div>

                            <div class="monitoring-plan-generation">
                                <button class="btn-generate-plan" onclick="generateMonitoringPlan()">
                                    <i class="fas fa-cog"></i> 生成监测方案
                                </button>
                            </div>

                            <div class="monitoring-plan-results" id="monitoringPlanResults">
                                <!-- 监测方案结果 -->
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        return container;
    }

    /**
     * 初始化数据表格
     */
    initializeOELDatabase() {
        const tbody = document.getElementById('oelDatabaseTableBody');
        if (!tbody) return;

        const tableRows = COMMON_GAS_OEL_DATABASE.map(item => `
            <tr>
                <td>${item.name}</td>
                <td>${item.englishName}</td>
                <td>${item.cas}</td>
                <td>${item.formula || '-'}</td>
                <td>${item.macValue || '-'}</td>
                <td>${item.pcTwaValue || '-'}</td>
                <td>${item.pcStelValue || '-'}</td>
                <td>${item.criticalEffect}</td>
                <td>${item.detectionMethods ? item.detectionMethods.join(', ') : '-'}</td>
            </tr>
        `).join('');

        tbody.innerHTML = tableRows;
    }

    /**
     * 搜索职业接触限值数据
     */
    searchOELData(keyword) {
        if (!keyword) {
            document.getElementById('searchResultsList').innerHTML = '';
            return;
        }

        const results = COMMON_GAS_OEL_DATABASE.filter(item =>
            item.name.includes(keyword) ||
            item.englishName.toLowerCase().includes(keyword.toLowerCase()) ||
            item.cas.includes(keyword)
        );

        this.displaySearchResults(results);
        return results;
    }

    /**
     * 显示搜索结果
     */
    displaySearchResults(results) {
        const container = document.getElementById('searchResultsList');
        if (!container) return;

        if (results.length === 0) {
            container.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-search"></i>
                    <p>未找到相关化学品的职业接触限值数据</p>
                    <p class="suggestion">建议检查化学品名称拼写或尝试使用英文名称、CAS号查询</p>
                </div>
            `;
            return;
        }

        const resultHtml = results.map(item => `
            <div class="search-result-item">
                <div class="chemical-info">
                    <h4>${item.name} <span class="english-name">(${item.englishName})</span></h4>
                    <div class="chemical-details">
                        <span class="cas-number">CAS: ${item.cas}</span>
                        <span class="formula">分子式: ${item.formula || '未知'}</span>
                        <span class="category">类别: ${item.category}</span>
                    </div>
                </div>
                <div class="oel-values">
                    <div class="oel-item">
                        <label>MAC:</label>
                        <span class="value">${item.macValue || '-'} mg/m³</span>
                    </div>
                    <div class="oel-item">
                        <label>PC-TWA:</label>
                        <span class="value">${item.pcTwaValue || '-'} mg/m³</span>
                    </div>
                    <div class="oel-item">
                        <label>PC-STEL:</label>
                        <span class="value">${item.pcStelValue || '-'} mg/m³</span>
                    </div>
                </div>
                <div class="critical-effect">
                    <strong>主要危害：</strong>${item.criticalEffect}
                </div>
                <div class="detection-methods">
                    <strong>检测方法：</strong>${item.detectionMethods ? item.detectionMethods.join(', ') : '未指定'}
                </div>
                <div class="result-actions">
                    <button class="btn-use-for-assessment" onclick="useForAssessment('${item.name}')">
                        用于暴露评估
                    </button>
                    <button class="btn-add-to-monitoring" onclick="addToMonitoring('${item.name}')">
                        添加到监测方案
                    </button>
                </div>
            </div>
        `).join('');

        container.innerHTML = `
            <div class="search-results-header">
                <h4>搜索结果 (${results.length}条)</h4>
            </div>
            ${resultHtml}
        `;
    }

    /**
     * 执行单位换算
     */
    performUnitConversion(ppmValue, mgm3Value, molecularWeight, temperature, pressure) {
        try {
            let result = {};

            if (ppmValue && molecularWeight) {
                // ppm转mg/m³
                result.mgm3 = GasConversionUtils.ppmToMgm3(ppmValue, molecularWeight, temperature, pressure);
                result.direction = 'ppm → mg/m³';
            } else if (mgm3Value && molecularWeight) {
                // mg/m³转ppm
                result.ppm = GasConversionUtils.mgm3ToPpm(mgm3Value, molecularWeight, temperature, pressure);
                result.direction = 'mg/m³ → ppm';
            } else {
                throw new Error('请提供完整的转换参数');
            }

            this.displayConversionResult(result);
            return result;

        } catch (error) {
            this.displayConversionError(error.message);
            return null;
        }
    }

    /**
     * 显示换算结果
     */
    displayConversionResult(result) {
        const container = document.getElementById('conversionResult');
        if (!container) return;

        container.innerHTML = `
            <div class="conversion-result-content">
                <h4>换算结果</h4>
                <div class="result-display">
                    <div class="conversion-direction">${result.direction}</div>
                    ${result.mgm3 ? `<div class="result-value">结果: ${result.mgm3} mg/m³</div>` : ''}
                    ${result.ppm ? `<div class="result-value">结果: ${result.ppm} ppm</div>` : ''}
                </div>
                <div class="result-note">
                    <p>* 换算基于理想气体状态方程，实际应用时请考虑环境条件的影响</p>
                </div>
            </div>
        `;
    }

    /**
     * 执行暴露评估
     */
    performExposureAssessment(chemicalName, concentration, exposureType, unit = 'mg/m³') {
        try {
            // 单位统一转换为mg/m³
            let normalizedConcentration = concentration;
            if (unit === 'μg/m³') {
                normalizedConcentration = concentration / 1000;
            } else if (unit === 'ppm') {
                // 需要分子量进行转换，这里简化处理
                const oelData = OELAssessmentTool.findOEL(chemicalName);
                if (oelData && oelData.conversionFactor) {
                    normalizedConcentration = concentration * oelData.conversionFactor;
                }
            }

            const assessment = OELAssessmentTool.assessExposureRisk(
                chemicalName,
                normalizedConcentration,
                exposureType
            );

            this.displayAssessmentResults(assessment);

            // 保存评估记录
            this.monitoringData.assessments.push({
                timestamp: new Date().toISOString(),
                chemical: chemicalName,
                concentration: normalizedConcentration,
                unit: 'mg/m³',
                exposureType,
                assessment
            });

            return assessment;

        } catch (error) {
            this.displayAssessmentError(error.message);
            return null;
        }
    }

    /**
     * 显示评估结果
     */
    displayAssessmentResults(assessment) {
        const container = document.getElementById('assessmentResults');
        if (!container) return;

        if (assessment.status === 'error') {
            container.innerHTML = `
                <div class="assessment-error">
                    <i class="fas fa-exclamation-triangle"></i>
                    <p>${assessment.message}</p>
                </div>
            `;
            return;
        }

        const riskLevelClass = assessment.riskLevel.replace(/风险|极高/, '').toLowerCase();

        container.innerHTML = `
            <div class="assessment-results-content">
                <div class="assessment-header">
                    <h4>职业暴露风险评估结果</h4>
                    <div class="assessment-time">${new Date().toLocaleString()}</div>
                </div>

                <div class="assessment-summary">
                    <div class="chemical-info-card">
                        <h5>${assessment.chemical}</h5>
                        <div class="exposure-details">
                            <div class="detail-item">
                                <span class="label">检测浓度:</span>
                                <span class="value">${assessment.exposureConcentration} ${assessment.unit}</span>
                            </div>
                            <div class="detail-item">
                                <span class="label">职业接触限值:</span>
                                <span class="value">${assessment.limitValue} ${assessment.unit} (${assessment.exposureType})</span>
                            </div>
                            <div class="detail-item">
                                <span class="label">超标比例:</span>
                                <span class="value">${assessment.riskRatio}</span>
                            </div>
                        </div>
                    </div>

                    <div class="risk-level-card ${riskLevelClass}">
                        <div class="risk-icon">
                            ${this.getRiskLevelIcon(assessment.riskLevel)}
                        </div>
                        <div class="risk-text">
                            <div class="risk-level">${assessment.riskLevel}</div>
                            <div class="risk-ratio">${(assessment.riskRatio * 100).toFixed(1)}% 限值比例</div>
                        </div>
                    </div>
                </div>

                <div class="assessment-details">
                    <div class="health-effects">
                        <h5>健康危害效应</h5>
                        <p>${assessment.criticalEffect}</p>
                    </div>

                    <div class="recommendations">
                        <h5>管理建议</h5>
                        <p>${assessment.recommendation}</p>
                    </div>

                    ${this.generateDetailedRecommendations(assessment)}
                </div>

                <div class="assessment-actions">
                    <button class="btn-save-assessment" onclick="saveAssessmentRecord()">
                        <i class="fas fa-save"></i> 保存评估记录
                    </button>
                    <button class="btn-export-assessment" onclick="exportAssessmentReport()">
                        <i class="fas fa-file-export"></i> 导出评估报告
                    </button>
                    <button class="btn-new-assessment" onclick="newAssessment()">
                        <i class="fas fa-plus"></i> 新建评估
                    </button>
                </div>
            </div>
        `;
    }

    /**
     * 获取风险等级图标
     */
    getRiskLevelIcon(riskLevel) {
        const icons = {
            '低风险': '<i class="fas fa-check-circle"></i>',
            '中等风险': '<i class="fas fa-exclamation-triangle"></i>',
            '高风险': '<i class="fas fa-exclamation-circle"></i>',
            '极高风险': '<i class="fas fa-skull-crossbones"></i>'
        };
        return icons[riskLevel] || '<i class="fas fa-question-circle"></i>';
    }

    /**
     * 生成详细建议
     */
    generateDetailedRecommendations(assessment) {
        let recommendations = '';

        if (assessment.riskLevel === '极高风险') {
            recommendations = `
                <div class="urgent-recommendations">
                    <h5>紧急措施</h5>
                    <ul>
                        <li>立即停止相关作业活动</li>
                        <li>疏散暴露人员到安全区域</li>
                        <li>启动应急通风系统</li>
                        <li>立即进行医疗检查</li>
                        <li>查找并消除泄漏源</li>
                    </ul>
                </div>
            `;
        } else if (assessment.riskLevel === '高风险') {
            recommendations = `
                <div class="priority-recommendations">
                    <h5>优先措施</h5>
                    <ul>
                        <li>加强个人防护设备使用</li>
                        <li>增加通风换气频次</li>
                        <li>缩短作业时间</li>
                        <li>增加监测频次</li>
                        <li>考虑工艺改进或替代</li>
                    </ul>
                </div>
            `;
        } else if (assessment.riskLevel === '中等风险') {
            recommendations = `
                <div class="normal-recommendations">
                    <h5>改进措施</h5>
                    <ul>
                        <li>检查现有防护措施效果</li>
                        <li>加强作业人员培训</li>
                        <li>定期检查设备密封性</li>
                        <li>优化作业程序</li>
                        <li>定期健康监护</li>
                    </ul>
                </div>
            `;
        }

        return recommendations;
    }

    /**
     * 生成监测方案
     */
    generateMonitoringPlan(workplace, chemicals) {
        const plan = OELAssessmentTool.generateMonitoringPlan(chemicals, workplace.type);

        // 扩展监测方案细节
        plan.monitoringPoints = this.calculateMonitoringPoints(workplace, chemicals);
        plan.samplingStrategy = this.generateSamplingStrategy(workplace, chemicals);
        plan.equipmentRecommendations = this.generateEquipmentRecommendations(chemicals);
        plan.qualityControl = this.generateQualityControlPlan();

        this.displayMonitoringPlan(plan);
        return plan;
    }

    /**
     * 计算监测点位
     */
    calculateMonitoringPoints(workplace, chemicals) {
        const points = [];
        const area = workplace.area || 100;
        const workerCount = workplace.workerCount || 1;

        // 基于工作场所面积和人员数量计算监测点数量
        let pointCount = Math.max(2, Math.ceil(area / 50)); // 每50平方米至少1个点
        pointCount = Math.max(pointCount, Math.ceil(workerCount / 5)); // 每5个人至少1个点

        for (let i = 1; i <= pointCount; i++) {
            points.push({
                id: i,
                location: `监测点${i}`,
                type: i === 1 ? '代表性监测点' : '对比监测点',
                description: i === 1 ? '作业人员主要活动区域' : '相对清洁区域或上风向',
                chemicals: chemicals,
                samplingHeight: '呼吸带高度(1.5m)',
                frequency: '每季度至少1次'
            });
        }

        return points;
    }

    /**
     * 生成采样策略
     */
    generateSamplingStrategy(workplace, chemicals) {
        return {
            personalSampling: {
                description: '个体采样',
                duration: '8小时工作班',
                frequency: '每年至少2次',
                method: '佩戴个体采样器'
            },
            areaSampling: {
                description: '定点采样',
                duration: '15分钟短时间采样',
                frequency: '每月至少1次',
                method: '固定监测设备'
            },
            continuousMonitoring: {
                description: '连续监测',
                duration: '24小时连续',
                frequency: '实时监测',
                method: '在线监测系统'
            }
        };
    }

    /**
     * 显示监测方案
     */
    displayMonitoringPlan(plan) {
        const container = document.getElementById('monitoringPlanResults');
        if (!container) return;

        container.innerHTML = `
            <div class="monitoring-plan-content">
                <div class="plan-header">
                    <h4>气体监测方案</h4>
                    <div class="plan-info">
                        <span>生成时间: ${new Date().toLocaleString()}</span>
                    </div>
                </div>

                <div class="plan-summary">
                    <div class="summary-item">
                        <span class="label">监测化学品:</span>
                        <span class="value">${plan.chemicals.length}种</span>
                    </div>
                    <div class="summary-item">
                        <span class="label">监测点位:</span>
                        <span class="value">${plan.monitoringPoints.length}个</span>
                    </div>
                </div>

                <div class="plan-sections">
                    <!-- 监测点位 -->
                    <div class="plan-section">
                        <h5>监测点位布置</h5>
                        <div class="monitoring-points">
                            ${plan.monitoringPoints.map(point => `
                                <div class="monitoring-point">
                                    <div class="point-header">
                                        <span class="point-id">${point.location}</span>
                                        <span class="point-type">${point.type}</span>
                                    </div>
                                    <div class="point-details">
                                        <p><strong>位置描述:</strong> ${point.description}</p>
                                        <p><strong>采样高度:</strong> ${point.samplingHeight}</p>
                                        <p><strong>监测频次:</strong> ${point.frequency}</p>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <!-- 化学品监测要求 -->
                    <div class="plan-section">
                        <h5>化学品监测要求</h5>
                        <div class="chemical-monitoring-table">
                            <table>
                                <thead>
                                    <tr>
                                        <th>化学品名称</th>
                                        <th>PC-TWA限值</th>
                                        <th>PC-STEL限值</th>
                                        <th>报警阈值</th>
                                        <th>推荐检测方法</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${plan.chemicals.map(chemical => `
                                        <tr>
                                            <td>${chemical.name}</td>
                                            <td>${chemical.limits.twa || '-'} mg/m³</td>
                                            <td>${chemical.limits.stel || '-'} mg/m³</td>
                                            <td>
                                                警告: ${chemical.alarmThreshold.warning} mg/m³<br>
                                                危险: ${chemical.alarmThreshold.danger} mg/m³
                                            </td>
                                            <td>${chemical.detectionMethods.join('<br>')}</td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <!-- 采样策略 -->
                    <div class="plan-section">
                        <h5>采样策略</h5>
                        <div class="sampling-strategies">
                            <div class="strategy-item">
                                <h6>个体采样</h6>
                                <p>采样时长: ${plan.samplingStrategy.personalSampling.duration}</p>
                                <p>采样频次: ${plan.samplingStrategy.personalSampling.frequency}</p>
                                <p>采样方法: ${plan.samplingStrategy.personalSampling.method}</p>
                            </div>
                            <div class="strategy-item">
                                <h6>定点采样</h6>
                                <p>采样时长: ${plan.samplingStrategy.areaSampling.duration}</p>
                                <p>采样频次: ${plan.samplingStrategy.areaSampling.frequency}</p>
                                <p>采样方法: ${plan.samplingStrategy.areaSampling.method}</p>
                            </div>
                            <div class="strategy-item">
                                <h6>连续监测</h6>
                                <p>监测时长: ${plan.samplingStrategy.continuousMonitoring.duration}</p>
                                <p>监测频次: ${plan.samplingStrategy.continuousMonitoring.frequency}</p>
                                <p>监测方法: ${plan.samplingStrategy.continuousMonitoring.method}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="plan-actions">
                    <button class="btn-export-plan" onclick="exportMonitoringPlan()">
                        <i class="fas fa-download"></i> 导出方案
                    </button>
                    <button class="btn-print-plan" onclick="printMonitoringPlan()">
                        <i class="fas fa-print"></i> 打印方案
                    </button>
                </div>
            </div>
        `;
    }

    /**
     * 生成设备推荐
     */
    generateEquipmentRecommendations(chemicals) {
        const equipment = [];

        for (const chemical of chemicals) {
            const oelData = OELAssessmentTool.findOEL(chemical);
            if (oelData && oelData.detectionMethods) {
                equipment.push({
                    chemical: chemical,
                    methods: oelData.detectionMethods,
                    recommendedEquipment: this.getRecommendedEquipment(oelData.detectionMethods)
                });
            }
        }

        return equipment;
    }

    /**
     * 获取推荐设备
     */
    getRecommendedEquipment(methods) {
        const equipmentMap = {
            '电化学传感器': '便携式电化学气体检测仪',
            '催化燃烧传感器': '可燃气体检测仪',
            '红外传感器': '红外气体分析仪',
            '光离子化传感器': 'PID检测仪',
            '比色管': '气体检测管',
            '气相色谱法': '气相色谱仪',
            '直读式检测仪': '多气体检测仪'
        };

        return methods.map(method => equipmentMap[method] || method);
    }
}

// 全局函数，供HTML调用
window.oelModule = new OELMonitoringModule();
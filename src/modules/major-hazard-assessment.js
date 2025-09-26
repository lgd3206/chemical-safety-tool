/**
 * 重大危险源评估模块 - 基于GB18218-2018标准
 * 实现完整的重大危险源辨识、分级和报告生成功能
 */

import {
    GB18218_TABLE1_CHEMICALS,
    GB18218_TABLE2_CATEGORIES,
    GB18218_TABLE3_BETA_FACTORS,
    GB18218_TABLE4_CATEGORY_BETA_FACTORS,
    GB18218_TABLE5_ALPHA_FACTORS,
    GB18218_TABLE6_RISK_LEVELS,
    MajorHazardCalculator
} from '../data/gb18218-chemicals.js';

export class MajorHazardAssessmentModule {
    constructor() {
        this.assessmentData = {
            enterprise: {},
            units: [],
            chemicals: [],
            results: {}
        };
    }

    /**
     * 初始化评估向导界面
     */
    initializeAssessmentWizard() {
        const container = document.createElement('div');
        container.className = 'major-hazard-assessment-container';
        container.innerHTML = `
            <div class="assessment-header">
                <h2><i class="fas fa-exclamation-triangle"></i> 重大危险源辨识与分级评估</h2>
                <p class="subtitle">基于GB18218-2018《危险化学品重大危险源辨识》标准</p>
            </div>

            <div class="assessment-wizard">
                <!-- 步骤指示器 -->
                <div class="step-indicator">
                    <div class="step active" data-step="1">
                        <span class="step-number">1</span>
                        <span class="step-title">企业信息</span>
                    </div>
                    <div class="step" data-step="2">
                        <span class="step-number">2</span>
                        <span class="step-title">单元划分</span>
                    </div>
                    <div class="step" data-step="3">
                        <span class="step-number">3</span>
                        <span class="step-title">化学品清单</span>
                    </div>
                    <div class="step" data-step="4">
                        <span class="step-number">4</span>
                        <span class="step-title">评估计算</span>
                    </div>
                    <div class="step" data-step="5">
                        <span class="step-number">5</span>
                        <span class="step-title">评估报告</span>
                    </div>
                </div>

                <!-- 步骤内容 -->
                <div class="step-content">
                    <!-- 步骤1: 企业信息 -->
                    <div class="step-panel active" id="step-1">
                        <h3>企业基本信息</h3>
                        <div class="form-grid">
                            <div class="form-group">
                                <label>企业名称 *</label>
                                <input type="text" id="enterpriseName" placeholder="请输入企业全称">
                            </div>
                            <div class="form-group">
                                <label>统一社会信用代码</label>
                                <input type="text" id="creditCode" placeholder="请输入18位统一社会信用代码">
                            </div>
                            <div class="form-group">
                                <label>企业地址</label>
                                <input type="text" id="address" placeholder="请输入详细地址">
                            </div>
                            <div class="form-group">
                                <label>行业类别</label>
                                <select id="industryType">
                                    <option value="">请选择行业类别</option>
                                    <option value="chemical">化学原料和化学制品制造业</option>
                                    <option value="petroleum">石油加工、炼焦和核燃料加工业</option>
                                    <option value="pharmaceutical">医药制造业</option>
                                    <option value="textile">纺织业</option>
                                    <option value="paper">造纸和纸制品业</option>
                                    <option value="metallurgy">黑色金属冶炼和压延加工业</option>
                                    <option value="nonferrous">有色金属冶炼和压延加工业</option>
                                    <option value="other">其他</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label>评估负责人</label>
                                <input type="text" id="assessor" placeholder="请输入评估负责人姓名">
                            </div>
                            <div class="form-group">
                                <label>评估日期</label>
                                <input type="date" id="assessmentDate" value="${new Date().toISOString().split('T')[0]}">
                            </div>
                        </div>
                    </div>

                    <!-- 步骤2: 单元划分 -->
                    <div class="step-panel" id="step-2">
                        <h3>生产单元和储存单元划分</h3>
                        <div class="unit-management">
                            <div class="unit-type-selector">
                                <button class="unit-type-btn active" data-type="production">
                                    <i class="fas fa-industry"></i> 生产单元
                                </button>
                                <button class="unit-type-btn" data-type="storage">
                                    <i class="fas fa-warehouse"></i> 储存单元
                                </button>
                            </div>

                            <div class="unit-form">
                                <div class="form-row">
                                    <input type="text" id="unitName" placeholder="单元名称">
                                    <input type="text" id="unitLocation" placeholder="位置描述">
                                    <input type="number" id="exposedPersons" placeholder="暴露人员数量" min="0">
                                    <button class="btn-add-unit" onclick="addUnit()">
                                        <i class="fas fa-plus"></i> 添加单元
                                    </button>
                                </div>
                            </div>

                            <div class="units-list" id="unitsList">
                                <!-- 动态生成单元列表 -->
                            </div>
                        </div>
                    </div>

                    <!-- 步骤3: 化学品清单 -->
                    <div class="step-panel" id="step-3">
                        <h3>危险化学品清单录入</h3>
                        <div class="chemical-management">
                            <div class="chemical-search">
                                <div class="search-bar">
                                    <input type="text" id="chemicalSearch" placeholder="搜索化学品名称或CAS号">
                                    <button class="btn-search" onclick="searchChemical()">
                                        <i class="fas fa-search"></i>
                                    </button>
                                </div>
                                <div class="search-results" id="searchResults"></div>
                            </div>

                            <div class="chemical-form">
                                <div class="form-row">
                                    <select id="selectedUnit">
                                        <option value="">选择所属单元</option>
                                    </select>
                                    <input type="text" id="chemicalName" placeholder="化学品名称" readonly>
                                    <input type="text" id="chemicalCas" placeholder="CAS号" readonly>
                                    <input type="number" id="chemicalQuantity" placeholder="实际存在量(t)" step="0.01" min="0">
                                    <button class="btn-add-chemical" onclick="addChemical()">
                                        <i class="fas fa-plus"></i> 添加
                                    </button>
                                </div>
                            </div>

                            <div class="chemicals-list" id="chemicalsList">
                                <!-- 动态生成化学品列表 -->
                            </div>
                        </div>
                    </div>

                    <!-- 步骤4: 评估计算 -->
                    <div class="step-panel" id="step-4">
                        <h3>重大危险源辨识与分级计算</h3>
                        <div class="calculation-section">
                            <div class="calculation-controls">
                                <button class="btn-calculate" onclick="performCalculation()">
                                    <i class="fas fa-calculator"></i> 开始计算
                                </button>
                                <button class="btn-export-data" onclick="exportCalculationData()">
                                    <i class="fas fa-download"></i> 导出数据
                                </button>
                            </div>

                            <div class="calculation-results" id="calculationResults">
                                <!-- 计算结果显示区域 -->
                            </div>
                        </div>
                    </div>

                    <!-- 步骤5: 评估报告 -->
                    <div class="step-panel" id="step-5">
                        <h3>重大危险源评估报告</h3>
                        <div class="report-section">
                            <div class="report-controls">
                                <button class="btn-generate-report" onclick="generateReport()">
                                    <i class="fas fa-file-alt"></i> 生成报告
                                </button>
                                <button class="btn-export-report" onclick="exportReport()">
                                    <i class="fas fa-file-pdf"></i> 导出PDF
                                </button>
                                <button class="btn-print-report" onclick="printReport()">
                                    <i class="fas fa-print"></i> 打印报告
                                </button>
                            </div>

                            <div class="report-content" id="reportContent">
                                <!-- 报告内容显示区域 -->
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 导航按钮 -->
                <div class="wizard-navigation">
                    <button class="btn-prev" onclick="previousStep()" disabled>
                        <i class="fas fa-chevron-left"></i> 上一步
                    </button>
                    <button class="btn-next" onclick="nextStep()">
                        下一步 <i class="fas fa-chevron-right"></i>
                    </button>
                </div>
            </div>
        `;

        return container;
    }

    /**
     * 搜索化学品
     */
    searchChemical(keyword) {
        if (!keyword) return [];

        const results = GB18218_TABLE1_CHEMICALS.filter(chemical =>
            chemical.name.includes(keyword) ||
            chemical.alias.includes(keyword) ||
            chemical.cas.includes(keyword)
        );

        return results;
    }

    /**
     * 添加单元
     */
    addUnit(name, type, location, exposedPersons) {
        const unit = {
            id: Date.now(),
            name,
            type,
            location,
            exposedPersons: parseInt(exposedPersons) || 0,
            chemicals: []
        };

        this.assessmentData.units.push(unit);
        this.updateUnitsDisplay();
        return unit;
    }

    /**
     * 添加化学品
     */
    addChemical(unitId, chemicalData) {
        const unit = this.assessmentData.units.find(u => u.id === unitId);
        if (!unit) return false;

        const chemical = {
            id: Date.now(),
            name: chemicalData.name,
            cas: chemicalData.cas,
            quantity: parseFloat(chemicalData.quantity),
            threshold: chemicalData.threshold,
            unitId: unitId
        };

        unit.chemicals.push(chemical);
        this.assessmentData.chemicals.push(chemical);
        this.updateChemicalsDisplay();
        return chemical;
    }

    /**
     * 执行重大危险源计算
     */
    performCalculation() {
        const results = {
            units: [],
            summary: {}
        };

        // 按单元计算
        for (const unit of this.assessmentData.units) {
            if (unit.chemicals.length === 0) continue;

            // 计算S值（辨识指标）
            const S = MajorHazardCalculator.calculateS(unit.chemicals);

            // 判断是否构成重大危险源
            const isMajorHazard = MajorHazardCalculator.isMajorHazard(S);

            let R = 0, riskLevel = '';
            if (isMajorHazard) {
                // 计算R值（分级指标）
                R = MajorHazardCalculator.calculateR(unit.chemicals, unit.exposedPersons);
                riskLevel = MajorHazardCalculator.getRiskLevel(R);
            }

            const unitResult = {
                unit: unit,
                S: Math.round(S * 1000) / 1000,
                isMajorHazard,
                R: Math.round(R * 1000) / 1000,
                riskLevel,
                chemicals: unit.chemicals.map(chemical => {
                    const referenceData = MajorHazardCalculator.findChemicalData(chemical.name, chemical.cas);
                    return {
                        ...chemical,
                        threshold: referenceData?.threshold || 0,
                        ratio: referenceData?.threshold ?
                            Math.round((chemical.quantity / referenceData.threshold) * 1000) / 1000 : 0
                    };
                })
            };

            results.units.push(unitResult);
        }

        // 汇总结果
        const majorHazardUnits = results.units.filter(u => u.isMajorHazard);
        results.summary = {
            totalUnits: this.assessmentData.units.length,
            majorHazardUnits: majorHazardUnits.length,
            levelCounts: {
                '一级': majorHazardUnits.filter(u => u.riskLevel === '一级').length,
                '二级': majorHazardUnits.filter(u => u.riskLevel === '二级').length,
                '三级': majorHazardUnits.filter(u => u.riskLevel === '三级').length,
                '四级': majorHazardUnits.filter(u => u.riskLevel === '四级').length
            }
        };

        this.assessmentData.results = results;
        this.displayCalculationResults(results);
        return results;
    }

    /**
     * 显示计算结果
     */
    displayCalculationResults(results) {
        const container = document.getElementById('calculationResults');
        if (!container) return;

        container.innerHTML = `
            <div class="results-summary">
                <h4>评估结果汇总</h4>
                <div class="summary-cards">
                    <div class="summary-card">
                        <div class="card-title">总单元数</div>
                        <div class="card-value">${results.summary.totalUnits}</div>
                    </div>
                    <div class="summary-card major-hazard">
                        <div class="card-title">重大危险源</div>
                        <div class="card-value">${results.summary.majorHazardUnits}</div>
                    </div>
                    <div class="summary-card level-1">
                        <div class="card-title">一级危险源</div>
                        <div class="card-value">${results.summary.levelCounts['一级']}</div>
                    </div>
                    <div class="summary-card level-2">
                        <div class="card-title">二级危险源</div>
                        <div class="card-value">${results.summary.levelCounts['二级']}</div>
                    </div>
                </div>
            </div>

            <div class="detailed-results">
                <h4>单元详细评估结果</h4>
                <div class="results-table">
                    <table>
                        <thead>
                            <tr>
                                <th>单元名称</th>
                                <th>单元类型</th>
                                <th>化学品数量</th>
                                <th>S值</th>
                                <th>是否重大危险源</th>
                                <th>R值</th>
                                <th>危险源级别</th>
                                <th>操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${results.units.map(unit => `
                                <tr class="${unit.isMajorHazard ? 'major-hazard-row' : ''}">
                                    <td>${unit.unit.name}</td>
                                    <td>${unit.unit.type === 'production' ? '生产单元' : '储存单元'}</td>
                                    <td>${unit.unit.chemicals.length}</td>
                                    <td>${unit.S}</td>
                                    <td class="${unit.isMajorHazard ? 'yes' : 'no'}">
                                        ${unit.isMajorHazard ? '是' : '否'}
                                    </td>
                                    <td>${unit.R || '-'}</td>
                                    <td class="risk-level-${unit.riskLevel}">
                                        ${unit.riskLevel || '-'}
                                    </td>
                                    <td>
                                        <button class="btn-detail" onclick="showUnitDetail(${unit.unit.id})">
                                            详情
                                        </button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }

    /**
     * 生成评估报告
     */
    generateReport() {
        const enterprise = this.assessmentData.enterprise;
        const results = this.assessmentData.results;

        if (!results || !results.units) {
            alert('请先完成评估计算');
            return;
        }

        const reportContent = `
            <div class="assessment-report">
                <div class="report-header">
                    <h1>危险化学品重大危险源辨识评估报告</h1>
                    <div class="enterprise-info">
                        <p><strong>企业名称：</strong>${enterprise.name || ''}</p>
                        <p><strong>统一社会信用代码：</strong>${enterprise.creditCode || ''}</p>
                        <p><strong>企业地址：</strong>${enterprise.address || ''}</p>
                        <p><strong>评估日期：</strong>${enterprise.assessmentDate || ''}</p>
                        <p><strong>评估负责人：</strong>${enterprise.assessor || ''}</p>
                    </div>
                </div>

                <div class="report-content">
                    <section class="evaluation-basis">
                        <h2>1. 评估依据</h2>
                        <p>本次评估依据《危险化学品重大危险源辨识》（GB18218-2018）标准进行。</p>
                    </section>

                    <section class="evaluation-scope">
                        <h2>2. 评估范围</h2>
                        <p>本次评估涵盖企业内所有涉及危险化学品的生产单元和储存单元，共计${results.summary.totalUnits}个单元。</p>
                    </section>

                    <section class="evaluation-results">
                        <h2>3. 评估结果</h2>
                        <h3>3.1 总体情况</h3>
                        <p>经评估，企业共识别出重大危险源${results.summary.majorHazardUnits}个，其中：</p>
                        <ul>
                            <li>一级重大危险源：${results.summary.levelCounts['一级']}个</li>
                            <li>二级重大危险源：${results.summary.levelCounts['二级']}个</li>
                            <li>三级重大危险源：${results.summary.levelCounts['三级']}个</li>
                            <li>四级重大危险源：${results.summary.levelCounts['四级']}个</li>
                        </ul>

                        <h3>3.2 详细评估结果</h3>
                        ${this.generateDetailedUnitReports(results.units)}
                    </section>

                    <section class="management-recommendations">
                        <h2>4. 管理建议</h2>
                        ${this.generateManagementRecommendations(results)}
                    </section>

                    <section class="appendix">
                        <h2>5. 附录</h2>
                        <h3>5.1 化学品清单</h3>
                        ${this.generateChemicalList()}
                    </section>
                </div>

                <div class="report-footer">
                    <p>报告生成时间：${new Date().toLocaleString()}</p>
                    <p>评估工具：ChemSafe Pro - 化工安全工具平台</p>
                </div>
            </div>
        `;

        const reportContainer = document.getElementById('reportContent');
        if (reportContainer) {
            reportContainer.innerHTML = reportContent;
        }

        return reportContent;
    }

    /**
     * 生成详细单元报告
     */
    generateDetailedUnitReports(units) {
        return units.map(unit => `
            <div class="unit-report">
                <h4>${unit.unit.name}（${unit.unit.type === 'production' ? '生产单元' : '储存单元'}）</h4>
                <table class="unit-detail-table">
                    <tr>
                        <td>单元位置</td>
                        <td>${unit.unit.location}</td>
                    </tr>
                    <tr>
                        <td>暴露人员数量</td>
                        <td>${unit.unit.exposedPersons}人</td>
                    </tr>
                    <tr>
                        <td>危险化学品种类</td>
                        <td>${unit.chemicals.length}种</td>
                    </tr>
                    <tr>
                        <td>辨识指标S值</td>
                        <td>${unit.S}</td>
                    </tr>
                    <tr>
                        <td>是否构成重大危险源</td>
                        <td class="${unit.isMajorHazard ? 'major-hazard' : 'normal'}">${unit.isMajorHazard ? '是' : '否'}</td>
                    </tr>
                    ${unit.isMajorHazard ? `
                    <tr>
                        <td>分级指标R值</td>
                        <td>${unit.R}</td>
                    </tr>
                    <tr>
                        <td>危险源级别</td>
                        <td class="risk-level-${unit.riskLevel}">${unit.riskLevel}</td>
                    </tr>
                    ` : ''}
                </table>

                <h5>化学品明细：</h5>
                <table class="chemical-detail-table">
                    <thead>
                        <tr>
                            <th>化学品名称</th>
                            <th>CAS号</th>
                            <th>实际存在量(t)</th>
                            <th>临界量(t)</th>
                            <th>比值(q/Q)</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${unit.chemicals.map(chemical => `
                            <tr>
                                <td>${chemical.name}</td>
                                <td>${chemical.cas}</td>
                                <td>${chemical.quantity}</td>
                                <td>${chemical.threshold}</td>
                                <td>${chemical.ratio}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `).join('');
    }

    /**
     * 生成管理建议
     */
    generateManagementRecommendations(results) {
        const recommendations = [];

        if (results.summary.majorHazardUnits > 0) {
            recommendations.push(`
                <h4>重大危险源管理要求</h4>
                <ul>
                    <li>应按照《危险化学品重大危险源监督管理暂行规定》要求，建立重大危险源管理制度。</li>
                    <li>应设置安全监测监控系统，对重大危险源进行实时监控。</li>
                    <li>应制定重大危险源事故应急预案，并定期组织演练。</li>
                    <li>应按规定向安全监管部门备案重大危险源相关信息。</li>
                </ul>
            `);

            // 按级别给出具体建议
            const level1Count = results.summary.levelCounts['一级'];
            const level2Count = results.summary.levelCounts['二级'];

            if (level1Count > 0) {
                recommendations.push(`
                    <h4>一级重大危险源管理重点</h4>
                    <ul>
                        <li>应设置紧急停车系统，确保紧急情况下能够快速停车。</li>
                        <li>应配备独立的安全仪表系统(SIS)。</li>
                        <li>应每年至少进行一次安全评价。</li>
                        <li>应建立24小时应急值班制度。</li>
                    </ul>
                `);
            }

            if (level2Count > 0) {
                recommendations.push(`
                    <h4>二级重大危险源管理重点</h4>
                    <ul>
                        <li>应配备温度、压力、液位、流量、组份等信息的不间断采集和监测系统。</li>
                        <li>应每两年至少进行一次安全评价。</li>
                        <li>应配备可燃气体和有毒有害气体泄漏检测报警装置。</li>
                    </ul>
                `);
            }
        } else {
            recommendations.push(`
                <h4>一般安全管理建议</h4>
                <ul>
                    <li>虽未构成重大危险源，但仍应加强危险化学品安全管理。</li>
                    <li>应建立健全安全管理制度和操作规程。</li>
                    <li>应定期开展安全检查和隐患排查治理。</li>
                    <li>应加强员工安全教育培训。</li>
                </ul>
            `);
        }

        return recommendations.join('');
    }

    /**
     * 生成化学品清单
     */
    generateChemicalList() {
        const allChemicals = this.assessmentData.chemicals;

        return `
            <table class="chemical-list-table">
                <thead>
                    <tr>
                        <th>序号</th>
                        <th>化学品名称</th>
                        <th>CAS号</th>
                        <th>所属单元</th>
                        <th>存在量(t)</th>
                        <th>临界量(t)</th>
                    </tr>
                </thead>
                <tbody>
                    ${allChemicals.map((chemical, index) => {
                        const unit = this.assessmentData.units.find(u => u.id === chemical.unitId);
                        return `
                            <tr>
                                <td>${index + 1}</td>
                                <td>${chemical.name}</td>
                                <td>${chemical.cas}</td>
                                <td>${unit ? unit.name : ''}</td>
                                <td>${chemical.quantity}</td>
                                <td>${chemical.threshold}</td>
                            </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>
        `;
    }

    /**
     * 导出评估数据
     */
    exportCalculationData() {
        const data = {
            enterprise: this.assessmentData.enterprise,
            units: this.assessmentData.units,
            chemicals: this.assessmentData.chemicals,
            results: this.assessmentData.results,
            exportTime: new Date().toISOString()
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `重大危险源评估数据_${data.enterprise.name || '未命名'}_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    /**
     * 导出PDF报告
     */
    exportReport() {
        const reportContent = this.generateReport();

        // 这里可以集成PDF生成库，如jsPDF或浏览器打印API
        window.print();
    }
}

// 全局函数，供HTML调用
window.majorHazardModule = new MajorHazardAssessmentModule();
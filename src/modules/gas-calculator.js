/**
 * 气体换算工具模块
 * 提供各种气体浓度单位转换和相关计算功能
 */

export class GasCalculatorModule {
    constructor() {
        this.physicalConstants = {
            R: 8.314,           // 气体常数 J/(mol·K)
            STP_VOLUME: 22.4,   // 标准状况下气体摩尔体积 L/mol
            STANDARD_PRESSURE: 101.325, // 标准大气压 kPa
            STANDARD_TEMPERATURE: 273.15 // 标准温度 K
        };

        this.commonGases = [
            { name: "氨", formula: "NH₃", molecularWeight: 17.03, density: 0.771, cas: "7664-41-7" },
            { name: "氯气", formula: "Cl₂", molecularWeight: 70.91, density: 3.21, cas: "7782-50-5" },
            { name: "硫化氢", formula: "H₂S", molecularWeight: 34.08, density: 1.54, cas: "7783-06-4" },
            { name: "一氧化碳", formula: "CO", molecularWeight: 28.01, density: 1.25, cas: "630-08-0" },
            { name: "二氧化硫", formula: "SO₂", molecularWeight: 64.07, density: 2.93, cas: "7446-09-5" },
            { name: "氮氧化物", formula: "NO₂", molecularWeight: 46.01, density: 2.05, cas: "10102-44-0" },
            { name: "甲烷", formula: "CH₄", molecularWeight: 16.04, density: 0.717, cas: "74-82-8" },
            { name: "丙烷", formula: "C₃H₈", molecularWeight: 44.10, density: 2.02, cas: "74-98-6" },
            { name: "氢气", formula: "H₂", molecularWeight: 2.02, density: 0.090, cas: "1333-74-0" },
            { name: "氧气", formula: "O₂", molecularWeight: 32.00, density: 1.43, cas: "7782-44-7" }
        ];
    }

    /**
     * 初始化气体换算工具界面
     */
    initializeGasCalculatorInterface() {
        const container = document.createElement('div');
        container.className = 'gas-calculator-container';
        container.innerHTML = `
            <div class="gas-calc-header">
                <h2><i class="fas fa-exchange-alt"></i> 气体换算工具</h2>
                <p class="subtitle">可燃有毒气体浓度单位转换与计算</p>
            </div>

            <div class="calc-tabs">
                <div class="tab-buttons">
                    <button class="calc-tab active" data-tab="concentration">
                        <i class="fas fa-flask"></i> 浓度换算
                    </button>
                    <button class="calc-tab" data-tab="volume">
                        <i class="fas fa-cube"></i> 体积计算
                    </button>
                    <button class="calc-tab" data-tab="mixture">
                        <i class="fas fa-layer-group"></i> 混合气体
                    </button>
                    <button class="calc-tab" data-tab="leakage">
                        <i class="fas fa-exclamation-triangle"></i> 泄漏计算
                    </button>
                </div>

                <!-- 浓度换算标签页 -->
                <div class="calc-tab-content active" id="concentration-tab">
                    <div class="concentration-section">
                        <h3>气体浓度单位换算</h3>

                        <div class="gas-selection">
                            <h4>选择气体</h4>
                            <div class="gas-input-row">
                                <select id="gasSelect" onchange="updateGasInfo()">
                                    <option value="">请选择气体</option>
                                    ${this.commonGases.map(gas =>
                                        `<option value="${gas.name}" data-mw="${gas.molecularWeight}" data-formula="${gas.formula}">
                                            ${gas.name} (${gas.formula})
                                        </option>`
                                    ).join('')}
                                    <option value="custom">自定义气体</option>
                                </select>
                                <div class="custom-gas-input" id="customGasInput" style="display: none;">
                                    <input type="number" id="customMW" placeholder="分子量" step="0.01">
                                    <input type="text" id="customName" placeholder="气体名称">
                                </div>
                            </div>
                            <div class="gas-info" id="gasInfo"></div>
                        </div>

                        <div class="environmental-conditions">
                            <h4>环境条件</h4>
                            <div class="condition-inputs">
                                <div class="input-group">
                                    <label>温度</label>
                                    <input type="number" id="temperature" value="20" step="0.1">
                                    <span class="unit">°C</span>
                                </div>
                                <div class="input-group">
                                    <label>压力</label>
                                    <input type="number" id="pressure" value="101.325" step="0.001">
                                    <span class="unit">kPa</span>
                                </div>
                            </div>
                        </div>

                        <div class="conversion-calculator">
                            <h4>浓度转换</h4>
                            <div class="conversion-grid">
                                <div class="conversion-input">
                                    <label>ppm (体积浓度)</label>
                                    <input type="number" id="ppmInput" placeholder="输入ppm值" step="0.001" oninput="convertFromPPM()">
                                </div>
                                <div class="conversion-arrow">
                                    <i class="fas fa-exchange-alt"></i>
                                </div>
                                <div class="conversion-input">
                                    <label>mg/m³ (质量浓度)</label>
                                    <input type="number" id="mgm3Input" placeholder="输入mg/m³值" step="0.001" oninput="convertFromMgM3()">
                                </div>
                            </div>

                            <div class="additional-units">
                                <div class="unit-conversion">
                                    <label>μg/m³</label>
                                    <input type="number" id="ugm3Result" readonly>
                                </div>
                                <div class="unit-conversion">
                                    <label>% vol (体积百分比)</label>
                                    <input type="number" id="volPercentResult" readonly>
                                </div>
                                <div class="unit-conversion">
                                    <label>mol/m³</label>
                                    <input type="number" id="molm3Result" readonly>
                                </div>
                            </div>

                            <div class="conversion-actions">
                                <button class="btn-calculate" onclick="performConversion()">
                                    <i class="fas fa-calculator"></i> 重新计算
                                </button>
                                <button class="btn-clear" onclick="clearConversionInputs()">
                                    <i class="fas fa-eraser"></i> 清空
                                </button>
                            </div>
                        </div>

                        <div class="conversion-formula">
                            <h4>转换公式</h4>
                            <div class="formula-display">
                                <p><strong>ppm → mg/m³:</strong></p>
                                <p>mg/m³ = ppm × M × P / (R × T)</p>
                                <p class="formula-note">其中: M=分子量, P=压力(Pa), R=8.314, T=绝对温度(K)</p>

                                <p><strong>mg/m³ → ppm:</strong></p>
                                <p>ppm = mg/m³ × R × T / (M × P)</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 体积计算标签页 -->
                <div class="calc-tab-content" id="volume-tab">
                    <div class="volume-section">
                        <h3>气体体积计算</h3>

                        <div class="volume-calculator">
                            <div class="calc-type-selector">
                                <h4>计算类型</h4>
                                <div class="calc-type-options">
                                    <label class="calc-option">
                                        <input type="radio" name="volumeCalcType" value="ideal" checked>
                                        <span>理想气体状态方程</span>
                                    </label>
                                    <label class="calc-option">
                                        <input type="radio" name="volumeCalcType" value="stp">
                                        <span>标准状况体积换算</span>
                                    </label>
                                    <label class="calc-option">
                                        <input type="radio" name="volumeCalcType" value="density">
                                        <span>基于密度计算</span>
                                    </label>
                                </div>
                            </div>

                            <div class="volume-inputs" id="idealGasInputs">
                                <h4>理想气体方程 (PV = nRT)</h4>
                                <div class="input-grid">
                                    <div class="input-group">
                                        <label>压力 (P)</label>
                                        <input type="number" id="volPressure" placeholder="压力值" step="0.01">
                                        <select id="pressureUnit">
                                            <option value="kPa">kPa</option>
                                            <option value="atm">atm</option>
                                            <option value="bar">bar</option>
                                            <option value="Pa">Pa</option>
                                        </select>
                                    </div>
                                    <div class="input-group">
                                        <label>体积 (V)</label>
                                        <input type="number" id="volVolume" placeholder="体积值" step="0.01">
                                        <select id="volumeUnit">
                                            <option value="L">L</option>
                                            <option value="m³">m³</option>
                                            <option value="mL">mL</option>
                                        </select>
                                    </div>
                                    <div class="input-group">
                                        <label>物质的量 (n)</label>
                                        <input type="number" id="volMoles" placeholder="摩尔数" step="0.001">
                                        <span class="unit">mol</span>
                                    </div>
                                    <div class="input-group">
                                        <label>温度 (T)</label>
                                        <input type="number" id="volTemperature" placeholder="温度值" step="0.1">
                                        <select id="temperatureUnit">
                                            <option value="°C">°C</option>
                                            <option value="K">K</option>
                                            <option value="°F">°F</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="volume-calc-actions">
                                    <button class="btn-calculate" onclick="calculateIdealGas()">
                                        <i class="fas fa-calculator"></i> 计算未知量
                                    </button>
                                </div>
                            </div>

                            <div class="volume-results" id="volumeResults">
                                <!-- 计算结果显示区域 -->
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 混合气体标签页 -->
                <div class="calc-tab-content" id="mixture-tab">
                    <div class="mixture-section">
                        <h3>混合气体计算</h3>

                        <div class="mixture-calculator">
                            <div class="gas-mixture-list">
                                <h4>气体组分</h4>
                                <div class="mixture-components" id="mixtureComponents">
                                    <!-- 动态添加的气体组分 -->
                                </div>
                                <button class="btn-add-component" onclick="addGasComponent()">
                                    <i class="fas fa-plus"></i> 添加气体组分
                                </button>
                            </div>

                            <div class="mixture-calculations">
                                <h4>混合计算</h4>
                                <div class="mixture-calc-options">
                                    <label class="calc-option">
                                        <input type="radio" name="mixtureCalcType" value="partial" checked>
                                        <span>分压计算</span>
                                    </label>
                                    <label class="calc-option">
                                        <input type="radio" name="mixtureCalcType" value="average">
                                        <span>平均分子量</span>
                                    </label>
                                    <label class="calc-option">
                                        <input type="radio" name="mixtureCalcType" value="dilution">
                                        <span>稀释计算</span>
                                    </label>
                                </div>

                                <div class="mixture-results" id="mixtureResults">
                                    <!-- 混合气体计算结果 -->
                                </div>

                                <div class="mixture-actions">
                                    <button class="btn-calculate" onclick="calculateMixture()">
                                        <i class="fas fa-calculator"></i> 计算混合参数
                                    </button>
                                    <button class="btn-clear" onclick="clearMixtureComponents()">
                                        <i class="fas fa-trash"></i> 清空组分
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 泄漏计算标签页 -->
                <div class="calc-tab-content" id="leakage-tab">
                    <div class="leakage-section">
                        <h3>气体泄漏扩散计算</h3>

                        <div class="leakage-calculator">
                            <div class="leakage-scenario">
                                <h4>泄漏场景设置</h4>
                                <div class="scenario-inputs">
                                    <div class="input-group">
                                        <label>泄漏气体</label>
                                        <select id="leakageGas">
                                            ${this.commonGases.map(gas =>
                                                `<option value="${gas.name}" data-density="${gas.density}">
                                                    ${gas.name} (${gas.formula})
                                                </option>`
                                            ).join('')}
                                        </select>
                                    </div>
                                    <div class="input-group">
                                        <label>泄漏速率</label>
                                        <input type="number" id="leakageRate" placeholder="泄漏速率" step="0.01">
                                        <select id="leakageRateUnit">
                                            <option value="kg/s">kg/s</option>
                                            <option value="kg/h">kg/h</option>
                                            <option value="L/min">L/min</option>
                                        </select>
                                    </div>
                                    <div class="input-group">
                                        <label>风速</label>
                                        <input type="number" id="windSpeed" value="2" step="0.1">
                                        <span class="unit">m/s</span>
                                    </div>
                                    <div class="input-group">
                                        <label>大气稳定度</label>
                                        <select id="atmosphericStability">
                                            <option value="A">A - 极不稳定</option>
                                            <option value="B">B - 不稳定</option>
                                            <option value="C">C - 弱不稳定</option>
                                            <option value="D" selected>D - 中性</option>
                                            <option value="E">E - 弱稳定</option>
                                            <option value="F">F - 稳定</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div class="dispersion-calculation">
                                <h4>扩散距离计算</h4>
                                <div class="distance-inputs">
                                    <div class="input-group">
                                        <label>下风向距离</label>
                                        <input type="number" id="downwindDistance" value="100" step="1">
                                        <span class="unit">m</span>
                                    </div>
                                    <div class="input-group">
                                        <label>目标浓度限值</label>
                                        <input type="number" id="targetConcentration" placeholder="浓度限值" step="0.01">
                                        <span class="unit">ppm</span>
                                    </div>
                                </div>

                                <div class="leakage-actions">
                                    <button class="btn-calculate" onclick="calculateDispersion()">
                                        <i class="fas fa-calculator"></i> 计算扩散
                                    </button>
                                    <button class="btn-plot" onclick="plotDispersionCurve()">
                                        <i class="fas fa-chart-line"></i> 绘制扩散曲线
                                    </button>
                                </div>
                            </div>

                            <div class="leakage-results" id="leakageResults">
                                <!-- 泄漏扩散计算结果 -->
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 计算历史记录 -->
            <div class="calculation-history">
                <h3><i class="fas fa-history"></i> 计算历史</h3>
                <div class="history-list" id="calculationHistory">
                    <!-- 动态加载计算历史 -->
                </div>
                <div class="history-actions">
                    <button class="btn-export-history" onclick="exportCalculationHistory()">
                        <i class="fas fa-download"></i> 导出历史
                    </button>
                    <button class="btn-clear-history" onclick="clearCalculationHistory()">
                        <i class="fas fa-trash"></i> 清空历史
                    </button>
                </div>
            </div>
        `;

        return container;
    }

    /**
     * ppm转mg/m³
     */
    ppmToMgm3(ppm, molecularWeight, temperatureC = 20, pressureKPa = 101.325) {
        const tempK = temperatureC + 273.15;
        const pressurePa = pressureKPa * 1000;

        // 使用理想气体状态方程: PV = nRT
        // mg/m³ = ppm × M × P / (R × T) × 10^-3
        const mgm3 = ppm * molecularWeight * pressurePa / (this.physicalConstants.R * tempK) / 1000;

        return Number(mgm3.toFixed(3));
    }

    /**
     * mg/m³转ppm
     */
    mgm3ToPpm(mgm3, molecularWeight, temperatureC = 20, pressureKPa = 101.325) {
        const tempK = temperatureC + 273.15;
        const pressurePa = pressureKPa * 1000;

        // ppm = mg/m³ × R × T / (M × P) × 10^3
        const ppm = mgm3 * this.physicalConstants.R * tempK / (molecularWeight * pressurePa) * 1000;

        return Number(ppm.toFixed(3));
    }

    /**
     * 计算理想气体状态参数
     */
    calculateIdealGasParameter(known, unknown) {
        const R = this.physicalConstants.R;

        switch (unknown) {
            case 'P':
                return known.n * R * known.T / known.V;
            case 'V':
                return known.n * R * known.T / known.P;
            case 'n':
                return known.P * known.V / (R * known.T);
            case 'T':
                return known.P * known.V / (known.n * R);
            default:
                throw new Error('未知参数类型');
        }
    }

    /**
     * 计算混合气体平均分子量
     */
    calculateAverageMolecularWeight(components) {
        let totalMoles = 0;
        let weightedSum = 0;

        components.forEach(component => {
            totalMoles += component.moles;
            weightedSum += component.moles * component.molecularWeight;
        });

        return weightedSum / totalMoles;
    }

    /**
     * 计算分压
     */
    calculatePartialPressure(componentMoles, totalMoles, totalPressure) {
        const moleFraction = componentMoles / totalMoles;
        return moleFraction * totalPressure;
    }

    /**
     * 高斯扩散模型计算
     */
    calculateGaussianDispersion(Q, u, x, y, z, stabilityClass) {
        // 扩散参数 (Pasquill-Gifford)
        const dispersyParams = {
            'A': { a: 0.527, b: 0.865, c: 0.28, d: 0.9 },
            'B': { a: 0.371, b: 0.866, c: 0.23, d: 0.85 },
            'C': { a: 0.209, b: 0.897, c: 0.22, d: 0.8 },
            'D': { a: 0.128, b: 0.905, c: 0.2, d: 0.76 },
            'E': { a: 0.098, b: 0.902, c: 0.15, d: 0.73 },
            'F': { a: 0.065, b: 0.902, c: 0.12, d: 0.67 }
        };

        const params = dispersyParams[stabilityClass] || dispersyParams['D'];

        // 扩散系数
        const sigmaY = params.a * Math.pow(x, params.b);
        const sigmaZ = params.c * Math.pow(x, params.d);

        // 高斯扩散公式
        const concentration = (Q / (2 * Math.PI * u * sigmaY * sigmaZ)) *
            Math.exp(-0.5 * Math.pow(y / sigmaY, 2)) *
            Math.exp(-0.5 * Math.pow(z / sigmaZ, 2));

        return concentration;
    }

    /**
     * 保存计算历史
     */
    saveCalculationHistory(calculationType, inputs, results) {
        const history = JSON.parse(localStorage.getItem('gas_calc_history') || '[]');

        const record = {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            type: calculationType,
            inputs: inputs,
            results: results
        };

        history.unshift(record);

        // 限制历史记录数量
        if (history.length > 50) {
            history.splice(50);
        }

        localStorage.setItem('gas_calc_history', JSON.stringify(history));
        this.updateHistoryDisplay();
    }

    /**
     * 更新历史记录显示
     */
    updateHistoryDisplay() {
        const historyContainer = document.getElementById('calculationHistory');
        if (!historyContainer) return;

        const history = JSON.parse(localStorage.getItem('gas_calc_history') || '[]');

        if (history.length === 0) {
            historyContainer.innerHTML = '<p class="empty-history">暂无计算历史记录</p>';
            return;
        }

        const historyHtml = history.slice(0, 10).map(record => `
            <div class="history-item">
                <div class="history-header">
                    <span class="history-type">${this.getCalculationTypeName(record.type)}</span>
                    <span class="history-time">${new Date(record.timestamp).toLocaleString()}</span>
                </div>
                <div class="history-summary">
                    ${this.formatHistorySummary(record)}
                </div>
                <div class="history-actions">
                    <button class="btn-reuse" onclick="reuseCalculation('${record.id}')">
                        <i class="fas fa-redo"></i> 重用
                    </button>
                </div>
            </div>
        `).join('');

        historyContainer.innerHTML = historyHtml;
    }

    /**
     * 获取计算类型名称
     */
    getCalculationTypeName(type) {
        const names = {
            'concentration': '浓度换算',
            'volume': '体积计算',
            'mixture': '混合气体',
            'leakage': '泄漏扩散'
        };
        return names[type] || type;
    }

    /**
     * 格式化历史记录摘要
     */
    formatHistorySummary(record) {
        switch (record.type) {
            case 'concentration':
                return `${record.inputs.gasName}: ${record.inputs.inputValue} → ${record.results.outputValue}`;
            case 'volume':
                return `理想气体计算: P=${record.inputs.pressure}, V=${record.results.volume}`;
            case 'mixture':
                return `混合气体: ${record.inputs.components.length}种组分`;
            case 'leakage':
                return `泄漏扩散: ${record.inputs.gas}, 距离${record.inputs.distance}m`;
            default:
                return '计算记录';
        }
    }

    /**
     * 切换标签页
     */
    switchTab(tabId) {
        // 移除所有活动状态
        document.querySelectorAll('.calc-tab').forEach(tab => tab.classList.remove('active'));
        document.querySelectorAll('.calc-tab-content').forEach(content => content.classList.remove('active'));

        // 激活选中的标签页
        document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');
        document.getElementById(`${tabId}-tab`).classList.add('active');
    }
}

// 全局函数，供HTML调用
window.gasCalcModule = new GasCalculatorModule();

// 供HTML调用的全局函数
window.updateGasInfo = () => {
    const gasSelect = document.getElementById('gasSelect');
    const gasInfo = document.getElementById('gasInfo');
    const customInput = document.getElementById('customGasInput');

    if (gasSelect.value === 'custom') {
        customInput.style.display = 'flex';
        gasInfo.innerHTML = '';
    } else if (gasSelect.value) {
        customInput.style.display = 'none';
        const selectedOption = gasSelect.selectedOptions[0];
        const mw = selectedOption.dataset.mw;
        const formula = selectedOption.dataset.formula;

        gasInfo.innerHTML = `
            <div class="gas-details">
                <span>分子式: ${formula}</span>
                <span>分子量: ${mw} g/mol</span>
            </div>
        `;
    } else {
        customInput.style.display = 'none';
        gasInfo.innerHTML = '';
    }
};

window.convertFromPPM = () => {
    const ppmInput = document.getElementById('ppmInput');
    const mgm3Input = document.getElementById('mgm3Input');
    const gasSelect = document.getElementById('gasSelect');
    const temperature = parseFloat(document.getElementById('temperature').value) || 20;
    const pressure = parseFloat(document.getElementById('pressure').value) || 101.325;

    if (!ppmInput.value || !gasSelect.value) return;

    let molecularWeight;
    if (gasSelect.value === 'custom') {
        molecularWeight = parseFloat(document.getElementById('customMW').value);
    } else {
        molecularWeight = parseFloat(gasSelect.selectedOptions[0].dataset.mw);
    }

    if (!molecularWeight) return;

    const ppm = parseFloat(ppmInput.value);
    const mgm3 = window.gasCalcModule.ppmToMgm3(ppm, molecularWeight, temperature, pressure);

    mgm3Input.value = mgm3;

    // 更新其他单位
    document.getElementById('ugm3Result').value = (mgm3 * 1000).toFixed(1);
    document.getElementById('volPercentResult').value = (ppm / 10000).toFixed(6);
    document.getElementById('molm3Result').value = (mgm3 / molecularWeight).toFixed(6);
};

window.convertFromMgM3 = () => {
    const ppmInput = document.getElementById('ppmInput');
    const mgm3Input = document.getElementById('mgm3Input');
    const gasSelect = document.getElementById('gasSelect');
    const temperature = parseFloat(document.getElementById('temperature').value) || 20;
    const pressure = parseFloat(document.getElementById('pressure').value) || 101.325;

    if (!mgm3Input.value || !gasSelect.value) return;

    let molecularWeight;
    if (gasSelect.value === 'custom') {
        molecularWeight = parseFloat(document.getElementById('customMW').value);
    } else {
        molecularWeight = parseFloat(gasSelect.selectedOptions[0].dataset.mw);
    }

    if (!molecularWeight) return;

    const mgm3 = parseFloat(mgm3Input.value);
    const ppm = window.gasCalcModule.mgm3ToPpm(mgm3, molecularWeight, temperature, pressure);

    ppmInput.value = ppm;

    // 更新其他单位
    document.getElementById('ugm3Result').value = (mgm3 * 1000).toFixed(1);
    document.getElementById('volPercentResult').value = (ppm / 10000).toFixed(6);
    document.getElementById('molm3Result').value = (mgm3 / molecularWeight).toFixed(6);
};

window.performConversion = () => {
    const ppmInput = document.getElementById('ppmInput');
    if (ppmInput.value) {
        window.convertFromPPM();
    } else {
        window.convertFromMgM3();
    }
};

window.clearConversionInputs = () => {
    document.getElementById('ppmInput').value = '';
    document.getElementById('mgm3Input').value = '';
    document.getElementById('ugm3Result').value = '';
    document.getElementById('volPercentResult').value = '';
    document.getElementById('molm3Result').value = '';
};

// 标签页切换事件
document.addEventListener('click', (e) => {
    if (e.target.matches('.calc-tab') || e.target.closest('.calc-tab')) {
        const tab = e.target.matches('.calc-tab') ? e.target : e.target.closest('.calc-tab');
        const tabId = tab.dataset.tab;
        if (tabId) {
            window.gasCalcModule.switchTab(tabId);
        }
    }
});
// GBZ 2.1-2019 工作场所有害因素职业接触限值数据
// 基于最新修改单更新

/**
 * 职业接触限值数据 (包含最新修改单内容)
 * 数据来源：GBZ 2.1-2019 及第1号修改单
 */
export const GBZ21_2019_OEL_DATA = [
    // 重要更新：苯的最新限值 (修改单序号12)
    {
        id: 12,
        chineseName: "苯",
        englishName: "Benzene",
        cas: "71-43-2",
        mac: null,  // 无最高容许浓度
        pcTwa: 3,   // PC-TWA: 3 mg/m³
        pcStel: 6,  // PC-STEL: 6 mg/m³
        criticalEffect: "神经系统损害；血液毒性",
        remarks: "皮，G1",
        unit: "mg/m³"
    },

    // 新增：三甲基氯化锡 (修改单序号29)
    {
        id: 29,
        chineseName: "三甲基氯化锡",
        englishName: "Trimethyltin chloride",
        abbreviation: "TMT",
        cas: null,
        bioMonitoringIndicators: [
            {
                indicator: "尿中三甲基氯化锡",
                englishIndicator: "Trimethyltin chloride in urine",
                biologicalLimit: "500 µg/g Cr",
                samplingTime: "不做严格限定"
            },
            {
                indicator: "血中三甲基氯化锡",
                englishIndicator: "Trimethyltin chloride in blood",
                biologicalLimit: "200 µg/L",
                samplingTime: "不做严格限定"
            }
        ]
    }
];

/**
 * 常见有毒有害气体职业接触限值数据库
 * 扩展常用化学品的职业接触限值
 */
export const COMMON_GAS_OEL_DATABASE = [
    // 常见有毒气体
    {
        name: "氨",
        englishName: "Ammonia",
        cas: "7664-41-7",
        formula: "NH₃",
        macValue: null,
        pcTwaValue: 20,
        pcStelValue: 30,
        unit: "mg/m³",
        conversionFactor: 1.34, // ppm to mg/m³ 转换系数 (在20℃, 101.3kPa)
        criticalEffect: "呼吸道刺激",
        detectionMethods: ["直读式检测仪", "比色管", "离子色谱法"],
        category: "刺激性气体"
    },

    {
        name: "氯气",
        englishName: "Chlorine",
        cas: "7782-50-5",
        formula: "Cl₂",
        macValue: null,
        pcTwaValue: 1,
        pcStelValue: 3,
        unit: "mg/m³",
        conversionFactor: 2.9,
        criticalEffect: "呼吸道刺激",
        detectionMethods: ["电化学传感器", "碘量法", "DPD比色法"],
        category: "刺激性气体"
    },

    {
        name: "硫化氢",
        englishName: "Hydrogen sulfide",
        cas: "7783-06-4",
        formula: "H₂S",
        macValue: null,
        pcTwaValue: 10,
        pcStelValue: 15,
        unit: "mg/m³",
        conversionFactor: 1.4,
        criticalEffect: "神经系统毒性",
        detectionMethods: ["电化学传感器", "醋酸铅试纸", "气相色谱法"],
        category: "窒息性气体"
    },

    {
        name: "一氧化碳",
        englishName: "Carbon monoxide",
        cas: "630-08-0",
        formula: "CO",
        macValue: 30,
        pcTwaValue: 20,
        pcStelValue: null,
        unit: "mg/m³",
        conversionFactor: 1.165,
        criticalEffect: "血液毒性；窒息",
        detectionMethods: ["电化学传感器", "红外光谱法", "气相色谱法"],
        category: "窒息性气体"
    },

    {
        name: "二氧化硫",
        englishName: "Sulfur dioxide",
        cas: "7446-09-5",
        formula: "SO₂",
        macValue: null,
        pcTwaValue: 15,
        pcStelValue: null,
        unit: "mg/m³",
        conversionFactor: 2.62,
        criticalEffect: "呼吸道刺激",
        detectionMethods: ["电化学传感器", "甲醛缓冲液吸收法", "紫外荧光法"],
        category: "刺激性气体"
    },

    // 可燃气体
    {
        name: "甲烷",
        englishName: "Methane",
        cas: "74-82-8",
        formula: "CH₄",
        lel: 5.0, // 爆炸下限 %
        uel: 15.0, // 爆炸上限 %
        unit: "%",
        conversionFactor: null,
        criticalEffect: "窒息；火灾爆炸",
        detectionMethods: ["催化燃烧传感器", "红外传感器", "气相色谱法"],
        category: "可燃气体"
    },

    {
        name: "氢气",
        englishName: "Hydrogen",
        cas: "1333-74-0",
        formula: "H₂",
        lel: 4.0,
        uel: 75.0,
        unit: "%",
        conversionFactor: null,
        criticalEffect: "火灾爆炸；窒息",
        detectionMethods: ["催化燃烧传感器", "热导传感器", "气相色谱法"],
        category: "可燃气体"
    },

    {
        name: "丙烷",
        englishName: "Propane",
        cas: "74-98-6",
        formula: "C₃H₈",
        lel: 2.1,
        uel: 9.5,
        unit: "%",
        pcTwaValue: 1800, // mg/m³
        criticalEffect: "麻醉作用；火灾爆炸",
        detectionMethods: ["催化燃烧传感器", "红外传感器"],
        category: "可燃气体"
    }
];

/**
 * 气体单位换算工具类
 */
export class GasConversionUtils {
    /**
     * ppm转换为mg/m³
     * @param {number} ppmValue - ppm浓度值
     * @param {number} molecularWeight - 分子量
     * @param {number} temperature - 温度(℃)，默认20℃
     * @param {number} pressure - 压力(kPa)，默认101.3kPa
     * @returns {number} mg/m³浓度值
     */
    static ppmToMgm3(ppmValue, molecularWeight, temperature = 20, pressure = 101.3) {
        // 使用理想气体状态方程：mg/m³ = ppm × (M × P) / (R × T)
        // 其中：M-分子量，P-压力(kPa)，R-气体常数(8.314)，T-绝对温度(K)
        const absoluteTemp = temperature + 273.15;
        const mgm3Value = (ppmValue * molecularWeight * pressure) / (8.314 * absoluteTemp);
        return Math.round(mgm3Value * 100) / 100; // 保留2位小数
    }

    /**
     * mg/m³转换为ppm
     * @param {number} mgm3Value - mg/m³浓度值
     * @param {number} molecularWeight - 分子量
     * @param {number} temperature - 温度(℃)
     * @param {number} pressure - 压力(kPa)
     * @returns {number} ppm浓度值
     */
    static mgm3ToPpm(mgm3Value, molecularWeight, temperature = 20, pressure = 101.3) {
        const absoluteTemp = temperature + 273.15;
        const ppmValue = (mgm3Value * 8.314 * absoluteTemp) / (molecularWeight * pressure);
        return Math.round(ppmValue * 100) / 100;
    }

    /**
     * 温度压力修正
     * @param {number} standardValue - 标准条件下的浓度值
     * @param {number} actualTemp - 实际温度(℃)
     * @param {number} actualPressure - 实际压力(kPa)
     * @param {number} standardTemp - 标准温度(℃)，默认20℃
     * @param {number} standardPressure - 标准压力(kPa)，默认101.3kPa
     * @returns {number} 修正后的浓度值
     */
    static temperaturePressureCorrection(
        standardValue,
        actualTemp,
        actualPressure,
        standardTemp = 20,
        standardPressure = 101.3
    ) {
        const standardTempK = standardTemp + 273.15;
        const actualTempK = actualTemp + 273.15;

        const correctedValue = standardValue *
            (standardPressure / actualPressure) *
            (actualTempK / standardTempK);

        return Math.round(correctedValue * 100) / 100;
    }

    /**
     * 计算混合气体的总浓度
     * @param {Array} gases - 气体数组 [{name, concentration, unit}]
     * @returns {Object} 总浓度信息
     */
    static calculateMixedGasConcentration(gases) {
        const results = {
            totalPpm: 0,
            totalMgm3: 0,
            components: []
        };

        for (const gas of gases) {
            const gasData = COMMON_GAS_OEL_DATABASE.find(item =>
                item.name === gas.name || item.englishName === gas.name
            );

            if (gasData) {
                let ppmValue, mgm3Value;

                if (gas.unit === 'ppm') {
                    ppmValue = gas.concentration;
                    mgm3Value = gasData.conversionFactor ?
                        ppmValue * gasData.conversionFactor : null;
                } else if (gas.unit === 'mg/m³') {
                    mgm3Value = gas.concentration;
                    ppmValue = gasData.conversionFactor ?
                        mgm3Value / gasData.conversionFactor : null;
                }

                results.components.push({
                    name: gas.name,
                    ppm: ppmValue,
                    mgm3: mgm3Value
                });

                if (ppmValue) results.totalPpm += ppmValue;
                if (mgm3Value) results.totalMgm3 += mgm3Value;
            }
        }

        return results;
    }
}

/**
 * 职业接触限值查询和评估工具类
 */
export class OELAssessmentTool {
    /**
     * 查询化学品的职业接触限值
     * @param {string} nameOrCas - 化学品名称或CAS号
     * @returns {Object|null} 限值信息
     */
    static findOEL(nameOrCas) {
        // 先查询GBZ 2.1-2019数据
        let result = GBZ21_2019_OEL_DATA.find(item =>
            item.chineseName === nameOrCas ||
            item.englishName === nameOrCas ||
            item.cas === nameOrCas
        );

        if (result) return result;

        // 再查询扩展数据库
        result = COMMON_GAS_OEL_DATABASE.find(item =>
            item.name === nameOrCas ||
            item.englishName === nameOrCas ||
            item.cas === nameOrCas
        );

        return result;
    }

    /**
     * 评估职业接触风险
     * @param {string} chemicalName - 化学品名称
     * @param {number} exposureConcentration - 暴露浓度
     * @param {string} exposureType - 暴露类型 ('TWA', 'STEL', 'MAC')
     * @returns {Object} 风险评估结果
     */
    static assessExposureRisk(chemicalName, exposureConcentration, exposureType = 'TWA') {
        const oelData = this.findOEL(chemicalName);

        if (!oelData) {
            return {
                status: 'error',
                message: '未找到该化学品的职业接触限值数据'
            };
        }

        let limitValue;
        switch (exposureType.toUpperCase()) {
            case 'TWA':
                limitValue = oelData.pcTwaValue || oelData.pcTwa;
                break;
            case 'STEL':
                limitValue = oelData.pcStelValue || oelData.pcStel;
                break;
            case 'MAC':
                limitValue = oelData.macValue || oelData.mac;
                break;
            default:
                limitValue = oelData.pcTwaValue || oelData.pcTwa;
        }

        if (!limitValue) {
            return {
                status: 'warning',
                message: `该化学品没有${exposureType}限值数据`
            };
        }

        const riskRatio = exposureConcentration / limitValue;
        let riskLevel, recommendation;

        if (riskRatio <= 0.5) {
            riskLevel = '低风险';
            recommendation = '当前暴露浓度在安全范围内，建议继续监测。';
        } else if (riskRatio <= 0.8) {
            riskLevel = '中等风险';
            recommendation = '暴露浓度偏高，建议加强防护措施和监测频次。';
        } else if (riskRatio <= 1.0) {
            riskLevel = '高风险';
            recommendation = '暴露浓度接近限值，需要立即采取控制措施。';
        } else {
            riskLevel = '极高风险';
            recommendation = '暴露浓度超过职业接触限值，必须立即停止作业并采取应急措施。';
        }

        return {
            status: 'success',
            chemical: chemicalName,
            exposureConcentration,
            limitValue,
            exposureType,
            riskRatio: Math.round(riskRatio * 100) / 100,
            riskLevel,
            recommendation,
            criticalEffect: oelData.criticalEffect,
            unit: oelData.unit || 'mg/m³'
        };
    }

    /**
     * 生成气体监测方案建议
     * @param {Array} chemicals - 化学品列表
     * @param {string} workplaceType - 工作场所类型
     * @returns {Object} 监测方案
     */
    static generateMonitoringPlan(chemicals, workplaceType) {
        const plan = {
            chemicals: [],
            monitoringFrequency: {},
            detectionMethods: {},
            alarmSettings: {},
            recommendations: []
        };

        for (const chemical of chemicals) {
            const oelData = this.findOEL(chemical);
            if (oelData) {
                plan.chemicals.push({
                    name: chemical,
                    limits: {
                        twa: oelData.pcTwaValue || oelData.pcTwa,
                        stel: oelData.pcStelValue || oelData.pcStel,
                        mac: oelData.macValue || oelData.mac
                    },
                    detectionMethods: oelData.detectionMethods || ['通用方法'],
                    alarmThreshold: {
                        warning: (oelData.pcTwaValue || oelData.pcTwa) * 0.5,
                        danger: (oelData.pcTwaValue || oelData.pcTwa) * 0.8
                    }
                });
            }
        }

        return plan;
    }
}
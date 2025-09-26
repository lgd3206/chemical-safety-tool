// 重大危险源评估系统
export class MajorHazardAssessment {
    constructor() {
        this.criticalQuantities = this.initializeCriticalQuantities();
        this.assessmentLevels = this.initializeAssessmentLevels();
        this.regulatoryStandards = this.initializeRegulatoryStandards();
        this.correctionFactors = this.initializeCorrectionFactors();
    }

    // 初始化临界量数据（基于GB18218-2018表1和表2）
    initializeCriticalQuantities() {
        return {
            // 表1 - 危险化学品名称及其临界量
            '7664-41-7': { name: '氨', criticalQuantity: 10, unit: 't', category: '毒性气体', hazardClass: 'toxicGas' },
            '7783-41-7': { name: '二氧化氮', criticalQuantity: 1, unit: 't', category: '毒性气体', hazardClass: 'toxicGas' },
            '10102-44-0': { name: '二氧化氮', criticalQuantity: 1, unit: 't', category: '毒性气体', hazardClass: 'toxicGas' },
            '7446-09-5': { name: '二氧化硫', criticalQuantity: 20, unit: 't', category: '毒性气体', hazardClass: 'toxicGas' },
            '7782-41-4': { name: '氟', criticalQuantity: 1, unit: 't', category: '毒性气体', hazardClass: 'toxicGas' },
            '75-44-5': { name: '碳酰氯', criticalQuantity: 0.3, unit: 't', category: '毒性气体', hazardClass: 'toxicGas' },
            '75-21-8': { name: '环氧乙烷', criticalQuantity: 10, unit: 't', category: '毒性气体', hazardClass: 'toxicGas' },
            '50-00-0': { name: '甲醛(含量>90%)', criticalQuantity: 5, unit: 't', category: '毒性液体', hazardClass: 'toxicLiquid' },
            '7803-51-2': { name: '磷化氢', criticalQuantity: 1, unit: 't', category: '毒性气体', hazardClass: 'toxicGas' },
            '7783-06-4': { name: '硫化氢', criticalQuantity: 5, unit: 't', category: '毒性气体', hazardClass: 'toxicGas' },
            '7647-01-0': { name: '氯化氢(无水)', criticalQuantity: 20, unit: 't', category: '毒性气体', hazardClass: 'toxicGas' },
            '7782-50-5': { name: '氯', criticalQuantity: 5, unit: 't', category: '毒性气体', hazardClass: 'toxicGas' },
            // 煤气类
            '7784-42-1': { name: '胂化氢', criticalQuantity: 1, unit: 't', category: '毒性气体', hazardClass: 'toxicGas' },
            '7803-52-3': { name: '锑化氢', criticalQuantity: 1, unit: 't', category: '毒性气体', hazardClass: 'toxicGas' },
            '7783-07-5': { name: '硒化氢', criticalQuantity: 1, unit: 't', category: '毒性气体', hazardClass: 'toxicGas' },
            '74-83-9': { name: '溴甲烷', criticalQuantity: 10, unit: 't', category: '毒性液体', hazardClass: 'toxicLiquid' },
            '75-86-5': { name: '丙酮氰醇', criticalQuantity: 20, unit: 't', category: '毒性液体', hazardClass: 'toxicLiquid' },
            '107-02-8': { name: '丙烯醛', criticalQuantity: 20, unit: 't', category: '毒性液体', hazardClass: 'toxicLiquid' },
            '7664-39-3': { name: '氟化氢', criticalQuantity: 1, unit: 't', category: '毒性气体', hazardClass: 'toxicGas' },
            '106-89-8': { name: '1-氯-2,3-环氧丙烷', criticalQuantity: 20, unit: 't', category: '毒性液体', hazardClass: 'toxicLiquid' },
            '3132-64-7': { name: '3-溴-1,2-环氧丙烷', criticalQuantity: 20, unit: 't', category: '毒性液体', hazardClass: 'toxicLiquid' },
            '26471-62-5': { name: '甲基三异丙基', criticalQuantity: 100, unit: 't', category: '毒性液体', hazardClass: 'toxicLiquid' },
            '10025-67-9': { name: '一氯化硫', criticalQuantity: 1, unit: 't', category: '毒性液体', hazardClass: 'toxicLiquid' },
            '74-90-8': { name: '氰化氢', criticalQuantity: 1, unit: 't', category: '毒性气体', hazardClass: 'toxicGas' },
            '7446-11-9': { name: '三氧化硫', criticalQuantity: 75, unit: 't', category: '毒性气体', hazardClass: 'toxicGas' },
            '107-11-9': { name: '3-氯丙烯', criticalQuantity: 20, unit: 't', category: '毒性液体', hazardClass: 'toxicLiquid' },
            '7726-95-6': { name: '溴', criticalQuantity: 20, unit: 't', category: '毒性液体', hazardClass: 'toxicLiquid' },
            '151-56-4': { name: '乙烯亚胺', criticalQuantity: 20, unit: 't', category: '毒性液体', hazardClass: 'toxicLiquid' },
            '624-83-9': { name: '异氰酸甲酯', criticalQuantity: 0.75, unit: 't', category: '毒性液体', hazardClass: 'toxicLiquid' },
            '16810-58-7': { name: '叠氮化钠', criticalQuantity: 0.5, unit: 't', category: '毒性固体', hazardClass: 'toxicSolid' },
            '13424-46-9': { name: '叠氮化铅', criticalQuantity: 0.5, unit: 't', category: '毒性固体', hazardClass: 'toxicSolid' },
            '628-86-4': { name: '雷汞', criticalQuantity: 0.5, unit: 't', category: '爆炸品', hazardClass: 'explosive' },
            '28653-16-9': { name: '三硝基苯甲醚', criticalQuantity: 5, unit: 't', category: '爆炸品', hazardClass: 'explosive' },
            '118-96-7': { name: '2,4,6-三硝基甲苯', criticalQuantity: 5, unit: 't', category: '爆炸品', hazardClass: 'explosive' },
            '55-63-0': { name: '硝化甘油', criticalQuantity: 1, unit: 't', category: '爆炸品', hazardClass: 'explosive' },

            // 硝化纤维素类
            '9004-70-0': { name: '硝化纤维素(含氮>25%)', criticalQuantity: 10, unit: 't', category: '爆炸品', hazardClass: 'explosive' },

            // 硝酸铵类
            '6484-52-2': { name: '硝酸铵', criticalQuantity: 5, unit: 't', category: '爆炸品', hazardClass: 'explosive' },

            // 液化石油气等
            '7757-79-1': { name: '硝酸钾', criticalQuantity: 1000, unit: 't', category: '氧化剂', hazardClass: 'oxidizer' },
            '106-99-0': { name: '1,3-丁二烯', criticalQuantity: 5, unit: 't', category: '易燃气体', hazardClass: 'flammableGas' },
            '115-10-6': { name: '二甲醚', criticalQuantity: 50, unit: 't', category: '易燃气体', hazardClass: 'flammableGas' },
            '74-82-8': { name: '甲烷', criticalQuantity: 50, unit: 't', category: '易燃气体', hazardClass: 'flammableGas' },
            '8006-14-2': { name: '天然气', criticalQuantity: 50, unit: 't', category: '易燃气体', hazardClass: 'flammableGas' },
            '75-01-4': { name: '氯乙烯', criticalQuantity: 50, unit: 't', category: '易燃气体', hazardClass: 'flammableGas' },
            '1333-74-0': { name: '氢', criticalQuantity: 5, unit: 't', category: '易燃气体', hazardClass: 'flammableGas' },
            '68476-85-7': { name: '液化石油气(含丙烷)', criticalQuantity: 50, unit: 't', category: '易燃气体', hazardClass: 'flammableGas' },
            '74-98-6': { name: '丙烷', criticalQuantity: 50, unit: 't', category: '易燃气体', hazardClass: 'flammableGas' },
            '106-97-8': { name: '丁烷', criticalQuantity: 50, unit: 't', category: '易燃气体', hazardClass: 'flammableGas' },
            '74-89-5': { name: '一甲胺', criticalQuantity: 5, unit: 't', category: '易燃气体', hazardClass: 'flammableGas' },
            '74-86-2': { name: '乙炔', criticalQuantity: 1, unit: 't', category: '易燃气体', hazardClass: 'flammableGas' },
            '74-85-1': { name: '乙烯', criticalQuantity: 50, unit: 't', category: '易燃气体', hazardClass: 'flammableGas' },
            '7782-44-7': { name: '氧(压缩的或液化的)', criticalQuantity: 200, unit: 't', category: '氧化剂', hazardClass: 'oxidizer' },
            '71-43-2': { name: '苯', criticalQuantity: 50, unit: 't', category: '易燃液体', hazardClass: 'flammableLiquid' },
            '100-42-5': { name: '苯乙烯', criticalQuantity: 500, unit: 't', category: '易燃液体', hazardClass: 'flammableLiquid' },
            '67-64-1': { name: '丙酮', criticalQuantity: 500, unit: 't', category: '易燃液体', hazardClass: 'flammableLiquid' },
            '107-13-1': { name: '2-丙烯腈', criticalQuantity: 50, unit: 't', category: '易燃液体', hazardClass: 'flammableLiquid' },
            '75-15-0': { name: '二硫化碳', criticalQuantity: 50, unit: 't', category: '易燃液体', hazardClass: 'flammableLiquid' },
            '110-82-7': { name: '环己烷', criticalQuantity: 500, unit: 't', category: '易燃液体', hazardClass: 'flammableLiquid' },
            '75-56-9': { name: '1,2-环氧丙烷', criticalQuantity: 10, unit: 't', category: '易燃液体', hazardClass: 'flammableLiquid' },
            '108-88-3': { name: '甲苯', criticalQuantity: 500, unit: 't', category: '易燃液体', hazardClass: 'flammableLiquid' },
            '67-56-1': { name: '甲醇', criticalQuantity: 500, unit: 't', category: '易燃液体', hazardClass: 'flammableLiquid' },
            '86290-81-5': { name: '汽油(乙醇汽油)', criticalQuantity: 200, unit: 't', category: '易燃液体', hazardClass: 'flammableLiquid' },
            '64-17-5': { name: '乙醇', criticalQuantity: 500, unit: 't', category: '易燃液体', hazardClass: 'flammableLiquid' },
            '60-29-7': { name: '乙醚', criticalQuantity: 10, unit: 't', category: '易燃液体', hazardClass: 'flammableLiquid' },
            '141-78-6': { name: '乙酸乙酯', criticalQuantity: 500, unit: 't', category: '易燃液体', hazardClass: 'flammableLiquid' },
            '110-54-3': { name: '正己烷', criticalQuantity: 500, unit: 't', category: '易燃液体', hazardClass: 'flammableLiquid' },
            '79-21-0': { name: '过乙酸', criticalQuantity: 10, unit: 't', category: '易燃液体', hazardClass: 'flammableLiquid' },
            '1338-23-4': { name: '过氧化甲乙酮', criticalQuantity: 10, unit: 't', category: '易燃液体', hazardClass: 'flammableLiquid' },
            '12185-10-3': { name: '白磷', criticalQuantity: 50, unit: 't', category: '易燃固体', hazardClass: 'flammableSolid' },
            // 三硝基苯酚
            '19624-22-7': { name: '戊硝苯', criticalQuantity: 1, unit: 't', category: '爆炸品', hazardClass: 'explosive' },
            '17014-71-0': { name: '过氧化钠', criticalQuantity: 20, unit: 't', category: '氧化剂', hazardClass: 'oxidizer' },
            '1313-60-6': { name: '过氧化钠和二氧化钠', criticalQuantity: 20, unit: 't', category: '氧化剂', hazardClass: 'oxidizer' },
            '3811-04-9': { name: '氯酸钾', criticalQuantity: 100, unit: 't', category: '氧化剂', hazardClass: 'oxidizer' },
            '7775-09-9': { name: '氯酸钠', criticalQuantity: 100, unit: 't', category: '氧化剂', hazardClass: 'oxidizer' },
            '52583-42-3': { name: '发烟硝酸', criticalQuantity: 20, unit: 't', category: '氧化剂', hazardClass: 'oxidizer' },
            '7697-37-2': { name: '硝酸(发红烟的除外)', criticalQuantity: 100, unit: 't', category: '氧化剂', hazardClass: 'oxidizer' },
            '506-93-4': { name: '硝酸胍', criticalQuantity: 50, unit: 't', category: '氧化剂', hazardClass: 'oxidizer' },
            '75-20-7': { name: '碳化钙', criticalQuantity: 100, unit: 't', category: '遇水放出易燃气体', hazardClass: 'waterReactive' },
            '7440-09-7': { name: '钾', criticalQuantity: 1, unit: 't', category: '遇水放出易燃气体', hazardClass: 'waterReactive' },
            '7440-23-5': { name: '钠', criticalQuantity: 10, unit: 't', category: '遇水放出易燃气体', hazardClass: 'waterReactive' }
        };
    }

    // 初始化评估等级（GB18218-2018表6）
    initializeAssessmentLevels() {
        return {
            level1: {
                name: '一级重大危险源',
                range: 'R ≥ 100',
                description: '可能造成特别重大事故的危险源',
                requirements: [
                    '建立完善的安全管理制度',
                    '配备温度、压力、液位、流量等信息采集与监控系统',
                    '配备可燃气体和有毒有害气体泄漏检测报警装置',
                    '配备紧急停车系统',
                    '建立与县级以上人民政府负有安全监管职责的部门信息接入'
                ]
            },
            level2: {
                name: '二级重大危险源',
                range: '100 > R ≥ 50',
                description: '可能造成重大事故的危险源',
                requirements: [
                    '建立安全管理制度',
                    '配备温度、压力等基本监控系统',
                    '配备可燃气体检测报警装置',
                    '设置紧急停车系统',
                    '建立与地方政府相关部门的信息联络'
                ]
            },
            level3: {
                name: '三级重大危险源',
                range: '50 > R ≥ 10',
                description: '可能造成较大事故的危险源',
                requirements: [
                    '建立基本安全管理制度',
                    '配备必要的监控装置',
                    '设置气体检测装置',
                    '制定应急预案'
                ]
            },
            level4: {
                name: '四级重大危险源',
                range: '10 > R',
                description: '可能造成一般事故的危险源，不构成重大危险源但仍需管理',
                requirements: [
                    '执行基本安全管理要求',
                    '配备基础安全设施',
                    '制定基本应急措施'
                ]
            },
            nonMajor: {
                name: '非重大危险源',
                range: 'R < 1',
                description: '不构成重大危险源',
                requirements: [
                    '执行一般安全管理要求',
                    '按规定配备安全设施'
                ]
            }
        };
    }

    // 初始化法规标准
    initializeRegulatoryStandards() {
        return {
            'GB18218-2018': {
                name: '危险化学品重大危险源辨识',
                authority: '国家市场监督管理总局',
                effectiveDate: '2019-03-01',
                scope: '危险化学品重大危险源辨识标准'
            },
            'AQ3035-2010': {
                name: '危险化学品重大危险源安全监控通用技术规范',
                authority: '国家安全生产监督管理总局',
                effectiveDate: '2011-01-01',
                scope: '重大危险源安全监控技术要求'
            }
        };
    }

    // 初始化校正系数β（基于GB18218-2018表3、表4、表5）
    initializeCorrectionFactors() {
        return {
            // 毒性气体校正系数β取值表（表3）
            toxicGas: {
                '7783-41-7': 2,  // 二氧化氮
                '10102-44-0': 2, // 二氧化氮
                '7664-41-7': 2,  // 氨
                '75-21-8': 2,    // 环氧乙烷
                '7783-06-4': 3,  // 硫化氢
                '74-83-9': 3,    // 溴甲烷
                '7782-50-5': 4,  // 氯
                '7446-11-9': 5,  // 三氧化硫
                '7783-07-5': 5,  // 硒化氢
                '10025-67-9': 10, // 一氯化硫
                '7782-41-4': 10, // 氟
                '7804-35-1': 20, // 磷烷氢
                '7647-01-0': 20, // 氯化氢
                '异氰酸甲酯': 20
            },

            // 未在表3中列举的危险化学品校正系数β取值表（表4）
            hazardClassification: {
                'J1': 4,    // 类别1,所有暴露途径,气体
                'J2': 1,    // 类别1,所有暴露途径,固体,液体
                'J3': 2,    // 类别2,类别3,所有暴露途径,气体
                'J4': 2,    // 类别2,类别3,吸入途径,液体(沸点<35℃)
                'J5': 1,    // 类别2,所有暴露途径,液体(除J4外),固体
                'W1.1': 2,  // 一不稳定爆炸物,1.1项爆炸物
                'W1.2': 2,  // 1.2,1.3,1.5,1.6项爆炸物
                'W1.3': 2,  // 1.4项爆炸物
                'W2': 1.5,  // 类别1和类别2
                'W3': 1,    // 类别1和类别2
                'W4': 1,    // 类别1
                'W5.1': 1.5, // 一类别1,一类别2和3,工作温度高于沸点
                'W5.2': 1,   // 包括危化工艺等特殊情况
                'W5.3': 1,   // 一不属于W5.1或W5.2的其他类别2
                'W5.4': 1,   // 一不属于W5.1或W5.2的其他类别3
                'W6.1': 1.5, // A型和B型自反应物质和混合物
                'W6.2': 1,   // C型,D型,E型自反应物质和混合物
                'W7.1': 1.5, // A型和B型有机过氧化物
                'W7.2': 1,   // C型,D型,E型,F型有机过氧化物
                'W8': 1,     // 类别1自燃液体,类别1自燃固体
                'W9.1': 1,   // 类别1
                'W9.2': 1,   // 类别2,类别3
                'W10': 1,    // 类别1易燃固体
                'W11': 1     // 类别1和类别2
            },

            // 暴露人员校正系数α取值表（表5）
            exposedPersonnel: {
                '100+': 2.0,    // 100人以上
                '50-99': 1.5,   // 50～99人
                '30-49': 1.2,   // 30～49人
                '1-29': 1.0,    // 1～29人
                '0': 0.5        // 0人
            }
        };
    }

    // 单一介质重大危险源辨识
    identifySingleSubstance(cas, actualQuantity, unit = 't') {
        const substance = this.findSubstanceByCAS(cas);

        if (!substance) {
            throw new Error(`未找到CAS号为 ${cas} 的物质临界量数据`);
        }

        // 单位换算到吨
        const actualQuantityInTons = this.convertToTons(actualQuantity, unit);
        const criticalQuantityInTons = substance.criticalQuantity;

        // 计算风险商
        const riskQuotient = actualQuantityInTons / criticalQuantityInTons;

        return {
            substance: substance,
            actualQuantity: actualQuantityInTons,
            criticalQuantity: criticalQuantityInTons,
            riskQuotient: riskQuotient,
            isMajorHazard: riskQuotient >= 1,
            level: this.determineHazardLevel(riskQuotient),
            assessment: this.generateAssessmentReport(substance, riskQuotient)
        };
    }

    // 多介质重大危险源辨识（支持校正系数）
    identifyMultipleSubstancesAdvanced(substances, exposedPersonnel = 0) {
        let totalRiskQuotient = 0;
        const assessmentDetails = [];

        substances.forEach(item => {
            const { cas, quantity, unit = 't' } = item;
            const substance = this.findSubstanceByCAS(cas);

            if (substance) {
                const actualQuantityInTons = this.convertToTons(quantity, unit);
                let correctionFactor = this.getCorrectionFactor(cas, substance.hazardClass);
                const baseRiskQuotient = actualQuantityInTons / substance.criticalQuantity;
                const adjustedRiskQuotient = baseRiskQuotient * correctionFactor;

                totalRiskQuotient += adjustedRiskQuotient;

                assessmentDetails.push({
                    cas: cas,
                    name: substance.name,
                    actualQuantity: actualQuantityInTons,
                    criticalQuantity: substance.criticalQuantity,
                    baseRiskQuotient: baseRiskQuotient,
                    correctionFactor: correctionFactor,
                    adjustedRiskQuotient: adjustedRiskQuotient,
                    contribution: 0 // 后续计算
                });
            }
        });

        // 应用暴露人员校正系数α
        const personnelCorrection = this.getPersonnelCorrectionFactor(exposedPersonnel);
        const finalRiskQuotient = totalRiskQuotient * personnelCorrection;

        // 计算各物质贡献度
        assessmentDetails.forEach(detail => {
            detail.contribution = (detail.adjustedRiskQuotient / totalRiskQuotient * 100).toFixed(2);
        });

        return {
            baseRiskQuotient: totalRiskQuotient,
            personnelCorrectionFactor: personnelCorrection,
            finalRiskQuotient: finalRiskQuotient,
            isMajorHazard: finalRiskQuotient >= 1,
            level: this.determineHazardLevel(finalRiskQuotient),
            substances: assessmentDetails,
            exposedPersonnel: exposedPersonnel,
            overallAssessment: this.generateAdvancedAssessmentReport(assessmentDetails, finalRiskQuotient, exposedPersonnel)
        };
    }

    // 多介质重大危险源辨识（简化版，保持向后兼容）
    identifyMultipleSubstances(substances) {
        let totalRiskQuotient = 0;
        const assessmentDetails = [];

        substances.forEach(item => {
            const { cas, quantity, unit = 't' } = item;
            const substance = this.findSubstanceByCAS(cas);

            if (substance) {
                const actualQuantityInTons = this.convertToTons(quantity, unit);
                const riskQuotient = actualQuantityInTons / substance.criticalQuantity;

                totalRiskQuotient += riskQuotient;

                assessmentDetails.push({
                    cas: cas,
                    name: substance.name,
                    actualQuantity: actualQuantityInTons,
                    criticalQuantity: substance.criticalQuantity,
                    riskQuotient: riskQuotient,
                    contribution: 0 // 后续计算
                });
            }
        });

        // 计算各物质贡献度
        assessmentDetails.forEach(detail => {
            detail.contribution = (detail.riskQuotient / totalRiskQuotient * 100).toFixed(2);
        });

        return {
            totalRiskQuotient: totalRiskQuotient,
            isMajorHazard: totalRiskQuotient >= 1,
            level: this.determineHazardLevel(totalRiskQuotient),
            substances: assessmentDetails,
            overallAssessment: this.generateMultipleAssessmentReport(assessmentDetails, totalRiskQuotient)
        };
    }

    // 获取校正系数β
    getCorrectionFactor(cas, hazardClass) {
        // 首先查找毒性气体表3中的特定校正系数
        if (this.correctionFactors.toxicGas[cas]) {
            return this.correctionFactors.toxicGas[cas];
        }

        // 根据危险品分类获取默认校正系数
        const classificationMap = {
            'toxicGas': 'J1',      // 毒性气体通常为类别1气体
            'toxicLiquid': 'J2',   // 毒性液体通常为类别1液体
            'toxicSolid': 'J2',    // 毒性固体通常为类别1固体
            'explosive': 'W1.2',   // 爆炸品
            'flammableGas': 'W2',  // 易燃气体
            'flammableLiquid': 'W5.3', // 易燃液体
            'flammableSolid': 'W10',   // 易燃固体
            'oxidizer': 'W9.2',    // 氧化剂
            'waterReactive': 'W11' // 遇水放出易燃气体
        };

        const classificationCode = classificationMap[hazardClass];
        return this.correctionFactors.hazardClassification[classificationCode] || 1;
    }

    // 获取暴露人员校正系数α
    getPersonnelCorrectionFactor(exposedPersonnel) {
        if (exposedPersonnel >= 100) return this.correctionFactors.exposedPersonnel['100+'];
        if (exposedPersonnel >= 50) return this.correctionFactors.exposedPersonnel['50-99'];
        if (exposedPersonnel >= 30) return this.correctionFactors.exposedPersonnel['30-49'];
        if (exposedPersonnel >= 1) return this.correctionFactors.exposedPersonnel['1-29'];
        return this.correctionFactors.exposedPersonnel['0'];
    }

    // 根据CAS号查找物质
    findSubstanceByCAS(cas) {
        return this.criticalQuantities[cas] || null;
    }

    // 单位换算为吨
    convertToTons(quantity, unit) {
        const conversionFactors = {
            't': 1,
            'kg': 0.001,
            'g': 0.000001,
            'L': 0.001, // 假设液体密度约1g/mL
            'mL': 0.000001,
            'm³': 1 // 气体需要根据标准状态计算，简化处理
        };

        return quantity * (conversionFactors[unit] || 1);
    }

    // 确定危险源等级（基于GB18218-2018表6）
    determineHazardLevel(riskQuotient) {
        if (riskQuotient < 1) {
            return this.assessmentLevels.nonMajor;
        } else if (riskQuotient >= 100) {
            return this.assessmentLevels.level1;
        } else if (riskQuotient >= 50) {
            return this.assessmentLevels.level2;
        } else if (riskQuotient >= 10) {
            return this.assessmentLevels.level3;
        } else {
            return this.assessmentLevels.level4;
        }
    }

    // 生成单一物质评估报告
    generateAssessmentReport(substance, riskQuotient) {
        const level = this.determineHazardLevel(riskQuotient);

        return {
            conclusion: level.name,
            riskLevel: level.range,
            description: level.description,
            requirements: level.requirements,
            recommendations: this.generateRecommendations(substance, riskQuotient),
            regulatoryBasis: ['GB18218-2018', 'AQ3035-2010']
        };
    }

    // 生成多物质评估报告
    generateMultipleAssessmentReport(substances, totalRiskQuotient) {
        const level = this.determineHazardLevel(totalRiskQuotient);
        const primaryContributors = substances
            .filter(s => s.contribution > 10)
            .sort((a, b) => b.contribution - a.contribution);

        return {
            conclusion: level.name,
            totalRiskQuotient: totalRiskQuotient.toFixed(4),
            riskLevel: level.range,
            description: level.description,
            requirements: level.requirements,
            primaryContributors: primaryContributors,
            managementFocus: this.generateManagementFocus(primaryContributors),
            regulatoryBasis: ['GB18218-2018', 'AQ3035-2010']
        };
    }

    // 生成高级评估报告（支持校正系数）
    generateAdvancedAssessmentReport(substances, finalRiskQuotient, exposedPersonnel) {
        const level = this.determineHazardLevel(finalRiskQuotient);
        const primaryContributors = substances
            .filter(s => s.contribution > 10)
            .sort((a, b) => b.contribution - a.contribution);

        return {
            conclusion: level.name,
            finalRiskQuotient: finalRiskQuotient.toFixed(4),
            riskLevel: level.range,
            description: level.description,
            requirements: level.requirements,
            primaryContributors: primaryContributors,
            managementFocus: this.generateManagementFocus(primaryContributors),
            exposedPersonnelAnalysis: this.generatePersonnelAnalysis(exposedPersonnel),
            correctionFactorsUsed: this.summarizeCorrectionFactors(substances),
            regulatoryBasis: ['GB18218-2018表3', 'GB18218-2018表4', 'GB18218-2018表5', 'AQ3035-2010']
        };
    }

    // 生成人员暴露分析
    generatePersonnelAnalysis(exposedPersonnel) {
        const correctionFactor = this.getPersonnelCorrectionFactor(exposedPersonnel);
        return {
            count: exposedPersonnel,
            correctionFactor: correctionFactor,
            riskLevel: this.getPersonnelRiskDescription(exposedPersonnel),
            recommendations: this.getPersonnelRecommendations(exposedPersonnel)
        };
    }

    // 获取人员风险描述
    getPersonnelRiskDescription(count) {
        if (count >= 100) return '高风险 - 100人以上暴露';
        if (count >= 50) return '较高风险 - 50-99人暴露';
        if (count >= 30) return '中等风险 - 30-49人暴露';
        if (count >= 1) return '低风险 - 1-29人暴露';
        return '最低风险 - 无人员暴露';
    }

    // 获取人员保护建议
    getPersonnelRecommendations(count) {
        const recommendations = [];

        if (count >= 100) {
            recommendations.push('实施最高级别的安全防护措施');
            recommendations.push('设置多重安全屏障和逃生路线');
            recommendations.push('建立专门的应急救援队伍');
            recommendations.push('定期进行大规模应急演练');
        } else if (count >= 50) {
            recommendations.push('加强安全防护设施');
            recommendations.push('设置清晰的逃生标识');
            recommendations.push('定期进行应急演练');
        } else if (count >= 30) {
            recommendations.push('配备必要的个人防护设备');
            recommendations.push('制定详细的应急预案');
        } else if (count >= 1) {
            recommendations.push('基本安全防护措施');
            recommendations.push('安全培训和意识教育');
        }

        return recommendations;
    }

    // 总结使用的校正系数
    summarizeCorrectionFactors(substances) {
        return substances.map(s => ({
            substance: s.name,
            cas: s.cas,
            correctionFactor: s.correctionFactor,
            basis: s.correctionFactor > 1 ?
                (this.correctionFactors.toxicGas[s.cas] ? 'GB18218-2018表3' : 'GB18218-2018表4') :
                '默认值'
        }));
    }

    // 生成管理建议
    generateRecommendations(substance, riskQuotient) {
        const recommendations = [];

        if (riskQuotient >= 1) {
            recommendations.push('必须按重大危险源进行管理');
            recommendations.push('建立完善的安全管理制度');
            recommendations.push('配备相应的监控和报警系统');
        }

        if (substance.category === '毒性气体' || substance.category === '毒性液体') {
            recommendations.push('配备有毒气体检测报警装置');
            recommendations.push('设置应急洗眼器和淋浴设施');
            recommendations.push('制定中毒应急救援预案');
        }

        if (substance.category === '易燃气体' || substance.category === '易燃液体') {
            recommendations.push('配备可燃气体检测报警装置');
            recommendations.push('设置防火防爆安全设施');
            recommendations.push('制定火灾爆炸应急预案');
        }

        if (riskQuotient >= 10) {
            recommendations.push('建立与政府部门的信息联络机制');
            recommendations.push('定期进行安全评价');
            recommendations.push('加强人员培训和应急演练');
        }

        return recommendations;
    }

    // 生成管理重点
    generateManagementFocus(primaryContributors) {
        return primaryContributors.map(contributor => ({
            substance: contributor.name,
            contribution: contributor.contribution + '%',
            focus: this.getSubstanceSpecificFocus(contributor.name)
        }));
    }

    // 获取物质特定管理重点
    getSubstanceSpecificFocus(substanceName) {
        const focuses = {
            '氨': ['泄漏检测', '通风系统', '中毒防护'],
            '氯气': ['气体检测', '应急处置', '防腐蚀措施'],
            '苯': ['挥发控制', '防火防爆', '职业健康'],
            '甲醇': ['通风排毒', '防火措施', '中毒预防'],
            '硫酸': ['防腐蚀', '防溅射', '应急冲洗'],
            '氢气': ['防泄漏', '防静电', '防火防爆']
        };

        return focuses[substanceName] || ['定期检查', '应急准备', '人员培训'];
    }

    // 生成风险分析图表数据
    generateRiskChartData(assessmentResult) {
        if (assessmentResult.substances) {
            // 多物质饼图数据
            return {
                type: 'pie',
                title: '各物质风险贡献度',
                data: assessmentResult.substances.map(s => ({
                    name: s.name,
                    value: parseFloat(s.contribution)
                }))
            };
        } else {
            // 单物质条形图数据
            return {
                type: 'bar',
                title: '风险商对比',
                data: [
                    { name: '实际风险商', value: assessmentResult.riskQuotient },
                    { name: '临界值', value: 1 }
                ]
            };
        }
    }

    // 导出评估报告
    exportAssessmentReport(assessmentResult, format = 'json') {
        const report = {
            title: '重大危险源评估报告',
            assessmentDate: new Date().toISOString().split('T')[0],
            assessmentStandard: 'GB18218-2018',
            result: assessmentResult,
            disclaimer: '本报告仅供参考，具体管理要求请以最新法规为准'
        };

        switch (format) {
            case 'json':
                return JSON.stringify(report, null, 2);
            case 'csv':
                return this.convertToCSV(report);
            case 'html':
                return this.convertToHTML(report);
            default:
                return report;
        }
    }

    // 转换为CSV格式
    convertToCSV(report) {
        // 实现CSV转换逻辑
        return '重大危险源评估报告,CSV格式实现中...';
    }

    // 转换为HTML格式
    convertToHTML(report) {
        // 实现HTML报告模板
        return '<html><body><h1>重大危险源评估报告</h1><p>HTML格式实现中...</p></body></html>';
    }

    // 获取法规要求详情
    getRegulatoryRequirements(hazardLevel) {
        return {
            level: hazardLevel.name,
            requirements: hazardLevel.requirements,
            monitoringRequirements: this.getMonitoringRequirements(hazardLevel),
            reportingRequirements: this.getReportingRequirements(hazardLevel),
            inspectionFrequency: this.getInspectionFrequency(hazardLevel)
        };
    }

    // 获取监控要求
    getMonitoringRequirements(hazardLevel) {
        const requirements = {
            level1: ['24小时连续监控', '自动报警系统', '视频监控', '数据记录存储'],
            level2: ['定时监控', '报警系统', '数据记录'],
            level3: ['定期检测', '基本报警', '记录保存'],
            level4: ['日常巡检', '异常报告']
        };

        return requirements[hazardLevel.name.includes('一级') ? 'level1' :
                          hazardLevel.name.includes('二级') ? 'level2' :
                          hazardLevel.name.includes('三级') ? 'level3' : 'level4'] || requirements.level4;
    }

    // 获取报告要求
    getReportingRequirements(hazardLevel) {
        const requirements = {
            level1: ['季度报告', '年度评估报告', '事故报告'],
            level2: ['半年报告', '年度评估报告', '事故报告'],
            level3: ['年度报告', '事故报告'],
            level4: ['事故报告']
        };

        return requirements[hazardLevel.name.includes('一级') ? 'level1' :
                          hazardLevel.name.includes('二级') ? 'level2' :
                          hazardLevel.name.includes('三级') ? 'level3' : 'level4'] || requirements.level4;
    }

    // 获取检查频次
    getInspectionFrequency(hazardLevel) {
        const frequencies = {
            level1: '每月至少1次',
            level2: '每季度至少1次',
            level3: '每半年至少1次',
            level4: '每年至少1次'
        };

        return frequencies[hazardLevel.name.includes('一级') ? 'level1' :
                         hazardLevel.name.includes('二级') ? 'level2' :
                         hazardLevel.name.includes('三级') ? 'level3' : 'level4'] || frequencies.level4;
    }
}
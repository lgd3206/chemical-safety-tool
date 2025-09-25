// 重大危险源评估系统
export class MajorHazardAssessment {
    constructor() {
        this.criticalQuantities = this.initializeCriticalQuantities();
        this.assessmentLevels = this.initializeAssessmentLevels();
        this.regulatoryStandards = this.initializeRegulatoryStandards();
    }

    // 初始化临界量数据（基于GB18218-2018）
    initializeCriticalQuantities() {
        return {
            // 易燃气体
            flammableGas: {
                '74-82-8': { name: '甲烷', criticalQuantity: 50, unit: 't', category: '易燃气体' },
                '74-84-0': { name: '乙烷', criticalQuantity: 50, unit: 't', category: '易燃气体' },
                '74-98-6': { name: '丙烷', criticalQuantity: 50, unit: 't', category: '易燃气体' },
                '1333-74-0': { name: '氢气', criticalQuantity: 5, unit: 't', category: '易燃气体' },
            },

            // 易燃液体
            flammableLiquid: {
                '64-17-5': { name: '乙醇', criticalQuantity: 500, unit: 't', category: '易燃液体' },
                '67-56-1': { name: '甲醇', criticalQuantity: 500, unit: 't', category: '易燃液体' },
                '71-43-2': { name: '苯', criticalQuantity: 50, unit: 't', category: '易燃液体' },
                '108-88-3': { name: '甲苯', criticalQuantity: 500, unit: 't', category: '易燃液体' },
                '67-64-1': { name: '丙酮', criticalQuantity: 500, unit: 't', category: '易燃液体' },
            },

            // 毒性气体
            toxicGas: {
                '7664-41-7': { name: '氨', criticalQuantity: 10, unit: 't', category: '毒性气体' },
                '7782-50-5': { name: '氯气', criticalQuantity: 1, unit: 't', category: '毒性气体' },
                '7783-06-4': { name: '硫化氢', criticalQuantity: 5, unit: 't', category: '毒性气体' },
                '630-08-0': { name: '一氧化碳', criticalQuantity: 7.5, unit: 't', category: '毒性气体' },
            },

            // 毒性液体
            toxicLiquid: {
                '50-00-0': { name: '甲醛', criticalQuantity: 0.5, unit: 't', category: '毒性液体' },
                '7647-01-0': { name: '盐酸', criticalQuantity: 20, unit: 't', category: '毒性液体' },
                '7664-93-9': { name: '硫酸', criticalQuantity: 20, unit: 't', category: '毒性液体' },
                '7697-37-2': { name: '硝酸', criticalQuantity: 20, unit: 't', category: '毒性液体' },
            },

            // 易爆物质
            explosive: {
                '55-63-0': { name: '硝化甘油', criticalQuantity: 0.5, unit: 't', category: '爆炸品' },
                '118-96-7': { name: 'TNT', criticalQuantity: 1, unit: 't', category: '爆炸品' },
                '131-73-7': { name: '苦味酸', criticalQuantity: 1, unit: 't', category: '爆炸品' },
            },

            // 氧化剂
            oxidizer: {
                '7722-84-1': { name: '过氧化氢', criticalQuantity: 100, unit: 't', category: '氧化性物质' },
                '7757-79-1': { name: '硝酸钾', criticalQuantity: 100, unit: 't', category: '氧化性物质' },
                '10102-17-7': { name: '过硫酸铵', criticalQuantity: 100, unit: 't', category: '氧化性物质' },
            }
        };
    }

    // 初始化评估等级（GB18218-2018）
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
                range: '100 > R ≥ 10',
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
                range: '10 > R ≥ 1',
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
                range: '1 > R',
                description: '可能造成一般事故的危险源',
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

    // 多介质重大危险源辨识
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

    // 根据CAS号查找物质
    findSubstanceByCAS(cas) {
        for (const category in this.criticalQuantities) {
            if (this.criticalQuantities[category][cas]) {
                return this.criticalQuantities[category][cas];
            }
        }
        return null;
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

    // 确定危险源等级
    determineHazardLevel(riskQuotient) {
        if (riskQuotient < 1) {
            return this.assessmentLevels.nonMajor;
        } else if (riskQuotient >= 100) {
            return this.assessmentLevels.level1;
        } else if (riskQuotient >= 10) {
            return this.assessmentLevels.level2;
        } else if (riskQuotient >= 1) {
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
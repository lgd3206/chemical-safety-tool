// 化学品风险评估工具
export class ChemicalRiskAssessment {
    constructor() {
        this.riskMatrix = this.initializeRiskMatrix();
        this.exposureRoutes = this.initializeExposureRoutes();
        this.protectionLevels = this.initializeProtectionLevels();
        this.controlMeasures = this.initializeControlMeasures();
    }

    initializeRiskMatrix() {
        // 5x5风险矩阵：概率 vs 后果严重程度
        return {
            levels: {
                probability: {
                    1: { name: '极低', description: '几乎不可能发生', range: '< 0.1%' },
                    2: { name: '低', description: '不太可能发生', range: '0.1% - 1%' },
                    3: { name: '中等', description: '可能发生', range: '1% - 10%' },
                    4: { name: '高', description: '很可能发生', range: '10% - 50%' },
                    5: { name: '极高', description: '几乎肯定发生', range: '> 50%' }
                },
                severity: {
                    1: { name: '可忽略', description: '轻微不适，无需医疗', impact: '轻微刺激' },
                    2: { name: '轻微', description: '需要基本医疗处理', impact: '暂时性影响' },
                    3: { name: '中等', description: '需要医疗治疗', impact: '可逆性健康影响' },
                    4: { name: '严重', description: '严重伤害或疾病', impact: '永久性健康损害' },
                    5: { name: '灾难性', description: '死亡或严重残疾', impact: '死亡或严重后果' }
                }
            },
            riskLevels: {
                1: { level: '可接受', color: 'green', action: '无需额外措施' },
                2: { level: '可接受', color: 'green', action: '监控即可' },
                3: { level: '可接受', color: 'green', action: '定期检查' },
                4: { level: '可接受', color: 'green', action: '定期检查' },
                5: { level: '可接受', color: 'green', action: '定期检查' },
                6: { level: '可容忍', color: 'yellow', action: '降低风险' },
                8: { level: '可容忍', color: 'yellow', action: '降低风险' },
                9: { level: '可容忍', color: 'yellow', action: '降低风险' },
                10: { level: '可容忍', color: 'yellow', action: '降低风险' },
                12: { level: '不可接受', color: 'orange', action: '必须降低风险' },
                15: { level: '不可接受', color: 'red', action: '立即采取措施' },
                16: { level: '不可接受', color: 'red', action: '立即采取措施' },
                20: { level: '不可接受', color: 'red', action: '立即采取措施' },
                25: { level: '不可接受', color: 'red', action: '禁止操作' }
            }
        };
    }

    initializeExposureRoutes() {
        return {
            inhalation: {
                name: '吸入',
                factors: ['蒸气压', '粉尘产生', '通风条件', '接触时间'],
                assessment: 'assessInhalationRisk'
            },
            dermal: {
                name: '皮肤接触',
                factors: ['皮肤渗透性', '接触面积', '防护措施', '接触频率'],
                assessment: 'assessDermalRisk'
            },
            ingestion: {
                name: '误食',
                factors: ['操作方式', '个人卫生', '食品接触', '防护意识'],
                assessment: 'assessIngestionRisk'
            },
            injection: {
                name: '注射/伤口',
                factors: ['针头使用', '尖锐物品', '伤口污染', '操作技能'],
                assessment: 'assessInjectionRisk'
            }
        };
    }

    initializeProtectionLevels() {
        return {
            A: {
                name: 'A级防护',
                description: '最高级别防护',
                equipment: ['正压式全面罩呼吸器', '全封闭防化服', '内层手套', '化学防护靴'],
                application: '未知毒性或高毒性环境'
            },
            B: {
                name: 'B级防护',
                description: '呼吸道最高防护',
                equipment: ['正压式全面罩呼吸器', '防化服', '防化手套', '防化靴'],
                application: '已知化学品种类但浓度未知'
            },
            C: {
                name: 'C级防护',
                description: '已知浓度防护',
                equipment: ['全面罩过滤呼吸器', '防化服', '防化手套', '防化靴'],
                application: '已知化学品种类和浓度'
            },
            D: {
                name: 'D级防护',
                description: '基本防护',
                equipment: ['工作服', '安全眼镜', '手套', '安全鞋'],
                application: '无已知危险的环境'
            }
        };
    }

    initializeControlMeasures() {
        return {
            elimination: {
                level: 1,
                name: '消除',
                description: '完全消除危险源',
                examples: ['替换危险化学品', '改变工艺路线', '停止使用']
            },
            substitution: {
                level: 2,
                name: '替代',
                description: '用较安全的替代品',
                examples: ['使用低毒溶剂', '用水性涂料替代有机溶剂', '生物降解材料']
            },
            engineering: {
                level: 3,
                name: '工程控制',
                description: '通过工程技术手段控制',
                examples: ['局部通风', '密闭操作', '自动化操作', '泄漏检测系统']
            },
            administrative: {
                level: 4,
                name: '管理措施',
                description: '通过管理制度控制',
                examples: ['作业指导书', '培训教育', '轮岗制度', '定期检查']
            },
            ppe: {
                level: 5,
                name: '个人防护',
                description: '个人防护用品',
                examples: ['防毒面具', '防化服', '防护手套', '护目镜']
            }
        };
    }

    // 综合风险评估
    assessRisk(chemical, exposureScenario) {
        const hazardAssessment = this.assessHazard(chemical);
        const exposureAssessment = this.assessExposure(chemical, exposureScenario);
        const riskCharacterization = this.characterizeRisk(hazardAssessment, exposureAssessment);

        return {
            chemical: chemical.name || chemical.englishName,
            hazardLevel: hazardAssessment.level,
            exposureLevel: exposureAssessment.level,
            riskScore: riskCharacterization.score,
            riskLevel: riskCharacterization.level,
            riskColor: riskCharacterization.color,
            recommendations: this.generateRecommendations(riskCharacterization),
            controlMeasures: this.suggestControlMeasures(riskCharacterization),
            monitoringRequirements: this.getMonitoringRequirements(chemical, riskCharacterization)
        };
    }

    // 危险性评估
    assessHazard(chemical) {
        let hazardScore = 1;
        const hazardFactors = [];

        if (chemical.hazards) {
            chemical.hazards.forEach(hazard => {
                const severity = this.getHazardSeverity(hazard);
                hazardScore = Math.max(hazardScore, severity.score);
                hazardFactors.push({
                    type: hazard.type,
                    description: hazard.text,
                    severity: severity.level
                });
            });
        }

        // 基于物理化学性质调整
        if (chemical.boilingPoint && parseFloat(chemical.boilingPoint) < 100) {
            hazardScore = Math.max(hazardScore, 3); // 易挥发
            hazardFactors.push({ type: 'physical', description: '易挥发性', severity: '中等' });
        }

        if (chemical.density && parseFloat(chemical.density) > 10) {
            hazardScore = Math.max(hazardScore, 4); // 重金属
            hazardFactors.push({ type: 'physical', description: '重金属毒性', severity: '严重' });
        }

        return {
            score: hazardScore,
            level: this.riskMatrix.levels.severity[hazardScore].name,
            factors: hazardFactors,
            description: this.riskMatrix.levels.severity[hazardScore].description
        };
    }

    // 暴露评估
    assessExposure(chemical, scenario) {
        let exposureScore = 1;
        const exposureFactors = [];

        // 评估各种暴露途径
        Object.keys(this.exposureRoutes).forEach(route => {
            const routeScore = this[this.exposureRoutes[route].assessment](chemical, scenario);
            exposureScore = Math.max(exposureScore, routeScore.score);

            if (routeScore.score > 1) {
                exposureFactors.push({
                    route: route,
                    score: routeScore.score,
                    factors: routeScore.factors
                });
            }
        });

        // 考虑暴露持续时间和频率
        if (scenario.duration && scenario.duration > 8) { // 超过8小时
            exposureScore = Math.min(5, exposureScore + 1);
            exposureFactors.push({ factor: '长时间暴露', impact: '+1' });
        }

        if (scenario.frequency && scenario.frequency > 5) { // 每周超过5次
            exposureScore = Math.min(5, exposureScore + 1);
            exposureFactors.push({ factor: '高频次暴露', impact: '+1' });
        }

        return {
            score: exposureScore,
            level: this.riskMatrix.levels.probability[exposureScore].name,
            factors: exposureFactors,
            routes: exposureFactors.map(f => f.route).filter(r => r)
        };
    }

    // 吸入风险评估
    assessInhalationRisk(chemical, scenario) {
        let score = 1;
        const factors = [];

        // 蒸气压评估
        if (chemical.vaporPressure || (chemical.boilingPoint && parseFloat(chemical.boilingPoint) < 200)) {
            score = Math.max(score, 3);
            factors.push('高挥发性');
        }

        // 通风条件
        if (!scenario.ventilation || scenario.ventilation === 'poor') {
            score = Math.max(score, 4);
            factors.push('通风不良');
        }

        // 粉尘产生
        if (scenario.dustGeneration) {
            score = Math.max(score, 3);
            factors.push('产生粉尘');
        }

        // 呼吸防护
        if (!scenario.respiratoryProtection) {
            score = Math.min(5, score + 1);
            factors.push('无呼吸防护');
        }

        return { score, factors };
    }

    // 皮肤接触风险评估
    assessDermalRisk(chemical, scenario) {
        let score = 1;
        const factors = [];

        // 皮肤腐蚀性/刺激性
        if (chemical.hazards && chemical.hazards.some(h => h.text.includes('腐蚀') || h.text.includes('刺激'))) {
            score = Math.max(score, 4);
            factors.push('皮肤腐蚀/刺激性');
        }

        // 皮肤渗透性
        if (chemical.formula && (chemical.formula.includes('Cl') || chemical.formula.includes('F'))) {
            score = Math.max(score, 3);
            factors.push('有机卤素化合物');
        }

        // 防护手套
        if (!scenario.skinProtection) {
            score = Math.min(5, score + 1);
            factors.push('无皮肤防护');
        }

        // 接触面积和时间
        if (scenario.contactArea && scenario.contactArea > 10) { // 大面积接触
            score = Math.min(5, score + 1);
            factors.push('大面积接触');
        }

        return { score, factors };
    }

    // 误食风险评估
    assessIngestionRisk(chemical, scenario) {
        let score = 1;
        const factors = [];

        // 急性毒性
        if (chemical.hazards && chemical.hazards.some(h => h.text.includes('毒') && h.text.includes('吞咽'))) {
            score = Math.max(score, 5);
            factors.push('高急性毒性');
        }

        // 操作方式
        if (scenario.operationType && scenario.operationType === 'manual') {
            score = Math.max(score, 2);
            factors.push('手工操作');
        }

        // 卫生条件
        if (!scenario.hygienePractices) {
            score = Math.min(5, score + 1);
            factors.push('卫生条件差');
        }

        return { score, factors };
    }

    // 注射伤口风险评估
    assessInjectionRisk(chemical, scenario) {
        let score = 1;
        const factors = [];

        // 使用尖锐器具
        if (scenario.sharpObjects) {
            score = Math.max(score, 3);
            factors.push('使用尖锐器具');
        }

        // 高压操作
        if (scenario.pressure && scenario.pressure > 1) {
            score = Math.max(score, 4);
            factors.push('高压操作');
        }

        return { score, factors };
    }

    // 风险定性
    characterizeRisk(hazardAssessment, exposureAssessment) {
        const score = hazardAssessment.score * exposureAssessment.score;
        const riskInfo = this.riskMatrix.riskLevels[score] || this.riskMatrix.riskLevels[25];

        return {
            score: score,
            level: riskInfo.level,
            color: riskInfo.color,
            action: riskInfo.action,
            hazardContribution: hazardAssessment.score / score * 100,
            exposureContribution: exposureAssessment.score / score * 100
        };
    }

    // 获取危险严重程度
    getHazardSeverity(hazard) {
        const text = hazard.text.toLowerCase();

        if (text.includes('致命') || text.includes('死亡')) {
            return { score: 5, level: '灾难性' };
        }
        if (text.includes('严重') || text.includes('致癌') || text.includes('腐蚀')) {
            return { score: 4, level: '严重' };
        }
        if (text.includes('刺激') || text.includes('过敏')) {
            return { score: 3, level: '中等' };
        }
        if (text.includes('轻微') || hazard.type === 'caution') {
            return { score: 2, level: '轻微' };
        }

        return { score: 1, level: '可忽略' };
    }

    // 生成建议措施
    generateRecommendations(riskCharacterization) {
        const recommendations = [];

        switch (riskCharacterization.level) {
            case '不可接受':
                recommendations.push('立即停止当前操作');
                recommendations.push('重新评估操作流程');
                recommendations.push('实施更严格的控制措施');
                recommendations.push('寻找替代方案');
                break;

            case '可容忍':
                recommendations.push('实施额外的控制措施');
                recommendations.push('加强个人防护');
                recommendations.push('增加监测频率');
                recommendations.push('制定应急预案');
                break;

            case '可接受':
                recommendations.push('保持当前控制措施');
                recommendations.push('定期检查和维护');
                recommendations.push('持续监控风险状态');
                break;
        }

        return recommendations;
    }

    // 建议控制措施
    suggestControlMeasures(riskCharacterization) {
        const measures = [];

        // 根据风险等级推荐控制层级
        if (riskCharacterization.score >= 15) {
            measures.push(this.controlMeasures.elimination);
            measures.push(this.controlMeasures.substitution);
        }

        if (riskCharacterization.score >= 9) {
            measures.push(this.controlMeasures.engineering);
        }

        measures.push(this.controlMeasures.administrative);
        measures.push(this.controlMeasures.ppe);

        return measures.map(measure => ({
            priority: measure.level,
            name: measure.name,
            description: measure.description,
            examples: measure.examples
        }));
    }

    // 获取监测要求
    getMonitoringRequirements(chemical, riskCharacterization) {
        const requirements = [];

        if (riskCharacterization.score >= 12) {
            requirements.push('实时环境监测');
            requirements.push('个人暴露监测');
            requirements.push('健康监护');
        } else if (riskCharacterization.score >= 6) {
            requirements.push('定期环境检测');
            requirements.push('年度健康检查');
        } else {
            requirements.push('基础环境检查');
        }

        // 基于化学品特性添加特殊监测
        if (chemical.hazards) {
            chemical.hazards.forEach(hazard => {
                if (hazard.text.includes('致癌')) {
                    requirements.push('致癌物专项监测');
                }
                if (hazard.text.includes('生殖')) {
                    requirements.push('生殖毒性监测');
                }
                if (hazard.text.includes('神经')) {
                    requirements.push('神经系统检查');
                }
            });
        }

        return [...new Set(requirements)];
    }

    // 生成风险评估报告
    generateRiskReport(assessments) {
        const totalChemicals = assessments.length;
        const highRiskChemicals = assessments.filter(a => a.riskScore >= 15).length;
        const mediumRiskChemicals = assessments.filter(a => a.riskScore >= 6 && a.riskScore < 15).length;
        const lowRiskChemicals = assessments.filter(a => a.riskScore < 6).length;

        return {
            summary: {
                totalChemicals,
                highRiskChemicals,
                mediumRiskChemicals,
                lowRiskChemicals,
                overallRiskLevel: highRiskChemicals > 0 ? '高风险' : mediumRiskChemicals > 0 ? '中等风险' : '低风险'
            },
            priorityActions: this.getPriorityActions(assessments),
            recommendations: this.getOverallRecommendations(assessments),
            monitoringPlan: this.createMonitoringPlan(assessments)
        };
    }

    // 获取优先处理事项
    getPriorityActions(assessments) {
        return assessments
            .filter(a => a.riskScore >= 15)
            .sort((a, b) => b.riskScore - a.riskScore)
            .map(a => ({
                chemical: a.chemical,
                riskScore: a.riskScore,
                urgentActions: a.recommendations.slice(0, 2)
            }));
    }

    // 获取总体建议
    getOverallRecommendations(assessments) {
        const recommendations = new Set();

        assessments.forEach(assessment => {
            if (assessment.riskScore >= 12) {
                recommendations.add('建立完善的化学品管理体系');
                recommendations.add('加强员工安全培训');
                recommendations.add('定期进行风险评估更新');
            }
            if (assessment.riskScore >= 6) {
                recommendations.add('改善工作环境通风条件');
                recommendations.add('配备充足的个人防护用品');
                recommendations.add('制定应急响应预案');
            }
        });

        return Array.from(recommendations);
    }

    // 创建监测计划
    createMonitoringPlan(assessments) {
        const plan = {
            daily: [],
            weekly: [],
            monthly: [],
            annual: []
        };

        assessments.forEach(assessment => {
            if (assessment.riskScore >= 15) {
                plan.daily.push(`${assessment.chemical} - 环境浓度监测`);
                plan.weekly.push(`${assessment.chemical} - 防护设备检查`);
            } else if (assessment.riskScore >= 6) {
                plan.weekly.push(`${assessment.chemical} - 环境检查`);
                plan.monthly.push(`${assessment.chemical} - 设备维护`);
            } else {
                plan.monthly.push(`${assessment.chemical} - 常规检查`);
            }

            plan.annual.push(`${assessment.chemical} - 风险评估更新`);
        });

        return plan;
    }
}
// 化学品储存兼容性检查系统
export class StorageCompatibilityChecker {
    constructor() {
        this.incompatibilityMatrix = this.initializeIncompatibilityMatrix();
        this.storageClasses = this.initializeStorageClasses();
        this.segregationDistances = this.initializeSegregationDistances();
    }

    initializeStorageClasses() {
        return {
            // 基于UN危险品分类的储存分类
            'Class1': {
                name: '爆炸品',
                code: '1',
                description: '在运输条件下能够爆炸、产生危险投射物、火焰或烟雾的物质',
                storageRequirements: ['专用库房', '防爆设施', '远离热源'],
                examples: ['TNT', '硝化甘油', '雷管']
            },
            'Class2': {
                name: '气体',
                code: '2',
                description: '压缩气体、液化气体、溶解气体和冷冻液化气体',
                storageRequirements: ['通风良好', '避免阳光直射', '固定储存'],
                examples: ['氢气', '氧气', '氨气', '液化石油气']
            },
            'Class3': {
                name: '易燃液体',
                code: '3',
                description: '闭杯闪点≤60℃的液体',
                storageRequirements: ['阴凉通风', '远离火源', '防静电'],
                examples: ['汽油', '酒精', '丙酮', '苯']
            },
            'Class4': {
                name: '易燃固体',
                code: '4',
                description: '易燃固体、自燃物质、遇水放出易燃气体的物质',
                storageRequirements: ['干燥储存', '防潮', '远离水源'],
                examples: ['白磷', '钠', '镁粉', '电石']
            },
            'Class5': {
                name: '氧化剂',
                code: '5',
                description: '氧化剂和有机过氧化物',
                storageRequirements: ['阴凉储存', '远离可燃物', '专用库房'],
                examples: ['过氧化氢', '硝酸钾', '高锰酸钾']
            },
            'Class6': {
                name: '毒害品',
                code: '6',
                description: '毒性物质和感染性物质',
                storageRequirements: ['密封储存', '专人管理', '防泄漏'],
                examples: ['氰化钠', '砒霜', '汞及其化合物']
            },
            'Class7': {
                name: '放射性物质',
                code: '7',
                description: '具有放射性的物质',
                storageRequirements: ['铅屏蔽', '专用设施', '辐射监测'],
                examples: ['铀化合物', '钚化合物']
            },
            'Class8': {
                name: '腐蚀品',
                code: '8',
                description: '能够腐蚀金属、损害人体组织的物质',
                storageRequirements: ['防腐容器', '通风良好', '防泄漏'],
                examples: ['硫酸', '盐酸', '氢氧化钠']
            },
            'Class9': {
                name: '杂类危险物质',
                code: '9',
                description: '其他危险物质',
                storageRequirements: ['根据具体性质确定'],
                examples: ['石棉', '干冰', '锂电池']
            }
        };
    }

    initializeIncompatibilityMatrix() {
        // 危险品储存兼容性矩阵
        return {
            '1': { // 爆炸品
                incompatible: ['2', '3', '4', '5', '6', '8', '9'],
                reason: '爆炸品应单独储存，与其他危险品保持最大距离'
            },
            '2': { // 气体
                incompatible: ['1', '3', '4'],
                conditional: {
                    '5': '氧化性气体不能与易燃气体共存',
                    '8': '腐蚀性气体需特殊考虑'
                }
            },
            '3': { // 易燃液体
                incompatible: ['1', '5', '4'],
                reason: '易燃液体与氧化剂、易燃固体易发生火灾爆炸'
            },
            '4': { // 易燃固体
                incompatible: ['1', '3', '5'],
                conditional: {
                    '8': '遇水反应的固体不能与酸性腐蚀品共存'
                }
            },
            '5': { // 氧化剂
                incompatible: ['1', '3', '4', '6'],
                reason: '氧化剂与可燃物质接触易引起燃烧爆炸'
            },
            '6': { // 毒害品
                incompatible: ['1', '5'],
                conditional: {
                    '8': '某些毒害品与酸碱反应产生有毒气体'
                }
            },
            '7': { // 放射性物质
                incompatible: [],
                reason: '放射性物质主要考虑辐射防护，可与其他物质分隔储存'
            },
            '8': { // 腐蚀品
                incompatible: ['1', '4'],
                conditional: {
                    '6': '酸性腐蚀品与某些毒害品反应产生有毒气体',
                    '3': '强酸与某些有机溶剂反应'
                }
            },
            '9': { // 杂类
                incompatible: ['1'],
                reason: '需根据具体物质性质判断'
            }
        };
    }

    initializeSegregationDistances() {
        // 储存隔离距离要求（米）
        return {
            'same_class': 1, // 同类物质之间
            'compatible': 3, // 兼容物质之间
            'incompatible': 8, // 不兼容物质之间
            'explosive_others': 15, // 爆炸品与其他物质
            'toxic_others': 5, // 毒害品与其他物质
            'oxidizer_flammable': 10 // 氧化剂与易燃物
        };
    }

    // 检查两种化学品的储存兼容性
    checkCompatibility(chemical1, chemical2) {
        const class1 = this.classifyChemical(chemical1);
        const class2 = this.classifyChemical(chemical2);

        if (!class1 || !class2) {
            return {
                compatible: null,
                reason: '无法确定化学品分类',
                recommendation: '请查阅具体的SDS文件'
            };
        }

        const incompatibility = this.incompatibilityMatrix[class1.code];

        if (incompatibility.incompatible.includes(class2.code)) {
            return {
                compatible: false,
                reason: incompatibility.reason || `${class1.name}与${class2.name}不兼容`,
                recommendation: this.getSegregationRecommendation(class1.code, class2.code),
                distance: this.getRequiredDistance(class1.code, class2.code)
            };
        }

        if (incompatibility.conditional && incompatibility.conditional[class2.code]) {
            return {
                compatible: false,
                reason: incompatibility.conditional[class2.code],
                recommendation: '需要专业评估和特殊储存条件',
                distance: this.getRequiredDistance(class1.code, class2.code)
            };
        }

        return {
            compatible: true,
            reason: '储存兼容',
            recommendation: '可以在同一区域储存，但需保持适当距离',
            distance: this.segregationDistances.compatible
        };
    }

    // 根据化学品信息分类
    classifyChemical(chemical) {
        if (!chemical.hazards) {
            return null;
        }

        // 基于危险特性进行分类
        for (const hazard of chemical.hazards) {
            const hazardText = hazard.text.toLowerCase();

            if (hazardText.includes('爆炸') || hazardText.includes('explosive')) {
                return this.storageClasses.Class1;
            }
            if (hazardText.includes('气体') || hazardText.includes('gas') || hazardText.includes('压缩')) {
                return this.storageClasses.Class2;
            }
            if (hazardText.includes('易燃液体') || hazardText.includes('flammable liquid')) {
                return this.storageClasses.Class3;
            }
            if (hazardText.includes('易燃固体') || hazardText.includes('易燃') && chemical.appearance && chemical.appearance.includes('固体')) {
                return this.storageClasses.Class4;
            }
            if (hazardText.includes('氧化') || hazardText.includes('oxidiz')) {
                return this.storageClasses.Class5;
            }
            if (hazardText.includes('毒') || hazardText.includes('toxic') || hazardText.includes('致癌')) {
                return this.storageClasses.Class6;
            }
            if (hazardText.includes('腐蚀') || hazardText.includes('灼伤') || hazardText.includes('corrosive')) {
                return this.storageClasses.Class8;
            }
        }

        // 根据物理性质推断
        if (chemical.boilingPoint && parseFloat(chemical.boilingPoint) < 35) {
            return this.storageClasses.Class3; // 低沸点易燃液体
        }

        return this.storageClasses.Class9; // 默认归为杂类
    }

    // 获取所需隔离距离
    getRequiredDistance(class1, class2) {
        if (class1 === '1' || class2 === '1') {
            return this.segregationDistances.explosive_others;
        }
        if (class1 === '6' || class2 === '6') {
            return this.segregationDistances.toxic_others;
        }
        if ((class1 === '5' && class2 === '3') || (class1 === '3' && class2 === '5')) {
            return this.segregationDistances.oxidizer_flammable;
        }
        return this.segregationDistances.incompatible;
    }

    // 获取储存分隔建议
    getSegregationRecommendation(class1, class2) {
        const distance = this.getRequiredDistance(class1, class2);

        return [
            `两种化学品应至少相距${distance}米储存`,
            '使用防火墙或其他物理隔离措施',
            '配备相应的应急处置设备',
            '制定针对性的应急预案',
            '定期检查储存条件和容器完整性'
        ];
    }

    // 批量兼容性检查
    checkMultipleCompatibility(chemicals) {
        const results = [];
        const incompatiblePairs = [];

        for (let i = 0; i < chemicals.length; i++) {
            for (let j = i + 1; j < chemicals.length; j++) {
                const result = this.checkCompatibility(chemicals[i], chemicals[j]);

                results.push({
                    chemical1: chemicals[i].name || chemicals[i].englishName,
                    chemical2: chemicals[j].name || chemicals[j].englishName,
                    ...result
                });

                if (!result.compatible) {
                    incompatiblePairs.push({
                        pair: [chemicals[i], chemicals[j]],
                        ...result
                    });
                }
            }
        }

        return {
            allResults: results,
            incompatiblePairs: incompatiblePairs,
            overallCompatible: incompatiblePairs.length === 0,
            recommendations: this.generateStorageLayout(chemicals, incompatiblePairs)
        };
    }

    // 生成储存布局建议
    generateStorageLayout(chemicals, incompatiblePairs) {
        if (incompatiblePairs.length === 0) {
            return ['所有化学品可在同一储存区域，但应保持适当间距'];
        }

        const recommendations = [
            '根据兼容性分析，建议分区储存：'
        ];

        // 按危险品分类分组
        const groups = {};
        chemicals.forEach(chemical => {
            const classification = this.classifyChemical(chemical);
            const classCode = classification ? classification.code : '9';

            if (!groups[classCode]) {
                groups[classCode] = [];
            }
            groups[classCode].push(chemical);
        });

        Object.keys(groups).forEach(classCode => {
            const className = this.storageClasses[`Class${classCode}`]?.name || '杂类';
            const chemicalNames = groups[classCode].map(c => c.name || c.englishName).join('、');

            recommendations.push(`${className}区域：${chemicalNames}`);
            recommendations.push(`储存要求：${this.storageClasses[`Class${classCode}`]?.storageRequirements.join('、')}`);
        });

        // 添加特殊注意事项
        recommendations.push('');
        recommendations.push('特殊注意事项：');
        incompatiblePairs.forEach(pair => {
            const name1 = pair.pair[0].name || pair.pair[0].englishName;
            const name2 = pair.pair[1].name || pair.pair[1].englishName;
            recommendations.push(`${name1}与${name2}必须相距至少${pair.distance}米`);
        });

        return recommendations;
    }

    // 应急响应建议
    getEmergencyResponseGuidance(chemical) {
        const classification = this.classifyChemical(chemical);
        if (!classification) {
            return ['请查阅具体的SDS文件获取应急处置信息'];
        }

        const guidance = {
            '1': [
                '立即疏散人员至安全区域',
                '禁止使用无线电设备',
                '使用大量水冷却，但不要直接冲击爆炸物',
                '联系专业爆破人员处置'
            ],
            '2': [
                '关闭气源，通风换气',
                '禁止火种，防止静电',
                '如有泄漏，用肥皂水检查漏点',
                '人员撤离到上风向'
            ],
            '3': [
                '切断火源，使用泡沫、二氧化碳灭火',
                '防止液体流入下水道',
                '用砂土或其他惰性材料吸收',
                '佩戴防毒面具进行处置'
            ],
            '4': [
                '用砂土覆盖，禁用水',
                '如遇水反应，保持干燥',
                '使用干粉灭火剂',
                '防止与氧化剂接触'
            ],
            '5': [
                '大量水冷却稀释',
                '清除周围可燃物',
                '不要使用有机溶剂清洗',
                '穿戴全套防护设备'
            ],
            '6': [
                '佩戴防毒面具和防护服',
                '用专用吸收材料收集',
                '污染区域彻底消毒',
                '及时就医检查'
            ],
            '8': [
                '用大量水稀释，但避免飞溅',
                '中和处理（酸用碱中和）',
                '防止腐蚀扩散',
                '冲洗后的废水需处理'
            ]
        };

        return guidance[classification.code] || ['按照SDS文件要求进行应急处置'];
    }

    // 生成储存检查清单
    generateStorageChecklist(chemicals) {
        const checklist = [
            '储存环境检查：',
            '□ 温度是否在规定范围内',
            '□ 湿度是否符合要求',
            '□ 通风系统是否正常运行',
            '□ 照明设施是否完好',
            '',
            '容器检查：',
            '□ 容器是否完整无损',
            '□ 标签是否清晰可读',
            '□ 密封是否良好',
            '□ 是否有泄漏迹象',
            '',
            '安全设施检查：',
            '□ 消防器材是否齐全有效',
            '□ 应急洗眼器是否正常',
            '□ 通风报警系统是否工作',
            '□ 个人防护用品是否完备',
            '',
            '管理检查：',
            '□ 储存记录是否完整',
            '□ 人员培训是否到位',
            '□ 应急预案是否制定',
            '□ 定期检查是否执行'
        ];

        // 根据具体化学品添加特殊检查项目
        const specialRequirements = new Set();
        chemicals.forEach(chemical => {
            const classification = this.classifyChemical(chemical);
            if (classification) {
                classification.storageRequirements.forEach(req => {
                    specialRequirements.add(req);
                });
            }
        });

        if (specialRequirements.size > 0) {
            checklist.push('', '特殊要求检查：');
            specialRequirements.forEach(req => {
                checklist.push(`□ ${req}措施是否落实`);
            });
        }

        return checklist;
    }
}
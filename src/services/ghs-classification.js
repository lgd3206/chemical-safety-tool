// GHS危险性分类和标签系统
export class GHSClassificationSystem {
    constructor() {
        this.hazardClasses = this.initializeHazardClasses();
        this.pictograms = this.initializePictograms();
        this.signalWords = {
            danger: '危险',
            warning: '警告',
            none: '无'
        };
    }

    initializeHazardClasses() {
        return {
            // 物理危险
            explosive: {
                name: '爆炸物',
                category: 'physical',
                subcategories: ['不稳定爆炸物', '1.1类', '1.2类', '1.3类', '1.4类', '1.5类', '1.6类'],
                pictogram: 'explosive',
                signalWord: 'danger'
            },
            flammableGas: {
                name: '易燃气体',
                category: 'physical',
                subcategories: ['1类', '2类'],
                pictogram: 'flame',
                signalWord: 'danger'
            },
            flammableLiquid: {
                name: '易燃液体',
                category: 'physical',
                subcategories: ['1类', '2类', '3类', '4类'],
                pictogram: 'flame',
                signalWord: 'danger'
            },
            flammableSolid: {
                name: '易燃固体',
                category: 'physical',
                subcategories: ['1类', '2类'],
                pictogram: 'flame',
                signalWord: 'danger'
            },
            oxidizer: {
                name: '氧化性物质',
                category: 'physical',
                subcategories: ['1类', '2类', '3类'],
                pictogram: 'flame_over_circle',
                signalWord: 'danger'
            },
            pressurizedGas: {
                name: '加压气体',
                category: 'physical',
                subcategories: ['压缩气体', '液化气体', '冷冻液化气体', '溶解气体'],
                pictogram: 'gas_cylinder',
                signalWord: 'warning'
            },

            // 健康危险
            acuteToxicity: {
                name: '急性毒性',
                category: 'health',
                subcategories: ['1类', '2类', '3类', '4类', '5类'],
                pictogram: 'skull_crossbones',
                signalWord: 'danger'
            },
            skinCorrosion: {
                name: '皮肤腐蚀',
                category: 'health',
                subcategories: ['1A类', '1B类', '1C类'],
                pictogram: 'corrosion',
                signalWord: 'danger'
            },
            skinIrritation: {
                name: '皮肤刺激',
                category: 'health',
                subcategories: ['2类'],
                pictogram: 'exclamation',
                signalWord: 'warning'
            },
            eyeDamage: {
                name: '严重眼损伤',
                category: 'health',
                subcategories: ['1类'],
                pictogram: 'corrosion',
                signalWord: 'danger'
            },
            eyeIrritation: {
                name: '眼刺激',
                category: 'health',
                subcategories: ['2A类', '2B类'],
                pictogram: 'exclamation',
                signalWord: 'warning'
            },
            respiratorySensitization: {
                name: '呼吸道致敏',
                category: 'health',
                subcategories: ['1A类', '1B类'],
                pictogram: 'health_hazard',
                signalWord: 'danger'
            },
            skinSensitization: {
                name: '皮肤致敏',
                category: 'health',
                subcategories: ['1A类', '1B类'],
                pictogram: 'exclamation',
                signalWord: 'warning'
            },
            carcinogenicity: {
                name: '致癌性',
                category: 'health',
                subcategories: ['1A类', '1B类', '2类'],
                pictogram: 'health_hazard',
                signalWord: 'danger'
            },
            reproductiveToxicity: {
                name: '生殖毒性',
                category: 'health',
                subcategories: ['1A类', '1B类', '2类'],
                pictogram: 'health_hazard',
                signalWord: 'danger'
            },
            specificTargetOrganToxicity: {
                name: '特定靶器官毒性',
                category: 'health',
                subcategories: ['单次接触1类', '单次接触2类', '反复接触1类', '反复接触2类'],
                pictogram: 'health_hazard',
                signalWord: 'danger'
            },

            // 环境危险
            aquaticToxicity: {
                name: '水环境危险',
                category: 'environmental',
                subcategories: ['急性1类', '急性2类', '急性3类', '慢性1类', '慢性2类', '慢性3类', '慢性4类'],
                pictogram: 'environment',
                signalWord: 'warning'
            },
            ozoneDepletion: {
                name: '对臭氧层有害',
                category: 'environmental',
                subcategories: ['1类'],
                pictogram: 'environment',
                signalWord: 'warning'
            }
        };
    }

    initializePictograms() {
        return {
            explosive: {
                symbol: '💥',
                name: '爆炸',
                description: '爆炸性物质'
            },
            flame: {
                symbol: '🔥',
                name: '火焰',
                description: '易燃物质'
            },
            flame_over_circle: {
                symbol: '🔥⭕',
                name: '圆圈上火焰',
                description: '氧化性物质'
            },
            gas_cylinder: {
                symbol: '🛢️',
                name: '气瓶',
                description: '加压气体'
            },
            corrosion: {
                symbol: '🧪',
                name: '腐蚀',
                description: '腐蚀性物质'
            },
            skull_crossbones: {
                symbol: '☠️',
                name: '骷髅头',
                description: '急性毒性'
            },
            exclamation: {
                symbol: '⚠️',
                name: '感叹号',
                description: '刺激性或致敏性'
            },
            health_hazard: {
                symbol: '☣️',
                name: '健康危害',
                description: '健康危害'
            },
            environment: {
                symbol: '🌍',
                name: '环境',
                description: '环境危害'
            }
        };
    }

    // 根据化学品属性自动分类GHS危险性
    classifyChemical(chemicalData) {
        const classification = {
            hazardClasses: [],
            pictograms: [],
            signalWord: 'none',
            hazardStatements: [],
            precautionaryStatements: []
        };

        // 基于已知危险信息进行分类
        if (chemicalData.hazards) {
            chemicalData.hazards.forEach(hazard => {
                const ghsClass = this.mapToGHSClass(hazard);
                if (ghsClass) {
                    classification.hazardClasses.push(ghsClass);
                    classification.pictograms.push(this.hazardClasses[ghsClass.type].pictogram);
                    classification.hazardStatements.push(hazard.text);
                }
            });
        }

        // 基于物理化学性质进行分类
        if (chemicalData.boilingPoint && parseFloat(chemicalData.boilingPoint) < 35) {
            classification.hazardClasses.push({
                type: 'flammableLiquid',
                category: '1类'
            });
            classification.pictograms.push('flame');
            classification.hazardStatements.push('极易燃液体和蒸气');
        }

        // 去重象形图
        classification.pictograms = [...new Set(classification.pictograms)];

        // 确定信号词
        classification.signalWord = this.determineSignalWord(classification.hazardClasses);

        // 生成预防措施
        classification.precautionaryStatements = this.generatePrecautionaryStatements(classification.hazardClasses);

        return classification;
    }

    // 将现有危险信息映射到GHS分类
    mapToGHSClass(hazard) {
        const text = hazard.text.toLowerCase();

        if (text.includes('致癌') || text.includes('癌')) {
            return { type: 'carcinogenicity', category: '1类' };
        }
        if (text.includes('易燃')) {
            return { type: 'flammableLiquid', category: '2类' };
        }
        if (text.includes('腐蚀') || text.includes('灼伤')) {
            return { type: 'skinCorrosion', category: '1类' };
        }
        if (text.includes('刺激') && text.includes('眼')) {
            return { type: 'eyeIrritation', category: '2类' };
        }
        if (text.includes('刺激') && text.includes('皮肤')) {
            return { type: 'skinIrritation', category: '2类' };
        }
        if (text.includes('毒') && (text.includes('吞咽') || text.includes('误服'))) {
            return { type: 'acuteToxicity', category: '2类' };
        }
        if (text.includes('生殖')) {
            return { type: 'reproductiveToxicity', category: '2类' };
        }
        if (text.includes('爆炸')) {
            return { type: 'explosive', category: '1.1类' };
        }

        return null;
    }

    // 确定信号词
    determineSignalWord(hazardClasses) {
        const dangerClasses = ['explosive', 'flammableLiquid', 'acuteToxicity', 'skinCorrosion', 'carcinogenicity'];

        for (const hazardClass of hazardClasses) {
            if (dangerClasses.includes(hazardClass.type)) {
                return 'danger';
            }
        }

        return hazardClasses.length > 0 ? 'warning' : 'none';
    }

    // 生成预防措施声明
    generatePrecautionaryStatements(hazardClasses) {
        const statements = [];

        hazardClasses.forEach(hazardClass => {
            switch (hazardClass.type) {
                case 'flammableLiquid':
                    statements.push('远离热源、火花、明火和热表面');
                    statements.push('使用防爆电气设备');
                    break;
                case 'acuteToxicity':
                    statements.push('使用后彻底清洗双手');
                    statements.push('不要吃、喝或吸烟');
                    break;
                case 'skinCorrosion':
                    statements.push('穿戴防护手套和防护服');
                    statements.push('避免接触皮肤和眼睛');
                    break;
                case 'carcinogenicity':
                    statements.push('使用个人防护设备');
                    statements.push('在通风良好处使用');
                    break;
                case 'eyeIrritation':
                    statements.push('戴防护眼镜');
                    break;
            }
        });

        return [...new Set(statements)];
    }

    // 获取GHS标签信息
    getGHSLabel(chemicalData) {
        const classification = this.classifyChemical(chemicalData);

        return {
            productName: chemicalData.name || chemicalData.englishName,
            signalWord: this.signalWords[classification.signalWord],
            pictograms: classification.pictograms.map(p => this.pictograms[p]),
            hazardStatements: classification.hazardStatements,
            precautionaryStatements: classification.precautionaryStatements,
            supplierInfo: '供应商信息待补充'
        };
    }

    // 生成安全数据表(SDS)基本框架
    generateSDSFramework(chemicalData) {
        return {
            section1: {
                title: '化学品及企业标识',
                content: {
                    productName: chemicalData.name,
                    englishName: chemicalData.englishName,
                    casNumber: chemicalData.cas,
                    formula: chemicalData.formula,
                    supplier: '供应商信息',
                    emergencyPhone: '应急电话'
                }
            },
            section2: {
                title: '危险性概述',
                content: this.getGHSLabel(chemicalData)
            },
            section3: {
                title: '成分/组成信息',
                content: {
                    purity: '纯度信息',
                    impurities: '杂质信息',
                    additives: '添加剂信息'
                }
            },
            section4: {
                title: '急救措施',
                content: {
                    inhalation: '吸入：移至新鲜空气处，保持呼吸畅通',
                    skinContact: '皮肤接触：脱去污染衣物，用大量清水冲洗',
                    eyeContact: '眼睛接触：用清水冲洗15分钟，如有不适就医',
                    ingestion: '误服：漱口，不要催吐，立即就医'
                }
            },
            section5: {
                title: '消防措施',
                content: {
                    extinguishingMedia: '适用灭火介质',
                    specificHazards: '特殊危险性',
                    protectiveEquipment: '消防人员防护设备'
                }
            },
            // ... 其他标准SDS章节
        };
    }
}
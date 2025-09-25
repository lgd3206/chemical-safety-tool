// 有毒有害气体监测与报警系统
export class ToxicGasMonitoringSystem {
    constructor() {
        this.occupationalLimits = this.initializeOccupationalLimits();
        this.gasProperties = this.initializeGasProperties();
        this.alarmLevels = this.initializeAlarmLevels();
        this.detectionMethods = this.initializeDetectionMethods();
    }

    // 初始化职业接触限值数据（基于GBZ 2.1-2019）
    initializeOccupationalLimits() {
        return {
            // 化学窒息性气体
            '630-08-0': { // 一氧化碳
                name: '一氧化碳',
                formula: 'CO',
                molecularWeight: 28.01,
                limits: {
                    MAC: { value: 30, unit: 'mg/m³', note: '最高容许浓度' },
                    TWA: { value: 20, unit: 'mg/m³', note: '8小时时间加权平均' },
                    STEL: { value: 30, unit: 'mg/m³', note: '短时间接触限值' },
                    IDLH: { value: 1200, unit: 'mg/m³', note: '立即危及生命浓度' },
                    LEL: { value: 12.5, unit: '%', note: '爆炸下限' },
                    UEL: { value: 74.0, unit: '%', note: '爆炸上限' }
                },
                hazardType: '化学窒息性',
                primaryEffects: ['窒息', '中毒', '爆炸'],
                detectionPrinciple: '电化学传感器'
            },

            '7664-41-7': { // 氨
                name: '氨',
                formula: 'NH3',
                molecularWeight: 17.03,
                limits: {
                    MAC: { value: 30, unit: 'mg/m³', note: '最高容许浓度' },
                    TWA: { value: 20, unit: 'mg/m³', note: '8小时时间加权平均' },
                    STEL: { value: 30, unit: 'mg/m³', note: '短时间接触限值' },
                    IDLH: { value: 350, unit: 'mg/m³', note: '立即危及生命浓度' },
                    LEL: { value: 15.0, unit: '%', note: '爆炸下限' },
                    UEL: { value: 28.0, unit: '%', note: '爆炸上限' }
                },
                hazardType: '刺激性',
                primaryEffects: ['呼吸道刺激', '眼刺激', '化学烧伤'],
                detectionPrinciple: '电化学传感器'
            },

            '7782-50-5': { // 氯气
                name: '氯气',
                formula: 'Cl2',
                molecularWeight: 70.91,
                limits: {
                    MAC: { value: 3, unit: 'mg/m³', note: '最高容许浓度' },
                    TWA: { value: 1.5, unit: 'mg/m³', note: '8小时时间加权平均' },
                    STEL: { value: 3, unit: 'mg/m³', note: '短时间接触限值' },
                    IDLH: { value: 88, unit: 'mg/m³', note: '立即危及生命浓度' }
                },
                hazardType: '刺激性',
                primaryEffects: ['呼吸道损伤', '肺水肿', '化学烧伤'],
                detectionPrinciple: '电化学传感器'
            },

            '7783-06-4': { // 硫化氢
                name: '硫化氢',
                formula: 'H2S',
                molecularWeight: 34.08,
                limits: {
                    MAC: { value: 15, unit: 'mg/m³', note: '最高容许浓度' },
                    TWA: { value: 10, unit: 'mg/m³', note: '8小时时间加权平均' },
                    STEL: { value: 15, unit: 'mg/m³', note: '短时间接触限值' },
                    IDLH: { value: 430, unit: 'mg/m³', note: '立即危及生命浓度' },
                    LEL: { value: 4.3, unit: '%', note: '爆炸下限' },
                    UEL: { value: 45.5, unit: '%', note: '爆炸上限' }
                },
                hazardType: '神经性毒物',
                primaryEffects: ['窒息', '神经中毒', '眼刺激'],
                detectionPrinciple: '电化学传感器'
            },

            '50-00-0': { // 甲醛
                name: '甲醛',
                formula: 'HCHO',
                molecularWeight: 30.03,
                limits: {
                    MAC: { value: 0.5, unit: 'mg/m³', note: '最高容许浓度' },
                    TWA: { value: 0.5, unit: 'mg/m³', note: '8小时时间加权平均' },
                    STEL: { value: 1.0, unit: 'mg/m³', note: '短时间接触限值' },
                    IDLH: { value: 37, unit: 'mg/m³', note: '立即危及生命浓度' },
                    LEL: { value: 7.0, unit: '%', note: '爆炸下限' },
                    UEL: { value: 73.0, unit: '%', note: '爆炸上限' }
                },
                hazardType: '致癌性',
                primaryEffects: ['致癌', '致敏', '刺激'],
                detectionPrinciple: 'PID光离子化'
            },

            '71-43-2': { // 苯
                name: '苯',
                formula: 'C6H6',
                molecularWeight: 78.11,
                limits: {
                    MAC: { value: 10, unit: 'mg/m³', note: '最高容许浓度' },
                    TWA: { value: 6, unit: 'mg/m³', note: '8小时时间加权平均' },
                    STEL: { value: 10, unit: 'mg/m³', note: '短时间接触限值' },
                    IDLH: { value: 9500, unit: 'mg/m³', note: '立即危及生命浓度' },
                    LEL: { value: 1.2, unit: '%', note: '爆炸下限' },
                    UEL: { value: 7.8, unit: '%', note: '爆炸上限' }
                },
                hazardType: '致癌性',
                primaryEffects: ['致癌', '血液毒性', '神经毒性'],
                detectionPrinciple: 'PID光离子化'
            },

            '108-88-3': { // 甲苯
                name: '甲苯',
                formula: 'C7H8',
                molecularWeight: 92.14,
                limits: {
                    MAC: { value: 100, unit: 'mg/m³', note: '最高容许浓度' },
                    TWA: { value: 50, unit: 'mg/m³', note: '8小时时间加权平均' },
                    STEL: { value: 100, unit: 'mg/m³', note: '短时间接触限值' },
                    IDLH: { value: 3800, unit: 'mg/m³', note: '立即危及生命浓度' },
                    LEL: { value: 1.1, unit: '%', note: '爆炸下限' },
                    UEL: { value: 7.1, unit: '%', note: '爆炸上限' }
                },
                hazardType: '神经性毒物',
                primaryEffects: ['神经抑制', '刺激', '麻醉'],
                detectionPrinciple: 'PID光离子化'
            }
        };
    }

    // 初始化气体物理性质
    initializeGasProperties() {
        return {
            standardConditions: {
                temperature: 20, // °C
                pressure: 101.325, // kPa
                humidity: 50 // %RH
            },
            conversionFactors: {
                // ppm到mg/m³的转换系数 = 分子量/24.45
                ppmToMgm3: (molecularWeight) => molecularWeight / 24.45,
                // mg/m³到ppm的转换系数 = 24.45/分子量
                mgm3ToPpm: (molecularWeight) => 24.45 / molecularWeight
            }
        };
    }

    // 初始化报警级别设置
    initializeAlarmLevels() {
        return {
            // 有毒气体报警级别（基于职业接触限值的百分比）
            toxicGas: {
                level1: { // 预警
                    name: '一级预警',
                    percentage: 50, // TWA的50%
                    color: 'yellow',
                    action: '注意通风，加强监测',
                    soundPattern: '间断蜂鸣'
                },
                level2: { // 报警
                    name: '二级报警',
                    percentage: 100, // TWA的100%
                    color: 'orange',
                    action: '启动通风设施，人员撤离',
                    soundPattern: '连续蜂鸣'
                },
                level3: { // 高报
                    name: '三级高报',
                    percentage: 200, // TWA的200%或STEL
                    color: 'red',
                    action: '立即撤离，启动应急响应',
                    soundPattern: '急促报警声'
                }
            },

            // 可燃气体报警级别（基于LEL的百分比）
            combustibleGas: {
                level1: { // 预警
                    name: '一级预警',
                    percentage: 25, // LEL的25%
                    color: 'yellow',
                    action: '检查泄漏源，加强通风',
                    soundPattern: '间断蜂鸣'
                },
                level2: { // 报警
                    name: '二级报警',
                    percentage: 50, // LEL的50%
                    color: 'red',
                    action: '立即停止作业，切断火源',
                    soundPattern: '连续报警声'
                }
            },

            // 氧气报警级别
            oxygen: {
                low1: { // 缺氧预警
                    name: '缺氧预警',
                    value: 19.5,
                    unit: '%',
                    color: 'yellow',
                    action: '补充新鲜空气'
                },
                low2: { // 缺氧报警
                    name: '缺氧报警',
                    value: 18.0,
                    unit: '%',
                    color: 'red',
                    action: '立即撤离，佩戴呼吸器'
                },
                high: { // 富氧报警
                    name: '富氧报警',
                    value: 23.5,
                    unit: '%',
                    color: 'orange',
                    action: '检查氧气源，防止助燃'
                }
            }
        };
    }

    // 初始化检测方法
    initializeDetectionMethods() {
        return {
            electrochemical: {
                name: '电化学传感器',
                principle: '气体与电极发生电化学反应产生电流',
                applicableGases: ['CO', 'H2S', 'NH3', 'Cl2', 'SO2', 'NO2'],
                advantages: ['响应快', '选择性好', '功耗低'],
                limitations: ['寿命有限', '易受干扰', '需要氧气'],
                maintenanceCycle: '6-12个月'
            },
            catalytic: {
                name: '催化燃烧传感器',
                principle: '可燃气体在催化剂表面燃烧产生热量',
                applicableGases: ['CH4', 'C2H6', 'C3H8', 'H2', '汽油蒸气'],
                advantages: ['稳定性好', '寿命长', '成本低'],
                limitations: ['需要氧气', '易中毒', '响应慢'],
                maintenanceCycle: '12-18个月'
            },
            infrared: {
                name: '红外传感器',
                principle: '气体对特定波长红外光的吸收',
                applicableGases: ['CO2', 'CH4', 'CO', 'HC化合物'],
                advantages: ['不需要氧气', '不易中毒', '长寿命'],
                limitations: ['成本高', '功耗大', '易受灰尘影响'],
                maintenanceCycle: '18-24个月'
            },
            pid: {
                name: '光离子化传感器',
                principle: '紫外光电离有机分子产生离子电流',
                applicableGases: ['苯', '甲苯', '二甲苯', 'VOCs'],
                advantages: ['响应快', '检测范围广', '选择性好'],
                limitations: ['需要载气', '易受湿度影响', '维护复杂'],
                maintenanceCycle: '3-6个月'
            }
        };
    }

    // 浓度单位转换
    convertConcentration(value, fromUnit, toUnit, cas, temperature = 20, pressure = 101.325) {
        const gasData = this.occupationalLimits[cas];
        if (!gasData) {
            throw new Error(`未找到CAS号 ${cas} 的气体数据`);
        }

        const molecularWeight = gasData.molecularWeight;

        // 标准条件下的换算系数（20°C, 101.325kPa）
        let conversionFactor;

        // 温度和压力修正
        const tempCorrection = (273.15 + 20) / (273.15 + temperature);
        const pressureCorrection = pressure / 101.325;
        const correction = tempCorrection * pressureCorrection;

        if (fromUnit === 'ppm' && toUnit === 'mg/m³') {
            conversionFactor = this.gasProperties.conversionFactors.ppmToMgm3(molecularWeight) * correction;
        } else if (fromUnit === 'mg/m³' && toUnit === 'ppm') {
            conversionFactor = this.gasProperties.conversionFactors.mgm3ToPpm(molecularWeight) / correction;
        } else if (fromUnit === toUnit) {
            conversionFactor = 1;
        } else {
            throw new Error(`不支持从 ${fromUnit} 到 ${toUnit} 的转换`);
        }

        return {
            originalValue: value,
            originalUnit: fromUnit,
            convertedValue: parseFloat((value * conversionFactor).toFixed(4)),
            convertedUnit: toUnit,
            conversionFactor: conversionFactor,
            conditions: {
                temperature: temperature,
                pressure: pressure,
                correction: correction
            }
        };
    }

    // 批量浓度转换
    batchConvertConcentration(conversions, temperature = 20, pressure = 101.325) {
        return conversions.map(conversion => {
            try {
                return {
                    ...conversion,
                    result: this.convertConcentration(
                        conversion.value,
                        conversion.fromUnit,
                        conversion.toUnit,
                        conversion.cas,
                        temperature,
                        pressure
                    ),
                    success: true
                };
            } catch (error) {
                return {
                    ...conversion,
                    error: error.message,
                    success: false
                };
            }
        });
    }

    // 计算报警值设置
    calculateAlarmSettings(cas, gasType = 'toxic') {
        const gasData = this.occupationalLimits[cas];
        if (!gasData) {
            throw new Error(`未找到CAS号 ${cas} 的气体数据`);
        }

        const alarmSettings = {
            gasInfo: {
                name: gasData.name,
                formula: gasData.formula,
                hazardType: gasData.hazardType,
                detectionPrinciple: gasData.detectionPrinciple
            },
            recommendedSettings: {}
        };

        if (gasType === 'toxic' && gasData.limits.TWA) {
            const twaValue = gasData.limits.TWA.value;
            const stelValue = gasData.limits.STEL?.value || twaValue * 2;

            alarmSettings.recommendedSettings = {
                preAlarm: {
                    name: '预警值',
                    value: Math.round(twaValue * 0.5 * 10) / 10,
                    unit: gasData.limits.TWA.unit,
                    basis: 'TWA的50%',
                    action: '加强监测，检查通风'
                },
                lowAlarm: {
                    name: '低报警值',
                    value: twaValue,
                    unit: gasData.limits.TWA.unit,
                    basis: 'TWA值',
                    action: '启动通风，准备防护'
                },
                highAlarm: {
                    name: '高报警值',
                    value: stelValue,
                    unit: gasData.limits.TWA.unit,
                    basis: 'STEL值',
                    action: '立即撤离，启动应急'
                }
            };
        }

        if (gasType === 'combustible' && gasData.limits.LEL) {
            const lelValue = gasData.limits.LEL.value;

            alarmSettings.recommendedSettings = {
                preAlarm: {
                    name: '预警值',
                    value: Math.round(lelValue * 0.25 * 100) / 100,
                    unit: '%LEL',
                    basis: 'LEL的25%',
                    action: '检查泄漏源，加强通风'
                },
                alarm: {
                    name: '报警值',
                    value: Math.round(lelValue * 0.5 * 100) / 100,
                    unit: '%LEL',
                    basis: 'LEL的50%',
                    action: '立即停止作业，切断火源'
                }
            };
        }

        return alarmSettings;
    }

    // 生成监测方案
    generateMonitoringPlan(gases, workplaceType = 'general') {
        const plan = {
            workplaceType: workplaceType,
            monitoringPoints: [],
            detectionRequirements: {},
            maintenanceSchedule: {},
            emergencyProcedures: []
        };

        gases.forEach(gasInfo => {
            const { cas, concentration, exposureTime } = gasInfo;
            const gasData = this.occupationalLimits[cas];

            if (gasData) {
                // 监测点位设置
                plan.monitoringPoints.push({
                    gasName: gasData.name,
                    location: this.getMonitoringLocation(gasData.hazardType),
                    height: this.getMonitoringHeight(gasData.molecularWeight),
                    detectorType: this.getRecommendedDetector(cas),
                    alarmSettings: this.calculateAlarmSettings(cas)
                });

                // 检测要求
                plan.detectionRequirements[gasData.name] = {
                    frequency: this.getDetectionFrequency(concentration, gasData.limits.TWA.value),
                    method: gasData.detectionPrinciple,
                    accuracy: this.getRequiredAccuracy(gasData.limits.TWA.value),
                    range: this.getDetectionRange(gasData)
                };
            }
        });

        // 应急程序
        plan.emergencyProcedures = this.generateEmergencyProcedures(gases);

        return plan;
    }

    // 获取监测点位置建议
    getMonitoringLocation(hazardType) {
        const locations = {
            '化学窒息性': ['操作区域', '密闭空间入口', '低洼区域'],
            '刺激性': ['操作台附近', '通风口上游', '人员活动区'],
            '神经性毒物': ['潜在泄漏点', '操作人员呼吸带', '控制室入口'],
            '致癌性': ['工艺设备周围', '取样点附近', '维修作业区']
        };

        return locations[hazardType] || ['一般工作区域'];
    }

    // 获取监测高度建议
    getMonitoringHeight(molecularWeight) {
        // 空气分子量约29
        if (molecularWeight > 29) {
            return '0.3-0.5米（低于呼吸带，气体较重）';
        } else if (molecularWeight < 29) {
            return '1.8-2.2米（高于呼吸带，气体较轻）';
        } else {
            return '1.2-1.8米（呼吸带高度）';
        }
    }

    // 获取推荐检测器
    getRecommendedDetector(cas) {
        const gasData = this.occupationalLimits[cas];
        const detectorMap = {
            '电化学传感器': 'electrochemical',
            '催化燃烧传感器': 'catalytic',
            '红外传感器': 'infrared',
            'PID光离子化': 'pid'
        };

        const detectorType = detectorMap[gasData.detectionPrinciple] || 'electrochemical';
        return this.detectionMethods[detectorType];
    }

    // 获取检测频次
    getDetectionFrequency(actualConcentration, twaLimit) {
        const ratio = actualConcentration / twaLimit;

        if (ratio > 0.5) {
            return '连续监测';
        } else if (ratio > 0.1) {
            return '每小时检测';
        } else {
            return '每班次检测';
        }
    }

    // 获取所需精度
    getRequiredAccuracy(twaValue) {
        if (twaValue < 1) {
            return '±10%或±0.1mg/m³，取大者';
        } else if (twaValue < 10) {
            return '±15%';
        } else {
            return '±20%';
        }
    }

    // 获取检测量程
    getDetectionRange(gasData) {
        const twaValue = gasData.limits.TWA.value;
        const idlhValue = gasData.limits.IDLH?.value;

        return {
            minimum: twaValue * 0.1,
            maximum: idlhValue || twaValue * 100,
            optimal: `0-${twaValue * 10}`,
            unit: gasData.limits.TWA.unit
        };
    }

    // 生成应急程序
    generateEmergencyProcedures(gases) {
        const procedures = [];

        gases.forEach(gasInfo => {
            const gasData = this.occupationalLimits[gasInfo.cas];
            if (gasData) {
                procedures.push({
                    gasName: gasData.name,
                    hazardType: gasData.hazardType,
                    emergencyActions: this.getEmergencyActions(gasData),
                    firstAid: this.getFirstAidMeasures(gasData),
                    evacuationDistance: this.getEvacuationDistance(gasData)
                });
            }
        });

        return procedures;
    }

    // 获取应急措施
    getEmergencyActions(gasData) {
        const actions = {
            '化学窒息性': [
                '立即切断气源',
                '启动强制通风',
                '疏散人员至上风向',
                '使用正压式呼吸器进入现场'
            ],
            '刺激性': [
                '切断泄漏源',
                '喷雾状水稀释气体',
                '疏散人员，设立警戒区',
                '穿戴全套防护设备'
            ],
            '神经性毒物': [
                '立即切断源头',
                '强制通风换气',
                '建立隔离区',
                '准备特效解毒剂'
            ],
            '致癌性': [
                '控制扩散范围',
                '设立禁区标志',
                '专业队伍处理',
                '长期环境监测'
            ]
        };

        return actions[gasData.hazardType] || actions['化学窒息性'];
    }

    // 获取急救措施
    getFirstAidMeasures(gasData) {
        const measures = {
            '化学窒息性': [
                '迅速脱离现场至空气新鲜处',
                '保持呼吸道通畅',
                '给氧或进行人工呼吸',
                '立即就医'
            ],
            '刺激性': [
                '立即脱离现场',
                '清水冲洗眼部和皮肤',
                '如误吸入立即吸氧',
                '严重者立即送医'
            ],
            '神经性毒物': [
                '迅速脱离中毒环境',
                '保持安静，避免活动',
                '给氧，注意保温',
                '尽快送医院救治'
            ]
        };

        return measures[gasData.hazardType] || measures['化学窒息性'];
    }

    // 获取疏散距离
    getEvacuationDistance(gasData) {
        const distances = {
            '化学窒息性': '50-100米',
            '刺激性': '30-50米',
            '神经性毒物': '100-200米',
            '致癌性': '200-500米'
        };

        return distances[gasData.hazardType] || '50米';
    }

    // 导出监测方案
    exportMonitoringPlan(plan, format = 'json') {
        const exportData = {
            title: '有毒有害气体监测方案',
            generateDate: new Date().toISOString().split('T')[0],
            standard: 'GBZ 2.1-2019',
            plan: plan,
            disclaimer: '本方案仅供参考，具体实施应结合现场实际情况'
        };

        switch (format) {
            case 'json':
                return JSON.stringify(exportData, null, 2);
            case 'pdf':
                return this.generatePDFReport(exportData);
            case 'excel':
                return this.generateExcelReport(exportData);
            default:
                return exportData;
        }
    }

    // 生成PDF报告（占位符）
    generatePDFReport(data) {
        return 'PDF报告生成功能开发中...';
    }

    // 生成Excel报告（占位符）
    generateExcelReport(data) {
        return 'Excel报告生成功能开发中...';
    }
}
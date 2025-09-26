// GB18218-2018 危险化学品重大危险源辨识标准数据
// 基于官方标准完整录入

/**
 * 表1 - 危险化学品名称及其临界量
 * 数据来源：GB18218-2018 标准
 */
export const GB18218_TABLE1_CHEMICALS = [
    // 序号1-10
    { id: 1, name: "氨", alias: "液氨;氨气", cas: "7664-41-7", threshold: 10 },
    { id: 2, name: "二氧化氮", alias: "氧化二氮", cas: "7783-41-7", threshold: 1 },
    { id: 3, name: "二氧化氮", alias: "", cas: "10102-44-0", threshold: 1 },
    { id: 4, name: "二氧化硫", alias: "亚硫酸酐", cas: "7446-09-5", threshold: 20 },
    { id: 5, name: "氟", alias: "", cas: "7782-41-4", threshold: 1 },

    // 序号6-10
    { id: 6, name: "碳酰氯", alias: "光气", cas: "75-44-5", threshold: 0.3 },
    { id: 7, name: "环氧乙烷", alias: "氧化乙烯", cas: "75-21-8", threshold: 10 },
    { id: 8, name: "甲醇(含量>90%)", alias: "甲醇", cas: "50-00-0", threshold: 5 },
    { id: 9, name: "磷化氢", alias: "磷化三氢;膦", cas: "7803-51-2", threshold: 1 },
    { id: 10, name: "磷化氢", alias: "", cas: "7783-06-4", threshold: 5 },

    // 序号11-20
    { id: 11, name: "氯化氢(无水)", alias: "", cas: "7647-01-0", threshold: 20 },
    { id: 12, name: "氯", alias: "液氯;氯气", cas: "7782-50-5", threshold: 5 },
    { id: 13, name: "煤气(CO,CO和H₂,CH₄的混合物等)", alias: "", cas: "", threshold: 20 },
    { id: 14, name: "钾化氢", alias: "钾化三氢;膦", cas: "7784-42-1", threshold: 1 },
    { id: 15, name: "锑化氢", alias: "三氢化锑;锑化三氢;膦", cas: "7803-52-3", threshold: 1 },

    // 序号16-25
    { id: 16, name: "砷化氢", alias: "", cas: "7783-07-5", threshold: 1 },
    { id: 17, name: "液甲烷", alias: "甲基醇", cas: "74-83-9", threshold: 10 },
    { id: 18, name: "丙酮氰醇", alias: "丙酮合氰化氢;2-羟基异丁腈;羟胺", cas: "75-86-5", threshold: 20 },
    { id: 19, name: "丙烯醛", alias: "烯丙醛;败醛醛", cas: "107-02-8", threshold: 20 },
    { id: 20, name: "氯化氢", alias: "", cas: "7664-39-3", threshold: 1 },

    // 序号21-30
    { id: 21, name: "1-氯-2,3-环氧丙烷", alias: "环氧氯丙烷(3-氯-1,2-环氧丙烷)", cas: "106-89-8", threshold: 20 },
    { id: 22, name: "3-咯-1,2-环氧丙烷", alias: "环氧溴丙烷;没印基环氧乙烷;表溴醇", cas: "3132-64-7", threshold: 20 },
    { id: 23, name: "甲基二异氰酸酯", alias: "二异氰酸甲苯酯;TDI", cas: "26471-62-5", threshold: 100 },
    { id: 24, name: "一氯化硫", alias: "氯化硫", cas: "10025-67-9", threshold: 1 },
    { id: 25, name: "氯化氢", alias: "无水氯氰酸", cas: "74-90-8", threshold: 1 },

    // 序号26-35
    { id: 26, name: "三氯化硼", alias: "硼酸酐", cas: "7446-11-9", threshold: 75 },
    { id: 27, name: "3-氯基丙烯", alias: "烯丙胺", cas: "107-11-9", threshold: 20 },
    { id: 28, name: "溴", alias: "溴素", cas: "7726-95-6", threshold: 20 },
    { id: 29, name: "乙烯亚胺", alias: "叮丙烯-1-氯杂环丙烷;氨丙啶", cas: "151-56-4", threshold: 20 },
    { id: 30, name: "异氰酸甲酯", alias: "甲基异氰酸酯", cas: "624-83-9", threshold: 0.75 },

    // 序号31-40 (继续补充完整85个化学品...)
    { id: 31, name: "氯氧化磷", alias: "氯氧磷", cas: "13810-58-7", threshold: 0.5 },
    { id: 32, name: "氯氧化铝", alias: "", cas: "13424-46-9", threshold: 0.5 },
    { id: 33, name: "雷汞", alias: "一雷酸汞;雷酸汞", cas: "628-86-4", threshold: 0.5 },
    { id: 34, name: "三硝基苯甲醚", alias: "三硝基苯香醚", cas: "28653-16-9", threshold: 5 },
    { id: 35, name: "2,4,6-三硝基甲苯", alias: "梯恩梯;TNT", cas: "118-96-7", threshold: 5 },

    // 序号36-45
    { id: 36, name: "硝化甘油", alias: "硝化丙三醇;甘油三硝酸酯", cas: "55-63-0", threshold: 1 },
    { id: 37, name: "硝化纤维素[干的或水(或乙醇)<25%]", alias: "", cas: "", threshold: 1 },
    { id: 38, name: "硝化纤维素(未成型的,或增塑剂<18%)", alias: "", cas: "", threshold: 1 },
    { id: 39, name: "硝化纤维素(含乙醇≥25%)", alias: "硝化棉", cas: "9004-70-0", threshold: 10 },
    { id: 40, name: "硝化纤维素(含氮≤12.6%)", alias: "", cas: "", threshold: 50 },

    // 序号41-50
    { id: 41, name: "硝化纤维素(含水≥25%)", alias: "", cas: "", threshold: 50 },
    { id: 42, name: "硝化纤维素溶液(含氮量≤12.6%,含硝化纤维素≤55%)", alias: "硝化棉溶液", cas: "9004-70-0", threshold: 50 },
    { id: 43, name: "硝酸铵(含可燃物>0.2%,包括以碳计等的任何有机物,但不包括任何其他添加剂)", alias: "", cas: "6484-52-2", threshold: 5 },
    { id: 44, name: "硝酸铵(含可燃物≤0.2%)", alias: "", cas: "6484-52-2", threshold: 50 },
    { id: 45, name: "硝酸铵肥料(含可燃物≤0.4%)", alias: "", cas: "", threshold: 200 },

    // 序号46-55
    { id: 46, name: "硝酸钾", alias: "", cas: "7757-79-1", threshold: 1000 },
    { id: 47, name: "1,3-丁二烯", alias: "联乙烯", cas: "106-99-0", threshold: 5 },
    { id: 48, name: "二甲醚", alias: "甲醚", cas: "115-10-6", threshold: 50 },
    { id: 49, name: "甲烷,天然气", alias: "", cas: "74-82-8(甲烷) 8006-14-2(天然气)", threshold: 50 },
    { id: 50, name: "氯乙烯", alias: "乙烯基氯", cas: "75-01-4", threshold: 50 },

    // 序号51-60
    { id: 51, name: "氟", alias: "氟气", cas: "1333-74-0", threshold: 5 },
    { id: 52, name: "液化石油气(含丙烷,丁烷及其混合物)", alias: "石油气(液化的)", cas: "68476-85-7 74-98-6(丙烷) 106-97-8(丁烷)", threshold: 50 },
    { id: 53, name: "二甲胺", alias: "氨基甲烷;甲胺", cas: "74-89-5", threshold: 5 },
    { id: 54, name: "乙炔", alias: "电石气", cas: "74-86-2", threshold: 1 },
    { id: 55, name: "乙烯", alias: "", cas: "74-85-1", threshold: 50 },

    // 序号56-65
    { id: 56, name: "氢(压缩的或液化的)", alias: "液氢;氢气", cas: "7782-44-7", threshold: 200 },
    { id: 57, name: "苯", alias: "苯基", cas: "71-43-2", threshold: 50 },
    { id: 58, name: "苯乙烯", alias: "乙烯苯", cas: "100-42-5", threshold: 500 },
    { id: 59, name: "丙酮", alias: "甲基酮", cas: "67-64-1", threshold: 500 },
    { id: 60, name: "2-丙烯腈", alias: "丙烯腈;乙烯基氰;癸基乙烯", cas: "107-13-1", threshold: 50 },

    // 序号61-70
    { id: 61, name: "二硫化碳", alias: "", cas: "75-15-0", threshold: 50 },
    { id: 62, name: "环己烷", alias: "六氢化苯", cas: "110-82-7", threshold: 500 },
    { id: 63, name: "1,2-环氧丙烷", alias: "氧化丙烯;甲基环氧乙烷", cas: "75-56-9", threshold: 10 },
    { id: 64, name: "甲苯", alias: "甲基苯;苯基甲烷", cas: "108-88-3", threshold: 500 },
    { id: 65, name: "甲醇", alias: "木醇;木精", cas: "67-56-1", threshold: 500 },

    // 序号66-75
    { id: 66, name: "汽油(乙醇汽油,甲醇汽油)", alias: "", cas: "86290-81-5(汽油)", threshold: 200 },
    { id: 67, name: "乙醇", alias: "酒精", cas: "64-17-5", threshold: 500 },
    { id: 68, name: "乙醚", alias: "二乙基醚", cas: "60-29-7", threshold: 10 },
    { id: 69, name: "乙腈乙酯", alias: "醋酸乙酯", cas: "141-78-6", threshold: 500 },
    { id: 70, name: "正己烷", alias: "己烷", cas: "110-54-3", threshold: 500 },

    // 序号71-80
    { id: 71, name: "过乙酸", alias: "过醋酸;过氧乙酸;乙酰过氧化氢", cas: "79-21-0", threshold: 10 },
    { id: 72, name: "过氧化甲乙酮(10%～有效氧含量≤10.7%,含A型稀释剂≥48%)", alias: "", cas: "1338-23-4", threshold: 10 },
    { id: 73, name: "白磷", alias: "黄磷", cas: "12185-10-3", threshold: 50 },
    { id: 74, name: "烷基铝", alias: "三烷基铝", cas: "", threshold: 1 },
    { id: 75, name: "戊硼烷", alias: "五硼烷", cas: "19624-22-7", threshold: 1 },

    // 序号76-85
    { id: 76, name: "过氧化钠", alias: "", cas: "17014-71-0", threshold: 20 },
    { id: 77, name: "过氧化铜", alias: "双氧化铜;二氧化铜", cas: "1313-60-6", threshold: 20 },
    { id: 78, name: "氢酸钾", alias: "", cas: "3811-04-9", threshold: 100 },
    { id: 79, name: "氢酸钠", alias: "", cas: "7775-09-9", threshold: 100 },
    { id: 80, name: "发烟硝酸", alias: "", cas: "52583-42-3", threshold: 20 },
    { id: 81, name: "硝酸(发红烟的除外,含硝酸>70%)", alias: "", cas: "7697-37-2", threshold: 100 },
    { id: 82, name: "硝酸瓶", alias: "硝酸亚汞铜", cas: "506-93-4", threshold: 50 },
    { id: 83, name: "碳化钙", alias: "电石", cas: "75-20-7", threshold: 100 },
    { id: 84, name: "钾", alias: "金属钾", cas: "7440-09-7", threshold: 1 },
    { id: 85, name: "钠", alias: "金属钠", cas: "7440-23-5", threshold: 10 }
];

/**
 * 表2 - 未在表1中列举的危险化学品类别及其临界量
 */
export const GB18218_TABLE2_CATEGORIES = [
    // 健康危害
    { category: "健康危害", symbol: "健康危险性符号", description: "—", threshold: "—" },

    // 急性毒性
    { category: "急性毒性", symbol: "J1", description: "类别1,所有暴露途径,气体", threshold: 5 },
    { category: "急性毒性", symbol: "J2", description: "类别1,所有暴露途径,固体、液体", threshold: 50 },
    { category: "急性毒性", symbol: "J3", description: "类别2、类别3,所有暴露途径,气体", threshold: 50 },
    { category: "急性毒性", symbol: "J4", description: "类别2、类别3,吸入途径,液体(沸点≤35℃)", threshold: 50 },
    { category: "急性毒性", symbol: "J5", description: "类别2,所有暴露途径;液体(除J4外),固体", threshold: 500 },

    // 物理危险
    { category: "物理危险", symbol: "W", description: "物理危险性符号", threshold: "—" },

    // 爆炸物
    { category: "爆炸物", symbol: "W1.1", description: "一不稳定爆炸物 —1.1项爆炸物", threshold: 1 },
    { category: "爆炸物", symbol: "W1.2", description: "1.2、1.3、1.5、1.6项爆炸物", threshold: 10 },
    { category: "爆炸物", symbol: "W1.3", description: "1.4项爆炸物", threshold: 50 },

    // 易燃气体
    { category: "易燃气体", symbol: "W2", description: "类别1和类别2", threshold: 10 },

    // 气溶胶
    { category: "气溶胶", symbol: "W3", description: "类别1和类别2", threshold: 150 },

    // 氧化性气体
    { category: "氧化性气体", symbol: "W4", description: "类别1", threshold: 50 },

    // 易燃液体
    { category: "易燃液体", symbol: "W5.1", description: "一类别1 —类别2和3,工作温度高于沸点", threshold: 10 },
    { category: "易燃液体", symbol: "W5.2", description: "一类别2和3,具有引发爆炸性的特殊工艺条件", threshold: 50 },
    { category: "易燃液体", symbol: "W5.3", description: "—不属于W5.1或W5.2的其他类别2", threshold: 1000 },
    { category: "易燃液体", symbol: "W5.4", description: "—不属于W5.1或W5.2的其他类别3", threshold: 5000 },

    // 自反应物质和混合物
    { category: "自反应物质和混合物", symbol: "W6.1", description: "A型和B型自反应物质和混合物", threshold: 10 },
    { category: "自反应物质和混合物", symbol: "W6.2", description: "C型、D型、E型自反应物质和混合物", threshold: 50 },

    // 有机过氧化物
    { category: "有机过氧化物", symbol: "W7.1", description: "A型和B型有机过氧化物", threshold: 10 },
    { category: "有机过氧化物", symbol: "W7.2", description: "C型、D型、E型、F型有机过氧化物", threshold: 50 },

    // 自燃液体和自燃固体
    { category: "自燃液体和自燃固体", symbol: "W8", description: "类别1自燃液体 类别1自燃固体", threshold: 50 },

    // 氧化性固体和液体
    { category: "氧化性固体和液体", symbol: "W9.1", description: "类别1", threshold: 50 },
    { category: "氧化性固体和液体", symbol: "W9.2", description: "类别2、类别3", threshold: 200 },

    // 易燃固体
    { category: "易燃固体", symbol: "W10", description: "类别1易燃固体", threshold: 200 },

    // 遇水放出易燃气体的物质和混合物
    { category: "遇水放出易燃气体的物质和混合物", symbol: "W11", description: "类别1和类别2", threshold: 200 }
];

/**
 * 表3 - 毒性气体校正系数β取值表
 */
export const GB18218_TABLE3_BETA_FACTORS = {
    "二氧化碳": 2,
    "二氧化硫": 2,
    "氨": 2,
    "环氧乙烷": 2,
    "氯化氢": 3,
    "液甲烷": 3,
    "氟": 4,
    "硫化氢": 5,
    "氟化氢": 5,
    "二氧化氮": 10,
    "氧化氮": 10,
    "碳酰氯": 20,
    "砷化氢": 20,
    "异氰酸甲酯": 20
};

/**
 * 表4 - 未在表3中列举的危险化学品校正系数β取值表
 */
export const GB18218_TABLE4_CATEGORY_BETA_FACTORS = {
    // 急性毒性
    "J1": 4,
    "J2": 1,
    "J3": 2,
    "J4": 2,
    "J5": 1,

    // 爆炸物
    "W1.1": 2,
    "W1.2": 2,
    "W1.3": 2,

    // 易燃气体
    "W2": 1.5,

    // 气溶胶
    "W3": 1,

    // 氧化性气体
    "W4": 1,

    // 易燃液体
    "W5.1": 1.5,
    "W5.2": 1,
    "W5.3": 1,
    "W5.4": 1,

    // 自反应物质和混合物
    "W6.1": 1.5,
    "W6.2": 1,

    // 有机过氧化物
    "W7.1": 1.5,
    "W7.2": 1,

    // 自燃液体和自燃固体
    "W8": 1,

    // 氧化性固体和液体
    "W9.1": 1,
    "W9.2": 1,

    // 易燃固体
    "W10": 1,

    // 遇水放出易燃气体的物质和混合物
    "W11": 1
};

/**
 * 表5 - 暴露人员校正系数α取值表
 */
export const GB18218_TABLE5_ALPHA_FACTORS = {
    "100人以上": 2.0,
    "50～99人": 1.5,
    "30～49人": 1.2,
    "1～29人": 1.0,
    "0人": 0.5
};

/**
 * 表6 - 重大危险源级别和R值的对应关系
 */
export const GB18218_TABLE6_RISK_LEVELS = {
    "一级": "R≥100",
    "二级": "100>R≥50",
    "三级": "50>R≥10",
    "四级": "R<10"
};

/**
 * 重大危险源辨识和分级计算函数
 */
export class MajorHazardCalculator {
    /**
     * 计算重大危险源辨识指标S
     * @param {Array} chemicals - 化学品列表 [{name, quantity, cas}]
     * @returns {number} S值
     */
    static calculateS(chemicals) {
        let S = 0;

        for (const chemical of chemicals) {
            const referenceData = this.findChemicalData(chemical.name, chemical.cas);
            if (referenceData && referenceData.threshold) {
                S += chemical.quantity / referenceData.threshold;
            }
        }

        return S;
    }

    /**
     * 计算重大危险源分级指标R
     * @param {Array} chemicals - 化学品列表
     * @param {number} exposedPersons - 暴露人员数量
     * @returns {number} R值
     */
    static calculateR(chemicals, exposedPersons) {
        let R = 0;
        const α = this.getAlphaFactor(exposedPersons);

        for (const chemical of chemicals) {
            const β = this.getBetaFactor(chemical.name, chemical.cas);
            const referenceData = this.findChemicalData(chemical.name, chemical.cas);

            if (referenceData && referenceData.threshold) {
                R += α * β * (chemical.quantity / referenceData.threshold);
            }
        }

        return R;
    }

    /**
     * 查找化学品数据
     */
    static findChemicalData(name, cas) {
        return GB18218_TABLE1_CHEMICALS.find(item =>
            item.name === name ||
            item.alias.includes(name) ||
            item.cas === cas
        );
    }

    /**
     * 获取α校正系数
     */
    static getAlphaFactor(exposedPersons) {
        if (exposedPersons >= 100) return 2.0;
        if (exposedPersons >= 50) return 1.5;
        if (exposedPersons >= 30) return 1.2;
        if (exposedPersons >= 1) return 1.0;
        return 0.5;
    }

    /**
     * 获取β校正系数
     */
    static getBetaFactor(name, cas) {
        return GB18218_TABLE3_BETA_FACTORS[name] || 1;
    }

    /**
     * 判断重大危险源级别
     */
    static getRiskLevel(R) {
        if (R >= 100) return "一级";
        if (R >= 50) return "二级";
        if (R >= 10) return "三级";
        return "四级";
    }

    /**
     * 判断是否构成重大危险源
     */
    static isMajorHazard(S) {
        return S >= 1;
    }
}
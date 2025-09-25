export const localChemicals = [
    {
        name: "苯",
        englishName: "Benzene",
        cas: "71-43-2",
        formula: "C6H6",
        molecularWeight: "78.11",
        meltingPoint: "5.5",
        boilingPoint: "80.1",
        density: "0.8765",
        solubility: "微溶于水",
        appearance: "无色液体",
        odor: "芳香味",
        hazards: [
            { type: "serious", text: "已确定的人类致癌物" },
            { type: "warning", text: "高度易燃液体和蒸气" },
            { type: "warning", text: "可能对血液系统造成伤害" },
            { type: "warning", text: "可能对生殖系统造成损害" }
        ],
        storage: "阴凉通风处，远离火源",
        firstAid: "如接触皮肤：用大量水冲洗；如吸入：移至新鲜空气处",
        applications: "有机合成原料，制备苯乙烯、苯酚等"
    },
    {
        name: "乙醇",
        englishName: "Ethanol",
        cas: "64-17-5",
        formula: "C2H6O",
        molecularWeight: "46.07",
        meltingPoint: "-114.1",
        boilingPoint: "78.37",
        density: "0.789",
        solubility: "与水混溶",
        appearance: "无色透明液体",
        odor: "微甜味",
        hazards: [
            { type: "warning", text: "高度易燃液体和蒸气" },
            { type: "warning", text: "引起严重眼刺激" },
            { type: "caution", text: "可能引起昏昏欲睡和眩晕" }
        ],
        storage: "阴凉通风处，远离火源和热源",
        firstAid: "如接触眼睛：用清水冲洗15分钟；如误服：漱口后就医",
        applications: "溶剂，消毒剂，燃料添加剂"
    },
    {
        name: "甲醛",
        englishName: "Formaldehyde",
        cas: "50-00-0",
        formula: "CH2O",
        molecularWeight: "30.03",
        meltingPoint: "-92",
        boilingPoint: "-19.5",
        density: "0.815",
        solubility: "易溶于水",
        appearance: "无色气体",
        odor: "刺激性气味",
        hazards: [
            { type: "serious", text: "疑似致癌物质" },
            { type: "serious", text: "吞咽致命" },
            { type: "warning", text: "皮肤接触可能引起过敏反应" },
            { type: "warning", text: "引起严重眼损伤" }
        ],
        storage: "密封保存，避免阳光直射",
        firstAid: "如吸入：立即移至新鲜空气处并就医；如接触皮肤：立即用大量水冲洗",
        applications: "树脂制造，防腐剂，消毒剂"
    },
    {
        name: "氨",
        englishName: "Ammonia",
        cas: "7664-41-7",
        formula: "NH3",
        molecularWeight: "17.03",
        meltingPoint: "-77.73",
        boilingPoint: "-33.34",
        density: "0.696",
        solubility: "极易溶于水",
        appearance: "无色气体",
        odor: "强烈刺激性气味",
        hazards: [
            { type: "warning", text: "压缩气体；遇热可能爆炸" },
            { type: "warning", text: "引起严重皮肤灼伤和眼损伤" },
            { type: "warning", text: "可能引起呼吸道刺激" }
        ],
        storage: "储存于阴凉、通风良好的专用库房",
        firstAid: "如接触皮肤：立即用大量水冲洗；如吸入：移至新鲜空气处",
        applications: "化肥原料，制冷剂，清洁剂"
    },
    {
        name: "盐酸",
        englishName: "Hydrochloric acid",
        cas: "7647-01-0",
        formula: "HCl",
        molecularWeight: "36.46",
        meltingPoint: "-114.22",
        boilingPoint: "-85.05",
        density: "1.18",
        solubility: "与水混溶",
        appearance: "无色至淡黄色液体",
        odor: "刺鼻酸味",
        hazards: [
            { type: "serious", text: "引起严重皮肤灼伤和眼损伤" },
            { type: "warning", text: "可能引起呼吸道刺激" },
            { type: "warning", text: "对金属有腐蚀性" }
        ],
        storage: "储存于阴凉、通风良好的库房，远离碱类",
        firstAid: "如接触皮肤：立即用大量水冲洗；如溅入眼睛：用清水冲洗15分钟",
        applications: "金属清洗，化学试剂，食品添加剂"
    },
    {
        name: "硫酸",
        englishName: "Sulfuric acid",
        cas: "7664-93-9",
        formula: "H2SO4",
        molecularWeight: "98.08",
        meltingPoint: "10.31",
        boilingPoint: "337",
        density: "1.84",
        solubility: "与水混溶",
        appearance: "无色油状液体",
        odor: "无味",
        hazards: [
            { type: "serious", text: "引起严重皮肤灼伤和眼损伤" },
            { type: "warning", text: "可能引起呼吸道刺激" },
            { type: "warning", text: "对金属有腐蚀性" }
        ],
        storage: "储存于阴凉、干燥、通风良好的库房",
        firstAid: "如接触皮肤：立即用大量水冲洗；切勿直接用水稀释浓硫酸",
        applications: "化肥制造，石油精炼，蓄电池"
    }
];
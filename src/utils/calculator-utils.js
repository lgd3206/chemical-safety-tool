// 化工实用计算工具集
export class ChemicalCalculatorUtils {
    constructor() {
        this.unitConversions = this.initializeUnitConversions();
        this.physicalConstants = this.initializeConstants();
    }

    initializeUnitConversions() {
        return {
            // 质量单位转换
            mass: {
                kg: 1,
                g: 0.001,
                mg: 0.000001,
                lb: 0.453592,
                oz: 0.0283495
            },
            // 体积单位转换
            volume: {
                L: 1,
                mL: 0.001,
                m³: 1000,
                gal: 3.78541,
                qt: 0.946353,
                pt: 0.473176
            },
            // 温度单位转换(需要特殊处理)
            temperature: {
                celsius: (c) => ({ c, f: c * 9/5 + 32, k: c + 273.15 }),
                fahrenheit: (f) => ({ f, c: (f - 32) * 5/9, k: (f - 32) * 5/9 + 273.15 }),
                kelvin: (k) => ({ k, c: k - 273.15, f: (k - 273.15) * 9/5 + 32 })
            },
            // 压力单位转换
            pressure: {
                Pa: 1,
                kPa: 1000,
                MPa: 1000000,
                atm: 101325,
                bar: 100000,
                psi: 6894.76,
                mmHg: 133.322,
                torr: 133.322
            }
        };
    }

    initializeConstants() {
        return {
            R: 8.314, // 气体常数 J/(mol·K)
            NA: 6.022e23, // 阿伏伽德罗常数
            STP_VOLUME: 22.4, // 标准状况下气体摩尔体积 L/mol
            WATER_DENSITY: 1.0, // 水的密度 g/mL (4°C)
            STANDARD_PRESSURE: 101325, // 标准大气压 Pa
            STANDARD_TEMPERATURE: 273.15 // 标准温度 K
        };
    }

    // 单位换算
    convertUnits(value, fromUnit, toUnit, unitType) {
        if (!this.unitConversions[unitType]) {
            throw new Error(`不支持的单位类型: ${unitType}`);
        }

        const conversions = this.unitConversions[unitType];

        // 温度需要特殊处理
        if (unitType === 'temperature') {
            if (!conversions[fromUnit]) {
                throw new Error(`不支持的温度单位: ${fromUnit}`);
            }
            const converted = conversions[fromUnit](value);
            return converted[toUnit.charAt(0)]; // 取第一个字母作为键
        }

        if (!conversions[fromUnit] || !conversions[toUnit]) {
            throw new Error(`不支持的单位: ${fromUnit} 或 ${toUnit}`);
        }

        // 先转换为基准单位，再转换为目标单位
        const baseValue = value * conversions[fromUnit];
        return baseValue / conversions[toUnit];
    }

    // 浓度计算
    calculateConcentration(options) {
        const { type, solute, solvent, temperature = 25 } = options;

        switch (type) {
            case 'molarity':
                return this.calculateMolarity(solute.moles, solvent.volume);

            case 'molality':
                return this.calculateMolality(solute.moles, solvent.mass);

            case 'mass_percent':
                return this.calculateMassPercent(solute.mass, solvent.mass);

            case 'volume_percent':
                return this.calculateVolumePercent(solute.volume, solvent.volume);

            case 'ppm':
                return this.calculatePPM(solute.mass, solvent.mass);

            case 'ppb':
                return this.calculatePPB(solute.mass, solvent.mass);

            default:
                throw new Error(`不支持的浓度类型: ${type}`);
        }
    }

    // 摩尔浓度 (mol/L)
    calculateMolarity(moles, volumeL) {
        return moles / volumeL;
    }

    // 质量摩尔浓度 (mol/kg)
    calculateMolality(moles, solventMassKg) {
        return moles / solventMassKg;
    }

    // 质量百分浓度 (%)
    calculateMassPercent(soluteMass, solventMass) {
        return (soluteMass / (soluteMass + solventMass)) * 100;
    }

    // 体积百分浓度 (%)
    calculateVolumePercent(soluteVolume, solventVolume) {
        return (soluteVolume / (soluteVolume + solventVolume)) * 100;
    }

    // ppm计算
    calculatePPM(soluteMass, totalMass) {
        return (soluteMass / totalMass) * 1000000;
    }

    // ppb计算
    calculatePPB(soluteMass, totalMass) {
        return (soluteMass / totalMass) * 1000000000;
    }

    // 溶液稀释计算 (C1V1 = C2V2)
    calculateDilution(c1, v1, c2, v2) {
        if (c1 && v1 && c2) {
            return { v2: (c1 * v1) / c2 };
        }
        if (c1 && v1 && v2) {
            return { c2: (c1 * v1) / v2 };
        }
        if (c2 && v1 && v2) {
            return { c1: (c2 * v2) / v1 };
        }
        if (c1 && c2 && v2) {
            return { v1: (c2 * v2) / c1 };
        }
        throw new Error('参数不足，无法计算');
    }

    // pH计算
    calculatePH(hConcentration) {
        if (hConcentration <= 0) {
            throw new Error('氢离子浓度必须大于0');
        }
        return -Math.log10(hConcentration);
    }

    // 从pH计算氢离子浓度
    calculateHConcentrationFromPH(pH) {
        return Math.pow(10, -pH);
    }

    // pOH计算
    calculatePOH(ohConcentration) {
        if (ohConcentration <= 0) {
            throw new Error('氢氧根离子浓度必须大于0');
        }
        return -Math.log10(ohConcentration);
    }

    // 理想气体状态方程 PV = nRT
    calculateIdealGas(options) {
        const { P, V, n, T } = options;
        const R = this.physicalConstants.R;

        if (P && V && n) {
            return { T: (P * V) / (n * R) };
        }
        if (P && V && T) {
            return { n: (P * V) / (R * T) };
        }
        if (P && n && T) {
            return { V: (n * R * T) / P };
        }
        if (V && n && T) {
            return { P: (n * R * T) / V };
        }
        throw new Error('参数不足，无法计算');
    }

    // 反应化学计量计算
    calculateStoichiometry(reaction, knownSubstance, knownAmount, targetSubstance) {
        // 简化的化学计量计算
        // 实际应用中需要解析化学方程式
        const molarRatio = reaction.coefficients[targetSubstance] / reaction.coefficients[knownSubstance];
        return knownAmount * molarRatio;
    }

    // 分子量计算（基于原子量）
    calculateMolarMass(formula) {
        const atomicMasses = {
            H: 1.008, He: 4.003, Li: 6.941, Be: 9.012, B: 10.811, C: 12.011, N: 14.007, O: 15.999,
            F: 18.998, Ne: 20.180, Na: 22.990, Mg: 24.305, Al: 26.982, Si: 28.086, P: 30.974, S: 32.065,
            Cl: 35.453, Ar: 39.948, K: 39.098, Ca: 40.078, Fe: 55.845, Cu: 63.546, Zn: 65.38, Br: 79.904,
            I: 126.90, Pb: 207.2
        };

        let totalMass = 0;
        const regex = /([A-Z][a-z]?)(\d*)/g;
        let match;

        while ((match = regex.exec(formula)) !== null) {
            const element = match[1];
            const count = parseInt(match[2]) || 1;

            if (atomicMasses[element]) {
                totalMass += atomicMasses[element] * count;
            } else {
                throw new Error(`未知元素: ${element}`);
            }
        }

        return totalMass;
    }

    // 密度和浓度转换
    convertDensityToConcentration(density, molarMass, purity = 1) {
        // 密度(g/mL) -> 摩尔浓度(mol/L)
        return (density * 1000 * purity) / molarMass;
    }

    // 蒸气压计算（Antoine方程简化版）
    calculateVaporPressure(temperature, A, B, C) {
        // log10(P) = A - B/(C + T)
        // P: 蒸气压(mmHg), T: 温度(°C)
        return Math.pow(10, A - B / (C + temperature));
    }

    // 混合溶液计算
    calculateMixture(solutions) {
        let totalVolume = 0;
        let totalMoles = 0;

        solutions.forEach(solution => {
            totalVolume += solution.volume;
            totalMoles += solution.molarity * solution.volume;
        });

        return {
            finalVolume: totalVolume,
            finalMolarity: totalMoles / totalVolume,
            totalMoles: totalMoles
        };
    }

    // 化学平衡常数相关计算
    calculateEquilibriumConstant(concentrations, coefficients) {
        let Kc = 1;

        Object.keys(concentrations).forEach(substance => {
            const concentration = concentrations[substance];
            const coefficient = coefficients[substance];

            if (coefficient > 0) { // 产物
                Kc *= Math.pow(concentration, coefficient);
            } else { // 反应物
                Kc /= Math.pow(concentration, Math.abs(coefficient));
            }
        });

        return Kc;
    }

    // 格式化计算结果
    formatResult(value, unit, precision = 4) {
        if (typeof value !== 'number' || isNaN(value)) {
            return '无效数值';
        }

        const formatted = parseFloat(value.toFixed(precision));
        return `${formatted} ${unit}`;
    }

    // 科学计数法格式化
    toScientificNotation(value, precision = 2) {
        return value.toExponential(precision);
    }
}
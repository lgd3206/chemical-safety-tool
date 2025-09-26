export class ChemicalCalculatorUtils {
    constructor() {
        this.unitConversions = {
            mass: {
                kg: 1,
                g: 0.001,
                mg: 0.000001
            },
            volume: {
                L: 1,
                mL: 0.001,
                m3: 1000
            },
            pressure: {
                Pa: 1,
                kPa: 1000,
                atm: 101325
            }
        };
    }

    convertUnits(value, fromUnit, toUnit, unitType) {
        if (!this.unitConversions[unitType]) {
            throw new Error('不支持的单位类型');
        }

        const conversions = this.unitConversions[unitType];
        if (!conversions[fromUnit] || !conversions[toUnit]) {
            throw new Error('不支持的单位');
        }

        const baseValue = value * conversions[fromUnit];
        return baseValue / conversions[toUnit];
    }

    formatResult(value, unit, precision = 4) {
        if (typeof value !== 'number' || isNaN(value)) {
            return '无效数值';
        }
        const formatted = parseFloat(value.toFixed(precision));
        return formatted + ' ' + unit;
    }
}
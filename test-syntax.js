// 测试语法错误的简化版本
export class TestCalculator {
    constructor() {
        this.units = {
            volume: {
                L: 1,
                mL: 0.001,
                m3: 1000
            }
        };
    }

    test() {
        console.log('语法测试通过');
    }
}
import { localChemicals } from '../data/chemicals.js';

export class LocalDataService {
    constructor() {
        this.chemicals = localChemicals;
    }

    // 按名称搜索（支持中文名和英文名）
    searchByName(query) {
        const searchQuery = query.toLowerCase().trim();

        const results = this.chemicals.filter(chemical =>
            chemical.name.toLowerCase().includes(searchQuery) ||
            chemical.englishName.toLowerCase().includes(searchQuery)
        );

        return results.length > 0 ? results[0] : null;
    }

    // 按CAS号搜索
    searchByCAS(cas) {
        const cleanCAS = cas.replace(/[\s-]/g, '');

        const result = this.chemicals.find(chemical =>
            chemical.cas.replace(/[\s-]/g, '') === cleanCAS
        );

        return result || null;
    }

    // 按分子式搜索
    searchByFormula(formula) {
        const cleanFormula = formula.replace(/\s/g, '').toLowerCase();

        const result = this.chemicals.find(chemical =>
            chemical.formula.replace(/\s/g, '').toLowerCase() === cleanFormula
        );

        return result || null;
    }

    // 模糊搜索
    fuzzySearch(query) {
        const searchQuery = query.toLowerCase().trim();

        const results = this.chemicals.filter(chemical => {
            const nameMatch = chemical.name.toLowerCase().includes(searchQuery);
            const englishNameMatch = chemical.englishName.toLowerCase().includes(searchQuery);
            const casMatch = chemical.cas.includes(searchQuery);
            const formulaMatch = chemical.formula.toLowerCase().includes(searchQuery);

            return nameMatch || englishNameMatch || casMatch || formulaMatch;
        });

        // 按匹配度排序
        return results.sort((a, b) => {
            const aScore = this.getMatchScore(a, searchQuery);
            const bScore = this.getMatchScore(b, searchQuery);
            return bScore - aScore;
        });
    }

    // 计算匹配度分数
    getMatchScore(chemical, query) {
        let score = 0;
        const queryLower = query.toLowerCase();

        // 完全匹配得分最高
        if (chemical.name.toLowerCase() === queryLower) score += 100;
        if (chemical.englishName.toLowerCase() === queryLower) score += 100;
        if (chemical.cas === query) score += 100;
        if (chemical.formula.toLowerCase() === queryLower) score += 100;

        // 开头匹配
        if (chemical.name.toLowerCase().startsWith(queryLower)) score += 50;
        if (chemical.englishName.toLowerCase().startsWith(queryLower)) score += 50;

        // 包含匹配
        if (chemical.name.toLowerCase().includes(queryLower)) score += 10;
        if (chemical.englishName.toLowerCase().includes(queryLower)) score += 10;
        if (chemical.cas.includes(query)) score += 10;
        if (chemical.formula.toLowerCase().includes(queryLower)) score += 10;

        return score;
    }

    // 获取所有化学品列表
    getAllChemicals() {
        return this.chemicals;
    }

    // 按危险性分类获取化学品
    getByHazardLevel(level) {
        return this.chemicals.filter(chemical =>
            chemical.hazards.some(hazard => hazard.type === level)
        );
    }

    // 获取化学品总数
    getTotalCount() {
        return this.chemicals.length;
    }

    // 添加新化学品到本地数据库
    addChemical(chemical) {
        // 验证必要字段
        const requiredFields = ['name', 'englishName', 'cas', 'formula'];
        for (const field of requiredFields) {
            if (!chemical[field]) {
                throw new Error(`缺少必要字段: ${field}`);
            }
        }

        // 检查是否已存在
        const existing = this.searchByCAS(chemical.cas);
        if (existing) {
            throw new Error(`CAS号 ${chemical.cas} 已存在`);
        }

        this.chemicals.push(chemical);
        return chemical;
    }

    // 更新化学品信息
    updateChemical(cas, updatedData) {
        const index = this.chemicals.findIndex(chemical => chemical.cas === cas);
        if (index === -1) {
            throw new Error(`未找到CAS号为 ${cas} 的化学品`);
        }

        this.chemicals[index] = { ...this.chemicals[index], ...updatedData };
        return this.chemicals[index];
    }

    // 删除化学品
    deleteChemical(cas) {
        const index = this.chemicals.findIndex(chemical => chemical.cas === cas);
        if (index === -1) {
            throw new Error(`未找到CAS号为 ${cas} 的化学品`);
        }

        return this.chemicals.splice(index, 1)[0];
    }
}
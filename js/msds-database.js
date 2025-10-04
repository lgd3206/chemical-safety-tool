/**
 * MSDS化学品数据库管理系统
 * 用于存储和查询化学品安全技术说明书数据
 */

class MSDSDatabase {
    constructor() {
        this.dbName = 'ChemicalSafetyDB';
        this.version = 1;
        this.db = null;
        this.init();
    }

    /**
     * 初始化IndexedDB数据库
     */
    async init() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.version);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                this.db = request.result;
                console.log('MSDS数据库初始化成功');
                resolve(this.db);
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;

                // 创建化学品基础信息表
                if (!db.objectStoreNames.contains('chemicals')) {
                    const objectStore = db.createObjectStore('chemicals', {
                        keyPath: 'id',
                        autoIncrement: true
                    });

                    // 创建索引
                    objectStore.createIndex('chineseName', 'chineseName', { unique: false });
                    objectStore.createIndex('englishName', 'englishName', { unique: false });
                    objectStore.createIndex('casNumber', 'casNumber', { unique: false });
                    objectStore.createIndex('unNumber', 'unNumber', { unique: false });
                }

                // 创建批次导入记录表
                if (!db.objectStoreNames.contains('importRecords')) {
                    const importStore = db.createObjectStore('importRecords', {
                        keyPath: 'id',
                        autoIncrement: true
                    });
                    importStore.createIndex('importDate', 'importDate', { unique: false });
                }
            };
        });
    }

    /**
     * 添加化学品
     */
    async addChemical(chemicalData) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['chemicals'], 'readwrite');
            const objectStore = transaction.objectStore('chemicals');

            const request = objectStore.add(chemicalData);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    /**
     * 批量导入化学品数据
     */
    async batchImport(chemicalsArray, batchInfo) {
        const transaction = this.db.transaction(['chemicals', 'importRecords'], 'readwrite');
        const chemicalStore = transaction.objectStore('chemicals');
        const importStore = transaction.objectStore('importRecords');

        let successCount = 0;
        let failCount = 0;
        const errors = [];

        return new Promise((resolve, reject) => {
            // 记录导入信息
            importStore.add({
                fileName: batchInfo.fileName,
                importDate: new Date().toISOString(),
                totalCount: chemicalsArray.length,
                status: 'processing'
            });

            // 批量添加
            chemicalsArray.forEach((chemical, index) => {
                const request = chemicalStore.add({
                    ...chemical,
                    importDate: new Date().toISOString(),
                    batchName: batchInfo.fileName
                });

                request.onsuccess = () => successCount++;
                request.onerror = () => {
                    failCount++;
                    errors.push({ index, error: request.error });
                };
            });

            transaction.oncomplete = () => {
                resolve({
                    success: true,
                    successCount,
                    failCount,
                    totalCount: chemicalsArray.length,
                    errors
                });
            };

            transaction.onerror = () => reject(transaction.error);
        });
    }

    /**
     * 搜索化学品
     */
    async search(keyword) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['chemicals'], 'readonly');
            const objectStore = transaction.objectStore('chemicals');
            const results = [];

            objectStore.openCursor().onsuccess = (event) => {
                const cursor = event.target.result;
                if (cursor) {
                    const data = cursor.value;
                    const searchText = keyword.toLowerCase();

                    if (data.chineseName?.toLowerCase().includes(searchText) ||
                        data.englishName?.toLowerCase().includes(searchText) ||
                        data.casNumber?.includes(searchText) ||
                        data.unNumber?.includes(searchText)) {
                        results.push(data);
                    }
                    cursor.continue();
                } else {
                    resolve(results);
                }
            };
        });
    }

    /**
     * 高级搜索（多条件筛选）
     */
    async advancedSearch(criteria) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['chemicals'], 'readonly');
            const objectStore = transaction.objectStore('chemicals');
            const results = [];

            objectStore.openCursor().onsuccess = (event) => {
                const cursor = event.target.result;
                if (cursor) {
                    const chemical = cursor.value;
                    let match = true;

                    // 名称搜索（中文名或英文名）
                    if (criteria.name) {
                        const nameKeyword = criteria.name.toLowerCase();
                        const matchName =
                            (chemical.chineseName && chemical.chineseName.toLowerCase().includes(nameKeyword)) ||
                            (chemical.englishName && chemical.englishName.toLowerCase().includes(nameKeyword));
                        match = match && matchName;
                    }

                    // CAS号搜索
                    if (criteria.cas) {
                        const casMatch = chemical.casNumber &&
                            chemical.casNumber.toLowerCase().includes(criteria.cas.toLowerCase());
                        match = match && casMatch;
                    }

                    // UN号搜索
                    if (criteria.un) {
                        const unMatch = chemical.unNumber &&
                            chemical.unNumber.toLowerCase().includes(criteria.un.toLowerCase());
                        match = match && unMatch;
                    }

                    // 分子式搜索
                    if (criteria.formula) {
                        const formulaMatch = chemical.molecularFormula &&
                            chemical.molecularFormula.toLowerCase().includes(criteria.formula.toLowerCase());
                        match = match && formulaMatch;
                    }

                    // 危险特性搜索
                    if (criteria.hazard) {
                        const hazardMatch =
                            (chemical.hazardCharacteristics && chemical.hazardCharacteristics.includes(criteria.hazard)) ||
                            (chemical.healthHazard && chemical.healthHazard.includes(criteria.hazard)) ||
                            (chemical.flammability && chemical.flammability.includes(criteria.hazard));
                        match = match && hazardMatch;
                    }

                    // 状态搜索
                    if (criteria.state) {
                        const stateMatch = chemical.appearance &&
                            chemical.appearance.includes(criteria.state);
                        match = match && stateMatch;
                    }

                    if (match) {
                        results.push(chemical);
                    }

                    cursor.continue();
                } else {
                    resolve(results);
                }
            };

            transaction.onerror = () => reject(transaction.error);
        });
    }

    /**
     * 获取所有化学品（分页）
     */
    async getAll(page = 1, pageSize = 20) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['chemicals'], 'readonly');
            const objectStore = transaction.objectStore('chemicals');
            const results = [];
            let count = 0;
            const skip = (page - 1) * pageSize;

            objectStore.openCursor().onsuccess = (event) => {
                const cursor = event.target.result;
                if (cursor) {
                    if (count >= skip && count < skip + pageSize) {
                        results.push(cursor.value);
                    }
                    count++;
                    cursor.continue();
                } else {
                    resolve({
                        data: results,
                        total: count,
                        page,
                        pageSize,
                        totalPages: Math.ceil(count / pageSize)
                    });
                }
            };
        });
    }

    /**
     * 根据ID获取化学品详情
     */
    async getById(id) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['chemicals'], 'readonly');
            const objectStore = transaction.objectStore('chemicals');
            const request = objectStore.get(id);

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    /**
     * 删除化学品
     */
    async deleteChemical(id) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['chemicals'], 'readwrite');
            const objectStore = transaction.objectStore('chemicals');
            const request = objectStore.delete(id);

            request.onsuccess = () => resolve(true);
            request.onerror = () => reject(request.error);
        });
    }

    /**
     * 获取统计信息
     */
    async getStatistics() {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['chemicals'], 'readonly');
            const objectStore = transaction.objectStore('chemicals');

            const countRequest = objectStore.count();
            countRequest.onsuccess = () => {
                resolve({
                    totalChemicals: countRequest.result
                });
            };
            countRequest.onerror = () => reject(countRequest.error);
        });
    }

    /**
     * 清空数据库
     */
    async clearAll() {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['chemicals', 'importRecords'], 'readwrite');
            transaction.objectStore('chemicals').clear();
            transaction.objectStore('importRecords').clear();

            transaction.oncomplete = () => resolve(true);
            transaction.onerror = () => reject(transaction.error);
        });
    }
}

// 创建全局实例
window.msdsDB = new MSDSDatabase();

/**
 * 职业接触限值数据库管理系统
 * 基于 GBZ 2.1-2019 标准
 * 用于存储和查询工作场所化学有害因素职业接触限值
 */

class OELDatabase {
    constructor() {
        this.dbName = 'OELDatabase';
        this.version = 1;
        this.db = null;
        this.initPromise = null;
    }

    /**
     * 初始化IndexedDB数据库
     */
    async init() {
        // 如果已经初始化，直接返回
        if (this.db) {
            return Promise.resolve(this.db);
        }

        // 如果正在初始化，返回同一个promise
        if (this.initPromise) {
            return this.initPromise;
        }

        this.initPromise = new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.version);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                this.db = request.result;
                console.log('OEL数据库初始化成功');
                resolve(this.db);
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;

                // 创建职业接触限值表
                if (!db.objectStoreNames.contains('chemicals')) {
                    const objectStore = db.createObjectStore('chemicals', {
                        keyPath: 'id',
                        autoIncrement: true
                    });

                    // 创建索引
                    objectStore.createIndex('chineseName', 'chineseName', { unique: false });
                    objectStore.createIndex('englishName', 'englishName', { unique: false });
                    objectStore.createIndex('casNumber', 'casNumber', { unique: false });
                    objectStore.createIndex('serialNumber', 'serialNumber', { unique: false });
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

        return this.initPromise;
    }

    /**
     * 添加化学品OEL数据
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
     * 批量导入OEL数据
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
                        data.casNumber?.includes(searchText)) {
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
     * 通过CAS号精确查询
     */
    async getByCAS(casNumber) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['chemicals'], 'readonly');
            const objectStore = transaction.objectStore('chemicals');
            const index = objectStore.index('casNumber');
            const request = index.get(casNumber);

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
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

                    // 名称搜索
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

                    // 限值范围筛选
                    if (criteria.hasMAC !== undefined) {
                        match = match && (criteria.hasMAC ? chemical.MAC : !chemical.MAC);
                    }

                    if (criteria.hasPCTWA !== undefined) {
                        match = match && (criteria.hasPCTWA ? chemical.PC_TWA : !chemical.PC_TWA);
                    }

                    if (criteria.hasPCSTEL !== undefined) {
                        match = match && (criteria.hasPCSTEL ? chemical.PC_STEL : !chemical.PC_STEL);
                    }

                    // 致癌性筛选
                    if (criteria.carcinogen) {
                        match = match && chemical.carcinogenClass === criteria.carcinogen;
                    }

                    // 经皮吸收筛选
                    if (criteria.skinAbsorption !== undefined) {
                        match = match && chemical.skinAbsorption === criteria.skinAbsorption;
                    }

                    // 致敏性筛选
                    if (criteria.sensitization !== undefined) {
                        match = match && chemical.sensitization === criteria.sensitization;
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
     * 根据ID获取详情
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

            let hasMAC = 0;
            let hasPCTWA = 0;
            let hasPCSTEL = 0;
            let carcinogens = 0;

            objectStore.openCursor().onsuccess = (event) => {
                const cursor = event.target.result;
                if (cursor) {
                    const data = cursor.value;
                    if (data.MAC) hasMAC++;
                    if (data.PC_TWA) hasPCTWA++;
                    if (data.PC_STEL) hasPCSTEL++;
                    if (data.carcinogenClass) carcinogens++;
                    cursor.continue();
                } else {
                    countRequest.onsuccess = () => {
                        resolve({
                            totalChemicals: countRequest.result,
                            hasMAC,
                            hasPCTWA,
                            hasPCSTEL,
                            carcinogens
                        });
                    };
                }
            };

            countRequest.onerror = () => reject(countRequest.error);
        });
    }

    /**
     * 检查浓度是否超标
     */
    async checkExposure(casNumber, concentration, exposureType = 'PC_TWA') {
        try {
            const oel = await this.getByCAS(casNumber);
            if (!oel) {
                return { error: '未找到该化学品的OEL数据' };
            }

            const limitValue = oel[exposureType];
            if (!limitValue) {
                return { error: `未设置${exposureType}限值` };
            }

            const isExceeded = concentration > limitValue;
            const ratio = ((concentration / limitValue) * 100).toFixed(1);

            return {
                chemical: oel.chineseName,
                casNumber: oel.casNumber,
                concentration,
                limitValue,
                exposureType,
                isExceeded,
                ratio: ratio + '%',
                status: isExceeded ? '超标' : '达标',
                riskLevel: this.getRiskLevel(parseFloat(ratio))
            };
        } catch (error) {
            return { error: error.message };
        }
    }

    /**
     * 获取风险等级
     */
    getRiskLevel(ratio) {
        if (ratio <= 50) return '低风险';
        if (ratio <= 100) return '中风险';
        if (ratio <= 200) return '高风险';
        return '极高风险';
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
window.oelDB = new OELDatabase();

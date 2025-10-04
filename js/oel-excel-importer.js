/**
 * GBZ 2.1-2019 职业接触限值 Excel导入工具
 * 使用SheetJS (xlsx.js)库解析Excel文件
 */

class OELExcelImporter {
    constructor() {
        this.workbook = null;
        this.chemicals = [];
    }

    /**
     * 读取Excel文件
     */
    async readFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = (e) => {
                try {
                    const data = new Uint8Array(e.target.result);
                    this.workbook = XLSX.read(data, { type: 'array' });
                    console.log('Excel文件读取成功');
                    console.log('工作表列表:', this.workbook.SheetNames);
                    resolve(this.workbook);
                } catch (error) {
                    reject(error);
                }
            };

            reader.onerror = () => reject(reader.error);
            reader.readAsArrayBuffer(file);
        });
    }

    /**
     * 从工作表中提取OEL数据
     */
    extractChemicalFromSheet(sheetName) {
        const worksheet = this.workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' });

        const chemicals = [];

        console.log(`正在解析工作表: ${sheetName}`);
        console.log(`总行数: ${data.length}`);

        // 数据从第4行开始（索引3），跳过前3行表头
        for (let i = 3; i < data.length; i++) {
            const row = data[i];
            if (!row || row.length === 0) continue;

            // 检查是否是数据行（第一列应该是序号）
            const serialNumber = String(row[0] || '').trim();
            if (!serialNumber || serialNumber === '序号' || isNaN(parseInt(serialNumber))) {
                continue;
            }

            // 提取各字段（根据实际列位置）
            const chineseName = String(row[1] || '').trim();
            const englishName = String(row[2] || '').trim();
            const casNumber = String(row[3] || '').trim();

            // MAC在第4列
            const mac = this.parseValue(row[4]);
            // PC-TWA在第5列
            const pcTwa = this.parseValue(row[5]);
            // PC-STEL在第6列
            const pcStel = this.parseValue(row[6]);

            // 健康效应在第7列
            const healthEffect = String(row[7] || '').trim();
            // 备注在第8列
            const remark = String(row[8] || '').trim();

            // 只添加有中文名的数据
            if (!chineseName) {
                console.log(`跳过行${i+1}: 无中文名`);
                continue;
            }

            // 解析备注中的特殊标识
            const skinAbsorption = remark.includes('皮');
            const sensitization = remark.includes('敏');
            const carcinogenClass = this.parseCarcinogen(remark);

            const chemical = {
                serialNumber,
                chineseName,
                englishName,
                casNumber,

                // 接触限值
                MAC: mac,
                PC_TWA: pcTwa,
                PC_STEL: pcStel,

                // 健康效应
                healthEffect,
                targetOrgans: this.parseTargetOrgans(healthEffect),

                // 特殊标识
                skinAbsorption,
                sensitization,
                carcinogenClass,
                remark,

                // 标准信息
                standard: 'GBZ 2.1-2019',
                standardName: '工作场所有害因素职业接触限值 第1部分：化学有害因素',

                // 原始数据
                rawData: JSON.stringify({
                    sheetName,
                    rowIndex: i + 1,
                    rowData: row
                })
            };

            chemicals.push(chemical);
            console.log(`✓ 提取: ${chemical.chineseName} (CAS: ${chemical.casNumber})`);
        }

        console.log(`工作表 ${sheetName} 提取了 ${chemicals.length} 条数据`);
        return chemicals;
    }

    /**
     * 解析数值（处理"-"和空值）
     */
    parseValue(value) {
        if (!value || value === '-' || value === '—' || value === '－') {
            return null;
        }
        const num = parseFloat(value);
        return isNaN(num) ? null : num;
    }

    /**
     * 解析致癌性分级
     */
    parseCarcinogen(remark) {
        if (!remark) return null;

        if (remark.includes('G1')) return 'G1';
        if (remark.includes('G2A')) return 'G2A';
        if (remark.includes('G2B')) return 'G2B';

        return null;
    }

    /**
     * 解析靶器官
     */
    parseTargetOrgans(healthEffect) {
        if (!healthEffect) return [];

        const organs = [];
        const organMap = {
            '眼': '眼',
            '呼吸': '呼吸系统',
            '肺': '呼吸系统',
            '皮肤': '皮肤',
            '神经': '神经系统',
            '肝': '肝脏',
            '肾': '肾脏',
            '心': '心血管系统',
            '血': '血液系统',
            '生殖': '生殖系统',
            '消化': '消化系统'
        };

        for (const [keyword, organ] of Object.entries(organMap)) {
            if (healthEffect.includes(keyword) && !organs.includes(organ)) {
                organs.push(organ);
            }
        }

        return organs;
    }

    /**
     * 解析所有工作表
     */
    parseAllSheets(progressCallback) {
        this.chemicals = [];
        const totalSheets = this.workbook.SheetNames.length;

        this.workbook.SheetNames.forEach((sheetName, index) => {
            try {
                // 跳过第一个工作表（目录页）
                if (sheetName === 'Table 1' || sheetName.includes('目录')) {
                    console.log(`⊘ 跳过目录页: ${sheetName}`);

                    if (progressCallback) {
                        progressCallback({
                            current: index + 1,
                            total: totalSheets,
                            percentage: Math.round(((index + 1) / totalSheets) * 100),
                            currentSheet: '跳过目录页'
                        });
                    }
                    return;
                }

                const sheetChemicals = this.extractChemicalFromSheet(sheetName);
                this.chemicals.push(...sheetChemicals);

                console.log(`✓ 提取成功: ${sheetName} - ${sheetChemicals.length} 条数据`);

                // 进度回调
                if (progressCallback) {
                    progressCallback({
                        current: index + 1,
                        total: totalSheets,
                        percentage: Math.round(((index + 1) / totalSheets) * 100),
                        currentSheet: sheetName,
                        extractedCount: sheetChemicals.length
                    });
                }
            } catch (error) {
                console.error(`× 提取失败: ${sheetName}`, error);
            }
        });

        console.log(`总计提取: ${this.chemicals.length} 条OEL数据`);
        return this.chemicals;
    }

    /**
     * 导入到数据库
     */
    async importToDatabase(fileName, progressCallback) {
        try {
            // 解析Excel
            const chemicals = this.parseAllSheets(progressCallback);

            if (chemicals.length === 0) {
                throw new Error('未能提取到有效的OEL数据');
            }

            // 导入数据库
            const result = await window.oelDB.batchImport(chemicals, {
                fileName: fileName,
                importDate: new Date()
            });

            return {
                success: true,
                totalExtracted: chemicals.length,
                ...result
            };
        } catch (error) {
            console.error('导入失败:', error);
            throw error;
        }
    }

    /**
     * 获取提取的化学品列表
     */
    getChemicals() {
        return this.chemicals;
    }

    /**
     * 获取统计信息
     */
    getStatistics() {
        const stats = {
            total: this.chemicals.length,
            hasMAC: 0,
            hasPCTWA: 0,
            hasPCSTEL: 0,
            carcinogens: 0,
            skinAbsorption: 0,
            sensitization: 0
        };

        this.chemicals.forEach(chemical => {
            if (chemical.MAC) stats.hasMAC++;
            if (chemical.PC_TWA) stats.hasPCTWA++;
            if (chemical.PC_STEL) stats.hasPCSTEL++;
            if (chemical.carcinogenClass) stats.carcinogens++;
            if (chemical.skinAbsorption) stats.skinAbsorption++;
            if (chemical.sensitization) stats.sensitization++;
        });

        return stats;
    }
}

// 创建全局实例
window.oelImporter = new OELExcelImporter();

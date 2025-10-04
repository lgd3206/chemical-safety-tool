/**
 * MSDS Excel文件导入工具
 * 使用SheetJS (xlsx.js)库解析Excel文件
 */

class MSDSExcelImporter {
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
     * 从工作表中提取化学品数据（精准版 - 针对真实Excel格式）
     */
    extractChemicalFromSheet(sheetName) {
        const worksheet = this.workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' });

        const chemical = {
            // 基本标识
            chineseName: '',
            englishName: '',
            molecularFormula: '',
            molecularWeight: '',
            casNumber: '',
            unNumber: '',
            dangerCode: '',

            // 理化性质
            appearance: '',
            solubility: '',
            meltingPoint: '',
            boilingPoint: '',
            relativeDensity: '',
            relativeVaporDensity: '',
            saturatedVaporPressure: '',
            criticalTemp: '',
            criticalPressure: '',
            flashPoint: '',
            explosionLimitLower: '',
            explosionLimitUpper: '',
            ignitionTemp: '',
            octanolWaterPartition: '',

            // 燃烧爆炸危险性
            flammability: '',
            explosionHazard: '',
            stability: '',
            hazardCharacteristics: '',
            extinguishingMethod: '',
            extinguishingAgents: '',
            prohibitedExtinguishingAgents: '',

            // 毒性
            exposureLimit: '',
            toxicityLD50: '',
            toxicityLC50: '',

            // 健康危害
            healthHazard: '',
            routes: '',
            symptoms: '',

            // 急救措施
            firstAid: '',
            skinContact: '',
            eyeContact: '',
            inhalation: '',
            ingestion: '',

            // 防护措施
            respiratoryProtection: '',
            eyeProtection: '',
            bodyProtection: '',
            handProtection: '',
            otherProtection: '',
            engineeringControls: '',

            // 泄漏应急处理
            leakageDisposal: '',
            personalPrecautions: '',
            environmentalPrecautions: '',
            cleanupMethods: '',

            // 储存运输
            storage: '',
            storageConditions: '',
            transportInfo: '',
            packagingMethod: '',
            transportPrecautions: '',

            // 完整原始数据
            rawData: ''
        };

        // 保存所有行的完整文本
        let fullText = '';

        // 遍历所有行提取数据
        for (let i = 0; i < data.length; i++) {
            const row = data[i];
            if (!row || row.length === 0) continue;

            // 合并该行所有列（数据可能分布在多个列）
            const rowText = row.filter(cell => cell).map(cell => String(cell).trim()).join(' ');
            if (!rowText) continue;

            fullText += rowText + '\n';

            // ========== 第1行：提取化学品编号和中文名 ==========
            // 格式："表 1-002  氧气"
            if (i < 5 && rowText.match(/表\s*\d+[-－]\d+\s+(.+)/)) {
                const match = rowText.match(/表\s*\d+[-－]\d+\s+(.+)/);
                if (match && !chemical.chineseName) {
                    chemical.chineseName = match[1].trim();
                }
            }

            // ========== 标识信息行 ==========
            // 第3行通常是："标识 | 中文名：氧、氧气 | 英文名：oxygen"
            if (rowText.includes('标识')) {
                // 提取中文名（去掉"中文名："前缀）
                const cnMatch = rowText.match(/中文名[：:]\s*([^|，。；\n]+)/);
                if (cnMatch && !chemical.chineseName) {
                    // 清理提取的名称，去掉多余的顿号、逗号等
                    chemical.chineseName = cnMatch[1].trim()
                        .replace(/[、；，;,]/g, '、')  // 统一分隔符
                        .split('、')[0];  // 只取第一个名称
                }

                // 提取英文名
                const enMatch = rowText.match(/英文名[：:]\s*([^|，。；\n]+)/);
                if (enMatch) {
                    chemical.englishName = enMatch[1].trim();
                }
            }

            // ========== 第4行：分子式、分子量、CAS号 ==========
            // 格式："分子式：O2 | 相对分子量：32.00 | CAS 号：7782-44-7"
            if (rowText.includes('分子式')) {
                const formulaMatch = rowText.match(/分子式[：:]\s*([A-Za-z0-9()（）]+)/);
                if (formulaMatch) chemical.molecularFormula = formulaMatch[1].trim();
            }

            if (rowText.includes('相对分子质量') || rowText.includes('分子量')) {
                const weightMatch = rowText.match(/(?:相对分子质量|分子量)[：:]\s*([\d.]+)/);
                if (weightMatch) chemical.molecularWeight = weightMatch[1].trim();
            }

            if (rowText.includes('CAS')) {
                const casMatch = rowText.match(/CAS[^：:]*[：:]\s*([\d\-－]+)/);
                if (casMatch) {
                    chemical.casNumber = casMatch[1].replace(/－/g, '-').trim();
                }
            }

            // ========== 第5行：危规号 ==========
            if (rowText.includes('危规号')) {
                const codeMatch = rowText.match(/危规号[：:]\s*(\d+)/);
                if (codeMatch) chemical.dangerCode = codeMatch[1];
            }

            // ========== 理化性质部分 ==========
            // 性状
            if (rowText.includes('性状')) {
                const stateMatch = rowText.match(/性状[：:]\s*([^|，。；\n]+)/);
                if (stateMatch) chemical.appearance = stateMatch[1].trim();
            }

            // 溶解性
            if (rowText.includes('溶解性')) {
                const solMatch = rowText.match(/溶解性[：:]\s*([^|，。；\n]+)/);
                if (solMatch) chemical.solubility = solMatch[1].trim();
            }

            // 熔点
            if (rowText.includes('熔点')) {
                const mpMatch = rowText.match(/熔点[^：:]*[：:]\s*([^|，。；\n]+)/);
                if (mpMatch) chemical.meltingPoint = mpMatch[1].trim();
            }

            // 沸点
            if (rowText.includes('沸点')) {
                const bpMatch = rowText.match(/沸点[^：:]*[：:]\s*([^|，。；\n]+)/);
                if (bpMatch) chemical.boilingPoint = bpMatch[1].trim();
            }

            // 相对密度
            if (rowText.includes('相对密度') && !rowText.includes('蒸气')) {
                const densityMatch = rowText.match(/相对密度[^：:]*[：:]\s*([^|，。；\n]+)/);
                if (densityMatch) chemical.relativeDensity = densityMatch[1].trim();
            }

            // 相对蒸气密度
            if (rowText.includes('相对蒸气密度')) {
                const vaporMatch = rowText.match(/相对蒸气密度[^：:]*[：:]\s*([^|，。；\n]+)/);
                if (vaporMatch) chemical.relativeVaporDensity = vaporMatch[1].trim();
            }

            // 临界温度
            if (rowText.includes('临界温度')) {
                const ctMatch = rowText.match(/临界温度[^：:]*[：:]\s*([^|，。；\n]+)/);
                if (ctMatch) chemical.criticalTemp = ctMatch[1].trim();
            }

            // 临界压力
            if (rowText.includes('临界压力')) {
                const cpMatch = rowText.match(/临界压力[^：:]*[：:]\s*([^|，。；\n]+)/);
                if (cpMatch) chemical.criticalPressure = cpMatch[1].trim();
            }

            // 闪点
            if (rowText.includes('闪点')) {
                const fpMatch = rowText.match(/闪点[^：:]*[：:]\s*([^|，。；\n]+)/);
                if (fpMatch) chemical.flashPoint = fpMatch[1].trim();
            }

            // 爆炸下限
            if (rowText.includes('爆炸下限') || (rowText.includes('爆炸') && rowText.includes('下限'))) {
                const lelMatch = rowText.match(/爆炸?下限[^：:]*[：:]\s*([^|，。；\n]+)/);
                if (lelMatch) chemical.explosionLimitLower = lelMatch[1].trim();
            }

            // 爆炸上限
            if (rowText.includes('爆炸上限') || (rowText.includes('爆炸') && rowText.includes('上限'))) {
                const uelMatch = rowText.match(/爆炸?上限[^：:]*[：:]\s*([^|，。；\n]+)/);
                if (uelMatch) chemical.explosionLimitUpper = uelMatch[1].trim();
            }

            // 引燃温度
            if (rowText.includes('引燃温度') || rowText.includes('自燃温度')) {
                const itMatch = rowText.match(/(?:引燃|自燃)温度[^：:]*[：:]\s*([^|，。；\n]+)/);
                if (itMatch) chemical.ignitionTemp = itMatch[1].trim();
            }

            // ========== 燃烧爆炸危险性 ==========
            if (rowText.includes('燃烧性')) {
                const flammMatch = rowText.match(/燃烧性[：:]\s*([^|，。；\n]+)/);
                if (flammMatch) chemical.flammability = flammMatch[1].trim();
            }

            if (rowText.includes('稳定性')) {
                const stabMatch = rowText.match(/稳定性[：:]\s*([^|，。；\n]+)/);
                if (stabMatch) chemical.stability = stabMatch[1].trim();
            }

            if (rowText.includes('危险特性')) {
                const hazMatch = rowText.match(/危险特性[：:]\s*(.+)/);
                if (hazMatch) {
                    chemical.hazardCharacteristics = hazMatch[1].trim();
                }
            }

            // ========== 消防措施 ==========
            if (rowText.includes('消防措施') || rowText.includes('灭火方法')) {
                const fireMatch = rowText.match(/(?:消防措施|灭火方法)[：:]\s*(.+)/);
                if (fireMatch) {
                    chemical.extinguishingMethod = fireMatch[1].trim();
                }
            }

            // ========== 毒性 ==========
            if (rowText.includes('接触限值') || rowText.includes('MAC') || rowText.includes('TLV')) {
                chemical.exposureLimit = (chemical.exposureLimit ? chemical.exposureLimit + '\n' : '') + rowText;
            }

            if (rowText.includes('LD50')) {
                chemical.toxicityLD50 = (chemical.toxicityLD50 ? chemical.toxicityLD50 + '\n' : '') + rowText;
            }

            if (rowText.includes('LC50')) {
                chemical.toxicityLC50 = (chemical.toxicityLC50 ? chemical.toxicityLC50 + '\n' : '') + rowText;
            }

            // ========== 健康危害 ==========
            if (rowText.includes('健康危害')) {
                const healthMatch = rowText.match(/健康危害[：:]\s*(.+)/);
                if (healthMatch) {
                    chemical.healthHazard = healthMatch[1].trim();
                }
            }

            // ========== 急救措施部分 ==========
            // 急救信息是一个独立的分类，下面包含各种急救措施
            // 格式：
            // 急救
            //   皮肤接触：...
            //   吸入：...
            //   眼睛接触：...
            //   食入：...
            // 或者：
            // 急救 皮肤冻伤：...（某些气体化学品）

            // 皮肤接触急救措施（包括皮肤冻伤，多种格式）
            if (rowText.includes('皮肤接触：') || rowText.includes('皮肤冻伤：')) {
                let skinMatch = null;

                // 处理"急救 皮肤冻伤："这种格式
                if (rowText.includes('急救') && rowText.includes('皮肤冻伤：')) {
                    skinMatch = rowText.match(/急救.*?皮肤冻伤[：:]\s*(.+)/);
                } else if (rowText.includes('皮肤冻伤：')) {
                    skinMatch = rowText.match(/皮肤冻伤[：:]\s*(.+)/);
                } else if (rowText.includes('皮肤接触：')) {
                    skinMatch = rowText.match(/皮肤接触[：:]\s*(.+)/);
                }

                if (skinMatch && skinMatch[1]) {
                    const content = skinMatch[1].trim();
                    if (content && content !== '' && content !== '-') {
                        chemical.skinContact = content;
                        console.log('✅ 提取到皮肤接触急救信息:', chemical.skinContact);
                    }
                }
            }

            // 眼睛接触急救措施
            if (rowText.includes('眼睛接触：') || rowText.includes('眼部接触：')) {
                const eyeMatch = rowText.match(/眼(?:睛|部)?接触[：:]\s*(.+)/);
                if (eyeMatch && eyeMatch[1]) {
                    const content = eyeMatch[1].trim();
                    if (content && content !== '' && content !== '-') {
                        chemical.eyeContact = content;
                        console.log('✅ 提取到眼睛接触急救信息:', chemical.eyeContact);
                    }
                }
            }

            // 吸入急救措施
            if (rowText.includes('吸入：')) {
                const inhalationMatch = rowText.match(/吸入[：:]\s*(.+)/);
                if (inhalationMatch && inhalationMatch[1]) {
                    const content = inhalationMatch[1].trim();
                    if (content && content !== '' && content !== '-') {
                        chemical.inhalation = content;
                        console.log('✅ 提取到吸入急救信息:', chemical.inhalation);
                    }
                }
            }

            // 食入急救措施
            if (rowText.includes('食入：') || rowText.includes('误食：') || rowText.includes('误服：')) {
                const ingestionMatch = rowText.match(/(?:食入|误食|误服)[：:]\s*(.+)/);
                if (ingestionMatch && ingestionMatch[1]) {
                    const content = ingestionMatch[1].trim();
                    if (content && content !== '' && content !== '-') {
                        chemical.ingestion = content;
                        console.log('✅ 提取到食入急救信息:', chemical.ingestion);
                    }
                }
            }

            // 通用急救信息（当急救信息没有细分时）
            if (rowText.includes('急救：') && !chemical.firstAid) {
                const firstAidMatch = rowText.match(/急救[：:]\s*(.+)/);
                if (firstAidMatch) {
                    chemical.firstAid = firstAidMatch[1].trim();
                    console.log('提取到通用急救信息:', chemical.firstAid);
                }
            }

            // ========== 防护 ==========
            if (rowText.includes('防护') && !rowText.includes('个人')) {
                const protMatch = rowText.match(/防护[：:]\s*(.+)/);
                if (protMatch) {
                    chemical.respiratoryProtection = protMatch[1].trim();
                }
            }

            // ========== 泄漏处理 ==========
            if (rowText.includes('泄漏')) {
                const leakMatch = rowText.match(/泄漏[^：:]*[：:]\s*(.+)/);
                if (leakMatch) {
                    chemical.leakageDisposal = leakMatch[1].trim();
                }
            }

            // ========== 储运 ==========
            if (rowText.includes('贮运') || (rowText.includes('包装') && rowText.includes('UN'))) {
                chemical.storage = rowText;

                // 提取UN号
                const unMatch = rowText.match(/UN[^：:]*[：:]\s*(\d+)/);
                if (unMatch && !chemical.unNumber) {
                    chemical.unNumber = unMatch[1];
                }
            }
        }

        // 保存完整原始数据
        chemical.rawData = fullText;

        return chemical;
    }

    /**
     * 解析所有工作表
     */
    parseAllSheets(progressCallback) {
        this.chemicals = [];
        const totalSheets = this.workbook.SheetNames.length;

        this.workbook.SheetNames.forEach((sheetName, index) => {
            try {
                // 跳过目录页（Table 1通常是目录）
                if (sheetName === 'Table 1' || sheetName.includes('目录') || sheetName.includes('Catalog')) {
                    console.log(`⊘ 跳过目录页: ${sheetName}`);

                    // 进度回调
                    if (progressCallback) {
                        progressCallback({
                            current: index + 1,
                            total: totalSheets,
                            percentage: Math.round(((index + 1) / totalSheets) * 100),
                            currentChemical: '跳过目录页'
                        });
                    }
                    return;
                }

                const chemical = this.extractChemicalFromSheet(sheetName);

                // 只添加有中文名称的化学品
                if (chemical.chineseName) {
                    this.chemicals.push(chemical);
                    console.log(`✓ 提取成功: ${chemical.chineseName}`);
                } else {
                    console.log(`× 跳过: ${sheetName} (无中文名称)`);
                }

                // 进度回调
                if (progressCallback) {
                    progressCallback({
                        current: index + 1,
                        total: totalSheets,
                        percentage: Math.round(((index + 1) / totalSheets) * 100),
                        currentChemical: chemical.chineseName || '未知'
                    });
                }
            } catch (error) {
                console.error(`× 提取失败: ${sheetName}`, error);
            }
        });

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
                throw new Error('未能提取到有效的化学品数据');
            }

            // 导入数据库
            const result = await window.msdsDB.batchImport(chemicals, {
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
}

// 创建全局实例
window.msdsImporter = new MSDSExcelImporter();

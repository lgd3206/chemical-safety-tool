/**
 * MSDS管理页面交互逻辑
 */

let currentPage = 1;
const pageSize = 20;
let batchMode = false;
let selectedIds = new Set();

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', async function() {
    // 等待数据库初始化
    await window.msdsDB.init();

    // 加载统计信息和数据列表
    await loadStatistics();
    await loadChemicals();

    // 绑定上传区域事件
    setupUploadArea();
});

/**
 * 设置上传区域
 */
function setupUploadArea() {
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');

    // 点击上传
    uploadArea.addEventListener('click', () => {
        fileInput.click();
    });

    // 文件选择
    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            handleFileUpload(e.target.files[0]);
        }
    });

    // 拖拽上传
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('dragging');
    });

    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('dragging');
    });

    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('dragging');

        if (e.dataTransfer.files.length > 0) {
            handleFileUpload(e.dataTransfer.files[0]);
        }
    });
}

/**
 * 处理文件上传
 */
async function handleFileUpload(file) {
    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
        showMessage('请上传Excel文件（.xlsx或.xls格式）', 'error');
        return;
    }

    try {
        showMessage('正在读取Excel文件...', 'success');
        document.getElementById('progressContainer').style.display = 'block';

        // 读取Excel文件
        await window.msdsImporter.readFile(file);

        // 导入数据库（带进度回调）
        const result = await window.msdsImporter.importToDatabase(file.name, (progress) => {
            updateProgress(progress);
        });

        // 导入完成
        showMessage(
            `导入成功！共提取 ${result.totalExtracted} 条数据，成功导入 ${result.successCount} 条`,
            'success'
        );

        // 刷新统计和列表
        await loadStatistics();
        await loadChemicals();

        // 重置上传区域
        document.getElementById('fileInput').value = '';
        document.getElementById('progressContainer').style.display = 'none';

    } catch (error) {
        console.error('导入失败:', error);
        showMessage('导入失败: ' + error.message, 'error');
        document.getElementById('progressContainer').style.display = 'none';
    }
}

/**
 * 更新进度
 */
function updateProgress(progress) {
    const progressFill = document.getElementById('progressFill');
    const progressInfo = document.getElementById('progressInfo');

    progressFill.style.width = progress.percentage + '%';
    progressFill.textContent = progress.percentage + '%';

    progressInfo.textContent = `正在处理: ${progress.currentChemical} (${progress.current}/${progress.total})`;
}

/**
 * 加载统计信息
 */
async function loadStatistics() {
    try {
        const stats = await window.msdsDB.getStatistics();
        document.getElementById('totalChemicals').textContent = stats.totalChemicals;

        // 计算完整度（示例）
        const completeness = stats.totalChemicals > 0 ? 100 : 0;
        document.getElementById('completeness').textContent = completeness + '%';

    } catch (error) {
        console.error('加载统计信息失败:', error);
    }
}

/**
 * 加载化学品列表
 */
async function loadChemicals(page = 1) {
    try {
        currentPage = page;
        const result = await window.msdsDB.getAll(page, pageSize);

        const tbody = document.getElementById('chemicalTableBody');
        tbody.innerHTML = '';

        if (result.data.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="8" style="text-align: center; padding: 40px; color: #999;">
                        暂无数据，请先导入Excel文件
                    </td>
                </tr>
            `;
            return;
        }

        result.data.forEach(chemical => {
            const row = document.createElement('tr');
            const checkboxCell = batchMode ? `
                <td style="display: ${batchMode ? 'table-cell' : 'none'};">
                    <input type="checkbox" class="chemical-checkbox" data-id="${chemical.id}"
                           onchange="updateSelectedCount()" ${selectedIds.has(chemical.id) ? 'checked' : ''}>
                </td>
            ` : '';

            row.innerHTML = `
                ${checkboxCell}
                <td>${chemical.id}</td>
                <td>${chemical.chineseName || '-'}</td>
                <td>${chemical.englishName || '-'}</td>
                <td>${chemical.casNumber || '-'}</td>
                <td>${chemical.unNumber || '-'}</td>
                <td>${chemical.molecularFormula || '-'}</td>
                <td>${chemical.importDate ? new Date(chemical.importDate).toLocaleDateString() : '-'}</td>
                <td>
                    <button class="action-btn btn-view" onclick="viewChemical(${chemical.id})">
                        查看
                    </button>
                    <button class="action-btn btn-debug" onclick="debugChemical(${chemical.id})" style="background: #8b5cf6;">
                        调试
                    </button>
                    <button class="action-btn btn-delete" onclick="deleteChemical(${chemical.id})">
                        删除
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });

        // 渲染分页
        renderPagination(result.totalPages, page);

    } catch (error) {
        console.error('加载化学品列表失败:', error);
        showMessage('加载数据失败: ' + error.message, 'error');
    }
}

/**
 * 搜索化学品
 */
async function searchChemicals() {
    const keyword = document.getElementById('searchInput').value.trim();

    if (!keyword) {
        loadChemicals();
        return;
    }

    try {
        const results = await window.msdsDB.search(keyword);

        const tbody = document.getElementById('chemicalTableBody');
        tbody.innerHTML = '';

        if (results.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="8" style="text-align: center; padding: 40px; color: #999;">
                        未找到匹配的化学品
                    </td>
                </tr>
            `;
            document.getElementById('pagination').innerHTML = '';
            return;
        }

        results.forEach(chemical => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${chemical.id}</td>
                <td>${chemical.chineseName || '-'}</td>
                <td>${chemical.englishName || '-'}</td>
                <td>${chemical.casNumber || '-'}</td>
                <td>${chemical.unNumber || '-'}</td>
                <td>${chemical.molecularFormula || '-'}</td>
                <td>${chemical.importDate ? new Date(chemical.importDate).toLocaleDateString() : '-'}</td>
                <td>
                    <button class="action-btn btn-view" onclick="viewChemical(${chemical.id})">
                        查看
                    </button>
                    <button class="action-btn btn-debug" onclick="debugChemical(${chemical.id})" style="background: #8b5cf6;">
                        调试
                    </button>
                    <button class="action-btn btn-delete" onclick="deleteChemical(${chemical.id})">
                        删除
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });

        document.getElementById('pagination').innerHTML = '';
        showMessage(`找到 ${results.length} 条匹配记录`, 'success');

    } catch (error) {
        console.error('搜索失败:', error);
        showMessage('搜索失败: ' + error.message, 'error');
    }
}

/**
 * 切换高级搜索面板
 */
function toggleAdvancedSearch() {
    const panel = document.getElementById('advancedSearchPanel');
    panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
}

/**
 * 高级搜索
 */
async function advancedSearch() {
    try {
        const criteria = {
            name: document.getElementById('adv_name').value.trim(),
            cas: document.getElementById('adv_cas').value.trim(),
            un: document.getElementById('adv_un').value.trim(),
            formula: document.getElementById('adv_formula').value.trim(),
            hazard: document.getElementById('adv_hazard').value,
            state: document.getElementById('adv_state').value
        };

        // 检查是否有搜索条件
        const hasConditions = Object.values(criteria).some(val => val !== '');
        if (!hasConditions) {
            showMessage('请至少输入一个搜索条件', 'error');
            return;
        }

        const results = await window.msdsDB.advancedSearch(criteria);

        const tbody = document.getElementById('chemicalTableBody');
        tbody.innerHTML = '';

        if (results.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="8" style="text-align: center; padding: 40px; color: #999;">
                        未找到符合条件的化学品
                    </td>
                </tr>
            `;
            document.getElementById('pagination').innerHTML = '';
            showMessage('未找到符合条件的化学品', 'error');
            return;
        }

        results.forEach(chemical => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${chemical.id}</td>
                <td>${chemical.chineseName || '-'}</td>
                <td>${chemical.englishName || '-'}</td>
                <td>${chemical.casNumber || '-'}</td>
                <td>${chemical.unNumber || '-'}</td>
                <td>${chemical.molecularFormula || '-'}</td>
                <td>${chemical.importDate ? new Date(chemical.importDate).toLocaleDateString() : '-'}</td>
                <td>
                    <button class="action-btn btn-view" onclick="viewChemical(${chemical.id})">
                        查看
                    </button>
                    <button class="action-btn btn-debug" onclick="debugChemical(${chemical.id})" style="background: #8b5cf6;">
                        调试
                    </button>
                    <button class="action-btn btn-delete" onclick="deleteChemical(${chemical.id})">
                        删除
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });

        document.getElementById('pagination').innerHTML = '';
        showMessage(`找到 ${results.length} 条符合条件的记录`, 'success');

    } catch (error) {
        console.error('高级搜索失败:', error);
        showMessage('高级搜索失败: ' + error.message, 'error');
    }
}

/**
 * 重置高级搜索
 */
function resetAdvancedSearch() {
    document.getElementById('adv_name').value = '';
    document.getElementById('adv_cas').value = '';
    document.getElementById('adv_un').value = '';
    document.getElementById('adv_formula').value = '';
    document.getElementById('adv_hazard').value = '';
    document.getElementById('adv_state').value = '';
    loadChemicals();
}

/**
 * 渲染分页
 */
function renderPagination(totalPages, currentPage) {
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';

    if (totalPages <= 1) return;

    // 上一页
    const prevBtn = document.createElement('button');
    prevBtn.textContent = '« 上一页';
    prevBtn.disabled = currentPage === 1;
    prevBtn.onclick = () => loadChemicals(currentPage - 1);
    pagination.appendChild(prevBtn);

    // 页码
    for (let i = 1; i <= Math.min(totalPages, 10); i++) {
        const pageBtn = document.createElement('button');
        pageBtn.textContent = i;
        pageBtn.className = i === currentPage ? 'active' : '';
        pageBtn.onclick = () => loadChemicals(i);
        pagination.appendChild(pageBtn);
    }

    // 下一页
    const nextBtn = document.createElement('button');
    nextBtn.textContent = '下一页 »';
    nextBtn.disabled = currentPage === totalPages;
    nextBtn.onclick = () => loadChemicals(currentPage + 1);
    pagination.appendChild(nextBtn);
}

/**
 * 查看化学品详情 - 标准MSDS表格格式
 */
async function viewChemical(id) {
    try {
        const chemical = await window.msdsDB.getById(id);
        if (!chemical) {
            showMessage('未找到该化学品', 'error');
            return;
        }

        // 创建详情模态框
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.7);
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
            overflow-y: auto;
        `;

        // 标准MSDS表格样式
        const tableStyle = `
            width: 100%;
            border-collapse: collapse;
            margin: 10px 0;
            border: 2px solid #000;
            font-size: 13px;
            line-height: 1.5;
        `;

        const cellStyle = `
            border: 1px solid #000;
            padding: 6px 8px;
            vertical-align: top;
        `;

        const headerStyle = `
            ${cellStyle}
            background: #e8e8e8;
            font-weight: bold;
            text-align: center;
            vertical-align: middle;
        `;

        modal.innerHTML = `
            <div id="msds-content" style="background: white; border-radius: 10px; max-width: 1000px; width: 100%; max-height: 90vh; overflow-y: auto; padding: 30px; position: relative;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; border-bottom: 2px solid #333; padding-bottom: 10px;">
                    <h2 style="margin: 0; font-size: 20px;">物质安全数据表（MSDS）</h2>
                    <div>
                        <button onclick="exportMSDSToPDF(${JSON.stringify(chemical).replace(/"/g, '&quot;')})" style="padding: 8px 16px; background: #e91e63; color: white; border: none; border-radius: 5px; cursor: pointer; margin-right: 10px; font-size: 14px;">
                            📄 导出PDF
                        </button>
                        <button onclick="printMSDS()" style="padding: 8px 16px; background: #4CAF50; color: white; border: none; border-radius: 5px; cursor: pointer; margin-right: 10px; font-size: 14px;">
                            🖨️ 打印
                        </button>
                        <button onclick="this.closest('div[id=msds-content]').parentElement.remove()" style="padding: 8px 16px; background: #f44336; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 14px;">
                            ✕ 关闭
                        </button>
                    </div>
                </div>

                <!-- 标识 -->
                <table style="${tableStyle}">
                    <tr>
                        <td style="${headerStyle}" rowspan="3" width="60">标识</td>
                        <td style="${cellStyle}" width="30%">中文名：${chemical.chineseName || '-'}</td>
                        <td style="${cellStyle}" colspan="2">英文名：${chemical.englishName || '-'}</td>
                    </tr>
                    <tr>
                        <td style="${cellStyle}">分子式：${chemical.molecularFormula || '-'}</td>
                        <td style="${cellStyle}">分子量：${chemical.molecularWeight || '-'}</td>
                        <td style="${cellStyle}">CAS 号：${chemical.casNumber || '-'}</td>
                    </tr>
                    <tr>
                        <td style="${cellStyle}" colspan="3">危规号：${chemical.dangerCode || '-'}</td>
                    </tr>
                </table>

                <!-- 理化性质 -->
                <table style="${tableStyle}">
                    <tr>
                        <td style="${headerStyle}" rowspan="5" width="60">理化<br>性质</td>
                        <td style="${cellStyle}" colspan="3">性状：${chemical.appearance || '-'}</td>
                    </tr>
                    <tr>
                        <td style="${cellStyle}" colspan="3">溶解性：${chemical.solubility || '-'}</td>
                    </tr>
                    <tr>
                        <td style="${cellStyle}" width="33%">熔点（℃）：${chemical.meltingPoint || '-'}</td>
                        <td style="${cellStyle}" width="33%">沸点（℃）：${chemical.boilingPoint || '-'}</td>
                        <td style="${cellStyle}">相对密度（水=1）：${chemical.relativeDensity || '-'}</td>
                    </tr>
                    <tr>
                        <td style="${cellStyle}">临界温度（℃）：${chemical.criticalTemp || '-'}</td>
                        <td style="${cellStyle}">临界压力（MPa）：${chemical.criticalPressure || '-'}</td>
                        <td style="${cellStyle}">相对蒸气密度（空气=1）：${chemical.relativeVaporDensity || '-'}</td>
                    </tr>
                    <tr>
                        <td style="${cellStyle}">燃烧热（KJ/mol）：-</td>
                        <td style="${cellStyle}">最小点火能（mJ）：-</td>
                        <td style="${cellStyle}">饱和蒸气压（UPa）：-</td>
                    </tr>
                </table>

                <!-- 燃烧爆炸危险性 -->
                <table style="${tableStyle}">
                    <tr>
                        <td style="${headerStyle}" rowspan="7" width="60">燃烧<br>爆炸<br>危险<br>性</td>
                        <td style="${cellStyle}" width="35%">燃烧性：${chemical.flammability || '-'}</td>
                        <td style="${cellStyle}" colspan="2">燃烧分解产物：-</td>
                    </tr>
                    <tr>
                        <td style="${cellStyle}">闪点（℃）：${chemical.flashPoint || '-'}</td>
                        <td style="${cellStyle}" colspan="2">聚合危害：不聚合</td>
                    </tr>
                    <tr>
                        <td style="${cellStyle}">爆炸下限（%）：${chemical.explosionLimitLower || '-'}</td>
                        <td style="${cellStyle}" colspan="2">稳定性：${chemical.stability || '-'}</td>
                    </tr>
                    <tr>
                        <td style="${cellStyle}">爆炸上限（%）：${chemical.explosionLimitUpper || '-'}</td>
                        <td style="${cellStyle}" colspan="2">最大爆炸压力（MPa）：-</td>
                    </tr>
                    <tr>
                        <td style="${cellStyle}">引燃温度（℃）：${chemical.ignitionTemp || '-'}</td>
                        <td style="${cellStyle}" colspan="2">禁忌物：-</td>
                    </tr>
                    <tr>
                        <td style="${cellStyle}" colspan="3">危险特性：${chemical.hazardCharacteristics || '暂无危险特性信息'}</td>
                    </tr>
                    <tr>
                        <td style="${cellStyle}" colspan="3">灭火方法：${chemical.extinguishingMethod || '-'}</td>
                    </tr>
                </table>

                <!-- 对人体危害 -->
                <table style="${tableStyle}">
                    <tr>
                        <td style="${headerStyle}" rowspan="2" width="60">对人<br>体危<br>害</td>
                        <td style="${cellStyle}" colspan="3">侵入途径：${chemical.routes || '吸入、食入'}</td>
                    </tr>
                    <tr>
                        <td style="${cellStyle}" colspan="3">健康危害：${chemical.healthHazard || '暂无健康危害信息'}</td>
                    </tr>
                </table>

                <!-- 急救 -->
                <table style="${tableStyle}">
                    <tr>
                        <td style="${headerStyle}" rowspan="4" width="60">急救</td>
                        <td style="${cellStyle}" colspan="3">皮肤接触：${chemical.skinContact || '-'}</td>
                    </tr>
                    <tr>
                        <td style="${cellStyle}" colspan="3">眼睛接触：${chemical.eyeContact || '-'}</td>
                    </tr>
                    <tr>
                        <td style="${cellStyle}" colspan="3">吸入：${chemical.inhalation || '-'}</td>
                    </tr>
                    <tr>
                        <td style="${cellStyle}" colspan="3">食入：${chemical.ingestion || '-'}</td>
                    </tr>
                </table>

                <!-- 防护 -->
                <table style="${tableStyle}">
                    <tr>
                        <td style="${headerStyle}" rowspan="5" width="60">防护</td>
                        <td style="${cellStyle}" colspan="3">工程控制：${chemical.engineeringControls || '密闭操作，全面排风。'}</td>
                    </tr>
                    <tr>
                        <td style="${cellStyle}" colspan="3">呼吸系统防护：${chemical.respiratoryProtection || '-'}</td>
                    </tr>
                    <tr>
                        <td style="${cellStyle}" colspan="3">身体防护：${chemical.bodyProtection || '穿化学安全防护服。'}</td>
                    </tr>
                    <tr>
                        <td style="${cellStyle}" colspan="3">手防护：${chemical.handProtection || '戴橡胶手套。'}</td>
                    </tr>
                    <tr>
                        <td style="${cellStyle}" colspan="3">其他防护：${chemical.otherProtection || '工作场所禁止吸烟、进食和饮水。'}</td>
                    </tr>
                </table>

                <!-- 泄漏应急处理 -->
                <table style="${tableStyle}">
                    <tr>
                        <td style="${headerStyle}" width="60">泄漏<br>应急<br>处理</td>
                        <td style="${cellStyle}">${chemical.leakageDisposal || '暂无泄漏处理信息'}</td>
                    </tr>
                </table>

                <!-- 贮运 -->
                <table style="${tableStyle}">
                    <tr>
                        <td style="${headerStyle}" rowspan="2" width="60">贮运</td>
                        <td style="${cellStyle}">
                            包装标志：- &nbsp;&nbsp;&nbsp;&nbsp;
                            UN 编号：${chemical.unNumber || '-'} &nbsp;&nbsp;&nbsp;&nbsp;
                            包装分类：- &nbsp;&nbsp;&nbsp;&nbsp;
                            包装方法：-
                        </td>
                    </tr>
                    <tr>
                        <td style="${cellStyle}">储运条件：${chemical.storage || '暂无储运信息'}</td>
                    </tr>
                </table>

                ${chemical.rawData ? `
                <div style="margin-top: 20px; padding: 15px; background: #f5f5f5; border-radius: 5px; border: 1px solid #ddd;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                        <strong style="font-size: 14px;">📄 完整原始数据</strong>
                        <button onclick="this.nextElementSibling.style.display = this.nextElementSibling.style.display === 'none' ? 'block' : 'none'; this.textContent = this.textContent === '展开' ? '收起' : '展开';" style="padding: 4px 12px; background: #666; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px;">展开</button>
                    </div>
                    <pre style="display: none; max-height: 300px; overflow-y: auto; background: white; padding: 10px; border-radius: 5px; font-size: 12px; white-space: pre-wrap; margin: 0;">${chemical.rawData}</pre>
                </div>
                ` : ''}
            </div>
        `;

        document.body.appendChild(modal);

    } catch (error) {
        console.error('查看详情失败:', error);
        showMessage('查看详情失败: ' + error.message, 'error');
    }
}

/**
 * 打印MSDS
 */
function printMSDS() {
    const content = document.getElementById('msds-content');
    if (!content) return;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>物质安全数据表（MSDS）</title>
            <style>
                body {
                    font-family: "SimSun", "Microsoft YaHei", Arial, sans-serif;
                    padding: 20px;
                    font-size: 13px;
                    line-height: 1.5;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin: 10px 0;
                    border: 2px solid #000;
                }
                td {
                    border: 1px solid #000;
                    padding: 6px 8px;
                    vertical-align: top;
                }
                .header-cell {
                    background: #e8e8e8;
                    font-weight: bold;
                    text-align: center;
                }
                h2 {
                    font-size: 18px;
                    border-bottom: 2px solid #000;
                    padding-bottom: 8px;
                    margin-bottom: 15px;
                }
                button {
                    display: none !important;
                }
                @media print {
                    body { margin: 0; padding: 15px; }
                    @page { margin: 1cm; }
                }
            </style>
        </head>
        <body>
            ${content.innerHTML}
        </body>
        </html>
    `);
    printWindow.document.close();

    setTimeout(() => {
        printWindow.print();
    }, 500);
}

/**
 * 删除化学品
 */
async function deleteChemical(id) {
    if (!confirm('确定要删除这条化学品数据吗？')) {
        return;
    }

    try {
        await window.msdsDB.deleteChemical(id);
        showMessage('删除成功', 'success');

        // 刷新列表和统计
        await loadStatistics();
        await loadChemicals(currentPage);

    } catch (error) {
        console.error('删除失败:', error);
        showMessage('删除失败: ' + error.message, 'error');
    }
}

/**
 * 清空数据库
 */
async function clearDatabase() {
    if (!confirm('确定要清空整个数据库吗？此操作不可恢复！')) {
        return;
    }

    if (!confirm('再次确认：真的要删除所有化学品数据吗？')) {
        return;
    }

    try {
        await window.msdsDB.clearAll();
        showMessage('数据库已清空', 'success');

        // 刷新
        await loadStatistics();
        await loadChemicals();

    } catch (error) {
        console.error('清空失败:', error);
        showMessage('清空失败: ' + error.message, 'error');
    }
}

/**
 * 显示消息
 */
function showMessage(text, type = 'success') {
    const message = document.getElementById('message');
    message.textContent = text;
    message.className = `message ${type} show`;

    setTimeout(() => {
        message.classList.remove('show');
    }, 5000);
}

/**
 * 切换批量操作模式
 */
function toggleBatchMode() {
    batchMode = !batchMode;
    const batchBar = document.getElementById('batchOperationBar');
    const checkboxHeader = document.getElementById('checkboxHeader');
    const batchModeBtn = document.getElementById('batchModeBtn');

    if (batchMode) {
        batchBar.style.display = 'block';
        checkboxHeader.style.display = 'table-cell';
        batchModeBtn.textContent = '✓ 批量模式';
        batchModeBtn.style.background = '#4CAF50';
    } else {
        batchBar.style.display = 'none';
        checkboxHeader.style.display = 'none';
        batchModeBtn.textContent = '📋 批量操作';
        batchModeBtn.style.background = '#FF9800';
        selectedIds.clear();
    }

    // 重新加载列表以显示/隐藏复选框
    loadChemicals(currentPage);
}

/**
 * 更新选中数量
 */
function updateSelectedCount() {
    const checkboxes = document.querySelectorAll('.chemical-checkbox:checked');
    selectedIds.clear();
    checkboxes.forEach(cb => selectedIds.add(parseInt(cb.dataset.id)));
    document.getElementById('selectedCount').textContent = selectedIds.size;
}

/**
 * 全选/取消全选
 */
function toggleSelectAll(checkbox) {
    const checkboxes = document.querySelectorAll('.chemical-checkbox');
    checkboxes.forEach(cb => {
        cb.checked = checkbox.checked;
        if (checkbox.checked) {
            selectedIds.add(parseInt(cb.dataset.id));
        } else {
            selectedIds.delete(parseInt(cb.dataset.id));
        }
    });
    updateSelectedCount();
}

/**
 * 全选
 */
function selectAll() {
    document.getElementById('selectAllCheckbox').checked = true;
    toggleSelectAll(document.getElementById('selectAllCheckbox'));
}

/**
 * 取消全选
 */
function selectNone() {
    document.getElementById('selectAllCheckbox').checked = false;
    toggleSelectAll(document.getElementById('selectAllCheckbox'));
}

/**
 * 批量导出PDF
 */
async function batchExportPDF() {
    if (selectedIds.size === 0) {
        showMessage('请先选择要导出的化学品', 'error');
        return;
    }

    if (!confirm(`确定要将选中的 ${selectedIds.size} 个化学品导出为PDF吗？`)) {
        return;
    }

    try {
        showMessage(`正在导出 ${selectedIds.size} 个化学品，请稍候...`, 'success');

        // 获取所有选中的化学品数据
        const chemicals = [];
        for (const id of selectedIds) {
            const chemical = await window.msdsDB.getById(id);
            if (chemical) {
                chemicals.push(chemical);
            }
        }

        // 调用批量导出函数
        await exportBatchMSDSToPDF(chemicals);

    } catch (error) {
        console.error('批量导出失败:', error);
        showMessage('批量导出失败: ' + error.message, 'error');
    }
}

/**
 * 批量删除
 */
async function batchDelete() {
    if (selectedIds.size === 0) {
        showMessage('请先选择要删除的化学品', 'error');
        return;
    }

    if (!confirm(`确定要删除选中的 ${selectedIds.size} 个化学品吗？此操作不可恢复！`)) {
        return;
    }

    try {
        let successCount = 0;
        let failCount = 0;

        for (const id of selectedIds) {
            try {
                await window.msdsDB.deleteChemical(id);
                successCount++;
            } catch (error) {
                failCount++;
                console.error(`删除ID ${id} 失败:`, error);
            }
        }

        showMessage(`删除完成！成功 ${successCount} 个，失败 ${failCount} 个`, 'success');

        // 清空选择并刷新
        selectedIds.clear();
        await loadStatistics();
        await loadChemicals(currentPage);

    } catch (error) {
        console.error('批量删除失败:', error);
        showMessage('批量删除失败: ' + error.message, 'error');
    }
}

/**
 * 调试化学品数据结构
 */
async function debugChemical(id) {
    try {
        const chemical = await window.msdsDB.getById(id);
        if (!chemical) {
            showMessage('未找到该化学品', 'error');
            return;
        }

        // 创建调试模态框
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.7);
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
            overflow-y: auto;
        `;

        // 检查急救相关字段
        const firstAidFields = {
            'firstAid': chemical.firstAid,
            'skinContact': chemical.skinContact,
            'eyeContact': chemical.eyeContact,
            'inhalation': chemical.inhalation,
            'ingestion': chemical.ingestion
        };

        const firstAidStatus = Object.entries(firstAidFields).map(([key, value]) => {
            const hasValue = value && value.trim() !== '';
            return `<tr style="${hasValue ? 'background: #d4fcd4;' : 'background: #fce7e7;'}">
                <td style="border: 1px solid #ccc; padding: 8px; font-weight: bold;">${key}</td>
                <td style="border: 1px solid #ccc; padding: 8px;">${hasValue ? '✅' : '❌'}</td>
                <td style="border: 1px solid #ccc; padding: 8px; max-width: 300px; word-wrap: break-word;">${value || '(空)'}</td>
            </tr>`;
        }).join('');

        modal.innerHTML = `
            <div style="background: white; border-radius: 10px; max-width: 800px; width: 100%; max-height: 90vh; overflow-y: auto; padding: 30px; position: relative;">
                <h2 style="margin: 0 0 20px 0; color: #333;">🔍 数据调试 - ${chemical.chineseName || '未知化学品'}</h2>

                <h3 style="color: #8b5cf6; margin: 20px 0 10px 0;">📋 急救信息字段状态</h3>
                <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                    <thead>
                        <tr style="background: #f5f5f5;">
                            <th style="border: 1px solid #ccc; padding: 10px;">字段名</th>
                            <th style="border: 1px solid #ccc; padding: 10px;">状态</th>
                            <th style="border: 1px solid #ccc; padding: 10px;">内容</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${firstAidStatus}
                    </tbody>
                </table>

                <h3 style="color: #f59e0b; margin: 20px 0 10px 0;">🔍 原始文本数据</h3>
                <div style="background: #fffbeb; padding: 15px; border-radius: 5px; border: 1px solid #f59e0b; margin-bottom: 20px;">
                    <p style="margin: 0 0 10px 0; font-weight: bold;">Excel原始文本（前1000字符）：</p>
                    <pre style="background: white; padding: 10px; border-radius: 3px; font-size: 11px; max-height: 150px; overflow-y: auto; white-space: pre-wrap;">${(chemical.rawData || '暂无原始数据').substring(0, 1000)}${chemical.rawData && chemical.rawData.length > 1000 ? '...' : ''}</pre>
                </div>

                <h3 style="color: #2563eb; margin: 20px 0 10px 0;">📄 完整数据结构</h3>
                <pre style="background: #f8f9fa; padding: 15px; border-radius: 5px; overflow-x: auto; max-height: 300px; font-size: 12px; border: 1px solid #dee2e6;">${JSON.stringify(chemical, null, 2)}</pre>

                <div style="text-align: center; margin-top: 20px;">
                    <button onclick="this.closest('div').parentElement.remove()" style="padding: 10px 20px; background: #6c757d; color: white; border: none; border-radius: 5px; cursor: pointer;">
                        关闭
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // 点击遮罩关闭
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });

    } catch (error) {
        console.error('调试失败:', error);
        showMessage('调试失败: ' + error.message, 'error');
    }
}

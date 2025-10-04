/**
 * OEL管理页面交互逻辑
 */

let currentPage = 1;
const pageSize = 20;

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', async function() {
    console.log('页面加载完成，开始初始化...');

    try {
        // 检查依赖库
        if (typeof XLSX === 'undefined') {
            console.error('❌ XLSX库未加载');
            showMessage('Excel解析库加载失败，请刷新页面重试', 'error');
            return;
        }
        console.log('✓ XLSX库已加载');

        if (typeof window.oelDB === 'undefined') {
            console.error('❌ OEL数据库未初始化');
            showMessage('数据库模块加载失败，请刷新页面重试', 'error');
            return;
        }
        console.log('✓ OEL数据库对象已创建');

        if (typeof window.oelImporter === 'undefined') {
            console.error('❌ OEL导入器未初始化');
            showMessage('导入模块加载失败，请刷新页面重试', 'error');
            return;
        }
        console.log('✓ OEL导入器对象已创建');

        // 等待数据库初始化
        console.log('正在初始化数据库...');
        await window.oelDB.init();
        console.log('✓ 数据库初始化成功');

        // 加载统计信息和数据列表
        console.log('正在加载统计信息...');
        await loadStatistics();
        console.log('✓ 统计信息加载完成');

        console.log('正在加载化学品列表...');
        await loadChemicals();
        console.log('✓ 化学品列表加载完成');

        // 绑定上传区域事件
        console.log('正在绑定上传事件...');
        setupUploadArea();
        console.log('✓ 上传事件绑定完成');

        console.log('✅ 页面初始化完成！');
        showMessage('页面初始化完成，可以开始导入数据', 'success');

    } catch (error) {
        console.error('❌ 初始化失败:', error);
        showMessage('初始化失败: ' + error.message, 'error');
    }
});

/**
 * 设置上传区域
 */
function setupUploadArea() {
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');

    // 验证元素是否存在
    if (!uploadArea) {
        console.error('❌ 找不到uploadArea元素！');
        return;
    }
    if (!fileInput) {
        console.error('❌ 找不到fileInput元素！');
        return;
    }
    console.log('✓ 上传区域元素找到:', uploadArea);
    console.log('✓ 文件输入元素找到:', fileInput);

    // 点击上传
    uploadArea.addEventListener('click', () => {
        console.log('上传区域被点击');
        fileInput.click();
    });

    // 文件选择
    fileInput.addEventListener('change', (e) => {
        console.log('文件输入框变化，文件数量:', e.target.files.length);
        if (e.target.files.length > 0) {
            handleFileUpload(e.target.files[0]);
        }
    });

    // 阻止整个文档的默认拖拽行为
    console.log('正在绑定全局拖拽阻止事件...');
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        document.addEventListener(eventName, (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('全局事件被阻止:', eventName);
        }, true);  // 使用捕获阶段
    });

    // 拖拽上传 - 进入上传区域
    uploadArea.addEventListener('dragenter', (e) => {
        console.log('🎯 dragenter 事件触发');
        e.preventDefault();
        e.stopPropagation();
        uploadArea.classList.add('dragging');
    }, true);

    // 拖拽上传 - 在上传区域上方
    uploadArea.addEventListener('dragover', (e) => {
        console.log('🎯 dragover 事件触发');
        e.preventDefault();
        e.stopPropagation();
        uploadArea.classList.add('dragging');
    }, true);

    // 拖拽上传 - 离开上传区域
    uploadArea.addEventListener('dragleave', (e) => {
        console.log('🎯 dragleave 事件触发');
        e.preventDefault();
        e.stopPropagation();
        uploadArea.classList.remove('dragging');
    }, true);

    // 拖拽上传 - 释放文件
    uploadArea.addEventListener('drop', (e) => {
        console.log('🎯 drop 事件触发！');
        e.preventDefault();
        e.stopPropagation();
        uploadArea.classList.remove('dragging');

        console.log('dataTransfer对象:', e.dataTransfer);
        console.log('拖拽的文件数量:', e.dataTransfer.files.length);

        if (e.dataTransfer.files.length > 0) {
            const file = e.dataTransfer.files[0];
            console.log('✓ 准备处理文件:', file.name, '大小:', (file.size / 1024 / 1024).toFixed(2), 'MB');
            handleFileUpload(file);
        } else {
            console.warn('❌ 没有检测到文件');
        }
    }, true);

    console.log('✅ 上传区域所有事件已绑定完成');
}

/**
 * 处理文件上传
 */
async function handleFileUpload(file) {
    console.log('开始处理文件上传:', file.name);

    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
        console.error('文件格式不正确:', file.name);
        showMessage('请上传Excel文件（.xlsx或.xls格式）', 'error');
        return;
    }

    try {
        console.log('文件大小:', (file.size / 1024 / 1024).toFixed(2), 'MB');
        showMessage('正在读取Excel文件...', 'success');
        document.getElementById('progressContainer').style.display = 'block';

        // 读取Excel文件
        console.log('开始读取Excel文件...');
        await window.oelImporter.readFile(file);
        console.log('✓ Excel文件读取成功');

        // 导入数据库（带进度回调）
        console.log('开始导入数据库...');
        const result = await window.oelImporter.importToDatabase(file.name, (progress) => {
            console.log('导入进度:', progress);
            updateProgress(progress);
        });
        console.log('✓ 数据导入完成:', result);

        // 导入完成
        showMessage(
            `导入成功！共提取 ${result.totalExtracted} 条数据，成功导入 ${result.successCount} 条`,
            'success'
        );

        // 刷新统计和列表
        console.log('刷新统计和列表...');
        await loadStatistics();
        await loadChemicals();
        console.log('✓ 刷新完成');

        // 重置上传区域
        document.getElementById('fileInput').value = '';
        document.getElementById('progressContainer').style.display = 'none';

    } catch (error) {
        console.error('❌ 导入失败:', error);
        console.error('错误堆栈:', error.stack);
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

    progressInfo.textContent = `正在处理: ${progress.currentSheet || '未知'} (${progress.current}/${progress.total})`;
}

/**
 * 加载统计信息
 */
async function loadStatistics() {
    try {
        const stats = await window.oelDB.getStatistics();
        document.getElementById('totalChemicals').textContent = stats.totalChemicals;
        document.getElementById('hasMAC').textContent = stats.hasMAC;
        document.getElementById('hasPCTWA').textContent = stats.hasPCTWA;
        document.getElementById('hasPCSTEL').textContent = stats.hasPCSTEL;
        document.getElementById('carcinogens').textContent = stats.carcinogens;

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
        const result = await window.oelDB.getAll(page, pageSize);

        const tbody = document.getElementById('chemicalTableBody');
        tbody.innerHTML = '';

        if (result.data.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="9" style="text-align: center; padding: 40px; color: #999;">
                        暂无数据，请先导入Excel文件
                    </td>
                </tr>
            `;
            return;
        }

        result.data.forEach(chemical => {
            const row = document.createElement('tr');

            // 生成标识徽章
            const badges = [];
            if (chemical.carcinogenClass) {
                badges.push(`<span class="badge badge-carcinogen">${chemical.carcinogenClass}</span>`);
            }
            if (chemical.skinAbsorption) {
                badges.push(`<span class="badge badge-skin">皮</span>`);
            }
            if (chemical.sensitization) {
                badges.push(`<span class="badge badge-sensitive">敏</span>`);
            }

            row.innerHTML = `
                <td>${chemical.serialNumber || '-'}</td>
                <td>${chemical.chineseName || '-'}</td>
                <td>${chemical.englishName || '-'}</td>
                <td>${chemical.casNumber || '-'}</td>
                <td>${chemical.MAC !== null ? chemical.MAC : '-'}</td>
                <td>${chemical.PC_TWA !== null ? chemical.PC_TWA : '-'}</td>
                <td>${chemical.PC_STEL !== null ? chemical.PC_STEL : '-'}</td>
                <td>${badges.join(' ') || '-'}</td>
                <td>
                    <button class="action-btn btn-view" onclick="viewChemical(${chemical.id})">
                        查看
                    </button>
                    <button class="action-btn btn-debug" onclick="debugOELChemical(${chemical.id})" style="background: #8b5cf6; color: white;">
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
        const results = await window.oelDB.search(keyword);

        const tbody = document.getElementById('chemicalTableBody');
        tbody.innerHTML = '';

        if (results.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="9" style="text-align: center; padding: 40px; color: #999;">
                        未找到匹配的化学品
                    </td>
                </tr>
            `;
            document.getElementById('pagination').innerHTML = '';
            return;
        }

        results.forEach(chemical => {
            const row = document.createElement('tr');

            const badges = [];
            if (chemical.carcinogenClass) {
                badges.push(`<span class="badge badge-carcinogen">${chemical.carcinogenClass}</span>`);
            }
            if (chemical.skinAbsorption) {
                badges.push(`<span class="badge badge-skin">皮</span>`);
            }
            if (chemical.sensitization) {
                badges.push(`<span class="badge badge-sensitive">敏</span>`);
            }

            row.innerHTML = `
                <td>${chemical.serialNumber || '-'}</td>
                <td>${chemical.chineseName || '-'}</td>
                <td>${chemical.englishName || '-'}</td>
                <td>${chemical.casNumber || '-'}</td>
                <td>${chemical.MAC !== null ? chemical.MAC : '-'}</td>
                <td>${chemical.PC_TWA !== null ? chemical.PC_TWA : '-'}</td>
                <td>${chemical.PC_STEL !== null ? chemical.PC_STEL : '-'}</td>
                <td>${badges.join(' ') || '-'}</td>
                <td>
                    <button class="action-btn btn-view" onclick="viewChemical(${chemical.id})">
                        查看
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
 * 查看化学品详情
 */
async function viewChemical(id) {
    try {
        const chemical = await window.oelDB.getById(id);
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

        modal.innerHTML = `
            <div style="background: white; border-radius: 15px; max-width: 800px; width: 100%; max-height: 90vh; overflow-y: auto; padding: 30px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; border-bottom: 2px solid #10B981; padding-bottom: 15px;">
                    <h2 style="margin: 0; color: #10B981;">📋 职业接触限值详情</h2>
                    <button onclick="this.closest('div').parentElement.remove()" style="padding: 8px 16px; background: #f44336; color: white; border: none; border-radius: 5px; cursor: pointer;">
                        ✕ 关闭
                    </button>
                </div>

                <!-- 基本信息 -->
                <div style="margin-bottom: 25px;">
                    <h3 style="color: #10B981; margin-bottom: 15px;">基本信息</h3>
                    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px;">
                        <div><strong>序号：</strong>${chemical.serialNumber || '-'}</div>
                        <div><strong>CAS号：</strong>${chemical.casNumber || '-'}</div>
                        <div><strong>中文名：</strong>${chemical.chineseName || '-'}</div>
                        <div><strong>英文名：</strong>${chemical.englishName || '-'}</div>
                    </div>
                </div>

                <!-- 职业接触限值 -->
                <div style="margin-bottom: 25px;">
                    <h3 style="color: #10B981; margin-bottom: 15px;">职业接触限值 (mg/m³)</h3>
                    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px;">
                        <div style="background: #f0fdf4; padding: 15px; border-radius: 8px; text-align: center;">
                            <div style="font-size: 12px; color: #666; margin-bottom: 5px;">最高容许浓度 (MAC)</div>
                            <div style="font-size: 24px; font-weight: bold; color: #10B981;">${chemical.MAC !== null ? chemical.MAC : '-'}</div>
                        </div>
                        <div style="background: #f0fdf4; padding: 15px; border-radius: 8px; text-align: center;">
                            <div style="font-size: 12px; color: #666; margin-bottom: 5px;">时间加权平均 (PC-TWA)</div>
                            <div style="font-size: 24px; font-weight: bold; color: #10B981;">${chemical.PC_TWA !== null ? chemical.PC_TWA : '-'}</div>
                        </div>
                        <div style="background: #f0fdf4; padding: 15px; border-radius: 8px; text-align: center;">
                            <div style="font-size: 12px; color: #666; margin-bottom: 5px;">短时间接触 (PC-STEL)</div>
                            <div style="font-size: 24px; font-weight: bold; color: #10B981;">${chemical.PC_STEL !== null ? chemical.PC_STEL : '-'}</div>
                        </div>
                    </div>
                </div>

                <!-- 健康损害效应 -->
                <div style="margin-bottom: 25px;">
                    <h3 style="color: #10B981; margin-bottom: 15px;">健康损害效应</h3>
                    <div style="background: #f9f9f9; padding: 15px; border-radius: 8px;">
                        ${chemical.healthEffect || '暂无信息'}
                    </div>
                    ${chemical.targetOrgans && chemical.targetOrgans.length > 0 ? `
                        <div style="margin-top: 10px;">
                            <strong>靶器官：</strong>
                            ${chemical.targetOrgans.map(organ => `<span style="background: #e7f3ff; padding: 4px 10px; border-radius: 12px; margin-right: 5px; font-size: 13px;">${organ}</span>`).join('')}
                        </div>
                    ` : ''}
                </div>

                <!-- 特殊标识 -->
                <div style="margin-bottom: 25px;">
                    <h3 style="color: #10B981; margin-bottom: 15px;">特殊标识</h3>
                    <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                        ${chemical.carcinogenClass ? `<span style="background: #fee; color: #c33; padding: 8px 15px; border-radius: 20px; font-weight: 500;">致癌物 ${chemical.carcinogenClass}</span>` : ''}
                        ${chemical.skinAbsorption ? `<span style="background: #fef3cd; color: #856404; padding: 8px 15px; border-radius: 20px; font-weight: 500;">可经皮吸收</span>` : ''}
                        ${chemical.sensitization ? `<span style="background: #e7f3ff; color: #0056b3; padding: 8px 15px; border-radius: 20px; font-weight: 500;">致敏物</span>` : ''}
                        ${!chemical.carcinogenClass && !chemical.skinAbsorption && !chemical.sensitization ? '<span style="color: #999;">无特殊标识</span>' : ''}
                    </div>
                </div>

                <!-- 标准信息 -->
                <div style="background: #f0fdf4; padding: 15px; border-radius: 8px; border-left: 4px solid #10B981;">
                    <strong>标准依据：</strong>${chemical.standard || 'GBZ 2.1-2019'}<br>
                    <strong>标准名称：</strong>${chemical.standardName || '工作场所有害因素职业接触限值 第1部分：化学有害因素'}
                </div>
            </div>
        `;

        document.body.appendChild(modal);

    } catch (error) {
        console.error('查看详情失败:', error);
        showMessage('查看详情失败: ' + error.message, 'error');
    }
}

/**
 * 删除化学品
 */
async function deleteChemical(id) {
    if (!confirm('确定要删除这条数据吗？')) {
        return;
    }

    try {
        await window.oelDB.deleteChemical(id);
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

    if (!confirm('再次确认：真的要删除所有OEL数据吗？')) {
        return;
    }

    try {
        await window.oelDB.clearAll();
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
 * 调试OEL化学品数据结构
 */
async function debugOELChemical(id) {
    try {
        const chemical = await window.oelDB.getById(id);
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

        // 检查关键字段状态
        const fieldStatus = {
            'chineseName': chemical.chineseName,
            'englishName': chemical.englishName,
            'casNumber': chemical.casNumber,
            'serialNumber': chemical.serialNumber,
            'MAC': chemical.MAC,
            'PC_TWA': chemical.PC_TWA,
            'PC_STEL': chemical.PC_STEL,
            'healthEffect': chemical.healthEffect,
            'carcinogenClass': chemical.carcinogenClass,
            'skinAbsorption': chemical.skinAbsorption,
            'sensitization': chemical.sensitization,
            'remark': chemical.remark
        };

        const fieldStatusTable = Object.entries(fieldStatus).map(([key, value]) => {
            const hasValue = value !== null && value !== undefined && value !== '';
            const displayValue = hasValue ? value : '(空)';
            return `<tr style="${hasValue ? 'background: #d4fcd4;' : 'background: #fce7e7;'}">
                <td style="border: 1px solid #ccc; padding: 8px; font-weight: bold;">${key}</td>
                <td style="border: 1px solid #ccc; padding: 8px;">${hasValue ? '✅' : '❌'}</td>
                <td style="border: 1px solid #ccc; padding: 8px; max-width: 300px; word-wrap: break-word;">${displayValue}</td>
            </tr>`;
        }).join('');

        modal.innerHTML = `
            <div style="background: white; border-radius: 10px; max-width: 800px; width: 100%; max-height: 90vh; overflow-y: auto; padding: 30px; position: relative;">
                <h2 style="margin: 0 0 20px 0; color: #333;">🔍 OEL数据调试 - ${chemical.chineseName || '未知化学品'}</h2>

                <h3 style="color: #10B981; margin: 20px 0 10px 0;">📋 关键字段状态</h3>
                <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                    <thead>
                        <tr style="background: #f5f5f5;">
                            <th style="border: 1px solid #ccc; padding: 10px;">字段名</th>
                            <th style="border: 1px solid #ccc; padding: 10px;">状态</th>
                            <th style="border: 1px solid #ccc; padding: 10px;">内容</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${fieldStatusTable}
                    </tbody>
                </table>

                <h3 style="color: #f59e0b; margin: 20px 0 10px 0;">🔍 原始导入数据</h3>
                <div style="background: #fffbeb; padding: 15px; border-radius: 5px; border: 1px solid #f59e0b; margin-bottom: 20px;">
                    <p style="margin: 0 0 10px 0; font-weight: bold;">Excel原始数据：</p>
                    <pre style="background: white; padding: 10px; border-radius: 3px; font-size: 11px; max-height: 150px; overflow-y: auto; white-space: pre-wrap;">${chemical.rawData || '暂无原始数据'}</pre>
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

// 暴露关键函数为全局函数，供备用上传功能使用
window.handleFileUpload = handleFileUpload;
window.loadStatistics = loadStatistics;
window.loadChemicals = loadChemicals;
window.debugOELChemical = debugOELChemical;
window.showMessage = showMessage;

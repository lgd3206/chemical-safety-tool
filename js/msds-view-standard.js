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
            font-size: 14px;
            line-height: 1.6;
        `;

        const cellStyle = `
            border: 1px solid #000;
            padding: 8px;
            vertical-align: top;
        `;

        const headerStyle = `
            ${cellStyle}
            background: #f0f0f0;
            font-weight: bold;
            text-align: left;
        `;

        modal.innerHTML = `
            <div id="msds-content" style="background: white; border-radius: 10px; max-width: 1000px; width: 100%; max-height: 90vh; overflow-y: auto; padding: 30px; position: relative;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                    <h2 style="margin: 0;">物质安全数据表（MSDS）</h2>
                    <div>
                        <button onclick="printMSDS()" style="padding: 8px 16px; background: #4CAF50; color: white; border: none; border-radius: 5px; cursor: pointer; margin-right: 10px;">
                            🖨️ 打印
                        </button>
                        <button onclick="this.closest('#msds-content').parentElement.remove()" style="padding: 8px 16px; background: #f44336; color: white; border: none; border-radius: 5px; cursor: pointer;">
                            ✕ 关闭
                        </button>
                    </div>
                </div>

                <!-- 标识 -->
                <table style="${tableStyle}">
                    <tr>
                        <td style="${headerStyle}" rowspan="3" width="60">标识</td>
                        <td style="${cellStyle}" width="25%">中文名：${chemical.chineseName || '-'}</td>
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
                        <td style="${cellStyle}">熔点（℃）：${chemical.meltingPoint || '-'}</td>
                        <td style="${cellStyle}">沸点（℃）：${chemical.boilingPoint || '-'}</td>
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
                        <td style="${cellStyle}">饱和蒸气压（UPa）：${chemical.saturatedVaporPressure || '-'}</td>
                    </tr>
                </table>

                <!-- 燃烧爆炸危险性 -->
                <table style="${tableStyle}">
                    <tr>
                        <td style="${headerStyle}" rowspan="6" width="60">燃烧<br>爆炸<br>危险性</td>
                        <td style="${cellStyle}" width="30%">燃烧性：${chemical.flammability || '-'}</td>
                        <td style="${cellStyle}" colspan="2">燃烧分解产物：-</td>
                    </tr>
                    <tr>
                        <td style="${cellStyle}">闪点（℃）：${chemical.flashPoint || '-'}</td>
                        <td style="${cellStyle}" colspan="2">聚合危害：-</td>
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
                        <td style="${cellStyle}" colspan="3">危险特性：${chemical.hazardCharacteristics || '-'}</td>
                    </tr>
                    <tr>
                        <td style="${cellStyle}" colspan="4">灭火方法：${chemical.extinguishingMethod || '-'}</td>
                    </tr>
                </table>

                <!-- 对人体危害 -->
                <table style="${tableStyle}">
                    <tr>
                        <td style="${headerStyle}" rowspan="2" width="60">对人<br>体危<br>害</td>
                        <td style="${cellStyle}" colspan="3">侵入途径：${chemical.routes || (chemical.healthHazard ? '吸入、食入' : '-')}</td>
                    </tr>
                    <tr>
                        <td style="${cellStyle}" colspan="3">健康危害：${chemical.healthHazard || '-'}</td>
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
                        <td style="${cellStyle}" colspan="3">身体防护：${chemical.bodyProtection || '-'}</td>
                    </tr>
                    <tr>
                        <td style="${cellStyle}" colspan="3">手防护：${chemical.handProtection || '-'}</td>
                    </tr>
                    <tr>
                        <td style="${cellStyle}" colspan="3">其他防护：${chemical.otherProtection || '-'}</td>
                    </tr>
                </table>

                <!-- 泄漏应急处理 -->
                <table style="${tableStyle}">
                    <tr>
                        <td style="${headerStyle}" rowspan="3" width="60">泄漏<br>应急<br>处理</td>
                        <td style="${cellStyle}" colspan="3">${chemical.leakageDisposal || '-'}</td>
                    </tr>
                    <tr>
                        <td style="${cellStyle}" colspan="3">小量泄漏：${chemical.personalPrecautions || '-'}</td>
                    </tr>
                    <tr>
                        <td style="${cellStyle}" colspan="3">大量泄漏：${chemical.environmentalPrecautions || '-'}</td>
                    </tr>
                </table>

                <!-- 贮运 -->
                <table style="${tableStyle}">
                    <tr>
                        <td style="${headerStyle}" rowspan="2" width="60">贮运</td>
                        <td style="${cellStyle}" colspan="3">
                            包装标志：- &nbsp;&nbsp;&nbsp;&nbsp;
                            UN 编号：${chemical.unNumber || '-'} &nbsp;&nbsp;&nbsp;&nbsp;
                            包装分类：- &nbsp;&nbsp;&nbsp;&nbsp;
                            包装方法：-
                        </td>
                    </tr>
                    <tr>
                        <td style="${cellStyle}" colspan="3">储运条件：${chemical.storage || '-'}</td>
                    </tr>
                </table>

                <div style="margin-top: 20px; padding: 15px; background: #f5f5f5; border-radius: 5px;">
                    <strong>📄 完整原始数据：</strong>
                    <pre style="max-height: 200px; overflow-y: auto; background: white; padding: 10px; border-radius: 5px; margin-top: 10px; font-size: 12px; white-space: pre-wrap;">${chemical.rawData || '暂无原始数据'}</pre>
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
 * 打印MSDS
 */
function printMSDS() {
    const content = document.getElementById('msds-content');
    if (!content) return;

    // 创建打印窗口
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>物质安全数据表（MSDS）</title>
            <style>
                body {
                    font-family: "Microsoft YaHei", Arial, sans-serif;
                    padding: 20px;
                    font-size: 14px;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin: 10px 0;
                    border: 2px solid #000;
                }
                td {
                    border: 1px solid #000;
                    padding: 8px;
                    vertical-align: top;
                }
                .header-cell {
                    background: #f0f0f0;
                    font-weight: bold;
                }
                @media print {
                    body { margin: 0; padding: 15px; }
                }
            </style>
        </head>
        <body>
            ${content.innerHTML}
        </body>
        </html>
    `);
    printWindow.document.close();

    // 等待内容加载后打印
    setTimeout(() => {
        printWindow.print();
    }, 500);
}

/**
 * MSDS PDF导出功能
 * 使用 jsPDF + html2canvas 生成PDF
 */

/**
 * 导出单个MSDS为PDF
 */
async function exportMSDSToPDF(chemical) {
    try {
        showMessage('正在生成PDF，请稍候...', 'success');

        // 创建临时容器用于生成PDF
        const tempContainer = document.createElement('div');
        tempContainer.style.cssText = `
            position: absolute;
            left: -9999px;
            width: 800px;
            background: white;
            padding: 40px;
            font-family: "SimSun", "Microsoft YaHei", Arial, sans-serif;
        `;

        tempContainer.innerHTML = generateMSDSHTML(chemical);
        document.body.appendChild(tempContainer);

        // 等待DOM渲染
        await new Promise(resolve => setTimeout(resolve, 100));

        // 使用html2canvas转换为图片
        const canvas = await html2canvas(tempContainer, {
            scale: 2,
            useCORS: true,
            logging: false,
            backgroundColor: '#ffffff'
        });

        // 创建PDF
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');

        const imgWidth = 210; // A4宽度
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;
        let position = 0;

        // 添加第一页
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= 297; // A4高度

        // 如果内容超过一页，添加新页
        while (heightLeft > 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= 297;
        }

        // 保存PDF
        const fileName = `MSDS-${chemical.chineseName || 'unknown'}-${new Date().getTime()}.pdf`;
        pdf.save(fileName);

        // 清理临时容器
        document.body.removeChild(tempContainer);

        showMessage('PDF导出成功！', 'success');

    } catch (error) {
        console.error('PDF导出失败:', error);
        showMessage('PDF导出失败: ' + error.message, 'error');
    }
}

/**
 * 生成MSDS的HTML内容（用于PDF）
 */
function generateMSDSHTML(chemical) {
    const tableStyle = `
        width: 100%;
        border-collapse: collapse;
        margin: 10px 0;
        border: 2px solid #000;
        font-size: 12px;
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

    return `
        <div style="font-family: 'SimSun', 'Microsoft YaHei', Arial, sans-serif;">
            <h2 style="text-align: center; font-size: 18px; margin-bottom: 20px; border-bottom: 2px solid #000; padding-bottom: 10px;">
                物质安全数据表（MSDS）
            </h2>

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
                    <td style="${headerStyle}" rowspan="7" width="60">燃烧<br>爆炸<br>危险性</td>
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
                    <td style="${cellStyle}" colspan="3">危险特性：${chemical.hazardCharacteristics || '暂无'}</td>
                </tr>
                <tr>
                    <td style="${cellStyle}" colspan="3">灭火方法：${chemical.extinguishingMethod || '-'}</td>
                </tr>
            </table>

            <!-- 对人体危害 -->
            <table style="${tableStyle}">
                <tr>
                    <td style="${headerStyle}" rowspan="2" width="60">对人体<br>危害</td>
                    <td style="${cellStyle}" colspan="3">侵入途径：${chemical.routes || '吸入、食入'}</td>
                </tr>
                <tr>
                    <td style="${cellStyle}" colspan="3">健康危害：${chemical.healthHazard || '暂无'}</td>
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
                    <td style="${headerStyle}" width="60">泄漏应急<br>处理</td>
                    <td style="${cellStyle}">${chemical.leakageDisposal || '暂无'}</td>
                </tr>
            </table>

            <!-- 贮运 -->
            <table style="${tableStyle}">
                <tr>
                    <td style="${headerStyle}" rowspan="2" width="60">贮运</td>
                    <td style="${cellStyle}">
                        包装标志：- &nbsp;&nbsp;
                        UN 编号：${chemical.unNumber || '-'} &nbsp;&nbsp;
                        包装分类：- &nbsp;&nbsp;
                        包装方法：-
                    </td>
                </tr>
                <tr>
                    <td style="${cellStyle}">储运条件：${chemical.storage || '暂无'}</td>
                </tr>
            </table>

            <div style="margin-top: 30px; text-align: center; font-size: 11px; color: #666;">
                <p>本MSDS由化学品安全工具自动生成 - 生成日期：${new Date().toLocaleDateString('zh-CN')}</p>
            </div>
        </div>
    `;
}

/**
 * 批量导出MSDS为PDF
 */
async function exportBatchMSDSToPDF(chemicals) {
    if (!chemicals || chemicals.length === 0) {
        showMessage('请先选择要导出的化学品', 'error');
        return;
    }

    try {
        showMessage(`正在生成 ${chemicals.length} 个化学品的PDF，请稍候...`, 'success');

        const pdf = new jsPDF('p', 'mm', 'a4');

        for (let i = 0; i < chemicals.length; i++) {
            if (i > 0) {
                pdf.addPage();
            }

            const chemical = chemicals[i];

            // 创建临时容器
            const tempContainer = document.createElement('div');
            tempContainer.style.cssText = `
                position: absolute;
                left: -9999px;
                width: 800px;
                background: white;
                padding: 40px;
            `;
            tempContainer.innerHTML = generateMSDSHTML(chemical);
            document.body.appendChild(tempContainer);

            await new Promise(resolve => setTimeout(resolve, 100));

            const canvas = await html2canvas(tempContainer, {
                scale: 2,
                useCORS: true,
                logging: false,
                backgroundColor: '#ffffff'
            });

            const imgData = canvas.toDataURL('image/png');
            const imgWidth = 210;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);

            document.body.removeChild(tempContainer);

            // 更新进度
            showMessage(`正在生成PDF... (${i + 1}/${chemicals.length})`, 'success');
        }

        // 保存合并的PDF
        const fileName = `MSDS批量导出-${chemicals.length}个化学品-${new Date().getTime()}.pdf`;
        pdf.save(fileName);

        showMessage('批量PDF导出成功！', 'success');

    } catch (error) {
        console.error('批量导出失败:', error);
        showMessage('批量导出失败: ' + error.message, 'error');
    }
}

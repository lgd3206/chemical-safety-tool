/**
 * 模块集成API
 * 实现MSDS与OEL模块之间的数据共享
 */

class ModuleIntegration {
    /**
     * 通过CAS号获取OEL数据
     */
    static async getOELByCAS(casNumber) {
        try {
            await window.oelDB.init();
            return await window.oelDB.getByCAS(casNumber);
        } catch (error) {
            console.error('获取OEL数据失败:', error);
            return null;
        }
    }

    /**
     * 通过CAS号获取MSDS数据
     */
    static async getMSDS_ByCAS(casNumber) {
        try {
            await window.msdsDB.init();
            // 通过CAS号搜索MSDS
            const results = await window.msdsDB.search(casNumber);
            return results.length > 0 ? results[0] : null;
        } catch (error) {
            console.error('获取MSDS数据失败:', error);
            return null;
        }
    }

    /**
     * 获取化学品的完整安全信息（MSDS + OEL）
     */
    static async getCompleteChemicalInfo(casNumber) {
        const [msds, oel] = await Promise.all([
            this.getMSDS_ByCAS(casNumber),
            this.getOELByCAS(casNumber)
        ]);

        return {
            casNumber,
            msds,
            oel,
            hasData: msds !== null || oel !== null
        };
    }

    /**
     * 在MSDS详情中显示OEL信息
     */
    static async appendOELToMSDS(msdsElement, casNumber) {
        const oel = await this.getOELByCAS(casNumber);

        if (!oel) {
            return;
        }

        const oelSection = document.createElement('div');
        oelSection.style.cssText = `
            margin-top: 30px;
            padding: 20px;
            background: #f0fdf4;
            border-radius: 8px;
            border-left: 4px solid #10B981;
        `;

        oelSection.innerHTML = `
            <h3 style="color: #10B981; margin-bottom: 15px;">
                🛡️ 职业接触限值 (GBZ 2.1-2019)
            </h3>
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin-bottom: 15px;">
                <div style="background: white; padding: 15px; border-radius: 8px; text-align: center;">
                    <div style="font-size: 12px; color: #666; margin-bottom: 5px;">最高容许浓度 (MAC)</div>
                    <div style="font-size: 20px; font-weight: bold; color: #10B981;">
                        ${oel.MAC !== null ? oel.MAC + ' mg/m³' : '-'}
                    </div>
                </div>
                <div style="background: white; padding: 15px; border-radius: 8px; text-align: center;">
                    <div style="font-size: 12px; color: #666; margin-bottom: 5px;">时间加权平均 (PC-TWA)</div>
                    <div style="font-size: 20px; font-weight: bold; color: #10B981;">
                        ${oel.PC_TWA !== null ? oel.PC_TWA + ' mg/m³' : '-'}
                    </div>
                </div>
                <div style="background: white; padding: 15px; border-radius: 8px; text-align: center;">
                    <div style="font-size: 12px; color: #666; margin-bottom: 5px;">短时间接触 (PC-STEL)</div>
                    <div style="font-size: 20px; font-weight: bold; color: #10B981;">
                        ${oel.PC_STEL !== null ? oel.PC_STEL + ' mg/m³' : '-'}
                    </div>
                </div>
            </div>
            <div style="margin-top: 10px;">
                <strong>健康损害效应：</strong>${oel.healthEffect || '暂无信息'}
            </div>
            <div style="margin-top: 10px; text-align: right;">
                <a href="oel-search.html?cas=${casNumber}" target="_blank"
                   style="color: #10B981; text-decoration: none; font-weight: 500;">
                    查看完整OEL信息 →
                </a>
            </div>
        `;

        msdsElement.appendChild(oelSection);
    }

    /**
     * 在OEL详情中显示MSDS信息
     */
    static async appendMSDSToOEL(oelElement, casNumber) {
        const msds = await this.getMSDS_ByCAS(casNumber);

        if (!msds) {
            return;
        }

        const msdsSection = document.createElement('div');
        msdsSection.style.cssText = `
            margin-top: 30px;
            padding: 20px;
            background: #eff6ff;
            border-radius: 8px;
            border-left: 4px solid #3b82f6;
        `;

        msdsSection.innerHTML = `
            <h3 style="color: #3b82f6; margin-bottom: 15px;">
                📋 MSDS安全技术说明书
            </h3>
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin-bottom: 15px;">
                <div><strong>中文名：</strong>${msds.chineseName || '-'}</div>
                <div><strong>英文名：</strong>${msds.englishName || '-'}</div>
                <div><strong>分子式：</strong>${msds.molecularFormula || '-'}</div>
                <div><strong>分子量：</strong>${msds.molecularWeight || '-'}</div>
            </div>
            <div style="margin-top: 10px;">
                <strong>危险特性：</strong>${msds.hazardCharacteristics || '暂无信息'}
            </div>
            <div style="margin-top: 10px;">
                <strong>急救措施：</strong>${msds.firstAid || msds.skinContact || '暂无信息'}
            </div>
            <div style="margin-top: 10px; text-align: right;">
                <a href="msds-search.html?cas=${casNumber}" target="_blank"
                   style="color: #3b82f6; text-decoration: none; font-weight: 500;">
                    查看完整MSDS →
                </a>
            </div>
        `;

        oelElement.appendChild(msdsSection);
    }

    /**
     * 检查化学品数据完整性
     */
    static async checkDataCompleteness(casNumber) {
        const info = await this.getCompleteChemicalInfo(casNumber);

        return {
            casNumber,
            hasMSDS: info.msds !== null,
            hasOEL: info.oel !== null,
            completeness: ((info.msds ? 50 : 0) + (info.oel ? 50 : 0)) + '%',
            recommendations: this.getRecommendations(info)
        };
    }

    /**
     * 获取数据改进建议
     */
    static getRecommendations(info) {
        const recommendations = [];

        if (!info.msds) {
            recommendations.push({
                type: 'missing',
                module: 'MSDS',
                message: '缺少MSDS数据，建议导入化学品安全技术说明书'
            });
        }

        if (!info.oel) {
            recommendations.push({
                type: 'missing',
                module: 'OEL',
                message: '缺少职业接触限值数据，建议导入GBZ 2.1-2019标准数据'
            });
        }

        if (info.msds && info.oel) {
            recommendations.push({
                type: 'complete',
                message: '数据完整，可进行全面的风险评估'
            });
        }

        return recommendations;
    }

    /**
     * 批量关联数据
     */
    static async linkMSDSAndOEL() {
        try {
            await window.msdsDB.init();
            await window.oelDB.init();

            const msdsData = await window.msdsDB.getAll(1, 1000);
            const linked = [];
            const unlinked = [];

            for (const msds of msdsData.data) {
                if (msds.casNumber) {
                    const oel = await window.oelDB.getByCAS(msds.casNumber);
                    if (oel) {
                        linked.push({
                            casNumber: msds.casNumber,
                            chineseName: msds.chineseName,
                            msds: msds,
                            oel: oel
                        });
                    } else {
                        unlinked.push({
                            casNumber: msds.casNumber,
                            chineseName: msds.chineseName
                        });
                    }
                }
            }

            return {
                total: msdsData.data.length,
                linked: linked.length,
                unlinked: unlinked.length,
                linkedData: linked,
                unlinkedData: unlinked
            };
        } catch (error) {
            console.error('关联数据失败:', error);
            return null;
        }
    }
}

// 全局导出
window.ModuleIntegration = ModuleIntegration;

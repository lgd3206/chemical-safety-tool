export class ChemicalDataService {
    constructor() {
        this.baseUrl = 'https://pubchem.ncbi.nlm.nih.gov/rest/pug';
        this.requestDelay = 200; // 请求间隔，避免API限制
    }

    async delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async searchByName(name) {
        try {
            const searchUrl = `${this.baseUrl}/compound/name/${encodeURIComponent(name)}/cids/JSON`;
            const response = await fetch(searchUrl);

            if (!response.ok) {
                throw new Error(`搜索失败: ${response.status}`);
            }

            const data = await response.json();
            const cid = data.IdentifierList.CID[0];

            await this.delay(this.requestDelay);

            return await this.getCompoundData(cid);
        } catch (error) {
            throw new Error(`按名称搜索失败: ${error.message}`);
        }
    }

    async searchByCAS(cas) {
        try {
            const searchUrl = `${this.baseUrl}/compound/name/${encodeURIComponent(cas)}/cids/JSON`;
            const response = await fetch(searchUrl);

            if (!response.ok) {
                throw new Error(`CAS搜索失败: ${response.status}`);
            }

            const data = await response.json();
            const cid = data.IdentifierList.CID[0];

            await this.delay(this.requestDelay);

            return await this.getCompoundData(cid);
        } catch (error) {
            throw new Error(`CAS搜索失败: ${error.message}`);
        }
    }

    async searchByFormula(formula) {
        try {
            const searchUrl = `${this.baseUrl}/compound/fastformula/${encodeURIComponent(formula)}/cids/JSON`;
            const response = await fetch(searchUrl);

            if (!response.ok) {
                throw new Error(`分子式搜索失败: ${response.status}`);
            }

            const data = await response.json();
            const cid = data.IdentifierList.CID[0];

            await this.delay(this.requestDelay);

            return await this.getCompoundData(cid);
        } catch (error) {
            throw new Error(`分子式搜索失败: ${error.message}`);
        }
    }

    async getCompoundData(cid) {
        try {
            // 并行获取基本信息和属性
            const [basicInfo, properties, ghsInfo] = await Promise.all([
                this.getBasicInfo(cid),
                this.getProperties(cid),
                this.getGHSInfo(cid)
            ]);

            return {
                source: 'pubchem',
                cid: cid,
                basicInfo: basicInfo,
                properties: properties,
                ghs: ghsInfo
            };
        } catch (error) {
            throw new Error(`获取化合物数据失败: ${error.message}`);
        }
    }

    async getBasicInfo(cid) {
        const url = `${this.baseUrl}/compound/cid/${cid}/property/IUPACName,MolecularFormula,MolecularWeight,CanonicalSMILES/JSON`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`获取基本信息失败: ${response.status}`);
        }

        const data = await response.json();
        return data.PropertyTable.Properties[0];
    }

    async getProperties(cid) {
        try {
            const url = `${this.baseUrl}/compound/cid/${cid}/property/HeavyAtomCount,HBondDonorCount,HBondAcceptorCount,RotatableBondCount,TPSA/JSON`;
            const response = await fetch(url);

            if (!response.ok) {
                return {};
            }

            const data = await response.json();
            return data.PropertyTable.Properties[0];
        } catch (error) {
            return {};
        }
    }

    async getGHSInfo(cid) {
        // PubChem的GHS信息获取较复杂，这里使用预定义的安全数据
        const knownHazards = {
            '241': [ // 苯的CID
                { type: 'serious', text: '已确定的人类致癌物 (类别1)' },
                { type: 'warning', text: '高度易燃液体和蒸气' },
                { type: 'warning', text: '可能对血液系统造成伤害' },
                { type: 'warning', text: '可能对生殖系统造成损害' }
            ],
            '702': [ // 乙醇的CID
                { type: 'warning', text: '高度易燃液体和蒸气' },
                { type: 'warning', text: '引起严重眼刺激' },
                { type: 'caution', text: '可能引起昏昏欲睡和眩晕' }
            ],
            '712': [ // 甲醛的CID
                { type: 'serious', text: '疑似致癌物质 (类别2)' },
                { type: 'serious', text: '吞咽致命' },
                { type: 'warning', text: '皮肤接触可能引起过敏反应' },
                { type: 'warning', text: '引起严重眼损伤' }
            ],
            '222': [ // 氨的CID
                { type: 'warning', text: '压缩气体；遇热可能爆炸' },
                { type: 'warning', text: '引起严重皮肤灼伤和眼损伤' },
                { type: 'warning', text: '可能引起呼吸道刺激' }
            ]
        };

        return knownHazards[cid] || [
            { type: 'info', text: '请查阅专业SDS获取完整安全信息' }
        ];
    }

    // 获取化合物的2D结构图
    getStructureImageUrl(cid, size = 'large') {
        return `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${cid}/PNG?image_size=${size}`;
    }

    // 获取化合物的3D结构
    get3DStructureUrl(cid) {
        return `https://pubchem.ncbi.nlm.nih.gov/compound/${cid}#section=3D-Conformer`;
    }

    // 获取相关的PubChem页面URL
    getPubChemUrl(cid) {
        return `https://pubchem.ncbi.nlm.nih.gov/compound/${cid}`;
    }

    // 获取NIST数据库链接
    getNISTUrl(formula) {
        return `https://webbook.nist.gov/cgi/cbook.cgi?ID=${encodeURIComponent(formula)}&Units=SI`;
    }

    // 获取ECHA数据库链接
    getECHAUrl(casNumber) {
        return `https://echa.europa.eu/substance-information/-/substanceinfo/${encodeURIComponent(casNumber)}`;
    }
}
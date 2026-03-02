// 页面元素
const pages = {
    activation: document.getElementById('activation-page'),
    intro: document.getElementById('intro-page'),
    test: document.getElementById('test-page'),
    result: document.getElementById('result-page')
};

const buttons = {
    confirm: document.getElementById('confirm-btn'),
    startTest: document.getElementById('start-test-btn'),
    prev: document.getElementById('prev-btn'),
    next: document.getElementById('next-btn'),
    restart: document.getElementById('restart-btn')
};

const elements = {
    activationCode: document.getElementById('activation-code'),
    currentQuestion: document.getElementById('current-question'),
    questionText: document.getElementById('question-text'),
    optionsContainer: document.getElementById('options-container'),
    progressFill: document.querySelector('.progress-fill'),
    progressPercentage: document.querySelector('.progress-percentage')
};

// 激活码管理
const activationSystem = {
    // 预定义的激活码
    codes: {
        'ABC123': { maxUses: 3, description: '您共有3次测试机会，请认真答题，以获得最佳的测试体验💗' },
        'ABC456': { maxUses: 3, description: '您共有3次测试机会，请认真答题，以获得最佳的测试体验💗' },
        'DEV456': { maxUses: Infinity, description: '开发人员激活码（无限次）' }
    },
    
    // 生成设备唯一标识
    getDeviceId() {
        let deviceId = localStorage.getItem('deviceId');
        if (!deviceId) {
            // 生成基于浏览器信息的设备ID
            const userAgent = navigator.userAgent;
            const screenInfo = `${screen.width}x${screen.height}`;
            const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            const rawId = `${userAgent}-${screenInfo}-${timeZone}`;
            deviceId = btoa(rawId).substr(0, 32);
            localStorage.setItem('deviceId', deviceId);
        }
        return deviceId;
    },
    
    // 验证激活码
    validateCode(code) {
        const deviceId = this.getDeviceId();
        const codeConfig = this.codes[code];
        
        if (!codeConfig) {
            return { valid: false, message: '激活码无效' };
        }
        
        // 获取该激活码在当前设备的使用次数
        const usageKey = `code_${code}_${deviceId}`;
        const usedCount = parseInt(localStorage.getItem(usageKey) || '0');
        
        if (codeConfig.maxUses !== Infinity && usedCount >= codeConfig.maxUses) {
            return { valid: false, message: `激活码使用次数已达上限（${codeConfig.maxUses}次）` };
        }
        
        // 计算剩余次数
        let remainingUses = '无限次';
        if (codeConfig.maxUses !== Infinity) {
            remainingUses = codeConfig.maxUses - usedCount - 1; // -1 因为本次将被使用
        }
        
        return { 
            valid: true, 
            message: `激活码验证成功！${codeConfig.description}`, 
            codeConfig, 
            remainingUses 
        };
    },
    
    // 记录激活码使用
    useCode(code) {
        const deviceId = this.getDeviceId();
        const usageKey = `code_${code}_${deviceId}`;
        const usedCount = parseInt(localStorage.getItem(usageKey) || '0');
        localStorage.setItem(usageKey, usedCount + 1);
    }
};

// 30道测试题目数据
const questions = [
    {
        id: 1,
        text: '你更喜欢哪种生活节奏？',
        options: [
            '快节奏，追求高效与忙碌',
            '慢节奏，享受悠闲时光',
            '介于两者之间，能适应不同节奏',
            '根据心情而定，有时想快有时想慢'
        ],
        category: 'lifestyle'
    },
    {
        id: 2,
        text: '你对历史文化的兴趣程度？',
        options: [
            '非常感兴趣，喜欢探索历史',
            '有一定兴趣，偶尔了解',
            '兴趣一般，不排斥也不追求',
            '更关注现代发展，对历史不太感兴趣'
        ],
        category: 'culture'
    },
    {
        id: 3,
        text: '你更喜欢哪种自然环境？',
        options: [
            '海边，喜欢海风和沙滩',
            '山区，喜欢山林和清新空气',
            '湖泊，喜欢宁静的水域',
            '城市公园，喜欢便捷的绿色空间'
        ],
        category: 'nature'
    },
    {
        id: 4,
        text: '你在社交中更倾向于？',
        options: [
            '主动社交，喜欢认识新朋友',
            '被动社交，享受熟悉的圈子',
            '选择性社交，只和志同道合的人深交',
            '独处为主，社交需求较低'
        ],
        category: 'social'
    },
    {
        id: 5,
        text: '你对美食的追求程度？',
        options: [
            '非常注重，喜欢尝试各种美食',
            '比较注重，会寻找特色餐厅',
            '一般注重，填饱肚子即可',
            '不太注重，简单方便就行'
        ],
        category: 'food'
    },
    {
        id: 6,
        text: '你更偏好哪种气候？',
        options: [
            '温暖湿润，四季如春',
            '阳光充足，干燥少雨',
            '四季分明，有雪有雨',
            '凉爽舒适，温差较小'
        ],
        category: 'climate'
    },
    {
        id: 7,
        text: '你理想的居住环境是？',
        options: [
            '繁华都市，便利生活',
            '宁静小镇，亲近自然',
            '文化名城，底蕴深厚',
            '海滨城市，浪漫惬意'
        ],
        category: 'living'
    },
    {
        id: 8,
        text: '你对艺术和娱乐的兴趣？',
        options: [
            '非常感兴趣，经常参与',
            '有一定兴趣，偶尔关注',
            '兴趣一般，被动接受',
            '不太感兴趣，更关注现实'
        ],
        category: 'entertainment'
    },
    {
        id: 9,
        text: '你喜欢哪种类型的建筑风格？',
        options: [
            '现代简约，时尚前卫',
            '古典传统，文化底蕴',
            '中西合璧，融合创新',
            '自然生态，与环境和谐'
        ],
        category: 'architecture'
    },
    {
        id: 10,
        text: '你对交通便利性的要求？',
        options: [
            '非常重要，追求高效便捷',
            '比较重要，希望出行方便',
            '一般重要，能满足基本需求',
            '不太重要，更注重生活质量'
        ],
        category: 'transportation'
    },
    {
        id: 11,
        text: '你更喜欢哪种类型的工作环境？',
        options: [
            '快节奏，充满挑战',
            '稳定舒适，压力适中',
            '创意自由，灵活多样',
            '轻松愉快，工作生活平衡'
        ],
        category: 'work'
    },
    {
        id: 12,
        text: '你对教育资源的重视程度？',
        options: [
            '非常重视，追求优质教育',
            '比较重视，希望有良好资源',
            '一般重视，能满足基本需求',
            '不太重视，更关注其他因素'
        ],
        category: 'education'
    },
    {
        id: 13,
        text: '你更喜欢哪种休闲活动？',
        options: [
            '户外运动，亲近自然',
            '文化体验，参观展览',
            '社交聚会，与朋友相处',
            '居家放松，享受个人时光'
        ],
        category: 'leisure'
    },
    {
        id: 14,
        text: '你对购物的态度是？',
        options: [
            '喜欢购物，追求时尚',
            '比较喜欢，注重品质',
            '一般态度，按需购买',
            '不太喜欢，避免不必要消费'
        ],
        category: 'shopping'
    },
    {
        id: 15,
        text: '你更倾向于哪种生活方式？',
        options: [
            '精致讲究，追求品质',
            '简单朴素，注重实用',
            '随性自由，不受约束',
            '传统稳重，遵循常规'
        ],
        category: 'lifestyle'
    },
    {
        id: 16,
        text: '你对城市规模的偏好？',
        options: [
            '超大城市，机会多',
            '大城市，设施完善',
            '中等城市，平衡发展',
            '小城市，宁静舒适'
        ],
        category: 'city_size'
    },
    {
        id: 17,
        text: '你对科技发展的关注程度？',
        options: [
            '非常关注，追求前沿科技',
            '比较关注，愿意尝试新事物',
            '一般关注，跟随主流趋势',
            '不太关注，更重视传统价值'
        ],
        category: 'technology'
    },
    {
        id: 18,
        text: '你更喜欢哪种类型的节日氛围？',
        options: [
            '热闹喜庆，人潮涌动',
            '文化传统，底蕴深厚',
            '轻松愉快，亲友相聚',
            '安静祥和，独自享受'
        ],
        category: 'festival'
    },
    {
        id: 19,
        text: '你对医疗资源的重视程度？',
        options: [
            '非常重视，追求优质医疗',
            '比较重视，希望有良好保障',
            '一般重视，能满足基本需求',
            '不太重视，更关注其他因素'
        ],
        category: 'healthcare'
    },
    {
        id: 20,
        text: '你更偏好哪种类型的音乐？',
        options: [
            '流行音乐，紧跟潮流',
            '古典音乐，优雅庄重',
            '民族音乐，文化特色',
            '轻音乐，轻松舒适'
        ],
        category: 'music'
    },
    {
        id: 21,
        text: '你对环保和可持续发展的态度？',
        options: [
            '非常重视，积极参与',
            '比较重视，支持环保',
            '一般重视，遵守基本要求',
            '不太重视，更关注现实需求'
        ],
        category: 'environment'
    },
    {
        id: 22,
        text: '你更喜欢哪种类型的电影？',
        options: [
            '动作科幻，刺激紧张',
            '文艺剧情，深思熟虑',
            '喜剧爱情，轻松愉快',
            '纪录片，真实客观'
        ],
        category: 'entertainment'
    },
    {
        id: 23,
        text: '你对体育活动的参与程度？',
        options: [
            '积极参与，定期运动',
            '比较喜欢，偶尔运动',
            '一般参与，被动运动',
            '不太喜欢，很少运动'
        ],
        category: 'sports'
    },
    {
        id: 24,
        text: '你更倾向于哪种社交方式？',
        options: [
            '线下聚会，面对面交流',
            '线上社交，便捷高效',
            '混合方式，灵活选择',
            '深度交流，少而精'
        ],
        category: 'social'
    },
    {
        id: 25,
        text: '你对城市安全的要求？',
        options: [
            '非常重要，安全感第一',
            '比较重要，希望安全稳定',
            '一般重要，能接受基本安全',
            '不太重要，更关注其他因素'
        ],
        category: 'safety'
    },
    {
        id: 26,
        text: '你更喜欢哪种类型的阅读？',
        options: [
            '文学小说，丰富情感',
            '专业书籍，提升知识',
            '历史传记，了解过去',
            '轻松读物，休闲娱乐'
        ],
        category: 'reading'
    },
    {
        id: 27,
        text: '你对城市国际化程度的偏好？',
        options: [
            '非常国际化，多元文化',
            '比较国际化，开放包容',
            '一般国际化，保持特色',
            '不太国际化，传统特色'
        ],
        category: 'international'
    },
    {
        id: 28,
        text: '你更倾向于哪种消费观念？',
        options: [
            '享受当下，适度消费',
            '精打细算，理性消费',
            '注重品质，愿意投资',
            '简约生活，减少消费'
        ],
        category: 'consumption'
    },
    {
        id: 29,
        text: '你对城市文化活动的参与程度？',
        options: [
            '积极参与，经常参加',
            '比较喜欢，偶尔参与',
            '一般参与，被动接受',
            '不太参与，更关注个人生活'
        ],
        category: 'culture'
    },
    {
        id: 30,
        text: '你理想的城市应该具备什么特点？',
        options: [
            '机会众多，发展潜力大',
            '环境优美，适合居住',
            '文化底蕴，历史悠久',
            '生活便捷，设施完善'
        ],
        category: 'ideal_city'
    }
];

// 城市数据 - 16个城市
const cities = [
    {
        name: '北京',
        tags: ['政治中心', '历史文化', '国际化'],
        features: ['帝都文化', '历史古迹', '国际大都市'],
        description: '作为中国的政治文化中心，北京拥有深厚的历史底蕴和丰富的文化遗产。如果你喜欢历史文化，追求事业发展，北京会是你的理想选择。这里既有古老的胡同文化，又有现代化的国际都市风貌。',
        scores: {
            lifestyle: 4,
            culture: 5,
            nature: 2,
            social: 4,
            food: 4,
            climate: 2,
            living: 3,
            entertainment: 4,
            architecture: 5,
            transportation: 4,
            work: 5,
            education: 5,
            leisure: 3,
            shopping: 4,
            city_size: 5,
            technology: 4,
            festival: 4,
            healthcare: 5,
            music: 4,
            environment: 2,
            sports: 4,
            safety: 4,
            reading: 4,
            international: 5,
            consumption: 4,
            ideal_city: 4
        }
    },
    {
        name: '上海',
        tags: ['国际大都市', '金融中心', '时尚前沿'],
        features: ['魔都魅力', '金融中心', '时尚之都'],
        description: '上海是中国的经济金融中心，国际化程度高，充满现代都市魅力。如果你追求时尚、喜欢快节奏的都市生活，上海会是你的理想选择。这里汇聚了全球的时尚元素和商业机会。',
        scores: {
            lifestyle: 4,
            culture: 3,
            nature: 2,
            social: 4,
            food: 5,
            climate: 3,
            living: 3,
            entertainment: 5,
            architecture: 4,
            transportation: 5,
            work: 5,
            education: 4,
            leisure: 4,
            shopping: 5,
            city_size: 5,
            technology: 4,
            festival: 4,
            healthcare: 4,
            music: 4,
            environment: 2,
            sports: 4,
            safety: 4,
            reading: 3,
            international: 5,
            consumption: 4,
            ideal_city: 4
        }
    },
    {
        name: '深圳',
        tags: ['科技创新', '年轻活力', '改革开放'],
        features: ['创新之城', '年轻活力', '科技前沿'],
        description: '深圳是中国改革开放的前沿城市，充满年轻活力和创新精神。如果你喜欢科技创新、追求事业发展，深圳会是你的理想选择。这里汇聚了众多科技企业和年轻人才。',
        scores: {
            lifestyle: 3,
            culture: 2,
            nature: 3,
            social: 4,
            food: 3,
            climate: 4,
            living: 3,
            entertainment: 3,
            architecture: 4,
            transportation: 4,
            work: 5,
            education: 3,
            leisure: 3,
            shopping: 4,
            city_size: 4,
            technology: 5,
            festival: 3,
            healthcare: 4,
            music: 3,
            environment: 3,
            sports: 3,
            safety: 4,
            reading: 3,
            international: 4,
            consumption: 3,
            ideal_city: 4
        }
    },
    {
        name: '广州',
        tags: ['机会均等', '美食之都', '温暖湿润'],
        features: ['千年商都', '美食天堂', '开放包容'],
        description: '务实包容的广州，美食遍地，生活气息浓厚，温暖的气候，适中的房价，这里充满活力，适合享受生活的你。广州的多元文化和丰富美食会让你感受到这座城市的独特魅力。',
        scores: {
            lifestyle: 3,
            culture: 3,
            nature: 3,
            social: 4,
            food: 5,
            climate: 4,
            living: 3,
            entertainment: 4,
            architecture: 3,
            transportation: 4,
            work: 4,
            education: 4,
            leisure: 3,
            shopping: 4,
            city_size: 4,
            technology: 4,
            festival: 4,
            healthcare: 4,
            music: 3,
            environment: 3,
            sports: 3,
            safety: 3,
            reading: 3,
            international: 4,
            consumption: 3,
            ideal_city: 3
        }
    },
    {
        name: '成都',
        tags: ['休闲型', '美食之都', '生活品质'],
        features: ['天府之国', '休闲生活', '美食天堂'],
        description: '成都的慢生活节奏和丰富的美食文化与你的性格完美契合。在这里，你可以享受悠闲的茶馆时光，品尝正宗的川菜，感受这座城市的包容与活力。成都的生活哲学"巴适"会让你找到内心的宁静。',
        scores: {
            lifestyle: 4,
            culture: 4,
            nature: 3,
            social: 4,
            food: 5,
            climate: 3,
            living: 4,
            entertainment: 4,
            architecture: 3,
            transportation: 3,
            work: 3,
            education: 3,
            leisure: 5,
            shopping: 3,
            city_size: 3,
            technology: 3,
            festival: 4,
            healthcare: 3,
            music: 3,
            environment: 3,
            sports: 3,
            safety: 4,
            reading: 3,
            international: 2,
            consumption: 3,
            ideal_city: 3
        }
    },
    {
        name: '杭州',
        tags: ['文艺范', '科技前沿', '宜居城市'],
        features: ['人间天堂', '互联网之都', '西湖美景'],
        description: '上有天堂，下有苏杭，杭州兼具江南诗意与现代科技，西湖美景，互联网氛围，这里有独特的魅力，适合品味生活的你。杭州的古典与现代完美融合，既有深厚的文化底蕴，又有创新的科技活力。',
        scores: {
            lifestyle: 3,
            culture: 4,
            nature: 4,
            social: 3,
            food: 4,
            climate: 3,
            living: 4,
            entertainment: 3,
            architecture: 4,
            transportation: 4,
            work: 4,
            education: 4,
            leisure: 4,
            shopping: 4,
            city_size: 3,
            technology: 4,
            festival: 3,
            healthcare: 4,
            music: 3,
            environment: 3,
            sports: 3,
            safety: 4,
            reading: 4,
            international: 3,
            consumption: 3,
            ideal_city: 4
        }
    },
    {
        name: '重庆',
        tags: ['山城特色', '美食江湖', '热情活力'],
        features: ['山城雾都', '火锅之都', '立体城市'],
        description: '重庆是一座充满热情活力的山城，独特的地形地貌和丰富的美食文化让这里充满魅力。如果你喜欢热闹、热爱美食，重庆会是你的理想选择。这里的火锅文化和山城景观会让你流连忘返。',
        scores: {
            lifestyle: 3,
            culture: 3,
            nature: 3,
            social: 4,
            food: 5,
            climate: 3,
            living: 3,
            entertainment: 4,
            architecture: 3,
            transportation: 3,
            work: 3,
            education: 3,
            leisure: 4,
            shopping: 3,
            city_size: 4,
            technology: 3,
            festival: 4,
            healthcare: 3,
            music: 3,
            environment: 2,
            sports: 3,
            safety: 3,
            reading: 3,
            international: 2,
            consumption: 3,
            ideal_city: 3
        }
    },
    {
        name: '西安',
        tags: ['历史古都', '文化底蕴', '美食之都'],
        features: ['十三朝古都', '兵马俑', '西北美食'],
        description: '西安是中国历史上最重要的古都之一，拥有深厚的历史文化底蕴。如果你对历史文化感兴趣，喜欢传统文化，西安会是你的理想选择。这里的兵马俑、古城墙和陕西美食会让你感受到历史的厚重。',
        scores: {
            lifestyle: 3,
            culture: 5,
            nature: 2,
            social: 3,
            food: 4,
            climate: 2,
            living: 3,
            entertainment: 3,
            architecture: 4,
            transportation: 3,
            work: 3,
            education: 3,
            leisure: 3,
            shopping: 3,
            city_size: 3,
            technology: 3,
            festival: 4,
            healthcare: 3,
            music: 3,
            environment: 2,
            sports: 3,
            safety: 4,
            reading: 4,
            international: 2,
            consumption: 3,
            ideal_city: 3
        }
    },
    {
        name: '长沙',
        tags: ['娱乐之都', '美食天堂', '活力四射'],
        features: ['娱乐湘军', '湘菜之乡', '活力城市'],
        description: '长沙是一座充满活力的娱乐之都，湖南卫视的影响力让这里成为年轻人的聚集地。如果你喜欢娱乐、热爱美食，长沙会是你的理想选择。这里的湘菜和夜生活文化会让你感受到城市的活力。',
        scores: {
            lifestyle: 3,
            culture: 3,
            nature: 2,
            social: 4,
            food: 5,
            climate: 3,
            living: 3,
            entertainment: 5,
            architecture: 3,
            transportation: 3,
            work: 3,
            education: 3,
            leisure: 4,
            shopping: 3,
            city_size: 3,
            technology: 3,
            festival: 4,
            healthcare: 3,
            music: 4,
            environment: 2,
            sports: 3,
            safety: 3,
            reading: 3,
            international: 2,
            consumption: 3,
            ideal_city: 3
        }
    },
    {
        name: '武汉',
        tags: ['九省通衢', '高校云集', '江湖文化'],
        features: ['江城武汉', '高校之城', '热干面'],
        description: '武汉是华中地区的重要城市，九省通衢的地理位置和众多高校让这里充满活力。如果你喜欢学术氛围、注重教育，武汉会是你的理想选择。这里的高校文化和长江风光会让你感受到城市的魅力。',
        scores: {
            lifestyle: 3,
            culture: 3,
            nature: 3,
            social: 3,
            food: 4,
            climate: 3,
            living: 3,
            entertainment: 3,
            architecture: 3,
            transportation: 4,
            work: 3,
            education: 4,
            leisure: 3,
            shopping: 3,
            city_size: 4,
            technology: 3,
            festival: 3,
            healthcare: 3,
            music: 3,
            environment: 3,
            sports: 3,
            safety: 3,
            reading: 3,
            international: 3,
            consumption: 3,
            ideal_city: 3
        }
    },
    {
        name: '苏州',
        tags: ['江南水乡', '园林之城', '精致生活'],
        features: ['园林之城', '江南水乡', '精致生活'],
        description: '江南水乡苏州，园林密布，小桥流水，这里的生活闲适精致，节奏舒适，适合追求品质生活、注重文化内涵的你。苏州的古典园林和现代发展的完美融合，会让你感受到独特的江南韵味。',
        scores: {
            lifestyle: 3,
            culture: 4,
            nature: 3,
            social: 3,
            food: 4,
            climate: 3,
            living: 4,
            entertainment: 3,
            architecture: 5,
            transportation: 3,
            work: 3,
            education: 4,
            leisure: 4,
            shopping: 3,
            city_size: 2,
            technology: 3,
            festival: 3,
            healthcare: 3,
            music: 3,
            environment: 3,
            sports: 3,
            safety: 4,
            reading: 3,
            international: 2,
            consumption: 3,
            ideal_city: 3
        }
    },
    {
        name: '南京',
        tags: ['文化底蕴', '文学之都', '博爱精神'],
        features: ['六朝古都', '历史文化', '人文气息'],
        description: '六朝古都南京，历史与现代交融，梧桐树下，秦淮河畔，这里充满人文气息，适合有文化底蕴、追求生活品质的你。南京的深厚历史文化和现代发展的完美结合，会让你感受到独特的城市魅力。',
        scores: {
            lifestyle: 3,
            culture: 5,
            nature: 3,
            social: 3,
            food: 4,
            climate: 3,
            living: 3,
            entertainment: 3,
            architecture: 4,
            transportation: 4,
            work: 4,
            education: 4,
            leisure: 3,
            shopping: 3,
            city_size: 3,
            technology: 3,
            festival: 4,
            healthcare: 4,
            music: 3,
            environment: 3,
            sports: 3,
            safety: 4,
            reading: 4,
            international: 3,
            consumption: 3,
            ideal_city: 3
        }
    },
    {
        name: '青岛',
        tags: ['自然型', '社交型', '休闲型'],
        features: ['海滨风情', '啤酒之城', '红瓦绿树'],
        description: '你的性格一样，舒适而惬意又充满海洋活力。青岛的海滨风光、啤酒文化、德式风情、舒适的气候环境、热爱自由的性格特质，作为自然型人格，你沉醉于大海的浪漫；作为社交型人格，你享受在酒馆里和朋友碰杯的快乐；作为休闲型人格，你喜欢在海边散步和品尝海鲜。这"啤酒之城"的理想与浪漫，能让你在海风中找到生活的美好。',
        scores: {
            lifestyle: 3,
            culture: 2,
            nature: 4,
            social: 3,
            food: 4,
            climate: 3,
            living: 3,
            entertainment: 3,
            architecture: 3,
            transportation: 3,
            work: 2,
            education: 2,
            leisure: 4,
            shopping: 3,
            city_size: 2,
            technology: 2,
            festival: 3,
            healthcare: 3,
            music: 2,
            environment: 4,
            sports: 3,
            safety: 3,
            reading: 2,
            international: 2,
            consumption: 3,
            ideal_city: 3
        }
    },
    {
        name: '大理',
        tags: ['自然生态', '文艺清新', '慢生活'],
        features: ['风花雪月', '洱海风光', '白族文化'],
        description: '大理是一座充满自然美景和文艺气息的城市，蓝天白云、苍山洱海让这里成为理想的生活之地。如果你喜欢自然、追求慢生活，大理会是你的理想选择。这里的白族文化和田园风光会让你感受到生活的美好。',
        scores: {
            lifestyle: 4,
            culture: 3,
            nature: 5,
            social: 3,
            food: 3,
            climate: 4,
            living: 4,
            entertainment: 3,
            architecture: 3,
            transportation: 2,
            work: 2,
            education: 2,
            leisure: 5,
            shopping: 2,
            city_size: 1,
            technology: 2,
            festival: 3,
            healthcare: 2,
            music: 3,
            environment: 5,
            sports: 3,
            safety: 4,
            reading: 3,
            international: 2,
            consumption: 3,
            ideal_city: 3
        }
    },
    {
        name: '厦门',
        tags: ['文艺范', '海洋性', '自然型'],
        features: ['文艺之城', '海上花园', '宜居城市'],
        description: '海上花园厦门，气候宜人，风景优美，海鲜环生，环岛路，这里有多元的文艺气息，适合追求生活、充满活力的你。厦门的小清新风格和海洋文化与你的性格完美契合，你会在这里找到属于自己的文艺生活。',
        scores: {
            lifestyle: 3,
            culture: 3,
            nature: 4,
            social: 3,
            food: 4,
            climate: 4,
            living: 4,
            entertainment: 3,
            architecture: 3,
            transportation: 3,
            work: 2,
            education: 3,
            leisure: 4,
            shopping: 3,
            city_size: 2,
            technology: 2,
            festival: 3,
            healthcare: 3,
            music: 3,
            environment: 4,
            sports: 3,
            safety: 4,
            reading: 3,
            international: 3,
            consumption: 3,
            ideal_city: 3
        }
    },
    {
        name: '郑州',
        tags: ['中原文化', '交通枢纽', '发展潜力'],
        features: ['中原古都', '交通枢纽', '发展中城市'],
        description: '郑州是中原地区的重要城市，交通枢纽地位和悠久的历史文化让这里充满发展潜力。如果你注重家庭、喜欢传统文化，郑州会是你的理想选择。这里的中原文化和发展机遇会让你感受到城市的魅力。',
        scores: {
            lifestyle: 3,
            culture: 4,
            nature: 2,
            social: 3,
            food: 3,
            climate: 2,
            living: 3,
            entertainment: 3,
            architecture: 3,
            transportation: 4,
            work: 3,
            education: 3,
            leisure: 3,
            shopping: 3,
            city_size: 3,
            technology: 3,
            festival: 3,
            healthcare: 3,
            music: 3,
            environment: 2,
            sports: 3,
            safety: 3,
            reading: 3,
            international: 2,
            consumption: 3,
            ideal_city: 3
        }
    }
];

// 测试状态
let currentQuestionIndex = 0;
let answers = [];

// 页面切换函数
function showPage(pageName) {
    // 隐藏所有页面
    Object.values(pages).forEach(page => {
        page.classList.remove('active');
    });
    // 显示目标页面
    pages[pageName].classList.add('active');
}

// 更新测试题目
function updateQuestion() {
    const question = questions[currentQuestionIndex];
    elements.currentQuestion.textContent = question.id;
    elements.questionText.textContent = question.text;
    
    // 更新选项
    elements.optionsContainer.innerHTML = '';
    question.options.forEach((option, index) => {
        const optionItem = document.createElement('div');
        optionItem.className = 'option-item';
        optionItem.innerHTML = `
            <input type="radio" name="question" value="${index + 1}" id="option-${index + 1}">
            <label for="option-${index + 1}"><span>${option}</span></label>
        `;
        elements.optionsContainer.appendChild(optionItem);
    });
    
    // 恢复用户之前的选择
    if (answers[currentQuestionIndex]) {
        const selectedValue = answers[currentQuestionIndex];
        const selectedOption = document.querySelector(`input[name="question"][value="${selectedValue}"]`);
        if (selectedOption) {
            selectedOption.checked = true;
        }
    }
    
    // 更新进度条
    const progress = Math.round(((currentQuestionIndex + 1) / questions.length) * 100);
    elements.progressFill.style.width = `${progress}%`;
    elements.progressPercentage.textContent = `${progress}%`;
    
    // 更新导航按钮状态
    buttons.prev.disabled = currentQuestionIndex === 0;
}

// 计算城市匹配度
function calculateCityMatches() {
    const userScores = {};
    
    // 计算用户在各个维度的得分
    questions.forEach((question, index) => {
        const category = question.category;
        const answer = parseInt(answers[index]);
        
        if (!userScores[category]) {
            userScores[category] = 0;
        }
        userScores[category] += answer;
    });
    
    // 计算每个城市的匹配度
    const cityMatches = cities.map(city => {
        let totalScore = 0;
        let maxScore = 0;
        
        Object.keys(userScores).forEach(category => {
            if (city.scores[category]) {
                const userScore = userScores[category];
                const cityScore = city.scores[category];
                // 计算得分差异的绝对值，差异越小匹配度越高
                const difference = Math.abs(userScore - cityScore);
                const matchScore = 5 - difference; // 5分制，差异为0得5分，差异为4得1分
                totalScore += matchScore;
                maxScore += 5;
            }
        });
        
        // 计算匹配百分比
        const matchPercentage = Math.round((totalScore / maxScore) * 100);
        
        return {
            city,
            matchPercentage
        };
    });
    
    // 按匹配度排序
    cityMatches.sort((a, b) => b.matchPercentage - a.matchPercentage);
    
    return cityMatches;
}

// 更新结果页面
function updateResultPage() {
    const cityMatches = calculateCityMatches();
    const topCity = cityMatches[0].city;
    const topMatchPercentage = cityMatches[0].matchPercentage;
    
    // 更新主结果
    document.querySelector('.compatibility').textContent = `${topMatchPercentage}%`;
    document.querySelector('.result-card h2').textContent = `你的天选之城：${topCity.name}`;
    
    // 更新标签
    const tagsContainer = document.querySelector('.tags');
    tagsContainer.innerHTML = '';
    topCity.tags.forEach(tag => {
        const tagElement = document.createElement('span');
        tagElement.className = 'tag';
        tagElement.textContent = tag;
        tagsContainer.appendChild(tagElement);
    });
    
    // 更新匹配理由
    document.querySelector('.match-reasons p').textContent = topCity.description;
    
    // 更新其他城市
    const otherCitiesContainer = document.querySelector('.other-cities');
    otherCitiesContainer.innerHTML = '';
    
    cityMatches.slice(1, 7).forEach(match => {
        const city = match.city;
        const cityCard = document.createElement('div');
        cityCard.className = 'city-card';
        
        // 创建标签HTML
        const cityTagsHTML = city.tags.map(tag => `<span class="city-tag">${tag}</span>`).join('');
        
        cityCard.innerHTML = `
            <h4>${city.name}</h4>
            <div class="city-compatibility">${match.matchPercentage}%</div>
            <div class="city-tags">${cityTagsHTML}</div>
            <p class="city-desc">${city.description}</p>
        `;
        
        otherCitiesContainer.appendChild(cityCard);
    });
}

// 初始化事件监听器
function initEventListeners() {
    // 激活码确认按钮
    buttons.confirm.addEventListener('click', () => {
        const code = elements.activationCode.value.trim();
        if (!code) {
            alert('请输入激活码');
            return;
        }
        
        // 验证激活码
        const validationResult = activationSystem.validateCode(code);
        
        if (validationResult.valid) {
            // 记录激活码使用
            activationSystem.useCode(code);
            // 显示成功提示，包含剩余次数
            let successMessage = validationResult.message;
            if (validationResult.remainingUses === '无限次') {
                successMessage += '\n剩余测试次数：无限次';
            } else {
                successMessage += `\n剩余测试次数：${validationResult.remainingUses}次`;
            }
            alert(successMessage);
            // 跳转到介绍页面
            showPage('intro');
        } else {
            // 显示错误提示
            alert(validationResult.message);
        }
    });
    
    // 开始测试按钮
    buttons.startTest.addEventListener('click', () => {
        currentQuestionIndex = 0;
        answers = [];
        updateQuestion();
        showPage('test');
    });
    
    // 上一题按钮
    buttons.prev.addEventListener('click', () => {
        if (currentQuestionIndex > 0) {
            currentQuestionIndex--;
            updateQuestion();
        }
    });
    
    // 下一题按钮
    buttons.next.addEventListener('click', () => {
        const selectedOption = document.querySelector('input[name="question"]:checked');
        if (!selectedOption) {
            alert('请选择一个选项');
            return;
        }
        
        // 保存答案（更新或添加）
        answers[currentQuestionIndex] = selectedOption.value;
        
        if (currentQuestionIndex < questions.length - 1) {
            currentQuestionIndex++;
            updateQuestion();
        } else {
            // 测试完成，计算结果并显示
            updateResultPage();
            showPage('result');
        }
    });
    
    // 重新测试按钮
    buttons.restart.addEventListener('click', () => {
        showPage('activation');
        // 清空激活码输入框
        elements.activationCode.value = '';
    });
}

// 初始化应用
function initApp() {
    initEventListeners();
    // 默认显示激活码页面
    showPage('activation');
}

// 启动应用
initApp();
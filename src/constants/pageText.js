const pageText = {
    hk: {
        home: "主頁",
        about: "關於我們",
        services: "服務",
        vouchers: "長者社區照顧服務券",
        info: "資訊",
        stroke: "中風",
        parkinson: "帕金森",
        contactus: "聯絡我們",
        login: "登入",
        captionEn: "WHERE COMPASSION MEETS COMPETENCE",
        captionHk: "慈愛與專業並重",
        captionDescription: "我們為長者和患有慢性疾病的人提供專業和慈愛的照顧。我們的服務包括家居護理、日間護理和康復服務。",
        homePhysio: "上門物理治療",
        homePhysioDescription: "我們的物理治療師會到您家中提供專業的物理治療服務。",
        homeOccupational: "上門職業治療",
        homeOccupationalDescription: "我們的職業治療師會到您家中提供專業的職業治療服務。",
        homeSpeech: "上門言語治療",
        homeSpeechDescription: "我們的言語治療師會到您家中提供專業的言語治療服務。",
        homeNursing: "上門護理服務",
        homeNursingDescription: "我們的護士會到您家中提供專業的護理服務。",
        coorperatedOrganizations: "合作機構",
        professionalTherapist: "專業治療師",
        satisfiedClients: "滿意客戶",
        joinMember: "加入會員",
        ourEvent: "活動",
        ourComingEvent: "即將舉行的活動",
        eventDate1: "2024年6月30日",
        eventLocation1: "香港會議展覽中心",
        eventTitle1: "2024年香港醫療展",
        eventDate2: "2024年7月2日",
        eventLocation2: "九龍灣國際貿易展覽中心",
        eventTitle2: "2024年香港護理展",
        eventDate3: "2024年7月4日",
        eventLocation3: "香港文化中心",
        eventTitle3: "2024年香港康復展",
        commonQuestion: "常見問題",
        commonQuestionDescription: "我們的專業治療師會到您家中提供專業的物理治療服務。",
        commonQuestion1: "申請社區券是否等於要入住老人院？",
        commonQuestion1Description: "不是。申請「社區券」時，社工有機會為長者同時於中央輪候冊上輪候長期護理服務(俗稱排老人院)。如成功申請社區券後，照顧者可以申請暫停長者之老人院輪候(轉為非活躍個案)，即表示長者並不需要入住老人院。值得一提的是，將來如長者決定入住老人院，其輪候個案將會重啟， 其輪候位置亦會以原本的申請日期為準。",
        commonQuestion2: "長者原已在社署之老人院輪候冊，對申請社區券有影響嗎？",
        commonQuestion2Description: "不會。承上，長者在輪候老人院時仍可申請「社區券」。如成功申請，長者於輪候冊會變為「非活躍個案」。於使用社區券期間，長者如有需要，可透過負責工作人員，重新啟動其在中央輪候冊上的輪候狀態。",
        commonQuestion3: "我是否可以選擇恩預復康提供物理治療服務，同時使用其他機構提供其他服務？",
        commonQuestion3Description: "每張社區券現時每月可以選擇最多兩間服務單位，而社區券最高面值則維持不變。如長者或其家人決定選用恩預復康提供服務，我們的個案經理會上門探訪長者，同時會向長者及其家人詳細講解服務細則。如果同意選用本公司服務，個案經理會與長者或其家人辦理有關手續。",
        commonQuestion4: "社區券之最低面值為$4,290， 而最高面值為$10,260， 這代表甚麼?",
        commonQuestion4Description: "為更有效使用社區券並協助長者居家復康及安老，已成功申請社區券之長者每月的服務費金額必須達到最低要求HK$4,290， 而最高服務費金額不得高於HK$10,260。 ",
        commonQuestion5:"社區券有限期嗎？",
        commonQuestion5Description:"社區券並沒有限期，但家屬必需於收到社區券後三個月內，向任何一間認可機構購買服務，否則該社區券將會失效。",
        commonQuestion6:"長者社區中心的社工告訴我只能申請「改善家居計劃」，不能申請社區券？",
        commonQuestion6Description:"長者社區中心的社工告訴我只能申請「改善家居計劃」，不能申請社區券？",
        testimonial: "客戶評價",
        testimonialDescription: "過往客戶對我們的服務的評價。",
        testimonialName1: "陳太",
        testimonialLocation1: "九龍",
        testimonialComment1: "坐骨神經痛，沿著臀部至小腿灼痛。物理治療師鄭姑娘精準地指出是臀肌壓迫所致，並透過幾個拉筋訓練，很快就KO了疼痛。隨後再教授幾招改善核心肌群，以減少對患處的壓力。非常感謝整個團隊所提供的服務。",
        testimonialName2: "陳先生",
        testimonialLocation2: "新界",
        testimonialComment2: "我在家中跌倒，導致腰部受傷。物理治療師很快就到家中為我進行治療，並教授我一些運動，讓我能夠在家中繼續進行康復。非常感謝整個團隊所提供的服務。",
        testimonialName3: "李太",
        testimonialLocation3: "香港",
        testimonialComment3: "我患有帕金森症，物理治療師很快就到家中為我進行治療，並教授我一些運動，讓我能夠在家中繼續進行康復。非常感謝整個團隊所提供的服務。",
        blog: "文章",
        blogDescription: "最新的文章",
        blogAuthor1Name: "陳醫生",
        blogCategory1: "物理治療",
        blogTitle1: "物理治療對中風的幫助",
        blogDescription1: "大腦有一個自我重塑的特點，這稱為「神經可塑性」（neuroplasticity）。透過各種刺激和訓練，「神經可塑性」能協助重建受損大腦神經元的聯繫網絡，從而恢復中風病人的活動能力。中風後的首六個月是復康的黃金時期，而物理治療在此擔當重要角色。",
        blogAuthor2Name: "李醫生",
        blogCategory2: "職業治療",
        blogTitle2: "職業治療對帕金森症的幫助",
        blogDescription2: "帕金森症患者常見的問題是手部的顫抖，這會影響他們的日常生活。職業治療師會教導患者一些日常生活技巧，以減輕他們的困難。職業治療師亦會教導患者一些手部運動，以改善他們的手部功能。",
        blogAuthor3Name: "王醫生",
        blogCategory3: "言語治療",
        blogTitle3: "言語治療對中風的幫助",
        blogDescription3: "中風後，患者可能會出現言語障礙。言語治療師會教導患者一些言語練習，以改善他們的言語能力。言語治療師亦會教導患者一些吞嚥練習，以改善他們的吞嚥能力。",
        lifeImproveService: "生活改善服務",
        accompanyService: "陪診服務",
        serviceContents: "服務內容",
        ourMission: "我們的使命",
        ourVision: "我們的願景",
        whatIsCoupon: "甚麼是社區照顧服務券",
        howToApply: "如何申請",
        chargeDetail: "收費詳情",
        couponFAQ: "社區照顧服務券常見問題",
        aboutus: "關於我們",
        address: "新界屯門青山坊2號樂華大廈一號樓總站1樓272號鋪",
        ourVisionDesc: "我們的願景是成為香港最專業的康復服務提供者，為長者和患有慢性疾病的人提供專業和慈愛的照顧。",
        ourMission1: "心賢復康德耆會是由一群既專業又充滿熱誠的專業醫護人員組成。我們從公立醫院、私營機構及非牟利機構工作的經驗中，體會到不少香港市民在公營醫療系統裏，遇過種種令人氣餒或納悶的情況。",
        ourMission2: "我們希望透過提供專業和慈愛的照顧，協助長者和患有慢性疾病的人康復，並在家中安度晚年。",
        ourMission3: "我們的服務包括家居護理、日間護理、康復服務等。",
        team: "我們的專業團隊",
        meetOurTeam: "認識我們的專業團隊",
        teamData: [
            {
                name: "物理治療師",
                description: "我們的物理治療師會到您家中提供專業的物理治療服務。",
                imageName: "physical-therapy.png"
            },
            {
                name: "職業治療師",
                description: "我們的職業治療師會到您家中提供專業的職業治療服務。",
                imageName: "physiotherapist.png"
            },
            {
                name: "言語治療師",
                description: "我們的言語治療師會到您家中提供專業的言語治療服務。",
                imageName: "therapy.png"
            },
            {
                name: "護士",
                description: "我們的護士會到您家中提供專業的護理服務。",
                imageName: "medical-team.png"
            },
            {
                name: "社工",
                description: "我們的社工會到您家中提供專業的社會工作服務。",
                imageName: "social-care.png"
            },
            {
                name: "個案經理",
                description: "我們的個案經理會到您家中提供專業的個案管理服務。",
                imageName: "coordinator.png"
            },
            {
                name: "營養師",
                description: "我們的營養師會到您家中提供專業的營養諮詢服務。",
                imageName: "dietitian.png"
            },
            {
                name: "康復助理",
                description: "我們的康復助理會到您家中提供專業的康復服務。",
                imageName: "recovered.png"
            },
            {
                name: "陪診員",
                description: "我們的陪診員會到您家中提供專業的護理服務。",
                imageName: "friendly.png"
            },
            {
                name: "保健員",
                description: "我們的保健員會到您家中提供專業的護理服務。",
                imageName: "worker.png"
            },
        ],
        serviceList: "服務項目",
        servicesListData: [
            { name: "上門物理治療", description: "我們的物理治療師會到您家中提供專業的物理治療服務。", imageName: "上門物理治療.jpg", hotness: 100 },
            { name: "上門職業治療", description: "我們的職業治療師會到您家中提供專業的職業治療服務。", imageName: "上門職業治療.jpg", hotness: 90 },
            { name: "上門言語治療", description: "我們的言語治療師會到您家中提供專業的言語治療服務。", imageName: "上門言語治療.jpg", hotness: 90 },
            { name: "上門護理服務", description: "我們的護士會到您家中提供專業的護理服務。", imageName: "上門看護服務.jpg", hotness: 88 },
            { name: "家居改善評估", description: "我們的職業治療師會到您家中進行家居改善評估。", imageName: "家居改善評估.jpg", hotness: 86 },
            { name: "陪診服務", description: "我們的陪診員會到您家中提供專業的陪診服務。", imageName: "陪診服務.jpg", hotness: 80 },
        ],
        viewMore: "查看更多",
        serviceContentDesc: "「社區券」服務範圍甚廣，「社區券」持有人可以按自身情況，於政府資助下享用多項復康或護理服務。",
        serviceGalleryData: [
            {
                imageName: "言語治療.webp",
                name: "言語治療",
            }, {
                imageName: "物理治療.webp",
                name: "物理治療",
            }, {
                imageName: "職業治療.webp",
                name: "職業治療",
            }, {
                imageName: "看護服務.webp",
                name: "看護服務",
            }, {
                imageName: "家居安全評估及改善建議.webp",
                name: "家居安全評估及改善建議",
            }, {
                imageName: "家居清潔.webp",
                name: "家居清潔",
            },
            {
                imageName: "送飯服務.webp",
                name: "送飯服務",
            },
            {
                imageName: "護老者培訓.webp",
                name: "護老者培訓",
            }
        ],
        whatIsVoucher: "甚麼是社區券",
        whatIsVoucherDesc: "社區照顧服務券是一項政府資助的計劃，旨在提供資助給有需要的長者，讓他們可以在社區中享受不同的護理及康復服務,長者社區照顧服務券(簡稱「社區券」)，是社署豁下之安老服務計劃之一，旨在為長者提供社區照顧及復康訓練服務。社署會派員進行家訪，如長者符合資格，社署便會邀請長者參與「社區券」計劃。長者可安坐家中接受專業治療或起居照顧服務。",
        target: "服務對象",
        targetDesc: "為身體機能中度或嚴重缺損，或有複雜護理需要的長者而設",
        howToApplyData: [
            {
                imageName: "如何申請01.webp",
                title: "第一步",
                description: "聯絡負責其屋苑之長者地區中心",
            },
            {
                imageName: "如何申請02.webp",
                title: "第二步",
                description: "社署會派員進行家訪",
            },
            {
                imageName: "如何申請03.webp",
                title: "第三步",
                description: "經評估後如長者適合申請「社區券」，社署會審批其申請及郵寄「發券通知書」予長者",
            },
            { 
                imageName: "如何申請04.webp",
                title: "第四步",
                description: "與我們聯絡安排服務",
            }
        ],
        howToApply: "如何申請",
        physio: "物理治療",
        serviceHourPerMonth: "每月服務時數共",
        fourHours: "4小時",
        rehab: "康復治療",
        case1Fee: "服務使用者付：$237 ～ $1,893*",
        case1MonthFee: "（該月服務費金額：$4,732)",
        eightHours: "8小時",
        case2Fee: "服務使用者付：$474 ～ $3,786*",
        case2MonthFee: "（該月服務費金額：$9,464)",
        baseOnUserFee:"*視乎服務使用者獲批的「共同付款級別」而定",
        chargeDetail: "收費詳情",
        chargeDetailDesc: "「社區券」採用其持有人及政府資助形式共同付款，政府會根據「社區券」持有人及其同住家人的收入中位數，決定資助百份比。社區券金額的每月上限為港幣",
        chargeDetailDescAmount: "HKD10,260",
        chargeDetailDesc2: "由「社區券」持有人/家人支付之金額則由",
        fivePercent: "5%",
        chargeDetailDesc3: "至",
        fortyPercent: "40%",
        chargeDetailDesc4: "不等 (視乎服務使用者獲批的「共同付款級別」而定)",
        serviceUserPay: "服務使用者付",
        serviceUserPayDesc:"該月服務費金額: HK$4,290 ~ HK$10,260",
        serviceUserPayData:[
            {percentage: "5%",
            from: "$215",
            to: "$513"
            },
            {percentage: "8%",
            from: "$343",
            to: "$821"
            },
            {percentage: "12%",
            from: "$515",
            to: "$1,231"
            },
            {percentage: "16%",
            from: "$686",
            to: "$1,642"
            },
            {percentage: "25%",
            from: "$1,073",
            to: "$2,565"
            },
            {percentage: "40%",
            from: "$1,716",
            to: "$4,104"
            }   
        ]

        





    },
    en: {
        home: "Home",
        about: "About Us",
        services: "Services",
        vouchers: "Voucher",
        info: "Information",
        stroke: "Stroke",
        parkinson: "Parkinson",
        contactus: "Contact Us",
        login: "Login",
        captionEn: "WHERE COMPASSION MEETS COMPETENCE",
        captionHk: "慈愛與專業並重",
        captionDescription: "We provide professional and compassionate care to the elderly and people with chronic diseases. Our services include home care, day care, and rehabilitation services.",
        homePhysio: "Home Physiotherapy",
        homePhysioDescription: "Our physiotherapists will provide professional physiotherapy services at your home.",
        homeOccupational: "Home Occupational Therapy",
        homeOccupationalDescription: "Our occupational therapists will provide professional occupational therapy services at your home.",
        homeSpeech: "Home Speech Therapy",
        homeSpeechDescription: "Our speech therapists will provide professional speech therapy services at your home.",
        homeNursing: "Home Nursing",
        homeNursingDescription: "Our nurses will provide professional nursing services at your home.",
        coorperatedOrganizations: "Coorperated Organizations",
        professionalTherapist: "Professional Therapists",
        satisfiedClients: "Satisfied Clients",
        joinMember: "Join Member",
        ourEvent: "Our Event",
        ourComingEvent: "Our Coming Event",
        eventDate1: "30th June 2024",
        eventLocation1: "Hong Kong Convention and Exhibition Centre",
        eventTitle1: "2024 Hong Kong Medical Expo",
        eventDate2: "2nd July 2024",
        eventLocation2: "Kowloonbay International Trade & Exhibition Centre",
        eventTitle2: "2024 Hong Kong Nursing Expo",
        eventDate3: "4th July 2024",
        eventLocation3: "Hong Kong Cultural Centre",
        eventTitle3: "2024 Hong Kong Rehabilitation Expo",
        commonQuestion: "Common Question",
        commonQuestionDescription: "Our professional therapists will provide professional physiotherapy services at your home.",
        commonQuestion1: "Does applying for the community voucher mean that you have to move into a nursing home?",
        commonQuestion1Description: "No. When applying for the “Community Voucher”, social workers have the opportunity to queue for long-term care services for the elderly at the Central Waiting List (commonly known as queuing for nursing homes). If the application for the community voucher is successful, the caregiver can apply to suspend the elderly's nursing home queue (change to inactive case), which means that the elderly does not need to move into a nursing home. It is worth mentioning that if the elderly decides to move into a nursing home in the future, their queue case will be restarted, and their queue position will be based on the original application date.",
        commonQuestion2: "Does the elderly's original queue for the Social Welfare Department's nursing home have any impact on applying for the community voucher?",
        commonQuestion2Description: "No. As mentioned above, the elderly can still apply for the “Community Voucher” while queuing for a nursing home. If the application is successful, the elderly will become an “inactive case” on the waiting list. During the use of the community voucher, if the elderly needs it, they can restart their queue status on the Central Waiting List through the responsible staff.",
        commonQuestion3: "Can I choose Encompass Rehab to provide physiotherapy services and use other institutions to provide other services at the same time?",
        commonQuestion3Description: "Each community voucher can currently choose up to two service units per month, and the maximum face value of the community voucher remains unchanged. If the elderly or their family decides to choose the services provided by Encompass Rehab, our case manager will visit the elderly at home and explain the service details to the elderly and their family in detail. If you agree to use our services, the case manager will handle the relevant procedures with the elderly or their family.",
        commonQuestion4: "The minimum face value of the community voucher is $4,290, and the maximum face value is $10,260. What does this mean?",
        commonQuestion4Description: "In order to use the community voucher more effectively and help the elderly to recover and age at home, the monthly service fee amount of the elderly who have successfully applied for the community voucher must reach the minimum requirement of HK$4,290, and the maximum service fee amount must not exceed HK$10,260.",
        testimonial: "Testimonial",
        testimonialDescription: "Past clients' comments on our services.",
        testimonialName1: "Mrs. Chan",
        testimonialLocation1: "Kowloon",
        testimonialComment1: "Sciatica, burning pain along the buttocks to the calf. The physiotherapist Miss Cheng accurately pointed out that it was caused by the compression of the gluteus muscle, and quickly KO the pain through a few stretching exercises. Then teach a few ways to improve the core muscle group to reduce pressure on the affected area. Thank you very much for the services provided by the entire team.",
        testimonialName2: "Mr. Chan",
        testimonialLocation2: "New Territories",
        testimonialComment2: "I fell at home and injured my waist. The physiotherapist quickly came to my home for treatment and taught me some exercises so that I could continue to recover at home. Thank you very much for the services provided by the entire team.",
        testimonialName3: "Mrs. Lee",
        testimonialLocation3: "Hong Kong",
        testimonialComment3: "I have Parkinson's disease. The physiotherapist quickly came to my home for treatment and taught me some exercises so that I could continue to recover at home. Thank you very much for the services provided by the entire team.",
        blog: "Blog",
        blogDescription: "The latest blog.",
        blogAuthor1Name: "Dr. Chan",
        blogCategory1: "Physiotherapy",
        blogTitle1: "The help of physiotherapy for stroke",
        blogDescription1: "The brain has a feature of self-reconstruction, which is called “neuroplasticity”. Through various stimuli and training, “neuroplasticity” can help rebuild the damaged brain neurons' connection network, thereby restoring the stroke patient's ability to move. The first six months after a stroke are the golden period of recovery, and physiotherapy plays an important role in this.",
        blogAuthor2Name: "Dr. Lee",
        blogCategory2: "Occupational Therapy",
        blogTitle2: "The help of occupational therapy for Parkinson's disease",
        blogDescription2: "A common problem for Parkinson's patients is tremors in the hands, which affects their daily lives. Occupational therapists will teach patients some daily life skills to alleviate their difficulties. Occupational therapists will also teach patients some hand exercises to improve their hand function.",
        blogAuthor3Name: "Dr. Wong",
        blogCategory3: "Speech Therapy",
        blogTitle3: "The help of speech therapy for stroke",
        blogDescription3: "After a stroke, patients may have speech disorders. Speech therapists will teach patients some speech exercises to improve their speech ability. Speech therapists will also teach patients some swallowing exercises to improve their swallowing ability.",
        lifeImproveService: "Life Improve Service",
        accompanyService: "Accompany Service",
        serviceContents: "Service Contents",
        ourMission: "Our Mission",
        ourVision: "Our Vision",
        whatIsCoupon: "What is Community Care Voucher",
        howToApply: "How to Apply",
        chargeDetail: "Charge Detail",
        couponFAQ: "Community Care Voucher FAQ",
        aboutus: "About Us",
        address: "Shop 272, 1/F, Block 1, Lok Wah House, 2 Tsing Shan Lane, Tuen Mun, New Territories",
        ourVisionDesc: "Our vision is to become the most professional rehabilitation service provider in Hong Kong, providing professional and compassionate care to the elderly and people with chronic diseases.",
        ourMission1: "Encompass Rehab is composed of a group of professional and passionate healthcare professionals. We have experienced various frustrating or puzzling situations that Hong Kong citizens have encountered in the public medical system, private institutions, and non-profit organizations.",
        ourMission2: "We hope to help the elderly and people with chronic diseases recover and age at home through professional and compassionate care.",
        ourMission3: "Our services include home care, day care, rehabilitation services, etc.",
        team: "Our Professional Team",
        meetOurTeam: "Meet Our Professional Team",
        teamData: [
            {
                name: "Physiotherapist",
                description: "Our physiotherapists will provide professional physiotherapy services at your home.",
                imageName: "physical-therapy.png"
            },
            {
                name: "Occupational Therapist",
                description: "Our occupational therapists will provide professional occupational therapy services at your home.",
                imageName: "physiotherapist.png"
            },
            {
                name: "Speech Therapist",
                description: "Our speech therapists will provide professional speech therapy services at your home.",
                imageName: "therapy.png"
            },
            {
                name: "Nurse",
                description: "Our nurses will provide professional nursing services at your home.",
                imageName: "medical-team.png"
            },
            {
                name: "Social Worker",
                description: "Our social workers will provide professional social work services at your home.",
                imageName: "social-care.png"
            },
            {
                name: "Case Manager",
                description: "Our case managers will provide professional case management services at your home.",
                imageName: "coordinator.png"
            },
            {
                name: "Dietitian",
                description: "Our dietitians will provide professional nutrition consultation services at your home.",
                imageName: "dietitian.png"
            },
            {
                name: "Nursing Assistant",
                description: "Our nursing assistants will provide professional nursing services at your home.",
                imageName: "recovered.png"
            },
            {
                name: "Accompanying Officer",
                description: "Our accompanying officers will provide professional nursing services at your home.",
                imageName: "friendly.png"
            },
            {
                name: "Health Worker",
                description: "Our health workers will provide professional nursing services at your home.",
                imageName: "worker.png"
            },
        ],
        serviceList: "Service List",
        servicesListData: [
            { name: "Home Physiotherapy", description: "Our physiotherapists will provide professional physiotherapy services at your home.", imageName: "上門物理治療.jpg", hotness: 100 },
            { name: "Home Occupational Therapy", description: "Our occupational therapists will provide professional occupational therapy services at your home.", imageName: "上門職業治療.jpg", hotness: 90 },
            { name: "Home Speech Therapy", description: "Our speech therapists will provide professional speech therapy services at your home.", imageName: "上門言語治療.jpg", hotness: 90 },
            { name: "Home Nursing", description: "Our nurses will provide professional nursing services at your home.", imageName: "上門看護服務.jpg", hotness: 88 },
            {
                name: "Home Improvement Assessment", description: "Our occupational therapists will conduct a home improvement assessment at your home.", imageName
                    : "家居改善評估.jpg", hotness: 86
            },
            { name: "Accompany Service", description: "Our accompanying officers will provide professional accompanying services at your home.", imageName: "陪診服務.jpg", hotness: 80 },
        ],
        viewMore: "View More",
        serviceContentDesc: "The scope of services of the “Community Voucher” is very wide, and the holder of the “Community Voucher” can enjoy various rehabilitation or nursing services under government subsidies according to their own situation.",
        serviceGalleryData: [
            {
                imageName: "言語治療.webp",
                name: "Speech Therapy",
            }, {
                imageName: "物理治療.webp",
                name: "Physiotherapy",
            }, {
                imageName: "職業治療.webp",
                name: "Occupational Therapy",
            }, {
                imageName: "看護服務.webp",
                name: "Nursing Service",
            }, {
                imageName: "家居安全評估及改善建議.webp",
                name: "Home Safety Assessment and Improvement Suggestions",
            }, {
                imageName: "家居清潔.webp",
                name: "Home Cleaning",
            },
            {
                imageName: "送飯服務.webp",
                name: "Meal Delivery Service",
            },
            {
                imageName: "護老者培訓.webp",
                name: "Elderly Care Training",
            }
        ],
        whatIsVoucher: "What is Community Voucher",
        whatIsVoucherDesc: "The Community Care Voucher is a government-funded program designed to provide subsidies to the elderly in need, allowing them to enjoy various nursing and rehabilitation services in the community. The Elderly Community Care Voucher (referred to as the “Community Voucher”) is one of the elderly care service plans under the Social Welfare Department. It aims to provide community care and rehabilitation training services to the elderly. The Social Welfare Department will visit the home. If the elderly meets the requirements, the Social Welfare Department will invite the elderly to participate in the “Community Voucher” program. The elderly can receive professional treatment or home care services at home.",
        target: "Target",
        targetDesc: "Designed for the elderly with moderate or severe physical disabilities, or complex nursing needs.",
        howToApplyData: [
            {
                imageName: "如何申請01.webp",
                title: "Step 1",
                description: "Contact the elderly district center responsible for their estate.",
            },
            {
                imageName: "如何申請02.webp",
                title: "Step 2",
                description: "The Social Welfare Department will visit the home.",
            },
            {
                imageName: "如何申請03.webp",
                title: "Step 3",
                description: "If the elderly is suitable for applying for the “Community Voucher” after assessment, the Social Welfare Department will approve their application and mail the “Voucher Notification” to the elderly.",
            },
            {
                imageName: "如何申請04.webp",
                title: "Step 4",
                description: "Contact us to arrange services.",
            }
        ],
        howToApply: "How to Apply",
        physio: "Physiotherapy",
        serviceHourPerMonth: "Total service hours per month",
        fourHours: "4 hours",
        rehab: "Rehabilitation",
        case1Fee: "Service User Pay: $237 ~ $1,893*",
        case1MonthFee: "(Monthly service fee amount: $4,732)",
        eightHours: "8 hours",
        case2Fee: "Service User Pay: $474 ~ $3,786*",
        case2MonthFee: "(Monthly service fee amount: $9,464)",
        baseOnUserFee:"*Based on the “Co-payment Level” approved by the service user",
        chargeDetail: "Charge Detail",
        chargeDetailDesc: "The “Community Voucher” adopts a form of co-payment by the holder and the government, and the government will determine the percentage of subsidy based on the median income of the “Community Voucher” holder and their cohabiting family. The monthly ceiling of the community voucher amount is HKD",
        chargeDetailDescAmount: "HKD10,260",
        chargeDetailDesc2: "The amount paid by the “Community Voucher” holder/family is from",
        fivePercent: "5%",
        chargeDetailDesc3: "to",
        fortyPercent: "40%",
        chargeDetailDesc4: " (depending on the “Co-payment Level” approved by the service user)",
        serviceUserPay: "Service User Pay",
        serviceUserPayDesc:"Monthly service fee amount: HK$4,290 ~ HK$10,260",
        serviceUserPayData:[
            {percentage: "5%",
            from: "$215",
            to: "$513"
            },
            {percentage: "8%",
            from: "$343",
            to: "$821"
            },
            {percentage: "12%",
            from: "$515",
            to: "$1,231"
            },
            {percentage: "16%",
            from: "$686",
            to: "$1,642"
            },
            {percentage: "25%",
            from: "$1,073",
            to: "$2,565"
            },
            {percentage: "40%",
            from: "$1,716",
            to: "$4,104"
            }   
        ],
        




    }

}

module.exports = { pageText }
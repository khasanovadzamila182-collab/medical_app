/**
 * Full i18n: RU / UZ / EN
 * Medical terms in UZ use everyday language (parent-friendly).
 * Drug names stay as-is across all languages.
 */

export type Lang = "ru" | "uz" | "en";

const dict: Record<string, Record<Lang, string>> = {
    // ═══════════ SYSTEM / COMMON ═══════════
    "Загрузка...": { ru: "Загрузка...", uz: "Yuklanmoqda...", en: "Loading..." },
    "Войти": { ru: "Войти", uz: "Kirish", en: "Log In" },
    "Вход...": { ru: "Вход...", uz: "Kirish...", en: "Logging in..." },
    "Назад": { ru: "← Назад", uz: "← Orqaga", en: "← Back" },
    "Готово": { ru: "✅ Готово", uz: "✅ Tayyor", en: "✅ Done" },
    "Далее": { ru: "Далее →", uz: "Keyingi →", en: "Next →" },
    "Да": { ru: "Да", uz: "Ha", en: "Yes" },
    "Нет": { ru: "Нет", uz: "Yo'q", en: "No" },
    "Сохранить": { ru: "Сохранить", uz: "Saqlash", en: "Save" },

    // ═══════════ AUTH / ONBOARDING ═══════════
    "Ваш телефон": { ru: "Ваш телефон", uz: "Telefon raqamingiz", en: "Your phone" },
    "Авторизуйтесь для доступа к диагностике": {
        ru: "Авторизуйтесь для доступа к диагностике",
        uz: "Diagnostikaga kirish uchun tizimga kiring",
        en: "Sign in to access diagnostics"
    },

    // ═══════════ DASHBOARD ═══════════
    "Здоровье малыша": { ru: "Здоровье малыша", uz: "Bola salomatligi", en: "Child Health" },
    "Добрый день! 👋": { ru: "Добрый день! 👋", uz: "Assalomu alaykum! 👋", en: "Hello! 👋" },
    "Мои дети": { ru: "Мои дети", uz: "Bolalarim", en: "My Children" },
    "Обновить вес": { ru: "🔄 Обновить вес", uz: "🔄 Vaznni yangilash", en: "🔄 Update weight" },
    "Диагностика": { ru: "Диагностика", uz: "Diagnostika", en: "Diagnostics" },
    "Дозировки": { ru: "Дозировки", uz: "Dozalar", en: "Dosages" },
    "Напоминания": { ru: "Напоминания", uz: "Eslatmalar", en: "Reminders" },
    "Ингаляции": { ru: "Ингаляции", uz: "Inhalyatsiya", en: "Inhalation" },
    "История": { ru: "История", uz: "Tarix", en: "History" },
    "Последние рекомендации": { ru: "Последние рекомендации", uz: "Oxirgi tavsiyalar", en: "Recent recommendations" },
    "Рекомендаций пока нет": { ru: "Рекомендаций пока нет", uz: "Hozircha tavsiyalar yo'q", en: "No recommendations yet" },
    "Помощь": { ru: "Помощь", uz: "Yordam", en: "Help" },
    "Связь с поддержкой": { ru: "Связь с поддержкой", uz: "Qo'llab-quvvatlash", en: "Contact support" },
    "Telegram Support": { ru: "Telegram Support", uz: "Telegram orqali yordam", en: "Telegram Support" },
    "Продолжить диагностику": { ru: "Продолжить диагностику", uz: "Diagnostikani davom ettirish", en: "Continue diagnostic" },
    "Начать заново": { ru: "Начать заново", uz: "Qaytadan boshlash", en: "Start over" },
    "Укажите вес ребёнка в профиле для точного расчёта дозировок.": {
        ru: "Укажите вес ребёнка в профиле для точного расчёта дозировок.",
        uz: "Dozi aniq hisoblash uchun bola vaznini profilda ko'rsating.",
        en: "Please enter child weight in profile for accurate dosage calculation."
    },

    // ═══════════ DIAGNOSTICS HUB ═══════════
    "Выберите область": { ru: "Выберите область", uz: "Yo'nalishni tanlang", en: "Select area" },
    "Что беспокоит ребёнка?": { ru: "Что беспокоит ребёнка?", uz: "Bolani nima bezovta qilyapti?", en: "What bothers the child?" },
    "Температура": { ru: "Температура", uz: "Harorat", en: "Temperature" },
    "Измерение и рекомендации": { ru: "Измерение и рекомендации", uz: "O'lchash va tavsiyalar", en: "Measurement & advice" },
    "Кашель": { ru: "Кашель", uz: "Yo'tal", en: "Cough" },
    "Влажный, сухой, лающий": { ru: "Влажный, сухой, лающий", uz: "Ho'l, quruq, huruvchan", en: "Wet, dry, barking" },
    "Глаза": { ru: "Глаза", uz: "Ko'zlar", en: "Eyes" },
    "Покраснение, выделения": { ru: "Покраснение, выделения", uz: "Qizarish, ajralma", en: "Redness, discharge" },
    "Уши": { ru: "Уши", uz: "Quloqlar", en: "Ears" },
    "Боль, выделения": { ru: "Боль, выделения", uz: "Og'riq, ajralma", en: "Pain, discharge" },
    "ЖКТ": { ru: "ЖКТ", uz: "Oshqozon", en: "GI Tract" },
    "Тошнота, рвота, диарея": { ru: "Тошнота, рвота, диарея", uz: "Ko'ngil aynish, qusish, ich ketishi", en: "Nausea, vomiting, diarrhea" },
    "Нос": { ru: "Нос", uz: "Burun", en: "Nose" },
    "Заложенность, насморк": { ru: "Заложенность, насморк", uz: "Burun bitishi, tumoq", en: "Congestion, runny nose" },
    "Боль в горле": { ru: "Боль в горле", uz: "Tomoq og'rig'i", en: "Sore throat" },
    "Покраснение, пятна, стоматит": { ru: "Покраснение, пятна, стоматит", uz: "Qizarish, dog'lar, stomatit", en: "Redness, spots, stomatitis" },
    "Доступ ограничен": { ru: "⚠️ ДОСТУП ОГРАНИЧЕН.", uz: "⚠️ KIRISH CHEKLANGAN.", en: "⚠️ ACCESS RESTRICTED." },
    "sub_warning": {
        ru: "Без подписки доступен только раздел «SOS / Красные флаги» в каждом модуле.",
        uz: "Obunasiz faqat «SOS / Qizil bayroqlar» bo'limi ochiq.",
        en: "Without subscription, only the \"SOS / Red Flags\" section is available."
    },
    "Оформить подписку →": { ru: "Оформить подписку →", uz: "Obunani rasmiylashtirish →", en: "Subscribe →" },

    // ═══════════ PROFILE ═══════════
    "Профиль ребёнка": { ru: "Профиль ребёнка", uz: "Bola profili", en: "Child Profile" },
    "Данные ребёнка": { ru: "Данные ребёнка", uz: "Bola ma'lumotlari", en: "Child data" },
    "Имя (необязательно)": { ru: "Имя (необязательно)", uz: "Ism (ixtiyoriy)", en: "Name (optional)" },
    "Вес, кг (важно для лекарств)": { ru: "Вес, кг (важно для лекарств)", uz: "Vazn, kg (dori uchun muhim)", en: "Weight, kg (important for medicine)" },
    "Возраст, полных месяцев": { ru: "Возраст, полных месяцев", uz: "Yoshi, to'liq oylar", en: "Age, full months" },
    "Сохранить профиль": { ru: "Сохранить профиль", uz: "Profilni saqlash", en: "Save profile" },
    "Сохранение...": { ru: "Сохранение...", uz: "Saqlanmoqda...", en: "Saving..." },
    "Статус подписки": { ru: "Статус подписки", uz: "Obuna holati", en: "Subscription status" },
    "Подписка активна": { ru: "Подписка активна", uz: "Obuna faol", en: "Subscription active" },
    "Нет активной подписки": { ru: "Нет активной подписки", uz: "Faol obuna yo'q", en: "No active subscription" },
    "Оформить подписку": { ru: "Оформить подписку", uz: "Obunani rasmiylashtirish", en: "Subscribe" },

    // ═══════════ SUBSCRIBE ═══════════
    "Оформление подписки": { ru: "Оформление подписки", uz: "Obunani rasmiylashtirish", en: "Subscription" },
    "Доступ ко всем алгоритмам": {
        ru: "Оформите подписку, чтобы получить полный доступ к диагностическим модулям, расчётам дозировок по весу и алгоритмам действий.",
        uz: "Diagnostika modullari, vazn bo'yicha doza hisoblash va harakat algoritmlariga to'liq kirish uchun obuna bo'ling.",
        en: "Subscribe to get full access to diagnostic modules, weight-based dosage calculations, and action algorithms."
    },
    "Выберите способ оплаты:": { ru: "Выберите способ оплаты:", uz: "To'lov usulini tanlang:", en: "Choose payment method:" },
    "Оплатить через Payme": { ru: "Оплатить через Payme", uz: "Payme orqali to'lash", en: "Pay via Payme" },
    "Оплатить через Click": { ru: "Оплатить через Click", uz: "Click orqali to'lash", en: "Pay via Click" },

    // ═══════════ RED FLAGS / EMERGENCY ═══════════
    "Срочно вызовите скорую!": {
        ru: "🚨 Срочно вызовите скорую!",
        uz: "🚨 Tezda tez yordam chaqiring!",
        en: "🚨 Call an ambulance immediately!"
    },
    "Вызовите скорую помощь": {
        ru: "Вызовите скорую помощь",
        uz: "Tez yordam chaqiring",
        en: "Call emergency services"
    },
    "red_flag_title": {
        ru: "🚨 Красные флаги",
        uz: "🚨 Qizil bayroqlar",
        en: "🚨 Red Flags"
    },

    // ═══════════ TEMPERATURE MODULE ═══════════
    "temp_title": { ru: "Температура", uz: "Harorat", en: "Temperature" },
    "temp_step1": { ru: "Шаг 1: Первичная проверка", uz: "1-qadam: Boshlang'ich tekshirish", en: "Step 1: Initial check" },
    "temp_red_flags": {
        ru: "Есть ли у ребёнка судороги, потеря сознания, сыпь, которая не бледнеет при нажатии?",
        uz: "Bolada talvasalar, hushdan ketish, bosganda oqarmaydigan toshma bormi?",
        en: "Does the child have seizures, loss of consciousness, or a rash that doesn't fade when pressed?"
    },
    "temp_what": {
        ru: "Какая температура у ребёнка?",
        uz: "Bolaning harorati qancha?",
        en: "What is the child's temperature?"
    },
    "temp_below_385": { ru: "Ниже 38.5°C", uz: "38.5°C dan past", en: "Below 38.5°C" },
    "temp_above_385": { ru: "38.5°C и выше", uz: "38.5°C va yuqori", en: "38.5°C and above" },
    "temp_comfort": {
        ru: "Давайте обильное питьё, следите за общим состоянием. Жаропонижающие не нужны.",
        uz: "Ko'p suyuqlik bering, umumiy holatini kuzating. Harorat tushiruvchi kerak emas.",
        en: "Give plenty of fluids, monitor general condition. No antipyretics needed."
    },
    "temp_dose_title": {
        ru: "Расчёт дозировки жаропонижающих",
        uz: "Harorat tushiruvchi doza hisobi",
        en: "Antipyretic dosage calculation"
    },
    "temp_shake": {
        ru: "Взболтать перед употреблением",
        uz: "Iste'mol qilishdan oldin chayqating",
        en: "Shake well before use"
    },

    // ═══════════ LUNGS / COUGH MODULE ═══════════
    "lungs_title": { ru: "Кашель", uz: "Yo'tal", en: "Cough" },
    "lungs_type_q": {
        ru: "Какой кашель у ребёнка?",
        uz: "Bolada qanday yo'tal bor?",
        en: "What kind of cough does the child have?"
    },
    "lungs_wet": { ru: "💧 Влажный кашель", uz: "💧 Ho'l yo'tal", en: "💧 Wet cough" },
    "lungs_dry": { ru: "🌵 Сухой кашель", uz: "🌵 Quruq yo'tal", en: "🌵 Dry cough" },
    "lungs_barking": { ru: "🐕 Лающий кашель", uz: "🐕 Huruvchan yo'tal", en: "🐕 Barking cough" },
    "lungs_parox": { ru: "😤 Приступообразный", uz: "😤 Tutqanoq yo'tal", en: "😤 Paroxysmal cough" },
    "lungs_groaning": {
        ru: "Есть ли стоны при дыхании?",
        uz: "Nafas olayotganda ingrayaptimi?",
        en: "Is the child groaning while breathing?"
    },

    // ═══════════ STOMACH / GI MODULE ═══════════
    "stomach_title": { ru: "ЖКТ / Живот", uz: "Oshqozon / Qorin", en: "GI / Stomach" },
    "stomach_step1": {
        ru: "Шаг 1: Красные флаги",
        uz: "1-qadam: Qizil bayroqlar",
        en: "Step 1: Red flags"
    },
    "stomach_red_flags_q": {
        ru: "Есть ли примесь крови в рвоте или стуле, сильная боль,\nвздутие живота, ребёнок не может ходить?",
        uz: "Qusiqda yoki najas (ich kelish)da qon bormi, qattiq og'riq,\nqorin dam bo'lishi (meteorizm), bola yura olmayaptimi?",
        en: "Is there blood in vomit or stool, severe pain,\nabdominal bloating, or is the child unable to walk?"
    },
    "stomach_vomiting_q": {
        ru: "Есть ли рвота?",
        uz: "Qusish bormi?",
        en: "Is there vomiting?"
    },
    "stomach_vomit_freq": {
        ru: "Рвота более 3 раз за сутки?",
        uz: "Sutkada 3 martadan ko'p qusdimi?",
        en: "Vomiting more than 3 times in 24 hours?"
    },
    "stomach_diarrhea_q": {
        ru: "Есть диарея (понос)?",
        uz: "Ich ketishi (diareya) bormi?",
        en: "Is there diarrhea?"
    },
    "stomach_constip_q": {
        ru: "Есть запор?",
        uz: "Qabziyat bormi?",
        en: "Is there constipation?"
    },
    "stomach_go_treat": {
        ru: "💊 Перейти к лечению",
        uz: "💊 Davolashga o'tish",
        en: "💊 Proceed to treatment"
    },

    // ═══════════ EYES MODULE ═══════════
    "eyes_title": { ru: "Глаза", uz: "Ko'zlar", en: "Eyes" },
    "eyes_step1": {
        ru: "Шаг 1: Состояние глаза",
        uz: "1-qadam: Ko'z holati",
        en: "Step 1: Eye condition"
    },
    "eyes_redness_q": {
        ru: "Есть ли покраснение?",
        uz: "Qizarish bormi?",
        en: "Is there redness?"
    },
    "eyes_discharge_q": {
        ru: "Есть ли жёлто-зелёные выделения?",
        uz: "Sariq-yashil ajralma bormi?",
        en: "Is there yellow-green discharge?"
    },
    "eyes_wash": {
        ru: "Промойте физраствором или кипячёной водой",
        uz: "Fizrastvor yoki qaynatilgan suv bilan yuving",
        en: "Rinse with saline solution or boiled water"
    },

    // ═══════════ EARS MODULE ═══════════
    "ears_title": { ru: "Уши", uz: "Quloqlar", en: "Ears" },
    "ears_step1": {
        ru: "Шаг 1: Проверка жалоб",
        uz: "1-qadam: Shikoyatlarni tekshirish",
        en: "Step 1: Check complaints"
    },
    "ears_pain_q": {
        ru: "Ребёнок жалуется на боль в ухе?",
        uz: "Bola quloq og'rig'idan shikoyat qilyaptimi?",
        en: "Is the child complaining of ear pain?"
    },
    "ears_discharge_q": {
        ru: "Есть ли выделения из уха?",
        uz: "Quloqdan ajralma bormi?",
        en: "Is there discharge from the ear?"
    },

    // ═══════════ NOSE MODULE ═══════════
    "nose_title": { ru: "Нос", uz: "Burun", en: "Nose" },
    "nose_step1": {
        ru: "Шаг 1: Проверка заложенности",
        uz: "1-qadam: Burun bitishini tekshirish",
        en: "Step 1: Check congestion"
    },
    "nose_congestion_q": {
        ru: "Нос заложен?",
        uz: "Burun bitganmi?",
        en: "Is the nose congested?"
    },
    "nose_wash_rec": {
        ru: "Промывание физраствором",
        uz: "Fizrastvor bilan yuvish",
        en: "Saline wash"
    },

    // ═══════════ MOUTH / THROAT MODULE ═══════════
    "mouth_title": { ru: "Горло / Рот", uz: "Tomoq / Og'iz", en: "Throat / Mouth" },
    "mouth_step1": {
        ru: "Шаг 1: Первичный осмотр",
        uz: "1-qadam: Boshlang'ich ko'rik",
        en: "Step 1: Initial inspection"
    },
    "mouth_pain_q": {
        ru: "Жалуется на боль в горле?",
        uz: "Tomoq og'rig'idan shikoyat qilyaptimi?",
        en: "Complaining of sore throat?"
    },
    "mouth_spots_q": {
        ru: "Есть ли пятна или язвочки во рту?",
        uz: "Og'iz ichida dog'lar yoki yaralar bormi?",
        en: "Are there spots or sores in the mouth?"
    },

    // ═══════════ DOSAGE / GENERAL MEDICAL ═══════════
    "dose_weight_label": {
        ru: "Вес ребёнка:",
        uz: "Bola vazni:",
        en: "Child weight:"
    },
    "dose_result": {
        ru: "Рассчитанная доза:",
        uz: "Hisoblangan doza:",
        en: "Calculated dose:"
    },
    "dose_ml": { ru: "мл", uz: "ml", en: "ml" },
    "dose_mg": { ru: "мг", uz: "mg", en: "mg" },
    "dose_times_day": {
        ru: "раз(а) в сутки",
        uz: "marta kuniga",
        en: "time(s) per day"
    },
    "dose_interval": {
        ru: "Минимальный интервал между приёмами:",
        uz: "Qabul qilish orasidagi minimal oraliq:",
        en: "Minimum interval between doses:"
    },
    "dose_hours": { ru: "часов", uz: "soat", en: "hours" },
    "dose_consult_doctor": {
        ru: "При ухудшении — обратитесь к врачу!",
        uz: "Ahvol yomonlashsa — shifokorga murojaat qiling!",
        en: "If condition worsens — consult a doctor!"
    },

    // ═══════════ ADMIN ═══════════
    "Админ-панель": { ru: "Админ-панель", uz: "Admin panel", en: "Admin Panel" },
    "Пользователи": { ru: "Пользователи", uz: "Foydalanuvchilar", en: "Users" },

    // ═══════════ TEMP MODULE — FULL UI TEXT ═══════════
    "Шаг": { ru: "Шаг", uz: "Qadam", en: "Step" },
    "из": { ru: "из", uz: "dan", en: "of" },
    "Шаг 1: Первичная проверка": { ru: "Шаг 1: Первичная проверка", uz: "1-qadam: Boshlang'ich tekshirish", en: "Step 1: Initial check" },
    "Оцените общее состояние ребёнка": { ru: "Оцените общее состояние ребёнка", uz: "Bolaning umumiy holatini baholang", en: "Assess the child's general condition" },
    "Ребёнок активный, относительно бодрый?": { ru: "Ребёнок активный, относительно бодрый?", uz: "Bola faol, nisbatan tetikmi?", en: "Is the child active and relatively alert?" },
    "😊 Да, активный": { ru: "😊 Да, активный", uz: "😊 Ha, faol", en: "😊 Yes, active" },
    "😟 Нет, вялый": { ru: "😟 Нет, вялый", uz: "😟 Yo'q, holsiz", en: "😟 No, lethargic" },
    "Ребёнок активный": { ru: "Ребёнок активный", uz: "Bola faol", en: "Child is active" },
    "Рекомендации": { ru: "Рекомендации", uz: "Tavsiyalar", en: "Recommendations" },
    "cool_room": { ru: "🌡️ Снизить температуру в помещении до 22°C", uz: "🌡️ Xona haroratini 22°C gacha tushiring", en: "🌡️ Lower room temperature to 22°C" },
    "cool_undress": { ru: "👶 Раздеть ребёнка догола, снять подгузник", uz: "👶 Bolani yechintiring, taglikni olib tashlang", en: "👶 Undress the child completely, remove diaper" },
    "cool_wipe": { ru: "🧊 Обтирать полотенцем (вода 30–32°C) по 5 мин каждые 30 мин", uz: "🧊 Sochiq bilan artish (suv 30–32°C) har 30 daqiqada 5 daqiqa", en: "🧊 Wipe with towel (water 30–32°C) for 5 min every 30 min" },
    "cool_drink": { ru: "💧 Питьевой режим: каждые 15 мин по глотку", uz: "💧 Ichish tartibi: har 15 daqiqada bir ho'plam", en: "💧 Fluids: sip every 15 minutes" },
    "Шаг 2: Температура": { ru: "Шаг 2: Температура", uz: "2-qadam: Harorat", en: "Step 2: Temperature" },
    "Какая сейчас температура?": { ru: "Какая сейчас температура?", uz: "Hozir harorat qancha?", en: "What is the temperature now?" },
    "Температура ≤ 38,5°C": { ru: "Температура ≤ 38,5°C", uz: "Harorat ≤ 38,5°C", en: "Temperature ≤ 38.5°C" },
    "Температура > 38,5°C": { ru: "Температура > 38,5°C", uz: "Harorat > 38,5°C", en: "Temperature > 38.5°C" },
    "Конечности холодные?": { ru: "Конечности холодные?", uz: "Qo'l-oyoqlari sovuqmi?", en: "Are the extremities cold?" },
    "Руки и ноги холодные на ощупь?": { ru: "Руки и ноги холодные на ощупь?", uz: "Qo'l-oyoqlari sovuq teginadimi?", en: "Are hands and feet cold to the touch?" },
    "🥶 Да, холодные": { ru: "🥶 Да, холодные", uz: "🥶 Ha, sovuq", en: "🥶 Yes, cold" },
    "👍 Нет, тёплые": { ru: "👍 Нет, тёплые", uz: "👍 Yo'q, iliq", en: "👍 No, warm" },
    "Конечности тёплые": { ru: "Конечности тёплые", uz: "Qo'l-oyoqlari iliq", en: "Extremities are warm" },
    "Холодные конечности": { ru: "Холодные конечности", uz: "Sovuq qo'l-oyoqlar", en: "Cold extremities" },
    "План действий": { ru: "План действий", uz: "Harakat rejasi", en: "Action plan" },
    "cold_dress": { ru: "🧤 Одеть ребёнка, растирать конечности ладонями", uz: "🧤 Bolani kiydiring, qo'l-oyoqlarini kaft bilan ishqalang", en: "🧤 Dress the child, rub extremities with palms" },
    "cold_rehydrate": { ru: "🧂 Регидратационный раствор: 100–200 мл в день", uz: "🧂 Regidratatsiya eritmasi: kuniga 100–200 ml", en: "🧂 Rehydration solution: 100–200 ml/day" },
    "cold_ibuprofen": { ru: "💊 Дать ИБУПРОФЕН по весу", uz: "💊 Vazn bo'yicha IBUPROFEN bering", en: "💊 Give IBUPROFEN by weight" },
    "Назначение": { ru: "Назначение", uz: "Tayinlash", en: "Prescription" },
    "Дозировка": { ru: "Дозировка", uz: "Dozalash", en: "Dosage" },
    "Вес": { ru: "Вес", uz: "Vazn", en: "Weight" },
    "Доза": { ru: "Доза", uz: "Doza", en: "Dose" },
    "dose_for_weight": { ru: "рассчитана на вес", uz: "vazn bo'yicha hisoblangan", en: "calculated for weight" },
    "⏱️ Запустить таймер (40 мин) →": { ru: "⏱️ Запустить таймер (40 мин) →", uz: "⏱️ Taymerni ishga tushiring (40 daq) →", en: "⏱️ Start timer (40 min) →" },
    "🔄 Начать сначала": { ru: "🔄 Начать сначала", uz: "🔄 Qaytadan boshlash", en: "🔄 Start over" },
    "Шаг 4: Ожидание": { ru: "Шаг 4: Ожидание", uz: "4-qadam: Kutish", en: "Step 4: Waiting" },
    "Подождите 40 минут и оцените результат": { ru: "Подождите 40 минут и оцените результат", uz: "40 daqiqa kuting va natijani baholang", en: "Wait 40 minutes and assess the result" },
    "⏸ Пауза": { ru: "⏸ Пауза", uz: "⏸ To'xtatish", en: "⏸ Pause" },
    "▶️ Продолжить": { ru: "▶️ Продолжить", uz: "▶️ Davom ettirish", en: "▶️ Resume" },
    "Перейти к оценке →": { ru: "Перейти к оценке →", uz: "Baholashga o'tish →", en: "Go to assessment →" },
    "Оценка через 40 мин": { ru: "Оценка через 40 мин", uz: "40 daqiqadan keyin baholash", en: "Assessment after 40 min" },
    "Температура спала?": { ru: "Температура спала?", uz: "Harorat tushdimi?", en: "Did the temperature drop?" },
    "📉 Да, спала": { ru: "📉 Да, спала", uz: "📉 Ha, tushdi", en: "📉 Yes, it dropped" },
    "📈 Нет": { ru: "📈 Нет", uz: "📈 Yo'q", en: "📈 No" },
    "Температура снизилась! 🎉": { ru: "Температура снизилась! 🎉", uz: "Harorat tushdi! 🎉", en: "Temperature dropped! 🎉" },
    "drink_continue": { ru: "💧 Продолжайте питьевой режим — каждые 15 минут по глотку.", uz: "💧 Ichish tartibini davom ettiring — har 15 daqiqada bir ho'plam.", en: "💧 Continue fluids — sip every 15 minutes." },
    "Температура не снизилась": { ru: "Температура не снизилась", uz: "Harorat tushmadi", en: "Temperature did not drop" },
    "give_paracetamol_text": { ru: "💊 Дайте препарат с ПАРАЦЕТАМОЛОМ по весу.", uz: "💊 Vazn bo'yicha PARATSETAMOL preparatini bering.", en: "💊 Give PARACETAMOL by weight." },
    "important_consult": { ru: "Если температура не снижается и после Парацетамола — обратитесь к врачу.", uz: "Agar Paratsetamoldan keyin ham harorat tushmasa — shifokorga murojaat qiling.", en: "If temperature doesn't drop after Paracetamol — consult a doctor." },
    "Высокая температура, тёплые конечности": { ru: "Высокая температура, тёплые конечности", uz: "Yuqori harorat, iliq qo'l-oyoqlar", en: "High temperature, warm extremities" },
    "Важно:": { ru: "Важно:", uz: "Muhim:", en: "Important:" },
    "Взболтать перед употреблением": { ru: "Взболтать перед употреблением", uz: "Iste'mol qilishdan oldin chayqating", en: "Shake well before use" },
};

/**
 * Translate a key. Falls back to the key itself if not found.
 */
export function t(key: string, lang: Lang = "ru"): string {
    const entry = dict[key];
    if (!entry) return key;
    return entry[lang] || entry.ru || key;
}

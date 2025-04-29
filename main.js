// كود تبديل الوضع الليلي/النهاري الموحد
function setThemeIcon() {
    const html = document.documentElement;
    const darkModeIcon = document.getElementById('dark-mode-icon');
    if (html.classList.contains('dark')) {
        darkModeIcon.classList.remove('fa-moon');
        darkModeIcon.classList.add('fa-sun');
    } else {
        darkModeIcon.classList.remove('fa-sun');
        darkModeIcon.classList.add('fa-moon');
    }
}

// دالة مساعدة لإظهار اسم نوع الحصة بالعربي
function getTypeName(type) {
    switch(type) {
        case 'theory': return 'حصة نظرية';
        case 'practice': return 'حصة تطبيقية';
        case 'project': return 'مشروع عملي';
        case 'review': return 'مراجعة شاملة';
        case 'workshop': return 'ورشة عمل';
        default: return type;
    }
}

// دالة مساعدة لتحديد مستوى الحصة بناءً على رقمها
function getLevel(sessionNumber) {
    if (sessionNumber < 9) return 'مبتدئ';
    if (sessionNumber < 21) return 'متوسط';
    return 'متقدم';
}

document.addEventListener('DOMContentLoaded', function() {
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const html = document.documentElement;
    // تفعيل الوضع حسب التفضيل المحفوظ أو النظام
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'dark' || (!currentTheme && prefersDarkScheme.matches)) {
        html.classList.add('dark');
    } else {
        html.classList.remove('dark');
    }
    setThemeIcon();
    darkModeToggle.addEventListener('click', function() {
        const isDark = html.classList.toggle('dark');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        setThemeIcon();
    });

    // --- تعريف عناصر الصفحة بشكل آمن بعد تحميل DOM ---
    window.sessionsContainer = document.getElementById('sessions-container');
    window.progressFill = document.getElementById('progress-fill');
    window.completedCount = document.getElementById('completed-count');
    window.statsCompleted = document.getElementById('stats-completed');
    window.statsRemaining = document.getElementById('stats-remaining');
    window.searchInput = document.getElementById('search-input');
    window.typeFilter = document.getElementById('type-filter');
    window.weekFilter = document.getElementById('week-filter');
    window.statusFilter = document.getElementById('status-filter');

    // --- الكود الحالي للجدول والفلترة والإحصائيات ---
    // (سيتم نقل جميع أكواد JS من index.html إلى هنا لاحقاً)

    // --- بيانات الحصص (sessionsData) ---
    window.sessionsData = [
        { week: 1, number: 1, title: "مقدمة إلى Python وتثبيت الأدوات", type: "theory", desc: "تعريف Python ومجالات استخدامها، تثبيت Python وبيئة التطوير (VS Code/PyCharm)، كتابة وتنفيذ أول برنامج (Hello World!)", icon: "fa-python", completed: false },
        { week: 1, number: 2, title: "المتغيرات وأنواع البيانات", type: "theory", desc: "شرح المتغيرات، الأنواع الأساسية (int, float, str, bool)، التحويل بين الأنواع" , icon: "fa-code", completed: false },
        { week: 1, number: 3, title: "العمليات الحسابية والمنطقية", type: "practice", desc: "العمليات الحسابية والمنطقية، استخدام المتغيرات في العمليات، تمارين تطبيقية", icon: "fa-calculator", completed: false },
        { week: 1, number: 4, title: "التعامل مع النصوص (Strings)", type: "practice", desc: "تعريف النصوص والتنسيق (f-strings)، دوال النصوص (upper(), split(), replace())، التقطيع والفهرسة (Slicing & Indexing)", icon: "fa-font", completed: false },
        { week: 2, number: 5, title: "القوائم (Lists) والعمليات الأساسية", type: "practice", desc: "إنشاء القوائم والتعديل عليها، دوال القوائم (append(), remove(), sort())، التقطيع والفهرسة", icon: "fa-list-ol", completed: false },
        { week: 2, number: 6, title: "Tuples و Sets", type: "theory", desc: "الفرق بين Lists و Tuples، إنشاء وتعديل Sets، عمليات المجموعات (Union, Intersection)", icon: "fa-braille", completed: false },
        { week: 2, number: 7, title: "القواميس (Dictionaries)", type: "theory", desc: "تعريف القواميس، العمليات الأساسية (get, keys, values)، التعديل والحذف", icon: "fa-book", completed: false },
        { week: 2, number: 8, title: "الجمل الشرطية (if-elif-else)", type: "practice", desc: "استخدام if مع المقارنات، أمثلة تطبيقية (تحديد الأكبر، تقييم الدرجات)", icon: "fa-code-branch", completed: false },
        { week: 3, number: 9, title: "الحلقات (Loops) - while", type: "practice", desc: "استخدام while مع break و continue، أمثلة عملية (حساب المجاميع)", icon: "fa-redo", completed: false },
        { week: 3, number: 10, title: "الحلقات (Loops) - for", type: "practice", desc: "استخدام for مع range()، التكرار على القوائم والقواميس", icon: "fa-sync", completed: false },
        { week: 3, number: 11, title: "الدوال (Functions) - الأساسيات", type: "theory", desc: "تعريف واستدعاء الدوال، المعاملات والقيم الراجعة (return)", icon: "fa-function", completed: false },
        { week: 3, number: 12, title: "الدوال (Functions) - المتقدمة", type: "theory", desc: "الدوال المضمنة (lambda, map, filter)، الدوال ككائنات من الدرجة الأولى", icon: "fa-bolt", completed: false },
        { week: 4, number: 13, title: "المجال المحلي والعالمي (Scope)", type: "theory", desc: "المتغيرات المحلية والعالمية، الكلمة المفتاحية global", icon: "fa-globe", completed: false },
        { week: 4, number: 14, title: "المشروع الأول - آلة حاسبة", type: "project", desc: "بناء آلة حاسبة باستخدام الدوال والشروط", icon: "fa-calculator", completed: false },
        { week: 4, number: 15, title: "التعامل مع الملفات (File Handling)", type: "practice", desc: "قراءة وكتابة الملفات (open, read, write)", icon: "fa-file-alt", completed: false },
        { week: 4, number: 16, title: "البرمجة الشيئية (OOP) - الأساسيات", type: "theory", desc: "تعريف الكلاسات والكائنات، init و self", icon: "fa-cube", completed: false },
        { week: 5, number: 17, title: "البرمجة الشيئية (OOP) - الوراثة", type: "theory", desc: "مفهوم الوراثة (Inheritance)، استخدام super()", icon: "fa-cubes", completed: false },
        { week: 5, number: 18, title: "البرمجة الشيئية (OOP) - التعددية (Polymorphism)", type: "theory", desc: "مفهوم التعددية، أمثلة عملية", icon: "fa-shapes", completed: false },
        { week: 5, number: 19, title: "التعامل مع الأخطاء (Exceptions)", type: "practice", desc: "استخدام try-except، معالجة الأخطاء الشائعة", icon: "fa-exclamation-triangle", completed: false },
        { week: 5, number: 20, title: "قواعد البيانات (SQLite)", type: "practice", desc: "إنشاء قاعدة بيانات، إدراج واستعلام البيانات", icon: "fa-database", completed: false },
        { week: 6, number: 21, title: "المشروع الثاني - نظام إدارة مهام (الجزء 1)", type: "project", desc: "بناء نظام To-Do List باستخدام القوائم والملفات", icon: "fa-tasks", completed: false },
        { week: 6, number: 22, title: "المشروع الثاني - نظام إدارة مهام (الجزء 2)", type: "project", desc: "إكمال نظام To-Do List وإضافة ميزة جديدة", icon: "fa-tasks", completed: false },
        { week: 6, number: 23, title: "الخوارزميات (Sorting) - Bubble Sort", type: "workshop", desc: "تعلم وتطبيق خوارزمية Bubble Sort", icon: "fa-sort", completed: false },
        { week: 6, number: 24, title: "الخوارزميات (Searching) - Linear & Binary Search", type: "workshop", desc: "تعلم وتطبيق خوارزميات البحث", icon: "fa-search", completed: false },
        { week: 7, number: 25, title: "تطوير الويب (Flask Basics) - الجزء 1", type: "practice", desc: "مقدمة إلى Flask، إنشاء أول تطبيق ويب", icon: "fa-globe", completed: false },
        { week: 7, number: 26, title: "تطوير الويب (Flask Basics) - الجزء 2", type: "practice", desc: "Routing وعرض القوالب في Flask", icon: "fa-route", completed: false },
        { week: 7, number: 27, title: "الـ Threading والبرمجة المتوازية - الجزء 1", type: "theory", desc: "أساسيات threading في Python", icon: "fa-random", completed: false },
        { week: 7, number: 28, title: "الـ Threading والبرمجة المتوازية - الجزء 2", type: "practice", desc: "أمثلة عملية على threading", icon: "fa-random", completed: false },
        { week: 8, number: 29, title: "التعلم الآلي (Machine Learning Intro) - الجزء 1", type: "theory", desc: "مقدمة إلى pandas و numpy", icon: "fa-brain", completed: false },
        { week: 8, number: 30, title: "التعلم الآلي (Machine Learning Intro) - الجزء 2", type: "practice", desc: "تطبيقات عملية على pandas و numpy", icon: "fa-brain", completed: false },
        { week: 8, number: 31, title: "المشروع النهائي - الاختيار (الجزء 1)", type: "project", desc: "بدء مشروع نهائي اختياري (تطبيق ويب/سطح مكتب)", icon: "fa-project-diagram", completed: false },
        { week: 8, number: 32, title: "المشروع النهائي - الاختيار (الجزء 2)", type: "project", desc: "مواصلة العمل على المشروع النهائي", icon: "fa-project-diagram", completed: false },
        { week: 9, number: 33, title: "المشروع النهائي - الاختيار (الجزء 3)", type: "project", desc: "مواصلة العمل على المشروع النهائي", icon: "fa-project-diagram", completed: false },
        { week: 9, number: 34, title: "المشروع النهائي - الاختيار (الجزء 4)", type: "project", desc: "مواصلة العمل على المشروع النهائي", icon: "fa-project-diagram", completed: false },
        { week: 9, number: 35, title: "المشروع النهائي - الاختيار (الجزء 5)", type: "project", desc: "إنهاء المشروع النهائي", icon: "fa-project-diagram", completed: false },
        { week: 10, number: 36, title: "مراجعة شاملة للمفاهيم المتقدمة", type: "review", desc: "مراجعة أهم مفاهيم البرمجة المتقدمة في Python", icon: "fa-book-open", completed: false },
        { week: 10, number: 37, title: "مراجعة وتطوير المشروع النهائي (الجزء 2)", type: "review", desc: "تحسين المشروع النهائي وإضافة ميزات جديدة", icon: "fa-check-double", completed: false },
        { week: 10, number: 38, title: "مراجعة وتطوير المشروع النهائي (الجزء 3)", type: "review", desc: "تحسين المشروع وإضافة ميزات جديدة", icon: "fa-check-double", completed: false },
        { week: 10, number: 39, title: "مراجعة شاملة للمفاهيم الأساسية", type: "review", desc: "مراجعة شاملة لأهم مفاهيم Python", icon: "fa-book-open", completed: false },
        { week: 10, number: 40, title: "مراجعة شاملة للمشاريع والتطبيقات", type: "review", desc: "مراجعة المشاريع والتطبيقات العملية", icon: "fa-laptop-code", completed: false }
    ];

    // --- إضافة الواجبات لكل حصة ---
    window.assignmentsMap = {
        1: "إنشاء جدول بيانات طلاب",
        2: "حل تمارين الطباعة والمتغيرات",
        3: "كتابة برنامج جمع رقمين من المستخدم",
        4: "تطبيق دوال النصوص على جمل من اختيارك",
        5: "إنشاء قائمة بأسماء أصدقائك والتعديل عليها",
        6: "قارن بين Tuple و Set و List بمثال برمجي",
        7: "برمجة قاموس لترجمة كلمات من الإنجليزية للعربية",
        8: "برنامج يحدد أكبر رقم بين 3 أرقام",
        9: "برنامج يجمع الأعداد من 1 إلى 10 باستخدام while",
        10: "برنامج يطبع عناصر قائمة باستخدام for",
        11: "كتابة دالة ترجع مربع رقم مع تجربة قيم مختلفة",
        12: "استخدم lambda لكتابة دالة تجمع رقمين",
        13: "جرب متغيرين بنفس الاسم داخل دالتين مختلفتين ووضح النتيجة",
        14: "برمجة آلة حاسبة بسيطة (جمع/طرح/ضرب/قسمة)",
        15: "قراءة ملف نصي وحساب عدد الأسطر فيه",
        16: "إنشاء كلاس طالب يحوي خصائص وطرق بسيطة",
        17: "إنشاء كلاس موظف يرث من كلاس شخص",
        18: "برمجة مثال يوضح التعددية (Polymorphism)",
        19: "برمجة try-except لقراءة عدد من المستخدم",
        20: "إنشاء قاعدة بيانات SQLite وتخزين بيانات طلاب",
        21: "برمجة To-Do List (جزء 1): إضافة المهام",
        22: "برمجة To-Do List (جزء 2): حذف وتعديل المهام",
        23: "تطبيق خوارزمية Bubble Sort على قائمة أرقام",
        24: "تطبيق خوارزمية البحث الثنائي (Binary Search)",
        25: "إنشاء تطبيق Flask يعرض رسالة ترحيبية",
        26: "إضافة صفحة جديدة في Flask لعرض قائمة مهام",
        27: "برمجة مثال يستخدم threading لطباعة أرقام",
        28: "برمجة تطبيق يشغل دالتين بالتوازي باستخدام threading",
        29: "قراءة ملف CSV باستخدام pandas",
        30: "تحليل بيانات بسيطة باستخدام numpy",
        31: "بدء مشروع نهائي (فكرة تطبيق ويب أو سطح مكتب)",
        32: "تطوير المشروع النهائي: إضافة ميزة جديدة",
        33: "تطوير المشروع النهائي: تحسين الواجهة",
        34: "تطوير المشروع النهائي: توثيق الكود",
        35: "تسليم المشروع النهائي وتجربته",
        36: "تلخيص أهم مفاهيم البرمجة المتقدمة",
        37: "تحسين المشروع النهائي وإضافة اختبارات",
        38: "تحسين المشروع النهائي: إضافة توثيق للمستخدم",
        39: "تلخيص أهم مفاهيم Python الأساسية",
        40: "كتابة تقرير عن ما تعلمته في الدورة"
    };

    // تعديل دالة renderSessions لإظهار الواجب أسفل كل كرت درس إذا وُجد
    window.renderSessions = function() {
        sessionsContainer.innerHTML = '';
        const searchTerm = searchInput.value.toLowerCase();
        const typeFilterValue = typeFilter.value;
        const weekFilterValue = weekFilter.value;
        const statusFilterValue = statusFilter.value;
        sessionsData
            .filter(session => {
                if (searchTerm &&
                    !session.title.toLowerCase().includes(searchTerm) &&
                    !session.desc.toLowerCase().includes(searchTerm)) {
                    return false;
                }
                if (typeFilterValue !== 'all' && session.type !== typeFilterValue) return false;
                if (weekFilterValue !== 'all' && String(session.week) !== weekFilterValue) return false;
                if (statusFilterValue === 'completed' && !session.completed) return false;
                if (statusFilterValue === 'incomplete' && session.completed) return false;
                return true;
            })
            .forEach(session => {
                const sessionCard = document.createElement('div');
                sessionCard.className = `session-card rounded-xl shadow-sm p-6 bg-white dark:bg-dark-200 border border-gray-200 dark:border-dark-300 transition relative`;
                sessionCard.innerHTML = `
                    <div class="flex items-center gap-3 mb-3">
                        <div class="bg-gray-100 dark:bg-dark-300 p-3 rounded-full">
                            <i class="fas ${session.icon} text-xl text-primary dark:text-accent"></i>
                        </div>
                        <div>
                            <h3 class="font-bold text-lg">${session.title}</h3>
                            <div class="text-xs text-gray-500 dark:text-gray-400">${getTypeName(session.type)}</div>
                        </div>
                    </div>
                    <div class="mb-2 text-sm text-gray-700 dark:text-gray-300">${session.desc}</div>
                    <div class="flex items-center gap-2 mt-2">
                        <button onclick="toggleCompletion(this, ${session.number})" class="px-3 py-1 rounded bg-primary text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary/50 ${session.completed ? 'opacity-70' : ''}">
                            ${session.completed ? 'مكتملة' : 'إكمال'}
                        </button>
                        <span class="text-xs text-gray-400">الحصة رقم ${session.number}</span>
                    </div>
                    <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">${getLevel(session.number)}</div>
                    <div class="text-xs text-gray-500 dark:text-gray-400">${session.completed ? 'تم الإكمال' : 'لم تكتمل بعد'}</div>
                    ${window.assignmentsMap[session.number] ? `<div class='assignment-box mt-4'><span class='assignment-label'>الواجب:</span><br>${window.assignmentsMap[session.number]}</div>` : ''}
                `;
                sessionsContainer.appendChild(sessionCard);
            });
    }

    // تحميل حالة الإكمال من التخزين المحلي
    if (typeof loadCompletionStatus === 'function') loadCompletionStatus();
    // عرض الحصص
    if (typeof renderSessions === 'function') renderSessions();
    // إضافة مستمعات الأحداث
    searchInput.addEventListener('input', renderSessions);
    typeFilter.addEventListener('change', renderSessions);
    weekFilter.addEventListener('change', renderSessions);
    statusFilter.addEventListener('change', renderSessions);
});

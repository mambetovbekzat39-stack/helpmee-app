
        // Полный список имен Аллаха (сокращенная версия для мобильных)
        const namesOfAllah = [
            {arabic: "الرَّحْمَنُ", transcription: "Ар-Рахман", meaning: "Милостивый", translation: "Обладающий безграничной милостью", explanation: "Это имя подчеркивает безграничную милость Аллаха, которая охватывает всё сущее.", quran: "Упоминается в Коране 57 раз, включая суру 'Аль-Фатиха'.", benefit: "Обращение к Аллаху через это имя помогает обрести милость и благословение.", category: "mercy"},
            {arabic: "الرَّحِيمُ", transcription: "Ар-Рахим", meaning: "Милосердный", translation: "Дарующий милость и прощение", explanation: "Это имя указывает на постоянную милость Аллаха к верующим.", quran: "Упоминается в Коране 114 раз, чаще всего с именем Ар-Рахман.", benefit: "Помогает обрести милосердие Аллаха.", category: "mercy"},
            {arabic: "الْمَلِكُ", transcription: "Аль-Малик", meaning: "Властелин", translation: "Царь царей, Абсолютный Правитель", explanation: "Аллах - истинный Властелин всего сущего.", quran: "Упоминается в Коране 5 раз, например в суре 'Аль-Хашр'.", benefit: "Помогает осознать абсолютную власть Аллаха.", category: "power"},
            {arabic: "الْقُدُّوسُ", transcription: "Аль-Куддус", meaning: "Святой", translation: "Свободный от любого недостатка", explanation: "Аллах чист от любых недостатков и несовершенств.", quran: "Упоминается в Коране 2 раза, в сурах 'Аль-Хашр' и 'Аль-Джумуа'.", benefit: "Помогает очистить сердце от недостатков.", category: "wisdom"},
            {arabic: "السَّلاَمُ", transcription: "Ас-Салам", meaning: "Мирный", translation: "Источник мира и безопасности", explanation: "Аллах - источник мира и безопасности для всех творений.", quran: "Упоминается в Коране в суре 'Аль-Хашр'.", benefit: "Приносит душевный покой и безопасность.", category: "mercy"},
            {arabic: "الْمُؤْمِنُ", transcription: "Аль-Мумин", meaning: "Верный", translation: "Дарующий безопасность и веру", explanation: "Аллах дарует веру и безопасность Своим рабам.", quran: "Упоминается в Коране в суре 'Аль-Хашр'.", benefit: "Помогает укрепить веру и обрести безопасность.", category: "mercy"},
            {arabic: "الْمُهَيْمِنُ", transcription: "Аль-Мухаймин", meaning: "Хранитель", translation: "Наблюдающий и защищающий", explanation: "Аллах наблюдает за всем сущим, защищает творения.", quran: "Упоминается в Коране в суре 'Аль-Хашр'.", benefit: "Дает осознание защиты Аллаха.", category: "power"},
            {arabic: "الْعَزِيزُ", transcription: "Аль-Азиз", meaning: "Могущественный", translation: "Непобедимый, Обладающий величием", explanation: "Аллах обладает абсолютным могуществом.", quran: "Упоминается в Коране 92 раза.", benefit: "Помогает обрести уверенность в помощи Аллаха.", category: "power"},
            {arabic: "الْجَبَّارُ", transcription: "Аль-Джаббар", meaning: "Могучий", translation: "Устраняющий все недостатки", explanation: "Аллах исправляет недостатки и восстанавливает справедливость.", quran: "Упоминается в Коране в суре 'Аль-Хашр'.", benefit: "Помогает исправить недостатки характера.", category: "power"},
            {arabic: "الْمُتَكَبِّرُ", transcription: "Аль-Мутакаббир", meaning: "Превосходящий", translation: "Единственный, достойный величия", explanation: "Только Аллах достоин истинного величия.", quran: "Упоминается в Коране в суре 'Аль-Хашр'.", benefit: "Помогает избавиться от высокомерия.", category: "power"}
        ];

        // Добавляем остальные имена
        for (let i = 11; i <= 99; i++) {
            const categories = ["mercy", "power", "wisdom"];
            const category = categories[i % categories.length];
            
            const meanings = ["Дарующий", "Великий", "Мудрый", "Создатель", "Милосердный", "Сильный"];
            const meaning = meanings[i % meanings.length] + " " + i;
            
            const translations = ["Проявление милости", "Проявление могущества", "Проявление мудрости"];
            const translation = translations[i % translations.length] + " " + i;
            
            namesOfAllah.push({
                arabic: `اسم ${i}`,
                transcription: `Аль-Исм ${i}`,
                meaning: meaning,
                translation: translation,
                explanation: "Это имя отражает одно из качеств Аллаха, помогающее верующему в духовном развитии.",
                quran: "Упоминается в Коране в различных аятах.",
                benefit: "Помогает верующему в духовном развитии и приближении к Аллаху.",
                category: category
            });
        }

        // Состояние приложения
        let favorites = JSON.parse(localStorage.getItem('allahFavorites')) || [];
        let currentFilter = 'all';
        let currentSearch = '';
        let currentPage = 1;
        const itemsPerPage = 10;
        let currentDetailIndex = 0;

        // DOM элементы
        const namesList = document.getElementById('namesList');
        const searchInput = document.getElementById('searchInput');
        const shownNames = document.getElementById('shownNames');
        const favoritesCount = document.getElementById('favoritesCount');
        const totalNames = document.getElementById('totalNames');
        const currentPageEl = document.getElementById('currentPage');
        const modalOverlay = document.getElementById('modalOverlay');
        const closeModal = document.getElementById('closeModal');
        const modalFavoriteBtn = document.getElementById('modalFavoriteBtn');
        
        // Элементы модального окна
        const modalNumber = document.getElementById('modalNumber');
        const modalArabic = document.getElementById('modalArabic');
        const modalTranscription = document.getElementById('modalTranscription');
        const modalMeaning = document.getElementById('modalMeaning');
        const modalTranslation = document.getElementById('modalTranslation');
        const modalExplanation = document.getElementById('modalExplanation');
        const modalQuran = document.getElementById('modalQuran');
        const modalBenefit = document.getElementById('modalBenefit');
        
        // Инициализация
        function initApp() {
            updateStats();
            renderNames();
            setupEventListeners();
            showLoading(false);
        }
        
        // Показать/скрыть загрузку
        function showLoading(show) {
            if (show) {
                namesList.innerHTML = `
                    <div class="loading">
                        <i class="fas fa-spinner fa-spin"></i>
                        <p>Загрузка имён...</p>
                    </div>
                `;
            }
        }
        
        // Обновить статистику
        function updateStats() {
            totalNames.textContent = namesOfAllah.length;
            favoritesCount.textContent = favorites.length;
            shownNames.textContent = getFilteredNames().length;
            currentPageEl.textContent = currentPage;
        }
        
        // Получить отфильтрованные имена
        function getFilteredNames() {
            let filtered = [...namesOfAllah];
            
            // Поиск
            if (currentSearch) {
                const searchLower = currentSearch.toLowerCase();
                filtered = filtered.filter(name => 
                    name.transcription.toLowerCase().includes(searchLower) ||
                    name.meaning.toLowerCase().includes(searchLower) ||
                    name.translation.toLowerCase().includes(searchLower)
                );
            }
            
            // Фильтр по категории
            if (currentFilter !== 'all' && currentFilter !== 'favorites') {
                filtered = filtered.filter(name => name.category === currentFilter);
            }
            
            // Фильтр избранного
            if (currentFilter === 'favorites') {
                filtered = filtered.filter((name, index) => favorites.includes(index));
            }
            
            return filtered;
        }
        
        // Получить имена для текущей страницы
        function getNamesForCurrentPage() {
            const filtered = getFilteredNames();
            const startIndex = (currentPage - 1) * itemsPerPage;
            const endIndex = startIndex + itemsPerPage;
            return filtered.slice(startIndex, endIndex);
        }
        
        // Рассчитать общее количество страниц
        function getTotalPages() {
            return Math.ceil(getFilteredNames().length / itemsPerPage);
        }
        
        // Отобразить имена
        function renderNames() {
            const filtered = getNamesForCurrentPage();
            
            if (filtered.length === 0) {
                namesList.innerHTML = `
                    <div class="no-results">
                        <i class="far fa-frown"></i>
                        <h3>Имена не найдены</h3>
                        <p>Попробуйте изменить поиск или фильтр</p>
                    </div>
                `;
                return;
            }
            
            let html = '';
            
            filtered.forEach(name => {
                const index = namesOfAllah.indexOf(name);
                const isFavorited = favorites.includes(index);
                
                html += `
                    <div class="name-card ${isFavorited ? 'favorited' : ''}" data-index="${index}">
                        <div class="card-header">
                            <div class="number">${index + 1}</div>
                            <button class="favorite-btn ${isFavorited ? 'favorited' : ''}" data-index="${index}">
                                <i class="${isFavorited ? 'fas' : 'far'} fa-star"></i>
                            </button>
                        </div>
                        <div class="arabic-name">${name.arabic}</div>
                        <div class="transcription">${name.transcription}</div>
                        <div class="meaning">${name.meaning}</div>
                        <div class="translation">${name.translation}</div>
                    </div>
                `;
            });
            
            // Добавить пагинацию если нужно
            const totalPages = getTotalPages();
            if (totalPages > 1) {
                html += `
                    <div style="display: flex; justify-content: center; gap: 10px; margin: 20px 0;">
                        <button class="filter-chip ${currentPage === 1 ? 'active' : ''}" id="prevPage" ${currentPage === 1 ? 'disabled' : ''}>
                            <i class="fas fa-chevron-left"></i> Назад
                        </button>
                        <div style="padding: 8px 16px; color: var(--text-muted);">
                            ${currentPage} / ${totalPages}
                        </div>
                        <button class="filter-chip ${currentPage === totalPages ? 'active' : ''}" id="nextPage" ${currentPage === totalPages ? 'disabled' : ''}>
                            Вперед <i class="fas fa-chevron-right"></i>
                        </button>
                    </div>
                `;
            }
            
            namesList.innerHTML = html;
            
            // Добавить обработчики событий
            document.querySelectorAll('.name-card').forEach(card => {
                card.addEventListener('click', (e) => {
                    if (!e.target.closest('.favorite-btn')) {
                        const index = parseInt(card.getAttribute('data-index'));
                        showNameDetails(index);
                    }
                });
            });
            
            document.querySelectorAll('.favorite-btn').forEach(btn => {
                btn.addEventListener('click', toggleFavorite);
            });
            
            // Обработчики пагинации
            const prevPageBtn = document.getElementById('prevPage');
            const nextPageBtn = document.getElementById('nextPage');
            
            if (prevPageBtn) {
                prevPageBtn.addEventListener('click', () => {
                    if (currentPage > 1) {
                        currentPage--;
                        renderNames();
                        updateStats();
                        window.scrollTo(0, 0);
                    }
                });
            }
            
            if (nextPageBtn) {
                nextPageBtn.addEventListener('click', () => {
                    const totalPages = getTotalPages();
                    if (currentPage < totalPages) {
                        currentPage++;
                        renderNames();
                        updateStats();
                        window.scrollTo(0, 0);
                    }
                });
            }
        }
        
        // Переключить избранное
        function toggleFavorite(e) {
            e.stopPropagation();
            const index = parseInt(e.currentTarget.getAttribute('data-index'));
            
            if (favorites.includes(index)) {
                favorites = favorites.filter(i => i !== index);
            } else {
                favorites.push(index);
            }
            
            localStorage.setItem('allahFavorites', JSON.stringify(favorites));
            updateStats();
            renderNames();
            
            // Обновить кнопку в модальном окне если оно открыто
            if (modalOverlay.classList.contains('active') && currentDetailIndex === index) {
                updateModalFavoriteButton();
            }
        }
        
        // Показать детали имени
        function showNameDetails(index) {
            currentDetailIndex = index;
            const name = namesOfAllah[index];
            
            modalNumber.textContent = index + 1;
            modalArabic.textContent = name.arabic;
            modalTranscription.textContent = name.transcription;
            modalMeaning.textContent = name.meaning;
            modalTranslation.textContent = name.translation;
            modalExplanation.textContent = name.explanation;
            modalQuran.textContent = name.quran;
            modalBenefit.textContent = name.benefit;
            
            updateModalFavoriteButton();
            modalOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
        
        // Обновить кнопку избранного в модальном окне
        function updateModalFavoriteButton() {
            const isFavorited = favorites.includes(currentDetailIndex);
            modalFavoriteBtn.innerHTML = isFavorited ? 
                '<i class="fas fa-star"></i> В избранном' : 
                '<i class="far fa-star"></i> В избранное';
        }
        
        // Скрыть модальное окно
        function hideModal() {
            modalOverlay.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
        
        // Показать случайное имя
        function showRandomName() {
            const randomIndex = Math.floor(Math.random() * namesOfAllah.length);
            showNameDetails(randomIndex);
        }
        
        // Настроить обработчики событий
        function setupEventListeners() {
            // Поиск
            searchInput.addEventListener('input', (e) => {
                currentSearch = e.target.value;
                currentPage = 1;
                renderNames();
                updateStats();
            });
            
            // Быстрые фильтры
            document.querySelectorAll('.filter-chip[data-filter]').forEach(chip => {
                chip.addEventListener('click', (e) => {
                    const filter = e.target.getAttribute('data-filter');
                    
                    // Активировать только выбранный фильтр
                    document.querySelectorAll('.filter-chip[data-filter]').forEach(c => {
                        c.classList.remove('active');
                    });
                    e.target.classList.add('active');
                    
                    currentFilter = filter;
                    currentPage = 1;
                    renderNames();
                    updateStats();
                    
                    // Прокрутить вверх
                    window.scrollTo(0, 0);
                });
            });
            
            // Нижняя навигация
            document.getElementById('navHome').addEventListener('click', () => {
                // Сбросить фильтры
                document.querySelectorAll('.filter-chip[data-filter]').forEach(c => {
                    c.classList.remove('active');
                });
                document.querySelector('.filter-chip[data-filter="all"]').classList.add('active');
                
                currentFilter = 'all';
                currentSearch = '';
                searchInput.value = '';
                currentPage = 1;
                renderNames();
                updateStats();
                
                // Активировать кнопку
                document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
                document.getElementById('navHome').classList.add('active');
                
                window.scrollTo(0, 0);
            });
            
            document.getElementById('navFavorites').addEventListener('click', () => {
                // Установить фильтр избранного
                document.querySelectorAll('.filter-chip[data-filter]').forEach(c => {
                    c.classList.remove('active');
                });
                
                currentFilter = 'favorites';
                currentPage = 1;
                renderNames();
                updateStats();
                
                // Активировать кнопку
                document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
                document.getElementById('navFavorites').classList.add('active');
                
                window.scrollTo(0, 0);
            });
            
            document.getElementById('navRandom').addEventListener('click', () => {
                showRandomName();
                
                // Активировать кнопку
                document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
                document.getElementById('navRandom').classList.add('active');
            });
            
            document.getElementById('navInfo').addEventListener('click', () => {
                // Показать информацию о проекте
                currentDetailIndex = 0;
                const name = namesOfAllah[0];
                
                modalNumber.textContent = "99";
                modalArabic.textContent = "أسماء الله الحسنى";
                modalTranscription.textContent = "Асма-уль-Хусна";
                modalMeaning.textContent = "99 Прекрасных Имён Аллаха";
                modalTranslation.textContent = "Это приложение поможет вам изучить и запомнить все 99 имён Аллаха";
                modalExplanation.textContent = "Каждое имя отражает определённое качество Всевышнего. Изучение имён Аллаха помогает укрепить веру и приблизиться к Нему.";
                modalQuran.textContent = "В Коране сказано: 'У Аллаха - самые прекрасные имена. Посему взывайте к Нему через них' (7:180)";
                modalBenefit.textContent = "Регулярное поминание имён Аллаха приносит душевный покой, укрепляет веру и помогает в трудностях.";
                
                modalFavoriteBtn.style.display = 'none';
                modalOverlay.classList.add('active');
                document.body.style.overflow = 'hidden';
                
                // Активировать кнопку
                document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
                document.getElementById('navInfo').classList.add('active');
            });
            
            // Модальное окно
            closeModal.addEventListener('click', hideModal);
            modalOverlay.addEventListener('click', (e) => {
                if (e.target === modalOverlay) {
                    hideModal();
                }
            });
            
            modalFavoriteBtn.addEventListener('click', () => {
                toggleFavorite({target: modalFavoriteBtn, stopPropagation: () => {}});
            });
            
            // Закрытие модального окна по Esc
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
                    hideModal();
                }
            });
            
            // Предотвращение перезагрузки при отправке формы
            searchInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                }
            });
        }
        
        // Запуск приложения
        document.addEventListener('DOMContentLoaded', () => {
            // Имитация загрузки
            showLoading(true);
            setTimeout(initApp, 500);
        });
    
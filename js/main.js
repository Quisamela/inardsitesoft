/**
 * INARD WEBSITE - Modern Interactive JavaScript
 * Funcionalidades: Dark/Light Mode, Galeria Dinâmica, Chat Simulado, Menu Mobile, Animações
 */




// ============================================
// DARK / LIGHT MODE TOGGLE
// ============================================
(function initTheme() {
    const themeBtn = document.getElementById('themeSwitch');
    if (!themeBtn) return;
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('inard_theme');
    if (savedTheme === 'dark') {
        document.body.setAttribute('data-theme', 'dark');
        updateThemeButton(true);
    } else {
        document.body.setAttribute('data-theme', 'light');
        updateThemeButton(false);
    }
    
    themeBtn.addEventListener('click', () => {
        const isDark = document.body.getAttribute('data-theme') === 'dark';
        if (isDark) {
            document.body.setAttribute('data-theme', 'light');
            localStorage.setItem('inard_theme', 'light');
            updateThemeButton(false);
        } else {
            document.body.setAttribute('data-theme', 'dark');
            localStorage.setItem('inard_theme', 'dark');
            updateThemeButton(true);
        }
    });
    
    function updateThemeButton(isDark) {
        const icon = themeBtn.querySelector('i');
        const span = themeBtn.querySelector('span');
        if (isDark) {
            icon.className = 'fas fa-sun';
            span.textContent = 'Modo Claro';
        } else {
            icon.className = 'fas fa-moon';
            span.textContent = 'Modo Escuro';
        }
    }
})();

// ============================================
// MOBILE MENU TOGGLE
// ============================================
(function initMobileMenu() {
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('.main-nav');
    
    if (menuBtn && nav) {
        menuBtn.addEventListener('click', () => {
            nav.classList.toggle('active');
            const icon = menuBtn.querySelector('i');
            if (nav.classList.contains('active')) {
                icon.className = 'fas fa-times';
            } else {
                icon.className = 'fas fa-bars';
            }
        });
    }
})();

// ============================================
// CHAT LOGIN SIMULATION (Página chat.html)
// ============================================
(function initChat() {
    const chatForm = document.getElementById('chatLoginForm');
    if (!chatForm) return;
    
    chatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const nome = document.getElementById('chatNome')?.value.trim();
        const senha = document.getElementById('chatSenha')?.value;
        const congregacao = document.getElementById('chatCongregacao')?.value;
        const funcao = document.getElementById('chatFuncao')?.value;
        const messageDiv = document.getElementById('chatMessage');
        
        if (!nome) {
            showChatMessage('Por favor, digite seu nome completo', 'error');
            return;
        }
        
        if (!senha) {
            showChatMessage('Por favor, digite sua senha de acesso', 'error');
            return;
        }
        
        if (senha.length < 3) {
            showChatMessage('Senha inválida. Mínimo 3 caracteres', 'error');
            return;
        }
        
        // Simulação de login bem-sucedido
        showChatMessage(`✅ Bem-vindo(a) ${nome}! Conexão estabelecida. Em breve você será redirecionado para a sala do chat.`, 'success');
        
        // Animação de loading e redirect simulado
        setTimeout(() => {
            window.location.href = 'chat-sala.html';
        }, 2000);
    });
    
    function showChatMessage(msg, type) {
        const messageDiv = document.getElementById('chatMessage');
        if (messageDiv) {
            messageDiv.textContent = msg;
            messageDiv.className = `chat-message ${type}`;
            setTimeout(() => {
                messageDiv.className = 'chat-message';
                messageDiv.textContent = '';
            }, 4000);
        }
    }
})();

// ============================================
// DYNAMIC GALLERY WITH FILTERS (Página galeria.html)
// ============================================
(function initGallery() {
    const galleryGrid = document.getElementById('galleryGrid');
    if (!galleryGrid) return;
    
    // Sample gallery data - Substitua com suas imagens reais
    const galleryItems = [
        { id: 1, src: 'images/culto1.jpg', category: 'cultos', title: 'Culto de Adoração', desc: 'Momento de louvor e adoração' },
        { id: 2, src: 'images/culto0.jpg', category: 'cultos', title: 'Culto de Santa Ceia', desc: 'Celebração da Santa Ceia' },
        { id: 3, src: 'images/campanha0.jpg', category: 'eventos', title: 'Conferência de Jovens', desc: 'Jovens cheios do Espírito' },
        { id: 4, src: 'images/monte1.jpg', category: 'eventos', title: 'Encontro de Casais', desc: 'Fortalecimento da família' },
        { id: 5, src: 'images/batismo1.jpg', category: 'batismos', title: 'Batismo nas Águas', desc: '50 almas batizadas' },
        { id: 6, src: 'images/batismo2.jpg', category: 'batismos', title: 'Celebração de Batismo', desc: 'Novos membros' },
        { id: 7, src: 'images/culto0.jpg', category: 'ceia', title: 'Santa Ceia', desc: 'Momento de comunhão' },
        { id: 8, src: 'images/culto1.jpg', category: 'ceia', title: 'Ceia do Senhor', desc: 'Renovação da aliança' },
        { id: 9, src: 'images/culto3.jpg', category: 'cultos', title: 'Culto de Oração', desc: 'Intercessão' },
        { id: 10, src: 'images/cultoebd.jpg', category: 'eventos', title: 'Escola de Líderes', desc: 'Capacitação' },
        { id: 11, src: 'images/batismo0.jpg', category: 'batismos', title: 'Batismo', desc: 'Dedicação' },
        { id: 12, src: 'images/consagracao0.jpg', category: 'ceia', title: 'Santa Ceia Especial', desc: 'Fim de ano' }
    ];
    
    // Load all images with placeholder fallback
    function renderGallery(items) {
        galleryGrid.innerHTML = '';
        items.forEach(item => {
            const galleryItem = document.createElement('div');
            galleryItem.className = 'gallery-item';
            galleryItem.setAttribute('data-category', item.category);
            galleryItem.innerHTML = `
                <img src="${item.src}" alt="${item.title}" onerror="this.src='https://placehold.co/400x300/1e3b5c/white?text=${encodeURIComponent(item.title)}'">
                <div class="gallery-overlay">
                    <h4>${item.title}</h4>
                    <p>${item.desc}</p>
                    <i class="fas fa-search-plus"></i>
                </div>
            `;
            galleryItem.addEventListener('click', () => openLightbox(item.src, item.title));
            galleryGrid.appendChild(galleryItem);
        });
    }
    
    renderGallery(galleryItems);
    
    // Filter functionality
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.getAttribute('data-filter');
            const items = document.querySelectorAll('.gallery-item');
            items.forEach(item => {
                if (filter === 'all' || item.getAttribute('data-category') === filter) {
                    item.style.display = 'block';
                    setTimeout(() => item.style.opacity = '1', 10);
                } else {
                    item.style.opacity = '0';
                    setTimeout(() => item.style.display = 'none', 300);
                }
            });
        });
    });
    
    // Lightbox
    function openLightbox(src, title) {
        const lightbox = document.getElementById('lightbox');
        const lightboxImg = document.getElementById('lightboxImg');
        const caption = document.getElementById('lightboxCaption');
        if (lightbox && lightboxImg) {
            lightboxImg.src = src;
            caption.textContent = title;
            lightbox.style.display = 'flex';
        }
    }
    
    const closeLightbox = document.querySelector('.close-lightbox');
    if (closeLightbox) {
        closeLightbox.addEventListener('click', () => {
            const lightbox = document.getElementById('lightbox');
            if (lightbox) lightbox.style.display = 'none';
        });
    }
})();

// ============================================
// ANIMATION ON SCROLL (Intersection Observer)
// ============================================
(function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.feature-card, .highlight-card, .doctrine-card, .news-card, .congregation-card, .leader-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    // Add animation class
    document.head.insertAdjacentHTML('beforeend', `
        <style>
            .animate-in {
                opacity: 1 !important;
                transform: translateY(0) !important;
            }
        </style>
    `);
})();

// ============================================
// BACK TO TOP BUTTON
// ============================================
(function initBackToTop() {
    const btn = document.createElement('button');
    btn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    btn.className = 'back-to-top';
    btn.style.cssText = `
        position: fixed;
        bottom: 100px;
        right: 30px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: var(--primary-gold, #c9a03d);
        color: white;
        border: none;
        cursor: pointer;
        display: none;
        align-items: center;
        justify-content: center;
        z-index: 999;
        transition: all 0.3s;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;
    document.body.appendChild(btn);
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            btn.style.display = 'flex';
        } else {
            btn.style.display = 'none';
        }
    });
    
    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
})();

// ============================================
// TV GOOD NEWS - VIDEO PLAYER (tv-good-news.html)
// ============================================
(function initTVPlayer() {
    const tvContainer = document.querySelector('.tv-player-container');
    if (!tvContainer) return;
    
    // Video data
    const videos = [
        { id: 1, title: 'Culto ao Vivo - Domingo', date: 'Domingo, 18h', thumbnail: 'images/cultoantigo.jpg', url: '#' },
        { id: 2, title: 'Santa Ceia Especial', date: 'Último Domingo do Mês', thumbnail: 'images/consagracao.mp4', url: '#' },
        { id: 3, title: 'Escola de Profetas', date: 'Quartas, 19h', thumbnail: 'images/accaosocial0.jpg', url: '#' },
        { id: 4, title: 'Conferência de Jovens', date: 'Evento Anual', thumbnail: 'images/consagracao0.jpg', url: '#' }
    ];
    
    // Simulate featured video
    const featuredVideo = document.querySelector('.featured-video iframe');
    if (featuredVideo) {
        // You can set a YouTube embed URL here
        // featuredVideo.src = "https://www.youtube.com/embed/VIDEO_ID";
    }
    
    // Load playlist
    const playlist = document.querySelector('.playlist-items');
    if (playlist) {
        videos.forEach(video => {
            const item = document.createElement('div');
            item.className = 'playlist-item';
            item.innerHTML = `
                <div class="playlist-thumb">
                    <img src="${video.thumbnail}" onerror="this.src='https://placehold.co/120x80/1e3b5c/white?text=INARD'">
                    <i class="fas fa-play-circle"></i>
                </div>
                <div class="playlist-info">
                    <h4>${video.title}</h4>
                    <p>${video.date}</p>
                </div>
            `;
            item.addEventListener('click', () => loadVideo(video));
            playlist.appendChild(item);
        });
    }
    
    function loadVideo(video) {
        const playerFrame = document.getElementById('mainPlayer');
        if (playerFrame && video.url && video.url !== '#') {
            playerFrame.src = video.url;
        } else {
            // Show message if video not available
            const msg = document.createElement('div');
            msg.className = 'video-unavailable';
            msg.innerHTML = '<i class="fas fa-video-slash"></i><p>Em breve disponível</p>';
            const playerArea = document.querySelector('.featured-video');
            if (playerArea && !playerArea.querySelector('.video-unavailable')) {
                const existing = playerArea.querySelector('.video-unavailable');
                if (existing) existing.remove();
                playerArea.appendChild(msg);
                setTimeout(() => msg.remove(), 3000);
            }
        }
    }
})();

// ============================================
// NEWSLETTER SUBSCRIPTION (Footer)
// ============================================
(function initNewsletter() {
    const newsletterForm = document.querySelector('.newsletter-form');
    if (!newsletterForm) return;
    
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = newsletterForm.querySelector('input[type="email"]')?.value;
        if (email) {
            alert(`Obrigado por se inscrever! Você receberá novidades da INARD no email: ${email}`);
            newsletterForm.reset();
        }
    });
})();

// ============================================
// DYNAMIC VERSE OF THE DAY (Index Page)
// ============================================
(function initVerseOfDay() {
    const verseElement = document.getElementById('verseText');
    if (!verseElement) return;
    
    const verses = [
        { text: '"E ele mesmo concedeu uns para apóstolos, outros para profetas, outros para evangelistas, outros para pastores e mestres, com o fim de aperfeiçoar os santos para a obra do ministério."', ref: 'Efésios 4:11-12' },
        { text: '"Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito, para que todo aquele que nele crê não pereça, mas tenha a vida eterna."', ref: 'João 3:16' },
        { text: '"Posso todas as coisas naquele que me fortalece."', ref: 'Filipenses 4:13' },
        { text: '"Não temas, porque eu sou contigo; não te assombres, porque eu sou o teu Deus; eu te fortaleço, e te ajudo, e te sustento com a destra da minha justiça."', ref: 'Isaías 41:10' }
    ];
    
    const randomIndex = Math.floor(Math.random() * verses.length);
    const verse = verses[randomIndex];
    verseElement.textContent = verse.text;
    
    const refElement = document.querySelector('.verse-ref');
    if (refElement) {
        refElement.textContent = verse.ref;
    }
})();

// ============================================
// SCHEDULE TABLE (Sobre page)
// ============================================
(function initSchedule() {
    const scheduleContainer = document.querySelector('.schedule-table');
    if (!scheduleContainer) return;
    
    const scheduleData = [
        { day: 'Domingo', morning: '08:00 - Culto da Família', evening: '18:00 - Santa Ceia' },
        { day: 'Terça-feira', morning: '-', evening: '19:00 - Escola de Profetas' },
        { day: 'Quarta-feira', morning: '-', evening: '19:00 - Estudo Bíblico' },
        { day: 'Quinta-feira', morning: '-', evening: '19:00 - Células de Oração' },
        { day: 'Sexta-feira', morning: '-', evening: '19:00 - Culto de Libertação' },
        { day: 'Sábado', morning: '09:00 - Oração da Madrugada', evening: '17:00 - Ensaio do Coral' }
    ];
    
    let tableHtml = `
        <table class="schedule-table">
            <thead>
                <tr><th>Dia</th><th>Manhã</th><th>Noite</th></tr>
            </thead>
            <tbody>
    `;
    
    scheduleData.forEach(item => {
        tableHtml += `
            <tr>
                <td><strong>${item.day}</strong></td>
                <td>${item.morning}</td>
                <td>${item.evening}</td>
            </tr>
        `;
    });
    
    tableHtml += `</tbody></table>`;
    scheduleContainer.innerHTML = tableHtml;
})();

// ============================================
// LOADING SPINNER (for pages)
// ============================================
(function initPageLoader() {
    // Add loading class to body initially
    document.body.classList.add('page-loading');
    
    window.addEventListener('load', () => {
        setTimeout(() => {
            document.body.classList.remove('page-loading');
        }, 300);
    });
})();

// ============================================
// NOTÍCIAS - LOAD MORE (noticias.html)
// ============================================
(function initLoadMore() {
    const loadMoreBtn = document.querySelector('.load-more-btn');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', () => {
            loadMoreBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Carregando...';
            setTimeout(() => {
                loadMoreBtn.innerHTML = '<i class="fas fa-check"></i> Todas as notícias carregadas';
                loadMoreBtn.disabled = true;
            }, 1500);
        });
    }
})();

// ============================================
// CONGREGATIONS - FILTER (congregacoes.html)
// ============================================
(function initCongregationFilter() {
    const filterInput = document.getElementById('searchCongregation');
    if (filterInput) {
        filterInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const cards = document.querySelectorAll('.congregation-card');
            cards.forEach(card => {
                const text = card.textContent.toLowerCase();
                if (text.includes(searchTerm)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }
})();

// ============================================
// CONSOLE WELCOME MESSAGE
// ============================================
console.log('%c✨ INARD - Catedral das Nações ✨', 'color: #c9a03d; font-size: 20px; font-weight: bold;');
console.log('%cSite desenvolvido com tecnologia moderna para glória de Deus', 'color: #1e3b5c; font-size: 12px;');
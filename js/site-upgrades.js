(function initTheme() {
    const themeBtn = document.getElementById('themeSwitch');
    if (!themeBtn) return;

    const savedTheme = localStorage.getItem('inard_theme');
    document.body.setAttribute('data-theme', savedTheme === 'dark' ? 'dark' : 'light');
    updateThemeButton(savedTheme === 'dark');

    themeBtn.addEventListener('click', () => {
        const isDark = document.body.getAttribute('data-theme') === 'dark';
        const nextTheme = isDark ? 'light' : 'dark';
        document.body.setAttribute('data-theme', nextTheme);
        localStorage.setItem('inard_theme', nextTheme);
        updateThemeButton(nextTheme === 'dark');
    });

    function updateThemeButton(isDark) {
        const icon = themeBtn.querySelector('i');
        const label = themeBtn.querySelector('span');
        if (!icon || !label) return;
        icon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
        label.textContent = isDark ? 'Modo Claro' : 'Modo Escuro';
    }
})();

(function initMobileMenu() {
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('.main-nav');
    if (!menuBtn || !nav) return;

    menuBtn.addEventListener('click', () => {
        nav.classList.toggle('active');
        const icon = menuBtn.querySelector('i');
        if (!icon) return;
        icon.className = nav.classList.contains('active') ? 'fas fa-times' : 'fas fa-bars';
    });
})();

(function initHeroSlider() {
    const hero = document.querySelector('[data-hero-slider]');
    if (!hero) return;

    const slides = Array.from(hero.querySelectorAll('.hero-slide'));
    const dots = Array.from(hero.querySelectorAll('.hero-dot'));
    if (!slides.length) return;

    let currentIndex = 0;
    let intervalId = null;

    const activate = (index) => {
        slides.forEach((slide, slideIndex) => {
            slide.classList.toggle('active', slideIndex === index);
        });
        dots.forEach((dot, dotIndex) => {
            dot.classList.toggle('active', dotIndex === index);
        });
        currentIndex = index;
    };

    const next = () => activate((currentIndex + 1) % slides.length);

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            activate(index);
            restart();
        });
    });

    const restart = () => {
        if (intervalId) clearInterval(intervalId);
        intervalId = setInterval(next, 5200);
    };

    activate(0);
    restart();
})();

(function initHighlightTabs() {
    const tabGroups = document.querySelectorAll('[data-tab-group]');
    tabGroups.forEach((group) => {
        const buttons = Array.from(group.querySelectorAll('.tab-btn'));
        const panels = Array.from(group.querySelectorAll('.highlight-panel'));
        buttons.forEach((button) => {
            button.addEventListener('click', () => {
                const target = button.getAttribute('data-target');
                buttons.forEach((item) => item.classList.toggle('active', item === button));
                panels.forEach((panel) => panel.classList.toggle('active', panel.id === target));
            });
        });
    });
})();

(function initAutoCarousels() {
    const carousels = Array.from(document.querySelectorAll('[data-auto-carousel]'));
    carousels.forEach((carousel) => {
        const track = carousel.querySelector('.carousel-track');
        const slides = Array.from(carousel.querySelectorAll('.carousel-slide'));
        const dots = Array.from(carousel.querySelectorAll('.carousel-dot'));
        const prev = carousel.querySelector('[data-carousel-prev]');
        const next = carousel.querySelector('[data-carousel-next]');
        const multi = carousel.getAttribute('data-carousel-mode') === 'multi';
        if (!track || !slides.length) return;

        let index = 0;
        let timer = null;
        const sync = () => {
            const currentStep = multi ? (slides[0].getBoundingClientRect().width || 340) : carousel.querySelector('.carousel-viewport').getBoundingClientRect().width;
            const offset = index * currentStep;
            track.style.transform = `translateX(-${offset}px)`;
            dots.forEach((dot, dotIndex) => dot.classList.toggle('active', dotIndex === index));
        };

        const goTo = (nextIndex) => {
            const maxIndex = Math.max(0, slides.length - 1);
            index = nextIndex < 0 ? maxIndex : nextIndex > maxIndex ? 0 : nextIndex;
            sync();
        };

        const restart = () => {
            const delay = Number(carousel.getAttribute('data-interval') || 4200);
            if (timer) clearInterval(timer);
            timer = setInterval(() => goTo(index + 1), delay);
        };

        prev?.addEventListener('click', () => {
            goTo(index - 1);
            restart();
        });

        next?.addEventListener('click', () => {
            goTo(index + 1);
            restart();
        });

        dots.forEach((dot, dotIndex) => {
            dot.addEventListener('click', () => {
                goTo(dotIndex);
                restart();
            });
        });

        window.addEventListener('resize', sync);
        sync();
        restart();
    });
})();

(function initGalleryFiltersAndLightbox() {
    const gallery = document.querySelector('[data-gallery-grid]');
    if (!gallery) return;

    const buttons = Array.from(document.querySelectorAll('.gallery-filter-btn'));
    const cards = Array.from(gallery.querySelectorAll('.gallery-card-upgraded'));
    const lightbox = document.getElementById('siteLightbox');
    const lightboxImage = document.getElementById('siteLightboxImage');
    const lightboxCaption = document.getElementById('siteLightboxCaption');
    const lightboxClose = document.getElementById('siteLightboxClose');

    buttons.forEach((button) => {
        button.addEventListener('click', () => {
            const filter = button.getAttribute('data-filter');
            buttons.forEach((item) => item.classList.toggle('active', item === button));
            cards.forEach((card) => {
                const match = filter === 'all' || card.getAttribute('data-category') === filter;
                card.style.display = match ? 'block' : 'block';
                card.hidden = !match;
            });
        });
    });

    cards.forEach((card) => {
        card.addEventListener('click', () => {
            if (!lightbox || !lightboxImage || !lightboxCaption) return;
            const image = card.querySelector('img');
            const title = card.getAttribute('data-title') || image?.alt || 'Galeria INARD';
            if (!image) return;
            lightboxImage.src = image.src;
            lightboxImage.alt = title;
            lightboxCaption.textContent = title;
            lightbox.classList.add('open');
        });
    });

    if (lightboxClose) {
        lightboxClose.addEventListener('click', () => lightbox?.classList.remove('open'));
    }

    if (lightbox) {
        lightbox.addEventListener('click', (event) => {
            if (event.target === lightbox) {
                lightbox.classList.remove('open');
            }
        });
    }
})();

(function initCongregationSearch() {
    const input = document.querySelector('[data-congregation-search]');
    if (!input) return;

    const cards = Array.from(document.querySelectorAll('.congregation-card-upgraded'));
    input.addEventListener('input', (event) => {
        const value = event.target.value.trim().toLowerCase();
        cards.forEach((card) => {
            const content = card.textContent.toLowerCase();
            card.style.display = content.includes(value) ? 'block' : 'none';
        });
    });
})();

(function initTVPage() {
    const player = document.getElementById('tvMainPlayer');
    const playerCard = document.querySelector('.tv-player-card');
    const localVideo = document.getElementById('tvLocalVideo');
    const playlist = document.getElementById('tvPlaylist');
    const titleEl = document.getElementById('tvCurrentTitle');
    const metaEl = document.getElementById('tvCurrentMeta');
    const watchMoreLinks = Array.from(document.querySelectorAll('[data-channel-link]'));

    if (!player || !playlist) return;

    const channelUrl = 'https://www.youtube.com/@antoniocorreiatvboasnovas2803';
    const channelId = 'UCiwv7vM7ZkGpEejEOIH2iFw';
    const uploadsPlaylistId = `UU${channelId.slice(2)}`;
    const channelEmbeds = {
        uploads: `https://www.youtube.com/embed/videoseries?list=${uploadsPlaylistId}&autoplay=1&mute=1&rel=0`,
        videos: `${channelUrl}/videos`,
        streams: `${channelUrl}/streams`,
        subscribe: `${channelUrl}?sub_confirmation=1`,
        local: 'images/pregacao.mp4'
    };

    watchMoreLinks.forEach((link) => {
        const kind = link.getAttribute('data-channel-link');
        const href = channelEmbeds[kind] || channelUrl;
        link.href = href;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
    });

    const fallbackItems = [
        {
            title: 'Canal completo em reprodu\u00e7\u00e3o autom\u00e1tica',
            meta: 'Uploads oficiais a partir do ID confirmado do canal',
            embed: channelEmbeds.uploads,
            url: `${channelUrl}/videos`,
            thumb: 'https://placehold.co/320x180/1e3b5c/white?text=TV+Good+News'
        },
        {
            title: 'Ver mais v\u00eddeos no canal',
            meta: 'Abrir a aba de v\u00eddeos do canal',
            embed: channelEmbeds.uploads,
            url: `${channelUrl}/videos`,
            thumb: 'https://placehold.co/320x180/0f172a/white?text=Videos'
        },
        {
            title: 'Abrir transmiss\u00f5es e lives',
            meta: 'Ir diretamente para a aba de lives',
            embed: channelEmbeds.uploads,
            url: `${channelUrl}/streams`,
            thumb: 'https://placehold.co/320x180/142847/white?text=Lives'
        },
        {
            title: 'V\u00eddeo local da pasta images',
            meta: 'Fallback autom\u00e1tico com o arquivo pregacao.mp4',
            embed: 'local',
            url: channelEmbeds.local,
            thumb: 'https://placehold.co/320x180/302010/white?text=Video+Local'
        }
    ];

    const renderItems = (items) => {
        playlist.innerHTML = '';
        items.forEach((item, index) => {
            const button = document.createElement('button');
            button.type = 'button';
            button.className = `tv-playlist-item ${index === 0 ? 'active' : ''}`;
            button.innerHTML = `
                <div class="tv-thumb">
                    <img src="${item.thumb}" alt="${item.title}">
                    <i class="fas fa-play-circle"></i>
                </div>
                <div>
                    <h4>${item.title}</h4>
                    <p class="channel-note">${item.meta}</p>
                </div>
            `;

            button.addEventListener('click', () => {
                if (item.embed === 'local') {
                    playerCard?.classList.add('local-mode');
                    if (localVideo) {
                        localVideo.currentTime = 0;
                        localVideo.play().catch(() => {});
                    }
                } else {
                    playerCard?.classList.remove('local-mode');
                    player.src = item.embed;
                    localVideo?.pause();
                }
                if (titleEl) titleEl.textContent = item.title;
                if (metaEl) metaEl.textContent = item.meta;
                playlist.querySelectorAll('.tv-playlist-item').forEach((entry) => entry.classList.remove('active'));
                button.classList.add('active');
            });

            playlist.appendChild(button);
        });
    };

    const useFallback = () => {
        renderItems(fallbackItems);
        playerCard?.classList.remove('local-mode');
        player.src = fallbackItems[0].embed;
        if (titleEl) titleEl.textContent = fallbackItems[0].title;
        if (metaEl) {
            metaEl.textContent = 'Canal afinado com o ID oficial confirmado. Se o feed n\u00e3o responder, a p\u00e1gina usa a playlist de uploads e ainda oferece um v\u00eddeo local em fallback.';
        }
    };

    if (!navigator.onLine) {
        renderItems(fallbackItems);
        playerCard?.classList.add('local-mode');
        if (localVideo) {
            localVideo.currentTime = 0;
            localVideo.play().catch(() => {});
        }
        if (titleEl) titleEl.textContent = 'V\u00eddeo local da pasta images';
        if (metaEl) metaEl.textContent = 'Modo offline detectado. A TV Good News abriu automaticamente o arquivo pregacao.mp4.';
        return;
    }

    const extractVideoId = (url) => {
        try {
            const parsed = new URL(url);
            return parsed.searchParams.get('v');
        } catch (error) {
            return null;
        }
    };

    fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(`https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`)}`)
        .then((response) => response.json())
        .then((payload) => {
            if (!payload?.items?.length) throw new Error('feed indisponivel');

            const items = payload.items
                .map((item) => {
                    const videoId = extractVideoId(item.link);
                    if (!videoId) return null;
                    return {
                        title: item.title,
                        meta: item.pubDate ? `Publicado em ${new Date(item.pubDate).toLocaleDateString('pt-BR')}` : 'Canal TV Good News',
                        embed: `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&rel=0`,
                        url: item.link,
                        thumb: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`
                    };
                })
                .filter(Boolean)
                .slice(0, 8);

            if (!items.length) throw new Error('sem videos');

            renderItems(items);
            playerCard?.classList.remove('local-mode');
            player.src = items[0].embed;
            if (titleEl) titleEl.textContent = items[0].title;
            if (metaEl) metaEl.textContent = items[0].meta;
        })
        .catch(useFallback);
})();

(function initChatSignup() {
    const form = document.getElementById('chatAccessForm');
    if (!form) return;

    const status = document.getElementById('chatAccessStatus');
    const nextUrl = 'chat-sala.html';

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const submitBtn = form.querySelector('button[type="submit"]');
        const payload = {
            nome: form.nome.value.trim(),
            email: form.email.value.trim(),
            telefone: form.telefone.value.trim(),
            congregacao: form.congregacao.value,
            funcao: form.funcao.value,
            motivo: form.motivo.value.trim()
        };

        localStorage.setItem('inard_chat_profile', JSON.stringify(payload));

        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando pedido...';
        }

        const formData = new FormData();
        Object.entries(payload).forEach(([key, value]) => formData.append(key, value));
        formData.append('_subject', 'Novo pedido de acesso ao Chat INARD');

        try {
            const response = await fetch('https://formsubmit.co/ajax/miguelquisamela@gmail.com', {
                method: 'POST',
                headers: {
                    Accept: 'application/json'
                },
                body: formData
            });

            if (!response.ok) throw new Error('falha no envio');

            if (status) {
                status.className = 'form-status success show';
                status.textContent = 'Pedido enviado para o email do administrador. A abrir a sala da comunidade...';
            }

            setTimeout(() => {
                window.location.href = `${nextUrl}?status=sent`;
            }, 1200);
        } catch (error) {
            const queue = JSON.parse(localStorage.getItem('inard_pending_requests') || '[]');
            queue.push({ ...payload, createdAt: new Date().toISOString() });
            localStorage.setItem('inard_pending_requests', JSON.stringify(queue));

            if (status) {
                status.className = 'form-status error show';
                status.textContent = 'N\u00e3o foi poss\u00edvel confirmar o envio online agora. O pedido ficou guardado neste navegador e a sala local foi liberada.';
            }

            setTimeout(() => {
                window.location.href = `${nextUrl}?status=local`;
            }, 1500);
        } finally {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Pedir acesso e entrar';
            }
        }
    });
})();

(function initChatRoom() {
    const room = document.getElementById('communityRoom');
    if (!room) return;

    const form = document.getElementById('communityMessageForm');
    const messageInput = document.getElementById('communityMessage');
    const list = document.getElementById('communityMessages');
    const profileName = document.getElementById('communityProfileName');
    const profileMeta = document.getElementById('communityProfileMeta');
    const statusBanner = document.getElementById('roomStatusBanner');

    const profile = JSON.parse(localStorage.getItem('inard_chat_profile') || '{}');
    const storageKey = 'inard_chat_room_messages';
    const useGun = typeof GUN !== 'undefined';
    const gun = useGun
        ? GUN({
            peers: [
                'https://gunjs.herokuapp.com/gun',
                'https://gun-manhattan.herokuapp.com/gun',
                'https://gun.o8.is/gun'
            ]
        })
        : null;
    const roomRef = gun ? gun.get('inard-site').get('community-room') : null;
    const starterMessages = [
        {
            id: 'seed-1',
            author: 'Equipe INARD',
            meta: 'Administra\u00e7\u00e3o',
            text: 'Seja bem-vindo(a) \u00e0 sala da comunidade. Partilhe pedidos de ora\u00e7\u00e3o, testemunhos e avisos com respeito.',
            mine: false,
            createdAt: 'Agora'
        },
        {
            id: 'seed-2',
            author: 'Intercess\u00e3o Central',
            meta: 'Minist\u00e9rio',
            text: 'Hoje estaremos em ora\u00e7\u00e3o pelas fam\u00edlias e pelas obras mission\u00e1rias. Deixe o seu pedido.',
            mine: false,
            createdAt: 'Agora'
        }
    ];

    const readMessages = () => {
        const stored = JSON.parse(localStorage.getItem(storageKey) || 'null');
        if (stored && stored.length) return stored;
        localStorage.setItem(storageKey, JSON.stringify(starterMessages));
        return starterMessages;
    };

    const formatTime = (iso) => {
        try {
            return new Date(iso).toLocaleString('pt-BR', {
                hour: '2-digit',
                minute: '2-digit',
                day: '2-digit',
                month: '2-digit'
            });
        } catch (error) {
            return 'Agora';
        }
    };

    const render = () => {
        const messages = readMessages();
        list.innerHTML = '';

        if (!messages.length) {
            list.innerHTML = '<p class="empty-state">Sem mensagens ainda. Inicie a conversa da comunidade.</p>';
            return;
        }

        messages.forEach((message) => {
            const item = document.createElement('article');
            item.className = `message-item ${message.mine ? 'mine' : ''}`;
            item.innerHTML = `
                <div class="message-topline">
                    <span class="message-author">${message.author}</span>
                    <span class="message-meta">${message.meta} • ${message.createdAt}</span>
                </div>
                <p>${message.text}</p>
            `;
            list.appendChild(item);
        });

        list.scrollTop = list.scrollHeight;
    };

    const persistMessages = (messages) => {
        localStorage.setItem(storageKey, JSON.stringify(messages));
        render();
    };

    const displayName = profile.nome || 'Visitante INARD';
    const displayMeta = [profile.funcao, profile.congregacao].filter(Boolean).join(' • ') || 'Participante da comunidade';

    if (profileName) profileName.textContent = displayName;
    if (profileMeta) profileMeta.textContent = displayMeta;

    const params = new URLSearchParams(window.location.search);
    const roomStatus = params.get('status');
    if (statusBanner) {
        if (roomStatus === 'sent') {
            statusBanner.textContent = 'Pedido enviado para miguelquisamela@gmail.com. Enquanto aguarda a libera\u00e7\u00e3o oficial, esta sala local da comunidade j\u00e1 est\u00e1 activa neste navegador.';
        } else if (roomStatus === 'local') {
            statusBanner.textContent = 'Acesso local aberto neste navegador. Quando a liga\u00e7\u00e3o permitir, reenvie o formul\u00e1rio para o email do administrador.';
        } else if (useGun) {
            statusBanner.textContent = 'Chat online activado atrav\u00e9s de sincroniza\u00e7\u00e3o em tempo real. As mensagens podem circular entre utilizadores ligados \u00e0 internet.';
        }
    }

    render();

    if (roomRef) {
        roomRef.map().on((message, key) => {
            if (!message || !message.text || !key) return;
            const current = readMessages();
            if (current.some((item) => item.id === key)) return;
            current.push({
                id: key,
                author: message.author || 'Participante INARD',
                meta: message.meta || 'Comunidade',
                text: message.text,
                mine: message.author === displayName,
                createdAt: message.createdAtLabel || formatTime(message.createdAt || new Date().toISOString())
            });
            current.sort((a, b) => String(a.id).localeCompare(String(b.id)));
            persistMessages(current);
        });
    }

    form?.addEventListener('submit', (event) => {
        event.preventDefault();
        const text = messageInput?.value.trim();
        if (!text) return;

        const messages = readMessages();
        const payload = {
            id: `${Date.now()}`,
            author: displayName,
            meta: displayMeta,
            text,
            mine: true,
            createdAt: formatTime(new Date().toISOString())
        };

        messages.push(payload);
        persistMessages(messages);

        if (roomRef) {
            roomRef.get(payload.id).put({
                author: payload.author,
                meta: payload.meta,
                text: payload.text,
                createdAt: new Date().toISOString(),
                createdAtLabel: payload.createdAt
            });
        }

        messageInput.value = '';
    });
})();

(function initVerse() {
    const verseEl = document.getElementById('verseText');
    const refEl = document.querySelector('.verse-ref');
    if (!verseEl || !refEl) return;

    const verses = [
        { text: '"Posso todas as coisas naquele que me fortalece."', ref: 'Filipenses 4:13' },
        { text: '"N\u00e3o temas, porque eu sou contigo."', ref: 'Isa\u00edas 41:10' },
        { text: '"Aquele que habita no esconderijo do Alt\u00edssimo, \u00e0 sombra do Onipotente descansar\u00e1."', ref: 'Salmos 91:1' },
        { text: '"Ide por todo o mundo e pregai o evangelho a toda criatura."', ref: 'Marcos 16:15' }
    ];

    const verse = verses[Math.floor(Math.random() * verses.length)];
    verseEl.textContent = verse.text;
    refEl.textContent = verse.ref;
})();

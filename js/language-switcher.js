function initLanguageSwitcher() {
    const currentLang = getCurrentLanguage();
    const oppositeLang = currentLang === 'en' ? 'zh' : 'en';
    const oppositeUrl = getOppositeLanguageUrl(window.location.pathname);
    
    const languageSwitcher = document.createElement('li');
    languageSwitcher.className = 'nav-item';
    
    const switcherLink = document.createElement('a');
    switcherLink.className = 'nav-link';
    switcherLink.href = oppositeUrl;
    switcherLink.textContent = oppositeLang === 'zh' ? '中文' : 'English';
    switcherLink.addEventListener('click', function() {
        setLanguagePreference(oppositeLang);
    });
    
    languageSwitcher.appendChild(switcherLink);
    
    const menu = document.getElementById('dynamic-menu');
    if (menu) {
        menu.appendChild(languageSwitcher);
    }
}

function getCurrentLanguage() {
    const path = window.location.pathname;
    return path.startsWith('/zh/') || path === '/zh' ? 'zh' : 'en';
}

function getOppositeLanguageUrl(currentPath) {
    const currentLang = getCurrentLanguage();
    
    if (currentLang === 'en') {
        if (currentPath === '/' || currentPath === '/index.html') {
            return '/zh/index.html';
        }
        if (currentPath === '/course-review.html') {
            return '/zh/course-review.html';
        }
        if (currentPath === '/my-work.html') {
            return '/zh/my-work.html';
        }
        return '/zh/index.html';
    } else {
        if (currentPath === '/zh/' || currentPath === '/zh/index.html') {
            return '/index.html';
        }
        if (currentPath === '/zh/course-review.html') {
            return '/course-review.html';
        }
        if (currentPath === '/zh/my-work.html') {
            return '/my-work.html';
        }
        return '/index.html';
    }
}

function setLanguagePreference(language) {
    try {
        localStorage.setItem('preferredLanguage', language);
    } catch (e) {
        // Silently fail if localStorage unavailable
    }
}

function getStoredLanguagePreference() {
    try {
        return localStorage.getItem('preferredLanguage');
    } catch (e) {
        return null;
    }
}

function detectBrowserLanguage() {
    try {
        const browserLang = navigator.language || navigator.userLanguage;
        return browserLang && browserLang.toLowerCase().includes('zh') ? 'zh' : 'en';
    } catch (e) {
        return 'en';
    }
}

function generateMenu(jsonPath) {
    fetch(jsonPath || "menus.json")
        .then(response => response.json())
        .then(data => {
            const menuContainer = document.getElementById('dynamic-menu');
            data.menuItems.forEach(item => {
                const li = document.createElement('li');
                li.className = 'nav-item';

                if (item.type === 'dropdown') {
                    li.classList.add('dropdown');
                    const a = document.createElement('a');
                    a.className = 'nav-link dropdown-toggle';
                    a.href = '#';
                    a.id = 'navbarDropdown';
                    a.role = 'button';
                    a.setAttribute('data-bs-toggle', 'dropdown');
                    a.setAttribute('aria-expanded', 'false');
                    a.textContent = item.text;

                    const ul = document.createElement('ul');
                    ul.className = 'dropdown-menu';
                    ul.setAttribute('aria-labelledby', 'navbarDropdown');

                    item.items.forEach(subItem => {
                        const subLi = document.createElement('li');
                        const subA = document.createElement('a');
                        subA.className = 'dropdown-item';
                        subA.href = subItem.href;
                        subA.textContent = subItem.text;
                        subLi.appendChild(subA);
                        ul.appendChild(subLi);
                    });

                    li.appendChild(a);
                    li.appendChild(ul);
                } else if (item.type === 'link') {
                    const a = document.createElement('a');
                    a.className = 'nav-link';
                    a.href = item.href;
                    a.textContent = item.text;
                    li.appendChild(a);
                }

                menuContainer.appendChild(li);
            });
            
            // Initialize language switcher after menu is loaded
            initLanguageSwitcher();
        });
}
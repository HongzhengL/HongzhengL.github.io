// Generate menu from JSON data
function generateMenu() {
    fetch("menus.json")
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
        });
}

// Initialize menu
generateMenu();

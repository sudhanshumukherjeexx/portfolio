const modules = ['module1.md', 'module2.md', 'module3.md'];

document.addEventListener('DOMContentLoaded', function () {
    if (!window.marked || !window.MathJax) {
        console.error('Required libraries are not loaded or not functioning as expected');
        return;
    }
    loadHomePage();
    document.querySelectorAll('#nav a[data-module]').forEach((link) => {
        const moduleIndex = parseInt(link.getAttribute('data-module'));
        link.addEventListener('click', () => {
            loadModule(moduleIndex);
            currentModuleIndex = moduleIndex;
            updateActiveLink();
        });
    });
    document.querySelector('.home-link').addEventListener('click', loadHomePage);
});

function updateContent(text) {
    document.getElementById('content').innerHTML = marked.parse(text);
    MathJax.typesetPromise()  // Call this to re-process the entire content
        .then(() => {
            console.log('MathJax has re-typeset the page');
        })
        .catch((err) => console.error('MathJax typesetting failed:', err));
}

function loadHomePage() {
    const noCache = new Date().getTime(); // Cache-busting timestamp
    fetch(`home.md?v=${noCache}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(text => updateContent(text))
        .catch(err => {
            console.error("Error Fetching Home Markdown:", err);
            document.getElementById('content').innerHTML = '<p>Error loading the home content.</p>';
        });
    currentModuleIndex = -1;
    updateActiveLink();
}

function loadModule(index) {
    console.log(`Loading module from: ${modules[index]}`);
    const noCache = new Date().getTime();
    fetch(`${modules[index]}?v=${noCache}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(text => {
            console.log(`Module loaded, updating content...`);
            updateContent(text + generateNavigationButtons(index));
        })
        .catch(err => {
            console.error("Error Fetching Markdown:", err);
        });
}

function updateActiveLink() {
    const links = document.querySelectorAll('#nav a[data-module]');
    links.forEach(link => link.classList.remove('active-link'));
    if (currentModuleIndex >= 0) {
        links[currentModuleIndex].classList.add('active-link');
    }
}

function generateNavigationButtons(index) {
    let buttons = '<div class="module-navigation">';
    if (index > 0) {
        buttons += `<button class="button" onclick="loadModule(${index - 1})">Previous</button>`;
    }
    if (index < modules.length - 1) {
        buttons += `<button class="button" onclick="loadModule(${index + 1})">Next</button>`;
    }
    buttons += '</div>';
    return buttons;
}

function toggleTheme() {
    const body = document.body;
    const nav = document.getElementById('nav');
    body.classList.toggle('dark-mode');
    body.classList.toggle('light-mode');
    nav.classList.toggle('dark-mode');
    nav.classList.toggle('light-mode');
}

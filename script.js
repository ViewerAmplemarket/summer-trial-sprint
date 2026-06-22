// Template variable substitution
function highlightVariables() {
    const walker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT,
        null,
        false
    );

    const nodesToReplace = [];
    let node;
    while (node = walker.nextNode()) {
        if (node.parentElement.closest('.var-pill')) continue;
        if (/\{{[\w_]+\}}/.test(node.textContent)) {
            nodesToReplace.push(node);
        }
    }

    nodesToReplace.forEach(node => {
        const span = document.createElement('span');
        span.innerHTML = node.textContent.replace(
            /\{{([\w_]+)\}}/g,
            function(match, varName) {
                return '<span class="var-pill">{{' + varName + '}}</span>';
            }
        );
        node.parentNode.replaceChild(span, node);
    });
}

// Copy to clipboard
const clipboardIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>`;
const checkIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`;

document.addEventListener('click', function(e) {
    const btn = e.target.closest('.copy-button');
    if (!btn) return;
    const text = btn.getAttribute('data-copy');
    navigator.clipboard.writeText(text).then(() => {
        btn.innerHTML = checkIcon;
        btn.classList.add('copy-button--copied');
        clearTimeout(btn._copyTimer);
        btn._copyTimer = setTimeout(() => {
            btn.innerHTML = clipboardIcon;
            btn.classList.remove('copy-button--copied');
        }, 5000);
    }).catch(err => {
        console.error('Copy failed:', err);
    });
});

// Scroll spy for sidebar
const navLinks = document.querySelectorAll('.sidebar-nav a');
const subnavIds = [];
const allAnchorIds = ['part-1', 'part-2', 'part-3', 'part-4'];
const subnavContainers = document.querySelectorAll('.subnav');

const sectionMap = {
    'part-1': 'part-1',
    'part-2': 'part-2',
    'part-3': 'part-3',
    'part-4': 'part-4'
};

function updateActiveNav() {
    let currentId = allAnchorIds[0];
    allAnchorIds.forEach(id => {
        const el = document.getElementById(id);
        if (el && window.scrollY >= el.offsetTop - 200) {
            currentId = id;
        }
    });

    const currentSection = sectionMap[currentId];
    const inExpandableSection = false;

    subnavContainers.forEach(subnav => {
        subnav.classList.toggle('visible', inExpandableSection);
    });

    navLinks.forEach(link => {
        const href = link.getAttribute('href').substring(1);
        const isSubsection = link.classList.contains('subsection');

        if (isSubsection) {
            link.classList.toggle('active', href === currentId && inExpandableSection);
        } else {
            link.classList.toggle('active', href === currentSection);
        }
    });
}

// Smooth scroll and click handlers
navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        const targetSection = document.getElementById(targetId);
        if (targetSection) {
            targetSection.scrollIntoView({ behavior: 'smooth' });
            closeMobileMenu();
        }
    });
});

// Mobile menu
const mobileTocBtn = document.getElementById('mobileTocBtn');
const mobileOverlay = document.getElementById('mobileOverlay');
const mobileTocModal = document.getElementById('mobileTocModal');

function openMobileMenu() {
    mobileOverlay.classList.add('active');
    mobileTocModal.classList.add('active');
}

function closeMobileMenu() {
    mobileOverlay.classList.remove('active');
    mobileTocModal.classList.remove('active');
}

mobileTocBtn.addEventListener('click', openMobileMenu);
mobileOverlay.addEventListener('click', closeMobileMenu);

document.getElementById('mobileTocNav').addEventListener('click', function(e) {
    if (e.target.classList.contains('nav-link')) {
        closeMobileMenu();
    }
});

// Initialize
highlightVariables();
window.addEventListener('scroll', updateActiveNav);
updateActiveNav();

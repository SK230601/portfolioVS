const pageRoutes = {
    home: "/",
    about: "/about",
    projects: "/projects",
    contact: "/contact",
    skills: "/skills"
};

const filenameMap = {
    home: "welcome.txt",
    about: "about.py",
    projects: "projects.txt",
    contact: "contact.js",
    skills: "skills.css"
};

async function openTab(event, pageKey) {
    if (event) event.preventDefault();

    document.querySelectorAll('.sidebar ul li').forEach(li => {
        li.classList.toggle('active', li.dataset.key === pageKey);
    });

    const topbar = document.querySelector('.topbar');
    const mainContent = document.querySelector('.main-content');
    const filename = filenameMap[pageKey];
    const url = pageRoutes[pageKey];

    topbar.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));

    const existingTab = topbar.querySelector(`.tab[data-key="${pageKey}"]`);
    if (existingTab) {
        existingTab.classList.add('active');
    } else {
        const span = createTab(filename, pageKey);
        topbar.appendChild(span);
    }

    try {
        const response = await fetch(url);
        const html = await response.text();
        const tempDoc = new DOMParser().parseFromString(html, "text/html");
        const newContent = tempDoc.querySelector(".main-content");

        mainContent.innerHTML = newContent ? newContent.innerHTML : "<p>Error loading content.</p>";
        Prism.highlightAll();

        // Scroll the .main-content container to top after loading new content
        requestAnimationFrame(() => {
            const mainContent = document.querySelector('.main-content');
            if (mainContent) {
                mainContent.scrollTo({ top: 0, behavior: 'auto' });
            }
        });

        // ONLY attach event listeners based on pageKey
        if (pageKey === "contact") {
            const runBtn = document.getElementById("run-contact-btn");
            const card = document.getElementById("contact-card");

            if (runBtn && card) {
                card.classList.remove("show");
                card.style.display = "none";
                runBtn.addEventListener("click", () => {
                    card.classList.add("show");
                    card.style.display = "block";
                    card.scrollIntoView({ behavior: "smooth", block: "start" });
                });
            }
        }

    } catch (err) {
        mainContent.innerHTML = "<p>Failed to load content.</p>";
    }

    history.pushState({}, "", url);
}


document.addEventListener('DOMContentLoaded', () => {
    openTab(null, 'home');
});


window.addEventListener('popstate', () => {
    location.reload();
});

function createTab(filename, key) {
    const tab = document.createElement('span');
    tab.className = 'tab active';
    tab.setAttribute('data-key', key);
    tab.textContent = filename;

    const closeBtn = document.createElement('img');
    closeBtn.src = "/static/icons/cross.png";
    closeBtn.alt = "Close";
    closeBtn.className = 'close-tab-img';
    closeBtn.title = "Close tab";

    closeBtn.onclick = (e) => {
        e.stopPropagation();

        const wasActive = tab.classList.contains('active');
        const parent = tab.parentNode;
        const tabs = Array.from(parent.querySelectorAll('.tab'));
        const tabIndex = tabs.indexOf(tab);
        const key = tab.dataset.key;

        tab.remove();

        if (wasActive) {
            let nextTab = tabs[tabIndex - 1] || tabs[tabIndex + 1];
            if (nextTab) {
                nextTab.classList.add('active');
                const newKey = nextTab.dataset.key;
                openTab(null, newKey);
            } else {
                document.querySelector('.main-content').innerHTML = "<p>Select a file from the sidebar.</p>";
                document.querySelectorAll('.sidebar ul li').forEach(li => li.classList.remove('active'));
            }
        }
    };


    tab.appendChild(closeBtn);

    tab.onclick = () => {
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        document.querySelectorAll('.sidebar ul li').forEach(li => {
            li.classList.toggle('active', li.dataset.key === key);
        });

        openTab(null, key);
    };

    return tab;
}

document.querySelectorAll('.topbar').forEach(topbar => {
    topbar.addEventListener('click', e => {
        if (e.target.classList.contains('tab')) {
            topbar.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
            e.target.classList.add('active');
        }
    });
});

function showDevCard() {
    const card = document.getElementById('dev-card');
    if (card) {
        card.classList.add('show');
        card.scrollIntoView({ behavior: "smooth", block: "start" });
    }
}

function showContactCard() {
    const card1 = document.getElementById('contact-card');
    if (card1) {
        card1.classList.add('show');
        card1.scrollIntoView({ behavior: "smooth", block: "start" });
    }
}

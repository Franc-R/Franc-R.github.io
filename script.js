document.addEventListener('DOMContentLoaded', () => {

    const navLinks = document.querySelectorAll('.nav-links a');
    const sections = document.querySelectorAll('.section');
    const navLinksContainer = document.querySelector('.nav-links');
    const ctaButtons = document.querySelectorAll('.cta-buttons a');
    const projectsGrid = document.querySelector('.projects-grid');

    const isMobile = window.innerWidth <= 768;
    const homeContainer = document.querySelector('#home .container');

    async function loadSectionData(sectionPath) {
        try {
            const response = await fetch(`${sectionPath}/metadata/config.json`);
            return await response.json();
        } catch (error) {
            console.error('Error loading section data:', error);
            return null;
        }
    }

    async function loadHomeContent() {
        const homeData = await loadSectionData('assets/home');
        if (homeData) {

            homeContainer.innerHTML = '';

            if (isMobile) {
                homeContainer.innerHTML = `
                    <div style="display: flex; flex-direction: column; gap: 2rem;">
                        <div style="text-align: center; padding: 1rem;">
                            <h1 class="fade-in" id="home-videosubtitle"></h1>
                        </div>
                        <div id="home-media" style="width: 100%;"></div>
                        <div style="text-align: center; padding: 1rem;">
                            <h2 class="title fade-in" id="home-title"></h2>
                            <p class="subtitle fade-in" id="home-subtitle"></p>
                            <div class="cta-buttons fade-in" id="home-cta"></div>
                        </div>
                    </div>
                `;
            } else {
                homeContainer.innerHTML = `
                    <div style="display: flex; gap: 10rem; margin-top: -8%;">
                        <div style="flex: 1;" id="home-media"></div>
                        <div style="flex: 1.5; padding-top: 8%;">
                            <br/><br/>
                            <h1 class="fade-in" id="home-videosubtitle"></h1>
                            <br/>
                            <h2 class="title fade-in" id="home-title"></h2>
                            <p class="subtitle fade-in" id="home-subtitle"></p>
                            <div class="cta-buttons fade-in" id="home-cta"></div>
                        </div>
                    </div>
                `;
            }

            const homeMedia = document.getElementById('home-media');
            if (homeData.media && homeData.media.type === 'video') {
                homeMedia.innerHTML = `<div class="home-media"><video src="${homeData.media.path}" autoplay muted loop playsinline></video></div>`;
            } else if (homeData.media && homeData.media.type === 'image') {
                homeMedia.innerHTML = `<div class="home-media"><img src="${homeData.media.path}" alt="Home media"></div>`;
            }

            document.getElementById('home-videosubtitle').textContent = homeData.videosubtitle;
            document.getElementById('home-title').textContent = homeData.title;
            document.getElementById('home-subtitle').textContent = homeData.subtitle;

            const ctaContainer = document.getElementById('home-cta');
            if (homeData.cta.primary.show) {
                ctaContainer.innerHTML += `<a href="${homeData.cta.primary.link}" class="btn primary">${homeData.cta.primary.text}</a>`;
            }
            if (homeData.cta.secondary.show) {
                ctaContainer.innerHTML += `<a href="${homeData.cta.secondary.link}" class="btn secondary">${homeData.cta.secondary.text}</a>`;
            }
        }
    }

    async function loadAboutContent() {
        const aboutData = await loadSectionData('assets/about-me');
        if (aboutData) {
            const aboutSection = document.querySelector('#about .container');
            aboutSection.innerHTML = `
                <h2>${aboutData.title}</h2>
                <div class="about-content">
                    <div class="about-text">
                        <p>${aboutData.description}</p>
                        <div class="skills">
                            ${aboutData.skills.categories.map(category => `
                                <div class="skill-category">
                                    <h3>${category.name}</h3>
                                    <div class="skill-tags">
                                        ${category.items.map(skill => `<span>${skill}</span>`).join('')}
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                        <div class="cv-download">
                            <a href="assets/about-me/media/cv-2025.pdf" class="btn primary" download>
                                <i class="fas fa-download"></i> Download CV
                            </a>
                        </div>
                    </div>
                </div>
            `;
        }
    }

    async function loadProjectData(projectPath) {
        try {
            const response = await fetch(`${projectPath}/metadata/config.json`);
            return await response.json();
        } catch (error) {
            console.error('Error loading project data:', error);
            return null;
        }
    }

    function createProjectCard(projectData) {
        const card = document.createElement('div');
        card.className = 'project-card';
        card.style.borderColor = projectData.color;

        card.innerHTML = `
            <div class="project-media">
                <img src="${projectData.media.path}" alt="${projectData.title}">
            </div>
            <h3>${projectData.title}</h3>
            <p>${projectData.description}</p>
            <div class="project-tags">
                ${projectData.tags.map(tag => `<span>${tag}</span>`).join('')}
            </div>
            <div class="project-details">
                <h4>Challenge</h4>
                <p>${projectData.details.challenge}</p>
                <h4>Solution</h4>
                <p>${projectData.details.solution}</p>
                <h4>Technologies</h4>
                <div class="tech-tags">
                    ${projectData.details.technologies.map(tech => `<span>${tech}</span>`).join('')}
                </div>
                <h4>Outcomes</h4>
                <ul>
                    ${projectData.details.outcomes.map(outcome => `<li>${outcome}</li>`).join('')}
                </ul>
            </div>
        `;

        return card;
    }

    async function loadProjects() {
        const projectFolders = ['drone-bci', 'trust-control'];
        
        for (const folder of projectFolders) {
            const projectData = await loadProjectData(`assets/projects/${folder}`);
            if (projectData) {
                const card = createProjectCard(projectData);
                projectsGrid.appendChild(card);
            }
        }
    }

    function showSection(sectionId) {
        document.querySelector(sectionId).scrollIntoView({ behavior: 'smooth' });
    }

    function updateActiveNavLink(sectionId) {
        navLinks.forEach(link => link.classList.remove('active'));
        const activeLink = document.querySelector(`.nav-links a[href="${sectionId}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
    }

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionId = link.getAttribute('href');
            showSection(sectionId);
            updateActiveNavLink(sectionId);
        });
    });


    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            const newIsMobile = window.innerWidth <= 768;
            if (newIsMobile !== isMobile) {
                loadHomeContent();
            }
        }, 250);
    });

    loadHomeContent();
    loadAboutContent();
    loadProjects();


    const observerOptions = {
        threshold: 0.2,
        rootMargin: '-50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const section = entry.target;
            const sectionId = '#' + section.id;
            
            if (entry.isIntersecting) {
                section.classList.add('visible');
                updateActiveNavLink(sectionId);
            } else if (section.id !== 'home') {
                section.classList.remove('visible');
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
    });

    document.querySelector('#home').classList.add('visible');

    document.querySelectorAll('.project-card, .skill-tags span').forEach(element => {
        element.classList.add('animate-on-scroll');
    });

    const style = document.createElement('style');
    style.textContent = `
        .fade-in {
            opacity: 0;
            animation: fadeIn 1s ease-in forwards;
        }
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
    `;
    document.head.appendChild(style);
}); 
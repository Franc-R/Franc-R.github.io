document.addEventListener('DOMContentLoaded', () => {

    const navLinks = document.querySelectorAll('.nav-links a');
    const sections = document.querySelectorAll('.section');
    const navLinksContainer = document.querySelector('.nav-links');
    const ctaButtons = document.querySelectorAll('.cta-buttons a');
    const projectsGrid = document.querySelector('.projects-grid');

    const isMobile = window.innerWidth <= 768;
    const homeContainer = document.querySelector('#home .container');

    document.addEventListener('dblclick', (e) => {
        e.preventDefault();
    });

    const navbar = document.querySelector('.navbar');
    const mobileMenuBtn = document.createElement('button');
    mobileMenuBtn.className = 'mobile-menu-btn';
    mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
    navbar.appendChild(mobileMenuBtn);

    mobileMenuBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        navLinksContainer.classList.toggle('active');
        mobileMenuBtn.classList.toggle('active');
    });

    document.addEventListener('click', (e) => {
        if (!navbar.contains(e.target)) {
            navLinksContainer.classList.remove('active');
            mobileMenuBtn.classList.remove('active');
        }
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navLinksContainer.classList.remove('active');
            mobileMenuBtn.classList.remove('active');
        });
    });

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
                    <div class="home-content-mobile">
                        <div class="home-text-mobile">
                            <h1 class="home-videosubtitle fade-in" id="home-videosubtitle"></h1>
                        </div>
                        <div class="home-media-container" id="home-media"></div>
                        <div class="home-text-mobile">
                            <h2 class="home-title title fade-in" id="home-title"></h2>
                            <p class="home-subtitle subtitle fade-in" id="home-subtitle"></p>
                            <div class="home-cta cta-buttons fade-in" id="home-cta"></div>
                        </div>
                    </div>
                `;
            } else {
                homeContainer.innerHTML = `
                    <div class="home-content-desktop">
                        <div class="home-media-container" id="home-media"></div>
                        <div class="home-text-desktop">
                            <h1 class="home-videosubtitle fade-in" id="home-videosubtitle"></h1>
                            <h2 class="home-title title fade-in" id="home-title"></h2>
                            <p class="home-subtitle subtitle fade-in" id="home-subtitle"></p>
                            <div class="home-cta cta-buttons fade-in" id="home-cta"></div>
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
                            <a href="assets/about-me/media/francesco-russo_cv_2025.pdf" class="btn primary" download>
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
            
            <div class="project-details">
                <h4>Challenge</h4>
                <p>${projectData.details.challenge}</p>
                <h4>Solution</h4>
                <p>${projectData.details.solution}</p>
                <h4>Technologies</h4>
                <div class="tech-tags">
                    ${projectData.details.technologies.map(tech => `<span>${tech}</span>`).join('')}
                </div>
            
            </div>
        `;

        if (projectData.details.videoUrl) {
        const videoBtn = document.createElement('button');
        videoBtn.textContent = "▶ Watch Video";
        videoBtn.style.padding = '10px 20px';
        videoBtn.style.backgroundColor = '#770000';
        videoBtn.style.color = 'white';
        videoBtn.style.border = 'none';
        videoBtn.style.borderRadius = '5px';
        videoBtn.style.boxShadow = '0 4px 6px rgba(0, 123, 255, 0.4)';
        videoBtn.style.cursor = 'pointer';
        videoBtn.style.fontWeight = 'bold';
        videoBtn.style.fontSize = '16px';
        videoBtn.style.transition = 'background-color 0.3s ease, box-shadow 0.3s ease';

        videoBtn.onmouseover = () => {
        videoBtn.style.backgroundColor = '#440000';
        videoBtn.style.boxShadow = '0 6px 10px rgba(68, 0, 0, 0.8)';
        };
        videoBtn.onmouseout = () => {
        videoBtn.style.backgroundColor = '#770000';
        videoBtn.style.boxShadow = '0 4px 6px rgba(119, 0, 0, 0.6)';
        };

        const btnWrapper = document.createElement('div');
        btnWrapper.style.display = 'flex';
        btnWrapper.style.justifyContent = 'center';
        btnWrapper.style.marginTop = '30px';

        videoBtn.onclick = () => openVideoModal(projectData.details.videoUrl);

        btnWrapper.appendChild(videoBtn);
        card.querySelector('.project-details').appendChild(btnWrapper);
        }

        return card;
    }

    async function loadProjects() {
        const projectFolders = ['Bachelor_Thesis', 'DC-Motor Velocity Control Problem', 'MIMO_Analisys', 'Dynamic_Mode_Decomposition_for_EEG', 'TWSBR', 'drone-bci', 'drone_validation'];
        
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
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === sectionId) {
                link.classList.add('active');
            }
        });
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
        threshold: [0.1, 0.2, 0.3, 0.4, 0.5],
        rootMargin: isMobile ? '-200px 0px' : '-50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const section = entry.target;
            const sectionId = '#' + section.id;
            
            if (entry.isIntersecting) {
                section.classList.add('visible');
                if (entry.intersectionRatio > 0.5) {
                    updateActiveNavLink(sectionId);
                }
            } else if (section.id !== 'home') {
                if (entry.intersectionRatio < 0.1) {
                    section.classList.remove('visible');
                }
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

    document.querySelector(".close-button").addEventListener("click", closeVideoModal);

    window.addEventListener("click", (e) => {
        const modal = document.getElementById("videoModal");
        if (e.target === modal) closeVideoModal();
    });

    window.addEventListener("keydown", (e) => {
        if (e.key === "Escape") closeVideoModal();
    });
}); 

function openVideoModal(videoUrl) {
    const modal = document.getElementById("videoModal");
    const iframe = document.getElementById("modal-video");
    iframe.src = videoUrl + "?autoplay=1";
    modal.style.display = "block";
    modal.offsetHeight;
    modal.classList.add("active");
}

function closeVideoModal() {
    const modal = document.getElementById("videoModal");
    const iframe = document.getElementById("modal-video");
    
    modal.classList.remove("active");
    setTimeout(() => {
        modal.style.display = "none";
        iframe.src = "";
    }, 300);
}


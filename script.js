document.addEventListener('DOMContentLoaded', () => {

    const navLinks = document.querySelectorAll('.nav-links a');
    const sections = document.querySelectorAll('.section');
    const navLinksContainer = document.querySelector('.nav-links');
    const ctaButtons = document.querySelectorAll('.cta-buttons a');
    const projectsGrid = document.querySelector('.projects-grid');

    function showSection(sectionId) {
        sections.forEach(section => {
            section.classList.remove('active');
        });
        document.querySelector(sectionId).classList.add('active');


        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === sectionId) {
                link.classList.add('active');
            }
        });
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
            const projectData = await loadProjectData(`projects/${folder}`);
            if (projectData) {
                const card = createProjectCard(projectData);
                projectsGrid.appendChild(card);
            }
        }
    }

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionId = link.getAttribute('href');
            showSection(sectionId);
            

            if (navLinksContainer.classList.contains('active')) {
                navLinksContainer.classList.remove('active');
            }
        });
    });


    ctaButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionId = button.getAttribute('href');
            showSection(sectionId);
        });
    });


    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });


    showSection('#home');

    loadProjects();


    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, observerOptions);


    sections.forEach(section => {
        observer.observe(section);
    });


    document.querySelectorAll('.project-card, .skill-tags span').forEach(element => {
        element.classList.add('animate-on-scroll');
    });
}); 
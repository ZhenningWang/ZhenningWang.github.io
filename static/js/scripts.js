const content_dir = 'contents/';
const config_file = 'config.yml';
const section_names = ['about', 'publications', 'research', 'conferences', 'awards'];

window.addEventListener('DOMContentLoaded', event => {

    // Activate Bootstrap scrollspy on the main nav element
    const mainNav = document.body.querySelector('#mainNav');
    if (mainNav) {
        new bootstrap.ScrollSpy(document.body, {
            target: '#mainNav',
            offset: 74,
        });
    }

    // Collapse responsive navbar when toggler is visible
    const navbarToggler = document.body.querySelector('.navbar-toggler');
    const responsiveNavItems = [].slice.call(
        document.querySelectorAll('#navbarResponsive .nav-link')
    );

    responsiveNavItems.map(function (responsiveNavItem) {
        responsiveNavItem.addEventListener('click', () => {
            if (navbarToggler && window.getComputedStyle(navbarToggler).display !== 'none') {
                navbarToggler.click();
            }
        });
    });

    // Load YAML config
    fetch(content_dir + config_file)
        .then(response => response.text())
        .then(text => {
            const yml = jsyaml.load(text);
            Object.keys(yml).forEach(key => {
                const el = document.getElementById(key);
                if (el) {
                    el.innerHTML = yml[key];
                } else {
                    console.log("Unknown id and value: " + key + "," + yml[key]);
                }
            });
        })
        .catch(error => console.log(error));

    // Load markdown sections
    marked.use({ mangle: false, headerIds: false });

    section_names.forEach(name => {
        fetch(content_dir + name + '.md')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to load ${content_dir + name + '.md'}`);
                }
                return response.text();
            })
            .then(markdown => {
                const html = marked.parse(markdown);
                const container = document.getElementById(name + '-md');
                if (container) {
                    container.innerHTML = html;
                } else {
                    console.log(`Missing container: ${name}-md`);
                }
            })
            .then(() => {
                if (window.MathJax) {
                    MathJax.typeset();
                }
            })
            .catch(error => console.log(error));
    });

});
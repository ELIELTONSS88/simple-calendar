document.addEventListener('DOMContentLoaded', () => {
    // Detect user's language and region
    function getDefaultLanguage() {
        // Try to get country from browser's language
        const browserLang = navigator.language || navigator.userLanguage;
        const country = browserLang.split('-')[1]?.toUpperCase();
        
        // If it's Brazil, use Portuguese, otherwise use English
        return country === 'BR' ? 'pt' : 'en';
    }

    // Initialize calendar with detected language
    const calendarElement = document.getElementById('calendar');
    const defaultLang = getDefaultLanguage();
    window.calendar = new Calendar(calendarElement, defaultLang);
    
    // Update language toggle button text
    document.querySelector('.lang-text').textContent = defaultLang === 'pt' ? 'EN' : 'PT';

    // DateTime update
    function updateDateTime() {
        const now = new Date();
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        };
        const dateTimeString = now.toLocaleDateString(
            calendar.language === 'pt' ? 'pt-BR' : 'en-US',
            options
        );
        document.getElementById('datetime').textContent = dateTimeString;
    }

    setInterval(updateDateTime, 1000);
    updateDateTime();

    // Theme handling
    const themeButton = document.getElementById('themeButton');
    const themeMenu = document.querySelector('.theme-menu');
    const themeOptions = document.querySelectorAll('.theme-option');
    const body = document.body;

    // Get saved theme from localStorage or default to 'light'
    const savedTheme = localStorage.getItem('calendar-theme') || 'light';
    setTheme(savedTheme);

    // Toggle theme menu on button click
    themeButton.addEventListener('click', (e) => {
        e.stopPropagation();
        themeMenu.classList.toggle('show');
        // Garante que o menu fique visível mesmo com o calendário expandido
        themeMenu.style.zIndex = '99999';
    });

    // Close theme menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!themeMenu.contains(e.target) && !themeButton.contains(e.target)) {
            themeMenu.classList.remove('show');
        }
    });

    themeOptions.forEach(option => {
        option.addEventListener('click', (e) => {
            e.stopPropagation();
            const theme = option.dataset.theme;
            setTheme(theme);
            themeMenu.classList.remove('show');
        });
    });

    function setTheme(theme) {
        // Remove all theme classes
        body.classList.remove('dark-theme', 'purple-theme', 'green-theme', 'pink-theme', 'ocean-theme');
        
        // Add the selected theme class if it's not light theme
        if (theme !== 'light') {
            body.classList.add(`${theme}-theme`);
        }

        // Save theme preference
        localStorage.setItem('calendar-theme', theme);
    }

    // Language toggle
    const languageToggle = document.getElementById('languageToggle');
    languageToggle.addEventListener('click', () => {
        const currentLang = calendar.language;
        const newLang = currentLang === 'pt' ? 'en' : 'pt';
        calendar.setLanguage(newLang);
        languageToggle.querySelector('.lang-text').textContent = 
            newLang === 'pt' ? 'EN' : 'PT';
        updateDateTime();
    });

    // View toggle
    const viewToggle = document.getElementById('viewToggle');
    viewToggle.addEventListener('click', () => {
        calendar.toggleView();
        const calendarElement = document.getElementById('calendar');
        calendarElement.classList.toggle('year-view');
        const icon = viewToggle.querySelector('i');
        icon.classList.toggle('fa-expand');
        icon.classList.toggle('fa-compress');
    });

    // Check for new year
    function checkNewYear() {
        const now = new Date();
        if (now.getFullYear() !== calendar.currentDate.getFullYear()) {
            calendar.currentDate = now;
            calendar.render();
        }
    }

    // Check for new year every minute
    setInterval(checkNewYear, 60000);
});

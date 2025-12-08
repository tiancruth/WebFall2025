//toggle hamburger func
function toggleMenu()
{
    const navLinks = document.getElementById('navLinks');
    navLinks.classList.toggle('active');
}

//theme toggle
function toggleTheme() 
{
    const body = document.body;
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    //update button icon when swtiched
    updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) 
{
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) 
    {
        themeToggle.textContent = theme === 'light' ? 'Change Theme' : 'Change Theme';
    }
}

//load the saved option when reloading
function loadTheme() 
{
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.body.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
}

//initalize theme when page loads
document.addEventListener('DOMContentLoaded', loadTheme);
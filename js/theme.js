// Theme management - Lina Maouche Portfolio

(function() {
  // Run this immediately to prevent theme flashing on load
  const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
})();

document.addEventListener('DOMContentLoaded', () => {
  const themeToggleBtn = document.getElementById('theme-toggle');
  if (!themeToggleBtn) return;
  
  const themeIcon = themeToggleBtn.querySelector('i');
  
  // Initialize button icons
  updateButton(getCurrentTheme());
  
  themeToggleBtn.addEventListener('click', () => {
    const nextTheme = getCurrentTheme() === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
  });
  
  function getCurrentTheme() {
    return document.documentElement.getAttribute('data-theme') || 'dark';
  }
  
  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('portfolio-theme', theme);
    updateButton(theme);
    
    // Dispatch an event so other components know the theme changed (e.g. background canvas if any)
    window.dispatchEvent(new CustomEvent('themechanged', { detail: { theme } }));
  }
  
  function updateButton(theme) {
    if (!themeIcon) return;
    if (theme === 'light') {
      themeIcon.className = 'fa-solid fa-moon';
      themeToggleBtn.setAttribute('title', 'Switch to Dark Mode');
      themeToggleBtn.setAttribute('aria-label', 'Switch to Dark Mode');
    } else {
      themeIcon.className = 'fa-solid fa-sun';
      themeToggleBtn.setAttribute('title', 'Switch to Light Mode');
      themeToggleBtn.setAttribute('aria-label', 'Switch to Light Mode');
    }
  }
});

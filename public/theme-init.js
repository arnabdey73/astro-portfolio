// Theme initialization script - put in public folder to load early
(function() {
  const storedTheme = localStorage.getItem('theme');
  const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  const theme = storedTheme || (prefersDarkMode ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', theme);
})();

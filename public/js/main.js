document.addEventListener('DOMContentLoaded', () => {
    const searchBtn = document.querySelector('button[type="submit"]');
    searchBtn.addEventListener('mouseover', () => {
        searchBtn.style.transform = 'scale(1.05)';
    });
    searchBtn.addEventListener('mouseout', () => {
        searchBtn.style.transform = 'scale(1)';
    });
});

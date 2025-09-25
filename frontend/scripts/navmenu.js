const eventsBtn = document.getElementById('eventsBtn');
const statisticsBtn = document.getElementById('statisticsBtn');
const bookmarksBtn = document.getElementById('bookmarksBtn');

eventsBtn.addEventListener('click', () => {
    window.location.href = 'frontend/events.html';    
});

statisticsBtn.addEventListener('click', () => {
    window.location.href = 'frontend/statistics.html';    
});

bookmarksBtn.addEventListener('click', () => {
    window.location.href = 'frontent/bookmarks.html';    
});
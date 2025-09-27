function attachNavListeners() {
    const eventsBtn = document.getElementById('eventsBtn');
    const statisticsBtn = document.getElementById('statisticsBtn');
    const bookmarksBtn = document.getElementById('bookmarksBtn');

    if (!eventsBtn || !statisticsBtn || !bookmarksBtn) {
        // Buttons not yet loaded, try again shortly
        setTimeout(attachNavListeners, 100);
        return;
    }

    eventsBtn.addEventListener("click", () => {
        window.location.href = "./events.html";    
    });


    statisticsBtn.addEventListener("click", () => {
        window.location.href = "./statistics.html";    
    });

    bookmarksBtn.addEventListener("click", () => {
        window.location.href = "./bookmarks.html";    
    });

}



attachNavListeners(); //Ensures that the buttons load properly
const eventDropdown = document.getElementById("eventDropdown"); 
const cardsDiv = document.getElementById("cardsDiv");

const events = [
    { name: "Event 1", sport: "soccer", date: "2023-10-01", time: "10:00 AM" , location: "Stadium A", description: "lorem ipsum" },
    { name: "Event 2", sport: "basketball", date: "2023-10-05", time: "2:00 PM" , location: "Arena B", description: "lorem ipsum" },
    { name: "Event 3", sport: "tennis", date: "2023-10-10", time: "11:00 AM" , location: "Court C", description: "lorem ipsum" },
    { name: "Event 4", sport: "baseball", date: "2023-10-15", time: "4:00 PM" , location: "Stadium D", description: "lorem ipsum" },
    { name: "Event 5", sport: "football", date: "2023-10-20", time: "1:00 PM" , location: "Arena E", description: "lorem ipsum" },
];

let filteredEvents;

function renderCards(events) {
    let content = "";
    for (let i = 0; i < events.length; i++) {
        content += `
            <div class="game-card">
                <h3>${events[i].name}</h3>
                <p>Sport: ${events[i].sport}</p>
                <p>Date: ${events[i].date}</p>
                <p>Time: ${events[i].time}</p>
                <p>Location: ${events[i].location}</p>
                <div class="details"> ${events[i].description}</div>
            </div>
        `;
    }
    cardsDiv.innerHTML = content;

    const cards = document.querySelectorAll('.game-card');
    cards.forEach(card => {
        card.addEventListener('click', () => {
            card.classList.toggle('expanded');
        });
    });
}

function defaultView() {
    renderCards(events);
}

defaultView();

function filter(string) {
    if (string === "all") {
        filteredEvents = events;
    } else {
        filteredEvents = events.filter(event => event.sport === string);
        renderCards(filteredEvents);
    }
}

eventDropdown.addEventListener("change", function() {
    filter(eventDropdown.value);
});

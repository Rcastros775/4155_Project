const eventDropdown = document.getElementById("eventDropdown"); 
const cardsDiv = document.getElementById("cardsDiv");

const events = [
    { name: "Event 1", sport: "soccer", date: "2023-10-01", time: "10:00 AM" , location: "Stadium A" },
    { name: "Event 2", sport: "basketball", date: "2023-10-05", time: "2:00 PM" , location: "Arena B" },
    { name: "Event 3", sport: "tennis", date: "2023-10-10", time: "11:00 AM" , location: "Court C" },
    { name: "Event 4", sport: "baseball", date: "2023-10-15", time: "4:00 PM" , location: "Stadium D" },
    { name: "Event 5", sport: "football", date: "2023-10-20", time: "1:00 PM" , location: "Arena E" }
];

let filteredEvents;

function defaultView() {
    let content = "";
    for (let i = 0; i < events.length; i++) {
        content += `
            <div class="game-card">
                <h3>${events[i].name}</h3>
                <p>Sport: ${events[i].sport}</p>
                <p>Date: ${events[i].date}</p>
                <p>Time: ${events[i].time}</p>
                <p>Location: ${events[i].location}</p>
            </div>
        `;
    }
    cardsDiv.innerHTML = content;
}

defaultView();

function filter(string) {
    filteredEvents = events.filter(event => event.sport === string);
}

eventDropdown.addEventListener("change", function() {
    let selectedSport = eventDropdown.value;
    if (selectedSport === "all") {
        defaultView();
    } else {
        filter(selectedSport);
        let content = "";
        for (let i = 0; i < filteredEvents.length; i++) {
            content += `
            <div class="game-card">
                <h3>${filteredEvents[i].name}</h3>
                <p>Sport: ${filteredEvents[i].sport}</p>
                <p>Date: ${filteredEvents[i].date}</p>
                <p>Time: ${filteredEvents[i].time}</p>
                <p>Location: ${filteredEvents[i].location}</p>
            </div>
        `;
        }
        cardsDiv.innerHTML = content;
    }
});

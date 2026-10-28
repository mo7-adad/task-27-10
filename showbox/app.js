const API = "https://api.tvmaze.com";

const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#search-input");
const status = document.querySelector("#status");
const grid = document.querySelector("#grid");

async function getJSON(url) {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
}

function renderShows(shows) {
    grid.innerHTML = "";
    shows.forEach((show) => {
        const card = document.createElement("article");
        card.className = "card";
        card.innerHTML = `
            <img alt="">
            <h3></h3>
            <p>⭐ ${show.rating.average ?? "N/A"}</p>
        `;
        card.querySelector("img").src = show.image?.medium ?? "https://placehold.co/210x295?text=No+Image";
        card.querySelector("img").alt = show.name;
        card.querySelector("h3").textContent = show.name;
        grid.append(card);
    });
}

async function loadAllShows() {
    status.textContent = "Loading...";
    try {
        const shows = await getJSON(`${API}/shows`);
        renderShows(shows);
        status.textContent = "";
    } catch {
        status.textContent = "Couldn't load shows";
    }
}

searchForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const q = searchInput.value.trim();
    if (!q) return loadAllShows();

    status.textContent = "Searching...";
    try {
        const url = `${API}/search/shows?q=${encodeURIComponent(q)}`;
        const results = await getJSON(url);
        const shows = results.map((r) => r.show);
        renderShows(shows);
        status.textContent = shows.length ? "" : "No results";
    } catch {
        status.textContent = "Search failed";
    }
});

loadAllShows();


async function loadEvents() {
  const res = await fetch("events.json");
  const data = await res.json();
  return data;
}

function formatDate(dateStr) {
  const [month, day, year] = dateStr.split("/");
  return new Date(`20${year}`, month - 1, day);
}

function filterEvents(events, filter) {
  const now = new Date();
  const startOfThisWeek = new Date(now);
  startOfThisWeek.setDate(now.getDate() - now.getDay());
  const startOfNextWeek = new Date(startOfThisWeek);
  startOfNextWeek.setDate(startOfThisWeek.getDate() + 7);

  const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  const endOfThisMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const endOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 2, 0);

  return events.filter(e => {
    const eventDate = formatDate(e.date);
    switch (filter) {
      case "today":
        return eventDate.toDateString() === now.toDateString();
      case "thisWeek":
        return eventDate >= now && eventDate < startOfNextWeek;
      case "nextWeek":
        return eventDate >= startOfNextWeek && eventDate < new Date(startOfNextWeek.getTime() + 7 * 86400000);
      case "thisMonth":
        return eventDate >= startOfThisMonth && eventDate <= endOfThisMonth;
      case "nextMonth":
        return eventDate >= startOfNextMonth && eventDate <= endOfNextMonth;
      default:
        return true;
    }
  });
}

function renderTable(events) {
  const tbody = document.querySelector("#eventTable tbody");
  tbody.innerHTML = "";
  events.forEach(e => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${e.date}</td>
      <td>${e.event_name}</td>
      <td>${e.description}</td>
      <td>${e.location}</td>
      <td>${e.price}</td>
      <td><a href="${e.link_info}" target="_blank">More Info</a></td>
    `;
    tbody.appendChild(row);
  });
}

function updateLastUpdated() {
  const now = new Date();
  document.getElementById("lastUpdated").textContent = "Last updated: " + now.toLocaleString();
}

document.getElementById("dateFilter").addEventListener("change", async () => {
  const filter = document.getElementById("dateFilter").value;
  const allEvents = await loadEvents();
  const filtered = filterEvents(allEvents, filter);
  renderTable(filtered);
});

document.getElementById("refreshButton").addEventListener("click", async () => {
  updateLastUpdated();
  const filter = document.getElementById("dateFilter").value;
  const allEvents = await loadEvents();
  const filtered = filterEvents(allEvents, filter);
  renderTable(filtered);
});

window.addEventListener("DOMContentLoaded", async () => {
  updateLastUpdated();
  const allEvents = await loadEvents();
  const filter = document.getElementById("dateFilter").value;
  const filtered = filterEvents(allEvents, filter);
  renderTable(filtered);
});

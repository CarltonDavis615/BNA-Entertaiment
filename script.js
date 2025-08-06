const eventsUrl = "events.json";
const tableBody = document.getElementById("events-table-body");
const statusEl = document.getElementById("refresh-status");

function formatDate(dateStr) {
  const [year, month, day] = dateStr.split("-");
  return `${month}/${day}/${year.slice(2)}`;
}

function loadEvents() {
  fetch(eventsUrl)
    .then(res => res.json())
    .then(data => {
      tableBody.innerHTML = "";
      data.forEach(event => {
        const row = document.createElement("tr");

        row.innerHTML = `
          <td>${formatDate(event.date)}</td>
          <td>${event.title}</td>
          <td>${event.description || ""}</td>
          <td>${event.location || ""}</td>
          <td>${event.price || ""}</td>
          <td><a href="${event.url}" target="_blank">More info</a></td>
        `;
        tableBody.appendChild(row);
      });

      const now = new Date();
      statusEl.textContent = `Last updated: ${now.toLocaleString()}`;
    })
    .catch(err => {
      statusEl.textContent = "Error loading events.";
      console.error("Failed to load events.json:", err);
    });
}

function refreshEvents() {
  statusEl.textContent = "Contacting agent to refresh events...";

  // This should be a link to your GPT Agent, like:
  // https://chat.openai.com/g/g-XXXXXX-refresh-nashville-events
  window.open("https://chat.openai.com/g/g-YOUR_AGENT_ID", "_blank");
}

loadEvents();

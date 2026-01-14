(() => {
    const DATA_URL = "data/mentoring.json";
    const ul = document.getElementById("mentoringList");

    function renderPerson(p) {
        if (p.url) {
            return `<a href="${p.url}" target="_blank" rel="noopener noreferrer">${p.name}</a>`;
        }
        return p.name;
    }

    function renderVenue(item) {
        if (!item.venue) return "";
        if (item.venueUrl) {
            return `<a href="${item.venueUrl}" target="_blank" rel="noopener noreferrer">${item.venue}</a>`;
        }
        return item.venue;
    }

    async function init() {
        try {
            const res = await fetch(DATA_URL, { cache: "no-store" });
            if (!res.ok) throw new Error(`Failed to load ${DATA_URL} (HTTP ${res.status})`);

            const items = await res.json();

            ul.innerHTML = items.map(item => {
                const title = item.titleHtml ?? item.title ?? "";
                const venue = renderVenue(item);
                const people = (item.people ?? []).map(renderPerson).join(", ");

                // Venue — Title
                const header = venue ? `${venue} \u2014 ${title}` : `${title}`;

                // Role
                const rolePrefix = item.role ? `${item.role}: ` : "";

                return `
          <li class="list-row">
            <div class="list-left">${item.date ?? ""}</div>
            <div class="list-middle">
              <div>${header}</div>
              <div class="mentoring-people">${rolePrefix}${people}</div>
            </div>
          </li>
        `;
            }).join("");

        } catch (e) {
            console.error(e);
            ul.innerHTML = `<li>Could not load mentoring entries.</li>`;
        }
    }

    init();
})();

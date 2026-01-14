(() => {
    const DATA_URL = "data/teaching.json";
    const INITIAL_COUNT = 4;

    const ul = document.getElementById("teachingList");
    const toggleBtn = document.getElementById("teachingToggle");

    let items = [];
    let expanded = false;

    function venueLink(item) {
        if (!item.venue) return "";
        if (item.venueUrl) {
            return `<a href="${item.venueUrl}" target="_blank" rel="noopener noreferrer">${item.venue}</a>`;
        }
        return item.venue;
    }

    function render() {
        const visible = expanded ? items : items.slice(0, INITIAL_COUNT);

        ul.innerHTML = visible.map(item => {
            const v = venueLink(item);

            // show code, but do not bold it
            const codePart = item.code ? `<span class="teaching-code">${item.code}</span>: ` : "";
            // bold title
            const title = item.title ?? "";

            // Venue — code: <b>title</b>
            const header = v ? `${v} \u2014 ${codePart}${title}` : `${codePart}${titleBold}`;

            const detailsLine = item.details ? `<div class="teaching-details">${item.details}</div>` : "";

            const links = Array.isArray(item.links) ? item.links : [];
            const linksHtml = links.length
                ? links.map((L, idx) => {
                    const sep = idx < links.length - 1 ? " | " : "";
                    return `<a href="${L.href}" target="_blank" rel="noopener noreferrer">${L.kind}</a>${sep}`;
                }).join("")
                : "";

            return `
        <li class="list-row">
          <div class="list-left">${item.dateDisplay ?? ""}</div>
          <div class="list-middle">
            <div class="teaching-title">${header}</div>
            ${detailsLine}
          </div>
          <div class="list-right">${linksHtml}</div>
        </li>
      `;
        }).join("");

        if (items.length > INITIAL_COUNT) {
            toggleBtn.hidden = false;
            toggleBtn.textContent = expanded ? "Show less" : "Show more";
            toggleBtn.setAttribute("aria-expanded", String(expanded));
        } else {
            toggleBtn.hidden = true;
        }
    }

    async function init() {
        try {
            const res = await fetch(DATA_URL, { cache: "no-store" });
            if (!res.ok) throw new Error(`Failed to load ${DATA_URL} (HTTP ${res.status})`);

            items = await res.json();
            render();
        } catch (e) {
            console.error(e);
            ul.innerHTML = `<li>Could not load teaching entries.</li>`;
            toggleBtn.hidden = true;
        }
    }

    toggleBtn.addEventListener("click", () => {
        expanded = !expanded;
        render();
    });

    init();
})();

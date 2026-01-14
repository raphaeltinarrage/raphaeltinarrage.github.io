(() => {
    const DATA_URL = "data/research.json";

    const targets = {
        journal: document.getElementById("pubJournal"),
        conference: document.getElementById("pubConference"),
        preprint: document.getElementById("pubPreprints"),
        phd: document.getElementById("pubPhD")
    };

    function renderLinks(links) {
        if (!Array.isArray(links) || links.length === 0) return "";
        return links
            .map((L, idx) => {
                const sep = idx < links.length - 1 ? " | " : "";
                return `<a href="${L.href}" target="_blank" rel="noopener noreferrer">${L.kind}</a>${sep}`;
            })
            .join("");
    }

    function renderItem(p) {
        const img = p.image
            ? `
      <a href="${p.imageHref ?? "#"}" target="_blank" rel="noopener noreferrer">
        <img src="${p.image}" class="list-left" alt="${p.imageAlt ?? ""}">
      </a>`
            : "";

        const titleHtml = p.imageHref
            ? `<a href="${p.imageHref}" target="_blank" rel="noopener noreferrer">${p.title ?? ""}</a>`
            : (p.title ?? "");

        const authorsLine = p.authors ? `<div class="pub-authors">(${p.authors})</div>` : "";
        const noteInline = p.note ? ` <span class="pub-note">(${p.note})</span>` : "";

        return `
    <li class="list-row">
      <div class="pub-left">${img}</div>
      <div class="pub-mid">
        <div class="pub-title">${titleHtml}${noteInline}</div>
        ${authorsLine}
        <div class="pub-venue">${p.venue ?? ""}</div>
      </div>
      <div class="list-right">${renderLinks(p.links)}</div>
    </li>
  `;
    }

    async function init() {
        try {
            const res = await fetch(DATA_URL, { cache: "no-store" });
            if (!res.ok) throw new Error(`Failed to load ${DATA_URL} (HTTP ${res.status})`);

            const pubs = await res.json();

            // group by category
            const grouped = { journal: [], conference: [], preprint: [], phd: [] };
            for (const p of pubs) {
                if (grouped[p.category]) grouped[p.category].push(p);
            }

            for (const cat of Object.keys(grouped)) {
                const ul = targets[cat];
                if (!ul) continue;
                ul.innerHTML = grouped[cat].map(renderItem).join("");
            }
        } catch (e) {
            console.error(e);
            for (const ul of Object.values(targets)) {
                if (ul) ul.innerHTML = `<li>Could not load publications.</li>`;
            }
        }
    }

    init();
})();

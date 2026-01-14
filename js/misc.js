(() => {
    const DATA_URL = "data/misc.json";
    const ul = document.getElementById("miscList");

    function renderLinks(links) {
        if (!Array.isArray(links) || links.length === 0) return "";
        return links
            .map((L, idx) => {
                const sep = idx < links.length - 1 ? " | " : "";
                return `<a href="${L.href}" target="_blank" rel="noopener noreferrer">${L.kind}</a>${sep}`;
            })
            .join("");
    }

    function renderItem(item) {
        const imgHtml = item.image
            ? `
        <a href="${item.imageHref ?? "#"}" target="_blank" rel="noopener noreferrer">
          <img src="${item.image}" class="list-left" alt="${item.imageAlt ?? ""}">
        </a>
      `
            : "";

        const text = item.textHtml ?? item.text ?? "";

        return `
      <li class="list-row">
        <div class="list-left">${imgHtml}</div>
        <div class="list-middle">${text}</div>
        <div class="list-right">${renderLinks(item.links)}</div>
      </li>
    `;
    }

    async function init() {
        try {
            const res = await fetch(DATA_URL, { cache: "no-store" });
            if (!res.ok) throw new Error(`Failed to load ${DATA_URL} (HTTP ${res.status})`);

            const items = await res.json();
            ul.innerHTML = items.map(renderItem).join("");
        } catch (e) {
            console.error(e);
            ul.innerHTML = `<li>Could not load miscellaneous items.</li>`;
        }
    }

    init();
})();

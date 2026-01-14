(() => {
    const DATA_URL = "data/talks.json";
    const INITIAL_COUNT = 4;

    function $(id) { return document.getElementById(id); }

    function renderSection(items, ul, toggleBtn) {
        let expanded = false;

        function draw() {
            ul.innerHTML = "";
            const visible = expanded ? items : items.slice(0, INITIAL_COUNT);

            for (const t of visible) {
                const li = document.createElement("li");
                li.className = "list-row";

                // Column 1: date
                const time = document.createElement("time");
                time.className = "list-left";
                time.textContent = t.dateDisplay || t.date || "";
                if (t.date) time.dateTime = t.date;
                li.appendChild(time);

                // Column 2: content (Venue, Seminar -- Title)
                const content = document.createElement("div");
                content.className = "list-middle";

                let wroteSomethingLeft = false;

                // Venue (linked if venueUrl exists)
                if (t.venue) {
                    if (t.venueUrl) {
                        const a = document.createElement("a");
                        a.href = t.venueUrl;
                        a.target = "_blank";
                        a.rel = "noopener noreferrer";
                        a.textContent = t.venue;
                        content.appendChild(a);
                    } else {
                        content.appendChild(document.createTextNode(t.venue));
                    }
                    wroteSomethingLeft = true;
                }

                // Seminar (linked if seminarUrl exists)
                if (t.seminar) {
                    if (wroteSomethingLeft) content.appendChild(document.createTextNode(", "));
                    if (t.seminarUrl) {
                        const a = document.createElement("a");
                        a.href = t.seminarUrl;
                        a.target = "_blank";
                        a.rel = "noopener noreferrer";
                        a.textContent = t.seminar;
                        content.appendChild(a);
                    } else {
                        content.appendChild(document.createTextNode(t.seminar));
                    }
                    wroteSomethingLeft = true;
                }

                // Separator before title (only if we had venue or seminar)
                if (wroteSomethingLeft) content.appendChild(document.createTextNode(" \u2014 ")); // --

                // Title
                const titleSpan = document.createElement("span");
                titleSpan.className = "talk-title";
                titleSpan.textContent = t.title || "";
                content.appendChild(titleSpan);

                li.appendChild(content);


                // Column 3: links (kind | kind | kind)
                const linksCol = document.createElement("div");
                linksCol.className = "list-right";

                if (Array.isArray(t.links) && t.links.length > 0) {
                    t.links.forEach((L, idx) => {
                        const a = document.createElement("a");
                        a.href = L.href;
                        a.target = "_blank";
                        a.rel = "noopener noreferrer";
                        a.textContent = L.kind; // show the kind verbatim (slides, video, code, ...)
                        linksCol.appendChild(a);

                        if (idx < t.links.length - 1) {
                            linksCol.appendChild(document.createTextNode(" | "));
                        }
                    });
                } else {
                    linksCol.textContent = ""; // keep empty for alignment
                }

                li.appendChild(linksCol);

                ul.appendChild(li);
            }

            if (items.length > INITIAL_COUNT) {
                toggleBtn.hidden = false;
                toggleBtn.textContent = expanded ? "Show less" : "Show more";
                toggleBtn.setAttribute("aria-expanded", String(expanded));
            } else {
                toggleBtn.hidden = true;
            }
        }

        toggleBtn.addEventListener("click", () => {
            expanded = !expanded;
            draw();
        });

        draw();
    }

    async function init() {
        const invitedUl = $("talksInvited");
        const invitedToggle = $("talksInvitedToggle");
        const overviewUl = $("talksOverview");
        const overviewToggle = $("talksOverviewToggle");

        try {
            const res = await fetch(DATA_URL, { cache: "no-store" });
            if (!res.ok) throw new Error(`Failed to load ${DATA_URL} (HTTP ${res.status})`);

            const all = await res.json();

            // newest first (expects ISO YYYY-MM-DD)
            all.sort((a, b) => (b.date || "").localeCompare(a.date || ""));

            renderSection(all.filter(t => t.section === "invited"), invitedUl, invitedToggle);
            renderSection(all.filter(t => t.section === "overview"), overviewUl, overviewToggle);

        } catch (e) {
            console.error(e);
            invitedUl.innerHTML = `<li>Could not load talks.</li>`;
            overviewUl.innerHTML = `<li>Could not load talks.</li>`;
            invitedToggle.hidden = true;
            overviewToggle.hidden = true;
        }
    }

    init();
})();

import { pastPapersIndex, searchIndex } from "../data/pastPapersIndex.js";

export function renderPastPapers(container) {
  container.innerHTML = `
    <div class="filters glass-panel">
      <select id="filter-subject">
        <option value="">All Subjects</option>
        <option>Physics</option>
        <option>Chemistry</option>
        <option>Biology</option>
        <option>Combined Maths</option>
      </select>
    </div>
    <div class="papers-grid" id="papers-grid">
      ${renderPaperCards(pastPapersIndex)}
    </div>
  `;

  document.getElementById("global-search").addEventListener("input", (e) => {
    const query = e.target.value.toLowerCase();
    if (!query) {
      document.getElementById("papers-grid").innerHTML =
        renderPaperCards(pastPapersIndex);
      return;
    }
    const results = searchIndex
      .filter((p) => p.text.includes(query))
      .map((p) => pastPapersIndex.find((pp) => pp.id === p.id));
    document.getElementById("papers-grid").innerHTML =
      renderPaperCards(results);
  });
}

function renderPaperCards(papers) {
  if (papers.length === 0) return "<p>No papers found.</p>";
  return papers
    .map(
      (paper) => `
    <div class="paper-card glass-panel card">
      <div class="paper-header">
        <span>${paper.year}</span>
        <span>${paper.type}</span>
      </div>
      <h3>${paper.subject}</h3>
      <p style="color: var(--text-secondary); font-size: 14px;">${paper.name}</p>
      <div class="paper-actions">
        <button class="btn-icon" onclick="window.open('${paper.url}', '_blank')">⬇️ Download</button>
      </div>
    </div>
  `,
    )
    .join("");
}

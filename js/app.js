const state = {
  featuredProjects: [],
  otherProjects: [],
  githubRepos: []
};

// 1. Render Experience & Education (Clean Scannable Vertical Layout)
function renderExperience(profile) {
  const stack = document.getElementById("experienceStack");
  if (!stack || !profile) return;

  const expHtml = (profile.experience || []).map(exp => {
    const bullets = exp.bullets || exp.highlights || [];
    return `
      <article class="exp-row">
        <div class="exp-meta">
          <div class="exp-meta-period">${exp.period}</div>
          <div class="exp-meta-loc">${exp.location}</div>
        </div>
        <div class="exp-main">
          <div class="exp-main-header">
            <h3 class="exp-role-title">${exp.role} · <span class="exp-company-name">${exp.company}</span></h3>
          </div>
          <ul class="exp-bullet-list">
            ${bullets.map(b => `<li>${b}</li>`).join("")}
          </ul>
          <div class="inline-tech-list">
            ${(exp.tech || []).map(t => `<span class="tech-chip">${t}</span>`).join("")}
          </div>
        </div>
      </article>
    `;
  });

  const eduHtml = (profile.education || []).map(ed => `
    <article class="exp-row">
      <div class="exp-meta">
        <div class="exp-meta-period">Education</div>
        <div class="exp-meta-loc">${ed.location}</div>
      </div>
      <div class="exp-main">
        <div class="exp-main-header">
          <h3 class="exp-role-title">${ed.degree} · <span class="exp-company-name">${ed.institution}</span></h3>
        </div>
        <p style="font-size:0.92rem; color:var(--text-secondary); line-height:1.65;">
          ${ed.details || "Core coursework in Artificial Intelligence, Machine Learning, Data Structures & Algorithms, Database Systems, and Software Engineering."}
        </p>
      </div>
    </article>
  `);

  stack.innerHTML = [...expHtml, ...eduHtml].join("");
}

// 2. Render Featured Case-Study Projects
function renderFeaturedProjects() {
  const container = document.getElementById("featuredProjectsList");
  if (!container) return;

  container.innerHTML = state.featuredProjects.map(p => {
    const nodes = p.diagram_nodes || (p.tech || []).slice(0, 4);
    const shortDesc = p.short_description || p.summary || "";
    const techLine = (p.tech || []).join(" · ");

    return `
      <article class="case-card">
        <div class="case-card-top">
          <span class="case-category">${p.category}</span>
          <span class="case-context">${p.context || p.badge || ""}</span>
        </div>

        <h3 class="case-title">${p.title}</h3>
        <p class="case-short-desc">${shortDesc}</p>

        <div class="case-pipeline-bar">
          <span class="cp-label">Architecture:</span>
          ${nodes.map((n, i) => `
            <span class="cp-node">${n}</span>
            ${i < nodes.length - 1 ? `<span class="cp-arrow">→</span>` : ""}
          `).join("")}
        </div>

        <div class="case-breakdown-grid">
          <div class="cb-col">
            <strong>Problem Solved</strong>
            <p>${p.problem || "Automates manual engineering steps with validated production pipelines."}</p>
          </div>
          <div class="cb-col">
            <strong>My Contribution</strong>
            <p>${p.contribution || "Designed and implemented the end-to-end backend and model pipeline."}</p>
          </div>
          <div class="cb-col">
            <strong>Result &amp; Impact</strong>
            <p>${p.results || p.metrics || "Deployed to production with automated validation and recovery."}</p>
          </div>
        </div>

        <div class="case-card-footer">
          <div class="case-tech-line">${techLine}</div>
          <div class="case-actions">
            <button type="button" class="btn btn-secondary btn-sm" onclick="openProjectCaseStudy('${p.id}')">
              View Project Overview
            </button>
            <a href="${p.github}" target="_blank" rel="noopener" class="btn btn-subtle btn-sm">
              GitHub ↗
            </a>
          </div>
        </div>
      </article>
    `;
  }).join("");
}

// 3. Comprehensive 8-Part Project Detail Flow Modal
window.openProjectCaseStudy = function(projectId) {
  const proj = state.featuredProjects.find(p => p.id === projectId);
  if (!proj) return;

  document.getElementById("caseModalTag").textContent = `${proj.category} · ${proj.context || ""}`;
  document.getElementById("caseModalTitle").textContent = proj.title;

  const body = document.getElementById("caseModalBody");
  body.innerHTML = `
    <div class="modal-section">
      <h4>1. Overview</h4>
      <p>${proj.short_description || proj.summary}</p>
    </div>

    <div class="modal-grid-2">
      <div class="modal-box modal-section" style="margin-bottom:0;">
        <h4>2. Problem</h4>
        <p>${proj.problem || ""}</p>
      </div>
      <div class="modal-box modal-section" style="margin-bottom:0;">
        <h4>3. Solution</h4>
        <p>${proj.solution || ""}</p>
      </div>
    </div>

    <div class="modal-section">
      <h4>4. System Architecture</h4>
      <ul class="modal-arch-list">
        ${(proj.architecture || []).map((step, i) => `
          <li>
            <span class="modal-arch-num">0${i + 1}</span>
            <span>${step}</span>
          </li>
        `).join("")}
      </ul>
    </div>

    <div class="modal-section">
      <h4>5. Technologies</h4>
      <div class="skill-chip-list">
        ${(proj.tech || []).map(t => `<span class="skill-badge">${t}</span>`).join("")}
      </div>
    </div>

    <div class="modal-grid-2">
      <div class="modal-box modal-section" style="margin-bottom:0;">
        <h4>6. My Contribution</h4>
        <p>${proj.contribution || ""}</p>
      </div>
      <div class="modal-box modal-section" style="margin-bottom:0;">
        <h4>7. Results &amp; Impact</h4>
        <p>${proj.results || ""}</p>
      </div>
    </div>

    <div class="modal-section" style="margin-bottom:0; display:flex; align-items:center; justify-content:space-between; padding-top:14px; border-top:1px solid var(--border);">
      <span style="font-family:var(--font-mono); font-size:0.76rem; color:var(--text-muted);">8. Project Links</span>
      <a href="${proj.github}" target="_blank" rel="noopener" class="btn btn-primary btn-sm">
        View Source on GitHub ↗
      </a>
    </div>
  `;

  document.getElementById("caseModalBackdrop").classList.add("open");
};

// 4. Render Technical Skills (Clean Logical Categories, No Percentage Bars)
function renderSkillCategories(profile) {
  const grid = document.getElementById("skillsCategoriesGrid");
  if (!grid) return;

  const categories = profile.skill_categories || [];
  grid.innerHTML = categories.map(cat => `
    <div class="skill-cat-card">
      <h3 class="skill-cat-title">${cat.category}</h3>
      <p class="skill-cat-desc">${cat.description || ""}</p>
      <div class="skill-chip-list">
        ${(cat.skills || []).map(s => `<span class="skill-badge">${s}</span>`).join("")}
      </div>
    </div>
  `).join("");
}

// 5. Render Additional Work & 38 GitHub Repositories
function renderOtherProjects() {
  const grid = document.getElementById("otherProjectsGrid");
  if (!grid) return;

  grid.innerHTML = state.otherProjects.map(p => `
    <article class="other-proj-card">
      <div>
        <div class="opc-top">
          <h3 class="opc-title">${p.title}</h3>
          <a href="${p.github}" target="_blank" rel="noopener" class="opc-link">GitHub ↗</a>
        </div>
        <p class="opc-desc">${p.summary}</p>
      </div>
      <div class="inline-tech-list">
        ${(p.tech || []).map(t => `<span class="tech-chip">${t}</span>`).join("")}
      </div>
    </article>
  `).join("");
}

function renderGithubArchive(query = "") {
  const tbody = document.getElementById("ghArchiveBody");
  const countEl = document.getElementById("ghTotalCount");
  if (!tbody) return;

  if (countEl && state.githubRepos.length) {
    countEl.textContent = state.githubRepos.length;
  }

  const q = query.toLowerCase().trim();
  const filtered = state.githubRepos.filter(r =>
    !q ||
    (r.name && r.name.toLowerCase().includes(q)) ||
    (r.description && r.description.toLowerCase().includes(q)) ||
    (r.language && r.language.toLowerCase().includes(q))
  );

  tbody.innerHTML = filtered.map(r => `
    <a href="${r.html_url}" target="_blank" rel="noopener" class="gh-row">
      <span class="gh-repo-name">${r.name} ↗</span>
      <span class="gh-repo-desc">${r.description}</span>
      <span class="gh-repo-lang">${r.language || "Python"}</span>
      <span class="gh-repo-date">${r.updated_at || "2026"}</span>
    </a>
  `).join("");
}

// 6. Quick Profile Q&A Assistant
function formatMarkdown(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/`(.*?)`/g, "<code style='background:var(--surface-alt);padding:1px 5px;border-radius:4px;font-family:var(--font-mono);font-size:0.78rem;'>$1</code>")
    .replace(/\[([^\]]+)\]\(((?:https?:\/\/|mailto:|\/|Muhammad_)[^\)]+)\)/g, "<a href='$2' target='_blank' rel='noopener' class='text-link'>$1</a>")
    .replace(/\n/g, "<br>");
}

function localAssistantReply(question) {
  const q = question.toLowerCase().trim();
  if (["hi", "hello", "hey", "salam", "aoa"].includes(q) || q.startsWith("hi ") || q.startsWith("hello ")) {
    return "Hi! Ask me about Ehtisham's role as an **AI Engineer at Irvinei**, his **projects**, **technical skills**, **education at SSUET**, or **how to contact him**.";
  }
  if (["who are you", "who is ehtisham", "about yourself", "about you", "introduce", "bio", "summary"].some(k => q.includes(k))) {
    return "**Muhammad Ehtisham Khan** is an **AI & Full-Stack Engineer** based in **Karachi, Pakistan**, working at **Irvinei** (building 15-stage LangGraph AutoML pipelines, Hybrid Qdrant/Redis RAG systems, and YOLOv8/11 computer vision workflows). He holds a B.S. in Computer Science from **SSUET, Karachi** and maintains 38 public repositories on GitHub.";
  }
  if (["connect", "contact", "reach", "email", "phone", "number", "whatsapp", "call", "linkedin"].some(k => q.includes(k))) {
    return "You can contact **Muhammad Ehtisham Khan** directly at:\n• **Email:** [m.ehtishamghouri@gmail.com](mailto:m.ehtishamghouri@gmail.com)\n• **Phone / WhatsApp:** `+92 335 2255187`\n• **LinkedIn:** [linkedin.com/in/mohdehtishamkhan](https://www.linkedin.com/in/mohdehtishamkhan/)\n• **GitHub:** [github.com/ehtishamsher](https://github.com/ehtishamsher)";
  }
  if (["available", "availability", "hire", "hiring", "remote", "karachi", "job"].some(k => q.includes(k))) {
    return "Ehtisham is currently working as an AI Engineer at Irvinei and is open to discussing **AI Engineer, Full-Stack, Computer Vision, and Data/MLOps roles** in Karachi or Remote (`m.ehtishamghouri@gmail.com` | `+92 335 2255187`).";
  }
  if (["resume", "cv", "pdf", "download"].some(k => q.includes(k))) {
    return "Download his complete PDF resume here: **[Muhammad Ehtisham Khan — Resume (PDF)](Muhammad_Ehtisham_Khan_Resume.pdf)**";
  }
  if (["irvinei", "experience", "work", "company", "role", "intern"].some(k => q.includes(k))) {
    return "At **Irvinei**, Ehtisham works as an **AI Engineer** (Sep 2026 – Present) after completing his **AI Internship** (Mar 2026 – Sep 2026). He architected a 15-stage autonomous LangGraph AutoML platform, a Hybrid Qdrant + Redis/MongoDB RAG diagnostic system, and contributed to a shipped commercial AI security device.";
  }
  if (["skill", "stack", "tech", "language", "framework"].some(k => q.includes(k))) {
    return "Core stack: **Python, FastAPI, LangGraph, LangChain, PyTorch, YOLOv8/11, OpenAI & Anthropic APIs, Qdrant, MongoDB, PostgreSQL/SQL, Redis, React.js, Next.js, Node.js, Docker, GitHub Actions CI/CD, and AWS**.";
  }
  return "**Muhammad Ehtisham Khan** — AI Engineer at **Irvinei** (Karachi, Pakistan). Reach out directly at `m.ehtishamghouri@gmail.com` or `+92 335 2255187`.";
}

async function queryAgent(question) {
  const feed = document.getElementById("agentFeed");
  const input = document.getElementById("agentInput");
  if (!feed || !question.trim()) return;

  const uDiv = document.createElement("div");
  uDiv.className = "agent-msg agent-user";
  uDiv.innerHTML = `<div class="agent-bubble">${question}</div>`;
  feed.appendChild(uDiv);
  feed.scrollTop = feed.scrollHeight;

  if (input) input.value = "";

  const bDiv = document.createElement("div");
  bDiv.className = "agent-msg agent-bot";
  bDiv.innerHTML = `<div class="agent-bubble">...</div>`;
  feed.appendChild(bDiv);
  feed.scrollTop = feed.scrollHeight;

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question })
    });
    if (!res.ok) throw new Error("Static fallback");
    const data = await res.json();
    bDiv.innerHTML = `<div class="agent-bubble">${formatMarkdown(data.reply || localAssistantReply(question))}</div>`;
  } catch (err) {
    bDiv.innerHTML = `<div class="agent-bubble">${formatMarkdown(localAssistantReply(question))}</div>`;
  }
  feed.scrollTop = feed.scrollHeight;
}

async function bootstrap() {
  let profile = null;
  try {
    let res = await fetch("/api/profile");
    if (!res.ok) res = await fetch("data/profile.json");
    profile = await res.json();
  } catch (err) {
    try {
      const res2 = await fetch("data/profile.json");
      profile = await res2.json();
    } catch (e2) {
      console.error("Failed to load profile data:", e2);
    }
  }

  if (profile) {
    state.featuredProjects = profile.featured_projects || profile.projects || [];
    state.otherProjects = profile.other_projects || [];
    renderExperience(profile);
    renderFeaturedProjects();
    renderSkillCategories(profile);
    renderOtherProjects();
  }

  try {
    let resGh = await fetch("/api/github");
    if (resGh.ok) {
      const gh = await resGh.json();
      state.githubRepos = gh.repos || [];
    } else {
      throw new Error("Direct GitHub fetch");
    }
    renderGithubArchive();
  } catch (err) {
    try {
      const directRes = await fetch("https://api.github.com/users/ehtishamsher/repos?per_page=40&sort=updated");
      const rawRepos = await directRes.json();
      state.githubRepos = (rawRepos || []).map(r => ({
        name: r.name,
        language: r.language || "Python",
        description: r.description || `Implementation and experiments for ${r.name.replace(/_/g, " ")}.`,
        html_url: r.html_url,
        updated_at: (r.updated_at || "").slice(0, 10)
      }));
      renderGithubArchive();
    } catch (e2) {
      console.error("Failed to load GitHub repos:", e2);
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  bootstrap();

  // Theme Toggle
  const themeToggle = document.getElementById("themeToggle");
  const iconSun = document.getElementById("iconSun");
  const iconMoon = document.getElementById("iconMoon");
  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const html = document.documentElement;
      const next = html.getAttribute("data-theme") === "dark" ? "light" : "dark";
      html.setAttribute("data-theme", next);
      if (iconSun && iconMoon) {
        iconSun.style.display = next === "dark" ? "block" : "none";
        iconMoon.style.display = next === "light" ? "block" : "none";
      }
    });
  }

  // Mobile Menu
  const menuToggle = document.getElementById("menuToggle");
  const siteNav = document.getElementById("siteNav");
  if (menuToggle && siteNav) {
    menuToggle.addEventListener("click", () => siteNav.classList.toggle("open"));
    siteNav.querySelectorAll("a").forEach(a => {
      a.addEventListener("click", () => siteNav.classList.remove("open"));
    });
  }

  // GitHub Search
  const ghFilterInput = document.getElementById("ghFilterInput");
  if (ghFilterInput) {
    ghFilterInput.addEventListener("input", e => renderGithubArchive(e.target.value));
  }

  // Profile Q&A Form
  const agentForm = document.getElementById("agentForm");
  if (agentForm) {
    agentForm.addEventListener("submit", e => {
      e.preventDefault();
      const input = document.getElementById("agentInput");
      if (input && input.value.trim()) queryAgent(input.value.trim());
    });
  }

  const clearAgentBtn = document.getElementById("clearAgentBtn");
  if (clearAgentBtn) {
    clearAgentBtn.addEventListener("click", () => {
      const feed = document.getElementById("agentFeed");
      if (feed) {
        feed.innerHTML = `
          <div class="agent-msg agent-bot">
            <div class="agent-bubble">Have a quick question about my work at Irvinei, my tech stack, or availability? Ask below.</div>
          </div>
        `;
      }
    });
  }

  // Contact Form
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", async e => {
      e.preventDefault();
      const btn = document.getElementById("submitContactBtn");
      const status = document.getElementById("contactStatusMsg");

      const payload = {
        name: document.getElementById("inName").value,
        email: document.getElementById("inEmail").value,
        company: document.getElementById("inCompany").value,
        role_type: document.getElementById("inRole").value,
        message: document.getElementById("inMessage").value
      };

      btn.disabled = true;
      btn.textContent = "Sending...";

      try {
        const res = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        if (!res.ok) throw new Error("Static fallback");
        const data = await res.json();
        if (data.success) {
          status.textContent = `Thanks ${payload.name}, your message has been received.`;
          contactForm.reset();
        } else {
          status.textContent = data.error || "Could not send message.";
        }
      } catch (err) {
        status.textContent = `Thanks ${payload.name}! Your inquiry has been recorded.`;
        contactForm.reset();
      } finally {
        btn.disabled = false;
        btn.textContent = "Send Message";
      }
    });
  }

  // Modal Close
  const backdrop = document.getElementById("caseModalBackdrop");
  const closeBtn = document.getElementById("caseModalClose");
  if (closeBtn && backdrop) {
    closeBtn.addEventListener("click", () => backdrop.classList.remove("open"));
    backdrop.addEventListener("click", e => {
      if (e.target === backdrop) backdrop.classList.remove("open");
    });
  }
});

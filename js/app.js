const state = {
  projects: [],
  githubRepos: [],
  activeCategory: "All"
};

// 1. Animated Neural Network Background Canvas
function initNeuralCanvas() {
  const canvas = document.getElementById("neuralCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener("resize", () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const nodeCount = Math.min(52, Math.floor((width * height) / 26000));
  const nodes = Array.from({ length: nodeCount }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * 0.42,
    vy: (Math.random() - 0.5) * 0.42,
    r: Math.random() * 1.6 + 1
  }));

  function draw() {
    ctx.clearRect(0, 0, width, height);
    const isLight = document.documentElement.getAttribute("data-theme") === "light";
    const dotColor = isLight ? "rgba(37, 99, 235, 0.35)" : "rgba(56, 189, 248, 0.42)";

    for (let i = 0; i < nodes.length; i++) {
      const a = nodes[i];
      a.x += a.vx;
      a.y += a.vy;

      if (a.x < 0 || a.x > width) a.vx *= -1;
      if (a.y < 0 || a.y > height) a.vy *= -1;

      ctx.beginPath();
      ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2);
      ctx.fillStyle = dotColor;
      ctx.fill();

      for (let j = i + 1; j < nodes.length; j++) {
        const b = nodes[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 145) {
          const alpha = (1 - dist / 145) * (isLight ? 0.14 : 0.18);
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(59, 130, 246, ${alpha})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }
  draw();
}

// 2. Render Featured Projects Grid
function renderBentoProjects() {
  const grid = document.getElementById("bentoProjectsGrid");
  if (!grid) return;

  const filtered = state.projects.filter(p =>
    state.activeCategory === "All" || p.category === state.activeCategory
  );

  const spans = [8, 4, 4, 8, 6, 6, 8, 4, 4, 8];

  grid.innerHTML = filtered.map((p, idx) => {
    const span = spans[idx % spans.length];
    return `
      <article class="bento-case-card bento-span-${span}">
        <div>
          <div class="bcc-top">
            <span class="bcc-domain">${p.category}</span>
            <span class="bcc-metric">${p.metrics}</span>
          </div>

          <h3 class="bcc-title">${p.title}</h3>
          <p class="bcc-summary">${p.summary}</p>
        </div>

        <div>
          <div class="bcc-tags">
            ${p.tech.map(t => `<span class="bcc-tag">${t}</span>`).join("")}
          </div>

          <div class="bcc-actions">
            <button type="button" class="btn-case" onclick="openCaseStudy('${p.id}')">
              <span>View Architecture Details</span>
              <span>↗</span>
            </button>
            <a href="${p.github}" target="_blank" rel="noopener" class="btn-outline-sm">
              <span>GitHub</span>
              <span>↗</span>
            </a>
          </div>
        </div>
      </article>
    `;
  }).join("");
}

window.openCaseStudy = function(projectId) {
  const proj = state.projects.find(p => p.id === projectId);
  if (!proj) return;

  document.getElementById("caseModalTag").textContent = proj.badge;
  document.getElementById("caseModalTitle").textContent = proj.title;

  const body = document.getElementById("caseModalBody");
  body.innerHTML = `
    <p style="color:var(--text-secondary); margin-bottom:18px; font-size:0.93rem;">${proj.summary}</p>
    <h4 style="font-family:var(--font-mono); font-size:0.78rem; color:var(--accent-cyan); margin-bottom:12px;">
      KEY ARCHITECTURE &amp; WORKFLOW
    </h4>
    <div>
      ${(proj.architecture || []).map((step, i) => `
        <div class="case-step">
          <span class="case-step-num">${i + 1}</span>
          <div style="font-size:0.88rem;">${step}</div>
        </div>
      `).join("")}
    </div>
    <div style="margin-top:18px;" class="bcc-tags">
      ${proj.tech.map(t => `<span class="bcc-tag">${t}</span>`).join("")}
    </div>
    <div style="margin-top:20px; display:flex; justify-content:flex-end;">
      <a href="${proj.github}" target="_blank" rel="noopener" class="btn-aura-primary">Open Repository on GitHub ↗</a>
    </div>
  `;

  document.getElementById("caseModalBackdrop").classList.add("open");
};

// 3. Render Technical Skills
function renderStackMatrix(skills) {
  const grid = document.getElementById("stackGrid");
  if (!grid || !skills) return;

  grid.innerHTML = skills.map(group => `
    <div class="stack-card">
      <div class="stack-card-head">
        <h3>${group.category}</h3>
      </div>
      <div>
        ${group.items.map(item => `
          <div class="stack-row">
            <div class="stack-meta">
              <span>${item.name}</span>
              <span class="stack-lvl">${item.level}%</span>
            </div>
            <div class="stack-bar">
              <div class="stack-fill" style="width:${item.level}%"></div>
            </div>
          </div>
        `).join("")}
      </div>
    </div>
  `).join("");
}

// 4. Render Experience & Education
function renderExperienceLog(profile) {
  const timeline = document.getElementById("expTimeline");
  const eduCard = document.getElementById("eduSidebarCard");

  if (timeline && profile.experience) {
    timeline.innerHTML = profile.experience.map(e => `
      <div class="exp-log-card">
        <div class="elc-top">
          <div>
            <div class="elc-role">${e.role}</div>
            <div class="elc-comp">${e.company} • ${e.location}</div>
          </div>
          <span class="elc-time">${e.period}</span>
        </div>
        <ul class="elc-points">
          ${e.highlights.map(h => `<li>${h}</li>`).join("")}
        </ul>
        <div class="bcc-tags" style="margin-bottom:0;">
          ${e.tech.map(t => `<span class="bcc-tag">${t}</span>`).join("")}
        </div>
      </div>
    `).join("");
  }

  if (eduCard && profile.education) {
    eduCard.innerHTML = profile.education.map(ed => `
      <div class="exp-log-card" style="margin-bottom:0;">
        <span class="stat-code">EDUCATION</span>
        <div class="elc-role" style="margin-top:4px; font-size:1.1rem;">${ed.degree}</div>
        <div class="elc-comp" style="margin-bottom:12px;">${ed.institution} (${ed.location})</div>
        <div class="bcc-tags" style="margin-bottom:0;">
          ${ed.coursework.map(c => `<span class="bcc-tag">${c}</span>`).join("")}
        </div>
      </div>
    `).join("");
  }
}

// 5. Render 38 GitHub Repositories
function renderGithubArchive(query = "") {
  const tbody = document.getElementById("ghArchiveBody");
  const countEl = document.getElementById("ghArchiveCount");
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
    <a href="${r.html_url}" target="_blank" rel="noopener" class="abt-row">
      <span class="abt-name">${r.name} ↗</span>
      <span class="abt-desc">${r.description}</span>
      <span class="abt-lang">${r.language || "Python"}</span>
      <span class="abt-date">${r.updated_at || "2026"}</span>
    </a>
  `).join("");
}

function formatMarkdown(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/`(.*?)`/g, "<code style='background:rgba(56,189,248,0.16);padding:2px 6px;border-radius:4px;font-family:var(--font-mono);font-size:0.78rem;'>$1</code>")
    .replace(/\[([^\]]+)\]\(((?:https?:\/\/|mailto:|\/)[^\)]+)\)/g, "<a href='$2' target='_blank' rel='noopener' style='color:var(--accent-cyan);text-decoration:underline;'>$1</a>")
    .replace(/\n/g, "<br>");
}

function localAssistantReply(question) {
  const q = question.toLowerCase().trim();
  if (["hi", "hello", "hey", "salam", "aoa"].includes(q) || q.startsWith("hi ") || q.startsWith("hello ") || q.includes("how are you")) {
    return "Hello! I’m **Muhammad Ehtisham Khan’s AI Assistant**. Ask me about who Ehtisham is, how to connect with him, his work as an **AI Engineer at Irvinei**, his technical skills, projects, education, or availability for new roles.";
  }
  if (["who are you", "who is ehtisham", "about yourself", "about you", "introduce", "bio", "summary"].some(k => q.includes(k))) {
    return "I am the AI Portfolio Assistant for **Muhammad Ehtisham Khan** — an **AI & Full-Stack Engineer** based in **Karachi, Pakistan**.\n\n• **Current Role:** AI Engineer at **Irvinei** (building 15-stage autonomous LangGraph multi-agent pipelines, Hybrid Qdrant/Redis RAG systems, and YOLOv8/11 computer vision platforms).\n• **Full-Stack & MLOps:** Python, FastAPI, React.js, Next.js, Node.js, MongoDB, PostgreSQL, Redis, Docker, CI/CD, and AWS.\n• **Education:** BS in Computer Science (BSCS) from **SSUET, Karachi**.\n• **Open Source:** Author of **38+ public repositories** on GitHub.";
  }
  if (["connect", "contact", "reach", "email", "phone", "number", "whatsapp", "call", "linkedin"].some(k => q.includes(k))) {
    return "You can connect with **Muhammad Ehtisham Khan** directly via:\n\n• **Email:** [m.ehtishamghouri@gmail.com](mailto:m.ehtishamghouri@gmail.com)\n• **Phone / WhatsApp:** `+92 335 2255187`\n• **LinkedIn:** [linkedin.com/in/mohdehtishamkhan](https://www.linkedin.com/in/mohdehtishamkhan/)\n• **GitHub:** [github.com/ehtishamsher](https://github.com/ehtishamsher)\n• **Location:** Karachi, Sindh, Pakistan";
  }
  if (["available", "availability", "hire", "hiring", "remote", "karachi", "job"].some(k => q.includes(k))) {
    return "Yes! **Muhammad Ehtisham Khan** is open to Full-Time On-Site/Hybrid roles in **Karachi**, **Remote** global roles, and consulting opportunities in AI Engineering, Full-Stack Development, Computer Vision, and Data/MLOps.\n\n• **Direct Contact:** `m.ehtishamghouri@gmail.com` | `+92 335 2255187`";
  }
  if (["resume", "cv", "pdf", "download"].some(k => q.includes(k))) {
    return "You can download Ehtisham’s complete PDF resume directly here:\n\n• **[Download Muhammad Ehtisham Khan — Resume (PDF)](Muhammad_Ehtisham_Khan_Resume.pdf)**";
  }
  if (["irvinei", "experience", "work", "company", "role", "intern"].some(k => q.includes(k))) {
    return "At **Irvinei**, Ehtisham works as an **AI Engineer** (Sept 2026 – Present) after completing his **AI Internship** (Mar 2026 – Sept 2026):\n\n• **Agentic ML (15-Stage Pipeline):** Built an autonomous multi-agent system using **LangGraph, FastAPI, and MongoDB** that orchestrates dataset discovery, validation, YOLOv8/11 training, self-healing CUDA OOM recovery, and TensorRT/ONNX export.\n• **Hybrid RAG Supervision:** Engineered Qdrant vector search + Redis/MongoDB snapshot retrieval with OpenAI & Anthropic LLMs.\n• **Shipped Consumer AI Hardware:** Contributed to a commercial AI security device with on-device computer vision.";
  }
  if (["skill", "stack", "tech", "language", "framework"].some(k => q.includes(k))) {
    return "Ehtisham’s core technical stack:\n\n• **AI Agents, LLMs & RAG:** LangGraph, LangChain, OpenAI, Anthropic Claude, Hybrid RAG, Qdrant Vector DB, PyTorch Transformers.\n• **Full-Stack & Backend:** Python, FastAPI, Flask, React.js, Next.js, Node.js, REST APIs, WebSockets, JWT Auth, Streamlit.\n• **Computer Vision & Multimodal:** YOLOv8, YOLO11, YOLO-World, OpenCV, ONNX, TensorRT, Whisper STT, BLIP, Tesseract OCR.\n• **Databases & Cloud MLOps:** MongoDB, PostgreSQL/SQL, Redis, SQLite, Docker, GitHub Actions CI/CD, AWS (Elastic Beanstalk, S3), Cloudflare R2.";
  }
  return "I'm **Muhammad Ehtisham Khan's AI Assistant**!\n\n• **Role:** AI & Full-Stack Engineer at **Irvinei** (Karachi, Pakistan) & BSCS graduate from **SSUET**.\n• **Stack:** Python, FastAPI, LangGraph, React, Next.js, Node.js, PyTorch, YOLOv8/11, MongoDB, Redis, Qdrant, SQL, Docker, AWS.\n• **Contact:** `m.ehtishamghouri@gmail.com` | `+92 335 2255187` | [LinkedIn](https://www.linkedin.com/in/mohdehtishamkhan/) | [GitHub](https://github.com/ehtishamsher)";
}

window.queryAgent = async function(question) {
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
  bDiv.innerHTML = `<div class="agent-bubble">Thinking...</div>`;
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
};

async function bootstrap() {
  initNeuralCanvas();

  try {
    let res = await fetch("/api/profile");
    if (!res.ok) res = await fetch("data/profile.json");
    const profile = await res.json();
    state.projects = profile.projects || [];
    renderBentoProjects();
    renderStackMatrix(profile.skills);
    renderExperienceLog(profile);

    if (profile.stats) {
      const dbCount = document.getElementById("dbMsgCount");
      if (dbCount) dbCount.textContent = profile.stats.messages_count || 0;
    }
  } catch (err) {
    try {
      const res2 = await fetch("data/profile.json");
      const profile = await res2.json();
      state.projects = profile.projects || [];
      renderBentoProjects();
      renderStackMatrix(profile.skills);
      renderExperienceLog(profile);
    } catch (e2) {
      console.error("Failed to load profile:", e2);
    }
  }

  try {
    let resGh = await fetch("/api/github");
    if (resGh.ok) {
      const gh = await resGh.json();
      state.githubRepos = gh.repos || [];
    } else {
      throw new Error("Fetch direct from GitHub API");
    }
    renderGithubArchive();
  } catch (err) {
    try {
      const directRes = await fetch("https://api.github.com/users/ehtishamsher/repos?per_page=40&sort=updated");
      const rawRepos = await directRes.json();
      state.githubRepos = (rawRepos || []).map(r => ({
        name: r.name,
        language: r.language || "Python / ML",
        description: r.description || `Source code and implementation for ${r.name.replace(/_/g, " ")}.`,
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

  // Theme Toggle (Dark / Light)
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
  const mobileMenuBtn = document.getElementById("mobileMenuBtn");
  const navLinks = document.getElementById("navLinks");
  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener("click", () => navLinks.classList.toggle("open"));
    navLinks.querySelectorAll("a").forEach(a => {
      a.addEventListener("click", () => navLinks.classList.remove("open"));
    });
  }

  // Project Filter Pills
  document.querySelectorAll("#bentoFilters .f-pill").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("#bentoFilters .f-pill").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      state.activeCategory = btn.dataset.category;
      renderBentoProjects();
    });
  });

  // GitHub Archive Filter
  const ghFilterInput = document.getElementById("ghFilterInput");
  if (ghFilterInput) {
    ghFilterInput.addEventListener("input", e => renderGithubArchive(e.target.value));
  }

  // AI Agent Console
  const agentForm = document.getElementById("agentForm");
  if (agentForm) {
    agentForm.addEventListener("submit", e => {
      e.preventDefault();
      const input = document.getElementById("agentInput");
      if (input && input.value.trim()) queryAgent(input.value.trim());
    });
  }

  document.querySelectorAll(".a-chip").forEach(chip => {
    chip.addEventListener("click", () => queryAgent(chip.dataset.q));
  });

  const clearAgentBtn = document.getElementById("clearAgentBtn");
  if (clearAgentBtn) {
    clearAgentBtn.addEventListener("click", () => {
      const feed = document.getElementById("agentFeed");
      if (feed) {
        feed.innerHTML = `
          <div class="agent-msg agent-bot">
            <div class="agent-bubble">Chat cleared. Select a topic below or ask a question about Ehtisham's work.</div>
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
        const data = await res.json();
        if (data.success) {
          status.style.color = "var(--accent-emerald)";
          status.textContent = `Message sent! Thank you, ${payload.name}.`;
          contactForm.reset();
          const dbCount = document.getElementById("dbMsgCount");
          if (dbCount) dbCount.textContent = parseInt(dbCount.textContent || "0", 10) + 1;
        } else {
          status.style.color = "#ef4444";
          status.textContent = data.error || "Could not send message.";
        }
      } catch (err) {
        status.style.color = "#ef4444";
        status.textContent = "Network error.";
      } finally {
        btn.disabled = false;
        btn.textContent = "Send Message";
      }
    });
  }

  // View Saved Messages Modal
  const viewDbInboxBtn = document.getElementById("viewDbInboxBtn");
  if (viewDbInboxBtn) {
    viewDbInboxBtn.addEventListener("click", async () => {
      document.getElementById("caseModalTag").textContent = "SAVED INQUIRIES";
      document.getElementById("caseModalTitle").textContent = "Received Messages";
      const body = document.getElementById("caseModalBody");
      body.innerHTML = `<p style="color:var(--text-secondary);">Loading messages...</p>`;
      document.getElementById("caseModalBackdrop").classList.add("open");

      try {
        const res = await fetch("/api/messages");
        const data = await res.json();
        const msgs = data.messages || [];
        if (msgs.length === 0) {
          body.innerHTML = `<p style="color:var(--text-secondary);">No messages received yet.</p>`;
        } else {
          body.innerHTML = msgs.map(m => `
            <div class="case-step" style="flex-direction:column; gap:6px;">
              <div style="display:flex; justify-content:space-between; width:100%; font-size:0.82rem;">
                <strong>${m.name} (${m.email})</strong>
                <span class="stat-code">${m.created_at}</span>
              </div>
              <div style="font-size:0.76rem; color:var(--accent-emerald);">${m.company || "Direct"} • ${m.role_type}</div>
              <p style="font-size:0.86rem; color:var(--text-secondary);">${m.message}</p>
            </div>
          `).join("");
        }
      } catch (err) {
        body.innerHTML = `<p style="color:#ef4444;">Error loading messages.</p>`;
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

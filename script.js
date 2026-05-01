const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");
const year = document.getElementById("year");
const cursorGlow = document.getElementById("cursorGlow");
const assignmentFile = document.getElementById("assignmentFile");
const assignmentInfo = document.getElementById("assignmentInfo");
const assignmentPublicLink = document.getElementById("assignmentPublicLink");
const introVideoFile = document.getElementById("introVideoFile");
const introVideoPlayer = document.getElementById("introVideoPlayer");
const videoInfo = document.getElementById("videoInfo");
const profileImage = document.querySelector(".profile-image");
const githubProjects = document.getElementById("githubProjects");
const ownerOnlyBlocks = document.querySelectorAll(".owner-only");

document.body.classList.add("js-anim");

const isLocalHost = ["localhost", "127.0.0.1", "::1"].includes(window.location.hostname);
const ownerMode = isLocalHost;

let assignmentBlobUrl = "";
let videoBlobUrl = "";

if (ownerMode) {
  document.body.classList.add("owner-mode");
  ownerOnlyBlocks.forEach((block) => {
    block.hidden = false;
  });
} else {
  ownerOnlyBlocks.forEach((block) => {
    block.hidden = true;
    block.querySelectorAll("input, button, select, textarea").forEach((el) => {
      el.disabled = true;
    });
  });
}

if (year) {
  year.textContent = new Date().getFullYear();
}

if (menuBtn && navLinks) {
  menuBtn.addEventListener("click", () => navLinks.classList.toggle("show"));
  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => navLinks.classList.remove("show"));
  });
}

if (cursorGlow) {
  window.addEventListener("mousemove", (event) => {
    cursorGlow.style.left = `${event.clientX}px`;
    cursorGlow.style.top = `${event.clientY}px`;
  });
}

if (assignmentPublicLink) {
  assignmentPublicLink.href = "assets/assignment.pdf";
}

if (introVideoPlayer) {
  introVideoPlayer.src = "assets/self-intro.mp4";
  introVideoPlayer.addEventListener("error", () => {
    videoInfo.textContent = "Self intro video is not added yet.";
  });
}

if (ownerMode && assignmentFile && assignmentInfo && assignmentPublicLink) {
  assignmentFile.addEventListener("change", (event) => {
    const selectedFile = event.target.files?.[0];
    if (assignmentBlobUrl) URL.revokeObjectURL(assignmentBlobUrl);
    if (!selectedFile) return;

    assignmentBlobUrl = URL.createObjectURL(selectedFile);
    assignmentPublicLink.href = assignmentBlobUrl;
    assignmentInfo.textContent = `Uploaded: ${selectedFile.name}`;
  });
}

if (ownerMode && introVideoFile && introVideoPlayer && videoInfo) {
  introVideoFile.addEventListener("change", (event) => {
    const selectedVideo = event.target.files?.[0];
    if (videoBlobUrl) URL.revokeObjectURL(videoBlobUrl);
    if (!selectedVideo) return;

    videoBlobUrl = URL.createObjectURL(selectedVideo);
    introVideoPlayer.src = videoBlobUrl;
    videoInfo.textContent = `Uploaded: ${selectedVideo.name}`;
  });
}

document.querySelectorAll(".tilt-card").forEach((card) => {
  card.addEventListener("mousemove", (event) => {
    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `perspective(900px) rotateX(${y * -8}deg) rotateY(${x * 10}deg)`;
  });
  card.addEventListener("mouseleave", () => {
    card.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg)";
  });
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("visible");
    });
  },
  { threshold: 0.15 }
);

document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

if (profileImage) {
  profileImage.addEventListener("error", () => {
    profileImage.src =
      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='320' height='320'%3E%3Crect width='100%25' height='100%25' fill='%2313214f'/%3E%3Ctext x='50%25' y='53%25' fill='%23ffffff' font-size='74' font-family='Arial' dominant-baseline='middle' text-anchor='middle'%3EAN%3C/text%3E%3C/svg%3E";
  });
}

function renderGithubProjects(repos) {
  if (!githubProjects) return;
  const safe = (value) =>
    String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;");

  const cards = repos
    .map((repo) => {
      const language = safe(repo.language || "Code");
      const stars = typeof repo.stargazers_count === "number" ? repo.stargazers_count : 0;
      const url = repo.html_url || "#";
      const name = safe(repo.name || "Repository");
      const description = safe(repo.description || "Project from GitHub profile.");

      return `
        <article class="glass project repo-card tilt-card">
          <h3>${name}</h3>
          <p>${description}</p>
          <div class="repo-meta">
            <span>${language}</span>
            <span>Stars: ${stars}</span>
          </div>
          <a class="btn btn-ghost" href="${url}" target="_blank" rel="noreferrer">Open Repository</a>
        </article>
      `;
    })
    .join("");

  githubProjects.innerHTML = cards;
  document.querySelectorAll(".repo-card.tilt-card").forEach((card) => {
    card.addEventListener("mousemove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(900px) rotateX(${y * -8}deg) rotateY(${x * 10}deg)`;
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg)";
    });
  });
}

async function loadGithubProjects() {
  if (!githubProjects) return;

  try {
    const response = await fetch("https://api.github.com/users/chill-4u/repos?sort=updated&per_page=6");
    if (!response.ok) throw new Error("GitHub API not available");
    const repos = await response.json();

    const filtered = repos
      .filter((repo) => !repo.fork)
      .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
      .slice(0, 6);

    if (!filtered.length) throw new Error("No repos found");
    renderGithubProjects(filtered);
  } catch (error) {
    const fallbackRepos = [
      {
        name: "MoodLens",
        description: "AI-powered sentiment analysis web app with Positive/Negative/Neutral prediction.",
        language: "JavaScript",
        stargazers_count: 0,
        html_url: "https://github.com/chill-4u",
      },
      {
        name: "Speech Recognition System",
        description: "Real-time end-to-end speech recognition pipeline: MFCC, CNN+BiLSTM, CTC.",
        language: "Python",
        stargazers_count: 0,
        html_url: "https://github.com/chill-4u",
      },
      {
        name: "Regional Map of Uttarakhand",
        description: "Map-based project for regional travel and destination routing.",
        language: "Python",
        stargazers_count: 0,
        html_url: "https://github.com/chill-4u",
      },
      {
        name: "C to Python Converter",
        description: "Converts C code to Python using flex, bison, and Flask.",
        language: "C",
        stargazers_count: 0,
        html_url: "https://github.com/chill-4u",
      },
    ];
    renderGithubProjects(fallbackRepos);
  }
}

loadGithubProjects();

// 1. Dynamic Typing Effect
const words = ["Full Stack Developer", "DSA Enthusiast", "AI & ML Explorer", "Linux Geek", "Problem Solver"];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typingEl = document.getElementById("typingText");

function type() {
    const currentWord = words[wordIndex];
    if (isDeleting) {
        typingEl.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typingEl.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;
    }

    if (!isDeleting && charIndex === currentWord.length) {
        isDeleting = true;
        setTimeout(type, 1500);
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        setTimeout(type, 400);
    } else {
        setTimeout(type, isDeleting ? 50 : 100);
    }
}
type();

// 2. 3D Tilt Effect on Photo Card
const card = document.getElementById("tiltPhoto");
if (card) {
    card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        card.style.transform = `rotateY(${x / 10}deg) rotateX(${-y / 10}deg) scale(1.03)`;
    });

    card.addEventListener("mouseleave", () => {
        card.style.transform = "rotateY(0deg) rotateX(0deg) scale(1)";
    });
}

// 3. Dynamic Category Filtering
const filterBtns = document.querySelectorAll(".filter-btn");
const skillCards = document.querySelectorAll(".skill-card");

filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        filterBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        const targetCategory = btn.getAttribute("data-category");

        skillCards.forEach(card => {
            if (targetCategory === "all" || card.getAttribute("data-category") === targetCategory) {
                card.classList.remove("hide");
            } else {
                card.classList.add("hide");
            }
        });
    });
});

// 4. Particle Background Animation
const canvas = document.getElementById("bgCanvas");
const ctx = canvas.getContext("2d");
let particles = [];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1;
        this.speedX = (Math.random() - 0.5) * 1.2;
        this.speedY = (Math.random() - 0.5) * 1.2;
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
    }
    draw() {
        ctx.fillStyle = "rgba(56, 189, 248, 0.5)";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

for (let i = 0; i < 45; i++) {
    particles.push(new Particle());
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p, index) => {
        p.update();
        p.draw();

        for (let j = index + 1; j < particles.length; j++) {
            const dx = p.x - particles[j].x;
            const dy = p.y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 120) {
                ctx.strokeStyle = `rgba(56, 189, 248, ${0.15 - (dist / 120) * 0.15})`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }
    });
    requestAnimationFrame(animateParticles);
}
animateParticles();

// 5. Scroll Counter Animation
const counters = document.querySelectorAll(".counter");
let counted = false;

window.addEventListener("scroll", () => {
    const statsSection = document.querySelector(".stats-section");
    if (!statsSection) return;
    
    const statsPos = statsSection.offsetTop - window.innerHeight;
    if (window.scrollY > statsPos && !counted) {
        counters.forEach(counter => {
            const target = +counter.getAttribute("data-target");
            let count = 0;
            const step = Math.ceil(target / 40);

            const timer = setInterval(() => {
                count += step;
                if (count >= target) {
                    counter.innerText = target + "+";
                    clearInterval(timer);
                } else {
                    counter.innerText = count;
                }
            }, 35);
        });
        counted = true;
    }
});

// 6. Interactive Terminal CLI
const termModal = document.getElementById("terminalModal");
const openTerm = document.getElementById("openTerminal");
const closeTerm = document.getElementById("closeTerminal");
const termInput = document.getElementById("termInput");
const termOutput = document.getElementById("termOutput");

if (openTerm && closeTerm && termModal) {
    openTerm.addEventListener("click", () => {
        termModal.style.display = "flex";
        termInput.focus();
    });

    closeTerm.addEventListener("click", () => {
        termModal.style.display = "none";
    });

    termInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            const cmd = termInput.value.trim().toLowerCase();
            const newLine = document.createElement("p");
            newLine.innerHTML = `<span style="color:#10b981;">$</span> ${cmd}`;
            termOutput.appendChild(newLine);

            let res = document.createElement("p");
            switch(cmd) {
                case "help":
                    res.innerHTML = "Available: <span style='color:#f59e0b;'>skills</span>, <span style='color:#f59e0b;'>about</span>, <span style='color:#f59e0b;'>hire</span>, <span style='color:#f59e0b;'>clear</span>";
                    break;
                case "skills":
                    res.innerText = "DSA, JavaScript, Python, C, Linux, Machine Learning, Team Communication.";
                    break;
                case "about":
                    res.innerText = "B.Tech Computer Science student ready for Software Engineer / Developer roles.";
                    break;
                case "hire":
                    res.innerHTML = "<span style='color:#10b981;'>Thanks! Contact me via email or LinkedIn.</span>";
                    break;
                case "clear":
                    termOutput.innerHTML = "";
                    termInput.value = "";
                    return;
                default:
                    res.innerHTML = `<span style='color:#ef4444;'>Command not found: ${cmd}. Type 'help'.</span>`;
            }
            termOutput.appendChild(res);
            termInput.value = "";
            termOutput.scrollTop = termOutput.scrollHeight;
        }
    });
}
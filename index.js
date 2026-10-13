
/* =========================================
   SULTAN ANSARI — DIGITAL UNIVERSE
   index.js
========================================= */

"use strict";

// 1. GALAXY STARFIELD

const canvas = document.getElementById("starfield");
const ctx = canvas ? canvas.getContext("2d") : null;

let stars = [];
let canvasWidth = 0;
let canvasHeight = 0;
let animationFrame = null;

const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
).matches;

function resizeStarfield() {
    if (!canvas || !ctx) return;

    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);

    canvasWidth = window.innerWidth;
    canvasHeight = window.innerHeight;

    canvas.width = Math.round(canvasWidth * pixelRatio);
    canvas.height = Math.round(canvasHeight * pixelRatio);

    canvas.style.width = `${canvasWidth}px`;
    canvas.style.height = `${canvasHeight}px`;

    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

    const starCount = Math.min(
        180,
        Math.floor((canvasWidth * canvasHeight) / 6500)
    );

    stars = Array.from({ length: starCount }, () => ({
        x: Math.random() * canvasWidth,
        y: Math.random() * canvasHeight,
        radius: Math.random() * 1.25 + 0.2,
        opacity: Math.random() * 0.55 + 0.2,
        twinkleSpeed: Math.random() * 0.015 + 0.003,
        phase: Math.random() * Math.PI * 2,
        blue: Math.random() > 0.65
    }));

    drawStarfield(0);
}

function drawStarfield(time = 0) {
    if (!ctx || !canvas) return;

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    for (const star of stars) {
        const twinkle = reducedMotion
            ? 1
            : 0.65 + Math.sin(
                time * star.twinkleSpeed + star.phase
            ) * 0.35;

        const alpha = Math.max(
            0.08,
            Math.min(1, star.opacity * twinkle)
        );

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);

        ctx.fillStyle = star.blue
            ? `rgba(130, 195, 255, ${alpha})`
            : `rgba(235, 243, 255, ${alpha})`;

        ctx.fill();
    }

    if (!reducedMotion) {
        animationFrame = requestAnimationFrame(drawStarfield);
    }
}

if (canvas && ctx) {
    resizeStarfield();

    window.addEventListener("resize", () => {
        if (animationFrame) {
            cancelAnimationFrame(animationFrame);
        }

        resizeStarfield();
    });
}

// 2. MOBILE NAVIGATION

const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

function closeMenu() {
    if (!menuToggle || !navLinks) return;

    navLinks.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
}

if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
        const isOpen = navLinks.classList.toggle("open");

        menuToggle.setAttribute("aria-expanded", String(isOpen));
        menuToggle.setAttribute(
            "aria-label",
            isOpen ? "Close navigation" : "Open navigation"
        );
    });

    navLinks.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", event => {
        if (event.key === "Escape") {
            closeMenu();
        }
    });

    document.addEventListener("click", event => {
        if (
            navLinks.classList.contains("open") &&
            !navLinks.contains(event.target) &&
            !menuToggle.contains(event.target)
        ) {
            closeMenu();
        }
    });
}

// 3. ROTATING HERO ROLE

const roleText = document.getElementById("roleText");

const roles = [
    "AI Explorer.",
    "Data Enthusiast.",
    "Problem Solver.",
    "Digital Builder.",
    "Lifelong Learner."
];

let roleIndex = 0;

if (roleText && !reducedMotion) {
    window.setInterval(() => {
        roleText.style.opacity = "0";

        window.setTimeout(() => {
            roleIndex = (roleIndex + 1) % roles.length;
            roleText.textContent = roles[roleIndex];
            roleText.style.opacity = "1";
        }, 200);
    }, 2600);
}

// 4. SCROLL REVEAL ANIMATIONS

const revealElements = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window && !reducedMotion) {
    const revealObserver = new IntersectionObserver(
        entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    revealObserver.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.08,
            rootMargin: "0px 0px -25px 0px"
        }
    );

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });
} else {
    revealElements.forEach(element => {
        element.classList.add("visible");
    });
}

// 5. COPY BUTTONS

const toast = document.getElementById("toast");
let toastTimer;

function showToast(message) {
    if (!toast) return;

    toast.textContent = message;
    toast.classList.add("show");

    window.clearTimeout(toastTimer);

    toastTimer = window.setTimeout(() => {
        toast.classList.remove("show");
    }, 2400);
}

async function copyText(text) {
    try {
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(text);
        } else {
            // Fallback for local file / older browser environments.
            const temporaryInput = document.createElement("textarea");

            temporaryInput.value = text;
            temporaryInput.setAttribute("readonly", "");
            temporaryInput.style.position = "fixed";
            temporaryInput.style.left = "-9999px";
            temporaryInput.style.top = "0";

            document.body.appendChild(temporaryInput);
            temporaryInput.select();

            const copied = document.execCommand("copy");
            temporaryInput.remove();

            if (!copied) {
                throw new Error("Copy command was unsuccessful.");
            }
        }

        showToast("Copied to clipboard ✦");
    } catch (error) {
        console.error("Copy failed:", error);
        showToast("Copy unavailable. Please select the text manually.");
    }
}

document.querySelectorAll("[data-copy]").forEach(button => {
    button.addEventListener("click", async () => {
        const text = button.getAttribute("data-copy");

        if (text) {
            await copyText(text);
        }
    });
});

// 6. AUTOMATIC COPYRIGHT YEAR

const yearElement = document.getElementById("year");

if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
}

// 7. SUBTLE POINTER GLOW FOR DESKTOP CARDS

const hoverCards = document.querySelectorAll(
    ".glass-card, .value-card"
);

if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    hoverCards.forEach(card => {
        card.addEventListener("pointermove", event => {
            const bounds = card.getBoundingClientRect();

            const x = event.clientX - bounds.left;
            const y = event.clientY - bounds.top;

            card.style.backgroundImage =
                `radial-gradient(300px circle at ${x}px ${y}px, ` +
                `rgba(48, 107, 180, 0.10), transparent 75%), ` +
                `linear-gradient(145deg, rgba(17, 28, 47, 0.8), ` +
                `rgba(8, 13, 23, 0.86))`;
        });

        card.addEventListener("pointerleave", () => {
            card.style.backgroundImage = "";
        });
    });
}

console.log(
    "%c Sultan Ansari | Digital Universe ",
    "background:#07172d;color:#8ccaff;padding:8px;border-radius:5px;font-weight:bold"
);

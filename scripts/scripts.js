// QUOTE ROTATOR
const quotes = [
  { text: "Winter is Coming", author: "House Stark" },
  { text: "A Lannister always pays his debts", author: "House Lannister" },
  { text: "The night is dark and full of terrors", author: "Melisandre" },
  { text: "I am the blood of the dragon", author: "Daenerys Targaryen" },
  { text: "Hold the door", author: "Hodor" }
];

let quoteIdx = 0;
const q = document.querySelector('#quote-rotator blockquote');
const c = document.querySelector('#quote-rotator cite');

function rotateQuote() {
  q.style.opacity = 0;
  setTimeout(() => {
    q.textContent = quotes[quoteIdx].text;
    c.textContent = `— ${quotes[quoteIdx].author}`;
    q.style.opacity = 1;
    quoteIdx = (quoteIdx + 1) % quotes.length;
  }, 600);
}
setInterval(rotateQuote, 7000);
rotateQuote();

// DRAGON ANIMATIONS WITH GSAP
gsap.registerPlugin(ScrollTrigger);

// Dragon 1: Left → Right
gsap.to(".dragon1", {
  x: "140vw",
  opacity: 1,
  duration: 3.5,
  ease: "power2.inOut",
  scrollTrigger: {
    trigger: "#dragon-trigger",
    start: "top center",
    end: "bottom center",
    toggleActions: "play reset play reset" // Play on enter/enterBack, reset on leave/leaveBack
  }
});

// Dragon 2: Right → Left
gsap.to(".dragon2", {
  x: "-140vw",
  opacity: 1,
  duration: 3.5,
  ease: "power2.inOut",
  scrollTrigger: {
    trigger: "#dragon-trigger",
    start: "top center",
    end: "bottom center",
    toggleActions: "play reset play reset"
  }
});

// Dragon 3: Top → Center + Fire
gsap.to(".dragon3", {
  y: "60vh",
  opacity: 1,
  duration: 2.5,
  ease: "bounce.out",
  scrollTrigger: {
    trigger: "#dragon-trigger",
    start: "top center",
    end: "bottom center",
    toggleActions: "play reset play reset",
    onEnter: () => setTimeout(triggerFire, 1500), // Fire after dragon lands (downward scroll)
    onEnterBack: () => setTimeout(triggerFire, 1500) // Fire on upward scroll
  }
});

// FIRE EFFECT ON CANVAS
const canvas = document.getElementById("fire-canvas");
const ctx = canvas.getContext("2d");
let particles = [];
let smokeParticles = [];

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

class FireParticle {
  constructor() {
    this.x = canvas.width / 2; // Start at center (dragon3 position)
    this.y = canvas.height / 2;
    this.size = Math.random() * 80 + 30; // Larger for full-screen
    this.speedX = Math.random() * 12 - 6; // Wider spread
    this.speedY = Math.random() * 10 - 5; // More chaotic motion
    this.life = Math.random() * 80 + 80;
    this.hue = Math.random() < 0.1 ? Math.random() * 20 + 200 : Math.random() * 50; // Rare blue
    this.brightness = Math.random() * 30 + 60;
    this.alpha = 1;
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.speedY -= 0.15; // Rise like flames
    this.size *= 0.98;
    this.life -= 1;
    this.alpha = this.life / 100;
    this.brightness = Math.max(40, this.brightness - 0.5);
  }
  draw() {
    ctx.fillStyle = `hsla(${this.hue}, 100%, ${this.brightness}%, ${this.alpha})`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

class SmokeParticle {
  constructor() {
    this.x = canvas.width / 2;
    this.y = canvas.height / 2;
    this.size = Math.random() * 100 + 50;
    this.speedX = Math.random() * 8 - 4;
    this.speedY = Math.random() * -6 - 3; // Rise faster
    this.life = Math.random() * 100 + 100;
    this.alpha = 0.4;
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.size *= 1.02;
    this.life -= 1;
    this.alpha = Math.max(0, this.alpha - 0.005);
  }
  draw() {
    ctx.fillStyle = `rgba(50, 50, 50, ${this.alpha})`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

function triggerFire() {
  canvas.style.opacity = 0;
  gsap.to(canvas, { opacity: 1, duration: 0.5 }); // Dramatic fade-in
  particles = [];
  smokeParticles = [];
  for (let i = 0; i < 150; i++) { // Dense full-screen fire
    particles.push(new FireParticle());
  }
  for (let i = 0; i < 50; i++) {
    smokeParticles.push(new SmokeParticle());
  }
  animateFire();
}

function animateFire() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.1)"; // Subtle background glow
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  particles.forEach((p, i) => {
    p.update();
    p.draw();
    if (p.life <= 0) particles.splice(i, 1);
  });
  smokeParticles.forEach((s, i) => {
    s.update();
    s.draw();
    if (s.life <= 0) smokeParticles.splice(i, 1);
  });
  if (particles.length > 0 || smokeParticles.length > 0) {
    requestAnimationFrame(animateFire);
  } else {
    gsap.to(canvas, { opacity: 0, duration: 1 }); // Dramatic fade-out
  }
}
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
  scrollTrigger: {
    trigger: "#dragon-trigger",
    start: "top center",
    toggleActions: "play none none reverse"
  },
  x: "140vw",
  opacity: 1,
  duration: 3.5,
  ease: "power2.inOut"
});

// Dragon 2: Right → Left
gsap.to(".dragon2", {
  scrollTrigger: {
    trigger: "#dragon-trigger",
    start: "top center"
  },
  x: "-140vw",
  opacity: 1,
  duration: 3.5,
  ease: "power2.inOut"
});

// Dragon 3: Top → Center + Fire
gsap.to(".dragon3", {
  scrollTrigger: {
    trigger: "#dragon-trigger",
    start: "top center",
    onEnter: () => setTimeout(triggerFire, 1500) // Fire after dragon lands
  },
  y: "60vh",
  opacity: 1,
  duration: 2.5,
  ease: "bounce.out",
  onComplete: () => {
    // Optional: make dragon3 breathe fire repeatedly
  }
});

// FIRE EFFECT ON CANVAS
const canvas = document.getElementById("fire-canvas");
const ctx = canvas.getContext("2d");
let particles = [];

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

class Particle {
  constructor() {
    this.x = canvas.width / 2;
    this.y = canvas.height / 3;
    this.size = Math.random() * 60 + 40;
    this.speedX = Math.random() * 8 - 4;
    this.speedY = Math.random() * 6 - 3;
    this.life = 100;
    this.color = `hsl(${Math.random() * 40 + 10}, 100%, 60%)`;
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.speedY += 0.1;
    this.life -= 2;
  }
  draw() {
    ctx.fillStyle = this.color;
    ctx.globalAlpha = this.life / 100;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

function triggerFire() {
  canvas.style.opacity = 1;
  for (let i = 0; i < 80; i++) {
    particles.push(new Particle());
  }
  animateFire();
}

function animateFire() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach((p, i) => {
    p.update();
    p.draw();
    if (p.life <= 0) particles.splice(i, 1);
  });
  if (particles.length > 0) {
    requestAnimationFrame(animateFire);
  } else {
    canvas.style.opacity = 0;
  }
}
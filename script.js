const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let W, H;

function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
}

resize();
window.addEventListener("resize", resize);

// Posisi neuron
let neuron1 = {
    x: W * 0.25,
    y: H * 0.5
};

let neuron2 = {
    x: W * 0.75,
    y: H * 0.5
};

// Partikel impuls
let particles = [];

for (let i = 0; i < 10; i++) {
    particles.push({
        progress: Math.random(),
        speed: 0.004 + Math.random() * 0.004
    });
}

// Bintang latar
let stars = [];

for (let i = 0; i < 100; i++) {
    stars.push({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 1.5,
        a: Math.random()
    });
}

function drawBackground() {
    ctx.fillStyle = "#050816";
    ctx.fillRect(0, 0, W, H);

    stars.forEach(s => {
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(100,220,255,${s.a})`;
        ctx.fill();
    });
}

function glowCircle(x, y, r, color) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.shadowBlur = 25;
    ctx.shadowColor = color;
    ctx.fillStyle = color;
    ctx.fill();
    ctx.shadowBlur = 0;
}

function drawNeuron(n, flip = false) {

    // Dendrit
    for (let i = 0; i < 12; i++) {

        let angle = (i / 12) * Math.PI * 2;

        let length = 70 + Math.random() * 30;

        let x1 = n.x;
        let y1 = n.y;

        let x2 = n.x + Math.cos(angle) * length;
        let y2 = n.y + Math.sin(angle) * length;

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);

        ctx.strokeStyle = "#24d9ff";
        ctx.lineWidth = 3;
        ctx.shadowBlur = 12;
        ctx.shadowColor = "#00eaff";
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Cabang dendrit
        for (let j = 0; j < 2; j++) {

            let bx = x2 + Math.cos(angle + 0.5 * (j ? 1 : -1)) * 25;
            let by = y2 + Math.sin(angle + 0.5 * (j ? 1 : -1)) * 25;

            ctx.beginPath();
            ctx.moveTo(x2, y2);
            ctx.lineTo(bx, by);
            ctx.strokeStyle = "#168ca8";
            ctx.lineWidth = 2;
            ctx.stroke();
        }
    }

    // Badan neuron
    let gradient = ctx.createRadialGradient(
        n.x - 10, n.y - 10, 5,
        n.x, n.y, 55
    );

    gradient.addColorStop(0, "#ffffff");
    gradient.addColorStop(0.25, "#51edff");
    gradient.addColorStop(1, "#07516b");

    ctx.beginPath();
    ctx.arc(n.x, n.y, 48, 0, Math.PI * 2);

    ctx.fillStyle = gradient;
    ctx.shadowBlur = 30;
    ctx.shadowColor = "#00eaff";
    ctx.fill();
    ctx.shadowBlur = 0;

    // Inti
    ctx.beginPath();
    ctx.arc(n.x, n.y, 17, 0, Math.PI * 2);
    ctx.fillStyle = "#09243b";
    ctx.fill();

    ctx.beginPath();
    ctx.arc(n.x - 5, n.y - 5, 6, 0, Math.PI * 2);
    ctx.fillStyle = "#ffffff";
    ctx.fill();
}

function drawAxon() {

    let startX = neuron1.x + 50;
    let endX = neuron2.x - 50;
    let y = H * 0.5;

    // Axon
    ctx.beginPath();
    ctx.moveTo(startX, y);
    ctx.lineTo(endX, y);

    ctx.strokeStyle = "#16627c";
    ctx.lineWidth = 14;
    ctx.lineCap = "round";
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(startX, y);
    ctx.lineTo(endX, y);

    ctx.strokeStyle = "#36dfff";
    ctx.lineWidth = 3;
    ctx.stroke();

    // Selubung mielin
    for (let x = startX + 30; x < endX - 30; x += 55) {

        ctx.beginPath();
        ctx.roundRect(x - 18, y - 12, 36, 24, 12);

        ctx.fillStyle = "#0b3448";
        ctx.strokeStyle = "#27b8d5";
        ctx.lineWidth = 2;

        ctx.fill();
        ctx.stroke();
    }

    // Terminal sinaps
    ctx.beginPath();
    ctx.arc(endX, y, 25, 0, Math.PI * 2);

    ctx.fillStyle = "#0b6d82";
    ctx.shadowBlur = 20;
    ctx.shadowColor = "#00eaff";
    ctx.fill();
    ctx.shadowBlur = 0;
}

function drawSynapse() {

    let x = (neuron1.x + neuron2.x) / 2;
    let y = H * 0.5;

    // Celah sinaps
    ctx.beginPath();
    ctx.moveTo(x - 20, y - 40);
    ctx.lineTo(x - 20, y + 40);

    ctx.moveTo(x + 20, y - 40);
    ctx.lineTo(x + 20, y + 40);

    ctx.strokeStyle = "#ff4fd8";
    ctx.lineWidth = 5;
    ctx.shadowBlur = 20;
    ctx.shadowColor = "#ff4fd8";
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Neurotransmitter
    for (let i = 0; i < 8; i++) {

        let a = performance.now() / 1000 + i;

        let px = x - 15 + Math.sin(a * 2 + i) * 20;
        let py = y - 25 + ((a * 30 + i * 20) % 50);

        ctx.beginPath();
        ctx.arc(px, py, 4, 0, Math.PI * 2);

        ctx.fillStyle = "#ff73e5";
        ctx.shadowBlur = 15;
        ctx.shadowColor = "#ff4fd8";
        ctx.fill();
        ctx.shadowBlur = 0;
    }
}

function drawParticles() {

    let startX = neuron1.x + 50;
    let endX = neuron2.x - 50;
    let y = H * 0.5;

    particles.forEach(p => {

        p.progress += p.speed;

        if (p.progress > 1) {
            p.progress = 0;
        }

        let x = startX + (endX - startX) * p.progress;

        // Cahaya impuls
        ctx.beginPath();
        ctx.arc(x, y, 7, 0, Math.PI * 2);

        ctx.fillStyle = "#ffffff";
        ctx.shadowBlur = 25;
        ctx.shadowColor = "#00ffff";
        ctx.fill();

        ctx.shadowBlur = 0;

        // Ekor cahaya
        ctx.beginPath();
        ctx.moveTo(x - 25, y);
        ctx.lineTo(x, y);

        ctx.strokeStyle = "rgba(0,255,255,0.4)";
        ctx.lineWidth = 4;
        ctx.stroke();
    });
}

function animate() {

    drawBackground();

    // Update posisi agar responsif
    neuron1.x = W * 0.25;
    neuron1.y = H * 0.5;

    neuron2.x = W * 0.75;
    neuron2.y = H * 0.5;

    drawAxon();

    drawNeuron(neuron1);
    drawNeuron(neuron2);

    drawSynapse();

    drawParticles();

    requestAnimationFrame(animate);
}

animate();

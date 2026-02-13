document.addEventListener('DOMContentLoaded', () => {
    // --- Elements ---
    const cursor = document.querySelector('.cursor');
    const sections = {
        hero: document.getElementById('hero'),
        message: document.getElementById('message'),
        question: document.getElementById('question')
    };
    const buttons = {
        start: document.getElementById('start-btn'),
        next: document.getElementById('next-btn'),
        yes: document.getElementById('yes-btn'),
        no: document.getElementById('no-btn'),
        music: document.getElementById('music-toggle')
    };
    const audio = document.getElementById('bg-music');
    const celebrationPopup = document.getElementById('celebration-popup');
    const musicIcon = buttons.music.querySelector('.icon');

    // --- Custom Cursor Logic ---
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });

    // Add hover effect to interactive elements
    const interactiveElements = document.querySelectorAll('button, a');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('hovered'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('hovered'));
    });

    // --- Navigation Logic ---
    function switchSection(fromId, toId) {
        const fromSection = sections[fromId];
        const toSection = sections[toId];

        // Animate out
        fromSection.classList.remove('active-section');
        fromSection.classList.add('exit-section'); // Add exit class for better transition

        setTimeout(() => {
            fromSection.classList.add('hidden-section');
            fromSection.classList.remove('exit-section');

            // Animate in
            toSection.classList.remove('hidden-section');
            // Small delay to allow display block to take effect before opacity transition
            setTimeout(() => {
                toSection.classList.add('active-section');
            }, 50);
        }, 500); // Matches CSS transition time
    }

    buttons.start.addEventListener('click', () => {
        switchSection('hero', 'message');
        // Auto-play music on first user interaction if not already playing
        if (audio.paused) {
            playMusic();
        }
    });

    buttons.next.addEventListener('click', () => {
        switchSection('message', 'question');
    });

    // --- Music Control ---
    let isMusicPlaying = false;

    function playMusic() {
        audio.play().then(() => {
            isMusicPlaying = true;
            musicIcon.textContent = '🎵'; // Unmuted icon
        }).catch(err => {
            console.log("Audio play failed (waiting for interaction):", err);
        });
    }

    function toggleMusic() {
        if (isMusicPlaying) {
            audio.pause();
            musicIcon.textContent = '🔇';
            isMusicPlaying = false;
        } else {
            playMusic();
        }
    }

    buttons.music.addEventListener('click', toggleMusic);

    // --- "No" Button Logic (The Runaway Button) ---
    // For mobile: move on touch start to prevent clicking
    buttons.no.addEventListener('touchstart', moveButton);
    buttons.no.addEventListener('mouseover', moveButton);

    function moveButton(e) {
        if (e.type === 'touchstart') e.preventDefault(); // Stop click on mobile

        const container = sections.question.querySelector('.glass-card');
        const containerRect = container.getBoundingClientRect();
        const btnRect = buttons.no.getBoundingClientRect();

        // Calculate boundaries within the card, keeping some padding
        const maxX = containerRect.width - btnRect.width - 20;
        const maxY = containerRect.height - btnRect.height - 20;

        const randomX = Math.random() * maxX;
        const randomY = Math.random() * maxY;

        // Apply new position. We use position absolute relative to the card.
        // We need to ensure the card has relative positioning (adding via JS style if not in CSS)
        container.style.position = 'relative';

        buttons.no.style.position = 'absolute';
        buttons.no.style.left = `${randomX}px`;
        buttons.no.style.top = `${randomY}px`;

        // Add a funny shake or scale effect
        buttons.no.innerText = getRandomNoText();
    }

    const noTexts = ["No 🙈", "Are you sure?", "Really?", "Try again!", "Nope!"];
    function getRandomNoText() {
        return noTexts[Math.floor(Math.random() * noTexts.length)];
    }

    // --- "Yes" Button Logic (Celebration) ---
    buttons.yes.addEventListener('click', () => {
        // 1. Confetti Explosion
        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#ff6961', '#ffd1dc', '#fff']
        });

        // Continuous confetti for a few seconds
        const duration = 3000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        const randomInRange = (min, max) => Math.random() * (max - min) + min;

        const interval = setInterval(function () {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
            confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
        }, 250);

        // 2. Show Popup
        celebrationPopup.classList.remove('hidden');

        // 3. Optional: Change background music to a celebration part or just keep playing
    });

    // --- Floating Hearts Background ---
    function createHeart() {
        const heart = document.createElement('div');
        heart.classList.add('heart');
        heart.innerText = ['❤️', '💖', '🌸', '✨', '🌹'][Math.floor(Math.random() * 5)];

        heart.style.left = Math.random() * 100 + 'vw';
        heart.style.animationDuration = Math.random() * 3 + 10 + 's'; // 10-13s
        heart.style.opacity = Math.random() * 0.5 + 0.3;
        heart.style.fontSize = Math.random() * 20 + 10 + 'px';

        document.querySelector('.hearts-container').appendChild(heart);

        setTimeout(() => {
            heart.remove();
        }, 15000);
    }

    setInterval(createHeart, 600);
});

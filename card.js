document.addEventListener('DOMContentLoaded', () => {
    const scene = document.getElementById('scene');
    const magicBox = document.getElementById('magic-box');
    const surpriseMessage = document.getElementById('surprise-message');
    const cardInner = document.querySelector('.card-inner');
    const particleContainer = document.getElementById('particle-container');
    const galaxySwirl = document.getElementById('galaxy-swirl');
    const magicSound = document.getElementById('magic-sound');
    const flipSound = document.getElementById('flip-sound');

    let isBoxOpen = false;
    let isLetterRevealed = false;

    // --- STAGE 1: Open the box ---
    const openBox = () => {
        if (isBoxOpen) return;
        isBoxOpen = true;

        magicBox.classList.add('open');
        magicSound.play();
        createParticles(30);
        galaxySwirl.classList.add('animate');

        setTimeout(() => {
            surpriseMessage.classList.add('is-clickable');
            surpriseMessage.addEventListener('click', revealLetter);
        }, 1000); 
    };

    // --- STAGE 2: Reveal the letter and hide the box ---
    const revealLetter = () => {
        if (isLetterRevealed) return;
        isLetterRevealed = true;

        surpriseMessage.classList.add('letter-reveal');
        magicBox.classList.add('box-fade-out');
        
        // **FIXED LOGIC HERE**
        // Remove the old listener and immediately add the new one for flipping.
        // This removes the timing bug.
        surpriseMessage.removeEventListener('click', revealLetter);
        surpriseMessage.classList.add('is-floating');
        surpriseMessage.addEventListener('click', flipCard);
    };

    // --- STAGE 3 & BEYOND: Flip the card back and forth ---
    const flipCard = () => {
        cardInner.classList.toggle('is-flipped');
        flipSound.play();
    }

    // --- Parallax Mouse Movement ---
    const handleMouseMove = (e) => {
        const { clientX, clientY } = e;
        const { innerWidth, innerHeight } = window;
        const mouseX = (clientX / innerWidth) * 2 - 1;
        const mouseY = -(clientY / innerHeight) * 2 + 1;
        const maxRotation = 10;
        scene.style.transform = `rotateY(${mouseX * maxRotation}deg) rotateX(${mouseY * maxRotation}deg)`;
    };

    // --- Particle Creation ---
    const createParticles = (count) => {
        const colors = ['#ffc700', '#ffde59', '#ffffff', '#f0f8ff'];
        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            particle.classList.add('particle');
            const randomColor = colors[Math.floor(Math.random() * colors.length)];
            const endX = (Math.random() * 400 - 200) + 'px';
            const endY = (Math.random() * 400 - 200) + 'px';
            const endScale = Math.random() * 0.5;
            particle.style.setProperty('--color', randomColor);
            particle.style.setProperty('--transform-end', `translate(${endX}, ${endY}) scale(${endScale})`);
            particleContainer.appendChild(particle);
            particle.addEventListener('animationend', () => particle.remove());
        }
    };

    // Attach event listeners
    magicBox.addEventListener('click', openBox);
    window.addEventListener('mousemove', handleMouseMove);
});
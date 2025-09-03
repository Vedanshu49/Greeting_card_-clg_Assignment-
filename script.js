document.addEventListener('DOMContentLoaded', () => {
    // --- Get references to all elements ---
    const scene = document.getElementById('scene');
    const magicBox = document.getElementById('magic-box');
    const surpriseMessage = document.getElementById('surprise-message');
    const cardInner = document.querySelector('.card-inner');
    const flipButton = document.getElementById('flip-button');
    const particleContainer = document.getElementById('particle-container');
    const galaxySwirl = document.getElementById('galaxy-swirl');
    const magicSound = document.getElementById('magic-sound');
    const flipSound = document.getElementById('flip-sound');

    // --- State Flags ---
    let isBoxOpen = false;
    let isCardRevealed = false;

    // --- Main Click Handler for the Box ---
    const handleBoxClick = () => {
        if (isBoxOpen) return;
        isBoxOpen = true;

        // **FIX:** Play sound immediately as the FIRST action.
        magicSound.play().catch(error => console.error("Magic sound failed:", error));

        // Now, proceed with animations.
        magicBox.classList.add('open');
        createParticles(30);
        galaxySwirl.classList.add('animate');
        magicBox.removeEventListener('click', handleBoxClick);
        
        setTimeout(() => {
            surpriseMessage.classList.add('is-clickable');
            surpriseMessage.addEventListener('click', revealCard);
        }, 1000);
    };

    // --- Click Handler to Reveal the Card ---
    const revealCard = () => {
        if (isCardRevealed) return;
        isCardRevealed = true;

        surpriseMessage.classList.add('letter-reveal');
        magicBox.classList.add('box-fade-out');
        surpriseMessage.classList.remove('is-clickable');
        flipButton.classList.add('visible');
        
        surpriseMessage.addEventListener('transitionend', function(event) {
            if (event.propertyName === 'transform') {
                surpriseMessage.classList.add('is-floating');
            }
        }, { once: true });
    };

    // --- Click Handler for the Flip Button ---
    const handleFlipButtonClick = () => {
        // **FIX:** Play sound immediately as the FIRST action.
        flipSound.play().catch(error => console.error("Flip sound failed:", error));
        
        // Now, proceed with the animation.
        cardInner.classList.toggle('is-flipped');
    };

    // --- Floating Card Mouse Movement ---
    const handleMouseMove = (e) => {
        if (!isCardRevealed) return;
        const { clientX, clientY } = e;
        const { innerWidth, innerHeight } = window;
        const mouseX = (clientX / innerWidth) - 0.5;
        const mouseY = (clientY / innerHeight) - 0.5;
        const maxOffset = 30;
        surpriseMessage.style.setProperty('--mouse-x', `${mouseX * maxOffset}px`);
        surpriseMessage.style.setProperty('--mouse-y', `${mouseY * maxOffset}px`);
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

    // --- Attach the initial event listeners ---
    magicBox.addEventListener('click', handleBoxClick);
    flipButton.addEventListener('click', handleFlipButtonClick);
    window.addEventListener('mousemove', handleMouseMove);
});
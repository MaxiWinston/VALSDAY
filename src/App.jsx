import { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import './index.css';

function App() {
  const [step, setStep] = useState(0); // 0: Hero, 1: Message, 2: Question
  const [celebrating, setCelebrating] = useState(false);
  const [noBtnPosition, setNoBtnPosition] = useState({ top: 'auto', left: 'auto', position: 'static' });
  const [noBtnText, setNoBtnText] = useState('No 🙈');
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);

  const audioRef = useRef(null);
  const questionCardRef = useRef(null);

  // --- Music Logic ---
  const toggleMusic = () => {
    if (audioRef.current) {
      if (isMusicPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(e => console.log("Audio play failed:", e));
      }
      setIsMusicPlaying(!isMusicPlaying);
    }
  };

  const handleStart = () => {
    setStep(1);
    // Try auto-play on first interaction
    if (audioRef.current && !isMusicPlaying) {
      audioRef.current.play().then(() => setIsMusicPlaying(true)).catch(() => { });
    }
  };

  // --- No Button Logic ---
  const moveNoButton = (e) => {
    if (e.type === 'touchstart') e.preventDefault(); // Stop click on mobile

    if (questionCardRef.current) {
      const cardRect = questionCardRef.current.getBoundingClientRect();
      const btnWidth = 100; // Approx
      const btnHeight = 50; // Approx

      const maxX = cardRect.width - btnWidth - 20;
      const maxY = cardRect.height - btnHeight - 20;

      const randomX = Math.random() * maxX;
      const randomY = Math.random() * maxY;

      setNoBtnPosition({
        position: 'absolute',
        left: `${randomX}px`,
        top: `${randomY}px`
      });

      const texts = ["No 🙈", "Are you sure?", "Really?", "Try again!", "Nope!"];
      setNoBtnText(texts[Math.floor(Math.random() * texts.length)]);
    }
  };

  // --- Yes Button Logic ---
  const handleYes = () => {
    setCelebrating(true);

    // Confetti Explosion
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#ff0033', '#ffffff', '#000000'] // Theme colors
    });

    // Continuous Confetti
    const duration = 3000;
    const end = Date.now() + duration;

    const interval = setInterval(() => {
      if (Date.now() > end) {
        return clearInterval(interval);
      }
      confetti({
        particleCount: 20,
        startVelocity: 30,
        spread: 360,
        origin: {
          x: Math.random(),
          y: Math.random() - 0.2
        },
        colors: ['#ff0033', '#ffffff', '#000000']
      });
    }, 200);
  };

  return (
    <div className="app-container">
      {/* Background Hearts */}
      <div className="hearts-container">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="heart"
            style={{
              left: `${Math.random() * 100}vw`,
              animationDuration: `${Math.random() * 5 + 10}s`,
              animationDelay: `${Math.random() * 5}s`
            }}
          >
            {['❤️', '💖', '🌸', '✨', '🌹'][Math.floor(Math.random() * 5)]}
          </div>
        ))}
      </div>

      {/* Music Control */}
      <div className="music-control">
        <button onClick={toggleMusic} className="music-btn" aria-label="Toggle music">
          {isMusicPlaying ? '🎵' : '🔇'}
        </button>
        <audio ref={audioRef} loop>
          <source src="/music.mp3" type="audio/mpeg" />
        </audio>
      </div>

      <main>
        {/* Section 1: Hero */}
        <section className={step === 0 ? "glass-card active-section" : "glass-card hidden-section"}>
          <h1>Hey Adwoa Dwumaa Oppong <span className="heart-pulse">❤️</span></h1>
          <p className="subtext">I wanted to ask you something in a special way…</p>
          <button onClick={handleStart} className="primary-btn">Click Me 💌</button>
        </section>

        {/* Section 2: Message */}
        <section className={step === 1 ? "glass-card active-section" : step > 1 ? "glass-card hidden-section" : "glass-card hidden-section"}>
          <p className="romantic-text">
            I really enjoy talking to you and you’re my favorite person..
            <br /><br />
            So I thought… why not ask you properly?
          </p>
          <button onClick={() => setStep(2)} className="primary-btn">Next 🌹</button>
        </section>

        {/* Section 3: Question */}
        <section
          ref={questionCardRef}
          className={step === 2 ? "glass-card active-section" : "glass-card hidden-section"}
          style={{ position: 'relative' }} // For absolute button positioning
        >
          <h2>So… will you be my Valentine? 🌹</h2>
          <div className="buttons-container" style={{ marginTop: '2rem' }}>
            <button onClick={handleYes} className="yes-btn">YES 💖</button>
            <button
              className="no-btn"
              style={noBtnPosition}
              onMouseEnter={moveNoButton}
              onTouchStart={moveNoButton}
              onClick={moveNoButton} // Back up for mobile tap
            >
              {noBtnText}
            </button>
          </div>
        </section>
      </main>

      {/* Celebration Popup */}
      {celebrating && (
        <div className="popup">
          <div className="popup-content">
            <h2>Yay! ❤️</h2>
            <p>Okay, I’m officially in a good mood now.</p>
            <div className="floating-emojis">🌹 🍫 ✨</div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

export function HiddenLore() {
  const loreMessages = [
    { text: "DONT STOP WRITING", top: "15%", left: "10%", rotate: -5 },
    { text: "THE DEADLINE WATCHES", top: "25%", right: "15%", rotate: 3 },
    { text: "KEEP GOING", top: "45%", left: "8%", rotate: -8 },
    { text: "THEY ARE LISTENING", top: "60%", right: "12%", rotate: 5 },
    { text: "WRITE OR PERISH", top: "75%", left: "15%", rotate: -3 },
    { text: "NO ESCAPE", top: "35%", right: "8%", rotate: 7 },
    { text: "FINISH IT", top: "85%", left: "20%", rotate: -6 },
    { text: "THE WORDS DEMAND BLOOD", top: "20%", left: "85%", rotate: 4 },
  ];

  return (
    <div 
      className="hidden-lore-container"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1,
        pointerEvents: 'none',
      }}
    >
      {loreMessages.map((message, index) => (
        <div
          key={index}
          className="hidden-lore-text"
          style={{
            position: 'absolute',
            top: message.top,
            left: message.left,
            right: message.right,
            transform: `rotate(${message.rotate}deg)`,
            color: '#080808',
            fontSize: '24px',
            fontFamily: "'Caveat', cursive",
            fontWeight: 700,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            whiteSpace: 'nowrap',
            userSelect: 'none',
          }}
        >
          {message.text}
        </div>
      ))}

      {/* Scattered rune symbols */}
      <svg
        style={{
          position: 'absolute',
          top: '30%',
          left: '5%',
          width: '40px',
          height: '40px',
          fill: '#080808',
          transform: 'rotate(15deg)',
        }}
        viewBox="0 0 24 24"
      >
        <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" />
      </svg>

      <svg
        style={{
          position: 'absolute',
          top: '70%',
          right: '10%',
          width: '35px',
          height: '35px',
          fill: '#080808',
          transform: 'rotate(-20deg)',
        }}
        viewBox="0 0 24 24"
      >
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
      </svg>

      <svg
        style={{
          position: 'absolute',
          top: '50%',
          left: '90%',
          width: '30px',
          height: '30px',
          fill: '#080808',
          transform: 'rotate(45deg)',
        }}
        viewBox="0 0 24 24"
      >
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>

      <svg
        style={{
          position: 'absolute',
          top: '10%',
          right: '25%',
          width: '45px',
          height: '45px',
          fill: '#080808',
          transform: 'rotate(-10deg)',
        }}
        viewBox="0 0 24 24"
      >
        <path d="M12 2L1 21h22L12 2zm0 3.99L19.53 19H4.47L12 5.99zM11 16h2v2h-2v-2zm0-6h2v4h-2v-4z" />
      </svg>

      <svg
        style={{
          position: 'absolute',
          top: '80%',
          left: '70%',
          width: '38px',
          height: '38px',
          fill: '#080808',
          transform: 'rotate(25deg)',
        }}
        viewBox="0 0 24 24"
      >
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
      </svg>
    </div>
  );
}

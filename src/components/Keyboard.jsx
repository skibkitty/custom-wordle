const rows = [
  ["Q","W","E","R","T","Y","U","I","O","P"],
  ["A","S","D","F","G","H","J","K","L"],
  ["ENTER","Z","X","C","V","B","N","M","BACKSPACE"]
];

export default function Keyboard({ letterStates, onKeyPress }) {
  return (
    <div className="keyboard" aria-label="On-screen keyboard">
      {rows.map((row, rowIndex) => (
        <div className="keyboard-row" key={rowIndex}>
          {row.map((key) => (
            <button
              key={key}
              className={`key ${key.length > 1 ? "wide" : ""} ${letterStates[key] ?? ""}`}
              onClick={() => onKeyPress(key)}
              aria-label={key === "BACKSPACE" ? "Backspace" : key}
            >
              {key === "BACKSPACE" ? "⌫" : key}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}
import "../styles/componentsStyles/loading.css";

function LoadingComp({ barCount = 5, color = "rgba(0, 0, 0, 1)" }) {
  const bars = Array.from({ length: barCount });

  return (
    <div className="equalizer-wrapper">
      <div className="equalizer-container">
        {bars.map((_, i) => (
          <div
            key={i}
            className="equalizer-bar"
            style={{ animationDelay: `${i * 0.1}s`, backgroundColor: color }}
          ></div>
        ))}
      </div>
    </div>
  );
}

export default LoadingComp
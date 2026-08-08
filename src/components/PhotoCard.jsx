export default function PhotoCard({ youtuber }) {
  return (
    <div className="photo-card">
      <img className="photo-card-img" src={youtuber.image} alt={youtuber.name} />
      <div className="photo-card-info">
        <p className="eyebrow">{youtuber.channel}</p>
        <h2>{youtuber.name}</h2>
        <p className="photo-card-hint">
          This is a famous creator. The answer may or may not be their name.
        </p>
      </div>
    </div>
  );
}

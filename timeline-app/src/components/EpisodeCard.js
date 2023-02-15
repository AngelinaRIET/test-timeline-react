import "./EpisodeCard.css";
import { Paper, Grid } from "@material-ui/core";

function EpisodeCard({ episodes }) {
  return (
    <Paper className="episode-card">
      <Grid container spacing={2}>
        <Grid item xs={9}>
          <h2 className="episode-title">{episodes.episodeName}</h2>
          <h3 className="episode-code">{episodes.episodeCode}</h3>
        </Grid>
        <Grid item xs={2} className="date-section">
          <div className="day">{episodes.day}</div>
          <div className="month">{episodes.month}</div>
        </Grid>
        <Grid item xs={12}>
          <h4 className="char-title">Characters:</h4>
          <ul className="char-ul">
            {episodes.characters.map((character, index) => (
              <li key={index}>{character}</li>
            ))}
          </ul>
        </Grid>
      </Grid>
    </Paper>
  );
}

export default EpisodeCard;

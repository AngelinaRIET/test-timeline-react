import "./EpisodesTimeline.css";

import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent,
} from "@material-ui/lab";
import { makeStyles } from "@material-ui/core/styles";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTv } from "@fortawesome/free-solid-svg-icons";

import EpisodeCard from "./EpisodeCard";
import MonthButton from "./MonthButton";

// Defining custom styles using the makeStyles hook from Material UI
const useStyles = makeStyles((theme) => ({
  timeLine: {
    margin: "0 auto",
    padding: 0,
  },
  monthBtn: {
    display: "flex",
    justifyContent: "center",
  },

  timelineOppositeContentLeft: {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  timelineOppositeContentRight: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  customTimelineDot: {
    background: "#505AB8",
    width: "1rem",
    height: "1rem",
    margin: "0 10px",
  },
  customTimelineSeparator: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  customTimelineConnector: {
    display: "flex",
    justifyContent: "center",
    // alignItems: "center",

    height: "1%",
    background: "#505AB8",
    center: "center",
  },

  customMissingOppositeContent: {
    "&:before": {
      content: "none",
    },
  },
}));

function EpisodesTimeline({
  episodes,
  searchInput,
  dispatchSelectedMonth,
  months,
  selectedMonth,
}) {
  const classes = useStyles();

  return (
    <>
      <div className="episodeTimelineBlock">
        <div className="btnAndTimelineBlock">
          <div className={classes.monthBtn}>
            {searchInput === "" && (
              <MonthButton
                onMonthButtonClick={() =>
                  dispatchSelectedMonth({ type: "prev" })
                }
                monthName={months[(selectedMonth - 1 + 12) % 12]}
              />
            )}
          </div>
          <Timeline className={classes.timeLine}>
            <>
              {episodes.map((episode, index) => (
                <TimelineItem
                  key={index}
                  className={classes.customMissingOppositeContent}
                >
                  {index % 2 === 0 ? (
                    <>
                      <TimelineOppositeContent
                        className={classes.timelineOppositeContentLeft}
                      >
                        <FontAwesomeIcon icon={faTv} />
                      </TimelineOppositeContent>
                      <TimelineSeparator
                        className={classes.customTimelineSeparator}
                      >
                        <TimelineConnector
                          className={classes.customTimelineConnector}
                        />
                        <TimelineDot className={classes.customTimelineDot} />
                        <TimelineConnector
                          className={classes.customTimelineConnector}
                        />
                      </TimelineSeparator>
                      <TimelineContent className="timelineContentRight square">
                        <EpisodeCard episodes={episode} />
                      </TimelineContent>
                    </>
                  ) : (
                    <>
                      <TimelineContent className="timelineContentLeft">
                        <EpisodeCard episodes={episode} />
                      </TimelineContent>
                      <TimelineSeparator>
                        <TimelineConnector
                          className={classes.customTimelineConnector}
                        />
                        <TimelineDot className={classes.customTimelineDot} />

                        <TimelineConnector
                          className={classes.customTimelineConnector}
                        />
                      </TimelineSeparator>
                      <TimelineOppositeContent
                        className={classes.timelineOppositeContentRight}
                      >
                        <FontAwesomeIcon icon={faTv} />
                      </TimelineOppositeContent>
                    </>
                  )}
                </TimelineItem>
              ))}
            </>
          </Timeline>
          <div className={classes.monthBtn}>
            {searchInput === "" && (
              <MonthButton
                onMonthButtonClick={() =>
                  dispatchSelectedMonth({ type: "next" })
                }
                monthName={months[(selectedMonth + 1) % 12]}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default EpisodesTimeline;

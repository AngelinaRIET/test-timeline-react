import React, {
  useState,
  useEffect,
  useReducer,
  useCallback,
  useMemo,
} from "react";
import EpisodesTimeline from "./components/EpisodesTimeline";
import SearchBar from "./components/SearchBar";

import "./App.css";
import "./components/SearchBar.css";

import { fullMonths, abbreviatedMonths } from "./constants/constants";

// Reducer to update the selected month based on the action type
const selectedMonthReducer = (state, action) => {
  const handlers = {
    prev: () => (state - 1 + 12) % 12,
    next: () => (state + 1) % 12,
    set: () => action.payload,
  };
  // Return the handler for the current action type, or return the current state if no handler exists
  const handle = handlers[action.type] || (() => state);
  return handle();
};

function App() {
  const [episodes, setEpisodes] = useState([]);
  const [searchInput, setInputValue] = useState("");
  const [filteredEpisodes, setFilteredEpisodes] = useState([]);
  const [selectedMonth, dispatchSelectedMonth] = useReducer(
    selectedMonthReducer,
    episodes.length > 0 ? episodes[0].air_date.getMonth() : 0
  );

  // State to store if an error occurred during the API call
  const [error, setError] = useState(false);

  // Fetch data from Rick & Morty API and process it
  useEffect(() => {
    const fetchData = async () => {
      try {
        let episodesData, charactersData;
        // Check if the data is already in local storage
        const episodesDataInLocalStorage = localStorage.getItem("episodesData");
        const charactersDataInLocalStorage =
          localStorage.getItem("charactersData");
        if (episodesDataInLocalStorage && charactersDataInLocalStorage) {
          // If the data is in local storage, parse it
          episodesData = JSON.parse(episodesDataInLocalStorage);
          charactersData = JSON.parse(charactersDataInLocalStorage);
        } else {
          // If the data is not in local storage, fetch it from the API
          const [episodesData, charactersData] = await Promise.all([
            fetch("https://rickandmortyapi.com/api/episode/"),
            fetch("https://rickandmortyapi.com/api/character/"),
          ]);
          // Store the data in local storage for later use
          localStorage.setItem(
            "episodesData",
            JSON.stringify(episodesData.data)
          );
          localStorage.setItem(
            "charactersData",
            JSON.stringify(charactersData.data)
          );
        }
        // Process the episodes data by extracting the relevant information
        const processedEpisodes = episodesData.data.results.map((episode) => {
          const fullAirDate = new Date(episode.air_date);
          const dayAirDate = fullAirDate.getDate();
          const monthIndex = fullAirDate.getMonth();
          // abbreviatedMonths from the constants file
          const monthName = abbreviatedMonths[monthIndex];
          const yearAirDate = fullAirDate.getFullYear();

          // Get the names of the characters in the episode
          const charactersInEpisode = charactersData.data.results
            .filter((character) => episode.characters.includes(character.url))
            .map((character) => character.name);

          return {
            episodeName: episode.name,
            episodeCode: episode.episode,
            air_date: fullAirDate,
            day: dayAirDate,
            month: monthName,
            year: yearAirDate,
            characters: charactersInEpisode,
          };
        });
        // Find the first episode air date and set the selected month accordingly
        if (processedEpisodes.length > 0) {
          const firstEpisodeAirDate = processedEpisodes[0].air_date;
          const firstEpisodeMonthIndex = firstEpisodeAirDate.getMonth();
          dispatchSelectedMonth({
            type: "set",
            payload: firstEpisodeMonthIndex,
          });
        }

        setEpisodes(processedEpisodes);
      } catch (error) {
        setError(true);
      }
    };

    fetchData();
  }, []);

  // Filter the episodes by selected month only if the input value is empty
  useEffect(() => {
    if (searchInput === "") {
      setFilteredEpisodes(
        episodes.filter((episode) => {
          const episodeDate = new Date(episode.air_date);
          return episodeDate.getMonth() === selectedMonth;
        })
      );
    }
  }, [selectedMonth, episodes, searchInput]);

  //MONTH BUTTONS (previous & next months)
  const onMonthButtonClick = (value) => {
    if (value === -1) {
      dispatchSelectedMonth({ type: "prev" });
    } else {
      dispatchSelectedMonth({ type: "next" });
    }
  };

  //SEARCH BAR
  const onSearchInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const filteredEpisodesBySearchInput = useMemo(
    () =>
      episodes.filter((episode) => {
        return (
          episode.episodeCode
            .toLowerCase()
            .includes(searchInput.toLowerCase()) ||
          episode.episodeName.toLowerCase().includes(searchInput.toLowerCase())
        );
      }),
    [searchInput, episodes]
  );

  const onSearchSubmit = useCallback(
    (e) => {
      e.preventDefault();
      if (searchInput !== "") {
        setFilteredEpisodes(filteredEpisodesBySearchInput);
      }
    },
    [searchInput, filteredEpisodesBySearchInput]
  );

  return (
    <div className="App">

      {error && (
        <div className="error-message">
          An error occurred while trying to display the episodes of Rick & Morty
          Please try again later or check your network connection.
        </div>
      )}
      <SearchBar
        onSearchSubmit={onSearchSubmit}
        onSearchInputChange={onSearchInputChange}
        searchInput={searchInput}
      />
      <EpisodesTimeline
        searchInput={searchInput}
        selectedMonth={selectedMonth}
        episodes={filteredEpisodes}
        onMonthButtonClick={onMonthButtonClick}
        dispatchSelectedMonth={dispatchSelectedMonth}
        months={fullMonths}
      />
    </div>
  );
}

export default App;

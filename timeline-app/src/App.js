import React, { useState, useEffect, useReducer, useCallback } from "react";
import EpisodesTimeline from "./components/EpisodesTimeline";
import SearchBar from "./components/SearchBar";

import "./App.css";
import "./components/SearchBar.css";

import { fullMonths, abbreviatedMonths } from "./constants/constants";

// Function to fetch data from the Rick & Morty API
const get = async (endpoint) => {
  try {
    const res = await fetch(`https://rickandmortyapi.com/api/${endpoint}`);
    if (!res.ok) {
      // If the API returns an error status, throw an error with the status and statusText
      throw new Error(`${res.status} ${res.statusText}`);
    }
    const data = await res.json();
    return { data, status: res.status, statusMessage: res.statusText };
  } catch (error) {
    // If an error occurs during the fetch, return an object with empty data and the error message
    return { data: {}, status: 0, statusMessage: error.message };
  }
};

// Process the episodes data by extracting the relevant information
const processEpisodesData = (episodesData, charactersData) => {
  return episodesData.map((episode) => {
    const fullAirDate = new Date(episode.air_date);
    const dayAirDate = fullAirDate.getDate();
    const monthIndex = fullAirDate.getMonth();
    // abbreviatedMonths from the constants file
    const monthName = abbreviatedMonths[monthIndex];
    const yearAirDate = fullAirDate.getFullYear();

    // Get the names of the characters in the episode
    const charactersInEpisode = charactersData.results
      ? charactersData.results
          .filter((character) => episode.characters.includes(character.url))
          .map((character) => character.name)
      : [];

    return {
      episodeName: episode.name,
      episodeCode: episode.episode,
      air_date: fullAirDate,
      day: dayAirDate,
      month: monthName,
      year: yearAirDate,
      characters: charactersInEpisode,
      id: episode.id,
    };
  });
};

function filterEpisodesByMonth(episodes, monthIndex) {
  return episodes.filter((episode) => {
    const episodeDate = new Date(episode.air_date);
    return episodeDate.getMonth() === monthIndex;
  });
}

function filterEpisodesBySearchInput(episodes, searchInput) {
  return episodes.filter((episode) => {
    return (
      (episode.episodeCode ?? "")
        .toLowerCase()
        .includes(searchInput.toLowerCase()) ||
      (episode.episodeName ?? "")
        .toLowerCase()
        .includes(searchInput.toLowerCase())
    );
  });
}

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
  const [characters, setCharacters] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [filteredEpisodes, setFilteredEpisodes] = useState([]);
  const [selectedMonth, dispatchSelectedMonth] = useReducer(
    selectedMonthReducer,
    0
  );

  // State to store if an error occurred during the API call
  const [error, setError] = useState(false);

  // Fetch data from Rick & Morty API
  useEffect(() => {
    const fetchData = async (searchInput) => {
      try {
        // Check if the data is already in local storage
        const episodesDataInLocalStorage = localStorage.getItem("episodesData");
        const charactersDataInLocalStorage = localStorage.getItem("charactersData");
    
        let episodesData;
        let charactersData;
    
        if (episodesDataInLocalStorage && charactersDataInLocalStorage) {
          // If the data is in local storage, parse it
          episodesData = JSON.parse(episodesDataInLocalStorage);
          charactersData = JSON.parse(charactersDataInLocalStorage);
        } else {
          // If the data is not in local storage, fetch it from the API
          const [episodesResponse, charactersResponse] = await Promise.all([
            get(`episode/`, searchInput),
            get(`character/`, searchInput),
          ]);
          episodesData = episodesResponse.data;
          charactersData = charactersResponse.data;
    
          // Store the data in local storage for later use
          localStorage.setItem("episodesData", JSON.stringify(episodesData));
          localStorage.setItem("charactersData", JSON.stringify(charactersData));
        }
    
        setEpisodes(episodesData.results);
        setCharacters(charactersData);
    
        // Get the month index of the first episode
        const firstEpisodeMonthIndex = new Date(
          episodesData.results[0].air_date
        ).getMonth();
        dispatchSelectedMonth({ type: "set", payload: firstEpisodeMonthIndex });
      } catch (error) {
        setError(true);
      }
    };

    fetchData(searchInput);
  }, [searchInput]);

  useEffect(() => {
    if (episodes.length > 0 && characters) {
      const processedEpisodes = processEpisodesData(episodes, characters);
      let filtered = filterEpisodesByMonth(processedEpisodes, selectedMonth);
      setFilteredEpisodes(filtered);
    }
  }, [episodes, characters, selectedMonth]);

  // MONTH BUTTONS (previous & next months)
  const onMonthButtonClick = useCallback((value) => {
    dispatchSelectedMonth({ type: value === -1 ? "prev" : "next" });
  }, [dispatchSelectedMonth]);

  // SEARCH BAR
  const onSearchInputChange = (e) => {
    setSearchInput(e.target.value);
  };

  const onSearchSubmit = useCallback(
    (e) => {
      e.preventDefault();
      if (searchInput !== "") {
        const processedEpisodes = processEpisodesData(episodes, characters);
        const filtered = filterEpisodesBySearchInput(
          processedEpisodes,
          searchInput
        );
        setFilteredEpisodes(filtered);
      }
    },
    [searchInput, episodes, characters]
  );

  return (
    <div className="App">
      {error && (
        <div className="error-message">
          An error occurred while trying to display the episodes of Rick &
          Morty. Please try again later or check your network connection.
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
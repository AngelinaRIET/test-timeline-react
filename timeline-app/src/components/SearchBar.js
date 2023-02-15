import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import "./SearchBar.css";

function SearchBar({ onSearchSubmit, onSearchInputChange, searchInput }) {
  return (
    <div className="searchBarBlock">
      <form onSubmit={onSearchSubmit} className="search-form">
        <input
          type="text"
          placeholder="Search..."
          value={searchInput}
          onChange={onSearchInputChange}
          className="search-input"
        />
        <button type="submit" className="search-button">
          <FontAwesomeIcon icon={faSearch} />
        </button>
      </form>
    </div>
  );
}

export default SearchBar;
import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import useDebounce from '../../hook/useDebounce';
import styles from './SearchBar.module.css';

function SearchBar() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const wrapperRef = useRef(null);
  const debouncedQuery = useDebounce(query, 400);
  const navigate = useNavigate();

  useEffect(() => {
    let isCancelled = false;

    const fetchSuggestions = async () => {
      const trimmed = debouncedQuery.trim();

      if (trimmed.length < 2) {
        setSuggestions([]);
        setIsOpen(false);
        return;
      }

      setIsLoading(true);
      try {
        // TODO: replace with real API call, e.g.:
        // const response = await axios.get(`/api/products/search?q=${trimmed}`);
        // const results = response.data;
        const results = []; // placeholder until backend search endpoint exists

        if (!isCancelled) {
          setSuggestions(results);
          setIsOpen(true);
        }
      } catch (error) {
        if (!isCancelled) {
          console.error('Search request failed:', error);
          setSuggestions([]);
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };

    fetchSuggestions();

    return () => {
      isCancelled = true;
    };
  }, [debouncedQuery]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelectSuggestion = useCallback(
    (product) => {
      setIsOpen(false);
      setQuery('');
      navigate(`/product/${product.id}`);
    },
    [navigate]
  );

  const handleClear = useCallback(() => {
    setQuery('');
    setSuggestions([]);
    setIsOpen(false);
  }, []);

  return (
    <div className={styles.wrapper} ref={wrapperRef}>
      <div className={styles.inputBox}>
        <SearchIcon className={styles.searchIcon} fontSize="small" />
        <input
          type="text"
          className={styles.input}
          placeholder="Search for a product..."
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onFocus={() => {
            if (suggestions.length > 0) setIsOpen(true);
          }}
        />
        {query.length > 0 && (
          <button
            type="button"
            className={styles.clearButton}
            onClick={handleClear}
            aria-label="Clear search"
          >
            <CloseIcon fontSize="small" />
          </button>
        )}
      </div>

      {isOpen && (
        <div className={styles.dropdown}>
          {isLoading && <div className={styles.statusMessage}>Searching...</div>}

          {!isLoading && suggestions.length === 0 && (
            <div className={styles.statusMessage}>No matching results</div>
          )}

          {!isLoading &&
            suggestions.map((product) => (
              <button
                type="button"
                key={product.id}
                className={styles.suggestionItem}
                onClick={() => handleSelectSuggestion(product)}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className={styles.suggestionImage}
                />
                <span className={styles.suggestionName}>{product.name}</span>
                <span className={styles.suggestionPrice}>{product.price} EGP</span>
              </button>
            ))}
        </div>
      )}
    </div>
  );
}

export default SearchBar;
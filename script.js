const apiKey = "2fd9551be199200f928abc93ae4bceb1"; // Wstaw klucz API
const BASE_URL = "https://api.themoviedb.org/3";
const IMG_BASE_URL = "https://image.tmdb.org/t/p/w500"; // URL dla pobierania plakatów filmów
const moviesContainer = document.getElementById("movies");

// Funkcja pobierająca trendy filmowe na podstawie danych z TMDB API
async function getWeeklyTrends() {
  const url = `${BASE_URL}/trending/movie/week?api_key=${API_KEY}&language=pl-PL`;

  try {
    const response = await axios.get(url);
    const movies = response.data.results;
    displayMovies(movies); // Wyświetl filmy
  } catch (error) {
    console.error("Błąd przy pobieraniu filmów:", error);
  }
}

// Funkcja wyświetlająca filmy w sekcji HTML
function displayMovies(movies) {
  moviesContainer.innerHTML = ""; // Wyczyść poprzednie filmy

  movies.forEach((movie) => {
    const movieElement = document.createElement("div");
    movieElement.classList.add("movie");

    // Sprawdzanie czy plakat filmu istnieje
    const moviePoster = movie.poster_path
      ? `${IMG_BASE_URL}${movie.poster_path}`
      : "no-image.jpg";

    // Pobieranie roku premiery
    const releaseYear = movie.release_date
      ? movie.release_date.split("-")[0]
      : "Brak danych";

    // HTML dla pojedynczej karty filmu
    const movieHTML = `
      <img src="${moviePoster}" alt="${movie.title}">
      <h2>${movie.title} (${releaseYear})</h2>
      <p>${
        movie.overview ? movie.overview.slice(0, 100) + "..." : "Brak opisu"
      }</p>
    `;

    movieElement.innerHTML = movieHTML;
    moviesContainer.appendChild(movieElement);
  });
}

// Wywołaj funkcję do pobrania i wyświetlenia trendów tygodniowych
getWeeklyTrends();

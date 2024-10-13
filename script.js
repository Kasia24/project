const API_KEY = "2fd9551be199200f928abc93ae4bceb1"; // Wstaw swój API key tutaj
// script.js

let page = 1;
const moviesContainer = document.getElementById("movies");
const loadMoreButton = document.getElementById("load-more");

// Funkcja do pobierania filmów z TMDb API
function getMovies(page) {
  const url = `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=pl-PL&page=${page}`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      displayMovies(data.results);
    })
    .catch((error) => console.log(error));
}

// Funkcja do wyświetlania filmów w HTML
function displayMovies(movies) {
  movies.forEach((movie) => {
    const movieCard = document.createElement("div");
    movieCard.classList.add("movie-card");

    movieCard.innerHTML = `
            <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
            <div class="movie-info">
                <h2 class="movie-title">${movie.title}</h2>
                <p>${movie.release_date}</p>
            </div>
        `;

    moviesContainer.appendChild(movieCard);
  });
}

// Obsługa przycisku "Załaduj więcej"
loadMoreButton.addEventListener("click", () => {
  page++;
  getMovies(page);
});

// Pobranie początkowej listy filmów
getMovies(page);

const API_KEY = "2fd9551be199200f928abc93ae4bceb1"; // Wstaw swój API key tutaj
const API_URL = `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=pl-PL&page=1`;

// Funkcja pobierająca popularne filmy
async function fetchMovies() {
  const response = await fetch(API_URL);
  const data = await response.json();
  displayMovies(data.results);
}

// Funkcja wyświetlająca filmy
function displayMovies(movies) {
  const movieContainer = document.getElementById("movies");
  movieContainer.innerHTML = ""; // Czyszczenie zawartości

  movies.forEach((movie) => {
    const movieCard = document.createElement("div");
    movieCard.classList.add("movie-card");

    movieCard.innerHTML = `
            <img src="https://image.tmdb.org/t/p/w500${
              movie.poster_path
            }" alt="${movie.title}">
            <div class="movie-title">${movie.title}</div>
            <div class="movie-info">Gatunek | ${
              movie.release_date.split("-")[0]
            }</div>
            <div class="stars">${getStars(movie.vote_average)}</div>
        `;

    movieContainer.appendChild(movieCard);
  });
}

// Funkcja generująca gwiazdki na podstawie oceny
function getStars(vote) {
  const fullStars = Math.floor(vote / 2);
  let stars = "";
  for (let i = 0; i < 5; i++) {
    if (i < fullStars) {
      stars += "&#9733;"; // Pełna gwiazdka
    } else {
      stars += "&#9734;"; // Pusta gwiazdka
    }
  }
  return stars;
}

// Wywołanie funkcji
fetchMovies();

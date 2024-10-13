const API_KEY = "2fd9551be199200f928abc93ae4bceb1"; // Wstaw swój API key tutaj

let page = 1;
let currentMovieIndex = 0; // Index aktualnie wyświetlanego filmu
let moviesList = []; // Lista przechowująca pobrane filmy
let genres = []; // Lista przechowująca pobrane gatunki
const moviesContainer = document.getElementById("movies");
const loadMoreButton = document.getElementById("load-more");

// Funkcja do pobierania liczby filmów na podstawie szerokości ekranu
function getMoviesPerLoad() {
  const screenWidth = window.innerWidth;
  if (screenWidth < 768) {
    return 1; // Wyświetl 1 film na urządzeniach mobilnych
  } else {
    return 3; // Wyświetl 3 filmy na tabletach i laptopach
  }
}

// Funkcja do pobierania gatunków z TMDb API
function getGenres() {
  const url = `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}&language=pl-PL`;

  return fetch(url)
    .then((response) => response.json())
    .then((data) => {
      genres = data.genres;
    })
    .catch((error) => console.log(error));
}

// Funkcja do pobierania filmów z TMDb API
function getMovies(page) {
  const url = `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=pl-PL&page=${page}`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      moviesList = moviesList.concat(data.results); // Dodaj filmy do listy
      displayMovies(); // Wyświetl filmy z nowo pobranych
    })
    .catch((error) => console.log(error));
}

// Funkcja do dopasowania gatunków do filmów
function getGenreNames(genreIds) {
  return genreIds
    .map((id) => {
      const genre = genres.find((g) => g.id === id);
      return genre ? genre.name : "Nieznany gatunek";
    })
    .join(", ");
}

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

// Funkcja do wyświetlania filmów
function displayMovies() {
  const moviesPerLoad = getMoviesPerLoad(); // Pobierz liczbę filmów do załadowania

  for (let i = 0; i < moviesPerLoad; i++) {
    if (currentMovieIndex < moviesList.length) {
      const movie = moviesList[currentMovieIndex]; // Pobierz aktualny film
      const genreNames = getGenreNames(movie.genre_ids); // Pobierz nazwy gatunków dla filmu

      const movieCard = document.createElement("div");
      movieCard.classList.add("movie-card");

      movieCard.innerHTML = `
        <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${
        movie.title
      }">
        <div class="movie-info">
          <h2 class="movie-title">${movie.title}</h2>
          <p>${genreNames} | ${movie.release_date.split("-")[0]}</p>
          <div class="stars">${getStars(movie.vote_average)}</div>
        </div>
      `;

      moviesContainer.appendChild(movieCard);
      currentMovieIndex++; // Zwiększ indeks filmu
    } else {
      // Jeśli filmy się skończą, załaduj kolejną stronę
      page++;
      getMovies(page);
      break; // Zakończ pętlę, aby czekać na załadowanie nowych filmów
    }
  }
}

// Obsługa przycisku "Załaduj więcej"
loadMoreButton.addEventListener("click", () => {
  page++;
  getMovies(page);
});

// Najpierw pobierz listę gatunków, a potem filmy
getGenres().then(() => getMovies(page));

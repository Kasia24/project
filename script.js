const API_KEY = "2fd9551be199200f928abc93ae4bceb1"; // Wstaw swój API key tutaj

import { getGenres } from "./api";
import { getPopularMoviesWeek } from "./api";
import { showModal } from "./modal_1";

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
    .slice(0, 2) // Ogranicz do dwóch gatunków
    .join(", ");
}

/*function getStars(vote) {
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
}*/

function getStars(vote) {
  const fullStars = Math.floor(vote / 2); // Liczba pełnych gwiazdek
  const halfStar = vote % 2 >= 1; // Sprawdzenie, czy jest połowa gwiazdki
  let stars = "";

  for (let i = 0; i < 5; i++) {
    if (i < fullStars) {
      stars += "&#9733;"; // Pełna gwiazdka
    } else if (i === fullStars && halfStar) {
      stars += "&#9733;"; // Połowa gwiazdki
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

let moviesLoaded = false;

function loadMoreMovies() {
  if (!moviesLoaded) {
    // Symulacja ładowania filmów (w rzeczywistości tu może być API)
    const newMovies = [
      { title: "Movie 4", year: 2023 },
      { title: "Movie 5", year: 2023 },
      { title: "Movie 6", year: 2023 },
    ];

    const movieList = document.getElementById("movies");

    newMovies.forEach((movie) => {
      const movieCard = document.createElement("div");
      movieCard.classList.add("movie-card");
      movieCard.innerHTML = `
        <h3>${movie.title}</h3>
        <p>${movie.year}</p>
      `;
      movieList.insertBefore(movieCard, document.getElementById("load-more")); // Wstaw przed przyciskiem
    });

    // Zaznacz, że załadowano filmy, aby zapobiec wielokrotnemu ładowaniu
    moviesLoaded = true;

    // Możesz ukryć przycisk See All, jeśli nie chcesz go pokazywać po załadowaniu
    document.getElementById("load-more").style.display = "none";
  }
}
document.getElementById("load-more").addEventListener("click", function () {
  // Pobierz element, w którym mają być wyświetlane filmy (pod Upcoming This Month)
  const moviesContainer = document.getElementById("movies-list");

  // Dynamiczne ładowanie filmów (dodaj funkcję pobierania filmów, którą już masz)
  getMovies(page);

  // Wyświetl więcej filmów w moviesContainer
  displayMovies(moviesContainer);
});

// Pobranie elementów HTML
const modal = document.getElementById("modal");
const closeModalBtn = document.getElementById("closeModalBtn");
const toggleLibraryBtn = document.getElementById("toggleLibraryBtn");
const watchTrailerBtn = document.getElementById("watchTrailerBtn");
const trailerContainer = document.getElementById("trailerContainer");

// Dodaj event listener do każdej karty
document.querySelectorAll("movie-card").forEach((card) => {
  card.addEventListener("click", function (event) {
    event.preventDefault(); // Zapobiega przeładowaniu strony

    // Pobieranie szczegółów filmu z atrybutów data
    const title = this.dataset.title;
    const rating = this.dataset.rating;
    const popularity = this.dataset.popularity;
    const description = this.dataset.description;
    const poster = this.dataset.poster;

    // Ustawianie zawartości modalu
    document.getElementById("movieTitle").innerText = title;
    document.getElementById("movieRating").innerText = `Rating: ${rating}`;
    document.getElementById(
      "moviePopularity"
    ).innerText = `Popularity: ${popularity}`;
    document.getElementById("movieDescription").innerText = description;
    document.getElementById("moviePoster").src = poster;

    // Wyświetlanie modalu
    modal.classList.remove("hidden");
  });
});

// Obsługa zamknięcia modalu
closeModalBtn.addEventListener("click", function () {
  modal.classList.add("hidden");
  trailerContainer.classList.add("hidden");
  trailerContainer.innerHTML = ""; // Usuwa zawartość trailera po zamknięciu
});

// Obsługa dodania filmu do biblioteki
toggleLibraryBtn.addEventListener("click", function () {
  // Przykładowe działanie: wyświetlenie alertu
  alert("Film dodany do biblioteki!");
  // Możesz dodać tutaj dodatkową logikę, np. przechowywanie danych w localStorage
});

// Obsługa wyświetlania trailera
watchTrailerBtn.addEventListener("click", function () {
  trailerContainer.classList.toggle("hidden");
  if (!trailerContainer.classList.contains("hidden")) {
    trailerContainer.innerHTML =
      '<iframe width="100%" height="315" src="https://www.youtube.com/embed/example-trailer" frameborder="0" allowfullscreen></iframe>';
  } else {
    trailerContainer.innerHTML = ""; // Usuwa zawartość trailera po zamknięciu
  }
});

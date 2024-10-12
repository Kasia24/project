const apiKey = "2fd9551be199200f928abc93ae4bceb1"; // Wstaw klucz API
const url = `https://api.themoviedb.org/3/trending/movie/week?api_key=${apiKey}`;

fetch(url)
  .then((response) => response.json())
  .then((data) => {
    // Call a function to render movies on the screen
    renderMovies(data.results);
  })
  .catch((error) => console.error("Error fetching movies:", error));

function renderMovies(movies) {
  const container = document.getElementById("movies-container"); // A div with id movies-container

  movies.forEach((movie) => {
    const movieCard = document.createElement("div");
    movieCard.classList.add("movies-card");

    movieCard.innerHTML = `
            <img src="https://image.tmdb.org/t/p/w500${
              movie.poster_path
            }" alt="${movie.title}">
            <h3>${movie.title}</h3>
            <p>${movie.genre_ids.slice(0, 2).join(", ")} | ${
      movie.release_date.split("-")[0]
    }</p>
            <div class="rating">⭐⭐⭐⭐⭐</div>
        `;

    container.appendChild(movieCard);
  });
}

const apiKey = "2fd9551be199200f928abc93ae4bceb1"; // Wstaw swój klucz API

// Funkcja do wyszukiwania filmów
async function searchMovies() {
  const query = document.getElementById("movies-list").value;
  const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${query}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    displayMovies(data.results);
  } catch (error) {
    console.error("Error fetching data from TMDb:", error);
  }
}
// Funkcja do wyświetlania wyników wyszukiwania
function displayMovies(movies) {
  const moviesList = document.getElementById("movies-card");
  moviesList.innerHTML = "";

  if (movies.length === 0) {
    moviesList.innerHTML = "<p>No movies found</p>";
    return;
  }

  movies.forEach((movie) => {
    const movieItem = document.createElement("div");
    movieItem.classList.add("movie-item");
    movieItem.innerHTML = `
            <h2>${movie.title}</h2>
            <p>${movie.overview}</p>
            <p><strong>Release date:</strong> ${movie.release_date}</p>
        `;
    moviesList.appendChild(movieItem);
  });
}

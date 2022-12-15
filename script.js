const API_URL =
  "https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=338e10fce42891ba5cc0a34dcd5940ac";
const IMAGE_URL = "https://image.tmdb.org/t/p/w1280";
const SEARCH_URL =
  "https://api.themoviedb.org/3/search/movie?api_key=338e10fce42891ba5cc0a34dcd5940ac&query=";
const movies = document.querySelector(".movies-container");
const search = document.getElementById("search");
const form = document.getElementById("form");
const numbers = document.querySelector(".numbers");
const years = document.querySelector(".years");
const menu = document.querySelector(".menu");

async function getMovies(url) {
  const res = await fetch(url)
    .then((resp) => {
      if (resp.ok) {
        return resp.json();
      } else {
        throw Error();
      }
    })
    .catch(() => false);
  return res;
}

const showMovies = (moviesArray) => {
  moviesArray.forEach((movie) => {
    const movieOverview = movie.overview ? movie.overview : "No overview";
    const img = movie.poster_path
      ? `<img src=${IMAGE_URL + movie.poster_path}>`
      : '<div class="no-image"><img src="./static/no-image-png-2.png"></div>';
    movies.innerHTML += `
            <div class="movie">
            ${img}
            <div class="movie-info">
                <h4 class="movie-title">${movie.original_title}</h4>
                <span class="movie-rating ${
                  movie.vote_average >= 8
                    ? "green"
                    : movie.vote_average >= 7
                    ? "orange"
                    : "red"
                }">${movie.vote_average}</span>

            </div>
            <div class="movie-overview">
                <div>
                    <h4>Overview</h4>
                    <p>${movieOverview}</p>
                </div>
            </div>
        </div>
            `;
  });
};
const pageSize = 20;
let nextPage = 1;
let mode = "discover";
let searchCriteria = "";
let yearSelectedEl = null;

years.addEventListener("click", (e) => {
  if (e.target.nodeName.toLowerCase() === "button") {
    if (e.target.classList.contains("active")) {
      e.target.classList.remove("active");
      yearSelectedEl = null;
    } else {
      if (yearSelectedEl) {
        yearSelectedEl.classList.remove("active");
      }
      e.target.classList.add("active");
      yearSelectedEl = e.target;
    }
    movies.innerHTML = "";
    nextPage = 1;
    dicoverMovies();
  }
});

document.addEventListener("scroll", () => {
  if (nextPage) {
    if (window.innerHeight + window.pageYOffset >= document.body.offsetHeight)
      dicoverMovies();
  }
});

const dicoverMovies = () => {
  const url = mode === "discover" ? API_URL : SEARCH_URL + searchCriteria;
  console.log(url);
  const year = yearSelectedEl ? `&primary_release_year=${+yearSelectedEl.textContent}` : "";
  getMovies(url + `&page=${nextPage}` + year).then((res) => {
    if (res) {
      console.log(res);
      showMovies(res.results);
      if (nextPage < res.total_pages) {
        numbers.textContent = `${res.page * pageSize} of ${
          res.total_results
        } shown`;
        nextPage += 1;
      } else {
        nextPage = 0;
        numbers.textContent = `${res.total_results} of ${
            res.total_results
          } shown`;
      }
    } else {
      movies.innerHTML = "Something went wrong";
    }
  });
};

menu.addEventListener("click", (e) => {
  if (e.target.nodeName.toLowerCase() === "i") {
    menu.classList.toggle("active");
  }
});

form.addEventListener("submit", (e) => {
  e.preventDefault();

  if (search && search.value.trim() !== "") {
    movies.innerHTML = "";
    searchCriteria = search.value;
    nextPage = 1;
    mode = "search";
    dicoverMovies();
  } else {
    movies.innerHTML = "";
    nextPage = 1;
    mode = "discover";
    dicoverMovies();
  }
  search.value = "";
});

dicoverMovies();

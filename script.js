const movieContainer = document.querySelector("#movieContainer")
const searchBtn = document.querySelector("#searchBtn")
const myInputArea = document.querySelector("#myInputArea")

window.addEventListener('DOMContentLoaded', showMoviesUI)
searchBtn.addEventListener('click', searchFilm)
myInputArea.addEventListener('keyup', searchFilmWithEnter)

const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5NjE5ODQ5NjMxYTRlMWZiYzVlMDIzYWUwMDc4ZDgzOSIsInN1YiI6IjY0NjdmNmIwMmJjZjY3MDEzODk0MzM2ZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.dyQbf0TAGw-xO-uOrPoWL_okGTOkcJlklzGraLB8-d8'
    }
};

async function getMoviesData() {

    try {
        const moviesData = await fetch('https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc', options)
        return await moviesData.json()
    } catch (err) {
        console.log(err);
    }


}

async function showMoviesUI() {
    const movies = await getMoviesData()

    movieContainer.innerHTML += movies.results.map((movie) => (
        `<div class="card mx-5 my-5" style="width: 18rem;">
        <img src="https://image.tmdb.org/t/p/w1280${movie.poster_path}" class="card-img-top" style="height:300px">
        <div class="card-body">
          <h5 class="card-title">${movie.original_title}</h5>
          <p class="card-text">${movie.overview.slice(0, 100) + '...'}</p>
        </div>
        <ul class="list-group list-group-flush">
          <li class="list-group-item">Dil: ${movie.original_language}</li>
          <li class="list-group-item">IMDB: ${movie.vote_average}</li>
          <li class="list-group-item">Yayınlanma Tarixi: ${movie.release_date}</li>
        </ul>
        <div class="card-body">
          <button class="btn btn-danger" onclick="showFilmDetail(${movie.id})">Watch the Film</button>
        </div>
      </div>`
    ))

}

async function getFilmWithID(movieID) {
    try {
        const moviesData = await fetch(`https://api.themoviedb.org/3/movie/${movieID}/watch/providers`, options)
        const movieDetail = await moviesData.json()
        return movieDetail
    } catch (err) {
        console.log(err);
    }
}

async function showFilmDetail(movieId) {
    const movieDetail = await getFilmWithID(movieId)
    console.log(movieDetail);
    let { results } = movieDetail

    window.open(results.US.link, '_blank')
}

async function getSearchFilm(searchText) {
    try {
        const moviesData = await fetch(`https://api.themoviedb.org/3/search/movie?query=${searchText}&include_adult=false&language=en-US&page=1`, options)
        const searchMovie = await moviesData.json()
        return searchMovie
    } catch (err) {
        console.log(err);
    }
}

async function searchFilm() {
    const searchText = getSearchInputValue()
    const searchMovie = await getSearchFilm(searchText)
    let { results } = searchMovie

    if (results.length > 0) {
        movieContainer.innerHTML = ''
        myInputArea.value = ''
        showSearchMovieUI(results)
    } else {
        movieContainer.innerHTML = ''
        myInputArea.value = ''
        showErr()
    }
}

function showErr() {
    movieContainer.innerHTML = `<div class="text-bg-danger fs-3 mt-5 fw-bold">
      Xəta! Axtardığınız film yoxdur...
    </div>`
    setTimeout(() => {
        movieContainer.innerHTML = ''
        showMoviesUI()
    },2000)
}

function showSearchMovieUI(results) {
    movieContainer.innerHTML += results.map((movie) => (
        `<div class="card mx-5 my-5" style="width: 18rem;">
        <img src="https://image.tmdb.org/t/p/w1280${movie.poster_path}" class="card-img-top" style="height:300px">
        <div class="card-body">
          <h5 class="card-title">${movie.original_title}</h5>
          <p class="card-text">${movie.overview.slice(0, 100) + '...'}</p>
        </div>
        <ul class="list-group list-group-flush">
          <li class="list-group-item">Dil: ${movie.original_language}</li>
          <li class="list-group-item">IMDB: ${movie.vote_average}</li>
          <li class="list-group-item">Yayınlanma Tarixi: ${movie.release_date}</li>
        </ul>
        <div class="card-body">
          <button class="btn btn-danger" onclick="showFilmDetail(${movie.id})">Watch the Film</button>
        </div>
      </div>`
    ))
}

function getSearchInputValue() {
    return myInputArea.value.trim().toLowerCase()
}

function searchFilmWithEnter(e) {
    if(e.keyCode === 13) {
        searchFilm()
    }
}

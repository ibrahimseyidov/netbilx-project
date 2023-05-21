const movieContainer = document.querySelector("#movieContainer");
const mySearchBtn = document.querySelector("#searchBtn");
const myInputArea = document.querySelector("#myInputArea")
const container = document.querySelector("#container")

mySearchBtn.addEventListener("click", searchFilm)
myInputArea.addEventListener("keyup", enterSearch)
showFilm()

function enterSearch(e){
  if(e.keyCode === 13){
    searchFilm()
  }
}

function showFilm() {
  let newJson = fetch("./myJson.json")

  newJson
    .then(response => {
      return response.json()
    }).then(response => {
      let { results } = response
      results.forEach((data) => {

        let newMovie = `<div class="card mx-5 my-5" style="width: 18rem;">
      <img src="${data["backdrop_path"]}" class="card-img-top" style="height:300px">
      <div class="card-body">
        <h5 class="card-title">${data["original_title"]}</h5>
        <p class="card-text">${data["overview"].substring(0,200)}</p>
      </div>
      <ul class="list-group list-group-flush">
        <li class="list-group-item">Dil: ${data['original_language']}</li>
        <li class="list-group-item">IMDB: ${data['vote_average']}</li>
        <li class="list-group-item">Yayınlanma Tarixi: ${data['release_date']}</li>
      </ul>
      <div class="card-body">
        <a href="#" class="btn btn-danger" onclick="showNewFilm('${data['film_link']}')">Watch the Film</a>
      </div>
    </div>`
        movieContainer.innerHTML += newMovie
      })

    })
}


function showNewFilm(film) {

  window.open(film, '_blank')
}

async function searchFilm() {
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5NjE5ODQ5NjMxYTRlMWZiYzVlMDIzYWUwMDc4ZDgzOSIsInN1YiI6IjY0NjdmNmIwMmJjZjY3MDEzODk0MzM2ZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.dyQbf0TAGw-xO-uOrPoWL_okGTOkcJlklzGraLB8-d8'
    }
  };

  let myInput = getInputArea()

  let newPromise = await fetch(`https://api.themoviedb.org/3/search/movie?query=${myInput}&include_adult=false&language=en-US&page=1`, options)
  let result = await newPromise.json()
  console.log(result);
  let { results } = result
  console.log(results);

  try {
    console.log(results.length);
    if (results.length) {
      movieContainer.innerHTML = "";
      setFilm(results)
    } else {
      showErr()
    }
  } catch (err) {
  }
}

function setFilm(results) {


  results.forEach((data) => {
    let imgUrl = "https://www.themoviedb.org/t/p/w1280"
    if(data["poster_path"] === null){
     data["poster_path"] = ""
     imgUrl = "https://shorturl.at/imnY6"
    }
    let newMovie = `<div class="card mx-5 my-5" style="width: 18rem;">
<img src="${imgUrl}${data["poster_path"]}" class="card-img-top" style="height:300px">
<div class="card-body">
  <h5 class="card-title">${data["original_title"]}</h5>
  <p class="card-text">${data["overview"].substring(0,200)}</p>
</div>
<ul class="list-group list-group-flush">
  <li class="list-group-item">Dil: ${data['original_language']}</li>
  <li class="list-group-item">IMDB: ${data['vote_average']}</li>
  <li class="list-group-item">Yayınlanma Tarixi: ${data['release_date']}</li>
</ul>
<div class="card-body">
  <a href="#" class="btn btn-danger" onclick="showNewFilm('${data['film_link']}')">Watch the Film</a>
</div>
</div>`
    movieContainer.innerHTML += newMovie
  })
}

function showErr() {
  movieContainer.innerHTML = "";
  let errMessage = document.createElement("div");
  errMessage.classList = "text-bg-danger fs-3 mt-5 fw-bold"
  errMessage.innerHTML = "Xəta! Axtardığınız film yoxdur...";

  container.appendChild(errMessage)
  console.log(container);
  setTimeout(() => {
    container.removeChild(container.lastElementChild)
    showFilm()
  }, 2000)
}


function getInputArea() {
  let myInput = myInputArea.value.trim();
  if (myInput.length > 3) {
    myInputArea.value = ""
    return myInput
  }
}


const link = 'https://movie-list.alphacamp.io/api/v1/movies'
const BASE_URL = 'https://movie-list.alphacamp.io'
const INDEX_URL = BASE_URL + '/api/v1/movies/'
const POSTER_URL = BASE_URL + '/posters/'
const dataPanel = document.querySelector('#data-panel')
const movies = JSON.parse(localStorage.getItem('favoriteMovies')) || []

const renderMovieList = (movies) => {
    let rawHTML = ''
    movies.forEach((data)=>{
        rawHTML += `<div class="col-sm-3">
        <div class="mb-2">
          <div class="card">
            <img src="${
              POSTER_URL + data.image
            }" class="card-img-top" alt="Movie Poster">
            <div class="card-body">
              <h5 class="card-title">${data.title}</h5>
            </div>
            <div class="card-footer">
              <button class="btn btn-primary btn-show-movie" data-id="${data.id}" data-toggle="modal" data-target="#movie-modal">More</button>
              <button class="btn btn-danger btn-delete-favorite" data-id="${data.id}">X</button>
            </div>
          </div>
        </div>
      </div>
      <!-- Movie Modal -->
    <div class="modal fade" id="movie-modal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="movie-modal-title">Modal title</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body" id="movie-modal-body">
            <div class="row">
              <div class="col-sm-8" id="movie-modal-image">
                <img src="https://github.com/ALPHACamp/movie-list-api/blob/master/public/posters/c9XxwwhPHdaImA2f1WEfEsbhaFB.jpg?raw=true" alt="movie-poster" class="img-fluid">
              </div>
              <div class="col-sm-4">
                <p><em id="movie-modal-date">release date: 2020/01/05</em></p>
                <p id="movie-modal-description">This is a movie.</p>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
    `
    })
    // console.log(rawHTML)
    dataPanel.innerHTML = rawHTML
}
window.addEventListener('load',renderMovieList(movies))

dataPanel.addEventListener('click',(e)=>{
    // console.log(e.target.dataset.id)
    if(e.target.matches('.btn-show-movie')){
        // console.log(e.target.dataset.id)
        showMovieModal(e.target.dataset.id)
    }else if(e.target.matches('.btn-delete-favorite')){
        // console.log(e.target.dataset.id)
        removeFromFavorite(Number(e.target.dataset.id))
    }
})
const showMovieModal = (id) =>{
    const modalTitle = document.querySelector('#movie-modal-title')
    const modalImage = document.querySelector('#movie-modal-image')
    const modalDate = document.querySelector('#movie-modal-date')
    const modalDescription = document.querySelector('#movie-modal-description')
    axios.get(INDEX_URL + id)
        .then((res)=>{
            const data = res.data.results
            modalTitle.innerHTML = data.title
            modalDate.innerHTML = 'Release date: ' + data.release_date
            modalDescription.innerHTML = data.description
            modalImage.innerHTML = `<img src="${POSTER_URL + data.image}" alt="movie-poster" class="img-fluid">`
        })
}

function removeFromFavorite(id) {
    if(!movies) return
  
    //透過 id 找到要刪除電影的 index
    const movieIndex = movies.findIndex((movie) => movie.id === id)
    if(movieIndex === -1) return
  
    //刪除該筆電影
    movies.splice(movieIndex,1)
  
    //存回 local storage
    localStorage.setItem('favoriteMovies', JSON.stringify(movies))
  
    //更新頁面
    renderMovieList(movies)
    console.log(movies)
  }


// const deleteFromFavorite = (id)=>{
//   let movieArr = movies.filter((movie)=>{ return Number(movie.id) !== id})
//  localStorage.setItem('favoruteMoives',JSON.stringify(movieArr))
//   let temp = JSON.parse(localStorage.getItem('favoriteMovies')) || []
//   console.log(movies)
//   console.log(movieArr)
//   console.log(temp)
//   renderMovieList(movies)
// //   location.reload()
// }
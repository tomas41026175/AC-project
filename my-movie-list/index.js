const link = 'https://movie-list.alphacamp.io/api/v1/movies'
const BASE_URL = 'https://movie-list.alphacamp.io'
const INDEX_URL = BASE_URL + '/api/v1/movies/'
const POSTER_URL = BASE_URL + '/posters/'
const movies = []
const perPage = 12
const dataPanel = document.querySelector('#data-panel')
const container = document.querySelector('.container')
const pagination = document.querySelector('#pagination')
const changeBtn = document.querySelector('.change-btn')
const searchBar = document.querySelector('.search-bar')

axios
    .get(link)
    .then((res)=>{
        movies.push(...res.data.results)
        getPageNumbers(movies)
        renderMovieCard(getPerPageData(1,movies))
    })
    .catch((err)=>{
        console.log(err)
    })

dataPanel.addEventListener('click',(e)=>{
      if(e.target.matches('.btn-show-movie')){
          console.log(e.target.dataset)
          showMovieModal(e.target.dataset.id)
      }else if(e.target.matches('.btn-add-favorite')){
        // console.log(Number(e.target.dataset.id))
        addToFavorite(Number(e.target.dataset.id))
      }
  })
  
changeBtn.addEventListener('click',(e)=>{
    let tempArr = getPerPageData(1,movies)
    if(e.target.classList.contains('card')){
      dataPanel.classList.add('card-style')
      dataPanel.classList.remove('list-style')
      renderMovieCard(tempArr)
    }else if(e.target.classList.contains('list')){
      dataPanel.classList.add('list-style')
      dataPanel.classList.remove('card-style')
      renderMovieList(tempArr)
    }
  })
  
pagination.addEventListener('click',(e)=>{
    let tempArr = []
    e.target.classList.toggle('btn-primary')
    tempArr = getPerPageData(e.target.innerText,movies)
    if(dataPanel.classList.contains('list-style')){
      renderMovieList(tempArr)
    }else if(dataPanel.classList.contains('card-style')){
      renderMovieCard(tempArr)
    }
  })

searchBar.addEventListener('click',(e)=>{
    e.preventDefault()
  
    if(e.target.tagName === 'BUTTON'){
      let keyWord = e.target.previousElementSibling.value
      // console.log(tempName)
        if(handleSearch(keyWord).length !== 0){
          let tempArr = handleSearch(keyWord)
          getPageNumbers(tempArr)
          if(dataPanel.classList.contains('card-style')){
            renderMovieCard(getPerPageData(1,tempArr))
          }else if(dataPanel.classList.contains('list-style')){
            renderMovieList(getPerPageData(1,tempArr))
          }
        }else{
          alert('找不到相應movie')
        }
    }
  })

const handleSearch = (word) =>{
    let searchArr = []
    let lowerWord = word.toLowerCase()
    searchArr = movies.filter((user)=>{
      let tempName = user.title.toLowerCase()
        return  tempName.includes(lowerWord)
    })
   return searchArr
}

const renderMovieCard = (movieDatas) => {
    let rawHTML = ''
    movieDatas.forEach((data)=>{
        rawHTML += `
        <div class="col-sm-3">
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
              <button class="btn btn-info btn-add-favorite" data-id="${data.id}">+</button>
            </div>
          </div>
        </div>
      </div>
    `
    })
    // console.log(rawHTML)
    dataPanel.innerHTML = rawHTML
}

const renderMovieList = (movieDatas) => {
  let rawHTML = '<ul class="list-group">'
  movieDatas.forEach((data)=>{
      rawHTML += `
        <li class="list-group-item d-flex justify-content-between" style="width: 900px;">
          <div class="card-body">
            <h5 class="card-title">${data.title}</h5>
          </div>
          <div class="card-footer">
            <button class="btn btn-primary btn-show-movie" data-id="${data.id}" data-toggle="modal" data-target="#movie-modal">More</button>
            <button class="btn btn-info btn-add-favorite" data-id="${data.id}">+</button>
          </div>
        </li>
  `
  })
  rawHTML += `</ul>`
  dataPanel.innerHTML = rawHTML
}

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

const getPageNumbers = (movies) =>{
  let temp = ''
  if(movies){
    for(let i=0 ;i<Math.round(movies.length / perPage); i++){
       temp += `<li class="page-item"><a class="page-link" href="#">${i + 1}</a></li>`
    }
  }
  return pagination.innerHTML = temp
}

const getPerPageData = (pageNumber,movies) =>{
  let startNumber = (pageNumber - 1) * perPage
  let pageArr = []
  pageArr = movies.slice(startNumber,Number(startNumber + perPage))
  return pageArr
}

const addToFavorite = (id) =>{
  const list = JSON.parse(localStorage.getItem('favoriteMovies')) || []
  console.log(list)
  const movie = movies.find((movie) => movie.id === id)
  if(list !== undefined || list.length > 0){
    while (list.some((movie) => movie.id === id)) {
      return alert('此電影已經在收藏清單中！')
    }
  }
  list.push(movie)
  localStorage.setItem('favoriteMovies', JSON.stringify(list))
}
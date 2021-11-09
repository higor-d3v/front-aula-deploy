const body = document.querySelector('body');
const input = document.querySelector('.input');
const anterior = document.querySelector('.btn-prev');
const proximo = document.querySelector('.btn-next');
const movie = document.querySelectorAll('.movie');
const ratings = document.querySelectorAll('.movie__rating');
const modal = document.querySelector('.modal');
const imgModal = document.querySelector('.modal__img');
const titleModal = document.querySelector('.modal__title');
const descriptionModal = document.querySelector('.modal__description');
const genresParent = document.querySelector('.modal__genres')
const averageModal = document.querySelector('.modal__average');
const genres = document.querySelector('.modal__genres');
const highlightVideo = document.querySelector('.highlight__video');
const highlightTitle = document.querySelector('.highlight__title');
const highlightDescription = document.querySelector('.highlight__description');
const highlightGenres = document.querySelector('.highlight__genres');
const highlightRating = document.querySelector('.highlight__rating');
const highlightLaunch = document.querySelector('.highlight__launch');
const highlightLink = document.querySelector('.highlight__video-link');
const highlightInfo = document.querySelector('.highlight__info');
const buttonTheme = document.querySelector('.btn-theme');
buttonTheme.style.cursor = 'pointer'

let darkMode = false
buttonTheme.addEventListener('click', function () {
    if (darkMode === false) {
        buttonTheme.src = './assets/dark-mode.svg'
        anterior.src = './assets/seta-esquerda-branca.svg'
        proximo.src = './assets/seta-direita-branca.svg'
        body.style.backgroundColor = '#242424'
        body.style.color = '#FFF'
        input.style.backgroundColor = '#242424'
        highlightLaunch.style.color = '#FFF'
        highlightGenres.style.color = '#FFF'
        input.style.color = '#FFF'
        highlightInfo.style.backgroundColor = '#454545'
        highlightInfo.style.boxShadow = '0px 4px 8px rgba(255, 255, 255, 0.15)'
        darkMode = true;

    } else {
        buttonTheme.src = './assets/light-mode.svg'
        anterior.src = './assets/seta-esquerda-preta.svg'
        proximo.src = './assets/seta-direita-preta.svg'
        body.style.backgroundColor = '#FFF'
        body.style.color = '#000'
        input.style.backgroundColor = '#FFF'
        highlightLaunch.style.color = '#000'
        highlightGenres.style.color = '#000'
        input.style.color = '#000'
        highlightInfo.style.backgroundColor = '#FFF'
        highlightInfo.style.boxShadow = '0px 4px 8px rgba(0, 0, 0, 0.15)'
        darkMode = false;
    }
})


function popularGaleria() {
    fetch("https://tmdb-proxy.cubos-academy.workers.dev/3/discover/movie?language=pt-BR&include_adult=false").then(function (resposta) {
        const promiseBody = resposta.json()

        promiseBody.then(function (body) {
            movie.forEach(function (filme, i) {
                filme.classList.remove('hidden')
                filme.style.backgroundImage = `url(${body.results[i].poster_path})`
                const titulo = filme.querySelector('.movie__title')
                filme.id = body.results[i].id

                titulo.textContent = body.results[i].title
                const avaliacao = filme.querySelector('.movie__rating')
                avaliacao.textContent = ''
                const estrela = document.createElement('img')
                estrela.src =  './assets/estrela.svg'
                avaliacao.textContent =  body.results[i].vote_average
                avaliacao.append(estrela)
                updateGallery();
            })
        })
    })
}

popularGaleria();

let paginaAtual = 0


proximo.addEventListener('click', function (e) {
    if (paginaAtual === 3) {
        paginaAtual = 0
        return updateGallery();
    } else {
        paginaAtual++
        return updateGallery();
    }
});

anterior.addEventListener('click', function (e) {
    if (paginaAtual === 0) {
        paginaAtual = 3
        return updateGallery();
    } else {
        paginaAtual--
        return updateGallery();
    }
});

function updateGallery() {


    movie.forEach(function (filme, i) {
        if (paginaAtual === 0) {
            if (i > 4) {
                return filme.style.display = 'none'
            } else {
                return filme.style.display = 'flex'
            }
        }


        if (paginaAtual === 1) {
            if (i > 9 || i < 5) {
                return filme.style.display = 'none'
            } else {
                return filme.style.display = 'flex'
            }
        }

        if (paginaAtual === 2) {
            if (i > 14 || i < 10) {
                return filme.style.display = 'none'
            } else {
                return filme.style.display = 'flex'
            }

        }

        if (paginaAtual === 3) {
            if (i < 15) {
                return filme.style.display = 'none'
            } else {
                return filme.style.display = 'flex'
            }

        }
    });
}

updateGallery();

function cleanGallery() {
    movie.forEach(function (m) {
        m.style.display = 'none'
        paginaAtual = 0
    });
}

function cleanInput() {
    input.value = ""
}

input.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
        if (input.value === '') {
            ratings.forEach(function(r){
                r.textContent = ''
            })
            paginaAtual = 0;
            return popularGaleria()
        }
        cleanGallery();
        const promise = fetch(`https://tmdb-proxy.cubos-academy.workers.dev/3/search/movie?language=pt-BR&include_adult=false&query=${input.value}`);
        promise.then(function (resposta) {
            const promiseBody = resposta.json();

            promiseBody.then(function (body) {
                totalResults = body.total_results
                movie.forEach(function (filme, i) {

                    if (body.total_results > i) {
                        if (i < 5) {
                            filme.style.display = 'flex'
                        }
                        filme.style.backgroundImage = `url(${body.results[i].poster_path})`
                        const titulo = filme.querySelector('.movie__title')
                        filme.id = body.results[i].id

                        titulo.textContent = body.results[i].title
                        const avaliacao = filme.querySelector('.movie__rating')
                        const estrela = document.createElement('img')
                        estrela.src = './assets/estrela.svg'
                        avaliacao.textContent = ''
                        avaliacao.append(body.results[i].vote_average)
                        avaliacao.append(estrela)
                    }
                })
            })
        })
        cleanInput()
    }
})



movie.forEach(function (m) {
    m.addEventListener('click', function (e) {
        modal.classList.remove('hidden')
        fetch(`https://tmdb-proxy.cubos-academy.workers.dev/3/movie/${m.id}?language=pt-BR`)
            .then(function (resposta) {
                const bodyPromise = resposta.json();
                bodyPromise.then(function (body) {
                    const corpo = body
                    imgModal.src = corpo.backdrop_path
                    titleModal.innerHTML = corpo.title
                    descriptionModal.innerHTML = corpo.overview

                    corpo.genres.forEach(function (g) {
                        const genero = document.createElement('span')
                        genero.classList.add('modal__genre')
                        genero.textContent = g.name
                        genresParent.appendChild(genero)


                    })
                    averageModal.innerHTML = corpo.vote_average
                })
            })
    })
})

modal.addEventListener('click', function () {
    modal.classList.add('hidden')
    var childs = document.querySelectorAll('.modal__genre')
    childs.forEach(function (child) {
        child.remove()
    })
})

imgModal.addEventListener('click', function (e) {
    e.stopPropagation()

})

function mesDeLancamento(mes) {
    if (Number(mes) === 1) {
        return mes = 'JANEIRO'
    }
    if (Number(mes) === 2) {
        return mes = 'FEVEREIRO'
    }
    if (Number(mes) === 3) {
        return mes = 'MARÇO'
    }
    if (Number(mes) === 4) {
        return mes = 'ABRIL'
    }
    if (Number(mes) === 5) {
        return mes = 'MAIO'
    }
    if (Number(mes) === 6) {
        return mes = 'JUNHO'
    }
    if (Number(mes) === 7) {
        return mes = 'JULHO'
    }
    if (Number(mes) === 8) {
        return mes = 'AGOSTO'
    }
    if (Number(mes) === 9) {
        return mes = 'SETEMBRO'
    }
    if (Number(mes) === 10) {
        return mes = 'OUTUBRO'
    }
    if (Number(mes) === 11) {
        return mes = 'NOVEMBRO'
    }
    if (Number(mes) === 12) {
        return mes = 'DEZEMBRO'
    }
}

const promise = fetch(`https://tmdb-proxy.cubos-academy.workers.dev/3/movie/436969?language=pt-BR`)
promise.then(function (resposta) {
    const promiseBody = resposta.json();

    promiseBody.then(function (body) {
        highlightVideo.style.backgroundImage = `url(${body.backdrop_path})`
        highlightTitle.innerHTML = body.title
        highlightRating.innerHTML = body.vote_average
        highlightGenres.innerHTML = `${body.genres[0].name}, ${body.genres[1].name}, ${body.genres[2].name}, ${body.genres[3].name}`
        const mes = body.release_date.slice(5, 7)
        const mesFinal = mesDeLancamento(mes)
        const dia = body.release_date.slice(8, 10)
        const ano = body.release_date.slice(0, 4)
        const data = `/ ${dia} DE ${mesFinal} DE ${ano}`
        highlightLaunch.innerHTML = data
        highlightDescription.innerHTML = body.overview

    })
})


const promiseLink = fetch(`https://tmdb-proxy.cubos-academy.workers.dev/3/movie/436969/videos?language=pt-BR`)
promiseLink.then(function (resposta) {
    const promiseBody = resposta.json()

    promiseBody.then(function (body) {
        highlightLink.href = `https://www.youtube.com/watch?v=${body.results[0].key}`
    })
})



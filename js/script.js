const searchContainer = document.querySelector(".search-container")
const gallery = document.getElementById("gallery")
const body = document.querySelector("body")

const modalPrev = document.getElementById("modal-prev")
const modalNext = document.getElementById("modal-next")

// Setting up HTML
let searchBarHTML = `<form action="#" method="get">
<input type="search" id="search-input" class="search-input" placeholder="Search...">
<input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
</form>`
searchContainer.insertAdjacentHTML("beforeend", searchBarHTML)




// Helper fetch function to fetch data and parse json
function fetchData(url) {
    return fetch(url)
        .then(checkStatus)
        .then(response => response.json())
        .catch(err => console.log("Looks like there was an error: ", error))
}

// Call to helper function, then chain promise to create the person list
let people = []
Promise.all([fetchData("https://randomuser.me/api/?results=12")])
    .then(data => {
        people = data[0].results
        console.log(people)
        people.forEach(person => generateList(person))
    })


gallery.addEventListener("click", e => {
    console.log(e)
    // let person = document.getElementById("${person.id.value}").parentElement

})
// modalNext.addEventListener("click", e => {

// })
// modalPrev.addEventListener("click", e => {

// })

// Create the list of people on the page
function generateList(person) {
    console.log(person)
    let galleryCardHTML = `<div class="card">
    <div class="card-img-container">
        <img class="card-img" src="${person.picture.thumbnail}" alt="profile picture">
    </div>
    <div class="card-info-container">
        <h3 id="${person.id.value}" class="card-name cap">${person.name.first} ${person.name.last}</h3>
        <p class="card-text">${person.email}</p>
        <p class="card-text cap">${person.location.city}, ${person.location.state}</p>
    </div>
    </div>`
    gallery.insertAdjacentHTML("beforeend", galleryCardHTML)
}
// Create modal card for person
function generateCard(person) {
    let modalHTML = `<div class="modal-container">
    <div class= "modal">
    <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
    <div class="modal-info-container">
        <img class="modal-img" src="${person.picture.medium}" alt="profile picture">
        <h3 id="${person.id.value}" class="modal-name cap">${person.name.first} ${person.name.last}</h3>
        <p class="modal-text">${person.email}</p>
        <p class="modal-text cap">${person.location.city}</p>
        <hr>
        <p class="modal-text">${person.phone}</p>
        <p class="modal-text">${person.location.street.number} ${person.location.street.name}, ${person.location.city}, ${person.location.state} ${person.location.postcode}</p>
        <p class="modal-text">Birthday: ${person.dob.date}</p>
    </div>
    </div>`
    body.insertAdjacentHTML("beforeend", modalHTML)
    let toggleHTML = `<div class= "modal-btn-container">
        <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
        <button type="button" id="modal-next" class="modal-next btn">Next</button>
    </div>
    </div>`
    body.insertAdjacentHTML("beforeend", toggleHTML)
}
// Check whether the response status is ok, and resolve or reject accordingly
function checkStatus(response) {
    if (response.ok) {
        return Promise.resolve(response)
    } else {
        return Promise.reject(new Error(response.statusText))
    }
}
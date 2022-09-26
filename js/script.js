const searchContainer = document.querySelector(".search-container")
const gallery = document.getElementById("gallery")
const body = document.querySelector("body")
let currentModal = 0
let searchResults = []

// Sets up search bar
let searchBarHTML = `<form action="#" method="get">
<input type="search" id="search-input" class="search-input" placeholder="Search...">
<input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
</form>`
searchContainer.insertAdjacentHTML("beforeend", searchBarHTML)


// Fetches data, checks status of response, and parses json
function fetchData(url) {
    return fetch(url)
        .then(checkStatus)
        .then(response => response.json())
        // Prints any error to console
        .catch(err => console.log("Looks like there was an error: ", err))
}

let people = []
// Waits for the output from the fetchData function
Promise.all([fetchData("https://randomuser.me/api/?results=12&nat=us")])
    // Uses the received data to create a list of people
    .then(data => {
        people = data[0].results
        searchResults = people
        // Creates a card on page for each person
        for (let i = 0; i < people.length; i++) {
            generateList(people[i], i)
        }
    })

// Creates the card list of people on the page
// num represents a unique id on the parent element for accessing later
function generateList(person, num) {
    let galleryCardHTML = `<div class="card" id="${num}">
    <div class="card-img-container">
        <img class="card-img" src="${person.picture.thumbnail}" alt="profile picture">
    </div>
    <div class="card-info-container">
        <h3 id="${person.name.first}${person.name.last}" class="card-name cap">${person.name.first} ${person.name.last}</h3>
        <p class="card-text">${person.email}</p>
        <p class="card-text cap">${person.location.city}, ${person.location.state}</p>
    </div>
    </div>`
    gallery.insertAdjacentHTML("beforeend", galleryCardHTML)
    // Adds event listener on each card and generates modal card based on card id
    let card = gallery.lastChild
    card.addEventListener("click", () => {
        currentModal = parseInt(card.id)
        generateCard(person)
    })
}

// Creates modal card for person
function generateCard(person) {
    let dob = person.dob.date.slice(0, 10)
    let dd = dob.slice(8)
    let mm = dob.slice(5, 7)
    let yyyy = dob.slice(0, 4)
    let modalHTML =
        `<div class="modal-container">
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
                    <p class="modal-text">Birthday: ${mm}/${dd}/${yyyy}</p>
                </div>
            </div>
            <div class= "modal-btn-container">
                <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
                <button type="button" id="modal-next" class="modal-next btn">Next</button>
            </div>
        </div>`
    body.insertAdjacentHTML("beforeend", modalHTML)

    let modalClose = document.getElementById("modal-close-btn")
    let modalContainer = document.querySelector(".modal-container")
    // Adds functionality for close button on modal
    modalClose.addEventListener("click", e => {
        modalContainer.remove()
    })

    let modalPrev = document.getElementById("modal-prev")
    let modalNext = document.getElementById("modal-next")
    // Does not allow toggle when there is nothing to toggle to
    if (currentModal === 0) {
        modalPrev.disabled = true
    }
    if (currentModal === (searchResults.length - 1)) {
        modalNext.disabled = true
    }
    // Toggles to the next or previous person by using the unique card ids (currentModal)
    modalNext.addEventListener("click", e => {
        modalContainer.remove()
        currentModal += 1
        generateCard(searchResults[currentModal])
    })
    modalPrev.addEventListener("click", e => {
        modalContainer.remove()
        currentModal -= 1
        generateCard(searchResults[currentModal])
    })
}

// Check whether the response status is ok, and resolve or reject accordingly
function checkStatus(response) {
    if (response.ok) {
        return Promise.resolve(response)
    } else {
        return Promise.reject(new Error(response.statusText))
    }
}

// Search bar event listener
let searchInput = document.getElementById("search-input")
searchInput.addEventListener("input", (e) => {
    let searchTerm = e.target.value
    searchResults = []
    if (searchTerm !== null) {
        searchTerm.toLowerCase()
        for (let i = 0; i < people.length; i++) {
            let employeeName = `${people[i].name.first} ${people[i].name.last}`.toLowerCase()
            // Checks if each person has the search term in their name
            // Makes sure each person is in search results only once
            if ((employeeName.indexOf(searchTerm) !== -1) && (searchResults.indexOf(people[i]) === -1)) {
                searchResults.push(people[i])
            }
        }
    }
    // Shows whole list if no search term
    else {
        searchResults = people
    }
    // Removes the current gallery to prevent duplication
    gallery.replaceChildren([])
    // Generates a card list with the search results only
    for (let i = 0; i < searchResults.length; i++) {
        generateList(searchResults[i], i)
    }
})

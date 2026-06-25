/*
=========================================================
Sheraton Seating System
Version: 0.3
Author: ChatGPT
=========================================================
*/

"use strict";

/* =======================================================
   ELEMENTY HTML
======================================================= */

const searchInput = document.getElementById("searchInput");
const results = document.getElementById("results");
const messageBox = document.getElementById("messageBox");

const modal = document.getElementById("planModal");
const closeModal = document.getElementById("closeModal");
const hallTitle = document.getElementById("hallTitle");
const tableMarker = document.getElementById("tableMarker");

/* =======================================================
   DANE
======================================================= */

let guests = [];

/*
Pozycje stolików.

Po otrzymaniu plan.png
uzupełnimy wszystkie współrzędne.

Przykład:

12: { x: 650, y: 420 }

*/

const tablePositions = {

};

/* =======================================================
   NORMALIZACJA
======================================================= */

function normalize(text) {

    return String(text || "")

        .toLowerCase()

        .normalize("NFD")

        .replace(/[\u0300-\u036f]/g, "")

        .replace(/ł/g, "l")

        .replace(/ą/g, "a")

        .replace(/ć/g, "c")

        .replace(/ę/g, "e")

        .replace(/ń/g, "n")

        .replace(/ó/g, "o")

        .replace(/ś/g, "s")

        .replace(/ż/g, "z")

        .replace(/ź/g, "z")

        .trim();

}

/* =======================================================
   ŁADOWANIE GOŚCI
======================================================= */

async function loadGuests() {

    try {

        const response = await fetch("guests.json");

        guests = await response.json();

        console.log(
            "Załadowano",
            guests.length,
            "gości."
        );

    }

    catch (error) {

        console.error(error);

        showMessage(
            "Nie udało się wczytać bazy gości."
        );

    }

}

/* =======================================================
   KOMUNIKATY
======================================================= */

function showMessage(text) {

    messageBox.textContent = text;

    messageBox.classList.remove("hidden");

}

function hideMessage() {

    messageBox.textContent = "";

    messageBox.classList.add("hidden");

}


/* =======================================================
   TWORZENIE KARTY GOŚCIA
======================================================= */

function createGuestCard(guest) {

    const card = document.createElement("article");

    card.className = "result-card";

    card.innerHTML = `

        <h3>

            ${guest.firstName} ${guest.lastName}

        </h3>

        <div class="info">

            <strong>🪑 Stolik:</strong>

            ${guest.table ?? "-"}

        </div>

        <div class="info">

            <strong>🏛 Sala:</strong>

            ${guest.hall ?? "-"}

        </div>

        <button
            class="planButton"
            data-table="${guest.table}"
        >

            Pokaż plan sali

        </button>

    `;

    const button = card.querySelector(".planButton");

    button.addEventListener("click", () => {

        openPlan(guest);

    });

    return card;

}

/* =======================================================
   WYŚWIETLANIE WYNIKÓW
======================================================= */

function renderResults(foundGuests) {

    results.innerHTML = "";

    if (foundGuests.length === 0) {

        showMessage(
            "Nie znaleziono żadnego gościa."
        );

        return;

    }

    hideMessage();

    foundGuests.forEach(guest => {

        results.appendChild(

            createGuestCard(guest)

        );

    });

}

/* =======================================================
   WYSZUKIWANIE
======================================================= */

function searchGuests() {

    const query = normalize(

        searchInput.value

    );

    if (query === "") {

        results.innerHTML = "";

        hideMessage();

        return;

    }

    const filteredGuests = guests.filter(guest => {

        const firstName = normalize(

            guest.firstName

        );

        const lastName = normalize(

            guest.lastName

        );

        const fullName = normalize(

            guest.firstName + " " + guest.lastName

        );

        return (

            firstName.includes(query)

            ||

            lastName.includes(query)

            ||

            fullName.includes(query)

        );

    });

    renderResults(filteredGuests);

}


/* =======================================================
   PLAN SALI
======================================================= */

function openPlan(guest) {

    hallTitle.textContent =
        "Sala: " + (guest.hall ?? "-");

    modal.classList.remove("hidden");

    const position =
        tablePositions[guest.table];

    if (!position) {

        tableMarker.style.display = "none";

        return;

    }

    tableMarker.style.display = "block";

    tableMarker.style.left =
        position.x + "px";

    tableMarker.style.top =
        position.y + "px";

}

function closePlan() {

    modal.classList.add("hidden");

}

/* =======================================================
   ZDARZENIA
======================================================= */

searchInput.addEventListener(

    "input",

    searchGuests

);

closeModal.addEventListener(

    "click",

    closePlan

);

modal.addEventListener(

    "click",

    function(event) {

        if (event.target === modal) {

            closePlan();

        }

    }

);

/* =======================================================
   START APLIKACJI
======================================================= */

document.addEventListener(

    "DOMContentLoaded",

    function () {

        loadGuests();

        console.log(
            "Sheraton Seating System uruchomiony."
        );

    }

);

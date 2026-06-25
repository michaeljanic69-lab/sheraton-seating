/*
==================================================
Sheraton Seating System
Version 0.3
==================================================
*/

"use strict";

/* ==========================
   ELEMENTY
========================== */

const searchInput = document.getElementById("searchInput");
const results = document.getElementById("results");
const messageBox = document.getElementById("messageBox");

const modal = document.getElementById("planModal");
const closeModal = document.getElementById("closeModal");
const hallTitle = document.getElementById("hallTitle");
const tableMarker = document.getElementById("tableMarker");

/* ==========================
   DANE
========================== */

let guests = [];

const tablePositions = {

    // Uzupełnimy po dodaniu plan.png

};

/* ==========================
   NORMALIZACJA
========================== */

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

/* ==========================
   ŁADOWANIE GOŚCI
========================== */

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

/* ==========================
   KOMUNIKATY
========================== */

function showMessage(text) {

    messageBox.textContent = text;

    messageBox.classList.remove("hidden");

}

function hideMessage() {

    messageBox.textContent = "";

    messageBox.classList.add("hidden");

}


/* ==========================
   TWORZENIE KARTY
========================== */

function createGuestCard(guest) {

    const firstName = guest.first_name || guest.firstName || "";
    const lastName = guest.last_name || guest.lastName || "";

    const table = guest.table ?? "-";

    const hall = guest.hall || guest.room || "Sheraton Sopot";

    const card = document.createElement("article");

    card.className = "result-card";

    card.innerHTML = `

        <h3>${firstName} ${lastName}</h3>

        <div class="info">

            <strong>🪑 Stolik:</strong>

            ${table}

        </div>

        <div class="info">

            <strong>🏛 Sala:</strong>

            ${hall}

        </div>

        <button class="planButton">

            Pokaż plan sali

        </button>

    `;

    card.querySelector(".planButton")

        .addEventListener("click", () => {

            openPlan(guest);

        });

    return card;

}

/* ==========================
   WYNIKI
========================== */

function renderResults(foundGuests) {

    results.innerHTML = "";

    if (foundGuests.length === 0) {

        showMessage("Nie znaleziono żadnego gościa.");

        return;

    }

    hideMessage();

    foundGuests.forEach(guest => {

        results.appendChild(

            createGuestCard(guest)

        );

    });

}

/* ==========================
   WYSZUKIWANIE
========================== */

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

            guest.first_name || guest.firstName

        );

        const lastName = normalize(

            guest.last_name || guest.lastName

        );

        const fullName = normalize(

            firstName + " " + lastName

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


/* ==========================
   PLAN SALI
========================== */

function openPlan(guest) {

    const hall = guest.hall || guest.room || "Sheraton Sopot";

    hallTitle.textContent = "Sala: " + hall;

    modal.classList.remove("hidden");

    const table = guest.table;

    if (!tablePositions[table]) {

        tableMarker.style.display = "none";

        return;

    }

    tableMarker.style.display = "block";

    tableMarker.style.left =
        tablePositions[table].x + "px";

    tableMarker.style.top =
        tablePositions[table].y + "px";

}

/* ==========================
   ZAMKNIĘCIE OKNA
========================== */

function closePlan() {

    modal.classList.add("hidden");

}

closeModal.addEventListener(

    "click",

    closePlan

);

modal.addEventListener(

    "click",

    function(event){

        if(event.target===modal){

            closePlan();

        }

    }

);

/* ==========================
   START
========================== */

searchInput.addEventListener(

    "input",

    searchGuests

);

document.addEventListener(

    "DOMContentLoaded",

    function(){

        loadGuests();

    }

);

"use strict";

/* =====================================================
   SHERATON SEATING SYSTEM
   SCRIPT.JS
===================================================== */

/* ==========================
   ELEMENTY
========================== */

const firstNameInput = document.getElementById("firstName");
const lastNameInput = document.getElementById("lastName");

const result = document.getElementById("result");
const tableNumber = document.getElementById("tableNumber");
const roomName = document.getElementById("roomName");
const planButton = document.getElementById("planButton");

const modal = document.getElementById("planModal");
const planImage = document.getElementById("planImage");
const tableMarker = document.getElementById("tableMarker");

/* ==========================
   DANE
========================== */

let guests = [];

/* ==========================
   POZYCJE STOLIKÓW
========================== */

const tablePositions = {
    31: { x: 520, y: 300 }
};

/* ==========================
   NORMALIZACJA
========================== */

function normalize(text){

    return String(text || "")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g,"")
        .replace(/ł/g,"l")
        .replace(/ą/g,"a")
        .replace(/ć/g,"c")
        .replace(/ę/g,"e")
        .replace(/ń/g,"n")
        .replace(/ó/g,"o")
        .replace(/ś/g,"s")
        .replace(/ż/g,"z")
        .replace(/ź/g,"z")
        .trim();

}

/* ==========================
   ŁADOWANIE GOŚCI
========================== */

async function loadGuests(){

    try{

        const response = await fetch("guests.json");

        guests = await response.json();

        console.log(
            "Załadowano",
            guests.length,
            "gości."
        );

    }

    catch(error){

        console.error(error);

        alert("Nie udało się wczytać listy gości.");

    }

}

/* ==========================
   WYSZUKIWANIE
========================== */

function getHall(table){

    if(Number(table) <= 18){
        return "Baltic Panorama";
    }

    return "Marco Polo Ballroom";

}

function searchGuests(){

    const first = normalize(firstNameInput.value);
    const last = normalize(lastNameInput.value);

    if(first === "" && last === ""){

        result.classList.add("hidden");

        return;

    }

    const guest = guests.find(person=>{

        const guestFirst = normalize(person.first_name);

        const guestLast = normalize(person.last_name);

        const firstOk =
            first === "" ||
            guestFirst.includes(first);

        const lastOk =
            last === "" ||
            guestLast.includes(last);

        return firstOk && lastOk;

    });

    if(!guest){

        tableNumber.textContent="—";

        roomName.textContent="Nie znaleziono gościa";

        result.classList.remove("hidden");

        planButton.style.display="none";

        return;

    }

    tableNumber.textContent=guest.table;

    roomName.textContent=getHall(guest.table);

    result.classList.remove("hidden");

    planButton.style.display="inline-flex";

    planButton.onclick=function(){

        openPlan(guest);

    };

}

/* ==========================
   PLAN SALI
========================== */

function openPlan(guest){

    modal.classList.remove("hidden");

    const table = Number(guest.table);

    if(!tablePositions[table]){

        tableMarker.style.display="none";

        return;

    }

    tableMarker.style.display="block";

    tableMarker.style.left=
        tablePositions[table].x+"px";

    tableMarker.style.top=
        tablePositions[table].y+"px";

}

function closePlan(){

    modal.classList.add("hidden");

}

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

firstNameInput.addEventListener(
    "input",
    searchGuests
);

lastNameInput.addEventListener(
    "input",
    searchGuests
);

document.addEventListener(

    "DOMContentLoaded",

    async function(){

        await loadGuests();

        result.classList.add("hidden");

    }

);

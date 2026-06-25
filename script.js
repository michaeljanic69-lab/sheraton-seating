let guests = [];

fetch("guests.json")
  .then(response => response.json())
  .then(data => {
    guests = data;
  });

function normalize(text) {
  return String(text || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function searchGuest() {

  const first = normalize(document.getElementById("first").value);
  const last = normalize(document.getElementById("last").value);

  const result = document.getElementById("result");

  const guest = guests.find(g => {

    const firstName = normalize(g.first_name);
    const lastName = normalize(g.last_name);

    return (
      firstName.includes(first) &&
      lastName.includes(last)
    );

  });

  if (guest) {

    result.innerHTML = `
      <p style="font-size:24px;margin-bottom:15px;">
        Twoje miejsce znajduje się przy stoliku
      </p>

      <div class="big">
        ${guest.table}
      </div>
    `;

    if (navigator.vibrate) {
      navigator.vibrate(100);
    }

  } else {

    result.innerHTML =
      "<p style='color:#d9534f;font-size:22px;'>Nie znaleziono na liście.</p>";

  }

}

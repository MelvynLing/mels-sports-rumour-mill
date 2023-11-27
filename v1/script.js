// const initialRumours = [
//   {
//     id: 1,
//     text: "React is being developed by Meta (formerly facebook)",
//     source: "https://opensource.fb.com/",
//     category: "technology",
//     votesInteresting: 24,
//     votesMindblowing: 9,
//     votesFalse: 4,
//     createdIn: 2021,
//   },
//   {
//     id: 2,
//     text: "Premier League club want Arsenal's Aaron Ramsdale on loan with obligation to buy",
//     source:
//       "https://www.dailystar.co.uk/sport/football/arsenal-aaron-ramsdale-wolves-exclusive-31525972",
//     category: "Soccer",
//     votesInteresting: 11,
//     votesMindblowing: 2,
//     votesFalse: 0,
//     createdIn: 2019,
//   },
//   {
//     id: 3,
//     text: "Devils, Islanders make minor trade",
//     source:
//       "https://www.yardbarker.com/nhl/articles/devils_islanders_make_minor_trade/s1_16958_39586975",
//     category: "Hockey",
//     votesInteresting: 8,
//     votesMindblowing: 3,
//     votesFalse: 1,
//     createdIn: 2015,
//   },
// ];

const CATEGORIES = [
  { name: "Hockey", color: "#3b82f6" },
  { name: "Soccer", color: "#16a34a" },
  { name: "Baseball", color: "#ef4444" },
  { name: "Golf", color: "#eab308" },
  { name: "Tennis", color: "#db2777" },
  { name: "Football", color: "#14b8a6" },
  { name: "Basketball", color: "#f97316" },
  { name: "Olympics", color: "#8b5cf6" },
];

// Selecting DOM elements
const btn = document.querySelector(".btn-opener");
const form = document.querySelector(".gossipForm");
const rumoursList = document.querySelector(".rumoursList");

// Create DOM elements: Render rumours in list
rumoursList.innerHTML = "";

// Load data from Supabase
loadRumours();

async function loadRumours() {
  const res = await fetch(
    "https://yydvuvlhccvmanajfoxq.supabase.co/rest/v1/rumours",
    {
      headers: {
        apikey:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl5ZHZ1dmxoY2N2bWFuYWpmb3hxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDEwMjQ4MDYsImV4cCI6MjAxNjYwMDgwNn0.sxEnJ0Dl76K9z13Ju_yeElEmcVh9H30quq_yd6Gahd8",
        authorization:
          " Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl5ZHZ1dmxoY2N2bWFuYWpmb3hxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDEwMjQ4MDYsImV4cCI6MjAxNjYwMDgwNn0.sxEnJ0Dl76K9z13Ju_yeElEmcVh9H30quq_yd6Gahd8",
      },
    }
  );
  const data = await res.json();
  createrumoursList(data);
}

function createrumoursList(dataArray) {
  const htmlArr = dataArray.map(
    (rumour) => `<li class="rumourContainer">
    <p class="rumour">
    ${rumour.text}
      <a
      class="sourceLink"
        href="${rumour.source}"
        target="_blank"
      >(Source)</a>
    </p>
    <span class="sportTag" style="background-color: ${
      CATEGORIES.find((cat) => cat.name === rumour.category).color
    }">${rumour.category}</span>
    <div class="vote_buttons">
    <button><span class="btn-icon">👍</span><strong>${
      rumour.votesInteresting
    }</strong></button>
    <button><span class="btn-icon">🤯</span><strong>${
      rumour.votesMindBlowing
    }</strong></button>
    <button><span class="btn-icon">⛔</span><strong>${
      rumour.votesFalse
    }</strong></button>
  </div>
  </li>`
  );
  const html = htmlArr.join("");
  rumoursList.insertAdjacentHTML("afterbegin", html);
}

// Toggle form visibility
btn.addEventListener("click", function () {
  if (form.classList.contains("hidden")) {
    form.classList.remove("hidden");
    btn.textContent = "Close";
  } else {
    form.classList.add("hidden");
    btn.textContent = "Share a rumour";
  }
});

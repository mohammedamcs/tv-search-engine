// Query Selectors
const fetchBtn = document.getElementById("fetch-btn");
const searchInput = document.querySelector("input[name='q']");
const contentContainer = document.querySelector(".content");

// Event Listeners
document.addEventListener(
  "keydown",
  (e) => e.key === "Enter" && searchTVShows()
);
fetchBtn.addEventListener("click", searchTVShows);

function searchTVShows() {
  const { value } = searchInput;
  if (value !== "") {
    showData(value);
  } else {
    alert("You didn't enter any value");
  }
  searchInput.value = "";
}

async function showData(tvShow) {
  const url = `https://api.tvmaze.com/search/shows?q=${tvShow}`;
  const tvShows = await fetchTVShows(url);
  if (tvShows.length > 0) {
    // Clear Content Container
    contentContainer.innerHTML = "";
    for (let $ of tvShows) {
      const { show } = $;
      createCard(show);
    }
  } else {
    contentContainer.innerHTML = errorMessage(
      `Sorry, but there is no data found for '${tvShow}'`
    );
  }
}

async function fetchTVShows(url) {
  try {
    const res = await fetch(url);
    const data = await res.json();
    return data;
  } catch (error) {
    contentContainer.innerHTML = errorMessage(
      `Sorry, but there is no data available at the moment,try again later`
    );
  }
}

function createCard(show) {
  // Card Container
  const card = document.createElement("div");
  card.className = "card";

  // Create img
  const img = document.createElement("img");
  img.src =
    show?.image?.medium ||
    show?.image?.original ||
    "./images/not-found-image.png";

  // Create Info
  const cardInfo = createCardInfo(show);

  // Append
  card.appendChild(img);
  card.appendChild(cardInfo);
  contentContainer.appendChild(card);
}

function createCardInfo(show) {
  const info = cleanData(show);
  const cardInfo = document.createElement("div");
  cardInfo.className = "info";
  for (let key in info) {
    const div = document.createElement("div");
    div.className = key;
    const [infoType, infoValue] = [
      document.createElement("span"),
      document.createElement("span"),
    ];
    infoType.className = "capitalize";
    infoType.innerHTML = `${key}: `;
    infoValue.innerHTML = info[key] || "No Data";

    // append
    div.appendChild(infoType);
    div.appendChild(infoValue);
    cardInfo.appendChild(div);
  }
  return cardInfo;
}

function cleanData(show) {
  const info = {
    name: show.name,
    rating: show.rating.average,
    premiered: show.premiered,
    status: show.status,
  };

  if (show.network) {
    info.network = show.network.name;
  } else {
    info["web channel"] = show.webChannel.name;
  }

  info.summary = show.summary;

  return info;
}

function errorMessage(message) {
  return ` 
  <div class="no-data">
  <img src="./images/empty-box.png" alt="empty-box.png">
  <span>${message}</span>
  </div>`;
}

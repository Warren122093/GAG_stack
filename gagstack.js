// GAG Stack Live Tracker JS – With "🎪 Event Stock" (from honey section) and CORS-safe

const navToggle = document.getElementById("navToggle");
const mainNav = document.getElementById("mainNav");
navToggle.addEventListener("click", function () {
  mainNav.classList.toggle("open");
  if (mainNav.classList.contains("open")) {
    setTimeout(() => {
      window.addEventListener("click", navCloseHandler);
    }, 0);
  }
});
function navCloseHandler(e) {
  if (!mainNav.contains(e.target)) {
    mainNav.classList.remove("open");
    window.removeEventListener("click", navCloseHandler);
  }
}
const themeSelect = document.getElementById("themeSelect");
function setTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("gag_theme", theme);
}
themeSelect.addEventListener("change", function () {
  setTheme(this.value);
});
(function () {
  const savedTheme = localStorage.getItem("gag_theme");
  if (savedTheme) {
    setTheme(savedTheme);
    themeSelect.value = savedTheme;
  } else {
    setTheme("main");
    themeSelect.value = "main";
  }
})();
(function () {
  const navLinks = document.querySelectorAll(".nav-link");
  const current = window.location.pathname.replace(/\\/g, '/').split('/').pop() || "index2.html";
  navLinks.forEach(link => {
    if (link.getAttribute("href") === current) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
})();
if ("Notification" in window && Notification.permission !== "granted") {
  Notification.requestPermission();
}

// Important items lists (expand as needed)
const importantEggs = ["Bug Egg", "Rare Egg", "Legendary Egg", "Mythical Egg"];
const importantSeeds = [
  "Ember Lily Seed", "Sugar Apple Seed", "Beanstalk Seed", "Cacao Seed",
  "Pepper Seed", "Mushroom Seed", "Grape Seed", "Elephant Ears",
  "Rosy Delight", "Parasol Flower", "Cantaloupe", "Pear", "Wild Carrot",
  "Mango Seed", "Green Apple", "Avocado", "Banana", "Pineapple", "Bell Pepper",
  "Prickly Pear", "Kiwi", "Feijoa", "Loquat"
];
const importantGears = [
  "Basic Sprinkler", "Advanced Sprinkler", "Godly Sprinkler", "Master Sprinkler",
  "Lightning Rod", "Tanning Mirror", "Friendship Pot"
];
const importantEvents = [
  "Zenflare", "Corrupt Radar", "Zen Seed Pack", "Sakura Bush",
  "Zen Sand", "Tranquil Radar", "Raiju", "Koi", "Zen Egg",
  "Pet Shard Tranquil", "Pet Shard Corrupted"
];
let notifiedAvailable = {};
const emojis = {
  "Rare Summer Egg": "🌞🍳", "Common Summer Egg": "🌞🥚", "Paradise Egg": "🏝️🥚",
  "Common Egg": '🥚', "Uncommon Egg": '🐣', "Rare Egg": '🍳', "Legendary Egg": '🪺', "Mythical Egg": '🔮', "Bug Egg": '🪲',
  "Watering Can": '🚿', "Cleaning Spray": '🧴', "Friendship Pot": '💑', "Trowel": "🛠️", "Recall Wrench": '🔧',
  "Basic Sprinkler": '💧', "Advanced Sprinkler": '💦', "Godly Sprinkler": '⛲', "Tanning Mirror": "🧴☀️",
  "Lightning Rod": '⚡', "Master Sprinkler": '🌊', "Favorite Tool": '❤️', "Harvest Tool": '🌾',
  'Carrot': '🥕', 'Strawberry': '🍓', 'Blueberry': '🫐', 'Orange Tulip': '🌷', 'Tomato': '🍅', 'Corn': '🌽',
  'Daffodil': '🌼', 'Watermelon': '🍉', 'Pumpkin': '🎃', 'Apple': '🍎', 'Bamboo': '🎍', 'Coconut': '🥥', 'Cactus': '🌵',
  "Dragon Fruit": '🍈', 'Mango': '🥭', 'Grape': '🍇', 'Mushroom': '🍄', 'Pepper': "🌶️", 'Cacao': '🍫',
  'Beanstalk': '🌱', "Ember Lily": "🏵️", "Sugar Apple": '🍏', "Wild Honey": '🍯',
  "Zenflare": "💠", "Corrupt Radar": "☢️", "Zen Seed Pack": "🎁", "Sakura Bush": "🌸",
  "Zen Sand": "🏖️", "Tranquil Radar": "🌿",
  "Stone Lantern": "🏮", "Water Trough": "🚰", "Mini TV": "📺", "Small Stone Table": "🪑", "Tiki Bar": "🍹",
  "Medium Wood Flooring": "🪵", "Log": "🪵", "Statue Crate": "📦", "Beach Crate": "🏝️",
  // Dog icons for Pet Shards
  "Pet Shard Tranquil": "🐶🟢",     // Dog with tranquil indicator
  "Pet Shard Corrupted": "🐶🟥"     // Dog with corrupted indicator
};

function sectionLabel(section) {
  switch (section) {
    case "gear": return "Gear";
    case "seed": return "Seed";
    case "egg": return "Egg";
    case "cosmetics": return "Cosmetics";
    case "honey": return "Event Stock";
    default: return section.charAt(0).toUpperCase() + section.slice(1);
  }
}
function formatValue(val) {
  if (val >= 1_000_000) return 'x' + (val / 1_000_000).toFixed(1) + 'M';
  if (val >= 1_000) return 'x' + (val / 1_000).toFixed(1) + 'K';
  return 'x' + val;
}
function getItemPrice(item) {
  if (typeof item.price !== "undefined") return formatValue(Number(item.price));
  if (typeof item.cost !== "undefined") return formatValue(Number(item.cost));
  return '--';
}
function shouldNotify(section, name) {
  const importantOnly = document.getElementById("importantNotifySwitch")?.checked;
  if (!importantOnly) return true;
  if (section === "egg") return importantEggs.includes(name);
  if (section === "seed") return importantSeeds.includes(name);
  if (section === "gear") return importantGears.includes(name);
  if (section === "honey") return importantEvents.includes(name);
  return false;
}
function sendAvailabilityNotification(name, qty) {
  if ("Notification" in window && Notification.permission === "granted") {
    new Notification("Available: " + name, {
      body: "Qty: " + qty,
      icon: "https://cdn-icons-png.flaticon.com/512/616/616408.png"
    });
  }
}
function showImportantOverlay(items) {
  if (!items.length) return;
  const overlay = document.getElementById("importantOverlay");
  const list = document.getElementById("overlayAvailableList");
  list.innerHTML = items.map(({ section, name, quantity }) =>
    `<div><b>${name}</b> (${sectionLabel(section)}): <span style="color:#4be87a;font-weight:bold;">${quantity}</span></div>`
  ).join('');
  overlay.style.display = "flex";
}
function hideImportantOverlay() {
  document.getElementById("importantOverlay").style.display = "none";
}
function pad(n) { return n < 10 ? '0' + n : n; }
function getPHTime() {
  return new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Manila" }));
}
function getCountdown(target) {
  const now = getPHTime();
  const diff = target - now;
  if (diff <= 0) return "00h 00m 00s";
  const h = Math.floor(diff / 3600000);
  const m = Math.floor(diff % 3600000 / 60000);
  const s = Math.floor(diff % 60000 / 1000);
  return `${pad(h)}h ${pad(m)}m ${pad(s)}s`;
}
function getNextRestocks() {
  const now = getPHTime();
  const restocks = {};
  const nextEgg = new Date(now);
  nextEgg.setSeconds(0, 0);
  if (now.getMinutes() < 30) nextEgg.setMinutes(30);
  else { nextEgg.setHours(now.getHours() + 1); nextEgg.setMinutes(0); }
  restocks.egg = restocks.honey = getCountdown(nextEgg);

  const nextSeed = new Date(now);
  let minSeed = Math.ceil((now.getMinutes() + (now.getSeconds() > 0 ? 1 : 0)) / 5) * 5;
  nextSeed.setSeconds(0, 0);
  if (minSeed === 60) { nextSeed.setHours(now.getHours() + 1); nextSeed.setMinutes(0); }
  else nextSeed.setMinutes(minSeed);
  restocks.gear = restocks.seed = getCountdown(nextSeed);

  const nextCosm = new Date(now);
  let hour = now.getHours() + now.getMinutes() / 60 + now.getSeconds() / 3600;
  let next4h = Math.ceil(hour / 4) * 4;
  nextCosm.setHours(next4h, 0, 0, 0);
  restocks.cosmetics = getCountdown(nextCosm);

  return restocks;
}
async function safeFetch(url) {
  try {
    const resp = await fetch(url);
    if (resp.ok) return await resp.json();
    throw new Error("Direct fetch failed");
  } catch {
    const resp = await fetch("https://corsproxy.io/?" + encodeURIComponent(url));
    if (resp.ok) return await resp.json();
    throw new Error("Both direct and proxy fetch failed");
  }
}
async function fetchAndRender() {
  const sectionsContainer = document.querySelector("#sections");
  const scrollY = window.scrollY;
  const updateTime = document.getElementById("updateTime");
  try {
    const json = await safeFetch("https://gagstock.gleeze.com/grow-a-garden");
    const data = json.data;
    const restocks = getNextRestocks();

    // Build sections, now with explicit "🎪 Event Stock" from honey
    const sections = [
      { label: "🛠️ Gear", emoji: "🛠️", sectionKey: "gear", rows: data.gear.items, restock: restocks.gear },
      { label: "🌱 Seeds", emoji: "🌱", sectionKey: "seed", rows: data.seed.items, restock: restocks.seed },
      { label: "🥚 Eggs", emoji: "🥚", sectionKey: "egg", rows: data.egg.items, restock: restocks.egg },
      { label: "🎨 Cosmetics", emoji: "🎨", sectionKey: "cosmetics", rows: data.cosmetics.items, restock: restocks.cosmetics },
      data.honey?.items ? { label: "🎪 Event Stock", emoji: "🎪", sectionKey: "honey", rows: data.honey.items, restock: restocks.honey } : null
    ].filter(Boolean);

    // Notification logic: include honey section
    let importantAvailable = [];
    ["gear", "seed", "egg", "honey"].forEach(section => {
      (data[section]?.items || []).forEach(item => {
        const should = shouldNotify(section, item.name);
        const qty = Number(item.quantity);
        if (should && qty > 0) {
          if (!notifiedAvailable[item.name]) {
            sendAvailabilityNotification(item.name, qty);
            notifiedAvailable[item.name] = true;
          }
          importantAvailable.push({ section, name: item.name, quantity: qty });
        } else {
          notifiedAvailable[item.name] = false;
        }
      });
    });
    if (document.getElementById("importantNotifySwitch")?.checked && importantAvailable.length > 0) {
      showImportantOverlay(importantAvailable);
    } else {
      hideImportantOverlay();
    }

    // Render all sections
    sectionsContainer.innerHTML = '';
    for (const section of sections) {
      const div = document.createElement("div");
      div.className = "section";
      div.innerHTML = `
        <div class="section-title"><span class="emoji">${section.emoji}</span>${section.label.replace(section.emoji, '')}</div>
        <span class="restock">${section.restock ? "⏳ Restock in: " + section.restock : ''}</span>
        <table>
          <thead>
            <tr><th>Item</th><th>Qty Available</th><th>Price</th></tr>
          </thead>
          <tbody>
            ${section.rows.map(item =>
              `<tr>
                <td>${emojis[item.name] ? `<span class="emoji">${emojis[item.name]}</span>` : ''}${item.name}</td>
                <td>${formatValue(Number(item.quantity))}</td>
                <td>${getItemPrice(item)}</td>
              </tr>`).join('')}
          </tbody>
        </table>
      `;
      sectionsContainer.appendChild(div);
    }
    updateTime.textContent = "Last updated: " + new Date().toLocaleTimeString("en-PH", {
      hour: "2-digit", minute: "2-digit", second: "2-digit"
    });
  } catch (err) {
    updateTime.innerHTML = "<span class=\"error-msg\">Failed to fetch data! Please check your connection.</span>";
    document.querySelector("#sections").innerHTML = '';
  }
  setTimeout(() => {
    window.scrollTo(0, scrollY);
  }, 0);
}
async function fetchAndRenderWeatherSection() {
  const weatherSection = document.getElementById("weatherSection");
  weatherSection.innerHTML = `
    <div class="section-title"><span class="emoji">⏳</span>Weather</div>
    <div>Loading...</div>
  `;
  try {
    const data = await safeFetch("https://growagardenstock.com/api/stock/weather");
    let updated = data.updatedAt ? (typeof data.updatedAt === "number" ? new Date(data.updatedAt).toLocaleString() : data.updatedAt) : "Unknown";
    weatherSection.innerHTML = `
      <div class="section-title"><span class="emoji">${data.icon || "🌤️"}</span>Weather</div>
      <table>
        <tbody>
          <tr><td style="font-weight:bold;">Status</td><td>${data.currentWeather || data.weatherType || "Unknown"}</td></tr>
          <tr><td style="font-weight:bold;">Description</td><td>${data.description || data.effectDescription || "None"}</td></tr>
          <tr><td style="font-weight:bold;">Crop Bonus</td><td>${data.cropBonuses || "None"}</td></tr>
          <tr><td style="font-weight:bold;">Rarity</td><td>${data.rarity || "Unknown"}</td></tr>
          <tr><td style="font-weight:bold;">Visual Cue</td><td>${data.visualCue || "None"}</td></tr>
          <tr><td style="font-weight:bold;">Updated</td><td>${updated}</td></tr>
        </tbody>
      </table>
    `;
  } catch (err) {
    weatherSection.innerHTML = `
      <div class="section-title"><span class="emoji">❌</span>Weather</div>
      <div style="color:red;">Weather unavailable</div>
    `;
    console.error("Weather fetch error:", err);
  }
}
async function checkApiStatus() {
  const apiStatus = document.getElementById("apiStatus");
  const onlineColor = getComputedStyle(document.documentElement).getPropertyValue("--online").trim() || "#4be87a";
  const offlineColor = getComputedStyle(document.documentElement).getPropertyValue("--offline").trim() || "#ff5252";
  try {
    await safeFetch("https://gagstock.gleeze.com/grow-a-garden");
    apiStatus.textContent = "API: Online";
    apiStatus.style.color = onlineColor;
  } catch (err) {
    apiStatus.textContent = "API: Offline";
    apiStatus.style.color = offlineColor;
  }
}
document.getElementById("refresh-btn").addEventListener("click", fetchAndRender);
document.getElementById("importantNotifySwitch").addEventListener("change", () => {
  notifiedAvailable = {};
  fetchAndRender();
});
document.getElementById("overlayCloseBtn").onclick = hideImportantOverlay;
document.getElementById("aboutDevBtn").addEventListener("click", function (e) {
  e.preventDefault();
  document.getElementById("aboutDevOverlay").style.display = "flex";
});
document.getElementById("aboutDevCloseBtn").onclick = function () {
  document.getElementById("aboutDevOverlay").style.display = "none";
};
document.getElementById("aboutDevOverlay").addEventListener("click", function (e) {
  if (e.target === this) this.style.display = "none";
});
fetchAndRender();
setInterval(fetchAndRender, 15000);
window.addEventListener("resize", fetchAndRender);
fetchAndRenderWeatherSection();
setInterval(fetchAndRenderWeatherSection, 300000);
checkApiStatus();
setInterval(checkApiStatus, 15000);

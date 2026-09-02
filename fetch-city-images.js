const cities = [
  "Jakarta", "Bandung", "Surabaya", "Yogyakarta", "Semarang", "Malang", "Cirebon", "Banyuwangi",
  "Solo", "Tegal", "Pekalongan", "Blora", "Bojonegoro", "Purwokerto", "Cilacap", "Purworejo",
  "Madiun", "Jombang", "Mojokerto", "Sidoarjo", "Probolinggo", "Jember", "Blitar"
];

async function fetchCityImages() {
  const results = {};
  const headers = { 'User-Agent': 'BookingKAI-Agent/1.0 (contact@example.com)' };
  
  for (const city of cities) {
    try {
      // First try indonesian wiki since these are indonesian cities
      let res = await fetch(`https://id.wikipedia.org/w/api.php?action=query&titles=${city}&prop=pageimages&format=json&pithumbsize=600`, { headers });
      let data = await res.json();
      let pages = data.query.pages;
      let pageId = Object.keys(pages)[0];
      
      if (pageId !== "-1" && pages[pageId].thumbnail) {
        results[city] = pages[pageId].thumbnail.source;
      } else {
        // Fallback to english wikipedia
        res = await fetch(`https://en.wikipedia.org/w/api.php?action=query&titles=${city}&prop=pageimages&format=json&pithumbsize=600`, { headers });
        data = await res.json();
        pages = data.query.pages;
        pageId = Object.keys(pages)[0];
        if (pageId !== "-1" && pages[pageId].thumbnail) {
          results[city] = pages[pageId].thumbnail.source;
        } else {
          results[city] = "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=600&q=80"; // Generic fallback
        }
      }
    } catch (e) {
      console.log("Error fetching", city, e);
    }
  }
  console.log(JSON.stringify(results, null, 2));
}

fetchCityImages();

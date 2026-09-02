const missing = [
  "Kabupaten Banyuwangi", "Surakarta", "Kabupaten Blora", "Kabupaten Bojonegoro", "Kabupaten Cilacap", "Kabupaten Purworejo",
  "Kabupaten Jombang", "Kabupaten Sidoarjo", "Kabupaten Jember"
];

async function fetchMissingImages() {
  const results = {};
  const headers = { 'User-Agent': 'BookingKAI-Agent/1.0 (contact@example.com)' };
  
  for (const city of missing) {
    try {
      let res = await fetch(`https://id.wikipedia.org/w/api.php?action=query&titles=${city}&prop=pageimages&format=json&pithumbsize=600`, { headers });
      let data = await res.json();
      let pages = data.query.pages;
      let pageId = Object.keys(pages)[0];
      
      if (pageId !== "-1" && pages[pageId].thumbnail) {
        results[city] = pages[pageId].thumbnail.source;
      }
    } catch (e) {
      console.log("Error fetching", city, e);
    }
  }
  console.log(JSON.stringify(results, null, 2));
}

fetchMissingImages();

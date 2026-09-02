const fs = require('fs');
const path = require('path');
const osmtogeojson = require('osmtogeojson');
const axios = require('axios');

async function fetchRailways() {
  console.log("Fetching railway data for Java from Overpass API...");
  
  const query = `
    [out:json][timeout:90];
    (
      way["railway"="rail"]["usage"!="industrial"]["usage"!="military"](-8.84,105.10,-5.88,114.60);
    );
    out body;
    >;
    out skel qt;
  `;
  
  try {
    const response = await axios.post('https://overpass-api.de/api/interpreter', `data=${encodeURIComponent(query)}`, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'NodeJS/18',
        'Accept': 'application/json'
      }
    });
    
    const data = response.data;
    console.log(`Received ${data.elements.length} elements from Overpass.`);
    
    console.log("Converting to GeoJSON...");
    const geojson = osmtogeojson(data);
    
    geojson.features = geojson.features.filter(f => f.geometry.type === 'LineString');
    
    const outDir = path.join(__dirname, 'public', 'data');
    if (!fs.existsSync(outDir)) {
      fs.mkdirSync(outDir, { recursive: true });
    }
    
    const outFile = path.join(outDir, 'railways.json');
    fs.writeFileSync(outFile, JSON.stringify(geojson));
    console.log(`Saved to ${outFile}. Size: ${(fs.statSync(outFile).size / 1024 / 1024).toFixed(2)} MB`);
    
  } catch (error) {
    console.error("Error fetching railways:", error);
  }
}

fetchRailways();

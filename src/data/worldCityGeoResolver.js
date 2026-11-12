// Comprehensive Global Cartographic Geo-Resolver
// Calibrated for 2000 x 1001 High-Fidelity Surveyor World Vector Projection

export const KNOWN_WORLD_CITIES = [
  // Europe
  {
    name: 'Amalfi Coast',
    country: 'Italy',
    aliases: ['amalfi', 'positano', 'capri', 'naples', 'sorrento', 'ravello'],
    shortTitle: 'A M A L F I',
    lat: 40.6340,
    lng: 14.6027,
    mapX: 1068,
    mapY: 335
  },
  {
    name: 'Rome',
    country: 'Italy',
    aliases: ['rome', 'roma', 'vatican', 'colosseum', 'tuscany', 'florence'],
    shortTitle: 'R O M A',
    lat: 41.9028,
    lng: 12.4964,
    mapX: 1060,
    mapY: 330
  },
  {
    name: 'Venice',
    country: 'Italy',
    aliases: ['venice', 'venezia', 'murano', 'burano', 'grand canal'],
    shortTitle: 'V E N I C E',
    lat: 45.4408,
    lng: 12.3155,
    mapX: 1058,
    mapY: 300
  },
  {
    name: 'Swiss Alps',
    country: 'Switzerland',
    aliases: ['switzerland', 'swiss', 'zermatt', 'matterhorn', 'interlaken', 'zurich', 'geneva', 'st moritz'],
    shortTitle: 'Z E R M A T T',
    lat: 45.9765,
    lng: 7.7491,
    mapX: 1024,
    mapY: 275
  },
  {
    name: 'Santorini',
    country: 'Greece',
    aliases: ['santorini', 'oia', 'fira', 'mykonos', 'cyclades', 'athens', 'crete'],
    shortTitle: 'S A N T O R I N I',
    lat: 36.3932,
    lng: 25.4615,
    mapX: 1125,
    mapY: 355
  },
  {
    name: 'Cappadocia',
    country: 'Turkey',
    aliases: ['cappadocia', 'goreme', 'urgup', 'fairy chimneys', 'turkey', 'istanbul', 'bosphorus', 'bodrum'],
    shortTitle: 'C A P P A D O C I A',
    lat: 38.6431,
    lng: 34.8289,
    mapX: 1195,
    mapY: 315
  },
  {
    name: 'Iceland',
    country: 'Iceland',
    aliases: ['iceland', 'reykjavik', 'blue lagoon', 'golden circle', 'vik', 'aurora'],
    shortTitle: 'I C E L A N D',
    lat: 64.1466,
    lng: -21.9426,
    mapX: 894,
    mapY: 160
  },
  {
    name: 'Paris',
    country: 'France',
    aliases: ['paris', 'france', 'louvre', 'eiffel', 'versailles', 'nice', 'cannes', 'riviera', 'provence', 'monaco'],
    shortTitle: 'P A R I S',
    lat: 48.8566,
    lng: 2.3522,
    mapX: 1005,
    mapY: 280
  },
  {
    name: 'London',
    country: 'United Kingdom',
    aliases: ['london', 'uk', 'britain', 'england', 'scotland', 'edinburgh', 'highlands', 'mayfair'],
    shortTitle: 'L O N D O N',
    lat: 51.5074,
    lng: -0.1278,
    mapX: 980,
    mapY: 235
  },
  {
    name: 'Spain',
    country: 'Spain',
    aliases: ['spain', 'barcelona', 'madrid', 'ibiza', 'mallorca', 'seville', 'andalusia'],
    shortTitle: 'B A R C E L O N A',
    lat: 41.3879,
    lng: 2.1699,
    mapX: 1002,
    mapY: 340
  },
  {
    name: 'Portugal',
    country: 'Portugal',
    aliases: ['portugal', 'lisbon', 'porto', 'algarve', 'sintra', 'madeira', 'azores'],
    shortTitle: 'L I S B O N',
    lat: 38.7223,
    lng: -9.1393,
    mapX: 935,
    mapY: 360
  },
  {
    name: 'Norway Fjords',
    country: 'Norway',
    aliases: ['norway', 'oslo', 'bergen', 'tromso', 'fjords', 'lofoten'],
    shortTitle: 'N O R W A Y',
    lat: 60.3913,
    lng: 5.3221,
    mapX: 1015,
    mapY: 175
  },

  // Asia & Oceania
  {
    name: 'Kyoto',
    country: 'Japan',
    aliases: ['kyoto', 'japan', 'tokyo', 'mount fuji', 'fuji', 'osaka', 'hokkaido', 'hakone'],
    shortTitle: 'K Y O T O',
    lat: 35.0116,
    lng: 135.7681,
    mapX: 1745,
    mapY: 350
  },
  {
    name: 'Bali',
    country: 'Indonesia',
    aliases: ['bali', 'indonesia', 'uluwatu', 'ubud', 'seminyak', 'canggu', 'komodo', 'raja ampat'],
    shortTitle: 'B A L I',
    lat: -8.8153,
    lng: 115.0884,
    mapX: 1640,
    mapY: 620
  },
  {
    name: 'Maldives',
    country: 'Maldives',
    aliases: ['maldives', 'male', 'atoll', 'overwater villa', 'noonu atoll'],
    shortTitle: 'M A L D I V E S',
    lat: 3.2028,
    lng: 73.2207,
    mapX: 1395,
    mapY: 535
  },
  {
    name: 'Dubai',
    country: 'United Arab Emirates',
    aliases: ['dubai', 'uae', 'emirates', 'abu dhabi', 'burj khalifa', 'palm jumeirah'],
    shortTitle: 'D U B A I',
    lat: 25.2048,
    lng: 55.2708,
    mapX: 1285,
    mapY: 410
  },
  {
    name: 'Thailand',
    country: 'Thailand',
    aliases: ['thailand', 'bangkok', 'phuket', 'koh samui', 'chiang mai', 'krabi'],
    shortTitle: 'P H U K E T',
    lat: 7.8804,
    lng: 98.3923,
    mapX: 1535,
    mapY: 510
  },
  {
    name: 'Singapore',
    country: 'Singapore',
    aliases: ['singapore', 'marina bay', 'sentosa'],
    shortTitle: 'S I N G A P O R E',
    lat: 1.3521,
    lng: 103.8198,
    mapX: 1570,
    mapY: 550
  },
  {
    name: 'Vietnam',
    country: 'Vietnam',
    aliases: ['vietnam', 'hanoi', 'ha long bay', 'da nang', 'hoi an', 'saigon'],
    shortTitle: 'V I E T N A M',
    lat: 21.0285,
    lng: 105.8542,
    mapX: 1575,
    mapY: 435
  },
  {
    name: 'Australia',
    country: 'Australia',
    aliases: ['australia', 'sydney', 'melbourne', 'great barrier reef', 'whitsundays', 'byron bay', 'gold coast'],
    shortTitle: 'S Y D N E Y',
    lat: -33.8688,
    lng: 151.2093,
    mapX: 1835,
    mapY: 760
  },
  {
    name: 'New Zealand',
    country: 'New Zealand',
    aliases: ['new zealand', 'queenstown', 'auckland', 'milford sound', 'rotorua'],
    shortTitle: 'Q U E E N S T O W N',
    lat: -45.0312,
    lng: 168.6626,
    mapX: 1930,
    mapY: 825
  },
  {
    name: 'Bora Bora',
    country: 'French Polynesia',
    aliases: ['bora bora', 'tahiti', 'french polynesia', 'moorea'],
    shortTitle: 'B O R A  B O R A',
    lat: -16.5004,
    lng: -151.7415,
    mapX: 165,
    mapY: 650
  },

  // Americas
  {
    name: 'New York',
    country: 'United States',
    aliases: ['new york', 'nyc', 'manhattan', 'brooklyn', 'hamptons'],
    shortTitle: 'N E W  Y O R K',
    lat: 40.7128,
    lng: -74.0060,
    mapX: 585,
    mapY: 310
  },
  {
    name: 'California',
    country: 'United States',
    aliases: ['california', 'los angeles', 'san francisco', 'napa valley', 'big sur', 'yosemite', 'beverly hills'],
    shortTitle: 'C A L I F O R N I A',
    lat: 36.7783,
    lng: -119.4179,
    mapX: 330,
    mapY: 340
  },
  {
    name: 'Hawaii',
    country: 'United States',
    aliases: ['hawaii', 'maui', 'honolulu', 'oahu', 'kauai'],
    shortTitle: 'H A W A I I',
    lat: 19.8968,
    lng: -155.5828,
    mapX: 140,
    mapY: 450
  },
  {
    name: 'Patagonia',
    country: 'Chile & Argentina',
    aliases: ['patagonia', 'torres del paine', 'chile', 'argentina', 'buenos aires', 'bariloche', 'ushuaia'],
    shortTitle: 'P A T A G O N I A',
    lat: -51.2532,
    lng: -72.8814,
    mapX: 580,
    mapY: 885
  },
  {
    name: 'Peru',
    country: 'Peru',
    aliases: ['peru', 'machu picchu', 'cusco', 'lima', 'sacred valley'],
    shortTitle: 'M A C H U  P I C C H U',
    lat: -13.1631,
    lng: -72.5450,
    mapX: 585,
    mapY: 625
  },
  {
    name: 'Brazil',
    country: 'Brazil',
    aliases: ['brazil', 'rio de janeiro', 'copacabana', 'sao paulo', 'amazon', 'iguazu'],
    shortTitle: 'R I O',
    lat: -22.9068,
    lng: -43.1729,
    mapX: 745,
    mapY: 690
  },

  // Africa & Middle East
  {
    name: 'Serengeti',
    country: 'Tanzania',
    aliases: ['serengeti', 'tanzania', 'ngorongoro', 'zanzibar', 'kilimanjaro'],
    shortTitle: 'S E R E N G E T I',
    lat: -2.3333,
    lng: 34.8333,
    mapX: 1215,
    mapY: 565
  },
  {
    name: 'Kenya Safari',
    country: 'Kenya',
    aliases: ['kenya', 'masai mara', 'nairobi', 'amboseli'],
    shortTitle: 'M A S A I  M A R A',
    lat: -1.4061,
    lng: 35.0022,
    mapX: 1210,
    mapY: 550
  },
  {
    name: 'South Africa',
    country: 'South Africa',
    aliases: ['south africa', 'cape town', 'kruger', 'table mountain', 'stellenbosch'],
    shortTitle: 'C A P E  T O W N',
    lat: -33.9249,
    lng: 18.4241,
    mapX: 1105,
    mapY: 735
  },
  {
    name: 'Morocco',
    country: 'Morocco',
    aliases: ['morocco', 'marrakech', 'casablanca', 'sahara desert', 'fez'],
    shortTitle: 'M A R R A K E C H',
    lat: 31.6295,
    lng: -7.9811,
    mapX: 955,
    mapY: 375
  },
  {
    name: 'Egypt',
    country: 'Egypt',
    aliases: ['egypt', 'cairo', 'pyramids', 'nile', 'luxor', 'aswan'],
    shortTitle: 'C A I R O',
    lat: 30.0444,
    lng: 31.2357,
    mapX: 1180,
    mapY: 380
  }
];

// Mathematical projection of real (lat, lng) to world SVG canvas (2000 x 1001)
export function projectLatLngToWorldMap(lat, lng) {
  const numericLat = parseFloat(lat);
  const numericLng = parseFloat(lng);
  if (isNaN(numericLat) || isNaN(numericLng)) {
    return { mapX: 1000, mapY: 500 };
  }

  // Horizontal: Standard Equirectangular/Miller mapping (-180° to +180° -> 0 to 2000)
  const computedX = Math.round((numericLng + 180) * (2000 / 360));

  // Vertical: Miller / Equirectangular hybrid calibrated to standard world land mass
  let computedY;
  if (numericLat >= 0) {
    computedY = Math.round(547 - (numericLat * 5.85));
  } else {
    computedY = Math.round(547 - (numericLat * 5.5));
  }

  const clampedX = Math.max(20, Math.min(1980, computedX));
  const clampedY = Math.max(60, Math.min(940, computedY));

  return { mapX: clampedX, mapY: clampedY };
}

function formatGpsPair(latVal, lngVal) {
  const latStr = String(latVal || '').trim();
  const lngStr = String(lngVal || '').trim();
  if (!latStr || !lngStr) return 'Global Coordinates';
  const cleanLat = latStr.includes('°') ? latStr : `${Math.abs(parseFloat(latStr)).toFixed(4)}° ${parseFloat(latStr) < 0 ? 'S' : 'N'}`;
  const cleanLng = lngStr.includes('°') ? lngStr : `${Math.abs(parseFloat(lngStr)).toFixed(4)}° ${parseFloat(lngStr) < 0 ? 'W' : 'E'}`;
  return `${cleanLat} / ${cleanLng}`;
}

// Auto-resolve any international destination or location string
export function resolveWorldCoordinates(locationStr = '', titleStr = '', customLat = null, customLng = null, customMapX = null, customMapY = null) {
  const query = `${locationStr} ${titleStr}`.toLowerCase();
  let matchedPlace = null;
  for (const place of KNOWN_WORLD_CITIES) {
    for (const alias of place.aliases) {
      const regex = new RegExp(`\\b${alias}\\b`, 'i');
      if (regex.test(query) || query.includes(alias)) {
        matchedPlace = place;
        break;
      }
    }
    if (matchedPlace) break;
  }

  // 1. Explicit mapX and mapY if provided
  if (customMapX !== null && customMapX !== undefined && customMapY !== null && customMapY !== undefined) {
    const nx = parseInt(customMapX, 10);
    const ny = parseInt(customMapY, 10);
    if (!isNaN(nx) && !isNaN(ny)) {
      return {
        cityName: matchedPlace?.name || locationStr || 'Global Destination',
        country: matchedPlace?.country || 'International',
        shortTitle: matchedPlace?.shortTitle || (locationStr || titleStr || 'WORLD').toUpperCase().split('').join(' '),
        coordinates: (customLat && customLng) ? formatGpsPair(customLat, customLng) : (matchedPlace ? formatGpsPair(matchedPlace.lat, matchedPlace.lng) : 'Global Coordinates'),
        mapX: nx,
        mapY: ny,
        matched: true
      };
    }
  }

  // 2. Direct GPS (lat, lng)
  if (customLat && customLng) {
    const proj = projectLatLngToWorldMap(customLat, customLng);
    return {
      cityName: matchedPlace?.name || locationStr || 'Global Destination',
      country: matchedPlace?.country || 'International',
      shortTitle: matchedPlace?.shortTitle || (locationStr || titleStr || 'WORLD').toUpperCase().split('').join(' '),
      coordinates: formatGpsPair(customLat, customLng),
      mapX: proj.mapX,
      mapY: proj.mapY,
      matched: true
    };
  }

  // 3. Search known world destinations
  if (matchedPlace) {
    return {
      cityName: matchedPlace.name,
      country: matchedPlace.country,
      shortTitle: matchedPlace.shortTitle,
      coordinates: formatGpsPair(matchedPlace.lat, matchedPlace.lng),
      mapX: matchedPlace.mapX,
      mapY: matchedPlace.mapY,
      matched: true
    };
  }

  // 4. Default fallback: Center of the world map
  const cleanLoc = (locationStr || titleStr || 'World').split(',')[0].trim();
  return {
    cityName: cleanLoc,
    country: 'International',
    shortTitle: cleanLoc.toUpperCase().split('').join(' '),
    coordinates: '25.0000° N / 15.0000° E',
    mapX: 1060,
    mapY: 340,
    matched: false
  };
}

// Generates map destination pointers strictly corresponding to the cards given in the portal
export function getUnifiedWorldMapDestinations(activeTrips) {
  if (!Array.isArray(activeTrips)) return [];

  const intlTrips = activeTrips.filter(t => (t.region || 'international').toLowerCase() === 'international');
  if (intlTrips.length === 0) return [];

  return intlTrips.map(trip => {
    const resolved = resolveWorldCoordinates(
      trip.location,
      trip.title,
      trip.lat,
      trip.lng,
      trip.mapX,
      trip.mapY
    );

    return {
      id: `world-${trip.id}`,
      name: trip.title,
      shortTitle: resolved.shortTitle,
      country: resolved.country,
      region: resolved.country,
      coordinates: resolved.coordinates,
      mapX: trip.mapX ? parseInt(trip.mapX, 10) : resolved.mapX,
      mapY: trip.mapY ? parseInt(trip.mapY, 10) : resolved.mapY,
      isAvailableOnPortal: true,
      destinationId: trip.id,
      price: typeof trip.price === 'number'
        ? `$${trip.price.toLocaleString()}`
        : (trip.price || '$2,850'),
      duration: trip.duration || '7 Days / 6 Nights',
      rating: trip.rating || 4.95,
      reviews: trip.reviews || 0,
      badge: trip.badge || 'Global Expedition',
      image: trip.image || 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80',
      description: trip.description || (Array.isArray(trip.highlights) ? trip.highlights.join(', ') : 'Private curated expedition crafted for discerning travelers.'),
      highlights: Array.isArray(trip.highlights) ? trip.highlights : []
    };
  });
}

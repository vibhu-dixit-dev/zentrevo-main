// Comprehensive India Cartographic Geo-Resolver
// Calibrated for 1486 x 1734 Surveyor Vector Projection
// Projects any Indian city, town, or (lat, lng) directly into exact SVG (mapX, mapY) coordinates

export const KNOWN_INDIAN_CITIES = [
  // Northern Subcontinent & Himalayas
  {
    name: 'Srinagar',
    aliases: ['srinagar', 'kashmir', 'dal lake', 'gulmarg', 'pahalgam', 'sonamarg'],
    shortTitle: 'K A S H M I R',
    state: 'Jammu & Kashmir',
    lat: 34.0837,
    lng: 74.7973,
    mapX: 345,
    mapY: 225
  },
  {
    name: 'Leh',
    aliases: ['leh', 'ladakh', 'nubra', 'pangong', 'zanskar', 'changthang'],
    shortTitle: 'L A D A K H',
    state: 'Ladakh',
    lat: 34.1526,
    lng: 77.5771,
    mapX: 485,
    mapY: 215
  },
  {
    name: 'Shimla',
    aliases: ['shimla', 'kufri', 'chail', 'mashobra'],
    shortTitle: 'S H I M L A',
    state: 'Himachal Pradesh',
    lat: 31.1048,
    lng: 77.1734,
    mapX: 465,
    mapY: 385
  },
  {
    name: 'Manali',
    aliases: ['manali', 'kullu', 'solang', 'rohtang', 'sissu'],
    shortTitle: 'M A N A L I',
    state: 'Himachal Pradesh',
    lat: 32.2396,
    lng: 77.1887,
    mapX: 466,
    mapY: 325
  },
  {
    name: 'Dharamshala',
    aliases: ['dharamshala', 'mcleodganj', 'kangra', 'bir billing'],
    shortTitle: 'D H A R A M S H A L A',
    state: 'Himachal Pradesh',
    lat: 32.2190,
    lng: 76.3234,
    mapX: 425,
    mapY: 327
  },
  {
    name: 'Spiti',
    aliases: ['spiti', 'kaza', 'tabo', 'key monastery', 'chandratal'],
    shortTitle: 'S P I T I',
    state: 'Himachal Pradesh',
    lat: 32.2461,
    lng: 78.0349,
    mapX: 508,
    mapY: 325
  },
  {
    name: 'Amritsar',
    aliases: ['amritsar', 'golden temple', 'wagah'],
    shortTitle: 'A M R I T S A R',
    state: 'Punjab',
    lat: 31.6340,
    lng: 74.8723,
    mapX: 350,
    mapY: 358
  },
  {
    name: 'Chandigarh',
    aliases: ['chandigarh', 'mohali', 'panchkula'],
    shortTitle: 'C H A N D I G A R H',
    state: 'Punjab & Haryana',
    lat: 30.7333,
    lng: 76.7794,
    mapX: 445,
    mapY: 408
  },
  {
    name: 'Rishikesh',
    aliases: ['rishikesh', 'shivpuri', 'yoga capital'],
    shortTitle: 'R I S H I K E S H',
    state: 'Uttarakhand',
    lat: 30.0869,
    lng: 78.2676,
    mapX: 520,
    mapY: 445
  },
  {
    name: 'Haridwar',
    aliases: ['haridwar', 'har ki pauri'],
    shortTitle: 'H A R I D W A R',
    state: 'Uttarakhand',
    lat: 29.9457,
    lng: 78.1642,
    mapX: 515,
    mapY: 452
  },
  {
    name: 'Dehradun',
    aliases: ['dehradun', 'mussoorie', 'landour', 'kanatal'],
    shortTitle: 'M U S S O O R I E',
    state: 'Uttarakhand',
    lat: 30.3165,
    lng: 78.0322,
    mapX: 509,
    mapY: 432
  },
  {
    name: 'Nainital',
    aliases: ['nainital', 'jim corbett', 'corbett', 'ranikhet', 'almora', 'mukteshwar', 'kausani'],
    shortTitle: 'C O R B E T T',
    state: 'Uttarakhand',
    lat: 29.3803,
    lng: 79.4636,
    mapX: 580,
    mapY: 483
  },
  {
    name: 'Auli',
    aliases: ['auli', 'joshimath', 'badrinath', 'kedarnath', 'valley of flowers'],
    shortTitle: 'A U L I',
    state: 'Uttarakhand',
    lat: 30.5300,
    lng: 79.5700,
    mapX: 586,
    mapY: 420
  },
  {
    name: 'Delhi',
    aliases: ['delhi', 'new delhi', 'ncr', 'gurgaon', 'gurugram', 'noida'],
    shortTitle: 'D E L H I',
    state: 'National Capital Region',
    lat: 28.6139,
    lng: 77.2090,
    mapX: 465,
    mapY: 525
  },

  // Western India & Rajasthan
  {
    name: 'Jaipur',
    aliases: ['jaipur', 'pink city', 'amer', 'chokhi dhani', 'hawa mahal'],
    shortTitle: 'J A I P U R',
    state: 'Rajasthan',
    lat: 26.9124,
    lng: 75.7873,
    mapX: 405,
    mapY: 620
  },
  {
    name: 'Udaipur',
    aliases: ['udaipur', 'lake pichola', 'mewar', 'city of lakes'],
    shortTitle: 'U D A I P U R',
    state: 'Rajasthan',
    lat: 24.5854,
    lng: 73.7125,
    mapX: 295,
    mapY: 745
  },
  {
    name: 'Jodhpur',
    aliases: ['jodhpur', 'blue city', 'mehrangarh', 'marwar'],
    shortTitle: 'J O D H P U R',
    state: 'Rajasthan',
    lat: 26.2389,
    lng: 73.0243,
    mapX: 260,
    mapY: 655
  },
  {
    name: 'Jaisalmer',
    aliases: ['jaisalmer', 'golden city', 'thar desert', 'sam dunes'],
    shortTitle: 'J A I S A L M E R',
    state: 'Rajasthan',
    lat: 26.9157,
    lng: 70.9083,
    mapX: 155,
    mapY: 618
  },
  {
    name: 'Pushkar',
    aliases: ['pushkar', 'ajmer'],
    shortTitle: 'P U S H K A R',
    state: 'Rajasthan',
    lat: 26.4897,
    lng: 74.5511,
    mapX: 340,
    mapY: 642
  },
  {
    name: 'Bikaner',
    aliases: ['bikaner', 'junagarh'],
    shortTitle: 'B I K A N E R',
    state: 'Rajasthan',
    lat: 28.0229,
    lng: 73.3119,
    mapX: 275,
    mapY: 558
  },
  {
    name: 'Mount Abu',
    aliases: ['mount abu', 'dilwara'],
    shortTitle: 'M O U N T  A B U',
    state: 'Rajasthan',
    lat: 24.5925,
    lng: 72.7156,
    mapX: 245,
    mapY: 745
  },
  {
    name: 'Ranthambore',
    aliases: ['ranthambore', 'sawai madhopur', 'tiger safari'],
    shortTitle: 'R A N T H A M B O R E',
    state: 'Rajasthan',
    lat: 26.0173,
    lng: 76.5026,
    mapX: 430,
    mapY: 668
  },
  {
    name: 'Ahmedabad',
    aliases: ['ahmedabad', 'gandhinagar', 'sabarmati'],
    shortTitle: 'A H M E D A B A D',
    state: 'Gujarat',
    lat: 23.0225,
    lng: 72.5714,
    mapX: 240,
    mapY: 835
  },
  {
    name: 'Kutch',
    aliases: ['kutch', 'rann of kutch', 'white desert', 'bhuj', 'dholavira'],
    shortTitle: 'K U T C H',
    state: 'Gujarat',
    lat: 23.2420,
    lng: 69.6669,
    mapX: 92,
    mapY: 822
  },
  {
    name: 'Gir National Park',
    aliases: ['gir', 'sasan gir', 'somnath', 'diu', 'junagadh'],
    shortTitle: 'S A S A N  G I R',
    state: 'Gujarat',
    lat: 21.1243,
    lng: 70.8242,
    mapX: 150,
    mapY: 938
  },
  {
    name: 'Mumbai',
    aliases: ['mumbai', 'bombay', 'navi mumbai', 'thane', 'gateway of india'],
    shortTitle: 'M U M B A I',
    state: 'Maharashtra',
    lat: 19.0760,
    lng: 72.8777,
    mapX: 255,
    mapY: 1050
  },
  {
    name: 'Pune',
    aliases: ['pune', 'poona', 'lonavala', 'khandala', 'mahabaleshwar', 'alibaug'],
    shortTitle: 'P U N E',
    state: 'Maharashtra',
    lat: 18.5204,
    lng: 73.8567,
    mapX: 305,
    mapY: 1082
  },
  {
    name: 'Nashik',
    aliases: ['nashik', 'sula vineyards', 'trimbakeshwar'],
    shortTitle: 'N A S H I K',
    state: 'Maharashtra',
    lat: 19.9975,
    lng: 73.7898,
    mapX: 300,
    mapY: 1000
  },
  {
    name: 'Aurangabad',
    aliases: ['aurangabad', 'chhatrapati sambhajinagar', 'ajanta', 'ellora'],
    shortTitle: 'E L L O R A',
    state: 'Maharashtra',
    lat: 19.8762,
    lng: 75.3433,
    mapX: 380,
    mapY: 1008
  },
  {
    name: 'Goa',
    aliases: ['goa', 'panaji', 'north goa', 'south goa', 'candolim', 'baga', 'anjuna', 'morjim', 'palolem'],
    shortTitle: 'G O A',
    state: 'Goa',
    lat: 15.2993,
    lng: 74.1240,
    mapX: 312,
    mapY: 1265
  },

  // Central India & Plains
  {
    name: 'Agra',
    aliases: ['agra', 'taj mahal', 'fatehpur sikri'],
    shortTitle: 'A G R A',
    state: 'Uttar Pradesh',
    lat: 27.2245,
    lng: 78.0108,
    mapX: 505,
    mapY: 605
  },
  {
    name: 'Varanasi',
    aliases: ['varanasi', 'banaras', 'kashi', 'sarnath', 'ganga ghats'],
    shortTitle: 'V A R A N A S I',
    state: 'Uttar Pradesh',
    lat: 25.3176,
    lng: 82.9739,
    mapX: 750,
    mapY: 708
  },
  {
    name: 'Lucknow',
    aliases: ['lucknow', 'nawabs', 'bara imambara'],
    shortTitle: 'L U C K N O W',
    state: 'Uttar Pradesh',
    lat: 26.8467,
    lng: 80.9462,
    mapX: 655,
    mapY: 624
  },
  {
    name: 'Khajuraho',
    aliases: ['khajuraho', 'panna'],
    shortTitle: 'K H A J U R A H O',
    state: 'Madhya Pradesh',
    lat: 24.8318,
    lng: 79.9199,
    mapX: 605,
    mapY: 732
  },
  {
    name: 'Bhopal',
    aliases: ['bhopal', 'sanchi', 'bhimbetka'],
    shortTitle: 'B H O P A L',
    state: 'Madhya Pradesh',
    lat: 23.2599,
    lng: 77.4126,
    mapX: 480,
    mapY: 820
  },
  {
    name: 'Kanha & Bandhavgarh',
    aliases: ['kanha', 'bandhavgarh', 'pench', 'madhya pradesh safari'],
    shortTitle: 'B A N D H A V G A R H',
    state: 'Madhya Pradesh',
    lat: 23.7000,
    lng: 81.0200,
    mapX: 660,
    mapY: 795
  },

  // Southern Subcontinent
  {
    name: 'Bengaluru',
    aliases: ['bengaluru', 'bangalore', 'mysore', 'mysuru'],
    shortTitle: 'B E N G A L U R U',
    state: 'Karnataka',
    lat: 12.9716,
    lng: 77.5946,
    mapX: 490,
    mapY: 1390
  },
  {
    name: 'Hampi',
    aliases: ['hampi', 'vijayanagara', 'badami', 'pattadakal'],
    shortTitle: 'H A M P I',
    state: 'Karnataka',
    lat: 15.3350,
    lng: 76.4600,
    mapX: 435,
    mapY: 1260
  },
  {
    name: 'Coorg',
    aliases: ['coorg', 'kodagu', 'madikeri', 'chikmagalur', 'kabini'],
    shortTitle: 'C O O R G',
    state: 'Karnataka',
    lat: 12.4244,
    lng: 75.7382,
    mapX: 395,
    mapY: 1420
  },
  {
    name: 'Ooty',
    aliases: ['ooty', 'udhagamandalam', 'nilgiris', 'coonoor', 'kodaikanal'],
    shortTitle: 'O O T Y',
    state: 'Tamil Nadu',
    lat: 11.4102,
    lng: 76.6950,
    mapX: 445,
    mapY: 1475
  },
  {
    name: 'Wayanad',
    aliases: ['wayanad', 'calicut', 'kozhikode'],
    shortTitle: 'W A Y A N A D',
    state: 'Kerala',
    lat: 11.6854,
    lng: 76.1320,
    mapX: 416,
    mapY: 1460
  },
  {
    name: 'Kochi & Munnar',
    aliases: ['kochi', 'cochin', 'munnar', 'thekkady', 'kumarakom'],
    shortTitle: 'M U N N A R',
    state: 'Kerala',
    lat: 10.0889,
    lng: 77.0595,
    mapX: 460,
    mapY: 1550
  },
  {
    name: 'Kerala Backwaters',
    aliases: ['kerala', 'alleppey', 'alappuzha', 'vembanad', 'marari', 'kovalam', 'varkala', 'trivandrum'],
    shortTitle: 'K E R A L A',
    state: 'Kerala',
    lat: 9.9312,
    lng: 76.2673,
    mapX: 418,
    mapY: 1560
  },
  {
    name: 'Hyderabad',
    aliases: ['hyderabad', 'secunderabad', 'telangana'],
    shortTitle: 'H Y D E R A B A D',
    state: 'Telangana',
    lat: 17.3850,
    lng: 78.4867,
    mapX: 535,
    mapY: 1145
  },
  {
    name: 'Chennai',
    aliases: ['chennai', 'madras', 'mahabalipuram', 'mamallapuram'],
    shortTitle: 'C H E N N A I',
    state: 'Tamil Nadu',
    lat: 13.0827,
    lng: 80.2707,
    mapX: 625,
    mapY: 1385
  },
  {
    name: 'Pondicherry',
    aliases: ['pondicherry', 'puducherry', 'auroville'],
    shortTitle: 'P O N D I C H E R R Y',
    state: 'Puducherry',
    lat: 11.9416,
    lng: 79.8083,
    mapX: 602,
    mapY: 1445
  },
  {
    name: 'Madurai & Rameshwaram',
    aliases: ['madurai', 'rameshwaram', 'chettinad', 'thanjavur'],
    shortTitle: 'M A D U R A I',
    state: 'Tamil Nadu',
    lat: 9.9252,
    lng: 78.1198,
    mapX: 515,
    mapY: 1560
  },
  {
    name: 'Kanyakumari',
    aliases: ['kanyakumari', 'cape comorin'],
    shortTitle: 'K A N Y A K U M A R I',
    state: 'Tamil Nadu',
    lat: 8.0883,
    lng: 77.5385,
    mapX: 482,
    mapY: 1662
  },

  // Eastern & North-Eastern Subcontinent
  {
    name: 'Kolkata',
    aliases: ['kolkata', 'calcutta', 'sundarbans', 'howrah'],
    shortTitle: 'K O L K A T A',
    state: 'West Bengal',
    lat: 22.5726,
    lng: 88.3639,
    mapX: 1030,
    mapY: 860
  },
  {
    name: 'Darjeeling',
    aliases: ['darjeeling', 'kalimpong', 'kurseong', 'mirik'],
    shortTitle: 'D A R J E E L I N G',
    state: 'West Bengal',
    lat: 27.0410,
    lng: 88.2663,
    mapX: 1028,
    mapY: 612
  },
  {
    name: 'Sikkim',
    aliases: ['sikkim', 'gangtok', 'pelling', 'lachung', 'yumthang', 'nathula'],
    shortTitle: 'S I K K I M',
    state: 'Sikkim',
    lat: 27.3389,
    lng: 88.6065,
    mapX: 1048,
    mapY: 595
  },
  {
    name: 'Odisha Coast',
    aliases: ['bhubaneswar', 'puri', 'konark', 'chilika', 'odisha'],
    shortTitle: 'P U R I',
    state: 'Odisha',
    lat: 19.8135,
    lng: 85.8312,
    mapX: 900,
    mapY: 985
  },
  {
    name: 'Meghalaya',
    aliases: ['meghalaya', 'shillong', 'cherrapunji', 'sohra', 'dawki', 'living roots'],
    shortTitle: 'M E G H A L A Y A',
    state: 'Meghalaya',
    lat: 25.4670,
    lng: 91.3662,
    mapX: 1188,
    mapY: 695
  },
  {
    name: 'Assam & Kaziranga',
    aliases: ['assam', 'kaziranga', 'guwahati', 'majuli', 'manas'],
    shortTitle: 'K A Z I R A N G A',
    state: 'Assam',
    lat: 26.5775,
    lng: 93.1711,
    mapX: 1255,
    mapY: 640
  },
  {
    name: 'Arunachal Pradesh',
    aliases: ['arunachal', 'tawang', 'ziro', 'bomdila'],
    shortTitle: 'T A W A N G',
    state: 'Arunachal Pradesh',
    lat: 27.5861,
    lng: 91.8594,
    mapX: 1205,
    mapY: 580
  },
  {
    name: 'Nagaland',
    aliases: ['nagaland', 'kohima', 'dimapur', 'dzukou'],
    shortTitle: 'N A G A L A N D',
    state: 'Nagaland',
    lat: 25.6751,
    lng: 94.1086,
    mapX: 1320,
    mapY: 685
  },
  {
    name: 'Andaman & Nicobar',
    aliases: ['andaman', 'nicobar', 'havelock', 'swaraj dweep', 'neil island', 'port blair'],
    shortTitle: 'A N D A M A N',
    state: 'Andaman & Nicobar',
    lat: 11.7401,
    lng: 92.6586,
    mapX: 1245,
    mapY: 1450
  },
  {
    name: 'Lakshadweep',
    aliases: ['lakshadweep', 'agatti', 'bangaram', 'kavaratti'],
    shortTitle: 'L A K S H A D W E E P',
    state: 'Lakshadweep',
    lat: 10.5667,
    lng: 72.6417,
    mapX: 235,
    mapY: 1525
  }
];

// Project real (lat, lng) to canvas (mapX, mapY) on 1486 x 1734 viewBox
export function projectLatLngToIndiaMap(lat, lng) {
  const numericLat = parseFloat(lat);
  const numericLng = parseFloat(lng);
  if (isNaN(numericLat) || isNaN(numericLng)) {
    return { mapX: 505, mapY: 700 }; // Fallback to central India
  }

  // Linear projection derived from surveyor calibration
  // Longitude: 73.71° E (Udaipur, x=295) -> 91.37° E (Meghalaya, x=1188), slope ~50.56
  // Latitude:  34.08° N (Kashmir, y=225) -> 9.93° N (Kerala, y=1560), slope ~55.28
  const computedX = Math.round(295 + (numericLng - 73.71) * 50.56);
  const computedY = Math.round(225 + (34.08 - numericLat) * 55.28);

  // Clamp inside official bounds
  const clampedX = Math.max(90, Math.min(1380, computedX));
  const clampedY = Math.max(160, Math.min(1680, computedY));

  return { mapX: clampedX, mapY: clampedY };
}

// Auto-resolve any city or location string to calibrated India map metadata
export function resolveIndiaCoordinates(locationStr = '', titleStr = '', customLat = null, customLng = null, customMapX = null, customMapY = null) {
  // 1. Direct explicit mapX and mapY if provided
  if (customMapX !== null && customMapX !== undefined && customMapY !== null && customMapY !== undefined) {
    const numericX = parseInt(customMapX, 10);
    const numericY = parseInt(customMapY, 10);
    if (!isNaN(numericX) && !isNaN(numericY)) {
      return {
        cityName: locationStr || 'Custom Destination',
        shortTitle: (locationStr || titleStr || 'I N D I A').toUpperCase().split('').join(' '),
        state: 'India',
        coordinates: customLat && customLng ? `${customLat}° N / ${customLng}° E` : 'Custom Location',
        mapX: numericX,
        mapY: numericY,
        matched: true
      };
    }
  }

  // 2. Direct GPS (lat, lng) if provided
  if (customLat && customLng) {
    const proj = projectLatLngToIndiaMap(customLat, customLng);
    return {
      cityName: locationStr || 'Custom Destination',
      shortTitle: (locationStr || titleStr || 'I N D I A').toUpperCase().split('').join(' '),
      state: 'India',
      coordinates: `${parseFloat(customLat).toFixed(4)}° N / ${parseFloat(customLng).toFixed(4)}° E`,
      mapX: proj.mapX,
      mapY: proj.mapY,
      matched: true
    };
  }

  const query = `${locationStr} ${titleStr}`.toLowerCase();

  // 3. Search known Indian city database
  for (const city of KNOWN_INDIAN_CITIES) {
    for (const alias of city.aliases) {
      // Word boundary or substring match
      const regex = new RegExp(`\\b${alias}\\b`, 'i');
      if (regex.test(query) || query.includes(alias)) {
        return {
          cityName: city.name,
          shortTitle: city.shortTitle,
          state: city.state,
          coordinates: `${city.lat.toFixed(4)}° N / ${city.lng.toFixed(4)}° E`,
          mapX: city.mapX,
          mapY: city.mapY,
          matched: true
        };
      }
    }
  }

  // 4. Fallback: Search by state name
  const stateFallbacks = [
    { state: 'Rajasthan', x: 330, y: 650, lat: 27.0238, lng: 74.2179 },
    { state: 'Himachal Pradesh', x: 465, y: 360, lat: 31.8, lng: 77.2 },
    { state: 'Uttarakhand', x: 535, y: 450, lat: 30.06, lng: 79.01 },
    { state: 'Punjab', x: 380, y: 390, lat: 31.14, lng: 75.34 },
    { state: 'Gujarat', x: 220, y: 860, lat: 22.25, lng: 71.19 },
    { state: 'Maharashtra', x: 330, y: 1040, lat: 19.75, lng: 75.71 },
    { state: 'Karnataka', x: 440, y: 1330, lat: 15.31, lng: 75.71 },
    { state: 'Tamil Nadu', x: 520, y: 1480, lat: 11.12, lng: 78.65 },
    { state: 'Kerala', x: 420, y: 1560, lat: 10.85, lng: 76.27 },
    { state: 'Goa', x: 312, y: 1265, lat: 15.29, lng: 74.12 },
    { state: 'Uttar Pradesh', x: 620, y: 640, lat: 26.84, lng: 80.94 },
    { state: 'Madhya Pradesh', x: 530, y: 790, lat: 22.97, lng: 78.65 },
    { state: 'West Bengal', x: 1010, y: 820, lat: 22.98, lng: 87.85 },
    { state: 'Assam', x: 1240, y: 650, lat: 26.20, lng: 92.93 },
    { state: 'Odisha', x: 860, y: 940, lat: 20.95, lng: 85.09 },
    { state: 'Telangana', x: 540, y: 1130, lat: 18.11, lng: 79.01 },
    { state: 'Andhra Pradesh', x: 580, y: 1250, lat: 15.91, lng: 79.74 },
    { state: 'Bihar', x: 800, y: 670, lat: 25.09, lng: 85.31 },
    { state: 'Jammu & Kashmir', x: 345, y: 225, lat: 34.08, lng: 74.80 },
    { state: 'Ladakh', x: 485, y: 215, lat: 34.15, lng: 77.58 }
  ];

  for (const sf of stateFallbacks) {
    if (query.includes(sf.state.toLowerCase())) {
      const cleanLoc = locationStr.split(',')[0].trim() || sf.state;
      return {
        cityName: cleanLoc,
        shortTitle: cleanLoc.toUpperCase().split('').join(' '),
        state: sf.state,
        coordinates: `${sf.lat.toFixed(4)}° N / ${sf.lng.toFixed(4)}° E`,
        mapX: sf.x,
        mapY: sf.y,
        matched: true
      };
    }
  }

  // 5. Ultimate fallback if totally unknown: Central India point
  const cleanLoc = (locationStr || titleStr || 'India').split(',')[0].trim();
  return {
    cityName: cleanLoc,
    shortTitle: cleanLoc.toUpperCase().split('').join(' '),
    state: 'India',
    coordinates: '22.9734° N / 78.6569° E',
    mapX: 520,
    mapY: 780,
    matched: false
  };
}

// Generates map destination pointers strictly corresponding to the cards given in the portal
export function getUnifiedIndiaMapDestinations(activeTrips) {
  if (!Array.isArray(activeTrips)) return [];

  const nationalTrips = activeTrips.filter(t => (t.region || '').toLowerCase() === 'national');
  if (nationalTrips.length === 0) return [];

  return nationalTrips.map(trip => {
    const resolved = resolveIndiaCoordinates(
      trip.location, 
      trip.title, 
      trip.lat, 
      trip.lng, 
      trip.mapX, 
      trip.mapY
    );

    return {
      id: `dest-${trip.id}`,
      name: trip.title,
      shortTitle: resolved.shortTitle,
      state: resolved.state,
      coordinates: resolved.coordinates,
      mapX: trip.mapX ? parseInt(trip.mapX, 10) : resolved.mapX,
      mapY: trip.mapY ? parseInt(trip.mapY, 10) : resolved.mapY,
      isAvailableOnPortal: true,
      destinationId: trip.id,
      price: typeof trip.price === 'number' 
        ? `$${trip.price.toLocaleString()}` 
        : (trip.price || '$1,850'),
      duration: trip.duration || '6 Days / 5 Nights',
      rating: trip.rating || 4.95,
      reviews: trip.reviews || 0,
      badge: trip.badge || 'Curated Expedition',
      image: trip.image || 'https://images.unsplash.com/photo-1598091383021-15ddea10925d?auto=format&fit=crop&w=800&q=75',
      description: trip.description || (Array.isArray(trip.highlights) ? trip.highlights.join(', ') : 'Private curated expedition crafted for discerning travelers.'),
      highlights: Array.isArray(trip.highlights) ? trip.highlights : []
    };
  });
}

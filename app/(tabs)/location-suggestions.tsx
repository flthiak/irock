import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Button, ScrollView, Platform } from 'react-native';
import * as Location from 'expo-location';
import { Stack } from 'expo-router';
import { COLORS } from '@/utils/colors';
import { FONTS } from '@/utils/fonts';
import { AlertTriangle, MapPin, HelpCircle } from 'lucide-react-native';
import BottomNavBar from '@/components/BottomNavBar';
import { AppHeader } from '@/components/AppHeader';

type Status = 'idle' | 'requestingPermission' | 'permissionDenied' | 'fetchingLocation' | 'locationError' | 'locationSuccess' | 'fetchingRegion' | 'regionSuccess' | 'regionError' | 'noDetails';

// --- Rock Details Knowledge Base (as defined above) ---
interface RockDetails {
  description: string;
  color: string;
  grainSize: string;
  hardness: string;
  luster: string;
  streak: string;
  features: string;
  confusion?: string;
}

const rockKnowledgeBase: { [key: string]: RockDetails } = {
  Granite: { description: "Intrusive igneous rock, cooled slowly from magma deep underground.", color: "Varied (Pink, white, gray, black)", grainSize: "Coarse (visible crystals)", hardness: "6-7", luster: "Dull to vitreous (quartz/feldspar)", streak: "White", features: "Visible interlocking crystals of quartz (gray/glassy), feldspar (white/pink), mica (black/shiny flakes), +/- hornblende.", confusion: "Gneiss (look for banding in Gneiss), Diorite (less quartz)." },
  Basalt: { description: "Extrusive igneous rock, cooled quickly from lava on the surface.", color: "Dark gray to black", grainSize: "Fine (crystals usually too small to see)", hardness: "5.5-6.5", luster: "Dull", streak: "Grayish-black", features: "Often dense and heavy. May contain small holes (vesicles) from gas bubbles (Vesicular Basalt). Columnar jointing possible.", confusion: "Shale (much softer), Limestone (fizzes with acid)." },
  Obsidian: { description: "Extrusive igneous rock (volcanic glass), cooled extremely rapidly.", color: "Black (usually), can have reddish streaks or snowflakes (Snowflake Obsidian).", grainSize: "Glassy (no crystals)", hardness: "5-5.5", luster: "Vitreous (glassy)", streak: "White", features: "Very sharp edges, conchoidal fracture (curved breaks like glass).", confusion: "Chert/Flint (usually duller luster)." },
  Sandstone: { description: "Sedimentary rock formed from cemented sand grains.", color: "Varied (Tan, brown, red, pink, white)", grainSize: "Medium (sand-sized grains, feels gritty)", hardness: "Variable (depends on cement), often 6-7 if quartz-rich.", luster: "Dull", streak: "White/gray/reddish (depends on cement)", features: "Feels like sandpaper. May show layering (bedding) or cross-bedding. Can contain fossils.", confusion: "Quartzite (much harder, grains fused)." },
  Shale: { description: "Sedimentary rock formed from compacted mud or clay.", color: "Gray, black, brown, red", grainSize: "Very fine (smooth to the touch)", hardness: "~3", luster: "Dull", streak: "Variable (often gray)", features: "Often splits into thin layers or plates (fissile). May contain fossils. Can have a 'muddy' smell when wet.", confusion: "Slate (harder, rings when tapped)." },
  Limestone: { description: "Sedimentary rock primarily composed of calcium carbonate (calcite).", color: "White, gray, tan, black", grainSize: "Variable (fine to coarse, can contain shells/fossils)", hardness: "3", luster: "Dull to vitreous", streak: "White", features: "Fizzes readily with dilute acid (like vinegar). Often contains visible fossils (Fossiliferous Limestone). Oolitic limestone has small, round grains.", confusion: "Marble (metamorphosed, crystalline), Dolomite (fizzes weakly or only when powdered)." },
  Conglomerate: { description: "Sedimentary rock composed of rounded gravel-sized clasts cemented together.", color: "Highly variable depending on clasts and matrix.", grainSize: "Coarse (visible pebbles/cobbles, rounded)", hardness: "Variable", luster: "Dull", streak: "Variable", features: "Contains rounded pebbles, cobbles, or boulders in a finer matrix (sand/silt). Like natural concrete.", confusion: "Breccia (clasts are angular)." },
  Gneiss: { description: "Metamorphic rock formed under high heat and pressure, typically from granite or sedimentary rocks.", color: "Alternating light and dark bands", grainSize: "Medium to coarse", hardness: "Variable (~7)", luster: "Vitreous to dull", streak: "White/gray", features: "Distinct compositional banding (gneissic banding) - alternating layers of different minerals (e.g., quartz/feldspar vs. mica/hornblende).", confusion: "Granite (no banding), Schist (more platy minerals, less distinct bands)." },
  Schist: { description: "Metamorphic rock formed under moderate to high heat and pressure, often from shale or basalt.", color: "Variable (often silvery, gray, green, brown)", grainSize: "Medium to coarse (visible platy minerals)", hardness: "Variable", luster: "Often sparkly/shiny due to mica (muscovite/biotite)", streak: "Variable", features: "Characterized by parallel alignment of platy minerals (micas) causing foliation (schistosity). Often glitters. May contain larger crystals like garnet.", confusion: "Gneiss (less platy, more distinct bands), Phyllite (finer grained)." },
  Marble: { description: "Metamorphic rock formed from limestone subjected to heat and pressure.", color: "White (pure), can be gray, pink, green, black due to impurities", grainSize: "Medium to coarse (interlocking calcite crystals)", hardness: "3", luster: "Vitreous to pearly", streak: "White", features: "Crystalline texture (sparkles). Fizzes with dilute acid. Often smooth. Banding or swirls may be present from impurities.", confusion: "Limestone (less crystalline), Quartzite (much harder)." },
  Quartzite: { description: "Metamorphic rock formed from sandstone subjected to heat and pressure.", color: "White, gray, pink, red, yellow", grainSize: "Medium (sand grains fused together)", hardness: "7", luster: "Vitreous to somewhat dull", streak: "White", features: "Very hard and durable. Grains are interlocked and fused; fracture cuts through grains (unlike sandstone where it breaks around grains). Smoother feel than sandstone.", confusion: "Sandstone (softer, grittier), Marble (much softer, fizzes with acid)." },
  Slate: { description: "Metamorphic rock formed from shale under low-grade heat and pressure.", color: "Gray, black, green, red, purple", grainSize: "Very fine (crystals not visible)", hardness: "~3-4", luster: "Dull to slight sheen", streak: "Gray/black", features: "Splits into very flat, smooth sheets (slaty cleavage). Rings when tapped lightly (unlike shale).", confusion: "Shale (softer, duller, doesn\'t ring), Phyllite (shinier, slightly wavy cleavage)." }
};

const GENERAL_ROCK_TERMS_TO_IGNORE = [
  'rock', 'rocks', 'igneous rock', 'sedimentary rock', 'metamorphic rock',
  'volcanic rock', 'plutonic rock', 'intrusive rock', 'extrusive rock',
  'clastic rock', 'carbonate rock', 'siliciclastic rock',
  'igneous rocks', 'sedimentary rocks', 'metamorphic rocks',
  'volcanic rocks', 'plutonic rocks', 'intrusive rocks', 'extrusive rocks',
  'clastic rocks', 'carbonate rocks', 'siliciclastic rocks',
  'metasedimentary rocks', 'metavolcanic rocks',
  'undifferentiated', 'unconsolidated sediments', 'sediments'
].map(term => term.toLowerCase());

const getRockDetails = (rockName: string): RockDetails | null => {
  const normalizedName = rockName.trim().charAt(0).toUpperCase() + rockName.trim().slice(1).toLowerCase();
  if (rockKnowledgeBase[normalizedName]) {
      return rockKnowledgeBase[normalizedName];
  }
   if (normalizedName.endsWith(' Sandstone')) return rockKnowledgeBase['Sandstone'] || null;
   if (normalizedName.endsWith(' Limestone')) return rockKnowledgeBase['Limestone'] || null;
   if (normalizedName.endsWith(' Shale')) return rockKnowledgeBase['Shale'] || null;
   if (normalizedName.endsWith(' Granite')) return rockKnowledgeBase['Granite'] || null;
   if (normalizedName.endsWith(' Gneiss')) return rockKnowledgeBase['Gneiss'] || null;
   if (normalizedName.endsWith(' Schist')) return rockKnowledgeBase['Schist'] || null;
   if (normalizedName.endsWith(' Basalt')) return rockKnowledgeBase['Basalt'] || null;
   if (normalizedName.endsWith(' Marble')) return rockKnowledgeBase['Marble'] || null;
  return null;
};
// --- End Knowledge Base ---

export default function LocationSuggestionsScreen() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [geologicalRegion, setGeologicalRegion] = useState<string | null>(null);
  const [detailedSuggestions, setDetailedSuggestions] = useState<({ name: string; details: RockDetails })[]>([]);
  const [isFetchingRegion, setIsFetchingRegion] = useState(false);

  useEffect(() => {
    requestLocation();
  }, []);

  const requestLocation = async () => {
    setStatus('requestingPermission');
    setErrorMsg(null);
    setAddress(null);
    try {
      // Skip actual permission and location fetching for testing
      /* 
      let { status: permissionStatus } = await Location.requestForegroundPermissionsAsync();
      if (permissionStatus !== 'granted') {
        setErrorMsg('Permission to access location was denied. Please enable it in your device settings.');
        setStatus('permissionDenied');
        return;
      }
      setStatus('fetchingLocation');
      const locationPromise = Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("Location request timed out")), 15000));
      const fetchedLocation = await Promise.race([locationPromise, timeoutPromise]) as Location.LocationObject;
      */

      // --- Use Mock Location for Testing ---
      const mockLatitude = 40.7128;  // New York City Latitude
      const mockLongitude = -74.0060; // New York City Longitude
      const fetchedLocation: Location.LocationObject = {
        coords: {
          latitude: mockLatitude,
          longitude: mockLongitude,
          altitude: null,
          accuracy: null,
          altitudeAccuracy: null,
          heading: null,
          speed: null,
        },
        timestamp: Date.now(),
      };
      console.log("USING MOCK LOCATION (NYC):", JSON.stringify(fetchedLocation.coords, null, 2));
      // ---

      setLocation(fetchedLocation);

      try {
        const geocodedAddresses = await Location.reverseGeocodeAsync({
          latitude: fetchedLocation.coords.latitude,
          longitude: fetchedLocation.coords.longitude,
        });
        if (geocodedAddresses && geocodedAddresses.length > 0) {
          const firstAddress = geocodedAddresses[0];
          console.log("Full Reverse Geocoded Address Object (NYC Mock Location):", JSON.stringify(firstAddress, null, 2));
          
          const formattedAddr = [
            firstAddress.city,
            firstAddress.name,
            firstAddress.street,
            firstAddress.region,
            firstAddress.postalCode,
            firstAddress.country
          ].filter(Boolean).join(', ');
          setAddress(formattedAddr || 'Address details not found for mock location');
        } else {
          console.error("Reverse Geocoding (NYC Mock): No addresses returned.", geocodedAddresses);
          setAddress('Address details not found for mock location (no results from geocoder)');
        }
      } catch (geocodeError) {
        console.error("REVERSE GEOCODING ERROR (NYC Mock Location):", JSON.stringify(geocodeError, null, 2));
        setAddress('Could not fetch address details for mock location due to error.');
      }
      
      setStatus('locationSuccess');
      fetchGeologicalData(fetchedLocation.coords.latitude, fetchedLocation.coords.longitude);

    } catch (error: any) {
      console.error("Location Error:", error);
      setErrorMsg(error.message || 'Failed to get location. Please ensure location services are enabled.');
      setStatus('locationError');
    }
  };

  // Function to fetch real geological data from Macrostrat API
  const fetchGeologicalData = async (latitude: number, longitude: number) => {
    setStatus('fetchingRegion');
    setIsFetchingRegion(true);
    setGeologicalRegion(null);
    setDetailedSuggestions([]);
    setErrorMsg(null); // Clear previous errors

    const url = `https://macrostrat.org/api/v2/geologic_units/map?lat=${latitude}&lng=${longitude}&format=json`;

    console.log(`Fetching geological data from: ${url}`);

    try {
      const response = await fetch(url, {
        headers: {
          // Some APIs might require headers like Accept, though Macrostrat seems okay without
          'Accept': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      console.log("Macrostrat API Response (Full):", JSON.stringify(data, null, 2));

      if (data?.success?.data?.length > 0) {
        const primaryUnit = data.success.data[0]; // Use the first/topmost unit
        
        // Extract region name (prioritize more specific names if available)
        const regionName = primaryUnit.col_name || primaryUnit.gp_name || primaryUnit.Fm || primaryUnit.Mbr || primaryUnit.strat_name_long || 'Region name unavailable';
        setGeologicalRegion(regionName.trim());

        // Extract lithologies (rock types)
        let rawLithologies: string[] = [];
        if (primaryUnit.lith && Array.isArray(primaryUnit.lith)) {
           // Sometimes `lith` is an array of objects like { lith: "Sandstone", ... }
          rawLithologies = primaryUnit.lith.map((l: any) => l.lith).filter((l: string | null): l is string => !!l);
        } else if (typeof primaryUnit.lith === 'string' && primaryUnit.lith.trim()) {
          // Sometimes `lith` might be a comma-separated string (less common now?)
          rawLithologies = primaryUnit.lith.split(',').map((l: string) => l.trim()).filter(Boolean);
        } else if (primaryUnit.descrip && typeof primaryUnit.descrip === 'string') {
           // Fallback to description if lith field is unhelpful
           // Basic extraction - could be improved with better NLP
           const potentialRocks = primaryUnit.descrip.match(/\b(Sandstone|Shale|Limestone|Granite|Gneiss|Schist|Basalt|Quartzite|Marble|Slate)\b/gi);
           if (potentialRocks) {
             // Map to capitalized strings first
             const capitalizedRocks = potentialRocks.map((r: string) => r.charAt(0).toUpperCase() + r.slice(1).toLowerCase());
             // Create a Set for uniqueness, then spread into a new array
             rawLithologies = [...new Set<string>(capitalizedRocks)]; 
           }
        }

        if(rawLithologies.length === 0 && primaryUnit.name) {
           // If still no lithologies, maybe the unit name itself is a rock type?
           if (/Sandstone|Shale|Limestone|Granite|Gneiss|Schist|Basalt|Quartzite|Marble|Slate/i.test(primaryUnit.name)) {
             rawLithologies.push(primaryUnit.name);
           }
        }

        console.log("Extracted Raw Lithologies (before filtering general terms):", JSON.stringify(rawLithologies, null, 2));

        // Filter out general terms
        const specificLithologies = rawLithologies.filter(lith => 
          !GENERAL_ROCK_TERMS_TO_IGNORE.includes(lith.trim().toLowerCase())
        );
        console.log("Specific Lithologies (after filtering general terms):", JSON.stringify(specificLithologies, null, 2));

        const uniqueLithologies = [...new Set(specificLithologies)];
        console.log("Unique Specific Lithologies for Knowledge Base Lookup:", JSON.stringify(uniqueLithologies, null, 2));
        
        const detailedRocks = uniqueLithologies
          .map(name => ({ name, details: getRockDetails(name) }))
          .filter(item => item.details !== null) as ({ name: string; details: RockDetails })[];

        if (detailedRocks.length > 0) {
          setDetailedSuggestions(detailedRocks);
          setStatus('regionSuccess');
        } else {
          let errorDetail = 'No specific rock types recognized from the data.';
          if (rawLithologies.length > 0 && specificLithologies.length === 0) {
            errorDetail = `The API returned general terms like '${rawLithologies.join(', ')}', which are too broad for detailed lookup.`;
          } else if (uniqueLithologies.length > 0) {
            errorDetail = `Could not find details for the following specific terms from the API: ${uniqueLithologies.join(', ')}.`;
          }
          setGeologicalRegion(regionName + " (Could not retrieve specific rock details)");
          setStatus('noDetails');
          setErrorMsg(`Found geological region, but ${errorDetail}`);
        }

      } else {
        // No data returned for the location
        setGeologicalRegion('Geological data not found for this location.');
        setStatus('regionError');
        setErrorMsg('Geological data not found for this location.');
      }
    } catch (apiError: any) {
      console.error("Geological API Error:", apiError);
      setGeologicalRegion(null); // Clear region name on error
      setErrorMsg(`Failed to fetch geological data: ${apiError.message}`);
      setStatus('regionError');
    }

    setIsFetchingRegion(false);
  };
  // --- End fetchGeologicalData Function ---

  const testReverseGeocode = async () => {
    console.log("Attempting test reverse geocode for NYC...");
    try {
      const nycCoords = { latitude: 40.7128, longitude: -74.0060 };
      const result = await Location.reverseGeocodeAsync(nycCoords);
      console.log("Test Reverse Geocode Result (NYC):", JSON.stringify(result, null, 2));
      alert("Test Geocode Result: " + JSON.stringify(result, null, 2));
    } catch (e) {
      console.error("Test Reverse Geocode ERROR (NYC):", JSON.stringify(e, null, 2));
      alert("Test Geocode Error: " + JSON.stringify(e, null, 2));
    }
  };

  const renderContent = () => {
    switch (status) {
      case 'idle':
      case 'requestingPermission':
        return <ActivityIndicator size="large" color={COLORS.primary[600]} />;
      case 'permissionDenied':
      case 'locationError':
        return (
          <View style={styles.centered}>
            <AlertTriangle size={40} color={COLORS.error[500]} style={styles.iconSpacing} />
            <Text style={styles.errorText}>{errorMsg}</Text>
            <Button title="Retry Permission/Location" onPress={requestLocation} color={COLORS.primary[600]} />
          </View>
        );
      case 'fetchingLocation':
        return (
           <View style={styles.centered}>
             <ActivityIndicator size="large" color={COLORS.primary[600]} />
             <Text style={styles.statusText}>Getting your location details...</Text>
           </View>
         );
      case 'locationSuccess':
      case 'fetchingRegion':
      case 'regionSuccess':
      case 'regionError':
      case 'noDetails':
        return (
          <>
            {location && (
              <View style={styles.locationContainer}>
                <MapPin size={20} color={COLORS.primary[600]} style={{marginRight: 8}}/>
                <View>
                  {address ? (
                    <Text style={styles.locationText}>{address}</Text>
                  ) : (
                    <Text style={styles.locationText}>Fetching address...</Text>
                  )}
                  <Text style={styles.coordsText}>
                    (Lat: {location.coords.latitude.toFixed(4)}, Lng: {location.coords.longitude.toFixed(4)})
                  </Text>
                </View>
              </View>
            )}
            {status === 'fetchingRegion' && (
              <View style={styles.centered}>
                <ActivityIndicator size="large" color={COLORS.primary[600]} />
                <Text style={styles.statusText}>Identifying geological region...</Text>
              </View>
            )}
            {(status !== 'fetchingRegion' && geologicalRegion) && (
              <View style={styles.regionContainer}>
                 <Text style={styles.regionTitle}>Geological Region:</Text>
                 <Text style={styles.regionName}>{geologicalRegion}</Text>
              </View>
            )}
            {(status === 'regionError' || status === 'noDetails') && errorMsg && (
               <View style={styles.centeredErrorSmall}> 
                 <HelpCircle size={24} color={COLORS.warning[600]} style={styles.iconSpacing} />
                 <Text style={[styles.errorText, { marginBottom: 0}]}>{errorMsg}</Text>
               </View>
            )}
            {status === 'regionSuccess' && detailedSuggestions.length > 0 && (
              <View style={styles.suggestionsListContainer}>
                <Text style={styles.suggestionsTitle}>Guide for Rocks Near You:</Text>
                {detailedSuggestions.map((item, index) => (
                  <View key={index} style={styles.rockDetailCard}>
                    <Text style={styles.rockNameHeader}>{item.name}</Text>
                    <Text style={styles.detailText}><Text style={styles.detailLabel}>Description:</Text> {item.details.description}</Text>
                    <Text style={styles.detailText}><Text style={styles.detailLabel}>Typical Color:</Text> {item.details.color}</Text>
                    <Text style={styles.detailText}><Text style={styles.detailLabel}>Grain Size:</Text> {item.details.grainSize}</Text>
                    <Text style={styles.detailText}><Text style={styles.detailLabel}>Hardness (Mohs):</Text> {item.details.hardness}</Text>
                    <Text style={styles.detailText}><Text style={styles.detailLabel}>Luster:</Text> {item.details.luster}</Text>
                    <Text style={styles.detailText}><Text style={styles.detailLabel}>Streak:</Text> {item.details.streak}</Text>
                    <Text style={styles.detailText}><Text style={styles.detailLabel}>Key Features:</Text> {item.details.features}</Text>
                    {item.details.confusion && (
                      <Text style={styles.detailText}><Text style={styles.detailLabel}>Might Be Confused With:</Text> {item.details.confusion}</Text>
                    )}
                  </View>
                ))}
              </View>
            )}
            <Text style={styles.disclaimerText}>
              Note: This guide is based on regional geological data. Specific local conditions may vary. Mineral/resource collection may be restricted in parks or private land.
            </Text>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.outerContainer}>
      <Stack.Screen options={{ title: 'Location Suggestions', headerBackTitle: 'Back', headerShown: false }} />
      <AppHeader title="Location Suggestions" />
      <View style={styles.contentWrapper}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Button title="Test NYC Reverse Geocode" onPress={testReverseGeocode} color={COLORS.accent[500]} />
          <Text style={styles.description}>
            Based on your current location, here is a guide to rock types commonly found in your geological region.
          </Text>
          {renderContent()}
        </ScrollView>
      </View>
      <BottomNavBar activeTab="suggestions" />
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: COLORS.neutral[50],
  },
  contentWrapper: {
    flex: 1,
    paddingBottom: 70,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  description: {
    ...FONTS.body,
    color: COLORS.neutral[600],
    textAlign: 'center',
    marginBottom: 20,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    minHeight: 150,
  },
  centeredErrorSmall: {
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
    backgroundColor: COLORS.warning[50],
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.warning[200],
    marginBottom: 20,
  },
  statusText: {
    ...FONTS.body,
    marginTop: 10,
    color: COLORS.neutral[600],
    textAlign: 'center',
  },
  errorText: {
    ...FONTS.body,
    color: COLORS.error[700],
    textAlign: 'center',
    marginBottom: 15,
  },
  iconSpacing: {
    marginBottom: 10,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: COLORS.primary[50],
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.primary[100],
  },
  locationText: {
    ...(FONTS.body || { fontFamily: 'System', fontSize: 15 }),
    color: COLORS.primary[700],
    fontWeight: '500',
  },
  coordsText: {
    ...(FONTS.caption || { fontFamily: 'System', fontSize: 11 }),
    color: COLORS.neutral[500],
    marginTop: 2,
  },
  regionContainer: {
    marginTop: 0,
    marginBottom: 20,
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  regionTitle: {
    ...FONTS.h4,
    color: COLORS.secondary ? COLORS.secondary[600] : COLORS.primary[600],
    marginBottom: 5,
    textAlign: 'center',
  },
  regionName: {
    ...FONTS.body,
    color: COLORS.neutral[700],
    textAlign: 'center',
  },
  suggestionsListContainer: {
     marginTop: 0,
     marginBottom: 20, 
  },
  suggestionsTitle: {
     ...FONTS.h3,
    color: COLORS.primary[700],
    marginBottom: 15,
    textAlign: 'center',
  },
  rockDetailCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  rockNameHeader: {
    ...FONTS.h4,
    color: COLORS.secondary ? COLORS.secondary[700] : COLORS.primary[700],
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.neutral[200],
    paddingBottom: 5,
  },
  detailText: {
    ...FONTS.bodySmall,
    color: COLORS.neutral[700],
    lineHeight: 18,
    marginBottom: 6,
  },
  detailLabel: {
    fontFamily: FONTS.bold.fontFamily, 
    fontWeight: 'bold',
    color: COLORS.neutral[800],
  },
  disclaimerText: {
    ...FONTS.caption,
    color: COLORS.neutral[500],
    textAlign: 'center',
    marginTop: 10, 
    paddingHorizontal: 10,
  },
}); 
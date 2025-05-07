import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { COLORS } from '@/utils/colors';
import { FONTS } from '@/utils/fonts';
import { ChevronDown, ChevronUp } from 'lucide-react-native';
import Animated, { FadeIn, Layout } from 'react-native-reanimated';

// This is the content previously in components/education/MineralPropertiesTab.tsx

// --- Data Definitions (Mohs Scale, SG, Streak) ---
const MohsScaleData = [
  { hardness: '1', mineral: 'Talc', comparison: 'Very soft – can be scratched with a fingernail' },
  { hardness: '2', mineral: 'Gypsum', comparison: 'Found in chalk – also scratchable with a fingernail' },
  { hardness: '3', mineral: 'Calcite', comparison: 'Can be scratched with a copper coin' },
  { hardness: '4', mineral: 'Fluorite', comparison: 'Can be scratched with a knife' },
  { hardness: '5', mineral: 'Apatite', comparison: 'Just about as hard as a steel nail' },
  { hardness: '6', mineral: 'Orthoclase', comparison: 'Scratches glass' },
  { hardness: '7', mineral: 'Quartz', comparison: 'Very hard – can scratch most metals and glass' },
  { hardness: '8', mineral: 'Topaz', comparison: 'Even harder – scratches quartz' },
  { hardness: '9', mineral: 'Corundum', comparison: 'Extremely hard – includes rubies and sapphires' },
  { hardness: '10', mineral: 'Diamond', comparison: 'The hardest natural substance on Earth' },
];

const SGData = [
  { mineral: 'Talc', sg: '~2.7', feel: 'Very light' },
  { mineral: 'Quartz', sg: '~2.6', feel: 'Normal' },
  { mineral: 'Pyrite', sg: '~5.0', feel: 'Surprisingly heavy' },
  { mineral: 'Galena', sg: '~7.5', feel: 'Very heavy for its size' },
  { mineral: 'Gold', sg: '~19.3', feel: 'Super dense and unmistakable!' },
];

const StreakData = [
  { mineral: 'Hematite', streakColor: 'Red-brown', notes: 'Even if it looks silver!' },
  { mineral: 'Pyrite', streakColor: 'Greenish-black', notes: 'Fool\'s gold gives a dark streak' }, // Fixed apostrophe
  { mineral: 'Galena', streakColor: 'Lead-gray', notes: 'Matches its metallic look' },
  { mineral: 'Calcite', streakColor: 'White', notes: 'Smooth and easy to streak' },
  { mineral: 'Quartz', streakColor: 'No streak', notes: 'Too hard; may scratch plate' },
];
// --- End Data Definitions ---

export default function MineralPropertiesScreen() {
  const [showCrystalShapeDetails, setShowCrystalShapeDetails] = useState(false);
  const [showCleavageDetails, setShowCleavageDetails] = useState(false);
  const [showDensityDetails, setShowDensityDetails] = useState(false);
  const [showHardnessDetails, setShowHardnessDetails] = useState(false);
  const [showSensoryDetails, setShowSensoryDetails] = useState(false);
  const [showLusterDetails, setShowLusterDetails] = useState(false);
  const [showStreakDetails, setShowStreakDetails] = useState(false);
  const [showColorDetails, setShowColorDetails] = useState(false);
  const [showMineralsIntro, setShowMineralsIntro] = useState(false); // Initially collapsed

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.section}>
        {/* Title Section - No Longer Expandable */}
        <Text style={styles.expandableTitle}>Minerals: The Sparkly Building Blocks of Rocks</Text>
        <Animated.View layout={Layout.springify()}>
          <Text style={styles.paragraphSubContent}>
            Every rock you see is made up of tiny pieces called minerals—the natural, solid ingredients that make up Earth's crust. Think of minerals as the building blocks of rocks, just like bricks build a house or flour makes a cake.
          </Text>
          <Text style={styles.paragraphSubContent}>
            Each mineral has its own chemical formula, crystal structure, and unique personality. Some are dull, some are glittery, some are harder than steel, and some melt in acid. But all minerals are naturally formed by geological processes—no human factories involved!
          </Text>

          <Text style={styles.subListHeader}>What Makes Something a Mineral?</Text>
          <Text style={styles.paragraphSubContent}>To be officially called a mineral, a substance must meet these 5 rules:</Text>
          <Text style={styles.subListItemNested}>Naturally occurring – Found in nature, not made in a lab.</Text>
          <Text style={styles.subListItemNested}>Inorganic – Not from living things (no bones, shells, or plants).</Text>
          <Text style={styles.subListItemNested}>Solid – No liquids or gases allowed!</Text>
          <Text style={styles.subListItemNested}>Definite chemical composition – Always made of the same ingredients (like H₂O for ice, or NaCl for salt).</Text>
          <Text style={styles.subListItemNested}>Orderly crystal structure – Atoms are arranged in a repeating pattern.</Text>

          <Text style={styles.subListHeader}>Examples of Common Minerals:</Text>
          <Text style={styles.subListItemNested}>Quartz – One of the most abundant minerals on Earth. Comes in many colors like amethyst (purple) and rose quartz (pink).</Text>
          <Text style={styles.subListItemNested}>Feldspar – Makes up most of the Earth's crust!</Text>
          <Text style={styles.subListItemNested}>Mica – Shiny and flaky—breaks into thin sheets.</Text>
          <Text style={styles.subListItemNested}>Calcite – Fizzes in acid and can glow under UV light!</Text>
          <Text style={styles.subListItemNested}>Halite – Also known as rock salt (yes, the kind you eat!).</Text>
          <Text style={styles.subListItemNested}>Magnetite – Magnetic and metallic—sticks to magnets!</Text>

          <Text style={styles.subListHeader}>Gems Are Just Fancy Minerals!</Text>
          <Text style={styles.paragraphSubContent}>
            Many of the world's most beautiful gemstones are actually minerals that have been cut and polished.
          </Text>
          <Text style={styles.subListItemBold}>Examples:</Text>
          <Text style={styles.subListItemNested}>Diamond (from carbon)</Text>
          <Text style={styles.subListItemNested}>Ruby & Sapphire (from corundum)</Text>
          <Text style={styles.subListItemNested}>Emerald (from beryl)</Text>
          <Text style={styles.paragraphSubContent}>
            These minerals form under rare conditions deep inside the Earth, which is why they're so valuable!
          </Text>
          <View style={styles.funFactCard}>
             <Text style={styles.funFactTitle}>Fun Fact:</Text>
             <Text style={styles.paragraphSubContentEnd}>
               There are over 5,000 known minerals on Earth, but only a couple dozen make up most of the rocks we see every day.
             </Text>
             <Text style={styles.paragraphSubContentEnd}>
               Some minerals grow into perfect crystals if they have space and time, like clear quartz points or salt cubes!
             </Text>
          </View>
          <Text style={styles.paragraphSubContentEnd}>
            So the next time you hold a rock, remember—it's made of tiny crystals that formed under pressure, heat, and time. Minerals may be small, but they're the sparkling keys to Earth's grand design!
          </Text>
        </Animated.View>
      </View>

      {/* Section: Color */}
      <View style={styles.propertyItem}>
          <TouchableOpacity
            style={styles.expandableHeader}
            onPress={() => setShowColorDetails(!showColorDetails)}
            activeOpacity={0.7}
          >
            <Text style={styles.expandableTitle}>1. Color: The First Clue</Text>
            {showColorDetails ?
              <ChevronUp size={20} color={COLORS.primary[600]} /> :
              <ChevronDown size={20} color={COLORS.primary[600]} />
            }
          </TouchableOpacity>
          {showColorDetails && (
            <Animated.View entering={FadeIn.duration(300)} layout={Layout.springify()}>
                <Text style={styles.paragraphSubContent}>
                  Color is often the first thing you notice, but it can be misleading! The same mineral can come in many colors due to tiny impurities or weathering. Always use color with other tests.
                </Text>
                <Text style={styles.subListHeader}>Why Can Color Be Misleading?</Text>
                 <Text style={styles.subListItemNested}><Text style={styles.boldText}>Impurities:</Text> Tiny amounts of other elements change color (e.g., pure quartz is clear, amethyst is purple quartz with iron).</Text>
                 <Text style={styles.subListItemNested}><Text style={styles.boldText}>Weathering:</Text> Exposure can stain or dull the surface (e.g., copper turns green).</Text>
                <Text style={styles.subListHeader}>Key Takeaway:</Text>
                <Text style={styles.paragraphSubContent}>Use color as a first hint, but rely on other properties like streak and hardness for accurate identification.</Text>
                 <View style={styles.funFactCard}>
                    <Text style={styles.funFactTitle}>Fun Fact:</Text>
                    <Text style={styles.paragraphSubContentEnd}>
                    Some minerals show different colors when viewed from different angles (pleochroism) or under different lights!
                    </Text>
                 </View>
            </Animated.View>
          )}
        </View>

      {/* Section: Streak */}
      <View style={styles.propertyItem}>
          <TouchableOpacity
            style={styles.expandableHeader}
            onPress={() => setShowStreakDetails(!showStreakDetails)}
            activeOpacity={0.7}
          >
            <Text style={styles.expandableTitle}>2. Streak: The True Color</Text>
            {showStreakDetails ?
              <ChevronUp size={20} color={COLORS.primary[600]} /> :
              <ChevronDown size={20} color={COLORS.primary[600]} />
            }
          </TouchableOpacity>
          {showStreakDetails && (
            <Animated.View entering={FadeIn.duration(300)} layout={Layout.springify()}>
              <Text style={styles.paragraphSubContent}>
                Streak is the color of a mineral's powder, tested by rubbing it on an unglazed porcelain plate. It's often more reliable than surface color.
              </Text>
              <Text style={styles.subListHeader}>Examples:</Text>
                <View style={styles.tableContainer}>
                  <View style={styles.tableHeaderRow}>
                    <Text style={[styles.tableHeaderCell, styles.streakMineralCell]}>Mineral</Text>
                    <Text style={[styles.tableHeaderCell, styles.streakColorCell]}>Streak Color</Text>
                    <Text style={[styles.tableHeaderCell, styles.streakNotesCell]}>Notes</Text>
                  </View>
                  {StreakData.map((item, index) => (
                    <View key={index} style={styles.tableRow}>
                      <Text style={[styles.tableCell, styles.streakMineralCell, styles.boldText]}>{item.mineral}</Text>
                      <Text style={[styles.tableCell, styles.streakColorCell]}>{item.streakColor}</Text>
                      <Text style={[styles.tableCell, styles.streakNotesCell]}>{item.notes}</Text>
                    </View>
                  ))}
                </View>
                 <View style={styles.funFactCard}>
                    <Text style={styles.funFactTitle}>Fun Fact:</Text>
                    <Text style={styles.paragraphSubContentEnd}>
                    Real gold leaves a golden-yellow streak, while fool's gold (pyrite) leaves a greenish-black one! Streak helps tell them apart.
                    </Text>
                </View>
            </Animated.View>
          )}
        </View>

      {/* Section: Luster */}
       <View style={styles.propertyItem}>
          <TouchableOpacity
            style={styles.expandableHeader}
            onPress={() => setShowLusterDetails(!showLusterDetails)}
            activeOpacity={0.7}
          >
            <Text style={styles.expandableTitle}>3. Luster: How It Shines</Text>
            {showLusterDetails ?
              <ChevronUp size={20} color={COLORS.primary[600]} /> :
              <ChevronDown size={20} color={COLORS.primary[600]} />
            }
          </TouchableOpacity>
          {showLusterDetails && (
            <Animated.View entering={FadeIn.duration(300)} layout={Layout.springify()}>
                <Text style={styles.paragraphSubContent}>
                    Luster describes how light reflects off a mineral's surface. It's a key identifier!
                </Text>
                <Text style={styles.subListHeader}>Main Types:</Text>
                 <Text style={styles.subListItemNested}><Text style={styles.boldText}>Metallic:</Text> Looks shiny like polished metal (e.g., Pyrite, Galena).</Text>
                 <Text style={styles.subListItemNested}><Text style={styles.boldText}>Non-metallic:</Text> Doesn't look like metal. This group has many sub-types:</Text>
                 <Text style={styles.subListItemDeeper}><Text style={styles.italicText}>Vitreous:</Text> Glassy shine (e.g., Quartz, Calcite).</Text>
                 <Text style={styles.subListItemDeeper}><Text style={styles.italicText}>Resinous:</Text> Looks like resin or plastic (e.g., Sphalerite).</Text>
                 <Text style={styles.subListItemDeeper}><Text style={styles.italicText}>Pearly:</Text> Iridescent sheen, like a pearl (e.g., Talc, some Micas).</Text>
                 <Text style={styles.subListItemDeeper}><Text style={styles.italicText}>Greasy/Oily:</Text> Looks coated in oil (e.g., some Quartz, Nepheline).</Text>
                 <Text style={styles.subListItemDeeper}><Text style={styles.italicText}>Silky:</Text> Soft sheen from fine fibers (e.g., Gypsum satin spar).</Text>
                 <Text style={styles.subListItemDeeper}><Text style={styles.italicText}>Waxy:</Text> Dull shine like wax (e.g., Chalcedony).</Text>
                 <Text style={styles.subListItemDeeper}><Text style={styles.italicText}>Dull/Earthy:</Text> No shine, looks like soil (e.g., Kaolinite, Limonite).</Text>
                 <Text style={styles.subListItemDeeper}><Text style={styles.italicText}>Adamantine:</Text> Brilliant, fiery sparkle (e.g., Diamond).</Text>
                <View style={styles.funFactCard}>
                    <Text style={styles.funFactTitle}>Fun Fact:</Text>
                    <Text style={styles.paragraphSubContentEnd}>
                    Some minerals can show multiple lusters depending on the sample or how light hits them.
                    </Text>
                </View>
            </Animated.View>
          )}
        </View>

       {/* Section: Hardness */}
       <View style={styles.propertyItem}>
          <TouchableOpacity
            style={styles.expandableHeader}
            onPress={() => setShowHardnessDetails(!showHardnessDetails)}
            activeOpacity={0.7}
          >
            <Text style={styles.expandableTitle}>4. Hardness: The Scratch Test (Mohs Scale)</Text>
            {showHardnessDetails ?
              <ChevronUp size={20} color={COLORS.primary[600]} /> :
              <ChevronDown size={20} color={COLORS.primary[600]} />
            }
          </TouchableOpacity>
          {showHardnessDetails && (
            <Animated.View entering={FadeIn.duration(300)} layout={Layout.springify()}>
              <Text style={styles.paragraphSubContent}>
                Hardness measures how resistant a mineral is to being scratched. We use the Mohs Hardness Scale, ranking minerals from 1 (softest) to 10 (hardest).
              </Text>
              <Text style={styles.paragraphSubContent}>
                A harder mineral can scratch a softer one, but not the other way around. You can test hardness using common objects!
              </Text>
                <View style={styles.tableContainer}>
                  <View style={styles.tableHeaderRow}>
                    <Text style={[styles.tableHeaderCell, styles.hardnessNumCell]}>#</Text>
                    <Text style={[styles.tableHeaderCell, styles.hardnessMineralCell]}>Mineral</Text>
                    <Text style={[styles.tableHeaderCell, styles.hardnessCompCell]}>Comparison / Test</Text>
                  </View>
                  {MohsScaleData.map((item) => (
                    <View key={item.hardness} style={styles.tableRow}>
                      <Text style={[styles.tableCell, styles.hardnessNumCell, styles.boldText]}>{item.hardness}</Text>
                      <Text style={[styles.tableCell, styles.hardnessMineralCell]}>{item.mineral}</Text>
                      <Text style={[styles.tableCell, styles.hardnessCompCell]}>{item.comparison}</Text>
                    </View>
                  ))}
                </View>
                <View style={styles.funFactCard}>
                    <Text style={styles.funFactTitle}>Fun Fact:</Text>
                    <Text style={styles.paragraphSubContentEnd}>
                        Your fingernail has a hardness of about 2.5, a copper penny is around 3.5, a steel nail is 5.5, and glass is about 5.5-6.5. Use these to estimate mineral hardness in the field!
                    </Text>
                </View>
            </Animated.View>
          )}
        </View>

      {/* Section: Cleavage & Fracture */}
      <View style={styles.propertyItem}>
          <TouchableOpacity
            style={styles.expandableHeader}
            onPress={() => setShowCleavageDetails(!showCleavageDetails)}
            activeOpacity={0.7}
          >
            <Text style={styles.expandableTitle}>5. Cleavage & Fracture: How It Breaks</Text>
            {showCleavageDetails ?
              <ChevronUp size={20} color={COLORS.primary[600]} /> :
              <ChevronDown size={20} color={COLORS.primary[600]} />
            }
          </TouchableOpacity>
          {showCleavageDetails && (
            <Animated.View entering={FadeIn.duration(300)} layout={Layout.springify()}>
               <Text style={styles.paragraphSubContent}>
                 How a mineral breaks apart is another important clue. Does it split along smooth, flat surfaces, or does it shatter irregularly?
               </Text>
                <Text style={styles.subListHeader}>Cleavage</Text>
                 <Text style={styles.subListItemNested}>Tendency to break along specific planes of weakness, creating flat surfaces.</Text>
                 <Text style={styles.subListItemNested}>Examples:</Text>
                 <Text style={styles.subListItemDeeper}>Mica: Perfect cleavage in one direction (peels into thin sheets).</Text>
                 <Text style={styles.subListItemDeeper}>Halite (Salt): Cleavage in three directions at 90° angles (breaks into cubes).</Text>
                 <Text style={styles.subListItemDeeper}>Calcite: Cleavage in three directions, not at 90° angles (breaks into rhombs).</Text>

                <Text style={styles.subListHeader}>Fracture</Text>
                 <Text style={styles.subListItemNested}>Describes how a mineral breaks when it doesn't follow cleavage planes.</Text>
                 <Text style={styles.subListItemNested}>Examples:</Text>
                 <Text style={styles.subListItemDeeper}><Text style={styles.italicText}>Conchoidal:</Text> Smooth, curved surfaces like broken glass (e.g., Quartz, Obsidian).</Text>
                 <Text style={styles.subListItemDeeper}><Text style={styles.italicText}>Fibrous/Splintery:</Text> Breaks into fibers or splinters (e.g., Asbestos, Kyanite).</Text>
                 <Text style={styles.subListItemDeeper}><Text style={styles.italicText}>Uneven/Irregular:</Text> Rough, irregular surface (most common type).</Text>

                <View style={styles.funFactCard}>
                    <Text style={styles.funFactTitle}>Fun Fact:</Text>
                    <Text style={styles.paragraphSubContentEnd}>
                     Diamonds have perfect cleavage in four directions. This is why diamond cutters can precisely shape them into brilliant gems by striking them along these planes.
                    </Text>
                </View>
            </Animated.View>
          )}
        </View>

      {/* Section: Crystal Shape */}
      <View style={styles.propertyItem}>
          <TouchableOpacity
            style={styles.expandableHeader}
            onPress={() => setShowCrystalShapeDetails(!showCrystalShapeDetails)}
            activeOpacity={0.7}
          >
            <Text style={styles.expandableTitle}>6. Crystal Shape/Habit: Its Natural Form</Text>
            {showCrystalShapeDetails ?
              <ChevronUp size={20} color={COLORS.primary[600]} /> :
              <ChevronDown size={20} color={COLORS.primary[600]} />
            }
          </TouchableOpacity>
          {showCrystalShapeDetails && (
            <Animated.View entering={FadeIn.duration(300)} layout={Layout.springify()}>
                <Text style={styles.paragraphSubContent}>
                  If a mineral has enough space to grow freely, its atoms will arrange themselves into a specific, repeating geometric pattern, forming a crystal. The external shape reflects the internal atomic structure.
                </Text>
                <Text style={styles.subListHeader}>Common Crystal Habits:</Text>
                 <Text style={styles.subListItemNested}><Text style={styles.boldText}>Cubic:</Text> Cube-shaped (e.g., Halite, Pyrite, Galena).</Text>
                 <Text style={styles.subListItemNested}><Text style={styles.boldText}>Prismatic:</Text> Elongated, prism-like (e.g., Quartz, Tourmaline).</Text>
                 <Text style={styles.subListItemNested}><Text style={styles.boldText}>Tabular:</Text> Flat, tablet-shaped (e.g., Barite, some Feldspars).</Text>
                 <Text style={styles.subListItemNested}><Text style={styles.boldText}>Bladed:</Text> Long, flat crystals like knife blades (e.g., Kyanite).</Text>
                 <Text style={styles.subListItemNested}><Text style={styles.boldText}>Acicular:</Text> Needle-like (e.g., Actinolite).</Text>
                 <Text style={styles.subListItemNested}><Text style={styles.boldText}>Fibrous:</Text> Thread-like fibers (e.g., Asbestos varieties).</Text>
                 <Text style={styles.subListItemNested}><Text style={styles.boldText}>Botryoidal/Globular:</Text> Grape-like clusters or rounded masses (e.g., Hematite, Malachite).</Text>
                 <Text style={styles.subListItemNested}><Text style={styles.boldText}>Dendritic:</Text> Branching, tree-like pattern (e.g., Manganese oxides).</Text>
                 <Text style={styles.subListItemNested}><Text style={styles.boldText}>Massive:</Text> No distinct crystal shape, just a solid mass.</Text>
                 <View style={styles.funFactCard}>
                    <Text style={styles.funFactTitle}>Fun Fact:</Text>
                    <Text style={styles.paragraphSubContentEnd}>
                    Perfect, large crystals are rare in nature because minerals usually compete for space while growing!
                    </Text>
                 </View>
            </Animated.View>
          )}
        </View>

      {/* Section: Density */}
      <View style={styles.propertyItem}>
          <TouchableOpacity
            style={styles.expandableHeader}
            onPress={() => setShowDensityDetails(!showDensityDetails)}
            activeOpacity={0.7}
          >
            <Text style={styles.expandableTitle}>7. Density/Specific Gravity: How Heavy It Feels</Text>
            {showDensityDetails ?
              <ChevronUp size={20} color={COLORS.primary[600]} /> :
              <ChevronDown size={20} color={COLORS.primary[600]} />
            }
          </TouchableOpacity>
          {showDensityDetails && (
            <Animated.View entering={FadeIn.duration(300)} layout={Layout.springify()}>
                <Text style={styles.paragraphSubContent}>
                  Specific Gravity (SG) compares a mineral's density to the density of water. A mineral with SG 3 is three times heavier than the same volume of water. You can often feel the difference!
                </Text>
                 <Text style={styles.paragraphSubContent}>
                   Geologists call this the "heft test" - simply picking up the mineral can give you a clue.
                 </Text>
                  <View style={styles.tableContainer}>
                    <View style={styles.tableHeaderRow}>
                      <Text style={[styles.tableHeaderCell, styles.sgMineralCell]}>Mineral</Text>
                      <Text style={[styles.tableHeaderCell, styles.sgValueCell]}>SG Approx.</Text>
                      <Text style={[styles.tableHeaderCell, styles.sgFeelCell]}>How it Feels</Text>
                    </View>
                    {SGData.map((item, index) => (
                      <View key={index} style={styles.tableRow}>
                        <Text style={[styles.tableCell, styles.sgMineralCell, styles.boldText]}>{item.mineral}</Text>
                        <Text style={[styles.tableCell, styles.sgValueCell]}>{item.sg}</Text>
                        <Text style={[styles.tableCell, styles.sgFeelCell]}>{item.feel}</Text>
                      </View>
                    ))}
                  </View>
                  <View style={styles.funFactCard}>
                    <Text style={styles.funFactTitle}>Fun Fact:</Text>
                    <Text style={styles.paragraphSubContentEnd}>
                    Panning for gold works because gold (SG ~19.3) is much denser than sand and gravel (SG ~2.6), so it settles at the bottom of the pan!
                    </Text>
                 </View>
            </Animated.View>
          )}
        </View>

      {/* Section: Other Properties */}
      <View style={styles.propertyItem}>
          <TouchableOpacity
            style={styles.expandableHeader}
            onPress={() => setShowSensoryDetails(!showSensoryDetails)}
            activeOpacity={0.7}
          >
            <Text style={styles.expandableTitle}>8. Other Clues: Magnetism, Smell, Taste, Feel, & More!</Text>
            {showSensoryDetails ?
              <ChevronUp size={20} color={COLORS.primary[600]} /> :
              <ChevronDown size={20} color={COLORS.primary[600]} />
            }
          </TouchableOpacity>
          {showSensoryDetails && (
            <Animated.View entering={FadeIn.duration(300)} layout={Layout.springify()}>
              <Text style={styles.paragraphSubContent}>
                Sometimes, minerals have unique properties you can detect with your senses or simple tests:
              </Text>
                <Text style={styles.subListItemNested}><Text style={styles.boldText}>Magnetism:</Text> Some minerals, like Magnetite, are naturally magnetic.</Text>
                <Text style={styles.subListItemNested}><Text style={styles.boldText}>Reaction to Acid:</Text> Carbonate minerals like Calcite will fizz when dilute acid (like vinegar) is applied.</Text>
                <Text style={styles.subListItemNested}><Text style={styles.boldText}>Smell:</Text> Some minerals have a distinct smell when struck or moistened (e.g., Sulfur smells like rotten eggs, Kaolinite smells earthy when wet).</Text>
                <Text style={styles.subListItemNested}><Text style={styles.boldText}>Taste:</Text> Some minerals have a characteristic taste (e.g., Halite tastes salty). <Text style={styles.italicText}>Caution: Never taste unknown minerals!</Text></Text>
                <Text style={styles.subListItemNested}><Text style={styles.boldText}>Feel:</Text> Some minerals feel greasy (Talc) or smooth (Graphite).</Text>
                <Text style={styles.subListItemNested}><Text style={styles.boldText}>Fluorescence:</Text> Some minerals glow under ultraviolet (UV) light (e.g., some Fluorite, Calcite).</Text>
                <View style={styles.funFactCard}>
                    <Text style={styles.funFactTitle}>Fun Fact:</Text>
                    <Text style={styles.paragraphSubContentEnd}>
                    Graphite (used in pencils) and Diamond are both made purely of carbon, but their different atomic structures give them vastly different properties (soft vs. hardest)! Structure is everything!
                    </Text>
                 </View>
            </Animated.View>
          )}
        </View>

    </ScrollView>
  );
}

// Styles previously from MineralPropertiesTab.tsx
const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 20,
        backgroundColor: COLORS.neutral[50],
    },
    section: { // Used for the main intro section
        marginBottom: 16,
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
    },
    propertyItem: { // Wrapper for each expandable property
        marginBottom: 16,
        backgroundColor: 'white',
        borderRadius: 12,
        // padding: 16, // Padding applied within header/content
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
        overflow: 'hidden', // Helps contain animated view borders
    },
    expandableHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12, // Consistent padding
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.neutral[100],
    },
    expandableTitle: {
        ...FONTS.h3,
        color: COLORS.primary[700],
        flex: 1,
        marginRight: 10,
    },
    subListHeader: {
        ...FONTS.h4, // Slightly smaller for sub-headers
        fontWeight: 'bold',
        color: COLORS.neutral[700],
        marginTop: 12,
        marginBottom: 8,
        paddingHorizontal: 16, // Add padding if header doesn't have it
    },
    paragraphSubContent: {
        ...FONTS.bodySmall,
        color: COLORS.neutral[600],
        lineHeight: 21,
        marginBottom: 10,
        paddingHorizontal: 16, // Consistent padding for content
    },
    paragraphSubContentEnd: {
        ...FONTS.bodySmall,
        color: COLORS.neutral[600],
        lineHeight: 21,
        marginBottom: 0,
        paddingHorizontal: 16,
    },
    subListItemNested: {
        ...FONTS.bodySmall,
        color: COLORS.neutral[600],
        lineHeight: 20,
        marginBottom: 6,
        marginLeft: 16, // Indent
        paddingHorizontal: 16,
    },
     subListItemDeeper: { // For third-level indentation
        ...FONTS.bodySmall,
        color: COLORS.neutral[600],
        lineHeight: 20,
        marginBottom: 6,
        marginLeft: 32, // Further indent
        paddingHorizontal: 16,
    },
    subListItemBold: {
        ...FONTS.bodySmall,
        fontWeight: 'bold',
        color: COLORS.neutral[700],
        lineHeight: 20,
        marginBottom: 4,
        marginLeft: 16,
        paddingHorizontal: 16,
    },
    boldText: {
        fontWeight: 'bold',
        fontFamily: FONTS.bold.fontFamily,
        color: COLORS.neutral[700], // Slightly darker for emphasis
    },
     italicText: {
        fontFamily: FONTS.italic?.fontFamily || FONTS.regular.fontFamily, // Fallback if no italic
    },
    funFactCard: {
        backgroundColor: COLORS.accent[50],
        borderRadius: 8,
        padding: 12,
        marginTop: 15,
        marginBottom: 10, // Space below card
        marginHorizontal: 16, // Align with content padding
        borderLeftWidth: 3,
        borderLeftColor: COLORS.accent[500],
    },
     funFactTitle: {
        ...FONTS.h4,
        color: COLORS.accent[700],
        marginBottom: 6,
    },
    // Table Styles
    tableContainer: {
        marginTop: 10,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: COLORS.neutral[200],
        borderRadius: 8,
        overflow: 'hidden', // Ensures border radius on children
        marginHorizontal: 16, // Align table with padding
    },
    tableHeaderRow: {
        flexDirection: 'row',
        backgroundColor: COLORS.neutral[100],
        borderBottomWidth: 1,
        borderBottomColor: COLORS.neutral[200],
        paddingVertical: 8,
        paddingHorizontal: 10,
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: COLORS.neutral[100],
        paddingVertical: 8,
        paddingHorizontal: 10,
    },
    tableHeaderCell: {
        ...FONTS.caption,
        fontWeight: 'bold',
        color: COLORS.neutral[600],
    },
    tableCell: {
        ...FONTS.caption,
        color: COLORS.neutral[700],
    },
    // Specific column widths for Mohs scale table
    hardnessNumCell: { width: '10%', textAlign: 'center' },
    hardnessMineralCell: { width: '30%' },
    hardnessCompCell: { width: '60%', flexShrink: 1 }, // Allow text wrap
    // Specific column widths for SG table
    sgMineralCell: { width: '35%' },
    sgValueCell: { width: '25%', textAlign: 'center' },
    sgFeelCell: { width: '40%', flexShrink: 1 },
    // Specific column widths for Streak table
    streakMineralCell: { width: '30%' },
    streakColorCell: { width: '30%' },
    streakNotesCell: { width: '40%', flexShrink: 1 },
}); 
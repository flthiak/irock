import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { COLORS } from '@/utils/colors';
import { FONTS } from '@/utils/fonts';
import { ChevronDown, ChevronUp } from 'lucide-react-native';
import Animated, { FadeIn, Layout } from 'react-native-reanimated';

// This is the content previously in components/education/RockFormationsTab.tsx
export default function RockFormationsScreen() {
  const [showRockCycleDetails, setShowRockCycleDetails] = useState(true); // Keep expanded
  const [showPlateTectonicsDetails, setShowPlateTectonicsDetails] = useState(false);
  const [showEarthStructureDetails, setShowEarthStructureDetails] = useState(false);
  const [showRockTypesDetails, setShowRockTypesDetails] = useState(false); // Keep collapsed initially

  return (
    <ScrollView contentContainerStyle={styles.container}>

      {/* Section: The Rock Cycle */}
      <View style={styles.section}>
        {/* Header is not expandable anymore */}
        <Text style={styles.expandableTitle}>The Rock Cycle: Earth's Recycling System</Text>
        {/* Content is always visible */}
        <Animated.View layout={Layout.springify()}>
          <Text style={styles.paragraphSubContent}>
            Rocks may seem permanent, but they're actually part of an endless cycle of change! The Rock Cycle explains how rocks are formed, broken down, and transformed over millions of years. It's like Earth's version of a recycling program.
          </Text>
          <Text style={styles.subListHeader}>Here's how it works:</Text>
          <Text style={styles.subListItem}>Igneous rocks form when magma (molten rock) cools and hardens. Example: Basalt, Granite</Text>
          <Text style={styles.subListItem}>Over time, weathering and erosion break down these rocks into tiny particles like sand, mud, or clay.</Text>
          <Text style={styles.subListItem}>These particles are carried by wind or water and deposited in layers, forming sedimentary rocks through pressure and cementation. Example: Sandstone, Limestone</Text>
          <Text style={styles.subListItem}>When these sedimentary or igneous rocks are buried deep underground, heat and pressure can change their structure, creating metamorphic rocks. Example: Marble, Schist</Text>
          <Text style={styles.subListItem}>If the metamorphic rocks melt, they turn back into magma, and the cycle begins again!</Text>
          <Text style={styles.paragraphSubContentEnd}>The rock cycle never stops—it's slow, but it's happening right beneath your feet!</Text>
        </Animated.View>
      </View>

      {/* Section: Meet the Rock Stars */}
      <View style={styles.section}>
        <TouchableOpacity
          style={styles.expandableHeader}
          onPress={() => setShowRockTypesDetails(!showRockTypesDetails)}
          activeOpacity={0.7}
        >
          <Text style={styles.expandableTitle}>Meet the Rock Stars: Igneous, Sedimentary, and Metamorphic</Text>
          {showRockTypesDetails ?
            <ChevronUp size={20} color={COLORS.primary[600]} /> :
            <ChevronDown size={20} color={COLORS.primary[600]} />
          }
        </TouchableOpacity>
        {showRockTypesDetails && (
          <Animated.View entering={FadeIn.duration(300)} layout={Layout.springify()}>
            <Text style={styles.paragraphSubContent}>
              Geology introduces us to three major types of rocks, each with their own unique origin stories, personalities, and dramatic transformations. They may look solid and still, but every rock has been on a wild adventure!
            </Text>
            <Text style={styles.rockTypeHeader}>Igneous Rocks</Text>
            <Text style={styles.paragraphSubContent}>
              These fiery rocks are born from molten magma or lava—literally the Earth's inner fire!
            </Text>
            <Text style={styles.subListItem}>
              If the magma cools slowly underground, it forms rocks like granite, full of big, visible crystals you can actually see sparkle in the sunlight.
            </Text>
            <Text style={styles.subListItem}>
              If it cools quickly on the surface (after a volcanic eruption, for example), it turns into rocks like basalt, which is dark, dense, and super common—especially on the ocean floor.
            </Text>
            <Text style={styles.subListItem}>
              Sometimes, igneous rocks cool so fast they form obsidian, a shiny, glass-like rock that was once used to make tools and weapons!
            </Text>

            <Text style={styles.rockTypeHeader}>Sedimentary Rocks</Text>
            <Text style={styles.paragraphSubContent}>
              These are the storytellers of the rock world. Formed from layers of sand, mud, silt, pebbles, and even seashells, sedimentary rocks are created over millions of years as these materials get squashed and cemented together under pressure.
            </Text>
            <Text style={styles.subListItem}>
              Common types include sandstone (made from compacted sand) and limestone (often formed from marine life remains).
            </Text>
            <Text style={styles.subListItem}>
              They often contain fossils, giving us clues about ancient life and environments. It's like nature's time capsule!
            </Text>

            <Text style={styles.rockTypeHeader}>Metamorphic Rocks</Text>
            <Text style={styles.paragraphSubContent}>
              These rocks have lived a double life—or even more! They start as either igneous or sedimentary rocks but are transformed by intense heat and pressure deep underground.
            </Text>
            <Text style={styles.subListItem}>
              This process is called metamorphism—like a rock makeover!
            </Text>
            <Text style={styles.subListItem}>
              Marble forms from limestone and is smooth, shiny, and often used in sculptures and fancy buildings.
            </Text>
            <Text style={styles.subListItem}>
              Gneiss starts out as granite or sedimentary rock and becomes banded and beautiful under stress.
            </Text>
            <Text style={styles.subListItem}>
              You can often see the dramatic folds and swirls in metamorphic rocks—proof of their extreme underground journey!
            </Text>
          </Animated.View>
        )}
      </View>

      {/* Section: Plate Tectonics */}
      <View style={styles.section}>
        <TouchableOpacity 
          style={styles.expandableHeader}
          onPress={() => setShowPlateTectonicsDetails(!showPlateTectonicsDetails)}
          activeOpacity={0.7}
        >
          <Text style={styles.expandableTitle}>Plate Tectonics: Earth's Moving Puzzle Pieces</Text>
          {showPlateTectonicsDetails ? 
            <ChevronUp size={20} color={COLORS.primary[600]} /> : 
            <ChevronDown size={20} color={COLORS.primary[600]} />
          }
        </TouchableOpacity>
        {showPlateTectonicsDetails && (
          <Animated.View entering={FadeIn.duration(300)} layout={Layout.springify()}>
            <Text style={styles.paragraphSubContent}>
              The Earth's surface isn't solid like it seems—it's made of giant slabs called tectonic plates that float on a sea of hot, soft rock in the mantle below. This theory, called Plate Tectonics, explains how continents move and why we have earthquakes, volcanoes, and mountain ranges.
            </Text>
            <Text style={styles.subListHeader}>Key Ideas:</Text>
            <Text style={styles.subListItem}>Earth has 7 major plates (like the Pacific, North American, and Eurasian Plates) and many smaller ones.</Text>
            <Text style={styles.subListItem}>These plates are always moving—just a few centimeters per year (about as fast as your fingernails grow!).</Text>
            
            <Text style={styles.subListHeader}>What happens at plate boundaries?</Text>
            <Text style={styles.subListItemBold}>Divergent Boundaries – Plates move apart.</Text>
            <Text style={styles.subListItemNested}>New crust forms as magma rises (e.g., Mid-Atlantic Ridge).</Text>
            
            <Text style={styles.subListItemBold}>Convergent Boundaries – Plates collide.</Text>
            <Text style={styles.subListItemNested}>One plate dives under another (subduction), causing mountains, volcanoes, or earthquakes (e.g., Himalayas, Ring of Fire).</Text>
            
            <Text style={styles.subListItemBold}>Transform Boundaries – Plates slide past each other.</Text>
            <Text style={styles.subListItemNested}>This causes earthquakes (e.g., San Andreas Fault in California).</Text>
            
            <Text style={styles.paragraphSubContentEnd}>
              Plate tectonics helps explain how continents drift, how oceans open and close, and how Earth's surface constantly changes—even if we don't notice it day to day.
            </Text>
          </Animated.View>
        )}
      </View>

      {/* Section: Earth's Structure */}
      <View style={styles.section}>
        <TouchableOpacity 
          style={styles.expandableHeader}
          onPress={() => setShowEarthStructureDetails(!showEarthStructureDetails)}
          activeOpacity={0.7}
        >
          <Text style={styles.expandableTitle}>Earth's Structure: Layers of the Living Planet</Text>
          {showEarthStructureDetails ? 
            <ChevronUp size={20} color={COLORS.primary[600]} /> : 
            <ChevronDown size={20} color={COLORS.primary[600]} />
          }
        </TouchableOpacity>
        {showEarthStructureDetails && (
          <Animated.View entering={FadeIn.duration(300)} layout={Layout.springify()}>
            <Text style={styles.paragraphSubContent}>
              Earth isn't a solid ball—it's made up of layers, each with different materials, temperatures, and behaviors. Like a giant onion (but way hotter and denser!), the deeper you go, the more extreme it gets.
            </Text>
            <Text style={styles.subListHeader}>The Four Main Layers:</Text>
            
            <Text style={styles.subListItemBold}>Crust (5–70 km thick)</Text>
            <Text style={styles.subListItemNested}>Earth's outer shell—where we live!</Text>
            <Text style={styles.subListItemNested}>Includes continental crust (thicker) and oceanic crust (thinner but denser).</Text>
            <Text style={styles.subListItemNested}>Made of solid rock like granite and basalt.</Text>

            <Text style={styles.subListItemBold}>Mantle (~2,900 km thick)</Text>
            <Text style={styles.subListItemNested}>Just beneath the crust, this layer is hot and semi-solid.</Text>
            <Text style={styles.subListItemNested}>It's where convection currents flow, causing tectonic plates to move.</Text>
            <Text style={styles.subListItemNested}>Mostly made of silicate minerals rich in iron and magnesium.</Text>

            <Text style={styles.subListItemBold}>Outer Core (Liquid, ~2,200 km thick)</Text>
            <Text style={styles.subListItemNested}>Made of liquid iron and nickel.</Text>
            <Text style={styles.subListItemNested}>Its swirling motion creates Earth's magnetic field!</Text>

            <Text style={styles.subListItemBold}>Inner Core (Solid, ~1,200 km radius)</Text>
            <Text style={styles.subListItemNested}>The hottest and densest part of Earth—up to 5,700°C!</Text>
            <Text style={styles.subListItemNested}>Solid ball of mostly iron and nickel, kept solid by immense pressure.</Text>
            
            <Text style={styles.subListHeader}>Why it matters:</Text>
            <Text style={styles.paragraphSubContentEnd}>
              Understanding Earth's structure helps explain everything from volcanoes to magnetic fields—and it gives us a glimpse into the powerful forces shaping our world from the inside out!
            </Text>
          </Animated.View>
        )}
      </View>

    </ScrollView>
  );
}

// Styles previously from RockFormationsTab.tsx
const styles = StyleSheet.create({
  container: { // Renamed from tabContentContainer
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 20, // Reduced padding
    backgroundColor: COLORS.neutral[50],
  },
  section: {
    marginBottom: 16, // Reduced margin between sections
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  expandableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 5, // Padding below the header text/icon
    borderBottomWidth: 1, // Optional: add a line under the header
    borderBottomColor: COLORS.neutral[100], // Light line color
    marginBottom: 10, // Space between header and content
  },
  expandableTitle: {
    ...FONTS.h3,
    color: COLORS.primary[700],
    flex: 1, 
    marginRight: 10, // Space between title and icon
  },
  rockTypeHeader: {
    ...FONTS.h4, // Use H4 for sub-sections within expandable content
    color: COLORS.secondary ? COLORS.secondary[700] : COLORS.primary[700],
    marginTop: 16,
    marginBottom: 8,
  },
  subListHeader: {
    ...FONTS.body,
    fontWeight: 'bold',
    color: COLORS.neutral[700],
    marginTop: 12,
    marginBottom: 6,
  },
  paragraphSubContent: {
    ...FONTS.bodySmall,
    color: COLORS.neutral[600],
    lineHeight: 21,
    marginBottom: 10,
  },
   paragraphSubContentEnd: { // Style for last paragraph in a section
    ...FONTS.bodySmall,
    color: COLORS.neutral[600],
    lineHeight: 21,
    marginBottom: 0, // No margin after the last item
  },
  subListItem: {
    ...FONTS.bodySmall,
    color: COLORS.neutral[600],
    lineHeight: 20,
    marginBottom: 6,
    marginLeft: 16, 
  },
  subListItemBold: {
     ...FONTS.bodySmall,
    fontWeight: 'bold',
    color: COLORS.neutral[700],
    lineHeight: 20,
    marginBottom: 4,
    marginLeft: 16, 
  },
   subListItemNested: {
    ...FONTS.bodySmall,
    color: COLORS.neutral[600],
    lineHeight: 20,
    marginBottom: 6,
    marginLeft: 32, // Further indent nested items
  },
}); 
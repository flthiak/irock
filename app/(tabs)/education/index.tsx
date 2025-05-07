import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { COLORS } from '@/utils/colors';
import { FONTS } from '@/utils/fonts';

// This is the content previously in components/education/GeologyBasicsTab.tsx
export default function GeologyBasicsScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* <Text style={{ color: 'red', fontSize: 20, padding: 20, textAlign: 'center' }}>--- DEBUG: Geology Basics Screen Loaded ---</Text> */}
      <View style={styles.section}>
        <Text style={styles.title}>Welcome to the Wild World of Geology!</Text>
        <Text style={styles.paragraph}>
          Geology is more than just rocks—it's the epic science of Earth's past, present, and future! Think of it as Earth's autobiography, written in stone, one layer at a time.
        </Text>
        <Text style={styles.paragraph}>
          Geologists are like nature's detectives, uncovering the secrets buried beneath our feet. They study everything from tiny sparkly minerals to towering mountain ranges, from ancient ocean beds to exploding volcanoes. Every rock tells a story—and geology is how we learn to read it.
        </Text>

        <View style={styles.subSectionCard}>
          <Text style={styles.paragraph}>
            Geology introduces us to three major types of rocks, each with their own dramatic backstories:
          </Text>
          <Text style={styles.rockTypeTitle}>Igneous Rocks</Text>
          <Text style={styles.paragraph}>
            These are born from cooled magma or lava. If it cools underground, you get rocks like granite (big crystals!). If it cools on the surface, it's basalt, the most common rock on Earth.
          </Text>
          <Text style={styles.rockTypeTitle}>Sedimentary Rocks</Text>
          <Text style={styles.paragraph}>
            Formed by squashing together sand, mud, and even seashells. Sandstone and limestone are examples. You might even find fossils inside!
          </Text>
          <Text style={styles.rockTypeTitle}>Metamorphic Rocks</Text>
          <Text style={styles.paragraph}>
            These rocks have been "cooked and squeezed" under heat and pressure to become something new. Marble and gneiss are their fancy, transformed forms.
          </Text>
        </View>

        <Text style={styles.subHeader}>Earth is Always on the Move!</Text>
        <Text style={styles.paragraph}>
          Our planet might seem calm from where you stand, but deep down, it's a wild, restless place.
        </Text>
        <Text style={styles.listItem}>Volcanoes erupt molten rock called lava that cools into brand-new land.</Text>
        <Text style={styles.listItem}>Earthquakes shake and shatter Earth's crust when giant plates move or crash into each other.</Text>
        <Text style={styles.listItem}>Mountains are pushed up over millions of years like slow-motion wrinkles on Earth's surface.</Text>
        <Text style={styles.listItem}>Valleys and canyons are carved by rivers, glaciers, and wind—nature's sculptors over time.</Text>

        <Text style={styles.subHeader}>Minerals: The Sparkly Building Blocks</Text>
        <Text style={styles.paragraph}>
          Minerals are like the ingredients in the recipe of a rock. Each one has its own color, hardness, shape, and luster (that's the shine!). Some are shiny like metal, some are glassy, and some are dull—but each one is unique.
        </Text>
        <Text style={styles.paragraph}>
          Did you know diamonds and salt are both minerals? One is found deep underground and the other in your kitchen!
        </Text>

        <Text style={styles.subHeader}>Fossils and Time Travel</Text>
        <Text style={styles.paragraph}>
          Geology also teaches us about fossils—the remains of ancient plants and animals. From dinosaur bones to trilobites, these clues tell us about life millions of years ago. By studying the layers of rock they're found in, we can even tell how old they are. It's like being a time traveler without leaving Earth!
        </Text>

        <Text style={styles.subHeader}>Why Geology Matters</Text>
        <Text style={styles.paragraph}>Geology helps us:</Text>
        <Text style={styles.listItem}>Discover natural resources like water, oil, and gold</Text>
        <Text style={styles.listItem}>Understand and prepare for natural disasters</Text>
        <Text style={styles.listItem}>Find safe places to build homes, roads, and cities</Text>
        <Text style={styles.listItem}>Protect the environment and learn how to live more sustainably</Text>
        <Text style={styles.paragraph}>
          And let's not forget: geology also makes outdoor adventures way cooler. Once you know what to look for, every rock, cliff, beach, and hill becomes a place full of history and wonder.
        </Text>
        <Text style={styles.paragraph}>
          So the next time you pick up a rock, remember—you're holding a piece of Earth's incredible story. And thanks to geology, you can learn how to read it.
        </Text>
      </View>
    </ScrollView>
  );
}

// Styles previously from GeologyBasicsTab.tsx
const styles = StyleSheet.create({
  container: { // Renamed from tabContentContainer
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 20, // Reduced padding as outer layout handles bottom space
    backgroundColor: COLORS.neutral[50],
  },
  section: {
    marginBottom: 24,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  subSectionCard: { 
    backgroundColor: COLORS.neutral[100],
    borderRadius: 8,
    padding: 12,
    marginTop: 20, 
    marginBottom: 20,
  },
  title: {
    ...FONTS.h2,
    color: COLORS.primary[700],
    marginBottom: 16,
    textAlign: 'center',
  },
  subHeader: {
    ...FONTS.h3,
    color: COLORS.secondary ? COLORS.secondary[600] : COLORS.primary[600],
    marginTop: 20,
    marginBottom: 10,
  },
  rockTypeTitle: {
    ...FONTS.h4,
    color: COLORS.neutral[700],
    marginTop: 12,
    marginBottom: 4,
  },
  paragraph: {
    ...FONTS.body,
    color: COLORS.neutral[700],
    lineHeight: 23, 
    marginBottom: 12,
  },
  listItem: {
    ...FONTS.body,
    color: COLORS.neutral[600],
    lineHeight: 22,
    marginBottom: 8,
    marginLeft: 16, 
  },
}); 
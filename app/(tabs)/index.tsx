import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Camera, BookOpen } from 'lucide-react-native';
import { COLORS } from '@/utils/colors';
import { FONTS } from '@/utils/fonts';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { AppHeader } from '@/components/AppHeader';
import BottomNavBar from '@/components/BottomNavBar';

export default function HomeScreen() {
  const router = useRouter();

  const navigateToCollection = () => {
    router.push('/(tabs)/collection');
  };

  return (
    <View style={styles.outerContainer}>
      <AppHeader title="Rock Identifier" />
      <ScrollView contentContainerStyle={styles.container}>
        <Stack.Screen options={{ headerShown: false }} />

        <View style={styles.heroSection}>
          {/* <Image 
            source={require('@/assets/images/rock-hero.jpg')} 
            style={styles.heroImage} 
          /> */}
          {/* The above Image component is commented out due to a missing asset. */}
          {/* You can add the image to assets/images/rock-hero.jpg or update the path. */}
          {/* As a fallback, the heroSection has a dark background color. */}
          <View style={styles.heroOverlay} />
          <Text style={styles.heroTitle}>Welcome to Rock Identifier!</Text>
          <Text style={styles.heroSubtitle}>Your go-to app for discovering the world of rocks.</Text>
        </View>

        <TouchableOpacity 
          style={styles.collectionButton} 
          onPress={navigateToCollection}
          activeOpacity={0.8}
        >
          <BookOpen color={COLORS.primary[700]} size={28} />
          <Text style={styles.collectionButtonText}>View My Collection</Text>
        </TouchableOpacity>
        
        <Animated.View 
          style={styles.featuredSection}
          entering={FadeInDown.delay(200).duration(600)}
        >
          <Text style={styles.sectionTitle}>Common Rock Types</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.rockTypesContainer}
          >
            {rockTypes.map((rock, index) => (
              <View key={index} style={styles.rockTypeCard}>
                <Image 
                  source={{ uri: rock.image }} 
                  style={styles.rockImage}
                />
                <Text style={styles.rockName}>{rock.name}</Text>
              </View>
            ))}
          </ScrollView>
        </Animated.View>
        
        <Animated.View 
          style={styles.featuredSection}
          entering={FadeInDown.delay(400).duration(600)}
        >
          <View style={[styles.factCard, { backgroundColor: COLORS.warning[50] }]}>
            <Text style={styles.factText}>
              <Text style={{ fontFamily: FONTS.bold?.fontFamily || 'System' }}>Did You Know? </Text>
              Rocks are naturally occurring solid masses of minerals. They form the Earth's outer layer, 
              known as the crust. Geologists classify rocks into three main groups: 
              igneous, sedimentary, and metamorphic.
            </Text>
          </View>
        </Animated.View>
      </ScrollView>
      <BottomNavBar activeTab="home" />
    </View>
  );
}

const rockTypes = [
  { name: 'Granite', image: 'https://images.pexels.com/photos/1029604/pexels-photo-1029604.jpeg?auto=compress&cs=tinysrgb&w=500' },
  { name: 'Basalt', image: 'https://images.pexels.com/photos/2363814/pexels-photo-2363814.jpeg?auto=compress&cs=tinysrgb&w=500' },
  { name: 'Limestone', image: 'https://images.pexels.com/photos/3156381/pexels-photo-3156381.jpeg?auto=compress&cs=tinysrgb&w=500' },
  { name: 'Quartz', image: 'https://images.pexels.com/photos/6913143/pexels-photo-6913143.jpeg?auto=compress&cs=tinysrgb&w=500' },
  { name: 'Marble', image: 'https://images.pexels.com/photos/1585848/pexels-photo-1585848.jpeg?auto=compress&cs=tinysrgb&w=500' },
];

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: COLORS.neutral[50],
  },
  container: {
    flexGrow: 1,
    paddingBottom: 90,
    backgroundColor: COLORS.neutral[50],
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: 30,
    position: 'relative',
    backgroundColor: COLORS.neutral[800],
  },
  heroImage: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  heroTitle: {
    ...FONTS.h1,
    fontSize: Platform.OS === 'ios' ? 34 : 30,
    color: 'white',
    textAlign: 'center',
    position: 'absolute',
    top: '35%',
    width: '90%',
  },
  heroSubtitle: {
    fontFamily: FONTS.regular?.fontFamily || 'System',
    fontSize: Platform.OS === 'ios' ? 17 : 16,
    lineHeight: Platform.OS === 'ios' ? 22 : 21,
    color: 'white',
    textAlign: 'center',
    position: 'absolute',
    top: '55%',
    width: '85%',
  },
  sectionTitle: {
    ...FONTS.h2,
    color: COLORS.neutral[700],
    paddingHorizontal: 20,
    marginBottom: 20,
    marginTop: 10,
    textAlign: 'center',
  },
  collectionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: COLORS.primary[50],
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.primary[200],
    marginHorizontal: 20,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  collectionButtonText: {
    ...FONTS.button,
    color: COLORS.primary[700],
    marginLeft: 10,
  },
  featuredSection: {
    marginBottom: 24,
    marginHorizontal: 20,
  },
  rockTypesContainer: {
    paddingLeft: 0,
    paddingRight: 10,
  },
  rockTypeCard: {
    width: 130,
    marginRight: 12,
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: COLORS.neutral[200],
  },
  rockImage: {
    width: '100%',
    height: 100,
  },
  rockName: {
    fontFamily: FONTS.button?.fontFamily || FONTS.regular?.fontFamily || 'System',
    fontSize: 13,
    color: COLORS.neutral[800],
    paddingVertical: 10,
    paddingHorizontal: 8,
    textAlign: 'center',
    fontWeight: '600',
  },
  factCard: {
    backgroundColor: COLORS.warning[50],
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.warning[500],
  },
  factText: {
    ...FONTS.bodySmall,
    lineHeight: 22,
    color: COLORS.neutral[700],
  },
});
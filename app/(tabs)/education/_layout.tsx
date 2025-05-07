import React from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { COLORS } from '@/utils/colors';
import { FONTS } from '@/utils/fonts';
import { AppHeader } from '@/components/AppHeader';
import BottomNavBar from '@/components/BottomNavBar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Stack } from 'expo-router'; // Import Stack for header options

// Import the actual screen components
import GeologyBasicsScreen from './index';
import RockFormationsScreen from './rock-formations';
import MineralPropertiesScreen from './mineral-properties';

const TopTab = createMaterialTopTabNavigator();

export default function EducationTabLayout() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();

  // Prepare tab label style with fallback
  const tabLabelStyle = {
    ...(FONTS.button || FONTS.body),
    fontSize: (FONTS.button?.fontSize || FONTS.body?.fontSize || 14) * 0.9,
    textTransform: 'capitalize' as 'none' | 'capitalize' | 'uppercase',
  };
  if (!FONTS.button && !FONTS.body) {
    tabLabelStyle.fontFamily = 'System';
    tabLabelStyle.fontSize = 13;
  }

  return (
    <View style={styles.outerContainer}>
      {/* Use Stack to potentially hide the header provided by the parent stack, if needed,
          or configure the header for the entire education section here */}
      <Stack.Screen options={{ headerShown: false }} /> 
      <AppHeader title="Learn About Rocks" />
      {/* The TopTab.Navigator now controls the content area */}
      <TopTab.Navigator
        // initialRouteName="index" // Let file system handle initial route (index.tsx)
        screenOptions={{
          tabBarActiveTintColor: COLORS.primary[700],
          tabBarInactiveTintColor: COLORS.neutral[500],
          tabBarLabelStyle: tabLabelStyle,
          tabBarIndicatorStyle: {
            backgroundColor: COLORS.primary[700],
            height: 3,
          },
          tabBarStyle: {
            backgroundColor: COLORS.neutral[50],
            elevation: 0, 
            shadowOpacity: 0,
            borderBottomWidth: 1,
            borderBottomColor: COLORS.neutral[200],
            paddingTop: 0, // Adjust if safe area needs to be handled differently
          },
        }}
      >
        {/* Screens are now explicitly linked */}
        <TopTab.Screen 
          name="index" 
          component={GeologyBasicsScreen} // Use explicit component
          options={{ title: 'Geology Basics' }} 
        />
        <TopTab.Screen 
          name="rock-formations" 
          component={RockFormationsScreen} // Use explicit component
          options={{ title: 'Rock Formations' }} 
        />
        <TopTab.Screen 
          name="mineral-properties" 
          component={MineralPropertiesScreen} // Use explicit component
          options={{ title: 'Mineral Properties' }} 
        />
      </TopTab.Navigator>
      {/* BottomNavBar appears below the TopTab content */}
      <BottomNavBar activeTab="education" />
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: COLORS.neutral[50],
    // paddingTop: insets.top, // Add top padding if AppHeader doesn't handle safe area
  },
  // contentWrapper is no longer needed as TopTab.Navigator fills the space
}); 
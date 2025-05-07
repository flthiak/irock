import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { getRockById, RockItem } from '@/utils/storage';
import { COLORS } from '@/utils/colors';
import { FONTS } from '@/utils/fonts';
import { AppHeader } from '@/components/AppHeader'; // Assuming you want a header
import BottomNavBar from '@/components/BottomNavBar'; // Import BottomNavBar

export default function RockDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [rock, setRock] = useState<RockItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadRockDetails(id);
    } else {
      // Handle case where ID is missing, maybe navigate back or show error
      setLoading(false);
    }
  }, [id]);

  const loadRockDetails = async (rockId: string) => {
    setLoading(true);
    const fetchedRock = await getRockById(rockId);
    setRock(fetchedRock);
    setLoading(false);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary[600]} />
      </View>
    );
  }

  if (!rock) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ title: 'Not Found' }} />
        <AppHeader title="Error" />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Rock details not found.</Text>
        </View>
      </View>
    );
  }

  // Format the data similar to IdentifyScreen results for consistency
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: rock.name }} />
      <AppHeader title={rock.name} />
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Image source={{ uri: rock.imageUri }} style={styles.image} />

        <View style={styles.detailsCard}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{rock.description}</Text>

          {/* New Nested Card for Properties and Info */}
          <View style={styles.nestedCard}>
            {/* Display properties */}
            {rock.properties && rock.properties.length > 0 && (
              <View style={styles.propertiesSection}>
                <Text style={styles.nestedSectionTitle}>Properties</Text>
                {rock.properties.map((prop, index) => (
                  <Text key={index} style={styles.propertyItem}>
                    <Text style={styles.propertyName}>{prop.name}:</Text> {prop.value}
                  </Text>
                ))}
              </View>
            )}

            {/* Display Notes if they exist */}
            {rock.notes && (
              <View style={styles.infoSection}>
                <Text style={styles.nestedSectionTitle}>Notes</Text>
                <Text style={styles.infoText}>{rock.notes}</Text>
              </View>
            )}
            {/* Display Location if it exists */}
            {rock.location && (
              <View style={styles.infoSection}>
                <Text style={styles.nestedSectionTitle}>Location Found</Text>
                <Text style={styles.infoText}>{rock.location}</Text>
              </View>
            )}
          </View> {/* End of nestedCard */}

          <Text style={styles.dateText}>
            Added: {new Date(rock.date).toLocaleDateString()}
          </Text>
        </View>
      </ScrollView>
      <BottomNavBar activeTab="collection" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.neutral[50],
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.neutral[50],
  },
  errorContainer: {
     flex: 1,
     justifyContent: 'center',
     alignItems: 'center',
     padding: 20,
  },
  errorText: {
    ...FONTS.h3,
    color: COLORS.error[700],
    textAlign: 'center',
  },
  contentContainer: {
    paddingBottom: 80,
  },
  image: {
    width: '95%',
    height: 300, // Adjust height as needed
    backgroundColor: COLORS.neutral[200],
    marginTop: 10,
    alignSelf: 'center',
    borderRadius: 8, // Add a slight borderRadius to match the card style
    borderWidth: 1,
    borderColor: COLORS.neutral[300], // A subtle border color
  },
  detailsCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    marginHorizontal: 16,
    marginTop: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionTitle: {
    ...FONTS.h3,
    color: COLORS.neutral[800],
    marginBottom: 12,
  },
  description: {
    ...FONTS.body,
    color: COLORS.neutral[700],
    lineHeight: 24,
    marginBottom: 20,
  },
  nestedCard: {
    backgroundColor: '#E0F7FA', // Light Cyan Blue
    borderRadius: 12,
    padding: 16,
    marginTop: 10, // Add some space below description
    marginBottom: 20, // Add space above date added
  },
  nestedSectionTitle: { // Style for titles inside nested card
    ...FONTS.h4, // Maybe slightly smaller than main section title
    color: COLORS.neutral[800],
    marginBottom: 10,
  },
  propertiesSection: {
    marginBottom: 15, // Space between sections in nested card
  },
  infoSection: {
     marginBottom: 15, // Space between sections in nested card
  },
  propertyItem: {
    ...FONTS.body,
    color: COLORS.neutral[800],
    marginBottom: 8,
  },
  propertyName: {
    ...FONTS.bold,
    color: COLORS.neutral[700],
  },
  infoText: {
     ...FONTS.body,
     color: COLORS.neutral[700],
     lineHeight: 22,
  },
  dateText: {
    ...FONTS.caption,
    color: COLORS.neutral[500],
    marginTop: 20,
    textAlign: 'center',
  },
}); 
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { COLORS } from '@/utils/colors';
import { FONTS } from '@/utils/fonts';

interface AppHeaderProps {
  title: string;
  rightElement?: React.ReactNode;
}

const headerBgImage = { uri: 'https://iili.io/3NjquhQ.md.png' };

export function AppHeader({ title, rightElement }: AppHeaderProps) {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <ImageBackground 
      source={headerBgImage} 
      style={[styles.container, { paddingTop: insets.top + 10 }]}
      resizeMode="cover"
    >
      <View style={styles.contentContainer}>
        {router.canGoBack() ? (
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ChevronLeft size={24} color="white" />
          </TouchableOpacity>
        ) : (
          <View style={styles.placeholder} />
        )}

        <Text style={styles.title}>{title}</Text>

        {rightElement ? (
          <View style={styles.rightElementContainer}>{rightElement}</View>
        ) : (
          <View style={styles.placeholder} />
        )}
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 10,
    paddingHorizontal: 16,
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 50,
    width: '100%',
  },
  backButton: {
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 30,
  },
  title: {
    ...FONTS.h3,
    color: 'white',
    textAlign: 'center',
    flex: 1,
  },
  rightElementContainer: {
    minWidth: 30,
    alignItems: 'flex-end',
  },
  placeholder: {
    width: 30,
  },
}); 
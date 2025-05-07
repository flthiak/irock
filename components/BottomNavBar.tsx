import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, useWindowDimensions } from 'react-native';
import { Home, ScanLine, Library, BookOpen, Compass, MessageCircle } from 'lucide-react-native';
import { useRouter, usePathname } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '@/utils/colors';
import { FONTS } from '@/utils/fonts';

export type TabName = 'home' | 'identify' | 'collection' | 'education' | 'suggestions' | 'chat';

interface TabBarProps {
  activeTab: TabName;
}

const NAV_ITEMS: { name: TabName; label: string; icon: React.ElementType; path: string }[] = [
  { name: 'home', label: 'Home', icon: Home, path: '/(tabs)' },
  { name: 'identify', label: 'Identify', icon: ScanLine, path: '/(tabs)/identify' },
  { name: 'collection', label: 'Collection', icon: Library, path: '/(tabs)/collection' },
  { name: 'education', label: 'Learn', icon: BookOpen, path: '/(tabs)/education' },
  { name: 'suggestions', label: 'Explore', icon: Compass, path: '/(tabs)/location-suggestions' },
  { name: 'chat', label: 'Chat', icon: MessageCircle, path: '/(tabs)/chat' },
];

const BottomNavBar: React.FC<TabBarProps> = ({ activeTab }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { width } = useWindowDimensions();

  // Fix: Use FONTS.caption or a system fallback for nav labels
  const labelStyle = FONTS.caption || { fontSize: 10, fontFamily: 'System' };
  const activeLabelStyle = { ...labelStyle, fontWeight: '600', color: COLORS.primary[600] }; // Active color applied directly here

  return (
    <View style={[styles.navBarContainer, { width }]}>
      {NAV_ITEMS.map((item) => {
        const isActive = activeTab === item.name || pathname === item.path;
        return (
          <TouchableOpacity
            key={item.name}
            style={styles.navItem}
            onPress={() => router.push(item.path as any)}
            activeOpacity={0.7}
          >
            <item.icon 
              size={isActive ? 26 : 24} 
              color={isActive ? COLORS.primary[600] : COLORS.neutral[400]} 
              strokeWidth={isActive ? 2.5 : 2}
            />
            <Text 
              style={[
                styles.navLabel,
                labelStyle,
                isActive && activeLabelStyle, // Simplified active style application
              ]}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  navBarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
    // Fix: Use COLORS.neutral[50] or 'white' for background
    backgroundColor: COLORS.neutral[50] || 'white', 
    height: 55,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.neutral[200],
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
    flex: 1,
  },
  navLabel: {
    marginTop: 2,
    color: COLORS.neutral[400],
  },
  // Removed activeNavLabel as color is handled in activeLabelStyle directly
});

export default BottomNavBar; 
import React, { useState, useEffect, useCallback, ReactNode } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, ActivityIndicator, TextInput, Platform, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '@/utils/colors';
import { FONTS } from '@/utils/fonts';
import { Trash2, Search, X, Filter, ChevronUp, ChevronDown, Square, CheckSquare, Layers } from 'lucide-react-native';
import { getCollection, removeFromCollection, RockItem } from '@/utils/storage';
import { AppHeader } from '@/components/AppHeader';
import Animated, { FadeIn, Layout, SlideInUp } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import Slider from '@react-native-community/slider';
import BottomNavBar from '@/components/BottomNavBar';

// Define possible filter categories
// Keep track of rock types separately for array state
const rockTypeCategories = ['Igneous', 'Sedimentary', 'Metamorphic', 'Mineral'] as const;
type RockTypeCategory = typeof rockTypeCategories[number];
// General filters (Luster etc.) still use string
type GeneralFilterCategory = 'color'; // Or maybe none left? Revisit if needed

// Define Luster Categories with descriptions
const lusterDetails = [
  { name: 'Metallic', description: 'Looks shiny like metal (Pyrite, Galena)' },
  { name: 'Vitreous', description: 'Glassy, like broken glass (Quartz)' },
  { name: 'Pearly', description: 'Iridescent, like a pearl (Talc)' },
  { name: 'Silky', description: 'Soft sheen, like silk threads (Satin spar gypsum)' },
  { name: 'Resinous', description: 'Like resin or plastic (Amber)' },
  { name: 'Greasy', description: 'Looks oily or slippery (Nepheline)' },
  { name: 'Waxy', description: 'Like wax (Opal)' },
  { name: 'Dull', description: 'Earthy, no shine (Kaolinite)' },
  { name: 'Adamantine', description: 'Brilliant, diamond-like (Diamond)' }
] as const;
// Type for the name only, used for state
type LusterName = typeof lusterDetails[number]['name'];
// Extract just the names for easier iteration if needed elsewhere
const lusterNames = lusterDetails.map(l => l.name);

// Helper component for expandable filter sections
interface FilterSectionProps {
  title: string;
  children: ReactNode;
  isOpen: boolean;
  onToggle: () => void;
}

const FilterSection: React.FC<FilterSectionProps> = ({ title, children, isOpen, onToggle }) => (
  <View style={styles.filterSectionContainer}>
    <TouchableOpacity onPress={onToggle} style={styles.filterSectionHeader} activeOpacity={0.7}>
      <Text style={styles.filterSectionTitle}>{title}</Text>
      {isOpen ? 
        <ChevronUp size={20} color={COLORS.neutral[500]} /> : 
        <ChevronDown size={20} color={COLORS.neutral[500]} />
      }
    </TouchableOpacity>
    {isOpen && (
      <Animated.View entering={FadeIn.duration(200)} layout={Layout.springify()}>
        {children}
      </Animated.View>
    )}
  </View>
);

export default function CollectionScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [rocks, setRocks] = useState<RockItem[]>([]);
  const [filteredRocks, setFilteredRocks] = useState<RockItem[]>([]);
  const [loadingRocks, setLoadingRocks] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRockTypes, setSelectedRockTypes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedLusters, setSelectedLusters] = useState<string[]>([]);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [activeFilters, setActiveFilters] = useState<any>({});
  const [hardnessFilter, setHardnessFilter] = useState(10);
  const [showRockTypeOptions, setShowRockTypeOptions] = useState(true);
  const [showColorOptions, setShowColorOptions] = useState(false);
  const [showLusterOptions, setShowLusterOptions] = useState(false);
  const [showHardnessOptions, setShowHardnessOptions] = useState(false);
  const [tempSelectedRockTypes, setTempSelectedRockTypes] = useState<string[]>([]);
  const [tempSelectedLusters, setTempSelectedLusters] = useState<string[]>([]);
  const [tempHardnessFilter, setTempHardnessFilter] = useState(10);

  useEffect(() => {
    const loadCollection = async () => {
      setLoadingRocks(true);
      const collection = await getCollection();
      setRocks(collection);
      setFilteredRocks(collection);
      setLoadingRocks(false);
    };
    loadCollection();
  }, []);

  useEffect(() => {
    let currentFiltered = [...rocks];
    if (searchQuery) {
      currentFiltered = currentFiltered.filter(rock => 
        rock.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rock.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rock.notes?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rock.location?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    setFilteredRocks(currentFiltered);
  }, [searchQuery, rocks, activeFilters]);

  // Function to apply filters
  const applyFilters = useCallback(() => {
    let currentFiltered = [...rocks];

    // Apply search query first
    if (searchQuery) {
      currentFiltered = currentFiltered.filter(rock => 
        rock.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (rock.description && rock.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (rock.notes && rock.notes.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (rock.location && rock.location.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Apply active filters (rock type, luster, hardness)
    if (selectedRockTypes.length > 0) {
       currentFiltered = currentFiltered.filter(rock => 
         rock.classification && selectedRockTypes.includes(rock.classification)
       );
    }
     if (selectedLusters.length > 0) {
       currentFiltered = currentFiltered.filter(rock => {
         if (!rock.physicalProperties?.luster) return false;
         const rockLusters = rock.physicalProperties.luster.split(/[,\s]+/).map((l: string) => l.trim().toLowerCase());
         return rockLusters.some((luster: string) => selectedLusters.map(sl => sl.toLowerCase()).includes(luster));
       });
     }
    // Apply hardness filter (check if rock hardness is <= the filter value)
    if (hardnessFilter < 10) { // Only filter if slider is not at max
       currentFiltered = currentFiltered.filter(rock => {
         const hardnessValue = parseFloat(rock.physicalProperties?.hardness?.split('-')[0] || '11'); // Take lower bound or default > 10
         return !isNaN(hardnessValue) && hardnessValue <= hardnessFilter;
       });
     }

    setFilteredRocks(currentFiltered);
  }, [rocks, searchQuery, selectedRockTypes, selectedLusters, hardnessFilter]);

  // useEffect to run filtering logic whenever dependencies change
  useEffect(() => {
    applyFilters();
  }, [applyFilters]); // Dependency array now includes the memoized applyFilters

  // Handlers for temporary filter state changes
  const handleRockTypeToggle = (type: string) => {
    setTempSelectedRockTypes(prev => 
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const handleLusterToggle = (luster: string) => {
    setTempSelectedLusters(prev =>
      prev.includes(luster) ? prev.filter(l => l !== luster) : [...prev, luster]
    );
  };
  
  // Apply temporary filters to actual filters and close modal
  const confirmFilters = () => {
    setSelectedRockTypes(tempSelectedRockTypes);
    setSelectedLusters(tempSelectedLusters);
    setHardnessFilter(tempHardnessFilter);
    setShowFilterModal(false);
    // applyFilters will run via useEffect due to state changes
  };

  // Clear temporary filters
   const clearTemporaryFilters = () => {
     setTempSelectedRockTypes([]);
     setTempSelectedLusters([]);
     setTempHardnessFilter(10);
   };

  // Reset all filters and close modal
  const clearAllFilters = () => {
    setTempSelectedRockTypes([]);
    setTempSelectedLusters([]);
    setTempHardnessFilter(10);
    setSelectedRockTypes([]);
    setSelectedLusters([]);
    setHardnessFilter(10);
    setSearchQuery(''); // Also clear search
    setShowFilterModal(false);
     // applyFilters will run via useEffect due to state changes
  };

  // Sync temp state when modal opens
   useEffect(() => {
     if (showFilterModal) {
       setTempSelectedRockTypes(selectedRockTypes);
       setTempSelectedLusters(selectedLusters);
       setTempHardnessFilter(hardnessFilter);
     }
   }, [showFilterModal]);

  const renderRockItem = ({ item }: { item: RockItem }) => (
    <TouchableOpacity 
      style={styles.rockItemCard}
      onPress={() => router.push(`/rock/${item.id}` as any)}
    >
      <Image source={{ uri: item.imageUri }} style={styles.rockItemImage} />
      <View style={styles.rockItemInfo}>
        <Text style={styles.rockItemName}>{item.name}</Text>
        <Text style={styles.rockItemDate}>{new Date(item.date).toLocaleDateString()}</Text>
        <Text style={styles.rockItemDescription} numberOfLines={2}>
          {item.description || 'No description available.'}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.outerContainer}>
      <AppHeader 
        title="My Collection" 
      />
      
      <View style={styles.contentWrapper}>
        <View style={styles.searchRowContainer}> 
          <Search size={20} color={COLORS.neutral[500]} style={styles.searchIcon} />
          <TextInput
            placeholder="Search collection..."
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={COLORS.neutral[400]}
          />
          <TouchableOpacity onPress={() => setShowFilterModal(prev => !prev)} style={styles.filterIconContainer}>
            <Filter size={24} color={showFilterModal ? COLORS.accent[500] : COLORS.primary[700]} />
          </TouchableOpacity>
        </View>

        {showFilterModal && (
          <Animated.View style={styles.filterDropdown} entering={SlideInUp.duration(250)} layout={Layout.springify()}>
            <ScrollView style={styles.filterDropdownScrollView}>
              <FilterSection 
                title="Rock Type" 
                isOpen={showRockTypeOptions} 
                onToggle={() => setShowRockTypeOptions(!showRockTypeOptions)}
              >
                {rockTypeCategories.map(type => (
                  <TouchableOpacity 
                    key={type} 
                    style={styles.checkboxRow} 
                    onPress={() => handleRockTypeToggle(type)}
                  >
                    {tempSelectedRockTypes.includes(type) ? 
                      <CheckSquare size={20} color={COLORS.primary[600]} /> : 
                      <Square size={20} color={COLORS.neutral[400]} />
                    }
                    <Text style={styles.checkboxLabel}>{type}</Text>
                  </TouchableOpacity>
                ))}
              </FilterSection>

              <FilterSection 
                title="Luster" 
                isOpen={showLusterOptions} 
                onToggle={() => setShowLusterOptions(!showLusterOptions)}
              >
                {lusterDetails.map(luster => (
                  <TouchableOpacity 
                    key={luster.name} 
                    style={styles.checkboxRow} 
                    onPress={() => handleLusterToggle(luster.name)}
                  >
                    {tempSelectedLusters.includes(luster.name) ? 
                      <CheckSquare size={20} color={COLORS.primary[600]} /> : 
                      <Square size={20} color={COLORS.neutral[400]} />
                    }
                    <View style={{ marginLeft: 10, flexShrink: 1 }}>
                      <Text style={styles.checkboxLabel}>{luster.name}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </FilterSection>

              <FilterSection 
                title="Hardness (Mohs Scale)" 
                isOpen={showHardnessOptions} 
                onToggle={() => setShowHardnessOptions(!showHardnessOptions)}
              >
                <View style={styles.sliderContainer}>
                  <Text style={styles.sliderLabel}>Max Hardness: {tempHardnessFilter.toFixed(1)}</Text>
                  <Slider
                    style={{ width: '100%', height: 40 }}
                    minimumValue={1}
                    maximumValue={10}
                    step={0.5}
                    value={tempHardnessFilter}
                    onValueChange={setTempHardnessFilter}
                    minimumTrackTintColor={COLORS.primary[600]}
                    maximumTrackTintColor={COLORS.neutral[300]}
                    thumbTintColor={COLORS.primary[700]}
                  />
                  <View style={styles.sliderEndpoints}>
                    <Text style={styles.sliderEndpointText}>1 (Soft)</Text>
                    <Text style={styles.sliderEndpointText}>10 (Hard)</Text>
                  </View>
                </View>
              </FilterSection>
            </ScrollView>
            <View style={styles.filterDropdownFooter}>
                <TouchableOpacity style={styles.clearButton} onPress={clearAllFilters}> 
                  <Text style={styles.clearButtonText}>Reset All</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.applyButton} onPress={confirmFilters}>
                  <Text style={styles.applyButtonText}>Apply Filters</Text>
                </TouchableOpacity>
              </View>
          </Animated.View>
        )}

        {loadingRocks ? (
          <ActivityIndicator size="large" color={COLORS.primary[600]} style={{ flex: 1, marginTop: 20 }} />
        ) : filteredRocks.length === 0 ? (
          <View style={styles.emptyStateContainer}>
            <Layers size={60} color={COLORS.neutral[300]} />
            <Text style={styles.emptyStateText}>
              {searchQuery || selectedRockTypes.length > 0 || selectedLusters.length > 0 || hardnessFilter < 10 
                ? "No rocks match your search/filters." 
                : "Your collection is empty."}
            </Text>
            {searchQuery === '' && selectedRockTypes.length === 0 && selectedLusters.length === 0 && hardnessFilter === 10 && (
                 <Text style={styles.emptyStateSubText}>Start identifying rocks to add them here!</Text>
            )}
          </View>
        ) : (
          <FlatList
            data={filteredRocks}
            renderItem={renderRockItem}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.itemsContainer}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
      
      <BottomNavBar activeTab="collection" />
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
    position: 'relative',
  },
  searchRowContainer: { 
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 12 : 8,
    marginHorizontal: 16,
    marginTop: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    ...FONTS.body,
    color: COLORS.neutral[800],
    height: '100%',
  },
  filterIconContainer: {
    paddingLeft: 10,
  },
  itemsContainer: {
    paddingHorizontal: 16,
    paddingTop: 5,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyStateText: {
    ...FONTS.h3,
    color: COLORS.neutral[500],
    marginTop: 16,
    textAlign: 'center',
  },
  emptyStateSubText: {
    ...FONTS.body,
    color: COLORS.neutral[400],
    marginTop: 8,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  rockItemCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: 'row',
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  rockItemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 10,
  },
  rockItemInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  rockItemName: {
    ...FONTS.h4,
    color: COLORS.neutral[800],
    marginBottom: 4,
  },
  rockItemDate: {
    ...FONTS.caption,
    color: COLORS.neutral[500],
    marginBottom: 4,
  },
  rockItemDescription: {
    ...FONTS.bodySmall,
    color: COLORS.neutral[600],
  },
  filterDropdown: {
    position: 'absolute',
    top: 55,
    right: 16,
    width: 300,
    maxHeight: 400,
    backgroundColor: 'white',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 8,
    zIndex: 10,
    overflow: 'hidden',
  },
  filterDropdownScrollView: {
     flexShrink: 1,
     padding: 15,
  },
  filterDropdownFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: COLORS.neutral[100],
    backgroundColor: COLORS.neutral[50],
  },
   filterSectionContainer: {
     marginBottom: 15,
   },
   filterSectionHeader: {
     flexDirection: 'row',
     justifyContent: 'space-between',
     alignItems: 'center',
     paddingVertical: 5,
   },
   filterSectionTitle: {
     ...FONTS.h4,
     color: COLORS.neutral[700],
   },
   checkboxRow: {
     flexDirection: 'row',
     alignItems: 'center',
     paddingVertical: 8,
     marginLeft: 10,
   },
   checkboxLabel: {
     ...FONTS.body,
     color: COLORS.neutral[700],
     marginLeft: 10,
   },
   sliderContainer: {
      paddingHorizontal: 0,
      paddingVertical: 15,
   },
   sliderLabel: {
      ...FONTS.bodySmall,
      color: COLORS.neutral[600],
      textAlign: 'center',
      marginBottom: 10,
   },
   sliderEndpoints: {
     flexDirection: 'row',
     justifyContent: 'space-between',
     marginTop: 5,
   },
   sliderEndpointText: {
      ...FONTS.caption,
      color: COLORS.neutral[500],
   },
   clearButton: {
     paddingVertical: 8,
     paddingHorizontal: 15,
     borderRadius: 6,
     backgroundColor: COLORS.neutral[100],
   },
   clearButtonText: {
     ...(FONTS.button || { fontFamily: 'System', fontSize: 14, fontWeight: '500' }), 
     color: COLORS.neutral[600],
   },
   applyButton: {
     paddingVertical: 8,
     paddingHorizontal: 15,
     borderRadius: 6,
     backgroundColor: COLORS.primary[600],
   },
   applyButtonText: {
      ...(FONTS.button || { fontFamily: 'System', fontSize: 14, fontWeight: '500' }), 
      color: 'white',
   },
});
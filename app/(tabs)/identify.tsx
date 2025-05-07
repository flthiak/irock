import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, ActivityIndicator, Image, ScrollView, Modal, TextInput } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams, Stack } from 'expo-router';
import { Camera as CameraIcon, Upload, X, ArrowLeft, Save, FileText, Aperture, ScanLine } from 'lucide-react-native';
import { COLORS } from '@/utils/colors';
import { FONTS } from '@/utils/fonts';
import * as ImagePicker from 'expo-image-picker';
import { CameraComponent } from '@/components/CameraComponent';
import { AppHeader } from '@/components/AppHeader';
import { identifyRock } from '@/services/geminiService';
import { BlurView } from 'expo-blur';
import Animated, { FadeIn, FadeOut, SlideInUp, SlideOutDown } from 'react-native-reanimated';
import { saveToCollection } from '@/utils/storage';
import { CircularProgress } from 'react-native-circular-progress';
import * as Print from 'expo-print';
import { shareAsync } from 'expo-sharing';
import * as Location from 'expo-location';
import BottomNavBar from '@/components/BottomNavBar';

export default function IdentifyScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ imageUris?: string; startMode?: string }>();
  const insets = useSafeAreaInsets();
  const [showCamera, setShowCamera] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [isSaveModalVisible, setIsSaveModalVisible] = useState(false);
  const [notes, setNotes] = useState('');
  const [locationFound, setLocationFound] = useState('');
  
  useEffect(() => {
    if (params.imageUris) {
      try {
        const uris = JSON.parse(params.imageUris);
        if (uris && uris.length > 0) {
            setImages(uris);
            if (params.startMode === 'single' || params.startMode === 'multi') {
                analyzeImages(uris);
            }
        } else if (params.startMode === 'camera') {
            setShowCamera(true);
        }
      } catch (e) {
        console.error("Error processing navigation params:", e);
      }
    }
  }, [params.imageUris, params.startMode]);
  
  const pickImage = async (allowMultiple: boolean) => {
    try {
      const resultPicker = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: allowMultiple,
        quality: 1,
      });

      if (!resultPicker.canceled && resultPicker.assets && resultPicker.assets.length > 0) {
        const newUris = resultPicker.assets.map(asset => asset.uri);
        if (allowMultiple) {
            setImages(prevImages => [...prevImages, ...newUris]);
        } else {
            setImages(newUris);
            analyzeImages(newUris);
        }
      }
    } catch (error) {
      console.error('Error picking image:', error);
    }
  };

  const handleCameraCapture = (uri: string) => {
    setShowCamera(false);
    setImages([uri]);
    analyzeImages([uri]);
  };

  const analyzeImages = async (urisToAnalyze: string[]) => {
    if (!urisToAnalyze || urisToAnalyze.length === 0) return;
    setLoading(true);
    setResult(null);
    try {
      const response = await identifyRock(urisToAnalyze);
      setResult(response);
    } catch (error) {
      console.error('Error identifying rock:', error);
      setResult({
        name: 'Identification Failed',
        description: 'Unable to identify this rock. Please check the images or try again.',
        error: true
      });
    }
    setLoading(false);
  };

  const resetIdentification = () => {
    setImages([]);
    setResult(null);
    setNotes('');
    setLocationFound('');
  };

  const openSaveModal = async () => {
    if (result && images.length > 0) { 
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission to access location was denied. Please enter location manually.');
        setIsSaveModalVisible(true);
        return;
      }
      try {
        setLoading(true);
        let locationData = await Location.getCurrentPositionAsync({});
        let address = await Location.reverseGeocodeAsync({
          latitude: locationData.coords.latitude,
          longitude: locationData.coords.longitude,
        });
        let locationString = 'Current Location';
        if (address && address.length > 0) {
          const adr = address[0];
          locationString = [adr.city, adr.region, adr.country].filter(Boolean).join(', ');
        }
        setLocationFound(locationString);
      } catch (error) {
        console.error("Error fetching location: ", error);
        alert("Could not fetch location. Please enter manually.");
      } finally {
        setLoading(false);
        setIsSaveModalVisible(true);
      }
    }
  };

  const confirmSaveToCollection = async () => {
    if (result && images.length > 0) { 
      await saveToCollection({
        id: Date.now().toString(),
        name: result.commonName || result.name || 'Unknown Rock',
        description: result.description,
        imageUri: images[0],
        properties: result.properties || [],
        classification: result.classification,
        physicalProperties: result.physicalProperties,
        date: new Date().toISOString(),
        notes: notes,
        location: locationFound,
      });
      alert('Rock saved to your collection!');
      setIsSaveModalVisible(false);
      setNotes('');
      setLocationFound('');
    }
  };

  const handleSaveAsPdf = async () => {
    if (!result) return;
    const generateHtml = () => {
      const safeResult = result || {};
      const physicalProps = safeResult.physicalProperties || {};
      let physicalPropertiesHtml = '';
      if (Object.keys(physicalProps).length > 0) {
          physicalPropertiesHtml = Object.entries(physicalProps)
            .map(([key, value]) => {
              const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
              return `<p><strong>${label}:</strong> ${String(value ?? 'N/A')}</p>`;
            })
            .join('');
      }
      return `
        <html>
          <head>
            <style>
              body { font-family: sans-serif; padding: 20px; }
              h1 { color: #333; }
              h2 { color: #555; margin-top: 20px; border-bottom: 1px solid #eee; padding-bottom: 5px; }
              p { margin: 5px 0; line-height: 1.4; }
              strong { color: #444; }
            </style>
          </head>
          <body>
            <h1>${String(safeResult.commonName || safeResult.name || 'Unknown Rock')}</h1>
            ${safeResult.scientificName ? `<p><em>(${String(safeResult.scientificName)})</em></p>` : ''}
            ${typeof safeResult.confidenceLevel === 'number' ? `<p>Confidence: ${safeResult.confidenceLevel}%</p>` : ''}
            ${safeResult.classification ? `<p><strong>Classification:</strong> ${String(safeResult.classification)}</p>` : ''}
            <h2>Description</h2>
            <p>${String(safeResult.description || 'N/A')}</p>
            ${physicalPropertiesHtml ? `<h2>Physical Properties</h2>${physicalPropertiesHtml}` : ''}
            ${safeResult.formationProcess ? `<h2>Formation Process</h2><p>${String(safeResult.formationProcess)}</p>` : ''}
            ${safeResult.commonLocations ? `<h2>Common Locations</h2><p>${String(safeResult.commonLocations)}</p>` : ''}
            ${safeResult.collectingValue ? `<h2>Collecting Value</h2><p>${String(safeResult.collectingValue)}</p>` : ''}
            ${safeResult.funFacts ? `<h2>Fun Facts</h2><p>${String(safeResult.funFacts)}</p>` : ''}
            ${safeResult.notes ? `<h2>Notes</h2><p>${String(safeResult.notes)}</p>` : ''}
            ${safeResult.location ? `<h2>Location Found</h2><p>${String(safeResult.location)}</p>` : ''}
          </body>
        </html>
      `;
    };
    try {
      const htmlContent = generateHtml();
      console.log("--- Generated HTML for PDF ---");
      console.log(htmlContent);
      console.log("------------------------------");
      const { uri } = await Print.printToFileAsync({ html: htmlContent });
      console.log('File has been saved to:', uri);
      await shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
    } catch (error) {
      console.error("Error generating or sharing PDF: ", error);
      alert("Failed to generate PDF. Please check the console for more details.");
    }
  };

  if (showCamera) {
    return <CameraComponent onCapture={handleCameraCapture} onClose={() => setShowCamera(false)} />;
  }

  return (
    <View style={styles.outerContainer}>
      <Stack.Screen options={{ title: 'Identify Rock' }} />
      <AppHeader title="Identify Rock" />
      
      <View style={styles.contentWrapper}>
        {loading ? (
          <View style={styles.loadingContainerFull}>
            {images.length > 0 && (
              <View style={styles.imageContainerLoading}>
                <Image source={{ uri: images[0] }} style={styles.previewImage} />
              </View>
            )}
            <ActivityIndicator size="large" color={COLORS.primary[600]} />
            <Text style={styles.loadingText}>Analyzing rock...</Text>
          </View>
        ) : result ? (
          <ScrollView style={styles.resultsContainer} contentContainerStyle={styles.resultsContent}>
            <View style={styles.imageContainer}>
              <Image source={{ uri: images[0] }} style={styles.previewImage} />
            </View>
            
              <Animated.View 
                style={styles.resultCard}
                entering={SlideInUp.duration(500)}
              >
              <View style={styles.resultHeader}>
                <Text style={styles.rockName}>{result.commonName} ({result.scientificName})</Text>
                <CircularProgress
                  size={50}
                  width={5}
                  fill={result.confidenceLevel}
                  tintColor={COLORS.accent[600]}
                  backgroundColor={COLORS.neutral[200]}
                >
                  {
                    (fill) => (
                      <Text style={styles.confidenceLevel}>
                        {`${Math.round(fill)}%`}
                      </Text>
                    )
                  }
                </CircularProgress>
              </View>
                
                {result.error ? (
                  <Text style={styles.errorText}>{result.description}</Text>
                ) : (
                  <>
                    <Text style={styles.rockDescription}>{result.description}</Text>
                  <Text style={styles.classification}>Classification: {result.classification}</Text>
                  
                  <View style={styles.columnsContainer}>
                    <View style={styles.column}>
                      <Text style={styles.propertiesTitle}>Physical Properties</Text>
                      <Text style={styles.propertyItem}><Text style={styles.propertyName}>Hardness:</Text> {result.physicalProperties.hardness}</Text>
                      <Text style={styles.propertyItem}><Text style={styles.propertyName}>Luster:</Text> {result.physicalProperties.luster}</Text>
                      <Text style={styles.propertyItem}><Text style={styles.propertyName}>Color Range:</Text> {result.physicalProperties.colorRange}</Text>
                      <Text style={styles.propertyItem}><Text style={styles.propertyName}>Streak Color:</Text> {result.physicalProperties.streakColor}</Text>
                      <Text style={styles.propertyItem}><Text style={styles.propertyName}>Cleavage/Fracture:</Text> {result.physicalProperties.cleavageFracture}</Text>
                      <Text style={styles.propertyItem}><Text style={styles.propertyName}>Crystal Structure:</Text> {result.physicalProperties.crystalStructure}</Text>
                    </View>

                    <View style={styles.column}>
                      <Text style={styles.infoTitle}>Additional Information</Text>
                      <Text style={styles.propertyItem}><Text style={styles.propertyName}>Formation Process:</Text> {result.formationProcess}</Text>
                      <Text style={styles.propertyItem}><Text style={styles.propertyName}>Common Locations:</Text> {result.commonLocations}</Text>
                      <Text style={styles.propertyItem}><Text style={styles.propertyName}>Collecting Value:</Text> {result.collectingValue}</Text>
                    </View>
                          </View>

                <View style={styles.funFactsCard}>
                  <Text style={styles.propertyName}>Fun Facts:</Text>
                  <Text>{result.funFacts}</Text>
                    </View>
                  
                <View style={styles.saveButtonsContainer}>
                  <TouchableOpacity 
                    style={[styles.buttonBase, styles.saveButton]}
                    onPress={openSaveModal} 
                  >
                    <Save color="white" size={20} />
                    <Text style={styles.saveButtonText}>Save to Collection</Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    style={[styles.buttonBase, styles.pdfButton]}
                    onPress={handleSaveAsPdf} 
                  >
                    <FileText color={COLORS.primary[700]} size={20} />
                    <Text style={styles.pdfButtonText}>Save as PDF</Text>
                  </TouchableOpacity>
                </View>
                </>
              )}
            </Animated.View>
          <TouchableOpacity onPress={resetIdentification} style={styles.resetButtonResults}>
             <Text style={styles.resetButtonText}>Identify Another</Text>
          </TouchableOpacity>
        </ScrollView>
        ) : images.length > 0 ? (
          <View style={styles.imageSelectionContainer}>
            <Text style={styles.title}>Review or Add More Views</Text>
            <ScrollView horizontal style={styles.thumbnailsContainer}>
              {images.map((uri, index) => (
                <View key={index} style={styles.thumbnailWrapper}>
                    <Image source={{ uri }} style={styles.thumbnail} />
                    <TouchableOpacity onPress={() => setImages(imgs => imgs.filter((_, i) => i !== index))} style={styles.removeImageButton}>
                        <X size={16} color="white" />
                    </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
            <View style={styles.actionButtonsContainer}>
              <TouchableOpacity style={styles.actionButton} onPress={() => setShowCamera(true)}>
                <CameraIcon color={COLORS.primary[700]} size={20} />
                <Text style={styles.actionButtonText}>Add Camera View</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton} onPress={() => pickImage(false)}>
                <Upload color={COLORS.primary[700]} size={20} />
                <Text style={styles.actionButtonText}>Add Gallery View</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity 
              style={[styles.analyzeButton, { opacity: loading ? 0.5 : 1 }]} 
              onPress={() => analyzeImages(images)} 
              disabled={loading || images.length === 0}
            >
              <Text style={styles.analyzeButtonText}>Analyze {images.length} Image(s)</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={resetIdentification} style={styles.resetButtonAlt}>
               <Text style={styles.resetButtonText}>Start Over</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.initialOptionsContainer}>
            <Text style={styles.title}>How would you like to identify a rock?</Text>
            <View style={styles.homeButtonRow}>
                <TouchableOpacity 
                    style={[styles.homeActionButton, {backgroundColor: COLORS.primary[100]}]} 
                    onPress={() => setShowCamera(true)}
                >
                    <CameraIcon size={30} color={COLORS.primary[700]} />
                    <Text style={styles.homeActionButtonText}>Take Photo</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={[styles.homeActionButton, {backgroundColor: COLORS.accent[100]}]} 
                    onPress={() => pickImage(false)}
                >
                    <Aperture size={30} color={COLORS.accent[700]} />
                    <Text style={styles.homeActionButtonText}>Single Photo</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={[styles.homeActionButton, {backgroundColor: COLORS.secondary[100]}]} 
                    onPress={() => pickImage(true)}
                >
                    <ScanLine size={30} color={COLORS.secondary[700]} />
                    <Text style={styles.homeActionButtonText}>Multiple Angles</Text>
                </TouchableOpacity>
            </View>
            <Text style={styles.tipsText}>
                Tip: For best results, use clear images from multiple angles if possible.
            </Text>
          </View>
        )}
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isSaveModalVisible}
        onRequestClose={() => {
          setIsSaveModalVisible(!isSaveModalVisible);
        }}
      >
        <View style={styles.modalCenteredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Save to Collection</Text>
            
            <Text style={styles.inputLabel}>Notes:</Text>
            <TextInput
              style={styles.input}
              onChangeText={setNotes}
              value={notes}
              placeholder="Enter notes about this rock..."
              multiline
            />

            <Text style={styles.inputLabel}>Location Found:</Text>
            <TextInput
              style={styles.input}
              onChangeText={setLocationFound}
              value={locationFound}
              placeholder="Where did you find this rock?"
            />

            <View style={styles.modalButtonsContainer}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]} 
                onPress={() => setIsSaveModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.confirmButton]} 
                onPress={confirmSaveToCollection}
              >
                <Text style={styles.modalButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <BottomNavBar activeTab="identify" />
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
  container: {
    flex: 1,
    backgroundColor: COLORS.neutral[50],
  },
  optionsContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
    alignItems: 'center',
  },
  title: {
    ...FONTS.h2,
    color: COLORS.neutral[800],
    marginBottom: 30,
    textAlign: 'center',
  },
  subtitle: {
    ...FONTS.body,
    color: COLORS.neutral[600],
    marginBottom: 40,
    textAlign: 'center',
    paddingHorizontal: 24,
  },
  buttons: {
    width: '100%',
    flexDirection: 'column',
    marginBottom: 40,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cameraButton: {
    backgroundColor: COLORS.primary[600],
  },
  uploadButton: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: COLORS.neutral[200],
  },
  uploadButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  halfWidthButton: {
    width: '48%',
  },
  buttonText: {
    ...FONTS.button,
    color: 'white',
    textAlign: 'center',
  },
  uploadButtonText: {
    color: COLORS.primary[700],
  },
  tipsContainer: {
    width: '100%',
    backgroundColor: COLORS.neutral[100],
    padding: 20,
    borderRadius: 12,
  },
  tipsTitle: {
    ...FONTS.h4,
    color: COLORS.neutral[800],
    marginBottom: 12,
  },
  tipItem: {
    ...FONTS.bodySmall,
    color: COLORS.neutral[700],
    marginBottom: 8,
  },
  resultsContainer: {
    flex: 1,
  },
  resultsContent: {
    paddingBottom: 20,
  },
  imageContainer: {
    width: '100%',
    height: 250,
    backgroundColor: COLORS.neutral[200],
    paddingTop: 2,

  },
  previewImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  loadingContainerFull: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: COLORS.neutral[50],
  },
  imageContainerLoading: {
    width: '80%',
    height: 200,
    backgroundColor: COLORS.neutral[200],
    marginBottom: 30,
    borderRadius: 12,
    overflow: 'hidden',
  },
  loadingText: {
    ...FONTS.body,
    color: COLORS.neutral[700],
    marginTop: 16,
  },
  resultCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    marginHorizontal: 16,
    marginTop: 10,
    paddingHorizontal: 20,
    paddingVertical: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  rockName: {
    ...FONTS.h2,
    color: COLORS.neutral[800],
    marginBottom: 12,
  },
  rockDescription: {
    ...FONTS.body,
    color: COLORS.neutral[700],
    lineHeight: 24,
    marginBottom: 20,
  },
  errorText: {
    ...FONTS.body,
    color: COLORS.error[700],
    marginBottom: 20,
  },
  columnsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  column: {
    flex: 1,
    paddingHorizontal: 8,
  },
  propertyItem: {
    marginBottom: 8,
  },
  propertiesTitle: {
    ...FONTS.h4,
    color: COLORS.neutral[800],
    marginBottom: 12,
  },
  infoTitle: {
    ...FONTS.h4,
    color: COLORS.neutral[800],
    marginBottom: 12,
  },
  propertyName: {
    ...FONTS.bold,
    color: COLORS.neutral[700],
  },
  confidenceLevel: {
    ...FONTS.body,
    color: COLORS.neutral[600],
  },
  classification: {
    ...FONTS.body,
    color: COLORS.neutral[700],
    marginBottom: 12,
  },
  saveButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 24,
  },
  buttonBase: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  saveButton: {
    backgroundColor: COLORS.accent[600],
  },
  pdfButton: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: COLORS.neutral[200],
  },
  saveButtonText: {
    ...FONTS.button,
    color: 'white',
    marginLeft: 8,
  },
  pdfButtonText: {
    ...FONTS.button,
    color: COLORS.primary[700],
    marginLeft: 8,
  },
  funFactsCard: {
    backgroundColor: '#FFFFE0',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  imageSelectionContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  thumbnailsContainer: {
    marginBottom: 20,
    maxHeight: 100,
  },
  thumbnailWrapper: {
    position: 'relative',
    marginRight: 10,
  },
  thumbnail: {
    width: 80,
    height: 80,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.neutral[300],
  },
  removeImageButton: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 12,
    padding: 3,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  actionButton: {
    alignItems: 'center',
    padding: 10,
  },
  actionButtonText: {
    ...FONTS.caption,
    color: COLORS.primary[700],
    marginTop: 4,
  },
  analyzeButton: {
    backgroundColor: COLORS.primary[600],
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 10,
  },
  analyzeButtonText: {
    ...FONTS.button,
    color: 'white',
  },
  resetButton: {
    paddingVertical: 10,
    alignItems: 'center',
  },
  resetButtonAlt: {
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  resetButtonText: {
    ...FONTS.button,
    color: COLORS.neutral[600],
  },
  modalCenteredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '90%',
  },
  modalTitle: {
    ...FONTS.h3,
    marginBottom: 12,
    textAlign: 'center',
  },
  inputLabel: {
    ...FONTS.body,
    alignSelf: 'flex-start',
    marginBottom: 5,
    color: COLORS.neutral[700],
  },
  input: {
    width: '100%',
    minHeight: 50,
    maxHeight: 120,
    borderColor: COLORS.neutral[300],
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 10,
    paddingTop: 10,
    ...FONTS.body,
  },
  modalButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  modalButton: {
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
    elevation: 2,
    minWidth: 100,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: COLORS.neutral[200],
  },
  confirmButton: {
    backgroundColor: COLORS.primary[600],
  },
  modalButtonText: {
    ...FONTS.button,
    color: 'white',
  },
  initialOptionsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  homeButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 30,
  },
  homeActionButton: {
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 10,
    borderRadius: 12,
    width: '30%',
    minHeight: 110,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    borderWidth: 1,
    borderColor: COLORS.neutral[200],
  },
  homeActionButtonText: {
    fontFamily: FONTS.button?.fontFamily || FONTS.regular?.fontFamily || 'System',
    fontSize: 13,
    color: COLORS.neutral[800],
    marginTop: 10,
    textAlign: 'center',
  },
  tipsText: {
    ...FONTS.bodySmall,
    color: COLORS.neutral[600],
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  resetButtonResults: { marginTop: 20, paddingVertical: 10, alignItems: 'center' },
});
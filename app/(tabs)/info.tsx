import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '@/utils/colors';
import { ExternalLink, Mail, Code, Info as InfoIcon } from 'lucide-react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';

export default function InfoScreen() {
  const insets = useSafeAreaInsets();

  const openLink = (url: string) => {
    Linking.openURL(url);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Information</Text>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <Animated.View 
          style={styles.section}
          entering={FadeInUp.delay(100).duration(500)}
        >
          <Text style={styles.sectionTitle}>About the App</Text>
          <Text style={styles.text}>
            Rock Identifier is a powerful application that leverages AI technology to help
            you identify rocks and minerals through photos. Whether you're a geology enthusiast,
            student, or professional, this app provides detailed information about various
            rock types and their properties.
          </Text>
        </Animated.View>

        <Animated.View 
          style={styles.section}
          entering={FadeInUp.delay(200).duration(500)}
        >
          <Text style={styles.sectionTitle}>How It Works</Text>
          <View style={styles.infoCard}>
            <View style={styles.infoItem}>
              <Text style={styles.infoNumber}>1</Text>
              <Text style={styles.infoText}>
                Take a clear photo of the rock or upload an existing image
              </Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoNumber}>2</Text>
              <Text style={styles.infoText}>
                Our AI analyzes the visual characteristics of the rock
              </Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoNumber}>3</Text>
              <Text style={styles.infoText}>
                View detailed identification results and save to your collection
              </Text>
            </View>
          </View>
        </Animated.View>

        <Animated.View 
          style={styles.section}
          entering={FadeInUp.delay(300).duration(500)}
        >
          <Text style={styles.sectionTitle}>Tips for Accurate Identification</Text>
          <Text style={styles.text}>
            ⦿ Use good lighting to capture the rock's true color{'\n'}
            ⦿ Take multiple photos from different angles{'\n'}
            ⦿ Include a common object for scale{'\n'}
            ⦿ Clean the rock to remove dirt or debris{'\n'}
            ⦿ Capture any unique patterns or textures{'\n'}
            ⦿ For crystals, capture the crystal structure
          </Text>
        </Animated.View>

        <Animated.View 
          style={styles.section}
          entering={FadeInUp.delay(400).duration(500)}
        >
          <Text style={styles.sectionTitle}>Technology</Text>
          <Text style={styles.text}>
            This app uses Google's Gemini AI model, a powerful multimodal AI system capable
            of understanding and analyzing visual information. The app is built with React Native
            and Expo for cross-platform compatibility.
          </Text>
          <TouchableOpacity 
            style={styles.linkButton}
            onPress={() => openLink('https://ai.google/discover/gemini/')}
          >
            <Text style={styles.linkText}>Learn more about Gemini AI</Text>
            <ExternalLink size={16} color={COLORS.primary[600]} />
          </TouchableOpacity>
        </Animated.View>

        <Animated.View 
          style={[styles.section, styles.lastSection]}
          entering={FadeInUp.delay(500).duration(500)}
        >
          <Text style={styles.sectionTitle}>Contact & Support</Text>
          <TouchableOpacity 
            style={styles.contactButton}
            onPress={() => openLink('mailto:support@rockidentifier.app')}
          >
            <Mail size={20} color={COLORS.neutral[600]} />
            <Text style={styles.contactButtonText}>Contact Support</Text>
          </TouchableOpacity>
          
          <View style={styles.separator} />
          
          <View style={styles.footer}>
            <Text style={styles.copyright}>
              © 2025 Rock Identifier • Version 1.0.0
            </Text>
            <TouchableOpacity 
              style={styles.privacyLink}
              onPress={() => openLink('https://rockidentifier.app/privacy')}
            >
              <Text style={styles.privacyLinkText}>Privacy Policy</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.neutral[50],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.neutral[200],
  },
  headerTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: COLORS.neutral[800],
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 24,
    paddingBottom: 80,
  },
  section: {
    marginBottom: 32,
  },
  lastSection: {
    marginBottom: 0,
  },
  sectionTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: COLORS.neutral[800],
    marginBottom: 16,
  },
  text: {
    fontFamily: 'Inter-Regular',
    fontSize: 15,
    lineHeight: 24,
    color: COLORS.neutral[700],
  },
  infoCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  infoItem: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-start',
  },
  infoNumber: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: 'white',
    backgroundColor: COLORS.primary[600],
    width: 24,
    height: 24,
    borderRadius: 12,
    textAlign: 'center',
    lineHeight: 24,
    marginRight: 12,
  },
  infoText: {
    fontFamily: 'Inter-Regular',
    fontSize: 15,
    color: COLORS.neutral[700],
    flex: 1,
    lineHeight: 22,
  },
  linkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  linkText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: COLORS.primary[600],
    marginRight: 6,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.neutral[200],
    marginBottom: 24,
  },
  contactButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: COLORS.neutral[700],
    marginLeft: 12,
  },
  separator: {
    height: 1,
    backgroundColor: COLORS.neutral[200],
    marginBottom: 24,
  },
  footer: {
    alignItems: 'center',
  },
  copyright: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: COLORS.neutral[500],
    marginBottom: 8,
  },
  privacyLink: {
    padding: 4,
  },
  privacyLinkText: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: COLORS.primary[600],
  },
});
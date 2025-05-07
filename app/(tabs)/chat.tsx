import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { AppHeader } from '@/components/AppHeader';
import BottomNavBar from '@/components/BottomNavBar';
import { COLORS } from '@/utils/colors';
import { FONTS } from '@/utils/fonts';
import { SendHorizonal, MessageCircle } from 'lucide-react-native'; // Using SendHorizonal for send icon
import { getDrRockChatResponse } from '@/services/geminiService'; 

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'drRock';
  timestamp: Date;
}

const DR_ROCK_WELCOME_MESSAGE: Message = {
  id: 'welcome-msg',
  text: "Greetings, aspiring geologist! I'm Dr. Rock, your guide to the fascinating world beneath your feet. Ask me anything about rocks, minerals, or geological wonders!",
  sender: 'drRock',
  timestamp: new Date(),
};

const APP_HEADER_HEIGHT = 60; // Approximate header height for KAV offset

export default function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>([DR_ROCK_WELCOME_MESSAGE]);
  const [inputText, setInputText] = useState('');
  const [isDrRockTyping, setIsDrRockTyping] = useState(false);
  const flatListRef = useRef<FlatList<Message>>(null);

  const scrollToBottom = () => {
    flatListRef.current?.scrollToEnd({ animated: true });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateDrRockReply = useCallback(async (userMessageText: string) => {
    setIsDrRockTyping(true);
    
    const apiResponseText = await getDrRockChatResponse(userMessageText);

    setTimeout(() => {
      const drRockMessage: Message = {
        id: `drRock-${Date.now()}`,
        text: apiResponseText,
        sender: 'drRock',
        timestamp: new Date(),
      };
      setMessages(prevMessages => [...prevMessages, drRockMessage]);
      setIsDrRockTyping(false);
    }, 500);
  }, []);

  const handleSendMessage = () => {
    if (inputText.trim().length === 0) return;

    const newMessage: Message = {
      id: `user-${Date.now()}`,
      text: inputText.trim(),
      sender: 'user',
      timestamp: new Date(),
    };
    setMessages(prevMessages => [...prevMessages, newMessage]);
    generateDrRockReply(inputText.trim());
    setInputText('');
  };

  const renderMessageItem = ({ item }: { item: Message }) => {
    const isUserMessage = item.sender === 'user';
    return (
      <View 
        style={[
          styles.messageBubble,
          isUserMessage ? styles.userMessage : styles.drRockMessage
        ]}
      >
        {!isUserMessage && (
           <MessageCircle size={24} color={COLORS.primary[700]} style={styles.drRockIcon} />
        )}
        <View style={isUserMessage ? styles.userMessageContent : styles.drRockMessageContent}>
          <Text style={[styles.messageText, isUserMessage && { color: 'white' }]}>
            {item.text}
          </Text>
          <Text style={[styles.timestampText, isUserMessage && { color: COLORS.neutral[50] || '#FAFAFA' }]}>
            {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <AppHeader title="Chat with Dr. Rock" />
      <KeyboardAvoidingView 
        style={{ flex: 1 }} // KAV takes up the space between header and nav bar
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? APP_HEADER_HEIGHT : 0} 
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessageItem}
          keyExtractor={item => item.id}
          style={styles.flatListStyle} // Added style for flex: 1
          contentContainerStyle={styles.chatArea} // This will have small paddingBottom
          ListFooterComponent={isDrRockTyping ? 
              <View style={styles.typingIndicatorContainer}>
                  <MessageCircle size={18} color={COLORS.neutral[400]} style={{marginRight: 8}}/>
                  <Text style={styles.typingIndicatorText}>Dr. Rock is pondering...</Text>
                  <ActivityIndicator size="small" color={COLORS.neutral[400]} style={{marginLeft: 5}}/>
              </View> : null
          }
        />
        <View style={styles.inputArea}>
          <TextInput
            style={styles.textInput}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Ask Dr. Rock a question..."
            placeholderTextColor={COLORS.neutral[400]}
            multiline
          />
          <TouchableOpacity onPress={handleSendMessage} style={styles.sendButton} disabled={isDrRockTyping}>
            <SendHorizonal size={24} color={isDrRockTyping ? COLORS.neutral[300] : COLORS.primary[600]} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
      <BottomNavBar activeTab="chat" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.neutral[50] || 'white',
  },
  flatListStyle: { // New style for FlatList itself
    flex: 1,
  },
  chatArea: {
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 80, // Increased paddingBottom to clear BottomNavBar when keyboard is closed
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 10,
    borderRadius: 12,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: COLORS.primary[500],
  },
  drRockMessage: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.neutral[100],
  },
  drRockIcon: {
    marginRight: 8,
    marginBottom: 2, // Align with text baseline
  },
  userMessageContent: { flexShrink: 1 },
  drRockMessageContent: { flexShrink: 1 }, 
  messageText: {
    ...(FONTS.body || { fontFamily: 'System', fontSize: 15 }),
    color: COLORS.neutral[800],
  },
  timestampText: {
    ...(FONTS.caption || { fontFamily: 'System', fontSize: 10 }),
    color: COLORS.neutral[400],
    alignSelf: 'flex-end',
    marginTop: 5,
  },
  inputArea: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.neutral[200],
    backgroundColor: COLORS.neutral[50],
    paddingBottom: 60,
    // This paddingBottom is for the input area itself, for iOS home indicator with no keyboard
    // paddingBottom: Platform.OS === 'ios' ? 20 : 8, // Can be reinstated if needed
  },
  textInput: {
    flex: 1,
    minHeight: 40,
    maxHeight: 120,
    backgroundColor: 'white',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
    ...(FONTS.body || { fontFamily: 'System', fontSize: 16 }),
    color: COLORS.neutral[800],
    borderWidth: 1,
    borderColor: COLORS.neutral[200],
  },
  sendButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: COLORS.neutral[100],
  },
  typingIndicatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    alignSelf: 'flex-start',
  },
  typingIndicatorText: {
    ...(FONTS.italic || FONTS.bodySmall || {fontFamily: 'System', fontSize: 13, fontStyle: 'italic'}),
    color: COLORS.neutral[500],
    marginLeft: 0, // Icon provides left margin
  }
}); 
import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADIUS, SPACING } from '../theme/colors';
import ChatBubble from '../components/ChatBubble';
import QuickPromptChips from '../components/QuickPromptChips';
import { findBotResponse } from '../data/botKnowledge';

export default function ChatScreen({ savedRemedies, onToggleSave }) {
  const [messages, setMessages] = useState([
    {
      id: 'msg-welcome',
      sender: 'bot',
      text: 'Namaste! I am your Dadi Maa AI assistant 🌿.\n\nTell me what symptom or ailment you are experiencing today (e.g. Cough, Acidity, Sore Throat, Headache), or ask for a remedy with ingredients like Ginger, Lemon, Honey, Turmeric or Ajwain!',
      remedy: null,
      time: 'Just now',
    },
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const flatListRef = useRef(null);

  const handleSendMessage = (textToSend) => {
    const query = textToSend || inputQuery;

    if (!query.trim()) return;

    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query.trim(),
      time: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsTyping(true);

    setTimeout(() => {
      flatListRef.current?.scrollToEnd({
        animated: true,
      });
    }, 100);

    setTimeout(() => {
      const response = findBotResponse(query);

      const botMsg = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: response.text,
        remedy: response.remedy,
        time: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
      };

      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);

      setTimeout(() => {
        flatListRef.current?.scrollToEnd({
          animated: true,
        });
      }, 100);
    }, 900);
  };

  return (
    <View style={styles.container}>

      {/* FIXED TOP AREA */}
      <View style={styles.topArea}>
        <QuickPromptChips
          onSelectPrompt={(q) => handleSendMessage(q)}
        />
      </View>

      {/* CHAT AREA */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <ChatBubble
            message={item}
            isSaved={
              item.remedy
                ? savedRemedies.includes(item.remedy.id)
                : false
            }
            onToggleSave={onToggleSave}
          />
        )}
        contentContainerStyle={styles.listContent}
        style={styles.chatList}
        onContentSizeChange={() => {
          flatListRef.current?.scrollToEnd({
            animated: true,
          });
        }}
      />

      {/* TYPING INDICATOR */}
      {isTyping && (
        <View style={styles.typingContainer}>
          <View style={styles.typingBadge}>
            <ActivityIndicator
              size="small"
              color={COLORS.primary}
              style={{ marginRight: 6 }}
            />

            <Text style={styles.typingText}>
              Dadi Maa is preparing remedy advice...
            </Text>
          </View>
        </View>
      )}

      {/* ONLY INPUT MOVES WITH KEYBOARD */}
      {/* <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      > */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Ask Dadi Maa (e.g. Cough with ginger and lemon)..."
          placeholderTextColor={COLORS.textMuted}
          value={inputQuery}
          onChangeText={setInputQuery}
          onSubmitEditing={() => handleSendMessage()}
          returnKeyType="send"
          multiline={false}
        />

        <TouchableOpacity
          style={[
            styles.sendBtn,
            !inputQuery.trim() && styles.sendBtnDisabled,
          ]}
          onPress={() => handleSendMessage()}
          disabled={!inputQuery.trim()}
          activeOpacity={0.7}
        >
          <Ionicons
            name="send"
            size={18}
            color={COLORS.cardBg}
          />
        </TouchableOpacity>
      </View>
      {/* </KeyboardAvoidingView> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  /*
   * Quick prompts stay at the top.
   * They don't get pushed away by the keyboard.
   */
  topArea: {
    backgroundColor: COLORS.background,
  },

  /*
   * FlatList takes all remaining space.
   */
  chatList: {
    flex: 1,
  },

  listContent: {
    paddingVertical: SPACING.md,
    paddingBottom: SPACING.lg,
  },

  typingContainer: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.xs,
  },

  typingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: COLORS.primarySoft,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs + 2,
    borderRadius: RADIUS.full,
  },

  typingText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.primary,
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm + 2,
    backgroundColor: COLORS.cardBg,
    borderTopWidth: 1,
    borderTopColor: COLORS.cardBorder,
  },

  input: {
    flex: 1,
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm + 2,
    fontSize: 14,
    color: COLORS.textPrimary,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    marginRight: SPACING.sm,
  },

  sendBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },

  sendBtnDisabled: {
    backgroundColor: COLORS.textMuted,
  },
});
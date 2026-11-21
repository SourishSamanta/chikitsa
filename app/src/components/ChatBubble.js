import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADIUS, SPACING } from '../theme/colors';
import RemedyCard from './RemedyCard';

export default function ChatBubble({ message, isSaved, onToggleSave }) {
  const isUser = message.sender === 'user';

  if (isUser) {
    return (
      <View style={styles.userWrapper}>
        <View style={styles.userBubble}>
          <Text style={styles.userText}>{message.text}</Text>
        </View>
        <Text style={styles.timestamp}>{message.time}</Text>
      </View>
    );
  }

  return (
    <View style={styles.botWrapper}>
      <View style={styles.avatarContainer}>
        <View style={styles.avatar}>
          <Ionicons name="leaf" size={16} color={COLORS.cardBg} />
        </View>
        <Text style={styles.botName}>Dadi Maa AI</Text>
      </View>

      <View style={styles.botBubble}>
        <Text style={styles.botText}>{message.text}</Text>
        
        {message.remedy ? (
          <View style={styles.remedyWrapper}>
            <RemedyCard 
              remedy={message.remedy} 
              isSaved={isSaved} 
              onToggleSave={onToggleSave}
              compact={false}
            />
          </View>
        ) : null}
      </View>
      <Text style={styles.timestampLeft}>{message.time}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  userWrapper: {
    alignItems: 'flex-end',
    marginBottom: SPACING.md,
    paddingHorizontal: SPACING.lg,
  },
  userBubble: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.lg,
    borderBottomRightRadius: 4,
    maxWidth: '82%',
    elevation: 2,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  userText: {
    fontSize: 14,
    color: COLORS.textLight,
    lineHeight: 20,
  },
  botWrapper: {
    alignItems: 'flex-start',
    marginBottom: SPACING.md,
    paddingHorizontal: SPACING.lg,
  },
  avatarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  avatar: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: COLORS.accentSaffron,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
  },
  botName: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
  },
  botBubble: {
    backgroundColor: COLORS.cardBg,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.lg,
    borderTopLeftRadius: 4,
    maxWidth: '92%',
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    elevation: 2,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  botText: {
    fontSize: 14,
    color: COLORS.textPrimary,
    lineHeight: 20,
  },
  remedyWrapper: {
    marginTop: SPACING.md,
  },
  timestamp: {
    fontSize: 10,
    color: COLORS.textMuted,
    marginTop: 4,
  },
  timestampLeft: {
    fontSize: 10,
    color: COLORS.textMuted,
    marginTop: 4,
    marginLeft: 32,
  },
});

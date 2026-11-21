import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { QUICK_PROMPTS } from '../data/botKnowledge';
import { COLORS, RADIUS, SPACING } from '../theme/colors';

export default function QuickPromptChips({ onSelectPrompt }) {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>💡 Quick Prompts for Dadi Maa:</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {QUICK_PROMPTS.map((prompt) => (
          <TouchableOpacity
            key={prompt.id}
            style={styles.chip}
            onPress={() => onSelectPrompt(prompt.query)}
            activeOpacity={0.7}
          >
            <Ionicons name={prompt.icon} size={14} color={COLORS.primary} style={styles.icon} />
            <Text style={styles.chipText}>{prompt.title}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: SPACING.xs,
    backgroundColor: COLORS.background,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textMuted,
    marginLeft: SPACING.lg,
    marginBottom: SPACING.xs,
    textTransform: 'uppercase',
  },
  scrollContainer: {
    paddingHorizontal: SPACING.lg,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardBg,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs + 2,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.primarySoft,
    marginRight: SPACING.xs + 2,
    elevation: 1,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  icon: {
    marginRight: 6,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.primary,
  },
});

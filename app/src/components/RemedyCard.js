import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, LayoutAnimation, Platform, UIManager } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADIUS, SPACING } from '../theme/colors';
import IngredientChip from './IngredientChip';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function RemedyCard({ remedy, isSaved, onToggleSave, compact = false }) {
  const [expanded, setExpanded] = useState(!compact);

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  };

  return (
    <View style={styles.card}>
      {/* Header Bar */}
      <View style={styles.header}>
        <View style={styles.badgeRow}>
          <View style={styles.categoryBadge}>
            <Ionicons name="sparkles-outline" size={12} color={COLORS.primary} />
            <Text style={styles.categoryText}>{remedy.category.toUpperCase()}</Text>
          </View>
          <View style={styles.timeBadge}>
            <Ionicons name="time-outline" size={12} color={COLORS.accentSaffron} />
            <Text style={styles.timeText}>{remedy.prepTime}</Text>
          </View>
        </View>

        <TouchableOpacity 
          onPress={() => onToggleSave && onToggleSave(remedy.id)} 
          style={styles.bookmarkBtn}
          activeOpacity={0.7}
        >
          <Ionicons 
            name={isSaved ? 'bookmark' : 'bookmark-outline'} 
            size={20} 
            color={isSaved ? COLORS.accentSaffron : COLORS.textMuted} 
          />
        </TouchableOpacity>
      </View>

      {/* Title */}
      <Text style={styles.title}>{remedy.title}</Text>
      <Text style={styles.subtitle}>{remedy.subtitle}</Text>

      {/* Ingredients Chips */}
      <View style={styles.ingredientsContainer}>
        <Text style={styles.sectionLabel}>Key Indian Ingredients:</Text>
        <View style={styles.chipRow}>
          {remedy.ingredientsList.map((item, idx) => (
            <IngredientChip key={idx} item={item} quantity={item.quantity} />
          ))}
        </View>
      </View>

      {/* Expandable Section */}
      {expanded ? (
        <View style={styles.expandedContent}>
          {/* Preparation Steps */}
          <Text style={styles.sectionLabel}>Preparation & Steps:</Text>
          {remedy.preparationSteps.map((step, idx) => (
            <View key={idx} style={styles.stepRow}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumText}>{idx + 1}</Text>
              </View>
              <Text style={styles.stepText}>{step}</Text>
            </View>
          ))}

          {/* Dosage & Timing */}
          <View style={styles.infoGrid}>
            <View style={styles.infoBox}>
              <Ionicons name="medical-outline" size={16} color={COLORS.primary} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Dosage</Text>
                <Text style={styles.infoValue}>{remedy.dosage}</Text>
              </View>
            </View>

            <View style={styles.infoBox}>
              <Ionicons name="alarm-outline" size={16} color={COLORS.accentSaffron} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Best Time</Text>
                <Text style={styles.infoValue}>{remedy.bestTimeToTake}</Text>
              </View>
            </View>
          </View>

          {/* Why It Works */}
          <View style={styles.whyBox}>
            <View style={styles.whyHeader}>
              <Ionicons name="bulb-outline" size={16} color={COLORS.primary} />
              <Text style={styles.whyTitle}>Why Dadi Maa's Remedy Works:</Text>
            </View>
            <Text style={styles.whyText}>{remedy.whyItWorks}</Text>
          </View>

          {/* Precautions */}
          {remedy.precautions && (
            <View style={styles.precautionBox}>
              <Ionicons name="alert-circle-outline" size={14} color={COLORS.accentSaffron} />
              <Text style={styles.precautionText}>{remedy.precautions}</Text>
            </View>
          )}
        </View>
      ) : null}

      {/* Expand/Collapse Trigger */}
      {compact && (
        <TouchableOpacity style={styles.expandToggle} onPress={toggleExpand}>
          <Text style={styles.expandToggleText}>
            {expanded ? 'Show Less' : 'View Full Recipe & Instructions'}
          </Text>
          <Ionicons name={expanded ? 'chevron-up' : 'chevron-down'} size={16} color={COLORS.primary} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.cardBg,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    elevation: 3,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primarySoft,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.sm,
    marginRight: SPACING.xs + 2,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.primary,
    marginLeft: 3,
  },
  timeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.accentOrangeSoft,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.sm,
  },
  timeText: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.accentSaffron,
    marginLeft: 3,
  },
  bookmarkBtn: {
    padding: SPACING.xs,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginTop: SPACING.xs,
    lineHeight: 22,
  },
  subtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
    marginTop: 2,
  },
  ingredientsContainer: {
    marginBottom: SPACING.sm,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs + 2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  expandedContent: {
    marginTop: SPACING.sm,
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.cardBorder,
  },
  stepRow: {
    flexDirection: 'row',
    marginBottom: SPACING.sm,
    alignItems: 'flex-start',
  },
  stepNumber: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.sm,
    marginTop: 1,
  },
  stepNumText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.cardBg,
  },
  stepText: {
    fontSize: 13,
    color: COLORS.textPrimary,
    flex: 1,
    lineHeight: 18,
  },
  infoGrid: {
    flexDirection: 'row',
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginVertical: SPACING.md,
    justifyContent: 'space-between',
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  infoContent: {
    marginLeft: SPACING.sm,
    flex: 1,
  },
  infoLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.textMuted,
    textTransform: 'uppercase',
  },
  infoValue: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  whyBox: {
    backgroundColor: COLORS.mintSoft,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
  },
  whyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  whyTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
    marginLeft: 4,
  },
  whyText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 17,
  },
  precautionBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.accentOrangeSoft,
    padding: SPACING.sm + 2,
    borderRadius: RADIUS.sm,
    marginTop: SPACING.xs,
  },
  precautionText: {
    fontSize: 11,
    color: '#9A3412',
    marginLeft: 6,
    flex: 1,
  },
  expandToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: SPACING.sm,
    marginTop: SPACING.xs,
    borderTopWidth: 1,
    borderTopColor: COLORS.cardBorder,
  },
  expandToggleText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.primary,
    marginRight: 4,
  },
});

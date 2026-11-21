import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADIUS, SPACING } from '../theme/colors';

export default function DailyTipCard({ tip }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.iconCircle}>
          <Ionicons name={tip.icon || 'leaf-outline'} size={20} color={COLORS.primary} />
        </View>
        <View style={styles.headerText}>
          <Text style={styles.tag}>{tip.tag || tip.category}</Text>
          <Text style={styles.title}>{tip.title}</Text>
        </View>
      </View>

      <Text style={styles.summary}>{tip.summary}</Text>

      {expanded && (
        <View style={styles.expandedContent}>
          <Text style={styles.details}>{tip.details}</Text>

          {tip.actionItem && (
            <View style={styles.actionBox}>
              <Ionicons name="checkmark-circle-outline" size={16} color={COLORS.accentSaffron} />
              <Text style={styles.actionText}>{tip.actionItem}</Text>
            </View>
          )}
        </View>
      )}

      <TouchableOpacity 
        style={styles.toggleBtn} 
        onPress={() => setExpanded(!expanded)}
        activeOpacity={0.7}
      >
        <Text style={styles.toggleText}>
          {expanded ? 'Show Less' : 'Learn Ayurvedic Principle'}
        </Text>
        <Ionicons name={expanded ? 'chevron-up' : 'chevron-down'} size={14} color={COLORS.primary} />
      </TouchableOpacity>
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
    elevation: 2,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.primarySoft,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  headerText: {
    flex: 1,
  },
  tag: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.accentSaffron,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginTop: 1,
  },
  summary: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 19,
    marginBottom: SPACING.xs,
  },
  expandedContent: {
    marginTop: SPACING.sm,
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.cardBorder,
  },
  details: {
    fontSize: 13,
    color: COLORS.textPrimary,
    lineHeight: 20,
    marginBottom: SPACING.sm,
  },
  actionBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.accentOrangeSoft,
    padding: SPACING.sm + 2,
    borderRadius: RADIUS.sm,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#9A3412',
    marginLeft: 6,
    flex: 1,
  },
  toggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SPACING.xs,
    paddingTop: SPACING.xs,
  },
  toggleText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.primary,
    marginRight: 4,
  },
});

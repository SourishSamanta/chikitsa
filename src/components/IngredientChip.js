import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADIUS, SPACING } from '../theme/colors';

export default function IngredientChip({ item, quantity }) {
  const { ingredient } = item;
  
  return (
    <View style={[styles.chip, { borderColor: ingredient.color + '40', backgroundColor: ingredient.color + '10' }]}>
      <Ionicons name={ingredient.icon || 'leaf-outline'} size={14} color={ingredient.color} style={styles.icon} />
      <Text style={styles.name}>{ingredient.name}</Text>
      {quantity ? <Text style={styles.qty}>({quantity})</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.sm + 2,
    paddingVertical: SPACING.xs + 2,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    marginRight: SPACING.xs + 2,
    marginBottom: SPACING.xs + 2,
  },
  icon: {
    marginRight: 4,
  },
  name: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  qty: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginLeft: 4,
  },
});

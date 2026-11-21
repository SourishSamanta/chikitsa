import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { REMEDIES } from '../data/remedies';
import { COLORS, SPACING } from '../theme/colors';
import RemedyCard from '../components/RemedyCard';

export default function SavedScreen({ savedRemedies, onToggleSave }) {
  const savedItems = REMEDIES.filter((item) => savedRemedies.includes(item.id));

  return (
    <View style={styles.container}>
      <FlatList
        data={savedItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <RemedyCard 
            remedy={item}
            isSaved={true}
            onToggleSave={onToggleSave}
            compact={false}
          />
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="bookmark-outline" size={54} color={COLORS.textMuted} />
            <Text style={styles.emptyTitle}>No Saved Remedies Yet</Text>
            <Text style={styles.emptySub}>
              Tap the bookmark icon on any home remedy card in the Chat or Remedies tab to save it here for fast offline access.
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  listContent: {
    padding: SPACING.lg,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.xxl * 2,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginTop: SPACING.md,
  },
  emptySub: {
    fontSize: 13,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginTop: SPACING.xs,
    paddingHorizontal: SPACING.xl,
    lineHeight: 19,
  },
});

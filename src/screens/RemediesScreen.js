import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TextInput, 
  TouchableOpacity, 
  ScrollView 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CATEGORIES, REMEDIES } from '../data/remedies';
import { COLORS, RADIUS, SPACING } from '../theme/colors';
import RemedyCard from '../components/RemedyCard';

export default function RemediesScreen({ savedRemedies, onToggleSave }) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredRemedies = REMEDIES.filter((remedy) => {
    const matchesCategory = selectedCategory === 'all' || remedy.category === selectedCategory;
    const query = searchQuery.toLowerCase().trim();
    
    if (!query) return matchesCategory;

    const matchesTitle = remedy.title.toLowerCase().includes(query);
    const matchesSubtitle = remedy.subtitle.toLowerCase().includes(query);
    const matchesTags = remedy.tags.some((t) => t.toLowerCase().includes(query));
    const matchesIngredients = remedy.ingredientsList.some((i) => 
      i.ingredient.name.toLowerCase().includes(query)
    );

    return matchesCategory && (matchesTitle || matchesSubtitle || matchesTags || matchesIngredients);
  });

  return (
    <View style={styles.container}>
      {/* Search Input Bar */}
      <View style={styles.searchSection}>
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={18} color={COLORS.textMuted} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search remedies (e.g. Ginger, Cough, Acidity)..."
            placeholderTextColor={COLORS.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color={COLORS.textMuted} />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {/* Horizontal Categories Pill Selector */}
      <View style={styles.categoriesWrapper}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesScroll}
        >
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <TouchableOpacity
                key={cat.id}
                style={[
                  styles.categoryPill,
                  isSelected && styles.categoryPillSelected
                ]}
                onPress={() => setSelectedCategory(cat.id)}
                activeOpacity={0.7}
              >
                <Ionicons 
                  name={cat.icon} 
                  size={14} 
                  color={isSelected ? COLORS.cardBg : COLORS.primary} 
                  style={{ marginRight: 5 }}
                />
                <Text style={[styles.categoryPillText, isSelected && styles.categoryPillTextSelected]}>
                  {cat.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Remedies List */}
      <FlatList
        data={filteredRemedies}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <RemedyCard 
            remedy={item}
            isSaved={savedRemedies.includes(item.id)}
            onToggleSave={onToggleSave}
            compact={true}
          />
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="leaf-outline" size={48} color={COLORS.textMuted} />
            <Text style={styles.emptyTitle}>No remedies found</Text>
            <Text style={styles.emptySub}>
              Try adjusting your search terms or selecting a different category.
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
  searchSection: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.xs,
    backgroundColor: COLORS.cardBg,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm + 2,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  searchIcon: {
    marginRight: SPACING.xs + 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: COLORS.textPrimary,
  },
  categoriesWrapper: {
    backgroundColor: COLORS.cardBg,
    paddingBottom: SPACING.sm + 2,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.cardBorder,
  },
  categoriesScroll: {
    paddingHorizontal: SPACING.lg,
  },
  categoryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primarySoft,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs + 2,
    borderRadius: RADIUS.full,
    marginRight: SPACING.xs + 2,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  categoryPillSelected: {
    backgroundColor: COLORS.primary,
  },
  categoryPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.primary,
  },
  categoryPillTextSelected: {
    color: COLORS.cardBg,
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
    fontSize: 16,
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
  },
});

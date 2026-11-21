import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DAILY_TIPS, INGREDIENT_SPOTLIGHTS } from '../data/tips';
import { COLORS, RADIUS, SPACING } from '../theme/colors';
import DailyTipCard from '../components/DailyTipCard';

export default function TipsScreen() {
  const [activeTab, setActiveTab] = useState('habits');

  return (
    <View style={styles.container}>
      {/* Top Tab Toggle */}
      <View style={styles.tabBar}>
        <TouchableOpacity 
          style={[styles.tabItem, activeTab === 'habits' && styles.tabItemActive]}
          onPress={() => setActiveTab('habits')}
        >
          <Ionicons name="sparkles-outline" size={16} color={activeTab === 'habits' ? COLORS.primary : COLORS.textMuted} />
          <Text style={[styles.tabText, activeTab === 'habits' && styles.tabTextActive]}>
            Daily Healthy Habits
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.tabItem, activeTab === 'ingredients' && styles.tabItemActive]}
          onPress={() => setActiveTab('ingredients')}
        >
          <Ionicons name="leaf-outline" size={16} color={activeTab === 'ingredients' ? COLORS.primary : COLORS.textMuted} />
          <Text style={[styles.tabText, activeTab === 'ingredients' && styles.tabTextActive]}>
            Ingredient Spotlight
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {activeTab === 'habits' ? (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>🌿 Dadi Maa's Dinacharya Principles</Text>
              <Text style={styles.sectionSub}>Simple Ayurvedic daily routines for long life and natural immunity</Text>
            </View>

            {DAILY_TIPS.map((tip) => (
              <DailyTipCard key={tip.id} tip={tip} />
            ))}
          </>
        ) : (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>🌱 Authentic Indian Kitchen Superfoods</Text>
              <Text style={styles.sectionSub}>Natural healing powers hidden in everyday Indian spices and herbs</Text>
            </View>

            {INGREDIENT_SPOTLIGHTS.map((item) => (
              <View key={item.id} style={styles.spotlightCard}>
                <View style={styles.spotlightHeader}>
                  <View style={styles.spotlightIcon}>
                    <Ionicons name="leaf" size={20} color={COLORS.cardBg} />
                  </View>
                  <View>
                    <Text style={styles.spotlightTitle}>{item.name}</Text>
                    <Text style={styles.spotlightHindi}>{item.hindiName} • {item.role}</Text>
                  </View>
                </View>

                <Text style={styles.benefitsHeader}>Healing Benefits:</Text>
                {item.benefits.map((b, idx) => (
                  <View key={idx} style={styles.benefitRow}>
                    <Ionicons name="checkmark-circle" size={14} color={COLORS.primary} style={{ marginRight: 6 }} />
                    <Text style={styles.benefitText}>{b}</Text>
                  </View>
                ))}

                <View style={styles.howToUseBox}>
                  <Text style={styles.howToUseLabel}>💡 How to use daily:</Text>
                  <Text style={styles.howToUseText}>{item.howToUse}</Text>
                </View>
              </View>
            ))}
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: COLORS.cardBg,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.cardBorder,
  },
  tabItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabItemActive: {
    borderBottomColor: COLORS.primary,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textMuted,
    marginLeft: 6,
  },
  tabTextActive: {
    color: COLORS.primary,
    fontWeight: '700',
  },
  scrollContent: {
    padding: SPACING.lg,
  },
  sectionHeader: {
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.primary,
  },
  sectionSub: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  spotlightCard: {
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
  spotlightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  spotlightIcon: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  spotlightTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  spotlightHindi: {
    fontSize: 12,
    color: COLORS.accentSaffron,
    fontWeight: '600',
    marginTop: 1,
  },
  benefitsHeader: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs + 2,
    textTransform: 'uppercase',
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  benefitText: {
    fontSize: 13,
    color: COLORS.textPrimary,
  },
  howToUseBox: {
    backgroundColor: COLORS.primarySoft,
    padding: SPACING.sm + 2,
    borderRadius: RADIUS.sm,
    marginTop: SPACING.md,
  },
  howToUseLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 2,
  },
  howToUseText: {
    fontSize: 12,
    color: COLORS.textPrimary,
  },
});

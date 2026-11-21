import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADIUS, SPACING } from '../theme/colors';
import DisclaimerBanner from './DisclaimerBanner';

export default function Header({ title = 'Chikitsa', subtitle = 'Dadi Maa ke Authentic Nuskhe' }) {
  const [showDisclaimer, setShowDisclaimer] = useState(false);

  return (
    <>
      <View style={styles.container}>
        <View style={styles.leftSection}>
          <View style={styles.logoBadge}>
            <Ionicons name="leaf" size={20} color={COLORS.cardBg} />
          </View>
          <View>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.subtitle}>{subtitle}</Text>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.infoBtn}
          onPress={() => setShowDisclaimer(true)}
          activeOpacity={0.7}
        >
          <Ionicons name="information-circle-outline" size={22} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      <DisclaimerBanner 
        visible={showDisclaimer} 
        onClose={() => setShowDisclaimer(false)} 
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.cardBg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.cardBorder,
    elevation: 2,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoBadge: {
    width: 38,
    height: 38,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.sm + 2,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.primary,
    letterSpacing: 0.3,
  },
  subtitle: {
    fontSize: 11,
    fontWeight: '500',
    color: COLORS.accentSaffron,
    letterSpacing: 0.2,
  },
  infoBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primarySoft,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

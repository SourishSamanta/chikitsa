import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADIUS, SPACING } from '../theme/colors';

export default function DisclaimerBanner({ visible, onClose }) {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <View style={styles.iconCircle}>
              <Ionicons name="shield-checkmark-outline" size={24} color={COLORS.primary} />
            </View>
            <Text style={styles.title}>Health & Safety Disclaimer</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={22} color={COLORS.textSecondary} />
            </TouchableOpacity>
          </View>

          <Text style={styles.bodyText}>
            🌿 <Text style={styles.bold}>Chikitsa</Text> provides traditional Indian home remedies ("Dadi Maa ke Nuskhe") for minor, low-level ailments and everyday natural wellness.
          </Text>

          <View style={styles.alertBox}>
            <Ionicons name="alert-circle-outline" size={20} color={COLORS.accentSaffron} />
            <Text style={styles.alertText}>
              These remedies are for complementary wellness only and are NOT a substitute for professional medical advice, diagnosis, or treatment.
            </Text>
          </View>

          <Text style={styles.subText}>
            If symptoms persist for more than 3 days, or if you experience high fever, severe pain, breathing difficulty, or allergic reactions, please consult a certified medical practitioner immediately.
          </Text>

          <TouchableOpacity style={styles.acceptBtn} onPress={onClose}>
            <Text style={styles.acceptBtnText}>I Understand & Agree</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  modalContainer: {
    width: '100%',
    backgroundColor: COLORS.cardBg,
    borderRadius: RADIUS.lg,
    padding: SPACING.xl,
    elevation: 8,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primarySoft,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textPrimary,
    flex: 1,
  },
  closeBtn: {
    padding: SPACING.xs,
  },
  bodyText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
    marginBottom: SPACING.md,
  },
  bold: {
    fontWeight: '700',
    color: COLORS.primary,
  },
  alertBox: {
    flexDirection: 'row',
    backgroundColor: COLORS.accentOrangeSoft,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.accentSaffron,
    padding: SPACING.md,
    borderRadius: RADIUS.sm,
    marginBottom: SPACING.md,
    alignItems: 'flex-start',
  },
  alertText: {
    fontSize: 13,
    color: '#9A3412',
    lineHeight: 18,
    marginLeft: SPACING.sm,
    flex: 1,
  },
  subText: {
    fontSize: 12,
    color: COLORS.textMuted,
    lineHeight: 18,
    marginBottom: SPACING.xl,
  },
  acceptBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.md,
    alignItems: 'center',
  },
  acceptBtnText: {
    color: COLORS.textLight,
    fontWeight: '600',
    fontSize: 15,
  },
});

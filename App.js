import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Keyboard,
  Platform,
} from 'react-native';

import {
  SafeAreaProvider,
  SafeAreaView,
} from 'react-native-safe-area-context';

import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

import { COLORS, RADIUS, SPACING } from './src/theme/colors';

import Header from './src/components/Header';
import ChatScreen from './src/screens/ChatScreen';
import RemediesScreen from './src/screens/RemediesScreen';
import TipsScreen from './src/screens/TipsScreen';
import SavedScreen from './src/screens/SavedScreen';

export default function App() {
  const [activeTab, setActiveTab] = useState('chat');

  const [savedRemedies, setSavedRemedies] = useState(['rem-1']);

  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  useEffect(() => {
    const showEvent =
      Platform.OS === 'ios'
        ? 'keyboardWillShow'
        : 'keyboardDidShow';

    const hideEvent =
      Platform.OS === 'ios'
        ? 'keyboardWillHide'
        : 'keyboardDidHide';

    const showSub = Keyboard.addListener(showEvent, () => {
      setIsKeyboardVisible(true);
    });

    const hideSub = Keyboard.addListener(hideEvent, () => {
      setIsKeyboardVisible(false);
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const handleToggleSave = (remedyId) => {
    setSavedRemedies((prev) =>
      prev.includes(remedyId)
        ? prev.filter((id) => id !== remedyId)
        : [...prev, remedyId]
    );
  };

  const renderCurrentScreen = () => {
    switch (activeTab) {
      case 'chat':
        return (
          <ChatScreen
            savedRemedies={savedRemedies}
            onToggleSave={handleToggleSave}
          />
        );

      case 'remedies':
        return (
          <RemediesScreen
            savedRemedies={savedRemedies}
            onToggleSave={handleToggleSave}
          />
        );

      case 'tips':
        return <TipsScreen />;

      case 'saved':
        return (
          <SavedScreen
            savedRemedies={savedRemedies}
            onToggleSave={handleToggleSave}
          />
        );

      default:
        return (
          <ChatScreen
            savedRemedies={savedRemedies}
            onToggleSave={handleToggleSave}
          />
        );
    }
  };

  return (
    <SafeAreaProvider>

      <SafeAreaView
        style={styles.safeArea}
        edges={['top', 'left', 'right', 'bottom']}
      >

        <StatusBar
          style="dark"
          backgroundColor={COLORS.cardBg}
        />

        {/* HEADER - NEVER MOVES */}
        <View style={styles.headerContainer}>
          <Header
            title="Chikitsa"
            subtitle="Dadi Maa ke Authentic Nuskhe"
          />
        </View>

        {/* MAIN CONTENT */}
        <View style={styles.content}>
          {renderCurrentScreen()}
        </View>

        {/* BOTTOM NAVIGATION */}
        {!isKeyboardVisible && (
          <View style={styles.bottomNav}>

            <TouchableOpacity
              style={styles.navItem}
              onPress={() => setActiveTab('chat')}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.iconContainer,
                  activeTab === 'chat' &&
                  styles.iconContainerActive,
                ]}
              >
                <Ionicons
                  name={
                    activeTab === 'chat'
                      ? 'chatbubbles'
                      : 'chatbubbles-outline'
                  }
                  size={22}
                  color={
                    activeTab === 'chat'
                      ? COLORS.primary
                      : COLORS.textMuted
                  }
                />
              </View>

              <Text
                style={[
                  styles.navText,
                  activeTab === 'chat' &&
                  styles.navTextActive,
                ]}
              >
                Dadi Maa AI
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.navItem}
              onPress={() => setActiveTab('remedies')}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.iconContainer,
                  activeTab === 'remedies' &&
                  styles.iconContainerActive,
                ]}
              >
                <Ionicons
                  name={
                    activeTab === 'remedies'
                      ? 'book'
                      : 'book-outline'
                  }
                  size={22}
                  color={
                    activeTab === 'remedies'
                      ? COLORS.primary
                      : COLORS.textMuted
                  }
                />
              </View>

              <Text
                style={[
                  styles.navText,
                  activeTab === 'remedies' &&
                  styles.navTextActive,
                ]}
              >
                Nuskhe Index
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.navItem}
              onPress={() => setActiveTab('tips')}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.iconContainer,
                  activeTab === 'tips' &&
                  styles.iconContainerActive,
                ]}
              >
                <Ionicons
                  name={
                    activeTab === 'tips'
                      ? 'sparkles'
                      : 'sparkles-outline'
                  }
                  size={22}
                  color={
                    activeTab === 'tips'
                      ? COLORS.primary
                      : COLORS.textMuted
                  }
                />
              </View>

              <Text
                style={[
                  styles.navText,
                  activeTab === 'tips' &&
                  styles.navTextActive,
                ]}
              >
                Health Tips
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.navItem}
              onPress={() => setActiveTab('saved')}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.iconContainer,
                  activeTab === 'saved' &&
                  styles.iconContainerActive,
                ]}
              >
                <Ionicons
                  name={
                    activeTab === 'saved'
                      ? 'bookmark'
                      : 'bookmark-outline'
                  }
                  size={22}
                  color={
                    activeTab === 'saved'
                      ? COLORS.primary
                      : COLORS.textMuted
                  }
                />

                {savedRemedies.length > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>
                      {savedRemedies.length}
                    </Text>
                  </View>
                )}
              </View>

              <Text
                style={[
                  styles.navText,
                  activeTab === 'saved' &&
                  styles.navTextActive,
                ]}
              >
                Saved
              </Text>
            </TouchableOpacity>

          </View>
        )}

      </SafeAreaView>

    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({

  safeArea: {
    flex: 1,
    backgroundColor: COLORS.cardBg,
  },

  /*
   * Header gets its own area.
   * It should never participate in keyboard movement.
   */
  headerContainer: {
    backgroundColor: COLORS.cardBg,
  },

  /*
   * This is the ONLY area that should shrink
   * when Android keyboard appears.
   */
  content: {
    flex: 1,
    minHeight: 0,
    backgroundColor: COLORS.background,
  },

  bottomNav: {
    flexDirection: 'row',
    backgroundColor: COLORS.cardBg,
    paddingVertical: SPACING.xs + 2,
    borderTopWidth: 1,
    borderTopColor: COLORS.cardBorder,
    elevation: 8,
    shadowColor: COLORS.shadow,
    shadowOffset: {
      width: 0,
      height: -3,
    },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },

  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  iconContainer: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.full,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },

  iconContainerActive: {
    backgroundColor: COLORS.primarySoft,
  },

  navText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textMuted,
    marginTop: 2,
  },

  navTextActive: {
    color: COLORS.primary,
    fontWeight: '700',
  },

  badge: {
    position: 'absolute',
    top: 2,
    right: 6,
    backgroundColor: COLORS.accentSaffron,
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 3,
  },

  badgeText: {
    color: COLORS.cardBg,
    fontSize: 9,
    fontWeight: '800',
  },

});
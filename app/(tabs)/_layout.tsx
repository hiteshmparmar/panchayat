import { Tabs } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../constants/colors';
import { FontFamily } from '../../constants/fonts';
import { useAppStore } from '../../lib/store';

function TabIcon({ emoji, label, focused }: { emoji: string; label: string; focused: boolean }) {
  const isDark = useAppStore((s) => s.isDark);
  return (
    <View style={styles.tabItem}>
      <Text style={[styles.emoji, { opacity: focused ? 1 : 0.5 }]}>{emoji}</Text>
      <Text style={[styles.tabLabel, { color: focused ? Colors.saffron : (isDark ? Colors.textTertiaryDark : Colors.textTertiaryLight) }]}>
        {label}
      </Text>
    </View>
  );
}

export default function TabLayout() {
  const isDark = useAppStore((s) => s.isDark);
  const role = useAppStore((s) => s.activeRole);
  const isSecretary = ['secretary', 'treasurer', 'chairman'].includes(role);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: isDark ? Colors.surfaceDark : Colors.surfaceLight,
          borderTopColor: isDark ? Colors.borderDark : Colors.borderLight,
          borderTopWidth: 1,
          height: 82,
          paddingBottom: 24,
          paddingTop: 8,
        },
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="🏠" label="Home" focused={focused} /> }}
      />
      <Tabs.Screen
        name="society"
        options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="🏢" label="Society" focused={focused} /> }}
      />
      <Tabs.Screen
        name="complaints"
        options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="🎫" label="Tickets" focused={focused} /> }}
      />
      <Tabs.Screen
        name="finance"
        options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="💰" label="Finance" focused={focused} /> }}
      />
      {isSecretary && (
        <Tabs.Screen
          name="secretary"
          options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="⚡" label="Secretary" focused={focused} /> }}
        />
      )}
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabItem: {
    alignItems: 'center',
    gap: 2,
  },
  emoji: {
    fontSize: 22,
  },
  tabLabel: {
    fontFamily: FontFamily.interMedium,
    fontSize: 10,
    marginTop: 1,
  },
});

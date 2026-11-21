import { Tabs } from 'expo-router/tabs';
import { Cpu, FolderOpen, Settings } from 'lucide-react-native';
import { colors } from '@/lib/theme';

export default function TabLayout() {
  const iconSize = 22;
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border },
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textMuted,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Device',
          tabBarIcon: ({ color }) => <Cpu size={iconSize} color={color} />,
        }}
      />
      <Tabs.Screen
        name="library"
        options={{
          title: 'Library',
          tabBarIcon: ({ color }) => <FolderOpen size={iconSize} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => <Settings size={iconSize} color={color} />,
        }}
      />
    </Tabs>
  );
}

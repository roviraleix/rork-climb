import { Tabs } from "expo-router";
import { Mountain, Route, Settings } from "lucide-react-native";
import React from "react";
import { useSettings } from "@/hooks/useSettings";
import { getTranslation } from "@/utils/i18n";
import { Colors } from "@/constants/colors";

function RootLayoutNav() {
  const { settings } = useSettings();
  const t = (key: string) => getTranslation(key, settings.language);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.darkTheme.textSecondary,
        tabBarStyle: {
          backgroundColor: Colors.darkTheme.background,
          borderTopColor: Colors.darkTheme.border,
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="create"
        options={{
          title: t("create"),
          tabBarIcon: ({ color }) => <Mountain color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="routes"
        options={{
          title: t("routes"),
          tabBarIcon: ({ color }) => <Route color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: t("settings"),
          tabBarIcon: ({ color }) => <Settings color={color} size={24} />,
        }}
      />
    </Tabs>
  );
}

export default RootLayoutNav;
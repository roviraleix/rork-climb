import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { Wifi, WifiOff } from "lucide-react-native";
import { Colors } from "@/constants/colors";
import { useSettings } from "@/hooks/useSettings";
import { getTranslation } from "@/utils/i18n";

interface ConnectionStatusProps {
  isConnected: boolean;
}

export function ConnectionStatus({ isConnected }: ConnectionStatusProps) {
  const { settings } = useSettings();
  const t = (key: string) => getTranslation(key, settings.language);
  
  return (
    <View style={[styles.container, isConnected ? styles.connected : styles.disconnected]}>
      {isConnected ? (
        <Wifi color={Colors.primary} size={16} />
      ) : (
        <WifiOff color={Colors.accent} size={16} />
      )}
      <Text style={[styles.text, { color: isConnected ? Colors.primary : Colors.accent }]}>
        {isConnected ? t("connectedToBoard") : t("notConnected")}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  connected: {
    backgroundColor: Colors.pastel.lightGreen,
    borderColor: Colors.primary,
  },
  disconnected: {
    backgroundColor: Colors.pastel.lightCoral,
    borderColor: Colors.accent,
  },
  text: {
    fontSize: 12,
    fontWeight: "600",
  },
});
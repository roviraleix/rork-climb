import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Bluetooth } from "lucide-react-native";
import { useClimbingWall } from "@/hooks/useClimbingWall";
import { ConnectionStatus } from "@/components/ConnectionStatus";
import { useSettings } from "@/hooks/useSettings";
import { getTranslation } from "@/utils/i18n";
import { router } from "expo-router";
import { Colors } from "@/constants/colors";

export default function ConnectScreen() {
  const insets = useSafeAreaInsets();
  const { isConnected, connect, disconnect } = useClimbingWall();
  const { settings } = useSettings();

  const t = (key: string) => getTranslation(key, settings.language);

  const handleConnect = async () => {
    if (!isConnected) {
      await connect();
    } else {
      await disconnect();
    }
  };

  // Navigate to create screen after successful connection
  React.useEffect(() => {
    if (isConnected) {
      router.replace("/(tabs)/create");
    }
  }, [isConnected]);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>{t("appName")}</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.connectionSection}>
          <Text style={styles.sectionTitle}>{t("connection")}</Text>
          
          <View style={styles.statusContainer}>
            <ConnectionStatus isConnected={isConnected} />
          </View>

          <Text style={styles.description}>
            {isConnected ? t("currentlyConnected") : t("tapToConnect")}
          </Text>

          <TouchableOpacity
            style={[styles.connectButton, isConnected && styles.disconnectButton]}
            onPress={handleConnect}
          >
            <Bluetooth color="white" size={24} />
            <Text style={styles.buttonText}>
              {isConnected ? t("disconnect") : t("connectBoard")}
            </Text>
          </TouchableOpacity>

          {isConnected && (
            <TouchableOpacity
              style={styles.continueButton}
              onPress={() => router.replace("/(tabs)/create")}
            >
              <Text style={styles.continueButtonText}>{t("create")}</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.instructionSection}>
          <Text style={styles.instructionTitle}>{t("about")}</Text>
          <Text style={styles.instructionText}>
            {t("appDescription")}
          </Text>
          
          <View style={styles.colorGuide}>
            <Text style={styles.colorGuideTitle}>{t("ledColors")}</Text>
            <View style={styles.colorItem}>
              <View style={[styles.colorDot, { backgroundColor: Colors.holds.red }]} />
              <Text style={styles.colorText}>{t("redTopFinish")}</Text>
            </View>
            <View style={styles.colorItem}>
              <View style={[styles.colorDot, { backgroundColor: Colors.holds.orange }]} />
              <Text style={styles.colorText}>{t("orangeFoot")}</Text>
            </View>
            <View style={styles.colorItem}>
              <View style={[styles.colorDot, { backgroundColor: Colors.holds.blue }]} />
              <Text style={styles.colorText}>{t("blueHand")}</Text>
            </View>
            <View style={styles.colorItem}>
              <View style={[styles.colorDot, { backgroundColor: Colors.holds.green }]} />
              <Text style={styles.colorText}>{t("greenStart")}</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    alignItems: "center",
    backgroundColor: Colors.pastel.lightGreen,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: Colors.text,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  connectionSection: {
    alignItems: "center",
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.text,
    marginBottom: 20,
  },
  statusContainer: {
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: "center",
    marginBottom: 24,
  },
  connectButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 16,
    minWidth: 200,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  disconnectButton: {
    backgroundColor: Colors.accent,
    shadowColor: Colors.accent,
  },
  buttonText: {
    color: Colors.textLight,
    fontWeight: "bold",
    fontSize: 18,
  },
  continueButton: {
    backgroundColor: Colors.secondary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginTop: 16,
    shadowColor: Colors.secondary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  continueButtonText: {
    color: Colors.textLight,
    fontWeight: "600",
    fontSize: 16,
  },
  instructionSection: {
    flex: 1,
  },
  instructionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.text,
    marginBottom: 12,
  },
  instructionText: {
    fontSize: 16,
    color: Colors.textSecondary,
    lineHeight: 24,
    marginBottom: 24,
  },
  colorGuide: {
    backgroundColor: Colors.pastel.mint,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  colorGuideTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 12,
  },
  colorItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  colorText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
});
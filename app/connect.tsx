import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Bluetooth, X, AlertCircle, CheckCircle } from "lucide-react-native";
import { useClimbingWall } from "@/hooks/useClimbingWall";

import { useSettings } from "@/hooks/useSettings";
import { getTranslation } from "@/utils/i18n";
import { router } from "expo-router";
import { Colors } from "@/constants/colors";

export default function ConnectScreen() {
  const insets = useSafeAreaInsets();
  const { 
    isConnected, 
    connect, 
    disconnect,
    showConnectionModal,
    showSuccessModal,
    showErrorModal,
    modalMessage,
    setShowConnectionModal,
    setShowSuccessModal,
    setShowErrorModal,
  } = useClimbingWall();
  const { settings } = useSettings();
  const [isConnecting, setIsConnecting] = React.useState(false);

  const t = (key: string) => getTranslation(key, settings.language);

  const handleConnect = async () => {
    if (!isConnected) {
      setIsConnecting(true);
      console.log("Starting connection process...");
      try {
        await connect();
        console.log("Connection attempt completed");
      } catch (error) {
        console.error("Connection error in handleConnect:", error);
      } finally {
        setIsConnecting(false);
      }
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
          <TouchableOpacity
            style={[styles.connectButton, isConnected && styles.disconnectButton]}
            onPress={handleConnect}
            disabled={isConnecting}
          >
            {isConnecting ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <Bluetooth color="white" size={24} />
            )}
            <Text style={styles.buttonText}>
              {isConnecting ? t("connecting") : isConnected ? t("disconnect") : t("connectBoard")}
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

      {/* Success Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showSuccessModal}
        onRequestClose={() => setShowSuccessModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <CheckCircle color={Colors.primary} size={32} />
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowSuccessModal(false)}
              >
                <X color={Colors.textSecondary} size={24} />
              </TouchableOpacity>
            </View>
            <Text style={styles.modalTitle}>{t("success")}</Text>
            <Text style={styles.modalMessage}>{modalMessage}</Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setShowSuccessModal(false)}
            >
              <Text style={styles.modalButtonText}>{t("ok")}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Error Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showErrorModal}
        onRequestClose={() => setShowErrorModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <AlertCircle color={Colors.accent} size={32} />
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowErrorModal(false)}
              >
                <X color={Colors.textSecondary} size={24} />
              </TouchableOpacity>
            </View>
            <Text style={[styles.modalTitle, { color: Colors.accent }]}>{t("error")}</Text>
            <Text style={styles.modalMessage}>{modalMessage}</Text>
            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: Colors.accent }]}
              onPress={() => setShowErrorModal(false)}
            >
              <Text style={styles.modalButtonText}>{t("ok")}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Connection Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showConnectionModal}
        onRequestClose={() => setShowConnectionModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Bluetooth color={Colors.primary} size={32} />
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowConnectionModal(false)}
              >
                <X color={Colors.textSecondary} size={24} />
              </TouchableOpacity>
            </View>
            <Text style={styles.modalTitle}>{t("connection")}</Text>
            <Text style={styles.modalMessage}>{modalMessage}</Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setShowConnectionModal(false)}
            >
              <Text style={styles.modalButtonText}>{t("ok")}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    marginBottom: 60,
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
    justifyContent: "center",
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: Colors.background,
    borderRadius: 20,
    padding: 24,
    width: "100%",
    maxWidth: 400,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  closeButton: {
    padding: 4,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.text,
    marginBottom: 12,
  },
  modalMessage: {
    fontSize: 16,
    color: Colors.textSecondary,
    lineHeight: 24,
    marginBottom: 24,
  },
  modalButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: "center",
  },
  modalButtonText: {
    color: Colors.textLight,
    fontSize: 16,
    fontWeight: "600",
  },
});
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
  FlatList,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { X, Save, ToggleLeft, ToggleRight } from "lucide-react-native";
import { Colors } from "@/constants/colors";
import { useClimbingWall } from "@/hooks/useClimbingWall";
import { WallGrid } from "@/components/WallGrid";
import { ColorPicker } from "@/components/ColorPicker";
import { ConnectionStatus } from "@/components/ConnectionStatus";
import { isValidGradeForSystem, formatGradeForSystem, getGradeSuggestionsForGradeSystem } from "@/utils/gradeValidation";
import { useSettings } from "@/hooks/useSettings";
import { getTranslation } from "@/utils/i18n";
import { router } from "expo-router";

export default function CreateScreen() {
  const insets = useSafeAreaInsets();
  const {
    isConnected,
    selectedHolds,
    selectedColor,
    wallDimensions,
    doubleLedMode,
    toggleHold,
    setSelectedColor,
    clearAll,
    saveRoute,
    setDoubleLedMode,
  } = useClimbingWall();
  const { settings } = useSettings();

  const [showSaveModal, setShowSaveModal] = useState(false);
  const [routeName, setRouteName] = useState("");
  const [routeGrade, setRouteGrade] = useState("");
  const [routeSetter, setRouteSetter] = useState("");
  const [routeType, setRouteType] = useState<"boulder" | "route">("boulder");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showGradeSuggestions, setShowGradeSuggestions] = useState(false);
  const [gradeSuggestions, setGradeSuggestions] = useState<string[]>([]);


  const t = (key: string) => getTranslation(key, settings.language);

  // Redirect to connect screen if not connected
  React.useEffect(() => {
    if (!isConnected) {
      router.replace("/connect");
    }
  }, [isConnected]);

  const handleSaveRoute = async () => {
    if (!routeName.trim()) {
      setErrorMessage(t("pleaseEnterRouteName"));
      setShowErrorModal(true);
      return;
    }

    if (!routeSetter.trim()) {
      setErrorMessage(t("pleaseEnterSetterName"));
      setShowErrorModal(true);
      return;
    }

    if (routeGrade.trim() && !isValidGradeForSystem(routeGrade.trim(), settings.gradeSystem)) {
      setErrorMessage(t("pleaseEnterValidGrade"));
      setShowErrorModal(true);
      return;
    }

    if (Object.keys(selectedHolds).length === 0) {
      setErrorMessage(t("pleaseSelectAtLeastOneHold"));
      setShowErrorModal(true);
      return;
    }

    await saveRoute({
      name: routeName.trim(),
      grade: formatGradeForSystem(routeGrade.trim(), settings.gradeSystem),
      setter: routeSetter.trim(),
      type: routeType,
      holds: selectedHolds,
      createdAt: new Date().toISOString(),
    });

    setShowSaveModal(false);
    setRouteName("");
    setRouteGrade("");
    setRouteSetter("");
    setShowSuccessModal(true);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>{t("appName")}</Text>
        <TouchableOpacity onPress={() => router.push("/connect")}>
          <ConnectionStatus isConnected={isConnected} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>

        <ColorPicker
          selectedColor={selectedColor}
          onColorSelect={setSelectedColor}
          disabled={!isConnected}
        />

        <WallGrid
          selectedHolds={selectedHolds}
          selectedColor={selectedColor}
          onHoldPress={toggleHold}
          disabled={!isConnected}
          dimensions={wallDimensions}
        />
        
        <View style={styles.bottomControls}>
          <TouchableOpacity
            style={[styles.toggleButton, doubleLedMode && styles.toggleButtonActive]}
            onPress={() => setDoubleLedMode(!doubleLedMode)}
            disabled={!isConnected}
          >
            {doubleLedMode ? (
              <ToggleRight color={Colors.primary} size={20} />
            ) : (
              <ToggleLeft color={Colors.textSecondary} size={20} />
            )}
            <Text style={[styles.toggleButtonText, doubleLedMode && styles.toggleButtonTextActive]}>
              {t("doubleLed")}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.button, styles.clearButton]}
            onPress={clearAll}
            disabled={!isConnected}
          >
            <X color="white" size={20} />
            <Text style={styles.buttonText}>{t("clearAll")}</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.saveButton, !isConnected && styles.disabledButton]}
          onPress={() => setShowSaveModal(true)}
          disabled={!isConnected || Object.keys(selectedHolds).length === 0}
        >
          <Save color="white" size={20} />
          <Text style={styles.saveButtonText}>{t("saveRoute")}</Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal
        visible={showSaveModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowSaveModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowSaveModal(false)}>
              <Text style={styles.cancelText}>{t("cancel")}</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>{t("saveRoute")}</Text>
            <TouchableOpacity onPress={handleSaveRoute}>
              <Text style={styles.saveText}>{t("save")}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.modalContent}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>{t("routeName")}</Text>
              <TextInput
                style={styles.input}
                value={routeName}
                onChangeText={setRouteName}
                placeholder={t("enterRouteName")}
                placeholderTextColor="#666"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>{t("setter")}</Text>
              <TextInput
                style={styles.input}
                value={routeSetter}
                onChangeText={setRouteSetter}
                placeholder={t("enterSetterName")}
                placeholderTextColor="#666"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>{t("gradeDifficulty")} ({settings.gradeSystem.toUpperCase()})</Text>
              <TextInput
                style={styles.input}
                value={routeGrade}
                onChangeText={(text) => {
                  setRouteGrade(text);
                  const suggestions = getGradeSuggestionsForGradeSystem(text, settings.gradeSystem);
                  setGradeSuggestions(suggestions);
                  setShowGradeSuggestions(text.length > 0 && suggestions.length > 0);
                }}
                onFocus={() => {
                  const suggestions = getGradeSuggestionsForGradeSystem(routeGrade, settings.gradeSystem);
                  setGradeSuggestions(suggestions);
                  setShowGradeSuggestions(suggestions.length > 0);
                }}
                onBlur={() => setTimeout(() => setShowGradeSuggestions(false), 200)}
                placeholder={`e.g., ${getGradeSuggestionsForGradeSystem("", settings.gradeSystem).slice(0, 3).join(", ")}`}
                placeholderTextColor="#666"
              />
              {showGradeSuggestions && (
                <View style={styles.suggestionsContainer}>
                  <FlatList
                    data={gradeSuggestions}
                    keyExtractor={(item) => item}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        style={styles.suggestionItem}
                        onPress={() => {
                          setRouteGrade(item);
                          setShowGradeSuggestions(false);
                        }}
                      >
                        <Text style={styles.suggestionText}>{item}</Text>
                      </TouchableOpacity>
                    )}
                  />
                </View>
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>{t("type")}</Text>
              <View style={styles.typeSelector}>
                <TouchableOpacity
                  style={[
                    styles.typeButton,
                    routeType === "boulder" && styles.typeButtonActive,
                  ]}
                  onPress={() => setRouteType("boulder")}
                >
                  <Text
                    style={[
                      styles.typeButtonText,
                      routeType === "boulder" && styles.typeButtonTextActive,
                    ]}
                  >
                    {t("boulder")}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.typeButton,
                    routeType === "route" && styles.typeButtonActive,
                  ]}
                  onPress={() => setRouteType("route")}
                >
                  <Text
                    style={[
                      styles.typeButtonText,
                      routeType === "route" && styles.typeButtonTextActive,
                    ]}
                  >
                    {t("route")}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showSuccessModal}
        animationType="fade"
        transparent
        onRequestClose={() => setShowSuccessModal(false)}
      >
        <View style={styles.overlayModal}>
          <View style={styles.alertModal}>
            <Text style={styles.alertTitle}>{t("success")}</Text>
            <Text style={styles.alertMessage}>{t("routeSavedSuccessfully")}</Text>
            <TouchableOpacity
              style={styles.alertButton}
              onPress={() => setShowSuccessModal(false)}
            >
              <Text style={styles.alertButtonText}>{t("ok")}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showErrorModal}
        animationType="fade"
        transparent
        onRequestClose={() => setShowErrorModal(false)}
      >
        <View style={styles.overlayModal}>
          <View style={styles.alertModal}>
            <Text style={styles.alertTitle}>{t("error")}</Text>
            <Text style={styles.alertMessage}>{errorMessage}</Text>
            <TouchableOpacity
              style={styles.alertButton}
              onPress={() => setShowErrorModal(false)}
            >
              <Text style={styles.alertButtonText}>{t("ok")}</Text>
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.pastel.lightGreen,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.text,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  controls: {
    flexDirection: "row",
    gap: 12,
    marginVertical: 20,
  },
  button: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 12,
    borderRadius: 12,
  },
  connectButton: {
    backgroundColor: "#4488FF",
  },
  disconnectButton: {
    backgroundColor: "#FF4444",
  },
  clearButton: {
    backgroundColor: Colors.accent,
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: Colors.textLight,
    fontWeight: "600",
    fontSize: 16,
  },
  saveButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 16,
    marginVertical: 20,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  saveButtonText: {
    color: Colors.textLight,
    fontWeight: "bold",
    fontSize: 18,
  },
  disabledButton: {
    backgroundColor: Colors.button.disabled,
    opacity: 0.5,
    shadowOpacity: 0,
    elevation: 0,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.pastel.lightGreen,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.text,
  },
  cancelText: {
    color: Colors.accent,
    fontSize: 16,
  },
  saveText: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: "600",
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  input: {
    backgroundColor: Colors.surface,
    color: Colors.text,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  typeSelector: {
    flexDirection: "row",
    gap: 12,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: Colors.surface,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.border,
  },
  typeButtonActive: {
    backgroundColor: Colors.secondary,
    borderColor: Colors.secondary,
  },
  typeButtonText: {
    color: Colors.textSecondary,
    fontSize: 16,
    fontWeight: "600",
  },
  typeButtonTextActive: {
    color: Colors.textLight,
  },
  overlayModal: {
    flex: 1,
    backgroundColor: "rgba(45, 74, 45, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  alertModal: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 24,
    minWidth: 280,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.text,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
  },
  alertTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.text,
    marginBottom: 12,
  },
  alertMessage: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: "center",
    marginBottom: 20,
  },
  alertButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  alertButtonText: {
    color: Colors.textLight,
    fontSize: 16,
    fontWeight: "600",
  },
  suggestionsContainer: {
    marginTop: 8,
    maxHeight: 40,
  },
  suggestionItem: {
    backgroundColor: Colors.secondary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
  },
  suggestionText: {
    color: Colors.textLight,
    fontSize: 14,
    fontWeight: "500",
  },
  bottomControls: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
    gap: 12,
  },
  toggleButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  toggleButtonActive: {
    backgroundColor: Colors.pastel.lightGreen,
    borderColor: Colors.primary,
  },
  toggleButtonText: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: "500",
  },
  toggleButtonTextActive: {
    color: Colors.primary,
  },
});
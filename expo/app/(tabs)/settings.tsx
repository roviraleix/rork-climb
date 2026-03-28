import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Bluetooth, Trash2, Grid, Globe, Hash } from "lucide-react-native";
import { Colors } from "@/constants/colors";
import { useClimbingWall } from "@/hooks/useClimbingWall";
import { useSettings } from "@/hooks/useSettings";
import { getTranslation } from "@/utils/i18n";
import type { GradeSystem } from "@/utils/gradeConversion";
import type { Language } from "@/utils/i18n";

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const { isConnected, clearAllRoutes, connect, disconnect, wallDimensions, setWallDimensions } = useClimbingWall();
  const { settings, setGradeSystem, setLanguage } = useSettings();
  const t = (key: string) => getTranslation(key, settings.language);
  
  const [showClearModal, setShowClearModal] = useState(false);
  const [showMatrixModal, setShowMatrixModal] = useState(false);
  const [tempRows, setTempRows] = useState(wallDimensions.rows.toString());
  const [tempCols, setTempCols] = useState(wallDimensions.cols.toString());
  const [showGradeSystemModal, setShowGradeSystemModal] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);

  const getLanguageName = (lang: Language): string => {
    const names = {
      en: t("english"),
      es: t("spanish"),
      ca: t("catalan"),
      fr: t("frenchLang"),
      de: t("german")
    };
    return names[lang] || t("english");
  };

  const handleClearAllRoutes = () => {
    setShowClearModal(true);
  };

  const confirmClearRoutes = () => {
    clearAllRoutes();
    setShowClearModal(false);
  };

  const handleMatrixSizeChange = () => {
    const rows = parseInt(tempRows);
    const cols = parseInt(tempCols);
    
    if (rows >= 4 && rows <= 20 && cols >= 4 && cols <= 20) {
      setWallDimensions({ rows, cols });
      setShowMatrixModal(false);
    }
  };

  const openMatrixModal = () => {
    setTempRows(wallDimensions.rows.toString());
    setTempCols(wallDimensions.cols.toString());
    setShowMatrixModal(true);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>{t("settings")}</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("connection")}</Text>
          
          <TouchableOpacity
            style={styles.settingItem}
            onPress={isConnected ? disconnect : connect}
          >
            <View style={styles.settingLeft}>
              <Bluetooth color={isConnected ? Colors.primary : Colors.secondary} size={24} />
              <View>
                <Text style={styles.settingTitle}>
                  {isConnected ? t("disconnectBoard") : t("connectToBoard")}
                </Text>
                <Text style={styles.settingSubtitle}>
                  {isConnected ? t("currentlyConnected") : t("tapToConnect")}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("wallConfiguration")}</Text>
          
          <TouchableOpacity style={styles.settingItem} onPress={openMatrixModal}>
            <View style={styles.settingLeft}>
              <Grid color={Colors.secondary} size={24} />
              <View>
                <Text style={styles.settingTitle}>{t("matrixSize")}</Text>
                <Text style={styles.settingSubtitle}>
                  {t("current")}: {wallDimensions.rows} × {wallDimensions.cols}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("settings")}</Text>
          
          <TouchableOpacity style={styles.settingItem} onPress={() => setShowGradeSystemModal(true)}>
            <View style={styles.settingLeft}>
              <Hash color={Colors.secondary} size={24} />
              <View>
                <Text style={styles.settingTitle}>{t("gradeSystem")}</Text>
                <Text style={styles.settingSubtitle}>
                  {t("current")}: {t(settings.gradeSystem)}
                </Text>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem} onPress={() => setShowLanguageModal(true)}>
            <View style={styles.settingLeft}>
              <Globe color={Colors.secondary} size={24} />
              <View>
                <Text style={styles.settingTitle}>{t("language")}</Text>
                <Text style={styles.settingSubtitle}>
                  {t("current")}: {getLanguageName(settings.language)}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("dataManagement")}</Text>
          
          <TouchableOpacity
            style={styles.settingItem}
            onPress={handleClearAllRoutes}
          >
            <View style={styles.settingLeft}>
              <Trash2 color={Colors.accent} size={24} />
              <View>
                <Text style={[styles.settingTitle, { color: Colors.accent }]}>
                  {t("clearAllRoutes")}
                </Text>
                <Text style={styles.settingSubtitle}>
                  {t("deleteAllSavedRoutes")}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("about")}</Text>
          
          <View style={styles.aboutContainer}>
            <Text style={styles.appName}>{t("appName")}</Text>
            <Text style={styles.version}>{t("version")} 1.0.0</Text>
            <Text style={styles.description}>
              {t("appDescription")}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("ledColors")}</Text>
          <View style={styles.colorLegend}>
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
      </ScrollView>

      <Modal
        visible={showClearModal}
        animationType="fade"
        transparent
        onRequestClose={() => setShowClearModal(false)}
      >
        <View style={styles.overlayModal}>
          <View style={styles.alertModal}>
            <Text style={styles.alertTitle}>{t("clearAllRoutes")}</Text>
            <Text style={styles.alertMessage}>
              {t("areYouSureDeleteAllRoutes")}
            </Text>
            <View style={styles.alertButtons}>
              <TouchableOpacity
                style={[styles.alertButton, styles.cancelButton]}
                onPress={() => setShowClearModal(false)}
              >
                <Text style={styles.alertButtonText}>{t("cancel")}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.alertButton, styles.deleteButton]}
                onPress={confirmClearRoutes}
              >
                <Text style={styles.alertButtonText}>{t("clearAllRoutes")}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showMatrixModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowMatrixModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowMatrixModal(false)}>
              <Text style={styles.cancelText}>{t("cancel")}</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>{t("matrixSize")}</Text>
            <TouchableOpacity onPress={handleMatrixSizeChange}>
              <Text style={styles.saveText}>{t("save")}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.modalContent}>
            <Text style={styles.matrixDescription}>
              {t("adjustMatrixSize")}
            </Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>{t("rows")} (4-20)</Text>
              <TextInput
                style={styles.input}
                value={tempRows}
                onChangeText={setTempRows}
                placeholder="12"
                placeholderTextColor="#666"
                keyboardType="numeric"
                maxLength={2}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>{t("columns")} (4-20)</Text>
              <TextInput
                style={styles.input}
                value={tempCols}
                onChangeText={setTempCols}
                placeholder="8"
                placeholderTextColor="#666"
                keyboardType="numeric"
                maxLength={2}
              />
            </View>

            <View style={styles.previewContainer}>
              <Text style={styles.previewTitle}>{t("preview")}: {tempRows} × {tempCols}</Text>
              <Text style={styles.previewSubtitle}>
                {t("totalHolds")}: {(parseInt(tempRows) || 0) * (parseInt(tempCols) || 0)}
              </Text>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showGradeSystemModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowGradeSystemModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowGradeSystemModal(false)}>
              <Text style={styles.cancelText}>{t("cancel")}</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>{t("gradeSystem")}</Text>
            <View style={styles.spacer} />
          </View>

          <View style={styles.modalContent}>
            <Text style={styles.matrixDescription}>
              {t("chooseGradeSystem")}
            </Text>
            
            {(["french", "yds", "uiaa", "british", "v-scale"] as GradeSystem[]).map((system) => (
              <TouchableOpacity
                key={system}
                style={[
                  styles.optionItem,
                  settings.gradeSystem === system && styles.optionItemActive
                ]}
                onPress={() => {
                  setGradeSystem(system);
                  setShowGradeSystemModal(false);
                }}
              >
                <Text style={[
                  styles.optionText,
                  settings.gradeSystem === system && styles.optionTextActive
                ]}>
                  {t(system)}
                </Text>
                {settings.gradeSystem === system && (
                  <View style={styles.checkmark} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>

      <Modal
        visible={showLanguageModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowLanguageModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowLanguageModal(false)}>
              <Text style={styles.cancelText}>{t("cancel")}</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>{t("language")}</Text>
            <View style={styles.spacer} />
          </View>

          <View style={styles.modalContent}>
            <Text style={styles.matrixDescription}>
              {t("chooseLanguage")}
            </Text>
            
            {(["en", "es", "ca", "fr", "de"] as Language[]).map((lang) => (
              <TouchableOpacity
                key={lang}
                style={[
                  styles.optionItem,
                  settings.language === lang && styles.optionItemActive
                ]}
                onPress={() => {
                  setLanguage(lang);
                  setShowLanguageModal(false);
                }}
              >
                <Text style={[
                  styles.optionText,
                  settings.language === lang && styles.optionTextActive
                ]}>
                  {getLanguageName(lang)}
                </Text>
                {settings.language === lang && (
                  <View style={styles.checkmark} />
                )}
              </TouchableOpacity>
            ))}
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
    backgroundColor: Colors.pastel.lightGreen,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.text,
  },
  content: {
    flex: 1,
  },
  section: {
    marginTop: 32,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.text,
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
  },
  settingSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  aboutContainer: {
    alignItems: "center",
    paddingVertical: 20,
  },
  appName: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.text,
    marginBottom: 4,
  },
  version: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 16,
  },
  description: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: 20,
  },
  colorLegend: {
    gap: 12,
  },
  colorItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  colorDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  colorText: {
    fontSize: 16,
    color: Colors.text,
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
    maxWidth: 320,
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
    lineHeight: 22,
  },
  alertButtons: {
    flexDirection: "row",
    gap: 12,
  },
  alertButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    flex: 1,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: Colors.textSecondary,
  },
  deleteButton: {
    backgroundColor: Colors.accent,
  },
  alertButtonText: {
    color: Colors.textLight,
    fontSize: 16,
    fontWeight: "600",
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
  matrixDescription: {
    fontSize: 16,
    color: Colors.textSecondary,
    lineHeight: 22,
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 20,
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
  previewContainer: {
    backgroundColor: Colors.pastel.mint,
    padding: 16,
    borderRadius: 16,
    marginTop: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  previewTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.text,
    marginBottom: 4,
  },
  previewSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  spacer: {
    width: 60,
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  optionItemActive: {
    backgroundColor: Colors.pastel.lightGreen,
  },
  optionText: {
    fontSize: 16,
    color: Colors.text,
    fontWeight: "500",
  },
  optionTextActive: {
    color: Colors.secondary,
    fontWeight: "600",
  },
  checkmark: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.secondary,
  },
});
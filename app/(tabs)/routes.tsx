import React, { useState, useMemo } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Modal,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Mountain, Filter } from "lucide-react-native";
import { Colors } from "@/constants/colors";
import { router } from "expo-router";
import { useClimbingWall } from "@/hooks/useClimbingWall";
import { useSettings } from "@/hooks/useSettings";
import { RouteCard } from "@/components/RouteCard";
import type { ClimbingRoute } from "@/types/climbing";
import { getTranslation } from "@/utils/i18n";

export default function RoutesScreen() {
  const insets = useSafeAreaInsets();
  const { savedRoutes, loadRoute, deleteRoute, isConnected, getRoutesInGradeSystem } = useClimbingWall();
  const { settings } = useSettings();
  const t = (key: string) => getTranslation(key, settings.language);
  const [selectedRoute, setSelectedRoute] = useState<string | null>(null);
  const [showNotConnectedModal, setShowNotConnectedModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [routeToDelete, setRouteToDelete] = useState<ClimbingRoute | null>(null);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedType, setSelectedType] = useState<"all" | "boulder" | "route">("all");
  const [selectedGrade, setSelectedGrade] = useState<string>("all");

  const handleLoadRoute = async (route: ClimbingRoute) => {
    if (!route?.id?.trim() || !route?.name?.trim()) return;
    if (route.name.length > 100) return;
    
    if (!isConnected) {
      setShowNotConnectedModal(true);
      return;
    }

    setSelectedRoute(route.id);
    await loadRoute(route);
    
    router.push("/(tabs)/create");
    
    setTimeout(() => {
      setSelectedRoute(null);
    }, 1000);
  };

  const handleDeleteRoute = (route: ClimbingRoute) => {
    if (!route?.id?.trim() || !route?.name?.trim()) return;
    if (route.name.length > 100) return;
    
    setRouteToDelete(route);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (routeToDelete) {
      deleteRoute(routeToDelete.id);
    }
    setShowDeleteModal(false);
    setRouteToDelete(null);
  };

  const routesInCurrentSystem = useMemo(() => {
    return getRoutesInGradeSystem(settings.gradeSystem);
  }, [getRoutesInGradeSystem, settings.gradeSystem]);

  const filteredRoutes = useMemo(() => {
    return routesInCurrentSystem.filter(route => {
      const typeMatch = selectedType === "all" || route.type === selectedType;
      const gradeMatch = selectedGrade === "all" || route.grade === selectedGrade;
      return typeMatch && gradeMatch;
    });
  }, [routesInCurrentSystem, selectedType, selectedGrade]);

  const availableGrades = useMemo(() => {
    const grades = [...new Set(routesInCurrentSystem.map(route => route.grade).filter(Boolean))];
    return grades.sort();
  }, [routesInCurrentSystem]);

  const clearFilters = () => {
    setSelectedType("all");
    setSelectedGrade("all");
  };

  const renderRoute = ({ item }: { item: ClimbingRoute }) => (
    <RouteCard
      route={item}
      isSelected={selectedRoute === item.id}
      onLoad={() => handleLoadRoute(item)}
      onDelete={() => handleDeleteRoute(item)}
      disabled={!isConnected}
    />
  );

  if (savedRoutes.length === 0) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <Text style={styles.title}>{t("savedRoutes")}</Text>
        </View>
        <View style={styles.emptyContainer}>
          <Mountain color={Colors.textSecondary} size={64} />
          <Text style={styles.emptyTitle}>{t("noRoutesYet")}</Text>
          <Text style={styles.emptyText}>
            {t("createFirstRoute")}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.title}>{t("savedRoutes")}</Text>
          <Text style={styles.subtitle}>
            {filteredRoutes.length} {t("of")} {routesInCurrentSystem.length} {t("routesCount")}
            {(selectedType !== "all" || selectedGrade !== "all") && ` ${t("filtered")}`}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowFilterModal(true)}
        >
          <Filter color={Colors.textLight} size={20} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredRoutes}
        renderItem={renderRoute}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          routesInCurrentSystem.length > 0 ? (
            <View style={styles.emptyFilterContainer}>
              <Filter color={Colors.textSecondary} size={48} />
              <Text style={styles.emptyFilterTitle}>{t("noRoutesMatchFilters")}</Text>
              <Text style={styles.emptyFilterText}>
                {t("tryAdjustingFilters")}
              </Text>
              <TouchableOpacity style={styles.clearFiltersButton} onPress={clearFilters}>
                <Text style={styles.clearFiltersText}>{t("clearFilters")}</Text>
              </TouchableOpacity>
            </View>
          ) : null
        }
      />

      <Modal
        visible={showNotConnectedModal}
        animationType="fade"
        transparent
        onRequestClose={() => setShowNotConnectedModal(false)}
      >
        <View style={styles.overlayModal}>
          <View style={styles.alertModal}>
            <Text style={styles.alertTitle}>{t("notConnected")}</Text>
            <Text style={styles.alertMessage}>{t("pleaseConnectFirst")}</Text>
            <TouchableOpacity
              style={styles.alertButton}
              onPress={() => setShowNotConnectedModal(false)}
            >
              <Text style={styles.alertButtonText}>{t("ok")}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showDeleteModal}
        animationType="fade"
        transparent
        onRequestClose={() => setShowDeleteModal(false)}
      >
        <View style={styles.overlayModal}>
          <View style={styles.alertModal}>
            <Text style={styles.alertTitle}>{t("deleteRoute")}</Text>
            <Text style={styles.alertMessage}>
              {t("areYouSureDelete")} &quot;{routeToDelete?.name}&quot;?
            </Text>
            <View style={styles.alertButtons}>
              <TouchableOpacity
                style={[styles.alertButton, styles.cancelButton]}
                onPress={() => setShowDeleteModal(false)}
              >
                <Text style={styles.alertButtonText}>{t("cancel")}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.alertButton, styles.deleteButton]}
                onPress={confirmDelete}
              >
                <Text style={styles.alertButtonText}>{t("delete")}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showFilterModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowFilterModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowFilterModal(false)}>
              <Text style={styles.cancelText}>{t("cancel")}</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>{t("filterRoutes")}</Text>
            <TouchableOpacity onPress={clearFilters}>
              <Text style={styles.clearText}>{t("clear")}</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.filterSection}>
              <Text style={styles.filterTitle}>{t("type")}</Text>
              <View style={styles.filterOptions}>
                {["all", "boulder", "route"].map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.filterOption,
                      selectedType === type && styles.filterOptionActive,
                    ]}
                    onPress={() => setSelectedType(type as "all" | "boulder" | "route")}
                  >
                    <Text
                      style={[
                        styles.filterOptionText,
                        selectedType === type && styles.filterOptionTextActive,
                      ]}
                    >
                      {type === "all" ? t("allTypes") : t(type)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.filterSection}>
              <Text style={styles.filterTitle}>{t("gradeDifficulty")}</Text>
              <View style={styles.filterOptions}>
                <TouchableOpacity
                  style={[
                    styles.filterOption,
                    selectedGrade === "all" && styles.filterOptionActive,
                  ]}
                  onPress={() => setSelectedGrade("all")}
                >
                  <Text
                    style={[
                      styles.filterOptionText,
                      selectedGrade === "all" && styles.filterOptionTextActive,
                    ]}
                  >
                    {t("allGrades")}
                  </Text>
                </TouchableOpacity>
                {availableGrades.map((grade) => (
                  <TouchableOpacity
                    key={grade}
                    style={[
                      styles.filterOption,
                      selectedGrade === grade && styles.filterOptionActive,
                    ]}
                    onPress={() => setSelectedGrade(grade)}
                  >
                    <Text
                      style={[
                        styles.filterOptionText,
                        selectedGrade === grade && styles.filterOptionTextActive,
                      ]}
                    >
                      {grade}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>
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
  headerLeft: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.text,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  listContainer: {
    padding: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: 22,
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
  filterButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: Colors.secondary,
    shadowColor: Colors.secondary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  emptyFilterContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
    paddingVertical: 60,
  },
  emptyFilterTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyFilterText: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 20,
  },
  clearFiltersButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
  },
  clearFiltersText: {
    color: Colors.textLight,
    fontSize: 14,
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
  clearText: {
    color: Colors.secondary,
    fontSize: 16,
    fontWeight: "600",
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  filterSection: {
    marginTop: 24,
  },
  filterTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.text,
    marginBottom: 12,
  },
  filterOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  filterOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  filterOptionActive: {
    backgroundColor: Colors.secondary,
    borderColor: Colors.secondary,
  },
  filterOptionText: {
    color: Colors.textSecondary,
    fontSize: 14,
    fontWeight: "500",
  },
  filterOptionTextActive: {
    color: Colors.textLight,
  },
});
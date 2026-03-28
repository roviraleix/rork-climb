import React from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { Play, Trash2, Mountain, Calendar, User } from "lucide-react-native";
import { Colors } from "@/constants/colors";
import type { ClimbingRoute } from "@/types/climbing";
import { useSettings } from "@/hooks/useSettings";
import { getTranslation } from "@/utils/i18n";

interface RouteCardProps {
  route: ClimbingRoute;
  isSelected: boolean;
  onLoad: () => void;
  onDelete: () => void;
  disabled?: boolean;
}

export function RouteCard({ route, isSelected, onLoad, onDelete, disabled }: RouteCardProps) {
  const { settings } = useSettings();
  const t = (key: string) => getTranslation(key, settings.language);
  
  const holdCount = Object.keys(route.holds).length;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <View style={[styles.card, isSelected && styles.selectedCard]}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.name}>{route.name}</Text>
          <View style={styles.metadata}>
            <Text style={styles.grade}>{route.grade}</Text>
            <Text style={styles.separator}>•</Text>
            <Text style={styles.type}>
              {t(route.type)}
            </Text>
          </View>
        </View>
        
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={onDelete}
        >
          <Trash2 color={Colors.accent} size={20} />
        </TouchableOpacity>
      </View>

      <View style={styles.info}>
        <View style={styles.infoItem}>
          <Mountain color={Colors.textSecondary} size={16} />
          <Text style={styles.infoText}>{holdCount} {t("holdsSelected")}</Text>
        </View>
        
        <View style={styles.infoItem}>
          <User color={Colors.textSecondary} size={16} />
          <Text style={styles.infoText}>{route.setter}</Text>
        </View>
        
        <View style={styles.infoItem}>
          <Calendar color={Colors.textSecondary} size={16} />
          <Text style={styles.infoText}>{formatDate(route.createdAt)}</Text>
        </View>
      </View>

      <TouchableOpacity
        style={[
          styles.loadButton,
          disabled && styles.disabledButton,
          isSelected && styles.loadingButton,
        ]}
        onPress={onLoad}
        disabled={disabled}
      >
        <Play color={Colors.textLight} size={16} />
        <Text style={styles.loadButtonText}>
          {isSelected ? "Loading..." : "Load Route"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  selectedCard: {
    borderColor: Colors.primary,
    backgroundColor: Colors.pastel.lightGreen,
    transform: [{ scale: 1.02 }],
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  titleContainer: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.text,
    marginBottom: 4,
  },
  metadata: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  grade: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.secondary,
  },
  separator: {
    color: Colors.textSecondary,
  },
  type: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  deleteButton: {
    padding: 4,
  },
  info: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  infoText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  loadButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  loadingButton: {
    backgroundColor: Colors.textSecondary,
    shadowOpacity: 0,
    elevation: 0,
  },
  disabledButton: {
    backgroundColor: Colors.button.disabled,
    opacity: 0.5,
    shadowOpacity: 0,
    elevation: 0,
  },
  loadButtonText: {
    color: Colors.textLight,
    fontWeight: "600",
    fontSize: 16,
  },
});
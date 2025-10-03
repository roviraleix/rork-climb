import React from "react";
import { StyleSheet, View, TouchableOpacity, Text } from "react-native";
import type { HoldColor, SelectedHolds, WallDimensions } from "@/types/climbing";
import { useSettings } from "@/hooks/useSettings";
import { getTranslation } from "@/utils/i18n";
import { Colors } from "@/constants/colors";

interface WallGridProps {
  selectedHolds: SelectedHolds;
  selectedColor: HoldColor;
  onHoldPress: (holdId: string) => void;
  disabled?: boolean;
  dimensions: WallDimensions;
}



const colorMap: Record<HoldColor, string> = {
  red: Colors.holds.red,
  orange: Colors.holds.orange,
  blue: Colors.holds.blue,
  green: Colors.holds.green,
};

export function WallGrid({ selectedHolds, selectedColor, onHoldPress, disabled, dimensions }: WallGridProps) {
  const { settings } = useSettings();
  const t = (key: string) => getTranslation(key, settings.language);
  
  const renderHold = (row: number, col: number) => {
    if (row < 0 || col < 0 || row > 99 || col > 99) return null;
    
    const holdId = `${row}-${col}`;
    const isSelected = holdId in selectedHolds;
    const holdColor = selectedHolds[holdId];

    return (
      <TouchableOpacity
        key={holdId}
        style={[
          styles.hold,
          isSelected && { backgroundColor: colorMap[holdColor] },
          disabled && styles.holdDisabled,
        ]}
        onPress={() => !disabled && onHoldPress(holdId)}
        disabled={disabled}
      />
    );
  };

  const renderRow = (row: number) => {
    if (row < 0 || row > 99) return null;
    
    return (
      <View key={row} style={styles.row}>
        {Array.from({ length: dimensions.cols }, (_, col) => renderHold(row, col))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t("climbingWall")}</Text>
        <Text style={styles.subtitle}>
          {t("selectedColor")}: <Text style={{ color: colorMap[selectedColor] }}>
            {t(selectedColor)}
          </Text>
        </Text>
      </View>
      
      <View style={styles.grid}>
        {Array.from({ length: dimensions.rows }, (_, row) => renderRow(row))}
      </View>
      
      <Text style={styles.instruction}>
        {t("tapHoldsToToggle")} • {Object.keys(selectedHolds).length} {t("holdsSelected")}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  grid: {
    backgroundColor: "#3A5A3A",
    borderRadius: 16,
    padding: 8,
    gap: 2,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  row: {
    flexDirection: "row",
    gap: 2,
  },
  hold: {
    flex: 1,
    aspectRatio: 1,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: Colors.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  holdDisabled: {
    opacity: 0.5,
  },

  instruction: {
    textAlign: "center",
    color: Colors.textSecondary,
    fontSize: 14,
    marginTop: 12,
  },
});
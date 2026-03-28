import React from "react";
import { StyleSheet, View, TouchableOpacity, Text } from "react-native";
import { Palette } from "lucide-react-native";
import type { HoldColor } from "@/types/climbing";
import { useSettings } from "@/hooks/useSettings";
import { getTranslation } from "@/utils/i18n";
import { Colors } from "@/constants/colors";

interface ColorPickerProps {
  selectedColor: HoldColor;
  onColorSelect: (color: HoldColor) => void;
  disabled?: boolean;
}

const colorMap: Record<HoldColor, string> = {
  red: Colors.holds.red,
  orange: Colors.holds.orange,
  blue: Colors.holds.blue,
  green: Colors.holds.green,
};

export function ColorPicker({ selectedColor, onColorSelect, disabled }: ColorPickerProps) {
  const { settings } = useSettings();
  const t = (key: string) => getTranslation(key, settings.language);
  
  const colors: HoldColor[] = ["red", "orange", "blue", "green"];
  
  const colorLabels: Record<HoldColor, string> = {
    red: t("top"),
    orange: t("feet"),
    blue: t("hands"),
    green: t("start"),
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Palette color={Colors.text} size={20} />
        <Text style={styles.title}>{t("ledColor")}</Text>
      </View>
      
      <View style={styles.colorGrid}>
        {colors.map((color) => (
          <TouchableOpacity
            key={color}
            style={[
              styles.colorButton,
              { backgroundColor: colorMap[color] },
              selectedColor === color && styles.selectedColor,
              disabled && styles.disabledColor,
            ]}
            onPress={() => !disabled && onColorSelect(color)}
            disabled={disabled}
          >
            <Text style={styles.colorLabel}>{colorLabels[color]}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
  },
  colorGrid: {
    flexDirection: "row",
    gap: 12,
  },
  colorButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    minHeight: 60,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedColor: {
    borderWidth: 3,
    borderColor: Colors.text,
    transform: [{ scale: 1.05 }],
  },
  disabledColor: {
    opacity: 0.5,
  },
  colorLabel: {
    color: Colors.textLight,
    fontWeight: "bold",
    fontSize: 14,
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  selectedIndicator: {
    position: "absolute",
    top: 4,
    right: 4,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "white",
  },
});
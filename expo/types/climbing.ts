export type HoldColor = "red" | "orange" | "blue" | "green";

export type SelectedHolds = Record<string, HoldColor>;

export interface ClimbingRoute {
  id: string;
  name: string;
  grade: string;
  type: "boulder" | "route";
  setter: string;
  holds: SelectedHolds;
  createdAt: string;
}

export interface WallDimensions {
  rows: number;
  cols: number;
}
import { BaseProperties } from "@sector-eleven-ltd/cosmos-core";

export interface User extends BaseProperties {
  email: string;
  displayName: string;
}

interface CraneInfo {
  name: string;
  imageUrl: string;
  battles: {
    type: "Attack" | "Defense";
    oppenentCraneId: string;
    value: number;
    result: "Victory" | "Defeat";
  }[];
}

export interface Crane extends CraneInfo, BaseProperties {
  active: boolean;
  pastVersions: CraneInfo[];
}

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Ian Lucas. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

export const CRAFT_ITEM_FILTERS = [
  {
    category: "secondary",
    hasModel: true,
    icon: "pistol",
    isFree: true,
    label: "Pistol",
    type: "weapon" as const
  },
  {
    category: "smg",
    hasModel: true,
    icon: "smg",
    isFree: true,
    label: "SMG",
    type: "weapon" as const
  },
  {
    category: "heavy",
    hasModel: true,
    isFree: true,
    icon: "heavy",
    label: "Heavy",
    type: "weapon" as const
  },
  {
    category: "rifle",
    hasModel: true,
    isFree: true,
    icon: "rifle",
    label: "Rifle",
    type: "weapon" as const
  },
  {
    hasModel: true,
    icon: "knife",
    label: "Knife",
    type: "melee" as const
  },
  {
    category: "equipment",
    hasModel: true,
    icon: "equipment",
    isFree: true,
    label: "Equipment",
    type: "weapon" as const
  },
  {
    hasModel: true,
    icon: "glove",
    label: "Glove",
    type: "glove" as const
  },
  {
    hasModel: false,
    icon: "sticker",
    label: "Sticker",
    type: "sticker" as const
  },
  {
    hasModel: false,
    icon: "agent",
    label: "Agent",
    type: "agent" as const
  },
  {
    hasModel: false,
    icon: "patch",
    label: "Patch",
    type: "patch" as const
  },
  {
    hasModel: false,
    icon: "musickit",
    label: "Music Kit",
    type: "musickit" as const
  },
  {
    hasModel: false,
    icon: "spray",
    label: "Graffiti",
    type: "graffiti" as const
  },
  {
    hasModel: false,
    icon: "pin",
    label: "Pin",
    type: "pin" as const
  },
  {
    hasModel: false,
    icon: "case",
    label: "Case",
    type: "case" as const
  },
  {
    hasModel: false,
    icon: "key",
    label: "Key",
    type: "key" as const
  },
  {
    hasModel: false,
    icon: "tool",
    label: "Tool",
    type: "tool" as const
  }
];

export type CraftItemFilter = (typeof CRAFT_ITEM_FILTERS)[number];

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Ian Lucas. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ActionFunctionArgs } from "@remix-run/node";
import { z } from "zod";
import { requireUser } from "~/auth.server";
import { manipulateUserInventory } from "~/models/user.server";
import { noContent } from "~/response.server";
import {
  craftInventoryItemShape,
  craftInventoryShape,
  teamShape
} from "~/utils/shapes";

export const ApiActionSync = "/api/action/sync";
export const AddFromCacheAction = "add-from-cache";
export const AddAction = "add";
export const EquipAction = "equip";
export const UnequipAction = "unequip";
export const RenameItemAction = "rename-item";
export const RemoveAction = "remove";

export async function action({ request }: ActionFunctionArgs) {
  const { id: userId, inventory: rawInventory } = await requireUser(request);
  const actions = z
    .array(
      z
        .object({
          type: z.literal(AddFromCacheAction),
          items: craftInventoryShape
        })
        .or(
          z.object({
            type: z.literal(AddAction),
            item: craftInventoryItemShape
          })
        )
        .or(
          z.object({
            type: z.literal(EquipAction),
            index: z.number(),
            team: teamShape.optional()
          })
        )
        .or(
          z.object({
            type: z.literal(UnequipAction),
            index: z.number(),
            team: teamShape.optional()
          })
        )
        .or(
          z.object({
            type: z.literal(RenameItemAction),
            toolIndex: z.number(),
            targetIndex: z.number(),
            nametag: z.string().optional()
          })
        )
        .or(
          z.object({
            type: z.literal(RemoveAction),
            index: z.number()
          })
        )
    )
    .parse(await request.json());
  await manipulateUserInventory(userId, rawInventory, (inventory) =>
    actions.forEach((action) => {
      switch (action.type) {
        case AddFromCacheAction:
          return action.items.forEach((item) => inventory.add(item));
        case AddAction:
          return inventory.add(action.item);
        case EquipAction:
          return inventory.equip(action.index, action.team);
        case UnequipAction:
          return inventory.unequip(action.index, action.team);
        case RenameItemAction:
          return inventory.renameItem(
            action.toolIndex,
            action.targetIndex,
            action.nametag
          );
        case RemoveAction:
          return inventory.remove(action.index);
      }
    })
  );
  return noContent;
}

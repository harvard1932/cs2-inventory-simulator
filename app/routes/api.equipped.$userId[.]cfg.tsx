import { LoaderFunctionArgs } from "@remix-run/node";
import { z } from "zod";
import { useUserCache } from "~/models/user-cache.server";
import { transformEquipped } from "~/utils/inventory";
import { toValveKeyValue } from "~/utils/valve-key-value";

export const ApiEquippedUserIdCfgUrl = "/api/equipped/$userId.cfg";

export async function loader({ params }: LoaderFunctionArgs) {
  const userId = z.string().parse(params.userId);
  return await useUserCache({
    generate(inventory) {
      return toValveKeyValue(transformEquipped(inventory));
    },
    mimeType: "text/plain",
    throwData: "",
    url: ApiEquippedUserIdCfgUrl,
    userId
  });
}

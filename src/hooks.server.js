import { createThemeHooks } from "$pano/kit/hooks-server.js";
import { internalLibsHash } from "$lib/internalLibs.js";
import { runtimeShimsHash } from "$lib/runtimeShims.js";
import * as licenseConstants from "$lib/server/license-constants.generated.js";

export const { handle, handleError, handleFetch } = createThemeHooks({
  internalLibsHash,
  runtimeShimsHash,
  licenseConstants,
});

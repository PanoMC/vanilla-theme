import { baseAPI, pageAPI } from "../pano-sdk/core/js/PluginAPI";

export async function init() {
}

export const panoApi = {
  ...baseAPI,
  ui: {
    ...pageAPI,
    nav: {
    },
  },
};

export const panoApiServer = {
  ...panoApi,
};

export const panoApiClient = {
  ...panoApi,
};

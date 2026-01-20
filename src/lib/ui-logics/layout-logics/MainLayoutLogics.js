import { executeHookLoad } from "$lib/PluginAPI.js";

export async function processLoad(event) {
    const { parent, url } = event;
    await parent();

    const hookProps = {
        'theme:top': await executeHookLoad('theme:top', event),
        'page:top': await executeHookLoad('page:top', event)
    };

    if (url.pathname === '/') {
        hookProps['page:home:top'] = await executeHookLoad('page:home:top', event);
    }

    return {
        hookProps
    };
}

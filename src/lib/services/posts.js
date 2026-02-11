import ApiUtil, { buildQueryParams } from "$lib/api.util.js";

export const getPosts = async ({ page, categoryUrl, request, csrfToken }) => {
  const queryParams = buildQueryParams({ page, categoryUrl });

  return ApiUtil.get({
    path: `/api/posts${queryParams}`,
    request,
    csrfToken
  }).then((body) => {
    body.page = parseInt(page);

    return body;
  });
};

export const getPostDetail = async ({ url, request, csrfToken }) => {
  return ApiUtil.get({
    path: `/api/posts/${url}`,
    request,
    csrfToken
  }).then((body) => {
    body.url = url;

    return body;
  });
};

export const getPostPreview = async ({ id, request, csrfToken }) => {
  return ApiUtil.get({
    path: `/api/panel/posts/${id}/preview`,
    request,
    csrfToken
  }).then((body) => {
    body.id = parseInt(id);

    return body;
  });
};

export const getAllParams = (locationSearch: string) => {
  const urlParams = new URLSearchParams(locationSearch);

  return Object.fromEntries(urlParams);
};

export const getSearchParam = (paramName: string) => {
  if (typeof window === 'undefined') {
    return undefined;
  }
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(paramName) || undefined;
};

export const getSearchParamServerSide = (
  request: Request,
  paramName: string
) => {
  const { searchParams } = new URL(request.url);
  return searchParams.get(paramName) || undefined;
};

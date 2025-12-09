export const isSafari =
  /^((?!chrome|android|chromium|edg|opera|brave).)*safari/i.test(
    navigator.userAgent
  );

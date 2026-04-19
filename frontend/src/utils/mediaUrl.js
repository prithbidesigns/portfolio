function transformImageKitUrl(
  url,
  { width, height, quality = 80, crop = false, format } = {}
) {
  if (!url || typeof url !== "string" || !url.includes("ik.imagekit.io")) {
    return url;
  }

  const transformations = [];

  if (width) transformations.push(`w-${width}`);
  if (height) transformations.push(`h-${height}`);
  transformations.push(crop ? "c-fill" : "c-fit");
  if (quality) transformations.push(`q-${quality}`);

  if (format && format !== "auto") {
    transformations.push(`f-${format}`);
  } else if (format === "auto") {
    transformations.push("f-auto");
  }

  if (transformations.length === 0) {
    return url;
  }

  const joinChar = url.includes("?") ? "&" : "?";
  return `${url}${joinChar}tr=${transformations.join(",")}`;
}

function transformCloudinaryUrl(
  url,
  { width, height, quality = 80, crop = false, format } = {}
) {
  if (
    !url ||
    typeof url !== "string" ||
    !url.includes("res.cloudinary.com") ||
    !url.includes("/upload/")
  ) {
    return url;
  }

  const transformations = [];

  transformations.push(crop ? "c_fill" : "c_fit");
  if (width) transformations.push(`w_${width}`);
  if (height) transformations.push(`h_${height}`);
  if (quality) transformations.push(`q_${quality}`);

  if (format && format !== "auto") {
    transformations.push(`f_${format}`);
  } else if (format === "auto") {
    transformations.push("f_auto");
  }

  if (transformations.length === 0) {
    return url;
  }

  return url.replace(
    "/upload/",
    `/upload/${transformations.join(",")}/`
  );
}

export function transformMediaUrl(url, options = {}) {
  if (!url || typeof url !== "string" || url.startsWith("blob:")) {
    return url;
  }

  if (url.includes("res.cloudinary.com")) {
    return transformCloudinaryUrl(url, options);
  }

  if (url.includes("ik.imagekit.io")) {
    return transformImageKitUrl(url, options);
  }

  return url;
}

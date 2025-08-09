export function generateInitials(name) {
  if (!name || typeof name !== "string") {
    return "?";
  }

  const cleanName = name.trim().replace(/\s+/g, " ");

  if (cleanName === "") {
    return "?";
  }

  const nameWords = cleanName.split(" ");

  if (nameWords.length >= 2) {
    return nameWords[0][0] + nameWords[1][0].toUpperCase();
  } else {
    return nameWords[0][0].toUpperCase();
  }
}

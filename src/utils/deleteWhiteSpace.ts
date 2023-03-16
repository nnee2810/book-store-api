export function deleteWhiteSpace(value = "") {
  return value.trim().replace(/ +/g, " ")
}

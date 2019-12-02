exports.mapEdgesToNodes = function(data) {
  if (!data.edges) return []
  return data.edges.map(extractNodeOf)
}
exports.capitalizeLetter = function(text, locale = "pl-PL") {
  if (typeof text === "string")
    return text
      .split(" ")
      .map(word => word.charAt(0).toLocaleUpperCase(locale) + word.slice(1))
      .join(" ")

  return text
}
function extractNodeOf(edge) {
  return edge.node
}

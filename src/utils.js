export function snakeToCamelCase(val) {
    return val.replace(/_([a-z])/g, function (g) { return g[1].toUpperCase(); });
}

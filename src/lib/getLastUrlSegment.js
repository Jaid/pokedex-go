import preventEnd from "prevent-end"
import url from "url"

export default urlString => {
  const urlPath = url.parse(urlString).path
  if (!urlPath) {
    return null
  }
  const normalizedUrlPath = preventEnd(urlPath, "/")
  return urlPath.split("/")
}
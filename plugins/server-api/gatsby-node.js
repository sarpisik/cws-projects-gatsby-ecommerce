const axios = require("axios")
const crypto = require("crypto")
const slugify = require("./util/slugify")

exports.sourceNodes = async (
  { actions: { createNode }, reporter },
  { sources }
) => {
  try {
    for (const { url, nodeType: type } of sources) {
      if (typeof url !== "string") {
        throw new Error("Url is not a string. Received " + url)
      }

      reporter.info("Start stream from " + url)

      const { data: stream } = await axios
        .get(url, {
          responseType: "stream",
        })
        .catch(onError)

      reporter.success("Start stream from " + url)

      reporter.warn("Start create nodes of " + type + "...")

      stream
        .pipe(require("JSONStream").parse("*"))
        .on("data", data =>
          createNode({
            children: [],
            id: data._id.toString(),
            ...data,
            slug: Object.keys(data.name).reduce(
              (result, language) => ({
                ...result,
                [language]: slugify(data.name[language]),
              }),
              {}
            ),
            parent: null,
            internal: {
              type,
              contentDigest: crypto
                .createHash(`md5`)
                .update(JSON.stringify(data))
                .digest(`hex`),
            },
          })
        )
        .on("end", () => reporter.success("Start create nodes of " + type))
        .on("error", onError)
    }
  } catch (error) {
    reporter.error(error.message)
    throw new Error(error)
  }
}

function onError(error) {
  throw new Error(error)
}

const axios = require("axios")
const crypto = require("crypto")
const slugify = require("./util/slugify")

exports.sourceNodes = async (
  { actions: { createNode }, reporter },
  { apiUrl, nodeType: type }
) => {
  try {
    if (typeof apiUrl !== "string") {
      throw new Error("apiUrl parameter is not a string.")
    }
    const JSONStream = require("JSONStream")
    const parser = JSONStream.parse("*")

    // Stream event handlers
    const onDataCallBack = data =>
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
    const onEndCallBack = () =>
      reporter.success("Finish create nodes of " + type)

    reporter.info("Start fetch data from url")
    const response = await axios.get(apiUrl, { responseType: "stream" })
    const stream = response.data
    reporter.success("Finish fetch data from url")

    reporter.info("Start create nodes of " + type)

    // Stream events
    parser.on("data", onDataCallBack)
    parser.on("end", onEndCallBack)
    stream.pipe(parser)
  } catch (error) {
    reporter.error(error.message)
    throw new Error(error)
  }
}

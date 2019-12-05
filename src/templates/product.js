import React from "react"
import { graphql } from "gatsby"
import SEO from "../components/seo"
import Layout from "../components/layout"

export const query = graphql`
  query ProductPageQuery($pageId: String, $language: String) {
    product: product(_id: { eq: $pageId }) {
      id
      name {
        translate(language: $language)
      }
      category {
        translate(language: $language)
      }
      description {
        translate(language: $language)
      }
      priceBrut {
        translate(language: $language)
      }
      priceNet {
        translate(language: $language)
      }
      salePriceBrut {
        translate(language: $language)
      }
      salePriceNet {
        translate(language: $language)
      }
      slug {
        translate(language: $language)
      }
      count
      photos
    }
  }
`

const ProductPage = ({ data: { product }, errors }) => {
  if (errors || !product) {
    console.error(errors)

    return <Layout>Error</Layout>
  }

  const {
    name,
    category,
    description,
    priceBrut,
    priceNet,
    salePriceBrut,
    salePriceNet,
    slug,
    count,
    photos = [],
  } = product

  return (
    <Layout>
      <SEO title={name.translate} />
      <h1>{name.translate}</h1>
      <p>{category.translate}</p>
      <p>{count}</p>
      <p dangerouslySetInnerHTML={createMarkup(description.translate)} />
      <p>{priceBrut.translate}</p>
      <p>{priceNet.translate}</p>
      <p>{salePriceBrut.translate}</p>
      <p>{salePriceNet.translate}</p>
      <p>{slug.translate}</p>
      {photos.map(url => (
        <img src={url} />
      ))}
    </Layout>
  )
}

// export default localize(ProductPage)
export default ProductPage

function createMarkup(__html) {
  return { __html }
}

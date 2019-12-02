import React, { useContext } from "react"
import { Link } from "gatsby"
import {
  AlternateLinksContext,
  LanguageContext,
} from "./hocs/withLanguageContext"
import { capitalizeLetter } from "../lib/helpers"

// import useSiteLinks from "./Hooks/use-site-links"

const Header = ({ siteTitle }) => {
  const alternateLinks = useContext(AlternateLinksContext) || []
  const language = useContext(LanguageContext) || "pl"
  // const links = useSiteLinks()

  return (
    <div>
      <h1>
        <Link to="/">{siteTitle}</Link>
      </h1>
      {/* <nav>
        <ul>{links.map(renderLink(language))}</ul>
      </nav> */}
      <div>
        <ul>{alternateLinks.map(renderLangLink)}</ul>
      </div>
    </div>
  )
}

export default Header

function renderLangLink(link, i) {
  return (
    <li key={i}>
      <Link to={link.path} hrefLang={link.language}>
        {link.language}
      </Link>
    </li>
  )
}

function renderLink(language) {
  return (link, index) => (
    <li key={index}>
      <Link to={link[language].path}>
        {capitalizeLetter(link[language].title)}
      </Link>
    </li>
  )
}

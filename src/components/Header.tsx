import * as React from "react";
import Coordinates from "./Coordinates";
import "../static/css/Header.css"
// import Clock from "./Clock";


export default function Header () {
    return (
    <header>
      {/*<Clock/>*/}
      <Coordinates />
    </header>
  )
}
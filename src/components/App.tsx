import * as React from "react";
import "../static/css/App.css"
import Header from "./Header";
import {CoordProvider} from "./CoordContext";
import WeatherDay from "./Weather";
import Main from "./Main";


export default function App() {

  return (
    <CoordProvider>
      <Header/>
      <Main/>
    </CoordProvider>
  )
}
import * as React from "react";
import {createContext, useState} from "react";

const CoordContext = createContext({
  coords: [0, 0],
  setNewCoords: (_coord: number[]) => {}
});

const CoordProvider = ({children}) => {

  const [coords, setCoords] = useState([56.8519, 60.6122])

  const setNewCoords = (_coord: number[]) => setCoords(_coord)
  return (
    <CoordContext.Provider value={{coords, setNewCoords}}>
      {children}
    </CoordContext.Provider>
  )
}

export {CoordContext, CoordProvider};

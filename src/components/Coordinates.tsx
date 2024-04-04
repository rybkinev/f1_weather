import * as React from "react";
import {useContext, useEffect, useState} from "react";
import NMap from "./NMap";
import {CoordContext} from "./CoordContext";


export default function Coordinates() {

  const { coords, setNewCoords } = useContext(CoordContext);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        setCoordinates([position.coords.latitude, position.coords.longitude])
      }, (error) => {
        console.error('Не удалось получить геолокацию');
        console.error(error);
      });
    }
    else {
      console.log("Геолокация не поддерживается вашим браузером.");
    }
  }, []);

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const openPopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };
  const setCoordinates = (newCoords: Array<number>) => {
    setIsPopupOpen(false);
    setNewCoords(newCoords);
  };

  return (
    <>
      <button onClick={openPopup}>
        Выбрать местоположение на карте
      </button>
      <NMap isOpen={isPopupOpen} onClose={setCoordinates} coord={coords}/>
    </>
  );
}
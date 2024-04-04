import * as React from "react";
import {YMaps, Map, Placemark, Button} from "@pbe/react-yandex-maps";
import {useState} from "react";
import "../static/css/NMap.css";
import Loader from "./Loader";

function NMap ({ isOpen, onClose, coord }) {

  if (!isOpen) {
    return null;
  }

  const [isLoading, setIsLoading] = useState(true);
  const [coords, setCoords] = useState(coord);

  return (
    <div id='nmap'>

      {isLoading && <Loader/>}

      <YMaps
        query={{
          lang: 'ru_RU',
          load: "package.full",
      }}

      >
        <Map
          defaultState={{
            center: coords,
            zoom: 10,
            controls: ["zoomControl"],
          }}
          modules={["control.ZoomControl"]}
          onClick={(e) => {
            const newCoord = e.get('coords');
            setCoords(newCoord);

            // e.geocode(newCoord).then((res) => {
            //   const firstGeoObject = res.geoObjects.get(0);
            //   const newAddress = [
            //     firstGeoObject.getLocalities().length
            //       ? firstGeoObject.getLocalities()
            //       : firstGeoObject.getAdministrativeAreas(),
            //     firstGeoObject.getThoroughfare() || firstGeoObject.getPremise(),
            //     firstGeoObject.getPremiseNumber()
            //   ].filter(Boolean).join(", ");
            //
            //     console.debug(newAddress);
            // }).catch((err) => {
            //   console.error(err);
            // });
          }}
          onLoad={() => setIsLoading(false)}
          style={{
            width: "60vw",
            height: "60vh",
          }}
        >
          <Button
            onClick={() => onClose(coords)}
            options={{maxWidth: 200}}
            data={{content: "OK"}}
            defaultState={{selected: true}}
          />
          <Placemark geometry={coords}/>
        </Map>
      </YMaps>
    </div>
  )
}

export default NMap;
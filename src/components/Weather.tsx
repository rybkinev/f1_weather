import * as React from "react";
import Loader from "./Loader";
import {useContext, useEffect, useRef, useState} from "react";
import {CoordContext} from "./CoordContext";
import axios from "axios";


function sameDate(date1: Date, date2: Date) {
  let _date1: Date = new Date(date1.toDateString());
  let _date2: Date = new Date(date2.toDateString());

  return _date1.getTime() === _date2.getTime();
}


export default () => {
  const apiKey: string = process.env.REACT_APP_API_KEY_WEATHER;

  const [isLoading, setIsLoading] = useState(true);
  const context = useContext(CoordContext)
  const [dataDay, setDataDay] = useState(null);
  const [dataWeek, setDataWeek] = useState([]);
  let [loadState, setLoadState] = useState(0);

  const [startIndex, setStartIndex] = useState(0);
  const [itemsToShow, setItemsToShow] = useState([]);
  const [itemsPerRow, setItemsPerRow] = useState(3);
  const [currentSelect, setCurrentSelect] = useState(0)

  const shiftItems = (index: number) => {

    // console.debug('New Click');

    const centrIndex: number = Math.round(itemsPerRow / 2) - 1;
    const maxStartIndex: number = dataWeek.length - itemsPerRow;

    let newDeltaIndex: number = startIndex;
    if (index > centrIndex) {
      newDeltaIndex = newDeltaIndex + index - centrIndex;
    } else if (newDeltaIndex && index < centrIndex) {
      newDeltaIndex = newDeltaIndex - (index ? (index) : centrIndex);
    }
    newDeltaIndex = Math.min(Math.max(newDeltaIndex, 0), maxStartIndex);

    setStartIndex(newDeltaIndex);
    setCurrentSelect(startIndex + index);

    // console.debug('index', index);
    // console.debug('centrIndex', centrIndex);
    // console.debug('startIndex', startIndex);
    // console.debug('newDeltaIndex', newDeltaIndex);
    // console.debug('maxStartIndex', maxStartIndex);

    // console.debug(dataWeek[currentSelect]);
  };

  useEffect(() =>{
    const updateItemsPerRow = () => {
      if (window.innerWidth < 1024) {
        setItemsPerRow(6);
      } else if (window.innerWidth < 1150) {
        setItemsPerRow(3);
      } else if (window.innerWidth < 1400) {
        setItemsPerRow(4);
      } else if (window.innerWidth < 1700) {
        setItemsPerRow(5);
      } else {
        setItemsPerRow(6);
      }
    };

    updateItemsPerRow();

    const handleResize = () => {
      updateItemsPerRow();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    // const itemsToShow = items.slice(startIndex, startIndex + 3);
    setItemsToShow(dataWeek.slice(startIndex, startIndex + itemsPerRow));
  }, [dataWeek, itemsPerRow, startIndex]);



  useEffect(() => {
    if (loadState >= 2) {
      loadState = 0;
      setIsLoading(false);
    }
    else {
      setIsLoading(true);
    }
  }, [loadState]);

  useEffect(() => {
    setLoadState(0);
    const lat: number = context.coords[0];
    const lon: number = context.coords[1];
    const urlWeek: string = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=ru`;
    const urlDay: string = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=ru`;
    // setIsLoading(true);
    axios.get(
      urlDay
    ).then((res) => {
      setDataDay(res.data);
      setLoadState(loadState++);
      // setIsLoading(false);
    }).catch((err) => {
      console.debug('axios error');
      console.debug(err);
      setLoadState(loadState++);
      // setIsLoading(false);
    });

    axios.get(
      urlWeek
    ).then((res) => {
      // setDataWeek(res.data);
      let currentDay: Date = new Date(0,0,0,0,0,0,0);
      let newData = [];
      res.data.list.forEach((el) => {
        const dateEl: Date = new Date(el.dt * 1000);
        if (!sameDate(currentDay, dateEl)) {
          currentDay = dateEl;
          const dt = {
            dt: el.dt,
            main: el.main,
            list: [el]
          }
          newData.push(dt);
        } else {
          const _el = newData[newData.length - 1];
          _el.list.push(el)

          _el.main.temp_min = Math.min(el.main.temp_min, _el.main.temp_min);
          _el.main.temp_max = Math.max(el.main.temp_max, _el.main.temp_max);
        }
      });
      console.debug('length week', newData.length);
      setDataWeek(newData);
      setLoadState(loadState++);
    }).catch((err) => {
      console.debug('axios error');
      console.debug(err);
      setLoadState(loadState++);
    });

  }, [context.coords])

  if (!isLoading && !dataDay) {
    return (
      <>
        <h1>Не удалось загрузить данные о погоде</h1>
        <h2>Попробуйте выбрать другое местоположение</h2>
      </>
    )
  }

  return (
    <>
      {isLoading && <Loader/>}
      {!isLoading &&
        <>
          <h1>Прогноз погоды в городе {dataDay.name}</h1>
          {/*{CurrentDay(dataDay)}*/}
          <CurrentDay data={dataDay}/>
          <div className='week-container'>
            <div className='weather-week'>
              {itemsToShow.map(
                (data, key) =>
                  <ForecastDay
                    key={key}
                    data={data}
                    index={key}
                    callback={shiftItems}
                    isActive={key === (currentSelect - startIndex)}
                  />
              )}
            </div>
            <div className='detail'>
              {dataWeek[currentSelect].list.map((detail, index) =>
                <DetailDay detail={detail} key={index}/>
              )}
            </div>

          </div>
        </>
      }
    </>
  )
}


const CurrentDay = ({data}) => {
  const date: Date = new Date(data.dt * 1000);
  const temp = data.main.temp.toFixed(0);
  const minTemp: number = data.main.temp_min.toFixed(0);
  const maxTemp: number = data.main.temp_max.toFixed(0);
  return (
    <div className='weather-current'>
      <div className='date'>
        {date.toLocaleString('ru', {
          month: 'short',
          day: 'numeric',
          weekday: 'short',
        })}, {date.toLocaleString('ru', {
        hour: 'numeric',
        minute: 'numeric',
      })}
      </div>
      <div className='descript'>
        {data.weather[0].description}
      </div>
      <div className='temp-min'>
        <p>{minTemp}&#176;</p>
        <p>мин.</p>
      </div>
      <div className='temp'>
        {temp}&#176;
      </div>
      <div className='temp-max'>
        <p>{maxTemp}&#176;</p>
        <p>макс.</p>
      </div>
      <div className='humidity'>
        {data.main.humidity}%
      </div>
      <div className='null'></div>
      <div className='pressure'>
        {data.main.pressure} гПа
      </div>
    </div>
  )
}

const ForecastDay = ({ index, data, callback, isActive }) => {
  const date = new Date(data.dt * 1000);
  // const temp = data.main.temp.toFixed(0);
  const minTemp = data.main.temp_min.toFixed(0);
  const maxTemp = data.main.temp_max.toFixed(0);
  return (
    <div className={`weather-day ${isActive ? 'active' : ''}`} onClick={() => callback(index)}>
      <div className='date'>
        {date.toLocaleString('ru', {
          month: 'short',
          day: 'numeric',
          weekday: 'short',
        })}
      </div>
      <div className='temp-min'>
        <p>{minTemp}&#176;</p>
        <p>мин.</p>
      </div>
      <div className='temp-max'>
        <p>{maxTemp}&#176;</p>
        <p>макс.</p>
      </div>
    </div>
  )
}

const DetailDay = ({detail}) => {
  // console.debug(detail);

  const date = new Date(detail.dt * 1000);

  return (
    <div className='at-time'>
      <p>{date.toLocaleString('ru', {
        hour: 'numeric',
        minute: 'numeric'
      })}
      </p>
      <p>
      {detail.main.temp.toFixed(0)}&#176;
      </p>
    </div>
  )
}
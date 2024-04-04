import * as React from "react";
import {useEffect, useState} from "react";
import "../static/css/Clock.css"

function Clock() {
  const [date, setNewDate] = useState(new Date());
  useEffect(() => {
    const timerID: NodeJS.Timeout = setInterval(
      () => setNewDate(new Date()),
      1000
    );

    return () => {
      clearInterval(timerID);
    }
  }, []);

  let optionsDate: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    // hour: 'numeric',
    // minute: 'numeric',
  }
  return (
    <p className='clock'>
      {date.toLocaleString(
        'ru',
        optionsDate
      )}
    </p>
  )
}
export default Clock;

// Core
import { useEffect, useState } from "react";
import moment from 'moment';
// Logic
import data from '../Data/index.json';

// ---------------------------------------------------------------------------------
const Events = () => {

  // Effects -----------------------------------------------------------------------
  useEffect(() => {

    const sortedData  = sortDataByKeys(data);
    dataProcessing(sortedData);
    
  }, []);

  // Functions ---------------------------------------------------------------------
  const castStringToInt = (string) => {
    return parseInt(string.replace(':', ''), 10);
  };

  const sortDataByKeys = (data) => {
    data.sort((a, b) => {
      if (castStringToInt(a.start) > castStringToInt(b.start)) return 1;
      if (castStringToInt(a.start) < castStringToInt(b.start)) return -1;
      
      if (a.duration < b.duration) return 1;
      if (a.duration > b.duration) return -1;
      return 0;
    });
    return data
  }

  const dataProcessing = (data) => {
    data.forEach((element) => console.log(element));
  }

  const eventOverlapsWithAnotherOrNot = () => {

  }

  // JSX ---------------------------------------------------------------------
  return <p>Hello world!</p>
};

export default Events;
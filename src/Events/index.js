
// Core
import { useEffect, useState, useRef } from "react";
import moment from 'moment';
// Components
import { Box, Container } from "@mui/material";
// Logic
import data from '../Data/index.json';

// ---------------------------------------------------------------------------------
const Events = () => {
  const refContainer = useRef();
  const [dimensions, setDimensions] = useState({ width:0, height: 0 });

  // Effects -----------------------------------------------------------------------
  useEffect(() => {

    // Container size
    if (refContainer.current) {
      setDimensions({
        width: refContainer.current.offsetWidth,
        height: refContainer.current.offsetHeight
      });
    }

    // Data process
    const sortedData  = sortDataByKeys(data);
    dataProcessing(sortedData);
    
  }, []);

  // Functions ---------------------------------------------------------------------
  const transformStringTimeToNumber = (string) => {
    const elements = string.split(':');
    const hours = parseInt(elements[0], 10);
    const minutes = parseInt(elements[1], 10)/60;
    return hours + minutes;
  };
  
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
    return data;
  };

  const dataProcessing = (data) => {
    data.forEach((element) => console.log(element));
  };

  const getTopPositionAndHeight = (start, duration) => {
    const top = ((transformStringTimeToNumber(start) - 9)/12) * dimensions.height;
    const height = duration/12 * dimensions.height;

    return {
      top: top,
      height: height
    };
  };

  console.log('dimensions', dimensions);

  // JSX ---------------------------------------------------------------------
  return (
    <Container
      ref={refContainer}
      maxWidth={false} 
      disableGutters 
      sx={{border: '1px solid blue', position: 'relative', height: '100vh'}}
    >
      <Box sx={{...defaultEventCss, ...getTopPositionAndHeight('15:00', 1)}}> Event : 12h00 </Box>
    </Container>
  );
};


const defaultEventCss = {
  border: '1px solid red', 
  position: 'absolute', 
  width: '100%'
};

export default Events;
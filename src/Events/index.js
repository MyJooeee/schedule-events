
// Core
import { useEffect, useState, useRef } from "react";
import moment from 'moment';
// Components
import { Box, Container } from "@mui/material";
// Logic
import events from '../Data/index.json';

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
    
  }, []);

  // Functions ---------------------------------------------------------------------
  const transformStringTimeToNumber = (string) => {
    const elements = string.split(':');
    const hours = parseInt(elements[0], 10);
    const minutes = parseInt(elements[1], 10)/60;
    return hours + minutes;
  };

  const getTopLeftHeightOnEvents = (start, duration) => {
    // Total over 12 hours
    const top = ((transformStringTimeToNumber(start) - 9)/12) * dimensions.height;
    // duration/12/60
    const height = (duration/720) * dimensions.height;

    console.log('duration', duration);
    console.log('duration/12', duration/12);
    console.log('dimensions.height', dimensions.height);
    console.log('height', height);

    return {
      top: `${top}px`,
      height: `${height}px`
    };
  };

  const setTopLeftHeightOnEvents = (events) => {
    let preparedEvents = []
    events.forEach((event) => {

       preparedEvents.push({...event, ...getTopLeftHeightOnEvents(event.start, event.duration)});

    });

    return preparedEvents;
  };

  const preparedEvents = setTopLeftHeightOnEvents(events);

  console.log('dimensions', dimensions);
  console.log('preparedEvents', preparedEvents);

  // JSX ---------------------------------------------------------------------
  return (
    <Container
      ref={refContainer}
      maxWidth={false} 
      disableGutters 
      sx={{border: '1px solid blue', position: 'relative', height: '100vh'}}
    >

      {preparedEvents && preparedEvents.map((preparedEvent, idx) => (
        <Box 
          key={idx} 
          sx={{...defaultEventCss, ...preparedEvent}}> 
          Start : {preparedEvent.start} - Duration : {preparedEvent.duration}
        </Box>
      ))}
    </Container>
  );
};

// CSS ----------------------------------------------------------------------
const defaultEventCss = {
  border: '1px solid red', 
  position: 'absolute', 
  width: '100%'
};

export default Events;
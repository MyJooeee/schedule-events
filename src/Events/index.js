
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

  const getTopLeftHeightOnEvents = (currentEvent, found) => {

    // At least 2 events start at the same time
    if (found.length > 1) {

    // The event is only starting at this time
    } else {
      // Total over 12 hours
      const top = Math.round(((transformStringTimeToNumber(currentEvent.start) - 9)/12) * dimensions.height);
      // duration/12/60
      const height = Math.round((currentEvent.duration/720) * dimensions.height);

      return {
        top: `${top}px`,
        left: '0px',
        height: `${height}px`
      };
    }
  
  };

  const setTopLeftHeightOnEvents = (events) => {
    // Copy of events
    let preparedEvents = []
    events.forEach((currentEvent) => {

      const found = events.filter((element) => element.start === currentEvent.start);

       preparedEvents.push({...currentEvent, ...getTopLeftHeightOnEvents(currentEvent, found)});

       // Do not reprocess those already treated
       if (found.length > 1) {
          const ids = found.map(e => e.id);
          console.log('ids', ids);
          preparedEvents = preparedEvents.filter((e) => !ids.includes(e));
       }

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
          sx={{
            ...defaultEventCss, 
            ...{
                top: preparedEvent.top, 
                left: preparedEvent.left, 
                height: preparedEvent.height
              }
          }}> 
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
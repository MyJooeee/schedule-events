
// Core
import { useEffect, useState, useRef } from "react";
import moment, { duration } from 'moment';
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
  const stringTimeToHours = (string) => {
    const elements = string.split(':');
    const hours = parseInt(elements[0], 10);
    const minutes = parseInt(elements[1], 10)/60;
    return hours + minutes;
  };

  // Set top, left and height on one event
  const getTopLeftHeightOnEvent = (event, nbFound = 1, index = 0) => {

    // Total over 12 hours
    const top = Math.round(((stringTimeToHours(event.start) - 9)/12) * dimensions.height);
    // duration/12/60
    const height = Math.round((event.duration/720) * dimensions.height);

    let left = 0;
    if (nbFound > 1 && index > 0) {
      left = Math.round((index/nbFound) * dimensions.width);
    }

    return {
      id: event.id,
      start: event.start,
      duration: event.duration,
      top: `${top}px`,
      left: `${left}px`,
      height: `${height}px`,
      width: Math.round(dimensions.width/nbFound)
    };
  
  };

  const checkIfEventsOverlaps = (currentEvent) => {

    const startCurrentEvent = stringTimeToHours(currentEvent.start);
    const endCurrentEvent = Math.round(stringTimeToHours(currentEvent.start) + currentEvent.duration/60);

    const founds = events.filter((element) => {
      
      if (element.start === currentEvent.start) return true;

      const startElement = stringTimeToHours(element.start);
      const endElement = Math.round(stringTimeToHours(element.start) + element.duration/60);

      
      if (startCurrentEvent < endElement && endCurrentEvent > endElement) {
        console.log('je passe ici');
        return true;
      }

      if (endCurrentEvent > startElement && startCurrentEvent < startElement) {
        console.log('je passe là');
        console.log('event', currentEvent);
        console.log('startCurrentEvent', startCurrentEvent);
        console.log('endCurrentEvent', endCurrentEvent);
        return true;
      }

      // Inclusion
      if (startCurrentEvent <= startElement && endCurrentEvent >= endElement) {
        console.log('je passe dans le dernier');
        return true;
      }


      return false;
    });

    console.log('founds', founds);
    return founds;
  }

  const setTopLeftHeightOnEvents = (events) => {
    // Copy of events
    let preparedEvents = [];
    let idsTreated = [];
    events.forEach((currentEvent) => {

      console.log('currentEvent.id', currentEvent.id);
      idsTreated = [...new Set(idsTreated.flat(1))];

      if (!idsTreated.includes(currentEvent.id)) {
        const founds = checkIfEventsOverlaps(currentEvent);
        const nbFound = founds.length;
        if (nbFound > 1) {
          
          const ids = founds.map((e) => e.id);
          idsTreated.push(ids);
  
          founds.forEach((found, idx) => {
            preparedEvents.push(getTopLeftHeightOnEvent(found, nbFound, idx));
            
          });
  
        } else {
          preparedEvents.push(getTopLeftHeightOnEvent(currentEvent));
        }
      }
    });

    console.log('idsTreated', idsTreated);

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
                height: preparedEvent.height,
                width: preparedEvent.width
              }
          }}> 
          {preparedEvent.id} | {preparedEvent.start} | {preparedEvent.duration}
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
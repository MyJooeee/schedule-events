
// Core
import { useEffect, useState, useRef } from "react";
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


  const stringTimeToHours = (string) => {
    const elements = string.split(':');
    const hours = parseInt(elements[0], 10);
    const minutes = parseInt(elements[1], 10)/60;
    return hours + minutes;
  };

  // Set top, left and height on one event
  const getTopLeftHeightOnEvent = (event, nbOverlaps = 1, index = 0) => {

    // Total over 12 hours : 09:00 am to 09:00 pm
    const top = Math.round(((stringTimeToHours(event.start) - 9)/12) * dimensions.height);
    // duration/12/60
    const height = Math.round((event.duration/720) * dimensions.height);

    let left = 0;
    if (nbOverlaps > 1 && index > 0) {
      left = Math.round((index/nbOverlaps) * dimensions.width);
    }

    const width = Math.round(dimensions.width/nbOverlaps) - 10 // horizontal space between events

    return {
      id: event.id,
      start: event.start,
      duration: event.duration,
      top: `${top}px`,
      left: `${left}px`,
      height: `${height}px`,
      width: `${width}px` 
    };
  
  };

  const checkIfEventOverlaps = (currentEvent) => {

    const startCurrentEvent = stringTimeToHours(currentEvent.start);
    const endCurrentEvent = stringTimeToHours(currentEvent.start) + currentEvent.duration/60;

    const founds = events.filter((element) => {
      
      // If currentEvent starts to the same time with another event
      if (element.start === currentEvent.start) return true;

      const startElement = stringTimeToHours(element.start);
      const endElement = stringTimeToHours(element.start) + element.duration/60;
      
      // If event is included in currentEvent
      if (startCurrentEvent <= startElement && endCurrentEvent >= endElement) {
        return true;
      }
      
      // If currentEvent is included in event
      if (startCurrentEvent > startElement && endCurrentEvent < endElement) {
        return true;
      }

      // If part of the start of the currentEvent overlaps with another event
      if (startCurrentEvent < endElement && endCurrentEvent > endElement) {
        return true;
      }
      // If part of the end of the currentEvent overlaps with another event
      if (endCurrentEvent > startElement && startCurrentEvent < startElement) {
        return true;
      }

      // If no matching with rules
      return false;
    });

    return founds;
  }

  const setTopLeftHeightOnEvents = (events) => {
    let preparedEvents = [];
    let idsTreated = [];
    events.forEach((currentEvent) => {

      // Do not process events already processed
      if (!idsTreated.includes(currentEvent.id)) {
        const overlaps = checkIfEventOverlaps(currentEvent);
        const nbOverlaps = overlaps.length;
        // Overlap between at least two events
        if (nbOverlaps > 1) {
          const ids = overlaps.map((e) => e.id);
          idsTreated.push(...ids);
  
          overlaps.forEach((eventOverlaps, index) => {
            preparedEvents.push(getTopLeftHeightOnEvent(eventOverlaps, nbOverlaps, index));
          });
        
        // The event does not overlap with other events
        } else {
          preparedEvents.push(getTopLeftHeightOnEvent(currentEvent));
        }
      }
    });

    return preparedEvents;
  };

  const removeDuplicatesObject = (events) => {
    const uniqueObject = {};
    events.forEach(item => {
      uniqueObject[item.id] = item;
    });
    return Object.values(uniqueObject);
  }
  
  // Clean events (i have seen 2 duplicates, open to discuss on this :))
  const cleanedEvents = removeDuplicatesObject(events)
  // Sort events
  const sortedEvents = sortDataByKeys(cleanedEvents);
  // Set top, left, height and width for each events
  const preparedEvents = setTopLeftHeightOnEvents(sortedEvents);


  // JSX ---------------------------------------------------------------------
  return (
    <Container
      ref={refContainer}
      maxWidth={false} 
      disableGutters 
      sx={{border: '1px solid red', position: 'relative', height: '100vh', p:0}}
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
          {preparedEvent.start}, {preparedEvent.duration}
        </Box>
      ))}
    </Container>
  );
};

// CSS ----------------------------------------------------------------------
const defaultEventCss = {
  border: '1px solid blue', 
  position: 'absolute'
};

export default Events;
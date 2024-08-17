import Button from "../Button";
import { Slideover } from "../Headless";
import Lucide from "../Lucide";
import { useEffect, useState } from "react";
import {API_BASE_URL} from "../../utils/variables";

interface Visitor {
  v_name: string;
  selectedday: string;
  selectedtimeslot: string;
  selectedexhibitor: string;
  v_email: string;
  v_id: number;
}

interface RescheduleButtonProps {
  visitor: Visitor;
  existingEvents: Visitor[]; // Array of existing events
  onReschedule: (visitorId: number, newDate: string, newTime: string, visitorEmail: string) => void; // Add visitorEmail to the onReschedule function
}
const RescheduleButton: React.FC<RescheduleButtonProps> = ({ visitor, existingEvents, onReschedule }) => {
  const [showRescheduleSlideover, setShowRescheduleSlideover] = useState<boolean>(false);
  const [newDate, setNewDate] = useState<string>("");
  const [newTime, setNewTime] = useState<string>("");

  // Calculate tomorrow's date
  const today = new Date();
  today.setDate(today.getDate() + 1); // Add one day to today's date
  const formattedTomorrow = today.toISOString().split('T')[0]; // Format as YYYY-MM-DD for input element

  // Calculate the date three days from today
  const threeDaysFromNow = new Date(today);
  threeDaysFromNow.setDate(today.getDate() + 2); // Add two more days to get three days from today
  const formattedThreeDaysFromNow = threeDaysFromNow.toISOString().split('T')[0]; // Format as YYYY-MM-DD for input element


  // Get existing events for the selected date
  const getExistingEventsForDate = (date: string) => {
    return existingEvents.filter(event => event.selectedday === date);
  };

  // Generate time options based on existing events
  const generateTimeOptions = (existingEvents: Visitor[], selectedDate: string) => {
    const allTimeOptions = [];
    const existingTimes = existingEvents.map(event => event.selectedtimeslot);
    for (let hour = 9; hour <= 15; hour++) {
      for (let minute of ['00', '30']) {
        const formattedTime = `${hour < 10 ? '0' + hour : hour}:${minute}`;
        if (!existingTimes.includes(formattedTime)) {
          allTimeOptions.push(formattedTime);
        }
      }
    }
    return allTimeOptions;
  };

  useEffect(() => {
    console.log("New date:", newDate);
    if (newDate !== "") {
      const eventsForSelectedDate = getExistingEventsForDate(newDate);
      console.log("Events for selected date:", eventsForSelectedDate);
      const timeOptions = generateTimeOptions(eventsForSelectedDate, newDate);
      console.log("Time options:", timeOptions);
      setAvailableTimes(timeOptions);
    }
  }, [newDate, existingEvents]);
  

  const [availableTimes, setAvailableTimes] = useState<string[]>([]);

  const handleReschedule = (visitorId: number, newDate: string, newTime: string, visitorEmail: string) => {
    fetch(API_BASE_URL+"/rescheduleVisitor", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ visitorId, newDate, newTime, visitorEmail }),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Failed to reschedule visitor");
        }
      })
      .then((data) => {
        console.log(data.message); // Log the message from the backend
        // You can perform any additional actions here after successful reschedule
      })
      .catch((error) => {
        console.error("Error rescheduling visitor:", error);
      });
      onReschedule(visitor.v_id, newDate, newTime, visitor.v_email);
      setShowRescheduleSlideover(false); // Close the slide over after reschedule
  };
  

  return (
    <>
      <Button
        variant="outline-secondary"
        className="px-2 py-1 ml-auto"
        onClick={() => setShowRescheduleSlideover(true)}
      >
        <Lucide icon="Calendar" className="w-4 h-4 mr-2" /> Reschedule
      </Button>
      <Slideover open={showRescheduleSlideover} onClose={() => setShowRescheduleSlideover(false)}>
        <Slideover.Panel>
          <a
            onClick={() => setShowRescheduleSlideover(false)}
            className="absolute top-0 left-0 right-auto mt-4 -ml-12"
            href="#"
          >
            <Lucide icon="X" className="w-8 h-8 text-slate-400" />
          </a>
          <Slideover.Title>
            <h2 className="mr-auto text-base font-medium">Reschedule Appointment</h2>
          </Slideover.Title>
          <Slideover.Description>
            <div className="mt-3">
              <p><strong>Current Appointment Details:</strong></p>
              <p><strong>Name:</strong> {visitor.v_name}</p>
              <p><strong>Date:</strong> {visitor.selectedday}</p>
              <p><strong>Time:</strong> {visitor.selectedtimeslot}</p>
              <p><strong>Exhibitor:</strong> {visitor.selectedexhibitor}</p><br/>
            </div>
            <div className="mt-3">
              <label htmlFor="reschedule-date">Select new date:</label>
              <input 
              type="date" 
              id="reschedule-date" 
              onChange={(e) => setNewDate(e.target.value)} 
              min={formattedTomorrow} 
              max={formattedThreeDaysFromNow}/>
            </div><br/>
            {/* <div className="mt-3">
              <label htmlFor="reschedule-time">Select new time:</label>
              <input 
              type="time" 
              id="reschedule-time" 
              onChange={(e) => setNewTime(e.target.value)} />
            </div> */}
            <div className="mt-3">
              <label htmlFor="reschedule-time">Select new time:</label>
              <select id="reschedule-time" onChange={(e) => setNewTime(e.target.value)}>
                <option value="">Select Time</option>
                {availableTimes.map((formattedTime) => (
                  <option 
                    key={formattedTime}
                    value={formattedTime}
                  >
                    {formattedTime}
                  </option>
                ))}
              </select>
            </div>
          </Slideover.Description>
          <Slideover.Footer>
            <Button variant="outline-secondary" onClick={() => setShowRescheduleSlideover(false)} className="w-20 mr-1">
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={() => handleReschedule(visitor.v_id, newDate, newTime, visitor.v_email)}
              className="w-25"
              >Reschedule
              </Button>

          </Slideover.Footer>
        </Slideover.Panel>
      </Slideover>
    </>
  );
};

export default RescheduleButton;

import Button from "../Button";
import { Slideover } from "../Headless";
import Lucide from "../Lucide";
import { useState } from "react";
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
  onReschedule: (visitorId: number, newDate: string, newTime: string) => void;
}

const RescheduleButton: React.FC<RescheduleButtonProps> = ({ visitor, onReschedule }) => {
  const [showRescheduleSlideover, setShowRescheduleSlideover] = useState<boolean>(false);
  const [newDate, setNewDate] = useState<string>("");
  const [newTime, setNewTime] = useState<string>("");

  const handleReschedule = (visitorId: number, newDate: string, newTime: string) => {
    fetch(API_BASE_URL+"/rescheduleVisitor", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ visitorId, newDate, newTime }),
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
      onReschedule(visitor.v_id, newDate, newTime);
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
              <input type="date" id="reschedule-date" onChange={(e) => setNewDate(e.target.value)} />
            </div><br/>
            <div className="mt-3">
              <label htmlFor="reschedule-time">Select new time:</label>
              <input type="time" id="reschedule-time" onChange={(e) => setNewTime(e.target.value)} />
            </div>
          </Slideover.Description>
          <Slideover.Footer>
            <Button variant="outline-secondary" onClick={() => setShowRescheduleSlideover(false)} className="w-20 mr-1">
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={() => handleReschedule(visitor.v_id, newDate, newTime)}
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

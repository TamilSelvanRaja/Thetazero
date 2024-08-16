import Button from "../Button";
import { Slideover } from "../Headless";
import LoadingIcon from "../LoadingIcon";
import Lucide from "../Lucide";
import { useEffect, useState } from "react";
import TinySlider from "../TinySlider";

interface Visitor {
  v_name: string;
  app_date: string;
  app_time: string;
  e_company: string;
  v_email: string;
  v_id: number;
  appointment_id: number;
}

interface RescheduleButtonProps {
  visitor: Visitor;
  onReschedule: (visitorId: number,appointmentId: number, newDate: string, newTime: string, visitorEmail: string) => void;
  disabled: boolean; // Add disabled prop
}


const RescheduleButton: React.FC<RescheduleButtonProps> = ({ visitor, onReschedule, disabled }) => {
  const [showRescheduleSlideover, setShowRescheduleSlideover] = useState<boolean>(false);
  const [newDate, setNewDate] = useState<string>("");
  const [newTime, setNewTime] = useState<string>("");
  const [rescheduled, setRescheduled] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false); // Add loading state


  useEffect(() => {
    fetchAppointmentStatus();
  }, []);

  const fetchAppointmentStatus = () => {
    fetch(`http://creat.ink/Server/getAppointmentStatus/${visitor.appointment_id}`, {
      method: "GET",
      credentials: "include",
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error("Network response was not ok.");
      })
      .then((data) => {
        setRescheduled(data.status === 3); // Assuming status 3 means rescheduled
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };

  const handleReschedule = (visitorId: number, appointmentId: number, newDate: string, newTime: string, visitorEmail: string) => {
    setLoading(true); // Set loading state to true when button is clicked
    fetch("http://creat.ink/Server/rescheduleVisitor", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ visitorId, appointmentId, newDate, newTime, visitorEmail }),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Failed to reschedule visitor");
        }
      })
      .then((data) => {
        console.log(data.message);
        setRescheduled(true);
        setShowRescheduleSlideover(false);
        onReschedule(visitorId, appointmentId, newDate, newTime, visitorEmail); // Invoke callback to update parent component
      })
      .catch((error) => {
        console.error("Error rescheduling visitor:", error);
      })
      .finally(() => {
        setLoading(false); // Set loading state back to false after the operation completes
      });
  };

  const today = new Date();
  today.setDate(today.getDate() + 1);
  const formattedTomorrow = today.toISOString().split('T')[0];

  const threeDaysFromNow = new Date(today);
  threeDaysFromNow.setDate(today.getDate() + 2);
  const formattedThreeDaysFromNow = threeDaysFromNow.toISOString().split('T')[0];

  const disabledTimes = ["10:00", "11:00", "12:00", "12:30"];

  const timeOptions = [];
  for (let hour = 9; hour <= 15; hour++) {
    for (let minute of ['00', '30']) {
      const formattedTime = `${hour < 10 ? '0' + hour : hour}:${minute}`;
      if (!disabledTimes.includes(formattedTime)) {
        timeOptions.push(formattedTime);
      }
    }
  }

  return (
    <>
      {rescheduled ? (
  <Button variant="outline-secondary" disabled className="px-2 py-1 ml-auto">
    <Lucide icon="Check" className="w-4 h-4 mr-2 text-orange-500" /> 
    <span className="text-pending ">
      Rescheduled  
    </span>
  </Button>
) : (
  <Button
    variant="outline-secondary"
    className="px-2 py-1 ml-auto"
    onClick={() => setShowRescheduleSlideover(true)}
    disabled={disabled || loading} // Use disabled prop
  >
    {loading ? (
      <LoadingIcon icon="three-dots" color="1a202c" className="w-4 h-4" />
    ) : (
      <>
        <Lucide icon="Calendar" className="w-4 h-4 mr-2" /> 
        Reschedule
      </>
    )}
  </Button>
)}

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
          {/* Slider Start */}
          <div className="mx-0">
                <TinySlider options={{
                                controls: false,
                              }}>
                    <div className="h-32 px-2">
                        <div className="h-full rounded-md bg-slate-100 dark:bg-darkmode-400">
                            <h5 className="flex items-center justify-center h-full text-2xl font-medium">
                            <strong>Current Appointment Details</strong>
                            </h5>
                        </div>
                    </div>
                    
                </TinySlider>
              </div><br/>
              {/* Slider End */}
          <Slideover.Description>
            <div className="mt-3">
              {/* <p><strong>Current Appointment Details:</strong></p> */}
              <p><strong>Name:</strong> {visitor.v_name}</p>
              <p><strong>Date:</strong> {new Date(visitor.app_date).toISOString().split('T')[0]}</p>
              {/* <p><strong>Date:</strong> {visitor.app_date}</p> */}
              <p><strong>Time:</strong> {visitor.app_time.slice(0, 5)}</p>
              <p><strong>Exhibitor:</strong> {visitor.e_company}</p><br/>
            </div>
            <div className="mt-3">
              <label htmlFor="reschedule-date">Select new date:</label><br></br>
              <input 
                type="date" 
                id="reschedule-date" 
                onChange={(e) => setNewDate(e.target.value)} 
                min={formattedTomorrow} 
                max={formattedThreeDaysFromNow} 
              />
            </div><br/>
            <div className="mt-3">
              <label htmlFor="reschedule-time">Select new time:</label><br></br>
              <select id="reschedule-time" onChange={(e) => setNewTime(e.target.value)}>
                <option value="">Select Time</option>
                {timeOptions.map((formattedTime) => (
                  <option key={formattedTime} value={formattedTime}>
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
              variant="soft-success"
              onClick={() => handleReschedule(visitor.v_id, visitor.appointment_id, newDate, newTime, visitor.v_email)}
              className="w-25"
              disabled={loading || (!newDate || !newTime)}
            >
              {loading ? (
                <LoadingIcon icon="three-dots" color="1a202c" className="w-4 h-4" />
              ) : (
                "Reschedule"
              )}
            </Button>
          </Slideover.Footer>
        </Slideover.Panel>
      </Slideover>
    </>
  );
};

export default RescheduleButton;

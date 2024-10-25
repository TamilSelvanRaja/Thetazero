import "@fullcalendar/react/dist/vdom";
import Lucide from "../../base-components/Lucide";
import { Tab } from "../../base-components/Headless";
import Button from "../../base-components/Button";
import Calendar from "../../components/Calendar";
import { useEffect, useState } from "react";
import {API_BASE_URL} from "../../utils/variables";

// Define the type for visitor data
interface Visitor {
  v_name: string;
  selectedday: string;
  selectedtimeslot: string;
  selectedexhibitor: string;
  v_email: string; 
  v_id: number; // Add visitor ID to the Visitor interface
}



function Main() {
  const [visitorData, setVisitorData] = useState<Visitor[]>([]); // Specify Visitor[] type
  const [emailSent, setEmailSent] = useState<boolean>(false); // New state variable

  useEffect(() => {
    // Fetch visitor data from backend when component mounts
    fetchVisitorData();
  }, []);

  const fetchVisitorData = () => {
    fetch(API_BASE_URL+"/calendarData", {
      method: "GET",
      credentials: "include", // Include credentials for session
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error("Network response was not ok.");
      })
      .then((data) => {
        // Set visitor data received from backend
        setVisitorData(data.calendarData);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };

  const handleApprove = (visitorId: number, visitorEmail: string) => {
    console.log("Visitor ID:", visitorId);
    fetch(API_BASE_URL+"/approveVisitor", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ visitorId: visitorId, visitorEmail: visitorEmail }), 
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Failed to approve visitor");
        }
      })
      .then((data) => {
        console.log(data.message); // Log the message from backend
        fetchVisitorData(); // Fetch updated visitor data
        setEmailSent(true); // After successful email sending
      })
      .catch((error) => {
        console.error("Error approving visitor:", error);
      });
  };
  

  return (
    <>
      <div className="flex flex-col items-center mt-8 intro-y sm:flex-row">
        <h2 className="mr-auto text-lg font-medium">Calendar</h2>
        <div className="flex w-full mt-4 sm:w-auto sm:mt-0">
          <Button variant="primary" className="mr-2 shadow-md">
            <Lucide icon="FileText" className="w-4 h-4 mr-2" /> Event Reports
          </Button>

        </div>
      </div>
      <div className="grid grid-cols-12 gap-5 mt-5">
        {/* BEGIN: Calendar Side Menu */}
        <Tab.Group className="col-span-12 xl:col-span-4 2xl:col-span-3">
          <div className="p-2 box intro-y">
            <Tab.List variant="pills">
              <Tab>
                <Tab.Button className="w-full py-2" as="button">
                  Event List
                </Tab.Button>
              </Tab>
            </Tab.List>
          </div>
          <Tab.Panels className="mt-5 intro-y">
            <Tab.Panel>
              {visitorData.length > 0 && visitorData.map((visitor, index) => (
                <div
                  key={index}
                  className="p-5 mt-5 cursor-pointer event box first:mt-0"
                >
                  {/* Visitor data */}
                  <div>{visitor.v_name}</div>
                  <div>{visitor.selectedday}</div>
                  <div>{visitor.selectedtimeslot}</div>
                  <div>{visitor.selectedexhibitor}</div><br/>

                  {/*  Buttons */}
                  <div className="flex">
                    <Button variant="outline-secondary" className="px-2 py-1">
                      <Lucide icon="Calendar" className="w-4 h-4 mr-2" />{" "}
                      Reschedule
                    </Button>
                    <Button
                      variant="outline-secondary"
                      className="px-2 py-1 ml-auto"
                      onClick={() => {
                        console.log("Visitor ID:", visitor.v_id);
                        console.log("Visitor Email:", visitor.v_email);
                        handleApprove(visitor.v_id, visitor.v_email);
                      }}                      >
                      <Lucide icon="User" className="w-4 h-4 mr-2" />
                      {emailSent ? "Approved" : "Approve"}
                    </Button>
                  </div>
                </div>
              ))}
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
        {/* END: Calendar Side Menu */}
        {/* BEGIN: Calendar Content */}
        <div className="col-span-12 xl:col-span-8 2xl:col-span-9">
          <div className="p-5 box">
            <Calendar />
          </div>
        </div>
        {/* END: Calendar Content */}
      </div>
    </>
  );
}

export default Main;

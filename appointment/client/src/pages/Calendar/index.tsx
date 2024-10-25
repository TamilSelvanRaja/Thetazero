import "@fullcalendar/react/dist/vdom";
import Lucide from "../../base-components/Lucide";
import { Tab } from "../../base-components/Headless";
import Button from "../../base-components/Button";
import Calendar from "../../components/Calendar";
import { useEffect, useState } from "react";
import ApproveButton from "../../base-components/ApproveButton";
import RejectButton from "../../base-components/RejectButton";
import * as XLSX from "xlsx";
import RescheduleButton from "../../base-components/RescheduleButton";
import {API_BASE_URL} from "../../utils/variables";

interface Visitor {
  v_id: number;
  v_name: string;
  v_email: string;
  app_date: string;
  app_time: string;
  e_company: string;
  description: string;
  appointment_id: number;
  status: number;
}


function Main() {
  const [visitorData, setVisitorData] = useState<Visitor[]>([]);
  const [disabledButtons, setDisabledButtons] = useState<{ [key: number]: boolean }>({}); // Add disabledButtons state

  useEffect(() => {
    fetchVisitorData();
  }, []);

  const fetchVisitorData = () => {
    fetch(API_BASE_URL+"/calendarData", {
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
        setVisitorData(data.calendarData);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(visitorData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Appointments");
    XLSX.writeFile(workbook, "appointments.xlsx");
  };

  const handleButtonDisable = (appointmentId: number) => {
    setDisabledButtons((prevDisabledButtons) => ({
      ...prevDisabledButtons,
      [appointmentId]: true,
    }));
  };

  return (
    <>
      <div className="flex flex-col items-center mt-8 intro-y sm:flex-row">
        <h2 className="mr-auto text-lg font-medium">Calendar</h2>
        <div className="flex w-full mt-4 sm:w-auto sm:mt-0">
          <Button variant="primary" className="mr-2 shadow-md" onClick={exportToExcel}>
            <Lucide icon="FileText" className="w-4 h-4 mr-2" /> Export Excel
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-12 gap-5 mt-5">
        <Tab.Group className="col-span-12 xl:col-span-4 2xl:col-span-3">
          <div className="p-2 box intro-y">
            <Tab.List variant="pills">
              <Tab>
                <Tab.Button className="w-full py-2" as="button">
                  Recent Event List
                </Tab.Button>
              </Tab>
            </Tab.List>
          </div>
          <Tab.Panels className="mt-5 intro-y overflow-auto" style={{ maxHeight: "calc(100vh - 200px)" }}>
            <Tab.Panel>
              {visitorData.length > 0 && visitorData.map((visitor, index) => (
                <div key={index} className="p-5 mt-5 cursor-pointer event box first:mt-0">
                  <div>{visitor.v_name}</div>
                  <div>{new Date(visitor.app_date).toISOString().split('T')[0]}</div>
                  {/* <div>{visitor.app_date}</div> */}
                  <div>{visitor.app_time.slice(0, 5)}</div>
                  <div>{visitor.e_company}</div>
                  <div>{visitor.description}</div><br/>
                  <div className="flex">
                    <RescheduleButton
                      visitor={visitor}
                      onReschedule={(visitorId, newDate, newTime) => {
                        console.log("Reschedule:", visitorId, newDate, newTime);
                        handleButtonDisable(visitor.appointment_id); // Disable buttons for this appointment
                      }}
                      disabled={disabledButtons[visitor.appointment_id]} // Use disabledButtons state
                    />
                    <RejectButton
                      visitorId={visitor.v_id}
                      visitorEmail={visitor.v_email}
                      appointmentId={visitor.appointment_id}
                      status={visitor.status}
                      onReject={() => {
                        fetchVisitorData();
                        handleButtonDisable(visitor.appointment_id); // Disable buttons for this appointment
                      }}
                      disabled={disabledButtons[visitor.appointment_id]} // Use disabledButtons state
                    />
                    <ApproveButton
                      visitorId={visitor.v_id}
                      visitorEmail={visitor.v_email}
                      appointmentId={visitor.appointment_id}
                      status={visitor.status}
                      onApprove={() => {
                        fetchVisitorData();
                        handleButtonDisable(visitor.appointment_id); // Disable buttons for this appointment
                      }}
                      disabled={disabledButtons[visitor.appointment_id]} // Use disabledButtons state
                    />
                  </div>
                </div>
              ))}
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
        <div className="col-span-12 xl:col-span-8 2xl:col-span-9">
          <div className="p-5 box">
            <Calendar />
          </div>
        </div>
      </div>
    </>
  );
}

export default Main;

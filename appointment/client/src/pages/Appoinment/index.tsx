import React, { useEffect, useState } from "react";
import Button from "../../base-components/Button";
import Table from "../../base-components/Table";
import * as XLSX from "xlsx";
import FormSwitch from "../../base-components/Form/FormSwitch";
import ApproveButton from "../../base-components/ApproveButton";
import RejectButton from "../../base-components/RejectButton";
import Lucide from "../../base-components/Lucide";
import RescheduleButton from "../../base-components/RescheduleButton";
import {API_BASE_URL} from "../../utils/variables";
interface Appointment {
  v_id: number;
  v_name: string;
  v_phone: string;
  v_email: string;
  app_date: string;
  app_time: string;
  e_company: string;
  appointment_id: number;
  status_description: string;
}

function Main() {
  const [appointmentData, setAppointmentData] = useState<Appointment[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [showApprovedOnly, setShowApprovedOnly] = useState<boolean>(false);
  const [disabledButtons, setDisabledButtons] = useState<{ [key: number]: boolean }>({}); // Add disabledButtons state

  useEffect(() => {
    fetchAppointmentData();
  }, []);


  const fetchAppointmentData = () => {
    fetch(API_BASE_URL+"/appointmentData", {
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
        setAppointmentData(data.appointmentData);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(appointmentData);
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

  // Filter appointment data based on the search term and approved status
  const filteredAppointmentData = appointmentData.filter((appointment) =>
    appointment.v_phone.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (!showApprovedOnly || appointment.status_description === "Approved")
  );

  return (
    <>
      <div className="flex flex-col items-center mt-8 intro-y sm:flex-row">
        <h2 className="mr-auto text-lg font-medium">Appointments</h2>
        {/* Search Input */}
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by Phone"
          className="border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:border-blue-500"
        />

        {/* Checkbox to filter approved visitors */}
        {/* <label className="border border-gray-400 rounded-md py-2 px-4 ml-4 flex items-center space-x-2">
          <input
            type="checkbox"
            checked={showApprovedOnly}
            onChange={(e) => setShowApprovedOnly(e.target.checked)}
            className="form-checkbox h-4 w-4 text-primary"
          />
          <span className="text-sm text-gray-600">Show Approved</span>
        </label> */}

        {/* Switch to filter approved visitors */}
        <div className="flex items-center ml-4 mt-0  border border-gray-400 rounded-md py-2 px-4">
          <FormSwitch>
            <FormSwitch.Input
              id="checkbox-switch-7"
              type="checkbox"
              checked={showApprovedOnly}
              onChange={(e) => setShowApprovedOnly(e.target.checked)}
            />
            <FormSwitch.Label htmlFor="checkbox-switch-7">
              Approved Visitors
            </FormSwitch.Label>
          </FormSwitch>
        </div>
        
        {/* Button to export data to Excel */}
        <Button
          variant="primary"
          className="ml-4 shadow-md"
          onClick={exportToExcel}
        >
        <Lucide icon="FileText" className="w-4 h-4 mr-2"/>Export Excel
        </Button>

      </div>
      <div className="overflow-auto intro-y lg:overflow-visible">
        <Table className="border-spacing-y-[10px] border-separate overflow-auto" style={{ maxHeight: "calc(100vh - 200px)" }}>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>ID</Table.Th>
              <Table.Th>Name</Table.Th>
              <Table.Th>Phone</Table.Th>
              <Table.Th>Email</Table.Th>
              <Table.Th>Appointment Date</Table.Th>
              <Table.Th>Appointment Time</Table.Th>
              <Table.Th>Exhibitor</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th>Action</Table.Th>
              {/* <Table.Th>Approv</Table.Th>
              <Table.Th>Reject</Table.Th> */}
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
          {filteredAppointmentData.map((appointment) => (
              <Table.Tr key={appointment.appointment_id}>
                <Table.Td>{appointment.appointment_id}</Table.Td>
                <Table.Td>{appointment.v_name}</Table.Td>
                <Table.Td>{appointment.v_phone}</Table.Td>
                <Table.Td>{appointment.v_email}</Table.Td>
                <Table.Td>{new Date(appointment.app_date).toISOString().split('T')[0]}</Table.Td>
                <Table.Td>{appointment.app_time.slice(0, 5)}</Table.Td>
                <Table.Td>{appointment.e_company}</Table.Td>
                <Table.Td>{appointment.status_description}</Table.Td>
                <Table.Td>
                  {appointment.status_description !== "Rejected" && appointment.status_description !== "Approved"&& appointment.status_description !== "Rescheduled"&& (
                    <>
                      <RescheduleButton
                      visitor={appointment}
                      onReschedule={(visitorId, newDate, newTime) => {
                        console.log("Reschedule:", visitorId, newDate, newTime);
                        handleButtonDisable(appointment.appointment_id); // Disable buttons for this appointment
                      }}
                      disabled={disabledButtons[appointment.appointment_id]} // Use disabledButtons state
                    />
                      <ApproveButton
                      visitorId={appointment.v_id}
                      visitorEmail={appointment.v_email}
                      appointmentId={appointment.appointment_id}
                      status={Number(appointment.status_description)}
                      onApprove={() => {
                        fetchAppointmentData();
                        handleButtonDisable(appointment.appointment_id); // Disable buttons for this appointment
                      }}
                      disabled={disabledButtons[appointment.appointment_id]} // Use disabledButtons state
                    />
                      <RejectButton
                      visitorId={appointment.v_id}
                      visitorEmail={appointment.v_email}
                      appointmentId={appointment.appointment_id}
                      status={Number(appointment.status_description)}
                      onReject={() => {
                        fetchAppointmentData();
                        handleButtonDisable(appointment.appointment_id); // Disable buttons for this appointment
                      }}
                      disabled={disabledButtons[appointment.appointment_id]} // Use disabledButtons state
                    />
                    </>
                  )}
                </Table.Td>
                {/* <Table.Td>{visitor.is_approved ? "Yes" : "No"}</Table.Td>
                <Table.Td>{visitor.is_rejected ? "Yes" : "No"}</Table.Td> */}
                {/* <Table.Td>
                <ApproveButton
                      visitorId={visitor.v_id}
                      visitorEmail={visitor.v_email}
                      appointmentId={visitor.appointment_id}
                      status={visitor.status}
                      onApprove={fetchVisitorData}
                    />
                </Table.Td>
                <Table.Td>
                <RejectButton
                      visitorId={visitor.v_id}
                      visitorEmail={visitor.v_email}
                      appointmentId={visitor.appointment_id}
                      status={visitor.status}
                      onReject={fetchVisitorData}
                    />
                </Table.Td> */}
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </div>
    </>
  );
}

export default Main;
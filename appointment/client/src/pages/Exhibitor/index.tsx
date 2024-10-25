import React, { useEffect, useState } from "react";
import Button from "../../base-components/Button";
import Table from "../../base-components/Table";
import * as XLSX from "xlsx";
import FormSwitch from "../../base-components/Form/FormSwitch";
import Lucide from "../../base-components/Lucide";
import RescheduleButton from "../../base-components/RescheduleButton";
import {API_BASE_URL} from "../../utils/variables";




function ExhibitorPage() {
  const [exhibitorData, setExhibitorData] = useState<{
    e_id: number;
    e_company: string;
    e_category: string;
    stall_id: number;
    current_event: string;
    current_event_start_date: string;
    current_event_end_date: string;
    admin_name: string;
    current_event_status: string;
  }[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showApprovedOnly, setShowApprovedOnly] = useState(false);

  useEffect(() => {
    fetchExhibitorData();
  }, []);

  const fetchExhibitorData = () => {
    fetch(API_BASE_URL+"/exhibitorData")
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error("Network response was not ok.");
      })
      .then((data) => {
        setExhibitorData(data.exhibitorData);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(exhibitorData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Exhibitors");
    XLSX.writeFile(workbook, "exhibitors.xlsx");
  };

  // Filter exhibitor data based on the search term and approved status
  const filteredExhibitorData = exhibitorData.filter(
    (exhibitor) =>
      exhibitor.e_company.toLowerCase().includes(searchTerm.toLowerCase())&&
    (!showApprovedOnly || exhibitor.current_event_status === "Approved")
    );

  return (
    <>
      <div className="flex flex-col items-center mt-8 intro-y sm:flex-row">
        <h2 className="mr-auto text-lg font-medium">Exhibitors</h2>
        {/* Search Input */}
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by Company Name"
          className="border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:border-blue-500"
        />

        {/* Checkbox to filter approved exhibitors */}
        <div className="flex items-center ml-4 mt-0  border border-gray-400 rounded-md py-2 px-4">
          <FormSwitch>
            <FormSwitch.Input
              id="checkbox-switch-7"
              type="checkbox"
              checked={showApprovedOnly}
              onChange={(e) => setShowApprovedOnly(e.target.checked)}
            />
            <FormSwitch.Label htmlFor="checkbox-switch-7">
              Approved Exhibitors
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
              <Table.Th>Company Name</Table.Th>
              <Table.Th>Category</Table.Th>
              <Table.Th>Stall ID</Table.Th>
              <Table.Th>Current Event</Table.Th>
              <Table.Th>Start Date</Table.Th>
              <Table.Th>End Date</Table.Th>
              <Table.Th>Organization</Table.Th>
              <Table.Th>Event Status</Table.Th>
              <Table.Th>Action</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
          {filteredExhibitorData.map((exhibitor) => (
              <Table.Tr key={exhibitor.e_id}>
                <Table.Td>{exhibitor.e_id}</Table.Td>
                <Table.Td>{exhibitor.e_company}</Table.Td>
                <Table.Td>{exhibitor.e_category}</Table.Td>
                <Table.Td>{exhibitor.stall_id}</Table.Td>
                <Table.Td>{exhibitor.current_event}</Table.Td>
                <Table.Td>{new Date(exhibitor.current_event_start_date).toISOString().split('T')[0]}</Table.Td>
                <Table.Td>{new Date(exhibitor.current_event_end_date).toISOString().split('T')[0]}</Table.Td>
                <Table.Td>{exhibitor.admin_name}</Table.Td>
                <Table.Td>{exhibitor.current_event_status}</Table.Td>
                {/* <Table.Td>
                  <RescheduleButton
                    exhibitor={exhibitor}
                    onReschedule={(exhibitorId, newEvent) => {
                      console.log("Reschedule:", exhibitorId, newEvent);
                    }}
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

export default ExhibitorPage;






// FRONTEND APPROVEBUTTON BEFORE MODIFY OF THE REAL DATABASE





import Button from "../Button";
import Lucide from "../Lucide";
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

interface ApproveButtonProps {
  visitorId: number;
  visitorEmail: string;
  isApproved: boolean; // New prop indicating whether the visitor is approved
  isRejected: boolean; // Add this prop
  onApprove: () => void; // Callback function to handle approve action
}

const ApproveButton: React.FC<ApproveButtonProps> = ({
  visitorId,
  visitorEmail,
  isApproved,
  isRejected, // Receive isRejected prop
  onApprove
}) => {

    const [emailSent, setEmailSent] = useState<boolean>(() => {
        // Get the emailSent state from localStorage
        const storedValue = localStorage.getItem(`emailSent_${visitorId}`);
        return storedValue ? JSON.parse(storedValue) : false;
      });

    const [visitorData, setVisitorData] = useState<Visitor[]>([]); // Specify Visitor[] type


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

  const handleApprove = () => {
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
        onApprove(); // Update parent component immediately after email is sent
      })
      .catch((error) => {
        console.error("Error approving visitor:", error);
      });
    // Once email is sent successfully, update emailSent state
    setEmailSent(true);
    // Store emailSent state in localStorage
    localStorage.setItem(`emailSent_${visitorId}`, JSON.stringify(true));
    // Call the parent component's onApprove callback
    onApprove();
  };

  return (
    <Button
      variant="outline-secondary"
      className="px-2 py-1 ml-auto"
      disabled={isApproved || isRejected}
      onClick={handleApprove}
    >
      {isApproved ? (
        <>
          <Lucide icon="CheckCircle" className="w-4 h-4 mr-2 text-green-500" /> Approved
        </>
      ) : (
        <>
          <Lucide icon="User" className="w-4 h-4 mr-2" /> Approve
        </>
      )}
      {/* <Lucide icon="User" className="w-4 h-4 mr-2" />{" "}
      {isApproved ? "Approved" : "Approve"} */}
    </Button>
  );
};

export default ApproveButton;

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

interface RejectButtonProps {
  visitorId: number;
  visitorEmail: string;
  isRejected: boolean; // New prop indicating whether the visitor is approved
  isApproved: boolean; // New prop indicating whether the visitor is approved
  onReject: () => void; // Callback function to handle rejection action
}

const RejectButton: React.FC<RejectButtonProps> = ({
  visitorId,
  visitorEmail,
  isRejected,
  isApproved,
  onReject
}) => {
  const [rejected, setRejected] = useState<boolean>(() => {
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

  const handleReject = () => {

    console.log("Visitor ID:", visitorId);
    fetch(API_BASE_URL+"/rejectVisitor", {
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
        setRejected(true); // After successful email sending
        onReject(); // Update parent component immediately after email is sent
      })
      .catch((error) => {
        console.error("Error approving visitor:", error);
      });

    // Once rejection is successful, update rejected state
    setRejected(true);
    // Call the parent component's onReject callback
    localStorage.setItem(`emailSent_${visitorId}`, JSON.stringify(true));

    onReject();
  };

  return (
    <Button
      variant="outline-secondary"
      className="px-2 py-1 ml-auto"
      disabled={isRejected || isApproved}
      onClick={handleReject}
    >
      {isRejected ? (
        <>
          <Lucide icon="XCircle" className="w-4 h-4 mr-2 text-red-500" /> Rejected
        </>
      ) : (
        <>
          <Lucide icon="User" className="w-4 h-4 mr-2" /> Reject
        </>
      )}
      {/* <Lucide icon="User" className="w-4 h-4 mr-2" />{" "}
      {isRejected ? "Rejected" : "Reject"} */}
    </Button>
  );
};

export default RejectButton;

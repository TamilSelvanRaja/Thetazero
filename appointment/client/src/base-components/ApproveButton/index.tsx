import Button from "../Button";
import LoadingIcon from "../LoadingIcon";
import Lucide from "../Lucide";
import { useEffect, useState } from "react";
import {API_BASE_URL} from "../../utils/variables";

interface ApproveButtonProps {
  visitorId: number;
  appointmentId: number;
  visitorEmail: string;
  status: number; // Add status prop
  onApprove: () => void;
  disabled: boolean; // Add disabled prop
}

const ApproveButton: React.FC<ApproveButtonProps> = ({
  visitorId,
  appointmentId,
  visitorEmail,
  status,
  onApprove,
  disabled // Add disabled prop
}) => {
  const [approved, setApproved] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false); // Add loading state

  useEffect(() => {
    // Fetch appointment status from backend when component mounts
    fetchAppointmentStatus();
  }, []);

  const fetchAppointmentStatus = () => {
    fetch(API_BASE_URL+`/getAppointmentStatus/${appointmentId}`, {
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
        // Set approved state based on the status from the backend
        setApproved(data.status === 2); // Assuming status 2 means approved
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };

  const handleApprove = () => {
    setLoading(true); // Set loading state to true when button is clicked
    fetch(API_BASE_URL+"/approveVisitor", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ visitorId, appointmentId, visitorEmail }),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Failed to approve visitor");
        }
      })
      .then((data) => {
        console.log(data.message);
        setApproved(true);
        onApprove(); // Refetch data to reflect changes in the parent component
      })
      .catch((error) => {
        console.error("Error approving visitor:", error);
      })
      .finally(() => {
        setLoading(false); // Set loading state back to false after the operation completes
      });
  };

  return (
    <Button
      variant="outline-secondary"
      className="px-2 py-1 ml-auto"
      disabled={approved || status === 2 || status === 4 || disabled || loading}
      onClick={handleApprove}
    >
      {loading ? (
        <LoadingIcon icon="three-dots" color="1a202c" className="w-4 h-4" />
      ) : (
        <>
          {approved ? (
            <>
              <Lucide icon="CheckCircle" className="w-4 h-4 mr-2 text-green-500" />
              <span className="text-success ">Approved</span>
            </>
          ) : (
            <>
              <Lucide icon="User" className="w-4 h-4 mr-2" />
              Approve
            </>
          )}
        </>
      )}
    </Button>
  );
};

{/* <span className="px-2 py-1 text-xs border rounded-full whitespace-nowrap text-success bg-success/20 border-success/20">
                          Completed
                        </span> */}

export default ApproveButton;

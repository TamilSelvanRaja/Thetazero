import Button from "../Button";
import LoadingIcon from "../LoadingIcon";
import Lucide from "../Lucide";
import { useEffect, useState } from "react";
import {API_BASE_URL} from "../../utils/variables";

interface RejectButtonProps {
  visitorId: number;
  appointmentId: number;
  visitorEmail: string;
  status: number;
  onReject: () => void;
  disabled: boolean; // Add disabled prop
}

const RejectButton: React.FC<RejectButtonProps> = ({
  visitorId,
  appointmentId,
  visitorEmail,
  status,
  onReject,
  disabled // Add disabled prop
}) => {
  const [rejected, setRejected] = useState<boolean>(false);
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
        // Set rejected state based on the status from the backend
        setRejected(data.status === 4); // Assuming status 4 means rejected
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };

  const handleReject = () => {
    setLoading(true); // Set loading state to true when button is clicked
    fetch(API_BASE_URL+"/rejectVisitor", {
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
          throw new Error("Failed to reject visitor");
        }
      })
      .then((data) => {
        console.log(data.message);
        setRejected(true);
        onReject(); // Refetch data to reflect changes in the parent component
      })
      .catch((error) => {
        console.error("Error rejecting visitor:", error);
      })
      .finally(() => {
        setLoading(false); // Set loading state back to false after the operation completes
      });
  };

  return (
    <Button
      variant="outline-secondary"
      className="px-2 py-1 ml-auto"
      disabled={rejected || status === 2 || status === 4 || disabled || loading}
      onClick={handleReject}
    >
      {loading ? (
        <LoadingIcon icon="three-dots" color="1a202c" className="w-4 h-4" />
      ) : (
        <>
          {rejected ? (
            <>
              <Lucide icon="XCircle" className="w-4 h-4 mr-2 text-red-500" />
              <span className="text-danger">Rejected</span>
            </>
          ) : (
            <>
              <Lucide icon="User" className="w-4 h-4 mr-2" />
              Reject
            </>
          )}
        </>
      )}
    </Button>
  );
};

export default RejectButton;

import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import TomSelect from "../../base-components/TomSelect";
import Button from "../../base-components/Button";
import Notification from "../../base-components/Notification";
import Lucide from "../../base-components/Lucide";
import clsx from "clsx";
import { useNavigate } from "react-router-dom";
import Toastify from "toastify-js";
import FormTextarea from "../../base-components/Form/FormTextarea";


// Function to generate time slots
const generateTimeSlots = () => {
  const timeSlots = [];
  const startTime = 9; // Start from 9:00 AM
  const endTime = 18; // End at 6:30 PM
  for (let hour = startTime; hour < endTime; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      if (!((hour === 12 && minute === 30) || (hour === 13 && minute === 0))) { // Skip lunch break
        let formattedHour = hour % 12 || 12; // Convert to 12-hour format
        const formattedMinute = minute === 0 ? '00' : '30';
        const meridiem = hour < 12 ? 'AM' : 'PM';
        const time = `${formattedHour}:${formattedMinute} ${meridiem}`;
        timeSlots.push(time);
      }
    }
  }
  return timeSlots;
};

function Main() {
  const [eventDates, setEventDates] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string[]>([]);
  const [exhibitors, setExhibitors] = useState<string[]>([]);
  const [selectedExhibitor, setSelectedExhibitor] = useState<string[]>([]);
  const [exhibitorTimeSlots, setExhibitorTimeSlots] = useState<{ [key: string]: string[] }>({});
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<{ [key: string]: string }>({});
  const [availableTimeSlots, setAvailableTimeSlots] = useState<{ [key: string]: string[] }>({});
  
  const [userName, setUserName] = useState("");
  const [userPhone, setUserPhone] = useState(""); // State for user's phone number
  const [vId, setVId] = useState(""); // State for visitor ID
  const [comments, setComments] = useState(""); // State for comments
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Define timeSlots within the component
  const timeSlots = generateTimeSlots();

  useEffect(() => {
    // Retrieve user's name from localStorage
    const storedUserName = localStorage.getItem("userName") ?? "";
    setUserName(storedUserName);

    // Retrieve user's phone number from localStorage
    const storedUserPhone = localStorage.getItem("userPhone") ?? "";
    setUserPhone(storedUserPhone);
  }, []);

  useEffect(() => {
    // Fetch visitor ID based on userPhone
    if (userPhone) {
      axios.get(`http://localhost:3001/Server/getVisitorId`, {
        params: { phone: userPhone }
      })
      .then(response => {
        setVId(response.data.vId);
      })
      .catch(error => {
        console.error('Error fetching visitor ID:', error);
      });
    }
  }, [userPhone]);

  useEffect(() => {
    updateAvailableTimeSlots();
  }, [selectedExhibitor, selectedTimeSlots]);

  useEffect(() => {
    axios.get("http://localhost:3001/Server/eventdates")
      .then(response => {
        setEventDates(response.data.dates);
      })
      .catch(error => {
        console.error("Error fetching event dates:", error);
      });
  }, []);

  const handleDateChange = useCallback((value: string) => {
    setSelectedDate(value);
    setSelectedCategory([]);
    setSelectedExhibitor([]);
    setSelectedTimeSlots({});
    
    axios.get(`http://localhost:3001/Server/categories`, {
      params: {
        selectedDate: value
      }
    })
    .then(response => {
      setCategories(response.data.categories);
    })
    .catch(error => {
      console.error('Error fetching categories:', error);
    });
  }, []);

  const handleCategoryChange = useCallback((value: string[]) => {
    setSelectedCategory(value);
    setSelectedExhibitor([]);
    setSelectedTimeSlots({});

    axios.get(`http://localhost:3001/Server/exhibitors`, {
      params: {
        selectedCategory: value
      }
    })
    .then(response => {
      setExhibitors(response.data.exhibitors);
    })
    .catch(error => {
      console.error('Error fetching exhibitors:', error);
    });
  }, []);

  const handleExhibitorChange = useCallback((value: string[]) => {
    setSelectedExhibitor(value);
    setSelectedTimeSlots({});
    const promises = value.map(exhibitor => {
      return axios.get(`http://localhost:3001/Server/timeslots`, {
        params: {
          selectedExhibitor: exhibitor,
          selectedDate: selectedDate // Assuming you're selecting only one date
        }
      })
      .then(response => {
        setExhibitorTimeSlots(prevState => ({
          ...prevState,
          [exhibitor]: response.data.exhibitorTimeSlots[exhibitor]
        }));
      })
      .catch(error => {
        console.error('Error fetching time slots:', error);
      });
    });
    Promise.all(promises)
      .then(() => {
        console.log("Time slots fetched successfully");
      });
  }, [selectedDate]);

  const handleTimeSlotChange = useCallback((exhibitor: string, value: string | string[]) => {
    // Ensure that value is not null or undefined
    const selectedValue = value ? (typeof value === "string" ? value : value[0]) : '';
  
    // Convert time slot to MySQL time format (HH:mm:ss) in 12-hour format
    const [hourMinute, meridiem] = selectedValue.split(' ');
    let [hour, minute] = hourMinute.split(':');
    let hour24Format = parseInt(hour, 10);
    if (meridiem === 'PM' && hour24Format !== 12) {
      hour24Format += 0;
    } else if (meridiem === 'AM' && hour24Format === 12) {
      hour24Format = 0;
    }
    const selectedTime = `${hour24Format.toString().padStart(2, '0')}:${minute}:00`;
  
    setSelectedTimeSlots(prevState => ({
      ...prevState,
      [exhibitor]: selectedTime
    }));
  
    // Update available time slots for other exhibitors
    const updatedAvailableTimeSlots = { ...availableTimeSlots };
    Object.keys(updatedAvailableTimeSlots).forEach(key => {
      if (key !== exhibitor) {
        updatedAvailableTimeSlots[key] = updatedAvailableTimeSlots[key].filter(slot => slot !== selectedValue);
      }
    });
    setAvailableTimeSlots(updatedAvailableTimeSlots);
  }, [availableTimeSlots]);

  const updateAvailableTimeSlots = useCallback(() => {
    const updatedTimeSlots: { [key: string]: string[] } = {};
    // Initialize updatedAvailableTimeSlots object to store available time slots
    const updatedAvailableTimeSlots: { [key: string]: string[] } = {};
  
    // Loop through selected exhibitors
    for (const exhibitor of selectedExhibitor) {
      // Get the time slots already selected for other exhibitors
      const selectedSlots = Object.values(selectedTimeSlots).filter(slot => slot !== selectedTimeSlots[exhibitor]);
      // Filter the time slots for the current exhibitor based on selected slots of other exhibitors
      const filteredTimeSlots = timeSlots.filter(timeSlot => !selectedSlots.includes(timeSlot));
      // Update the available time slots for the current exhibitor
      updatedTimeSlots[exhibitor] = filteredTimeSlots;
    }
    
    // Loop through selected exhibitors again to update available time slots for each exhibitor
    for (const exhibitor of selectedExhibitor) {
      // Filter the time slots for the current exhibitor based on time slots of other exhibitors
      updatedAvailableTimeSlots[exhibitor] = updatedTimeSlots[exhibitor].filter(slot => !selectedExhibitor.some(e => selectedTimeSlots[e] === slot));
    }
    
    // Update the state with the new available time slots
    setAvailableTimeSlots(updatedAvailableTimeSlots);
  }, [selectedExhibitor, selectedTimeSlots, timeSlots]);

  const handleSubmit = useCallback(() => {
    setIsSubmitting(true); // Set submitting state to true
    // Prepare data for submission
    const data = {
      selectedDate: selectedDate,
      selectedTimeSlots: selectedTimeSlots,
      selectedExhibitor: selectedExhibitor,
      phone: userPhone, // Append user's phone number
      vId: vId, // Append visitor ID
      comments: comments // Include comments in the data
    };

    // Make a POST request to your backend endpoint to store the data
    axios.post("http://localhost:3001/Server/submitForm", data)
      .then(response => {
        console.log("Data submitted successfully:", response.data);

        // Display success notification
        Toastify({
          text: "Registration success!",
          // backgroundColor: "#34D399",
          duration: 3000,
          newWindow: true,
          close: true,
          gravity: "top",
          position: "right",
          stopOnFocus: true,
        }).showToast();

        setIsSubmitting(false); // Reset submitting state

        <Notification
              id="success-notification-content"
              className="flex hidden"
            >
              <Lucide icon="CheckCircle" className="text-success" />
              <div className="ml-4 mr-4">
                <div className="font-medium">Registration success!</div>
                <div className="mt-1 text-slate-500">
                  Please check your e-mail for further info!
                </div>
              </div>
            </Notification>

        // Navigate to success page
        navigate("/Form_Success");

        // Reset selected values and comments field
        // Reset selected values
        setSelectedDate("");
        setSelectedCategory([]);
        setSelectedExhibitor([]);
        setSelectedTimeSlots({});
        setAvailableTimeSlots({});
        // Reset comments field
        setComments("");
      })
      .catch(error => {
        console.error("Error submitting data:", error);
        
        // Display error notification
        Toastify({
          text: "Registration failed! Please check the form.",
          // backgroundColor: "#EF4444",
          duration: 3000,
          newWindow: true,
          close: true,
          gravity: "top",
          position: "right",
          stopOnFocus: true,
        }).showToast();

        setIsSubmitting(false); // Reset submitting state

        <Notification
              id="failed-notification-content"
              className="flex hidden"
            >
              <Lucide icon="XCircle" className="text-danger" />
              <div className="ml-4 mr-4">
                <div className="font-medium">Registration failed!</div>
                <div className="mt-1 text-slate-500">
                  Please check the fileld form.
                </div>
              </div>
            </Notification>
      });
  }, [selectedDate, selectedTimeSlots, selectedExhibitor, userPhone, vId, comments]);

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-12 gap-6 mt-5">
          <div className="col-span-12 lg:col-span-8 lg:col-start-3">
            <div className="intro-y box">
              <div className="p-5">
                <form className="validate-form">
                <p>Welcome, {userName}</p>
                  <div className="mt-3 input-form">
                    <TomSelect
                      id="event-dates"
                      name="eventDates"
                      options={{
                        placeholder: "Select date",
                      }}
                      value={selectedDate}
                      onChange={handleDateChange}
                      // multiple
                    >
                      {eventDates.map(date => (
                        <option key={date} value={date}>
                          {date}
                        </option>
                      ))}
                    </TomSelect>
                  </div>
                  <div className="mt-3 input-form">
                    <TomSelect
                      id="categories"
                      name="categories"
                      options={{
                        placeholder: "Select category",
                      }}
                      value={selectedCategory}
                      onChange={handleCategoryChange}
                      multiple
                    >
                      {categories.map(category => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </TomSelect>
                  </div>
                  <div className="mt-3 input-form">
                    <TomSelect
                      id="exhibitors"
                      name="exhibitors"
                      options={{
                        placeholder: "Select exhibitor",
                      }}
                      value={selectedExhibitor}
                      onChange={handleExhibitorChange}
                      multiple
                    >
                      {exhibitors.map(exhibitor => (
                        <option key={exhibitor} value={exhibitor}>
                          {exhibitor}
                        </option>
                      ))}
                    </TomSelect>
                  </div>
                  {selectedExhibitor.map(exhibitor => (
                    <div key={exhibitor} className="mt-3 input-form">
                      <label htmlFor={`timeslots-${exhibitor}`}>{exhibitor}</label>
                      <TomSelect
                        id={`timeslots-${exhibitor}`}
                        name={`timeslots-${exhibitor}`}
                        options={{
                          placeholder: selectedTimeSlots[exhibitor] ? selectedTimeSlots[exhibitor] : "Select time slot",
                        }}
                        value={selectedTimeSlots[exhibitor] || "Select time slot"}
                        onChange={(value: string | string[]) => handleTimeSlotChange(exhibitor, value)}
                      >
                        {availableTimeSlots[exhibitor]?.map((timeSlot, index) => {
                          // Check if the time slot is already selected by any other exhibitor
                          const isDisabled = Object.values(selectedTimeSlots).some(
                            (selectedSlot) => selectedSlot === timeSlot && selectedSlot !== selectedTimeSlots[exhibitor]
                          );
                          return (
                            <option key={index} value={timeSlot} disabled={isDisabled}>
                              {timeSlot}
                            </option>
                          );
                        })}
                      </TomSelect>
                    </div>
                  ))}
                  <div className="mt-3 input-form">
                    <label htmlFor="validation-form-11" className="flex flex-col w-full sm:flex-row">
                      Note
                      <span className="mt-1 text-xs sm:ml-auto sm:mt-0 text-slate-500">
                        At least 10 characters
                      </span>
                    </label>
                    <FormTextarea 
                      id="validation-form-11" 
                      name="comment" 
                      value={comments} 
                      onChange={(e) => setComments(e.target.value)}
                      className="border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                      placeholder="Feel Free to Leave us a Note!"
                    ></FormTextarea>
                  </div>
                </form>
                <div className="flex justify-center mt-5">
                <Button
                  variant="primary"
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                  onClick={handleSubmit} // Make sure to handle the click event
                >
                  {isSubmitting ? "Registering..." : "Register"}
                </Button>
              </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Main;

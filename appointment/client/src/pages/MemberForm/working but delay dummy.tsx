import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import TomSelect from "../../base-components/TomSelect";
import Button from "../../base-components/Button";
import Notification from "../../base-components/Notification";
import Lucide from "../../base-components/Lucide";
import Alert from "../../base-components/Alert";
import clsx from "clsx";
import { useNavigate } from "react-router-dom";
import FormTextarea from "../../base-components/Form/FormTextarea";
import TinySlider from "../../base-components/TinySlider";
import {API_BASE_URL} from "../../utils/variables";

// Function to generate time slots
const generateTimeSlots = () => {
  const timeSlots = [];
  const startTime = 9; // Start from 9:00 AM
  const endTime = 18; // End at 6:00 PM
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

  // State for managing notifications and alerts
  const [notificationMessage, setNotificationMessage] = useState("");
  const [showNotification, setShowNotification] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

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
      axios.get(API_BASE_URL+`/getVisitorId`, {
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
    axios.get(API_BASE_URL+"/eventdates")
      .then(response => {
        setEventDates(response.data.dates);
      })
      .catch(error => {
        console.error("Error fetching event dates:", error);
      });
  }, []);

  useEffect(() => {
    updateAvailableTimeSlots();
  }, [selectedExhibitor, selectedTimeSlots]);

  const handleDateChange = useCallback((value: string) => {
    setSelectedDate(value);
    setSelectedCategory([]);
    setSelectedExhibitor([]);
    setSelectedTimeSlots({});
    
    axios.get(API_BASE_URL+`/categories`, {
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

    axios.get(API_BASE_URL+`/exhibitors`, {
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
      return axios.get(API_BASE_URL+`/timeslots`, {
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
    const selectedValue = value ? (typeof value === "string" ? value : value[0]) : '';
  
    const [hourMinute, meridiem] = selectedValue.split(' ');
    let [hour, minute] = hourMinute.split(':');
    let hour24Format = parseInt(hour, 10);
    if (meridiem === 'PM' && hour24Format !== 12) {
      hour24Format += 12;
    } else if (meridiem === 'AM' && hour24Format === 12) {
      hour24Format = 0;
    }
    const selectedTime = `${hour24Format.toString().padStart(2, '0')}:${minute}:00`;
  
    setSelectedTimeSlots(prevState => ({
      ...prevState,
      [exhibitor]: selectedTime
    }));
  
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
    const updatedAvailableTimeSlots: { [key: string]: string[] } = {};
  
    for (const exhibitor of selectedExhibitor) {
      const selectedSlots = Object.values(selectedTimeSlots).filter(slot => slot !== selectedTimeSlots[exhibitor]);
      const filteredTimeSlots = timeSlots.filter(timeSlot => !selectedSlots.includes(timeSlot));
      updatedTimeSlots[exhibitor] = filteredTimeSlots;
    }
    
    for (const exhibitor of selectedExhibitor) {
      updatedAvailableTimeSlots[exhibitor] = updatedTimeSlots[exhibitor].filter(slot => !selectedExhibitor.some(e => selectedTimeSlots[e] === slot));
    }
    
    setAvailableTimeSlots(updatedAvailableTimeSlots);
  }, [selectedExhibitor, selectedTimeSlots, timeSlots]);

  const handleSubmit = useCallback(() => {
    setIsSubmitting(true);
    const data = {
      selectedDate: selectedDate,
      selectedTimeSlots: selectedTimeSlots,
      selectedExhibitor: selectedExhibitor,
      phone: userPhone,
      vId: vId,
      comments: comments
    };

    axios.post(API_BASE_URL+"/submitForm", data)
      .then(response => {
        setNotificationMessage("Message Saved! The message will be sent in 5 minutes.");
        setShowNotification(true);
        setTimeout(() => {
          setShowNotification(false);
          navigate("/Form_Success"); // Redirect to success page after submission
        }, 3000);
      })
      .catch(error => {
        setErrorMessage("Error occurred while submitting the form.");
        console.error("Error submitting the form:", error);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  }, [selectedDate, selectedTimeSlots, selectedExhibitor, userPhone, vId, comments, navigate]);

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-12 gap-6 mt-5">
          <div className="col-span-12 lg:col-span-8 lg:col-start-3">


{/* Slider Start */}
<div className="mx-1">
<TinySlider options={{
                controls: false,
              }}>
    <div className="h-32 px-2">
        <div className="h-full rounded-md bg-slate-100 dark:bg-darkmode-400">
            <h3 className="flex items-center justify-center h-full text-2xl font-medium">
                1
            </h3>
        </div>
    </div>
    <div className="h-32 px-2">
        <div className="h-full rounded-md bg-slate-100 dark:bg-darkmode-400">
            <h3 className="flex items-center justify-center h-full text-2xl font-medium">
                2
            </h3>
        </div>
    </div>
    <div className="h-32 px-2">
        <div className="h-full rounded-md bg-slate-100 dark:bg-darkmode-400">
            <h3 className="flex items-center justify-center h-full text-2xl font-medium">
                3
            </h3>
        </div>
    </div>
    <div className="h-32 px-2">
        <div className="h-full rounded-md bg-slate-100 dark:bg-darkmode-400">
            <h3 className="flex items-center justify-center h-full text-2xl font-medium">
                4
            </h3>
        </div>
    </div>
    <div className="h-32 px-2">
        <div className="h-full rounded-md bg-slate-100 dark:bg-darkmode-400">
            <h3 className="flex items-center justify-center h-full text-2xl font-medium">
                5
            </h3>
        </div>
    </div>
    <div className="h-32 px-2">
        <div className="h-full rounded-md bg-slate-100 dark:bg-darkmode-400">
            <h3 className="flex items-center justify-center h-full text-2xl font-medium">
                6
            </h3>
        </div>
    </div>
</TinySlider>
</div><br/>
{/* Slider End */}


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
                    onClick={handleSubmit}
                  >
                    {isSubmitting ? "Registering..." : "Register"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Notification */}
      {showNotification && (
        <div className="text-center">
          <Notification className="flex">
            <Lucide icon="CheckCircle" className="text-success" />
            <div className="ml-4 mr-4">
              <div className="font-medium">Message Saved!</div>
              <div className="mt-1 text-slate-500">
                {notificationMessage}
              </div>
            </div>
          </Notification>
        </div>
      )}

      {/* Error Alert */}
      {errorMessage && (
        <div className="text-center mt-4">
          <Alert variant="danger" className="flex items-center mb-2">
            {({ dismiss }) => (
              <>
                <Lucide icon="AlertOctagon" className="w-6 h-6 mr-2" />
                {errorMessage}
                <Alert.DismissButton type="button" className="text-white" aria-label="Close" onClick={dismiss}>
                  <Lucide icon="X" className="w-4 h-4" />
                </Alert.DismissButton>
              </>
            )}
          </Alert>
        </div>
      )}
    </>
  );
}

export default Main;
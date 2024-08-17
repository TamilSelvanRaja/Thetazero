import React, { useEffect, useState } from "react";
import axios from "axios";
import TomSelect from "../../base-components/TomSelect";
import {API_BASE_URL} from "../../utils/variables";

function Main() {
  const [eventDates, setEventDates] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string[]>([]);
  const [exhibitors, setExhibitors] = useState<string[]>([]);
  const [selectedExhibitor, setSelectedExhibitor] = useState<string[]>([]);
  const [exhibitorTimeSlots, setExhibitorTimeSlots] = useState<{ [key: string]: string[] }>({});
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<{ [key: string]: string }>({});
  const [availableTimeSlots, setAvailableTimeSlots] = useState<{ [key: string]: string[] }>({});

  // Modify the updateAvailableTimeSlots function to log the updated time slots for debugging
  const updateAvailableTimeSlots = () => {
    const updatedTimeSlots: { [key: string]: string[] } = {};
    for (const exhibitor of selectedExhibitor) {
      const filteredTimeSlots = timeSlots.filter(timeSlot => {
        return !Object.values(selectedTimeSlots).includes(timeSlot);
      });
      console.log("Filtered time slots for exhibitor", exhibitor, ":", filteredTimeSlots);
      updatedTimeSlots[exhibitor] = filteredTimeSlots;
    }
    console.log("Updated time slots:", updatedTimeSlots);
    setAvailableTimeSlots(updatedTimeSlots);
  };

  // Call updateAvailableTimeSlots whenever selectedExhibitor or selectedTimeSlots change
  useEffect(() => {
    updateAvailableTimeSlots();
  }, [selectedExhibitor, selectedTimeSlots]);

  useEffect(() => {
    // Fetch event dates from backend
    axios.get(API_BASE_URL+"/eventdates")
      .then(response => {
        setEventDates(response.data.dates);
      })
      .catch(error => {
        console.error("Error fetching event dates:", error);
      });
  }, []);

  const handleDateChange = (value: string[]) => {
    setSelectedDate(value);
    setSelectedCategory([]);
    setSelectedExhibitor([]);
    setSelectedTimeSlots({});

    // Fetch categories based on selected date(s)
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
  };

  const handleCategoryChange = (value: string[]) => {
    setSelectedCategory(value);
    setSelectedExhibitor([]);
    setSelectedTimeSlots({});

    // Fetch exhibitors based on selected category
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
  };

  const handleExhibitorChange = (value: string[]) => {
    setSelectedExhibitor(value);
    setSelectedTimeSlots({});
    const promises = value.map(exhibitor => {
      return axios.get(API_BASE_URL+`/timeslots`, {
        params: {
          selectedExhibitor: exhibitor,
          selectedDate: selectedDate[0] // Assuming you're selecting only one date
        }
      })
      .then(response => {
        setExhibitorTimeSlots(prevState => ({
          ...prevState,
          [exhibitor]: response.data.exhibitorTimeSlots[exhibitor]
        }));
        console.log("Updated exhibitorTimeSlots:", response.data.exhibitorTimeSlots[exhibitor]); // Log the updated state directly
      })
      .catch(error => {
        console.error('Error fetching time slots:', error);
      });
    });
    Promise.all(promises)
      .then(() => {
        console.log("Time slots fetched successfully");
      });
  };

  const handleTimeSlotChange = (exhibitor: string, value: string | string[]) => {
    // Check if the value is a single string
    if (typeof value === "string") {
      // Select the time slot for the exhibitor
      setSelectedTimeSlots(prevState => ({
        ...prevState,
        [exhibitor]: value
      }));
    } else if (Array.isArray(value)) {
      // Select the first time slot from the array if multiple time slots are selected
      if (value.length > 0) {
        setSelectedTimeSlots(prevState => ({
          ...prevState,
          [exhibitor]: value[0]
        }));
      } else {
        // Clear the selected time slot if the array is empty
        setSelectedTimeSlots(prevState => ({
          ...prevState,
          [exhibitor]: ""
        }));
      }
    }
  };

  // Generate time slots for the dropdown
  const generateTimeSlots = () => {
    const timeSlots = [];
    const startTime = 9; // Start from 9:00 AM
    const endTime = 18; // End at 6:30 PM
    for (let hour = startTime; hour < endTime; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        if (!((hour === 12 && minute === 0) || (hour === 13 && minute === 0))) { // Skip lunch break
          const formattedHour = hour < 10 ? `0${hour}` : `${hour}`;
          const formattedMinute = minute === 0 ? '00' : '30';
          const time = `${formattedHour}:${formattedMinute} ${hour < 12 ? 'AM' : 'PM'}`;
          timeSlots.push(time);
        }
      }
    }
    return timeSlots;
  };

  const timeSlots = generateTimeSlots();

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-12 gap-6 mt-5">
          <div className="col-span-12 lg:col-span-8 lg:col-start-3">
            <div className="intro-y box">
              <div className="p-5">
                <form className="validate-form">
                  <div className="mt-3 input-form">
                    <TomSelect
                      id="event-dates"
                      name="eventDates"
                      options={{
                        placeholder: "Select date",
                      }}
                      value={selectedDate}
                      onChange={handleDateChange}
                      multiple
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
                          placeholder: "Select time slot",
                        }}
                        value={selectedTimeSlots[exhibitor]}
                        onChange={(value: string | string[]) => handleTimeSlotChange(exhibitor, value)}
                      >
                        {exhibitorTimeSlots[exhibitor]?.map((timeSlot, index) => (
                          <option key={index} value={timeSlot}>
                            {timeSlot}
                          </option>
                        ))}
                      </TomSelect>
                    </div>
                  ))}
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Main;




// old handle time 

// const handleTimeSlotChange = useCallback((exhibitor: string, value: string | string[]) => {
//   if (typeof value === "string") {
//     // Select the time slot for the exhibitor
//     setSelectedTimeSlots(prevState => ({
//       ...prevState,
//       [exhibitor]: value
//     }));
//     // Remove the selected time slot from available time slots of other exhibitors
//     const updatedAvailableTimeSlots: { [key: string]: string[] } = { ...availableTimeSlots };
//     Object.keys(updatedAvailableTimeSlots).forEach(key => {
//       if (key !== exhibitor) {
//         updatedAvailableTimeSlots[key] = updatedAvailableTimeSlots[key].filter(slot => slot !== value);
//       }
//     });
//     setAvailableTimeSlots(updatedAvailableTimeSlots);
//   } else if (Array.isArray(value)) {
//     // Select the first time slot from the array if multiple time slots are selected
//     if (value.length > 0) {
//       setSelectedTimeSlots(prevState => ({
//         ...prevState,
//         [exhibitor]: value[0]
//       }));
//       // Remove the selected time slots from available time slots of other exhibitors
//       const updatedAvailableTimeSlots: { [key: string]: string[] } = { ...availableTimeSlots };
//       Object.keys(updatedAvailableTimeSlots).forEach(key => {
//         if (key !== exhibitor) {
//           updatedAvailableTimeSlots[key] = updatedAvailableTimeSlots[key].filter(slot => !value.includes(slot));
//         }
//       });
//       setAvailableTimeSlots(updatedAvailableTimeSlots);
//     } else {
//       // Clear the selected time slot if the array is empty
//       setSelectedTimeSlots(prevState => ({
//         ...prevState,
//         [exhibitor]: ""
//       }));
//     }
//   }
// }, [availableTimeSlots, selectedTimeSlots]);
import { FormLabel, FormInput, FormTextarea } from "../../base-components/Form";
import Button from "../../base-components/Button";
import Notification from "../../base-components/Notification";
import Lucide from "../../base-components/Lucide";
import { useForm } from "react-hook-form";
import Toastify from "toastify-js";
import clsx from "clsx";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import React, { useEffect, useState } from "react";
import TomSelect from "../../base-components/TomSelect";
import axios from "axios";

//new
// import { Dialog } from "@headlessui/react";
import { useNavigate } from "react-router-dom";
// -------------------------------------------------------------------------------------------------------------------

function Main() {
  const schema = yup
    .object({
      name: yup
        .string()
        .required()
        .min(2)
        .matches(/^[a-zA-Z\s]+$/, "Name must contain only letters and spaces"),
      email: yup.string().required().email(),
      designation: yup
        .string()
        .required()
        .min(2)
        .matches(/^[a-zA-Z\s]+$/, "Name must contain only letters and spaces"),
      company: yup
        .string()
        .required()
        .min(2)
        .matches(/^[a-zA-Z\s]+$/, "Name must contain only letters and spaces"),
      phone: yup
        .string()
        .required()
        .min(10)
        .max(13)
        // .matches(/^[0-9]+$/, "Must be only digits"),
        .matches(/^[\d+\- ]+$/, "Must be a number"),
      whatsapp: yup
        .string()
        .required()
        .min(10)
        .max(13)
        .matches(/^[\d+\- ]+$/, "Must be a number"),
      comment: yup
        .string()
        .required()
        .min(5)
        .matches(/^[a-zA-Z\s,;:'"0-9]+$/, "No Special Charatectes Accepted"),
      selectedDay: yup
        .array()
        // .required()
        .min(1, "At least one day must be selected"),
      selectedCategory: yup
        .array()
        // .required()
        .min(1, "At least one category must be selected"),
      selectedExhibitor: yup
        .array()
        // .required()
        .min(1, "At least one exhibitor must be selected"),
      selectedTimeSlot: yup
        .array()
        // .required()
        .min(1, "At least one time slot must be selected"),
    })
    .required();

  //new
  const [selectedDay, setSelectedDay] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string[]>([]);
  const [selectedExhibitor, setSelectedExhibitor] = useState<string[]>([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  //end
  
  //new
  // const [successModalPreview, setSuccessModalPreview] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    trigger,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  const onSubmit = async (event: React.ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = await trigger();
    setIsSubmitting(true);

    try {
      // Simulating form submission delay
      await new Promise((resolve) => setTimeout(resolve, 2000));
      // Upon successful submission, reset the form and display success message
      setIsSubmitting(false);
      // Call function to show success message
    } catch (error) {
      console.error("Error submitting form:", error);
      setIsSubmitting(false);
      // Display error message
    }

    if (!result) {
      // If form validation fails, display error notification
      const failedEl = document
        .querySelectorAll("#failed-notification-content")[0]
        .cloneNode(true) as HTMLElement;
      failedEl.classList.remove("hidden");
      Toastify({
        node: failedEl,
        duration: 3000,
        newWindow: true,
        close: true,
        gravity: "top",
        position: "right",
        stopOnFocus: true,
      }).showToast();
      return; // Stop execution if validation fails
    }

    // If form validation succeeds, submit data to backend
    try {
      const formData = new FormData(event.target);
      const response = await axios.post(
        "http://localhost:3000/submit-form",
        formData
      );

      // // Taking WhatsApp number from form "whatsapp"
      // const whatsappNumber = formData.get("whatsapp");
      // // WhatsApp message
      // const whatsappResponse = await axios.post(
      //   "https://public.doubletick.io/whatsapp/message/text",
      //   {
      //     to: whatsappNumber,
      //     message: "Hello, world!",
      //     messageId: "uuid-v4",
      //   },
      //   {
      //     headers: {
      //       Authorization: "key_WKTzed4Hjj",
      //     },
      //   }
      // );
      // console.log("WhatsApp API response:", whatsappResponse.data);
      // // End Whatsapp

      // Display success notification
      const successEl = document
        .querySelectorAll("#success-notification-content")[0]
        .cloneNode(true) as HTMLElement;
      successEl.classList.remove("hidden");
      //new
      navigate("/Form_Success");
      //new end
      Toastify({
        node: successEl,
        duration: 3000,
        newWindow: true,
        close: true,
        gravity: "top",
        position: "right",
        stopOnFocus: true,
      }).showToast();

      // Clear form after successful submission (optional)
      event.target.reset();
      // Clear selected values
      setSelectedDay([]);
      setSelectedCategory([]);
      setSelectedExhibitor([]);
      setSelectedTimeSlot([]);
    } catch (error) {
      console.error("Error submitting form:", error);

      // Display error notification if submission fails
      const failedEl = document
        .querySelectorAll("#failed-notification-content")[0]
        .cloneNode(true) as HTMLElement;
      failedEl.classList.remove("hidden");
      Toastify({
        node: failedEl,
        duration: 3000,
        newWindow: true,
        close: true,
        gravity: "top",
        position: "right",
        stopOnFocus: true,
      }).showToast();
    }
  };

  const handleDayChange = (value: string[]) => {
    setSelectedDay(value);
  };

  const handleCategoryChange = (value: string[]) => {
    setSelectedCategory(value);
  };

  const handleExhibitorChange = (value: string[]) => {
    setSelectedExhibitor(value);
  };

  const handleTimeSlotChange = (value: string[]) => {
    setSelectedTimeSlot(value);
  };

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-12 gap-6 mt-5">
          <div className="col-span-12 lg:col-span-8 lg:col-start-3">
            {/* BEGIN: Form Validation */}
            <div className="intro-y box">
              <>
                <div className="text-center p-5 border-b border-slate-200/60 dark:border-darkmode-400">
                  <h2 className="text-lg font-bold">
                    Become A Member Form
                  </h2>
                  <p className="mt-2 italic">
                    To be held on DD/MM/YYY at Location
                  </p>
                </div>
                <div className="p-5">
                  <div>
                    {/* BEGIN: Validation Form */}
                    <form className="validate-form" onSubmit={onSubmit}>
                      <div className="input-form">
                        <FormLabel
                          htmlFor="validation-form-1"
                          className="flex flex-col w-full sm:flex-row"
                        >
                          Name
                          <span className="mt-1 text-xs sm:ml-auto sm:mt-0 text-slate-500">
                            *Required, at least 2 characters
                          </span>
                        </FormLabel>
                        <FormInput
                          {...register("name")}
                          id="validation-form-1"
                          type="text"
                          name="name"
                          className={clsx({
                            "border-danger": errors.name,
                          })}
                          placeholder="Your Name"
                        />
                        {errors.name && (
                          <div className="mt-2 text-danger">
                            {typeof errors.name.message === "string" &&
                              errors.name.message}
                          </div>
                        )}
                      </div>
                      <div className="mt-3 input-form">
                        <FormLabel
                          htmlFor="validation-form-2"
                          className="flex flex-col w-full sm:flex-row"
                        >
                          Email
                          <span className="mt-1 text-xs sm:ml-auto sm:mt-0 text-slate-500">
                            *Required, email address format
                          </span>
                        </FormLabel>
                        <FormInput
                          {...register("email")}
                          id="validation-form-2"
                          type="email"
                          name="email"
                          className={clsx({
                            "border-danger": errors.email,
                          })}
                          placeholder="youremail@gmail.com"
                        />
                        {errors.email && (
                          <div className="mt-2 text-danger">
                            {typeof errors.email.message === "string" &&
                              errors.email.message}
                          </div>
                        )}
                      </div>
                      {/* //designation name*/}
                      <div className="mt-3 input-form">
                        <FormLabel
                          htmlFor="validation-form-3"
                          className="flex flex-col w-full sm:flex-row"
                        >
                          Designation
                          <span className="mt-1 text-xs sm:ml-auto sm:mt-0 text-slate-500">
                            *Required, as per designation
                          </span>
                        </FormLabel>
                        <FormInput
                          {...register("designation")}
                          id="validation-form-3"
                          type="text"
                          name="designation"
                          className={clsx({
                            "border-danger": errors.designation,
                          })}
                          placeholder="Your Designation"
                        />
                        {errors.designation && (
                          <div className="mt-2 text-danger">
                            {typeof errors.designation.message === "string" &&
                              errors.designation.message}
                          </div>
                        )}
                      </div>
                      {/* //company name */}
                      <div className="mt-3 input-form">
                        <FormLabel
                          htmlFor="validation-form-4"
                          className="flex flex-col w-full sm:flex-row"
                        >
                          Company
                          <span className="mt-1 text-xs sm:ml-auto sm:mt-0 text-slate-500">
                            *Required, name of the company
                          </span>
                        </FormLabel>
                        <FormInput
                          {...register("company")}
                          id="validation-form-4"
                          type="text"
                          name="company"
                          className={clsx({
                            "border-danger": errors.company,
                          })}
                          placeholder="Company Name"
                        />
                        {errors.company && (
                          <div className="mt-2 text-danger">
                            {typeof errors.company.message === "string" &&
                              errors.company.message}
                          </div>
                        )}
                      </div>
                      {/* //Phone number */}
                      <div className="mt-3 input-form">
                        <FormLabel
                          htmlFor="validation-form-5"
                          className="flex flex-col w-full sm:flex-row"
                        >
                          Phone
                          <span className="mt-1 text-xs sm:ml-auto sm:mt-0 text-slate-500">
                            *Required, Phone number
                          </span>
                        </FormLabel>
                        <FormInput
                          {...register("phone")}
                          id="validation-form-5"
                          type="text"
                          name="phone"
                          className={clsx({
                            "border-danger": errors.phone,
                          })}
                          placeholder="Your Phone Number"
                        />
                        {errors.phone && (
                          <div className="mt-2 text-danger">
                            {typeof errors.phone.message === "string" &&
                              errors.phone.message}
                          </div>
                        )}
                      </div>
                      {/* //Whatsapp number */}
                      <div className="mt-3 input-form">
                        <FormLabel
                          htmlFor="validation-form-6"
                          className="flex flex-col w-full sm:flex-row"
                        >
                          WhatsApp
                          <span className="mt-1 text-xs sm:ml-auto sm:mt-0 text-slate-500">
                            *Required, WhatsApp Number
                          </span>
                        </FormLabel>
                        <FormInput
                          {...register("whatsapp")}
                          id="validation-form-6"
                          type="text"
                          name="whatsapp"
                          className={clsx({
                            "border-danger": errors.whatsapp,
                          })}
                          placeholder="Your WhatsApp Number"
                        />
                        {errors.whatsapp && (
                          <div className="mt-2 text-danger">
                            {typeof errors.whatsapp.message === "string" &&
                              errors.whatsapp.message}
                          </div>
                        )}
                      </div>
                      {/* BEGIN: Select Day */}
                      <div className="mt-3 input-form">
                        <>
                          <FormLabel
                            htmlFor="validation-form-7"
                            className="flex flex-col w-full sm:flex-row"
                          >
                            Select Day
                            <span className="mt-1 text-xs sm:ml-auto sm:mt-0 text-slate-500">
                              *Required, Select Day
                            </span>
                          </FormLabel>
                          <div className="p-0">
                            <div>
                              <TomSelect
                                {...register("selectedDay")}
                                id="validation-form-7"
                                name="selectedDay"
                                className={clsx({
                                  "border-danger": errors.selectedDay,
                                })}
                                value={selectedDay}
                                onChange={handleDayChange}
                                required
                                options={{
                                  placeholder: "Select your prefered day",
                                  // create: false, // Disable creation of new items
                                }}
                                multiple
                              >
                                <option value="1">Day1 on Feb 22nd 2024</option>
                                <option value="2">Day2 on Feb 23nd 2024</option>
                                <option value="3">Day3 on Feb 24nd 2024</option>
                              </TomSelect>
                            </div>
                          </div>
                          {/* Display error message for selectedDay */}
                          {/* {errors.selectedDay && (
                            <div className="mt-2 text-danger">
                              {Array.isArray(errors.selectedDay)
                                ? "Please select at least one day"
                                : errors.selectedDay.message &&
                                  String(errors.selectedDay.message)}
                            </div>
                          )} */}
                        </>
                      </div>
                      {/* END: Select Day */}
                      {/* //Select Category */}
                      <div className="mt-3 input-form">
                        <>
                          <FormLabel
                            htmlFor="validation-form-8"
                            className="flex flex-col w-full sm:flex-row"
                          >
                            Select Category
                            <span className="mt-1 text-xs sm:ml-auto sm:mt-0 text-slate-500">
                              *Required, Select Category
                            </span>
                          </FormLabel>
                          <div className="p-0">
                            <div>
                              <TomSelect
                                {...register("selectedCategory")}
                                id="validation-form-8"
                                name="selectedCategory"
                                className={clsx({
                                  "border-danger": errors.selectedCategory,
                                })}
                                value={selectedCategory}
                                onChange={handleCategoryChange}
                                required
                                options={{
                                  placeholder: "Select your prefered category",
                                  // create: false, // Disable creation of new items
                                }}
                                // className="w-full"
                                multiple
                              >
                                {/* Options based on selected day */}
                                {selectedDay.includes("1") && (
                                  <>
                                    <option value="1">Day1 Water Today</option>
                                    <option value="2">Day1 Solar Today</option>
                                  </>
                                )}
                                {selectedDay.includes("2") && (
                                  <option value="3">Day2 Wind Today</option>
                                )}
                                {selectedDay.includes("3") && (
                                  <option value="4">Day3 Land Today</option>
                                )}
                              </TomSelect>
                            </div>
                          </div>
                        </>
                      </div>
                      {/* END: Select Category */}
                      {/* //Select Exhibitor */}
                      <div className="mt-3 input-form">
                        <>
                          <FormLabel
                            htmlFor="validation-form-9"
                            className="flex flex-col w-full sm:flex-row"
                          >
                            Select Exhibitor
                            <span className="mt-1 text-xs sm:ml-auto sm:mt-0 text-slate-500">
                              *Required, Select Exhibitor
                            </span>
                          </FormLabel>
                          <div className="p-0">
                            <div>
                              <TomSelect
                                {...register("selectedExhibitor")}
                                id="validation-form-9"
                                name="selectedExhibitor"
                                className={clsx({
                                  "border-danger": errors.selectedExhibitor,
                                })}
                                value={selectedExhibitor}
                                onChange={handleExhibitorChange}
                                required
                                options={{
                                  placeholder: "Select your prefered Exhibitor",
                                  // create: false, // Disable creation of new items
                                }}
                                // className="w-full"
                                multiple
                              >
                                {/* Options based on selected category */}
                                {selectedCategory.includes("1") && (
                                  <>
                                    <option value="1">Day1 Water</option>
                                  </>
                                )}
                                {selectedCategory.includes("2") && (
                                  <option value="2">Day1 Solar</option>
                                )}
                                {selectedCategory.includes("3") && (
                                  <option value="3">Day2 Wind</option>
                                )}
                                {selectedCategory.includes("4") && (
                                  <option value="4">Day3 Land</option>
                                )}
                              </TomSelect>
                            </div>
                          </div>
                        </>
                      </div>
                      {/* END: Select Exhibitor */}
                      {/* //Select Time Slot */}
                      <div className="mt-3 input-form">
                        <>
                          <FormLabel
                            htmlFor="validation-form-10"
                            className="flex flex-col w-full sm:flex-row"
                          >
                            Select Time Slot
                            <span className="mt-1 text-xs sm:ml-auto sm:mt-0 text-slate-500">
                              *Required, Select Time Slot
                            </span>
                          </FormLabel>
                          <div className="p-0">
                            <div>
                              <TomSelect
                                {...register("selectedTimeSlot")}
                                id="validation-form-10"
                                name="selectedTimeSlot"
                                className={clsx({
                                  "border-danger": errors.selectedTimeSlot,
                                })}
                                value={selectedTimeSlot}
                                onChange={handleTimeSlotChange}
                                required
                                options={{
                                  placeholder: "Select your prefered Time Slot",
                                  // create: false, // Disable creation of new items
                                }}
                                // className="w-full"
                                multiple
                              >
                                {/* Options based on selected exhibitor */}
                                {selectedExhibitor.includes("1") && (
                                  <option value="1">
                                    Water Today - 10:00AM
                                  </option>
                                )}
                                {selectedExhibitor.includes("2") && (
                                  <option value="2">
                                    Solar Today - 11:00AM
                                  </option>
                                )}
                                {selectedExhibitor.includes("3") && (
                                  <option value="3">
                                    Wind Today - 03:00PM
                                  </option>
                                )}
                                {selectedExhibitor.includes("4") && (
                                  <option value="4">
                                    Land Today - 12:00PM
                                  </option>
                                )}
                              </TomSelect>
                            </div>
                          </div>
                        </>
                        
                      </div>
                      {/* END: Select Time Slot */}
                      {/* //Comment */}
                      <div className="mt-3 input-form">
                        <FormLabel
                          htmlFor="validation-form-11"
                          className="flex flex-col w-full sm:flex-row"
                        >
                          Note
                          <span className="mt-1 text-xs sm:ml-auto sm:mt-0 text-slate-500">
                            At least 10 characters
                          </span>
                        </FormLabel>
                        <FormTextarea
                          {...register("comment")}
                          id="validation-form-11"
                          name="comment"
                          className={clsx({
                            "border-danger": errors.comment,
                          })}
                          placeholder="Feel Free to Leave us a Note!"
                        ></FormTextarea>
                        {errors.comment && (
                          <div className="mt-2 text-danger">
                            {typeof errors.comment.message === "string" &&
                              errors.comment.message}
                          </div>
                        )}
                      </div>
                      {/* //Register */}
                      <div className="flex justify-center mt-5">
                        <Button
                          variant="primary"
                          type="submit"
                          // className="mt-5"
                          // className="w-full lg:w-auto"
                          className="w-full"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? "Registering..." : "Register"}
                          {/* Register */}
                        </Button>
                      </div>
                    </form>
                    {/* END: Validation Form */}
                  </div>
                </div>
              </>
            </div>
            {/* END: Form Validation */}
            
            {/* BEGIN: Success Notification Content */}
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
            {/* END: Success Notification Content */}

            {/* BEGIN: Failed Notification Content */}
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
            {/* END: Failed Notification Content */}
          </div>
        </div>
      </div>
    </>
  );
}

export default Main;
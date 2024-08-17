import logoUrl from "../../assets/images/logo.svg";
import Button from "../../base-components/Button";
import { FormInput, FormCheck } from "../../base-components/Form";

//Success
import Lucide from "../../base-components/Lucide";
import { Dialog } from "@headlessui/react";
//End Success

//Funct
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Alert from "../../base-components/Alert";
import {API_BASE_URL} from "../../utils/variables";
// import LoadingIcon from "../LoadingIcon";
//End Funct

function Register() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [successModalPreview, setSuccessModalPreview] = useState(false);
  const [loading, setLoading] = useState(false); // State to track loading state
  const [errorMessage, setErrorMessage] = useState(""); // Add state for error message
  const navigate = useNavigate();

  const handleSubmit = () => {
    const nameRegex = /^[A-Za-z]{5,}$/; // At least 5 alphabetical characters
    const emailRegex = /^[A-Za-z0-9]+@[A-Za-z]+\.[A-Za-z]+$/; // Email format
    const passwordRegex =
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{5,}$/; // Password format
    if (firstName.length === 0) {
      setErrorMessage("Enter valid info in all fields!");
      return;
    }
    if (!nameRegex.test(firstName)) {
      setErrorMessage("First name: Min. 5 letters.");
      return;
    }

    if (!lastName) {
      setErrorMessage("Last name: Required.");
      return;
    }

    if (!emailRegex.test(email)) {
      setErrorMessage("Email: Must contain '@' and end with '.domain'.");
      return;
    }

    if (!passwordRegex.test(password)) {
      setErrorMessage(
        "Password: Min. 5 characters, 1 uppercase, 1 lowercase, 1 special character, 1 number."
      );
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords don't match.");
      return;
    } else {
      setLoading(true); // Start loading
      const url = API_BASE_URL+"/server";
      const data = { firstName, lastName, email, password, confirmPassword };

      axios
        .post(url, data, { withCredentials: true })
        .then((response) => {
          console.log(response); // Check server response
          setLoading(false); // Stop loading
          setSuccessModalPreview(true);
        })
        .catch((error) => {
          setLoading(false); // Stop loading
          if (error.response && error.response.status === 400) {
            setErrorMessage(error.response.data); // Update error message
          } else {
            setErrorMessage("User registration error."); // Update error message
          }
        });
    }
  };
  const handleLog = () => {
    navigate("/login");
  };

  const handleDismiss = () => {
    setErrorMessage(""); // Clear error message when dismissed
  };

  return (
    <>
      <div className="container">
        <div className="flex items-center justify-center w-full min-h-screen p-5 md:p-20 ">
          {/* Error message */}
          {/* <div className="fixed top-10 right-7 mr-5 w-full max-w-[450px] mx-auto z-50 "> */}
          <div className="fixed top-10 right-7 mr-5 max-w-[450px] mx-auto z-50 ">
            {errorMessage && (
              <Alert
                variant={
                  errorMessage.includes("Email already registered!")
                    ? "warning"
                    : "danger"
                }
                className="flex items-center mb-2 mt-4"
              >
                {({ dismiss }) => (
                  <>
                    <Lucide
                      icon={
                        errorMessage.includes("Email already registered!")
                          ? "AlertCircle"
                          : "AlertOctagon"
                      }
                      className="w-6 h-6 mr-4 w-full max-w-[50px]"
                    />
                    <span className="mr-9">{errorMessage}</span>{" "}
                    <Alert.DismissButton
                      type="button"
                      className="text-white"
                      aria-label="Close"
                      onClick={() => setErrorMessage("")}
                    >
                      <Lucide icon="X" className="w-4 h-4" />
                    </Alert.DismissButton>
                  </>
                )}
              </Alert>
            )}
          </div>
          {/* End of Error Message */}
          <div className="w-96 intro-y">
            {/* <img
              className="w-16 mx-auto"
              alt="Rocketman - Tailwind HTML Admin Template"
              src={logoUrl}
            /> */}
            <div className="text-2xl font-medium text-center text-white dark:text-slate-300 mt-14">
              Register a New Account
            </div>
            <div className="box px-5 py-8 mt-10 max-w-[450px] relative before:content-[''] before:z-[-1] before:w-[95%] before:h-full before:bg-slate-200 before:border before:border-slate-200 before:-mt-5 before:absolute before:rounded-lg before:mx-auto before:inset-x-0 before:dark:bg-darkmode-600/70 before:dark:border-darkmode-500/60">
              <FormInput
                type="text"
                className="block px-4 py-3"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
              <FormInput
                type="text"
                className="block px-4 py-3 mt-4"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
              <FormInput
                type="text"
                className="block px-4 py-3 mt-4"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <FormInput
                type="password"
                className="block px-4 py-3 mt-4"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <FormInput
                type="password"
                className="block px-4 py-3 mt-4"
                placeholder="Password Confirmation"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <div className="flex items-center mt-4 text-xs text-slate-500 sm:text-sm">
                <FormCheck.Input
                  id="remember-me"
                  type="checkbox"
                  className="mr-2 border"
                />
                <label
                  className="cursor-pointer select-none"
                  htmlFor="remember-me"
                >
                  I agree to the Eventink
                </label>
                <a className="ml-1 text-primary dark:text-slate-200" href="">
                  Privacy Policy
                </a>
                .
              </div>
              <div className="mt-5 text-center xl:mt-8 xl:text-left">
                <Button
                  variant="primary"
                  className="w-full xl:mr-3"
                  onClick={handleSubmit}
                  disabled={loading} // Disable the button when loading
                >
                  {loading ? ( // Conditional rendering based on loading state
                    <>
                      Registering...
                      {/* <LoadingIcon
                        icon="oval"
                        color="white"
                        className="w-4 h-4 ml-2"
                      /> */}
                    </>
                  ) : (
                    "Register"
                  )}
                </Button>
                <Button
                  variant="outline-secondary"
                  className="w-full mt-3"
                  onClick={handleLog}
                  disabled={loading}
                >
                  Sign in
                </Button>
              </div>
            </div>
            {/* Success Modal */}
            <Dialog
              open={successModalPreview}
              onClose={() => setSuccessModalPreview(false)}
              className="fixed inset-0 z-50 overflow-y-auto"
            >
              <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center block sm:p-0">
                <Dialog.Overlay className="fixed inset-0 bg-black opacity-60 transition-opacity duration-1000 ease-in-out" />

                <span
                  className="hidden sm:inline-block sm:align-middle sm:h-screen"
                  aria-hidden="true"
                >
                  &#8203;
                </span>
                <Dialog.Panel
                  className="inline-block align-bottom bg-white rounded-lg 
                text-left overflow-hidden shadow-xl transform transition-all 
                sm:my-8 sm:align-middle sm:max-w-lg sm:w-full transition duration-1000 ease-in-out"
                >
                  <div className="p-5 text-center">
                    <Lucide
                      icon="CheckCircle"
                      className="w-16 h-16 mx-auto mt-3 text-success"
                    />
                    <div className="mt-5 text-3xl">Good News</div>
                    <div className="mt-2 text-slate-500">
                      Account created successfully!
                    </div>
                  </div>
                  <div className="px-5 pb-8 text-center">
                    <Button
                      type="button"
                      variant="primary"
                      onClick={() => {
                        setSuccessModalPreview(false);
                        navigate("/login"); // Redirect to login page
                      }}
                      className="w-24"
                    >
                      Sigin
                    </Button>
                  </div>
                </Dialog.Panel>
              </div>
            </Dialog>
          </div>
        </div>
      </div>
    </>
  );
}

export default Register;

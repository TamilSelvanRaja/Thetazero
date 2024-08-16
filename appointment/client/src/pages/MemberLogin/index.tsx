import logoUrl from "../../assets/images/logo.svg";
import Button from "../../base-components/Button";
import { FormInput, FormCheck } from "../../base-components/Form";
import Lucide from "../../base-components/Lucide";

//Funct
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Alert from "../../base-components/Alert";
//End Funct

function Login() {
  const [phone, setPhone] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  // const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();



  const handleLogin = () => {
    if (phone.length === 0 ) {
      setErrorMessage("Phone number require!");
    } else {
      const url = "http://216.10.245.157:3000/Server/memberlogin";
      const data = { phone };
      
      axios
      .post(url, data, { withCredentials: true })
      .then((response) => {
        setErrorMessage("");
        const { userName, userId } = response.data;
        localStorage.setItem("userId", userId);
        localStorage.setItem("userName", userName); // Store user's name in localStorage
        localStorage.setItem("userPhone", phone); // Store user's phone number in localStorage
        navigate("/MemberForm");
      })
      .catch((error) => {
        if (error.response && error.response.status === 401) {
          setErrorMessage("Invalid phone number");
        } else {
          setErrorMessage("Error during login");
        }
      });
    }
  };

  return (
    <>
      <div className="container">
        <div className="flex items-center justify-center w-full min-h-screen p-5 md:p-20">
          {/* Error message */}
          <div className="fixed top-10 right-7 mr-5 ">
            {errorMessage && (
              <Alert
                variant={
                  errorMessage.includes("Invalid email or password")
                    ? "warning"
                    : "danger"
                }
                className="flex items-center mb-2 mt-4"
              >
                {({ dismiss }) => (
                  <>
                    <Lucide
                      icon={
                        errorMessage.includes("Invalid email or password")
                          ? "AlertCircle"
                          : "AlertOctagon"
                      }
                      className="w-6 h-6 mr-2"
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
              Visitor Login!
            </div>
            <div className="box px-5 py-8 mt-10 max-w-[450px] relative before:content-[''] before:z-[-1] before:w-[95%] before:h-full before:bg-slate-200 before:border before:border-slate-200 before:-mt-5 before:absolute before:rounded-lg before:mx-auto before:inset-x-0 before:dark:bg-darkmode-600/70 before:dark:border-darkmode-500/60">
              <FormInput
                type="text"
                className="block px-4 py-3"
                placeholder="Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              {/* <div className="flex mt-4 text-xs text-slate-500 sm:text-sm"> */}
                {/* <div className="flex items-center mr-auto">
                  <FormCheck.Input
                    id="remember-me"
                    type="checkbox"
                    className="mr-2 border"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <label
                    className="cursor-pointer select-none"
                    htmlFor="remember-me"
                  >
                    Remember me
                  </label>
                </div> */}
                {/* <a href="">Forgot Password?</a> */}
              {/* </div> */}
              <div className="mt-5 text-center xl:mt-8 xl:text-left">
                <Button
                  variant="primary"
                  className="w-full xl:mr-3"
                  onClick={handleLogin}
                >
                  Login
                </Button>
                {/* <Button
                  variant="outline-secondary"
                  className="w-full mt-3"
                  onClick={handleReg}
                >
                  Sign up
                </Button> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;

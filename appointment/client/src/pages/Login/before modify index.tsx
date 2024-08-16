




// FRONTEND LOGIN BEFORE MODIFY OF THE REAL DATABASE








import logoUrl from "../../assets/images/logo.svg";
import Button from "../../base-components/Button";
import { FormInput, FormCheck } from "../../base-components/Form";
import Lucide from "../../base-components/Lucide";
import TomSelect from "../../base-components/TomSelect";

//Funct
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Alert from "../../base-components/Alert";
//End Funct

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [select, setSelect] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const storedEmail = localStorage.getItem("rememberedEmail");
    const storedPassword = localStorage.getItem("rememberedPassword");
    if (storedEmail && storedPassword) {
      setEmail(storedEmail);
      setPassword(storedPassword);
      setRememberMe(true);
    } else {
      setRememberMe(false);
    }
      // Initialize select state with "1" (Organization) by default
  setSelect("1");
  }, []);

  const handleLogin = () => {
    if (email.length === 0 || password.length === 0) {
      setErrorMessage("Email and password are required!");
    } else {
      const url = "http://localhost:3001/Server/adminlogin";
      const data = { email, password, select };

      axios
        .post(url, data, { withCredentials: true })
        .then((response) => {
          setErrorMessage("");
          // alert(response.data);
          const { adminId } = response.data;
          localStorage.setItem("adminId", adminId);
          if (rememberMe) {
            localStorage.setItem("rememberedEmail", email);
            localStorage.setItem("rememberedPassword", password);
          } else {
            localStorage.removeItem("rememberedEmail");
            localStorage.removeItem("rememberedPassword");
          }
          navigate("/calendar");

        })
        .catch((error) => {
          if (error.response) {
            if (error.response.status === 401) {
              setErrorMessage("Invalid email or password");
            } else if (error.response.status === 400) {
              setErrorMessage("Invalid selection");
            } else if (error.response.status === 500) {
              setErrorMessage("Error accessing database");
            } else {
              setErrorMessage("Unknown error occurred");
            }
          } else {
            setErrorMessage("Network error occurred");
          }
        });
    }
  };

  const handleDismiss = () => {
    setErrorMessage(""); // Clear error message when dismissed
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
              Admin Login!
            </div>
            <div className="box px-5 py-8 mt-10 max-w-[450px] relative before:content-[''] before:z-[-1] before:w-[95%] before:h-full before:bg-slate-200 before:border before:border-slate-200 before:-mt-5 before:absolute before:rounded-lg before:mx-auto before:inset-x-0 before:dark:bg-darkmode-600/70 before:dark:border-darkmode-500/60">
              <FormInput
                type="text"
                className="block px-4 py-3"
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
              <div className="flex mt-4 text-xs text-slate-500 sm:text-sm">
                <div className="flex items-center mr-auto">
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
                </div>
                {/* <a href="">Forgot Password?</a> */}
              </div>

                {/* BEGIN: Basic Select */}
                <div>
                      {/* <label>Basic</label> */}
                      <br/>
                      <div className="mt-2">
                        <TomSelect value={select} onChange={setSelect} options={{
                                      placeholder: "Select Your Option",
                                    }} className="w-full">
                            <option value="1">Organization</option>
                            <option value="2">Exhibitor</option>
                        </TomSelect>
                    </div>
                </div>
                {/* END: Basic Select */}

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

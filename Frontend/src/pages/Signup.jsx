import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, NavLink } from "react-router";
import { useEffect, useState } from "react";
import { registerUser } from "../authSlice";

// SchemaValidation  for signup

const signupSchema = z.object({
  firstName: z.string().min(3, "Minimum character should be 3"),
  emailId: z.string().email("Invalid Email"),
  password: z.string().min(8, "Password is too weak"),
});

function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(signupSchema) });

  // here this 'errors' contains the errors in the respected fields if there is any (See Below)

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const submittedData = (data) => {
    dispatch(registerUser(data));
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title justify-center text-3xl">LeetCode</h2>
          <form onSubmit={handleSubmit(submittedData)}>
            {/* Existing form fields */}
            <div className="form-control">
              <label className="label mb-1">
                <span className="label-text">First Name</span>
              </label>
              <input
                type="text"
                placeholder="John"
                className={`input input-bordered ${errors.firstName && "input-error"}`}
                {...register("firstName")}
              />
              {errors.firstName && (
                <span className="text-error">{errors.firstName.message}</span>
              )}
            </div>

            <div className="form-control mt-4">
              <label className="label mb-1">
                <span className="lablel-text">Email</span>
              </label>
              <input
                type="email"
                placeholder="john@example.com"
                className={`input input-bordered ${errors.emailId && "input-error"}`}
                {...register("emailId")}
              />
              {errors.emailId && (
                <span className="text-error">{errors.emailId.message}</span>
              )}
            </div>

            <div className="form-control mt-4">
              <label className="label mb-1">
                <span className="lablel-text">Password</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  // Added pr-10 (padding-right) to make space for the button
                  className={`input input-bordered w-full pr-10 ${
                    errors.password ? "input-error" : ""
                  }`}
                  {...register("password")}
                />

                <button
                  type="button"
                  className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"} // Accessibility
                >
                  {showPassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-5 0-9.27-3.11-11-7a10.05 10.05 0 012.25-3.425M6.75 6.75A10.05 10.05 0 0112 5c5 0 9.27 3.11 11 7a10.05 10.05 0 01-2.25 3.425M6.75 6.75L17.25 17.25"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  )}
                </button>
              </div>

              {errors.password && (
                <span className="text-error">{errors.password.message}</span>
              )}
            </div>

            {/* Submit Button */}
            <div className="form-control mt-8 flex justify-center">
              <button
                type="submit"
                className={`btn btn-primary ${loading ? "loading" : ""}`}
                disabled={loading}
              >
                {loading ? "Signing Up..." : "Sign Up"}
              </button>
            </div>
          </form>

          {/* Login Redirect */}
          <div className="text-center mt-6">
            <span className="text-sm">
              Already have an account?{" "}
              <NavLink to="/login" className="link link-primary">
                Login
              </NavLink>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;

// const errors =  {
//     firstName:{
//       type:'minLength', // Type of validation that failed
//       message:'Minimum character should be 3' // Custom error message
//     }

//     emailId:{

//          type:'Invalid_string', // Type of validation that failed
//         message:'Invalid Email' // Custom error message

//     }

//     password:{

//     }
// }

// if no errors then
// firstName : undefined
// emailName: undefined
// password: undefined

// -------------------------------------------------------------------------------------------------------

// {
//     firstName:
//     Onchange:
//     Onclick
// }

// import { useState } from "react";

// function Signup (){

// const [name,setName] = useState('');
// const [email,setEmail] = useState('');
// const [password,setPassword] = useState('');

//  const handleSumbmit = (e)=>{

//     e.preventDefault();

//      console.log(name,email,password);

//     // validation
//     //form kon submit
//     //backend submit

//  }

//     return (

//        <form  onSubmit={handleSumbmit} className="min-h-screen flex flex-col justify-center items-center gap-4" >
//           <input type="text" value ={name} placeholder="Enter your first name"  onChange={(e)=>setName(e.target.value)}></input>
//           <input type="email" value ={email} placeholder="Enter your Email"  onChange={(e)=>setEmail(e.target.value)}></input>
//           <input type="password" value ={password} placeholder="Enter your Password"  onChange={(e)=>setPassword(e.target.value)}></input>
//           <button type="submit">Submit</button>
//        </form>

//     )
// }

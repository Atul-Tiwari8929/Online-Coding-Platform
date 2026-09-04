import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { loginUser } from "../authSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, NavLink } from "react-router";
import { useEffect } from "react";

// SchemaValidation  for signup

const signupSchema = z.object({
  emailId: z.string().email("Invalid Email"),
  password: z.string().min(8, "Password is too weak"),
});

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, loading, error } = useSelector(
    (state) => state.auth,
  );

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
  }, [isAuthenticated]);

  const submittedData = (data) => {
    dispatch(loginUser(data));
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title justify-center text-3xl">LeetCode</h2>
          <form onSubmit={handleSubmit(submittedData)}>
            {/* Existing form fields */}

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
              <input
                type="password"
                placeholder="********"
                className={`input input-bordered ${errors.password && "input-error"}`}
                {...register("password")}
              />
              {errors.password && (
                <span className="text-error">{errors.password.message}</span>
              )}
            </div>

            <div className="form-control mt-6 flex justify-center">
              <button type="submit" className="btn btn-primary">
                Login
              </button>
            </div>
          </form>
          {/* SignUp Redirect */}
          <div className="text-center mt-6">
            <span className="text-sm">
              Don't have an account?{" "}
              <NavLink to="/signup" className="link link-primary">
                Sign Up
              </NavLink>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;

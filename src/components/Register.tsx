import React from "react";
import { Navigate } from "react-router-dom";

/**
 * Register component redirects directly to the unified appointment booking journey
 * at /appointment?auth=new as per TRUDENT continuous patient booking workflow.
 */
export const Register: React.FC = () => {
  return <Navigate to="/appointment?auth=new" replace />;
};

export default Register;

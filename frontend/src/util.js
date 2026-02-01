import { useEffect } from "react";
import { useNavigate,useLocation } from "react-router-dom";
import {toast} from "react-toastify"
export const handleSuccess=(msg)=>{
  toast.success(msg,{
    position:"top-right"
  })
}
export const handleError=(msg)=>{
  toast.error(msg,{
    position:"top-right"
  })
}



// export const RedirectIfAuthenticated = ({ children }) => {
//   const navigate = useNavigate();

//   useEffect(() => {
//     const user = JSON.parse(sessionStorage.getItem("user") || "null");
//     if (user && user.role) {
//       const redirectMap = {
//         user: "/profile",
//         admin: "/admindashboard",
//         owner: "/alluser",
//       };

//       const target = redirectMap[user.role];
//       if (target) navigate(target, { replace: true });
//       else sessionStorage.removeItem("user");
//     }
//   }, [navigate]);

//   return children;
// };

export const RedirectIfAuthenticated = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("user") || "null");
    if (user && user.role) {
      const redirectMap = {
        user: "/profile",
        admin: "/admindashboard",
        owner: "/alluser",
      };

      const target = redirectMap[user.role];
      if (target) navigate(target, { replace: true });
      else sessionStorage.removeItem("user");
    }
  }, [navigate]);

  return children;
};



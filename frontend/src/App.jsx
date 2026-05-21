import { RouterProvider } from "react-router"
import { router } from "./app.routes.jsx"
import { AuthProvider } from "./features/auth/auth.context.jsx"
import { InterviewProvider } from "./features/interview/interview.context.jsx"
import { ToastContainer, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function App() {

  return (
    <AuthProvider>
      <InterviewProvider>
        <RouterProvider router={router} />

        <ToastContainer
          position="top-center"
          autoClose={5000}
          hideProgressBar={false}
          closeOnClick={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
          transition={Bounce}
        />
      </InterviewProvider>
    </AuthProvider>
  )
}

export default App
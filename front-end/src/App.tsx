import { RouterProvider } from "react-router-dom";
import router from "./routes";
import { AuthProvider } from "./hooks/useAuth";
import { ToastProvider } from "./hooks/useToast";

const App = () => {
  return (
    <AuthProvider>
      <ToastProvider>
        <RouterProvider router={router}></RouterProvider>
      </ToastProvider>
    </AuthProvider>
  );
};

export default App;

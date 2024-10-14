import { RouterProvider } from "react-router-dom";
import router from "./routes";
import { AuthProvider } from "./hooks/useAuth";
import { ToastProvider } from "./hooks/useToast";

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <RouterProvider router={router}></RouterProvider>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;

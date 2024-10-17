import { RouterProvider } from "react-router-dom";
import router from "./routes";
import { AuthProvider } from "./hooks/useAuth";
import { ToastProvider } from "./hooks/useToast";
import { LoadingProvider } from "./hooks/useLoading";

const App = () => {
  return (
    <AuthProvider>
      <ToastProvider>
        <LoadingProvider>
          <RouterProvider router={router}></RouterProvider>
        </LoadingProvider>
      </ToastProvider>
    </AuthProvider>
  );
};

export default App;

import { LoadingProvider } from "./contexts/UseLoading";
import { AuthProvider } from "./contexts/AuthContext";
import { Router } from "./Router";

const App = () => 
  (
    <LoadingProvider>
      <AuthProvider>
        <Router />
      </AuthProvider>
    </LoadingProvider>
  );

export default App;

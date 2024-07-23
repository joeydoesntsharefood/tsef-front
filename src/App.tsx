import { LoadingProvider } from "./contexts/UseLoading";
import { AuthProvider } from "./contexts/UserContext";
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

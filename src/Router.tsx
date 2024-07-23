import { BrowserRouter, Route, Routes } from "react-router-dom";
import { routes } from "./route";

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        {
          routes
            .filter(({ sidebar }) => !sidebar)
            .map(({ element, path }) => 
              <Route
                path={path} 
                element={element}
              />
            )
        }
      </Routes>
    </BrowserRouter>
  );
} 

export { Router };
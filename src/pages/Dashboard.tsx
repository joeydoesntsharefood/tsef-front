import { Route, Routes, useLocation } from "react-router-dom";
import { routes } from "../route";
import SideBar from "../components/Sidebar";

const Dashboard = () => {
  const { pathname } = useLocation();

  const currentPath = routes
    .filter(({ sidebar }) => sidebar)
    .find(({ path }) => {
      if (pathname === '/dashboard' && path === '')
        return true;
      
      return `/dashboard${path}` === pathname;
    });

  return (
    <div className='dashboard'>
      <div className='dashboard__sidebar'>
        <SideBar />
      </div>
      
      <div className='dashboard__content pa-nano'>
        <p className='text-lg full-width'>
          {currentPath?.title ?? '-'}
        </p>

        <div className="dashboard__content__card">
          <Routes>
            {
              routes
                .filter(({ sidebar }) => sidebar)
                .map(({ element, path }) =>
                    <Route
                    path={path} 
                    element={element}
                  />
                )
            }
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
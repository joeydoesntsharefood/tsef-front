import { useLocation, useNavigate } from "react-router-dom"
import { routes } from "../route";
import { useAuth } from "../contexts/UserContext";
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import t from "../translate";

const SideBar = () => {
  const history = useNavigate();
  const { pathname } = useLocation();
  const { user, signout } = useAuth();

  const currentPath = routes
    .filter(({ sidebar }) => sidebar)
    .find(({ path }) => {
      if (pathname === '/dashboard' && path === '')
        return true;
      
      return `/dashboard${path}` === pathname;
    });

  return (
    <div className='sidebar'>
      {
        routes
        .filter(({ sidebar }) => sidebar)
        .map(({ path, title, icon }) => 
          <div
            className={`sidebar__item cursor-pointer${currentPath.path === path ? ' active' : '' }`} 
            onClick={() => history(`/dashboard${path}`)}
          >
            {icon}
            <p className='ma-none'>
              {
                path !== '/user'
                ? title
                : user?.name
              }
            </p>
          </div>
        )
      }

      <div
        className={`sidebar__item cursor-pointer`}
        onClick={async () => {
          const res = await signout();
          if (res) history('/');
        }}
      >
        <MeetingRoomIcon />
        <p className='ma-none'>
          {t('pages.dashboard.signout')}
        </p>
      </div>
    </div>
  );
};

export default SideBar;
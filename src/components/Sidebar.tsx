import { useLocation, useNavigate } from "react-router-dom"
import { routes } from "../route";
import { useAuth } from "../contexts/UserContext";
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import t from "../translate";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { FC } from "react";

interface Props {
  handleCollapse(): void;
  hasCollapse: boolean;
}

const SideBar: FC<Props> = ({ handleCollapse, hasCollapse }) => {
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
      <div className='sidebar__actions'>
        {
          hasCollapse
          ? <ArrowForwardIosIcon className='sidebar__icon cursor-pointer' onClick={handleCollapse} />
          : <ArrowBackIosIcon className='sidebar__icon cursor-pointer' onClick={handleCollapse} />
        }
      </div>
      <div className='sidebar__items'>
       {
          routes
          .filter(({ sidebar }) => sidebar)
          .map(({ path, title, icon }) => 
            <div
              className={`sidebar__items__item cursor-pointer${currentPath.path === path ? ' active' : '' }`} 
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
          className={`sidebar__items__item cursor-pointer`}
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
    </div>
  );
};

export default SideBar;
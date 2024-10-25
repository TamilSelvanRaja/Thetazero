import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setMenu, selectSideMenu } from './sideMenuSlice';
import { RootState } from './store';

const App: React.FC = () => {
  const dispatch = useDispatch();
  const menu = useSelector((state: RootState) => state.sideMenu.menu);

  useEffect(() => {
    const storedSelect = localStorage.getItem("select");
    if (storedSelect === '2') { // Exhibitor
      dispatch(setMenu([
        "MENU",
        {
          icon: "Home",
          pathname: "/dashboard-overview-2",
          title: "Dashboard",
        },
        {
          icon: "Calendar",
          pathname: "/calendar",
          title: "Calendar",
        },
        {
          icon: "MessageSquare",
          pathname: "/Feedback",
          title: "Feedback",
        },
        {
          icon: "Activity",
          pathname: "/Appoinment",
          title: "Appoinments",
        },
      ]));
    }
  }, [dispatch]);

  return (
    <div>
      {menu.map((item, index) => (
        typeof item === 'string' ? (
          <div key={index}>{item}</div>
        ) : (
          <div key={index}>{item.title}</div>
        )
      ))}
    </div>
  );
};

export default App;

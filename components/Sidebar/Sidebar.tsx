import React, { Fragment } from "react";
import { CSSTransition } from "react-transition-group";

import { useAuth } from "contexts/auth";
import Button from "components/shared/Button";
import slideAnimation from "./slide.module.scss";
import styles from "./Sidebar.module.scss";

const Sidebar = ({ opened, onClose }) => {
  const { logout, user } = useAuth();

  const handleLogout = () => {
    onClose();
    logout();
  };

  return (
    <Fragment>
      {opened && <div className={styles.backdrop} onClick={onClose}></div>}
      <CSSTransition
        in={opened}
        timeout={200}
        classNames={slideAnimation}
        unmountOnExit
      >
        {(state) => (
          <div className={styles.sidebar}>
            <span className={styles["sidebar__x"]} onClick={onClose}>
              X
            </span>
            <span className={styles["sidebar__email"]}>{user.email}</span>
            <div className={styles["sidebar__logout"]}>
              <Button invert={true} onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        )}
      </CSSTransition>
    </Fragment>
  );
};

export default Sidebar;

import React, { useState } from "react";
import Link from "next/link";
import { Formik } from "formik";

import styles from "./Login.module.scss";
import userService from "services/userService";

const Login = () => {
  const [wrongCred, setWrongCred] = useState(false);

  const handleSubmit = async (user) => {
    try {
      setWrongCred(false);
      const userData = await userService.login(user);
      console.log(userData);
    } catch (error) {
      setWrongCred(true);
    }
  };
  
  return (
    <Formik
      initialValues={{
        email: "",
        password: "",
      }}
      onSubmit={handleSubmit}
    >
      {({ values, isSubmitting, handleChange, handleBlur, handleSubmit }) => (
        <form className={styles.login} onSubmit={handleSubmit}>
          <div className={styles["login__wrapper"]}>
            <h3 className={styles["login__title"]}>Login</h3>
            <input
              name="email"
              type="text"
              placeholder="Email"
              value={values.email}
              onChange={(value) =>{
                setWrongCred(false); 
                handleChange(value)
              }}
              onBlur={handleBlur}
            />
            <input
              name="password"
              type="password"
              placeholder="Password"
              value={values.password}
              onChange={(e) =>{
                setWrongCred(false); 
                handleChange(e)
              }}
              onBlur={handleBlur}
            />
            <button type="submit" disabled={isSubmitting}>
              Login
            </button>
            <Link href="/signup">
              <a className={styles["login__link"]}>Create an account</a>
            </Link>
            <div className={styles["login__errors"]}>
              {wrongCred && <div >Wrong email or password</div>}
            </div>
          </div>
        </form>
      )}
    </Formik>
  );
};

export default Login;

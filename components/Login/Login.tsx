import React, { useState } from "react";
import Link from "next/link";
import { Formik } from "formik";

import { useAuth } from "contexts/auth";

import styles from "./Login.module.scss";
import Button from "components/Button";

const Login = () => {
  const { login } = useAuth();
  const [wrongCred, setWrongCred] = useState(false);

  const handleSubmit = async (user) => {
    setWrongCred(false);
    try {
      await login(user);
    } catch {
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
              onChange={(value) => {
                setWrongCred(false);
                handleChange(value);
              }}
              onBlur={handleBlur}
            />
            <input
              name="password"
              type="password"
              placeholder="Password"
              value={values.password}
              onChange={(e) => {
                setWrongCred(false);
                handleChange(e);
              }}
              onBlur={handleBlur}
            />
            <Button type="submit" invert={false} disabled={isSubmitting}>
              Login
            </Button>
            <Link href="/signup">
              <a className={styles["login__link"]}>Create an account</a>
            </Link>
            <div className={styles["login__errors"]}>
              {wrongCred && <div>Wrong email or password</div>}
            </div>
          </div>
        </form>
      )}
    </Formik>
  );
};

export default Login;

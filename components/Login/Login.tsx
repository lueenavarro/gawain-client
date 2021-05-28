import React, { useState } from "react";
import Link from "next/link";
import { Formik } from "formik";

import Button from "components/shared/Button";
import Input from "components/shared/Input/Input";
import { useAuth } from "contexts/auth";

import styles from "./Login.module.scss";

const Login = () => {
  const { login } = useAuth();
  const [wrongCred, setWrongCred] = useState(false);

  return (
    <Formik
      initialValues={{
        email: "",
        password: "",
      }}
      onSubmit={async (user) => {
        setWrongCred(false);
        try {
          await login(user);
        } catch (e) {
          setWrongCred(e.response?.status === 401);
        }
      }}
    >
      {({ values, isSubmitting, handleChange, handleBlur, handleSubmit }) => (
        <form className={styles.login} onSubmit={handleSubmit}>
          <div className={styles["login__wrapper"]}>
            <h3 className={styles["login__title"]}>Login</h3>
            <Input
              name="email"
              type="text"
              placeholder="Email"
              value={values.email}
              onChange={(value) => {
                setWrongCred(false);
                handleChange(value);
              }}
              onBlur={handleBlur}
              error=""
            />
            <Input
              name="password"
              type="password"
              placeholder="Password"
              value={values.password}
              onChange={(e) => {
                setWrongCred(false);
                handleChange(e);
              }}
              onBlur={handleBlur}
              error=""
            />
            <Button type="submit" disabled={isSubmitting}>
              Login
            </Button>
            <Link href="/signup">
              <a>
                <span className={styles["login__link"]}>Create an account</span>
              </a>
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

import Link from "next/link";
import React from "react";
import { Formik } from "formik";
import * as yup from "yup";

import userService from "services/userService";
import { useAuth } from "contexts/auth";

import styles from "./Signup.module.scss";
import Button from "components/Button";

const Signup = () => {
  const { signup } = useAuth();
  const schema = yup.object().shape({
    email: yup
      .string()
      .email("enter a valid email")
      .required("email is required")
      .test("unique", "email is already used", async (value) => {
        try {
          await userService.findUser(value);
          return false;
        } catch (error) {
          return true;
        }
      }),
    password: yup.string().min(8).required("password is required"),
  });

  return (
    <Formik
      initialValues={{
        email: "",
        password: "",
      }}
      validationSchema={schema}
      onSubmit={signup}
    >
      {({
        values,
        errors,
        touched,
        isSubmitting,
        handleBlur,
        handleChange,
        handleSubmit,
      }) => (
        <form className={styles.signup} onSubmit={handleSubmit}>
          <div className={styles["signup__wrapper"]}>
            <h3 className={styles["signup__title"]}>Signup</h3>
            <input
              name="email"
              type="text"
              placeholder="Email"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <div className={styles["signup__errors"]}>
              {errors.email && touched.email && errors.email}
            </div>
            <input
              name="password"
              type="password"
              placeholder="Password"
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <div className={styles["signup__errors"]}>
              {errors.password && touched.password && errors.password}
            </div>
            <Button type="submit" invert={false} disabled={isSubmitting}>
              Signup
            </Button>
            <Link href="/login">
              <a className={styles["signup__link"]}>
                {"<"} I have an account already
              </a>
            </Link>
          </div>
        </form>
      )}
    </Formik>
  );
};

export default Signup;

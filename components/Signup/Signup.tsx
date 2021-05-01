import Link from "next/link";
import React from "react";
import { Formik } from "formik";
import * as yup from "yup";

import userService from "services/userService";

import styles from "./Signup.module.scss";

const Signup = () => {
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

  const handleSubmit = async (user) => {
    const userData = await userService.signup(user);
    console.log(userData);
  };

  return (
    <Formik
      initialValues={{
        email: "",
        password: "",
      }}
      validationSchema={schema}
      onSubmit={handleSubmit}
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
        <form className={styles.signup}>
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
            <button
              type="submit"
              className={styles["signup__button"]}
              disabled={isSubmitting}
            >
              Signup
            </button>
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
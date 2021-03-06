import Link from "next/link";
import React from "react";
import { Formik } from "formik";
import * as yup from "yup";

import Button from "components/shared/Button";
import userService from "services/userService";
import { useAuth } from "contexts/auth";

import styles from "./Signup.module.scss";
import Input from "components/shared/Input/Input";

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
            <Input
              name="email"
              type="text"
              placeholder="Email"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.email && touched.email && errors.email}
            />
            <Input
              name="password"
              type="password"
              placeholder="Password"
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.password && touched.password && errors.password}
            />
            <Button type="submit" disabled={isSubmitting}>
              Signup
            </Button>
            <Link href="/login">
              <a>
                <span  className={styles["signup__link"]}>{"<"} I have an account already</span>
              </a>
            </Link>
          </div>
        </form>
      )}
    </Formik>
  );
};

export default Signup;

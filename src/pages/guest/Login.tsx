import { Card, CardContent, Button, TextField } from "@mui/material";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useStore } from "../../store/rootStore";
import { Navigate } from "react-router-dom";
import { observer } from "mobx-react-lite";

// Define a Yup schema for validation
const schema = yup.object().shape({
  email: yup
    .string()
    .required("This is required")
    .email("This is an invalid email"),
  password: yup
    .string()
    .required("This is required")
    .min(4, "Minimum length should be 4 characters"),
});

const Login = () => {
  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const {
    rootStore: { authStore },
  } = useStore();

  const isAuthenticated = authStore.isAuthenticated;

  if (isAuthenticated) {
    return <Navigate to="/dashboard/customers" />;
  }

  const onSubmit = async (data: any) => {
    try {
      const resData = await authStore.login({
        email: data.email,
        password: data.password,
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#ecf0f3",
      }}
    >
      <Card
        sx={{
          minWidth: 430,
          minHeight: 440,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: "50px",
          backgroundColor: "#ecf0f3",
          boxShadow: "5px 5px 11px #cdd1d3, -5px -5px 11px #ffffff",
        }}
      >
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "16px",
              }}
            >
              <h1>Login</h1>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <TextField
                    fullWidth
                    label="Email"
                    variant="filled"
                    error={!!errors.email}
                    helperText={errors.email ? errors.email.message : ""}
                    {...field}
                  />
                )}
              />
              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <TextField
                    fullWidth
                    label="Password"
                    type="password"
                    variant="filled"
                    error={!!errors.password}
                    helperText={errors.password ? errors.password.message : ""}
                    {...field}
                  />
                )}
              />
              <Button
                sx={{
                  mt: 3,
                  backgroundColor: "#ff5757",
                  "&:hover": {
                    backgroundColor: "#333333",
                  },
                }}
                variant="contained"
                type="submit"
                disabled={isSubmitting}
              >
                Login
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default observer(Login);

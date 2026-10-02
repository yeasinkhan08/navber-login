"use client";

import React from "react";
import {
  Button,
  Description,
  disclosureVariants,
  FieldError,
  FieldGroup,
  Fieldset,
  Form,
  Input,
  Label,
  TextArea,
  TextField,
} from "@heroui/react";
import { signIn, signUp } from "@/lib/auth-client";

const SignUpPage = () => {
  const onSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    console.log(data);

    const { data: resData, error } = await signUp.email({
      name: data.name, // required, The name of the user.
      email: data.email, // required, The email address of the user.
      password: data.password, // required, The password of the user. It should be at least 8 characters long and max 128 by default.
    });
    console.log(resData, error);

    // Convert FormData to plain object

    // alert("Form submitted successfully!");
  };

  const handleGoogleSignIn = async () => {
    const resData = await signIn.social({
      provider: "google",
    });

    console.log(resData);
  };

  return (
    <div className="min-h-screen justify-center items-center">
      sign up please
      <Form className="w-full max-w-96" onSubmit={onSubmit}>
        <Fieldset>
          <FieldGroup>
            <TextField
              isRequired
              name="name"
              validate={(value) => {
                if (value.length < 3) {
                  return "Name must be at least 3 characters";
                }
                return null;
              }}
            >
              <Label>Name</Label>
              <Input placeholder="Your name" />
              <FieldError />
            </TextField>
            <TextField isRequired name="email" type="email">
              <Label>Email</Label>
              <Input placeholder="@example.com" />
              <FieldError />
            </TextField>
            <TextField
              isRequired
              minLength={8}
              name="password"
              type="password"
              validate={(value) => {
                if (value.length < 8) {
                  return "Password must be at least 8 characters";
                }

                if (!/[0-9]/.test(value)) {
                  return "Password must contain at least one number";
                }
                return null;
              }}
            >
              <Label>Password</Label>
              <Input placeholder="Enter your password" />
              <Description>
                Must be at least 8 characters and 1 number
              </Description>
              <FieldError />
            </TextField>
          </FieldGroup>
          <Fieldset.Actions>
            <Button type="submit">
              {/* <FloppyDisk /> */}
              Save changes
            </Button>
            <Button type="reset" variant="secondary">
              Cancel
            </Button>
          </Fieldset.Actions>
        </Fieldset>
      </Form>
      <p>OR</p>
      <button onClick={handleGoogleSignIn}>sign in with google</button>
    </div>
  );
};

export default SignUpPage;

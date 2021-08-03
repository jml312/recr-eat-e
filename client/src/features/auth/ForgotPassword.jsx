import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  useColorModeValue,
  Stack,
} from "@chakra-ui/react";
import Logo from "components/Logo";
import { forgotPassword } from "features/auth/auth.slice";
import { useFormik } from "formik";
import React, { useEffect, useRef } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import MetaTags from "react-meta-tags";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import * as Yup from "yup";

function ForgotPassword({ location: { from } }) {
  const {
    isEmailSent,
    isPasswordReset,
    isAuthenticated,
    isLoading,
    errors: { emailAuth },
  } = useSelector((state) => state.auth);

  const reRef = useRef();
  const dispatch = useDispatch();
  const history = useHistory();

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: Yup.object().shape({
      email: Yup.string().email("Invalid email").required("Required"),
    }),
    onSubmit: async ({ email }) => {
      const token = await reRef.current.executeAsync();
      reRef.current.reset();
      dispatch(forgotPassword({ email, token }));
    },
  });

  // If logged in and user navigates to Login page, should redirect them to home
  useEffect(() => {
    isAuthenticated && history.push(from || "/home");
    (isEmailSent || isPasswordReset) && history.push("/");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, isEmailSent, isPasswordReset]);

  return (
    <>
      <MetaTags>
        <title>Forgot Password | Recr-eat-e</title>
      </MetaTags>

      <Link to="/">
        <Flex
          direction="row"
          justify="center"
          align="center"
          pos="absolute"
          ml={{ md: "0", base: "auto" }}
          mr={{ md: "0", base: "auto" }}
          left={{ md: "5", base: "0" }}
          right={"0"}
          top={{ md: "2%", base: "4%" }}
          style={{
            width: "5rem",
            textAlign: "center",
          }}
        >
          <Logo />
        </Flex>
      </Link>

      <Flex
        minH={"100vh"}
        align={"center"}
        justify={"center"}
        bg={useColorModeValue("gray.50", "gray.800")}
        color="black"
      >
        <ReCAPTCHA
          sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY}
          size="invisible"
          ref={reRef}
          theme="dark"
          badge="bottomleft"
        />
        <Stack
          spacing={8}
          mx={"auto"}
          maxW={"xl"}
          bg={useColorModeValue("gray.50", "gray.800")}
        >
          <Stack align={"center"}>
            <Heading
              fontSize={"4xl"}
              color={useColorModeValue("black", "white")}
            >
              Forgot Password
            </Heading>
          </Stack>
          <Box rounded={"lg"} bg="white" boxShadow={"xl"} p={8}>
            <Stack>
              <form onSubmit={formik.handleSubmit}>
                <FormControl id="email">
                  <FormLabel fontSize={"xl"}>Email address</FormLabel>
                  <Input
                    style={{ textIndent: 4, width: "15rem" }}
                    type="text"
                    placeholder="Your email address"
                    variant="flushed"
                    borderColor="gray"
                    focusBorderColor="black"
                    fontSize={"md"}
                    onChange={formik.handleChange}
                    value={formik.values.email}
                    isRequired
                    isInvalid={
                      (formik.touched.email && formik.errors.email) || emailAuth
                        ? true
                        : false
                    }
                  />
                  {(formik.touched.email && formik.errors.email) ||
                  emailAuth ? (
                    <Alert status="error">
                      <AlertIcon />
                      {formik.errors.email || emailAuth}
                    </Alert>
                  ) : null}
                </FormControl>

                <br />

                <Stack spacing={10}>
                  <Button
                    backgroundColor="black"
                    colorScheme=""
                    color="white"
                    variant={"solid"}
                    type="submit"
                    isLoading={isLoading}
                    loadingText="Loading"
                    spinnerPlacement="start"
                  >
                    Submit
                  </Button>
                </Stack>
              </form>
            </Stack>
          </Box>
        </Stack>
      </Flex>
    </>
  );
}

export default ForgotPassword;

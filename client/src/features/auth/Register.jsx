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
  InputGroup,
  InputRightElement,
  Link,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import Logo from "components/Logo";
import { register } from "features/auth/auth.slice";
import { useFormik } from "formik";
import React, { useEffect, useRef, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import MetaTags from "react-meta-tags";
import { useDispatch, useSelector } from "react-redux";
import { Link as RouterLink, useHistory } from "react-router-dom";
import * as Yup from "yup";
import AvatarRadio from "./helpers/AvatarRadio";

function Register({ location: { from } }) {
  const {
    isEmailSent,
    isPasswordReset,
    isAuthenticated,
    isLoading,
    errors: {
      emailExists,
      usernameExists,
      profaneFirstName,
      profaneLastName,
      profaneUsername,
    },
  } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState("Gordon Ramsay");
  const reRef = useRef();
  const dispatch = useDispatch();
  const history = useHistory();
  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      password: "",
    },
    validationSchema: Yup.object().shape({
      firstName: Yup.string()
        .min(2, "First name should be 3 characters or more")
        .max(7, "First name should be 7 characters or less")
        .matches(/^[a-zA-Z]+$/, "Name should only contain letters")
        .required("Required"),
      lastName: Yup.string()
        .min(2, "Last name should be 3 characters or more")
        .max(7, "Last name should be 7 characters or less")
        .matches(/^[a-zA-Z]+$/, "Name should only contain letters")
        .required("Required"),
      username: Yup.string()
        .min(5, "Username should be 5 characters or more")
        .max(8, "Username should be 8 characters or less")
        .required("Required"),
      email: Yup.string().email("Invalid email").required("Required"),
      password: Yup.string()
        .min(8, "Password should be 8 characters or more")
        .required("Required"),
    }),
    onSubmit: async ({ firstName, lastName, username, email, password }) => {
      const token = await reRef.current.executeAsync();
      reRef.current.reset();
      dispatch(
        register({
          fullName: `${firstName.trim()} ${lastName.trim()}`
            .toLowerCase()
            .split(" ")
            .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
            .join(" "),
          username: username.trim(),
          email: email.trim(),
          password: password.trim(),
          selectedAvatar,
          token,
        })
      );
    },
  });
  useEffect(() => {
    isAuthenticated && history.push(from || "/home");
    (isEmailSent || isPasswordReset) && history.push("/");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, isEmailSent, isPasswordReset]);
  return (
    <>
      <MetaTags>
        <title>Register | Recr-eat-e</title>
      </MetaTags>

      <Box visibility={{ md: "visible", base: "hidden" }}>
        <RouterLink to="/">
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
        </RouterLink>
      </Box>

      <Flex
        minH={"100vh"}
        align={"center"}
        justify={"center"}
        bg={useColorModeValue("gray.50", "gray.800")}
        color="black"
      >
        <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
          <Stack align={"center"}>
            <Heading
              fontSize={"4xl"}
              color={useColorModeValue("black", "white")}
            >
              Register Below
            </Heading>
          </Stack>
          <Box
            rounded={"2xl"}
            boxShadow={"xl"}
            p={8}
            bg={useColorModeValue("white", "gray.50")}
          >
            <Stack spacing={4}>
              <form onSubmit={formik.handleSubmit}>
                <FormControl>
                  <FormLabel mb={7}>Avatar</FormLabel>
                  <AvatarRadio setSelectedAvatar={setSelectedAvatar} />
                </FormControl>

                <br />

                <Flex justify={"space-between"}>
                  <ReCAPTCHA
                    sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY}
                    size="invisible"
                    ref={reRef}
                    theme="dark"
                    badge="bottomleft"
                  />
                  <FormControl id="firstName">
                    <FormLabel>First Name</FormLabel>
                    <Input
                      fontSize={{ sm: "lg", base: "md" }}
                      type="text"
                      placeholder="Your first name"
                      variant="flushed"
                      borderColor="gray"
                      focusBorderColor="black"
                      onChange={formik.handleChange}
                      value={formik.values.firstName}
                      isRequired
                      isInvalid={
                        (formik.touched.firstName && formik.errors.firstName) ||
                        profaneFirstName
                          ? true
                          : false
                      }
                    />
                    {(formik.touched.firstName && formik.errors.firstName) ||
                    profaneFirstName ? (
                      <Alert status="error">
                        <AlertIcon />
                        {formik.errors.firstName || profaneFirstName}
                      </Alert>
                    ) : null}
                  </FormControl>
                  &emsp; &emsp;
                  <FormControl id="lastName">
                    <FormLabel>Last Name</FormLabel>
                    <Input
                      fontSize={{ sm: "lg", base: "md" }}
                      type="text"
                      placeholder="Your last name"
                      variant="flushed"
                      borderColor="gray"
                      focusBorderColor="black"
                      onChange={formik.handleChange}
                      value={formik.values.lastName}
                      isRequired
                      isInvalid={
                        (formik.touched.lastName && formik.errors.lastName) ||
                        profaneLastName
                          ? true
                          : false
                      }
                    />
                    {(formik.touched.lastName && formik.errors.lastName) ||
                    profaneLastName ? (
                      <Alert status="error">
                        <AlertIcon />
                        {formik.errors.lastName || profaneLastName}
                      </Alert>
                    ) : null}
                  </FormControl>
                </Flex>

                <br />

                <FormControl id="username">
                  <FormLabel>Username</FormLabel>
                  <Input
                    type="text"
                    placeholder="Your username"
                    variant="flushed"
                    borderColor="gray"
                    focusBorderColor="black"
                    fontSize={"lg"}
                    onChange={formik.handleChange}
                    value={formik.values.username}
                    isRequired
                    isInvalid={
                      (formik.touched.username && formik.errors.username) ||
                      profaneUsername ||
                      usernameExists
                        ? true
                        : false
                    }
                  />
                  {(formik.touched.username && formik.errors.username) ||
                  profaneUsername ||
                  usernameExists ? (
                    <Alert status="error">
                      <AlertIcon />
                      {formik.errors.username ||
                        profaneUsername ||
                        usernameExists}
                    </Alert>
                  ) : null}
                </FormControl>

                <br />

                <FormControl id="email">
                  <FormLabel colorScheme="blackAlpha">Email address</FormLabel>
                  <Input
                    type="email"
                    placeholder="Your email address"
                    variant="flushed"
                    borderColor="gray"
                    focusBorderColor="black"
                    fontSize={"lg"}
                    onChange={formik.handleChange}
                    value={formik.values.email}
                    isRequired
                    isInvalid={
                      (formik.touched.email && formik.errors.email) ||
                      emailExists
                        ? true
                        : false
                    }
                  />
                  {(formik.touched.email && formik.errors.email) ||
                  emailExists ? (
                    <Alert status="error">
                      <AlertIcon />
                      {formik.errors.email || emailExists}
                    </Alert>
                  ) : null}
                </FormControl>

                <br />

                <FormControl id="password">
                  <FormLabel>Password</FormLabel>
                  <InputGroup>
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Your password"
                      variant="flushed"
                      borderColor="gray"
                      focusBorderColor="black"
                      fontSize={"lg"}
                      onChange={formik.handleChange}
                      value={formik.values.password}
                      isRequired
                      isInvalid={
                        formik.touched.password && formik.errors.password
                          ? true
                          : false
                      }
                    />
                    <InputRightElement width="4.5rem">
                      <Button
                        mb={1}
                        h="1.75rem"
                        fontSize="lg"
                        size="sm"
                        backgroundColor="black"
                        colorScheme=""
                        variant={"solid"}
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <AiOutlineEyeInvisible color="white" />
                        ) : (
                          <AiOutlineEye color="white" />
                        )}
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                  {formik.touched.password && formik.errors.password ? (
                    <Alert status="error">
                      <AlertIcon />
                      {formik.errors.password}
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
                    Register
                  </Button>
                </Stack>
              </form>
              <Stack direction={"row"} align={"center"} justify={"center"}>
                <Text>Have an account?</Text>
                <Link as={RouterLink} fontStyle="italic" to="/" color={"black"}>
                  Login
                </Link>
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </Flex>
    </>
  );
}

export default Register;

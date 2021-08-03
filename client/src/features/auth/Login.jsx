import {
  Alert,
  AlertIcon,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Box,
  Input,
  InputGroup,
  InputRightElement,
  Link,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Stack,
  IconButton,
  Text,
  Tooltip,
  useColorMode,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import Loader from "components/Loading";
import Logo from "components/Logo";
import { googleAuth, login, register } from "features/auth/auth.slice";
import { useFormik } from "formik";
import React, { useEffect, useRef, useState } from "react";
import { GoogleLogin } from "react-google-login";
import ReCAPTCHA from "react-google-recaptcha";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { FaSun, FaMoon } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import MetaTags from "react-meta-tags";
import { useDispatch, useSelector } from "react-redux";
import { Link as RouterLink, useHistory } from "react-router-dom";
import LandingSVG from "svgs/LandingSVG";
import * as Yup from "yup";
import QuestionModal from "./helpers/QuestionModal";

import AvatarRadio from "./helpers/AvatarRadio";

const Login = ({ location: { from } }) => {
  const {
    userExists,
    isAuthenticated,
    isEmailSent,
    isPasswordReset,
    isLoading,
    errors: { emailAuth, passwordAuth, usernameExists, profaneUsername },
  } = useSelector((state) => state.auth);

  const [showPasswordLogin, setShowPasswordLogin] = useState(false);
  // google login
  const [selectedAvatar, setSelectedAvatar] = useState("Gordon Ramsay");
  const [showPasswordRegister, setShowPasswordRegister] = useState(false);
  const [googleData, setGoogleData] = useState({});
  const [googleError, setGoogleError] = useState("");
  const reRef = useRef();

  const toast = useToast();
  const dispatch = useDispatch();
  const history = useHistory();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { colorMode, toggleColorMode } = useColorMode();

  const googleFormik = useFormik({
    initialValues: {
      googleUsername: "",
      googlePassword: "",
    },
    validationSchema: Yup.object().shape({
      googleUsername: Yup.string()
        .min(5, "Username should be 5 characters or more")
        .required("Required"),
      googlePassword: Yup.string()
        .min(8, "Password should be 8 characters or more")
        .required("Required"),
    }),
    onSubmit: async ({ googleUsername, googlePassword }) => {
      const token = await reRef.current.executeAsync();
      reRef.current.reset();
      dispatch(
        register({
          ...googleData,
          username: googleUsername,
          password: googlePassword,
          selectedAvatar,
          token,
        })
      );
    },
  });
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object().shape({
      email: Yup.string().email("Invalid email").required("Required"),
      password: Yup.string()
        .min(8, "Password should be 8 characters or more")
        .required("Required"),
    }),
    onSubmit: async ({ email, password }) => {
      const token = await reRef.current.executeAsync();
      reRef.current.reset();
      dispatch(
        login({ email: email.trim(), password: password.trim(), token })
      );
    },
  });

  useEffect(() => {
    // If logged in and user navigates to Login page, redirects to current page
    if (isAuthenticated) {
      onClose();
      history.push(from || "/home");
    }
    // displays toast if necessary
    if ((isEmailSent || isPasswordReset) && !toast.isActive("info-toast")) {
      toast({
        id: "info-toast",
        title: isEmailSent
          ? "Password reset sent. Check your inbox"
          : "Password reset successfully",
        description: isEmailSent
          ? "Check your inbox"
          : "Login with your new password",
        position: "top-left",
        status: "success",
        isClosable: true,
        duration: 4000,
        variant: "left-accent",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, isEmailSent, isPasswordReset]);
  return isLoading ? (
    <Loader />
  ) : (
    <>
      <MetaTags>
        <title>Login | Recr-eat-e</title>
      </MetaTags>

      <Modal isOpen={isOpen} isCentered>
        <form onSubmit={googleFormik.handleSubmit}>
          <ModalContent>
            <ModalHeader>Choose an avatar</ModalHeader>
            <ModalBody>
              <AvatarRadio setSelectedAvatar={setSelectedAvatar} />
            </ModalBody>
            <ModalHeader>Enter a username</ModalHeader>
            <ModalBody marginBottom={2}>
              <FormControl id="googleUsername" marginTop={-5}>
                <Input
                  type="text"
                  placeholder="Your username"
                  variant="flushed"
                  borderColor="gray"
                  focusBorderColor="black"
                  fontSize={"lg"}
                  onChange={googleFormik.handleChange}
                  value={googleFormik.values.googleUsername}
                  isRequired
                  isInvalid={
                    (googleFormik.touched.googleUsername &&
                      googleFormik.errors.googleUsername) ||
                    profaneUsername ||
                    usernameExists
                      ? true
                      : false
                  }
                />
                {(googleFormik.touched.googleUsername &&
                  googleFormik.errors.googleUsername) ||
                profaneUsername ||
                usernameExists ? (
                  <Alert status="error">
                    <AlertIcon />
                    {googleFormik.errors.googleUsername ||
                      profaneUsername ||
                      usernameExists}
                  </Alert>
                ) : null}
              </FormControl>
            </ModalBody>
            <ModalHeader>Enter a password</ModalHeader>
            <ModalBody>
              <FormControl id="googlePassword" marginTop={-5}>
                <InputGroup>
                  <Input
                    type={showPasswordRegister ? "text" : "password"}
                    placeholder="Your password"
                    variant="flushed"
                    borderColor="gray"
                    focusBorderColor="black"
                    fontSize={"lg"}
                    onChange={googleFormik.handleChange}
                    value={googleFormik.values.googlePassword}
                    isRequired
                    isInvalid={
                      googleFormik.touched.googlePassword &&
                      googleFormik.errors.googlePassword
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
                      style={{ color: "#FFFFFF" }}
                      variant={"solid"}
                      colorScheme=""
                      onClick={() =>
                        setShowPasswordRegister(!showPasswordRegister)
                      }
                    >
                      {showPasswordRegister ? (
                        <AiOutlineEyeInvisible style={{ color: "#FFFFFF" }} />
                      ) : (
                        <AiOutlineEye style={{ color: "#FFFFFF" }} />
                      )}
                    </Button>
                  </InputRightElement>
                </InputGroup>
                {googleFormik.touched.googlePassword &&
                googleFormik.errors.googlePassword ? (
                  <Alert status="error">
                    <AlertIcon />
                    {googleFormik.errors.googlePassword}
                  </Alert>
                ) : null}
              </FormControl>
            </ModalBody>
            <ModalFooter>
              <Button
                colorScheme="blue"
                mr={2}
                type="submit"
                isLoading={isLoading}
                loadingText="Loading"
                spinnerPlacement="start"
              >
                Continue
              </Button>
            </ModalFooter>
          </ModalContent>
        </form>
      </Modal>

      <Flex
        direction="row"
        justify="center"
        align="center"
        pos="absolute"
        ml={{ md: "0", base: "auto" }}
        mr={{ md: "0", base: "auto" }}
        left={{ md: "5", base: "0" }}
        right={"0"}
        style={{
          width: "5rem",
          top: "2%",
          textAlign: "center",
        }}
        visibility={{ base: "hidden", md: "visible" }}
      >
        <Logo />
      </Flex>

      <Stack
        minH={{ md: "100vh", base: "90vh" }}
        direction={{ base: "column", md: "row" }}
      >
        <Flex
          minH={"100vh"}
          p={8}
          flex={1}
          align={"center"}
          justify={"center"}
          direction="column"
        >
          <ReCAPTCHA
            sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY}
            size="invisible"
            ref={reRef}
            theme="dark"
            badge="bottomleft"
          />
          <Stack spacing={4} w={"full"} maxW={"md"}>
            <Heading
              fontSize={{ md: "3xl", base: "2xl" }}
              textAlign="center"
              mt={{ base: "8", md: "0" }}
            >
              Sign in to your account
            </Heading>
            <br />
            <br />
            <form onSubmit={formik.handleSubmit}>
              <FormControl id="email">
                <FormLabel fontSize={"lg"}>Email address</FormLabel>
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
                    (formik.touched.email && formik.errors.email) || emailAuth
                      ? true
                      : false
                  }
                />
                {(formik.touched.email && formik.errors.email) || emailAuth ? (
                  <Alert status="error">
                    <AlertIcon />
                    {formik.errors.email || emailAuth}
                  </Alert>
                ) : null}
              </FormControl>
              <br />
              <FormControl id="password" isInvalid={false}>
                <Flex justify={"space-between"}>
                  <FormLabel fontSize={"lg"}>Password</FormLabel>
                  <Link
                    colorScheme="whiteAlpha"
                    fontStyle="italic"
                    as={RouterLink}
                    to="/forgotpassword"
                  >
                    Forgot Password?
                  </Link>
                </Flex>

                <InputGroup size="md">
                  <Input
                    borderColor="gray"
                    focusBorderColor="black"
                    pr="4.5rem"
                    type={showPasswordLogin ? "text" : "password"}
                    placeholder="Your password"
                    variant="flushed"
                    fontSize={"lg"}
                    isRequired
                    isInvalid={
                      (formik.touched.password && formik.errors.password) ||
                      passwordAuth
                        ? true
                        : false
                    }
                    onChange={formik.handleChange}
                    value={formik.values.password}
                  />
                  <InputRightElement width="4.5rem">
                    <Button
                      mb={1}
                      fontSize="lg"
                      h="1.75rem"
                      size="sm"
                      backgroundColor="black"
                      colorScheme=""
                      variant={"solid"}
                      onClick={() => setShowPasswordLogin(!showPasswordLogin)}
                    >
                      {showPasswordLogin ? (
                        <AiOutlineEyeInvisible color="white" />
                      ) : (
                        <AiOutlineEye color="white" />
                      )}
                    </Button>
                  </InputRightElement>
                </InputGroup>
                {(formik.touched.password && formik.errors.password) ||
                passwordAuth ? (
                  <Alert status="error">
                    <AlertIcon />
                    {formik.errors.password || passwordAuth}
                  </Alert>
                ) : null}
              </FormControl>
              <br />
              <Stack>
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
                  Sign in
                </Button>
              </Stack>
            </form>
            <Stack
              direction={"row"}
              align={"center"}
              justify={"center"}
              fontSize="lg"
            >
              <Text>Don't have an account?</Text>
              <Link as={RouterLink} fontStyle="italic" to="/register">
                Register
              </Link>
            </Stack>

            <Flex justify={"center"} py={3}>
              ─&emsp;<Text>or</Text>&emsp;─
            </Flex>

            <GoogleLogin
              clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
              onSuccess={async ({ profileObj: { name, email } }) => {
                try {
                  const token = await reRef.current.executeAsync();
                  reRef.current.reset();
                  dispatch(googleAuth({ email, token }));
                  setGoogleData({
                    fullName: name
                      .toLowerCase()
                      .split(" ")
                      .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
                      .join(" "),
                    email,
                  });
                  !userExists && onOpen();
                } catch {
                  setTimeout(() => setGoogleError(""), 5000);
                  setGoogleError("Google login failed. Try again later");
                }
              }}
              onFailure={() => {
                setTimeout(() => setGoogleError(""), 5000);
                setGoogleError("Google login failed. Try again later");
              }}
              cookiePolicy="single_host_origin"
              buttonText="Login With Google"
              render={(renderProps) => (
                <Button
                  isLoading={isLoading}
                  loadingText="Loading"
                  spinnerPlacement="start"
                  onClick={renderProps.onClick}
                  backgroundColor="black"
                  variant={"solid"}
                  colorScheme=""
                  color="white"
                >
                  <FcGoogle />
                  &emsp; Sign in with Google
                </Button>
              )}
            />
            {googleError && (
              <Alert status="error">
                <AlertIcon />
                {googleError}
              </Alert>
            )}
            <br />
            <br />
            <br />
            <br />
            <Flex align="center" direction="row" justify="center">
              &emsp;&emsp;
              <Tooltip
                hasArrow
                placement="bottom"
                label={
                  colorMode === "light"
                    ? "Toggle Dark Mode"
                    : "Toggle Light Mode"
                }
              >
                <Box>
                  <IconButton
                    isRound
                    size="2xl"
                    p={2}
                    onClick={toggleColorMode}
                    fontSize="2.5rem"
                    icon={
                      colorMode === "light" ? (
                        <FaSun color="black" />
                      ) : (
                        <FaMoon color="white" />
                      )
                    }
                    colorScheme="twitter"
                    variant="ghost"
                  />
                </Box>
              </Tooltip>
            </Flex>
          </Stack>
        </Flex>
        <Flex
          minH={"100vh"}
          flex={3}
          justify={"center"}
          align={"center"}
          bg="#E1E1E1"
        >
          <LandingSVG />
        </Flex>
      </Stack>

      <QuestionModal colorMode={colorMode} />
    </>
  );
};

export default Login;

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
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  Link,
  AlertDialogContent,
  AlertDialogOverlay,
  useColorModeValue,
  Stack,
} from "@chakra-ui/react";
import { resetPassword } from "features/auth/auth.slice";
import { useFormik } from "formik";
import React, { useEffect, useRef, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import MetaTags from "react-meta-tags";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams, Link as RouterLink } from "react-router-dom";
import * as Yup from "yup";
import Logo from "components/Logo";

function ResetPassword({ location: { from } }) {
  const {
    isPasswordReset,
    isAuthenticated,
    isLoading,
    errors: { invalidToken },
  } = useSelector((state) => state.auth);

  const [showPassword, setShowPassword] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const cancelRef = React.useRef();

  const reRef = useRef();
  const dispatch = useDispatch();
  const history = useHistory();
  const { resetToken } = useParams();

  function equalTo(ref, msg) {
    return Yup.mixed().test({
      name: "equalTo",
      exclusive: false,
      message: msg || "Must match",
      params: {
        reference: ref.path,
      },
      test: function (value) {
        return value === this.resolve(ref);
      },
    });
  }

  Yup.addMethod(Yup.string, "equalTo", equalTo);

  const formik = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object().shape({
      password: Yup.string()
        .min(8, "Password should be 8 characters or more")
        .required("Required"),
      confirmPassword: Yup.string()
        .min(8, "Password should be 8 characters or more")
        .required("Required")
        .equalTo(Yup.ref("password"), "Passwords must match"),
    }),
    onSubmit: async ({ password }) => {
      const token = await reRef.current.executeAsync();
      reRef.current.reset();
      dispatch(resetPassword({ resetToken, password: password.trim(), token }));
    },
  });

  useEffect(() => {
    isAuthenticated && history.push(from || "/home");
    isPasswordReset && history.push("/");
    invalidToken && setIsOpen(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, isPasswordReset, invalidToken]);

  return (
    <>
      <MetaTags>
        <title>Reset Password | Recr-eat-e</title>
      </MetaTags>

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

      {invalidToken && (
        <AlertDialog
          isCentered
          isOpen={isOpen}
          leastDestructiveRef={cancelRef}
          onClose={() => setIsOpen(false)}
        >
          <AlertDialogOverlay>
            <AlertDialogContent
              pt={8}
              fontSize={"xl"}
              fontWeight="bold"
              textAlign={"center"}
              style={{ width: "auto" }}
            >
              <AlertDialogBody>
                Visit the{" "}
                <Link color="blue.300" as={RouterLink} to="/forgotpassword">
                  Forgot Password
                </Link>{" "}
                page to reset your password
              </AlertDialogBody>

              <AlertDialogFooter>
                <Button
                  colorScheme="blue"
                  onClick={() => setIsOpen(false)}
                  ml={3}
                >
                  Ok
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      )}

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
        <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
          <Stack align={"center"}>
            <Heading
              fontSize={"4xl"}
              color={useColorModeValue("black", "white")}
            >
              Reset Password
            </Heading>
          </Stack>
          <Box rounded={"lg"} bg="white" boxShadow={"xl"} p={8}>
            <Stack spacing={4}>
              <form onSubmit={formik.handleSubmit}>
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
                        fontSize="lg"
                        mb={1}
                        h="1.75rem"
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

                <FormControl id="confirmPassword">
                  <FormLabel>Confirm Password</FormLabel>
                  <InputGroup>
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Your password"
                      variant="flushed"
                      borderColor="gray"
                      focusBorderColor="black"
                      fontSize={"lg"}
                      onChange={formik.handleChange}
                      value={formik.values.confirmPassword}
                      isRequired
                      isInvalid={
                        formik.touched.confirmPassword &&
                        formik.errors.confirmPassword
                          ? true
                          : false
                      }
                    />
                    <InputRightElement width="4.5rem">
                      <Button
                        fontSize="lg"
                        mb={1}
                        h="1.75rem"
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
                  {formik.touched.confirmPassword &&
                  formik.errors.confirmPassword ? (
                    <Alert status="error">
                      <AlertIcon />
                      {formik.errors.confirmPassword}
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

export default ResetPassword;

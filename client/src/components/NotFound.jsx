import React from "react";
import MetaTags from "react-meta-tags";
import NotFoundSVG from "svgs/NotFoundSVG";
import { Flex, useColorModeValue, useColorMode } from "@chakra-ui/react";
import Logo from "components/Logo";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

function NotFound() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const { colorMode } = useColorMode();
  return (
    <>
      <MetaTags>
        <title>Not Found | Recr-eat-e</title>
      </MetaTags>
      <Link to={isAuthenticated ? "/home" : "/"}>
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
        >
          <Logo />
        </Flex>
      </Link>
      <Flex
        minH={"100vh"}
        align={"center"}
        justify={"center"}
        color={useColorModeValue("black", "white")}
      >
        <NotFoundSVG colorMode={colorMode} />
      </Flex>
    </>
  );
}

export default NotFound;

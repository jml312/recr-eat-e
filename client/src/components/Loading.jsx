import { Box, Flex, useColorMode, useColorModeValue } from "@chakra-ui/react";
import React from "react";
import MetaTags from "react-meta-tags";
import LoadingSVG from "svgs/LoadingSVG";

const Loader = () => {
  const { colorMode } = useColorMode();

  return (
    <>
      <MetaTags>
        <title>Loading...</title>
      </MetaTags>
      <Flex minH={"100vh"} align={"center"} justify={"center"}>
        <Box
          className="loading"
          fontSize={{ md: "5xl", base: "2xl" }}
          position="absolute"
          style={{ marginBottom: "10rem" }}
          color={useColorModeValue("black", "white")}
        >
          Loading
        </Box>
        <LoadingSVG
          colorMode={colorMode}
          useColorModeValue={useColorModeValue}
        />
      </Flex>
    </>
  );
};

export default Loader;

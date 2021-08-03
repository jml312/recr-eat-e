import React from "react";
import {
  Flex,
  Avatar,
  Text,
  ScaleFade,
  useColorMode,
  useMediaQuery,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

function FollowCard({ selectedAvatar, username }) {
  const user = useSelector((state) => state.auth.user);
  const { colorMode } = useColorMode();
  const [isMobile] = useMediaQuery("(max-width: 375px)");

  return user.username === username ? (
    <ScaleFade initialScale={0.9} in>
      <Flex
        zIndex={-1}
        boxShadow="lg"
        justify="space-evenly"
        align="center"
        w={{ base: "220px", md: "275px" }}
        border="1px"
        borderColor={colorMode === "light" ? "gray.200" : "gray.50"}
        p={3}
        rounded="xl"
      >
        <Avatar
          border="1px"
          borderColor="gray.200"
          size={isMobile ? "md" : "lg"}
          src={`/avatars/${selectedAvatar.replace(/\s+/g, "")}.png`}
        />
        <Text fontWeight={800} as="em" fontSize="xl">
          {username} (me)
        </Text>
      </Flex>
    </ScaleFade>
  ) : (
    <ScaleFade initialScale={0.9} in>
      <Flex
        zIndex={-1}
        boxShadow="lg"
        justify="space-evenly"
        align="center"
        w={{ base: "220px", md: "275px" }}
        border="1px"
        borderColor={colorMode === "light" ? "gray.200" : "gray.50"}
        p={3}
        rounded="xl"
        as={Link}
        to={`/profile/${username}`}
        _hover={{ transform: "scale(1.13)", transition: "0.2s ease" }}
      >
        <Avatar
          border="1px"
          borderColor="gray.200"
          size={isMobile ? "md" : "lg"}
          src={`/avatars/${selectedAvatar.replace(/\s+/g, "")}.png`}
        />
        <Text fontWeight={800} as="em" fontSize="xl">
          {username}
        </Text>
      </Flex>
    </ScaleFade>
  );
}

export default FollowCard;

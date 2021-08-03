import {
  Avatar,
  Box,
  Button, Flex,
  Heading,
  Link,
  Spinner,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useColorMode,
  useMediaQuery,
  useToast,
  VStack
} from "@chakra-ui/react";
import {
  clearToast,
  getUserByUsername,
  handleFollow
} from "features/user/user.slice";
import isEmpty from "is-empty";
import React, { useEffect, useRef, useState } from "react";
import { HiUserAdd, HiUserRemove } from "react-icons/hi";
import MetaTags from "react-meta-tags";
import { useDispatch, useSelector } from "react-redux";
import { Link as RouterLink, useHistory, useParams } from "react-router-dom";
import { timeSince } from "utils/timeSince";
import FollowCard from "./helpers/FollowCard";

function UserProfile() {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { currentUser, didFollow, didUnfollow, isLoading } = useSelector(
    (state) => state.user
  );
  const { fullName, selectedAvatar, date, following, followers, _id } =
    currentUser;
  const [isFollowing, setIsFollowing] = useState(
    followers?.some(({ username }) => username === user.username)
  );
  const followersRef = useRef();
  const [isMobile] = useMediaQuery("(max-width: 375px)");
  const { colorMode } = useColorMode();
  const { username } = useParams();
  const dispatch = useDispatch();
  const history = useHistory();
  const toast = useToast();

  useEffect(() => {
    if (username === user.username) {
      history.push("/home");
    }
    if (isAuthenticated && currentUser?.username !== username) {
      dispatch(getUserByUsername({ username }));
    }
    if (followers) {
      setIsFollowing(
        currentUser.followers.some(({ username }) => username === user.username)
      );
    }
    if (didFollow) {
      followersRef.current.click();
      toast({
        title: `You followed ${username}`,
        position: "bottom-right",
        status: "success",
        isClosable: true,
        duration: 4000,
        variant: "solid",
      });
      dispatch(clearToast());
    }
    if (didUnfollow) {
      toast({
        title: `You unfollowed ${username}`,
        position: "bottom-right",
        status: "success",
        isClosable: true,
        duration: 4000,
        variant: "solid",
      });
      dispatch(clearToast());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser, didFollow, didUnfollow]);

  return (
    <>
      <MetaTags>
        <title>{username}'s profile | Recr-eat-e</title>
      </MetaTags>

      <Flex
        justify="start"
        align="center"
        direction="column"
        ml={{ base: 0, md: 60 }}
        p="4"
        height={{ base: "auto", md: "94vh" }}
        pos={{ base: "relative", md: "" }}
      >
        <Box mt={{ base: "16", md: "0" }}>
          {!isEmpty(currentUser) && (
            <Tabs
              isLazy
              isFitted
              align="center"
              variant="enclosed-colored"
              colorScheme="blue"
              zIndex={100}
              mt={10}
            >
              <TabList color={colorMode === "light" ? "gray.700" : "gray.50"}>
                <Tab fontSize={{ base: "sm", md: "xl" }} zIndex={4}>
                  Account
                </Tab>
                <Tab fontSize={{ base: "sm", md: "xl" }} zIndex={4}>
                  Following
                </Tab>
                <Tab
                  fontSize={{ base: "sm", md: "xl" }}
                  zIndex={4}
                  ref={followersRef}
                >
                  Followers
                </Tab>
              </TabList>

              <Flex
                justify="center"
                align="center"
                direction="column"
                p="4"
                height={{ base: "auto", md: "70vh" }}
              >
                <TabPanels>
                  <TabPanel>
                    <Flex justify="center" align="center" direction="column">
                      <Flex
                        justify="center"
                        align="center"
                        direction="column"
                        mb={8}
                      >
                        <Text
                          fontSize={{ base: "xl", md: "2xl" }}
                          fontWeight={600}
                        >
                          Account created
                        </Text>
                        <Text as="em" fontSize={{ base: "lg", md: "xl" }}>
                          {timeSince(new Date(date))}
                        </Text>
                      </Flex>

                      <Flex
                        justify="center"
                        align="center"
                        direction="column"
                        mb={8}
                      >
                        <Text
                          fontSize={{ base: "xl", md: "2xl" }}
                          fontWeight={600}
                        >
                          Name
                        </Text>
                        <Text as="em" fontSize={{ base: "lg", md: "xl" }}>
                          {fullName}
                        </Text>
                      </Flex>
                      <Flex
                        justify="center"
                        align="center"
                        direction="column"
                        mb={8}
                      >
                        <Text
                          fontSize={{ base: "xl", md: "2xl" }}
                          fontWeight={600}
                        >
                          Username
                        </Text>
                        <Text as="em" fontSize={{ base: "lg", md: "xl" }}>
                          {username}
                        </Text>
                      </Flex>
                      <Flex
                        justify="center"
                        align="center"
                        direction="column"
                        mb={8}
                      >
                        <Text
                          fontSize={{ base: "xl", md: "2xl" }}
                          fontWeight={600}
                        >
                          Avatar
                        </Text>
                        <Avatar
                          border="1px"
                          borderColor="gray.200"
                          size={"lg"}
                          src={`/avatars/${selectedAvatar.replace(
                            /\s+/g,
                            ""
                          )}.png`}
                        />
                      </Flex>
                      <Text
                        mb={6}
                        fontSize={{ base: "xl", md: "2xl" }}
                        fontWeight={600}
                      >
                        See @{username}'s{" "}
                        <Link
                          as={RouterLink}
                          to={`/profile/${username}/recipes`}
                          fontSize={{ base: "xl", md: "2xl" }}
                          fontWeight={600}
                          fontStyle="italic"
                          color="#63b3ed"
                        >
                          recipes
                        </Link>{" "}
                        or{" "}
                        <Link
                          as={RouterLink}
                          to={`/profile/${username}/likes`}
                          fontSize={{ base: "xl", md: "2xl" }}
                          fontWeight={600}
                          fontStyle="italic"
                          color="#63b3ed"
                        >
                          likes
                        </Link>
                      </Text>

                      <Box
                        bg={colorMode === "light" ? "gray.800" : "gray.50"}
                        h="0.5px"
                        w="full"
                      />

                      <Box>
                        {isFollowing ? (
                          <>
                            <Text
                              fontSize={{ base: "xl", md: "2xl" }}
                              mt={4}
                              fontWeight={600}
                            >
                              Your are following {username}
                            </Text>
                            <Button
                              disabled={!following}
                              loadingText="Loading"
                              spinnerPlacement="start"
                              isLoading={isLoading}
                              colorScheme="twitter"
                              size="lg"
                              fontSize="lg"
                              mt={4}
                              leftIcon={
                                <HiUserRemove style={{ fontSize: "1.8rem" }} />
                              }
                              onClick={() => {
                                dispatch(
                                  handleFollow({
                                    following: !isFollowing,
                                    userId: _id,
                                  })
                                );
                                setIsFollowing(false);
                              }}
                            >
                              Unfollow {username}
                            </Button>
                          </>
                        ) : (
                          <>
                            <Text
                              fontSize={{ base: "xl", md: "2xl" }}
                              mt={4}
                              fontWeight={600}
                            >
                              Your are not following {username}
                            </Text>
                            <Button
                              disabled={!following}
                              loadingText="Loading"
                              spinnerPlacement="start"
                              isLoading={isLoading}
                              colorScheme="twitter"
                              size="lg"
                              fontSize="lg"
                              mt={4}
                              leftIcon={
                                <HiUserAdd style={{ fontSize: "1.8rem" }} />
                              }
                              onClick={() => {
                                dispatch(
                                  handleFollow({
                                    following: !isFollowing,
                                    userId: _id,
                                  })
                                );
                                setIsFollowing(true);
                              }}
                            >
                              Follow {username}
                            </Button>
                          </>
                        )}
                      </Box>
                    </Flex>
                  </TabPanel>

                  {/* Following */}

                  <TabPanel>
                    {isEmpty(following) && (
                      <Flex justify="center" align="center" height="60vh">
                        <Heading textAlign="center" size="lg">
                          {username} does not follow anyone
                        </Heading>
                      </Flex>
                    )}
                    {!isMobile && !isEmpty(following) ? (
                      <Box
                        p={7}
                        maxH={{ base: "550px", md: "500px" }}
                        overflowY={{
                          base: following.length > 5 ? "scroll" : "none",
                          md: following.length > 4 ? "scroll" : "none",
                        }}
                      >
                        <VStack spacing={8} align="stretch">
                          {!isEmpty(following) &&
                            following.map((f, i) => (
                              <FollowCard key={i} {...f} />
                            ))}
                        </VStack>
                      </Box>
                    ) : (
                      <VStack spacing={8} align="stretch">
                        {!isEmpty(following) &&
                          following.map((f, i) => (
                            <FollowCard key={i} {...f} />
                          ))}
                      </VStack>
                    )}
                  </TabPanel>

                  {/* Followers */}

                  <TabPanel>
                    {isEmpty(followers) && (
                      <Flex justify="center" align="center" height="60vh">
                        <Heading textAlign="center" size="lg">
                          {username} has no followers
                        </Heading>
                      </Flex>
                    )}
                    {!isEmpty(followers) && (
                      <Box
                        p={7}
                        maxH={{ base: "550px", md: "500px" }}
                        overflowY={{
                          base: followers.length > 5 ? "scroll" : "none",
                          md: followers.length > 4 ? "scroll" : "none",
                        }}
                      >
                        <VStack spacing={8} align="stretch">
                          {!isEmpty(followers) &&
                            followers.map((f, i) => (
                              <FollowCard key={i} {...f} />
                            ))}
                        </VStack>
                      </Box>
                    )}
                  </TabPanel>
                </TabPanels>
              </Flex>
            </Tabs>
          )}
          {isEmpty(currentUser) && isLoading && (
            <Flex justify="center" align="center" height={"70vh"}>
              <Spinner size="xl" />
            </Flex>
          )}
        </Box>
      </Flex>
    </>
  );
}

export default UserProfile;

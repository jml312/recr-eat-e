import {
  Alert,
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  AlertIcon,
  Box,
  Button,
  ButtonGroup,
  Flex,
  Heading,
  Input,
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
  VStack,
} from "@chakra-ui/react";
import Filter from "bad-words";
import { logoutUser, setCurrentUser } from "features/auth/auth.slice";
import AvatarRadio from "features/auth/helpers/AvatarRadio";
import {
  clearToast,
  deleteAccount,
  deleteLikes,
  deleteRecipes,
  getCurrentUser,
  updateAccount,
} from "features/user/user.slice";
import isEmpty from "is-empty";
import jwt_decode from "jwt-decode";
import React, { useEffect, useRef, useState } from "react";
import MetaTags from "react-meta-tags";
import { useDispatch, useSelector } from "react-redux";
import { timeSince } from "utils/timeSince";
import FollowCard from "./helpers/FollowCard";

function MyProfile() {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const {
    currentUser,
    isAccountUpdated,
    isLikesDeleted,
    isRecipesDeleted,
    isAccountDeleted,
    token,
    isLoading,
  } = useSelector((state) => state.user);
  const { colorMode } = useColorMode();
  const [currentUsername, setCurrentUsername] = useState(user.username);
  const [currentAvatar, setCurrentAvatar] = useState(user.selectedAvatar);
  const [usernameError, setUsernameError] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [dialogHeader, setDialogHeader] = useState("");
  const [dialogBody, setDialogBody] = useState("");
  const cancelRef = useRef();
  const dispatch = useDispatch();
  const [isMobile] = useMediaQuery("(max-width: 375px)");
  const toast = useToast();

  useEffect(() => {
    if (isAuthenticated && isEmpty(currentUser)) {
      dispatch(getCurrentUser());
    }

    if (isAccountUpdated) {
      toast({
        title: "Account updated successfully",
        position: "bottom-right",
        status: "success",
        isClosable: true,
        duration: 4000,
        variant: "solid",
      });
      dispatch(clearToast());
      localStorage.token = `Bearer ${token}`;
      const user = jwt_decode(token);
      dispatch(setCurrentUser(user));
    }
    if (isLikesDeleted) {
      toast({
        title: "Likes deleted successfully",
        position: "bottom-right",
        status: "success",
        isClosable: true,
        duration: 4000,
        variant: "solid",
      });
      dispatch(clearToast());
    }
    if (isRecipesDeleted) {
      toast({
        title: "Recipes deleted successfully",
        position: "bottom-right",
        status: "success",
        isClosable: true,
        duration: 4000,
        variant: "solid",
      });
      dispatch(clearToast());
    }
    if (isAccountDeleted) {
      dispatch(logoutUser());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    currentUser,
    isAccountUpdated,
    isLikesDeleted,
    isRecipesDeleted,
    isAccountDeleted,
  ]);

  return (
    <>
      <MetaTags>
        <title>My Profile | Recr-eat-e</title>
      </MetaTags>

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        isCentered
        motionPreset="slideInBottom"
        onClose={() => setIsOpen(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              {dialogHeader}
            </AlertDialogHeader>
            <AlertDialogBody>{dialogBody}</AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button
                colorScheme="red"
                onClick={() => {
                  if (dialogHeader === "Delete Likes") {
                    dispatch(deleteLikes({ userLikes: currentUser.likes }));
                  }
                  if (dialogHeader === "Delete Recipes") {
                    dispatch(deleteRecipes());
                  }
                  if (dialogHeader === "Delete Account") {
                    dispatch(deleteAccount());
                  }
                  setIsOpen(false);
                }}
                ml={3}
              >
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

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
                <Tab fontSize={{ base: "sm", md: "xl" }} zIndex={4}>
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
                          {timeSince(new Date(currentUser.date))}
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
                          {currentUser.fullName}
                        </Text>
                      </Flex>
                      <Flex
                        justify="center"
                        align="center"
                        direction="column"
                        mb={6}
                      >
                        <Text
                          fontSize={{ base: "xl", md: "2xl" }}
                          fontWeight={600}
                          mb={3}
                        >
                          Username
                        </Text>
                        <Input
                          type="text"
                          placeholder="Change username"
                          value={currentUsername}
                          onChange={(e) => setCurrentUsername(e.target.value)}
                        />
                        {usernameError && (
                          <Alert status="error">
                            <AlertIcon />
                            {usernameError}
                          </Alert>
                        )}
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
                          mb={8}
                        >
                          Avatar
                        </Text>
                        <AvatarRadio
                          currentAvatar={currentAvatar}
                          setSelectedAvatar={setCurrentAvatar}
                        />
                      </Flex>
                      <Button
                        colorScheme="telegram"
                        w="full"
                        disabled={
                          user.username === currentUsername &&
                          user.selectedAvatar === currentAvatar
                        }
                        type="submit"
                        isLoading={isLoading}
                        loadingText="Loading"
                        mb={8}
                        onClick={() => {
                          if (currentUsername.length < 5) {
                            setTimeout(() => setUsernameError(""), 3000);
                            return setUsernameError(
                              "Username should be at least 5 characters"
                            );
                          }
                          if (currentUsername.length > 8) {
                            setTimeout(() => setUsernameError(""), 3000);
                            return setUsernameError(
                              "Username should be less than 8 characters"
                            );
                          }
                          if (new Filter().isProfane(currentUsername)) {
                            setTimeout(() => setUsernameError(""), 3000);
                            return setUsernameError("Inappropriate username");
                          }

                          dispatch(
                            updateAccount({
                              username: currentUsername.trim(),
                              selectedAvatar: currentAvatar,
                            })
                          );
                        }}
                      >
                        Update
                      </Button>

                      <Box
                        bg={colorMode === "light" ? "gray.800" : "gray.50"}
                        h="0.5px"
                        w="full"
                      />

                      <Flex
                        mt={8}
                        justify="center"
                        align="center"
                        direction={{ base: "column", md: "row" }}
                      >
                        {!isMobile ? (
                          <ButtonGroup
                            variant="outline"
                            spacing="6"
                            isAttached
                            visibility={{ base: "hidden", md: "visible" }}
                          >
                            <Button
                              colorScheme="red"
                              onClick={() => {
                                setIsOpen(true);
                                setDialogHeader("Delete Likes");
                                setDialogBody(
                                  "Are you sure you want to delete your likes?"
                                );
                              }}
                            >
                              Delete Likes
                            </Button>
                            <Button
                              colorScheme="red"
                              onClick={() => {
                                setIsOpen(true);
                                setDialogHeader("Delete Recipes");
                                setDialogBody(
                                  "Are you sure you want to delete your recipes?"
                                );
                              }}
                            >
                              Delete Recipes
                            </Button>
                            <Button
                              colorScheme="red"
                              onClick={() => {
                                setIsOpen(true);
                                setDialogHeader("Delete Account");
                                setDialogBody(
                                  "Are you sure you want to delete your account?"
                                );
                              }}
                            >
                              Delete Account
                            </Button>
                          </ButtonGroup>
                        ) : (
                          <VStack
                            visibility={{ base: "visible", md: "hidden" }}
                          >
                            <Button
                              colorScheme="red"
                              variant="outline"
                              onClick={() => {
                                setIsOpen(true);
                                setDialogHeader("Delete Likes");
                                setDialogBody(
                                  "Are you sure you want to delete your likes?"
                                );
                              }}
                            >
                              Delete Likes
                            </Button>
                            <Button
                              colorScheme="red"
                              variant="outline"
                              onClick={() => {
                                setIsOpen(true);
                                setDialogHeader("Delete Recipes");
                                setDialogBody(
                                  "Are you sure you want to delete your recipes?"
                                );
                              }}
                            >
                              Delete Recipes
                            </Button>
                            <Button
                              colorScheme="red"
                              variant="outline"
                              onClick={() => {
                                setIsOpen(true);
                                setDialogHeader("Delete Account");
                                setDialogBody(
                                  "Are you sure you want to delete your account?"
                                );
                              }}
                            >
                              Delete Account
                            </Button>
                          </VStack>
                        )}
                      </Flex>
                    </Flex>
                  </TabPanel>

                  {/* Following */}

                  <TabPanel>
                    {isEmpty(currentUser.following) && (
                      <Flex justify="center" align="center" height="60vh">
                        <Heading textAlign="center" size="lg">
                          You do not follow anyone
                        </Heading>
                      </Flex>
                    )}
                    {!isMobile && !isEmpty(currentUser.following) ? (
                      <Box
                        p={7}
                        maxH={{ base: "550px", md: "500px" }}
                        overflowY={{
                          base:
                            currentUser.following.length > 5
                              ? "scroll"
                              : "none",
                          md:
                            currentUser.following.length > 4
                              ? "scroll"
                              : "none",
                        }}
                      >
                        <VStack spacing={8} align="stretch">
                          {!isEmpty(currentUser.following) &&
                            currentUser.following.map((f, i) => (
                              <FollowCard key={i} {...f} />
                            ))}
                        </VStack>
                      </Box>
                    ) : (
                      <VStack spacing={8} align="stretch">
                        {!isEmpty(currentUser.following) &&
                          currentUser.following.map((follower, i) => (
                            <FollowCard key={i} {...follower} />
                          ))}
                      </VStack>
                    )}
                  </TabPanel>

                  {/* Followers */}

                  <TabPanel>
                    {isEmpty(currentUser.followers) && (
                      <Flex justify="center" align="center" height="60vh">
                        <Heading textAlign="center" size="lg">
                          You have no followers
                        </Heading>
                      </Flex>
                    )}
                    {!isEmpty(currentUser.followers) && (
                      <Box
                        p={7}
                        maxH={{ base: "550px", md: "500px" }}
                        overflowY={{
                          base:
                            currentUser.followers.length > 5
                              ? "scroll"
                              : "none",
                          md:
                            currentUser.followers.length > 4
                              ? "scroll"
                              : "none",
                        }}
                      >
                        <VStack spacing={8} align="stretch">
                          {!isEmpty(currentUser.followers) &&
                            currentUser.followers.map((follower, i) => (
                              <FollowCard key={i} {...follower} />
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

export default MyProfile;

import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Badge,
  Box,
  Button,
  Center,
  Divider,
  Flex,
  Heading,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Skeleton,
  SlideFade,
  Stack,
  Tag,
  Text,
  useColorMode,
  Wrap,
  Tooltip,
  WrapItem,
} from "@chakra-ui/react";
import {
  deleteRecipe,
  handleLike,
  setAllRecipes,
  setTop3Recipes,
  setUserLikedRecipes,
  setUserRecipes,
} from "features/recipes/recipes.slice";
import React, { useEffect, useRef, useState } from "react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { BiEdit } from "react-icons/bi";
import { CgProfile } from "react-icons/cg";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { timeSince } from "utils/timeSince";

function RecipeCard({
  _id,
  createdAt,
  cuisine,
  ingredients,
  likeCount,
  isLiked,
  title,
  recipeUsername,
  showProfile,
}) {
  const {
    user: { username },
  } = useSelector((state) => state.auth);
  const {
    isLoading,
    allRecipes,
    userRecipes,
    top3Recipes,
    userLikedRecipes,
    isRecipeDeleted,
    currentRecipe,
  } = useSelector((state) => state.recipes);
  const { colorMode } = useColorMode();
  const [isOpen, setIsOpen] = useState(false);
  const [liked, setLiked] = useState(isLiked);
  const [currentLikeCount, setCurrentLikeCount] = useState(likeCount);
  const cancelRef = useRef();
  const dispatch = useDispatch();
  const history = useHistory();
  const flags = {
    Mexican: "🇲🇽",
    Italian: "🇮🇹",
    American: "🇺🇸",
    Asian: "🇨🇳",
    Indian: "🇮🇳",
    Greek: "🇬🇷",
  };
  useEffect(() => {
    setLiked(isLiked);
    setCurrentLikeCount(likeCount);
    if (isRecipeDeleted) {
      history.push("/my-recipes");
      dispatch(
        setUserRecipes(
          [...userRecipes].filter((recipe) => recipe._id !== currentRecipe._id)
        )
      );
      dispatch(
        setAllRecipes(
          [...allRecipes].filter((recipe) => recipe._id !== currentRecipe._id)
        )
      );
      dispatch(
        setUserLikedRecipes(
          [...userLikedRecipes].filter(
            (recipe) => recipe._id !== currentRecipe._id
          )
        )
      );
      dispatch(
        setTop3Recipes(
          [...top3Recipes].filter((recipe) => recipe._id !== currentRecipe._id)
        )
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRecipeDeleted, likeCount, isLiked]);

  return (
    <>
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
              Delete Recipe
            </AlertDialogHeader>
            <AlertDialogBody>
              Are you sure you want to delete this recipe?
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button
                colorScheme="red"
                onClick={() => {
                  dispatch(deleteRecipe({ _id }));
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

      <Center py={6}>
        <Box
          maxW={"300px"}
          w={"full"}
          bg={colorMode === "light" ? "white" : "gray.900"}
          boxShadow={"2xl"}
          rounded={"lg"}
          p={6}
          textAlign={"center"}
          border="1px"
          borderColor={colorMode === "light" ? "white" : "blue.100"}
        >
          <Skeleton isLoaded={!isLoading} rounded={"lg"}>
            <SlideFade in={!isLoading} offsetY="8px">
              <Heading fontSize={"2xl"} fontFamily={"body"}>
                {title}
              </Heading>
              <Text fontWeight={600} color={"gray.500"} mb={4}>
                @{recipeUsername}
                {recipeUsername === username ? " (you)" : ""}
              </Text>
              <Text
                textAlign={"center"}
                color={colorMode === "light" ? "gray.700" : "gray.400"}
                px={3}
                fontSize="lg"
              >
                {cuisine} {flags[cuisine]}
              </Text>
              <Stack
                align={"center"}
                justify={"center"}
                direction={"row"}
                mt={6}
              >
                <Wrap spacing="15px" justify="center">
                  {ingredients?.map((ingredient, i) => (
                    <WrapItem key={i}>
                      <Center>
                        <Tag
                          variant="solid"
                          color="white"
                          bg="blue.800"
                          px={2}
                          py={1}
                          fontWeight={"600"}
                        >
                          {ingredient}
                        </Tag>
                      </Center>
                    </WrapItem>
                  ))}
                </Wrap>
              </Stack>
              <Stack
                mt={8}
                direction={"row-reverse"}
                align="center"
                justify="center"
                spacing={4}
              >
                {recipeUsername === username ? (
                  <>
                    <Text fontWeight={800} as="em">
                      {currentLikeCount}{" "}
                      {currentLikeCount !== 1 ? "likes" : "like"}
                    </Text>
                    <Box
                      height="25px"
                      bg={colorMode === "light" ? "black" : "white"}
                    >
                      <Divider orientation="vertical" />
                    </Box>
                    <Menu>
                      <MenuButton
                        as={IconButton}
                        icon={<BiEdit />}
                        variant="ghost"
                        size="lg"
                        aria-label="Edit"
                        isRound
                        style={{ fontSize: "2rem" }}
                      />
                      <MenuList>
                        <MenuItem command="✏️" as={Link} to={`/edit/${_id}`}>
                          Edit this recipe
                        </MenuItem>
                        <MenuItem command="❌" onClick={() => setIsOpen(true)}>
                          Delete this recipe
                        </MenuItem>
                      </MenuList>
                    </Menu>
                  </>
                ) : (
                  <>
                    <Flex direction="row" align="center" justify="center">
                      <Tooltip
                        hasArrow
                        placement="bottom"
                        label={`${liked ? "unlike" : "like"} recipe`}
                      >
                        <IconButton
                          variant="ghost"
                          colorScheme="red"
                          size="lg"
                          aria-label="Like"
                          isRound
                          style={{ fontSize: "2rem" }}
                          icon={liked ? <AiFillHeart /> : <AiOutlineHeart />}
                          onClick={function () {
                            setLiked(!liked);
                            const count = liked
                              ? currentLikeCount - 1
                              : currentLikeCount + 1;
                            setCurrentLikeCount(count);
                            dispatch(
                              handleLike({
                                _id,
                                liked: !liked,
                                likeCount: count,
                              })
                            );
                          }}
                        />
                      </Tooltip>
                      <Text fontWeight={800} as="em">
                        {currentLikeCount === 0 ? (
                          "No Likes"
                        ) : (
                          <>
                            {currentLikeCount}{" "}
                            {currentLikeCount > 1 ? "likes" : "like"}
                          </>
                        )}
                      </Text>
                    </Flex>
                    {showProfile && (
                      <>
                        <Box
                          height="25px"
                          bg={colorMode === "light" ? "black" : "white"}
                        >
                          <Divider orientation="vertical" />
                        </Box>
                        <Tooltip
                          hasArrow
                          placement="bottom"
                          label={`${recipeUsername}'s profile`}
                        >
                          <IconButton
                            variant="ghost"
                            colorScheme="gray"
                            size="lg"
                            aria-label="Profile"
                            isRound
                            style={{ fontSize: "2rem" }}
                            icon={<CgProfile />}
                            to={`/profile/${recipeUsername}`}
                            as={Link}
                          />
                        </Tooltip>
                      </>
                    )}
                  </>
                )}
              </Stack>
              <br />
              <Badge variant="outline" colorScheme="gray" p={1} w="auto">
                {timeSince(new Date(createdAt))}
              </Badge>
            </SlideFade>
          </Skeleton>
        </Box>
      </Center>
    </>
  );
}

export default RecipeCard;

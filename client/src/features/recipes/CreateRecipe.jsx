import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  Select,
  SimpleGrid,
  Alert,
  AlertIcon,
  Skeleton,
  Stack,
  Tag,
  TagCloseButton,
  TagLabel,
  Tooltip,
  useColorMode,
} from "@chakra-ui/react";
import { setAllRecipes, createRecipe } from "features/recipes/recipes.slice";
import isEmpty from "is-empty";
import pluralize from "pluralize";
import React, { useEffect, useRef, useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import MetaTags from "react-meta-tags";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import * as Yup from "yup";
import Filter from "bad-words";

function EditRecipe() {
  const cuisineTypes = {
    Mexican: "🇲🇽",
    Italian: "🇮🇹",
    American: "🇺🇸",
    Indian: "🇮🇳",
    Greek: "🇬🇷",
    French: "🇫🇷",
    Spanish: "🇪🇸",
    Thai: "🇹🇭",
    Vietnamese: "🇻🇳",
    Japanese: "🇯🇵",
    Korean: "🇰🇷",
    Chinese: "🇨🇳",
    Russian: "🇷🇺",
  };
  const {
    isRecipeCreated,
    allRecipes,
    currentRecipe,
    isLoading,
    errors: { titleExists },
  } = useSelector((state) => state.recipes);
  const [title, setTitle] = useState("");
  const [selectedCuisine, setSelectedCuisine] = useState("");
  const [ingredientTags, setIngredientTags] = useState([]);
  const [ingredient, setIngredient] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [titleError, setTitleError] = useState("");
  const [ingredientError, setIngredientError] = useState("");
  const ingredientRef = useRef();

  const dispatch = useDispatch();
  const { colorMode } = useColorMode();
  const history = useHistory();
  let filter = new Filter();

  useEffect(() => {
    if (isRecipeCreated) {
      history.push("/my-recipes");
      dispatch(setAllRecipes([...allRecipes, currentRecipe]));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRecipeCreated, currentRecipe]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (ingredientTags.length < 3) {
      setIngredientError("List at least three ingredients");
    }
    if (ingredientTags.length > 8) {
      setIngredientError("8 ingredients max");
    }
    if (filter.isProfane(title)) {
      return setTitleError("Inappropriate recipe title");
    }
    if (titleExists) {
      setTitleError("Recipe title already exists");
    }
    setTitleError("");
    const RecipeSchema = Yup.object().shape({
      title: Yup.string()
        .min(4, "Title should be 4 characters or more")
        .max(16, "Title should be 16 characters or less")
        .matches(
          /^([a-zA-Z]+\s)*[a-zA-Z]+$/,
          "Title should only contain letters"
        )
        .required("Required"),
      ingredients: Yup.array()
        .of(
          Yup.string()
            .min(3, "Ingredients should be 3 characters or more")
            .max(15, "Ingredients should be 15 characters or less")
            .required("Required")
        )
        .min(3, "List at least three ingredients")
        .required("Required"),
    });
    try {
      await RecipeSchema.validateSync(
        {
          title,
          ingredients: ingredientTags,
        },
        { abortEarly: false }
      );
      dispatch(
        createRecipe({
          title: title
            .trim()
            .toLowerCase()
            .split(" ")
            .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
            .join(" "),
          cuisine: selectedCuisine,
          ingredients: ingredientTags,
        })
      );
    } catch (e) {
      e.inner.forEach(({ errors, path }) => {
        if (path === "title") {
          setTitleError(errors[0]);
        }
      });
    }
  };

  return (
    <>
      <MetaTags>
        <title>Create Recipe | Recr-eat-e</title>
      </MetaTags>
      <Flex
        justify="center"
        align="center"
        direction="column"
        ml={{ base: 0, md: 60 }}
        p="4"
        height={{ base: "100vh", md: "94vh" }}
      >
        <Box
          rounded={"lg"}
          bg={colorMode === "light" ? "white" : "gray.900"}
          border="1px"
          borderColor={colorMode === "light" ? "white" : "blue.100"}
          boxShadow={"xl"}
          p={8}
        >
          <Skeleton isLoaded={!isLoading} rounded={"lg"}>
            <form onSubmit={handleSubmit}>
              <FormControl>
                <FormLabel fontSize={"lg"}>Recipe Title</FormLabel>
                <Input
                  type="text"
                  value={title}
                  placeholder="Title"
                  variant="outline"
                  borderColor="gray"
                  focusBorderColor={colorMode === "light" ? "black" : "white"}
                  fontSize={"lg"}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    setTitleError("");
                  }}
                  isRequired
                  isInvalid={titleError}
                />
                {titleError ? (
                  <Alert status="error">
                    <AlertIcon />
                    {titleError}
                  </Alert>
                ) : null}
              </FormControl>
              <br />
              <FormControl>
                <FormLabel fontSize={"lg"}>Recipe Cuisine</FormLabel>
                <Select
                  placeholder="Select a cuisine"
                  borderColor="gray"
                  focusBorderColor={colorMode === "light" ? "black" : "white"}
                  fontSize={"lg"}
                  isRequired
                  onChange={(e) => {
                    setSelectedCuisine(e.target.value);
                  }}
                  value={selectedCuisine}
                >
                  {Object.keys(cuisineTypes).map((cuisine, i) => (
                    <option key={i} value={cuisine}>
                      {cuisine} {cuisineTypes[cuisine]}
                    </option>
                  ))}
                </Select>
              </FormControl>
              <br />
              <FormControl w="full">
                <FormControl>
                  <FormLabel fontSize={"lg"}>
                    Recipe Ingredients (3 - 8)
                  </FormLabel>
                  <Flex w="full">
                    <Flex direction="column">
                      <Input
                        type="text"
                        placeholder="Ingredient"
                        variant="outline"
                        borderColor="gray"
                        isDisabled={ingredientTags.length === 8}
                        focusBorderColor={
                          colorMode === "light" ? "black" : "white"
                        }
                        fontSize={{ base: "md", md: "lg" }}
                        ref={ingredientRef}
                        onChange={(e) => setIngredient(e.target.value)}
                        value={ingredient}
                        isInvalid={ingredientError}
                      />
                      {ingredientError ? (
                        <Alert status="error">
                          <AlertIcon />
                          {ingredientError}
                        </Alert>
                      ) : null}
                    </Flex>
                    &emsp;
                    <FormControl w="40">
                      <Select
                        borderColor="gray"
                        focusBorderColor={
                          colorMode === "light" ? "black" : "white"
                        }
                        fontSize={"lg"}
                        isDisabled={ingredientTags.length === 8}
                        onChange={(e) => setQuantity(e.target.value)}
                        value={quantity}
                      >
                        {[...Array(12).keys()].map((number, i) => (
                          <option key={i} value={number + 1}>
                            {number + 1}
                          </option>
                        ))}
                      </Select>
                    </FormControl>
                    &emsp;
                    <Tooltip label="Add">
                      <IconButton
                        fontSize={"xl"}
                        colorScheme="twitter"
                        isDisabled={ingredientTags.length === 8}
                        aria-label="Add ingredient"
                        icon={<AiOutlinePlus />}
                        onClick={() => {
                          let newTag =
                            quantity === 1
                              ? ingredient
                              : pluralize(
                                  ingredient,
                                  quantity === 1 ? 1 : quantity,
                                  true
                                );
                          newTag = newTag.toLocaleLowerCase();
                          if (ingredientTags.includes(newTag)) {
                            return setIngredientError(
                              `${newTag} has already  been added`
                            );
                          }
                          if (filter.isProfane(newTag)) {
                            return setIngredientError(
                              "Inappropriate ingredient name"
                            );
                          }
                          const length = [...newTag].length;
                          if (length < 3) {
                            return setIngredientError(
                              "Ingredients should be 3 characters or more"
                            );
                          }
                          if (length > 15) {
                            return setIngredientError(
                              "Ingredients should be 15 characters or less"
                            );
                          }
                          setIngredientTags([...ingredientTags, newTag]);
                          setIngredient("");
                          setQuantity(1);
                          setIngredientError("");
                          ingredientTags.length <= 8 &&
                            ingredientRef.current.focus();
                        }}
                      >
                        Add
                      </IconButton>
                    </Tooltip>
                  </Flex>
                </FormControl>
              </FormControl>
              {!isEmpty(ingredientTags) && <br />}
              <Flex justify="center" align="center" w="full">
                <SimpleGrid
                  spacingY={1}
                  columns={{
                    base: 2,
                    md: ingredientTags.length < 4 ? ingredientTags.length : 4,
                  }}
                >
                  {ingredientTags.map((tag, i) => (
                    <Flex justify="center" align="center" key={i}>
                      <Tag
                        size={"lg"}
                        colorScheme="gray"
                        variant="solid"
                        color="white"
                        bg="blue.800"
                        fontWeight={"600"}
                      >
                        <TagLabel>{tag}</TagLabel>
                        <TagCloseButton
                          fontSize="xl"
                          onClick={(e) => {
                            const val =
                              e.target.parentElement.parentNode.parentNode
                                .innerText;
                            const newIngredientTags = ingredientTags.filter(
                              (tag) => tag !== val
                            );
                            setIngredientTags(newIngredientTags);
                          }}
                        />
                      </Tag>
                    </Flex>
                  ))}
                </SimpleGrid>
              </Flex>
              <br />
              <Stack>
                <Button
                  colorScheme="twitter"
                  fontWeight={800}
                  variant={"solid"}
                  type="submit"
                  isLoading={isLoading}
                  loadingText="Loading"
                  spinnerPlacement="start"
                >
                  Create
                </Button>
              </Stack>
            </form>
          </Skeleton>
        </Box>
      </Flex>
    </>
  );
}

export default EditRecipe;

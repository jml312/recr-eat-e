import { ArrowLeftIcon, ArrowRightIcon } from "@chakra-ui/icons";
import {
  Box,
  Flex,
  Heading,
  IconButton,
  SimpleGrid,
  Spacer,
  Spinner,
  useColorMode,
  useToast,
} from "@chakra-ui/react";
import {
  Container,
  Next,
  PageGroup,
  Paginator,
  Previous,
  usePaginator,
} from "chakra-paginator";
import RecipeCard from "features/recipes/helpers/RecipeCard";
import { clearToast, getUserRecipes } from "features/recipes/recipes.slice";
import isEmpty from "is-empty";
import React, { useEffect, useState } from "react";
import MetaTags from "react-meta-tags";
import { useDispatch, useSelector } from "react-redux";

function MyRecipes() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const {
    userRecipes,
    isLoading,
    isRecipeCreated,
    isRecipeUpdated,
    isRecipeDeleted,
  } = useSelector((state) => state.recipes);
  const [pageRecipes, setPageRecipes] = useState(userRecipes);
  const dispatch = useDispatch();
  const toast = useToast();
  const { colorMode } = useColorMode();

  const { pagesQuantity, currentPage, setCurrentPage, pageSize } = usePaginator(
    {
      total: userRecipes?.length,
      initialState: {
        pageSize: 6,
        currentPage: 1,
      },
    }
  );

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getUserRecipes());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!isEmpty(userRecipes)) {
      setPageRecipes(
        userRecipes.slice((currentPage - 1) * pageSize, currentPage * pageSize)
      );
    }
    if (isRecipeCreated) {
      toast({
        title: "Recipe created successfully",
        position: "bottom-right",
        status: "success",
        isClosable: true,
        duration: 4000,
        variant: "solid",
      });
    }
    if (isRecipeUpdated) {
      toast({
        title: "Recipe updated successfully",
        position: "bottom-right",
        status: "success",
        isClosable: true,
        duration: 4000,
        variant: "solid",
      });
    }
    if (isRecipeDeleted) {
      toast({
        title: "Recipe deleted successfully",
        position: "bottom-right",
        status: "success",
        isClosable: true,
        duration: 4000,
        variant: "solid",
      });
    }
    dispatch(clearToast());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRecipeDeleted, currentPage, pageSize, userRecipes]);

  return (
    <>
      <MetaTags>
        <title>My Recipes | Recr-eat-e</title>
      </MetaTags>
      <Flex
        justify="center"
        align="center"
        direction="column"
        ml={{ base: 0, md: 60 }}
        p="4"
        height={{
          base: isEmpty(pageRecipes) || pageRecipes.length === 1 ? "94vh" : "",
          md: "94vh",
        }}
      >
        <Spacer />
        <Box mt={{ base: "16", md: "0" }}>
          <SimpleGrid
            columns={{
              base: "1",
              sm: pageRecipes.length > 2 ? "2" : pageRecipes.length,
              md: pageRecipes.length > 3 ? "3" : pageRecipes.length,
              lg: pageRecipes.length > 3 ? "3" : pageRecipes.length,
            }}
            spacing={10}
            spacingY={1}
          >
            {pageRecipes?.map((recipe) => (
              <RecipeCard
                {...recipe}
                showProfile={true}
                key={recipe._id}
                recipeUsername={recipe.username}
              />
            ))}
          </SimpleGrid>
          {isEmpty(pageRecipes) && isLoading && <Spinner size="xl" />}
          {isEmpty(pageRecipes) &&
            isEmpty(userRecipes.length) &&
            !isLoading && (
              <Heading textAlign="center">
                You haven't created any recipes yet...
              </Heading>
            )}
        </Box>
        <Spacer />
        {!isEmpty(pageRecipes) && !isLoading && (
          <Paginator
            innerLimit={2}
            outerLimit={2}
            activeStyles={{
              w: 7,
              p: 3,
              fontWeight: "900",
              fontSize: "md",
              bg: colorMode === "light" ? "gray.100" : "gray.800",
              color: "blue.300",
              border: "2px",
              borderColor: "blue.300",
            }}
            currentPage={currentPage}
            normalStyles={{
              w: 7,
              p: 3,
              fontWeight: "normal",
              fontSize: "md",
              bg: colorMode === "light" ? "gray.100" : "gray.800",
              border: "1px",
              borderColor: colorMode === "light" ? "gray.400" : "gray",
            }}
            separatorStyles={{
              w: 7,
              p: 3,
              fontWeight: "900",
              fontSize: "md",
              bg: colorMode === "light" ? "gray.100" : "gray.800",
              color: "blue.300",
              border: "1px",
              borderColor: "blue.300",
            }}
            pagesQuantity={pagesQuantity}
            onPageChange={(nextPage) => setCurrentPage(nextPage)}
          >
            <Container align="center" justify="center" w="full" mb={8}>
              <Previous
                as={IconButton}
                icon={<ArrowLeftIcon />}
                variant="ghost"
                colorScheme="gray"
                mr={2}
              />
              <PageGroup isInline align="center" />
              <Next
                as={IconButton}
                icon={<ArrowRightIcon />}
                variant="ghost"
                colorScheme="gray"
                ml={2}
              />
            </Container>
          </Paginator>
        )}
      </Flex>
    </>
  );
}

export default MyRecipes;

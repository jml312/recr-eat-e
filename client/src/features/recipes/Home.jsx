import { ArrowLeftIcon, ArrowRightIcon } from "@chakra-ui/icons";
import {
  Box,
  Flex,
  IconButton,
  SimpleGrid,
  Spacer,
  useColorModeValue,
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
import { getAllRecipes } from "features/recipes/recipes.slice";
import isEmpty from "is-empty";
import React, { useEffect, useState } from "react";
import MetaTags from "react-meta-tags";
import { useDispatch, useSelector } from "react-redux";

function Home() {
  const {
    isAuthenticated,
    user: { username },
  } = useSelector((state) => state.auth);
  const { allRecipes } = useSelector((state) => state.recipes);
  const [pageRecipes, setPageRecipes] = useState(allRecipes);
  const dispatch = useDispatch();

  const { pagesQuantity, currentPage, setCurrentPage, pageSize } = usePaginator(
    {
      total: allRecipes?.length,
      initialState: {
        pageSize: 6,
        currentPage: 1,
      },
    }
  );

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getAllRecipes());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!isEmpty(allRecipes)) {
      setPageRecipes(
        allRecipes.slice((currentPage - 1) * pageSize, currentPage * pageSize)
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, pageSize, allRecipes]);

  return (
    <>
      <MetaTags>
        <title>Home | Recr-eat-e</title>
      </MetaTags>
      <Flex
        // pos="relative"
        justify="center"
        align="center"
        direction="column"
        ml={{ base: 0, md: 60 }}
        p="4"
        height={{ base: "", md: "94vh" }}
      >
        <Spacer />
        <Box mt={{ base: "16", md: "0" }}>
          <SimpleGrid
            columns={{
              base: 1,
              sm: pageRecipes.length > 2 ? "2" : pageRecipes.length,
              md: pageRecipes.length > 3 ? "3" : pageRecipes.length,
              lg: pageRecipes.length > 3 ? "3" : pageRecipes.length,
            }}
            spacing={10}
            spacingY={1}
          >
            {!isEmpty(pageRecipes) &&
              pageRecipes.map((recipe, i) =>
                recipe.likedBy ? (
                  <RecipeCard
                    {...recipe}
                    key={i}
                    showProfile={true}
                    recipeUsername={recipe.username}
                    isLiked={recipe.likedBy.some(
                      (_username) => _username === username
                    )}
                  />
                ) : (
                  <RecipeCard
                    {...recipe}
                    key={i}
                    showProfile={true}
                    recipeUsername={recipe.username}
                  />
                )
              )}
          </SimpleGrid>
        </Box>
        <Spacer />
        <Paginator
          innerLimit={2}
          outerLimit={2}
          activeStyles={{
            w: 7,
            p: 3,
            fontWeight: "900",
            fontSize: "md",
            bg: useColorModeValue("gray.100", "gray.800"),
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
            bg: useColorModeValue("gray.100", "gray.800"),
            border: "1px",
            borderColor: useColorModeValue("gray.400", "gray"),
          }}
          separatorStyles={{
            w: 7,
            p: 3,
            fontWeight: "900",
            fontSize: "md",
            bg: useColorModeValue("gray.100", "gray.800"),
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
        {/* <Box
          //  pos="absolute" bottom="12" left="0"
          // alignSelf="start"
          // justifySelf="center"
        >
          <Select>
            <option value="">1</option>
            <option value="">2</option>
            <option value="">3</option>
          </Select>
        </Box> */}
      </Flex>
    </>
  );
}

export default Home;

import { Box, Flex, SimpleGrid } from "@chakra-ui/react";
import RecipeCard from "features/recipes/helpers/RecipeCard";
import { getTop3Recipes } from "features/recipes/recipes.slice";
import isEmpty from "is-empty";
import React, { useEffect } from "react";
import MetaTags from "react-meta-tags";
import { useDispatch, useSelector } from "react-redux";

function Top3Recipes() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const { top3Recipes } = useSelector((state) => state.recipes);
  const dispatch = useDispatch();

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getTop3Recipes());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <MetaTags>
        <title>Top 3 | Recr-eat-e</title>
      </MetaTags>
      <Flex
        justify="center"
        align="center"
        direction="column"
        ml={{ base: 0, md: 60 }}
        p="4"
        height={{ base: "", md: "94vh" }}
      >
        <Box mt={{ base: "20", md: "0" }}>
          <SimpleGrid
            columns={{ base: "1", md: "3" }}
            spacing={10}
            spacingY={1}
          >
            {!isEmpty(top3Recipes) &&
              top3Recipes.map((recipe, i) => (
                <RecipeCard
                  {...recipe}
                  key={i}
                  showProfile={true}
                  recipeUsername={recipe.username}
                />
              ))}
          </SimpleGrid>
        </Box>
      </Flex>
    </>
  );
}

export default Top3Recipes;

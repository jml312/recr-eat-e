export const getPageHeading = (pathname) => {
  const [_, pname, ending, r] = pathname.split("/");
  switch (pname) {
    case "home":
      return "Home";
    case "top-3":
      return "Top 3";
    case "my-likes":
      return "My Likes";
    case "my-recipes":
      return "My Recipes";
    case "create":
      return "Create a Recipe";
    case "edit":
      return "Edit your Recipe";
    case "profile":
      return ending === "me"
        ? "My Profile"
        : `${ending.charAt(0).toUpperCase()}${ending.slice(1)}'s ${
            r ? (r === "likes" ? "Likes" : "Recipes") : "Profile"
          }`;
  }
};

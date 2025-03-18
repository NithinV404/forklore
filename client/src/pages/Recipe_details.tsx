import "../pages/Recipe_details.css";
import { useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import HeaderBack from "../components/Header_back";
import RecipeDetailsPane from "../components/Recipe_details_pane";

export default function RecipeDetails() {
  const location = useLocation();
  const { id } = useParams();

  useEffect(() => {
    window.scrollTo(0, location.state?.scrollPosition || 0);
  }, [location.state?.scrollPosition]);

  return (
    <>
      <HeaderBack />
      <RecipeDetailsPane id={id || ""} />
    </>
  );
}

import Back from "../assets/SVG/Back";
import { useNavigate } from "react-router-dom";
import header_back_style from "./Header_back.module.css";

export default function HeaderBack() {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <header className={header_back_style.header}>
      <div onClick={handleBack} className={header_back_style.circle}>
        <Back className={header_back_style.back_icon} />
      </div>
    </header>
  );
}

import icon_back from "../assets/icon-back.svg";
import { useLocation, useNavigate } from "react-router-dom";
import header_back_style from "./header_back.module.css";

export default function HeaderBack() {
    const navigate = useNavigate();
    const location = useLocation();

    const handleback = () => {
        location.state ? navigate(location.state.from) : navigate("/");
    }

    return (
        <header>
            <div onClick={handleback} className={header_back_style.circle}>
                <img
                    src={icon_back}
                    alt="back"
                    className={header_back_style.back_icon} />
            </div>
        </header>
    )
}
import icon_back from "../assets/icon-back.svg";
import { useLocation, useNavigate } from "react-router-dom";
import header_back_style from "./Header_back.module.css";

export default function HeaderBack() {
    const navigate = useNavigate();
    const location = useLocation();

    const handleBack = () => {
        if (location.state) {
            navigate(location.state.from);
        } else {
            navigate("/");
        }
    }

    return (
        <header className={header_back_style.header}>
            <div onClick={handleBack} className={header_back_style.circle}>
                <img
                    src={icon_back}
                    alt="back"
                    className={header_back_style.back_icon} />
            </div>
        </header>
    )
}
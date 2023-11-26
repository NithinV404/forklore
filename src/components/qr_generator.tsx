import QRCode from 'react-qr-code'
import { useParams } from 'react-router-dom'
import data from '../recipe/recipes.json'
export default function Qrgenerator() {
    var { id } = useParams();
    var recipe = data.filter(recipe=>recipe.id==Number(id))[0];
    return(
        <>
        <QRCode value={JSON.stringify(recipe)}> </QRCode>
        </>
    )
}
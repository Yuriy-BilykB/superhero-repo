import {useParams} from "react-router-dom";
import DetailsSuperheroComponent from "../components/DetailsSuperheroComponent.tsx";
const DetailsSuperheroPage = () => {
    const {id} = useParams<{id: string}>();
    if (!id) return <p>Invalid superhero ID</p>;
    return (
        <div>
            <DetailsSuperheroComponent id={id}/>
        </div>
    );
};
export default DetailsSuperheroPage;
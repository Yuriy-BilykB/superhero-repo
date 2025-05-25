import EditSuperheroForm from "../components/EditSuperheroComponent.tsx";
import { useParams } from "react-router-dom";

const EditSuperheroPage = () => {
    const { id } = useParams<{ id: string }>();
    if (!id) return <p>Invalid superhero ID</p>;
    return (
        <div className="max-w-3xl mx-auto p-6">
            <EditSuperheroForm id={id} />
        </div>
    );
};
export default EditSuperheroPage;

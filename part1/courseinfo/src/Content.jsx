import Part from "./Part";

export default function Content({ parts }) {
    return (
        <>
            <Part desc={parts.parts[0].name} count={parts.parts[0].exercises} />
            <Part desc={parts.parts[1].name} count={parts.parts[1].exercises} />
            <Part desc={parts.parts[2].name} count={parts.parts[2].exercises} />
        </>
    )
}
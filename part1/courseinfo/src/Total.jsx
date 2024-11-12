export default function Total({ parts }) {
    return (
        <p>Number of exercises {parts.parts[0].exercises + parts.parts[1].exercises + parts.parts[2].exercises}</p>
    )
}
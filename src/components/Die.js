import React from "react"

// Die component representing a single die
export default function Die(props) {
    // Style for the die based on whether it is held
    const styles = {
        backgroundColor: props.isHeld ? "#59E391" : "white"
    }

    return(
        <div className="die" style={styles} onClick={()=>props.holdDice(props.id)}>
            <h2 className="die-num">{props.value}</h2>
        </div>
    )
}
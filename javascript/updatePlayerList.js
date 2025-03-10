// Function to update the player list in the waiting room view
async function updatePlayerList() {
    try {
        const response = await fetch('/players');
        if(!response) {
            throw new Error('Kunne ikke finde spillere');
        }
        const players = await response.json();

        const playerListContainer = document.getElementById("playerList");
        playerListContainer.innerHTML = '';  // Clear existing list

        const colors = ["one", "two", "three", "four", "five", "six"];
        // Loop through the players and display them
        players.forEach((player, index) => {
            const playerElement = document.createElement("p");
            playerElement.textContent = player;
            playerElement.classList.add(colors[index % colors.length]);
            playerListContainer.appendChild(playerElement);
        });
    } catch(error) {
        console.error('Fejl ved at finde spillere', error);
    }
}
module.exports = {
	name: 'ready',
	once: true,
	execute(client) {
        // When the client is ready, run this code (only once)
		console.log(`${client.user.tag} is now online!`);
        client.user.setActivity('you...', {
            type: 'WATCHING'
        })
		
		require("../verify")(client);
	},
};

